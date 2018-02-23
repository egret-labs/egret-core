白鹭引擎 5.0.15 发布日志
===============================

最近更新时间：2018年2月23日


欢迎您使用白鹭引擎

## 概述

白鹭引擎包含了白鹭时代研发的遵循HTML5标准的游戏引擎。他包括 2D / 3D 渲染核心、GUI体系、音频管理、资源管理等游戏引擎的常用模块。

通过使用白鹭引擎，开发者可以尽可能的不用关注浏览器的底层实现，解决HTML5游戏性能问题及碎片化问题，灵活地满足开发者开发2D或3D游戏的需求。

本版本为官方推荐稳定版本。本次更新的大部分内容均为解决开发者反馈的 BUG 。

## 更新内容

* 2D 渲染 - JavaScript
    * 新增 egret.warn 和 egret.error 信息可以显示到微端调试面板
    * 修复 eui.Rect 在 WebGL 渲染模式下存在内存泄漏问题
    * 修复 eui.Group 的 sacle 为 0 的时候，随便点击哪里都是点击成功问题（感谢开发者 qiwucwb）
    * 修复设置 BitmapText 的 text 或 font 属性为空时，textWidth 和 textHeight 没有重置问题（感谢开发者 vacuum-c）
    * 修复 CustomFilter padding 属性为 0 时取不到 textureWidth 和 textureHeight 问题（感谢开发者 wangyh）
    * 修复 WebGL 环境下 getPixels 不准确问题
    * 修复 egret.MainContext.deviceType 和 egret.MainContext.runtimeType 异常问题（感谢 闪吧研发）
    * 修复鼠标在外部松开后回到 Stage上 时，不能派发 releaseOutSide 事件问题（感谢开发者 eos3tion）
    * 修复 Graphics 对象设置滤镜不显示问题（感谢开发者 xesxfs）
    * 修复 eui.BitmapLabel 重复设置 font 因为异步加载会导致字体错乱问题（感谢开发者 lava-hammer）
    * 修复 egret.ByteArray.readBytes 函数会导致 bytesAvailable 异常问题（感谢开发者 efei731）
    * 修复 eui 虚拟布局可能创建过多对象问题（感谢开发者 IT学思想）
    * 修复音频停止后没有清空注册的事件，可能会导致报错问题（感谢 要玩研发）
    * 修复游戏 div 设置 display 属性为 none 后，resize出现异常问题（感谢开发者 Raykid）

## 已知问题

* 开发者如果使用 WebAssembly 渲染，目前会在类的静态变量声明处创建对象时报错