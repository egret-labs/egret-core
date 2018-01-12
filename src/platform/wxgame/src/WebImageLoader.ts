
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


namespace egret.wxapp {

    let winURL = window["URL"] || window["webkitURL"];

    /**
     * @private
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     */
    export class WebImageLoader extends EventDispatcher implements ImageLoader {
        /**
         * @private
         * 使用 load() 方法加载成功的 BitmapData 图像数据。
         */
        public data: BitmapData = null;

        /**
         * @private
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         */
        private _crossOrigin: string = null;

        /**
         * @private
         * 标记crossOrigin有没有被设置过,设置过之后使用设置的属性
         */
        private _hasCrossOriginSet: boolean = false;

        public set crossOrigin(value: string) {
            this._hasCrossOriginSet = true;
            this._crossOrigin = value;
        }

        public get crossOrigin(): string {
            return this._crossOrigin;
        }

        /**
         * @private
         * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
         */
        public static crossOrigin: string = null;

        /**
         * @private
         */
        private currentImage: HTMLImageElement = null;

        /**
         * @private
         */
        private currentURL: string;

        /**
         * @private
         */
        private request: WebHttpRequest = null;

        /**
         * @private
         * 启动一次图像加载。注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
         * @param url 要加载的图像文件的地址。
         */
        public load(url: string): void {
            this.loadImage(url);
        }

        /**
         * @private
         */
        private loadImage(src: string): void {
            let image = new Image();
            this.data = null;
            this.currentImage = image;
            if (this._hasCrossOriginSet) {
                if (this._crossOrigin) {
                    image.crossOrigin = this._crossOrigin;
                }
            }
            else {
                if (WebImageLoader.crossOrigin) {
                    image.crossOrigin = WebImageLoader.crossOrigin;
                }
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
        private onImageComplete(event): void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this.data = new egret.BitmapData(image);
            let self = this;
            window.setTimeout(function (): void {
                self.dispatchEventWith(Event.COMPLETE);
            }, 0);
        }

        /**
         * @private
         */
        private onLoadError(event): void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this.dispatchIOError(image.src);
        }

        private dispatchIOError(url: string): void {
            let self = this;
            window.setTimeout(function (): void {
                if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                    $error(1011, url);
                }
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            }, 0);
        }

        /**
         * @private
         */
        private getImage(event: any): HTMLImageElement {
            let image: HTMLImageElement = event.target;
            let url = image.src;
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
