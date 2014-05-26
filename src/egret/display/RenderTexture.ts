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

/// <reference path="../context/renderer/HTML5CanvasRenderer.ts"/>
/// <reference path="../context/renderer/RenderFilter.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
    export class RenderTexture extends Texture {

        private cacheCanvas:HTMLCanvasElement;

        constructor() {
            super();
            this.cacheCanvas = document.createElement("canvas");

        }

        public drawToTexture(displayObject:ns_egret.DisplayObject):void {
            var cacheCanvas:HTMLCanvasElement = this.cacheCanvas;
            var bounds = displayObject.getBounds(Rectangle.identity);
            cacheCanvas.width = bounds.width;
            cacheCanvas.height = bounds.height;

            displayObject.worldTransform.identity();
            displayObject.worldAlpha = 1;
            //todo container不能改变自己的worldTransform
            if (displayObject instanceof ns_egret.DisplayObjectContainer) {
                this._offsetX = bounds.x;
                this._offsetY = bounds.y;
                displayObject.worldTransform.append(1, 0, 0, 1, -bounds.x, -bounds.y);
                var list = (<ns_egret.DisplayObjectContainer>displayObject)._children;
                for (var i = 0 , length = list.length; i < length; i++) {
                    var child:DisplayObject = list[i];
                    child._updateTransform();
                }
            }

            var renderContext = new ns_egret.HTML5CanvasRenderer(cacheCanvas);
            var renderFilter = ns_egret.RenderFilter.getInstance();
            var drawAreaList:Array<Rectangle> = renderFilter._drawAreaList.concat();
            renderFilter._drawAreaList.length = 0;
            displayObject._render(renderContext);
            renderFilter._drawAreaList = drawAreaList;
            this._bitmapData = this.cacheCanvas;
            this._textureWidth = this.cacheCanvas.width;
            this._textureHeight = this.cacheCanvas.height;

            //测试代码
//            renderContext.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
//            renderContext.strokeRect(0, 0,cacheCanvas.width,cacheCanvas.height,"#ff0000");
//            document.documentElement.appendChild(cacheCanvas);
        }
    }
}