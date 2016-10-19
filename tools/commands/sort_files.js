/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var Compiler = require('../actions/Compiler');
var SortFiles = (function () {
    function SortFiles() {
    }
    SortFiles.prototype.execute = function (callback) {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var files = FileUtil.search(FileUtil.joinPath(options.projectDir, "src"), "ts");
        var compiler = new Compiler();
        var compileFiles = libFiles.concat(files);
        options['compilerOptions'] = { target: 1, experimentalDecorators: true };
        var result = compiler.compile({
            args: options,
            def: false,
            out: null,
            files: compileFiles,
            forSortFile: true,
            outDir: FileUtil.joinPath(options.projectDir, "tmp")
        });
        var sss = result.files;
        var tsconfigPath = FileUtil.joinPath(options.projectDir, "tsconfig.json");
        var tsconfig = FileUtil.read(tsconfigPath);
        if (!tsconfig || tsconfig == "") {
            tsconfig = "{}";
        }
        var configJson = JSON.parse(tsconfig);
        if (!configJson.compilerOptions) {
            configJson.compilerOptions = {};
        }
        if (!configJson.compilerOptions.outDir) {
            configJson.compilerOptions.outDir = "bin-debug";
        }
        var finalFiles = [];
        result.files.forEach(function (f) {
            if (!f)
                return;
            if (/lib\.d\.ts$/.test(f))
                return;
            finalFiles.push(f);
        });
        configJson.files = finalFiles;
        FileUtil.save(tsconfigPath, JSON.stringify(configJson, null, "\t"));
        return 0;
    };
    return SortFiles;
}());
module.exports = SortFiles;
