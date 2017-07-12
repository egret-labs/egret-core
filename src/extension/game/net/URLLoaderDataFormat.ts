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
	 * The URLLoaderDataFormat class provides values that specify how downloaded data is received.
     * @see http://edn.egret.com/cn/docs/page/600 Read different data format
     * @version Egret 2.4
     * @platform Web,Native
	 * @includeExample extension/game/net/URLLoaderDataFormat.ts
     * @language en_US
	 */
	/**
	 * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see http://edn.egret.com/cn/docs/page/600 读取不同数据格式
     * @version Egret 2.4
     * @platform Web,Native
	 * @includeExample extension/game/net/URLLoaderDataFormat.ts
     * @language zh_CN
	 */
    export class URLLoaderDataFormat {

		/**
         * Specify that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 指定以原始二进制数据形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static BINARY:string = "binary";

		/**
         * Specify that downloaded data is received as text.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * 指定以文本形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static TEXT:string = "text";

		/**
         * Specify that downloaded data is received as URL-encoded variables.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * 指定以 URL 编码变量形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static VARIABLES:string = "variables";

		/**
         * Specify that downloaded data is received as bitmap texture.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * 指定以位图纹理形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static TEXTURE:string = "texture";

        /**
         * Specify that downloaded data is received as sound.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定以声音形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static SOUND:string = "sound";

    }
}