# Egret Engine 5.2.29 Release Notes
The Egret Engine released the 5.2.29 stable version on September 25, 2019.

This update mainly solves the problem that the sound is occupied in the memory. The small game platform adds support for the `egret.log` method.

## 2D Rendering - JavaScript 
- **[OPTIMIZE]** Fix problems where the RES module can't destroy sound
- **[OPTIMIZE]** Optimize the logic of destroying sound within the engine


## WeChat Game v1.2.10
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[NEW]** Sound system replaced with WeChat's native API
- **[OPTIMIZE]**  Increase disdestruction of sounds by calling WeChat's native API

## QQ Game v0.1.5
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[OPTIMIZE]**  Optimize the logic of destroying sound

## Baidu Game v0.2.8
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[OPTIMIZE]**  Optimize the logic of destroying sound

## Xiaomi QGame v0.2.10
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[OPTIMIZE]**  Optimize the logic of destroying sound

## OPPO Game v0.2.7
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[OPTIMIZE]**  Optimize the logic of destroying sound
- **[OPTIMIZE]**  Modify the `convertImageToCanvas` method in `WebTextuer` to native API

## vivo Game v0.2.11
- **[NEW]** Supports setting up `data-show-log` in `index.html` and output the log information via the `egret.log` method
- **[OPTIMIZE]**  Optimize the logic of destroying sound
- **[OPTIMIZE]**  Modify the `convertImageToCanvas` method in `WebTextuer` to native API
