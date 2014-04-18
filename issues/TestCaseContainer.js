var app = {

    startGame: function () {


        /**
         * Created by apple on 14-2-7.
         */
        var ImageResourceLoader = (function (_super) {
            __extends(ImageResourceLoader, _super);
            function ImageResourceLoader(src) {
                _super.call(this, src, ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
            }
            ImageResourceLoader.prototype.onLoadComplete = function (data) {
            };
            return ImageResourceLoader;
        })(ns_egret.ResourceLoader);

        var JsonResourceLoader = (function (_super) {
            __extends(JsonResourceLoader, _super);
            function JsonResourceLoader(src) {
                _super.call(this, src, ns_egret.ResourceLoader.DATA_TYPE_TEXT);
            }
            JsonResourceLoader.prototype.onLoadComplete = function (data) {
                this.data = JSON.parse(data);
            };
            return JsonResourceLoader;
        })(ns_egret.ResourceLoader);

        window.testDescription.value = getDescription();
        window.exampleTextArea.value = createExample.toString();


        ns_egret.ResourceLoader.prefix = "assets/";
        ns_egret.ResourceLoader.registerHandler("png", ImageResourceLoader);
        ns_egret.ResourceLoader.registerHandler("jpg", ImageResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("plist", PlistResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("xml", PlistResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("fnt", PlistResourceLoader);
        ns_egret.ResourceLoader.registerHandler("json", JsonResourceLoader);

        var loadingController = new ns_egret.LoadingController();
        var list = getResourceList();
        list.forEach(function (url) {
            loadingController.addResource(url, ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
        })
        loadingController.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.handleComplete, this);
        loadingController.load();



    },


    handleComplete: function () {
        createExample();
    }

}


var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};


