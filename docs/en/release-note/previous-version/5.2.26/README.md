# Egret Engine 5.2.26 Release Notes
The Egret Engine released the 5.2.26 stable version on August 15, 2019.

## 2D Rendering - JavaScript 
- **[optimize]** Optimize EXML publishing as commjs
- **[optimize]** Optimize the performance of the `getResAsync` approach in the `AssetsManager` resource management module
- **[other]** Remove `experimental` library

## Egret Native v0.1.20
- **[fix]** TouchMove event may be out of order
- **[fix]** egret.RenderTexture.toDataURL returns undefined
- **[fix]** Access resources in assets directory after jumping to thirdparty Activities may cause crash
- **[fix]** Text with partial properties set may cause drawing errors when native render is enabled

## WeChat Game v1.2.4
- **[optimize]** Websocket replaced with WeChat System Native API
- **[fix]** Fix an issue where Android sound doesn't loop

## Baidu Game v0.2.5
- **[fix]** Fix an issue where ktx displays errors in mixing with filters
- **[optimize]** Supports displaying frame rates after compiling into Baidu mini-games by setting `data-show-log="true"` in `index.html`.

## OPPO Game v0.2.4
- **[fix]** Fix an issue where ktx displays errors in mixing with filters
- **[fix]** Fix the resource cache module, loading sound error problem

## vivo Game v0.2.5
- **[fix]** Fix an issue where ktx displays errors in mixing with filters

## Xiaomi QGame v0.2.7
- **[fix]** Fix an issue where ktx displays errors in mixing with filters
- **[optimize]** Resource Cache Module Sound Loading Process
