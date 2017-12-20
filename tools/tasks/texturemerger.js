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
var index_1 = require("../project/index");
var os_1 = require("os");
var FileUtil = require("../lib/FileUtil");
var TextureMergerPlugin = (function () {
    function TextureMergerPlugin(options) {
        this.options = options;
        console.error("TextureMergerPlugin is not implemented now !");
    }
    TextureMergerPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, file];
            });
        });
    };
    TextureMergerPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            function generateSpriteSheet(spriteSheetFileName, dirname) {
                return __awaiter(this, void 0, void 0, function () {
                    var texture_merger_path, projectRoot, tempDir, jsonPath, pngPath, folder;
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
                                // const tmproject = 
                                try {
                                    // const result = await shell(texture_merger_path, ["-p", folder, "-o", jsonPath]);
                                    // const result = await shell(texture_merger_path, ["-cp", tmproject, "-o", tempDir]);
                                    // const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                                    // const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                                    // pluginContext.createFile("111.json", jsonBuffer);
                                    // pluginContext.createFile('111.png', pngBuffer);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                return [2 /*return*/];
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
    return TextureMergerPlugin;
}());
exports.TextureMergerPlugin = TextureMergerPlugin;
function getTextureMergerPath() {
    var toolsList = index_1.engineData.getLauncherLibrary().getInstalledTools();
    var tm = toolsList.filter(function (m) {
        return m.name == "Texture Merger";
    })[0];
    if (!tm) {
        throw '请安装 Texture Merger'; //i18n
    }
    return tm.path + "/TextureMerger.exe";
}
