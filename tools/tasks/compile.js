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
var EgretProject = require("../project");
var fs = require("fs");
var FileUtil = require("../lib/FileUtil");
var Compiler = require("../actions/Compiler");
var utils = require("../lib/utils");
var compiler = new Compiler.Compiler();
var defaultDefines = { DEBUG: true, RELEASE: false };
var CompilePlugin = /** @class */ (function () {
    function CompilePlugin(options) {
        this.options = options;
        if (!this.options) {
            this.options = { libraryType: "release", defines: defaultDefines };
        }
        if (!this.options.libraryType) {
            this.options.libraryType = "release";
        }
        if (!this.options.defines) {
            this.options.defines = defaultDefines;
        }
    }
    CompilePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, file];
            });
        });
    };
    CompilePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var target, projectRoot, scripts, jscode, filepath, htmlContent, srcPath;
            return __generator(this, function (_a) {
                target = egret.args.target;
                projectRoot = pluginContext.projectRoot;
                scripts = EgretProject.manager.copyLibsForPublish(target, this.options.libraryType);
                scripts.forEach(function (script) {
                    pluginContext.createFile(script, fs.readFileSync(FileUtil.joinPath(pluginContext.projectRoot, script)));
                });
                jscode = tinyCompiler(this.options.defines);
                pluginContext.createFile("main.js", new Buffer(jscode));
                if (target == 'web' || target == 'ios' || target == 'android') {
                    filepath = FileUtil.joinPath(projectRoot, 'template/web/index.html');
                    htmlContent = fs.readFileSync(filepath);
                    pluginContext.createFile("index.html", htmlContent);
                }
                srcPath = FileUtil.joinPath(projectRoot, 'src');
                return [2 /*return*/];
            });
        });
    };
    CompilePlugin.prototype.onFileChanged = function (fileChanged) {
        compiler.compileWithChanges(fileChanged);
    };
    return CompilePlugin;
}());
exports.CompilePlugin = CompilePlugin;
var UglifyPlugin = /** @class */ (function () {
    function UglifyPlugin(param) {
        this.codes = {};
        this.matchers = param;
    }
    UglifyPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, _i, _a, matcher;
            return __generator(this, function (_b) {
                filename = file.origin;
                if (file.extname != ".js") {
                    return [2 /*return*/, file];
                }
                for (_i = 0, _a = this.matchers; _i < _a.length; _i++) {
                    matcher = _a[_i];
                    if (matcher.sources.indexOf(filename) >= 0) {
                        this.codes[filename] = file.contents.toString();
                        return [2 /*return*/, null];
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    UglifyPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _i, _a, matcher, jscode;
            return __generator(this, function (_b) {
                for (_i = 0, _a = this.matchers; _i < _a.length; _i++) {
                    matcher = _a[_i];
                    jscode = utils.uglify(matcher.sources.map(function (s) {
                        var code = _this.codes[s];
                        if (!code) {
                            throw "missing source file " + s;
                        }
                        return code;
                    }));
                    pluginContext.createFile(matcher.target, new Buffer(jscode));
                }
                return [2 /*return*/];
            });
        });
    };
    return UglifyPlugin;
}());
exports.UglifyPlugin = UglifyPlugin;
function tinyCompiler(defines) {
    var os = require('os');
    var outfile = FileUtil.joinPath(os.tmpdir(), 'main.min.js');
    var options = egret.args;
    options.minify = true;
    options.publish = true;
    var configParsedResult = compiler.parseTsconfig(options.projectDir, options.publish);
    var compilerOptions = configParsedResult.options;
    var fileNames = configParsedResult.fileNames;
    var tsconfigError = configParsedResult.errors.map(function (d) { return d.messageText.toString(); });
    compilerOptions.outFile = outfile;
    compilerOptions.allowUnreachableCode = true;
    compilerOptions.emitReflection = true;
    compilerOptions.defines = defines;
    var compilerHost = compiler.compile(compilerOptions, fileNames);
    if (compilerHost.messages && compilerHost.messages.length > 0) {
        global.exitCode = 1;
    }
    var jscode = fs.readFileSync(outfile);
    return jscode;
}
