# Egret Engine 5.2.4 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On July 2, 2018, we will release a stable version of 5.2.4. This release is a centralized bug fix for version 5.2


## 2D Rendering - JavaScript

* Fix drawing exceptions after setting cacheAsBitmap on graphics
* Fix RenderTexture setting scaling after drawing exceptions
* Fixed eui.List not causing slide error on stage
* Fixed an issue that caused WebGLTexture creation to fail
* Fixed an error in the input text
* Fix cacheAsBitmap and filters used with drawing exceptions
* Fixed native display list textWidth and textHeight calculation exceptions

## Command Line

* Reduce commonjs2 mode compilation memory consumption
* Fixed commonjs2 mode skin status bug

## AssetsManager

* Fix SheetProcessor will trigger twice loading image problem
* Fixed an error exception
* Fixes getResAsync and getResByUrl do not dispatch ITEM_LOAD_ERROR event issues

## WeChat Games Support Library

WeChat Mini Game Support Library Please update your project with the WeChat Mini Game by Egret Launcher. Version 1.1.3

* Increased entry into the background and back to the foreground event
* Fix the problem of text rendering abnormality in iOS10.1