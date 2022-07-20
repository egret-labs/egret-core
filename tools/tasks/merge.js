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
var FileUtil = require("../lib/FileUtil");
var utils = require("../lib/utils");
var os = require("os");
var fs = require("fs");
var ZipPlugin = /** @class */ (function () {
    function ZipPlugin(options) {
        this.options = options;
        this._zipCollection = {};
    }
    ZipPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var zipFile;
            return __generator(this, function (_a) {
                zipFile = this.options.mergeSelector(file.origin);
                if (zipFile) {
                    if (!this._zipCollection[zipFile]) {
                        this._zipCollection[zipFile] = [];
                    }
                    this._zipCollection[zipFile].push(file.origin);
                    return [2 /*return*/, null];
                }
                else {
                    return [2 /*return*/, file];
                }
                return [2 /*return*/];
            });
        });
    };
    ZipPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, zipFile, files, buffer;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this._zipCollection)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        zipFile = _a[_i];
                        files = this._zipCollection[zipFile];
                        return [4 /*yield*/, zip(files)];
                    case 2:
                        buffer = _c.sent();
                        pluginContext.createFile(zipFile, buffer, {
                            subkeys: files
                        });
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ZipPlugin;
}());
exports.ZipPlugin = ZipPlugin;
function zip(sourceFiles) {
    return __awaiter(this, void 0, void 0, function () {
        var tempSourceDir, tempDir2, _i, sourceFiles_1, source, output, relativePath, zipLibraryPath, outputPath, contentBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempSourceDir = path.join(os.tmpdir(), "egret_temp_" + Math.random());
                    FileUtil.createDirectory(tempSourceDir);
                    tempDir2 = path.join(os.tmpdir(), "egret_temp_" + Math.random());
                    FileUtil.createDirectory(tempDir2);
                    for (_i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
                        source = sourceFiles_1[_i];
                        output = path.join(tempSourceDir, source);
                        FileUtil.copy(source, output);
                    }
                    relativePath = path.relative(egret.args.projectDir, process.cwd());
                    zipLibraryPath = path.join(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.js");
                    outputPath = path.join(tempDir2, 'output.zip');
                    // await utils.shell(process.execPath, [
                    //     zipLibraryPath,
                    //     "zip",
                    //     outputPath,
                    //     tempSourceDir
                    // ], null, false)
                    return [4 /*yield*/, utils.shell2("cross-zip", [
                            tempSourceDir,
                            outputPath
                        ])];
                case 1:
                    // await utils.shell(process.execPath, [
                    //     zipLibraryPath,
                    //     "zip",
                    //     outputPath,
                    //     tempSourceDir
                    // ], null, false)
                    _a.sent();
                    contentBuffer = fs.readFileSync(outputPath);
                    FileUtil.remove(tempSourceDir);
                    FileUtil.remove(outputPath);
                    return [2 /*return*/, contentBuffer];
            }
        });
    });
}
var MergeEuiJsonPlugin = /** @class */ (function () {
    function MergeEuiJsonPlugin(options) {
        this.options = options;
        this.mergeList = {};
        this.jsonConfig = {};
        this.defaultThm = {};
        this.mergeSelector = function (p) {
            if (p.indexOf("_EUI.json") >= 0) {
                var paths = p.split("/");
                paths.pop();
                return paths.join("/") + "_EUI.json";
            }
            else {
                return null;
            }
        };
        if (!this.options) {
            this.options = {};
        }
        if (!this.options.mergeSelector) {
            this.options.mergeSelector = this.mergeSelector;
        }
        if (this.options.createConfig) {
            this.options.createConfig = true;
        }
        else {
            this.options.createConfig = false;
        }
    }
    MergeEuiJsonPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var mergeResult;
            return __generator(this, function (_a) {
                mergeResult = this.options.mergeSelector(file.origin);
                if (mergeResult) {
                    if (!this.mergeList[mergeResult]) {
                        this.mergeList[mergeResult] = [];
                    }
                    this.mergeList[mergeResult].push({ content: file.contents.toString() });
                    if (this.options.createConfig) {
                        if (!this.jsonConfig[mergeResult]) {
                            this.jsonConfig[mergeResult] = [];
                        }
                        this.jsonConfig[mergeResult].push(file.origin.replace("_EUI.json", ".exml"));
                    }
                    return [2 /*return*/, null];
                }
                if (file.origin.indexOf("default.thm.json") > -1) {
                    this.defaultThm = JSON.parse(file.contents.toString());
                }
                return [2 /*return*/, file];
            });
        });
    };
    MergeEuiJsonPlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, mergeFilename;
            return __generator(this, function (_a) {
                _loop_1 = function (mergeFilename) {
                    var mergeItem = this_1.mergeList[mergeFilename];
                    var json = {};
                    mergeItem.forEach(function (item) {
                        var itemjson = JSON.parse(item.content);
                        for (var i in itemjson) {
                            json[i] = itemjson[i];
                        }
                    });
                    var content = JSON.stringify(json, null, '\t');
                    commandContext.createFile(mergeFilename, new Buffer(content));
                };
                this_1 = this;
                for (mergeFilename in this.mergeList) {
                    _loop_1(mergeFilename);
                }
                if (this.options.createConfig) {
                    this.defaultThm["merge"] = this.jsonConfig;
                    commandContext.createFile("resource/default.thm.json", new Buffer(JSON.stringify(this.defaultThm)));
                }
                return [2 /*return*/];
            });
        });
    };
    return MergeEuiJsonPlugin;
}());
exports.MergeEuiJsonPlugin = MergeEuiJsonPlugin;
