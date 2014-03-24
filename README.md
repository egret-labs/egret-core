Egret : 跨平台游戏引擎
================================================



简介
-------------------

Egret Framework是一款使用JavaScript(TypeScript)编写的HTML5开源免费游戏框架。Egret Framework的核心定位是开放，高效，优雅。基于它，你可以快速轻松地构建属于自己的HTML5移动游戏。


支持平台
--------------------
#### PC
* Chrome
* Safari
* FireFox
* IE9

#### Mobile
* iOS Safari
* Android 4.0 Chrome
* Android 2.3+ 内置浏览器
* Android 2.3+ UC浏览器、百度浏览器、腾讯浏览器
* App 微信WebView，百度轻应用

> 以上内容为Egret当前版本的核心支持内容，其他浏览器暂不保证兼容性


如何构建
-------------------------
配置环境参见 [如何配置egret开发环境](https://github.com/egret-team/egret/wiki)

配置编译脚本的依赖库
```
${egret_root}/tools/nodejs/npm install async
${egret_root}/tools/nodejs/npm install crc32
```

编译代码
```
node ${egret_root}/tools/nodejs/build_typescript.js
```