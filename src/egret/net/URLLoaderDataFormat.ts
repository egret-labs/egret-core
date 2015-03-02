/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

module egret {

	/**
	 * @class egret.URLLoaderDataFormat
	 * @classdesc URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @link http://docs.egret-labs.org/post/manual/net/netformat.html 读取不同数据格式
	 */
    export class URLLoaderDataFormat {

		/**
         * 指定以原始二进制数据形式接收下载的数据。
		 * @constant {string} egret.URLLoaderDataFormat.BINARY
		 */
        public static BINARY:string = "binary";

		/**
         * 指定以文本形式接收已下载的数据。
		 * @constant {string} egret.URLLoaderDataFormat.TEXT
		 */
        public static TEXT:string = "text";

		/**
         * 指定以 URL 编码变量形式接收下载的数据。
		 * @constant {string} egret.URLLoaderDataFormat.VARIABLES
		 */
        public static VARIABLES:string = "variables";

		/**
         * 指定以位图纹理形式接收已下载的数据。
		 * @constant {string} egret.URLLoaderDataFormat.TEXTURE
		 */
        public static TEXTURE:string = "texture";

        /**
         * 指定以声音形式接收已下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.SOUND
         */
        public static SOUND:string = "sound";

    }
}