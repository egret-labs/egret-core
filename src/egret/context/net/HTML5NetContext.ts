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

/// <reference path="NetContext.ts"/>
/// <reference path="../../resource/ResourceLoader.ts"/>
/// <reference path="../../texture/Texture.ts"/>
/// <reference path="../../texture/TextureCache.ts"/>

module ns_egret {
    export class HTML5NetContext extends NetContext {
        public send(request:URLRequest) {


            function onLoadComplete() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        _processXMLHttpResponse(xhr);
                    } else {
                    }
                }
            }

            function _processXMLHttpResponse(xhr) {
                var data = xhr.responseText;
                if (this.type == ResourceLoader.DATA_TYPE_BINARY) {
                    data = self._stringConvertToArray(data);
                }
                request.callback.call(request.thisObj, data);
            }


            if (request.type == ResourceLoader.DATA_TYPE_IMAGE) {
                this.loadImage(request);
                return;
            }
            var self = this;
            var xhr = this._getXMLHttpRequest();
            xhr.open(request.method, request.prefix + request.url);
            if(request.method != "GET")
            {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            }

            if (request.type != undefined) {
                this._setXMLHttpRequestHeader(xhr, request.type);
            }
            xhr.onreadystatechange = onLoadComplete;
            xhr.send(request.method != "GET" ? request.data : null);

        }

        private loadImage(request:ns_egret.URLRequest):void {
            var image = new Image();
            image.crossOrigin = "Anonymous";
            var fileUrl = request.prefix + request.url;

            function onLoadComplete() {
                image.removeEventListener('load', onLoadComplete);
                image.removeEventListener('error', onLoadComplete);
                var texture:Texture = Texture.create(request.url);
                texture.bitmapData = image;
                TextureCache.getInstance().addTexture(request.url, texture);
                request.callback.call(request.thisObj, texture);

            };
            function onLoadError() {
                image.removeEventListener('error', onLoadError);
            };
            image.addEventListener("load", onLoadComplete);
            image.addEventListener("error", onLoadError);
            image.src = fileUrl;
        }


        private _stringConvertToArray(strData) {
            if (!strData)
                return null;

            var arrData = new Uint8Array(strData.length);
            for (var i = 0; i < strData.length; i++) {
                arrData[i] = strData.charCodeAt(i) & 0xff;
            }
            return arrData;
        }

        private _setXMLHttpRequestHeader(xhr, type) {
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                if (type == ResourceLoader.DATA_TYPE_BINARY) {
                    xhr.setRequestHeader("Accept-Charset", "x-user-defined");
                }
                else {
                    xhr.setRequestHeader("Accept-Charset", "utf-8");
                }

            }
            else {
                if (xhr.overrideMimeType) {
                    if (type == ResourceLoader.DATA_TYPE_BINARY) {
                        xhr.overrideMimeType("text\/plain; charset=x-user-defined");
                    }
                    else {
                        xhr.overrideMimeType("text\/plain; charset=utf-8");
                    }
                }
            }
        }

        private _getXMLHttpRequest() {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            } else {
                return new ActiveXObject("MSXML2.XMLHTTP");
            }
        }
    }
}