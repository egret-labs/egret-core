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
     * 有关屏幕适配策略，更多信息请了解 GitHub:理解egret的GameLauncher
	 * @extends egret.HashObject
     */
    export class StageDelegate extends HashObject{
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
		 */
        public static canvas_name:string = "gameCanvas";
		/**
		 * @member egret.StageDelegate.canvas_div_name
		 */
        public static canvas_div_name:string = "gameDiv";

        private _designWidth:number = 0;
        private _designHeight:number = 0;
        public _scaleX = 1;
        public _scaleY = 1;

        private _resolutionPolicy;

		/**
		 * @method egret.StageDelegate#constructor
		 */
        public constructor() {
            super();
            var canvas:any = document.getElementById(StageDelegate.canvas_name);
            var w = canvas.width, h = canvas.height;
            this._designWidth = w;
            this._designHeight = h;

        }

		/**
		 * @method egret.StageDelegate#setDesignSize
		 * @param width {number}
		 * @param height {{number}}
		 * @param resolutionPolicy {any}
		 */
        public setDesignSize(width:number, height:number, resolutionPolicy:ResolutionPolicy):void {
            this.setResolutionPolicy(resolutionPolicy);
            this._designWidth = width;
            this._designHeight = height;
            this._resolutionPolicy._apply(this, this._designWidth, this._designHeight);
        }

		/**
		 * @method egret.StageDelegate#setResolutionPolicy
		 * @param resolutionPolic {any}
		 */
        private setResolutionPolicy(resolutionPolicy:ResolutionPolicy):void {
            this._resolutionPolicy = resolutionPolicy;
            resolutionPolicy.init(this);
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
    }

	/**
	 * @class egret.ResolutionPolicy
	 * @classdesc
	 */
    export class ResolutionPolicy {

        private _containerStrategy;
        private _contentStrategy;

        constructor(containerStg, contentStg) {
            this.setContainerStrategy(containerStg);
            this.setContentStrategy(contentStg);
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

		/**
		 * @method egret.ResolutionPolicy#setContainerStrategy
		 * @param containerStg {any}
		 */
        public setContainerStrategy(containerStg):void {
            if (containerStg instanceof ContainerStrategy)
                this._containerStrategy = containerStg;
        }

		/**
		 * @method egret.ResolutionPolicy#setContentStrategy
		 * @param contentStg {any}
		 */
        public setContentStrategy(contentStg):void {
            if (contentStg instanceof ContentStrategy)
                this._contentStrategy = contentStg;
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
//            var contStyle = document.getElementById(egret.StageDelegate.canvas_div_name).style;
//            contStyle.position = "fixed";
//            contStyle.left = contStyle.top = "0px";
//            document.body.scrollTop = 0;
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
        public _apply(delegate:egret.StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void{
        }
    }

	/**
	 * @class egret.FixedHeight
	 * @classdesc
	 * @extends egret.ContentStrategy
	 */
    export class FixedHeight extends ContentStrategy {
		/**
		 * @method egret.FixedHeight#_apply
		 * @param delegate {any} 
		 * @param designedResolutionWidth {any} 
		 * @param designedResolutionHeight {any}
		 */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var canvas:any = document.getElementById(StageDelegate.canvas_name);
            var container:any = document.getElementById(StageDelegate.canvas_div_name);
            var containerW = canvas.width, containerH = canvas.height,
                designW = designedResolutionWidth, designH = designedResolutionHeight,
                scale = containerH / designH,
                contentW = designW * scale, contentH = containerH;

            var viewPortHeight = window.innerHeight;
            scale = viewPortHeight / designH;
            var viewPortWidth = designW * scale;
            canvas.width = designW;
            canvas.height = designH;
            canvas.style.width = viewPortWidth + "px";
            canvas.style.height = viewPortHeight + "px";
            container.style.width = viewPortWidth + "px";
            container.style.height = viewPortHeight + "px";
            delegate._scaleX = scale;
            delegate._scaleY = scale;
        }
    }

	/**
	 * @class egret.FixedWidth
	 * @classdesc
	 * @extends egret.ContentStrategy
	 */
    export class FixedWidth extends ContentStrategy {
		/**
		 * @method egret.FixedWidth#_apply
		 * @param delegate {egret.StageDelegate}
		 * @param designedResolutionWidth {any} 
		 * @param designedResolutionHeight {any}
		 */
        public _apply(delegate:StageDelegate, designedResolutionWidth:number, designedResolutionHeight:number):void {
            var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(StageDelegate.canvas_name);
            var container:HTMLElement = document.getElementById(StageDelegate.canvas_div_name);
            var viewPortWidth = document.documentElement.clientWidth;
            var viewPortHeight = document.documentElement.clientHeight;
            var scale = viewPortWidth / designedResolutionWidth;
            canvas.width = designedResolutionWidth;
            canvas.height = viewPortHeight / scale;

            canvas.style.width = viewPortWidth + "px";
            canvas.style.height = viewPortHeight + "px";
            container.style.width = viewPortWidth + "px";
            container.style.height = viewPortHeight + "px";
            delegate._scaleX = scale;
            delegate._scaleY = scale;
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
            var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(StageDelegate.canvas_name);
            var container:HTMLDivElement = <HTMLDivElement>document.getElementById(StageDelegate.canvas_div_name);
            var viewPortWidth = this.width;
            var viewPortHeight = this.height;
            var scale = viewPortWidth / designedResolutionWidth;
            canvas.width = designedResolutionWidth;
            canvas.height = viewPortHeight / scale;

            canvas.style.width = viewPortWidth + "px";
            canvas.style.height = viewPortHeight + "px";
            container.style.width = viewPortWidth + "px";
            container.style.height = viewPortHeight + "px";
            delegate._scaleX = scale;
            delegate._scaleY = scale;
        }


    }
}