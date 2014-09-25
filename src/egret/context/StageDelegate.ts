/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @class egret.StageDelegate
     * @classdesc
     * StageDelegate负责处理屏幕适配策略
     * @extends egret.HashObject
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
         * @member egret.StageDelegate.canvas_name
         * @deprecated
         */
        public static canvas_name:string = "egretCanvas";
        /**
         * @member egret.StageDelegate.canvas_div_name
         */
        public static canvas_div_name:string = "gameDiv";

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
         * @method egret.StageDelegate#setDesignSize
         * @param width {number}
         * @param height {{number}}
         */
        public setDesignSize(width:number, height:number):void {
            this._designWidth = width;
            this._designHeight = height;
            if (arguments[2]) {
                Logger.warning("该方法目前不应传入 resolutionPolicy 参数，请在 docs/1.0_Final_ReleaseNote中查看如何升级")
                var resolutionPolicy:ResolutionPolicy = arguments[2];
                this._setResolutionPolicy(resolutionPolicy);
            }
        }

        /**
         * @method egret.StageDelegate#_setResolutionPolicy
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
     * @class egret.ResolutionPolicy
     * @classdesc
     */
    export class ResolutionPolicy {

        private _containerStrategy;
        private _contentStrategy;

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
            this._contentStrategy._apply(view, designedResolutionWidth, designedResolutionHeight);
        }
    }

    /**
     * @class egret.ContainerStrategy
     * @classdesc
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
     * @class egret.EqualToFrame
     * @classdesc
     * @extends egret.ContainerStrategy
     */
    export class EqualToFrame extends ContainerStrategy {
        public _apply(view) {
            this._setupContainer();
        }
    }

    /**
     * @class egret.ContentStrategy
     * @classdesc
     */
    export class ContentStrategy {

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
        public _apply(delegate:egret.StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
        }

        public setEgretSize(w:number, h:number, styleW:number, styleH:number, top:number = 0):void {
            egret.StageDelegate.getInstance()._stageWidth = w;
            egret.StageDelegate.getInstance()._stageHeight = h;

            var container:HTMLElement = document.getElementById(StageDelegate.canvas_div_name);
            container.style.width = styleW + "px";
            container.style.height = styleH + "px";
            container.style.top = top + "px";
        }
    }

    /**
     * @class egret.FixedHeight
     * @classdesc
     * @extends egret.ContentStrategy
     */
    export class FixedHeight extends ContentStrategy {
        private minWidth:number;

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
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var viewPortWidth:number = document.documentElement.clientWidth;//分辨率宽
            var viewPortHeight:number = document.documentElement.clientHeight;//分辨率高

            var scale:number = viewPortHeight / designedResolutionHeight;
            var designW:number = viewPortWidth / scale;
            var designH:number = designedResolutionHeight;

            var scale2:number = 1;
            if (this.minWidth != 0) {
                scale2 = Math.min(1, designW / this.minWidth);
            }

            this.setEgretSize(designW / scale2, designH, viewPortWidth, viewPortHeight * scale2);

            delegate._scaleX = scale * scale2;
            delegate._scaleY = scale * scale2;
        }
    }

    /**
     * @class egret.FixedWidth
     * @classdesc
     * @extends egret.ContentStrategy
     */
    export class FixedWidth extends ContentStrategy {

        private minHeight:number;

        /**
         * 构造函数
         * @param minHeight 最终游戏内适配的最小stageHeight，默认没有最小高度
         */
            constructor(minHeight:number = 0) {
            super();
            this.minHeight = minHeight;
        }

        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var viewPortWidth:number = document.documentElement.clientWidth;//分辨率宽
            var viewPortHeight:number = document.documentElement.clientHeight;//分辨率高

            var scale:number = viewPortWidth / designedResolutionWidth;
            var designW:number = designedResolutionWidth;
            var designH:number = viewPortHeight / scale;

            var scale2:number = 1;
            if (this.minHeight != 0) {
                scale2 = Math.min(1, designH / this.minHeight);
            }

            this.setEgretSize(designW, designH / scale2, viewPortWidth * scale2, viewPortHeight);

            delegate._scaleX = scale * scale2;
            delegate._scaleY = scale * scale2;
        }
    }


    /**
     * @class egret.FixedSize
     * @classdesc
     * @extends egret.ContentStrategy
     */
    export class FixedSize extends ContentStrategy {

        private width;
        private height;

        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
        }

        /**
         * @method egret.FixedSize#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var viewPortWidth = this.width;
            var viewPortHeight = this.height;
            var scale = viewPortWidth / designedResolutionWidth;

            this.setEgretSize(designedResolutionWidth, viewPortHeight / scale, viewPortWidth, viewPortHeight);

            delegate._scaleX = scale;
            delegate._scaleY = scale;
        }
    }


    /**
     * @class egret.NoScale
     * @classdesc
     * @extends egret.ContentStrategy
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
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            this.setEgretSize(designedResolutionWidth, designedResolutionHeight, designedResolutionWidth, designedResolutionHeight);

            delegate._scaleX = 1;
            delegate._scaleY = 1;
        }
    }

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
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var viewPortWidth:number = document.documentElement.clientWidth;//分辨率宽
            var viewPortHeight:number = document.documentElement.clientHeight;//分辨率高

            var scale:number = ( viewPortWidth / designedResolutionWidth < viewPortHeight / designedResolutionHeight) ? viewPortWidth / designedResolutionWidth : viewPortHeight / designedResolutionHeight;
            var designW:number = designedResolutionWidth;
            var designH:number = designedResolutionHeight;

            var viewPortWidth = designW * scale;
            var viewPortHeight = designH * scale;

            var scale2:number = 1;

            delegate._offSetY = Math.floor((document.documentElement.clientHeight - viewPortHeight) / 2);
            this.setEgretSize(designW, designH / scale2, viewPortWidth * scale2, viewPortHeight, delegate._offSetY);

            delegate._scaleX = scale * scale2;
            delegate._scaleY = scale * scale2;

        }
    }

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
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var viewPortWidth:number = document.documentElement.clientWidth;//分辨率宽
            var viewPortHeight:number = document.documentElement.clientHeight;//分辨率高

            var designW:number = designedResolutionWidth;
            var designH:number = designedResolutionHeight;
            var scalex:number = viewPortWidth/designedResolutionWidth;
            var scaley:number = viewPortHeight/designedResolutionHeight;

            viewPortWidth = designW * scalex;
            viewPortHeight = designH * scaley;

            this.setEgretSize(designW, designH, viewPortWidth, viewPortHeight);

            delegate._scaleX = scalex;
            delegate._scaleY = scaley;
        }
    }



}