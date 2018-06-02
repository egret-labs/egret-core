var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var wing_res_json = "wing.res.json";
var filters = [
    wing_res_json,
];
var EmitResConfigFilePlugin = /** @class */ (function () {
    function EmitResConfigFilePlugin(options) {
        this.options = options;
        this.config = { alias: {}, groups: {}, resources: {} };
        this.fileSystem = new vfs.FileSystem();
        //todo
        this.remoteConfig = { alias: {}, groups: {}, resources: {} };
        this.remoteFileSystem = new vfs.FileSystem();
        this.remoteRoot = '';
        this.fileSystem.init(this.config.resources, "resource");
        this.remoteFileSystem.init(this.remoteConfig.resources, "resource");
        filters.push(options.output);
    }
    EmitResConfigFilePlugin.prototype.executeFilter = function (file) {
        var fileOptions = file.options;
        var filename = file.origin;
        var url = file.relative.split('\\').join("/");
        var config = this.config;
        var options = this.options;
        if (filters.indexOf(filename) >= 0) {
            return null;
        }
        var type = options.typeSelector(filename);
        if (!type) {
            return null;
        }
        var name = options.nameSelector(filename);
        if (fileOptions && fileOptions.subkeys && Array.isArray(fileOptions.subkeys)) {
            fileOptions.subkeys = fileOptions.subkeys.map(function (p) { return options.nameSelector(p); }).join(",");
        }
        var groupName = options.groupSelector(filename);
        if (groupName) {
            if (!config.groups[groupName]) {
                config.groups[groupName] = [];
            }
            var group = config.groups[groupName];
            if (group.indexOf(name) == -1) {
                group.push(name);
            }
        }
        return __assign({ name: name, url: url, type: type }, fileOptions);
    };
    EmitResConfigFilePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, extname, r;
            return __generator(this, function (_a) {
                filename = file.origin;
                extname = file.extname;
                if (filename.indexOf('.res.json') >= 0) {
                    return [2 /*return*/, null];
                }
                if (filename.indexOf('resource/') >= 0) {
                    r = this.executeFilter(file);
                    if (r) {
                        if (file.outputDir) {
                            this.remoteRoot = file.outputDir;
                            this.remoteFileSystem.addFile(r, true);
                        }
                        else {
                            this.fileSystem.addFile(r, true);
                        }
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    EmitResConfigFilePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            function emitResourceConfigFile(debug) {
                var generateConfig = resourceConfig.generateConfig(config, true);
                var content = JSON.stringify(generateConfig, null, "\t");
                var file = "exports.typeSelector = " + options.typeSelector.toString() + ";\nexports.resourceRoot = \"resource\";\nexports.alias = " + JSON.stringify(generateConfig.alias, null, "\t") + ";\nexports.groups = " + JSON.stringify(generateConfig.groups, null, "\t") + ";\nexports.resources = " + JSON.stringify(generateConfig.resources, null, "\t") + ";\n            ";
                return file;
            }
            var options, config, configContent, remoteConfigContent;
            return __generator(this, function (_a) {
                options = this.options;
                config = this.config;
                configContent = path.extname(options.output) == ".js" ? emitResourceConfigFile(true) : resourceConfig.generateClassicalConfig(this.config);
                pluginContext.createFile(options.output, new Buffer(configContent));
                if (this.remoteRoot) {
                    remoteConfigContent = resourceConfig.generateClassicalConfig(this.remoteConfig);
                    pluginContext.createFile(options.output, new Buffer(remoteConfigContent), { outputDir: this.remoteRoot });
                }
                return [2 /*return*/];
            });
        });
    };
    return EmitResConfigFilePlugin;
}());
exports.EmitResConfigFilePlugin = EmitResConfigFilePlugin;
var ConvertResConfigFilePlugin = /** @class */ (function () {
    function ConvertResConfigFilePlugin(options) {
        this.options = options;
        this.files = {};
        this.resourceConfigFiles = [];
        this.resourceConfig = {};
        this.resourceConfigFiles = this.options.resourceConfigFiles.map(function (item) { return path.posix.join(item.root, item.filename); });
    }
    ConvertResConfigFilePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var subkeys, type, url, name, r;
            return __generator(this, function (_a) {
                if (file.options) {
                    subkeys = file.options.subkeys;
                    type = file.options.type;
                }
                url = file.relative.split("\\").join("/");
                name = this.options.nameSelector(file.origin);
                if (this.resourceConfigFiles.indexOf(file.origin) >= 0) {
                    this.resourceConfig[file.origin] = JSON.parse(file.contents.toString());
                }
                else {
                    r = { url: url, subkeys: subkeys, type: type, name: name };
                    this.files[url] = r;
                }
                return [2 /*return*/, file];
            });
        });
    };
    ConvertResConfigFilePlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, resourceConfig_1, _i, _a, r, realURL;
            return __generator(this, function (_b) {
                // const { root, outputDir } = resourceConfig;
                for (filename in this.resourceConfig) {
                    resourceConfig_1 = this.resourceConfig[filename];
                    for (_i = 0, _a = resourceConfig_1.resources; _i < _a.length; _i++) {
                        r = _a[_i];
                        realURL = this.files["resource" + "/" + r.url];
                        // if (realURL) {
                        //     r.url = realURL;
                        // }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    return ConvertResConfigFilePlugin;
}());
exports.ConvertResConfigFilePlugin = ConvertResConfigFilePlugin;
var resourceConfig;
(function (resourceConfig) {
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
    function generateClassicalConfig(config) {
        // {
        // 	"keys": "bg_jpg,egret_icon_png,description_json",
        // 	"name": "preload"
        // }
        var result = {
            groups: [],
            resources: []
        };
        var groups = config.groups;
        for (var groupName in groups) {
            result.groups.push({ name: groupName, keys: groups[groupName].join(",") });
        }
        var resources = config.resources;
        var alias = {};
        for (var aliasName in config.alias) {
            alias[config.alias[aliasName]] = aliasName;
        }
        loop(resources, function (f) {
            var r = f;
            if (alias[r.name]) {
                r.name = alias[r.name];
            }
            result.resources.push(r);
        });
        return JSON.stringify(result, null, "\t");
    }
    resourceConfig.generateClassicalConfig = generateClassicalConfig;
    function generateConfig(config, debug) {
        var loop = function (r) {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) == "string") {
                        continue;
                    }
                    // if (!debug) {
                    //     delete f.name;
                    //     // console.log 
                    //     if (options.typeSelector(f.url) == f.type) {
                    //         delete f.type;
                    //     }
                    //     if (Object.keys(f).length == 1) {
                    //         r[key] = f.url;
                    //     }
                    // }
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
    resourceConfig.generateConfig = generateConfig;
})(resourceConfig || (resourceConfig = {}));
var vfs;
(function (vfs) {
    var FileSystem = /** @class */ (function () {
        function FileSystem() {
            this.root = {};
        }
        FileSystem.prototype.init = function (d, rootPath) {
            this.root = d;
            this.rootPath = rootPath;
            return this.root;
        };
        FileSystem.prototype.addFile = function (r, checkDuplicate) {
            if (checkDuplicate) {
                var a = this.getFile(r.name);
                if (a && this.rootPath + "/" + a.url != r.url) {
                    console.warn("duplicate: " + r.url + " => " + r.name);
                }
            }
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
                d[basefilename] = __assign({ url: url, type: type, name: name }, r);
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
