# 白鹭引擎 5.2.4 发布日志


---


白鹭引擎在 2018年5月25日 正式发布了 5.2 稳定版本。在 2018年7月2日，我们将发布 5.2.4 稳定版本。本次版本是 5.2 版本的一次集中性缺陷修复


## 2D 渲染 - JavaScript 

* 修复对 graphics 设置 cacheAsBitmap 后绘制异常问题（感谢开发者 陪笑）
* 修复 RenderTexture 设置缩放后绘制异常问题（感谢开发者 陪笑）
* 修复 eui.List 不在舞台导致滑动报错问题（感谢开发者 pilihou）
* 修复 WebGLTexture 创建失败导致报错问题（感谢开发者 pilihou）
* 修复输入文本可能报错问题（感谢开发者 pilihou）
* 修复 cacheAsBitmap 和滤镜一起使用绘制异常问题（感谢开发者 陪笑）
* 修复原生显示列表 textWidth 和 textHeight 计算异常问题

## 命令行

* 减少 commonjs2 模式编译内存消耗
* 修复 commonjs2 模式皮肤状态bug

## AssetsManager

* 修复 SheetProcessor 会触发两次加载图片问题（感谢开发者 谢志风）
* 修复报错异常问题（感谢开发者 lzq9476）
* 修复 getResAsync 和 getResByUrl 不派发 ITEM_LOAD_ERROR 事件问题（感谢开发者 ヤ.ヘ夜）

## 微信小游戏支持库

微信小游戏支持库请通过 Egret Launcher 将您的项目发布一次微信小游戏的方式进行更新，版本号 1.1.3

* 增加进入后台和回到前台事件
* 修复 iOS10.1 系统下文字渲染异常问题（感谢 传奇来了 研发团队）