
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import tsclark = require("../lib/typescript/tsclark");


class CompileProject {
    public compileProject(option:egret.ToolArgs, files?:string[]) {
        var compileResult: tsclark.Compiler.LarkCompileResult;
        if (files && this.recompile) {
            files = files.map(f=> f.replace(option.projectDir, ""));
            compileResult = this.recompile(files);
        }
        else {
            var compiler = new Compiler();
            var tsList: string[] = FileUtil.search(option.srcDir, "ts");
            compileResult = compiler.compile({
                args: option,
                files: tsList,
                out: option.out,
                outDir: option.outDir
            });
            this.recompile = compileResult.compileWithChanges;
        }
        
        
        var files: string[] = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = files;
        return compileResult;

    }
    
    private recompile: (files: string[]) => tsclark.Compiler.LarkCompileResult;
}

function GetJavaScriptFileNames(tsFiles: string[],root:string|RegExp,prefix?:string) {
    var files: string[] = [];
    tsFiles.forEach(f=> {
        if (!f)
            return;
        if (/\.d\.ts$/.test(f))
            return;
        f = FileUtil.escapePath(f);
        f = f.replace(<any>root, '').replace(/\.ts$/, '.js').replace(/^\//,'');
        if (prefix) {
            f = prefix + f;
        }
        files.push(f);
    });
    return files;
}


export = CompileProject;