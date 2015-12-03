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
    export class NativeNetContext extends HashObject implements NetContext {

        public static __use_asyn:boolean = egret_native.readFileAsync == null ? false : true;


        public constructor() {
            super();
        }

        private urlData:any = {};

        /**
         * @method egret.HTML5NetContext#proceed
         * @param loader {URLLoader}
         */
        public proceed(loader:URLLoader):void {
            var self = this;
            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                self.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                self.loadSound(loader);
                return;
            }

            var request:URLRequest = loader._request;
            var virtualUrl:string = self.getVirtualUrl($getUrl(request));
            var httpRequest = new HttpRequest();
            httpRequest.open(virtualUrl, request.method == URLRequestMethod.POST ? HttpMethod.POST : HttpMethod.GET);
            var length = request.requestHeaders.length;
            for (var i:number = 0; i < length; i++) {
                var urlRequestHeader:egret.URLRequestHeader = request.requestHeaders[i];
                httpRequest.setRequestHeader(urlRequestHeader.name, urlRequestHeader.value);
            }
            httpRequest.addEventListener(Event.COMPLETE, function (){
                loader.data = httpRequest.response;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }, this);
            httpRequest.addEventListener(IOErrorEvent.IO_ERROR, function (){
                IOErrorEvent.dispatchIOErrorEvent(loader);
            }, this);
            httpRequest.responseType = loader.dataFormat == URLLoaderDataFormat.BINARY ? HttpResponseType.ARRAY_BUFFER : HttpResponseType.TEXT;
            httpRequest.send(request.data);
        }

        private loadSound(loader:URLLoader) {
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

                $callAsync(function() {
                    loader.dispatchEventWith(Event.COMPLETE);
                }, self);
            }

            function removeListeners():void {
                sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                sound.removeEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, self);
            }
        }

        private loadTexture(loader:URLLoader):void {
            var self = this;
            var request = loader._request;
            var virtualUrl:string = self.getVirtualUrl(request.url);

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

                var bitmapData = <any>imageLoader.data;
                //bitmapData.setAttribute("bitmapSrc", virtualUrl);

                var texture:Texture = new Texture();
                texture._setBitmapData(bitmapData);

                loader.data = texture;

                egret.$callAsync(function () {
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
         * 是否是网络地址
         * @param url
         * @returns {boolean}
         */
        private isNetUrl(url:string):boolean {
            return url.indexOf("http://") != -1;
        }

        /**
         * 获取虚拟url
         * @param url
         * @returns {string}
         */
        public getVirtualUrl(url:string):string {
            return url;
        }

        static _instance:NativeNetContext;

        static getNetContext():NativeNetContext {
            if (NativeNetContext._instance == null) {
                NativeNetContext._instance = new NativeNetContext();
            }
            return NativeNetContext._instance;
        }
    }

    NetContext = NativeNetContext;
}