# Egret Engine 5.2.18 Release Notes


---

On April 15, 2019, Egret Engine will release a stable version of 5.2.18.

## 2D Rendering - JavaScript
- **[new]** Support for publishing for Xiaomi quickgame
- **[optimize]** Perfecting the method of `navigator` '` judgment
- **[fix]** The `exml` overwrites the original property when it is released as `commonjs`


## Native
- **[fix]** Particle system maybe enter infinite loop, when native render is enabled
- **[fix]** RenderTexture maybe crash, when native render is enabled
- **[new]** Android: add immersive mode and cutout support
- **[optimize]** Android: template project add configure to prevent reload of runtime
- **[fix]** Android: text size maybe not right on some devices
- **[fix]** Android: input maybe blocked by keyboard, when fps panel is not open
- **[optimize]** iOS: hide keyboard when press done button, in single line input
- **[fix]** iOS: text cut when using bold text
