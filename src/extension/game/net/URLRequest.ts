//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace egret {

    /**
     * The URLRequest class captures all of the information in a single HTTP request.
     * @see http://edn.egret.com/cn/index.php/article/index/id/601 Build communication request
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     * @language en_US
     */
    /**
     * URLRequest 类可捕获单个 HTTP 请求中的所有信息。
     * @see http://edn.egret.com/cn/index.php/article/index/id/601 构建通信请求
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     * @language zh_CN
     */
    export class URLRequest extends HashObject {

        /**
         * Create an egret.URLRequest object
         * @param url {string} Addresses for URL requests
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 egret.URLRequest 对象
         * @param url {string} 进行网络请求的地址
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor(url:string = null) {
            super();
            this.url = url;
        }

        /**
         * An object contains data to be transmitted with the URL request.
         * This property is used in conjunction with the method property.  When the value of method is GET, the value of data is appended to the value of URLRequest.url, using HTTP query-string syntax.
         * When the method value is POST (or any value other than GET), the value of data is transmitted in the body of the HTTP request.
         * The URLRequest API offers binary POST support and support for URL-encoded variables, as well as support for strings. The data object can be a ArrayBuffer, URLVariables, or String object.
         * The way in which the data is used depends on the type of object used:
         * If the object is a ArrayBuffer object, the binary data of the ArrayBuffer object is used as POST data. For GET, data of ArrayBuffer type is not supported.
         * If the object is a URLVariables object and the method is POST, then the variables are encoded using x-www-form-urlencoded format and the resulting string is used as POST data.
         * If the object is a URLVariables object and the method is GET, the URLVariables object will define variables to be sent with the URLRequest object.
         * Otherwise, the object is converted into a string, and the string is used as the POST or GET data.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个对象，它包含将随 URL 请求一起传输的数据。
         * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
         * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
         * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ArrayBuffer、URLVariables 或 String 对象。
         * 该数据的使用方式取决于所用对象的类型：
         * 如果该对象为 ArrayBuffer 对象，则 ArrayBuffer 对象的二进制数据用作 POST 数据。对于 GET，不支持 ArrayBuffer 类型的数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
         * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public data:any = null;

        /**
         * Request method, valid values are URLRequestMethod.GET or URLRequestMethod.POST.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 请求方式，有效值为URLRequestMethod.GET 或 URLRequestMethod.POST。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public method:string = URLRequestMethod.GET;

        /**
         * The requested URL.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 所请求的 URL。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public url:string = "";

        /**
         * The array of HTTP request headers to be appended to the HTTP request. The array is composed of URLRequestHeader objects.
         * Each object in the array must be a URLRequestHeader object that contains a name string and a value string.
         * Because of browser compatibility, this property has not been achieved in html5
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要追加到 HTTP 请求的 HTTP 请求标头的数组。该数组由 URLRequestHeader 对象组成。
         * 数组中的每一对象必须是包含一个名称字符串和一个值字符串的 URLRequestHeader 对象。
         * 由于浏览器兼容性原因，该属性在 html5 中并未实现
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public requestHeaders:Array<URLRequestHeader> = [];
    }
}