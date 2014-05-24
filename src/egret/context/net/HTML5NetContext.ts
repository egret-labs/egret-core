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
        private _loadError:boolean = false;
        private _XHR:XMLHttpRequest;
        private eventTarget:IEventDispatcher;

        public load(request:URLRequest,dataFormat:string):void{
            this.dataFormat = dataFormat;
            this.initXHR();
            this._loadError = false;
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
            this._XHR.abort();
            this.disposeXHR();
        }

        private initXHR(){
            if (!this._XHR) {
                this._XHR = new XMLHttpRequest();

                this._XHR.onloadstart = (event) => this.onLoadStart(event);
                this._XHR.onprogress = (event) => this.onProgress(event);
                this._XHR.onerror = (event) => this.onLoadError(event);
                this._XHR.onload = (event) => this.onLoadComplete(event);
            }
        }

        private disposeXHR(){
            if (this._XHR !== null) {
                this._XHR.onloadstart = null;
                this._XHR.onprogress = null;
                this._XHR.onerror = null;
                this._XHR.onload = null;
                this._XHR = null;
            }
        }

        private getRequest(request:URLRequest):void{
            this._XHR.open(request.method, request.url);
            this.setResponseType(this._XHR, this.dataFormat);
            this._XHR.send();
        }

        private postRequest(request:URLRequest):void{
            this._XHR.open(request.method, request.url);
            this.setResponseType(this._XHR, this.dataFormat);
            if (request.data != null) {
                if (request.data instanceof URLVariables) {
                    this._XHR.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    var urlVars:URLVariables = <URLVariables> request.data;
                    this._XHR.send(urlVars.toString());
                }
                else {
                    if (request.data){
                        this._XHR.setRequestHeader("Content-Type","multipart/form-data");
                        this._XHR.send(request.data);
                    }
                    else{
                        this._XHR.send();
                    }
                }
            }
            else {
                this._XHR.send();
            }

        }

        private setResponseType(xhr:XMLHttpRequest, responseType:string):void{
            switch (responseType) {
                case URLLoaderDataFormat.TEXT:
                    xhr.responseType = responseType;
                    break;

                case URLLoaderDataFormat.VARIABLES:
                    xhr.responseType = URLLoaderDataFormat.TEXT;
                    break;

                case URLLoaderDataFormat.BINARY:
                    xhr.responseType = '';
                    break;

                default:
            }
        }

        private onLoadStart(event){
            Event.dispatchEvent(this.eventTarget,Event.OPEN);
        }

        private onProgress(event){
            ProgressEvent.dispatchProgressEvent(this.eventTarget,event.loaded,event.total);
        }

        private onLoadError(event){
            this._loadError = true;
            IOErrorEvent.dispatchIOErrorEvent(this.eventTarget);
        }

        private onLoadComplete(event){
            if (this._loadError === true)
                return;

            switch (this.dataFormat) {
                case URLLoaderDataFormat.TEXT:
                    this.data = this._XHR.responseText;
                    break;

                case URLLoaderDataFormat.VARIABLES:
                    this.data = new URLVariables(this._XHR.responseText);
                    break;

                case URLLoaderDataFormat.BINARY:
                    this.data = this._XHR.response;
                    break;

                default:
                    this.data = this._XHR.responseText;
                    break;
            }

            Event.dispatchEvent(this.eventTarget,Event.COMPLETE);
        }

    }
}