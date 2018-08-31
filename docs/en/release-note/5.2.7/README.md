# Egret Engine 5.2.7 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On August 13, 2018, we will release a stable version of 5.2.7. This release is a centralized bug fix for version 5.2


## 2D Rendering - JavaScript

* Fix the problem of the canvas renderer error after setting the mask with the width and height of 0
* Fixed Bitmap setting without fill dirty after fillMode
* Fixed BitmapText rendering in runtime may report an error

## Command Line

* Add automatic mapping plugin TextureMergerPlugin

## AssetsManager

* Fix loading different resource group exceptions with the same resources
* Fixed resItem empty for RES.ResourceEvent.GROUP_PROGRESS event
* Fix loading empty resource group causes error reporting
* RES.destroyRes supports force parameter
* The loader internally stops using await for debugging

## WeChat Games Support Library

WeChat game support library Please update your project by using Egret Launcher to publish a WeChat game, version 1.1.6

* Added binary and sound caching scheme
* Fix settings for multi-finger touch parameter invalidation
* Fixed the problem of invalidation of picture nine-grid parameter when using file cache