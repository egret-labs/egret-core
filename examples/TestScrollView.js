/* Created with JetBrains WebStorm.
 * User: yjtx
 * Date: 14-2-28
 * Time: 14-2-28
 * 
 */
function getResourceList() {
    return ["sprite_sheet.png", "b_1.png", "b_2.png"];
}

function getDescription() {
    return "这个项目展示了Bitmap的正常显示、位移、缩放、旋转、斜切";
}


function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var scroll = new ns_egret.ScrollView();
    container.addChild(scroll);
    scroll.x = 200;
    scroll.y = 100;
    scroll.setContentSize(200, 240);
    scroll.direction = ns_egret.Direction.HORIZONTAL;
    scroll.touchEnabled = false;

    var child = new ns_egret.DisplayObjectContainer();
    var texture = ns_egret.TextureCache.getInstance().getTexture("sprite_sheet.png");
    var bitmap = ns_egret.Bitmap.initWithTexture(texture);
    child.addChild(bitmap);
    var size = bitmap.getBounds();
    scroll.setContainer(child, size.width, size.height);

}