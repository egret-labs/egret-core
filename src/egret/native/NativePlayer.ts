module egret.native {
    /**
     * @private
     */
    export class NativePlayer extends egret.HashObject implements egret.sys.Screen {
        public static option:PlayerOption;
        /**
         * @private
         * 舞台引用
         */
        private stage:Stage;

        private playerOption:PlayerOption;

        private player:egret.sys.Player;

        private nativeTouch:NativeTouchHandler;

        public constructor() {
            super();
            this.init(NativePlayer.option);
        }

        private init(option:PlayerOption):void {
            var stage = new egret.Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$maxTouches = option.maxTouches;
            stage.frameRate = option.frameRate;
            stage.textureScaleFactor = option.textureScaleFactor;

            var surface:NativeSurface = <NativeSurface>egret.sys.surfaceFactory.create();
            surface.$isRoot = true;

            var touch = new NativeTouchHandler(stage);
            var player = new egret.sys.Player(surface.renderContext, stage, option.entryClassName);
            new NativeHideHandler(stage);
            //var nativeInput = new NativeInput();

            if (DEBUG) {
                player.showPaintRect(option.showPaintRect);
                if (option.showFPS || option.showLog) {
                    player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                }
            }
            this.playerOption = option;
            this.stage = stage;
            this.player = player;

            this.nativeTouch = touch;
            //this.nativeInput = nativeInput;

            this.updateScreenSize();
            this.updateMaxTouches();
            player.start();

            egret.MainContext.instance.stage = stage;
        }

        public updateScreenSize():void {
            var option = this.playerOption;
            var screenWidth:number = egret_native.EGTView.getFrameWidth();
            var screenHeight:number = egret_native.EGTView.getFrameHeight();
            var stageSize:sys.StageDisplaySize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode,
                screenWidth, screenHeight, option.contentWidth, option.contentHeight);
            var stageWidth:number = stageSize.stageWidth;
            var stageHeight:number = stageSize.stageHeight;
            var displayWidth:number = stageSize.displayWidth;
            var displayHeight:number = stageSize.displayHeight;

            var top:number = (screenHeight - displayHeight) / 2;
            var left:number = (screenWidth - displayWidth) / 2;

            egret_native.EGTView.setVisibleRect(left, top, displayWidth, displayHeight);
            egret_native.EGTView.setDesignSize(stageWidth, stageHeight);

            this.player.updateStageSize(stageWidth, stageHeight);

            //var scalex = displayWidth / stageWidth,
            //    scaley = displayHeight / stageHeight;
            //this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
            //this.webInput.$updateSize();
        }

        /**
         * @private
         * 更新触摸数量
         */
        public updateMaxTouches() {
            this.nativeTouch.$updateMaxTouches();
        }
    }
}