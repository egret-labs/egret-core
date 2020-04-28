# Egret Engine 5.3.5 Release Notes
The Egret Engine released the 5.3.5 stable version on April 28, 2020.

- **[NEW]** Increase the adaptation to egretPro, in egretPro you can use the version engine without modification
- **[NEW]** Added support for ttf font files
- **[NEW]** Support publishing 360 PC browser games
- **[FIX]** In Rectangle, whether contains and containsPoint returns different results for whether they include boundary points.
- **[FIX]** When the angle between the display object and the mask is 90 degrees, the wrong display problem
- **[FIX]** In the WeChat browser, when the input box is activated, after switching the front and back or after sharing the page, clicking anywhere can trigger the input box.
- **[FIX]** ios system drag the text box, the page will be dragged
- **[OPTIMIZE]** Optimized the sequence of engine initialization for Native, and now calling `egret.Capabilities.supportedCompressedTexture.etc1` in Native package to get compressed texture information will no longer report an error.
- **[OPTIMIZE]** The canvas rendering mode adds support for mesh rendering, mainly the mesh of dragonbones.
