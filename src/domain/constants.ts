export const PLUGIN_SOURCE = "ehentai-mirror";
export const PLUGIN_UUID = "802f67a9-1e21-4208-80a0-3b72079ecf5b";
export const PLUGIN_NAME = "EH 里站镜像";
export const PLUGIN_DESCRIPTION = "EH 里站镜像插件，可与原版 e-hentai 共存";
export const PLUGIN_VERSION = "0.0.51";
export const PLUGIN_ICON_URL = "";
export const PLUGIN_HOME = "https://github.com/swlt-silica/Breeze-plugin-ehentai";
export const PLUGIN_UPDATE_URL =
  "https://api.github.com/repos/swlt-silica/Breeze-plugin-ehentai/releases/latest";
export const PLUGIN_CREATOR = {
  name: "swlt-silica",
  describe: "",
};

export const EH_BASE_URL = "https://e-hentai.org";
export const EX_BASE_URL = "https://exhentai.org";
export const MIRROR_BASE_URL = "https://ex.4545810.xyz";
export const DEFERRED_IMAGE_PATH = "/_breeze/read-image";
export const PREVIEW_IMAGE_PATH = "/_breeze/preview-image";
export const PREVIEW_IMAGE_KIND = "ehentai-preview-native-v1";
export const EH_FORUM_LOGIN_URL = "https://forums.e-hentai.org/index.php?act=Login";
export const EH_FORUM_LOGIN_REDIRECT_URL = "https://forums.e-hentai.org/index.php?";
export const EH_COOKIE_POLL_INTERVAL_MS = 500000;
export const EH_FORUM_COOKIE_CONFIG_KEY = "forumCookie";
export const EH_MEMBER_ID_CONFIG_KEY = "ipb_member_id";
export const EH_PASS_HASH_CONFIG_KEY = "ipb_pass_hash";
export const EH_IGNEOUS_CONFIG_KEY = "igneous";

export const DEFAULT_TIMEOUT_MS = 12_000;
export const MAX_RETRY_ATTEMPTS = 2;
export const MAX_CONCURRENT_REQUESTS = 4;

export const ALLOWED_ENDPOINT_HOSTS = new Set([
  new URL(MIRROR_BASE_URL).hostname,
  "e-hentai.org",
  "exhentai.org",
  "api.e-hentai.org",
  "ehgt.org",
]);

export const ALLOWED_MEDIA_HOSTS = new Set([
  new URL(MIRROR_BASE_URL).hostname,
  "e-hentai.org",
  "exhentai.org",
  "s.exhentai.org",
  "ehgt.org",
]);

export const DEFAULT_SETTINGS = {
  site: "MIRROR",
  imageProxyEnabled: false,
  ipb_member_id: "",
  ipb_pass_hash: "",
  igneous: "",
  forumCookie: "",
} as const;

export const FALLBACK_UNKNOWN = "Unknown";
