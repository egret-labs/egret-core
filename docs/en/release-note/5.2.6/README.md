# Egret Engine 5.2.6 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On July 31, 2018, we will release a stable version of 5.2.6. This release is a centralized bug fix for version 5.2


## 2D Rendering - JavaScript

* Fix video in native package display exception problem
* Fix the problem of continuous playback sound in the native flashback
* Fixed an issue with setting the mixed mode canvas rendering error for the container

## Command Line

* Fix commonjs2 mode in some cases, the compilation result is incorrect

## AssetsManager

* Fixed the problem that the same url could not be loaded again after loadConfig failed
* Fixed the problem that the same url could not be loaded again after the getResByUrl failed
* Fixed the problem that the same key could not be loaded again after getResAsync failed
* Fixed memory leak after destroying getResByUrl
* Fix memory leak after destroyRes is destroyed
* Repairing loadGroup will cause memory leaks

## WeChat Games Support Library

WeChat game support library Please update your project by using Egret Launcher to publish a WeChat game, version 1.1.5

* Fixed a problem with filter rendering exceptions in some cases
* Fixed a problem with black edges on the top of iPhone X rendering
* Fixed a problem where the resource loaded using RES.getResByUrl could not be cached