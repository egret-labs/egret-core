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
Object.defineProperty(exports, "__esModule", { value: true });
var wing_res_json = "wing.res.json";
function executeFilter(url) {
    return __awaiter(this, void 0, void 0, function () {
        var type, name;
        return __generator(this, function (_a) {
            if (url == wing_res_json) {
                return [2 /*return*/, null];
            }
            type = ResourceConfig.typeSelector(url);
            name = url;
            if (type) {
                return [2 /*return*/, { name: name, url: url, type: type }];
            }
            else {
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
var EmitResConfigFilePlugin = (function () {
    function EmitResConfigFilePlugin(options) {
        this.options = options;
        ResourceConfig.typeSelector = options.typeSelector;
    }
    EmitResConfigFilePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = file.origin;
                        if (!(filename.indexOf('resource/') === -1)) return [3 /*break*/, 1];
                        return [2 /*return*/, null];
                    case 1: return [4 /*yield*/, executeFilter(filename)];
                    case 2:
                        r = _a.sent();
                        if (r) {
                            r.url = file.relative;
                            ResourceConfig.addFile(r, true);
                            return [2 /*return*/, file];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmitResConfigFilePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            //         async function convertResourceJson(projectRoot: string, config: Data) {
            //             let filename = path.join(projectRoot, "resource/default.res.json");
            //             if (!fs.existsSync(filename)) {
            //                 filename = path.join(projectRoot, "resource/resource.json");
            //             }
            //             if (!fs.existsSync(filename)) {
            //                 return;
            //             }
            //             let resourceJson: legacy.Info = await fs.readJSONAsync(filename);
            //             for (let r of resourceJson.resources) {
            //                 let resourceName = ResourceConfig.nameSelector(r.url);
            //                 let file = ResourceConfig.getFile(resourceName);
            //                 if (!file) {
            //                     if (await fs.existsAsync(path.join(pluginContext.resourceFolder, r.url))) {
            //                         ResourceConfig.addFile(r, false)
            //                     }
            //                     else {
            //                         console.error(`missing file ${r.name} ${r.url} `)
            //                     }
            //                     continue;
            //                 }
            //                 if (file.name != r.name) {
            //                     config.alias[r.name] = file.name;
            //                 }
            //                 for (var resource_custom_key in r) {
            //                     if (resource_custom_key == "url" || resource_custom_key == "name") {
            //                         continue;
            //                     }
            //                     else if (resource_custom_key == "subkeys") {
            //                         var subkeysArr = (r[resource_custom_key] as string).split(",");
            //                         for (let subkey of subkeysArr) {
            //                             // if (!obj.alias[subkeysArr[i]]) {
            //                             config.alias[subkey] = r.name + "#" + subkey;
            //                             file[resource_custom_key] = r[resource_custom_key];
            //                             // }
            //                         }
            //                     }
            //                     else {
            //                         // 包含 type 在内的自定义属性
            //                         file[resource_custom_key] = r[resource_custom_key];
            //                     }
            //                 }
            //             }
            //             for (let group of resourceJson.groups) {
            //                 config.groups[group.name] = group.keys.split(",");
            //             }
            //         }
            function emitResourceConfigFile(debug) {
                return __awaiter(this, void 0, void 0, function () {
                    var userConfig, config, content, file;
                    return __generator(this, function (_a) {
                        userConfig = ResourceConfig.userConfig;
                        config = ResourceConfig.generateConfig(true);
                        content = JSON.stringify(config, null, "\t");
                        file = "exports.typeSelector = " + ResourceConfig.typeSelector.toString() + ";\nexports.resourceRoot = \"" + ResourceConfig.resourceRoot + "\";\nexports.alias = " + JSON.stringify(config.alias, null, "\t") + ";\nexports.groups = " + JSON.stringify(config.groups, null, "\t") + ";\nexports.resources = " + JSON.stringify(config.resources, null, "\t") + ";\n            ";
                        return [2 /*return*/, file];
                    });
                });
            }
            var config, configContent, wingConfigContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = ResourceConfig.getConfig();
                        return [4 /*yield*/, emitResourceConfigFile(true)];
                    case 1:
                        configContent = _a.sent();
                        pluginContext.createFile(this.options.output, new Buffer(configContent));
                        return [4 /*yield*/, ResourceConfig.generateClassicalConfig()];
                    case 2:
                        wingConfigContent = _a.sent();
                        pluginContext.createFile(wing_res_json, new Buffer(wingConfigContent));
                        return [2 /*return*/];
                }
            });
        });
    };
    return EmitResConfigFilePlugin;
}());
exports.EmitResConfigFilePlugin = EmitResConfigFilePlugin;
var ResourceConfig;
(function (ResourceConfig) {
    function loop(r, callback) {
        for (var key in r) {
            var f = r[key];
            if (isFile(f)) {
                callback(f);
            }
            else {
                loop(f, callback);
            }
        }
    }
    function isFile(r) {
        return r.url;
    }
    function getConfig() {
        return config;
    }
    ResourceConfig.getConfig = getConfig;
    function generateClassicalConfig() {
        return __awaiter(this, void 0, void 0, function () {
            var result, resources, alias, aliasName;
            return __generator(this, function (_a) {
                result = {
                    groups: [],
                    resources: []
                };
                resources = config.resources;
                console.log(resources);
                alias = {};
                for (aliasName in config.alias) {
                    alias[config.alias[aliasName]] = aliasName;
                }
                loop(resources, function (f) {
                    var r = f;
                    if (alias[r.name]) {
                        r.name = alias[r.name];
                    }
                    result.resources.push(r);
                });
                return [2 /*return*/, JSON.stringify(result, null, "\t")];
            });
        });
    }
    ResourceConfig.generateClassicalConfig = generateClassicalConfig;
    function generateConfig(debug) {
        var loop = function (r) {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) == "string") {
                        continue;
                    }
                    if (!debug) {
                        delete f.name;
                        // console.log 
                        if (ResourceConfig.typeSelector(f.url) == f.type) {
                            delete f.type;
                        }
                        if (Object.keys(f).length == 1) {
                            r[key] = f.url;
                        }
                    }
                    // if (typeof f === 'string') {
                    //     f = { url: f, name: p };
                    //     r[key] = f;
                    // }
                    // else {
                    //     f['name'] = p;
                    // }
                }
                else {
                    loop(f);
                }
            }
        };
        var isFile = function (r) {
            if (r['url']) {
                return true;
            }
            else {
                return false;
            }
        };
        var generatedData = JSON.parse(JSON.stringify(config.resources));
        loop(generatedData);
        var result = {
            alias: config.alias,
            groups: config.groups,
            resources: generatedData
        };
        return result;
    }
    ResourceConfig.generateConfig = generateConfig;
    var resourcePath;
    function addFile(r, checkDuplicate) {
        var url = r.url, name = r.name;
        url = url.split("\\").join("/");
        name = name.split("\\").join("/");
        r.url = url;
        r.name = name;
        if (checkDuplicate) {
            var a = resourceVfs.getFile(r.name);
            if (a && a.url != r.url) {
                console.warn("duplicate: " + r.url + " => " + a.url);
            }
        }
        resourceVfs.addFile(r);
    }
    ResourceConfig.addFile = addFile;
    function getFile(filename) {
        return resourceVfs.getFile(filename);
    }
    ResourceConfig.getFile = getFile;
})(ResourceConfig || (ResourceConfig = {}));
var vfs;
(function (vfs) {
    var FileSystem = (function () {
        function FileSystem() {
            this.root = {};
        }
        FileSystem.prototype.init = function (d, rootPath) {
            this.root = d;
            this.rootPath = rootPath;
            return this.root;
        };
        FileSystem.prototype.addFile = function (r) {
            var type = r.type, name = r.name, url = r.url;
            if (!type)
                type = "";
            name = this.normalize(name);
            url = this.normalize(url);
            r.name = name;
            r.url = url;
            var basefilename = this.basename(name);
            var folder = this.dirname(name);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            var d = this.reslove(folder);
            if (d) {
                d[basefilename] = { url: url, type: type, name: name };
            }
        };
        FileSystem.prototype.getFile = function (filename) {
            filename = this.normalize(filename);
            return this.reslove(filename);
        };
        FileSystem.prototype.basename = function (filename) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        };
        FileSystem.prototype.normalize = function (filename) {
            var _this = this;
            return filename.split("/").filter(function (d) { return !!d && d != _this.rootPath; }).join("/");
        };
        FileSystem.prototype.dirname = function (path) {
            return path.substr(0, path.lastIndexOf("/"));
        };
        FileSystem.prototype.reslove = function (dirpath) {
            if (dirpath == "") {
                return this.root;
            }
            var list = dirpath.split("/");
            var current = this.root;
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var f = list_1[_i];
                current = current[f];
                if (!current) {
                    return null;
                }
            }
            return current;
        };
        FileSystem.prototype.mkdir = function (dirpath) {
            dirpath = this.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.root;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var f = list_2[_i];
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f];
            }
        };
        FileSystem.prototype.exists = function (dirpath) {
            if (dirpath == "")
                return true;
            dirpath = this.normalize(dirpath);
            var list = dirpath.split("/");
            var current = this.root;
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var f = list_3[_i];
                if (!current[f]) {
                    return false;
                }
                current = current[f];
            }
            return true;
        };
        return FileSystem;
    }());
    vfs.FileSystem = FileSystem;
})(vfs || (vfs = {}));
var config = { alias: [], groups: [], resources: {} };
var resourceVfs = new vfs.FileSystem();
resourceVfs.init(config.resources, "resource");
