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
     * @language en_US
     * The HttpRequest class downloads data from a URL as text or binary data. It is useful for downloading text files,
     * XML, or other information to be used in a dynamic, data-driven application. A HttpRequest object downloads all
     * of the data from a URL before making it available to code in the applications. It sends out notifications about
     * the progress of the download, which you can monitor through the bytesLoaded and bytesTotal properties,
     * as well as through dispatched events.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.Event.IO_ERROR Dispatched when the net request is failed.
     * @event egret.ProgressEvent.PROGRESS Dispatched when data is received as the download operation progresses.
     * @see egret.HttpMethod
     * @see egret.HttpResponseType
     * @includeExample egret/net/HttpRequestExample.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HttpRequest 类以文本或二进制数据的形式从 URL 下载数据。
     * HttpRequest 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @event egret.Event.COMPLETE 加载完成
     * @event egret.Event.IO_ERROR 加载失败
     * @event egret.ProgressEvent.PROGRESS 加载进度，可通过event.bytesLoaded和event.bytesTotal统计进度信息。
     * @see egret.HttpMethod
     * @see egret.HttpResponseType
     * @includeExample egret/net/HttpRequestExample.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface HttpRequest extends EventDispatcher {
        /**
         * @language en_US
         * The data received from the load operation.  The format of the data depends on the setting of the responseType property.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 本次请求返回的数据，数据类型根据 responseType 设置的值确定。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        response: any;
        /**
         * @language en_US
         * Controls whether the downloaded data is received as text (HttpResponseType.TEXT) or raw binary data (HttpResponseType.ArrayBuffer)<br/>
         * Note:If you attempt to set this property to an invalid value, Egret runtime set the value to HttpResponseType.TEXT.
         * @default egret.HttpResponseType.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置返回的数据格式为文本（HttpResponseType.TEXT）还是二进制数据（HttpResponseType.ArrayBuffer）<br/>
         * 注意：若尝试设置此属性为一个非法的值，运行时将使用HttpResponseType.TEXT。
         * @default egret.HttpResponseType.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        responseType: string;
        /**
         * @language en_US
         * indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies
         * or authorization headers. (This never affects same-site requests.)
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        withCredentials: boolean;
        /**
         * @language en_US
         * Initializes a request.<br/>
         * Note: Calling this method for an already active request (one for which open() or openRequest() has already been
         * called) is the equivalent of calling abort().
         * @param url The URL to send the request to.
         * @param method The HTTP method to use, please use the const value in the HttpMethod class.
         * @see egret.HttpMethod
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 初始化一个请求.<br/>
         * 注意: 若在已经发出请求的对象上调用此方法，相当于立即调用abort().
         * @param url 该请求所要访问的URL该请求所要访问的URL
         * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
         * @see egret.HttpMethod
         * @version Egret 2.4
         * @platform Web,Native
         */
        open(url:string, method?:string): void;
        /**
         * @language en_US
         * Sends the request.
         * @param data the data to send.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 发送请求.
         * @param data 需要发送的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        send(data?:any): void;
        /**
         * @language en_US
         * Aborts the request if it has already been sent.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果请求已经被发送,则立刻中止请求.
         * @version Egret 2.4
         * @platform Web,Native
         */
        abort(): void;
        /**
         * @language en_US
         * Returns all the response headers as a string, or null if no response has been received.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         * @version Egret 2.4
         * @platform Web,Native
         */
        getAllResponseHeaders(): string;
        /**
         * @language en_US
         * Sets the value of an HTTP request header. You must call setRequestHeader() after open().
         * @param header The name of the header whose value is to be set.
         * @param value The value to set as the body of the header.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         * @version Egret 2.4
         * @platform Web,Native
         */
        setRequestHeader(header:string, value:string): void;
        /**
         * @language en_US
         * Returns the string containing the text of the specified header, or null if either the response has not yet been
         * received or the header doesn't exist in the response.
         * @param header The name of the header whose value is to be get.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         * @version Egret 2.4
         * @platform Web,Native
         */
        getResponseHeader(header:string): string;

    }

    /**
     * @language en_US
     * Creates a HttpRequest object.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 创建一个 HttpRequest 实例。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var HttpRequest:{ new (): HttpRequest };

}