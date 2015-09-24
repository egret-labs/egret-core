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


module egret {
    /**
     * @class egret.StageDelegate
     * @classdesc
     * StageDelegate负责处理屏幕适配策略
     * @extends egret.HashObject
     * @private
     */
    export class StageDelegate extends HashObject {
        private static instance:StageDelegate;

        /**
         * @method egret.StageDelegate.getInstance
         * @returns {StageDelegate}
         */
        public static getInstance():StageDelegate {
            if (StageDelegate.instance == null) {
                ContainerStrategy.initialize();
                StageDelegate.instance = new StageDelegate();
            }
            return StageDelegate.instance;
        }

        /**
         * @deprecated
         */
        public static canvas_name:string = "egretCanvas";
        /**
         */
        public static egret_root_div:string = "gameDiv";

        public static canvas_div_name:string = "canvasDiv";

        private _designWidth:number = 0;
        private _designHeight:number = 0;
        public _scaleX = 1;
        public _scaleY = 1;

        public _offSetY:number = 0;

        private _resolutionPolicy;

        public _stageWidth:number = 0;
        public _stageHeight:number = 0;

        /**
         * @method egret.StageDelegate#constructor
         */
        public constructor() {
            super();
        }

        /**
         * 设置舞台的宽高
         * @method egret.StageDelegate#setDesignSize
         * @param width {number}
         * @param height {number}
         */
        public setDesignSize(width:number, height:number):void {
            this._designWidth = width;
            this._designHeight = height;
            if (arguments[2]) {
                $warn(1001);
                var resolutionPolicy:ResolutionPolicy = arguments[2];
                this._setResolutionPolicy(resolutionPolicy);
            }
        }

        /**
         * @param resolutionPolic {any}
         */
        public _setResolutionPolicy(resolutionPolicy:ResolutionPolicy):void {
            this._resolutionPolicy = resolutionPolicy;
            resolutionPolicy.init(this);

            resolutionPolicy._apply(this, this._designWidth, this._designHeight);
        }

        /**
         * @method egret.StageDelegate#getScaleX
         */
        public getScaleX():number {
            return this._scaleX;
        }

        /**
         * @method egret.StageDelegate#getScaleY
         */
        public getScaleY():number {
            return this._scaleY;
        }

        /**
         * @method egret.StageDelegate#getOffSetY
         */
        public getOffSetY():number {
            return this._offSetY;
        }
    }

    /**
     * @private
     */
    export class ResolutionPolicy {

        private _containerStrategy;
        private _contentStrategy:ContentStrategy;

        constructor(containerStg, contentStg) {
            this._containerStrategy = containerStg;
            this._contentStrategy = contentStg;
        }

        /**
         * @method egret.ResolutionPolicy#init
         * @param view {egret.StageDelegate}
         */
        public init(view:StageDelegate):void {
            this._containerStrategy.init(view);
            this._contentStrategy.init(view);
        }

        /**
         * @method egret.ResolutionPolicy#_apply
         * @param view {any}
         * @param designedResolutionWidth {any}
         * @param designedResolutionHeigh {any}
         */
        public _apply(view, designedResolutionWidth, designedResolutionHeight) {
            this._containerStrategy._apply(view, designedResolutionWidth, designedResolutionHeight);

            var orientation = "auto";
            if (egret.MainContext.instance.stage) {
                orientation = egret.MainContext.instance.stage.orientation;
            }

            var clientWidth = this._getClientWidth();
            var clientHeight = this._getClientHeight();
            var shouldRotate = false;
            if (orientation != OrientationMode.AUTO) {
                shouldRotate = orientation != OrientationMode.PORTRAIT && clientHeight > clientWidth
                || orientation == OrientationMode.PORTRAIT && clientWidth > clientHeight;
            }

            if (!shouldRotate) {
                this._contentStrategy._apply(view, designedResolutionWidth, designedResolutionHeight, clientWidth, clientHeight);
            }
            else {
                this._contentStrategy._apply(view, designedResolutionWidth, designedResolutionHeight, clientHeight, clientWidth);
            }
            this.$setEgretSize(this._contentStrategy.$stageWidth, this._contentStrategy.$stageHeight,
                this._contentStrategy.$displayWidth, this._contentStrategy.$displayHeight, clientWidth, clientHeight, shouldRotate, orientation);

        }

