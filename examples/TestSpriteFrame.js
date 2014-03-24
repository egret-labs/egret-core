function getResourceList(){
    return ["icons.png","icons.json"];
}

function getDescription(){
    return "SpriteFrame";
}

function createExample(){
    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var data = ns_egret.ResourceLoader.create("icons.json").data;
    var texture = ns_egret.TextureCache.getInstance().getTexture("icons.png");

    var spriteSheet = new ns_egret.SpriteSheet(data);
    var bitmap = new ns_egret.Bitmap();
    bitmap.texture = texture;
    bitmap.spriteFrame = spriteSheet.getFrame("activity_10.png");
    container.addChild(bitmap);

}