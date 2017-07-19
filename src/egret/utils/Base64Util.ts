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
    * @language en_US
    * The Base64Util class provides methods for encoding and decoding base64.
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample egret/utils/Base64Util.ts
    */
    /**
     * @language zh_CN
     * Base64Util 类提供用于编解码base64的方法。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Base64Util.ts
     */
    export class Base64Util {
        /**
         * @language en_US
         * encode base64.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 编码base64。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static encode(arraybuffer: ArrayBuffer):string {
            let bytes = new Uint8Array(arraybuffer);
            let len = bytes.length;
            let base64 = '';

            for (let i = 0; i < len; i += 3) {
                base64 += chars[bytes[i] >> 2];
                base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += chars[bytes[i + 2] & 63];
            }

            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + '=';
            } else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + '==';
            }

            return base64;
        }
        /**
         * @language en_US
         * decode base64.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 解码base64。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static decode(base64: string):ArrayBuffer {
            let bufferLength = base64.length * 0.75;
            let len = base64.length;
            let p = 0;
            let encoded1 = 0;
            let encoded2 = 0;
            let encoded3 = 0;
            let encoded4 = 0;

            if (base64[base64.length - 1] === '=') {
                bufferLength--;
                if (base64[base64.length - 2] === '=') {
                    bufferLength--;
                }
            }

            let arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);

            for (let i = 0; i < len; i += 4) {
                encoded1 = lookup[base64.charCodeAt(i)];
                encoded2 = lookup[base64.charCodeAt(i + 1)];
                encoded3 = lookup[base64.charCodeAt(i + 2)];
                encoded4 = lookup[base64.charCodeAt(i + 3)];

                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }

            return arraybuffer;
        }
    }
}
/**
 * @private
 */
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
/**
 * @private
 */
let lookup = new Uint8Array(256);

for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}