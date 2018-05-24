# Egret Engine 5.1.11 Release Notes


---


The Egret Engine officially released version 5.1 in December 2017. On May 21, 2018, we will release version 5.1.12. This release is a centralized bug fix for version 5.1.



## 2D Rendering - JavaScript

* Fixed some browser incompatibility problems with Texture.getPixels in WebGL environment

## AssetsManager

* Repairing getResByUrl's resources cannot be released via destroyRes

## Command Line

* Fix some incompatibility issues of commonjs2 release mode

## WeChat Games Support Library

Wechat mini game support library Please update your project via the Egret Launcher to publish a WeChat game version number 1.0.16

* Fixed bug where using HttpRequest to request binary exceptions
* Fix window.isNaN caused by error in some cases