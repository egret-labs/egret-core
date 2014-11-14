/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {

    export class NativeNetContext extends NetContext {

        public constructor() {
            super();
        }

        private urlData:any = {};

        /**
         * @method egret.HTML5NetContext#proceed
         * @param loader {URLLoader}
         */
        public proceed(loader:URLLoader):void {

            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                this.loadSound(loader);
                return;
            }
            var self = this;
            var request:URLRequest = loader._request;
            var url:string = NetContext._getUrl(request);
            if (url.indexOf("http://") == 0) {
                this.urlData.type = request.method;
                if (request.method == URLRequestMethod.POST && request.data && request.data instanceof URLVariables) {
                    var urlVars:URLVariables = <URLVariables> request.data;
                    this.urlData.data = urlVars.toString();
                }
                else {
                    delete this.urlData["data"];
                }
                var promise = PromiseObject.create();
                promise.onSuccessFunc = function (getted_str) {
                    loader.data = getted_str;
                    callLater(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                };
                promise.onErrorFunc = function (error_code) {
                    console.log("net error:" + error_code);
                    IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.requireHttp(url, this.urlData, promise);
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (this.currentVersionData && !this.checkIsNewVersion(url)) {
                download();
            }
            else {
                __callAsync(onLoadComplete, this);
            }

            function download() {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }

            function onLoadComplete() {
                self.saveVersion(url);
                var content = egret_native.readFileSync(url);
                loader.data = content;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }
        }

        private loadSound(loader:URLLoader) {
            var self = this;
            var request = loader._request;
            var url = request.url;

            if (url.indexOf("http://") != -1) {
                download();
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (this.currentVersionData && !this.checkIsNewVersion(url)) {
                download();
            }
            else {
                __callAsync(onLoadComplete, this);
            }

            function download() {
//                console.log("download:" + url);
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }

            function onLoadComplete() {
                self.saveVersion(url);
                var sound = new egret.Sound();
                sound.path = url;
                loader.data = sound;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }
        }

        private loadTexture(loader:URLLoader):void {
            var self = this;
            var request = loader._request;
            var url = request.url;
            if (url.indexOf("http://") != -1) {
                download();
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (this.currentVersionData && !this.checkIsNewVersion(url)) {
                download();
            }
            else {
                egret.__callAsync(onLoadComplete, this);
            }

            function download() {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }

            function onLoadComplete() {
                self.saveVersion(url);
                var bitmapData = egret_native.Texture.addTexture(url);
                var texture = new egret.Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
            }
        }

        /**
         * 本地版本信息文件存储路径
         */
        private localVersionDataPath:string = "localVersion.manifest";
        /**
         * 本地版本信息文件，记录了本地文件版本信息
         */
        private localVersionData:any;
        /**
         * 当前版本信息文件，记录了当前版本中相对于基础版本变化的文件
         */
        private currentVersionData:any;
        /**
         * 基础版本信息文件
         */
        private baseVersionData:any;

        /**
         * 检查文件是否是最新版本
         */
        private checkIsNewVersion(url:string):boolean {
//            console.log("check:" + url);
//            console.log(this.currentVersionData[url]);
//            console.log(this.baseVersionData[url]);
//            console.log(this.localVersionData[url]);
            if (typeof this.currentVersionData[url] != "undefined") {
                if (this.currentVersionData[url] == this.localVersionData[url]) {
                    return true;
                }
            }
            else if ((typeof this.baseVersionData[url] != "undefined") && this.baseVersionData[url] == this.localVersionData[url]) {
                return true;
            }
            return false;
        }

        /**
         * 保存本地版本信息文件
         */
        private saveVersion(url:string):void {
            var change = false;
            if(this.currentVersionData && this.currentVersionData[url] && (this.localVersionData[url] != this.currentVersionData[url])) {
                this.localVersionData[url] = this.currentVersionData[url];
                change = true;
            }
            else if (this.baseVersionData && this.baseVersionData[url] && (this.localVersionData[url] != this.baseVersionData[url])) {
                this.localVersionData[url] = this.baseVersionData[url];
                change = true;
            }
            if (change) {
//                console.log("save:" + url);
                egret_native.saveRecord(this.localVersionDataPath, JSON.stringify(this.localVersionData));
            }
        }
    }
}