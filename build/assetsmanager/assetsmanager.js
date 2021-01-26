var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RES;
(function (RES) {
    /**
     * Decorator, determine if the parameter is null
     * @internal
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 装饰器，判断参数是否为null
     * @internal
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    RES.checkNull = function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            if (!arg[0]) {
                console.warn("\u65B9\u6CD5" + propertyKey + "\u7684\u53C2\u6570\u4E0D\u80FD\u4E3Anull");
                return null;
            }
            else {
                return method.apply(this, arg);
            }
        };
    };
    /**
     * 功能开关
     * LOADING_STATE：处理重复加载
     * @internal
     */
    RES.FEATURE_FLAG = {
        FIX_DUPLICATE_LOAD: 1
    };
    /**
     * @internal
     */
    var upgrade;
    (function (upgrade) {
        var _level = "warning";
        function setUpgradeGuideLevel(level) {
            _level = level;
        }
        upgrade.setUpgradeGuideLevel = setUpgradeGuideLevel;
    })(upgrade = RES.upgrade || (RES.upgrade = {}));
})(RES || (RES = {}));
var RES;
(function (RES) {
    /**
     * @internal
     */
    RES.resourceNameSelector = function (p) { return p; };
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
    function getResourceInfo(path) {
        var result = RES.config.config.fileSystem.getFile(path);
        if (!result) {
            path = RES.resourceNameSelector(path);
            result = RES.config.config.fileSystem.getFile(path);
        }
        return result;
    }
    RES.getResourceInfo = getResourceInfo;
    var configItem;
    /**
     * 注册config的相关配置
     * @internal
     * @param url config的地址
     * @param root 根路径
     */
    function setConfigURL(url, root) {
        var type;
        if (url.indexOf(".json") >= 0) {
            type = "legacyResourceConfig";
        }
        else {
            type = "resourceConfig";
        }
        configItem = { type: type, root: root, url: url, name: url };
    }
    RES.setConfigURL = setConfigURL;
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    var ResourceConfig = (function () {
        function ResourceConfig() {
        }
        ResourceConfig.prototype.init = function () {
            if (!this.config) {
                this.config = {
                    alias: {}, groups: {}, resourceRoot: configItem.root,
                    mergeSelector: null,
                    fileSystem: null,
                    loadGroup: []
                };
            }
            return RES.queue.pushResItem(configItem).catch(function (e) {
                if (!RES.isCompatible) {
                    if (!e.__resource_manager_error__) {
                        if (e.error) {
                            console.error(e.error.stack);
                        }
                        else {
                            console.error(e.stack);
                        }
                        e = new RES.ResourceManagerError(1002);
                    }
                }
                RES.host.remove(configItem);
                return Promise.reject(e);
            });
        };
        /**
         * 根据组名获取组加载项列表
         * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
         * @returns {Array<egret.ResourceItem>}
         */
        ResourceConfig.prototype.getGroupByName = function (name) {
            var group = this.config.groups[name];
            var result = [];
            if (!group) {
                return result;
            }
            for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                var paramKey = group_1[_i];
                var tempResult = void 0;
                tempResult = RES.config.getResourceWithSubkey(paramKey);
                if (tempResult == null) {
                    continue;
                }
                var r = tempResult.r, key = tempResult.key;
                if (r == null) {
                    /** 加载组里面的资源，可能不存在 */
                    throw new RES.ResourceManagerError(2005, key);
                    continue;
                }
                if (result.indexOf(r) == -1) {
                    result.push(r);
                }
            }
            return result;
        };
        ResourceConfig.prototype.__temp__get__type__via__url = function (url_or_alias) {
            var url = this.config.alias[url_or_alias];
            if (!url) {
                url = url_or_alias;
            }
            if (RES.typeSelector) {
                var type = RES.typeSelector(url);
                if (!type) {
                    throw new RES.ResourceManagerError(2004, url);
                }
                return type;
            }
            else {
                console.warn("RES.mapConfig 并未设置 typeSelector");
                return "unknown";
            }
        };
        ResourceConfig.prototype.getResourceWithSubkey = function (key) {
            key = this.getKeyByAlias(key);
            var index = key.indexOf("#");
            var subkey = "";
            if (index >= 0) {
                subkey = key.substr(index + 1);
                key = key.substr(0, index);
            }
            var r = this.getResource(key);
            if (!r) {
                return null;
            }
            else {
                return {
                    r: r, key: key, subkey: subkey
                };
            }
        };
        ResourceConfig.prototype.getKeyByAlias = function (aliasName) {
            if (this.config.alias[aliasName]) {
                return this.config.alias[aliasName];
            }
            else {
                return aliasName;
            }
        };
        ResourceConfig.prototype.getResource = function (path_or_alias) {
            var path = this.config.alias[path_or_alias];
            if (!path) {
                path = path_or_alias;
            }
            var r = getResourceInfo(path);
            if (!r) {
                return null;
            }
            else {
                return r;
            }
        };
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        ResourceConfig.prototype.createGroup = function (name, keys, override) {
            if (override === void 0) { override = false; }
            if ((!override && this.config.groups[name]) || !keys || keys.length == 0) {
                return false;
            }
            var group = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (this.config.groups[key]) {
                    var groupInfo = this.config.groups[key];
                    group = group.concat(groupInfo);
                }
                else {
                    group.push(key);
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
        };
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        ResourceConfig.prototype.addSubkey = function (subkey, name) {
            this.addAlias(subkey, name + "#" + subkey);
        };
        ResourceConfig.prototype.addAlias = function (alias, key) {
            if (this.config.alias[key]) {
                key = this.config.alias[key];
            }
            this.config.alias[alias] = key;
        };
        ResourceConfig.prototype.addResourceData = function (data) {
            if (RES.hasRes(data.name)) {
                return;
            }
            if (!data.type) {
                data.type = this.__temp__get__type__via__url(data.url);
            }
            RES.config.config.fileSystem.addFile(data);
        };
        ResourceConfig.prototype.removeResourceData = function (data) {
            if (!RES.hasRes(data.name)) {
                return;
            }
            RES.config.config.fileSystem.removeFile(data.url);
            if (this.config.alias[data.name]) {
                delete this.config.alias[data.name];
            }
        };
        return ResourceConfig;
    }());
    RES.ResourceConfig = ResourceConfig;
    __reflect(ResourceConfig.prototype, "RES.ResourceConfig");
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * @class RES.ResourceLoader
     * @classdesc
     * @private
     */
    var ResourceLoader = (function () {
        function ResourceLoader() {
            /**
             * 当前组加载的项总个数,key为groupName
             */
            this.groupTotalDic = {};
            /**
             * 已经加载的项个数,key为groupName
             */
            this.numLoadedDic = {};
            /**
             * 加载失败的组,key为groupName
             */
            this.groupErrorDic = {};
            this.retryTimesDic = {};
            this.maxRetryTimes = 3;
            this.reporterDic = {};
            this.dispatcherDic = {};
            this.failedList = new Array();
            this.loadItemErrorDic = {};
            this.errorDic = {};
            /**
             * 资源优先级队列，key为资源，value为优先级
             */
            this.itemListPriorityDic = {};
            /**
             * 资源是否在加载
             */
            this.itemLoadDic = {};
            this.promiseHash = {};
            /**
             * 延迟加载队列,getResByUrl ,getResAsync等方法存储队列
             */
            this.lazyLoadList = new Array();
            this.loadingCount = 0;
            /**
             * 最大线程数目
             */
            this.thread = 4;
        }
        ResourceLoader.prototype.pushResItem = function (resInfo) {
            if (this.promiseHash[resInfo.root + resInfo.name]) {
                return this.promiseHash[resInfo.root + resInfo.name];
            }
            this.lazyLoadList.push(resInfo);
            this.itemListPriorityDic[Number.NEGATIVE_INFINITY] = this.lazyLoadList;
            this.updatelistPriority(this.lazyLoadList, Number.NEGATIVE_INFINITY);
            var dispatcher = new egret.EventDispatcher();
            this.dispatcherDic[resInfo.root + resInfo.name] = dispatcher;
            var promise = new Promise(function (resolve, reject) {
                dispatcher.addEventListener("complete", function (e) {
                    resolve(e.data);
                }, null);
                dispatcher.addEventListener("error", function (e) {
                    reject(e.data);
                }, null);
            });
            this.promiseHash[resInfo.root + resInfo.name] = promise;
            this.loadNextResource();
            return promise;
        };
        /**
         * 加载队列,存储组的队列
         */
        ResourceLoader.prototype.pushResGroup = function (list, groupName, priority, reporter) {
            if (this.promiseHash[groupName]) {
                return this.promiseHash[groupName];
            }
            var total = list.length;
            for (var i = 0; i < total; i++) {
                var resInfo = list[i];
                if (!resInfo.groupNames) {
                    resInfo.groupNames = [];
                }
                resInfo.groupNames.push(groupName);
            }
            this.groupTotalDic[groupName] = list.length;
            this.numLoadedDic[groupName] = 0;
            this.updatelistPriority(list, priority);
            this.reporterDic[groupName] = reporter;
            var dispatcher = new egret.EventDispatcher();
            this.dispatcherDic[groupName] = dispatcher;
            var promise = new Promise(function (resolve, reject) {
                dispatcher.addEventListener("complete", resolve, null);
                dispatcher.addEventListener("error", function (e) {
                    reject(e.data);
                }, null);
            });
            this.promiseHash[groupName] = promise;
            this.loadNextResource();
            return promise;
        };
        /**
         * 更新组的优先级顺序
         * @param list 存储数据的队列
         * @param priority 优先级
         */
        ResourceLoader.prototype.updatelistPriority = function (list, priority) {
            if (this.itemListPriorityDic[priority] == undefined) {
                this.itemListPriorityDic[priority] = [];
            }
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                if (this.itemLoadDic[item.root + item.name] == 1) {
                    continue;
                }
                var oldPriority = this.findPriorityInDic(item);
                if (oldPriority == undefined) {
                    this.itemListPriorityDic[priority].push(item);
                }
                else {
                    if (oldPriority < priority) {
                        this.itemListPriorityDic[priority].push(item);
                        var index = this.itemListPriorityDic[oldPriority].indexOf(item);
                        this.itemListPriorityDic[oldPriority].splice(index, 1);
                    }
                }
            }
        };
        /**
         * 搜索单项资源的优先级
         * @param item 单项资源
         */
        ResourceLoader.prototype.findPriorityInDic = function (item) {
            for (var priority in this.itemListPriorityDic) {
                if (this.itemListPriorityDic[priority].indexOf(item) > -1)
                    return parseInt(priority);
            }
            return undefined;
        };
        /**
         * 加载下一项资源，线程控制
         */
        ResourceLoader.prototype.loadNextResource = function () {
            while (this.loadingCount < this.thread) {
                var isload = this.loadSingleResource();
                if (!isload) {
                    break;
                }
            }
        };
        /**
         * 加载单向资源
         */
        ResourceLoader.prototype.loadSingleResource = function () {
            var _this = this;
            var r = this.getOneResourceInfoInGroup();
            if (!r)
                return false;
            this.itemLoadDic[r.root + r.name] = 1;
            this.loadingCount++;
            this.loadResource(r)
                .then(function (response) {
                _this.loadingCount--;
                delete _this.itemLoadDic[r.root + r.name];
                RES.host.save(r, response);
                if (_this.promiseHash[r.root + r.name]) {
                    var dispatcher = _this.deleteDispatcher(r.root + r.name);
                    dispatcher.dispatchEventWith("complete", false, response);
                }
                var groupNames = r.groupNames;
                if (groupNames) {
                    delete r.groupNames;
                    for (var _i = 0, groupNames_1 = groupNames; _i < groupNames_1.length; _i++) {
                        var groupName = groupNames_1[_i];
                        if (_this.setGroupProgress(groupName, r)) {
                            _this.loadGroupEnd(groupName);
                        }
                    }
                }
                _this.loadNextResource();
            }).catch(function (error) {
                if (!error) {
                    throw r.name + " load fail";
                }
                if (!error.__resource_manager_error__) {
                    throw error;
                }
                delete _this.itemLoadDic[r.root + r.name];
                _this.loadingCount--;
                delete RES.host.state[r.root + r.name];
                var times = _this.retryTimesDic[r.name] || 1;
                if (times > _this.maxRetryTimes) {
                    delete _this.retryTimesDic[r.name];
                    if (_this.promiseHash[r.root + r.name]) {
                        var dispatcher = _this.deleteDispatcher(r.root + r.name);
                        dispatcher.dispatchEventWith("error", false, { r: r, error: error });
                    }
                    var groupNames = r.groupNames;
                    if (groupNames) {
                        delete r.groupNames;
                        for (var _i = 0, groupNames_2 = groupNames; _i < groupNames_2.length; _i++) {
                            var groupName = groupNames_2[_i];
                            if (!_this.loadItemErrorDic[groupName]) {
                                _this.loadItemErrorDic[groupName] = [];
                            }
                            if (_this.loadItemErrorDic[groupName].indexOf(r) == -1) {
                                _this.loadItemErrorDic[groupName].push(r);
                            }
                            _this.groupErrorDic[groupName] = true;
                            if (_this.setGroupProgress(groupName, r)) {
                                _this.loadGroupEnd(groupName, error);
                            }
                            else {
                                _this.errorDic[groupName] = error;
                            }
                        }
                    }
                    _this.loadNextResource();
                }
                else {
                    _this.retryTimesDic[r.name] = times + 1;
                    _this.failedList.push(r);
                    _this.loadNextResource();
                    return;
                }
            });
            return true;
        };
        /**
         * 获取下一个待加载项
         */
        ResourceLoader.prototype.getOneResourceInfoInGroup = function () {
            if (this.failedList.length > 0)
                return this.failedList.shift();
            var maxPriority = Number.NEGATIVE_INFINITY;
            for (var p in this.itemListPriorityDic) {
                maxPriority = Math.max(maxPriority, p);
            }
            var list = this.itemListPriorityDic[maxPriority];
            if (!list) {
                return undefined;
            }
            if (list.length == 0) {
                delete this.itemListPriorityDic[maxPriority];
                return this.getOneResourceInfoInGroup();
            }
            return list.shift();
        };
        /**
         * 设置组的加载进度，同时返回当前组是否加载完成
         * @param groupName 组名
         * @param r 加载完成的资源
         */
        ResourceLoader.prototype.setGroupProgress = function (groupName, r) {
            var reporter = this.reporterDic[groupName];
            this.numLoadedDic[groupName]++;
            var current = this.numLoadedDic[groupName];
            var total = this.groupTotalDic[groupName];
            if (reporter && reporter.onProgress) {
                reporter.onProgress(current, total, r);
            }
            return current == total;
        };
        /**
         * 加载组的最后一项，同时派发事件
         * @param groupName 组名
         * @param lastError 最后一项是否成功，此项为错误信息
         */
        ResourceLoader.prototype.loadGroupEnd = function (groupName, lastError) {
            delete this.groupTotalDic[groupName];
            delete this.numLoadedDic[groupName];
            delete this.reporterDic[groupName];
            var dispatcher = this.deleteDispatcher(groupName);
            if (!lastError) {
                var groupError = this.groupErrorDic[groupName];
                delete this.groupErrorDic[groupName];
                if (groupError) {
                    var itemList = this.loadItemErrorDic[groupName];
                    delete this.loadItemErrorDic[groupName];
                    var error = this.errorDic[groupName];
                    delete this.errorDic[groupName];
                    dispatcher.dispatchEventWith("error", false, { itemList: itemList, error: error });
                }
                else {
                    dispatcher.dispatchEventWith("complete");
                }
            }
            else {
                delete this.groupErrorDic[groupName];
                var itemList = this.loadItemErrorDic[groupName];
                delete this.loadItemErrorDic[groupName];
                dispatcher.dispatchEventWith("error", false, { itemList: itemList, error: lastError });
            }
        };
        /**
         * 删除事件派发器，Promise的缓存，返回事件派发器
         * @param groupName 组名或是root+name
         */
        ResourceLoader.prototype.deleteDispatcher = function (groupName) {
            delete this.promiseHash[groupName];
            var dispatcher = this.dispatcherDic[groupName];
            delete this.dispatcherDic[groupName];
            return dispatcher;
        };
        /**
         * 加载资源
         * @param r 资源信息
         * @param p 加载处理器
         */
        ResourceLoader.prototype.loadResource = function (r, p) {
            if (!p) {
                if (RES.FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
                    var s = RES.host.state[r.root + r.name];
                    if (s == 2) {
                        return Promise.resolve(RES.host.get(r));
                    }
                    if (s == 1) {
                        return r.promise;
                    }
                }
                p = RES.processor.isSupport(r);
            }
            if (!p) {
                throw new RES.ResourceManagerError(2001, r.name, r.type);
            }
            RES.host.state[r.root + r.name] = 1;
            var promise = p.onLoadStart(RES.host, r);
            r.promise = promise;
            return promise;
        };
        /**
         * 释放资源
         * @param r 资源信息
         */
        ResourceLoader.prototype.unloadResource = function (r) {
            var data = RES.host.get(r);
            if (!data) {
                console.warn("尝试释放不存在的资源:", r.name);
                return false;
            }
            var p = RES.processor.isSupport(r);
            if (p) {
                p.onRemoveStart(RES.host, r);
                RES.host.remove(r);
                if (r.extra == 1) {
                    RES.config.removeResourceData(r);
                }
                return true;
            }
            else {
                return true;
            }
        };
        return ResourceLoader;
    }());
    RES.ResourceLoader = ResourceLoader;
    __reflect(ResourceLoader.prototype, "RES.ResourceLoader");
})(RES || (RES = {}));
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
var RES;
(function (RES) {
})(RES || (RES = {}));
var RES;
(function (RES) {
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 对文件路径的一些操作，针对的是 C:/A/B/C/D/example.ts这种格式
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    var path;
    (function (path_1) {
        /**
         * Format the file path,"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename Incoming file path
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 格式化文件路径，"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename 传入的文件路径
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function normalize(filename) {
            var arr = filename.split("/");
            return arr.filter(function (value, index) { return !!value || index == arr.length - 1; }).join("/");
        }
        path_1.normalize = normalize;
        /**
         * Get the file name according to the file path, "C:/A/B/example.ts"=>"example.ts"
         * @param filename Incoming file path
         * @return File name
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 根据文件路径得到文件名字，"C:/A/B/example.ts"=>"example.ts"
         * @param filename 传入的文件路径
         * @return 文件的名字
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function basename(filename) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }
        path_1.basename = basename;
        /**
         * The path to the folder where the file is located,"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename Incoming file path
         * @return The address of the folder where the file is located
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文件所在文件夹路径，"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename 传入的文件路径
         * @return 文件所在文件夹的地址
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function dirname(path) {
            return path.substr(0, path.lastIndexOf("/"));
        }
        path_1.dirname = dirname;
    })(path = RES.path || (RES.path = {}));
})(RES || (RES = {}));
var RES;
(function (RES) {
    var __tempCache = {};
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 打印图片所占内存
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function profile() {
        RES.config.config.fileSystem.profile();
        console.log(__tempCache);
        //todo 
        var totalImageSize = 0;
        for (var key in __tempCache) {
            var img = __tempCache[key];
            if (img instanceof egret.Texture) {
                totalImageSize += img.$bitmapWidth * img.$bitmapHeight * 4;
            }
        }
        console.log("gpu size : " + (totalImageSize / 1024).toFixed(3) + "kb");
    }
    RES.profile = profile;
    /**
    * @internal
    */
    RES.host = {
        state: {},
        get resourceConfig() {
            return RES.config;
        },
        load: function (r, processorName) {
            var processor = typeof processorName == 'string' ? RES.processor._map[processorName] : processorName;
            return RES.queue["loadResource"](r, processor);
        },
        unload: function (r) { return RES.queue.unloadResource(r); },
        save: function (resource, data) {
            RES.host.state[resource.root + resource.name] = 2;
            delete resource.promise;
            __tempCache[resource.root + resource.name] = data;
        },
        get: function (resource) {
            return __tempCache[resource.root + resource.name];
        },
        remove: function (resource) {
            delete RES.host.state[resource.root + resource.name];
            delete __tempCache[resource.root + resource.name];
        }
    };
    /**
     * @internal
     */
    RES.config = new RES.ResourceConfig();
    /**
     * @internal
     */
    RES.queue = new RES.ResourceLoader();
    /**
    * @private
    */
    var ResourceManagerError = (function (_super) {
        __extends(ResourceManagerError, _super);
        function ResourceManagerError(code, replacer, replacer2) {
            var _this = _super.call(this) || this;
            /**
             * why instanceof e  != ResourceManagerError ???
             * see link : https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            _this.__resource_manager_error__ = true;
            _this.name = code.toString();
            _this.message = ResourceManagerError.errorMessage[code].replace("{0}", replacer).replace("{1}", replacer2);
            return _this;
        }
        ResourceManagerError.errorMessage = {
            1001: '文件加载失败:{0}',
            1002: "ResourceManager 初始化失败：配置文件加载失败",
            2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2003: "{0}解析失败,错误原因:{1}",
            2004: "无法找到文件类型:{0}",
            2005: "RES加载了不存在或空的资源组:\"{0}\"",
            2006: "资源配置文件中无法找到特定的资源:{0}"
        };
        return ResourceManagerError;
    }(Error));
    RES.ResourceManagerError = ResourceManagerError;
    __reflect(ResourceManagerError.prototype, "RES.ResourceManagerError");
})(RES || (RES = {}));
var RES;
(function (RES) {
    /**
    * @internal
    */
    var NewFileSystem = (function () {
        function NewFileSystem(data) {
            this.data = data;
        }
        NewFileSystem.prototype.profile = function () {
            console.log(this.data);
        };
        NewFileSystem.prototype.addFile = function (filename, type) {
            if (!type)
                type = "";
            filename = RES.path.normalize(filename);
            var basefilename = RES.path.basename(filename);
            var folder = RES.path.dirname(filename);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            var d = this.resolve(folder);
            d[basefilename] = { url: filename, type: type };
        };
        NewFileSystem.prototype.getFile = function (filename) {
            var result = this.resolve(filename);
            if (result) {
                result.name = filename;
            }
            return result;
        };
        NewFileSystem.prototype.resolve = function (dirpath) {
            if (dirpath == "") {
                return this.data;
            }
            dirpath = RES.path.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var f = list_2[_i];
                if (current) {
                    current = current[f];
                }
                else {
                    return current;
                }
            }
            return current;
        };
        NewFileSystem.prototype.mkdir = function (dirpath) {
            dirpath = RES.path.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var f = list_3[_i];
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f];
            }
        };
        NewFileSystem.prototype.exists = function (dirpath) {
            if (dirpath == "")
                return true;
            dirpath = RES.path.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                var f = list_4[_i];
                if (!current[f]) {
                    return false;
                }
                current = current[f];
            }
            return true;
        };
        return NewFileSystem;
    }());
    RES.NewFileSystem = NewFileSystem;
    __reflect(NewFileSystem.prototype, "RES.NewFileSystem");
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
    * Convert the file name of the resource to the Key value used in the project.
    * @param url Resource Name.
    * @returns The key value used in the project
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 将资源的文件名称转换为项目中所使用的Key值。
     * 在加载合并图集的时候使用，例如图集加载A_json，需要加载对应A_png，这里就是转换的机制
     * 一般项目中无需更改，只有没有使用默认的key和文件对应的需要修改
     * @param url 资源名称。
     * @returns 项目中所用的key值
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function nameSelector(url) {
        return RES.path.basename(url).split(".").join("_");
    }
    RES.nameSelector = nameSelector;
    /**
    * Get the read type of the file.
    * When using getResByUrl does not specify the type of the read file, it will find the corresponding type according to this method.
    * File types not found are loaded by default in binary format
    * @param path file path.
    * @returns Processor type used to read the file
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 获取文件的读取类型
     * 在使用getResByUrl没有指定读取文件的类型，会根据这个方法寻找对应的类型
     * 没有查找到的文件类型以二进制格式默认加载
     * @param path 文件路径
     * @returns 读取文件所用的Processor类型
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function typeSelector(path) {
        var ext = path.substr(path.lastIndexOf(".") + 1);
        var type;
        switch (ext) {
            case RES.ResourceItem.TYPE_XML:
            case RES.ResourceItem.TYPE_JSON:
            case RES.ResourceItem.TYPE_SHEET:
                type = ext;
                break;
            case "png":
            case "jpg":
            case "gif":
            case "jpeg":
            case "bmp":
                type = RES.ResourceItem.TYPE_IMAGE;
                break;
            case "fnt":
                type = RES.ResourceItem.TYPE_FONT;
                break;
            case "txt":
                type = RES.ResourceItem.TYPE_TEXT;
                break;
            case "mp3":
            case "ogg":
            case "mpeg":
            case "wav":
            case "m4a":
            case "mp4":
            case "aiff":
            case "wma":
            case "mid":
                type = RES.ResourceItem.TYPE_SOUND;
                break;
            case "mergeJson":
            case "zip":
            case "pvr":
                type = ext;
                break;
            case "ttf":
                type = RES.ResourceItem.TYPE_TTF;
            default:
                type = RES.ResourceItem.TYPE_BIN;
                break;
        }
        return type;
    }
    RES.typeSelector = typeSelector;
    /**
     * Conduct mapping injection with class definition as the value, Deprecated.
     * @deprecated
     * @see RES.processor.map
     * @language en_US
     */
    /**
     * 以类定义为值进行映射注入，已废弃。
     * @deprecated
     * @see RES.processor.map
     * @language zh_CN
     */
    function registerAnalyzer(type, analyzerClass) {
        throw new RES.ResourceManagerError(2002);
    }
    RES.registerAnalyzer = registerAnalyzer;
    /**
    * Set whether it is compatible mode
    * When the value is true, the assetsManager will output the design of Res. When it is false, all the loaded resources will be returned as promises.
    * The default is false, run in strict assetsManager mode
    * @version Egret 5.2.9
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 设置是否为兼容模式
     * 当值为true时，assetsManager会以Res的设计输出，当为false时候，所有的加载资源都会以promise的方式返回
     * 默认是false，以严格assetsManager方式运行
     * @version Egret 5.2.9
     * @platform Web,Native
     * @language zh_CN
     */
    function setIsCompatible(value) {
        RES.isCompatible = value;
    }
    RES.setIsCompatible = setIsCompatible;
    /**
     * @internal
     */
    RES.isCompatible = false;
    /**
     * Load configuration file and parse.
     * @param url The url address of the resource config
     * @param resourceRoot The root address of the resource config
     * @returns Promise
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载配置文件并解析。
     * @param url 资源配置的url地址
     * @param resourceRoot 资源配置的根地址
     * @returns Promise
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function loadConfig(url, resourceRoot) {
        if (resourceRoot.indexOf('://') >= 0) {
            var temp = resourceRoot.split('://');
            resourceRoot = temp[0] + '://' + RES.path.normalize(temp[1] + '/');
            url = url.replace(resourceRoot, '');
        }
        else {
            resourceRoot = RES.path.normalize(resourceRoot + "/");
            url = url.replace(resourceRoot, '');
        }
        RES.setConfigURL(url, resourceRoot);
        if (!instance)
            instance = new Resource();
        return compatiblePromise(instance.loadConfig());
    }
    RES.loadConfig = loadConfig;
    function compatiblePromise(promise) {
        if (RES.isCompatible) {
            promise.catch(function (e) { }).then();
            return undefined;
        }
        else {
            return promise;
        }
    }
    /**
     * Load a set of resources according to the group name.
     * @param name Group name to load the resource group.
     * @param priority Load priority can be negative, the default value is 0.
     * <br>A low priority group must wait for the high priority group to complete the end of the load to start, and the same priority group will be loaded at the same time.
     * @param reporter Resource group loading progress prompt
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名加载一组资源。
     * @param name 要加载资源组的组名。
     * @param priority 加载优先级,可以为负数,默认值为 0。
     * <br>低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @param reporter 资源组的加载进度提示
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function loadGroup(name, priority, reporter) {
        if (priority === void 0) { priority = 0; }
        return compatiblePromise(instance.loadGroup(name, priority, reporter));
    }
    RES.loadGroup = loadGroup;
    /**
     * Check whether a resource group has been loaded.
     * @param name Group name。
     * @returns Is loading or not.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查某个资源组是否已经加载完成。
     * @param name 组名。
     * @returns 是否正在加载。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function isGroupLoaded(name) {
        return instance.isGroupLoaded(name);
    }
    RES.isGroupLoaded = isGroupLoaded;
    /**
     * A list of groups of loading is obtained according to the group name.
     * @param name Group name.
     * @returns The resource item array of group.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名获取组加载项列表。
     * @param name 组名。
     * @returns 加载项列表。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getGroupByName(name) {
        return instance.getGroupByName(name).map(function (r) { return RES.ResourceItem.convertToResItem(r); });
    }
    RES.getGroupByName = getGroupByName;
    /**
     * Create a custom load resource group, note that this method is valid only after the resource configuration file is loaded.
     * <br>You can monitor the ResourceEvent.CONFIG_COMPLETE event to verify that the configuration is complete.
     * @param name Group name to create the load resource group.
     * @param keys To be included in the list of key keys, the corresponding configuration file in the name or sbuKeys property one or a resource group name.
     * @param override Is the default false for the same name resource group already exists.
     * @returns Create success or fail.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
     * <br>可以监听 ResourceEvent.CONFIG_COMPLETE 事件来确认配置加载完成。
     * @param name 要创建的加载资源组的组名。
     * @param keys 要包含的键名列表，key 对应配置文件里的 name 属性或 sbuKeys 属性的一项或一个资源组名。
     * @param override 是否覆盖已经存在的同名资源组,默认 false。
     * @returns 是否创建成功。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function createGroup(name, keys, override) {
        if (override === void 0) { override = false; }
        return instance.createGroup(name, keys, override);
    }
    RES.createGroup = createGroup;
    /**
     * Check whether the configuration file contains the specified resources.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @returns Whether you have the specified resource
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查配置文件里是否含有指定的资源。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @returns 是否拥有指定资源
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function hasRes(key) {
        return instance.hasRes(key);
    }
    RES.hasRes = hasRes;
    /**
     * The synchronization method for obtaining the cache has been loaded with the success of the resource.
     * <br>The type of resource and the corresponding return value types are as follows:
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript primary object
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html Object，or egret.BitmapData interface。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. If the incoming parameter is the name of the entire SpriteSheet is returned is {image1: Texture, "image2": Texture}.
     * <br>  2. If the incoming is "sheet.image1", the return is a single resource.
     * <br>  3. If the incoming is the name of the "image1" single resource, the return is a single resource.
     * But if there are two SpriteSheet in a single picture of the same name, the return of the image after the load.
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html Object
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key A subKeys attribute or name property in a configuration file.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 同步方式获取缓存的已经加载成功的资源。
     * <br>资源类型和对应的返回值类型关系如下：
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript 原生对象
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html 对象，或者 egret.BitmapData 接口。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. 如果传入的参数是整个 SpriteSheet 的名称返回的是 {"image1":Texture,"image2":Texture} 这样的格式。
     * <br>  2. 如果传入的是 "sheet.image1"，返回的是单个资源。
     * <br>  3. 如果传入的是 "image1" 单个资源的名称，返回的是单个资源。但是如果有两张 SpriteSheet 中有单个图片资源名称相同，返回的是后加载的那个图片资源。
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html 对象
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key 对应配置文件里的 name 属性或 subKeys 属性的一项。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getRes(key) {
        return instance.getRes(key);
    }
    RES.getRes = getRes;
    /**
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @param compFunc Call back function. Example：compFunc(data,key):void.
     * @param thisObject This pointer of call back function.
     * @see #setMaxRetryTimes
     * @example The following code demonstrates how to load a resource via getResAsync
     * <pre>
     *       RES.getResAsync("resource/example.json");//Only pass the key value to get the resource
     *
     *       RES.getResAsync("resource/example.json", (data) => {
     *          console.log(data)
     *       }, this) //Pass in the key value, compFunc and thisObject get the resource, the latter two must appear at the same time
     * </pre>
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @param compFunc 回调函数。示例：compFunc(data,key):void。
     * @param thisObject 回调函数的 this 引用。
     * @see #setMaxRetryTimes
     * @example 以下代码演示了如何通过getResAsync加载资源
     * <pre>
     *       RES.getResAsync("resource/example.json");//只传入key值获取资源
     *
     *       RES.getResAsync("resource/example.json", (data) => {
     *          console.log(data)
     *       }, this) //传入key值，compFunc和thisObject获取资源，后两个必须同时出现
     * </pre>
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getResAsync(key, compFunc, thisObject) {
        return compatiblePromise(instance.getResAsync.apply(instance, arguments));
    }
    RES.getResAsync = getResAsync;
    /**
     * Access to external resources through the full URL.
     * @param url The external path to load the file.
     * @param compFunc Call back function. Example：compFunc(data,url):void。
     * @param thisObject This pointer of call back function.
     * @param type File type (optional). Use the static constants defined in the ResourceItem class. If you do not set the file name extension.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 通过完整URL方式获取外部资源。
     * @param url 要加载文件的外部路径。
     * @param compFunc 回调函数。示例：compFunc(data,url):void。
     * @param thisObject 回调函数的 this 引用。
     * @param type 文件类型(可选)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getResByUrl(url, compFunc, thisObject, type) {
        if (type === void 0) { type = ""; }
        if (!instance) {
            var message = egret.sys.tr(3200);
            egret.warn(message);
            return Promise.reject(message);
        }
        return compatiblePromise(instance.getResByUrl(url, compFunc, thisObject, type));
    }
    RES.getResByUrl = getResByUrl;
    /**
     * Destroy a single resource file or a set of resources to the cache data, to return whether to delete success.
     * @param name Name attribute or resource group name of the load item in the configuration file.
     * @param force Destruction of a resource group when the other resources groups have the same resource situation whether the resources will be deleted, the default value true.
     * @returns Are successful destruction.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @param name 配置文件中加载项的name属性或资源组名。
     * @param force 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值 true。
     * @see #setMaxRetryTimes
     * @returns 是否销毁成功。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function destroyRes(name, force) {
        return instance.destroyRes(name, force);
    }
    RES.destroyRes = destroyRes;
    /**
     * Sets the maximum number of concurrent load threads, the default value is 4.
     * @param thread The number of concurrent loads to be set.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置最大并发加载线程数量，默认值是 4。
     * @param thread 要设置的并发加载数。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function setMaxLoadingThread(thread) {
        if (!instance)
            instance = new Resource();
        instance.setMaxLoadingThread(thread);
    }
    RES.setMaxLoadingThread = setMaxLoadingThread;
    /**
     * Sets the number of retry times when the resource failed to load, and the default value is 3.
     * @param retry To set the retry count.
     * @includeExample extension/resource/Resource.ts
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function setMaxRetryTimes(retry) {
        instance.setMaxRetryTimes(retry);
    }
    RES.setMaxRetryTimes = setMaxRetryTimes;
    /**
     * Add event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listener functions for handling events. This function must accept the Event object as its only parameter, and can't return any results,
     * As shown in the following example: function (evt:Event):void can have any name.
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Determine the listener is running on the capture or running on the target and the bubbling phase. Set useCapture to true,
     * then the listener in the capture phase processing events, but not in the target or the bubbling phase processing events.
     * If useCapture is false, then the listener only in the target or the bubbling phase processing events.
     * To listen for events in all three stages, please call addEventListener two times: once the useCapture is set to true, once the useCapture is set to false.
     * @param priority Event listener priority. Priority is specified by a 32 - bit integer with a symbol. The higher the number, the higher the priority.
     * All listeners with a priority for n will be processed before the -1 n listener.
     * If two or more listeners share the same priority, they are processed in accordance with the order of their added. The default priority is 0.
     * @see RES.ResourceEvent
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 添加事件侦听器,参考 ResourceEvent 定义的常量。
     * @param type 事件的类型。
     * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
     * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
     * @param thisObject 侦听函数绑定的 this 对象。
     * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
     * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
     * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
     * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     * @see RES.ResourceEvent
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function addEventListener(type, listener, thisObject, useCapture, priority) {
        if (useCapture === void 0) { useCapture = false; }
        if (priority === void 0) { priority = 0; }
        if (!instance)
            instance = new Resource();
        instance.addEventListener(type, listener, thisObject, useCapture, priority);
    }
    RES.addEventListener = addEventListener;
    /**
     * Remove event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listening function。
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Is used to capture, and this property is only valid in the display list.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @param type 事件名。
     * @param listener 侦听函数。
     * @param thisObject 侦听函数绑定的this对象。
     * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function removeEventListener(type, listener, thisObject, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        instance.removeEventListener(type, listener, thisObject, useCapture);
    }
    RES.removeEventListener = removeEventListener;
    /**
     * Adding a custom resource configuration.
     * @param data To add configuration.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 自定义添加一项资源配置。
     * @param data 要添加的配置。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function $addResourceData(data) {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }
    RES.$addResourceData = $addResourceData;
    /**
    * Returns the VersionController
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 获得版本控制器.
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getVersionController() {
        if (!instance)
            instance = new Resource();
        return instance.vcs;
    }
    RES.getVersionController = getVersionController;
    /**
     * Register the VersionController
     * @param vcs The VersionController to register.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 注册版本控制器,通过RES模块加载资源时会从版本控制器获取真实url
     * @param vcs 注入的版本控制器。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function registerVersionController(vcs) {
        if (!instance)
            instance = new Resource();
        instance.registerVersionController(vcs);
    }
    RES.registerVersionController = registerVersionController;
    /**
     * Convert the address of the loaded resource (via version controller conversion)
     * @param url path to the original resource
     * @returns converted address
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 转换加载资源的地址（经过版本控制器的转换）
     * @param url 原始资源的路径
     * @returns 转换后的地址
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getVirtualUrl(url) {
        if (instance.vcs) {
            return instance.vcs.getVirtualUrl(url);
        }
        else {
            return url;
        }
    }
    RES.getVirtualUrl = getVirtualUrl;
    /**
     * @private
     */
    var Resource = (function (_super) {
        __extends(Resource, _super);
        function Resource() {
            var _this = _super.call(this) || this;
            _this.isVcsInit = false;
            /**
             * @private
             * 版本控制器加载后的加载配置
             */
            _this.normalLoadConfig = function () {
                return RES.config.init().then(function (data) {
                    RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.CONFIG_COMPLETE);
                }, function (error) {
                    RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.CONFIG_LOAD_ERROR);
                    return Promise.reject(error);
                });
            };
            if (RES.VersionController) {
                _this.vcs = new RES.VersionController();
            }
            return _this;
        }
        Resource.prototype.registerVersionController = function (vcs) {
            this.vcs = vcs;
            this.isVcsInit = false;
        };
        /**
         * 开始加载配置
         * @method RES.loadConfig
         */
        Resource.prototype.loadConfig = function () {
            var _this = this;
            if (!this.isVcsInit && this.vcs) {
                this.isVcsInit = true;
                return this.vcs.init().then(function () {
                    return _this.normalLoadConfig();
                });
            }
            else {
                return this.normalLoadConfig();
            }
        };
        /**
         * 检查某个资源组是否已经加载完成
         * @method RES.isGroupLoaded
         * @param name {string}
         */
        Resource.prototype.isGroupLoaded = function (name) {
            var resources = RES.config.getGroupByName(name);
            return resources.every(function (r) { return RES.host.get(r) != null; });
        };
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         */
        Resource.prototype.getGroupByName = function (name) {
            return RES.config.getGroupByName(name);
        };
        /**
         * 根据组名加载一组资源
         * @method RES.loadGroup
         * @param name {string}
         * @param priority {number}
         */
        Resource.prototype.loadGroup = function (name, priority, reporter) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            var reporterDelegate = {
                onProgress: function (current, total, resItem) {
                    if (reporter && reporter.onProgress) {
                        reporter.onProgress(current, total, resItem);
                    }
                    RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_PROGRESS, name, resItem, current, total);
                }
            };
            return this._loadGroup(name, priority, reporterDelegate).then(function (data) {
                if (RES.config.config.loadGroup.indexOf(name) == -1) {
                    RES.config.config.loadGroup.push(name);
                }
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_COMPLETE, name);
            }, function (error) {
                if (RES.config.config.loadGroup.indexOf(name) == -1) {
                    RES.config.config.loadGroup.push(name);
                }
                if (error.itemList) {
                    var itemList = error.itemList;
                    var length_1 = itemList.length;
                    for (var i = 0; i < length_1; i++) {
                        var item = itemList[i];
                        delete item.promise;
                        RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.ITEM_LOAD_ERROR, name, item);
                    }
                }
                if (RES.isCompatible) {
                    console.warn(error.error.message);
                }
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_LOAD_ERROR, name);
                return Promise.reject(error.error);
            });
        };
        Resource.prototype._loadGroup = function (name, priority, reporter) {
            if (priority === void 0) { priority = 0; }
            var resources = RES.config.getGroupByName(name);
            if (resources.length == 0) {
                return new Promise(function (resolve, reject) {
                    reject({ error: new RES.ResourceManagerError(2005, name) });
                });
            }
            return RES.queue.pushResGroup(resources, name, priority, reporter);
        };
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        Resource.prototype.createGroup = function (name, keys, override) {
            if (override === void 0) { override = false; }
            return RES.config.createGroup(name, keys, override);
        };
        /**
         * 检查配置文件里是否含有指定的资源
         * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或subKeys属性的一项。
         * @returns {boolean}
         */
        Resource.prototype.hasRes = function (key) {
            return RES.config.getResourceWithSubkey(key) != null;
        };
        /**
         * 通过key同步获取资源
         * @method RES.getRes
         * @param key {string}
         * @returns {any}
         */
        Resource.prototype.getRes = function (resKey) {
            var result = RES.config.getResourceWithSubkey(resKey);
            if (result) {
                var r = result.r;
                var key = result.key;
                var subkey = result.subkey;
                var p = RES.processor.isSupport(r);
                if (p && p.getData && subkey) {
                    return p.getData(RES.host, r, key, subkey);
                }
                else {
                    return RES.host.get(r);
                }
            }
            else {
                return null;
            }
        };
        Resource.prototype.getResAsync = function (key, compFunc, thisObject) {
            var _this = this;
            var paramKey = key;
            var tempResult = RES.config.getResourceWithSubkey(key);
            if (tempResult == null) {
                if (compFunc) {
                    compFunc.call(thisObject, null, paramKey);
                }
                return Promise.reject(new RES.ResourceManagerError(2006, key));
            }
            var data = this.getRes(key);
            if (data) {
                if (compFunc) {
                    egret.callLater(function () {
                        compFunc.call(thisObject, data, paramKey);
                    }, this);
                }
                return Promise.resolve(data);
            }
            var r = tempResult.r, subkey = tempResult.subkey;
            return RES.queue.pushResItem(r).then(function (value) {
                RES.host.save(r, value);
                var p = RES.processor.isSupport(r);
                if (p && p.getData && subkey) {
                    value = p.getData(RES.host, r, key, subkey);
                }
                if (compFunc) {
                    compFunc.call(thisObject, value, paramKey);
                }
                return value;
            }, function (error) {
                RES.host.remove(r);
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.ITEM_LOAD_ERROR, "", r);
                if (compFunc) {
                    compFunc.call(thisObject, null, paramKey);
                    return Promise.reject(null);
                }
                return Promise.reject(error);
            });
        };
        /**
         * 通过url获取资源
         * @method RES.getResByUrl
         * @param url {string}
         * @param compFunc {Function}
         * @param thisObject {any}
         * @param type {string}
         */
        Resource.prototype.getResByUrl = function (url, compFunc, thisObject, type) {
            var _this = this;
            if (type === void 0) { type = ""; }
            var r = RES.config.getResource(url);
            if (!r) {
                if (!type) {
                    type = RES.config.__temp__get__type__via__url(url);
                }
                // manager.config.addResourceData({ name: url, url: url });
                r = { name: url, url: url, type: type, root: '', extra: 1 };
                RES.config.addResourceData(r);
                r = RES.config.getResource(url);
                if (!r) {
                    throw 'never';
                }
            }
            return RES.queue.pushResItem(r).then(function (value) {
                RES.host.save(r, value);
                if (compFunc && r) {
                    compFunc.call(thisObject, value, r.url);
                }
                return value;
            }, function (error) {
                RES.host.remove(r);
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.ITEM_LOAD_ERROR, "", r);
                if (compFunc) {
                    compFunc.call(thisObject, null, url);
                    return Promise.reject(null);
                }
                return Promise.reject(error);
            });
        };
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        Resource.prototype.destroyRes = function (name, force) {
            if (force === void 0) { force = true; }
            var group = RES.config.getGroupByName(name);
            if (group && group.length > 0) {
                var index = RES.config.config.loadGroup.indexOf(name);
                if (index == -1) {
                    return false;
                }
                if (force || (RES.config.config.loadGroup.length == 1 && RES.config.config.loadGroup[0] == name)) {
                    for (var _i = 0, group_2 = group; _i < group_2.length; _i++) {
                        var item = group_2[_i];
                        RES.queue.unloadResource(item);
                    }
                    RES.config.config.loadGroup.splice(index, 1);
                }
                else {
                    var removeItemHash = {};
                    for (var _a = 0, _b = RES.config.config.loadGroup; _a < _b.length; _a++) {
                        var groupName = _b[_a];
                        for (var key in RES.config.config.groups[groupName]) {
                            var tmpname = RES.config.config.groups[groupName][key];
                            if (removeItemHash[tmpname]) {
                                removeItemHash[tmpname]++;
                            }
                            else {
                                removeItemHash[tmpname] = 1;
                            }
                        }
                    }
                    for (var _c = 0, group_3 = group; _c < group_3.length; _c++) {
                        var item = group_3[_c];
                        if (removeItemHash[item.name] && removeItemHash[item.name] == 1) {
                            RES.queue.unloadResource(item);
                        }
                    }
                    RES.config.config.loadGroup.splice(index, 1);
                }
                return true;
            }
            else {
                var item = RES.config.getResource(name);
                if (item) {
                    return RES.queue.unloadResource(item);
                }
                else {
                    console.warn("\u5728\u5185\u5B58" + name + "\u8D44\u6E90\u4E0D\u5B58\u5728");
                    return false;
                }
            }
        };
        /**
         * 设置最大并发加载线程数量，默认值是4.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        Resource.prototype.setMaxLoadingThread = function (thread) {
            if (thread < 1) {
                thread = 1;
            }
            RES.queue.thread = thread;
        };
        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        Resource.prototype.setMaxRetryTimes = function (retry) {
            retry = Math.max(retry, 0);
            RES.queue.maxRetryTimes = retry;
        };
        Resource.prototype.addResourceData = function (data) {
            data["root"] = '';
            RES.config.addResourceData(data);
        };
        __decorate([
            RES.checkNull
        ], Resource.prototype, "hasRes", null);
        __decorate([
            RES.checkNull
        ], Resource.prototype, "getRes", null);
        __decorate([
            RES.checkNull
        ], Resource.prototype, "getResAsync", null);
        __decorate([
            RES.checkNull
        ], Resource.prototype, "getResByUrl", null);
        return Resource;
    }(egret.EventDispatcher));
    RES.Resource = Resource;
    __reflect(Resource.prototype, "RES.Resource");
    /**
     * Resource单例
     */
    var instance;
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * The events of resource loading.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源加载事件。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    var ResourceEvent = (function (_super) {
        __extends(ResourceEvent, _super);
        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 5.2
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 5.2
         * @platform Web,Native
         * @private
         * @language zh_CN
         */
        function ResourceEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            /**
             * File number that has been loaded.
             * @version Egret 5.2
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 已经加载的文件数。
             * @version Egret 5.2
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemsLoaded = 0;
            /**
             * Total file number to load.
             * @version Egret 5.2
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要加载的总文件数。
             * @version Egret 5.2
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemsTotal = 0;
            /**
             * Resource group name.
             * @version Egret 5.2
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 资源组名。
             * @version Egret 5.2
             * @platform Web,Native
             * @language zh_CN
             */
            _this.groupName = "";
            return _this;
        }
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method RES.ResourceEvent.dispatchResourceEvent
         * @param target {egret.IEventDispatcher}
         * @param type {string}
         * @param groupName {string}
         * @param resItem {egret.ResourceItem}
         * @param itemsLoaded {number}
         * @param itemsTotal {number}
         * @internal
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_CN
         */
        ResourceEvent.dispatchResourceEvent = function (target, type, groupName, resItem, itemsLoaded, itemsTotal) {
            if (groupName === void 0) { groupName = ""; }
            if (resItem === void 0) { resItem = undefined; }
            if (itemsLoaded === void 0) { itemsLoaded = 0; }
            if (itemsTotal === void 0) { itemsTotal = 0; }
            var event = egret.Event.create(ResourceEvent, type);
            event.groupName = groupName;
            if (resItem) {
                event.resItem = RES.ResourceItem.convertToResItem(resItem);
            }
            event.itemsLoaded = itemsLoaded;
            event.itemsTotal = itemsTotal;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * Failure event for a load item.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个加载项加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.ITEM_LOAD_ERROR = "itemLoadError";
        /**
         * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.CONFIG_COMPLETE = "configComplete";
        /**
         * Configuration file failed to load.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.CONFIG_LOAD_ERROR = "configLoadError";
        /**
         * Delay load group resource loading progress event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载进度事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.GROUP_PROGRESS = "groupProgress";
        /**
         * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.GROUP_COMPLETE = "groupComplete";
        /**
         * Delayed load group resource failed event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.GROUP_LOAD_ERROR = "groupLoadError";
        return ResourceEvent;
    }(egret.Event));
    RES.ResourceEvent = ResourceEvent;
    __reflect(ResourceEvent.prototype, "RES.ResourceEvent");
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * Resource term. One of the resources arrays in resource.json.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源项。对应 resource.json 中 resources 数组中的一项。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    var ResourceItem;
    (function (ResourceItem) {
        /**
         * XML file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * XML 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_XML = "xml";
        /**
         * Picture file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 图片文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_IMAGE = "image";
        /**
         * Binary file.
         * @version Egret 5.2
         * @platform Web
         * @language en_US
         */
        /**
         * 二进制文件。
         * @version Egret 5.2
         * @platform Web
         * @language zh_CN
         */
        ResourceItem.TYPE_BIN = "bin";
        /**
         * Text file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_TEXT = "text";
        /**
         * JSON file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * JSON 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_JSON = "json";
        /**
         * SpriteSheet file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * SpriteSheet 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_SHEET = "sheet";
        /**
         * BitmapTextSpriteSheet file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * BitmapTextSpriteSheet 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_FONT = "font";
        /**
         * Sound file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 声音文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_SOUND = "sound";
        /**
         * TTF file.
         * @version Egret 5.3
         * @platform Web,Native
         * @language en_US
         */
        /**
         * TTF字体文件。
         * @version Egret 5.3
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_TTF = "ttf";
        function convertToResItem(r) {
            var name = r.name;
            if (!RES.config.config) {
                name = r.url;
            }
            else {
                for (var aliasName in RES.config.config.alias) {
                    if (RES.config.config.alias[aliasName] == r.url) {
                        name = aliasName;
                    }
                }
            }
            var result = {
                name: name,
                url: r.url,
                type: r.type,
                data: r,
                root: r.root
            };
            return result;
        }
        ResourceItem.convertToResItem = convertToResItem;
    })(ResourceItem = RES.ResourceItem || (RES.ResourceItem = {}));
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * @private
     */
    var NativeVersionController = (function () {
        function NativeVersionController() {
        }
        NativeVersionController.prototype.init = function () {
            this.versionInfo = this.getLocalData("all.manifest");
            return Promise.resolve();
        };
        NativeVersionController.prototype.getVirtualUrl = function (url) {
            return url;
        };
        NativeVersionController.prototype.getLocalData = function (filePath) {
            if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
                //先取更新目录
                var content = egret_native.readUpdateFileSync(filePath);
                if (content != null) {
                    return JSON.parse(content);
                }
                //再取资源目录
                content = egret_native.readResourceFileSync(filePath);
                if (content != null) {
                    return JSON.parse(content);
                }
            }
            return null;
        };
        return NativeVersionController;
    }());
    RES.NativeVersionController = NativeVersionController;
    __reflect(NativeVersionController.prototype, "RES.NativeVersionController", ["RES.IVersionController"]);
    if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
        RES.VersionController = NativeVersionController;
    }
})(RES || (RES = {}));
var RES;
(function (RES) {
    var processor;
    (function (processor_1) {
        /**
         * @internal
         * @param resource 对应的资源接口，需要type属性
         */
        function isSupport(resource) {
            return processor_1._map[resource.type];
        }
        processor_1.isSupport = isSupport;
        /**
         * Register the processor that loads the resource
         * @param type Load resource type
         * @param processor Loaded processor, an instance that implements the Processor interface
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 注册加载资源的处理器
         * @param type 加载资源类型
         * @param processor 加载的处理器，一个实现Processor接口的实例
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function map(type, processor) {
            processor_1._map[type] = processor;
        }
        processor_1.map = map;
        /**
        * @internal
        */
        function promisify(loader, resource) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var onSuccess = function () {
                    var texture = loader['data'] ? loader['data'] : loader['response'];
                    resolve(texture);
                };
                var onError = function () {
                    var e = new RES.ResourceManagerError(1001, resource.url);
                    reject(e);
                };
                loader.addEventListener(egret.Event.COMPLETE, onSuccess, _this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, _this);
            });
        }
        /**
         * @private
         * @param url
         * @param file
         */
        function getRelativePath(url, file) {
            if (file.indexOf("://") != -1) {
                return file;
            }
            url = url.split("\\").join("/");
            var params = url.match(/#.*|\?.*/);
            var paramUrl = "";
            if (params) {
                paramUrl = params[0];
            }
            var index = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url + paramUrl;
        }
        processor_1.getRelativePath = getRelativePath;
        processor_1.ImageProcessor = {
            onLoadStart: function (host, resource) {
                var loader = new egret.ImageLoader();
                loader.load(RES.getVirtualUrl(resource.root + resource.url));
                return promisify(loader, resource)
                    .then(function (bitmapData) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    var r = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        var list = r.scale9grid.split(",");
                        texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                    }
                    return texture;
                });
            },
            onRemoveStart: function (host, resource) {
                var texture = host.get(resource);
                texture.dispose();
            }
        };
        processor_1.KTXTextureProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, 'bin').then(function (data) {
                    if (!data) {
                        console.error('ktx:' + resource.root + resource.url + ' is null');
                        return null;
                    }
                    var ktx = new egret.KTXContainer(data, 1);
                    if (ktx.isInvalid) {
                        console.error('ktx:' + resource.root + resource.url + ' is invalid');
                        return null;
                    }
                    //
                    var bitmapData = new egret.BitmapData(data);
                    bitmapData.debugCompressedTextureURL = resource.root + resource.url;
                    bitmapData.format = 'ktx';
                    ktx.uploadLevels(bitmapData, false);
                    //
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    var r = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        var list = r.scale9grid.split(",");
                        texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                    }
                    //
                    host.save(resource, texture);
                    return texture;
                }, function (e) {
                    host.remove(resource);
                    throw e;
                });
            },
            onRemoveStart: function (host, resource) {
                var texture = host.get(resource);
                if (texture) {
                    texture.dispose();
                }
            }
        };
        /**
        *
        */
        function makeEtc1SeperatedAlphaResourceInfo(resource) {
            return { name: resource.name + '_alpha', url: resource['etc1_alpha_url'], type: 'ktx', root: resource.root };
        }
        processor_1.makeEtc1SeperatedAlphaResourceInfo = makeEtc1SeperatedAlphaResourceInfo;
        /**
        *
        */
        processor_1.ETC1KTXProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, "ktx").then(function (colorTex) {
                    if (!colorTex) {
                        return null;
                    }
                    if (resource['etc1_alpha_url']) {
                        var r_1 = makeEtc1SeperatedAlphaResourceInfo(resource);
                        return host.load(r_1, "ktx")
                            .then(function (alphaMaskTex) {
                            if (colorTex && colorTex.$bitmapData && alphaMaskTex.$bitmapData) {
                                colorTex.$bitmapData.etcAlphaMask = alphaMaskTex.$bitmapData;
                                host.save(r_1, alphaMaskTex);
                            }
                            else {
                                host.remove(r_1);
                            }
                            return colorTex;
                        }, function (e) {
                            host.remove(r_1);
                            throw e;
                        });
                    }
                    return colorTex;
                }, function (e) {
                    host.remove(resource);
                    throw e;
                });
            },
            onRemoveStart: function (host, resource) {
                var colorTex = host.get(resource);
                if (colorTex) {
                    colorTex.dispose();
                }
                if (resource['etc1_alpha_url']) {
                    var r = makeEtc1SeperatedAlphaResourceInfo(resource);
                    var alphaMaskTex = host.get(r);
                    if (alphaMaskTex) {
                        alphaMaskTex.dispose();
                    }
                    host.unload(r); //这里其实还会再删除一次，不过无所谓了。alphaMaskTex已经显示删除了
                }
            }
        };
        processor_1.BinaryProcessor = {
            onLoadStart: function (host, resource) {
                var request = new egret.HttpRequest();
                request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
                request.open(RES.getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify(request, resource);
            },
            onRemoveStart: function (host, resource) {
            }
        };
        processor_1.TextProcessor = {
            onLoadStart: function (host, resource) {
                var request = new egret.HttpRequest();
                request.responseType = egret.HttpResponseType.TEXT;
                request.open(RES.getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify(request, resource);
            },
            onRemoveStart: function (host, resource) {
                return true;
            }
        };
        processor_1.JsonProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, 'text').then(function (text) {
                    var data = JSON.parse(text);
                    return data;
                });
            },
            onRemoveStart: function (host, request) {
            }
        };
        /**
        * @internal
        */
        processor_1.XMLProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, 'text').then(function (text) {
                    var data = egret.XML.parse(text);
                    return data;
                });
            },
            onRemoveStart: function (host, resource) {
                return true;
            }
        };
        /**
        * @internal
        */
        processor_1.CommonJSProcessor = {
            onLoadStart: function (host, resource) {
                // let text = await host.load(resource, 'text');
                return host.load(resource, 'text').then(function (text) {
                    var f = new Function('require', 'exports', text);
                    var require = function () { };
                    var exports = {};
                    try {
                        f(require, exports);
                    }
                    catch (e) {
                        throw new RES.ResourceManagerError(2003, resource.name, e.message);
                    }
                    return exports;
                });
            },
            onRemoveStart: function (host, resource) {
            }
        };
        /**
        * @internal
        */
        processor_1.SheetProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, "json").then(function (data) {
                    var r = host.resourceConfig.getResource(RES.nameSelector(data.file));
                    if (!r) {
                        var imageName = getRelativePath(resource.url, data.file);
                        r = { name: RES.nameSelector(data.file), url: imageName, type: 'image', root: resource.root };
                        host.resourceConfig.addResourceData(r);
                    }
                    return host.load(r)
                        .then(function (bitmapData) {
                        if (!bitmapData) {
                            return null;
                        }
                        var frames = data.frames;
                        var spriteSheet = new egret.SpriteSheet(bitmapData);
                        spriteSheet["$resourceInfo"] = r;
                        for (var subkey in frames) {
                            var config = frames[subkey];
                            var texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                            if (config["scale9grid"]) {
                                var str = config["scale9grid"];
                                var list = str.split(",");
                                texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                            }
                        }
                        host.save(r, bitmapData);
                        return spriteSheet;
                    }, function (e) {
                        host.remove(r);
                        throw e;
                    });
                });
            },
            getData: function (host, resource, key, subkey) {
                var data = host.get(resource);
                if (data) {
                    return data.getTexture(subkey);
                }
                else {
                    return null;
                }
            },
            onRemoveStart: function (host, resource) {
                var sheet = host.get(resource);
                var r = sheet["$resourceInfo"];
                sheet.dispose();
                host.unload(r);
            }
        };
        var fontGetTexturePath = function (url, fntText) {
            var file = "";
            var lines = fntText.split("\n");
            var pngLine = lines[2];
            var index = pngLine.indexOf("file=\"");
            if (index != -1) {
                pngLine = pngLine.substring(index + 6);
                index = pngLine.indexOf("\"");
                file = pngLine.substring(0, index);
            }
            url = url.split("\\").join("/");
            var index = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url;
        };
        /**
        * @internal
        */
        processor_1.FontProcessor = {
            onLoadStart: function (host, resource) {
                // let data: string = await host.load(resource, 'text');
                return host.load(resource, 'text').then(function (data) {
                    var config;
                    try {
                        config = JSON.parse(data);
                    }
                    catch (e) {
                        config = data;
                    }
                    var imageName;
                    if (typeof config === 'string') {
                        imageName = fontGetTexturePath(resource.url, config);
                    }
                    else {
                        imageName = getRelativePath(resource.url, config.file);
                    }
                    var r = host.resourceConfig.getResource(RES.nameSelector(imageName));
                    if (!r) {
                        r = { name: RES.nameSelector(imageName), url: imageName, type: 'image', root: resource.root };
                        host.resourceConfig.addResourceData(r);
                    }
                    // var texture: egret.Texture = await host.load(r);
                    return host.load(r).then(function (texture) {
                        var font = new egret.BitmapFont(texture, config);
                        font["$resourceInfo"] = r;
                        // todo refactor
                        host.save(r, texture);
                        return font;
                    }, function (e) {
                        host.remove(r);
                        throw e;
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                var font = host.get(resource);
                var r = font["$resourceInfo"];
                host.unload(r);
            }
        };
        processor_1.SoundProcessor = {
            onLoadStart: function (host, resource) {
                var sound = new egret.Sound();
                sound.load(RES.getVirtualUrl(resource.root + resource.url));
                return promisify(sound, resource).then(function () {
                    return sound;
                });
            },
            onRemoveStart: function (host, resource) {
                var sound = host.get(resource);
                sound.close();
            }
        };
        /**
        * @internal
        */
        processor_1.MovieClipProcessor = {
            onLoadStart: function (host, resource) {
                var mcData;
                var imageResource;
                return host.load(resource, 'json')
                    .then(function (value) {
                    mcData = value;
                    var jsonPath = resource.name;
                    var imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    imageResource = host.resourceConfig.getResource(imagePath);
                    if (!imageResource) {
                        throw new RES.ResourceManagerError(1001, imagePath);
                    }
                    return host.load(imageResource);
                }).then(function (value) {
                    host.save(imageResource, value);
                    var mcTexture = value;
                    var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
                    return mcDataFactory;
                });
            },
            onRemoveStart: function (host, resource) {
                var mcFactory = host.get(resource);
                mcFactory.clearCache();
                mcFactory.$spriteSheet.dispose();
                // refactor
                var jsonPath = resource.name;
                var imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                var imageResource = host.resourceConfig.getResource(imagePath);
                if (imageResource) {
                    host.unload(imageResource);
                }
            }
        };
        /**
        * @internal
        */
        processor_1.MergeJSONProcessor = {
            onLoadStart: function (host, resource) {
                // let data = await host.load(resource, 'json');
                return host.load(resource, 'json').then(function (data) {
                    for (var key in data) {
                        RES.config.addSubkey(key, resource.name);
                    }
                    return data;
                });
            },
            getData: function (host, resource, key, subkey) {
                var data = host.get(resource);
                if (data) {
                    return data[subkey];
                }
                else {
                    console.error("missing resource :" + resource.name);
                    return null;
                }
            },
            onRemoveStart: function (host, resource) {
            }
        };
        /**
         * @internal
         */
        processor_1.TTFProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, "bin").then(function (data) {
                    if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                        if (!egret.sys.fontResourceCache) {
                            egret.sys.fontResourceCache = {};
                        }
                        egret.sys.fontResourceCache[resource.root + resource.url] = data;
                    }
                });
            },
            onRemoveStart: function (host, resource) {
                if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                    var fontResCache = egret.sys.fontResourceCache;
                    if (fontResCache && fontResCache[resource.url]) {
                        fontResCache[resource.root + resource.url] = null;
                    }
                }
            }
        };
        /**
        * @internal
        */
        processor_1.LegacyResourceConfigProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, 'json').then(function (data) {
                    var resConfigData = RES.config.config;
                    var root = resource.root;
                    var fileSystem = resConfigData.fileSystem;
                    if (!fileSystem) {
                        fileSystem = {
                            fsData: {},
                            getFile: function (filename) {
                                return fsData[filename];
                            },
                            addFile: function (data) {
                                if (!data.type)
                                    data.type = "";
                                if (root == undefined) {
                                    data.root = "";
                                }
                                fsData[data.name] = data;
                            },
                            profile: function () {
                                console.log(fsData);
                            },
                            removeFile: function (filename) {
                                delete fsData[filename];
                            }
                        };
                        resConfigData.fileSystem = fileSystem;
                    }
                    var groups = resConfigData.groups;
                    for (var _i = 0, _a = data.groups; _i < _a.length; _i++) {
                        var g = _a[_i];
                        if (g.keys == "") {
                            groups[g.name] = [];
                        }
                        else {
                            groups[g.name] = g.keys.split(",");
                        }
                    }
                    var alias = resConfigData.alias;
                    var fsData = fileSystem['fsData'];
                    var _loop_1 = function (resource_1) {
                        fsData[resource_1.name] = resource_1;
                        fsData[resource_1.name].root = root;
                        if (resource_1.subkeys) {
                            resource_1.subkeys.split(",").forEach(function (subkey) {
                                alias[subkey] = resource_1.name + "#" + subkey;
                                alias[resource_1.name + "." + subkey] = resource_1.name + "#" + subkey;
                            });
                            // ResourceConfig.
                        }
                    };
                    for (var _b = 0, _c = data.resources; _b < _c.length; _b++) {
                        var resource_1 = _c[_b];
                        _loop_1(resource_1);
                    }
                    host.save(resource, data);
                    return data;
                });
            },
            onRemoveStart: function () {
            }
        };
        /**
        * @internal
        */
        processor_1._map = {
            "image": processor_1.ImageProcessor,
            "json": processor_1.JsonProcessor,
            "text": processor_1.TextProcessor,
            "xml": processor_1.XMLProcessor,
            "sheet": processor_1.SheetProcessor,
            "font": processor_1.FontProcessor,
            "bin": processor_1.BinaryProcessor,
            "commonjs": processor_1.CommonJSProcessor,
            "sound": processor_1.SoundProcessor,
            "movieclip": processor_1.MovieClipProcessor,
            "mergeJson": processor_1.MergeJSONProcessor,
            "legacyResourceConfig": processor_1.LegacyResourceConfigProcessor,
            "ktx": processor_1.KTXTextureProcessor,
            "etc1.ktx": processor_1.ETC1KTXProcessor,
            "pvrtc.ktx": processor_1.KTXTextureProcessor,
            "ttf": processor_1.TTFProcessor
            // "zip": ZipProcessor
        };
    })(processor = RES.processor || (RES.processor = {}));
})(RES || (RES = {}));
