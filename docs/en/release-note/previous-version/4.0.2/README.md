Egret Engine 4.0.2 Release Note
===============================


Last Updated：20 Feb, 2017


Welcome to use Egret Engine !


## Updated Items:

* Egret CLI Tools
    * Compiler upgrades to TypeScript 2.1.5
    * Fix the srartserver command port number fixed to 3000

* Egret engine rendering core
    * Repair filters may cause memory leaks
    * Repair canvas mode filter cross domain policy exception problem
    * Repair webgl mode to draw inverted rectangle mask exception problem

* ResourceManager
    * Fix RES.isGroupLoaded inconsistent with previous version of the problem
    * Supports npm 2.x version
    * Fix RES.loadGroup bug
    * Repair res build in the conversion of resource.json, there is no corresponding delete resource.json has been deleted Group problem

* Experimental function updates
    * Add photo selector function, you can select the phone photos and display
    * Please visit [here] (http://wx.qimi.com/html/1210/love/1/index.html) view example project


## Roadmap

The egret engine will in the next six months, focus on solving the following problems:

* Move to the ES2015+ / NPM egret engine, standard TypeScript direction to move closer, improve the development efficiency of developers.
* Allows developers to upgrade specific modules, so as to reduce the production environment has been running in the game because of the potential problems caused by the upgrade engine.
* 2D and 3D rendering engine and enhance the fusion of egrets, rendering the core scalability, allowing developers to more flexible customization effects.
* Improve the resource management framework to help developers to improve the efficiency of resource loading, release, and reduce traffic consumption.
* Cooperate with Egret Wing to further improve the EXML / EUI mechanism to help developers improve the efficiency of UI development and rendering.
* Focus on addressing the issue of developer focused feedback in 2016, see specific links [here](http://bbs.egret.com/thread-25005-1-1.html)

## Other Related Content
* Egret Engine 4 needs the latest Egret Wing 4, or WebStrom and other development tools to upgrade to a new version to support TypeScript 2.1
* The skeletal animation developers will need egret speed mode above DragonBonesPro upgrade to version 4.8, recommend the use of the latest version 5
* Use the Egret Engine to develop native game tools (egret-ios-support / egret-android-support) will soon release a new face to Egret-Native