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
var config = require("./config");
var path = require("path");
var utils_1 = require("../../lib/utils");
function run(releaseConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var android_path, sdk, ant_dir, ant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!releaseConfig.androidProjectPath || !releaseConfig.sdk) {
                        globals.exit(13000);
                    }
                    android_path = releaseConfig.androidProjectPath;
                    android_path = path.resolve(config.egretProjectPath, android_path);
                    sdk = releaseConfig.sdk;
                    return [4 /*yield*/, upgradeAntBuildXML("EgretGame", android_path)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, upgradeAntBuildXML("EgretGame." + sdk, android_path + "." + sdk)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, config.getConfig(config.KEY.ANT_DIR_PATH)];
                case 3:
                    ant_dir = _a.sent();
                    ant = path.join(ant_dir, "ant");
                    return [4 /*yield*/, utils_1.shell(ant, ["debug"], { cwd: android_path + "." + sdk })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function upgradeAntBuildXML(name, android_path) {
    return __awaiter(this, void 0, void 0, function () {
        var android_sdk, android_command, args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, config.getConfig(config.KEY.ANDROID_SDK)];
                case 1:
                    android_sdk = _a.sent();
                    android_command = path.join(android_sdk, "tools/android");
                    args = ["update", "project", "--name", name, "--target", "android-19", "--path", android_path];
                    return [4 /*yield*/, utils_1.shell(android_command, args, {})];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
