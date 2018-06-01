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
var utils_1 = require("../lib/utils");
var index_1 = require("../project/index");
var os_1 = require("os");
var FileUtil = require("../lib/FileUtil");
var TextureMergerPlugin = /** @class */ (function () {
    function TextureMergerPlugin(options) {
        this.options = options;
        this.tmprojects = [];
        this.removedList = [];
        this.configs = {};
    }
    TextureMergerPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var extname, filename, data, tmprojectDir_1, imageFiles;
            return __generator(this, function (_a) {
                extname = file.extname;
                if (extname == '.tmproject') {
                    filename = file.origin;
                    this.tmprojects.push(filename);
                    data = JSON.parse(file.contents.toString());
                    tmprojectDir_1 = path.dirname(filename);
                    imageFiles = data.files.map(function (f) {
                        var globalPath = path.resolve(file.base, tmprojectDir_1, f);
                        return path.relative(file.base, globalPath).split("\\").join("/");
                    });
                    this.configs[filename] = imageFiles;
                    this.removedList = this.removedList.concat(imageFiles);
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
            var options, texture_merger_path, projectRoot, tempDir, _i, _a, tm, imageList, tmprojectFilePath, tmprojectDir, filename, jsonPath, pngPath, result, jsonBuffer, pngBuffer, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = this.options;
                        return [4 /*yield*/, getTextureMergerPath()];
                    case 1:
                        texture_merger_path = _b.sent();
                        projectRoot = egret.args.projectDir;
                        tempDir = path.join(os_1.tmpdir(), 'egret/texturemerger', Math.random().toString());
                        FileUtil.createDirectory(tempDir);
                        _i = 0, _a = this.tmprojects;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        tm = _a[_i];
                        imageList = this.configs[tm];
                        tmprojectFilePath = path.join(pluginContext.projectRoot, tm) //options.path;
                        ;
                        tmprojectDir = path.dirname(tm);
                        filename = path.basename(tmprojectFilePath, ".tmproject");
                        jsonPath = path.join(tempDir, filename + ".json");
                        pngPath = path.join(tempDir, filename + ".png");
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, utils_1.shell(texture_merger_path, ["-cp", tmprojectFilePath, "-o", tempDir])];
                    case 4:
                        result = _b.sent();
                        return [4 /*yield*/, FileUtil.readFileAsync(jsonPath, null)];
                    case 5:
                        jsonBuffer = _b.sent();
                        return [4 /*yield*/, FileUtil.readFileAsync(pngPath, null)];
                    case 6:
                        pngBuffer = _b.sent();
                        pluginContext.createFile(path.join(tmprojectDir, filename + ".json"), jsonBuffer, { type: "sheet", subkeys: imageList });
                        pluginContext.createFile(path.join(tmprojectDir, filename + ".png"), pngBuffer);
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        if (e_1.code) {
                            console.error("TextureMerger \u6267\u884C\u9519\u8BEF\uFF0C\u9519\u8BEF\u7801\uFF1A" + e_1.code);
                            console.error("\u6267\u884C\u547D\u4EE4:" + e_1.path + " " + e_1.args.join(" "));
                        }
                        else {
                            console.error(e_1);
                        }
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        FileUtil.remove(tempDir);
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
        throw '请安装 Texture Merger'; //i18n
    }
    var isUpperVersion = globals.compressVersion(tm.version, "1.7.0");
    if (isUpperVersion < 0) {
        throw '请将 Texture Merger 升级至 1.7.0 以上版本';
    }
    switch (process.platform) {
        case 'darwin':
            return tm.path + "/Contents/MacOS/TextureMerger";
            break;
        case 'win32':
            return tm.path + "/TextureMerger.exe";
            break;
    }
    throw '不支持的平台';
}
