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
    return "ns_egret.RenderFilter.getInstance().addDrawArea(new ns_egret.Rectangle(100,0,500,500));\n\n" +
        "ns_egret.MainContext.instance.rendererContext.canvasContext.setTransform(1, 0, 0, 1, 0, 0);" +
        "ns_egret.MainContext.instance.rendererContext.canvasContext.clearRect(0,0,500,500);\n\n" +
        "测试cacheAsBitmap:\n" +
        "container.cacheAsBitmap(true);\n" +
        "bitmap1.cacheAsBitmap(true);\n" +
        "bitmap2.cacheAsBitmap(true);\n" +
        "bitmap3.cacheAsBitmap(true);\n" +
        "bitmap4.cacheAsBitmap(true);\n\n" +
        "container.mask = {x:100,y:100,width:100,height:100}";
}

function createExample(){

    container = new ns_egret.DisplayObjectContainer();
    container.scaleX = 2;
    context.stage.addChild(container);
    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");

    bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap1);
    bitmap1.x = bitmap1.y = 50;

    bitmap2 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap2);
    bitmap2.x = 75;
    bitmap2.y = 75;

    bitmap3 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap3);
    bitmap3.scaleX = bitmap3.scaleY = 2;
    bitmap3.x = 50;
    bitmap3.y = 150;

    bitmap4 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap4);
    bitmap4.x = 250;
    bitmap4.y = 250;
    bitmap4.rotation = 90;

//    for(var i = 0 ; i < 1000;i++)
//    {
//        scaleBitmap = new ns_egret.Scale9Bitmap(texture);
//        scaleBitmap.setScaleGrid(15,15,35,35);
//        scaleBitmap.setContentSize(190,190);
//        scaleBitmap.x = 40;
//        scaleBitmap.y = 100;
//        container.addChild(scaleBitmap);
//    }
}