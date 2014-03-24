Egret Release Notes
===============================


欢迎您使用Egret

最近更新时间：2014年3月24日


### Egret 0.9 Prerelease Release Notes


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