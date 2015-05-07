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


module RES {
    /**
     * SpriteSheet解析器
     */
    export class SheetAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = egret.URLLoaderDataFormat.TEXT;
        }

        /**
         * @inheritDoc
         */
        public getRes(name:string):any{
            var res:any = this.fileDic[name];
            if(!res){
                res = this.textureMap[name];
            }
            if(!res){
                var prefix:string = RES.AnalyzerBase.getStringPrefix(name);
                res = this.fileDic[prefix];
                if(res){
                    var tail:string = RES.AnalyzerBase.getStringTail(name);
                    res = (<egret.SpriteSheet> res).getTexture(tail);
                }
            }
            return res;
        }
        /**
         * 一项加载结束
         */
        public onLoadFinish(event:egret.Event):void{
            var loader:egret.URLLoader = <egret.URLLoader> (event.target);
            var data:any = this.resItemDic[loader.hashCode];
            delete this.resItemDic[loader.hashCode];
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.type==egret.Event.COMPLETE);
            if(resItem.loaded){
                if(typeof(loader.data)=="string"){
                    resItem.loaded = false;
                    var imageUrl:string = this.analyzeConfig(resItem,loader.data);
                    if(imageUrl){
                        var tempUrl:string = resItem.url;
                        resItem.url = imageUrl;
                        this._dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                        this.loadFile(resItem,compFunc,data.thisObject);
                        this._dataFormat = egret.URLLoaderDataFormat.TEXT;
                        resItem.url = tempUrl;
                        return;
                    }
                }
                else{
                    this.analyzeBitmap(resItem,loader.data);
                }
            }
            this.recycler.push(loader);
            compFunc.call(data.thisObject,resItem);
        }

        public sheetMap:any = {};

        private textureMap:any = {};
        /**
         * 解析并缓存加载成功的配置文件
         */
        public analyzeConfig(resItem:ResourceItem,data:string):string{
            var name:string = resItem.name;
            var config:any;
            var imageUrl:string = "";
            try{
                var str:string = <string> data;
                config = JSON.parse(str);
            }
            catch (e){
                egret.Logger.warningWithErrorId(1017, resItem.url, data);
            }
            if(config){
                this.sheetMap[name] = config;
                imageUrl = this.getRelativePath(resItem.url,config["file"]);
            }
            return imageUrl;
        }
        /**
         * 解析并缓存加载成功的位图数据
         */
        public analyzeBitmap(resItem:ResourceItem,data:egret.Texture):void {
            var name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            var config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            var targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
            var spriteSheet:egret.SpriteSheet = this.parseSpriteSheet(data, config, targetName);
            this.fileDic[name] = spriteSheet;
        }
        /**
         * 获取相对位置
         */
        public getRelativePath(url:string,file:string):string{
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

        public parseSpriteSheet(texture:egret.Texture,data:any,name:string):egret.SpriteSheet{
            var frames:any = data.frames;
            if(!frames){
                return null;
            }
            var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(texture);
            var textureMap:any = this.textureMap;
            for(var subkey in frames){
                var config:any = frames[subkey];
                var texture:egret.Texture = spriteSheet.createTexture(subkey,config.x,config.y,config.w,config.h,config.offX, config.offY,config.sourceW,config.sourceH);
                if(config["scale9grid"]){
                    var str:string = config["scale9grid"];
                    var list:Array<string> = str.split(",");
                    texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]),parseInt(list[1]),parseInt(list[2]),parseInt(list[3]));
                }
                if(textureMap[subkey]==null){
                    textureMap[subkey] = texture;
                    if(name){
                        this.addSubkey(subkey,name);
                    }
                }
            }
            return spriteSheet;
        }

        /**
         * @inheritDoc
         */
        public destroyRes(name:string):boolean{
            var sheet:egret.SpriteSheet = this.fileDic[name];
            if(sheet){
                delete this.fileDic[name];
                for(var subkey in sheet._textureMap){
                    if(this.textureMap[subkey]){
                        delete this.textureMap[subkey];
                    }
                }
                this.onResourceDestroy(sheet);
                return true;
            }
            return false;
        }

        protected onResourceDestroy(sheet:any){
            sheet.dispose();
        }
    }
}
