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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RES;
(function (RES) {
    RES.resourceNameSelector = function (p) { return p; };
    function getResourceInfo(path) {
        var result = RES.fileSystem.getFile(path);
        if (!result) {
            path = RES.resourceNameSelector(path);
            result = RES.fileSystem.getFile(path);
        }
        return result;
    }
    RES.getResourceInfo = getResourceInfo;
    var configItem;
    function setConfigURL(url) {
        var type;
        if (url.indexOf(".json") >= 0) {
            type = "legacyResourceConfig";
        }
        else {
            type = "resourceConfig";
        }
        configItem = { type: type, resourceRoot: RES.resourceRoot, url: url, name: url, extra: true };
    }
    RES.setConfigURL = setConfigURL;
    RES.resourceRoot = "";
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    var ResourceConfig = (function () {
        function ResourceConfig() {
        }
        ResourceConfig.prototype.init = function () {
            var _this = this;
            if (!this.config) {
                this.config = {
                    alias: {}, groups: {}, resourceRoot: this.resourceRoot,
                    typeSelector: function () { return 'unknown'; }, mergeSelector: null,
                    fileSystem: null
                };
            }
            return RES.queue.loadResource(configItem).then(function (data) {
                return _this.parseConfig(data);
            }).catch(function (e) {
                if (!e.__resource_manager_error__) {
                    console.error(e.stack);
                    e = new RES.ResourceManagerError(1002);
                }
                return Promise.reject(e);
            });
        };
        /**
         * @internal
         */
        ResourceConfig.prototype.getGroupByName = function (name, shouldNotBeNull) {
            var group = this.config.groups[name];
            var result = [];
            if (!group) {
                if (shouldNotBeNull) {
                    throw new RES.ResourceManagerError(2005, name);
                }
                return null;
            }
            for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                var paramKey = group_1[_i];
                var _a = RES.config.getResourceWithSubkey(paramKey, true), key = _a.key, subkey = _a.subkey;
                var r = RES.config.getResource(key, true);
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
            if (RES.resourceTypeSelector) {
                var type = RES.resourceTypeSelector(url);
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
        ResourceConfig.prototype.getResourceWithSubkey = function (key, shouldNotBeNull) {
            key = this.getKeyByAlias(key);
            var index = key.indexOf("#");
            var subkey = "";
            if (index >= 0) {
                subkey = key.substr(index + 1);
                key = key.substr(0, index);
            }
            var r = this.getResource(key);
            if (!r) {
                if (shouldNotBeNull) {
                    var msg = subkey ? key + "#" + subkey : key;
                    throw new RES.ResourceManagerError(2006, msg);
                }
                else {
                    return null;
                }
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
        ResourceConfig.prototype.getResource = function (path_or_alias, shouldNotBeNull) {
            var path = this.config.alias[path_or_alias];
            if (!path) {
                path = path_or_alias;
            }
            var r = getResourceInfo(path);
            if (!r) {
                if (shouldNotBeNull) {
                    throw new RES.ResourceManagerError(2006, path_or_alias);
                }
                return null;
            }
            return r;
        };
        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {Array<any>}
         * @internal
         */
        ResourceConfig.prototype.getGroup = function (name) {
            return this.getGroupByName(name);
        };
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
         * 解析一个配置文件
         * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        ResourceConfig.prototype.parseConfig = function (data) {
            RES.resourceRoot = data.resourceRoot;
            this.config = data;
            RES.fileSystem = data.fileSystem;
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
        /**
         * 获取加载项类型。
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        ResourceConfig.prototype.getType = function (key) {
            return this.getResource(key, true).type;
        };
        ResourceConfig.prototype.addResourceData = function (data) {
            if (!data.type) {
                data.type = this.__temp__get__type__via__url(data.url);
            }
            RES.fileSystem.addFile(data.url, data.type);
            if (data.name) {
                this.config.alias[data.name] = data.url;
            }
        };
        ResourceConfig.prototype.destory = function () {
            RES.systemPid++;
            var emptyFileSystem = {
                getFile: function () {
                    return null;
                },
                addFile: function () {
                },
                profile: function () {
                }
            };
            this.config = { groups: {}, alias: {}, fileSystem: emptyFileSystem, typeSelector: function (p) { return p; }, resourceRoot: "resources", mergeSelector: null };
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
             * 正在加载的组列表,key为groupName
             */
            this.itemListDic = {};
            /**
             * 加载失败的组,key为groupName
             */
            this.groupErrorDic = {};
            this.retryTimesDic = {};
            this.maxRetryTimes = 3;
            /**
             * 优先级队列,key为priority，value为groupName列表
             */
            this.priorityQueue = {};
            this.reporterDic = {};
            this.dispatcherDic = {};
            this.failedList = new Array();
            this.loadItemErrorDic = {};
            this.errorDic = {};
            this.loadingCount = 0;
            this.thread = 4;
            this.queueIndex = 0;
        }
        ResourceLoader.prototype.load = function (list, groupName, priority, reporter) {
            var total = list.length;
            for (var i = 0; i < total; i++) {
                var resInfo = list[i];
                if (!resInfo.groupNames) {
                    resInfo.groupNames = [];
                }
                resInfo.groupNames.push(groupName);
            }
            this.itemListDic[groupName] = list;
            this.groupTotalDic[groupName] = list.length;
            this.numLoadedDic[groupName] = 0;
            if (this.priorityQueue[priority])
                this.priorityQueue[priority].push(groupName);
            else
                this.priorityQueue[priority] = [groupName];
            this.reporterDic[groupName] = reporter;
            var dispatcher = new egret.EventDispatcher();
            this.dispatcherDic[groupName] = dispatcher;
            var promise = new Promise(function (reslove, reject) {
                dispatcher.addEventListener("complete", reslove, null);
                dispatcher.addEventListener("error", function (e) {
                    reject(e.data);
                }, null);
            });
            this.next();
            return promise;
        };
        ResourceLoader.prototype.next = function () {
            var _this = this;
            var _loop_1 = function () {
                var r = this_1.getOneResourceInfo();
                if (!r)
                    return "break";
                this_1.loadingCount++;
                this_1.loadResource(r)
                    .then(function (response) {
                    _this.loadingCount--;
                    RES.host.save(r, response);
                    var groupName = r.groupNames.shift();
                    if (r.groupNames.length == 0) {
                        r.groupNames = undefined;
                    }
                    var reporter = _this.reporterDic[groupName];
                    _this.numLoadedDic[groupName]++;
                    var current = _this.numLoadedDic[groupName];
                    var total = _this.groupTotalDic[groupName];
                    if (reporter && reporter.onProgress) {
                        reporter.onProgress(current, total);
                    }
                    if (current == total) {
                        var groupError = _this.groupErrorDic[groupName];
                        _this.removeGroupName(groupName);
                        delete _this.groupTotalDic[groupName];
                        delete _this.numLoadedDic[groupName];
                        delete _this.itemListDic[groupName];
                        delete _this.groupErrorDic[groupName];
                        var dispatcher = _this.dispatcherDic[groupName];
                        if (groupError) {
                            var itemList = _this.loadItemErrorDic[groupName];
                            delete _this.loadItemErrorDic[groupName];
                            var error = _this.errorDic[groupName];
                            delete _this.errorDic[groupName];
                            dispatcher.dispatchEventWith("error", false, { itemList: itemList, error: error });
                        }
                        else {
                            dispatcher.dispatchEventWith("complete");
                        }
                    }
                    _this.next();
                }).catch(function (error) {
                    _this.loadingCount--;
                    delete RES.host.state[r.name];
                    var times = _this.retryTimesDic[r.name] || 1;
                    if (times > _this.maxRetryTimes) {
                        delete _this.retryTimesDic[r.name];
                        var groupName = r.groupNames.shift();
                        if (r.groupNames.length == 0) {
                            delete r.groupNames;
                        }
                        if (!_this.loadItemErrorDic[groupName]) {
                            _this.loadItemErrorDic[groupName] = [];
                        }
                        if (_this.loadItemErrorDic[groupName].indexOf(r) == -1) {
                            _this.loadItemErrorDic[groupName].push(r);
                        }
                        _this.groupErrorDic[groupName] = true;
                        var reporter = _this.reporterDic[groupName];
                        _this.numLoadedDic[groupName]++;
                        var current = _this.numLoadedDic[groupName];
                        var total = _this.groupTotalDic[groupName];
                        if (reporter && reporter.onProgress) {
                            reporter.onProgress(current, total);
                        }
                        if (current == total) {
                            var groupError = _this.groupErrorDic[groupName];
                            _this.removeGroupName(groupName);
                            delete _this.groupTotalDic[groupName];
                            delete _this.numLoadedDic[groupName];
                            delete _this.itemListDic[groupName];
                            delete _this.groupErrorDic[groupName];
                            var itemList = _this.loadItemErrorDic[groupName];
                            delete _this.loadItemErrorDic[groupName];
                            var dispatcher = _this.dispatcherDic[groupName];
                            dispatcher.dispatchEventWith("error", false, { itemList: itemList, error: error });
                        }
                        else {
                            _this.errorDic[groupName] = error;
                        }
                        _this.next();
                    }
                    else {
                        _this.retryTimesDic[r.name] = times + 1;
                        _this.failedList.push(r);
                        _this.next();
                        return;
                    }
                });
            };
            var this_1 = this;
            while (this.loadingCount < this.thread) {
                var state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
        };
        /**
         * 从优先级队列中移除指定的组名
         */
        ResourceLoader.prototype.removeGroupName = function (groupName) {
            for (var p in this.priorityQueue) {
                var queue_1 = this.priorityQueue[p];
                var index = 0;
                var found = false;
                var length_1 = queue_1.length;
                for (var i = 0; i < length_1; i++) {
                    var name_1 = queue_1[i];
                    if (name_1 == groupName) {
                        queue_1.splice(index, 1);
                        found = true;
                        break;
                    }
                    index++;
                }
                if (found) {
                    if (queue_1.length == 0) {
                        delete this.priorityQueue[p];
                    }
                    break;
                }
            }
        };
        /**
         * 获取下一个待加载项
         */
        ResourceLoader.prototype.getOneResourceInfo = function () {
            if (this.failedList.length > 0)
                return this.failedList.shift();
            var maxPriority = Number.NEGATIVE_INFINITY;
            for (var p in this.priorityQueue) {
                maxPriority = Math.max(maxPriority, p);
            }
            var queue = this.priorityQueue[maxPriority];
            if (!queue || queue.length == 0) {
                return undefined;
            }
            var length = queue.length;
            var list = [];
            for (var i = 0; i < length; i++) {
                if (this.queueIndex >= length)
                    this.queueIndex = 0;
                list = this.itemListDic[queue[this.queueIndex]];
                if (list.length > 0)
                    break;
                this.queueIndex++;
            }
            if (list.length == 0)
                return undefined;
            return list.shift();
        };
        ResourceLoader.prototype.loadResource = function (r, p) {
            if (!p) {
                if (RES.FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
                    var s = RES.host.state[r.name];
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
            RES.host.state[r.name] = 1;
            var promise = p.onLoadStart(RES.host, r);
            r.promise = promise;
            return promise;
        };
        ResourceLoader.prototype.unloadResource = function (r) {
            var data = RES.host.get(r);
            if (!data) {
                console.warn("尝试释放不存在的资源:", r.name);
                return Promise.resolve();
            }
            var p = RES.processor.isSupport(r);
            if (p) {
                RES.host.state[r.name] = 3;
                var promise = p.onRemoveStart(RES.host, r);
                RES.host.remove(r);
                return promise;
            }
            else {
                return Promise.resolve();
            }
        };
        return ResourceLoader;
    }());
    RES.ResourceLoader = ResourceLoader;
    __reflect(ResourceLoader.prototype, "RES.ResourceLoader");
})(RES || (RES = {}));
var RES;
(function (RES) {
    var __tempCache = {};
    /**
     * 整个资源加载系统的进程id，协助管理回调派发机制
     */
    RES.systemPid = 0;
    RES.checkCancelation = function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var currentPid = RES.systemPid;
            var result = method.apply(this, arg);
            return result.then(function (value) {
                if (RES.systemPid != currentPid) {
                    throw new ResourceManagerError(1005, arg[0]);
                }
                else {
                    return value;
                }
            });
        };
    };
    function profile() {
        RES.fileSystem.profile();
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
    RES.host = {
        state: {},
        get resourceConfig() {
            return RES.config;
        },
        load: function (r, processorName) {
            var processor = typeof processorName == 'string' ? RES.processor._map[processorName] : processorName;
            return RES.queue.loadResource(r, processor);
        },
        unload: function (r) { return RES.queue.unloadResource(r); },
        save: function (resource, data) {
            RES.host.state[resource.name] = 2;
            resource.promise = undefined;
            __tempCache[resource.url] = data;
        },
        get: function (resource) {
            return __tempCache[resource.url];
        },
        remove: function (resource) {
            RES.host.state[resource.name] = 0;
            delete __tempCache[resource.url];
        }
    };
    RES.config = new RES.ResourceConfig();
    RES.queue = new RES.ResourceLoader();
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
            1005: 'ResourceManager 已被销毁，文件加载失败:{0}',
            2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2003: "{0}解析失败,错误原因:{1}",
            2004: "无法找到文件类型:{0}",
            2005: "资源配置文件中无法找到特定的资源组:{0}",
            2006: "资源配置文件中无法找到特定的资源:{0}"
        };
        return ResourceManagerError;
    }(Error));
    RES.ResourceManagerError = ResourceManagerError;
    __reflect(ResourceManagerError.prototype, "RES.ResourceManagerError");
})(RES || (RES = {}));
var RES;
(function (RES) {
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
     *  LOADING_STATE：处理重复加载
     */
    RES.FEATURE_FLAG = {
        FIX_DUPLICATE_LOAD: 1
    };
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
            filename = this.normalize(filename);
            var basefilename = this.basename(filename);
            var folder = this.dirname(filename);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            var d = this.reslove(folder);
            d[basefilename] = { url: filename, type: type };
        };
        NewFileSystem.prototype.getFile = function (filename) {
            var result = this.reslove(filename);
            if (result) {
                result.name = filename;
            }
            return result;
        };
        NewFileSystem.prototype.basename = function (filename) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        };
        NewFileSystem.prototype.normalize = function (filename) {
            return filename.split("/").filter(function (d) { return !!d; }).join("/");
        };
        NewFileSystem.prototype.dirname = function (path) {
            return path.substr(0, path.lastIndexOf("/"));
        };
        NewFileSystem.prototype.reslove = function (dirpath) {
            if (dirpath == "") {
                return this.data;
            }
            dirpath = this.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var f = list_1[_i];
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
            dirpath = this.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var f = list_2[_i];
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f];
            }
        };
        NewFileSystem.prototype.exists = function (dirpath) {
            if (dirpath == "")
                return true;
            dirpath = this.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.data;
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var f = list_3[_i];
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
var RES;
(function (RES) {
    var processor;
    (function (processor_1) {
        function isSupport(resource) {
            return processor_1._map[resource.type];
        }
        processor_1.isSupport = isSupport;
        function map(type, processor) {
            processor_1._map[type] = processor;
        }
        processor_1.map = map;
        function promisify(loader, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (reslove, reject) {
                            var onSuccess = function () {
                                var texture = loader['data'] ? loader['data'] : loader['response'];
                                reslove(texture);
                            };
                            var onError = function () {
                                var e = new RES.ResourceManagerError(1001, resource.url);
                                reject(e);
                            };
                            loader.addEventListener(egret.Event.COMPLETE, onSuccess, _this);
                            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, _this);
                        })];
                });
            });
        }
        function getURL(resource) {
            if (resource.url.indexOf("://") != -1) {
                return resource.url;
            }
            var prefix = resource.extra ? "" : RES.resourceRoot;
            var url = prefix + resource.url;
            if (RES['getRealURL']) {
                return RES['getRealURL'](url);
            }
            else {
                return url;
            }
        }
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
        // var cache: {[index:string]:egret.Texture} = {};
        processor_1.ImageProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var loader, bitmapData, texture, r, list;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                loader = new egret.ImageLoader();
                                loader.load(getURL(resource));
                                return [4 /*yield*/, promisify(loader, resource)];
                            case 1:
                                bitmapData = _a.sent();
                                texture = new egret.Texture();
                                texture._setBitmapData(bitmapData);
                                r = host.resourceConfig.getResource(resource.name);
                                if (r && r.scale9grid) {
                                    list = r.scale9grid.split(",");
                                    texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                                }
                                // var config: any = resItem.data;
                                // if (config && config["scale9grid"]) {
                                //     
                                // }
                                return [2 /*return*/, texture];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                var texture = host.get(resource);
                texture.dispose();
                return Promise.resolve();
            }
        };
        processor_1.BinaryProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var request, arraybuffer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new egret.HttpRequest();
                                request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
                                request.open(getURL(resource), "get");
                                request.send();
                                return [4 /*yield*/, promisify(request, resource)];
                            case 1:
                                arraybuffer = _a.sent();
                                return [2 /*return*/, arraybuffer];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.TextProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var request, text;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new egret.HttpRequest();
                                request.responseType = egret.HttpResponseType.TEXT;
                                request.open(getURL(resource), "get");
                                request.send();
                                return [4 /*yield*/, promisify(request, resource)];
                            case 1:
                                text = _a.sent();
                                return [2 /*return*/, text];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.JsonProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var text, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'text')];
                            case 1:
                                text = _a.sent();
                                data = JSON.parse(text);
                                return [2 /*return*/, data];
                        }
                    });
                });
            },
            onRemoveStart: function (host, request) {
                return Promise.resolve();
            }
        };
        processor_1.XMLProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var text, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'text')];
                            case 1:
                                text = _a.sent();
                                data = egret.XML.parse(text);
                                return [2 /*return*/, data];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.CommonJSProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var text, f, require, exports;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'text')];
                            case 1:
                                text = _a.sent();
                                f = new Function('require', 'exports', text);
                                require = function () { };
                                exports = {};
                                try {
                                    f(require, exports);
                                }
                                catch (e) {
                                    throw new RES.ResourceManagerError(2003, resource.name, e.message);
                                }
                                return [2 /*return*/, exports];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.SheetProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, imagePath, r, texture, frames, spriteSheet, subkey, config, texture;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, "json")];
                            case 1:
                                data = _a.sent();
                                imagePath = RES.config.resourceRoot + "/" + getRelativePath(resource.url, data.file);
                                r = host.resourceConfig.getResource(data.file);
                                if (!r) {
                                    r = { name: imagePath, url: imagePath, extra: true, type: 'image' };
                                }
                                return [4 /*yield*/, host.load(r)];
                            case 2:
                                texture = _a.sent();
                                frames = data.frames;
                                spriteSheet = new egret.SpriteSheet(texture);
                                spriteSheet["$resourceInfo"] = r;
                                for (subkey in frames) {
                                    config = frames[subkey];
                                    texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                                    // if (config["scale9grid"]) {
                                    //     var str: string = config["scale9grid"];
                                    //     var list: Array<string> = str.split(",");
                                    //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                                    // }
                                    //     if (name) {
                                    //         this.addSubkey(subkey, name);
                                    //     }
                                }
                                // todo refactor
                                host.save(r, texture);
                                return [2 /*return*/, spriteSheet];
                        }
                    });
                });
            },
            getData: function (host, resource, key, subkey) {
                var data = host.get(resource);
                if (data) {
                    return data.getTexture(subkey);
                }
                else {
                    console.error("missing resource : " + key + "#" + subkey);
                    return null;
                }
            },
            onRemoveStart: function (host, resource) {
                var sheet = host.get(resource);
                var r = sheet["$resourceInfo"];
                host.unload(r);
                return Promise.resolve();
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
        processor_1.FontProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, config, imageFileName, r, texture, font;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'text')];
                            case 1:
                                data = _a.sent();
                                try {
                                    config = JSON.parse(data);
                                }
                                catch (e) {
                                    config = data;
                                }
                                imageFileName = resource.name.replace("fnt", "png");
                                r = host.resourceConfig.getResource(imageFileName);
                                if (!r) {
                                    if (typeof config === 'string') {
                                        imageFileName = RES.config.resourceRoot + "/" + fontGetTexturePath(resource.url, config);
                                    }
                                    else {
                                        imageFileName = RES.config.resourceRoot + "/" + getRelativePath(resource.url, config.file);
                                    }
                                    r = { name: imageFileName, url: imageFileName, extra: true, type: 'image' };
                                }
                                return [4 /*yield*/, host.load(r)];
                            case 2:
                                texture = _a.sent();
                                font = new egret.BitmapFont(texture, config);
                                font["$resourceInfo"] = r;
                                // todo refactor
                                host.save(r, texture);
                                return [2 /*return*/, font];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                var font = host.get(resource);
                var r = font["$resourceInfo"];
                host.unload(r);
                return Promise.resolve();
            }
        };
        processor_1.SoundProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var sound;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                sound = new egret.Sound();
                                sound.load(getURL(resource));
                                return [4 /*yield*/, promisify(sound, resource)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, sound];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.MovieClipProcessor = {
            onLoadStart: function (host, resource) {
                var mcData;
                var imageResource;
                return host.load(resource, 'json')
                    .then(function (value) {
                    mcData = value;
                    var jsonPath = resource.name;
                    var imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    imageResource = host.resourceConfig.getResource(imagePath, true);
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
                var imageResource = host.resourceConfig.getResource(imagePath, true);
                return host.unload(imageResource);
            }
        };
        processor_1.MergeJSONProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, key;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'json')];
                            case 1:
                                data = _a.sent();
                                for (key in data) {
                                    RES.config.addSubkey(key, resource.name);
                                }
                                return [2 /*return*/, data];
                        }
                    });
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
                return Promise.resolve();
            }
        };
        processor_1.ResourceConfigProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, fileSystem;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'commonjs')];
                            case 1:
                                data = _a.sent();
                                fileSystem = new RES.NewFileSystem(data.resources);
                                data.fileSystem = fileSystem;
                                delete data.resource;
                                RES.resourceTypeSelector = data.typeSelector;
                                RES.resourceNameSelector = data.nameSelector ? data.nameSelector : function (p) { return p; };
                                return [2 /*return*/, data];
                        }
                    });
                });
            },
            onRemoveStart: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            }
        };
        processor_1.LegacyResourceConfigProcessor = {
            onLoadStart: function (host, resource) {
                return host.load(resource, 'json').then(function (data) {
                    var resConfigData = RES.config.config;
                    var fileSystem = resConfigData.fileSystem;
                    if (!fileSystem) {
                        fileSystem = {
                            fsData: {},
                            getFile: function (filename) {
                                return fsData[filename];
                            },
                            addFile: function (filename, type) {
                                if (!type)
                                    type = "";
                                fsData[filename] = { name: filename, type: type, url: filename };
                            },
                            profile: function () {
                                console.log(fsData);
                            }
                        };
                        resConfigData.fileSystem = fileSystem;
                    }
                    var groups = resConfigData.groups;
                    for (var _i = 0, _a = data.groups; _i < _a.length; _i++) {
                        var g = _a[_i];
                        groups[g.name] = g.keys.split(",");
                    }
                    var alias = resConfigData.alias;
                    var fsData = fileSystem['fsData'];
                    var _loop_2 = function (resource_1) {
                        fsData[resource_1.name] = resource_1;
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
                        _loop_2(resource_1);
                    }
                    return resConfigData;
                });
            },
            onRemoveStart: function () {
                return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); });
            }
        };
        var PVRParser = (function () {
            function PVRParser() {
            }
            PVRParser.parse = function (arrayBuffer, callback, errorCallback) {
                // the header length of int32
                var headerIntLength = 13;
                // get header part of arrayBuffer
                var header = new Uint32Array(arrayBuffer, 0, headerIntLength);
                // separate buffer and header
                var pvrDatas = {
                    buffer: arrayBuffer,
                    header: header
                };
                // PVR v3
                if (header[0] === 0x03525650) {
                    PVRParser._parseV3(pvrDatas, callback, errorCallback);
                }
                else if (header[11] === 0x21525650) {
                    PVRParser._parseV2(pvrDatas, callback, errorCallback);
                }
                else {
                    errorCallback(pvrDatas, "pvr parse error!");
                }
            };
            PVRParser._parseV2 = function (pvrDatas, callback, errorCallback) {
                var header = pvrDatas.header;
                var headerLength = header[0], height = header[1], width = header[2], numMipmaps = header[3], flags = header[4], dataLength = header[5], bpp = header[6], bitmaskRed = header[7], bitmaskGreen = header[8], bitmaskBlue = header[9], bitmaskAlpha = header[10], pvrTag = header[11], numSurfs = header[12];
                var TYPE_MASK = 0xff;
                var PVRTC_2 = 24, PVRTC_4 = 25;
                var formatFlags = flags & TYPE_MASK;
                var bpp, format;
                var _hasAlpha = bitmaskAlpha > 0;
                if (formatFlags === PVRTC_4) {
                    format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                    bpp = 4;
                }
                else if (formatFlags === PVRTC_2) {
                    format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                    bpp = 2;
                }
                else {
                    errorCallback(pvrDatas, "pvr v2 parse error");
                    console.log("unknow format flags::" + formatFlags);
                }
                var dataOffset = headerLength;
                pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
                pvrDatas.bpp = bpp;
                pvrDatas.format = format;
                pvrDatas.width = width;
                pvrDatas.height = height;
                pvrDatas.surfacesCount = numSurfs;
                pvrDatas.mipmapsCount = numMipmaps + 1;
                // guess cubemap type seems tricky in v2
                // it juste a pvr containing 6 surface (no explicit cubemap type)
                pvrDatas.isCubemap = (pvrDatas.surfacesCount === 6);
                callback(pvrDatas);
            };
            PVRParser._parseV3 = function (pvrDatas, callback, errorCallback) {
                var header = pvrDatas.header;
                var bpp, format;
                var pixelFormat = header[2];
                switch (pixelFormat) {
                    case 0:// PVRTC 2bpp RGB
                        bpp = 2;
                        format = PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                        break;
                    case 1:// PVRTC 2bpp RGBA
                        bpp = 2;
                        format = PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                        break;
                    case 2:// PVRTC 4bpp RGB
                        bpp = 4;
                        format = PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                        break;
                    case 3:// PVRTC 4bpp RGBA
                        bpp = 4;
                        format = PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                        break;
                    default:
                        errorCallback(pvrDatas, "pvr v3 parse error");
                        console.log("unknow pixel format::" + pixelFormat);
                }
                var dataOffset = 52 + header[12];
                pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
                pvrDatas.bpp = bpp;
                pvrDatas.format = format;
                pvrDatas.width = header[7];
                pvrDatas.height = header[6];
                pvrDatas.surfacesCount = header[10];
                pvrDatas.mipmapsCount = header[11];
                pvrDatas.isCubemap = (pvrDatas.surfacesCount === 6);
                callback(pvrDatas);
            };
            PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
            PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
            PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
            PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;
            return PVRParser;
        }());
        __reflect(PVRParser.prototype, "PVRParser");
        if (typeof egret != 'undefined' && egret && egret["web"] && egret["web"].WebGLRenderContext) {
            // Calcualates the size of a compressed texture level in bytes
            function textureLevelSize(format, width, height) {
                switch (format) {
                    case PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                    case PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                        return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);
                    case PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                    case PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                        return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);
                    default:
                        return 0;
                }
            }
            egret["web"].WebGLRenderContext.prototype.createTextureFromCompressedData = function (data, width, height, levels, internalFormat) {
                var gl = this.context;
                if (!this.pvrtcExt) {
                    this.pvrtcExt = gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
                }
                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                var offset = 0;
                // Loop through each mip level of compressed texture data provided and upload it to the given texture.
                for (var i = 0; i < levels; ++i) {
                    // Determine how big this level of compressed texture data is in bytes.
                    var levelSize = textureLevelSize(internalFormat, width, height);
                    // Get a view of the bytes for this level of DXT data.
                    var dxtLevel = new Uint8Array(data.buffer, data.byteOffset + offset, levelSize);
                    // Upload!
                    gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, dxtLevel);
                    // The next mip level will be half the height and width of this one.
                    width = width >> 1;
                    if (width < 1)
                        width = 1;
                    height = height >> 1;
                    if (height < 1)
                        height = 1;
                    // Advance the offset into the compressed texture data past the current mip level's data.
                    offset += levelSize;
                }
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                return texture;
            };
        }
        processor_1.PVRProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var arraybuffer, width, height, borderWidth, borderHeight, byteArray, list, pvrDataBuffer, i, buffer, dataLength, self, texture;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, 'bin')];
                            case 1:
                                arraybuffer = _a.sent();
                                width = 512;
                                height = 512;
                                borderWidth = 0;
                                borderHeight = 0;
                                byteArray = new egret.ByteArray(arraybuffer);
                                byteArray.position = 7;
                                list = ["body", "ext"];
                                for (i = 0; i < list.length; i++) {
                                    buffer = void 0;
                                    switch (list[i]) {
                                        case "body":
                                            byteArray.position += 2;
                                            dataLength = byteArray.readUnsignedInt();
                                            pvrDataBuffer = byteArray.buffer.slice(byteArray.position, byteArray.position + dataLength);
                                            byteArray.position += dataLength;
                                            break;
                                        case "ext":
                                            byteArray.position += 6;
                                            width = byteArray.readUnsignedShort();
                                            height = byteArray.readUnsignedShort();
                                            borderWidth = byteArray.readUnsignedShort();
                                            borderHeight = byteArray.readUnsignedShort();
                                            break;
                                    }
                                }
                                self = this;
                                PVRParser.parse(pvrDataBuffer, function (pvrData) {
                                    var bitmapData = new egret.BitmapData(pvrData);
                                    bitmapData.format = "pvr";
                                    texture = new egret.Texture();
                                    texture._setBitmapData(bitmapData);
                                    texture.$initData(borderWidth, borderHeight, width, height, 0, 0, width, height, bitmapData.width, bitmapData.height);
                                }, function () {
                                    console.log("pvr error");
                                });
                                return [2 /*return*/, texture];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
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
            "pvr": processor_1.PVRProcessor,
            "mergeJson": processor_1.MergeJSONProcessor,
            "resourceConfig": processor_1.ResourceConfigProcessor,
            "legacyResourceConfig": processor_1.LegacyResourceConfigProcessor,
        };
    })(processor = RES.processor || (RES.processor = {}));
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源加载事件。
     * @version Egret 2.4
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
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
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
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 已经加载的文件数。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemsLoaded = 0;
            /**
             * Total file number to load.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要加载的总文件数。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemsTotal = 0;
            /**
             * Resource group name.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 资源组名。
             * @version Egret 2.4
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
         * @private
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
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个加载项加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.ITEM_LOAD_ERROR = "itemLoadError";
        /**
         * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.CONFIG_COMPLETE = "configComplete";
        /**
         * Configuration file failed to load.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.CONFIG_LOAD_ERROR = "configLoadError";
        /**
         * Delay load group resource loading progress event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载进度事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.GROUP_PROGRESS = "groupProgress";
        /**
         * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceEvent.GROUP_COMPLETE = "groupComplete";
        /**
         * Delayed load group resource failed event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载失败事件。
         * @version Egret 2.4
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源项。对应 resource.json 中 resources 数组中的一项。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    var ResourceItem;
    (function (ResourceItem) {
        /**
         * XML file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * XML 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_XML = "xml";
        /**
         * Picture file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 图片文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_IMAGE = "image";
        /**
         * Binary file.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 二进制文件。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        ResourceItem.TYPE_BIN = "bin";
        /**
         * Text file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_TEXT = "text";
        /**
         * JSON file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * JSON 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_JSON = "json";
        /**
         * SpriteSheet file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * SpriteSheet 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_SHEET = "sheet";
        /**
         * BitmapTextSpriteSheet file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * BitmapTextSpriteSheet 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_FONT = "font";
        /**
         * Sound file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 声音文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        ResourceItem.TYPE_SOUND = "sound";
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
                data: r
            };
            return result;
        }
        ResourceItem.convertToResItem = convertToResItem;
    })(ResourceItem = RES.ResourceItem || (RES.ResourceItem = {}));
})(RES || (RES = {}));
var RES;
(function (RES) {
    var versionInfo;
    /**
     * @internal
     */
    function native_init() {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            versionInfo = getLocalData("all.manifest");
        }
    }
    RES.native_init = native_init;
    /**
     * @internal
     */
    function getRealURL(url) {
        if (versionInfo && versionInfo[url]) {
            return "resource/" + versionInfo[url].v.substring(0, 2) + "/" + versionInfo[url].v + "_" + versionInfo[url].s + "." + url.substring(url.lastIndexOf(".") + 1);
        }
        else {
            return url;
        }
    }
    RES.getRealURL = getRealURL;
    function getLocalData(filePath) {
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
    }
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
     * Conduct mapping injection with class definition as the value.
     * @param type Injection type.
     * @param analyzerClass Injection type classes need to be resolved.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language en_US
     */
    /**
     * 以类定义为值进行映射注入。
     * @param type 注入的类型。
     * @param analyzerClass 注入类型需要解析的类。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language zh_CN
     */
    function registerAnalyzer(type, analyzerClass) {
        throw new RES.ResourceManagerError(2002);
    }
    RES.registerAnalyzer = registerAnalyzer;
    /**
     * Load configuration file and parse.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载配置文件并解析。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function loadConfig(url, resourceRoot) {
        if (url) {
            RES.setConfigURL(url);
        }
        if (!instance)
            instance = new Resource();
        RES.config.resourceRoot = resourceRoot;
        return instance.loadConfig();
    }
    RES.loadConfig = loadConfig;
    /**
     * Load a set of resources according to the group name.
     * @param name Group name to load the resource group.
     * @param priority Load priority can be negative, the default value is 0.
     * <br>A low priority group must wait for the high priority group to complete the end of the load to start, and the same priority group will be loaded at the same time.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名加载一组资源。
     * @param name 要加载资源组的组名。
     * @param priority 加载优先级,可以为负数,默认值为 0。
     * <br>低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function loadGroup(name, priority, reporter) {
        if (priority === void 0) { priority = 0; }
        return instance.loadGroup(name, priority, reporter);
    }
    RES.loadGroup = loadGroup;
    /**
     * Check whether a resource group has been loaded.
     * @param name Group name。
     * @returns Is loading or not.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查某个资源组是否已经加载完成。
     * @param name 组名。
     * @returns 是否正在加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名获取组加载项列表。
     * @param name 组名。
     * @returns 加载项列表。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
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
     * @version Egret 2.4
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
     * @version Egret 2.4
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
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查配置文件里是否含有指定的资源。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
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
     * @version Egret 2.4
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function getRes(key) {
        return instance.getRes(key);
    }
    RES.getRes = getRes;
    function getResAsync(key, compFunc, thisObject) {
        return instance.getResAsync.apply(instance, arguments);
    }
    RES.getResAsync = getResAsync;
    /**
     * Access to external resources through the full URL.
     * @param url The external path to load the file.
     * @param compFunc Call back function. Example：compFunc(data,url):void。
     * @param thisObject This pointer of call back function.
     * @param type File type (optional). Use the static constants defined in the ResourceItem class. If you do not set the file name extension.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     * @language en_US
     */
    /**
     * 通过完整URL方式获取外部资源。
     * @param url 要加载文件的外部路径。
     * @param compFunc 回调函数。示例：compFunc(data,url):void。
     * @param thisObject 回调函数的 this 引用。
     * @param type 文件类型(可选)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     * @language zh_CN
     */
    function getResByUrl(url, compFunc, thisObject, type) {
        if (type === void 0) { type = ""; }
        instance.getResByUrl(url, compFunc, thisObject, type);
    }
    RES.getResByUrl = getResByUrl;
    /**
     * Destroy a single resource file or a set of resources to the cache data, to return whether to delete success.
     * @param name Name attribute or resource group name of the load item in the configuration file.
     * @param force Destruction of a resource group when the other resources groups have the same resource situation whether the resources will be deleted, the default value true.
     * @returns Are successful destruction.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @param name 配置文件中加载项的name属性或资源组名。
     * @param force 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值 true。
     * @see #setMaxRetryTimes
     * @returns 是否销毁成功。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function destroyRes(name, force) {
        return instance.destroyRes(name, force);
    }
    RES.destroyRes = destroyRes;
    /**
     * Sets the maximum number of concurrent load threads, the default value is 2.
     * @param thread The number of concurrent loads to be set.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置最大并发加载线程数量，默认值是 2。
     * @param thread 要设置的并发加载数。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     * @version Egret 2.4
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
     * @version Egret 2.4
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
     * @version Egret 2.4
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
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @param type 事件名。
     * @param listener 侦听函数。
     * @param thisObject 侦听函数绑定的this对象。
     * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
     * @version Egret 2.4
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
     * @version Egret 3.1.6
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 自定义添加一项资源配置。
     * @param data 要添加的配置。
     * @version Egret 3.1.6
     * @platform Web,Native
     * @language zh_CN
     */
    function $addResourceData(data) {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }
    RES.$addResourceData = $addResourceData;
    /**
     * @private
     */
    var Resource = (function (_super) {
        __extends(Resource, _super);
        function Resource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 开始加载配置
         * @method RES.loadConfig
         */
        Resource.prototype.loadConfig = function () {
            var _this = this;
            RES.native_init();
            return RES.config.init().then(function (data) {
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.CONFIG_COMPLETE);
            }, function (error) {
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.CONFIG_LOAD_ERROR);
                return Promise.reject(error);
            });
        };
        /**
         * 检查某个资源组是否已经加载完成
         * @method RES.isGroupLoaded
         * @param name {string}
         */
        Resource.prototype.isGroupLoaded = function (name) {
            var resources = RES.config.getGroupByName(name, true);
            return resources.every(function (r) { return RES.host.get(r) != null; });
        };
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         */
        Resource.prototype.getGroupByName = function (name) {
            return RES.config.getGroupByName(name, true); //这里不应该传入 true，但是为了老版本的 TypeScriptCompiler 兼容性，暂时这样做
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
                onProgress: function (current, total) {
                    if (reporter && reporter.onProgress) {
                        reporter.onProgress(current, total);
                    }
                    RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_PROGRESS, name, undefined, current, total);
                }
            };
            return this._loadGroup(name, priority, reporterDelegate).then(function (data) {
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_COMPLETE, name);
            }, function (error) {
                var itemList = error.itemList;
                var length = itemList.length;
                for (var i = 0; i < length; i++) {
                    var item = itemList[i];
                    delete item.promise;
                    RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.ITEM_LOAD_ERROR, name, item);
                }
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_LOAD_ERROR, name);
                return Promise.reject(error.error);
            });
        };
        Resource.prototype._loadGroup = function (name, priority, reporter) {
            if (priority === void 0) { priority = 0; }
            var resources = RES.config.getGroupByName(name, true);
            return RES.queue.load(resources, name, priority, reporter);
        };
        Resource.prototype.loadResources = function (keys, reporter) {
            var resources = keys.map(function (key) {
                var r = RES.config.getResourceWithSubkey(key, true);
                return r.r;
            });
            return RES.queue.load(resources, "name", 0, reporter);
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
            var paramKey = key;
            var _a = RES.config.getResourceWithSubkey(key, true), r = _a.r, subkey = _a.subkey;
            return RES.queue.loadResource(r).then(function (value) {
                RES.host.save(r, value);
                var p = RES.processor.isSupport(r);
                if (p && p.getData && subkey) {
                    value = p.getData(RES.host, r, key, subkey);
                }
                if (compFunc) {
                    compFunc.call(thisObject, value, paramKey);
                }
                return value;
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
            if (type === void 0) { type = ""; }
            var r = RES.config.getResource(url);
            if (!r) {
                if (!type) {
                    type = RES.config.__temp__get__type__via__url(url);
                }
                // manager.config.addResourceData({ name: url, url: url });
                r = { name: url, url: url, type: type, extra: true };
                RES.config.addResourceData(r);
                r = RES.config.getResource(url);
                if (r) {
                    r.extra = true;
                }
                else {
                    throw 'never';
                }
            }
            return RES.queue.loadResource(r).then(function (value) {
                if (compFunc && r) {
                    compFunc.call(thisObject, value, r.url);
                }
                return value;
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
            return __awaiter(this, void 0, void 0, function () {
                var group, remove, _i, group_2, item, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            group = RES.config.getGroup(name);
                            remove = function (r) {
                                return RES.queue.unloadResource(r);
                            };
                            if (!(group && group.length > 0)) return [3 /*break*/, 5];
                            _i = 0, group_2 = group;
                            _a.label = 1;
                        case 1:
                            if (!(_i < group_2.length)) return [3 /*break*/, 4];
                            item = group_2[_i];
                            return [4 /*yield*/, remove(item)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, true];
                        case 5:
                            item = RES.config.getResource(name);
                            if (!item) return [3 /*break*/, 7];
                            return [4 /*yield*/, remove(item)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 7:
                            console.warn("\u65E0\u6CD5\u5220\u9664\u6307\u5B9A\u7EC4:" + name);
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        /**
         * 设置最大并发加载线程数量，默认值是2.
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
            RES.config.addResourceData(data);
        };
        __decorate([
            RES.checkCancelation
        ], Resource.prototype, "loadConfig", null);
        __decorate([
            RES.checkCancelation
        ], Resource.prototype, "_loadGroup", null);
        __decorate([
            RES.checkNull
        ], Resource.prototype, "hasRes", null);
        __decorate([
            RES.checkNull
        ], Resource.prototype, "getRes", null);
        __decorate([
            RES.checkNull,
            RES.checkCancelation
        ], Resource.prototype, "getResAsync", null);
        __decorate([
            RES.checkNull,
            RES.checkCancelation
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
