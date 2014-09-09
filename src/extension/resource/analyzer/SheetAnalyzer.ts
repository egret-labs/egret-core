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
            this.recycler.push(loader);
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.type==egret.Event.COMPLETE);
            if(resItem.loaded){
                this.analyzeData(resItem,loader.data)
            }
            if(typeof(loader.data)=="string"){
                this._dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                this.loadFile(resItem,compFunc,data.thisObject);
                this._dataFormat = egret.URLLoaderDataFormat.TEXT;
            }
            else{
                compFunc.call(data.thisObject,resItem);
            }
        }

        public sheetMap:any = {};

        private textureMap:any = {};
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
                    egret.Logger.warning("JSON文件格式不正确: "+resItem.url);
                }
                if(!config){
                    return;
                }
                this.sheetMap[name] = config;
                resItem.loaded = false;
                resItem.url = this.getRelativePath(resItem.url,config["file"]);
            }
            else{
                var texture:egret.Texture = data;
                config = this.sheetMap[name];
                delete this.sheetMap[name];
                if(texture){
                    var targetName:string = resItem.data&&resItem.data.subkeys?"":name;
                    var spriteSheet:egret.SpriteSheet = this.parseSpriteSheet(texture,config,targetName);
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
    }
}
