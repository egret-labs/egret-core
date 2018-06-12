# Egret Engine 5.1.5 Release Notes


---

Egret engine was officially released in December 2017 version 5.1. This version is a centralized version of 5.1 bug fixes, the main goal is to improve WeChat mini games, AssetsManager stability.



## WeChat mini game

* Repair a bug that individual models will fade back, such as Millet MIX2
* Increase XML parsing function

## Bricks

### update content

This week, the egret engine has greatly improved the support for playing a game platform, focusing on the following problems:

* Support rich text
* Support font hyperlinks
* Support font stroke
* Support MovieClip
* Fixed localToGlobal / getBounds and other functions caused the problem
* Optimize Graphics performance
* Fixed Socket related BUG
* Fixed HTTP request related bug


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
* Debug related
    * Dirty rectangle debugging display
    * fps monitor
    * Screen debug log



The above features are expected to be supported in next week's update.

At the same time, there are still some problems due to the fact that the bricks engine playing a play platform is currently under closed beta testing. Currently, we do not recommend developers to use the following functions on a play platform:

* Bezier curve drawing
* Video playback

The above questions and we play a platform for the engineers to maintain close communication and strive to solve as soon as possible

## AssetsManager

* Repair resourceRoot can only set a BUG

## 2D rendering - JavaScript

* Fixed Mesh does not support texture rotation issues
* Fixed BitmapText may lead to internal engine error
* Fixed eui virtual layout may create too many object problems
* Fixed egret.ByteArray.readBytes function will cause bytesAvailable exception
* Fixed eui.BitmapLabel repeat set font font loading disorder can cause fonts
* Fixed the problem of offset in the rendering of the display object of the setup filter

## Command Line Tools

* Added CleanPlugin plugin
* Added RenamePlugin plugin