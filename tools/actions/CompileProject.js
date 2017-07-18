/// <reference path="../lib/types.d.ts" />
// import Compiler = require('./Compiler');
var FileUtil = require("../lib/FileUtil");
var exmlActions = require("../actions/exml");
var path = require("path");
var Compiler = require("./Compiler");
var CompileProject = (function () {
    function CompileProject() {
    }
    CompileProject.prototype.compile = function (options) {
        //console.log("----compileProject.compile----")
        exmlActions.beforeBuild();
        //编译
        exmlActions.build();
        var result = this.compileProject(options);
        exmlActions.afterBuild();
        if (result.exitStatus)
            return null;
        return result;
    };
    CompileProject.prototype.compileProject = function (args, files) {
        //console.log("----compileProject.compileProject----")
        if (files && this.compilerHost) {
            // files.forEach(f => f.fileName = f.fileName.replace(args.projectDir, ""));
            // var realCWD = process.cwd();
            // process.chdir(args.projectDir);
            var sourceMap = args.sourceMap;
            if (sourceMap == undefined) {
                sourceMap = this.compilerOptions.sourceMap;
            }
            this.compilerHost = this.compilerHost.compileWithChanges(files, sourceMap);
            // process.chdir(realCWD);
        }
        else {
            var compiler = new Compiler.Compiler();
            var configParsedResult = compiler.parseTsconfig(egret.args.projectDir, egret.args.publish);
            this.compilerOptions = configParsedResult.options;
            var fileNames = configParsedResult.fileNames;
            args.tsconfigError = configParsedResult.errors.map(function (d) { return d.messageText.toString(); });
            if (args.publish) {
                this.compilerOptions.outFile = path.join(args.releaseDir, "main.min.js");
            }
            else {
                this.compilerOptions.outDir = path.join(args.projectDir, "bin-debug");
            }
            if (args.sourceMap == true) {
                this.compilerOptions.sourceMap = true; //引擎命令行的sourcemap属性优先
            }
            this.compilerOptions.allowUnreachableCode = true;
            this.compilerOptions.emitReflection = true;
            this.compilerHost = compiler.compile(this.compilerOptions, fileNames);
        }
        var relative = function (f) { return path.relative(args.projectDir, f); };
        var fileResult = GetJavaScriptFileNames(this.compilerHost.files.map(relative), /^src\//);
        this.compilerHost.files = fileResult;
        if (this.compilerHost.messages.length > 0) {
            this.compilerHost.exitStatus = 1303;
        }
        return this.compilerHost;
    };
    return CompileProject;
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
module.exports = CompileProject;
