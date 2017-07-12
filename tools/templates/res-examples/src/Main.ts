/**
 * 
 *
 * 编译器和运行时都会处理此处逻辑。
 * 为了保证编译器更方便提取出此处逻辑，使用ECMAScript 2015 装饰器语法
 *
 * 在编译时（ 执行 res build ），命令行会遍历 resource 文件夹中的所有文件，
 * 将其中每个文件执行 RES.mapConfig 中第三个参数所对应的函数。
 * 如果函数返回值不为空，则被添加到资源配置中。
 * 资源配置最终会写入 RES.mapConfig 的第一个参数所对应的文件中
 *
 * 在运行时，资源管理框架会首先加载 RES.mapConfig 第一个参数所对应的配置文件，
 * 之后加载的每一个文件，都会通过 RES.mapConfig 的第三个参数去确认加载类型，
 * 进而用对应类型的处理器进行预处理（ 如图片处理，JSON解析等）
 * 最后再将处理后的最终结果返回给用户
 */
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
        this.addEventListener(egret.Event.ADDED_TO_STAGE, event => {

            //异步函数会返回一个 Promise            
            this.loadAssets()
                .then(() => {
                    this.createGameScene();
                })
                .catch(e => {
                    // RES.loadConfig 、RES.loadGroup 相关逻辑的报错都会执行到此处逻辑
                    console.error(e);
                })

        }, this);
    }

    private async loadAssets() {
        let loadingUI = new LoadingUI();
        this.addChild(loadingUI);
        //  使用 async / await 语法处理资源加载，无需复杂的事件侦听函数或者回调函数嵌套
        await RES.loadConfig();
        //  虽然没有显式声明 LoadingUI implements PromiseTaskReporter，
        //  但是 LoadingUI 事实上实现了 PromiseTaskReporter 接口，
        //  这就已经可以通过 RES.loadGroup(groupName,priority,reporter) 的类型检查
        await RES.loadGroup("preload", 0, loadingUI);
        this.removeChild(loadingUI);
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


