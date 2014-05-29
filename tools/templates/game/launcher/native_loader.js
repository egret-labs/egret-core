var console = {};
console.log = function (message) {
    egtlog(message);
}


egret_native.egtMain = function () {
    require("bin-debug/lib/egret_file_list.js");
    require("bin-debug/src/game_file_list.js");
    for (var key in egret_file_list) {
        var src = "bin-debug/lib/" + egret_file_list[key];
        require(src);

    }
    for (var key in game_file_list) {
        var src = "bin-debug/src/" + game_file_list[key];
        require(src);
    }


    var context = egret.MainContext.instance;
    context.rendererContext = new egret.NativeRendererContext();
    context.netContext = new egret.NativeNetContext();
    context.touchContext = new egret.NativeTouchContext();
    context.deviceContext = new egret.NativeDeviceContext();

    egret_native.EGTView.setDesignSize(480, 800);
    context.stage = new egret.Stage(480, 800);
    egret.RendererContext.CONTENT_SCALE_FACTOR = 1;

    context.run();

    var rootClass;
    if(document_class){
        rootClass = egret.getDefinitionByName(document_class);
    }
    if(rootClass) {
        var rootContainer = new rootClass();
        if(rootContainer instanceof egret.DisplayObject){
            context.stage.addChild(rootContainer);
        }
        else{
            throw new Error("文档类必须是egret.DisplayObjectContainer的子类!");
        }
    }
    else{
        throw new Error("找不到文档类！请在game_file_list.js指定文档类的完全限定名。");
    }
}
