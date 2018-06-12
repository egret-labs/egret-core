Egret Engine 5.0.8 Release Note
===============================

Latest update: September 18, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* Command Line Tools
	 * The mouse library increases the scroll wheel event

* 2D rendering - JavaScript
	* Raise ByteArray.readUTFBytes to run faster
	* Optimize rendering of object logic with a width of height of 0
	* Fix eui.TileLayout typesetting problems
	* Fix the use of filters on DragonBones does not show problems

* 2D rendering - WebAssembly
	* Fix the input text error
	* Repair texture object destruction error problem
	* Fix particle blending mode problem

* DragonBones - JavaScript
	* Repair animation time data error may cause the program to crash
	* Repair the measurement box to calculate the error

* DragonBones - WebAssembly
	* Optimize the binding mechanism
	* Optimize binding interfaces and compatibility
	* Optimize memory recovery

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations