@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var type = "";
    if (path == "ui/fonts.json") {
        type = "3d-font";
    } else if (path == "ui/GUI.json") {
        type = "gui";
    } else if (path == "config.json") {
        type = "json";
    } else {
        if (path.indexOf("2d/") >= 0) {
            let ext = path.substr(path.lastIndexOf(".") + 1);
            let typeMap = {
                "jpg": "image",
                "png": "image",
                "webp": "image",
                "json": "json",
                "fnt": "font",
                "pvr": "pvr",
                "mp3": "sound"
            }
            type = typeMap[ext];
            if (type == "json") {
                if (path.indexOf("png") < 0) {
                    type = "sheet";
                } else if (path.indexOf("movieclip") >= 0) {
                    type = "movieclip";
                };
            }
        } else {
            type = "unit";
        }
    }
    return type;
})
class Main extends egret.DisplayObject {

    constructor() {
        super();

        let promisify = (loader: egret3d.UnitLoader, url: string) => {
            return new Promise((reslove, reject) => {
                loader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, () => {
                    reslove(loader.data);
                }, this);
                loader.load("resource/" + url);


            });
        }

        RES.processor.map("3d-font", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url).then((value) => {
                    let textures = egret3d.textureResMgr.getTextureDic();
                    egret3d.gui.BitmapFont.load(textures);
                    return value;
                })

            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        })

        RES.processor.map("gui", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url).then((value) => {
                    egret3d.gui.GUISkinManager.instance.initDefaultSkin();
                    return value;
                })

            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });


        RES.processor.map("unit", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url)
            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });
        this.once(egret.Event.ADDED_TO_STAGE, () => {
            this.loadAssets().then(
                () => {
                    // 创建Egret3DCanvas，传入 2D stage，将开启混合模式
                    var context3d = new egret3d.Egret3DCanvas(this.stage);
                    egret.setRendererContext(context3d);
                    let game = new GameScene(context3d);
                    game.createGameScene();
                }
            )
        }, this)


    }


    private async loadAssets() {
        try {
            let loading = new LoadingUI();
            this.stage.addChild(loading);
            await RES.loadConfig();
            let resources = ["ui/GUI.json", "ui/fonts.json", "EgretLoadingPage.jpg"];
            RES.createGroup('preload', resources);
            RES.loadGroup('preload', 0, loading);
            this.stage.removeChild(loading)
        }
        catch (e) {
            alert(e.message)
        }
    }
}     