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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeNetContext = (function (_super) {
            __extends(NativeNetContext, _super);
            function NativeNetContext() {
                _super.call(this);
                this.urlData = {};
            }
            var d = __define,c=NativeNetContext,p=c.prototype;
            /**
             * @method egret.HTML5NetContext#proceed
             * @param loader {URLLoader}
             */
            p.proceed = function (loader) {
                var self = this;
                if (loader.dataFormat == egret.URLLoaderDataFormat.TEXTURE) {
                    self.loadTexture(loader);
                    return;
                }
                if (loader.dataFormat == egret.URLLoaderDataFormat.SOUND) {
                    self.loadSound(loader);
                    return;
                }
                var request = loader._request;
                var virtualUrl = self.getVirtualUrl(egret.$getUrl(request));
                var httpRequest = new egret.HttpRequest();
                httpRequest.open(virtualUrl, request.method == egret.URLRequestMethod.POST ? egret.HttpMethod.POST : egret.HttpMethod.GET);
                var length = request.requestHeaders.length;
                for (var i = 0; i < length; i++) {
                    var urlRequestHeader = request.requestHeaders[i];
                    httpRequest.setRequestHeader(urlRequestHeader.name, urlRequestHeader.value);
                }
                httpRequest.addEventListener(egret.Event.COMPLETE, function () {
                    loader.data = httpRequest.response;
                    egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
                }, this);
                httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                }, this);
                httpRequest.responseType = loader.dataFormat == egret.URLLoaderDataFormat.BINARY ? egret.HttpResponseType.ARRAY_BUFFER : egret.HttpResponseType.TEXT;
                httpRequest.send(request.data);
            };
            p.loadSound = function (loader) {
                var self = this;
                var virtualUrl = this.getVirtualUrl(loader._request.url);
                var sound = new egret.Sound();
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                sound.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
                sound.load(virtualUrl);
                function onPostProgress(event) {
                    loader.dispatchEvent(event);
                }
                function onError(event) {
                    removeListeners();
                    loader.dispatchEvent(event);
                }
                function onLoadComplete(e) {
                    removeListeners();
                    loader.data = sound;
                    var loadedFunc = function () {
                        loader.dispatchEventWith(egret.Event.COMPLETE);
                    };
                    if (__global.setTimeout) {
                        __global.setTimeout(loadedFunc, 0);
                    }
                    else {
                        egret.$callAsync(loadedFunc, self);
                    }
                }
                function removeListeners() {
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                    sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                    sound.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
                }
            };
            p.loadTexture = function (loader) {
                var self = this;
                var request = loader._request;
                var virtualUrl = self.getVirtualUrl(request.url);
                var imageLoader = new egret.ImageLoader();
                imageLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                imageLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                imageLoader.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
                imageLoader.load(virtualUrl);
                function onPostProgress(event) {
                    loader.dispatchEvent(event);
                }
                function onError(event) {
                    removeListeners();
                    loader.dispatchEvent(event);
                }
                function onLoadComplete(e) {
                    removeListeners();
                    var bitmapData = imageLoader.data;
                    //bitmapData.setAttribute("bitmapSrc", virtualUrl);
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    loader.data = texture;
                    var loadedFunc = function () {
                        loader.dispatchEventWith(egret.Event.COMPLETE);
                    };
                    if (__global.setTimeout) {
                        __global.setTimeout(loadedFunc, 0);
                    }
                    else {
                        egret.$callAsync(loadedFunc, self);
                    }
                }
                function removeListeners() {
                    imageLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                    imageLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                    imageLoader.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
                }
            };
            /**
             * 是否是网络地址
             * @param url
             * @returns {boolean}
             */
            p.isNetUrl = function (url) {
                return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1;
            };
            /**
             * 获取虚拟url
             * @param url
             * @returns {string}
             */
            p.getVirtualUrl = function (url) {
                return url;
            };
            NativeNetContext.getNetContext = function () {
                if (NativeNetContext._instance == null) {
                    NativeNetContext._instance = new NativeNetContext();
                }
                return NativeNetContext._instance;
            };
            NativeNetContext.__use_asyn = egret_native.readFileAsync == null ? false : true;
            return NativeNetContext;
        }(egret.HashObject));
        native.NativeNetContext = NativeNetContext;
        egret.registerClass(NativeNetContext,'egret.native.NativeNetContext',["egret.NetContext"]);
        egret.NetContext = NativeNetContext;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
