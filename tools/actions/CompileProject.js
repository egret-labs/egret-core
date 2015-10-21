/// <reference path="../lib/types.d.ts" />
var Compiler = require('./Compiler');
var FileUtil = require('../lib/FileUtil');
var exmlActions = require('../actions/exml');
var CompileProject = (function () {
    function CompileProject() {
    }
    CompileProject.prototype.compile = function (options) {
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
        var compileResult;
        if (files && this.recompile) {
            files.forEach(function (f) { return f.fileName = f.fileName.replace(option.projectDir, ""); });
            var realCWD = process.cwd();
            process.chdir(option.projectDir);
            compileResult = this.recompile(files, option.sourceMap);
            process.chdir(realCWD);
        }
        else {
            var compiler = new Compiler();
            var tsList = FileUtil.search(option.srcDir, "ts");
            var libsList = FileUtil.search(option.libsDir, "ts");
            var compileOptions = {
                args: option,
                files: tsList.concat(libsList),
                out: option.out,
                outDir: option.outDir
            };
            compileResult = compiler.compile(compileOptions);
            this.recompile = compileResult.compileWithChanges;
        }
        var fileResult = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = fileResult;
        return compileResult;
    };
    return CompileProject;
})();
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

//# sourceMappingURL=../actions/CompileProject.js.map