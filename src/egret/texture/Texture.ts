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
module ns_egret {
    /**
     * @class Texture
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     */
    export class Texture {

        private _path:string;
        private _textureWidth:number = 0;
        private _textureHeight:number = 0;

        public _bitmapData;

        public get bitmapData() {
            return this._bitmapData;
        }

        public set bitmapData(value) {
            this._bitmapData = value;
            this._textureWidth = value.width * ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            this._textureHeight = value.height * ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
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

        public offsetX = 0;
        public offsetY = 0;

        constructor() {
            this.cacheCanvas = document.createElement("canvas");

        }

        public drawToTexture(displayObject:ns_egret.DisplayObject):void {
            var scale = 1 / ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            var cacheCanvas = this.cacheCanvas;
            var bounds = displayObject.getBounds();
            cacheCanvas.width = bounds.width;
            cacheCanvas.height = bounds.height;
            this.offsetX = bounds.x;
            this.offsetY = bounds.y;
            var canvasContext = cacheCanvas.getContext("2d");
            canvasContext.scale(scale,scale);
            displayObject.worldTransform.identity();
            displayObject.worldTransform.append(1,0,0,1,-bounds.x, -bounds.y);

            var renderContext = new ns_egret.HTML5CanvasRenderer(cacheCanvas);
            renderContext.texture_scale_factor = 1 /  scale;
            displayObject.worldAlpha = 1;
            displayObject.render(renderContext);

            this.bitmapData = this.cacheCanvas;

//            renderContext.strokeRect(-bounds.x, -bounds.y,cacheCanvas.width,cacheCanvas.height,"#ff0000");
//            document.documentElement.appendChild(cacheCanvas);
        }
    }
}