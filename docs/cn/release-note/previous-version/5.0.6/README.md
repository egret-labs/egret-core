白鹭引擎 5.0.6 发布日志
===============================

最近更新时间：2017年8月21日


欢迎您使用白鹭引擎

## 概述

白鹭引擎包含了白鹭时代研发的遵循HTML5标准的游戏引擎。他包括 2D / 3D 渲染核心、GUI体系、音频管理、资源管理等游戏引擎的常用模块。

通过使用白鹭引擎，开发者可以尽可能的不用关注浏览器的底层实现，解决HTML5游戏性能问题及碎片化问题，灵活地满足开发者开发2D或3D游戏的需求。

## 更新内容

* 命令行
    * 新增 exmlRoot 支持配置字符串数组
    * 修复发布项目时没能从正确的 web 模板拷贝入口文件的bug

* 2D 渲染 - JavaScript
    * 修复 ByteArray.readBytes 后 position 没有变化的bug
    * 修复 ByteArray.decodeUTF8 出现乱码的bug
    * 修复 eui.Scroller 来回拖动导致 TouchEvent 内存泄漏问题

* 2D 渲染 - WebAssembly
    * 修复 wing 无法预览皮肤问题
    * 修复 BitmapText 的 text 属性设置数字异常问题
    * 修复 cacheAsBitmap 后坐标异常问题

## 已知问题

* 开发者如果使用 WebAssembly 渲染，目前会在类的静态变量声明处创建对象时报错