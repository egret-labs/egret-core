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

/// <reference path="BinAnalyzer.ts"/>

module RES {
    /**
     * SpriteSheet解析器
     */
    export class SheetAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = ns_egret.URLLoaderDataFormat.TEXTURE;
        }

        private textureMap:any = {};

        /**
         * 一项加载结束
         */
        public onLoadFinish(event:ns_egret.Event):void{
            var loader:ns_egret.URLLoader = <ns_egret.URLLoader> (event.target);
            var data:any = this.resItemDic[loader.hashCode];
            delete this.resItemDic[loader.hashCode];
            this.recycler.push(loader);
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.type==ns_egret.Event.COMPLETE);
            if(resItem.loaded){
                this.analyzeData(resItem,loader.data)
            }
            if(loader.data instanceof ns_egret.Texture){
                this._dataFormat = ns_egret.URLLoaderDataFormat.TEXT;
                this.loadFile(resItem,compFunc,data.thisObject);
                this._dataFormat = ns_egret.URLLoaderDataFormat.TEXTURE;
            }
            else{
                compFunc.call(data.thisObject,resItem);
            }
        }

        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem,data:any):void{
            var name:string = resItem.name;
            if(this.fileDic[name]||!data){
                return;
            }
            var texture:ns_egret.Texture;
            if(typeof(data)=="string"){
                var config:any;
                try{
                    var str:string = <string> data;
                    config = JSON.parse(str);
                }
                catch (e){
                }
                if(!config){
                    return;
                }
                texture = this.textureMap[name];
                delete this.textureMap[name];
                if(texture){
                    var spriteSheet:ns_egret.SpriteSheet = this.parseSpriteSheet(texture,config);
                    this.fileDic[name] = spriteSheet;
                }
            }
            else{
                this.textureMap[name] = data;
                resItem.loaded = false;
                resItem.url = resItem.urls[1];
            }
        }

        private parseSpriteSheet(texture:ns_egret.Texture,data:any):ns_egret.SpriteSheet{
            var frames:any = data.frames;
            if(!frames){
                return;
            }
            var spriteSheet:ns_egret.SpriteSheet = new ns_egret.SpriteSheet(texture._bitmapData);
            for(var name in frames){
                var config:any = frames[name];
                spriteSheet.createTexture(name,config.x,config.y,config.w,config.h);
            }
            return spriteSheet;
        }
    }
}