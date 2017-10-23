Egret Engine 5.0.10 Release Note
===============================

Latest update: October 23, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* 2D rendering - JavaScript
	* Cancel on the PC canvasScaleFactor defaults to 2 settings
	* Fix Tween.removeAllTweens after the internal counter does not have to reset the bug (Thanks to the bbs developer derek6616)
	* Repair the projection and lighting filters at the same time using the cause of the light filter exception (Thanks to the bbs developer zyy)
	* Reconstruct the canvasScaleFactor implementation mechanism, no longer create too large canvas
	* Import file introduces calculateCanvasScaleFactor function, developers can calculate their own canvasScaleFactor

* DragonBones - JavaScript
	* Fixed bug where the map was individually scaled and the global zoom was misaligned
	* Repairing an array of traverses may cause an error in the array error (Thanks to the bbs developer gepan)
	* Repair the mesh rectangle area may not be updated correctly (Thanks to the 游心互动 developer)
	* Fixing shared maps with the same name may cause animations to display incorrect errors

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations