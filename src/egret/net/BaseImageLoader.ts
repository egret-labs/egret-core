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
     * @private
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     * @version Egret 2.0
     * @platform Web,Native
     */
    export class BaseImageLoader {
        /**
         * @private
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public static crossOrigin:string = null;

        /**
         * @private
         * 
         * @param url 
         * @param bitmapData 
         */
        protected _onLoad(url, bitmapData):void {
            bitmapData["avaliable"] = true;
            if(bitmapData.onload){
                bitmapData.onload = null;
            }
            if(bitmapData.onerror){
                bitmapData.onerror = null;
            }
            var list = BaseImageLoader._bitmapCallbackMap[url];
            if (list && list.length) {
                delete BaseImageLoader._bitmapCallbackMap[url];

                var l = list.length;
                for (var i:number = 0; i < l; i++) {
                    var callback = list[i];
                    callback(0, bitmapData);
                }
            }
        }

        /**
         * @private
         * 
         * @param url 
         * @param bitmapData 
         */
        protected _onError(url, bitmapData):void {
            var list = BaseImageLoader._bitmapCallbackMap[url];
            if (list && list.length) {
                delete BaseImageLoader._bitmapCallbackMap[url];

                var l = list.length;
                for (var i:number = 0; i < l; i++) {
                    var callback = list[i];
                    callback(1, bitmapData);
                }
            }
        }

        /**
         * @private
         * 
         * @param url 
         * @param callback 
         */
        protected _addToCallbackList(url, callback) {
            var list = BaseImageLoader._bitmapCallbackMap[url];
            if (!list) {
                list = [];
            }
            list.push(callback);
            BaseImageLoader._bitmapCallbackMap[url] = list;
        }

        /**
         * @private
         */
        protected static _bitmapDataFactory:any = {};
        /**
         * @private
         */
        protected static _bitmapCallbackMap:any = {};
    }

    //registerClass(WebImageLoader, Types.ImageLoader);
    //ImageLoader = WebImageLoader;
}