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
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.type==egret.Event.COMPLETE);
            if(resItem.loaded){
                if(typeof(loader.data)=="string"){
                    resItem.loaded = false;
                    var imageUrl:string = this.analyzeConfig(resItem,loader.data);
                    if(imageUrl){
                        resItem.url = imageUrl;
                        this._dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                        this.loadFile(resItem,compFunc,data.thisObject);
                        this._dataFormat = egret.URLLoaderDataFormat.TEXT;
                        return;
                    }
                }
                else{
                    this.analyzeBitmap(resItem,loader.data);
                }
            }
            resItem.url = resItem.data.url;
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
                return true;
            }
            return false;
        }
    }
}
