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
    return "这个项目展示了TabView的操作";
}



function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var tab = new ns_egret.TabView();
    for (var i = 0; i < 5; i++) {
        var btn = new ns_egret.SimpleButton();
        btn.relativeAnchorPointX = 0.5;
        btn.relativeAnchorPointY = 0.5;

        tab.addChild(btn);
        var texture1 = ns_egret.TextureCache.getInstance().getTexture("b_1.png");
        var frame1 = ns_egret.Bitmap.initWithTexture(texture1);
        frame1.relativeAnchorPointX = 0.5;
        frame1.relativeAnchorPointY = 0.5;
        var rect = frame1.getBounds();
        btn.setContentSize(rect.width, rect.height);
        frame1.x = rect.width / 2;
        frame1.y = rect.height / 2;
        btn.addChild(frame1);
        btn.initFrameRes("b_1.png", 1, frame1);
        btn.x = 50 + i * 80;
        btn.y = 250;
    }
    tab.init();
    tab.setDefaultTag(1);

    var tagCall = function (tag) {

    }
    tab.addOnClick(tagCall, this);

    container.addChild(tab);
}