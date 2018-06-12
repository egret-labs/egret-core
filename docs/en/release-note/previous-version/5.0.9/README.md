Egret Engine 5.0.9 Release Note
===============================

Latest update: October 9, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* 2D rendering - JavaScript
	* Solve the problem of font blur
	* Repair exml id attribute can not contain spaces

* DragonBones - JavaScript
	* Fix shared map with the same name causes the animation to fail
	* Fix getBounds to return the wrong data problem
	* Repair mesh may be dislocated

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations