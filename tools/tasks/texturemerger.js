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
var utils_1 = require("../lib/utils");
var index_1 = require("../project/index");
var os_1 = require("os");
var utils = require("../lib/utils");
var FileUtil = require("../lib/FileUtil");
var TextureMergerPlugin = /** @class */ (function () {
    function TextureMergerPlugin(options) {
        this.options = options;
        this.tmprojects = [];
        this.removedList = [];
        this.configs = {};
        /** 要打包的文件夹 */
        this.resourceDirs = {};
        for (var _i = 0, _a = this.options.textureMergerRoot; _i < _a.length; _i++) {
            var res = _a[_i];
            if (res.indexOf(egret.args.projectDir) > -1) {
                this.resourceDirs[path.normalize(res)] = true;
            }
            else {
                this.resourceDirs[path.join(egret.args.projectDir, res)] = true;
            }
        }
    }
    TextureMergerPlugin.prototype.onStart = function (pluginContext) {
        var _this = this;
        var projectDir = pluginContext.projectRoot;
        this.tmprojects = [];
        var tmprojectDirs = FileUtil.search(projectDir, 'tmproject');
        for (var _i = 0, tmprojectDirs_1 = tmprojectDirs; _i < tmprojectDirs_1.length; _i++) {
            var tmpUrl = tmprojectDirs_1[_i];
            for (var resourceDir in this.resourceDirs) {
                if (path.normalize(tmpUrl).indexOf(resourceDir) > -1) {
                    this.tmprojects.push(tmpUrl);
                }
            }
        }
        var _loop_1 = function (temprojectUrl) {
            var temProject = FileUtil.readJSONSync(temprojectUrl);
            var tmprojectDir = path.dirname(temprojectUrl);
            var imageFiles = temProject.files.map(function (f) {
                var globalPath = path.resolve(pluginContext.projectRoot, tmprojectDir, f);
                var pa = path.relative(pluginContext.projectRoot, globalPath).split("\\").join("/");
                _this.removedList[pa] = true;
                return pa;
            });
            this_1.configs[temprojectUrl] = imageFiles;
        };
        var this_1 = this;
        for (var _a = 0, _b = this.tmprojects; _a < _b.length; _a++) {
            var temprojectUrl = _b[_a];
            _loop_1(temprojectUrl);
        }
    };
    TextureMergerPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var isRes, root, fileOrigin, extname;
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
                extname = file.extname;
                if (this.removedList[file.origin] || extname == ".tmproject") {
                    return [2 /*return*/, null];
                }
                else {
                    return [2 /*return*/, file];
                }
                return [2 /*return*/];
            });
        });
    };
    TextureMergerPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var texture_merger_path, tempDir, _i, _a, tmprojectFilePath, imageList, tmprojectDir, filename, jsonPath, pngPath, jsonBuffer, pngBuffer, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getTextureMergerPath()];
                    case 1:
                        texture_merger_path = _b.sent();
                        tempDir = path.join(os_1.tmpdir(), 'egret/texturemerger', Math.random().toString());
                        FileUtil.createDirectory(tempDir);
                        _i = 0, _a = this.tmprojects;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        tmprojectFilePath = _a[_i];
                        imageList = this.configs[tmprojectFilePath];
                        return [4 /*yield*/, this.checkTmproject(tmprojectFilePath)];
                    case 3:
                        _b.sent();
                        tmprojectDir = path.dirname(tmprojectFilePath);
                        filename = path.basename(tmprojectFilePath, ".tmproject");
                        jsonPath = path.join(tempDir, filename + ".json");
                        pngPath = path.join(tempDir, filename + ".png");
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 8, , 9]);
                        return [4 /*yield*/, utils_1.shell(texture_merger_path, ["-cp", tmprojectFilePath, "-o", tempDir])];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, FileUtil.readFileAsync(jsonPath, null)];
                    case 6:
                        jsonBuffer = _b.sent();
                        return [4 /*yield*/, FileUtil.readFileAsync(pngPath, null)];
                    case 7:
                        pngBuffer = _b.sent();
                        pluginContext.createFile(path.join(tmprojectDir.split(egret.args.projectDir)[1], filename + ".json"), jsonBuffer, { type: "sheet", subkeys: imageList });
                        pluginContext.createFile(path.join(tmprojectDir.split(egret.args.projectDir)[1], filename + ".png"), pngBuffer);
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _b.sent();
                        if (e_1.code) {
                            console.error(utils.tr(1423, e_1.code));
                            console.error(utils.tr(1424, e_1.path, e_1.args.join(" ")));
                        }
                        else {
                            console.error(e_1);
                        }
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        FileUtil.remove(tempDir);
                        return [2 /*return*/];
                }
            });
        });
    };
    TextureMergerPlugin.prototype.checkTmproject = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var data, tmp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = FileUtil.readFileSync(url, 'utf-8');
                        tmp = JSON.parse(data);
                        if (tmp["options"]["useExtension"] == 1) {
                            return [2 /*return*/];
                        }
                        else {
                            tmp["options"]["useExtension"] = 1;
                            console.log(utils.tr(1425, url));
                        }
                        return [4 /*yield*/, FileUtil.writeFileAsync(url, JSON.stringify(tmp), 'utf-8')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TextureMergerPlugin;
}());
exports.TextureMergerPlugin = TextureMergerPlugin;
function getTextureMergerPath() {
    var toolsList = index_1.launcher.getLauncherLibrary().getInstalledTools();
    var tm = toolsList.filter(function (m) {
        return m.name == "Texture Merger";
    })[0];
    if (!tm) {
        throw utils.tr(1426);
    }
    var isUpperVersion = globals.compressVersion(tm.version, "1.7.0");
    if (isUpperVersion < 0) {
        throw utils.tr(1427);
    }
    switch (process.platform) {
        case 'darwin':
            return tm.path + "/Contents/MacOS/TextureMerger";
            break;
        case 'win32':
            return tm.path + "/TextureMerger.exe";
            break;
    }
    throw utils.tr(1428);
}
