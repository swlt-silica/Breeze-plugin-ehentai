import fs from "node:fs";

// Run only after the release assets have been published successfully.
const source = fs.readFileSync("src/domain/constants.ts", "utf8");
const version = source.match(/export const PLUGIN_VERSION = "([^"]+)";/)?.[1];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error("Invalid PLUGIN_VERSION");
}
const tag = `v${version}`;
const assetName = "breeze-plugin-ehentai-mirror.bundle.cjs";
const base = "https://github.com/swlt-silica/Breeze-plugin-ehentai";
const manifest = {
  tag_name: tag,
  name: tag,
  assets: [{ name: assetName, browser_download_url: `${base}/releases/download/${tag}/${assetName}` }],
};
fs.writeFileSync("update.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
