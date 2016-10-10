//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

    var sharedCanvas: HTMLCanvasElement;
    var sharedContext: CanvasRenderingContext2D;

    /**
     * @private
     */
    function convertImageToCanvas(texture: egret.Texture, rect?: egret.Rectangle): HTMLCanvasElement {
        if (!sharedCanvas) {
            sharedCanvas = document.createElement("canvas");
            sharedContext = sharedCanvas.getContext("2d");
        }

        var w = texture.$getTextureWidth();
        var h = texture.$getTextureHeight();
        if (rect == null) {
            rect = egret.$TempRectangle;
            rect.x = 0;
            rect.y = 0;
            rect.width = w;
            rect.height = h;
        }

        rect.x = Math.min(rect.x, w - 1);
        rect.y = Math.min(rect.y, h - 1);
        rect.width = Math.min(rect.width, w - rect.x);
        rect.height = Math.min(rect.height, h - rect.y);

        var iWidth = rect.width;
        var iHeight = rect.height;
        var surface = sharedCanvas;
        surface["style"]["width"] = iWidth + "px";
        surface["style"]["height"] = iHeight + "px";
        sharedCanvas.width = iWidth;
        sharedCanvas.height = iHeight;

        if (Capabilities.$renderMode == "webgl") {
            var renderTexture: RenderTexture;
            //webgl下非RenderTexture纹理先画到RenderTexture
            if (!(<RenderTexture>texture).$renderBuffer) {
                renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(new egret.Bitmap(texture));
            }
            else {
                renderTexture = <RenderTexture>texture;
            }
            //从RenderTexture中读取像素数据，填入canvas
            var pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
            var imageData = new ImageData(iWidth, iHeight);
            for (var i = 0; i < pixels.length; i++) {
                imageData.data[i] = pixels[i];
            }
            sharedContext.putImageData(imageData, 0, 0);

            if (!(<RenderTexture>texture).$renderBuffer) {
                renderTexture.dispose();
            }

            return surface;
        }
        else {
            var bitmapData = texture;
            var offsetX: number = Math.round(bitmapData._offsetX);
            var offsetY: number = Math.round(bitmapData._offsetY);
            var bitmapWidth: number = bitmapData._bitmapWidth;
            var bitmapHeight: number = bitmapData._bitmapHeight;
            sharedContext.drawImage(bitmapData._bitmapData.source, bitmapData._bitmapX + rect.x / $TextureScaleFactor, bitmapData._bitmapY + rect.y / $TextureScaleFactor,
                bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            return surface;
        }
    }

    /**
     * @private
     */
    function toDataURL(type: string, rect?: egret.Rectangle): string {
        try {
            var surface = convertImageToCanvas(this, rect);
            var result = surface.toDataURL(type);
            return result;
        }
        catch (e) {
            egret.$error(1033);
        }
        return null;
    }

    function saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void {
        var base64 = toDataURL.call(this, type, rect);
        if (base64 == null) {
            return;
        }

        var href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
        var aLink = document.createElement('a');
        aLink['download'] = filePath;
        aLink.href = href;

        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
        aLink.dispatchEvent(evt);
    }

    function getPixel32(x: number, y: number): number[] {
        egret.$warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    function getPixels(x: number, y: number, width:number = 1, height:number = 1): number[] {
        try {
            var surface = convertImageToCanvas(this);
            var result = sharedContext.getImageData(x, y, width, height).data;
            return <number[]><any>result;
        }
        catch (e) {
            egret.$error(1039);
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = saveToFile;
    Texture.prototype.getPixel32 = getPixel32;
    Texture.prototype.getPixels = getPixels;
}