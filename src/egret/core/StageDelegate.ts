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

        private _designWidth:number = 0;
        private _designHeight:number = 0;
        private _originalDesignWidth:number = 0;
        private _originalDesignHeight:number = 0;
        public _scaleX = 1;
        public _scaleY = 1;
        private _frame:HTMLElement;

        private _resolutionPolicy;

        constructor() {
            this._frame = document.getElementById(StageDelegate.canvas_div_name);
            var canvas:any = document.getElementById(StageDelegate.canvas_name);
            var w = canvas.width, h = canvas.height;
            this._designWidth = w;
            this._designHeight = h;
            this._originalDesignWidth = w;
            this._originalDesignHeight = h;

        }

        public setFrameSize(width, height) {
            throw new Error("该方法已经被废弃，会在下个版本中删除")
        }

        public setDesignSize(width, height, resolutionPolicy) {
            // Defensive code
            if (isNaN(width) || width == 0 || isNaN(height) || height == 0) {
                ns_egret.Logger.info("Resolution Error");
                return;
            }
            this.setResolutionPolicy(resolutionPolicy);


            this._designWidth = width;
            this._designHeight = height;
            this._originalDesignWidth = width;
            this._originalDesignHeight = height;

            this._resolutionPolicy.apply(this, this._designWidth, this._designHeight);
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

        private _containerStrategy;
        private _contentStrategy;

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
        public static EQUAL_TO_FRAME;

        public static initialize() {
            ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
        }

        public init(view) {

        }

        public apply(view, designedWidth, designedHeight) {
        }

        public _setupContainer() {
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
//            var contStyle = document.getElementById(ns_egret.StageDelegate.canvas_div_name).style;
//            contStyle.position = "fixed";
//            contStyle.left = contStyle.top = "0px";
//            document.body.scrollTop = 0;
        }
    }

    export class EqualToFrame extends ContainerStrategy {
        apply(view) {
            this._setupContainer();
        }
    }

    export class ContentStrategy {
        public static FIXED_HEIGHT:ContentStrategy = null;
        public static FIXED_WIDTH:ContentStrategy = null;

        public static initialize() {
            ContentStrategy.FIXED_HEIGHT = new FixedHeight();
            ContentStrategy.FIXED_WIDTH = new FixedWidth();
        }

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

    export class FixedSize extends ContentStrategy {

        private width;
        private height;

        constructor(width, height) {
            this.width = width;
            this.height = height;
        }

        public apply(delegate:ns_egret.StageDelegate, designedResolutionWidth, designedResolutionHeight) {
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