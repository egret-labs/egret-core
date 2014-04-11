var app = {

    startGame: function () {


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


        if(true) {//480
            ns_egret.ResourceLoader.prefix = "assets/480/";
            ns_egret.MainContext.instance.rendererContext.texture_scale_factor = 1;
        }
        else {
            ns_egret.ResourceLoader.prefix = "assets/240/";
            ns_egret.MainContext.instance.rendererContext.texture_scale_factor = 2;
        }

//        ns_egret.RendererContext.CONTENT_SCALE_FACTOR = 1;
        ns_egret.ResourceLoader.registerHandler("png", ImageResourceLoader);
        ns_egret.ResourceLoader.registerHandler("jpg", ImageResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("plist", PlistResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("xml", PlistResourceLoader);
//        ns_egret.ResourceLoader.registerHandler("fnt", PlistResourceLoader);
        ns_egret.ResourceLoader.registerHandler("json", JsonResourceLoader);


        window.testDescription.value = getDescription();
        window.exampleTextArea.value = createExample.toString();
        var loadingController = new ns_egret.LoadingController();
        var list = getResourceList();
        list.forEach(function (url) {
            loadingController.addResource(url, ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
        })
        loadingController.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.handleComplete, this);
        loadingController.load();

        ns_egret.Profiler.getInstance().run();
    },


    handleComplete: function () {
        createExample();
    }

}

