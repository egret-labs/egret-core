Egret Engine 5.0.10 Release Note
===============================

Latest update: October 23, 2017


Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates

* 2D rendering - JavaScript
	* Cancel on the PC canvasScaleFactor defaults to 2 settings
	* Fix Tween.removeAllTweens after the internal counter does not have to reset the bug (Thanks to the bbs developer derek6616)
	* Repair the projection and lighting filters at the same time using the cause of the light filter exception (Thanks to the bbs developer zyy)
	* Reconstruct the canvasScaleFactor implementation mechanism, no longer create too large canvas
	* Import file introduces calculateCanvasScaleFactor function, developers can calculate their own canvasScaleFactor

* DragonBones - JavaScript
	* Fixed bug where the map was individually scaled and the global zoom was misaligned
	* Repairing an array of traverses may cause an error in the array error (Thanks to the bbs developer gepan)
	* Repair the mesh rectangle area may not be updated correctly (Thanks to the 游心乐动 developer)
	* Fixing shared maps with the same name may cause animations to display incorrect errors

## Known Issues

* developers using WebAssembly renderer will now create object times errors at the class's static variable declarations

## Restructured canvasScaleFactor mechanism
canvasScaleFactor is a mechanism introduced to solve the blurring problem of pictures and fonts and its underlying implementation is to create a larger canvas to draw on . Previous versions of the engine may slow down on some devices because the canvas created by this property is too large. In this update, the canvas the engine creates will not exceed  the resolution of the device by default. 
 
At the same time, we added calculateCanvasScaleFactor method in runEgret of index.html template and  developers can modify the scaling strategy according to different requirements. 

```
egret.runEgret({
    renderMode: "webgl", audioType: 0,
    calculateCanvasScaleFactor: function (context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
});
```

## Tween.removeAllTweens
When Tween is added and deleted internally, there will be an internal variables to record how many Tweens of an object are in effect at the same time. This variable should be set to 0 in the Tween.removeAllTweens method, but the previous versions did not correctly set this, which could cause a lot of problems. We fixed this bug in this update.
 
## The compatibility issue of lighting and shadow filters
The lighting filter and shadow filter share the same Shader and the shadow filter has more parameters  than the lighting filter. Previous version of the engine didn’t reset these parameters after using filters, which resulted in some dirty data not being cleared after using shadow filters and then leading to rendering exception when lighting filter was used. In this update, we cleared dirty data from using  filters.