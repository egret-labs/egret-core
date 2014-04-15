/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function getResourceList(){
    return ["b1.png","b5.png"];
}

function getDescription(){
    return "这个项目展示了多个显示对象（包含复杂嵌套）的事件触发，事件机制参考Flash显示列表事件流";
}

function createExample(){


    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
    container.scaleX = container.scaleY = 1.5;
    container.rotation = 45;

    var left = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b1.png"));
    left.x = 100;
    container.addChild(left);
    left.addEventListener(ns_egret.TouchEvent.TOUCH_TAP,function (){
        console.log("点击左侧箭头");
    },left);
    left.touchEnabled = true;

    var right = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b5.png"));
    right.x = 150;
    container.addChild(right);
    right.addEventListener(ns_egret.TouchEvent.TOUCH_TAP,function (){
        console.log("点击右侧箭头");
    },right);

    container.addEventListener(ns_egret.TouchEvent.TOUCH_TAP,function(){
        console.log ("容器冒泡侦听");
    },container);


    container.addEventListener(ns_egret.TouchEvent.TOUCH_TAP,function(){
        console.log ("容器捕获侦听");
    },container,true);
    right.touchEnabled = true;
}