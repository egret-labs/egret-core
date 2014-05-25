///<reference path="egret.d.ts"/>
///<reference path="LoadingUI.ts"/>
///<reference path="resource/Resource.ts"/>
/**
 * 游戏入口类
 */
class GameApp {

    private textContainer:ns_egret.DisplayObjectContainer;
    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    /**
     * 游戏启动后，外部会自动调用此方法
     */
    public startGame():void {

        //设置屏幕适配策略
        var container = new ns_egret.EqualToFrame();
        var content = ns_egret.Browser.getInstance().isMobile ? new ns_egret.FixedWidth() : new ns_egret.FixedSize(480, 800);
        var policy = new ns_egret.ResolutionPolicy(container, content);
        ns_egret.StageDelegate.getInstance().setDesignSize(480, 800, policy);

        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.loadingView.addToStage();

        //初始化Resource资源加载库，提示：Resource资源加载库是可选模块，不在egret-core项目里，最新代码请到github上的egret-game-library项目检出。
        ns_egret.Resource.eventDispatcher.addEventListener(ns_egret.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        ns_egret.Resource.eventDispatcher.addEventListener(ns_egret.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        ns_egret.Resource.loadConfig("resources/resource.json","resources/");
        ns_egret.Resource.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:ns_egret.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:ns_egret.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.onProgress(event.itemsLoaded,event.itemsTotal);
        }
    }
    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        var stage = ns_egret.MainContext.instance.stage;
        var sky = this.createBitmapByName("bgImage");
        stage.addChild(sky);

        var stageW = stage.stageWidth;
        var stageH = stage.stageHeight;
        var skyW = sky.width;
        var skyH = sky.height;

        sky.scaleX = stageW / skyW;
        sky.scaleY = stageH / skyH;

        var topMask = new ns_egret.ShapeRect();
        topMask.alpha = 0.8;
        topMask.color = 0;
        topMask.width = stageW;
        topMask.height = stageH;
        stage.addChild(topMask);

        var icon = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        stage.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel = new ns_egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        stage.addChild(colorLabel);

        var textContainer = new ns_egret.DisplayObjectContainer();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        stage.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        ns_egret.Resource.getResAsync("description",this.startAnimation,this)
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):ns_egret.Bitmap {
        var result:ns_egret.Bitmap = new ns_egret.Bitmap();
        var texture:ns_egret.Texture = ns_egret.Resource.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     */
    private startAnimation(result:Array<any>):void{
        var textContainer = this.textContainer;
        var count = -1;
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
    /**
     * 切换描述内容
     */
    private changeDescription(textContainer, lineArr) {
        textContainer.removeChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new ns_egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    }
}

//声明一个全局的app属性，以便在launcher/egret_loader.js调用它的startGame()方法。
var app = new GameApp();


