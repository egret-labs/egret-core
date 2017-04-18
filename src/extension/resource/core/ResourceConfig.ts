//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace RES {

	/**
	 * @class RES.ResourceConfig
	 * @classdesc
     * @private
	 */
    export class ResourceConfig {

        public constructor() {
            RES["configInstance"] = this;
        }

        /**
         * 根据组名获取组加载项列表
		 * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
		 * @returns {Array<egret.ResourceItem>}
         */
        public getGroupByName(name:string):Array<ResourceItem> {
            let group:Array<ResourceItem> = new Array<ResourceItem>();
            if (!this.groupDic[name])
                return group;
            let list:any[] = this.groupDic[name];
            let length:number = list.length;
            for (let i:number = 0; i < length; i++) {
                let obj:any = list[i];
                group.push(this.parseResourceItem(obj));
            }
            return group;
        }
        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {any[]}
         */
        public getRawGroupByName(name:string):any[]{
            if (this.groupDic[name])
                return this.groupDic[name];
            return [];
        }

        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
		 * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.string[]} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
		 * @returns {boolean}
         */
        public createGroup(name:string, keys:string[], override:boolean = false):boolean {
            if ((!override && this.groupDic[name]) || !keys || keys.length == 0)
                return false;
            let groupDic:any = this.groupDic;
            let group:any[] = [];
            let length:number = keys.length;
            for (let i:number = 0; i < length; i++) {
                let key:string = keys[i];
                let g:any[] = groupDic[key];
                if(g){
                    let len:number = g.length;
                    for(let j:number=0;j<len;j++){
                        let item:any = g[j];
                        if (group.indexOf(item) == -1)
                            group.push(item);
                    }
                }
                else{
                    let item = this.keyMap[key];
                    if (item){
                        if(group.indexOf(item) == -1)
                            group.push(item);
                    }
                    else{
                        egret.$warn(3200, key);
                    }
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
            let resources:any[] = data["resources"];
            if (resources) {
                let length:number = resources.length;
                for (let i:number = 0; i < length; i++) {
                    let item:any = resources[i];
                    let url:string = item.url;
                    if(url&&url.indexOf("://")==-1)
                        item.url = folder + url;
                    this.addItemToKeyMap(item);
                }
            }
            let groups:any[] = data["groups"];
            if (groups) {
                let length = groups.length;
                for (let i = 0; i < length; i++) {
                    let group:any = groups[i];
                    let list:any[] = [];
                    let keys:string[] = (<string> group.keys).split(",");
                    let l:number = keys.length;
                    for (let j:number = 0; j < l; j++) {
                        let name:string = keys[j].trim();
                        let item = this.keyMap[name];
                        if (item && list.indexOf(item) == -1) {
                            list.push(item);
                        }
                    }
                    this.groupDic[group.name] = list;
                }
            }
        }

        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        public addSubkey(subkey:string,name:string):void{
            let item:any = this.keyMap[name];
            if(item&&!this.keyMap[subkey]){
                this.keyMap[subkey] = item;
            }
        }

        /**
         * 添加一个加载项数据到列表
         */
        private addItemToKeyMap(item:any):void{
            if(!this.keyMap[item.name])
                this.keyMap[item.name] = item;
            if(item.hasOwnProperty("subkeys")){
                let subkeys:any[] = (<string><any> (item.subkeys)).split(",");
                item.subkeys = subkeys;
                let length:number = subkeys.length;
                for(let i:number = 0;i < length;i++){
                    let key:string = subkeys[i];
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
            let data:any = this.keyMap[key];
            return data?data.name:"";
        }

        /**
         * 获取加载项类型。
		 * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
		 * @returns {string}
         */
        public getType(key:string):string {
            let data:any = this.keyMap[key];
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
            let data:any = this.keyMap[key];
            if (data)
                return this.parseResourceItem(data);
            return null;
        }

        /**
         * 转换Object数据为ResourceItem对象
         */
        private parseResourceItem(data:any):ResourceItem {
            let resItem:ResourceItem = new ResourceItem(data.name, data.url, data.type);
            resItem.data = data;
            return resItem;
        }
    }
}
