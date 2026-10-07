import { describe, expect, test } from "@rstest/core";
import { PLUGIN_UUID } from "../src/domain/constants";
import { getInfo, getSettingsBundle } from "../src/index";

describe("info and settings contract", () => {
  test("test_getInfo_returns_plugin_metadata", async () => {
    const info = await getInfo();
    expect(info).toMatchObject({
      name: "EH ��վ����",
      uuid: PLUGIN_UUID,
      npmName: "breeze-plugin-ehentai-mirror",
    });
    expect(info.uuid).not.toBe("dba2a6cf-c495-4416-accf-c29263ab4016");
    expect(info.function.map((item) => item.id)).toEqual([
      "latest",
      "popular",
      "ranking",
      "favorites",
    ]);
  });

  test("test_getSettingsBundle_returns_valid_bundle", async () => {
    const canonical = await getSettingsBundle();

    expect(canonical.scheme.type).toBe("settings");
    expect(canonical.data.values).toMatchObject({
      site: "MIRROR",
      ipb_member_id: "",
      ipb_pass_hash: "",
      igneous: "",
    });
  });
});
