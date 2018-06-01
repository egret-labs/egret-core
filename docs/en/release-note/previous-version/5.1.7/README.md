# Egret Engine 5.1.7 Release Notes


---


The Egret Engine officially released version 5.1 in December 2017. On March 15, 2018, we will release version 5.1.7. This release is a feature update and concentration bug fix for version 5.1. The main goal is to add support for the Facebook Instant Games SDK.



## 2D Rendering - JavaScript

* Added Facebook Instant Games SDK
* Fix GlowFilter display exceptions on iOS devices
* Fixed an anomaly in the case of scale 0 (thanks to developer zyy)
* Fixed issue where ColorMatrixFilter renders exceptions in specific situations (thanks to developer zyy)

## AssetsManager
* Fix the problem of loading fonts using getResByUrl (Thanks Developer 43714946)

## Third-party libraries
* Fixed mouse library MOUSE_MOVE event dispatch exception (thanks to developer zyy)