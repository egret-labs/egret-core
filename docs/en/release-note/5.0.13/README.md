Egret Engine 5.0.13 Release Note
===============================

Latest update: November 20, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.
This version is the official recommended stable version.

## Updates

* 2D rendering - JavaScript
    * Repair set cacheAsBitmap anomalies after the drawing position (thanks 西山居 R & D team)
    * Fixed Dirty Rectangle cracks (thanks to the 火印游戏 R & D team)
    * Repair input text input in iOS 9 after the interface is enlarged problem (thanks 菲音 R & D team)
    * Fix the text underline drawing anomalies (thanks to the developer Long Bin)
    * Repair Promise iOS 10 environment abnormalities (thanks to 要玩 R & D team)

* DragonBones - JavaScript
    * Repairing Skeleton Reloading Visibility of Displayed Objects Once Again It Is Possible to Report Errors
    * Fixed an issue where the vertex of the mesh may cause incorrect color
    * Update API documentation

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations