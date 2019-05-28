<p align="center">
    <img src="./docs/img/egret_logo.jpg"
         height="130">
</p>
<p align="center">
    <a href="https://github.com/egret-labs/egret-core/network">
        <img src="https://img.shields.io/github/forks/egret-labs/egret-core.svg"
             alt="forks">
    </a>
    <a href="https://github.com/egret-labs/egret-core/stargazers">
        <img src="https://img.shields.io/github/stars/egret-labs/egret-core.svg"
             alt="stars">
    </a>
    <a href="https://github.com/egret-labs/egret-core">
        <img src="https://img.shields.io/badge/version-5.2.20-green.svg"
             alt="version">
    </a>
    <a href="./LICENSE.md">
        <img src="https://img.shields.io/badge/license-New%20BSD-blue.svg"
             alt="license">
    </a>
</p>

[EN](README.md) / [CN](README_CN.md)

# Egret Engine

Egret Engine包含了白鹭时代研发的遵循HTML5标准的游戏引擎，他包括 2D / 3D 渲染核心、EUI体系、音频管理、资源管理等游戏引擎的常用模块。

通过使用白鹭引擎，开发者可以尽可能的不用关注浏览器的底层实现，解决HTML5游戏性能问题及碎片化问题，灵活地满足开发者开发2D或3D游戏的需求。

## 引擎覆盖平台

### 移动端

![](https://img.shields.io/badge/iOS-8.0%2B-lightgrey.svg)
![](https://img.shields.io/badge/Android-4.0%2B-brightgreen.svg)
![](https://img.shields.io/badge/Windows%20Phone-8-orange.svg)

### PC端

![](https://img.shields.io/badge/Chrome--brightgreen.svg)
![](https://img.shields.io/badge/Safari--yellow.svg)
![](https://img.shields.io/badge/FireFox--orange.svg)
![](https://img.shields.io/badge/Edge--red.svg)
![](https://img.shields.io/badge/IE-9+-blue.svg)

# 安装

首先获得 Egret Engine

* 首先 [下载](https://egret.com/products/engine.html) Egret Engine 管理器

* 下载成功后进行 [安装与部署](http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/installation/index.html) 

安装好后以后我们可以方便的管理 Egret 引擎和工具了。

# 开始

#### TypeScript

Egret 项目使用 TypeScirpt 语言来开发。TypeScript 是 JavaScript 的超集，具体内容可以参考 [TyptScript语言手册](http://bbs.egret.com/thread-1441-1-1.html)。Egret 的 API 和 AS3 有很多相似之处，如果您熟悉的话肯定容易上手。

#### 使用命令行创建项目

你可以使用如下命令创建游戏的默认项目

    egret create HelloWorld

如果有特殊需要可以加入参数--type empty|game|gui|eui 来指定不同的项目。创建游戏后可以看到一个名为'HelloWorld'的文件夹。

#### 编写第一行代码

游戏项目的入口类默认在src/Main.ts里面。下面编写我们的项目的第一行代码,在默认的代码中找到createGameScene()函数，添加console.log("Hello World");。

变成了下面的样子：

    private createGameScene():void {
            //插入 log
            console.log("Hello World");
            var sky:egret.Bitmap = this.createBitmapByName("bgImage");
            this.addChild(sky);
            var stageW:number = this.stage.stageWidth;
            var stageH:number = this.stage.stageHeight;
            sky.width = stageW;
            sky.height = stageH;
            //以下省略
        }

这里我们调用了一条常用的调试命令，console.log("需要显示的log内容")将在浏览器的开发者工具下显示出来我们的log。

    我们推荐使用 Chrome 来调试 Egret 项目。

我们使用如下命令构建项目：

    egret build

然后使用如下命令行来运行项目：

    egret startserver

![](./docs/img/console.png)

完成。

更多内容请参考学习模块查看文档学习。

# 演示 Demo

守卫我的塔Demo
![](./docs/img/3d_demo_1.png)
在线体验地址请点击：[演示地址](http://developer.egret.com/cn/article/index/id/1074)<br/>

查看更多 2D/3D 示例，请点击：[示例中心](http://developer.egret.com/cn/list/example/id/190)<br/>

# 游戏案例

更多案例请访问 [案例中心](https://egret.com/case)<br/>

# 学习

* 访问 [使用文档](http://developer.egret.com/cn/github/egret-docs/Engine2D/index.html?home=1) 获取 引擎 使用文档
* 访问 [Example](http://developer.egret.com/cn/example/egret2d/index.html#010-disp-basic) 学习示例源码
* 访问 [API](http://developer.egret.com/cn/apidoc/) 获取 API 使用文档
* 访问 [Video](http://developer.egret.com/cn/list/video/) 获取教程视频和直播视频
* 访问 [Community](http://bbs.egret.com/portal.php) 和其他开发者线上交流

# 工具

* 访问 [Egret Engine](http://www.egret.com/products/engine.html) 获取 Egret 引擎的启动器
* 访问 [Egret Wing](http://www.egret.com/products/wing.html) 获取 Egret IDE
* 访问 [Dragonbones Pro](http://dragonbones.com/cn/index.html) 获取 Egret 骨骼动画工具
* 访问 [更多工具](http://www.egret.com/products)

# 第三方库

* 使用 [base64texture](https://github.com/egret-labs/egret-game-library/tree/master/base64texture) 把 base64 字符串转换为 egert Texture
* 使用 [dcagent](https://github.com/egret-labs/egret-game-library/tree/master/dcagent) DataEye SDK for Egret
* 使用 [ecs](https://github.com/egret-labs/egret-game-library/tree/master/ecs) 实体组件系统支持库
* 使用 [euiextension](https://github.com/egret-labs/egret-game-library/tree/master/euiextension) EUI 扩展库
* 使用 [gesture](https://github.com/egret-labs/egret-game-library/tree/master/gesture) 手势库
* 使用 [keyboard](https://github.com/egret-labs/egret-game-library/tree/master/keyboard) 键盘事件监听库
* 使用 [Greensock](https://github.com/egret-labs/egret-game-library/tree/master/greensock) Greensock 动画库
* 使用 [jszip](https://github.com/egret-labs/egret-game-library/tree/master/jszip) jszip 压缩库
* 使用 [md5](https://github.com/egret-labs/egret-game-library/tree/master/md5) 一个简单的md5库
* 使用 [mouse](https://github.com/egret-labs/egret-game-library/tree/master/mouse) pc鼠标支持库 
* 使用 [particle](https://github.com/egret-labs/egret-game-library/tree/master/particle) 粒子系统
* 使用 [physics](https://github.com/egret-labs/egret-game-library/tree/master/physics) p2物理引擎，当前使用的版本为0.7.0
* 使用 [socket](https://github.com/egret-labs/egret-game-library/tree/master/socket.io) socket.io
* 使用 [tiled](https://github.com/egret-labs/egret-game-library/tree/master/tiled) tiledmap 支持库
* 使用 [weixinapi](https://github.com/egret-labs/egret-game-library/tree/master/weixinapi) 微信API
* 更多第三方库请访问 [第三方库](https://github.com/egret-labs/egret-game-library) 

# 贡献

一个好的问题是参与开源社区的第一步，你可以先提[Issues](https://github.com/egret-labs/egret-core/issues)。

我们鼓励你到[官方社区](http://bbs.egret.com/portal.php)进行提问和回答问题，也能够帮助后来者更高效的解决问题。

# License

This content is released under the (https://opensource.org/licenses/BSD-2-Clause) BSD License.

![](https://img.shields.io/badge/license-New%20BSD-blue.svg)
