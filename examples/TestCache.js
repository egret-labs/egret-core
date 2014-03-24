/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:16
 * To change this template use File | Settings | File Templates.
 */
function getResourceList(){
    return ["daisy.png", "b_1.png", "b_2.png"];
}

function getDescription(){
    return "这个项目展示了Bitmap的Cache";
}



function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");
//    container.setContentSize(1000, 1000);


    var text = new ns_egret.TextField();
    text.text = "HelloWorld";
//    container.addChild(text);
    text.x = text.y = 150;
    text.setContentSize(100,100);



    var bitmap = new ns_egret.Bitmap();
    bitmap.texture = texture;
    container.addChild(bitmap);
    bitmap.x = bitmap.y = 150;

    container.cacheAsBitmap(true);
//    text.cacheAsBitmap(true);


}