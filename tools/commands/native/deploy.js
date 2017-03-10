var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
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
var fs = require("../../lib/FileUtil");
var config = require("./config");
var utils_1 = require("../../lib/utils");
var path = require("path");
function run(deployConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var args, android_path, egret_game_android_path, egret_game_android_path_polyfill, shellCommand, android_sdk_path, egret_game_android_sdk_path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("native deploy start!");
                    if (!deployConfig.androidProjectPath) {
                        globals.exit(13000);
                    }
                    args = [
                        "build",
                        config.egretProjectPath,
                        "-e",
                        "--runtime",
                        "native"
                    ];
                    android_path = deployConfig.androidProjectPath;
                    egret_game_android_path = path.resolve(config.egretProjectPath, android_path, "assets/egret-game");
                    egret_game_android_path_polyfill = path.resolve(config.egretProjectPath, android_path, "proj.android/assets/egret-game");
                    shellCommand = process.platform == "win32" ? "egret.cmd" : "egret";
                    return [4 /*yield*/, utils_1.shell(shellCommand, args, {})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.removeAsync(egret_game_android_path)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.moveAsync(egret_game_android_path_polyfill, egret_game_android_path)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fs.removeAsync(egret_game_android_path_polyfill)];
                case 4:
                    _a.sent();
                    if (!deployConfig.sdk)
                        return [3 /*break*/, 6];
                    android_sdk_path = path.resolve(config.egretProjectPath, android_path, "../" + path.basename(android_path) + "." + deployConfig.sdk);
                    egret_game_android_sdk_path = path.resolve(android_sdk_path, "assets/egret-game");
                    return [4 /*yield*/, fs.copyAsync(egret_game_android_path, egret_game_android_sdk_path)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
