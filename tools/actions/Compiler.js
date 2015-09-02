/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
var tsclark = require("../lib/typescript/tsclark");
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.prototype.compile = function (option) {
        var args = option.args, def = option.def, files = option.files, out = option.out, outDir = option.outDir;
        var defTemp = args.declaration;
        args.declaration = def;
        var cwd = file.escapePath(process.cwd() + "/");
        files = files.map(function (f) { return f.replace(cwd, ""); });
        var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
        args.declaration = defTemp;
        return compileResult;
    };
    return Compiler;
})();
tsclark.Compiler.exit = function (exitCode) {
    if (exitCode != 0)
        console.log(utils.tr(10003, exitCode));
    return exitCode;
};
module.exports = Compiler;
