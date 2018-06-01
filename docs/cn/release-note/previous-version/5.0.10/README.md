白鹭引擎 5.0.10 发布日志
===============================

最近更新时间：2017年10月23日


欢迎您使用白鹭引擎

## 概述

白鹭引擎包含了白鹭时代研发的遵循HTML5标准的游戏引擎。他包括 2D / 3D 渲染核心、GUI体系、音频管理、资源管理等游戏引擎的常用模块。

通过使用白鹭引擎，开发者可以尽可能的不用关注浏览器的底层实现，解决HTML5游戏性能问题及碎片化问题，灵活地满足开发者开发2D或3D游戏的需求。

## 更新内容

* 2D 渲染 - JavaScript
    * 取消在 PC 上 canvasScaleFactor 默认是2的设置
    * 修复 Tween.removeAllTweens 后内部计数器没有重置的bug (感谢论坛开发者 derek6616)
    * 修复投影和发光滤镜同时使用导致发光滤镜异常问题 (感谢论坛开发者 zyy)
    * 重构 canvasScaleFactor 实现机制，不再创建过大的 canvas
    * 入口文件引入 calculateCanvasScaleFactor 函数，开发者可以自行计算 canvasScaleFactor

* DragonBones - JavaScript
    * 修复贴图单独缩放和全局缩放的错位的错误
    * 修复一处数组遍历可能导致扩展数组报错的错误 (感谢论坛开发者 gepan)
    * 修复 mesh 矩形区域可能没有正确更新的错误 (感谢 游心乐动 开发者)
    * 修复共享贴图同名可能造成动画显示不正确的错误

## 已知问题

* 开发者如果使用 WebAssembly 渲染，目前会在类的静态变量声明处创建对象时报错

## canvasScaleFactor机制重构
canvasScaleFactor 是用于解决图片和字体发虚所引入的机制，它底层实现的原理是创建更大的画布去绘制。之前版本的引擎在有些机型上会因为这个属性创建过大的 canvas 导致卡顿，本次更新后引擎默认创建的canvas不会超过设备的分辨率。

同时我们还在模板index.html文件的runEgret方法中加入了calculateCanvasScaleFactor方法，开发者可以根据不同需求去更改缩放策略：

```
egret.runEgret({
    renderMode: "webgl", audioType: 0,
    calculateCanvasScaleFactor: function (context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
});
```

## Tween.removeAllTweens
Tween 内部在添加及删除时，都会有内部变量去标记一个对象有多少个 Tween 在同时生效。Tween.removeAllTweens 方法中应该将该变量置为0，然而之前版本并没有正确的设置这个，这可能会导致很多问题的产生。本次更新中我们把这个问题修复了。

## 发光投影滤镜兼容问题
发光和投影滤镜使用的 Shader 是同一个，投影滤镜相比发光滤镜会多几个参数。之前版本的引擎使用滤镜后并没有重置这些参数，这导致在使用投影滤镜之后有一些脏数据没有被清除，之后再使用发光滤镜就会渲染异常了。本次更新我们清除了使用滤镜后造成的脏数据。