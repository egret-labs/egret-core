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

module egret.native {

    /**
     * @private
     */
    export class NativeHttpRequest extends EventDispatcher implements HttpRequest {

        /**
         * @private
         */
        public constructor() {
            super();
        }

        private _response:string;
        /**
         * @private
         * 本次请求返回的数据，数据类型根据responseType设置的值确定。
         */
        public get response():any {
            return this._response;
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
         * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
         * @param url 该请求所要访问的URL该请求所要访问的URL
         * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
         */
        public open(url:string, method:string = "GET"):void {
            this._url = url;

            this._method = method;
        }

        /**
         * @private
         * 发送请求.
         * @param data 需要发送的数据
         */
        public send(data?:any):void {
            var self = this;

            if (!egret_native.isFileExists(self._url)) {
                download();
            }
            else {
                readFileAsync();
            }

            function readFileAsync() {
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (content) {
                    self._response = content;
                    Event.dispatchEvent(self, Event.COMPLETE);
                };
                egret_native.readFileAsync(self._url, promise);
            }

            function download() {
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    Event.dispatchEvent(self, IOErrorEvent.IO_ERROR);
                };
                egret_native.download(self._url, self._url, promise);
            }

            function onLoadComplete() {
                var content = egret_native.readFileSync(self._url);
                self._response = content;
                Event.dispatchEvent(self, Event.COMPLETE);
            }
        }

        /**
         * @private
         * 如果请求已经被发送,则立刻中止请求.
         */
        public abort():void {
        }

        /**
         * @private
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         */
        public getAllResponseHeaders():string {

            return "";
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
            return "";
        }


    }
    HttpRequest = NativeHttpRequest;

    if (DEBUG) {
        egret.$markReadOnly(NativeHttpRequest, "response");
    }
}