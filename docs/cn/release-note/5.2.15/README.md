## 2D 渲染 - JavaScript 

* 修复在 IE11 上加载资源时，加载进程会被卡住的问题
* HttpRequest 增加对 `timeout` 属性的支持


## AssetsManager
* 在 AssetsManager 中，`RES.getResByUrl` 方法必须在 `loadConfig` 之后调用。如果在此之前调用，程序会报错中止运行。现在优化体验，改为提示报错信息，但程序还可以继续运行。


## 微信小游戏 v1.1.10
* 当适配模式为平台不支持的 `showAll` 时，自动替换为 `fixedWidth` 模式


## 百度小游戏 v0.1.4
* 当适配模式为平台不支持的 `showAll` 时，自动替换为 `fixedWidth` 模式
