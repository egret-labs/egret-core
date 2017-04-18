var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
    var ResourceNodeType;
    (function (ResourceNodeType) {
        ResourceNodeType[ResourceNodeType["FILE"] = 0] = "FILE";
        ResourceNodeType[ResourceNodeType["DICTIONARY"] = 1] = "DICTIONARY";
    })(ResourceNodeType || (ResourceNodeType = {}));
    function getResourceInfo(path) {
        return FileSystem.getFile(path);
    }
    RES.getResourceInfo = getResourceInfo;
    var FileSystem;
    (function (FileSystem) {
        FileSystem.data = {};
        function addFile(filename, type) {
            if (!type)
                type = "";
            filename = normalize(filename);
            var basefilename = basename(filename);
            var folder = dirname(filename);
            if (!exists(folder)) {
                mkdir(folder);
            }
            var d = reslove(folder);
            d[basefilename] = { url: filename, type: type };
        }
        FileSystem.addFile = addFile;
        function getFile(filename) {
            var result = reslove(filename);
            if (result) {
                result.name = filename;
            }
            return result;
        }
        FileSystem.getFile = getFile;
        function basename(filename) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }
        function normalize(filename) {
            return filename.split("/").filter(function (d) { return !!d; }).join("/");
        }
        function dirname(path) {
            return path.substr(0, path.lastIndexOf("/"));
        }
        function reslove(dirpath) {
            if (dirpath == "") {
                return FileSystem.data;
            }
            dirpath = normalize(dirpath);
            var list = dirpath.split("/");
            var current = FileSystem.data;
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
        }
        function mkdir(dirpath) {
            dirpath = normalize(dirpath);
            var list = dirpath.split("/");
            var current = FileSystem.data;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var f = list_2[_i];
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f];
            }
        }
        FileSystem.mkdir = mkdir;
        function exists(dirpath) {
            if (dirpath == "")
                return true;
            dirpath = normalize(dirpath);
            var list = dirpath.split("/");
            var current = FileSystem.data;
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var f = list_3[_i];
                if (!current[f]) {
                    return false;
                }
                current = current[f];
            }
            return true;
        }
        FileSystem.exists = exists;
    })(FileSystem = RES.FileSystem || (RES.FileSystem = {}));
})(RES || (RES = {}));
var RES;
(function (RES) {
    var resourceTypeSelector;
    /**
   * Definition profile.
   * @param url Configuration file path (path resource.json).
   * @param resourceRoot Resource path. All URL in the configuration is the relative value of the path. The ultimate URL is the value of the sum of the URL of the string and the resource in the configuration.
   * @param type Configuration file format. Determine what parser to parse the configuration file. Default "json".
   * @version Egret 3.1.5
   * @platform Web,Native
   * @language en_US
   */
    /**
     * 定义配置文件。
     * @param url 配置文件路径(resource.json的路径)。
     * @param resourceRoot 资源根路径。配置中的所有url都是这个路径的相对值。最终url是这个字符串与配置里资源项的url相加的值。
     * @param type 配置文件的格式。确定要用什么解析器来解析配置文件。默认"json"
     * @version Egret 3.1.5
     * @platform Web,Native
     * @language zh_CN
     */
    function mapConfig(url, rootSelector, typeSelector) {
        return function (target) {
            var type = typeSelector(url);
            if (typeof rootSelector == "string") {
                RES.resourceRoot = rootSelector;
            }
            else {
                RES.resourceRoot = rootSelector();
            }
            if (RES.resourceRoot.lastIndexOf("/") != 0) {
                RES.resourceRoot = RES.resourceRoot + "/";
            }
            RES.configItem = { url: url, resourceRoot: RES.resourceRoot, type: type, name: url };
            resourceTypeSelector = typeSelector;
        };
    }
    RES.mapConfig = mapConfig;
    ;
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    var ResourceConfig = (function () {
        function ResourceConfig() {
            RES["configInstance"] = this;
        }
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
                var key = group_1[_i];
                var r = this.getResource(key, true);
                result.push(r);
            }
            return result;
        };
        ResourceConfig.prototype.__temp__get__type__via__url = function (url_or_alias) {
            var url = this.config.alias[url_or_alias];
            if (!url) {
                url = url_or_alias;
            }
            var ext = url.substr(url.lastIndexOf(".") + 1);
            if (ext) {
                ext = ext.toLowerCase();
            }
            if (resourceTypeSelector) {
                var type = resourceTypeSelector(url);
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
        ResourceConfig.prototype.parseResKey = function (key) {
            key = this.getKeyByAlias(key);
            var index = key.indexOf("#");
            if (index >= 0) {
                return {
                    key: key.substr(0, index),
                    subkey: key.substr(index + 1)
                };
            }
            else {
                return {
                    key: key,
                    subkey: ""
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
            var r = RES.getResourceInfo(path);
            if (!r) {
                if (shouldNotBeNull) {
                    throw "none resource url or alias : " + path_or_alias;
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
                else if (this.config.alias[key] || this.config.resources[key]) {
                    group = group.concat(key);
                }
                else {
                    group = group.concat(key);
                    console.warn("resource not exist : " + key);
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
            var _this = this;
            this.config = data;
            var resource = data.resources;
            var loop = function (r, prefix, walk) {
                for (var key in r) {
                    var p = prefix ? prefix + "/" + key : key;
                    var f = r[key];
                    if (isFile(f)) {
                        if (typeof f === 'string') {
                            f = { url: f, name: p };
                            r[key] = f;
                        }
                        else {
                            f['name'] = p;
                        }
                        walk(f);
                    }
                    else {
                        loop(f, p, walk);
                    }
                }
            };
            var isFile = function (r) {
                return typeof r === "string" || r.url != null;
            };
            loop(resource, "", function (value) {
                if (!value.type) {
                    value.type = _this.__temp__get__type__via__url(value.url);
                }
            });
            RES.FileSystem.data = data.resources;
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
            RES.FileSystem.addFile(data.url, data.type);
            if (data.name) {
                this.config.alias[data.name] = data.url;
            }
        };
        ResourceConfig.prototype.destory = function () {
            this.config = { groups: {}, alias: {}, resources: {} };
            RES.FileSystem.data = {};
        };
        return ResourceConfig;
    } ());
    RES.ResourceConfig = ResourceConfig;
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
     * @extends egret.EventDispatcher
     * @private
     * @internal
     */
    var PromiseQueue = (function () {
        function PromiseQueue() {
        }
        PromiseQueue.prototype.load = function (list, reporter) {
            var current = 0;
            var total = 1;
            var mapper = function (r) {
                return RES.host.load(r)
                    .then(function (response) {
                        RES.host.save(r, response);
                        current++;
                        if (reporter && reporter.onProgress) {
                            reporter.onProgress(current, total);
                        }
                        return response;
                    });
            };
            if ((list instanceof Array)) {
                total = list.length;
                return Promise.all(list.map(mapper));
            }
            else {
                return mapper(list);
            }
        };
        return PromiseQueue;
    } ());
    RES.PromiseQueue = PromiseQueue;
})(RES || (RES = {}));
var RES;
(function (RES) {
    var __tempCache = {};
    /**
     * 整个资源加载系统的进程id，协助管理回调派发机制
     */
    var systemPid = 0;
    RES.checkCancelation = function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var currentPid = systemPid;
            var result = method.apply(this, arg);
            return result.then(function (value) {
                if (systemPid != currentPid) {
                    throw new ResourceManagerError(1005, arg[0]);
                }
                else {
                    return value;
                }
            });
        };
    };
    function profile() {
        console.log(RES.FileSystem.data);
        console.log(__tempCache);
        //todo 
        var totalImageSize = 0;
        for (var key in __tempCache) {
            var img = __tempCache[key];
            if (img instanceof egret.Texture) {
                totalImageSize += img._bitmapWidth * img._bitmapHeight * 4;
            }
        }
        console.log("gpu size : " + (totalImageSize / 1024).toFixed(3) + "kb");
    }
    RES.profile = profile;
    RES.host = {
        get resourceConfig() {
            return manager.config;
        },
        load: function (r, processor) {
            if (!processor) {
                processor = RES.host.isSupport(r);
            }
            if (!processor) {
                throw new ResourceManagerError(2001, r.name, r.type);
            }
            return processor.onLoadStart(RES.host, r);
        },
        unload: function (r) {
            var data = RES.host.get(r);
            if (!data) {
                console.warn("尝试释放不存在的资源:", r.name);
                return Promise.resolve();
            }
            var processor = RES.host.isSupport(r);
            if (processor) {
                return processor.onRemoveStart(RES.host, r)
                    .then(function (result) {
                        RES.host.remove(r);
                        return result;
                    });
            }
            else {
                return Promise.resolve();
            }
        },
        save: function (resource, data) {
            __tempCache[resource.url] = data;
        },
        get: function (resource) {
            return __tempCache[resource.url];
        },
        remove: function (resource) {
            delete __tempCache[resource.url];
        },
        isSupport: function (resource) {
            return RES.processor.isSupport(resource);
        }
    };
    var manager;
    (function (manager) {
        manager.config = new RES.ResourceConfig();
        var queue = new RES.PromiseQueue();
        function init() {
            return RES.host.load(RES.configItem).then(function (data) {
                manager.config.parseConfig(data);
            }).catch(function (e) {
                if (!e.__resource_manager_error__) {
                    console.error(e.stack);
                    e = new ResourceManagerError(1002);
                }
                return Promise.reject(e);
            });
        }
        manager.init = init;
        function load(resources, reporter) {
            return queue.load(resources, reporter);
        }
        manager.load = load;
        function destory() {
            manager.config.destory();
            systemPid++;
            //todo 销毁整个 ResourceManager上下文全部内容
        }
        manager.destory = destory;
    })(manager = RES.manager || (RES.manager = {}));
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
        return ResourceManagerError;
    } (Error));
    ResourceManagerError.errorMessage = {
        1001: '文件加载失败:{0}',
        1002: "ResourceManager 初始化失败：配置文件加载失败",
        1005: 'ResourceManager 已被销毁，文件加载失败:{0}',
        2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
        2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
        2003: "{0}解析失败,错误原因:{1}",
        2004: "无法找到文件类型:{0}",
        2005: "无法找到特定的资源组:{0}"
    };
    RES.ResourceManagerError = ResourceManagerError;
})(RES || (RES = {}));
var RES;
(function (RES) {
    var processor;
    (function (processor_1) {
        function isSupport(resource) {
            return _map[resource.type];
        }
        processor_1.isSupport = isSupport;
        function map(type, processor) {
            _map[type] = processor;
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
        function getRelativePath(url, file) {
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
                    var loader, prefix, bitmapData, texture;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                loader = new egret.ImageLoader();
                                prefix = resource.extra ? "" : RES.resourceRoot;
                                loader.load(prefix + resource.url);
                                return [4 /*yield*/, promisify(loader, resource)];
                            case 1:
                                bitmapData = _a.sent();
                                texture = new egret.Texture();
                                texture._setBitmapData(bitmapData);
                                // var config: any = resItem.data;
                                // if (config && config["scale9grid"]) {
                                //     var str: string = config["scale9grid"];
                                //     var list: Array<string> = str.split(",");
                                //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
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
                    var request, prefix, arraybuffer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new egret.HttpRequest();
                                request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
                                prefix = resource.extra ? "" : RES.resourceRoot;
                                request.open(prefix + resource.url, "get");
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
                    var request, prefix, text;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new egret.HttpRequest();
                                request.responseType = egret.HttpResponseType.TEXT;
                                prefix = resource.extra ? "" : RES.resourceRoot;
                                request.open(prefix + resource.url, "get");
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
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.TextProcessor)];
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
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.TextProcessor)];
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
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.TextProcessor)];
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
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.JsonProcessor)];
                            case 1:
                                data = _a.sent();
                                imagePath = getRelativePath(resource.name, data.file);
                                r = host.resourceConfig.getResource(imagePath);
                                if (!r) {
                                    throw new RES.ResourceManagerError(1001, imagePath);
                                }
                                return [4 /*yield*/, host.load(r)];
                            case 2:
                                texture = _a.sent();
                                frames = data.frames;
                                spriteSheet = new egret.SpriteSheet(texture);
                                for (subkey in frames) {
                                    config = frames[subkey];
                                    texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                                }
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
                    console.error("missing resource :" + resource.name);
                    return null;
                }
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.FontProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var getTexturePath, data, imageUrl, config, r, texture, font;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                getTexturePath = function (url, fntText) {
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
                                return [4 /*yield*/, host.load(resource, processor_1.TextProcessor)];
                            case 1:
                                data = _a.sent();
                                imageUrl = "";
                                try {
                                    config = JSON.parse(data);
                                    imageUrl = getRelativePath(resource.name, config.file);
                                }
                                catch (e) {
                                    config = data;
                                    imageUrl = getTexturePath(resource.name, data);
                                }
                                r = host.resourceConfig.getResource(imageUrl);
                                if (!r)
                                    return [3 /*break*/, 3];
                                return [4 /*yield*/, host.load(r)];
                            case 2:
                                texture = _a.sent();
                                font = new egret.BitmapFont(texture, config);
                                return [2 /*return*/, font];
                            case 3: return [2 /*return*/, null];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
            }
        };
        processor_1.SoundProcessor = {
            onLoadStart: function (host, resource) {
                return __awaiter(this, void 0, void 0, function () {
                    var prefix, sound;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                prefix = resource.extra ? "" : RES.resourceRoot;
                                sound = new egret.Sound();
                                sound.load(prefix + resource.url);
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
                return __awaiter(this, void 0, void 0, function () {
                    var mcData, jsonPath, imagePath, r, mcTexture, mcDataFactory;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.JsonProcessor)];
                            case 1:
                                mcData = _a.sent();
                                jsonPath = resource.name;
                                imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                                r = host.resourceConfig.getResource(imagePath);
                                if (!r) {
                                    throw new RES.ResourceManagerError(1001, imagePath);
                                }
                                return [4 /*yield*/, host.load(r)];
                            case 2:
                                mcTexture = _a.sent();
                                mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
                                return [2 /*return*/, mcDataFactory];
                        }
                    });
                });
            },
            onRemoveStart: function (host, resource) {
                return Promise.resolve();
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
                    case 0:
                        bpp = 2;
                        format = PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                        break;
                    case 1:
                        bpp = 2;
                        format = PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                        break;
                    case 2:
                        bpp = 4;
                        format = PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                        break;
                    case 3:
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
            return PVRParser;
        } ());
        PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
        PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
        PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
        PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;
        if (egret && egret["web"] && egret["web"].WebGLRenderContext) {
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
                            case 0: return [4 /*yield*/, host.load(resource, processor_1.BinaryProcessor)];
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
        var _map = {
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
            "pvr": processor_1.PVRProcessor
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
        return ResourceEvent;
    } (egret.Event));
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
    RES.ResourceEvent = ResourceEvent;
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
            var name = "";
            var config = RES["configInstance"];
            if (!config.config) {
                name = r.url;
            }
            else {
                for (var aliasName in config.config.alias) {
                    if (config.config.alias[aliasName] == r.url) {
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
    var upgrade;
    (function (upgrade) {
        var _level = "warning";
        function setUpgradeGuideLevel(level) {
            _level = level;
        }
        upgrade.setUpgradeGuideLevel = setUpgradeGuideLevel;
        upgrade.checkDecorator = function (target, propertyKey, descriptor) {
            var method = descriptor.value;
            descriptor.value = function () {
                if (!RES['configItem']) {
                    var url = "config.json";
                    RES.resourceRoot = "resource/";
                    RES['configItem'] = { url: url, resourceRoot: RES.resourceRoot, type: "commonjs", name: url };
                    if (_level == "warning") {
                        console.warn("RES.loadConfig() 不再接受参数，强制访问 resource/config.json 文件\n", "请访问以下站点了解更多细节\n", "https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#upgrade-decorator ");
                    }
                }
                return method.apply(this);
            };
        };
    })(upgrade = RES.upgrade || (RES.upgrade = {}));
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
        /**
         * 构造函数
         * @method RES.constructor
         * @private
         */
        function Resource() {
            var _this = _super.call(this) || this;
            _this.loadedGroups = [];
            return _this;
        }
        /**
         * 开始加载配置
         * @method RES.loadConfig
         * @param url {string}
         * @param resourceRoot {string}
         * @param type {string}
         */
        Resource.prototype.loadConfig = function () {
            var _this = this;
            return RES.manager.init().then(function (data) {
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
         * @returns {boolean}
         */
        Resource.prototype.isGroupLoaded = function (name) {
            return this.loadedGroups.indexOf(name) != -1;
        };
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         * @returns {Array<egret.ResourceItem>}
         */
        Resource.prototype.getGroupByName = function (name) {
            return RES.manager.config.getGroupByName(name, true); //这里不应该传入 true，但是为了老版本的 TypeScriptCompiler 兼容性，暂时这样做
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
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.GROUP_LOAD_ERROR, name);
                return Promise.reject(error);
            });
        };
        Resource.prototype._loadGroup = function (name, priority, reporter) {
            if (priority === void 0) { priority = 0; }
            var resources = RES.manager.config.getGroupByName(name, true);
            return RES.manager.load(resources, reporter);
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
            return RES.manager.config.createGroup(name, keys, override);
        };
        /**
         * 检查配置文件里是否含有指定的资源
         * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {boolean}
         */
        Resource.prototype.hasRes = function (key) {
            var name = RES.manager.config.parseResKey(key).key;
            return RES.manager.config.getResource(name) != null;
        };
        /**
         * 通过key同步获取资源
         * @method RES.getRes
         * @param key {string}
         * @returns {any}
         */
        Resource.prototype.getRes = function (resKey) {
            var _a = RES.manager.config.parseResKey(resKey), key = _a.key, subkey = _a.subkey;
            var r = RES.manager.config.getResource(key);
            if (r) {
                var processor_2 = RES.host.isSupport(r);
                if (processor_2 && processor_2.getData && subkey) {
                    return processor_2.getData(RES.host, r, key, subkey);
                }
                else {
                    return RES.host.get(r);
                }
            }
        };
        Resource.prototype.getResAsync = function (key, compFunc, thisObject) {
            var paramKey = key;
            var _a = RES.manager.config.parseResKey(key), key = _a.key, subkey = _a.subkey;
            var r = RES.manager.config.getResource(key, true);
            return RES.manager.load(r).then(function (value) {
                var processor = RES.host.isSupport(r);
                if (processor && processor.getData && subkey) {
                    value = processor.getData(RES.host, r, key, subkey);
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
            var r = RES.manager.config.getResource(url);
            if (!r) {
                if (!type) {
                    type = RES.manager.config.__temp__get__type__via__url(url);
                }
                // manager.config.addResourceData({ name: url, url: url });
                r = { name: url, url: url, type: type, extra: true };
            }
            return RES.manager.load(r).then(function (value) {
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
            var group = RES.manager.config.getGroup(name);
            var remove = function (r) {
                RES.host.unload(r);
                // host.remove(r)
            };
            if (group && group.length > 0) {
                for (var _i = 0, group_2 = group; _i < group_2.length; _i++) {
                    var item = group_2[_i];
                    remove(item);
                }
                return true;
            }
            else {
                var item = RES.manager.config.getResource(name);
                if (item) {
                    remove(item);
                    return true;
                }
                else {
                    console.warn("\u65E0\u6CD5\u5220\u9664\u6307\u5B9A\u7EC4:" + name);
                    return false;
                }
            }
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
            //todo
        };
        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        Resource.prototype.setMaxRetryTimes = function (retry) {
            retry = Math.max(retry, 0);
            //todo
        };
        Resource.prototype.addResourceData = function (data) {
            RES.manager.config.addResourceData(data);
        };
        return Resource;
    } (egret.EventDispatcher));
    __decorate([
        RES.upgrade.checkDecorator,
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
    RES.Resource = Resource;
    /**
     * Resource单例
     */
    var instance = new Resource();
})(RES || (RES = {}));
