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


        /**
         * @method egret.HTML5NetContext#proceed
         * @param loader {URLLoader}
         */
        public proceed(loader:URLLoader):void{

            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                this.loadSound(loader);
                return;
            }


            var url = loader._request.url;
            if (url.indexOf("http://") == 0){
                egret_native.requireHttpSync( url , function( str_resultcode ,str_recived_data  ) {
                    if (str_resultcode == 0){
                        loader.data = str_recived_data;
                        callLater(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                    }
                    else{
                        //todo
                        console.log ("net error:" + str_resultcode);
                    }
                })
                return;
            }

            callLater(onLoadComplete, this);

            function onLoadComplete() {
                var request:URLRequest = loader._request;
                var content = egret_native.readFileSync(request.url);
                loader.data = content;
                Event.dispatchEvent(loader,Event.COMPLETE);
            };
        }

        private loadSound (loader) {
            var request = loader._request;
            var url = request.url;
            var savePath = request.url;
            var promise = egret.PromiseObject.create();
            promise.onSuccessFunc = function () {
                egret_native.Audio.preloadEffect(savePath);
                var sound = new egret.Sound();
                sound.path = savePath;
                loader.data = sound;
                egret.callLater(egret.Event.dispatchEvent, egret.Event, loader, egret.Event.COMPLETE);
            };
            promise.onErrorFunc = function () {
                egret.IOErrorEvent.dispatchIOErrorEvent(loader);
            };
            egret_native.download(url, savePath, promise);
        }

        private loadTexture(loader:URLLoader):void {

            callLater(onLoadComplete, this);

            function onLoadComplete() {
                var request:URLRequest = loader._request;
                var bitmapData = egret_native.Texture.addTexture(request.url);
                var texture = new Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                Event.dispatchEvent(loader,Event.COMPLETE);
            };
        }
    }


}