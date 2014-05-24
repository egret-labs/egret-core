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

module ns_egret {

	/**
	 * @class ns_egret.URLLoaderDataFormat
	 * @classdesc
	 */
    export class URLLoaderDataFormat {

		/**
         * 指定以原始二进制数据形式接收下载的数据。
		 * @constant {string} ns_egret.URLLoaderDataFormat.BINARY
		 */
        public static BINARY:string = "binary";

		/**
         * 指定以文本形式接收已下载的数据。
		 * @constant {string} ns_egret.URLLoaderDataFormat.TEXT
		 */
        public static TEXT:string = "text";

		/**
         * 指定以 URL 编码变量形式接收下载的数据。
		 * @constant {string} ns_egret.URLLoaderDataFormat.VARIABLES
		 */
        public static VARIABLES:string = "variables";

		/**
         * 指定以位图纹理形式接收已下载的数据。
		 * @constant {string} ns_egret.URLLoaderDataFormat.TEXTURE
		 */
        public static TEXTURE:string = "texture";

    }
}