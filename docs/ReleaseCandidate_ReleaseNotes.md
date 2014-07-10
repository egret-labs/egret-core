Egret 1.0 Release Candidate Release Note
===============================

最近更新时间：2014年7月10日

欢迎您使用Egret



## 概述

Egret 1.0 Release Candidate 是 Egret 1.0的第一个发布候选版，在此版本后，Egret 1.0原则上不会再改动 API结构，而是专注于解决现有的问题和优化。感谢所有在 Prerelease 和 Public Beta 阶段所有对 Egret 提出宝贵意见的开发者。

### 新特性
* 核心显示列表
  * 为 Graphics API 添加 moveTo / curveTo / drawCircle 等方法
  * 添加 DisplayObject.getChildByName(name) 方法
  * 添加精确像素碰撞检测

* GUI体系
  * 添加 exmlc 命令，可以通过一个 xml 文件生成 Egret GUI Skin 文件

* Egret 项目结构与命令行工具
  * 添加 egret publish 命令，通过封装 Google Closure Compiler 进行代码压缩 
  * 添加自动化生成 ``` game_file_list.js ``` 文件的功能

* Egret Android Support Update 1 ，在这个版本中，开发者可以通过 egret create_cpp 命令创建一个支持 egret 的标准Android工程项，并修复若干问题，具体列表如下 [todo](todo)
* Egret iOS Support Alpha，同样可以使用 egret create_app 命令创建，添加了若干新特性，如题列表如下[todo](todo)

### 修复

* 解决 egret 安装在包含空格的文件夹内时创建新项目会报错的bug
* 解决 egret create 命令传入绝对路径导致报错的bug
* 解决 GraphicsAPI 在 RenderTexture上渲染失败的BUG
* 解决BitmapText重复修改文字失效的bug
* 解决 ProgressBar设置当前value后立刻调用时会返回错误的bug
* 解决 Group某些情况下添加子项失败的问题
* 解决 RES.getResByUrl()加载位图报错的bug
* 解决 DragonBones 模块中在人物换装时可能层级显示错误的bug
* 修复在Mobile设备上获取StageHeight错误的bug 
* 修复Bitmap对含有透明边界的且来自SpriteSheet的位图绘制不正确的问题
* 解决 Native 方式蒙版失效的问题
* 解决 Native 方式下文本测量宽度获取错误的bug
* 解决设置文本居中后，Native上的文本位置渲染错误的bug


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

* MovieClip类的结构进行了重构，允许开发者对数据格式进行扩展，同时废弃了部分API，目前被废弃的API会向下兼容，但是在 1.0 Final Release 中这些API会被删除


## 已知问题
* egret publish 命令在特定 windows 系统上会执行失败（命令行缓冲区不足），这个问题会在下个版本中修复

## 路线图


## 旧项目升级迁移事项

//todo   @dom 项目升级,  .d.ts 变位置   game_file_list 生成 ， 老项目不想自动生成怎么办?
