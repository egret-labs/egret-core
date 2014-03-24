/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */
function getResourceList(){
    return ["b1.png","b5.png"];
}

function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var move = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b1.png"));
    move.x = 50;
    move.y = 50;
    container.addChild(move);
    ns_egret.Tween.get(move,{loop:true}).to({x:250},2000).to({x:50},2000).call(function (){
        console.log("Hello,Tween!");
    });

    var alpha = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b1.png"));
    alpha.x = 250;
    alpha.y = 50;
    container.addChild(alpha);
    ns_egret.Tween.get(alpha,{loop:true}).to({alpha:0},1000).to({alpha:1},1000);

    var rotation = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("b1.png"));
    rotation.x = 150;
    rotation.y = 150;
    container.addChild(rotation);
    ns_egret.Tween.get(rotation,{loop:true}).to({rotation:360},2000).wait(500);
}

function getDescription(){
    return "这个项目展示了Tween的位移，淡入淡出，旋转，并行，串行，延迟，回调";
}