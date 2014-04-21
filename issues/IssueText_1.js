/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:34
 * To change this template use File | Settings | File Templates.
 */

function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);


    ns_egret.DEBUG.TRACE_RENDER_LOOP(0);

    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 200;
    colorLabel.y = 50;
//    colorLabel.width = colorLabel.height = 0;
    colorLabel.relativeAnchorPointX = 0.5;
    colorLabel.relativeAnchorPointY = 0.5;
    colorLabel.textColor = 0xff0000;
    colorLabel.textAlign = "left";
    colorLabel.text = "这是多行文本\n这个文本会抖动";
    container.addChild(colorLabel);

    label = colorLabel;


    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 200;
    colorLabel.y = 150;
//    colorLabel.width = colorLabel.height = 0;
    colorLabel.relativeAnchorPointX = 0;
    colorLabel.relativeAnchorPointY = 0.5;
    colorLabel.textColor = 0xff0000;
    colorLabel.textAlign = "left";
    colorLabel.text = "这是多行文本\n这个文本会抖动";
    container.addChild(colorLabel);

}

var label;

function getResourceList(){
    return [];
}

function getDescription(){
    return "在创建TextField的瞬间，如果anchorPoint不为0，TextField会'抖动'一下\n已解决";
}