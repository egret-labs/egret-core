Egret Engine 4.0.1 Release Note
===============================


Last Updated：23 Jan, 2017


Welcome to use Egret Engine !


## Updated Items:

* Egret CLI Tools
    * Compile your Project with tsconfig.json , not force to src folder && libs forder
    * Fix a TypeScript file sort error
    * Fix  still ```DEBUG == true ``` after ``` egret publish ```
    * Refactor Egret CLI Tools and reduce its size from 21mb to 18mb
    * Add Promise support in new project template
    * Add Promise support via ```egret upgrade``` 

* Egret 3D Renderer Core
    * Allow to use Egret 3D Renderer Core in Egret2D Game
    * Support more Android Devices such as Nexus 5 and Mi 4
    * Reduce some shaders's compile time
    * Improve performance about 5% - 10%
    * Update Unity Export Tools
    * Compile with TypeScript 2.1.4

* ResourceManager
    * Fix a bug about load BitmapFont  
    * Import error report in ```res``` command and runtime
    * Fix a bug about ```res build``` when deleted a file
    * Improve docs



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