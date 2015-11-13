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

module egret.web {
    /**
     * @private
     */
    export class WebPlayer extends egret.HashObject implements egret.sys.Screen {

        public constructor(container:HTMLDivElement) {
            super();
            this.init(container);
            this.initOrientation();
        }

        private init(container:HTMLDivElement):void {
            var option = this.readOption(container);
            var stage = new egret.Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$orientation = option.orientation;
            stage.$maxTouches = option.maxTouches;
            stage.frameRate = option.frameRate;
            stage.textureScaleFactor = option.textureScaleFactor;

            var surface = egret.sys.surfaceFactory.create();
            var canvas = <HTMLCanvasElement><any>surface;
            this.attachCanvas(container, canvas);

            var webTouch = new WebTouchHandler(stage, canvas);
            var player = new egret.sys.Player(surface.renderContext, stage, option.entryClassName);
            var webHide = new egret.web.WebHideHandler(stage);
            var webInput = new HTMLInput();

            player.showPaintRect(option.showPaintRect);
            if (option.showFPS || option.showLog) {
                player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
            }
            this.playerOption = option;
            this.container = container;
            this.canvas = canvas;
            this.stage = stage;
            this.player = player;
            this.webTouchHandler = webTouch;
            this.webInput = webInput;
            this.webHide = webHide;

            egret.web.$cacheTextAdapter(webInput, stage, container, canvas);

            this.updateScreenSize();
            this.updateMaxTouches();
            player.start();
        }

        private initOrientation():void {
            var self = this;
            window.addEventListener("orientationchange", function () {
                window.setTimeout(function () {
                    egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, StageOrientationEvent.ORIENTATION_CHANGE);
                }, 350);
            });
        }

        /**
         * 读取初始化参数
         */
        private readOption(container:HTMLDivElement):PlayerOption {
            var option:PlayerOption = {};
            option.entryClassName = container.getAttribute("data-entry-class");
            option.scaleMode = container.getAttribute("data-scale-mode") || egret.StageScaleMode.NO_SCALE;
            option.frameRate = +container.getAttribute("data-frame-rate") || 30;
            option.contentWidth = +container.getAttribute("data-content-width") || 480;
            option.contentHeight = +container.getAttribute("data-content-height") || 800;
            option.orientation = container.getAttribute("data-orientation") || egret.OrientationMode.AUTO;
            option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
            option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;

            option.showPaintRect = container.getAttribute("data-show-paint-rect") == "true";
            option.showFPS = container.getAttribute("data-show-fps") == "true";

            var styleStr = container.getAttribute("data-show-fps-style") || "";
            var stylesArr = styleStr.split(",");
            var styles = {};
            for (var i = 0; i < stylesArr.length; i++) {
                var tempStyleArr = stylesArr[i].split(":");
                styles[tempStyleArr[0]] = tempStyleArr[1];
            }
            option.fpsStyles = styles;

            option.showLog = container.getAttribute("data-show-log") == "true";
            option.logFilter = container.getAttribute("data-log-filter");
            return option;
        }

        /**
         * @private
         * 添加canvas到container。
         */
        private attachCanvas(container:HTMLElement, canvas:HTMLCanvasElement):void {

            var style = canvas.style;
            style.cursor = "default";
            style.position = "absolute";
            style.top = "0";
            style.bottom = "0";
            style.left = "0";
            style.right = "0";
            container.appendChild(canvas);
            style = container.style;
            style.overflow = "hidden";
            style.position = "relative";
            style["webkitTransform"] = "translateZ(0)";
        }

        private playerOption:PlayerOption;

        /**
         * @private
         * 画布实例
         */
        private canvas:HTMLCanvasElement;
        /**
         * @private
         * 播放器容器实例
         */
        private container:HTMLElement;

        /**
         * @private
         * 舞台引用
         */
        private stage:Stage;

        private webTouchHandler:WebTouchHandler;
        private player:egret.sys.Player;
        private webInput:egret.web.HTMLInput;
        private webHide:egret.web.WebHideHandler;

        /**
         * @private
         * 更新播放器视口尺寸
         */
        public updateScreenSize():void {
            var canvas = this.canvas;
            if (canvas['userTyping'])
                return;
            var option = this.playerOption;
            var screenRect = this.container.getBoundingClientRect();
            var shouldRotate = false;

            var orientation:string = this.stage.$orientation;
            if (orientation != OrientationMode.AUTO) {
                shouldRotate = orientation != OrientationMode.PORTRAIT && screenRect.height > screenRect.width
                    || orientation == OrientationMode.PORTRAIT && screenRect.width > screenRect.height;
            }
            var screenWidth = shouldRotate ? screenRect.height : screenRect.width;
            var screenHeight = shouldRotate ? screenRect.width : screenRect.height;
            var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode,
                screenWidth, screenHeight, option.contentWidth, option.contentHeight);
            var stageWidth = stageSize.stageWidth;
            var stageHeight = stageSize.stageHeight;
            var displayWidth = stageSize.displayWidth;
            var displayHeight = stageSize.displayHeight;
            if (canvas.width !== stageWidth) {
                canvas.width = stageWidth;
            }
            if (canvas.height !== stageHeight) {
                canvas.height = stageHeight;
            }
            canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            canvas.style.width = displayWidth + "px";
            canvas.style.height = displayHeight + "px";
            var rotation = 0;
            if (shouldRotate) {
                if (orientation == OrientationMode.LANDSCAPE) {//
                    rotation = 90;
                    canvas.style.top = (screenRect.height - displayWidth) / 2 + "px";
                    canvas.style.left = (screenRect.width + displayHeight) / 2 + "px";
                }
                else {
                    rotation = -90;
                    canvas.style.top = (screenRect.height + displayWidth) / 2 + "px";
                    canvas.style.left = (screenRect.width - displayHeight) / 2 + "px";
                }
            }
            else {
                canvas.style.top = (screenRect.height - displayHeight) / 2 + "px";
                canvas.style.left = (screenRect.width - displayWidth) / 2 + "px";
            }

            var transform = `rotate(${ rotation }deg)`;
            canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            this.player.updateStageSize(stageWidth, stageHeight);
            var scalex = displayWidth / stageWidth,
                scaley = displayHeight / stageHeight;

            this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
            this.webInput.$updateSize();
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
            this.webTouchHandler.$updateMaxTouches();
        }
    }


}