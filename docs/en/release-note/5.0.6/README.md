Egret Engine 5.0.6 Release Note
===============================

Latest update: August 21, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* Command Line Tools
	 * Added exmlRoot to support the configuration string array
	 * Fix the bug that failed to copy the entry file from the correct web template when the project was released

* 2D rendering - JavaScript
	* Fixed ByteArray.readBytes after the position does not change the bug
	* Fixed ByteArray.decodeUTF8 garbled bug
	* Repair eui.Scroller drag and drop caused the TouchEvent memory leak problem

* 2D rendering - WebAssembly
	* Repair wing can not preview skin problems
	* Fix BitmapText's text property to set the number of exceptions
	* Fix cacheAsBitmap after the coordinates of the problem

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations