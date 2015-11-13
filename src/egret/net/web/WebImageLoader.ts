
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


module egret.web {

    var winURL = window["URL"] || window["webkitURL"];

    /**
     * @private
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     */
    export class WebImageLoader extends EventDispatcher implements ImageLoader {
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
         */
        private currentImage:HTMLImageElement = null;

        /**
         * @private
         */
        private currentURL:string;

        /**
         * @private
         */
        private request:WebHttpRequest = null;

        /**
         * @private
         * 启动一次图像加载。注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
         * @param url 要加载的图像文件的地址。
         */
        public load(url:string):void {
            if (Html5Capatibility._canUseBlob
                && url.indexOf("wxLocalResource:") != 0//微信专用不能使用 blob
                && url.indexOf("data:") != 0
                && url.indexOf("http:") != 0
                && url.indexOf("https:") != 0) {//如果是base64编码或跨域访问的图片，直接使用Image.src解析。
                var request = this.request;
                if (!request) {
                    request = this.request = new egret.web.WebHttpRequest();
                    request.addEventListener(egret.Event.COMPLETE, this.onBlobLoaded, this);
                    request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onBlobError, this);
                    request.responseType = "blob";
                }
                if (DEBUG) {
                    this.currentURL = url;
                }
                request.open(url);
                request.send();
            }
            else {
                this.loadImage(url);
            }
        }

        /**
         * @private
         */
        private onBlobLoaded(event:egret.Event):void {
            var blob:Blob = this.request.response;
            this.loadImage(winURL.createObjectURL(blob));
        }

        /**
         * @private
         */
        private onBlobError(event:egret.Event):void {
            this.dispatchIOError(this.currentURL);
        }

        /**
         * @private
         */
        private loadImage(src:string):void {
            var image = new Image();
            this.data = null;
            this.currentImage = image;
            if (this.crossOrigin) {
                image.crossOrigin = this.crossOrigin;
            }
            /*else {
                if (image.hasAttribute("crossOrigin")) {//兼容猎豹
                    image.removeAttribute("crossOrigin");
                }
            }*/
            image.onload = this.onImageComplete.bind(this);
            image.onerror = this.onLoadError.bind(this);
            image.src = src;
        }

        /**
         * @private
         */
        private onImageComplete(event):void {
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this.data = $toBitmapData(image);
            var self = this;
            window.setTimeout(function ():void {
                self.dispatchEventWith(Event.COMPLETE);
            }, 0);
        }

        /**
         * @private
         */
        private onLoadError(event):void {
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this.dispatchIOError(image.src);
        }

        private dispatchIOError(url:string):void {
            var self = this;
            window.setTimeout(function ():void {
                if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                    $error(1011, url);
                }
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            }, 0);
        }

        /**
         * @private
         */
        private getImage(event:any):HTMLImageElement {
            var image:HTMLImageElement = event.target;
            var url:string = image.src;
            if (url.indexOf("blob:") == 0) {
                try {
                    winURL.revokeObjectURL(image.src);
                }
                catch(e) {
                    egret.$warn(1037);
                }
            }
            image.onerror = null;
            image.onload = null;
            if (this.currentImage !== image) {
                return null;
            }
            this.currentImage = null;
            return image;
        }

    }

    ImageLoader = WebImageLoader;
}