# 白鹭引擎 5.1.11 发布日志


---


白鹭引擎在 2017年 12 月份正式发布了 5.1 版本。在 2018年5月7日，我们将发布 5.1.11 版本。本次版本是 5.1 版本的一次集中性缺陷修复。



## 2D 渲染 - JavaScript 

* 修复 MovieClip.play 有脏数据没清空问题（感谢开发者 邬小鹏）
* 修复使用遮罩可能渲染异常问题（感谢开发者 eos3tion）
* 修复 BitmapText 设置文本没有检查传入参数的类型问题（感谢开发者 CaiBinQing）

## 命令行
* 新增 eui 皮肤 commonjs2 模式，大幅减少皮肤文件体积
* 修复 linux 系统使用命令行报错问题（感谢开发者 joesonw）

## AssetsManager
* 修复 SheetProcessor 没有处理九宫格问题（感谢开发者 陈祖涵）
* 修复 SheetProcessor 没有释放纹理问题（感谢红豆互动）

## 微信小游戏支持库

微信小游戏支持库请通过 Egret Launcher 将您的项目发布一次微信小游戏的方式进行更新，版本号 1.0.15

* 修复音频可能播放不出来问题
* 修复 Texture.saveToFile 报错问题
* 修复 HttpRequest 在真机环境加载失败不派发事件问题
* 修复安卓真机上加载一张图片后卸载然后第二次加载会导致无法正确派发事件的问题

## Facebook Instant Games SDK
升级 SDK 到6.2版本