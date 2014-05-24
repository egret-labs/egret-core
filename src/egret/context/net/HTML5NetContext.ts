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
/// <reference path="../../events/Event.ts"/>
/// <reference path="../../events/IEventDispatcher.ts"/>
/// <reference path="../../events/IOErrorEvent.ts"/>
/// <reference path="../../events/ProgressEvent.ts"/>
/// <reference path="../../net/URLLoaderDataFormat.ts"/>
/// <reference path="../../net/URLRequest.ts"/>
/// <reference path="../../net/URLRequestMethod.ts"/>
/// <reference path="../../net/URLVariables.ts"/>
/// <reference path="../../texture/Texture.ts"/>
/// <reference path="../../utils/callLater.ts"/>

module ns_egret {
    /**
     * @class ns_egret.HTML5NetContext
     * @classdesc
     * @extends ns_egret.NetContext
     */
    export class HTML5NetContext extends NetContext {

        public constructor(target:IEventDispatcher){
            super(target);
            this.eventTarget = target;
        }

        private dataFormat:string;
        private xhr:XMLHttpRequest;
        private eventTarget:IEventDispatcher;

        public load(request:URLRequest,dataFormat:string):void{
            this.dataFormat = dataFormat;
            if(dataFormat==URLLoaderDataFormat.TEXTURE){
                this.loadImage(request);
                return;
            }
            this.initXHR();
            try {
                if (request.method === URLRequestMethod.POST)
                    this.postRequest(request);
                else
                    this.getRequest(request);
            }
            catch (e){
            }
        }

        public close():void{
            if(this.xhr){
                this.xhr.abort();
            }
            this.disposeXHR();
            this.currentImage = null;
            this.data = null;
        }

        private initXHR(){
            if (!this.xhr) {
                if (window["XMLHttpRequest"]) {
                    this.xhr = new window["XMLHttpRequest"]();
                } else {
                    this.xhr = new ActiveXObject("MSXML2.XMLHTTP");
                }
                this.xhr.onloadstart = (event) => this.onLoadStart(event);
                this.xhr.onprogress = (event) => this.onProgress(event);
                this.xhr.onerror = (event) => this.onLoadError(event);
                this.xhr.onload = (event) => this.onLoadComplete(event);
            }
        }

        private disposeXHR(){
            if (this.xhr) {
                this.xhr.onloadstart = null;
                this.xhr.onprogress = null;
                this.xhr.onerror = null;
                this.xhr.onload = null;
                this.xhr = null;
            }
        }

        private getRequest(request:URLRequest):void{
            this.xhr.open(request.method, request.url,true);
            this.setResponseType(this.xhr, this.dataFormat);
            this.xhr.send();
        }

        private postRequest(request:URLRequest):void{
            this.xhr.open(request.method, request.url,true);
            this.setResponseType(this.xhr, this.dataFormat);
            if (request.data != null) {
                if (request.data instanceof URLVariables) {
                    this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    var urlVars:URLVariables = <URLVariables> request.data;
                    this.xhr.send(urlVars.toString());
                }
                else {
                    if (request.data){
                        this.xhr.setRequestHeader("Content-Type","multipart/form-data");
                        this.xhr.send(request.data);
                    }
                    else{
                        this.xhr.send();
                    }
                }
            }
            else {
                this.xhr.send();
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

        private onLoadStart(event){
            Event.dispatchEvent(this.eventTarget,Event.OPEN);
        }

        private onProgress(event){
            ProgressEvent.dispatchProgressEvent(this.eventTarget,event.loaded,event.total);
        }

        private onLoadError(event){
            if(this.currentImage){
                this.currentImage = null;
            }
            IOErrorEvent.dispatchIOErrorEvent(this.eventTarget);
        }

        private onLoadComplete(event){
            switch (this.dataFormat) {
                case URLLoaderDataFormat.TEXT:
                    this.data = this.xhr.responseText;
                    break;

                case URLLoaderDataFormat.VARIABLES:
                    this.data = new URLVariables(this.xhr.responseText);
                    break;

                case URLLoaderDataFormat.BINARY:
                    this.data = this.xhr.response;
                    break;

                default:
                    this.data = this.xhr.responseText;
                    break;
            }
            callLater(this.dispatchCompleteEvent,this);
        }

        private dispatchCompleteEvent():void{
            Event.dispatchEvent(this.eventTarget,Event.COMPLETE);
        }

        private currentImage;
        private loadImage(request:URLRequest):void {
            var image = new Image();
            this.currentImage = image;
            image.crossOrigin = "Anonymous";
            image.addEventListener("load", this.onImageLoadComplete);
            image.addEventListener("error", this.onLoadError);
            try{
                image.src = request.url;
            }
            catch (e){
            }
        }

        private onImageLoadComplete(event) {
            var image = this.currentImage;
            image.close()
            this.currentImage = null;
            image.removeEventListener('load', this.onLoadComplete);
            image.removeEventListener('error', this.onLoadComplete);
            var texture:Texture = new Texture();
            texture.bitmapData = image;
            this.data = texture;
            callLater(this.dispatchCompleteEvent,this);
        }

    }
}