/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:16
 * To change this template use File | Settings | File Templates.
 */
function getResourceList(){
    return [];
}

function getDescription(){
    return "这个项目展示了Ticker的各项功能";
}

function createExample(){
    var container = ns_egret.MainContext.instance.stage;
    var label = new ns_egret.TextField();
    container.addChild(label);
    ns_egret.Ticker.getInstance().callLater(function (){
        label.text = "Ticker";
    },this,3000);
}