        $setEgretSize(stageW:number, stageH:number, styleW:number, styleH:number, clientWidth:number, clientHeight:number, shouldRotate:boolean, orientation:string):void {
            egret.StageDelegate.getInstance()._stageWidth = Math.round(stageW);
            egret.StageDelegate.getInstance()._stageHeight = Math.round(stageH);

            var canvasDiv:any = document.getElementById(StageDelegate.canvas_div_name);
            var container:any = document.getElementById(StageDelegate.egret_root_div);
            if (!canvasDiv) {
                canvasDiv = egret.Browser.getInstance().$new("div");
                canvasDiv.id = StageDelegate.canvas_div_name;
                container.appendChild(canvasDiv);
            }
            canvasDiv.style.position = "absolute";
            canvasDiv.style[egret.Browser.getInstance().getTrans("transformOrigin")] = "0% 0% 0px";

            canvasDiv.style.width = styleW + "px";
            canvasDiv.style.height = styleH + "px";

            container.style.width = clientWidth + "px";
            container.style.height = clientHeight + "px";

            var rotation = 0;
            if (shouldRotate) {
                if (orientation == OrientationMode.LANDSCAPE) {//
                    rotation = 90;
                    canvasDiv.style.top = Math.max((clientHeight - styleW) / 2, 0) + "px";
                    canvasDiv.style.left = Math.min((clientWidth - (clientWidth - styleH) / 2), clientWidth) + "px";
                }
                else {
                    rotation = -90;
                    canvasDiv.style.top = Math.min((clientHeight - (clientHeight - styleW) / 2), clientHeight) + "px";
                    canvasDiv.style.left = Math.max((clientWidth - styleH) / 2, 0) + "px";
                }
            }
            else {
                canvasDiv.style.top = Math.max(clientHeight - styleH, 0) + "px";
                canvasDiv.style.left = Math.max((clientWidth - styleW) / 2, 0) + "px";
            }

            egret.MainContext.instance.touchContext.$rotation = rotation;

            var transform = `rotate(${ rotation }deg)`;
            canvasDiv.style[egret.Browser.getInstance().getTrans("transform")] = transform;

            var stageDelegateDiv = egret.Browser.getInstance().$("#StageDelegateDiv");
            if (stageDelegateDiv) {
                stageDelegateDiv.style.left = canvasDiv.style.left;
                stageDelegateDiv.style.top = canvasDiv.style.top;

                stageDelegateDiv.style[egret.Browser.getInstance().getTrans("transform")] = canvasDiv.style[egret.Browser.getInstance().getTrans("transform")];
            }
        }

        /**
         * 显示区域分辨率宽
         * @returns {number}
         */
        public _getClientWidth():number {
            return document.documentElement.clientWidth;
        }

        /**
         * 显示区域分辨率高
         * @returns {number}
         */
        public _getClientHeight():number {
            return document.documentElement.clientHeight;
        }
    }

    /**
     * @private
     */
    export class ContainerStrategy {
        /**
         * @constant egret.ContainerStrategy.EQUAL_TO_FRAME
         */
        public static EQUAL_TO_FRAME;

        /**
         * @method egret.ContainerStrategy.initialize
         */
        public static initialize():void {
            ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
        }

        /**
         * @method egret.ContainerStrategy#init
         * @param vie {any}
         */
        public init(view):void {

        }

        /**
         * @method egret.ContainerStrategy#_apply
         * @param view {any}
         * @param designedWidth {any}
         * @param designedHeigh {any}
         */
        public _apply(view, designedWidth, designedHeight):void {
        }

        public _setupContainer():void {
            var body = document.body, style;
            if (body && (style = body.style)) {
                style.paddingTop = style.paddingTop || "0px";
                style.paddingRight = style.paddingRight || "0px";
                style.paddingBottom = style.paddingBottom || "0px";
                style.paddingLeft = style.paddingLeft || "0px";
                style.borderTop = style.borderTop || "0px";
                style.borderRight = style.borderRight || "0px";
                style.borderBottom = style.borderBottom || "0px";
                style.borderLeft = style.borderLeft || "0px";
                style.marginTop = style.marginTop || "0px";
                style.marginRight = style.marginRight || "0px";
                style.marginBottom = style.marginBottom || "0px";
                style.marginLeft = style.marginLeft || "0px";
            }
        }
    }

    /**
     * @classdesc
     * @extends egret.ContainerStrategy
     * @private
     */
    export class EqualToFrame extends ContainerStrategy {
        public _apply(view) {
            this._setupContainer();
        }
    }

    /**
     * @private
     */
    export class ContentStrategy {
        $stageWidth:number;
        $stageHeight:number;
        $displayWidth:number;
        $displayHeight:number;

        /**
         * @method egret.ContentStrategy#init
         * @param vie {any}
         */
        public init(view):void {

        }

        /**
         * @method egret.ContentStrategy#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        public _apply(delegate:egret.StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
        }

        /**
         * 显示区域分辨率宽
         * @returns {number}
         */
        public _getClientWidth():number {
            return document.documentElement.clientWidth;
        }

        /**
         * 显示区域分辨率高
         * @returns {number}
         */
        public _getClientHeight():number {
            return document.documentElement.clientHeight;
        }
    }

    /**
     * @class egret.FixedHeight
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    export class FixedHeight extends ContentStrategy {
        private minWidth:number = NaN;

        /**
         * 构造函数
         * @param minWidth 最终游戏内适配的最小stageWidth，默认没有最小宽度
         */
        constructor(minWidth:number = 0) {
            super();
            this.minWidth = minWidth;
        }

        /**
         * @method egret.FixedHeight#_apply
         * @param delegate {any}
         * @param designedResolutionWidth {any}
         * @param designedResolutionHeight {any}
         */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
            var scale:number = clientHeight / designedResolutionHeight;
            var designW:number = clientWidth / scale;
            var designH:number = designedResolutionHeight;

            var scale2:number = 1;
            if (this.minWidth != 0) {
                scale2 = Math.min(1, designW / this.minWidth);
            }

            this.$stageWidth = designW / scale2;
            this.$stageHeight = designH;
            this.$displayWidth = clientWidth;
            this.$displayHeight = clientHeight * scale2;

            delegate._scaleX = scale * scale2;
            delegate._scaleY = scale * scale2;
        }
    }

    /**
     * @class egret.FixedWidth
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    export class FixedWidth extends ContentStrategy {

        private minHeight:number = NaN;

        /**
         * 构造函数
         * @param minHeight 最终游戏内适配的最小stageHeight，默认没有最小高度
         */
        constructor(minHeight:number = 0) {
            super();
            this.minHeight = minHeight;
        }

        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
            var scale:number = clientWidth / designedResolutionWidth;
            var designW:number = designedResolutionWidth;
            var designH:number = clientHeight / scale;

            var scale2:number = 1;
            if (this.minHeight != 0) {
                scale2 = Math.min(1, designH / this.minHeight);
            }
            
            //delegate._offSetY = Math.floor(this.$stageHeight ,clientHeight);

            this.$stageWidth = designW;
            this.$stageHeight = designH / scale2;
            this.$displayWidth = clientWidth * scale2;
            this.$displayHeight = clientHeight;
            delegate._scaleX = scale * scale2;
            delegate._scaleY = scale * scale2;
            
        }
    }

    /**
     * @class egret.NoScale
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    export class NoScale extends ContentStrategy {

        constructor() {
            super();
        }

        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
            this.$stageWidth = designedResolutionWidth;
            this.$stageHeight = designedResolutionHeight;
            this.$displayWidth = designedResolutionWidth;
            this.$displayHeight = designedResolutionHeight;

            delegate._scaleX = 1;
            delegate._scaleY = 1;
        }
    }


    /**
     * @private
     */
    export class ShowAll extends ContentStrategy {

        constructor(){
            super();
        }


        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
            var viewPortWidth:number = clientWidth;
            var viewPortHeight:number = clientHeight;

            var scale:number = ( viewPortWidth / designedResolutionWidth < viewPortHeight / designedResolutionHeight) ? viewPortWidth / designedResolutionWidth : viewPortHeight / designedResolutionHeight;
            var designW:number = designedResolutionWidth;
            var designH:number = designedResolutionHeight;

            var viewPortWidth = designW * scale;
            var viewPortHeight = designH * scale;

            delegate._offSetY = Math.floor(clientHeight - viewPortHeight);

            this.$stageWidth = designW;
            this.$stageHeight = designH;
            this.$displayWidth = viewPortWidth;
            this.$displayHeight = viewPortHeight;

            delegate._scaleX = scale;
            delegate._scaleY = scale;

        }
    }


    /**
     * @private
     */
    export class FullScreen extends ContentStrategy {

        constructor(){
            super();
        }


        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number, clientWidth:number, clientHeight:number):void {
            var viewPortWidth:number = clientWidth;//分辨率宽
            var viewPortHeight:number = clientHeight;//分辨率高

            var designW:number = designedResolutionWidth;
            var designH:number = designedResolutionHeight;
            var scalex:number = viewPortWidth/designedResolutionWidth;
            var scaley:number = viewPortHeight/designedResolutionHeight;

            viewPortWidth = designW * scalex;
            viewPortHeight = designH * scaley;

            this.$stageWidth = designW;
            this.$stageHeight = designH;
            this.$displayWidth = viewPortWidth;
            this.$displayHeight = viewPortHeight;

            delegate._scaleX = scalex;
            delegate._scaleY = scaley;
        }
    }



}