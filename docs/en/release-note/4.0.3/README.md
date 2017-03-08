Egret Engine 4.0.3 Release Note
===============================


Last Updated：6 Mar, 2017


Welcome to use Egret Engine !


## Updated Items:

* Egret CLI Tools
    * Fixed the Linux command line error

* Egret engine rendering core
    * Fixed the filter to measure the boundary error problem
    * Fixed URLLoader to send POST request exception problem
    * Fixed WebGL under the cacheAsBitmap object rendering exception problem
    * Fixed eui.RadioButton memory leak problem
    * Fixed Rectangle.containsPoint border check for unusual problem

* ResourceManager
    * Repair mapConfig excluded part of the document, and default.res.json also contains this part of the document, res build command error
    * Optimize createGroup If a url is passed instead of alias, the load shows a warning
    * Optimized subkey does not exist when the error message
    * Added watch function
    * Repair the packaged iOS / Android native project to start the black screen problem

* Egret3D
    * Increase debug mode performance monitoring panel
    * Optimize bounding box wireframe rendering logic
    * Fixed transparent object rendering bug
    * Export plug-in support for MacOS version, refactoring part of the business logic


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