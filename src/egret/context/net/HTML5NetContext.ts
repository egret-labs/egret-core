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
     * @class egret.HTML5NetContext
     * @classdesc
     * @extends egret.NetContext
     * @private
     */
    export class HTML5NetContext extends NetContext {

        public _versionCtr:egret.IVersionController;
        public constructor() {
            super();
            Texture.createBitmapData = Texture._createBitmapDataForCanvasAndWebGl;
        }

        public initVersion(versionCtr:egret.IVersionController):void {
            this._versionCtr = versionCtr;
        }

        public proceed(loader:URLLoader):void {
            var self = this;
            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                if (Html5Capatibility._audioType == egret.AudioType.WEB_AUDIO) {
                    this.loadWebAudio(loader);
                }
                else if (Html5Capatibility._audioType == egret.AudioType.QQ_AUDIO) {
                    this.loadQQAudio(loader);
                }
                else {
                    this.loadSound(loader);
                }
                return;
            }

            var request:URLRequest = loader._request;
            var xhr = this.getXHR();
            xhr.onreadystatechange = onReadyStateChange;

            var virtualUrl:string = self.getVirtualUrl(NetContext._getUrl(request));

            xhr.open(request.method, virtualUrl, true);
            this.setResponseType(xhr, loader.dataFormat);
            if (request.method == URLRequestMethod.GET || !request.data) {
                xhr.send();
            }
            else if (request.data instanceof URLVariables) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var urlVars:URLVariables = <URLVariables> request.data;
                xhr.send(urlVars.toString());
            }
            else {
                xhr.setRequestHeader("Content-Type", "multipart/form-data");
                xhr.send(request.data);
            }


            function onReadyStateChange() {
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
            }

            function onLoadComplete() {
                switch (loader.dataFormat) {
                    case URLLoaderDataFormat.TEXT:
                        loader.data = xhr.responseText;
                        break;

                    case URLLoaderDataFormat.VARIABLES:
                        loader.data = new URLVariables(xhr.responseText);
                        break;

                    case URLLoaderDataFormat.BINARY:
                        loader.data = xhr.response;
                        break;
                    default:
                        loader.data = xhr.responseText;
                        break;
                }
                __callAsync(Event.dispatchEvent, Event, loader, Event.COMPLETE);
            }
        }

        private loadSound(loader:URLLoader):void {
            var virtualUrl:string = this.getVirtualUrl(loader._request.url);
            var audio = new Audio(virtualUrl);
            audio["__timeoutId"] = egret.setTimeout(soundPreloadCanplayHandler, this, 100);
            audio.addEventListener('canplaythrough', soundPreloadCanplayHandler, false);
            audio.addEventListener("error", soundPreloadErrorHandler, false);
            audio.load();

            function soundPreloadCanplayHandler(event) {
                egret.clearTimeout(audio["__timeoutId"]);
                audio.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                audio.removeEventListener("error", soundPreloadErrorHandler, false);
                var htmlAudio:Html5Audio = new Html5Audio();
                htmlAudio._setAudio(audio);

                var sound = new Sound();
                sound._setAudio(htmlAudio);
                loader.data = sound;
                __callAsync(Event.dispatchEvent, Event, loader, Event.COMPLETE);
            };

            function soundPreloadErrorHandler(event) {
                egret.clearTimeout(audio["__timeoutId"]);
                audio.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                audio.removeEventListener("error", soundPreloadErrorHandler, false);
                IOErrorEvent.dispatchIOErrorEvent(loader);
            };
        }

        private loadQQAudio(loader:URLLoader):void {
            var virtualUrl:string = this.getVirtualUrl(loader._request.url);
            console.log("loadQQAudio");

            QZAppExternal.preloadSound(
                function(data){
                    if (data.code == 0) {
                        var audio = new QQAudio();
                        audio._setPath(virtualUrl);

                        var sound = new Sound();
                        sound._setAudio(audio);
                        loader.data = sound;

                        __callAsync(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                    }
                    else {
                        IOErrorEvent.dispatchIOErrorEvent(loader);
                    }
                },{
                    bid : -1,
                    url : virtualUrl,
                    refresh : 1
                });
        }

        private loadWebAudio(loader:URLLoader):void {
            var virtualUrl:string = this.getVirtualUrl(loader._request.url);
            var request = new XMLHttpRequest();
            request.open("GET", virtualUrl, true);
            request.responseType = "arraybuffer";
            console.log("loadWebAudio");
            request.onload = function () {
                var audio = new WebAudio();

                audio._setArrayBuffer(request.response, function () {
                    var sound = new Sound();
                    sound._setAudio(audio);
                    loader.data = sound;
                    __callAsync(Event.dispatchEvent, Event, loader, Event.COMPLETE);
                });
            };
            request.send();

            //function onErrorHandler() {
            //    IOErrorEvent.dispatchIOErrorEvent(loader);
            //}
        }

        private getXHR():any {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            } else {
                return new ActiveXObject("MSXML2.XMLHTTP");
            }
        }

        private setResponseType(xhr:XMLHttpRequest, responseType:string):void {
            switch (responseType) {
                case URLLoaderDataFormat.TEXT:
                case URLLoaderDataFormat.VARIABLES:
                    xhr.responseType = URLLoaderDataFormat.TEXT;
                    break;

                case URLLoaderDataFormat.BINARY:
                    xhr.responseType = "arraybuffer";
                    break;

                default:
                    xhr.responseType = responseType;
                    break;
            }
        }

        private loadTexture(loader:URLLoader):void {
            var virtualUrl:string = this.getVirtualUrl(loader._request.url);
            Texture.createBitmapData(virtualUrl, function (code:number, bitmapData:HTMLImageElement) {
                if (code != 0) {
                    IOErrorEvent.dispatchIOErrorEvent(loader);
                    return;
                }
                var texture:Texture = new Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                __callAsync(Event.dispatchEvent, Event, loader, Event.COMPLETE);
            })
        }

        /**
         * 获取虚拟url
         * @param url
         * @returns {string}
         */
        private getVirtualUrl(url:string):string {
            if (this._versionCtr) {
                return this._versionCtr.getVirtualUrl(url);
            }
            return url;
        }

    }
}