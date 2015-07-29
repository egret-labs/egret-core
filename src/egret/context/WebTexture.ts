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
    function convertImageToCanvas(texture:egret.Texture):HTMLCanvasElement {
        var surface = document.createElement("canvas");
        var renderContext = egret.RendererContext.createRendererContext(surface);

        var iWidth = texture._textureWidth;
        var iHeight = texture._textureHeight;
        surface.width = iWidth;
        surface.height = iHeight;
        surface.style.width = iWidth + "px";
        surface.style.height = iHeight + "px";

        var thisObject = {_texture_to_render: texture};
        Bitmap._drawBitmap(renderContext, iWidth, iHeight, thisObject);

        return surface;
    }

    /**
     * @private
     */
    function toDataURL(type:string):string {
        try {
            return convertImageToCanvas(this).toDataURL(type);
        }
        catch (e) {
            egret.$error(1033);
            return null;
        }
    }

    /**
     * @private
     */
    function download(base64:string) {
        if (base64 == null) {
            return;
        }
        document.location.href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
    }

    /**
     * @private
     */
    function renderTextureToDataURL(type:string) {
        try {
            return this._bitmapData.toDataURL(type);
        }
        catch (e) {
            egret.$error(1033);
            return null;
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.download = download;

    RenderTexture.prototype.toDataURL = toDataURL;
}