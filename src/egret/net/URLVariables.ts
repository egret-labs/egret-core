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

/// <reference path="../core/HashObject.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.URLVariables
	 * @classdesc
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
	 * @extends ns_egret.HashObject
	 */
    export class URLVariables extends HashObject {

		/**
		 * @method ns_egret.URLVariables#constructor
		 * @param source {String} 包含名称/值对的 URL 编码的字符串。
		 */
        public constructor(source:string = null) {
            super();
            if (source !== null) {

                this.decode(source);
            }
        }

		/**
         * 将变量字符串转换为此 URLVariables 对象的属性。
         * @method ns_egret.URLVariables#decode
		 * @param source {string} 
		 */
        public decode(source:string):void {
            source = source.split("+").join(" ");
            var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(source)) {
                this[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
        }

        /**
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @method ns_egret.URLVariables#toString
         */
        public toString():string{
            var str:string = "";
            var isFirst:boolean = true;
            for(var key in this){
                if(key=="toString"||key=="decode"){
                    continue;
                }
                if(isFirst){
                    isFirst = false;
                }
                else{
                    str += "&";
                }
                str += key+"="+this[key];
            }
            return str;
        }

    }
}