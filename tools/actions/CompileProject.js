/// <reference path="../lib/types.d.ts" />
var Compiler = require("./Compiler");
var FileUtil = require("../lib/FileUtil");
var exmlActions = require("../actions/exml");
var LoadConfig = require("./LoadConfig");
var path = require("path");
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
    CompileProject.prototype.compileProject = function (option, files) {
        //console.log("----compileProject.compileProject----")
        if (files && this.compilerHost) {
            files.forEach(function (f) { return f.fileName = f.fileName.replace(option.projectDir, ""); });
            var realCWD = process.cwd();
            process.chdir(option.projectDir);
            var sourceMap = option.sourceMap;
            if (sourceMap == undefined) {
                sourceMap = this.compilerOptions.sourceMap;
            }
            this.compilerHost = this.compilerHost.compileWithChanges(files, sourceMap);
            process.chdir(realCWD);
        }
        else {
            var compiler = new Compiler();
            var tsList = FileUtil.search(option.srcDir, "ts");
            var libsList = FileUtil.search(option.libsDir, "ts");
            var urlConfig = option.projectDir + "tsconfig.json"; //加载配置文件
            LoadConfig.loadTsConfig(urlConfig, option);
            this.compilerOptions = option.compilerOptions;
            this.compilerOptions.outDir = path.join(option.projectDir, "bin-debug");
            if (option.sourceMap == true) {
                option.compilerOptions.sourceMap = true; //引擎命令行的sourcemap属性优先
            }
            option.compilerOptions.allowUnreachableCode = true;
            option.compilerOptions.emitReflection = true;
            this.compilerHost = compiler.compileGame(this.compilerOptions, tsList.concat(libsList));
        }
        var relative = function (f) { return path.relative(option.projectDir, f); };
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
