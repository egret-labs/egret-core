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

type ResourceNameSelector = (file: string) => string;

type ResourceMergerSelector = (file: string) => { path: string, alias: string };



module RES {
    /**
     * @internal
     */
    export var resourceNameSelector: ResourceNameSelector = (p) => p;
    /**
     * @internal
     */
    export var resourceMergerSelector: ResourceMergerSelector | null;

    /**
     * Get resource information through file path
     * @param path file path
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 通过文件路径获取资源信息
     * @param path 文件路径
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResourceInfo(path: string): File | null {
        let result = config.config.fileSystem.getFile(path);
        if (!result) {
            path = RES.resourceNameSelector(path);
            result = config.config.fileSystem.getFile(path);
        }
        return result;
    }

    var configItem: ResourceInfo;

    /**
     * 注册config的相关配置
     * @internal
     * @param url config的地址
     * @param root 根路径
     */
    export function setConfigURL(url: string, root: string) {
        let type;
        if (url.indexOf(".json") >= 0) {
            type = "legacyResourceConfig";
        }
        else {
            type = "resourceConfig";
        }
        configItem = { type, root, url, name: url };
    }
    /**
    * @private
    */
    export interface ResourceInfo {

        url: string;

        type: string;

        root: string;

        crc32?: string;

        size?: number;

        extra?: 1 | undefined;
        //todo remove
        name: string;

        soundType?: string;

        scale9grid?: string;

        groupNames?: string[];

        promise?: Promise<any>;

    }
    /**
    * @private
    */
    export interface Data {

        resourceRoot: string;

        mergeSelector: ResourceMergerSelector | null;

        fileSystem: FileSystem

        groups: {
            [groupName: string]: string[]
        },

        alias: {
            [aliasName: string]: string;
        }
        loadGroup: string[];
    }

	/**
	 * @class RES.ResourceConfig
	 * @classdesc
     * @private
	 */
    export class ResourceConfig {


        config: Data;


        constructor() {
        }

        init() {
            if (!this.config) {
                this.config = {
                    alias: {}, groups: {}, resourceRoot: configItem.root,
                    mergeSelector: null,
                    fileSystem: null as any as FileSystem,
                    loadGroup: []
                }
            }
            return queue.pushResItem(configItem).catch(e => {
                if (!RES.isCompatible) {
                    if (!e.__resource_manager_error__) {
                        if (e.error) {
                            console.error(e.error.stack);
                        } else {
                            console.error(e.stack);
                        }
                        e = new ResourceManagerError(1002);
                    }
                }
                host.remove(configItem);
                return Promise.reject(e);
            })
        }

        /**
         * 根据组名获取组加载项列表
		 * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
		 * @returns {Array<egret.ResourceItem>}
         */
        public getGroupByName(name: string): ResourceInfo[] {
            let group = this.config.groups[name];
            let result: ResourceInfo[] = [];
            if (!group) {
                return result;
            }
            for (var paramKey of group) {
                let tempResult;
                tempResult = config.getResourceWithSubkey(paramKey);
                if (tempResult == null) {
                    continue;
                }
                var { r, key } = tempResult;
                if (r == null) {
                    /** 加载组里面的资源，可能不存在 */
                    throw new RES.ResourceManagerError(2005, key)
                    continue;
                }
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
            if (RES.typeSelector) {
                let type = RES.typeSelector(url);
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
        getResourceWithSubkey(key: string, ): { r: ResourceInfo, key: string, subkey: string } | null {
            key = this.getKeyByAlias(key);
            let index = key.indexOf("#");
            let subkey = "";
            if (index >= 0) {
                subkey = key.substr(index + 1)
                key = key.substr(0, index);
            }
            let r = this.getResource(key);
            if (!r) {
                return null;
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
        public getResource(path_or_alias: string): ResourceInfo | null {
            let path = this.config.alias[path_or_alias];
            if (!path) {
                path = path_or_alias;
            }
            let r = getResourceInfo(path)
            if (!r) {
                return null;
            } else {
                return r;
            }
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
        public addResourceData(data: { name: string, type: string, url: string, root?: string, extra?: 1 | undefined }): void {
            if (RES.hasRes(data.name)) {
                return;
            }
            if (!data.type) {
                data.type = this.__temp__get__type__via__url(data.url);
            }
            config.config.fileSystem.addFile(data);
        }

        public removeResourceData(data: { name: string, type?: string, url: string, root?: string, extra?: 1 | undefined }): void {
            if (!RES.hasRes(data.name)) {
                return;
            }
            config.config.fileSystem.removeFile(data.url);
            if (this.config.alias[data.name]) {
                delete this.config.alias[data.name];
            }
        }
    }
}
