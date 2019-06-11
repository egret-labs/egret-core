# Egret Engine 5.2.21 Release Notes
The Egret Engine released the 5.2.21 stable version on June 11, 2019.

## 2D Rendering - JavaScript 
- **[new]** `KTX` Texture storage format supports filters
- **[new]** `KTX` Texture storage format supports `Baidu minigame`, `Xiaomi qgame`, `oppo minigame`
- **[optimize]** Optimize memory management on WeChat minigame
- **[fix]** `URLLoader` loads pictures in WeChat games report wrong problem


* The status of the `KTX` texture support for the minigame platforms:


system/palform | WeChat minigame | Baidu minigame | Xiaomi qgame | OPPO minigame
------------- | ------------- | -------------| -------------| -------------
Android ETC1  | ✅ | ✅| ✅| ✅
iOS PVRTC  | ✅ | ❌ | ❌ | ❌ 
