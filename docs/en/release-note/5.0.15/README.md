Egret Engine 5.0.15 Release Note
===============================

Latest update: February 23, 2018


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

This version is the official recommended stable version.

## Updates

* 2D rendering - JavaScript
    * Added egret.warn and egret.error information can be displayed to the micro-end debug panel
    * Fixed eui.Rect memory leak issue in WebGL rendering mode
    * Repair eui.Group the sacle is 0, click anywhere is the click success problem
    * Fixes There is no reset of textWidth and textHeight when setting the text or font properties of BitmapText to null
    * Fixed CustomWhite textureWidth and textureHeight not fixed when CustomFilter padding property is 0
    * Fix getPixels inaccurate problem in WebGL environment
    * Fix for egret.MainContext.deviceType and egret.MainContext.runtimeType exceptions
    * Repairing a mouse can not dispatch a releaseOutSide event when it comes back to Stage after it has been loosened
    * Fixed Graphics object settings filter does not show the problem
    * Fix eui.BitmapLabel set the font repeatedly because of asynchronous loading will lead to font disorder problem 
    * Fix egret.ByteArray.readBytes function will cause bytesAvailable exception
    * Fix eui virtual layout may create too many object problems
    * Repair audio stops after the event is not emptied registration may lead to error reported
    * Repair game div set the display property to none, resize exception

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations