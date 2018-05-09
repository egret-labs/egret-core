# Egret Engine 5.1.11 Release Notes


---


The Egret Engine officially released version 5.1 in December 2017. On May 7, 2018, we will release version 5.1.11. This release is a centralized bug fix for version 5.1.



## 2D Rendering - JavaScript

* Fix the problem that the dirty data in MovieClip.play is not cleared 
* Repairing the use of masks may render exceptions 
* Fix BitmapText setting text without checking the type of passed arguments 

## Command Line
* Added eui skin commonjs2 mode to significantly reduce skin file size
* Fix linux system using command line error 

## AssetsManager
* Fix SheetProcessor does not deal with the problem of the nine-square grid 
* Fix SheetProcessor not releasing texture issue 

## WeChat mini game

WeChat Mini Game Support Library Please update your project with the WeChat Mini Game by Egret Launcher. Version number 1.0.15

* Repair audio may not play
* Fix texture.saveToFile error
* Fixed HttpRequest failed to dispatch event in real machine environment
* Fixed an issue where loading an image on an Android real machine and then uninstalling it and then loading it for the second time would cause the event to be dispatched incorrectly

## Facebook Instant Games SDK
Upgrade SDK to 6.2 version