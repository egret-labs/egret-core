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
var path = require("path");
var config = require("./config");
var android = require("./android");
var utils_1 = require("../../lib/utils");
var PLATFORM;
(function (PLATFORM) {
    PLATFORM.IOS = "ios";
    PLATFORM.ANDROID = "android";
})(PLATFORM || (PLATFORM = {}));
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var param, androidProjectPathWithEgret, absolutePath, egretPropertiesFilename, egretProperties, android_support_path, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("native create start!");
                    return [4 /*yield*/, config.getAllConfig()];
                case 1:
                    param = _d.sent();
                    console.log("AllConfigShow", param);
                    param = config.validateConfigs(param, [
                        config.KEY.ANDROID_SUPPORT,
                        config.Selector.android_support_path,
                        config.Selector.channel_sdk
                    ]);
                    androidProjectPathWithEgret = param.androidProjectPath;
                    absolutePath = path.resolve(config.egretProjectPath, androidProjectPathWithEgret);
                    egretPropertiesFilename = path.join(config.egretProjectPath, "egretProperties.json");
                    return [4 /*yield*/, fs.readJSONAsync(egretPropertiesFilename, { "encoding": "utf-8" })];
                case 2:
                    egretProperties = _d.sent();
                    egretProperties.native["android_path"] = androidProjectPathWithEgret;
                    return [4 /*yield*/, fs.writeJSONAsync(egretPropertiesFilename, egretProperties)];
                case 3:
                    _d.sent();
                    _b = (_a = path).join;
                    return [4 /*yield*/, config.getConfig(config.KEY.ANDROID_SUPPORT)];
                case 4:
                    android_support_path = _b.apply(_a, [_d.sent(), "proj.android"]);
                    return [4 /*yield*/, fs.copyAsync(android_support_path, absolutePath)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, android.modifyAndroidProject(absolutePath, param.packageName)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, handleSDKProject(param)];
                case 7:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function handleSDKProject(param) {
    return __awaiter(this, void 0, void 0, function () {
        var projectName, projectSdkName, android_support_sdk_path, _a, _b, _c, libIndex, mainActivityPath, sdkPackageName;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    projectName = path.resolve(config.egretProjectPath, param.androidProjectPath);
                    if (!(param.sdk !== undefined))
                        return [3 /*break*/, 7];
                    projectSdkName = path.resolve(projectName, "../" + path.basename(projectName) + "." + param.sdk);
                    param.androidSdkProjectPath = path.relative(process.cwd(), projectSdkName);
                    _b = (_a = path).join;
                    return [4 /*yield*/, config.getConfig(config.KEY.ANDROID_SUPPORT)];
                case 1:
                    android_support_sdk_path = _b.apply(_a, [_d.sent(), "proj.android." + param.sdk]);
                    if (!fs.existsSync(android_support_sdk_path)) {
                        throw new utils_1.CliException(1002, param.sdk);
                    }
                    console.log("copying from " + android_support_sdk_path + " to " + projectSdkName);
                    return [4 /*yield*/, fs.copyAsync(android_support_sdk_path, projectSdkName)];
                case 2:
                    _d.sent();
                    //引用proj.android工程
                    return [4 /*yield*/, android.markAndroidProjectAsLib(projectName)];
                case 3:
                    //引用proj.android工程
                    _d.sent();
                    libIndex = 1;
                    if ("apus" === param.sdk) {
                        libIndex = 5;
                    }
                    return [4 /*yield*/, android.addAndroidProjectLib(projectSdkName, projectName, libIndex)];
                case 4:
                    _d.sent();
                    mainActivityPath = path.join(projectSdkName, "src/com/egret/androidsupport/", param.sdk, "MainActivity.java");
                    console.log("MainActivityPath", mainActivityPath);
                    return [4 /*yield*/, android.changeInheritActivity(mainActivityPath, param.packageName)];
                case 5:
                    _d.sent();
                    sdkPackageName = param.packageName + "." + param.sdk;
                    return [4 /*yield*/, android.modifyAndroidSDKProject(param.sdk, param.androidSdkProjectPath, sdkPackageName)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
