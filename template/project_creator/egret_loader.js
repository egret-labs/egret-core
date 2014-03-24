/**
 * Created by apple on 14-2-27.
 */


var egret_h5 = {


    prefix:"",

    loadScript: function (list, callback) {
        var loaded = 0;
        var d = document;
        if (navigator.userAgent.indexOf("Trident/5") > -1) {
            //ie9
            var i = -1;
            var loadNext = function () {
                i++;
                if (i < list.length) {
                    var f = d.createElement('script');
                    f.src = egret_h5.prefix + list[i];
                    f.addEventListener('load', function () {
                        loadNext();
                        loaded++;
                        if (loaded >= list.length) {
                            callback();
                        }
                        this.removeEventListener('load', arguments.callee, false);
                    }, false);
                    d.body.appendChild(f);
                }
            };
            loadNext();
        }
        else {
            list.forEach(function (f, i) {
                var s = d.createElement('script');
                s.async = false;
                s.src = egret_h5.prefix + f;
                s.addEventListener('load', function () {
                    loaded++;
                    if (loaded >= list.length) {
                        callback();
                    }
                    this.removeEventListener('load', arguments.callee, false);
                }, false);
                d.body.appendChild(s);
            });
        }

    },


    startGame: function () {

        var canvas = document.getElementById(ns_egret.StageDelegate.canvas_name);
        context = ns_egret.MainContext.instance;
        context.rendererContext = new ns_egret.HTML5CanvasRenderer(canvas);

        context.touchContext = new ns_egret.TouchContext(canvas);
        context.stage = new ns_egret.Stage();

        ns_egret.ResourceLoader.prefix = "assets/480/";
        ns_egret.RendererContext.CONTENT_SCALE_FACTOR = 1;

        ns_egret.NetContext.context = new ns_egret.HTML5NetContext();
        ns_egret.SoundContext.context = new ns_egret.HTML5SoundContext();
//    ns_egret.StageDelegate.getInstance().setResolutionPolicy(1);
//    ns_egret.StageDelegate.getInstance().setFrameSize(480,400);
//    ns_egret.StageDelegate.getInstance().setDesignSize(480,400,2);
        context.run();

        app.startGame();
    }
}
