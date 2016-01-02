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


module egret.web {

    /**
     * @private
     */
    function convertImageToCanvas(texture:egret.Texture, rect?:egret.Rectangle):HTMLCanvasElement {
        var surface = $hitTestSurface;
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
        surface.width = iWidth;
        surface.height = iHeight;
        surface["style"]["width"] = iWidth + "px";
        surface["style"]["height"] = iHeight + "px";

        var bitmapData = texture;
        var offsetX:number = Math.round(bitmapData._offsetX);
        var offsetY:number = Math.round(bitmapData._offsetY);
        var bitmapWidth:number = bitmapData._bitmapWidth;
        var bitmapHeight:number = bitmapData._bitmapHeight;
        $hitTestRenderContext.drawImage(bitmapData._bitmapData, bitmapData._bitmapX + rect.x / $TextureScaleFactor, bitmapData._bitmapY + rect.y / $TextureScaleFactor,
            bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);

        return surface;
    }

    /**
     * @private
     */
    function toDataURL(type:string, rect?:egret.Rectangle):string {
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

    function saveToFile(type:string, filePath:string, rect?:egret.Rectangle):void {
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

    function getPixel32(x:number, y:number):number[] {
        var surface = $hitTestSurface;
        surface.width = surface.height = 3;
        var context = $hitTestRenderContext;
        context.translate(1 - x, 1 - y);
        var width = this._bitmapWidth;
        var height = this._bitmapHeight;
        var scale = $TextureScaleFactor;
        context.drawImage(this._bitmapData, this._bitmapX, this._bitmapY, width, this._bitmapHeight,
            this._offsetX, this._offsetY, width * scale, height * scale);
        try {
            var data = context.getImageData(1, 1, 1, 1).data;
        }
        catch (e) {
            console.log(this);
            throw new Error(sys.tr(1039));
        }
        return data;
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = saveToFile;
    Texture.prototype.getPixel32 = getPixel32;
}