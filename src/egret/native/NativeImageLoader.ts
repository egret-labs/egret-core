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
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     */
    export class NativeImageLoader extends BaseImageLoader {

        /**
         * @private
         *
         * @param url
         * @param callback
         */
        public load(url:string, callback:(code:number, bitmapData:any)=>void):void {
            var self = this;
            var bitmapData:any = BaseImageLoader._bitmapDataFactory[url];
            if (!bitmapData) {
                if (egret["Net" + "Context"].__use_asyn) {//异步的
                    if (BaseImageLoader._bitmapCallbackMap[url]) {
                        self._addToCallbackList(url, callback);
                    }
                    else {
                        self._addToCallbackList(url, callback);
                        var promise = new egret.PromiseObject();
                        promise.onSuccessFunc = function (bitmapData) {
                            BaseImageLoader._bitmapDataFactory[url] = bitmapData;
                            self._onLoad(url, bitmapData);
                        };
                        promise.onErrorFunc = function () {
                            self._onError(url, null);
                        };
                        egret_native.Texture.addTextureAsyn(url, promise);
                    }
                }
                else {
                    bitmapData = egret_native.Texture.addTexture(url);
                    BaseImageLoader._bitmapDataFactory[url] = bitmapData;
                    bitmapData["avaliable"] = true;
                    callback(0, bitmapData);
                }
            }
            else if (bitmapData["avaliable"]) {
                callback(0, bitmapData);
            }
            else {
                bitmapData.reload();
                bitmapData["avaliable"] = true;
                callback(0, bitmapData);
            }
        }

        /**
         * @private
         *
         * @param bitmapData
         */
        public static disposeBitmapData(bitmapData:any):void {

        }
    }

    ImageLoader = NativeImageLoader;
    ImageLoader.disposeBitmapData = NativeImageLoader.disposeBitmapData;
}