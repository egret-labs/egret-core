/// <reference path="../lib/types.d.ts" />
var Compiler = require('./Compiler');
var FileUtil = require('../lib/FileUtil');
var CompileProject = (function () {
    function CompileProject() {
    }
    CompileProject.prototype.compileProject = function (option, files) {
        var compileResult;
        if (files && this.recompile) {
            files = files.map(function (f) { return f.replace(option.projectDir, ""); });
            compileResult = this.recompile(files);
        }
        else {
            var compiler = new Compiler();
            var tsList = FileUtil.search(option.srcDir, "ts");
            compileResult = compiler.compile({
                args: option,
                files: tsList,
                out: option.out,
                outDir: option.outDir
            });
            this.recompile = compileResult.compileWithChanges;
        }
        var files = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = files;
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
