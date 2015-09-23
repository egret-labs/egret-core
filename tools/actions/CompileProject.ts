
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import tsclark = require("../lib/typescript/tsclark");


class CompileProject {
    public compileProject(option: egret.ToolArgs, files?: egret.FileChanges) {
        var compileResult: tsclark.LarkCompileResult;
        if (files && this.recompile) {
            files.forEach(f=> f.fileName = f.fileName.replace(option.projectDir, ""))
            compileResult = this.recompile(files);
        }
        else {
            var compiler = new Compiler();
            var tsList: string[] = FileUtil.search(option.srcDir, "ts");
            var compileOptions = {
                args: option,
                files: tsList,
                out: option.out,
                outDir: option.outDir
            };
            compileResult = compiler.compile(compileOptions);
            this.recompile = compileResult.compileWithChanges;
        }
        
        
        var fileResult: string[] = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = fileResult;
        return compileResult;

    }

    private recompile: (files: egret.FileChanges) => tsclark.LarkCompileResult;
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