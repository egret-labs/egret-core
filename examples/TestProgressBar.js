/**
 * Created by JunAFa on 14-3-4.
 */
function getResourceList(){
    return ["bar.png"];
}

function getDescription(){
    return "进度条";
}

function createExample(){
    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var bar = new ns_egret.ProgressBar("bar.png");
    bar.x = 200;
    bar.y = 200;
    container.addChild(bar);
    bar.setProgress(100,200);
}