/// <reference path="../lib/types.d.ts" />
import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import tsc = require("../lib/typescript/tscegret");

class Compiler {
    public compile(option) {
        var args = option.args, def = option.def, files = option.files, out = option.out, outDir = option.outDir;
        console.log(outDir);
        var defTemp = args.declaration;
        args.declaration = def;
        var cwd = file.escapePath(process.cwd() + "/");
        files = files.map(function (f) { return f.replace(cwd, ""); });
        var compileResult = tsc.Compiler.executeWithOption(args, files, out, outDir);
        args.declaration = defTemp;
        return compileResult;
    }
}

export = Compiler;