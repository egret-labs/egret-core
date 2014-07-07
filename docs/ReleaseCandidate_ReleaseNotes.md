Egret 1.0 Release Candidate Release Note
===============================

最近更新时间：2014年7月6日

欢迎您使用Egret



## 概述

Egret 1.0 Release Candidate 是 Egret 1.0的第一个发布候选版，在此版本后，Egret 1.0原则上不再会添加新特性，而是专注于解决现有的问题和优化。感谢所有在 Prerelease 和 Public Beta 阶段所有对 Egret 提出宝贵意见的开发者。

### 新特性
* 添加 egret publish 命令
* 添加 exmlc 命令
* 为 Graphics API 添加 moveTo / curveTo / drawCircle 等方法
* 添加 DisplayObject.getChildByName(name) 方法
* 添加精确像素碰撞检测
* 添加 egret create_app 命令

### 修复

* 解决 egret 安装在包含空格的文件夹内时创建新项目会报错的bug
* 解决 Native 方式下文本测量宽度获取错误的bug
* 解决设置文本居中后，Native上的文本位置渲染错误的bug
* 解决 ProgressBar设置当前value后立刻调用时会返回错误的bug
* 解决 RES.getResByUrl()加载位图报错的bug
* 解决 DragonBones 模块中在人物换装时可能层级显示错误的bug
* 解决 GraphicsAPI 在 RenderTexture上渲染失败的BUG
* Group某些情况下添加子项失败的问题
* 解决BitmapText重复修改文字失效的bug
* 解决 egret create 命令传入绝对路径导致报错的bug
* 修复在Mobile设备上获取StageHeight错误的bug 
* 修复Bitmap对含有透明边界的且来自SpriteSheet的位图绘制不正确的问题
* 解决 Native 方式蒙版失效的问题

### 改进

* 优化 DisplayObjectContainer.swapChildren() 的性能
* egret.UIAsset 类的构造函数添加一个可选参数 source 
* 在 startserver 命令启动服务器失败时会返回更友好的错误提示
* 大幅优化引擎主渲染循环 updateTransform 的性能
* 大幅优化引擎 hitTest 的性能
* 修改 将 DisplayObject.cacheAsBitmap() 修改为 DisplayObject.cacheAsBitmap ，以和 Flash Style API 保持一致
* Skin.createChildren()方法的执行时机调整到hostComponent赋值之后
* 优化 DragonBones 模块的性能，在移动设备浏览器中有 200% 左右的性能提升
* UIStage增加autoResize属性
* 命令行工具改为无需声明reference的编译方式
* 增加Profiler具体显示
* 添加 Rectangle.containsPoint 方法

### 重构

## 已知问题


## 路线图
