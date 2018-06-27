# Egret Engine 5.1.3 Release Notes


---

Egret engine was officially released in December 2017 version 5.1. This version is a centralized version of 5.1 bug fixes, the main goal is to improve WeChat mini games, AssetsManager stability.



## WeChat mini game

* Repair `` `egret run`` command execution, 32-bit Windows operating system shows" please install the latest WeChat developer tools "BUG.
* Fix bug related to multiple WeChat mini games, including:
    * RendererTexture memory leak problem
    * iPhoneX and other full screen device adapter problem
    * When there are multiple input text at the same time, rendering the problem of confusion
    * Repair HttpRequest After loading the file cache, resulting in resource loading error problem
    * Fix input text is not distributed change event problem
    * Reconstruction of egret engine WeChat plug-in, the underlying technology foundation for the future WeChat will provide the ability to build

The above, which has been updated independently with recent Egret Launcher, is now available to developers by re-creating the WeChat project in Egret Launcher, which you can do by typing ```egret.wxgame.version``` in the WeChat Developer Tools' console to check the version, the current version is 1.0.10


## AssetsManager


This update fixes multiple BUG AssetsManager to ensure that its behavior consistent with the old RES module. Mainly contains:

* Support loading resource group priority
* Support for setting the number of loading threads
* Support loading failure reload function
* Support to set the number of failed loading retries
* Bug fixes buggy rendering
* Fix bitmap fonts can not be rendered BUG
* Fixed loading http atlas and font path is not correct problem
* Fixed when developers set resourceRoot in ```RES.loadConfig``` but did not work
