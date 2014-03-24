function getResourceList(){
    return ["daisy.png"];
}

function getDescription(){
    return "这个项目展示了box2d";
}

function createExample(){
    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");
    var scaleBitmap = new ns_egret.Scale9Bitmap(texture);
    scaleBitmap.setScaleGrid(5,5,5,5);
    scaleBitmap.setContentSize(200,200);
    scaleBitmap.x = 200;
    scaleBitmap.y = 200;
    container.addChild(scaleBitmap);
}