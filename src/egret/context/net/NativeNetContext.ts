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
                promise.onSuccessFunc = function (getted_str){
                    loader.data = getted_str;
                    callLater(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                };
                promise.onErrorFunc = function (error_code){
                    console.log("net error:" + error_code);
                    IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.requireHttp(url, this.urlData, promise);
            }
            else if(!egret_native.isFileExists(url)) {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                egret_native.download(url, url, promise);
            }
            else {
                callLater(onLoadComplete, this);
            }

            function onLoadComplete() {
                var content = egret_native.readFileSync(url);
                loader.data = content;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }
        }

        private loadSound(loader:URLLoader) {
            var request = loader._request;
            var url = request.url;
            var savePath = url;

            if(url.indexOf("http://") != -1) {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, savePath, promise);
            }
            else if(!egret_native.isFileExists(url)) {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }
            else {
                callLater(onLoadComplete, this);
            }

            function onLoadComplete() {
                var sound = new egret.Sound();
                sound.path = savePath;
                loader.data = sound;
                egret.callLater(egret.Event.dispatchEvent, egret.Event, loader, egret.Event.COMPLETE);
            }
        }

        private loadTexture(loader:URLLoader):void {
            var request:URLRequest = loader._request;
            var url:string = request.url;
            var savePath:string = url;

            if (url.indexOf("http://") != -1) {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, savePath, promise);
            }
            else if(!egret_native.isFileExists(url)) {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }
            else {
                callLater(onLoadComplete, this);
            }

            function onLoadComplete() {
                var bitmapData = egret_native.Texture.addTexture(savePath);
                var texture = new Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }
        }
    }
}