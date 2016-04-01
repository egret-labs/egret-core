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
     * @class egret.HTML5NetContext
     * @classdesc
     * @extends egret.NetContext
     * @private
     */
    export class HTML5NetContext extends HashObject implements NetContext {

        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         *
         * @param loader
         */
        public proceed(loader:URLLoader):void {
            var self = this;
            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                this.loadSound(loader);
                return;
            }


            var request:URLRequest = loader._request;
            var virtualUrl:string = self.getVirtualUrl(egret.$getUrl(request));

            var httpLoader:egret.HttpRequest = new egret.HttpRequest();
            httpLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
            httpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
            httpLoader.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, this);

            httpLoader.open(virtualUrl, request.method);

            httpLoader.responseType = this.getResponseType(loader.dataFormat);
            if (request.method == URLRequestMethod.GET || !request.data) {
                httpLoader.send();
            }
            else if (request.data instanceof URLVariables) {
                httpLoader.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var urlVars:URLVariables = <URLVariables> request.data;
                httpLoader.send(urlVars.toString());
            }
            else {
                httpLoader.setRequestHeader("Content-Type", "multipart/form-data");
                httpLoader.send(request.data);
            }


            /*function onReadyStateChange() {
             if (xhr.readyState == 4) {// 4 = "loaded"
             if (xhr.status != loader._status) {
             loader._status = xhr.status;
             HTTPStatusEvent.dispatchHTTPStatusEvent(loader, xhr.status);
             }

             if (xhr.status >= 400 || xhr.status == 0) {//请求错误
             IOErrorEvent.dispatchIOErrorEvent(loader);
             }
             else {
             onLoadComplete();
             }
             }
             }*/
            function onPostProgress(event:egret.ProgressEvent):void {
                loader.dispatchEvent(event);
            }

            function onError(event:egret.IOErrorEvent) {
                removeListeners();
                loader.dispatchEvent(event);
            }

            function onLoadComplete() {
                removeListeners();
                switch (loader.dataFormat) {
                    case URLLoaderDataFormat.VARIABLES:
                        loader.data = new URLVariables(httpLoader.response);
                        break;

                    //case URLLoaderDataFormat.TEXT:
                    //    loader.data = httpLoader.response;
                    //    break;
                    //case URLLoaderDataFormat.BINARY:
                    //    loader.data = httpLoader.response;
                    //    break;
                    default:
                        loader.data = httpLoader.response;
                        break;
                }
                window.setTimeout(function () {
                    Event.dispatchEvent(loader, Event.COMPLETE)
                }, 0);
            }

            function removeListeners():void {
                httpLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                httpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                httpLoader.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            }
        }

        /**
         * @private
         *
         * @param dataFormat
         */
        private getResponseType(dataFormat:string):string {
            switch (dataFormat) {
                case URLLoaderDataFormat.TEXT:
                case URLLoaderDataFormat.VARIABLES:
                    return URLLoaderDataFormat.TEXT;
                case URLLoaderDataFormat.BINARY:
                    return "arraybuffer";

                default:
                    return dataFormat;
            }

        }

        /**
         * @private
         *
         * @param loader
         */
        private loadSound(loader:URLLoader):void {
            var self = this;
            var virtualUrl:string = this.getVirtualUrl(loader._request.url);

            var sound:egret.Sound = new egret.Sound();
            sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, self);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
            sound.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            sound.load(virtualUrl);

            function onPostProgress(event:egret.ProgressEvent):void {
                loader.dispatchEvent(event);
            }

            function onError(event:egret.IOErrorEvent) {
                removeListeners();
                loader.dispatchEvent(event);
            }

            function onLoadComplete(e) {
                removeListeners();

                loader.data = sound;

                window.setTimeout(function() {
                    loader.dispatchEventWith(Event.COMPLETE);
                }, 0);
            }

            function removeListeners():void {
                sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                sound.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            }
        }

        /**
         * @private
         *
         * @param loader
         */
        private loadTexture(loader:URLLoader):void {
            var self = this;

            var virtualUrl:string = this.getVirtualUrl(loader._request.url);
            var imageLoader:ImageLoader = new ImageLoader();
            imageLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, self);
            imageLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
            imageLoader.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            imageLoader.load(virtualUrl);

            function onPostProgress(event:egret.ProgressEvent):void {
                loader.dispatchEvent(event);
            }

            function onError(event:egret.IOErrorEvent) {
                removeListeners();
                loader.dispatchEvent(event);
            }

            function onLoadComplete(e) {
                removeListeners();

                var bitmapData = <HTMLImageElement><any>imageLoader.data;
                bitmapData.setAttribute("bitmapSrc", virtualUrl);

                var texture:Texture = new Texture();
                texture._setBitmapData(bitmapData);

                loader.data = texture;

                window.setTimeout(function() {
                    loader.dispatchEventWith(Event.COMPLETE);
                }, self);
            }

            function removeListeners():void {
                imageLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                imageLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                imageLoader.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            }
        }

        /**
         * @private
         *
         * @returns
         */
        public getChangeList():Array<any> {
            return [];
        }

        /**
         * @private
         * 获取虚拟url
         * @param url
         * @returns {string}
         */
        public getVirtualUrl(url:string):string {
            return url;
        }

        static _instance:HTML5NetContext;

        static getNetContext():HTML5NetContext {
            if (HTML5NetContext._instance == null) {
                HTML5NetContext._instance = new HTML5NetContext();
            }
            return HTML5NetContext._instance;
        }
    }

    NetContext = HTML5NetContext;
}
