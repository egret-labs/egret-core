/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:47
 * To change this template use File | Settings | File Templates.
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
    left.addEventListener(ns_egret.TouchEvent.TOUCH_BEGAN,function (){
        console.log("点击左侧箭头");
    },left);
    left.touchEnabled = true;

    var right = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b5.png"));
    right.x = 150;
    container.addChild(right);
    right.addEventListener(ns_egret.TouchEvent.TOUCH_TAP,function (){
        console.log("点击右侧箭头");
    },right);
    right.touchEnabled = true;
}