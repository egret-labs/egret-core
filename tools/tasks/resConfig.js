var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var utils = require("../lib/utils");
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
var TextureMergerResConfigPlugin = /** @class */ (function () {
    function TextureMergerResConfigPlugin(options) {
        var _this = this;
        this.options = options;
        /**
         * {
         *  'textureMerger_wxgame/resource/example.json':
                { url: 'textureMerger_wxgame/resource/example.json',
                subkeys:
                [   'resource/assets/checkbox_unselect.png',
                    'resource/assets/blackBg.png',
                    'resource/assets/close.png',
                    'resource/assets/red.jpg',
                    'resource/assets/whiteBg.png',
                    'resource/assets/redDown.png' ],
                type: 'sheet',
                name: 'example_json' }
            }
         */
        this.sheetFiles = {};
        /**
         * {
         *      'resource/default.res.json': 'resource/',
         *      'resource/de.res.json': 'resource/'
        *  }
         */
        this.sheetRoot = {};
        //从用户读取到的要修改的文件url
        this.resourceConfigFiles = [];
        /** 存储要修改的文件 */
        this.resourceConfig = {};
        /** 要打包的文件夹 */
        this.resourceDirs = {};
        /**
         * 检查是否一个json插入到不同的res.json中
         * @param url
         */
        this.verboseHash = {};
        this.resourceConfigFiles = this.options.resourceConfigFiles.map(function (item) {
            var resourceConfigFile = path.posix.join(item.filename);
            _this.sheetRoot[resourceConfigFile] = item.root;
            _this.resourceDirs[item.root] = true;
            return resourceConfigFile;
        });
    }
    TextureMergerResConfigPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var isRes, root, fileOrigin, subkeys, type, origin, url, name, r;
            return __generator(this, function (_a) {
                isRes = false;
                for (root in this.resourceDirs) {
                    fileOrigin = path.normalize(file.origin);
                    //绝对路径
                    if (fileOrigin.indexOf(path.join(egret.args.projectDir)) >= 0) {
                        if (fileOrigin.indexOf(path.join(egret.args.projectDir, root)) >= 0) {
                            isRes = true;
                        }
                    }
                    //相对路径
                    else {
                        if (path.join(egret.args.projectDir, fileOrigin).indexOf(path.normalize(root)) >= 0) {
                            isRes = true;
                        }
                    }
                }
                if (!isRes) {
                    return [2 /*return*/, file];
                }
                if (file.options) {
                    subkeys = file.options.subkeys;
                    type = file.options.type;
                }
                origin = file.origin;
                url = origin.split("\\").join("/");
                name = this.options.nameSelector(origin);
                /** 存储要修改的文件 */
                if (this.resourceConfigFiles.indexOf(origin) >= 0) {
                    this.resourceConfig[url] = JSON.parse(file.contents.toString());
                }
                if (type == "sheet") {
                    r = { url: url, subkeys: subkeys, type: type, name: name };
                    this.sheetFiles[url] = r;
                }
                return [2 /*return*/, file];
            });
        });
    };
    /**
     * 返回resource/asset/A.png的格式
     * file 和 subkeys 都以这种方式存储
     * @param url url地址
     */
    TextureMergerResConfigPlugin.prototype.getNormalizeUrl = function (url, root) {
        if (root == undefined)
            return url;
        if (url.indexOf(egret.args.projectDir) > -1) {
            return url.slice(egret.args.projectDir.length, url.length);
        }
        if (url.indexOf(root) > -1)
            return url;
        else
            return path.join(root, url);
    };
    /**
     * 返回asset/A.png 的格式
     * 在default.res.json中以无root的格式存储
     * @param url url地址
     */
    TextureMergerResConfigPlugin.prototype.getSpliceRoot = function (url, sliceStr) {
        if (url.indexOf(sliceStr) > -1)
            return url.slice(sliceStr.length, url.length);
        else
            return url;
    };
    TextureMergerResConfigPlugin.prototype.sheetToRes = function (subs) {
        var result = "";
        for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
            var sub = subs_1[_i];
            result += path.basename(sub).split(".").join("_") + ",";
        }
        result = result.slice(0, result.length - 1);
        return result;
    };
    TextureMergerResConfigPlugin.prototype.parseTestureMerger = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var hasConfig, i, sheetFileName, subkeysFile, subkeyHash, _i, _a, subkeyItem;
            return __generator(this, function (_b) {
                hasConfig = false;
                for (i in this.resourceConfig) {
                    hasConfig = true;
                }
                if (!hasConfig) {
                    console.log(utils.tr(1430));
                    global.globals.exit();
                }
                for (sheetFileName in this.sheetFiles) {
                    subkeysFile = this.sheetFiles[sheetFileName];
                    subkeyHash = {};
                    for (_i = 0, _a = subkeysFile.subkeys; _i < _a.length; _i++) {
                        subkeyItem = _a[_i];
                        subkeyHash[path.normalize(subkeyItem)] = true;
                    }
                    this.modifyRES(subkeysFile, subkeyHash, pluginContext);
                }
                return [2 /*return*/];
            });
        });
    };
    TextureMergerResConfigPlugin.prototype.modifyRES = function (subkeysFile, subkeyHash, pluginContext) {
        for (var filename in this.resourceConfig) {
            var resourceConfig_1 = this.resourceConfig[filename];
            var root = this.sheetRoot[filename];
            this.deleteFragmentReference(subkeyHash, resourceConfig_1, root);
            //增加最后的图集和json配置
            //先直接抹去前方的路径，如果没有任何变化，说明资源在res.json的文件上级
            //可能在文件工程中，所以下面在删除一回root
            var relativeJson = this.getSpliceRoot(subkeysFile.url, pluginContext.outputDir);
            if (relativeJson == subkeysFile.url && relativeJson.indexOf(pluginContext.outputDir) > -1) {
                console.log(utils.tr(1422, filename, subkeysFile.name));
                global.globals.exit();
            }
            var subkeys = "";
            //json
            if (typeof (subkeysFile.subkeys) == "string") {
                subkeys = subkeysFile.subkeys;
            }
            else {
                subkeys = this.sheetToRes(subkeysFile.subkeys);
            }
            var json = {
                name: subkeysFile.name,
                type: subkeysFile.type,
                subkeys: subkeys,
                url: this.getSpliceRoot(relativeJson, root)
            };
            this.checkVerbose(json.url, filename);
            this.deleteReferenceByName(subkeysFile.name, resourceConfig_1, root);
            resourceConfig_1.resources.push(json);
            //png
            var imageUrl = subkeysFile.url.replace("json", "png");
            var imgName = subkeysFile.name.replace("json", "png");
            var relativeImage = this.getSpliceRoot(imageUrl, pluginContext.outputDir);
            var image = {
                name: imgName,
                type: "image",
                url: this.getSpliceRoot(relativeImage, root)
            };
            this.deleteReferenceByName(imgName, resourceConfig_1, root);
            resourceConfig_1.resources.push(image);
            var buffer = new Buffer(JSON.stringify(resourceConfig_1));
            pluginContext.createFile(filename, buffer);
        }
    };
    /**
   * 删除碎图的引用，以tmproject新生成的为主
   * @param resourceConfig 对应的res.json数据
   */
    TextureMergerResConfigPlugin.prototype.deleteFragmentReference = function (sheetHash, resourceConfig, root) {
        var newConfig = resourceConfig.resources.concat();
        for (var _i = 0, newConfig_1 = newConfig; _i < newConfig_1.length; _i++) {
            var r = newConfig_1[_i];
            if (sheetHash[this.getNormalizeUrl(r.url, root)]) {
                var index = resourceConfig.resources.indexOf(r);
                resourceConfig.resources.splice(index, 1);
                continue;
            }
        }
    };
    /**
      * 删除可能存在图集的引用，以tmproject新生成的为主
      * @param name 传入的名字应该是preload_0_json格式
      * @param resourceConfig 对应的res.json数据
      */
    TextureMergerResConfigPlugin.prototype.deleteReferenceByName = function (name, resourceConfig, root) {
        var newConfig = resourceConfig.resources.concat();
        for (var _i = 0, newConfig_2 = newConfig; _i < newConfig_2.length; _i++) {
            var r = newConfig_2[_i];
            if (r.name == name) {
                var index = resourceConfig.resources.indexOf(r);
                resourceConfig.resources.splice(index, 1);
                continue;
            }
        }
    };
    TextureMergerResConfigPlugin.prototype.checkVerbose = function (tmjson, resjson) {
        if (!this.options.TM_Verbose)
            return;
        if (this.verboseHash[tmjson] == undefined) {
            this.verboseHash[tmjson] = [];
            this.verboseHash[tmjson].push(resjson);
            return;
        }
        this.verboseHash[tmjson].push(resjson);
        // console.log(this.verboseHash[tmjson].join(",    "));
        console.log(utils.tr(1429, this.verboseHash[tmjson].join(",    ")));
    };
    return TextureMergerResConfigPlugin;
}());
var ConvertResConfigFilePlugin = /** @class */ (function () {
    function ConvertResConfigFilePlugin(options) {
        this.options = options;
        /**
         * 合图插件暂时没有使用
         */
        this.files = {};
        this.tMResConfigPlugin = new TextureMergerResConfigPlugin(options);
    }
    ConvertResConfigFilePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tMResConfigPlugin.onFile(file)];
                    case 1:
                        file = _a.sent();
                        return [2 /*return*/, file];
                }
            });
        });
    };
    ConvertResConfigFilePlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tMResConfigPlugin.parseTestureMerger(commandContext)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
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
            var d = this.resolve(folder);
            if (d) {
                d[basefilename] = __assign({ url: url, type: type, name: name }, r);
            }
        };
        FileSystem.prototype.getFile = function (filename) {
            filename = this.normalize(filename);
            return this.resolve(filename);
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
        FileSystem.prototype.resolve = function (dirpath) {
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
