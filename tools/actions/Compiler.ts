
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import tsclark = require("../lib/typescript/tsclark");

interface CompileOption {
    args:egret.ToolArgs;
    files?:string[];
    out?:string;
    outDir?:string;
    def?:boolean;
}

class Compiler {
    public compile(option: CompileOption): tsclark.LarkCompileResult {
        var args = option.args,def = option.def, files = option.files,
                   out = option.out, outDir = option.outDir;
        var defTemp = args.declaration;
        args.declaration = def;
        var realCWD = process.cwd();
        var cwd = file.escapePath(args.projectDir);
        files = files.map(f=> f.replace(cwd, ""));
        if (out)
            out = file.getRelativePath(cwd, out);
        if (outDir)
            outDir = file.getRelativePath(cwd, outDir);
        process.chdir(cwd);
        var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
        args.declaration = defTemp;
        if (compileResult.messages) {
            compileResult.messages.forEach(m=> console.log(m));
        }

        process.chdir(realCWD);
        return compileResult;
    }
}

tsclark.Compiler.exit = exitCode => {
    if (exitCode != 0)
        console.log(utils.tr(10003, exitCode));
    return exitCode;
};

export = Compiler;