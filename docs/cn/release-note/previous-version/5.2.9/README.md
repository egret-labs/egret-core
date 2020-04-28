# 白鹭引擎 5.2.9 发布日志


---


白鹭引擎在 2018年5月25日 正式发布了 5.2 稳定版本。在 2018年9月10日，我们将发布 5.2.9 稳定版本。本次版本是 5.2 版本的一次集中性缺陷修复


## 2D 渲染 - JavaScript 

* 修复皮肤设置 null 会报错问题（感谢开发者 ヤ.ヘ夜）
* 修复 Canvas 模式下使用 Graphics 作为遮罩并旋转导致渲染错误问题（感谢开发者 shun）
* 修复 Wing 中编辑皮肤可能导致异常报错问题（感谢开发者 潇潇）
* 修复 Runtime 渲染模式设置为 Canvas 模式会报错问题，强制使用 WebGL 模式渲染
* 修复发光滤镜在某些情况下渲染异常问题

## 命令行

* 修复 default.thm.json 在 debug 和 release 模式不一致问题（感谢开发者 qinhanlei）
* 修复 manifest.json 文件排序不固定问题（感谢开发者 qinhanlei）
* 修复 linux 下执行 egret run 报错问题（感谢开发者 itbeihe）
* 修改默认项目脚本，使打包原生支持调试和发布模式

## AssetsManager

* 梳理 API 文档，可通过 EgretLauncher 查看最新文档
* 增加设置兼容模式接口，使用老 res 模块升级的项目可以设置兼容模式更好的适配
* 增加 RES.typeSelector 使 RES.getResByUrl 和之前保持一致
* 修复加载第二个配置文件可能加载不到问题（感谢 红豆互动 研发团队）
* 修复添加资源组时，资源组列表为空导致报错问题（感谢开发者 WebRelDesigner）

## 微信小游戏支持库

微信小游戏支持库请通过 Egret Launcher 将您的项目发布一次微信小游戏的方式进行更新，版本号 1.1.8

* 增加 FPS 面板，面板的开启与样式在每次发布从 index.html 同步
* 修改默认项目模板，非 assetsmanager 模块的项目不开启文件缓存功能