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

/// <reference path="../context/net/NetContext.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/Ticker.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../texture/Texture.ts"/>
/// <reference path="../texture/TextureCache.ts"/>

module ns_egret {
    /**
     * @class ResourceLoader是egret的资源加载核心
     * GitHub 理解egret的资源加载
     */
    export class ResourceLoader extends EventDispatcher {


        url:string = null;
        type:string = null;
        state:number = ResourceLoader.LOAD_STATE_INIT;
        data = null;
        onLoadComplete:Function;
        fixedUrl:string = null;

        constructor(url:string, type:string) {
            super();
            this.url = url;
            var index = url.indexOf("?");
            if (index > -1) {
                this.fixedUrl = url.substring(0, index);
            }
            else {
                this.fixedUrl = url;
            }
            this.type = type;
        }

        /**
         * 加载资源，会根据当前资源状态决定是否要发送网络请求
         */
        public load() {
            switch (this.state) {
                case ResourceLoader.LOAD_STATE_INIT:
                    this.startLoading();
                    break;
                case ResourceLoader.LOAD_STATE_LOADED:
                    ns_egret.Ticker.getInstance().callLater(this._executeAllCallback, this);
                    break;
            }

        }

        private startLoading() {
            var self = this;
            var request = new ns_egret.URLRequest(this.url, this._executeAllCallback, this);
            request.type = this.type;
            request.prefix = ResourceLoader.prefix;
            MainContext.instance.netContext.send(request);
        }

        private _executeAllCallback(data) {
            this.state = ResourceLoader.LOAD_STATE_LOADED;
            if (data) {
                this.data = data;
            }
            if (this.onLoadComplete) {
                this.onLoadComplete(this.data);
            }
            this.dispatchEventWith(ResourceLoader.LOAD_COMPLETE, false, this.data);
        }

        public static LOAD_COMPLETE = "resource_load_complete";

        /**
         * 二进制数据
         */
        public static DATA_TYPE_BINARY = "binary";
        /**
         * 文本数据
         */
        public static DATA_TYPE_TEXT = "text";
        /**
         * 图片数据
         */
        public static DATA_TYPE_IMAGE = "image";

        /**
         * 加载状态：未开始
         */
        public static LOAD_STATE_INIT = 0;
        /**
         * 加载状态：已完成
         */
        public static LOAD_STATE_LOADED = 1;

        private static __pool = {};
        /**
         * 资源加载前缀
         */
        public static prefix:string = "";

        public static create(src:string, type:string = "") {
            if (ResourceLoader.__pool[src] == null) {
                var ext:string = src.substring(src.lastIndexOf(".") + 1);
                var handlerClass = ResourceLoader.__registerMap[ext];
                if (!handlerClass) {
                    handlerClass = ns_egret.ResourceLoader;
                }
                ResourceLoader.__pool[src] = new handlerClass(src, type);
            }
            return ResourceLoader.__pool[src];
        }

        private static __registerMap = {};

        public static registerHandler(ext:string, handlerClass:Function) {
            ResourceLoader.__registerMap[ext] = handlerClass;
        }
    }
}