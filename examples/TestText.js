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




    var colorLabel = new ns_egret.TextField();
//    colorLabel.setContentSize(0, 0);
    colorLabel.textColor = "#ff0000";
    colorLabel.textAlign = "left";
    colorLabel.text = "这是一段居左的文字\n可以支持多行";
    container.addChild(colorLabel);


    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 0;
    colorLabel.y = 100;
    colorLabel.setContentSize(120, 0);
    colorLabel.textColor = "#ff0000";
    colorLabel.textAlign = "center";
    colorLabel.text = "这是一段居中的文字，宽度设置120,字号设置30px,所以正好显示4个";
    container.addChild(colorLabel);


    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 400;
    colorLabel.y = 250;
    colorLabel.setContentSize(160, 0);
    colorLabel.relativeAnchorPointX = 1;
    colorLabel.textColor = "#FFFFFF";
    colorLabel.textAlign = "right";
    colorLabel.text = "这个文字居右对齐";
    container.addChild(colorLabel);



    var strokeLabel = new ns_egret.TextField();
    strokeLabel.x = 400;
    strokeLabel.y = 20;
    strokeLabel.textColor = "#FFFFFF";
    strokeLabel.text = "描边";
    strokeLabel.strokeColor = "#FF0000";
    strokeLabel.stroke = 2;
    container.addChild(strokeLabel);


}

function getResourceList(){
    return [];
}

function getDescription(){
    return "这个项目展示了文本的字号、颜色、自动换行";
}