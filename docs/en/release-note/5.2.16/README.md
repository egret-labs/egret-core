# Egret Engine 5.2.16 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On March 18, 2019, we will release a stable version of 5.2.16.


## 2D Rendering - JavaScript
* Fix the problem of `egret.Timer` that does not terminate in the event of a game logic error
* Fix the problem of `egret.setTimeout` that does not terminate in the event of a game logic error
* Change some error information from `alert` method to `egret.log` method
* Perfect the event handling in EUI `DataGroup` and increase the error information of abnormal events
* Fix `HttpRequest` load error when `IO_ERROR` event is not thrown
* Fix the problem of calculating errors when `letterSpacing` in `BitmapText` is negative.
* Added compatibility support for sound on `Edge` and `IE11` browsers
* Fix `EUI` `EditableText` in `PC` browser, there will also be an issue with the input box after scrolling

## WeChat Game v1.1.11
* Optimize the performance of iOS platform
* Fix the problem of `egret.Capabilities.os` return value error 
* Fix the problem of `egret.Capabilities.language` return value error 

## Baidu Game v0.1.5
* Optimize the performance of iOS platform
* Fix the problem of `egret.Capabilities.isMobile` return value error 
