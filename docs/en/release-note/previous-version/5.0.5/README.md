Egret Engine 5.0.5 Release Note
===============================
Latest update: August 4, 2017

Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* Command Line Tools
	 * The TypeScript compiler is upgraded to version 2.4.2
	 * Incremental compilation logic optimization
	 * Fix the problem of building the third party library DEBUG and RELEASE parameters

* 2D rendering - JavaScript
	* Fix the cacheAsBitmap rendering exception in certain cases
	* Fix BitmapData.create to return undefined problem
	* Fix eui release gjs way to lack the className problem

* 2D rendering - WebAssembly
	* Added support for dragonBones module
	* Added support for game module

## Known Issues
* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations