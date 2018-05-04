# Egret Engine 5.1.11 Release Notes


---


The Egret Engine officially released version 5.1 in December 2017. On May 7, 2018, we will release version 5.1.11. This release is a centralized bug fix for version 5.1.



## 2D Rendering - JavaScript

* Fix the problem that the dirty data in MovieClip.play is not cleared (thanks to developer Xiaopeng Peng)
* Repairing the use of masks may render exceptions (thanks to developer eos3tion)
* Fix BitmapText setting text without checking the type of passed arguments (thanks to developer CaiBinQing)

## Command Line Tools
* Added eui skin commonjs2 mode to significantly reduce skin file size
* Fix linux system using command line error (thanks to developer joesonw)

## AssetsManager
* Fix SheetProcessor does not deal with the problem of the nine-square grid (Thanks to the developer Chen Zuhan)
* Fix SheetProcessor not releasing texture issue (thanks to red bean interaction)

## WeChat mini game
* Repair audio may not play
* Fix texture.saveToFile error
* Fixed HttpRequest failed to dispatch event in real machine environment