/**
 * Created by apple on 14-2-27.
 */

egret_h5 = {};

egret_h5.prefix = "";

egret_h5.loadScript = function (list, callback) {
    var loaded = 0;
    if (navigator.userAgent.indexOf("Trident/5") > -1) {
        //ie9
        var loadNext = function () {
            egret_h5.loadSingleScript(egret_h5.prefix + list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    callback();
                }
                else {
                    loadNext();
                }
            })
        };
        loadNext();
    }
    else {
        list.forEach(function (f, i) {

            egret_h5.loadSingleScript(egret_h5.prefix + f, function () {
                loaded++;
                if (loaded >= list.length) {
                    callback();
                }
            })
        });
    }
}

egret_h5.loadSingleScript = function (src, callback) {
    var s = document.createElement('script');
    if (s.hasOwnProperty("async")) {
        s.async = false;
    }
    s.src = src;
    s.addEventListener('load', function () {
        this.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
}

egret_h5.startGame = function () {
    var canvas = document.getElementById(ns_egret.StageDelegate.canvas_name);
    context = ns_egret.MainContext.instance;
    context.rendererContext = new ns_egret.HTML5CanvasRenderer(canvas);
    context.netContext = new ns_egret.HTML5NetContext();
    context.soundContext = new ns_egret.SoundContext();
    context.touchContext = new ns_egret.TouchContext(canvas);
    context.stage = new ns_egret.Stage();

    ns_egret.ResourceLoader.prefix = "assets/480/";
    ns_egret.RendererContext.CONTENT_SCALE_FACTOR = 1;

//    ns_egret.StageDelegate.getInstance().setResolutionPolicy(1);
//    ns_egret.StageDelegate.getInstance().setFrameSize(480,400);
//    ns_egret.StageDelegate.getInstance().setDesignSize(480,400,2);
    context.run();

    if (app && app.startGame) {
        app.startGame();
    }
}

egret_h5.preloadScript = function (list, prefix) {
    if (!egret_h5.preloadList) {
        egret_h5.preloadList = [];
    }
    egret_h5.preloadList = egret_h5.preloadList.concat(list.map(function (item) {
        return prefix + item;
    }))
}

egret_h5.startLoading = function () {
    var list = egret_h5.preloadList;
    egret_h5.loadScript(list, egret_h5.startGame);
}