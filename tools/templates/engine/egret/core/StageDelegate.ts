/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="Logger.ts"/>
/// <reference path="../utils/FrameworkUtils.ts"/>
/// <reference path="MainContext.ts"/>
module ns_egret {
    /**
     * StageDelegate负责处理屏幕适配策略
     * 有关屏幕适配策略，更多信息请了解 GitHub:理解egret的GameLauncher
     * @stable B 目前StageDelegate和HTML5有一定的耦合关系，之后会对其解耦，保证NativeApp的正确运行
     */
    export class StageDelegate {
        private static instance:StageDelegate;

        public static getInstance():StageDelegate {
            if (StageDelegate.instance == null) {
                ContainerStrategy.initialize();
                ContentStrategy.initialize();
                StageDelegate.instance = new StageDelegate();
            }
            return StageDelegate.instance;
        }

        public static canvas_name:string = "gameCanvas";
        public static canvas_div_name:string = "gameDiv";

        private _frameWidth:number = null;
        private _frameHeight:number = null;
        private _designWidth:number = null;
        private _designHeight:number = null;
        private _originalDesignWidth:number = null;
        private _originalDesignHeight:number = null;
        private _scaleX = 1;
        private _scaleY = 1;
        private _frame = null;

        private _resolutionPolicy = null;

        constructor() {
            this._frame = document.getElementById(StageDelegate.canvas_div_name);
            this._frameWidth = this._frame.style.width;
            this._frameHeight = this._frame.style.height;

            var canvas:any = document.getElementById(StageDelegate.canvas_name);
            var w = canvas.width, h = canvas.height;
            this._designWidth = w;
            this._designHeight = h;
            this._originalDesignWidth = w;
            this._originalDesignHeight = h;

        }

        public setFrameSize(width, height) {
            this._frameWidth = width;
            this._frameHeight = height;
            this._frame.style.width = width + "px";
            this._frame.style.height = height + "px";
            this._resizeEvent();
        }

        private _resizeEvent() {
            var width = this._originalDesignWidth;
            var height = this._originalDesignHeight;
//    if (this._resizeCallback) {
//        this._initFrameSize();
//        this._resizeCallback.call();
//    }
            if (width > 0)
                this.setDesignSize(width, height, this._resolutionPolicy);
        }

        public setDesignSize(width, height, resolutionPolicy) {
            // Defensive code
            if (isNaN(width) || width == 0 || isNaN(height) || height == 0) {
                ns_egret.Logger.info("Resolution Error");
                return;
            }
            this.setResolutionPolicy(resolutionPolicy);


            var frameW = this._frameWidth, frameH = this._frameHeight;
//        if (ns_egret.Browser.getInstance().isMobile) {
//            this._setViewPortMeta(this._frameWidth, this._frameHeight);
//        }

            this._designWidth = width;
            this._designHeight = height;
            this._originalDesignWidth = width;
            this._originalDesignHeight = height;

            this._resolutionPolicy.apply(this, this._designWidth, this._designHeight);
            ns_egret.MainContext.instance.stage.stageWidth = this._designWidth;
            ns_egret.MainContext.instance.stage.stageHeight = this._designHeight;
        }

