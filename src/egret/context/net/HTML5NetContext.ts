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

/// <reference path="NetContext.ts"/>
/// <reference path="../../display/Texture.ts"/>
/// <reference path="../../events/Event.ts"/>
/// <reference path="../../events/IOErrorEvent.ts"/>
/// <reference path="../../net/URLLoader.ts"/>
/// <reference path="../../net/URLLoaderDataFormat.ts"/>
/// <reference path="../../net/URLRequest.ts"/>
/// <reference path="../../net/URLRequestMethod.ts"/>
/// <reference path="../../net/URLVariables.ts"/>

module ns_egret {
    /**
     * @class ns_egret.HTML5NetContext
     * @classdesc
     * @extends ns_egret.NetContext
     */
    export class HTML5NetContext extends NetContext {

        public constructor(){
            super();
        }

        public proceed(loader:URLLoader):void{
            if(loader.dataFormat==URLLoaderDataFormat.TEXTURE){
                this.loadTexture(loader);
                return;
            }

            var request:URLRequest = loader._request;
            var xhr = this.getXHR();
            xhr.onerror = onLoadError;
            xhr.onload = onLoadComplete;
            xhr.open(request.method, request.url,true);
            this.setResponseType(xhr, loader.dataFormat);
            if (request.method == URLRequestMethod.GET||!request.data){
                xhr.send();
            }
            else if (request.data instanceof URLVariables) {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                var urlVars:URLVariables = <URLVariables> request.data;
                xhr.send(urlVars.toString());
            }
            else {
                xhr.setRequestHeader("Content-Type","multipart/form-data");
                xhr.send(request.data);
            }

            function onLoadError(event) {
                IOErrorEvent.dispatchIOErrorEvent(loader);
            };

            function onLoadComplete(event){
                switch (this.dataFormat) {
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
                callLater(Event.dispatchEvent,Event,loader,Event.COMPLETE);
            };
        }

        private getXHR():any{
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            } else {
                return new ActiveXObject("MSXML2.XMLHTTP");
            }
        }

        private setResponseType(xhr:XMLHttpRequest, responseType:string):void{
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

            var request:URLRequest = loader._request;
            var image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = onImageComplete;
            image.onerror = onLoadError;
            image.src = request.url;

            function onImageComplete(event) {
                image.onerror = null;
                image.onload = null;
                var texture:Texture = new Texture();
                texture.bitmapData = image;
                loader.data = texture;
                callLater(Event.dispatchEvent,Event,loader,Event.COMPLETE);
            };

            function onLoadError(event) {
                image.onerror = null;
                image.onload = null;
                IOErrorEvent.dispatchIOErrorEvent(loader);
            };
        }
    }
}