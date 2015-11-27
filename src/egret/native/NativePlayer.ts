//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
        public $stage:Stage;

        private playerOption:PlayerOption;

        private player:egret.sys.Player;

        private nativeTouch:NativeTouchHandler;

        public constructor() {
            super();
            this.init(NativePlayer.option);
        }

        private init(option:PlayerOption):void {
            //暂时无法显示重绘区域
            option.showPaintRect = false;
            var stage = new egret.Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$maxTouches = option.maxTouches;
            stage.textureScaleFactor = option.textureScaleFactor;
            //设置帧频到native
            stage.frameRate = option.frameRate;

            if(!egret_native.Canvas) {
                stage.addEventListener(egret.Event.ENTER_FRAME, function (){
                    if($currentSurface) {
                        $currentSurface.end();
                    }
                }, this);
            }

            var surface:NativeSurface = <NativeSurface>egret.sys.surfaceFactory.create();
            surface.$isRoot = true;

            var touch = new NativeTouchHandler(stage);
            var player = new egret.sys.Player(surface.renderContext, stage, option.entryClassName);
            new NativeHideHandler(stage);
            //var nativeInput = new NativeInput();

            player.showPaintRect(option.showPaintRect);
            if (option.showFPS || option.showLog) {
                var styleStr:string = <string>option.fpsStyles || "";
                var stylesArr:Array<string> = styleStr.split(",");
                var styles = {};
                for (var i = 0; i < stylesArr.length; i++) {
                    var tempStyleArr = stylesArr[i].split(":");
                    styles[tempStyleArr[0]] = tempStyleArr[1];
                }
                option.fpsStyles = styles;
                player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
            }
            this.playerOption = option;
            this.$stage = stage;
            this.player = player;

            this.nativeTouch = touch;
            //this.nativeInput = nativeInput;

            this.updateScreenSize();
            this.updateMaxTouches();
            player.start();
        }

        public updateScreenSize():void {
            var option = this.playerOption;
            var screenWidth:number = egret_native.EGTView.getFrameWidth();
            var screenHeight:number = egret_native.EGTView.getFrameHeight();
            var stageSize:sys.StageDisplaySize = egret.sys.screenAdapter.calculateStageSize(this.$stage.$scaleMode,
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

        public setContentSize(width:number, height:number):void {
            var option = this.playerOption;
            option.contentWidth = width;
            option.contentHeight = height;
            this.updateScreenSize();
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