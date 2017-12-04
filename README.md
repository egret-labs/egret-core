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
        <img src="https://img.shields.io/badge/version-5.0.14-green.svg"
             alt="version">
    </a>
    <a href="./LICENSE.md">
        <img src="https://img.shields.io/badge/license-New%20BSD-blue.svg"
             alt="license">
    </a>
</p>

[EN](README.md) / [CN](README_CN.md)

# Egret Engine

The Egret Engine includes a game engine that follows the HTML5 standard developed by the Egret. It includes a common module for game engines such as 2D / 3D rendering cores, EUI systems, audio management, and resource management.
Through the use of Egrets engine, developers can do as much as possible not concerned about the bottom of the browser to achieve, to solve the HTML5 game performance problems and fragmentation issues, flexibility to meet the developer to develop 2D or 3D game needs.


## Platform Coverage 

### Mobile

![](https://img.shields.io/badge/iOS-8.0%2B-lightgrey.svg)
![](https://img.shields.io/badge/Android-4.0%2B-brightgreen.svg)
![](https://img.shields.io/badge/Windows%20Phone-8-orange.svg)

### PC

![](https://img.shields.io/badge/Chrome--brightgreen.svg)
![](https://img.shields.io/badge/Safari--yellow.svg)
![](https://img.shields.io/badge/FireFox--orange.svg)
![](https://img.shields.io/badge/Edge--red.svg)
![](https://img.shields.io/badge/IE-9+-blue.svg)

# Installation

Install Egret Engine

* [Download](https://egret.com/products/engine.html) the Egret Engine Manager first.

* After download successful, follow the [installation and deployment](http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/installation/index.html) 

After installation, we can easily manage the Egret engine and tools.

# Getting Started

#### TypeScript

An Egret project should be developed by TypeScirpt language. TypeScript is a superset of JavaScript, the specific content can refer to the TyptScript language manual. Egret API and AS3 have a lot of similarities. It will be certainly easy to get started if you are familiar with it.

#### Create a project by command line

You can use following command to create a default item for the game

    egret create HelloWorld

If you have special needs you can add parameters - type empty | game | gui | eui to specify different projects. After creating a game you can see a folder named 'HelloWorld'.

#### Write the first line of code

The entry for the game project is src / Main.ts by default. Write the first line of code for our project below, find the createGameScene () function in the default code, add console.log ("Hello World");

Become following:

    private createGameScene():void {
            // log
            console.log("Hello World");
            var sky:egret.Bitmap = this.createBitmapByName("bgImage");
            this.addChild(sky);
            var stageW:number = this.stage.stageWidth;
            var stageH:number = this.stage.stageHeight;
            sky.width = stageW;
            sky.height = stageH;
            //...
        }

Here we call a commonly used debugging command, console.log ("need to display the log content"). It will display our log in the browser's developer tool.

    We recommend using Chrome to debug the Egret project.

We use the following command to build the project:

    egret build

Then use the following command line to run the project:

    egret startserver

![](./docs/img/console.png)

Done.

For more information, please refer to the Learning Module to view the documentation.

# Demo

Tower Defence Demo
![](./docs/img/3d_demo_1.png)
Click [here](http://developer.egret.com/cn/article/index/id/1074) for online experience.<br/>

Click [here](http://developer.egret.com/cn/list/example/id/190) for more 2D/3D demos.<br/>

# Show Case

Click here to see [Show Case](https://egret.com/case)<br/>

# Learn

* Access [Doc](http://developer.egret.com/cn/github/egret-docs/Engine2D/index.html?home=1) to get Engine document
* Access [Example](http://developer.egret.com/cn/example/egret2d/index.html#010-disp-basic) to learn demo source code
* Access [API](http://developer.egret.com/cn/apidoc/) to get API document
* Access [Video](http://developer.egret.com/cn/list/video/) to get videos
* Access [Community](http://bbs.egret.com/portal.php) to communicate with other developers

# Tools

* Access [Egret Engine](http://www.egret.com/products/engine.html) to get Egret Engine launcher
* Access [Egret Wing](http://www.egret.com/products/wing.html) to get Egret IDE
* Access [Dragonbones Pro](http://dragonbones.com/cn/index.html) to get DragonBones
* Access [Moew Tools](http://www.egret.com/products)

# Third Party Library

* Use [base64texture](https://github.com/egret-labs/egret-game-library/tree/master/base64texture) to convert base64 String to egert Texture
* Use [dcagent](https://github.com/egret-labs/egret-game-library/tree/master/dcagent) DataEye SDK for Egret
* Use [ecs](https://github.com/egret-labs/egret-game-library/tree/master/ecs) component system
* Use [euiextension](https://github.com/egret-labs/egret-game-library/tree/master/euiextension) EUI extension
* Use [gesture](https://github.com/egret-labs/egret-game-library/tree/master/gesture) Gesture library
* Use [keyboard](https://github.com/egret-labs/egret-game-library/tree/master/keyboard) Keyboard event listener
* Use [Greensock](https://github.com/egret-labs/egret-game-library/tree/master/greensock) Greensock animation library
* Use [jszip](https://github.com/egret-labs/egret-game-library/tree/master/jszip) jszip Compression library
* Use [md5](https://github.com/egret-labs/egret-game-library/tree/master/md5) A simple MD5 Library
* Use [mouse](https://github.com/egret-labs/egret-game-library/tree/master/mouse) PC mouse support library
* Use [particle](https://github.com/egret-labs/egret-game-library/tree/master/particle) particle system
* Use [physics](https://github.com/egret-labs/egret-game-library/tree/master/physics) p2Physics engine，current version 0.7.0
* Use [socket](https://github.com/egret-labs/egret-game-library/tree/master/socket.io) socket.io
* Use [tiled](https://github.com/egret-labs/egret-game-library/tree/master/tiled) tiledmap support library
* Use [weixinapi](https://github.com/egret-labs/egret-game-library/tree/master/weixinapi) WeChat API
* More third party libraries please visit [here](https://github.com/egret-labs/egret-game-library) 

# Contributing

Raising a good question is the first step to participate a open source community. You can report issues [here](https://github.com/egret-labs/egret-core/issues).
Issue discussion in [official community](http://bbs.egret.com/portal.php) is recommended. It can help the latters solve problems more efficiently.

# License

This content is released under the (https://opensource.org/licenses/BSD-2-Clause) BSD License.

![](https://img.shields.io/badge/license-New%20BSD-blue.svg)