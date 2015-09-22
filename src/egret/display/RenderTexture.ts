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
     * @class egret.RenderTexture
     * @classdesc
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @includeExample egret/display/RenderTexture.ts
     */
    export class RenderTexture extends Texture {
        /**
         * @private
         */
        public renderContext;

        /**
         * 创建一个 egret.RenderTexture 对象
         */
        constructor() {
            super();
        }

        /**
         * @private
         */
        public init():void {
            this._bitmapData = document.createElement("canvas");
            this._bitmapData["avaliable"] = true;
            this.renderContext = egret.RendererContext.createRendererContext(this._bitmapData);
        }

        /**
         * @private
         */
        public static identityRectangle:egret.Rectangle = new egret.Rectangle();

        /**
         * 将指定显示对象绘制为一个纹理
         * @method egret.RenderTexture#drawToTexture
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         */
        public drawToTexture(displayObject:egret.DisplayObject, clipBounds?:Rectangle, scale?:number):boolean {
            var bounds = clipBounds || displayObject.getBounds(Rectangle.identity);
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }

            if (!this._bitmapData) {
                this.init();
            }

            var x = bounds.x;
            var y = bounds.y;
            var originalWidth = bounds.width;
            var originalHeight = bounds.height;
            var width = originalWidth;
            var height = originalHeight;

            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            width /= texture_scale_factor;
            height /= texture_scale_factor;

            width = Math.round(width);
            height = Math.round(height);

            this.setSize(width, height);
            this.begin();

            displayObject._worldTransform.identity();
            displayObject._worldTransform.a = 1 / texture_scale_factor;
            displayObject._worldTransform.d = 1 / texture_scale_factor;
            if (scale) {
                displayObject._worldTransform.a *= scale;
                displayObject._worldTransform.d *= scale;
            }
            var anchorOffsetX:number = displayObject._DO_Props_._anchorOffsetX;
            var anchorOffsetY:number = displayObject._DO_Props_._anchorOffsetY;
            if (displayObject._DO_Props_._anchorX != 0 || displayObject._DO_Props_._anchorY != 0) {
                anchorOffsetX = displayObject._DO_Props_._anchorX * width;
                anchorOffsetY = displayObject._DO_Props_._anchorY * height;
            }
            this._offsetX = x + anchorOffsetX;
            this._offsetY = y + anchorOffsetY;
            displayObject._worldTransform.append(1, 0, 0, 1, -this._offsetX, -this._offsetY);
            if (clipBounds) {
                this._offsetX -= x;
                this._offsetY -= y;
            }
            displayObject.worldAlpha = 1;
            if (displayObject instanceof egret.DisplayObjectContainer) {
                var list = (<egret.DisplayObjectContainer>displayObject)._children;
                for (var i = 0, length = list.length; i < length; i++) {
                    var child:DisplayObject = list[i];
                    child._updateTransform();
                }
            }
            this.renderContext.setTransform(displayObject._worldTransform);

            var renderFilter = egret.RenderFilter.getInstance();
            var drawAreaList:Array<Rectangle> = renderFilter._drawAreaList.concat();
            renderFilter._drawAreaList.length = 0;
            this.renderContext.clearScreen();
            this.renderContext.onRenderStart();
            Texture.deleteWebGLTexture(this);
            if (displayObject._hasFilters()) {
                displayObject._setGlobalFilters(this.renderContext);
            }
            var mask = displayObject.mask || displayObject._DO_Props_._scrollRect;
            if (mask) {
                this.renderContext.pushMask(mask);
            }
            var __use_new_draw = MainContext.__use_new_draw;
            MainContext.__use_new_draw = false;
            displayObject._render(this.renderContext);
            MainContext.__use_new_draw = __use_new_draw;
            if (mask) {
                this.renderContext.popMask();
            }
            if (displayObject._hasFilters()) {
                displayObject._removeGlobalFilters(this.renderContext);
            }
            RenderTexture.identityRectangle.width = width;
            RenderTexture.identityRectangle.height = height;
            renderFilter.addDrawArea(RenderTexture.identityRectangle);
            this.renderContext.onRenderFinish();
            renderFilter._drawAreaList = drawAreaList;
            this._sourceWidth = width;
            this._sourceHeight = height;
            this._textureWidth = Math.round(originalWidth);
            this._textureHeight = Math.round(originalHeight);

            this.end();

            //测试代码
//            var cacheCanvas:HTMLCanvasElement = this._bitmapData;
//            this.renderContext.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
//            this.renderContext.strokeRect(0, 0,cacheCanvas.width,cacheCanvas.height,"#ff0000");
//            document.documentElement.appendChild(cacheCanvas);

            return true;
        }

        /**
         * @private
         */
        public setSize(width:number, height:number):void {
            var cacheCanvas:HTMLCanvasElement = this._bitmapData;
            cacheCanvas.width = width;
            cacheCanvas.height = height;
            cacheCanvas.style.width = width + "px";
            cacheCanvas.style.height = height + "px";

            if (this.renderContext._cacheCanvas) {
                this.renderContext._cacheCanvas.width = width;
                this.renderContext._cacheCanvas.height = height;
            }
        }

        /**
         * @private
         */
        public begin():void {

        }

        /**
         * @private
         */
        public end():void {

        }

        /**
         * 销毁 RenderTexture 对象
         * @method egret.RenderTexture#dispose
         */
        public dispose():void {
            if (this._bitmapData) {
                this._bitmapData = null;
                this.renderContext = null;
            }
        }

        private static _pool:Array<RenderTexture> = [];

        /**
         * @private
         */
        public static create():RenderTexture {
            if (RenderTexture._pool.length) {
                return RenderTexture._pool.pop();
            }
            return new RenderTexture();
        }

        /**
         * @private
         */
        public static release(value:RenderTexture):void {
            RenderTexture._pool.push(value);
        }
    }
}