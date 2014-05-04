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
/// <reference path="../core/HashObject.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/RenderFilter.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../display/DisplayObjectContainer.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
    /**
     * @class Texture
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     */
    export class Texture extends HashObject{

        public offsetX = 0;
        public offsetY = 0;
        private _path:string;
        public _textureWidth:number = 0;
        public _textureHeight:number = 0;

        public _bitmapData;

        public get bitmapData() {
            return this._bitmapData;
        }

        public set bitmapData(value:any) {
            var scale = ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            this._bitmapData = value;
            this._textureWidth = value.width * scale;
            this._textureHeight = value.height * scale;
        }

        public getTextureWidth():number {
            return this._textureWidth;
        }

        public getTextureHeight():number {
            return this._textureHeight;
        }

        public static create(path:string):Texture {
            var texture:Texture = new Texture();
            texture._path = path;
            return texture;
        }

        public static createWithBase64(base64:string):Texture {
            var texture:Texture = new Texture();
            var img = new Image();
            img.src = base64;
            texture.bitmapData = img;
            return texture;
        }


    }

    export class RenderTexture extends Texture {


        private cacheCanvas:HTMLCanvasElement;

        constructor() {
            super();
            this.cacheCanvas = document.createElement("canvas");

        }

        public drawToTexture(displayObject:ns_egret.DisplayObject):void {
            var cacheCanvas:HTMLCanvasElement = this.cacheCanvas;
            var bounds = displayObject.getBounds();
            cacheCanvas.width = bounds.width;
            cacheCanvas.height = bounds.height;

            displayObject.worldTransform.identity();
            displayObject.worldAlpha = 1;
            //todo container不能改变自己的worldTransform
            if (displayObject instanceof ns_egret.DisplayObjectContainer) {
                this.offsetX = bounds.x;
                this.offsetY = bounds.y;
                displayObject.worldTransform.append(1, 0, 0, 1, -bounds.x, -bounds.y);
                var list = (<ns_egret.DisplayObjectContainer>displayObject)._children;
                for (var i = 0 , length = list.length; i < length; i++) {
                    var child:DisplayObject = list[i];
                    child.updateTransform();
                }
            }

            var renderContext = new ns_egret.HTML5CanvasRenderer(cacheCanvas);
            var renderFilter = ns_egret.RenderFilter.getInstance();
            var drawAreaList:Array<Rectangle> = renderFilter._drawAreaList.concat();
            renderFilter._drawAreaList.length = 0;
            displayObject.render(renderContext);
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