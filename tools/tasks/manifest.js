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
var fs = require("fs");
var EgretProject = require("../project");
var utils = require("../lib/utils");
var manifest = {
    initial: [],
    game: [],
};
var ManifestPlugin = /** @class */ (function () {
    function ManifestPlugin(options) {
        this.options = options;
        this.verboseInfo = [];
        this.ttSignature = []; //tt小游戏的签名列表
        if (!this.options) {
            this.options = { output: "manifest.json" };
        }
        if (options.hash) {
            console.log('ManifestPlugin 在未来的 5.3.x 版本中将不再支持 hash 参数，请使用 RenamePlugin 代替');
        }
        if (!this.options.useWxPlugin) {
            this.options.useWxPlugin = false;
        }
        if (!this.options.qqPlugin) {
            this.options.qqPlugin = { use: false, pluginList: [] };
        }
    }
    ManifestPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, extname, new_file_path, basename, target, _a, useWxPlugin, hash, verbose, ttgame, new_basename, isEngineJS, engineJS, i, jsName, engine_path, crc32, crc32_file_path, config, vivoData, relative;
            return __generator(this, function (_b) {
                filename = file.relative;
                extname = path.extname(filename);
                if (extname == ".js") {
                    new_file_path = void 0;
                    basename = path.basename(filename);
                    target = egret.args.target;
                    _a = this.options, useWxPlugin = _a.useWxPlugin, hash = _a.hash, verbose = _a.verbose;
                    ttgame = EgretProject.projectData.getMiniGame('ttgame');
                    new_basename = basename.substr(0, basename.length - file.extname.length);
                    isEngineJS = false;
                    if ((target == "ttgame" && ttgame.usePlugin) || (target == "wxgame" && useWxPlugin)) {
                        engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween'];
                        for (i in engineJS) {
                            jsName = engineJS[i];
                            engine_path = jsName + '.min.js';
                            if (filename.indexOf(engine_path) > 0) {
                                isEngineJS = true;
                                if (target == "ttgame") {
                                    this.ttSignature.push({
                                        "path": engine_path,
                                        "md5": utils.createHash(String(file.contents))
                                    });
                                }
                            }
                        }
                    }
                    if (isEngineJS) {
                        new_file_path = "egret-library/" + new_basename + file.extname;
                    }
                    else if (hash == 'crc32') {
                        crc32 = globals.getCrc32();
                        crc32_file_path = crc32(file.contents);
                        new_file_path = "js/" + new_basename + "_" + crc32_file_path + file.extname;
                    }
                    else {
                        new_file_path = "js/" + new_basename + file.extname;
                    }
                    file.outputDir = "";
                    file.path = path.join(file.base, new_file_path);
                    if (target == 'vivogame') {
                        config = EgretProject.projectData;
                        vivoData = config.egretProperties.vivo;
                        file.path = path.join(file.base, '../', 'engine', new_file_path);
                        if (vivoData.usePlugin) { //使用插件
                            if (vivoData.plugins.indexOf(basename) > -1) {
                                file.path = path.join(file.base, '../', 'egret-library', basename);
                            }
                        }
                    }
                    else if (target == "ttgame") {
                        EgretProject.projectData.setMiniGameData('ttgame', 'signature', this.ttSignature);
                    }
                    relative = file.relative.split("\\").join('/');
                    if (file.origin.indexOf('libs/') >= 0) {
                        manifest.initial.push(relative);
                    }
                    else {
                        manifest.game.push(relative);
                    }
                    if (verbose) {
                        this.verboseInfo.push({ filename: filename, new_file_path: new_file_path });
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    ManifestPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, output, useWxPlugin, qqPlugin, outputDir, extname, ttgame, contents, target, pluginContents;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.options, output = _a.output, useWxPlugin = _a.useWxPlugin, qqPlugin = _a.qqPlugin;
                        outputDir = pluginContext.outputDir;
                        extname = path.extname(output);
                        ttgame = EgretProject.projectData.getMiniGame('ttgame');
                        contents = '';
                        target = pluginContext.buildConfig.target;
                        switch (extname) {
                            case ".json":
                                contents = JSON.stringify(manifest, null, '\t');
                                break;
                            case ".js":
                                contents = manifest.initial.concat(manifest.game).map(function (fileName) {
                                    var result = "require(\"./" + fileName + "\")";
                                    if (target == 'vivogame') {
                                        var configPath = path.join(outputDir, "../", "minigame.config.js");
                                        if (!fs.existsSync(configPath)) {
                                            //5.2.28版本，vivo更新了项目结构，老项目需要升级
                                            fs.writeFileSync(path.join(outputDir, "../", "vivo更新了项目结构，请重新创建vivo小游戏项目.js"), "vivo更新了项目结构，请重新创建vivo小游戏项目");
                                        }
                                        var _name = path.basename(fileName);
                                        result = "require(\"./js/" + _name + "\")";
                                    }
                                    else if ((target == "ttgame" && ttgame.usePlugin) || (target == "wxgame" && useWxPlugin)) {
                                        if (fileName.indexOf('egret-library') == 0) {
                                            result = "requirePlugin(\"" + fileName + "\")";
                                        }
                                    }
                                    return result;
                                }).join("\n");
                                break;
                        }
                        if (qqPlugin.use) {
                            contents = qqPlugin.pluginList.join("\n") + "\n" + contents;
                        }
                        return [4 /*yield*/, utils.pluginManifest(manifest, outputDir)];
                    case 1:
                        pluginContents = _b.sent();
                        contents = pluginContents === null ? contents : pluginContents;
                        if (target == 'tbcreativeapp' || target == 'tbcreativewidget') { //淘宝小游戏，需要把 main.js 放在最后
                            contents = contents.replace('require("./js/main.js")\n', '');
                            contents += '\nrequire("./js/main.js")';
                        }
                        pluginContext.createFile(output, new Buffer(contents));
                        if (this.options.verbose) {
                            this.verboseInfo.forEach(function (item) {
                                console.log("manifest-plugin: " + item.filename + " => " + item.new_file_path);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ManifestPlugin;
}());
exports.ManifestPlugin = ManifestPlugin;
