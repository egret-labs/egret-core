@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "webp": "image",
        "json": "json",
        "fnt": "font",
        "pvr": "pvr",
        "mp3": "sound"
    }
    var type = typeMap[ext];
    if (type == "json") {
        if (path.indexOf("sheet") >= 0) {
            type = "sheet";
        } else if (path.indexOf("movieclip") >= 0) {
            type = "movieclip";
        };
    }
    return type;
})
class Main extends egret.DisplayObjectContainer {

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, async event => {
            let loadingUI = new LoadingUI();
            this.addChild(loadingUI);
            try {
                //  使用 async / await 语法处理资源加载，无需复杂的事件侦听函数或者回调函数嵌套
                await RES.loadConfig();
                //  虽然没有显式声明 LoadingUI implements PromiseTaskReporter，
                //  但是 LoadingUI 事实上实现了 PromiseTaskReporter 接口，
                //  这就已经可以通过 RES.loadGroup(groupName,priority,reporter) 的类型检查
                await RES.loadGroup("preload", 0, loadingUI);
            }
            catch (e) {
                // RES.loadConfig 、RES.loadGroup 相关逻辑的报错都会执行到此处逻辑
                alert(e)
            }
            this.createGameScene();
            this.removeChild(loadingUI);

        }, this);
    }

    private createGameScene() {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
    }

    /**
     * 通过类型推断，这个函数的返回值为 egret.Bitmap，无需开发者手动设置
     */
    private createBitmapByName(name: string) {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}


