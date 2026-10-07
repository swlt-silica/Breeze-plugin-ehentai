import { describe, expect, rs, test } from "@rstest/core";
import { MIRROR_BASE_URL } from "../src/domain/constants";
import {
  buildDetailEndpoint,
  buildSearchEndpoint,
  buildSearchNavigationEndpoint,
} from "../src/network/endpoints";
import { httpClient } from "../src/network/client";
import { toImagePageHref } from "../src/parsers/reader.parser";
import { buildRequestConfig, readSettings } from "../src/services/settings.service";
import {
  buildNonSearchSiteAttempts,
  remapGalleryHostForSite,
} from "../src/services/site-routing.service";
import { ensureAllowedHostUrl, ensureAllowedMediaUrl } from "../src/utils/url";

describe("mirror routing", () => {
  test("routes search, pagination and details to the mirror", () => {
    expect(new URL(buildSearchEndpoint("test", 2, "MIRROR")).origin).toBe(MIRROR_BASE_URL);
    expect(buildDetailEndpoint("123/abc", "MIRROR")).toBe(`${MIRROR_BASE_URL}/g/123/abc/`);
    expect(buildSearchNavigationEndpoint("https://exhentai.org/?next=123", "MIRROR")).toBe(
      `${MIRROR_BASE_URL}/?next=123`,
    );
    expect(remapGalleryHostForSite("https://e-hentai.org/s/abc/123-1", "MIRROR")).toBe(
      `${MIRROR_BASE_URL}/s/abc/123-1`,
    );
    expect(ensureAllowedHostUrl(`${MIRROR_BASE_URL}/g/123/abc/`)).toContain(MIRROR_BASE_URL);
    expect(ensureAllowedMediaUrl(`${MIRROR_BASE_URL}/image.jpg`)).toContain(MIRROR_BASE_URL);
  });

  test("uses the mirror directly without official cookies or access probes", async () => {
    const probe = rs.spyOn(httpClient, "getTextWithMeta");
    try {
      const settings = await readSettings({
        site: "MIRROR",
        forumCookie: "ipb_member_id=1; ipb_pass_hash=secret",
      });
      expect(buildRequestConfig(settings)).toBeUndefined();
      expect(buildNonSearchSiteAttempts(settings)).toEqual([
        { site: "MIRROR", requestConfig: undefined },
      ]);
      expect(probe).not.toHaveBeenCalled();
    } finally {
      probe.mockRestore();
    }
  });

  test("converts mirror MPV links into reading page links", () => {
    expect(
      toImagePageHref(
        { index: 0, href: `${MIRROR_BASE_URL}/mpv/123/abc/`, originImageHash: "abcdefghij123" },
        2,
      ),
    ).toBe(`${MIRROR_BASE_URL}/s/abcdefghij/123-2`);
  });
});
