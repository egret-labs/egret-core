# Egret Engine 5.4.0 Release Notes
The Egret Engine released the 5.4.0 version on January 4 2021.

## 2D Rendering - JavaScript 
- **[NEW]** Add Taobao creative interactive platform - support of widget
- **[NEW]** Component add and remove data listening method unwatchall
- **[OPTIMIZE]** The rendering method is optimized for ios14
- **[OPTIMIZE]** The methods of build and run are optimized.
- **[FIX]** Fix the problem that Android phone can't be restored after switching to security keyboard
- **[FIX]** Repair RES.loadGroup  Encountered a load error that could not be captured
- **[FIX]** Fix the text display exception when the font size of rich text is 0 and the color is pure black (0x000000)
- **[FIX]** Fix the problem that the sound can't resume playing after the page loses focus
- **[FIX]** Fix the problem that getpixels gets data differently from canvas in webgl mode
- **[FIX]** Modify the socket library, provide the URI method, and modify the protocol to WSS / WS
- **[FIX]** Fix some abnormal playback status of gotoandplay method in MovieClip
- **[FIX]** Fix the usage exception in EUI commonjs mode
- **[FIX]** Fix the problem of image resource reloading of bitmap font
- **[FIX]** Fixed the problem that modifying the text does not trigger re rendering after the bitmap text cacheasbitmap
- **[FIX]** Fix the text input mechanism to prevent some input methods from being triggered many times 