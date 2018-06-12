# Egret Engine 5.2.0 Release Notes


---


The Egret Engine officially released the beta version 5.1 in December 2017. On May 25, 2018, we will release a stable version of 5.2. This version will not introduce new features, only for some BUG repair



## 2D Rendering - JavaScript

* Fixed some browser incompatibility issues in Texture.getPixels in WebGL environment

## AssetsManager

* Repairing getResByUrl's resources cannot be released via destroyRes

## Command Line

* Fix some incompatibility issues of commonjs2 release mode

## WeChat Games Support Library

Wechat mini game support library Please update your project via the Egret Launcher to publish a WeChat game version number 1.0.17

* Fixed bug where using HttpRequest to request binary exceptions
* Fix window.isNaN caused by error in some cases