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
type ResourceRootSelector<T extends string> = () => T;


type ResourceTypeSelector = (file: string) => string;

type ResourceNameSelector = (file: string) => string;

type ResourceMergerSelector = (file: string) => { path: string, alias: string };



module RES {


    export var resourceTypeSelector: ResourceTypeSelector;

    export var resourceNameSelector: ResourceNameSelector = (p) => p;

    export var resourceMergerSelector: ResourceMergerSelector | null;


    export function getResourceInfo(path: string): File | null {
        let result = fileSystem.getFile(path);
        if (!result) {
            path = RES.resourceNameSelector(path);
            result = fileSystem.getFile(path);
        }
        return result;
    }

    var configItem: ResourceInfo & { resourceRoot: string };

    export function setConfigURL(url: string) {
        let type;
        if (url.indexOf(".json") >= 0) {
            type = "legacyResourceConfig";
        }
        else {
            type = "resourceConfig";
        }
        configItem = { type, resourceRoot, url, name: url, extra: true };
    }



    export var resourceRoot = "";


    export interface ResourceInfo {

        url: string;

        type: string;

        crc32?: string;

        size?: number;

        //todo remove
        name: string;

        soundType?: string;

        scale9grid?: string;

        groupName?: string;

        /**
         * 是否被资源管理器进行管理，默认值为 false
         */
        extra?: boolean;

        promise?: Promise<any>;

    }

    export interface Data {

        resourceRoot: string;

        typeSelector: ResourceTypeSelector;

        mergeSelector: ResourceMergerSelector | null;

        fileSystem: FileSystem

        groups: {
            [groupName: string]: string[]
        },

        alias: {
            [aliasName: string]: string;
        }

    }

	/**
	 * @class RES.ResourceConfig
	 * @classdesc
     * @private
	 */
    export class ResourceConfig {


        config: Data;

        resourceRoot: string;

        constructor() {
        }

        init() {
            if (!this.config) {
                this.config = {
                    alias: {}, groups: {}, resourceRoot: this.resourceRoot,
                    typeSelector: () => 'unknown', mergeSelector: null,
                    fileSystem: null as any as FileSystem
                }
            }
            return queue.loadResource(configItem).then((data) => {
                return this.parseConfig(data)
            }).catch(e => {
                if (!e.__resource_manager_error__) {
                    console.error(e.stack)
                    e = new ResourceManagerError(1002);
                }
                return Promise.reject(e);
            })
        }

        /**
         * 根据组名获取组加载项列表
		 * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
		 * @returns {Array<egret.ResourceItem>}
         */
        /**
         * @internal
         */
        public getGroupByName(name: string, shouldNotBeNull: true): ResourceInfo[];
        /**
         * @internal
         */
        public getGroupByName(name: string): ResourceInfo[] | null;
        /**
         * @internal
         */
        public getGroupByName(name: string, shouldNotBeNull?: boolean): ResourceInfo[] | null {

            let group = this.config.groups[name];
            let result: ResourceInfo[] = [];
            if (!group) {
                if (shouldNotBeNull) {
                    throw new RES.ResourceManagerError(2005, name)
                }
                return null;
            }
            for (var paramKey of group) {
                var { key, subkey } = config.getResourceWithSubkey(paramKey, true);
                let r = config.getResource(key, true);
                if (result.indexOf(r) == -1) {
                    result.push(r);
                }
            }
            return result;
        }


        __temp__get__type__via__url(url_or_alias: string): string {

            let url = this.config.alias[url_or_alias];
            if (!url) {
                url = url_or_alias;
            }

            if (resourceTypeSelector) {
                let type = resourceTypeSelector(url);
                if (!type) {
                    throw new ResourceManagerError(2004, url);
                }
                return type;
            }
            else {
                console.warn("RES.mapConfig 并未设置 typeSelector");
                return "unknown";
            }
        }
        /**
         * @internal
         */
        getResourceWithSubkey(key: string): { r: ResourceInfo, key: string, subkey: string } | null
        /**
         * @internal
         */
        getResourceWithSubkey(key: string, shouldNotBeNull: true): { r: ResourceInfo, key: string, subkey: string }
        /**
         * @internal
         */
        getResourceWithSubkey(key: string, shouldNotBeNull: false): { r: ResourceInfo, key: string, subkey: string } | null

        getResourceWithSubkey(key: string, shouldNotBeNull?: boolean): { r: ResourceInfo, key: string, subkey: string } | null {
            key = this.getKeyByAlias(key);
            let index = key.indexOf("#");
            let subkey = "";
            if (index >= 0) {
                subkey = key.substr(index + 1)
                key = key.substr(0, index);

            }
            let r = this.getResource(key);
            if (!r) {
                if (shouldNotBeNull) {
                    let msg = subkey ? `${key}#${subkey}` : key;
                    throw new ResourceManagerError(2006, msg);
                }
                else {
                    return null;
                }

            }
            else {
                return {
                    r, key, subkey
                }
            }
        }


