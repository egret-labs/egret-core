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
        var realCWD = process.cwd();
        var cwd = file.escapePath(args.projectDir);
        files = files.map(function (f) { return f.replace(cwd, ""); });
        if (out)
            out = file.getRelativePath(cwd, out);
        if (outDir)
            outDir = file.getRelativePath(cwd, outDir);
        process.chdir(cwd);
        var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
        args.declaration = defTemp;
        if (compileResult.messages) {
            compileResult.messages.forEach(function (m) { return console.log(m); });
        }
        process.chdir(realCWD);
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

//# sourceMappingURL=../actions/Compiler.js.map