//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");

        //初始化Facebook SDK，在回调方法里获取相关信息
        FBInstant.initializeAsync().then(function () {
            console.log("player.getID", FBInstant.player.getID());
            console.log("player.getName", FBInstant.player.getName());
            console.log("player.getPhoto", FBInstant.player.getPhoto());

            console.log("getLocale:", FBInstant.getLocale());
            console.log("getPlatform:", FBInstant.getPlatform());
            console.log("getSDKVersion", FBInstant.getSDKVersion());
        })
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    /***
     * 资源加载完成，创建游戏场景
     */
    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            console.log('FBInstantGameSDK')
            console.warn('注意:正式版需要使用下面FBInstant.startGameAsync方法')
            // FBInstant.startGameAsync().then(() => {
            //     console.log('用户点击了开始游戏的按钮');
            //     this.startCreateScene();
            // });
            this.startCreateScene();//测试代码，直接开始游戏。正式版需要注释掉
        }
    }
    /**
     * preload资源组加载进度
     * 通知Facebook平台当前加载的进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            var percent = Math.floor((event.itemsLoaded / event.itemsTotal) * 100);
            FBInstant.setLoadingProgress(percent);
        }
    }
    private textfield: egret.TextField;
    /**
     * 创建场景界面
     */
    protected startCreateScene(): void {
        let self = this;
        let sky: egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW: number = this.stage.stageWidth;
        let stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;



        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.width = stageW;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.y = 135;
        textfield.text = "游戏开始";
        this.textfield = textfield;

        let group = new eui.Group();
        group.layout = new eui.VerticalLayout();
        group.horizontalCenter = 0;
        group.verticalCenter = 0;
        this.addChild(group);


        let btnSetData = new eui.Button();
        btnSetData.label = "点击保存数据";
        group.addChild(btnSetData);
        btnSetData.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            console.log("注意，该方法只在 Facebook 真实环境下生效");
            var saveData = {
                achievements: ['medal1', 'medal2', 'medal3'],
                currentLife: 300,
            };
            console.log('开始保存数据：', saveData);
            FBInstant.player.setDataAsync(saveData).then(() => {
                //保存数据的回调方法
                console.log('保存数据成功');
            });
        }, this);

        let btnGetData = new eui.Button();
        btnGetData.label = "点击读取数据";
        group.addChild(btnGetData);
        btnGetData.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            console.log("注意，该方法只在 Facebook 真实环境下生效");
            console.log('开始读取数据');
            FBInstant.player.getDataAsync(['achievements', 'currentLife']).then((data) => {
                //读取数据的回调方法
                console.log('读取数据:', data);
            });
        }, this);

        let btnContext = new eui.Button();
        btnContext.label = "获取游戏来源";
        group.addChild(btnContext);
        btnContext.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            console.log("注意，该方法只在 Facebook 真实环境下生效");
            console.log('获取游戏来源id', FBInstant.context.getID());
            console.log('获取游戏来源类型', FBInstant.context.getType());
        }, this);


        let btnGameOver = new eui.Button();
        btnGameOver.label = "点击退出游戏";
        group.addChild(btnGameOver);
        btnGameOver.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            console.log("注意，该方法只在 Facebook 真实环境下生效");
            FBInstant.quit();
        }, this);


    }
    private getRandom() {
        return Math.floor(Math.random() * 100);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}