        public getKeyByAlias(aliasName: string) {
            if (this.config.alias[aliasName]) {
                return this.config.alias[aliasName]
            }
            else {
                return aliasName;
            }
        }
        /**
         * @internal
         */
        public getResource(url_or_alias: string): ResourceInfo | null;
        /**
         * @internal
         */
        public getResource(path_or_alias: string, shouldNotBeNull: false): ResourceInfo | null
        /**
         * @internal
         */
        public getResource(path_or_alias: string, shouldNotBeNull: true): ResourceInfo
        public getResource(path_or_alias: string, shouldNotBeNull?: boolean): ResourceInfo | null {
            let path = this.config.alias[path_or_alias];
            if (!path) {
                path = path_or_alias;
            }
            let r = getResourceInfo(path)
            if (!r) {
                if (shouldNotBeNull) {
                    throw new ResourceManagerError(2006, path_or_alias)
                }
                return null;
            }
            return r;
        }

        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {Array<any>}
         * @internal
         */
        public getGroup(name: string): ResourceInfo[] | null {

            return this.getGroupByName(name);

        }

        // public getResourceInfos(folderName: string) {
        //     this.config.resources[]
        // }

        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
		 * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
		 * @returns {boolean}
         */
        public createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {

            if ((!override && this.config.groups[name]) || !keys || keys.length == 0) {
                return false;
            }

            let group: string[] = [];
            for (let key of keys) {
                if (this.config.groups[key]) {
                    let groupInfo = this.config.groups[key];
                    group = group.concat(groupInfo);
                }
                else {
                    group.push(key)
                }
            }

            this.config.groups[name] = group;
            return true;

            // var groupDic: any = this.groupDic;
            // var group: Array<any> = [];
            // var length: number = keys.length;
            // for (var i: number = 0; i < length; i++) {
            //     var key: string = keys[i];
            //     var g: Array<any> = groupDic[key];
            //     if (g) {
            //         var len: number = g.length;
            //         for (var j: number = 0; j < len; j++) {
            //             var item: any = g[j];
            //             if (group.indexOf(item) == -1)
            //                 group.push(item);
            //         }
            //     }
            //     else {
            //         item = this.keyMap[key];
            //         if (item) {
            //             if (group.indexOf(item) == -1)
            //                 group.push(item);
            //         }
            //         else {
            //             egret.$warn(3200, key);
            //         }
            //     }

            // }
            // if (group.length == 0)
            //     return false;
            // this.groupDic[name] = group;
            // return true;
        }


        /**
         * 解析一个配置文件
		 * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        public parseConfig(data: Data): void {
            resourceRoot = data.resourceRoot;
            this.config = data;
            fileSystem = data.fileSystem;

            // if (!data)
            //     return;
            // var resources: Array<any> = data["resources"];
            // if (resources) {
            //     var length: number = resources.length;
            //     for (var i: number = 0; i < length; i++) {
            //         var item: any = resources[i];
            //         var url: string = item.url;
            //         if (url && url.indexOf("://") == -1)
            //             item.url = folder + url;
            //         this.addItemToKeyMap(item);
            //     }
            // }
            // var groups: Array<any> = data["groups"];
            // if (groups) {
            //     length = groups.length;
            //     for (i = 0; i < length; i++) {
            //         var group: any = groups[i];
            //         var list: Array<any> = [];
            //         var keys: Array<string> = (<string>group.keys).split(",");
            //         var l: number = keys.length;
            //         for (var j: number = 0; j < l; j++) {
            //             var name: string = keys[j].trim();
            //             item = this.keyMap[name];
            //             if (item && list.indexOf(item) == -1) {
            //                 list.push(item);
            //             }
            //         }
            //         this.groupDic[group.name] = list;
            //     }
            // }
        }

        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        public addSubkey(subkey: string, name: string): void {
            this.addAlias(subkey, name + "#" + subkey);
        }


        public addAlias(alias, key) {
            if (this.config.alias[key]) {
                key = this.config.alias[key];
            }
            this.config.alias[alias] = key;
        }

        /**
         * 获取加载项类型。
		 * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
		 * @returns {string}
         */
        public getType(key: string): string {
            return this.getResource(key, true).type;
        }

        public addResourceData(data: { name: string, type?: string, url: string }): void {
            if (!data.type) {
                data.type = this.__temp__get__type__via__url(data.url);
            }
            fileSystem.addFile(data.url, data.type);
            if (data.name) {
                this.config.alias[data.name] = data.url;
            }


        }

        public destory() {
            systemPid++;
            let emptyFileSystem: FileSystem = {

                getFile: () => {
                    return null;
                },
                addFile: () => {

                },
                profile: () => {

                }
            }
            this.config = { groups: {}, alias: {}, fileSystem: emptyFileSystem, typeSelector: (p) => p, resourceRoot: "resources", mergeSelector: null };
        }
    }
}
