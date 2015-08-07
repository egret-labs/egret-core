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
        var surface = document.createElement("canvas");
        var renderContext = egret.RendererContext.createRendererContext(surface);

        var w = texture._textureWidth;
        var h = texture._textureHeight;
        if (rect == null) {
            rect = new egret.Rectangle();
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
        surface.style.width = iWidth + "px";
        surface.style.height = iHeight + "px";

        var thisObject:any = {_texture_to_render: texture};

        var scale = egret.MainContext.instance.rendererContext._texture_scale_factor;
        var offsetX:number = texture._offsetX;
        var offsetY:number = texture._offsetY;
        var bitmapWidth:number = texture._bitmapWidth || w;
        var bitmapHeight:number = texture._bitmapHeight || h;

        offsetX = Math.round(offsetX * scale);
        offsetY = Math.round(offsetY * scale);
        RenderFilter.getInstance().drawImage(renderContext, thisObject, texture._bitmapX + rect.x / scale , texture._bitmapY + rect.y / scale,
            bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);

        return surface;
    }

    /**
     * @private
     */
    function toDataURL(type:string, rect?:egret.Rectangle):string {
        try {
            return convertImageToCanvas(this, rect).toDataURL(type);
        }
        catch (e) {
            egret.$error(1033);
            return null;
        }
    }

    function saveToFile(type:string, filePath:string, rect?:egret.Rectangle):void {
        var base64 = toDataURL(type, rect);
        if (base64 == null) {
            return;
        }
        document.location.href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = saveToFile;
}