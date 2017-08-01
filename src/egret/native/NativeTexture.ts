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


namespace egret.native {

    /**
     * @private
     */
    function convertImageToRenderTexture(texture: egret.Texture, rect?: egret.Rectangle): NativeCanvasRenderBuffer {
        let buffer = <NativeCanvasRenderBuffer><any>sys.canvasHitTestBuffer;
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
        let surface = buffer.surface;
        buffer.resize(iWidth, iHeight);

        let bitmapData = texture;
        let offsetX: number = Math.round(bitmapData._offsetX);
        let offsetY: number = Math.round(bitmapData._offsetY);
        let bitmapWidth: number = bitmapData._bitmapWidth;
        let bitmapHeight: number = bitmapData._bitmapHeight;
        buffer.context.drawImage(bitmapData._bitmapData.source, bitmapData._bitmapX + rect.x / $TextureScaleFactor, bitmapData._bitmapY + rect.y / $TextureScaleFactor,
            bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);

        return buffer;
    }

    /**
     * @private
     */
    function toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?): string {
        try {
            let buffer = convertImageToRenderTexture(this, rect);
            //todo encoderOptions
            let base64 = buffer.toDataURL(type);
            return base64
        }
        catch (e) {
            egret.$error(1033);
            return null;
        }
    }


    function saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void {
        try {
            let buffer = convertImageToRenderTexture(this, rect);
            buffer.surface.saveToFile(type, filePath);
        }
        catch (e) {
            egret.$error(1033);
        }
    }

    function getPixel32(x: number, y: number): number[] {
        egret.$warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    function getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
        let self = this;
        if ((<RenderTexture>self).$renderBuffer) {
            return (<RenderTexture>self).$renderBuffer.getPixels(x, y, width, height);
        }
        else {
            try {
                let buffer = convertImageToRenderTexture(this);
                return buffer.getPixels(x, y, width, height);
            }
            catch (e) {
                egret.$error(1033);
            }
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = saveToFile;
    Texture.prototype.getPixel32 = getPixel32;
    Texture.prototype.getPixels = getPixels;
}