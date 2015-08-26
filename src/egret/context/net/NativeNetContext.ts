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


module egret {

    /**
     * @private
     */
    export class NativeNetContext extends NetContext {

        public _versionCtr:egret.IVersionController;

        public static __use_asyn:boolean = egret_native.readFileAsync == null ? false : true;

        public constructor() {
            super();
            Texture.createBitmapData = Texture._createBitmapDataForNative;
        }

        public initVersion(versionCtr:egret.IVersionController):void {
            this._versionCtr = versionCtr;
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
            var virtualUrl:string = self.getVirtualUrl(NetContext._getUrl(request));

            if (self.isNetUrl(virtualUrl)) {//网络请求
                self.urlData.type = request.method;
                //写入POST数据
                if (request.method == URLRequestMethod.POST && request.data) {
                    var urlVars:URLVariables = <URLVariables> request.data;
                    self.urlData.data = urlVars.toString();
                }
                else {
                    delete self.urlData["data"];
                }
                //写入header信息
                if (request.requestHeaders) {
                    self.urlData.header = self.getHeaderString(request);
                }
                else {
                    delete self.urlData.header;
                }
                var promise = PromiseObject.create();
                promise.onSuccessFunc = function (getted_str) {
                    loader.data = getted_str;
                    callLater(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                };
                promise.onErrorFunc = function (error_code) {
                    $warn(1019, error_code);
                    IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.requireHttp(virtualUrl, self.urlData, promise);
            }
            else if (!egret_native.isFileExists(virtualUrl)) {
                download();
            }
            else if (!self.checkIsNewVersion(virtualUrl)) {
                download();
            }
            else {
                if (NativeNetContext.__use_asyn) {
                    //异步读取
                    readFileAsync();
                }
                else {
                    //同步读取
                    __callAsync(onLoadComplete, self);
                }
            }

            function readFileAsync() {
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (content) {
                    self.saveVersion(virtualUrl);
                    loader.data = content;
                    Event.dispatchEvent(loader, Event.COMPLETE);
                };
                egret_native.readFileAsync(virtualUrl, promise);
            }

            function download() {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    Event.dispatchEvent(loader, IOErrorEvent.IO_ERROR);
                };
                egret_native.download(virtualUrl, virtualUrl, promise);
            }

            function onLoadComplete() {
                self.saveVersion(virtualUrl);
                var content = egret_native.readFileSync(virtualUrl);
                loader.data = content;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }
        }

        private getHeaderString(request:URLRequest):string {
            var headerObj = {};
            var length = request.requestHeaders.length;
            for (var i:number = 0; i < length; i++) {
                var urlRequestHeader:egret.URLRequestHeader = request.requestHeaders[i];
                headerObj[urlRequestHeader.name] = urlRequestHeader.value;
            }
            return JSON.stringify(headerObj);
        }

        private loadSound(loader:URLLoader) {
            var self = this;
            var request = loader._request;
            var virtualUrl:string = self.getVirtualUrl(request.url);

            if (self.isNetUrl(virtualUrl)) {//网络请求
                download();
            }
            else if (!egret_native.isFileExists(virtualUrl)) {
                download();
            }
            else if (!self.checkIsNewVersion(virtualUrl)) {
                download();
            }
            else {
                __callAsync(onLoadComplete, self);
            }

            function download() {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(virtualUrl, virtualUrl, promise);
            }

            var audio = new Audio(virtualUrl);
            audio.addEventListener('canplaythrough', soundPreloadCanplayHandler, false);
            audio.addEventListener("error", soundPreloadErrorHandler, false);

            function onLoadComplete() {
                self.saveVersion(virtualUrl);

                audio.load();
            }

            function soundPreloadCanplayHandler(event) {
                audio.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                audio.removeEventListener("error", soundPreloadErrorHandler, false);

                var nativeAudio:NativeAudio = new NativeAudio();
                nativeAudio._setAudio(audio);

                var sound = new egret.Sound();
                sound._setAudio(nativeAudio);

                loader.data = sound;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }

            function soundPreloadErrorHandler(event) {
                audio.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                audio.removeEventListener("error", soundPreloadErrorHandler, false);
                IOErrorEvent.dispatchIOErrorEvent(loader);
            }
        }

        private loadTexture(loader:URLLoader):void {
            var self = this;
            var request = loader._request;
            var virtualUrl:string = self.getVirtualUrl(request.url);

            if (self.isNetUrl(virtualUrl)) {//网络请求
                download();
            }
            else if (!egret_native.isFileExists(virtualUrl)) {
                download();
            }
            else if (!self.checkIsNewVersion(virtualUrl)) {
                download();
            }
            else {
                //todo
                //if (NativeNetContext.__use_asyn) {
                //    createBitmapData();
                //}
                //else {
                    egret.__callAsync(createBitmapData, self);
                //}
            }

            function createBitmapData() {
                Texture.createBitmapData(virtualUrl, function (code:number, bitmapData:any) {
                    if (code == 0) {
                        onComplete(bitmapData);
                    }
                    else {
                        egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                    }
                });
            }

            function onComplete(bitmapData) {
                self.saveVersion(virtualUrl);

                var texture = new egret.Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
            }

            function download() {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = createBitmapData;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(virtualUrl, virtualUrl, promise);
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
            if (this._versionCtr) {
                return this._versionCtr.getVirtualUrl(url);
            }
            return url;
        }

        /**
         * 检查文件是否是最新版本
         */
        private checkIsNewVersion(virtualUrl:string):boolean {
            if (this._versionCtr) {
                return this._versionCtr.checkIsNewVersion(virtualUrl);
            }
            return true;
        }

        /**
         * 保存本地版本信息文件
         */
        private saveVersion(virtualUrl:string):void {
            if (this._versionCtr) {
                this._versionCtr.saveVersion(virtualUrl);
            }
        }

        /**
         * 获取变化列表
         * @deprecated
         * @returns {any}
         */
        public getChangeList():Array<any> {
            if (this._versionCtr) {
                return this._versionCtr.getChangeList();
            }
            return [];
        }
    }
}