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

module egret.web {

    /**
     * @private
     */
    export class WebHttpRequest extends EventDispatcher implements HttpRequest {

        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        private _xhr:XMLHttpRequest;

        /**
         * @private
         * 本次请求返回的数据，数据类型根据responseType设置的值确定。
         */
        public get response():any {
            if (!this._xhr) {
                return null;
            }
            if (this._xhr.response) {
                return this._xhr.response;
            }
            if (this._xhr.responseXML) {
                return this._xhr.responseXML;
            }
            if (this._xhr.responseText) {
                return this._xhr.responseText;
            }
            return null;
        }

        /**
         * @private
         */
        private _responseType:string;

        /**
         * @private
         * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
         */
        public get responseType():string {
            return this._responseType;
        }

        public set responseType(value:string) {
            this._responseType = value;
        }

        /**
         * @private
         */
        private _withCredentials:boolean;

        /**
         * @private
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
         */
        public get withCredentials():boolean {
            return this._withCredentials;
        }

        public set withCredentials(value:boolean) {
            this._withCredentials = value;
        }

        /**
         * @private
         */
        private _url:string = "";
        private _method:string = "";

        /**
         * @private
         *
         * @returns
         */
        private getXHR():any {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            } else {
                return new ActiveXObject("MSXML2.XMLHTTP");
            }
        }

        /**
         * @private
         * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
         * @param url 该请求所要访问的URL该请求所要访问的URL
         * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
         */
        public open(url:string, method:string = "GET"):void {
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._xhr = this.getXHR();//new XMLHttpRequest();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(this._method, this._url, true);
        }

        /**
         * @private
         * 发送请求.
         * @param data 需要发送的数据
         */
        public send(data?:any):void {
            if (this._responseType != null) {
                this._xhr.responseType = this._responseType;
            }
            if (this._withCredentials != null) {
                this._xhr.withCredentials = this._withCredentials;
            }
            if (this.header != null) {
                this._xhr.setRequestHeader(this.header, this.headerValue);
            }
            this._xhr.send(data);
        }

        /**
         * @private
         * 如果请求已经被发送,则立刻中止请求.
         */
        public abort():void {
            if (this._xhr) {
                this._xhr.abort();
            }
        }

        /**
         * @private
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         */
        public getAllResponseHeaders():string {
            if (!this._xhr) {
                return null;
            }
            var result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        }

        private header:string;
        private headerValue:string;

        /**
         * @private
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         */
        public setRequestHeader(header:string, value:string):void {
            this.header = header;
            this.headerValue = value;
        }

        /**
         * @private
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         */
        public getResponseHeader(header:string):string {
            if (!this._xhr) {
                return null;
            }
            var result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        }

        /**
         * @private
         */
        private onReadyStateChange():void {
            var xhr = this._xhr;
            if (xhr.readyState == 4) {// 4 = "loaded"
                var ioError = (xhr.status >= 400 || xhr.status == 0);
                var url = this._url;
                var self = this;
                window.setTimeout(function ():void {
                    if (ioError) {//请求错误
                        if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                            $error(1011, url);
                        }
                        self.dispatchEventWith(IOErrorEvent.IO_ERROR);
                    }
                    else {
                        self.dispatchEventWith(Event.COMPLETE);
                    }
                }, 0)

            }
        }

        /**
         * @private
         */
        private updateProgress(event):void {
            if (event.lengthComputable) {
                ProgressEvent.dispatchProgressEvent(this, ProgressEvent.PROGRESS, event.loaded, event.total);
            }
        }

    }
    HttpRequest = WebHttpRequest;

    if (DEBUG) {
        egret.$markReadOnly(WebHttpRequest, "response");
    }
}