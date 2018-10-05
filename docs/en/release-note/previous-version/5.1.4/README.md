# Egret Engine 5.1.4 Release Notes


---

Egret engine was officially released in December 2017 version 5.1. This version is a centralized version of 5.1 bug fixes, the main goal is to improve WeChat mini games, AssetsManager stability.



## WeChat mini game

* Added index.html After modification, the relevant configuration synchronization to WeChat project, such as horizontal screen
* Added ```egret build``` command to debug WeChat game,``` egret publish ```command to release WeChat game
* Added ```egret.getOption``` interface can read the game start parameters
* Repair ```egret run``` command may not read WeChat developer tool path BUG

## Bricks
### update content

This week, the egret engine has greatly improved the support for playing a game platform, focusing on the following problems:

* Added support for EUI
* Added support for DragonBones
* Added support for Graphics
* Added Mesh support
* Added support for displaying the blendMode and scrollRect properties of the object
* Added support for LocalStorage
* Added support for WebSocket
* Fixed bug where binary data could not be loaded
* Fixed a bug in the Jiugong grid rendering bug
* Fixed bug with multiple text rendering and text layouts
* Fixed bug where HTTP request could not send post request


### Known issues

Egret engine currently has the following features not yet support play a play platform

* Rendering related
    * Irregular mask
    * Bitmap text
    * Live screenshots
    * Bitmap cache
* Touch related
    * Pixel-level collision detection
    * Click through
* Text related
    * Fonts hyperlinks
    * Rich text
    * Font stroke
* Debug related
    * Dirty rectangle debugging display
    * fps monitor
    * Screen debug log



The above features are expected to be supported in next week's update.

At the same time, there are still some problems due to the fact that the bricks engine playing a play platform is currently under closed beta testing. Currently, we do not recommend developers to use the following functions on a play platform:

* WebSocket binary format
* Big data binary loading
* Bezier curve drawing
* Video playback

The above questions and we play a platform for the engineers to maintain close communication and strive to solve as soon as possible

## AssetsManager

* Fix loading gallery will lead to resource loader stuck BUG
* Fixed with ```sheet.subkey``` way to get gallery resource is not correct BUG

## 2D rendering - JavaScript

* Fix the graphics object settings filter does not show BUG
* Fix Bitmap settings texture may lead to error BUG