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
    export class NativeImageLoader extends EventDispatcher implements ImageLoader {
        /**
         * @private
         * 使用 load() 方法加载成功的 BitmapData 图像数据。
         */
        public data:BitmapData = null;

        /**
         * @private
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         */
        public crossOrigin:string = null;

        /**
         * @private
         *
         * @param url
         * @param callback
         */
        public load(url:string):void {
            this.check(url);
        }

        private check(url:string):void {
            var self = this;
            if (self.isNetUrl(url)) {//网络请求
                self.download(url);
            }
            else if (!egret_native.isFileExists(url)) {
                self.download(url);
            }
            else {
                self.loadTexture(url);
            }
        }

        private download(url:string):void {
            var self = this;
            var promise = egret.PromiseObject.create();
            promise.onSuccessFunc = function () {
                self.loadTexture(url);
            };
            promise.onErrorFunc = function () {
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            };
            egret_native.download(url, url, promise);
        }

        private loadTexture(url:string):void {
            var self = this;
            var promise = new egret.PromiseObject();
            promise.onSuccessFunc = function (bitmapData) {
                self.data = $toBitmapData(bitmapData);

                self.dispatchEventWith(Event.COMPLETE);
            };
            promise.onErrorFunc = function () {
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            };
            egret_native.Texture.addTextureAsyn(url, promise);

        }

        /**
         * 是否是网络地址
         * @param url
         * @returns {boolean}
         */
        private isNetUrl(url:string):boolean {
            return url.indexOf("http://") != -1;
        }
    }

    ImageLoader = NativeImageLoader;
}