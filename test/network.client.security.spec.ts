import { describe, expect, test } from "@rstest/core";
import { buildSafeRequestConfig } from "../src/network/client";

describe("network client redirect security", () => {
  test("mirror requests carry the language required to avoid the landing-page redirect", () => {
    const config = buildSafeRequestConfig({ url: "https://ex.4545810.xyz/?f_search=test" });
    expect(config.headers).toMatchObject({ "Accept-Language": "zh-CN,zh;q=0.9" });
    expect(config.headers).not.toHaveProperty("Cookie");
    expect(config.maxRedirects).toBe(0);
    expect(buildSafeRequestConfig({ url: "https://e-hentai.org/" }).headers).toBeUndefined();
    expect(
      buildSafeRequestConfig({ url: "https://ex.4545810.xyz.attacker.test/" }).headers,
    ).toBeUndefined();
  });

  test("test_buildSafeRequestConfig_no_input_sets_max_redirects_zero", () => {
    const config = buildSafeRequestConfig();
    expect(config.maxRedirects).toBe(0);
  });

  test("test_buildSafeRequestConfig_redirect_override_forced_to_zero", () => {
    const config = buildSafeRequestConfig({
      headers: { "x-test": "1" },
      maxRedirects: 10,
      timeout: 2000,
    });

    expect(config.maxRedirects).toBe(0);
    expect(config.timeout).toBe(2000);
    expect(config.headers).toMatchObject({ "x-test": "1" });
  });
});
