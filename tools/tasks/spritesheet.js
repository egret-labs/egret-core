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
var os_1 = require("os");
var FileUtil = require("../lib/FileUtil");
var SpriteSheetPlugin = (function () {
    function SpriteSheetPlugin() {
        console.error("spritesheet plugin is not implemented now !");
    }
    SpriteSheetPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, file];
            });
        });
    };
    SpriteSheetPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            function sleep() {
                return new Promise(function (reslove, reject) {
                    setTimeout(function () { reslove(); }, 1000);
                });
            }
            function generateSpriteSheet(spriteSheetFileName, dirname) {
                return __awaiter(this, void 0, void 0, function () {
                    var texture_merger_path, projectRoot, tempDir, jsonPath, pngPath, folder, jsonBuffer, pngBuffer, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTextureMergerPath()];
                            case 1:
                                texture_merger_path = _a.sent();
                                projectRoot = egret.args.projectDir;
                                tempDir = path.join(os_1.tmpdir(), Math.random().toString());
                                FileUtil.createDirectory(tempDir);
                                jsonPath = path.join(tempDir, "temp.json");
                                pngPath = jsonPath.replace('.json', ".png");
                                folder = path.join(projectRoot, "resource", dirname);
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 6, , 7]);
                                return [4 /*yield*/, utils_1.shell(texture_merger_path, ["-p", folder, "-o", jsonPath])];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, FileUtil.readFileAsync(jsonPath, null)];
                            case 4:
                                jsonBuffer = _a.sent();
                                return [4 /*yield*/, FileUtil.readFileAsync(pngPath, null)];
                            case 5:
                                pngBuffer = _a.sent();
                                pluginContext.createFile("111.json", jsonBuffer);
                                pluginContext.createFile('111.png', pngBuffer);
                                return [3 /*break*/, 7];
                            case 6:
                                e_1 = _a.sent();
                                console.log(e_1);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // await engineData.getEgretToolsInstalledList()
                    return [4 /*yield*/, generateSpriteSheet("C:\\Users\\18571\\Desktop\\111.json", 'assets')];
                    case 1:
                        // await engineData.getEgretToolsInstalledList()
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SpriteSheetPlugin;
}());
exports.SpriteSheetPlugin = SpriteSheetPlugin;
function getTextureMergerPath() {
    return "C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe";
    // return `C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe`
}
