////////////////////////////////////////////////////////////////////////////////////////
////
////  Copyright (c) 2014-present, Egret Technology.
////  All rights reserved.
////  Redistribution and use in source and binary forms, with or without
////  modification, are permitted provided that the following conditions are met:
////
////     * Redistributions of source code must retain the above copyright
////       notice, this list of conditions and the following disclaimer.
////     * Redistributions in binary form must reproduce the above copyright
////       notice, this list of conditions and the following disclaimer in the
////       documentation and/or other materials provided with the distribution.
////     * Neither the name of the Egret nor the
////       names of its contributors may be used to endorse or promote products
////       derived from this software without specific prior written permission.
////
////  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
////  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
////  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
////  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
////  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
////  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
////  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
////  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
////  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
////  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////
////////////////////////////////////////////////////////////////////////////////////////


namespace RES {

    /**
     * SpriteSheet解析器
     * @private
     */
    export class AnimationAnalyzer extends BinAnalyzer {

        public constructor() {
            super();
            this._dataFormat = egret.HttpResponseType.TEXT;
        }

        /**
         * 一项加载结束
         */
        public onLoadFinish(event:egret.Event):void {
            let request = event.target;
            let data:any = this.resItemDic[request.$hashCode];
            delete this.resItemDic[request.hashCode];
            let resItem:ResourceItem = data.item;
            let compFunc:Function = data.func;
            resItem.loaded = (event.type == egret.Event.COMPLETE);
            if (resItem.loaded) {
                if (request instanceof egret.HttpRequest) {
                    resItem.loaded = false;
                    let imageUrl:string = this.analyzeConfig(resItem, request.response);
                    if (imageUrl) {
                        this.loadImage(imageUrl, data);
                        this.recycler.push(request);
                        return;
                    }
                }
                else {
                    this.analyzeBitmap(resItem, (<egret.ImageLoader>request).data);
                }
            }
            if (request instanceof egret.HttpRequest) {
                this.recycler.push(request);
            }
            else {
                this.recyclerIamge.push(request);
            }
            compFunc.call(data.thisObject, resItem);
        }

        public sheetMap:any = {};

        /**
         * 解析并缓存加载成功的配置文件
         */
        public analyzeConfig(resItem:ResourceItem, data:string):string {
            let name:string = resItem.name;
            let config:any;
            let imageUrl:string = "";
            try {
                let str:string = <string> data;
                config = JSON.parse(str);
            }
            catch (e) {
                egret.$warn(1017, resItem.url, data);
            }
            if (config) {
                this.sheetMap[name] = config;
                if (config["file"]) {
                    imageUrl = this.getRelativePath(resItem.url, config["file"]);
                }
                else {
                    let arr = resItem.url.split("?");
                    let arr2 = arr[0].split("/");
                    arr2[arr2.length - 1] = arr2[arr2.length - 1].split(".")[0] + ".png";
                    imageUrl = "";
                    for (let i = 0; i < arr2.length; i++) {
                        imageUrl += arr2[i] + (i < arr2.length - 1 ? "/" : "");
                    }
                    if (arr.length == 2) imageUrl += arr[2];
                }
            }
            return imageUrl;
        }

        /**
         * 解析并缓存加载成功的位图数据
         */
        public analyzeBitmap(resItem:ResourceItem, data:egret.BitmapData):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            let config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            let targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
            let spriteSheet:any = this.parseAnimation(data, config, targetName);
            this.fileDic[name] = spriteSheet;
        }

        /**
         * 获取相对位置
         */
        public getRelativePath(url:string, file:string):string {
            url = url.split("\\").join("/");
            let index:number = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url;
        }

        private parseAnimation(bitmapData:egret.BitmapData, data:any, name:string):egret.Texture[] {
            let attributes = Object.keys(data.mc);
            let list:any[] = data.mc[attributes[0]].frames;
            let len = list.length;
            let config;
            let animationFrames:egret.Texture[] = [];
            for (let i = 0; i < len; i++) {
                config = data.res[list[i].res];
                let texture = new egret.Texture();
                texture.$bitmapData = bitmapData;
                texture.$initData(config.x, config.y, config.w, config.h, list[i].x, list[i].y, list[i].sourceW, list[i].sourceH, bitmapData.width, bitmapData.height);
            }
            return animationFrames;
        }

        public destroyRes(name:string):boolean {
            let sheet:any = this.fileDic[name];
            if (sheet) {
                delete this.fileDic[name];
                return true;
            }
            return false;
        }

        /**
         * ImageLoader对象池
         */
        private recyclerIamge:egret.ImageLoader[] = [];

        private loadImage(url:string, data:any):void {
            let loader = this.getImageLoader();
            this.resItemDic[loader.hashCode] = data;
            loader.load($getVirtualUrl(url));
        }

        private getImageLoader():egret.ImageLoader {
            let loader = this.recyclerIamge.pop();
            if (!loader) {
                loader = new egret.ImageLoader();
                loader.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            }
            return loader;
        }
    }
}
