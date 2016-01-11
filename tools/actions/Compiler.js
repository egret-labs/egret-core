/// <reference path="../lib/types.d.ts" />
/// <reference path="../lib/typescript/tsclark.d.ts" />
var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
var tsclark = require("../lib/typescript/tsclark");
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.prototype.compile = function (option) {
        //console.log('---Compiler.compile---')
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
        var parsedCmd = {
            fileNames: files,
            options: {},
            errors: []
        };
        if (out) {
            parsedCmd.options = {
                target: 1,
                sourceMap: args.sourceMap,
                removeComments: args.removeComments,
                declaration: args.declaration,
                out: out
            };
        }
        else {
            //console.log("args.compilerOptions:",parsedCmd.options.outDir)
            if (args.compilerOptions) {
                parsedCmd.options = args.compilerOptions;
            }
            parsedCmd.options.outDir = outDir;
        }
        if (args.sourceMap == true) {
            parsedCmd.options.sourceMap = true; //引擎命令行的sourcemap属性优先
        }
        //var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
        var compileResult = tsclark.Compiler.executeWithOption(parsedCmd);
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

//# sourceMappingURL=Compiler.js.map
