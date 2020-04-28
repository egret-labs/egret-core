# Egret Engine 5.2.14 Release Notes


---


Egret Engine was officially released on May 25, 2018 5.2 stable version. On October 29, 2018, we will release a stable version of 5.2.14. This version has added support for baidugame.


## 2D Rendering - JavaScript

* Optimize the main loop logic, when the game code abnormal, the screen will not be black, the game can continue to run with the error.
* When generating manifest dependent files, add './' to the path
* HttpRequest supports loading local files via WebView on Android
* Fixes an issue where the position calculates an error bitmaptext with a offset value.

## Native

* Modified the way BitmapData references C + + objects on the native, which solves the problem that some texture memory will not be released when native rendering acceleration is turned on. The above modifications need to be used in conjunction with Egret Native 0.1.15.

## WeChat Game

* Fix the problem of using dual graphics memory when creating bitmap textures 
* Fixed an issue where an exception occurred when Context.measuretext was null.

## WeChat Html5

** In IOS12 's WeChat, in some cases, when a pop-up soft keyboard is recycled, the top-up game page does not fall. The problem engine is temporarily not processed and waits for WeChat repair. You can add a listener to the `<script>` tab of `index.html` to handle the exception:

```
document.body.addEventListener("blur",function(){
    window.scrollTo(0,0);
},true);
```
