# Egret Engine 5.2.8 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On August 27, 2018, we will release a stable version of 5.2.8. This release is a centralized bug fix for version 5.2


## 2D Rendering - JavaScript

* Fix MovieClip collision detection invalidation in runtime environment
* Fix Textinput The input box still exists after removing the stage
* Fix addChild event dispatch exception in runtime environment
* Fixed an issue where the video was not paused after the video was paused
* Fix particle library does not distribute completion events in runtime environment

## Command Line

* Fix compile eui project exml sort random problem

## AssetsManager

* Added version control interface
* Fixed getResAsync and getResByUrl not subject to maximum concurrent load thread limit
* Fixes getResAsync and getResByUrl failed to load without triggering retry
* Fix the resource exception problem caused by loadConfig pass http

## WeChat small game support library

WeChat game support library Please update your project by using Egret Launcher to publish a WeChat game, version 1.1.7

* Increase the setting volume support
* Fixed inconsistency between getPixels and browser return values
* Sound and binary cache are enabled by default in the default created project template
* Fix binary cache in the iOS real machine environment, the small game base library is lower than the 2.2.3 version compatibility issue