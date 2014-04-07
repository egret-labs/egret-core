Egret Release Notes
===============================


欢迎您使用Egret

### Egret 0.9.2 Release Note ( Prerelease )

最近更新时间：2014年4月2日

#### 概述
Egret 0.9.2主要添加了Egret Command Line Tool来集成Egret现有脚本，并帮助开发者更方便的创建新项目

#### 修正问题
* 解决 [ISSUE_3](https://github.com/egret-team/egret/issues/3) ，通过新的项目创建模板，由TypeScript生成的JavaScript代码现在会移动至output目录
* 解决 [ISSUE_4](https://github.com/egret-team/egret/issues/4)，目前可以通过Egret Command Line Tool实现此功能，原有脚本已经被废弃
* 解决 [ISSUE_7](https://github.com/egret-team/egret/issues/7)

#### 文档更新
* 关于Egret Command Line Tool的使用文档，参见[这里](/tools/README.md)

#### 向下兼容性变更

* 原有的tools脚本调用方式已经修改，具体内容见【文档更新】一节


### Egret 0.9.1 Release Note ( Prerelease )

最近更新时间：2014年3月27日

#### 概述
Egret 0.9.1着重于改善开发者配置的过程和降低不必要的复杂度

#### 修正问题
* 解决 [ISSUE_1](https://github.com/egret-team/egret/issues/1) ，目前当tsc编译器未安装时，控制台会输出
```
TypeScript编译器尚未安装，请执行 npm install -g typescript 进行安装
```
* 解决 [ISSUE_2](https://github.com/egret-team/egret/issues/2) ，目前当未安装指定的nodejs模块时，控制台会输出
```
加载模块 ${moduleName} 失败
请确认在 build_typescript.js 所在目录下已执行 npm install ${moduleName}
```

* 解决部分Example运行报错的问题，涉及 BitmapTest,ScrollViewTest,TableViewTest,Box2dTest
* 重构项目文件结构，将引擎依赖的部分js库移至src/jslib文件夹，并修改对应加载路径
* 优化.gitignore文件，确保通过TypeScript生成的JavaScript代码不会被Git自动标记
*



### Egret 0.9 Release Note ( Prerelease )

最近更新时间：2014年3月24日

#### 概述
此版本为Egret的初始版本

#### 功能特性

Egret目前处于Prerelease阶段。这个版本包括了Egret的基础功能，具体内容如下


##### 显示列表

Egret采用了参考Flash ActionScript 3.0 API的显示列表架构

##### 基础GUI

Egret目前提供了一套基础GUI用于提供简单的GUI支持

> 在未来的版本中，Egret会提供更强大的GUI系统

##### 位图序列动画 / 骨骼动画

Egret提供了位图序列动画/骨骼动画两种支持。

Egret骨骼动画由 [DragonBones](dragonbones.github.io)提供

##### 鼠标/触摸/输入文本用户交互

##### 声音支持

Egret目前采用HTML5 Audio Tag API提供声音支持

> 在移动设备浏览器上，Egret建议开发者只使用背景音乐，不要使用音效。

##### 基于HTTP的网络支持

##### 基于Node.js的工具脚本


#### 已知问题
* 引擎代码并未完全通过TypeScript编译的严格模式（TS2000+错误）
* StageText在iPhone5、iPhone5S、MacBookPro Retina等设备上有时会显示错误

> Egret欢迎开发者在 ${egret_root}/issues中构建一个Bug TestCase并反馈给我们


#### 后续计划
* 新项目创建模板
* 更多的教程文档
* API手册
* 其他内容请参见 [Egret路线图](http://www.egret-labs.org/wp-content/uploads/2014/03/egret_roadmap_new.png)
