# 白鹭引擎 5.1.6 发布日志


---


白鹭引擎在 2017年 12 月份正式发布了 5.1 版本。在 2018年3月12日，我们将发布 5.1.6 版本。本次版本是 5.1 版本的一次功能更新和集中性缺陷修复，主要目标是添加新的 iOS / Android App 打包支持，以及完善微信小游戏、QQ玩一玩、AssetsManager 的稳定性。


## iOS / Android 原生打包

在这次更新发布的 Egret Launcher 中，我们在发布设置中整合了 iOS 与 Android 平台的发布设置。



白鹭引擎自 2014年底发布的 2.0 版本便已经支持开发者将游戏打包为 iOS / Android App 发布到原生平台中，除此之外，2017年我们又推出了微端解决方案。在这次更新中，我们将 iOS / Android Support 的底层内核切换为了微端内核，并添加了新的 NativeRenderer 机制，大幅提升了打包后的 App 的渲染性能。


之所以会有如此重大的提升，这是因为在之前的 iOS / Android Support 中，原生内核虽然提供了优化后的 HTML5 Canvas2D / WebGL 渲染接口，但是核心渲染驱动仍然是由 JavaScript 逻辑执行的，在新推出的 NativeRenderer 中，渲染驱动逻辑从 JavaScript 端迁移到了 Native C++ 端，这样做会大幅降低 JavaScript 引擎的负担，特别是在所有的 iOS 设备以及低端 Android 设备中表现极其明显。


需要注意的是，由于在 iOS / Android 上的渲染驱动迁移到了 Native 端，开发者不再能够通过 Hack 引擎的 JavaScript 代码的方式去修改打包后的渲染行为。这相当于我们牺牲了一定的灵活性换来了更高的性能，如果开发者希望保留这些灵活性，您也可以强制关闭 NativeRenderer ，仍然使用之前机制。



## 2D 渲染 - JavaScript 

* 修复设置一次虚线后，后续所有绘制均为虚线的 BUG ( 感谢开发者 gaokun ）
* 修复 DragonBones Mesh 渲染旋转在特定情况下的渲染BUG （ 感谢《猪来了》研发团队）

## AssetsManager

* 现在您可以为不同的资源配置文件设置不同的资源加载根路径，通过与 ResSplitPlugin 插件配合，可以用于更方便的解决微信小游戏的 4M 资源包限制问题。


## 微信小游戏

* 添加 canvas2d 模式渲染支持，以解决部分设备在微信小游戏中使用 webgl 模式渲染错误的问题
* 修复特定情况下，在真机上资源加载失败的 BUG 


## QQ 玩一玩

* 修复了BitmapText字体位置偏移的问题。
* 增加了底层背景，在启动项中增加了背景颜色的设置。
* 修复了DisplayObject scrollRect无效的问题。
* 修复了EUI scroller显示错误的问题。


