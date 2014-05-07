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

module ns_egret {

    export class SkinManagerImpl extends HashObject implements ISkinManager{

        public constructor(){
            super();
        }

        private skinDataList:Object = {};

        /**
         * 为指定关键字添加一个皮肤映射
         * @param key 皮肤的关键字
         * @param skinData 皮肤的JSON描述文件,可为Object或JSON字符串。
         */
        public addSkin(key:string,skinData:any):void{
            if(typeof(skinData)=="string"){
                skinData = JSON.parse(<string> skinData);
            }
            this.skinDataList[key] = skinData;
        }

        /**
         * 根据关键字获取一个皮肤实例
         * @param key 皮肤的关键字
         */
        public getSkin(key:string):any{
            return this.createSkin(key);
        }
        /**
         * 根据关键字创建一个皮肤实例
         * @param key 皮肤的关键字
         */
        private createSkin(key:string):any{
            var skinData:any = this.skinDataList[key];
            if(!skinData)
                return null;
            return this.parseData(skinData);
        }

        private parseData(data:any):any{
            var value:any;
            if(data instanceof Array){
                value = [];
                var list:Array = <Array> data;
                var length:number = list.length;
                for(var i:number=0;i<length;i++){
                    var child:any = this.parseData(list[i]);
                    value.push(child);
                }
            }
            else if(typeof(data)=="object"){
                value = this.parseObject(data);
            }
            else{
                value = data;
            }
            return value;
        }

        private parseObject(data:Object):any{
            var className:string = data["name"];
            var clazz:any = ns_egret[className];
            var value:any = new clazz();
            var prop:Object = data["prop"];
            if(!prop)
                return value;
            for(var key:string in prop){
                value[key] = this.parseData(prop[key]);
            }
            return value;
        }
    }
}