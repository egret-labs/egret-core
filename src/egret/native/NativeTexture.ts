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


module egret.native {

    /**
     * @private
     */
    function convertImageToRenderTexture(texture:egret.Texture, rect?:egret.Rectangle):egret.native.NativeSurface {
        var surface = sys.surfaceFactory.create(true);
        if (!surface) {
            return null;
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
        surface.width = iWidth;
        surface.height = iHeight;
        //surface["style"]["width"]= iWidth + "px";
        //surface["style"]["height"] = iHeight + "px";

        var bitmapData = texture;
        var renderContext = surface.renderContext;
        renderContext.imageSmoothingEnabled = false;
        var offsetX:number = Math.round(bitmapData._offsetX);
        var offsetY:number = Math.round(bitmapData._offsetY);
        var bitmapWidth:number = bitmapData._bitmapWidth;
        var bitmapHeight:number = bitmapData._bitmapHeight;
        renderContext.globalAlpha = 1;
        renderContext.globalCompositeOperation = "source-over";
        renderContext.setTransform(1, 0, 0, 1, 0, 0);
        renderContext.drawImage(bitmapData._bitmapData, bitmapData._bitmapX + rect.x / $TextureScaleFactor, bitmapData._bitmapY + rect.y / $TextureScaleFactor,
            bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
        return <egret.native.NativeSurface>surface;
    }

    /**
     * @private
     */
    function toDataURL(type:string, rect?:egret.Rectangle):string {
        try {
            var renderTexture = convertImageToRenderTexture(this, rect);
            var base64 = renderTexture.toDataURL(type);
            renderTexture.$dispose();
            return base64
        }
        catch (e) {
            egret.$error(1033);
            return null;
        }
    }


    function saveToFile(type:string, filePath:string, rect?:egret.Rectangle):void {
        try {
            var renderTexture = convertImageToRenderTexture(this, rect);
            renderTexture.saveToFile(type, filePath);
            renderTexture.$dispose();
        }
        catch (e) {
            egret.$error(1033);
        }
    }

    function getPixel32(x:number, y:number):number[] {
        egret.$error(1035);
        return null;
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = saveToFile;
    Texture.prototype.getPixel32 = getPixel32;
}