        public setResolutionPolicy(resolutionPolicy) {
            if (resolutionPolicy instanceof ResolutionPolicy) {
                this._resolutionPolicy = resolutionPolicy;
            }
            else {
                switch (resolutionPolicy) {
                    case ResolutionPolicy.FIXED_HEIGHT:
                        this._resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.FIXED_HEIGHT);
                        break;
                    case ResolutionPolicy.FIXED_WIDTH:
                        this._resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.FIXED_WIDTH);
                        break;
                }
            }
            if (this._resolutionPolicy != null)
                this._resolutionPolicy.init(this);
            else {
                ns_egret.Logger.fatal("需要先设置resolutionPolicy");
            }
        }

        public getScaleX() {
            return this._scaleX;
        }

        public getScaleY() {
            return this._scaleY;
        }
    }

    export class ResolutionPolicy {
        public static FIXED_HEIGHT = 1;
        public static FIXED_WIDTH = 2;

        private _containerStrategy = null;
        private _contentStrategy = null;

        constructor(containerStg, contentStg) {
            this.setContainerStrategy(containerStg);
            this.setContentStrategy(contentStg);
        }

        public init(view) {
            this._containerStrategy.init(view);
            this._contentStrategy.init(view);
        }

        public apply(view, designedResolutionWidth, designedResolutionHeight) {
            this._containerStrategy.apply(view, designedResolutionWidth, designedResolutionHeight);
            return this._contentStrategy.apply(view, designedResolutionWidth, designedResolutionHeight);
        }

        public setContainerStrategy(containerStg) {
            if (containerStg instanceof ContainerStrategy)
                this._containerStrategy = containerStg;
        }

        public setContentStrategy(contentStg) {
            if (contentStg instanceof ContentStrategy)
                this._contentStrategy = contentStg;
        }
    }

    export class ContainerStrategy {
        public static EQUAL_TO_FRAME = null;

        public static initialize() {
            ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
        }

        public init(view) {

        }

        public apply(view, designedWidth, designedHeight) {
        }

        public _setupContainer(frame, w, h) {
//        if (cc.Browser.isMobile && frame == document.documentElement) {
//            cc.Screen.getInstance().autoFullScreen(cc.canvas);
//        }

            var canvas:any = document.getElementById(StageDelegate.canvas_name), locContainer = document.getElementById(StageDelegate.canvas_div_name);
//            canvas.width = w;
//            canvas.height = h;
//            locContainer.style.width = w + "px";
//            locContainer.style.height = h + "px";

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

        private _fixContainer() {
            document.body.insertBefore(document.getElementById(StageDelegate.canvas_div_name), document.body.firstChild);
            var bs = document.body.style;
            bs.width = window.innerWidth + "px";
            bs.height = window.innerHeight + "px";
            bs.overflow = "hidden";
            var contStyle = document.getElementById(StageDelegate.canvas_div_name).style;
            contStyle.position = "fixed";
            contStyle.left = contStyle.top = "0px";
            document.body.scrollTop = 0;
        }
    }

    export class EqualToFrame extends ContainerStrategy {
        apply(view) {
            this._setupContainer(view._frame, view._frameWidth, view._frameHeight);
        }
    }

    export class ContentStrategy {
        public static FIXED_HEIGHT = null;
        public static FIXED_WIDTH = null;

        public static initialize() {
            ContentStrategy.FIXED_HEIGHT = new FixedHeight();
            ContentStrategy.FIXED_WIDTH = new FixedWidth();
        }

        _result = {
            scale: [1, 1],
            x: null,
            y: null,
            w: null,
            h: null
        };

        public init(view) {

        }

        public apply(view, designedResolutionWidth, designedResolutionHeight) {
            return {"scale": [1, 1]};
        }
    }

    export class FixedHeight extends ContentStrategy {
        public apply(delegate, designedResolutionWidth, designedResolutionHeight) {
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

    export class FixedWidth extends ContentStrategy {
        public apply(delegate:ns_egret.StageDelegate, designedResolutionWidth, designedResolutionHeight) {
            var canvas:HTMLCanvasElement = document.getElementById(StageDelegate.canvas_name);
            var container:HTMLDivElement = document.getElementById(StageDelegate.canvas_div_name);
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

    export class FixedSize extends ContentStrategy {

        private width;
        private height;

        constructor(width, height) {
            this.width = width;
            this.height = height;
        }

        public apply(delegate:ns_egret.StageDelegate, designedResolutionWidth, designedResolutionHeight) {
            var canvas:HTMLCanvasElement = document.getElementById(StageDelegate.canvas_name);
            var container:HTMLDivElement = document.getElementById(StageDelegate.canvas_div_name);
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