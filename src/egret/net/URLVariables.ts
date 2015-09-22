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
     * @class egret.URLVariables
     * @classdesc
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=163&terms1_id=25&terms2_id=37 发送带参数的请求
     * @includeExample egret/net/URLVariables.ts
     */
    export class URLVariables extends HashObject {

        /**
         * 创建一个 egret.URLVariables 对象
         * @method egret.URLVariables#constructor
         * @param source {String} 包含名称/值对的 URL 编码的字符串。
         */
        public constructor(source:string = null) {
            super();
            if (source !== null) {
                this.decode(source);
            }
        }

        /**
         * 此 URLVariables 储存的键值对数据对象。
         * @member egret.URLVariables#variables
         */
        public variables:Object = null;

        /**
         * 将变量字符串转换为此 URLVariables.variables 对象的属性。
         * @method egret.URLVariables#decode
         * @param source {string} 包含名称/值对的 URL 编码的字符串。
         */
        public decode(source:string):void {
            if (!this.variables) {
                this.variables = {};
            }
            source = source.split("+").join(" ");
            var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(source)) {
                var key = decodeURIComponent(tokens[1]),
                    val = decodeURIComponent(tokens[2]);
                //没有重复键值，直接赋值
                if ((key in this.variables) == false) {
                    this.variables[key] = val;
                    continue;
                }
                //有重复键值，如果已经存在数组，直接push到数组，否则创建一个新数组
                var value = this.variables[key];
                if (value instanceof Array) {
                    (<Array<string>>value).push(val)
                }
                else {
                    this.variables[key] = [value, val];
                }
            }
        }

        /**
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @method egret.URLVariables#toString
         */
        public toString():string {
            if (!this.variables) {
                return "";
            }
            var variables:any = this.variables;
            var stringArray:string[] = [];
            for (var key in variables) {
                stringArray.push(this.encodeValue(key, variables[key]));
            }
            return stringArray.join("&");
        }

        private encodeValue(key:string, value:any) {
            if (value instanceof Array) {
                return this.encodeArray(key, value);
            }
            else {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
        }

        private encodeArray(key:string, value:string[]) {
            if (!key)
                return "";
            if (value.length == 0) {
                return encodeURIComponent(key) + "=";
            }
            return value.map(v=> encodeURIComponent(key) + "=" + encodeURIComponent(v)).join("&");
        }
    }
}