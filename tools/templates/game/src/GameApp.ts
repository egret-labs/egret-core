/**
 * 游戏入口类
 */
class GameApp {

    private textContainer:ns_egret.DisplayObjectContainer;

    /**
     * 游戏启动后，会自动执行此方法
     */
    public startGame():void {

        //设置屏幕适配策略
        var container = new ns_egret.EqualToFrame();
        ns_egret.ResourceLoader.prefix = "assets/480/";
        var content = ns_egret.Browser.getInstance().isMobile ? new ns_egret.FixedWidth() : new ns_egret.FixedSize(480, 800);
        var policy = new ns_egret.ResolutionPolicy(container, content);
        ns_egret.StageDelegate.getInstance().setDesignSize(480, 800, policy);

        var loadingController = new ns_egret.LoadingController();
        loadingController.addResource("bg.jpg", ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
        loadingController.addResource("egret_icon.png", ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
        loadingController.setLoadingView(new LoadingUI());
        loadingController.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.onResourceLoadComplete, this);
        loadingController.load();
    }

    private onResourceLoadComplete():void {
        this.createGameScene();
        this.startAnimation();
    }

    private createGameScene():void{
        var stage = ns_egret.MainContext.instance.stage;
        var sky = utils.createBitmap("bg.jpg");
        stage.addChild(sky);

        var stageW = stage.stageWidth;
        var stageH = stage.stageHeight;
        var skyW = sky.getBounds().width;
        var skyH = sky.getBounds().height;

        sky.scaleX = stageW / skyW;
        sky.scaleY = stageH / skyH;

        var topMask = new ns_egret.ShapeRect();
        topMask.alpha = 0.8;
        topMask.color = 0;
        topMask.setContentSize(stageW, stageH);
        stage.addChild(topMask);

        var icon = utils.createBitmap("egret_icon.png");
        icon.relativeAnchorPointX = icon.relativeAnchorPointY = 0.5;
        stage.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel = new ns_egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.relativeAnchorPointX = colorLabel.relativeAnchorPointY = 0.5;
        colorLabel.textColor = "#ffffff";
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        stage.addChild(colorLabel);

        var textContainer = new ns_egret.DisplayObjectContainer();
        textContainer.relativeAnchorPointX = textContainer.relativeAnchorPointY = 0.5;
        stage.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;
    }

    private startAnimation():void{
        var textContainer = this.textContainer;
            var count = -1;
        var result = this.getDescription();
        var self = this;
        var change = function() {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = ns_egret.Tween.get(textContainer);
            tw.to({"alpha":1}, 200);
            tw.wait(2000);
            tw.to({"alpha":0}, 200);
            tw.call(change, this);
        }

        change();
    }

    private changeDescription(textContainer, lineArr) {
        textContainer.removeAllChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new ns_egret.TextField();
            colorLabel.x = w;
            colorLabel.relativeAnchorPointX = colorLabel.relativeAnchorPointY = 0;
            colorLabel.textColor = info["textColor"];
            colorLabel.text = info["text"];
            colorLabel.textAlign = "left";
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.getBounds().width;
        }
    }

    private getDescription() {
        var result = [];
        var lineArr = [];
        lineArr.push({"text" : "开源", "textColor":"#F1C40F"});
        lineArr.push({"text" : "，", "textColor":"#FFFFFF"});
        lineArr.push({"text" : "免费", "textColor":"#F1C40F"});
        lineArr.push({"text" : "，", "textColor":"#FFFFFF"});
        lineArr.push({"text" : "跨平台", "textColor":"#F1C40F"});
        result.push(lineArr);

        lineArr = [];
        lineArr.push({"text" : "推动", "textColor":"#FFFFFF"});
        lineArr.push({"text" : "游戏", "textColor":"#F1C40F"});
        lineArr.push({"text" : "前行", "textColor":"#FFFFFF"});
        result.push(lineArr);

        lineArr = [];
        lineArr.push({"text" : "HTML5", "textColor":"#F1C40F"});
        lineArr.push({"text" : "游戏框架", "textColor":"#FFFFFF"});
        result.push(lineArr);

        return result;
    }
}

module utils {
    export function createBitmap(url):ns_egret.Bitmap {
        var result:ns_egret.Bitmap = new ns_egret.Bitmap();
        var texture:ns_egret.Texture = ns_egret.TextureCache.getInstance().getTexture(url);
        result.texture = texture;
        return result;
    }

}

var app = new GameApp();


