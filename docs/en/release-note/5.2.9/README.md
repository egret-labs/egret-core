# Egret Engine 5.2.9 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On September 10, 2018, we will release a stable version of 5.2.9. This release is a centralized bug fix for version 5.2


## 2D Rendering - JavaScript

* Fix skin settings null will report an error 
* Fix using Graphics as a mask in Canvas mode and causing rendering errors 
* Fix editing skin in Wing may cause an error reporting error 
* Fix Runtime rendering mode set to Canvas mode will report an error, forcing the use of WebGL mode rendering
* Fix illuminating filter rendering exception in some cases

## Command Line

* Fixed default.thm.json inconsistency in debug and release mode 
* Fixed issue where the manifest.json file was not fixed 
* Fix the implementation of egret run error under linux 
* Modify the default project script to make the package native support debugging and publishing mode

## AssetsManager

* Edit the API documentation and view the latest documentation via EgretLauncher
* Added setting compatibility mode interface, items upgraded with old res module can set compatibility mode for better adaptation
* Increase RES.typeSelector to make RES.getResByUrl consistent with the previous one
* Fix loading the second configuration file may not load the problem 
* Fixed an issue where the resource group list was empty when adding a resource group 

## WeChat Games Support Library

WeChat game support library Please update your project by using Egret Launcher to publish a WeChat game, version 1.1.8

* Added FPS panel, panel open and style synced from index.html every time it is published
* Modify the default project template, the project of non-assetsmanager module does not enable file caching