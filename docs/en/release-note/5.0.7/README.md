Egret Engine 5.0.7 Release Note
===============================

Latest update: September 1, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* Command Line Tools
	 * Fix the compiler encountered too much error message crash problem

* 2D rendering - JavaScript
	* Fix BitmapLabel display exception problem
	* Fix TweenGroup.stop performance exception problem

* 2D rendering - WebAssembly
	* Increase particle library support
	* Fix MovieClip width and height of 0 to the problem
	* Fix DragonBones width and height of 0 to the problem

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations