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
	 * @class RES.ResourceConfig
	 * @classdesc
	 */
    export class ResourceConfig {

        public constructor() {
        }

        /**
         * 根据组名获取组加载项列表
		 * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
		 * @returns {Array<egret.ResourceItem>}
         */
        public getGroupByName(name:string):Array<ResourceItem> {
            var group:Array<ResourceItem> = new Array<ResourceItem>();
            if (!this.groupDic[name])
                return group;
            var list:Array<any> = this.groupDic[name];
            var length:number = list.length;
            for (var i:number = 0; i < length; i++) {
                var obj:any = list[i];
                group.push(this.parseResourceItem(obj));
            }
            return group;
        }
        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {Array<any>}
         */
        public getRawGroupByName(name:string):Array<any>{
            if (this.groupDic[name])
                return this.groupDic[name];
            return [];
        }

        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
		 * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
		 * @returns {boolean}
         */
        public createGroup(name:string, keys:Array<string>, override:boolean = false):boolean {
            if ((!override && this.groupDic[name]) || !keys || keys.length == 0)
                return false;
            var groupDic:any = this.groupDic;
            var group:Array<any> = [];
            var length:number = keys.length;
            for (var i:number = 0; i < length; i++) {
                var key:string = keys[i];
                var g:Array<any> = groupDic[key];
                if(g){
                    var len:number = g.length;
                    for(var j:number=0;j<len;j++){
                        var item:any = g[j];
                        if (group.indexOf(item) == -1)
                            group.push(item);
                    }
                }
                else{
                    item = this.keyMap[key];
                    if (item && group.indexOf(item) == -1)
                        group.push(item);
                }

            }
            if (group.length == 0)
                return false;
            this.groupDic[name] = group;
            return true;
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
		 * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        public parseConfig(data:any, folder:string):void {
            if (!data)
                return;
            var resources:Array<any> = data["resources"];
            if (resources) {
                var length:number = resources.length;
                for (var i:number = 0; i < length; i++) {
                    var item:any = resources[i];
                    var url:string = item.url;
                    if(url&&url.indexOf("://")==-1)
                        item.url = folder + url;
                    this.addItemToKeyMap(item);
                }
            }
            var groups:Array<any> = data["groups"];
            if (groups) {
                length = groups.length;
                for (i = 0; i < length; i++) {
                    var group:any = groups[i];
                    var list:Array<any> = [];
                    var keys:Array<string> = (<string> group.keys).split(",");
                    var l:number = keys.length;
                    for (var j:number = 0; j < l; j++) {
                        var name:string = keys[j].trim();
                        item = this.keyMap[name];
                        if (item && list.indexOf(item) == -1) {
                            list.push(item);
                        }
                    }
                    this.groupDic[group.name] = list;
                }
            }
        }

        /**
         * 添加一个加载项数据到列表
         */
        private addItemToKeyMap(item:any):void{
            if(!this.keyMap[item.name])
                this.keyMap[item.name] = item;
            if(item.hasOwnProperty("subkeys")){
                var subkeys:Array<any> = (<string><any> (item.subkeys)).split(",");
                item.subkeys = subkeys;
                var length:number = subkeys.length;
                for(var i:number = 0;i < length;i++){
                    var key:string = subkeys[i];
                    if(this.keyMap[key]!=null)
                        continue;
                    this.keyMap[key] = item;
                }
            }
        }

        /**
         * 获取加载项的name属性
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        public getName(key:string):string{
            var data:any = this.keyMap[key];
            return data?data.name:"";
        }

        /**
         * 获取加载项类型。
		 * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
		 * @returns {string}
         */
        public getType(key:string):string {
            var data:any = this.keyMap[key];
            return data ? data.type : "";
        }

        public getRawResourceItem(key:string):any{
            return this.keyMap[key];
        }

        /**
         * 获取加载项信息对象
		 * @method RES.ResourceConfig#getResourceItem
         * @param key {string} 对应配置文件里的key属性或sbuKeys属性的一项。
		 * @returns {egret.ResourceItem}
         */
        public getResourceItem(key:string):ResourceItem {
            var data:any = this.keyMap[key];
            if (data)
                return this.parseResourceItem(data);
            return null;
        }

        /**
         * 转换Object数据为ResourceItem对象
         */
        private parseResourceItem(data:any):ResourceItem {
            var resItem:ResourceItem = new ResourceItem(data.name, data.url, data.type);
            resItem.data = data;
            return resItem;
        }
    }
}