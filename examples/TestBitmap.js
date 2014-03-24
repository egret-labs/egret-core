/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:16
 * To change this template use File | Settings | File Templates.
 */
function getResourceList(){
    return ["daisy.png"];
}

function getDescription(){
    return "这个项目展示了Bitmap的正常显示、位移、缩放、旋转、斜切";
}



function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");
//    container.setContentSize(10, 1

    var bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap1);
    bitmap1.x = bitmap1.y = 50;
    container.touchEnabled = true;
    bitmap1.touchEnabled = true;
    bitmap1.setContentSize(100,100)

    var bitmap2 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap2);
    bitmap2.x = 150;
    bitmap2.y = 50;
//    bitmap2.scaleX = bitmap2.scaleY = 0.5;

    var bitmap3 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap3);
    bitmap3.x = 50;
    bitmap3.y = 150;
//    bitmap3.rotation = 45;

    var bitmap4 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap4);
    bitmap4.x = 150;
    bitmap4.y = 150;
//    bitmap4.cacheAsBitmap(true);
//    bitmap4.skewX = 45;

    container.cacheAsBitmap(true);

}