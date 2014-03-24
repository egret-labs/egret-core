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
    return "Simple-GUI-TableView";
}


function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var scroll = new ns_egret.TableView();
    container.addChild(scroll);
    scroll.x = 200;
    scroll.y = 100;
    scroll.setContentSize(200, 240);
    scroll.setList([1, 2, 3, 4, 5, 6, 7, 8, 9], ns_egret.Direction.HORIZONTAL, this, 40, 40);
}

function createItemRenderer() {
    var item = new ns_egret.DisplayObjectContainer();
    var texture = ns_egret.TextureCache.getInstance().getTexture("b_1.png");
    var bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    item.addChild(bitmap1);

    return item;
}

