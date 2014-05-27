/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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