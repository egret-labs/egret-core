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

    /**
     * @private
     */
    export class NativeNetContext extends NetContext {

        private _versionCtr:egret.VersionController;

        private static __use_asyn:boolean = false;

        public constructor() {
            super();

            this._versionCtr = new egret.VersionController();
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
                //写入header信息
                if(request.requestHeaders) {
                    this.urlData.header = this.getHeaderString(request);
                }
                else {
                    delete this.urlData.header;
                }
                var promise = PromiseObject.create();
                promise.onSuccessFunc = function (getted_str) {
                    loader.data = getted_str;
                    callLater(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                };
                promise.onErrorFunc = function (error_code) {
                    egret.Logger.infoWithErrorId(1019, error_code);
                    IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.requireHttp(url, this.urlData, promise);
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (!this.checkIsNewVersion(url)) {
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

        private getHeaderString(request:URLRequest):string {
            var headerObj = {};
            var length = request.requestHeaders.length;
            for(var i:number = 0 ; i < length ; i++){
                var urlRequestHeader:egret.URLRequestHeader = request.requestHeaders[i];
                headerObj[urlRequestHeader.name] = urlRequestHeader.value;
            }
            return JSON.stringify(headerObj);
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
            else if (!this.checkIsNewVersion(url)) {
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
            else if (!this.checkIsNewVersion(url)) {
                download();
            }
            else {
                if (NativeNetContext.__use_asyn) {
                    onLoadComplete();
                }
                else {
                    egret.__callAsync(onLoadComplete, this);
                }
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

                if (NativeNetContext.__use_asyn) {//异步的
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = function (bitmapData) {
                        var texture = new egret.Texture();
                        texture._setBitmapData(bitmapData);
                        loader.data = texture;
                        egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
                    };
                    promise.onErrorFunc = function () {
                        egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                    };
                    egret_native.Texture.addTextureUnsyn(url, promise);
                }
                else {
                    var bitmapData = egret_native.Texture.addTexture(url);
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    loader.data = texture;
                    egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
                }
            }
        }

        /**
         * 检查文件是否是最新版本
         */
        private checkIsNewVersion(url:string):boolean {
            return this._versionCtr.checkIsNewVersion(url);
        }

        /**
         * 保存本地版本信息文件
         */
        private saveVersion(url:string):void {
            this._versionCtr.saveVersion(url);
        }

        public getChangeList():Array<any> {
            return this._versionCtr.getChangeList();
        }
    }
}