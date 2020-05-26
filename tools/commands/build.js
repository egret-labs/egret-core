var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var utils = require("../lib/utils");
var FileUtil = require("../lib/FileUtil");
var project = require("../project");
var Compiler = require("../actions/Compiler");
var tasks = require("../tasks");
var path = require("path");
var parseConfig = require("../actions/ParseConfig");
var TargetAction_1 = require("../actions/TargetAction");
console.log(utils.tr(1004, 0));
var Build = /** @class */ (function () {
    function Build() {
    }
    Build.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, packageJsonContent, packageJson, res, command, projectRoot, target, projectConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = egret.args;
                        //以package.json判断是否第三方库？
                        if (packageJsonContent = FileUtil.read(project.projectData.getFilePath("package.json"))) {
                            packageJson = JSON.parse(packageJsonContent);
                            if (packageJson.modules) { //通过有modules来识别是egret库项目
                                globals.log(1119);
                                globals.exit(1120);
                                return [2 /*return*/, 0];
                            }
                            if (FileUtil.exists(project.projectData.getFilePath("tsconfig.json"))) {
                                this.buildLib(packageJson);
                                return [2 /*return*/, 0];
                            }
                        }
                        utils.checkEgret();
                        utils.checkPlugin();
                        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/modules/egret/'))) {
                            project.manager.copyToLibs();
                        }
                        res = require('../lib/resourcemanager');
                        command = "build";
                        projectRoot = egret.args.projectDir;
                        tasks.run();
                        target = egret.args.target;
                        projectConfig = parseConfig.parseConfig();
                        return [4 /*yield*/, res.build({ projectRoot: projectRoot, debug: true, command: command, target: target, projectConfig: projectConfig }, TargetAction_1.buildBefore)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, global.exitCode];
                }
            });
        });
    };
    /**
     * 以编译第三方库的形式编译egret项目
     * @param packageJson 包含变异这个项目使用的egret的引擎版本
     */
    Build.prototype.buildLib = function (packageJson) {
        var projectDir = egret.args.projectDir;
        var compiler = new Compiler.Compiler();
        var _a = compiler.parseTsconfig(projectDir, egret.args.publish), options = _a.options, fileNames = _a.fileNames;
        options.emitReflection = true;
        if (options.outDir) {
            console.log(utils.tr(1124));
        }
        // outFile 不存在就直接退出
        var outFile = options.outFile;
        if (!outFile) {
            globals.exit(1122);
        }
        compiler.compile(options, fileNames);
        var outDir = path.dirname(outFile);
        var outFileName = path.basename(outFile);
        var minFile = path.join(outDir, outFileName.replace(".js", ".min.js"));
        options.outFile = minFile;
        options.defines["DEBUG"] = false;
        options.defines["RELEASE"] = true;
        options.declaration = false;
        compiler.compile(options, fileNames);
        utils.minify(minFile, minFile);
        if (options.allowJs) {
            if (packageJson.typings) {
                FileUtil.copy(path.join(projectDir, packageJson.typings), path.join(outDir, path.basename(packageJson.typings)));
            }
            else {
                globals.log(1119);
                globals.exit(1121);
            }
        }
    };
    __decorate([
        utils.measure
    ], Build.prototype, "execute", null);
    return Build;
}());
module.exports = Build;
