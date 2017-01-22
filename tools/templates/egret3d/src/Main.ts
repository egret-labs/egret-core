@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var type = "";
    if (path.indexOf("3d") >= 0) {
        type = "unit";
    } else {
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
            if (path.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (path.indexOf("movieclip") >= 0) {
                type = "movieclip";
            };
        }
    }
    return type;
})
class Main extends egret.DisplayObject {

    constructor() {
        super();

        utils.map();
        this.once(egret.Event.ADDED_TO_STAGE, async () => {

            // 创建Egret3DCanvas，传入 2D stage，将开启混合模式
            var context3d = new egret3d.Egret3DCanvas(this.stage);
            egret.setRendererContext(context3d);
            let game = new GameScene(context3d);
            await this.loadAssets()
            game.createGameScene();

        }, this);


    }


    private async loadAssets() {

        async function load(resources: string[]) {
            for (let r of resources) {
                await RES.getResAsync(r);
            }
        }
        try {
            let loading = new LoadingUI();
            this.stage.addChild(loading);
            await RES.loadConfig();
            let resources = [
                "3d/background.jpg",
                "3d/0_Model/Esm/Zhouyu.esm",
                "3d/0_Model/Eam/attack.eam",
                "3d/0_Model/Eam/idle.eam",
                "3d/0_Model/Texture/hero_01.png"
            ];
            await load(resources);
            this.stage.removeChild(loading)
        }
        catch (e) {
            alert(e.message)
        }
    }
}

namespace utils {

    function promisify(loader: egret3d.UnitLoader, url: string) {
        return new Promise((reslove, reject) => {
            loader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, () => {
                reslove(loader.data);
            }, this);
            loader.load("resource/" + url);
        });
    }

    export function map() {

        RES.processor.map("unit", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url)
            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });
    }

}