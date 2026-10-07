import { DEFERRED_IMAGE_PATH } from "../domain/constants";
import type { FetchImageBytesPayload, PluginSettings } from "../domain/types";
import { contractError, PluginError } from "../errors/plugin-error";
import { httpClient } from "../network/client";
import { buildImagePageEndpoint } from "../network/endpoints";
import {
  extractReloadKeyFromImagePage,
  isRetryableImagePageHtml,
  parseImagePage,
} from "../parsers/reader.parser";
import { parseDeferredImageUrl } from "../utils/deferred-image";
import { requiredString } from "../utils/guards";
import { ensureAllowedHostUrl, ensureAllowedMediaUrl } from "../utils/url";
import { isPreviewPlaceholderUrl, readPreviewNativeBufferId } from "../utils/preview-image";
import { requireNative } from "../utils/native";
import {
  buildNonSearchSiteAttempts,
  remapGalleryHostForSite,
  type RequestConfig,
} from "./site-routing.service";

async function resolveImageUrlFromImagePage(
  imagePageHref: string,
  requestConfig: RequestConfig,
  reloadKeyOverride?: string,
) {
  const safeImagePageHref = ensureAllowedHostUrl(imagePageHref);
  const imagePageHtml = requestConfig
    ? await httpClient.getText(buildImagePageEndpoint(safeImagePageHref, reloadKeyOverride), requestConfig)
    : await httpClient.getText(buildImagePageEndpoint(safeImagePageHref, reloadKeyOverride));

  try {
    const parsed = parseImagePage(safeImagePageHref, imagePageHtml);
    return { ...parsed, imageUrl: ensureAllowedMediaUrl(parsed.imageUrl) };
  } catch (error) {
    if (error instanceof PluginError && error.code === "UPSTREAM_BLOCKED") {
      throw error;
    }

    const reloadKey = extractReloadKeyFromImagePage(imagePageHtml);
    if (!reloadKey || !isRetryableImagePageHtml(imagePageHtml)) {
      throw error;
    }

    const retriedHtml = requestConfig
      ? await httpClient.getText(
          buildImagePageEndpoint(safeImagePageHref, reloadKey),
          requestConfig,
        )
      : await httpClient.getText(buildImagePageEndpoint(safeImagePageHref, reloadKey));
    const retried = parseImagePage(safeImagePageHref, retriedHtml);
    return { ...retried, imageUrl: ensureAllowedMediaUrl(retried.imageUrl) };
  }
}

function readDeferredImagePageHref(
  payload: FetchImageBytesPayload,
  rawUrl: string,
): string | undefined {
  const extern = payload.extern ?? {};
  const externHref = String(extern.href ?? "").trim();
  if (externHref) {
    return ensureAllowedHostUrl(externHref);
  }

  const deferred = parseDeferredImageUrl(rawUrl);
  if (deferred) {
    return deferred.imagePageHref;
  }

  return undefined;
}

function isDeferredPlaceholderUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.pathname === DEFERRED_IMAGE_PATH;
  } catch {
    return false;
  }
}

export async function fetchImageBytesService(
  payload: FetchImageBytesPayload,
  settings: PluginSettings,
) {
  const rawUrl = requiredString(payload.url, "url");
  const previewNativeBufferId = readPreviewNativeBufferId(payload.extern);
  if (previewNativeBufferId != null) {
    return await requireNative().take(previewNativeBufferId);
  }
  if (isPreviewPlaceholderUrl(rawUrl)) {
    throw contractError("missing preview native buffer", {
      url: rawUrl,
      extern: payload.extern ?? {},
    });
  }
  const deferredImagePageHref = readDeferredImagePageHref(payload, rawUrl);
  const attempts = buildNonSearchSiteAttempts(settings, payload.extern);

  if (!deferredImagePageHref && isDeferredPlaceholderUrl(rawUrl)) {
    throw contractError("missing deferred image page href", {
      url: rawUrl,
      extern: payload.extern ?? {},
    });
  }

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const imagePageHref = deferredImagePageHref
        ? remapGalleryHostForSite(deferredImagePageHref, attempt.site)
        : undefined;
      const mediaUrl = remapGalleryHostForSite(rawUrl, attempt.site);

      const resolved = imagePageHref
        ? await resolveImageUrlFromImagePage(imagePageHref, attempt.requestConfig)
        : { imageUrl: ensureAllowedMediaUrl(mediaUrl), reloadKey: undefined };
      const download = (url: string) =>
        attempt.requestConfig
          ? httpClient.getBytes(url, payload.timeoutMs, attempt.requestConfig)
          : httpClient.getBytes(url, payload.timeoutMs);
      try {
        return await download(resolved.imageUrl);
      } catch (error) {
        if (
          !(error instanceof PluginError) ||
          error.code !== "NETWORK_ERROR" ||
          !imagePageHref ||
          !resolved.reloadKey
        ) {
          throw error;
        }
        const alternate = await resolveImageUrlFromImagePage(
          imagePageHref,
          attempt.requestConfig,
          resolved.reloadKey,
        );
        return await download(alternate.imageUrl);
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? contractError("failed to fetch image bytes");
}
