# Egret Engine 5.1.6 Release Notes


---


The Egret Engine officially released version 5.1 in December 2017. On March 12, 2018, we will release version 5.1.6. This release is a feature update and concentration bug fix for version 5.1. The main goal is to add new iOS/Android App packaging support and improve the stability of WeChat games, QQ games, and AssetsManager.


## iOS / Android Native Package

In the Egret Launcher released in this update, we integrated the publishing settings of the iOS and Android platforms in the publishing settings.



The 2.0 version of the Egret Engine released since the end of 2014 has already supported developers to pack games into iOS/Android apps and publish them on the native platform. In addition, we launched a micro-end solution in 2017. In this update, we switched the underlying kernel of iOS/Android Support to a micro-kernel and added a new NativeRenderer mechanism, which greatly improved the rendering performance of the packaged App.


The reason for this major improvement is because in the previous iOS/Android Support, the native kernel provided the optimized HTML5 Canvas2D/WebGL rendering interface, but the core rendering driver is still executed by the JavaScript logic. With the introduction of NativeRenderer, the rendering-driven logic was migrated from the JavaScript side to the Native C++ side. This would greatly reduce the burden on the JavaScript engine, especially on all iOS devices and low-end Android devices.


Note that since the rendering driver on iOS/Android is migrating to the native side, developers can no longer modify the rendered rendering behavior through the Hack engine's JavaScript code. This is equivalent to the sacrifice of some flexibility for higher performance. If developers want to retain this flexibility, you can also force the closure of NativeRenderer , still using the previous mechanism.



## 2D Rendering - JavaScript

* After repairing a dashed line, all subsequent dashes are dashed BUGs (thanks to developer gaokun)
* Fix Dragon Bone Mesh render rendering bug under certain conditions (thanks to "Pig" R&D team)

## AssetsManager

* Now you can set different resource loading root paths for different resource configuration files. In conjunction with the ResSplitPlugin plugin, you can use it to more easily solve the 4M resource package limitation of WeChat games.


## WeChat mini game

* Add support for canvas2d mode rendering to solve the issue of partial webgl mode rendering errors in WeChat games for some devices
* Fix bugs where resources fail to load on real machine under specific conditions


## Bricks

* Fixed BitmapText font offset.
* Increased the background of the bottom, in the startup item to increase the setting of the background color.
* Fixed invalid problem with DisplayObject scrollRect.
* Fixed an issue with the display error of the EUI scroller.