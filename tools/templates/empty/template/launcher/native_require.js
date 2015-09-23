var game_file_list = [
    {{~it.nativeScripts :value:index}}
    {{? index != 0}},{{?}}"{{=value}}"
    {{~}}
];
var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        entryClassName: "{{=it.entryClass}}",
        frameRate: {{=it.frameRate}},
        scaleMode: "{{=it.scaleMode}}",
        contentWidth: {{=it.contentWidth}},
        contentHeight: {{=it.contentHeight}},
        showPaintRect: {{=it.showPaintRect}},
        showFPS: {{=it.showFPS}},
        fpsStyles: "{{=it.fpsStyles}}",
        showLog: {{=it.showLog}},
        logFilter: "{{=it.logFilter}}",
        maxTouches: {{=it.maxTouches}},
        textureScaleFactor: {{=it.textureScaleFactor}}
    };
    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};