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
var path = require("path");
var FileUtil = require("../lib/FileUtil");
var utils_1 = require("../lib/utils");
var project_1 = require("../project");
var Target = /** @class */ (function () {
    function Target() {
    }
    Target.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option, options, projectName, config, projectRoot, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        option = egret.args;
                        options = parseCommandLine();
                        utils_1.checkEgret();
                        projectName = path.basename(option.projectDir);
                        return [4 /*yield*/, getTargetTemplateConfig()];
                    case 1:
                        config = _a.sent();
                        projectRoot = path.resolve(option.projectDir, '../', projectName + "_" + config.projectType);
                        return [4 /*yield*/, FileUtil.copyAsync(config.templatePath, projectRoot)];
                    case 2:
                        _a.sent();
                        if (config.needSign) {
                            userId = project_1.launcher.getLauncherLibrary().getUserID();
                            if (!userId) {
                                throw '请登录 egret launcher';
                            }
                            project_1.launcher.getLauncherLibrary().sign(projectRoot, userId);
                        }
                        config.args.forEach(function (arg) {
                            arg.files.forEach(function (filename) {
                                var filepath = path.join(projectRoot, filename);
                                var content = FileUtil.read(filepath);
                                var value = options[arg.name];
                                if (!value) {
                                    if (arg.default) {
                                        value = arg.default;
                                    }
                                    else {
                                        throw "\u9700\u8981\u4F20\u9012\u53C2\u6570:--" + arg.name;
                                    }
                                }
                                var reg = new RegExp("{" + arg.name + "}", "gi");
                                content = content.replace(reg, value);
                                FileUtil.save(filepath, content);
                            });
                        });
                        return [2 /*return*/, DontExitCode];
                }
            });
        });
    };
    return Target;
}());
function parseCommandLine() {
    var args = process.argv.slice(2);
    var result = {};
    var i = 0;
    while (i < args.length) {
        var key = args[i++];
        var value;
        ;
        if (key.charAt(0) === '-') {
            if (key.charAt(1) === "-") {
                key = key.slice(2);
                value = args[i++];
            }
            else {
                key = key.slice(1);
                value = true;
            }
            result[key] = value;
        }
    }
    return result;
}
function getTargetTemplateConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var option, templatePath, targetConfigPath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    option = egret.args;
                    templatePath = option.templatePath;
                    if (!templatePath) {
                        throw '请传递 -t [target-template-folder] 参数';
                    }
                    targetConfigPath = path.join(templatePath, 'target.json');
                    return [4 /*yield*/, FileUtil.readJSONAsync(targetConfigPath)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        throw '找不到指定的目标模板 : ' + templatePath;
                    }
                    result.templatePath = path.join(templatePath, 'template');
                    return [2 /*return*/, result];
            }
        });
    });
}
module.exports = Target;
