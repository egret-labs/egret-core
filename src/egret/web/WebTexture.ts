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


namespace egret.web {

    let sharedCanvas: HTMLCanvasElement;
    let sharedContext: CanvasRenderingContext2D;

    /**
     * @private
     */
    function convertImageToCanvas(texture: egret.Texture, rect?: egret.Rectangle): HTMLCanvasElement {
        if (!sharedCanvas) {
            sharedCanvas = document.createElement("canvas");
            sharedContext = sharedCanvas.getContext("2d");
        }

        let w = texture.$getTextureWidth();
        let h = texture.$getTextureHeight();
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

        let iWidth = rect.width;
        let iHeight = rect.height;
        let surface = sharedCanvas;
        surface["style"]["width"] = iWidth + "px";
        surface["style"]["height"] = iHeight + "px";
        sharedCanvas.width = iWidth;
        sharedCanvas.height = iHeight;

        if (Capabilities.$renderMode == "webgl") {
            let renderTexture: RenderTexture;
            //webgl下非RenderTexture纹理先画到RenderTexture
            if (!(<RenderTexture>texture).$renderBuffer) {
                renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(new egret.Bitmap(texture));
            }
            else {
                renderTexture = <RenderTexture>texture;
            }
            //从RenderTexture中读取像素数据，填入canvas
            let pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
            let imageData = new ImageData(iWidth, iHeight);
            for (let i = 0; i < pixels.length; i++) {
                imageData.data[i] = pixels[i];
            }
            sharedContext.putImageData(imageData, 0, 0);

            if (!(<RenderTexture>texture).$renderBuffer) {
                renderTexture.dispose();
            }

            return surface;
        }
        else {
            let bitmapData = texture;
            let offsetX: number = Math.round(bitmapData.$offsetX);
            let offsetY: number = Math.round(bitmapData.$offsetY);
            let bitmapWidth: number = bitmapData.$bitmapWidth;
            let bitmapHeight: number = bitmapData.$bitmapHeight;
            sharedContext.drawImage(bitmapData.$bitmapData.source, bitmapData.$bitmapX + rect.x / $TextureScaleFactor, bitmapData.$bitmapY + rect.y / $TextureScaleFactor,
                bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            return surface;
        }
    }

    /**
     * @private
     */
    function toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?): string {
        try {
            let surface = convertImageToCanvas(this, rect);
            let result = surface.toDataURL(type, encoderOptions);
            return result;
        }
        catch (e) {
            egret.$error(1033);
        }
        return null;
    }

    /**
     * 有些杀毒软件认为 saveToFile 可能是一个病毒文件
     */
    function eliFoTevas(type: string, filePath: string, rect?: egret.Rectangle, encoderOptions?): void {
        let base64 = toDataURL.call(this, type, rect, encoderOptions);
        if (base64 == null) {
            return;
        }

        let href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
        let aLink = document.createElement('a');
        aLink['download'] = filePath;
        aLink.href = href;

        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        aLink.dispatchEvent(evt);
    }

    function getPixel32(x: number, y: number): number[] {
        egret.$warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    function getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
        try {
            let surface = convertImageToCanvas(this);
            let result = sharedContext.getImageData(x, y, width, height).data;
            return <number[]><any>result;
        }
        catch (e) {
            egret.$error(1039);
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = eliFoTevas;
    Texture.prototype.getPixel32 = getPixel32;
    Texture.prototype.getPixels = getPixels;
}