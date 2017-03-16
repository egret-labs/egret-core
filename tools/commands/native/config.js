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
var utils_1 = require("../../lib/utils");
var projectConfig = {};
global['globalConfig'] = {};
var configValidator = {};
function getConfig(key) {
    return __awaiter(this, void 0, void 0, function () {
        var result, validator, allConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof key === "string"))
                        return [3 /*break*/, 1];
                    if (projectConfig[key]) {
                        result = projectConfig[key];
                    }
                    if (globalConfig[key]) {
                        result = globalConfig[key];
                    }
                    if (!result) {
                        throw new utils_1.CliException(1000, key);
                    }
                    if (configValidator[key]) {
                        validator = configValidator[key];
                        validator(result);
                    }
                    if (exports.KEY.ANDROID_SUPPORT === key) {
                        if (!testAndroidSupportFilePath(result)) {
                            throw new utils_1.CliException(1001, "cannot find android-support path or path illegal!");
                        }
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getAllConfig()];
                case 2:
                    allConfig = _a.sent();
                    result = key.getter(allConfig);
                    if (key.validator) {
                        key.validator(result);
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, result];
            }
        });
    });
}
exports.getConfig = getConfig;
exports.KEY = {
    ANDROID_SUPPORT: "android_support",
    ANDORID_PROJECT_PATH: "android.project.path",
    ANDROID_SDK: "android-sdk",
    ANT_DIR_PATH: "ant-dir-path"
};
function getAppDataPath() {
    var result;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            result = home + "/Library/Application Support/";
            break;
        case 'win32':
            result = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            break;
        default:
            break;
    }
    return result;
}
function initConfig(projectPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exports.egretProjectPath = projectPath;
                    initProjectConfig();
                    return [4 /*yield*/, initGlobalConfig()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initConfig = initConfig;
function getAllConfig() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Object.assign({}, projectConfig, globalConfig)];
        });
    });
}
exports.getAllConfig = getAllConfig;
function initProjectConfig() {
    if (exports.egretProjectPath) {
        var projectConfigFilename = path.join(exports.egretProjectPath, "egret.config");
        if (!fs.existsSync(projectConfigFilename)) {
            projectConfig = {};
        }
        else {
            var content = fs.readFileSync(projectConfigFilename, "utf-8");
            projectConfig = JSON.parse(content);
        }
    }
}
function initGlobalConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var globalConfigFilename, isExist, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initConfigValidator(exports.KEY.ANDROID_SUPPORT, androidSupportValidator);
                    globalConfigFilename = path.join(getAppDataPath(), "egret.config");
                    return [4 /*yield*/, fs.existsAsync(globalConfigFilename)];
                case 1:
                    isExist = _a.sent();
                    if (!!isExist)
                        return [3 /*break*/, 2];
                    globalConfig = {};
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fs.readFileAsync(globalConfigFilename, "utf-8")];
                case 3:
                    content = _a.sent();
                    globalConfig = JSON.parse(content);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function initConfigValidator(key, validator) {
    configValidator[key] = validator;
}
var androidSupportValidator = function (value) {
    var result = fs.existsSync(value);
    //todo
    // if (false){
    // throw new CliException(1001);
    // }
    return result;
};
function validateConfigs(config, keys) {
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = getConfig(key);
    }
    return config;
}
exports.validateConfigs = validateConfigs;
function setProjectConfig(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var projectConfigFilename, content;
        return __generator(this, function (_a) {
            console.log("=============", key);
            if (typeof key === 'string') {
                projectConfig[key] = value;
            }
            else {
                key.setter(projectConfig, value);
            }
            projectConfigFilename = path.join(exports.egretProjectPath, "egret.config");
            content = JSON.stringify(projectConfig, null, "\t");
            fs.writeFileAsync(projectConfigFilename, content, "utf-8");
            return [2 /*return*/];
        });
    });
}
exports.setProjectConfig = setProjectConfig;
function testAndroidSupportFilePath(value) {
    if (fs.existsSync(value)) {
        var android_support_path = path.join(value, "proj.android");
        if (fs.existsSync(android_support_path)) {
            var propertyFilePath = path.join(android_support_path, "project.properties");
            var manifestFilePath = path.join(android_support_path, "AndroidManifest.xml");
            if (fs.existsSync(propertyFilePath) &&
                fs.existsSync(manifestFilePath)) {
                return true;
            }
        }
    }
    return false;
}
function setGlobaltConfig(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var globalConfigFilename, content;
        return __generator(this, function (_a) {
            if (exports.KEY.ANDROID_SUPPORT === key) {
                if (!testAndroidSupportFilePath(value)) {
                    throw new utils_1.CliException(1001, "cannot find android-support path or path illegal!");
                }
            }
            globalConfig[key] = value;
            globalConfigFilename = path.join(getAppDataPath(), "egret.config");
            content = JSON.stringify(globalConfig, null, "\t");
            fs.writeFileAsync(globalConfigFilename, content, "utf-8");
            return [2 /*return*/];
        });
    });
}
exports.setGlobaltConfig = setGlobaltConfig;
var Selector;
(function (Selector) {
    Selector.android_support_path = {
        getter: function (c) { return c.androidProjectPath; },
        setter: function (c, value) { return c.androidProjectPath = value; }
    };
    Selector.channel_sdk = {
        getter: function (c) { return c.sdk; },
        setter: function (c, value) {
            c.sdk = value;
        }
    };
})(Selector = exports.Selector || (exports.Selector = {}));
