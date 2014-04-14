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

/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../texture/TextureCache.ts"/>
/// <reference path="../core/MainContext.ts"/>
module ns_egret {
    /**
     * @class ResourceLoader是egret的资源加载核心
     * GitHub 理解egret的资源加载
     */
    export class ResourceLoader extends EventDispatcher {


        url:string = null;
        type:string = null;
        state:number = ResourceLoader.LOAD_STATE_INIT;
        data = null;
        onLoadComplete:Function;
        fixedUrl:string = null;

        constructor(url:string, type:string) {
            super();
            this.url = url;
            var index =  url.indexOf("?");
            if (index > -1){
                this.fixedUrl = url.substring(0,index);
            }
            else{
                this.fixedUrl = url;
            }
            this.type = type;
        }

        /**
         * 加载资源，会根据当前资源状态决定是否要发送网络请求
         */
        public load() {
            switch (this.state) {
                case ResourceLoader.LOAD_STATE_INIT:
                    this.startLoading();
                    break;
                case ResourceLoader.LOAD_STATE_LOADED:
                    ns_egret.Ticker.getInstance().callLater(this._executeAllCallback, this);
                    break;
            }

        }

        private startLoading() {
            if (this.type == ResourceLoader.DATA_TYPE_IMAGE) {
                this._loadByImage();
            }
            else {
                this._loadByAjax();
            }
        }

        private _executeAllCallback(data) {
            this.state = ResourceLoader.LOAD_STATE_LOADED;
            if (data) {
                this.data = data;
            }
            if (this.onLoadComplete) {
                this.onLoadComplete(this.data);
            }
            this.dispatchEvent(ResourceLoader.LOAD_COMPLETE, this.data);
        }

        private _loadByAjax() {
            var fileUrl = ResourceLoader.prefix + this.url;
            var selfPointer = this;
            var request = new ns_egret.URLRequest(fileUrl, onLoadComplete, this);
            request.type = this.type;
            MainContext.instance.netContext.send(request);
            function onLoadComplete(xhr) {
                var fileContents = selfPointer._processXMLHttpResponse(xhr);
                selfPointer._executeAllCallback(fileContents);
            }
        }

        private _loadByImage() {
            var image = new Image();
            image.crossOrigin = "Anonymous";
            var fileUrl = ResourceLoader.prefix + this.url;
            var that = this;
            var onLoadComplete = function () {
                var texture:Texture = Texture.create(that.fixedUrl);
                texture.bitmapData = image;
                TextureCache.getInstance().addTexture(that.fixedUrl, texture);
                image.removeEventListener('load', onLoadComplete);
                image.removeEventListener('error', onLoadComplete);
                that._executeAllCallback(image);

            };
            var onLoadError = function () {
                image.removeEventListener('error', onLoadError);
            };
            image.addEventListener("load", onLoadComplete);
            image.addEventListener("error", onLoadError);
            image.src = fileUrl;
            return image;
        }


        private _setXMLHttpRequestHeader(xhr) {
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                if (this.type == ResourceLoader.DATA_TYPE_BINARY) {
                    xhr.setRequestHeader("Accept-Charset", "x-user-defined");
                }
                else {
                    xhr.setRequestHeader("Accept-Charset", "utf-8");
                }

            }
            else {
                if (xhr.overrideMimeType) {
                    if (this.type == ResourceLoader.DATA_TYPE_BINARY) {
                        xhr.overrideMimeType("text\/plain; charset=x-user-defined");
                    }
                    else {
                        xhr.overrideMimeType("text\/plain; charset=utf-8");
                    }
                }
            }
        }

        private _processXMLHttpResponse(xhr) {
            if (this.type == ResourceLoader.DATA_TYPE_TEXT) {
                return  fileContents = xhr.responseText;
            }
            var fileContents;
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                //fileContents = cc._convertResponseBodyToText(xhr["responseBody"]);
            }
            else {
                fileContents = xhr.responseText;
            }
            return this._stringConvertToArray(fileContents);
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


        public static LOAD_COMPLETE = "resource_load_complete";

        /**
         * 二进制数据
         */
        public static DATA_TYPE_BINARY = "binary";
        /**
         * 文本数据
         */
        public static DATA_TYPE_TEXT = "text";
        /**
         * 图片数据
         */
        public static DATA_TYPE_IMAGE = "image";

        /**
         * 加载状态：未开始
         */
        public static LOAD_STATE_INIT = 0;
        /**
         * 加载状态：已完成
         */
        public static LOAD_STATE_LOADED = 1;

        private static __pool = {};
        /**
         * 资源加载前缀
         */
        public static prefix:string = "";

        public static create(src:string, type:string = "") {
            if (ResourceLoader.__pool[src] == null) {
                var ext:string = src.substring(src.lastIndexOf(".") + 1);
                var handlerClass = ResourceLoader.__registerMap[ext];
                if (!handlerClass) {
                    handlerClass = ns_egret.ResourceLoader;
                }
                ResourceLoader.__pool[src] = new handlerClass(src, type);
            }
            return ResourceLoader.__pool[src];
        }

        private static __registerMap = {};

        public static registerHandler(ext:string, handlerClass:Function) {
            ResourceLoader.__registerMap[ext] = handlerClass;
        }
    }
}