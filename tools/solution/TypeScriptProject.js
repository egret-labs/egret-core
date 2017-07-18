/// <reference path="../lib/types.d.ts" />
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var FileUtil = require("../lib/FileUtil");
var path = require("path");
var Compiler = require("../actions/Compiler");
var watch = require("../lib/watch");
var solution = require("./");
var TypeScriptProject = (function () {
    function TypeScriptProject(projectDir) {
        this.projectDir = projectDir;
    }
    TypeScriptProject.prototype.compile = function (files) {
        var _this = this;
        if (files && this.compilerHost) {
            // files.forEach(f => f.fileName = f.fileName.replace(args.projectDir, ""));
            // var realCWD = process.cwd();
            // process.chdir(args.projectDir);
            this.compilerHost = this.compilerHost.compileWithChanges(files, false);
            // process.chdir(realCWD);
        }
        else {
            var compiler = new Compiler.Compiler();
            var configParsedResult = compiler.parseTsconfig(this.projectDir, egret.args.publish);
            this.compilerOptions = configParsedResult.options;
            var fileNames = configParsedResult.fileNames;
            var tsconfigError = configParsedResult.errors.map(function (d) { return d.messageText.toString(); });
            this.compilerOptions.outDir = path.join(this.projectDir, "bin-debug");
            // this.compilerOptions.outFile = path.join(args.releaseDir, "main.min.js");
            // this.compilerOptions.sourceMap = true;//引擎命令行的sourcemap属性优先
            this.compilerOptions.allowUnreachableCode = true;
            this.compilerOptions.emitReflection = true;
            this.compilerHost = compiler.compile(this.compilerOptions, fileNames);
        }
        var relative = function (f) { return path.relative(_this.projectDir, f); };
        // var fileResult = GetJavaScriptFileNames(this.compilerHost.files.map(relative), /^src\//)
        // this.compilerHost.files = fileResult;
        if (this.compilerHost.messages.length > 0) {
            this.compilerHost.exitStatus = 1303;
        }
        return this.compilerHost;
    };
    return TypeScriptProject;
}());
function GetJavaScriptFileNames(tsFiles, root, prefix) {
    var files = [];
    tsFiles.forEach(function (f) {
        if (!f)
            return;
        if (/\.d\.ts$/.test(f))
            return;
        f = FileUtil.escapePath(f);
        f = f.replace(root, '').replace(/\.ts$/, '.js').replace(/^\//, '');
        if (prefix) {
            f = prefix + f;
        }
        files.push(f);
    });
    return files;
}
var compileChanged = function (fileName, type) {
    if (fileName.indexOf(".ts") >= 0) {
        var fileChanged = { fileName: fileName, type: type };
        console.log(fileChanged);
        console.log("tsc begin");
        host.compileWithChanges([fileChanged]);
        console.log(host.messages);
        console.log("tsc end");
    }
};
var host;
function run(root) {
    watch.createMonitor(root, { persistent: true, interval: 2007, filter: function (f, stat) { return !f.match(/\.g(\.d)?\.ts/); } }, function (m) {
        m.on("created", function (f) { return compileChanged(f, "added"); })
            .on("removed", function (f) { return compileChanged(f, "removed"); })
            .on("changed", function (f) { return compileChanged(f, "modified"); });
    });
    var project = new TypeScriptProject(root);
    console.log("tsc begin");
    host = project.compile();
    console.log(host.messages);
    console.log("tsc end");
}
exports.run = run;
exports.middleware = function (project) {
    var start = "tsc begin";
    var end = "tsc end";
    var process = solution.childProcessWrapper("egret tsc-watch " + project, start, end);
    var getCode = function (output) {
        //todo:performance
    };
    return function () {
        return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var output, code, message;
            return __generator(this, function (_a) {
                response.writeHead(200, { "Content-Type": "application/json" });
                output = process.getOutput();
                code = 0;
                if (output.indexOf(end) >= 0) {
                    if (output.indexOf("Error") >= 0) {
                        code = 2;
                    }
                    else {
                        code = 1;
                    }
                }
                message = JSON.stringify({ output: output, code: code });
                response.end(message);
                return [2 /*return*/];
            });
        }); };
    };
};
