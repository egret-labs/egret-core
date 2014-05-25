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

/// <reference path="ResourceItem.ts"/>

module ns_egret {

    export class ResourceConfig{
        /**
         * 构造函数
         */
        public constructor(){
        }

        /**
         * 根据组名获取组加载项列表
         * @param name 组名
         */
        public getGroupByName(name:string):Array<ResourceItem>{
            var group:Array<ResourceItem> = new Array<ResourceItem>();
            if(!this.groupDic[name])
                return group;
            var list:Array<any> = this.groupDic[name];
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var obj:any = list[i];
                group.push(this.parseResourceItem(obj));
            }
            return group;
        }
        /**
         * 一级键名字典
         */
        private keyMap:any = {};
        /**
         * 加载组字典
         */
        private groupDic:any = {};
        /**
         * 解析一个配置文件
         * @param data 配置文件数据
         * @param folder 加载项的路径前缀。
         */
        public parseConfig(data:any,folder:string):void{
            if(!data)
                return;
            var group:Array<any>;
            for(var name in data){
                group = this.groupDic[name];
                if(!group){
                    group = this.groupDic[name] = [];
                }
                this.getItemFromObject(data[name],folder,group);
            }
        }
        /**
         * 从Object里解析加载项
         */
        private getItemFromObject(list:Array<any>,folder:string,group:Array<any>):void{
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var item:any = list[i];
                item.url = folder+item.url;
                if(!this.keyMap[item.name])
                    this.keyMap[item.name] = item;
                group.push(item);
            }
        }
        /**
         * 获取加载项类型。
         * @param name 对应配置文件里的name属性。
         */
        public getType(name:string):string{
            var data:any = this.keyMap[name];
            return data?data.type:"";
        }
        /**
         * 获取加载项信息对象
         * @param name 对应配置文件里的name属性。
         */
        public getResourceItem(name:string):ResourceItem{
            var data:any = this.keyMap[name];
            if(data)
                return this.parseResourceItem(data);
            return null;
        }
        /**
         * 转换Object数据为ResourceItem对象
         */
        private parseResourceItem(data:any):ResourceItem{
            var resItem:ResourceItem = new ResourceItem(data.name,data.url,data.type);
            resItem.data = data;
            return resItem;
        }

    }
}