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

/// <reference path="BinAnalyzer.ts"/>

module RES {
    /**
     * SpriteSheet解析器
     */
    export class SheetAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = ns_egret.URLLoaderDataFormat.TEXT;
        }

        /**
         * @inheritDoc
         */
        public getRes(name:string):any{
            var res:any = this.fileDic[name];
            if(!res){
                var prefix:string = RES.AnalyzerBase.getStringPrefix(name);
                res = this.fileDic[prefix];
                if(res){
                    var tail:string = RES.AnalyzerBase.getStringTail(name);
                    res = (<ns_egret.SpriteSheet> res).getTexture(tail);
                }
            }
            return res;
        }
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
            if(typeof(loader.data)=="string"){
                this._dataFormat = ns_egret.URLLoaderDataFormat.TEXTURE;
                this.loadFile(resItem,compFunc,data.thisObject);
                this._dataFormat = ns_egret.URLLoaderDataFormat.TEXT;
            }
            else{
                compFunc.call(data.thisObject,resItem);
            }
        }

        public sheetMap:any = {};
        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem,data:any):void{
            var name:string = resItem.name;
            if(this.fileDic[name]||!data){
                return;
            }
            var config:any;
            if(typeof(data)=="string"){
                try{
                    var str:string = <string> data;
                    config = JSON.parse(str);
                }
                catch (e){
                }
                if(!config){
                    return;
                }
                this.sheetMap[name] = config;
                resItem.loaded = false;
                resItem.url = this.getRelativePath(resItem.url,config["file"]);
            }
            else{
                var texture:ns_egret.Texture = data;
                config = this.sheetMap[name];
                delete this.sheetMap[name];
                if(texture){
                    var spriteSheet:ns_egret.SpriteSheet = this.parseSpriteSheet(texture,config);
                    this.fileDic[name] = spriteSheet;
                }
            }
        }

        private getRelativePath(url:string,file:string):string{
            url = url.split("\\").join("/");
            var index:number = url.lastIndexOf("/");
            if(index!=-1){
                url = url.substring(0,index+1)+file;
            }
            else{
                url = file;
            }
            return url;
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