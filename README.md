# EH 里站镜像（Breeze 独立插件）

名称、UUID 和更新来源独立，可与原版 e-hentai 插件同时安装。

网络安装地址：

```text
https://github.com/swlt-silica/Breeze-plugin-ehentai/releases/latest/download/breeze-plugin-ehentai-mirror.bundle.cjs
```

默认使用 https://ex.4545810.xyz/ 。镜像请求不发送官方站点的登录 Cookie。

旧版镜像沿用了原插件身份；安装此独立版本后，可从官方插件商店更新或重新安装原版 e-hentai。原插件已有数据不会自动迁移到新的镜像插件。

---

# Breeze EH 镜像版

基于 [deretame/Breeze-plugin-ehentai](https://github.com/deretame/Breeze-plugin-ehentai)。默认使用 `https://ex.4545810.xyz/`，设置中保留官方表站和里站选项。

镜像模式不发送官方账号 Cookie，也不检查官方里站权限。已有安装保留的站点设置需要手动切换到「里站镜像」。收藏等账号功能取决于镜像本身的支持，不能同步官方账号收藏。

更新检查使用本 Fork 的 GitHub Releases。手动运行 Actions 中的 Manual Release 可生成 `.bundle.cjs` 和 `.bundle.cjs.br` 安装包，不发布到 npm。

开发：`pnpm install --frozen-lockfile`，运行 `init.js` 初始化标签数据库后，执行 `pnpm verify`。
