var file = require('../lib/FileUtil');
var tsc = require("../lib/typescript/tscegret");
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.prototype.compile = function (option) {
        var args = option.args, def = option.def, files = option.files, out = option.out, outDir = option.outDir;
        console.log(outDir);
        var defTemp = args.declaration;
        args.declaration = def;
        var cwd = file.escapePath(process.cwd() + "/");
        files = files.map(function (f) { return f.replace(cwd, ""); });
        var compileResult = tsc.Compiler.executeWithOption(args, files, out, outDir);
        args.declaration = defTemp;
        return compileResult;
    };
    return Compiler;
})();
module.exports = Compiler;
