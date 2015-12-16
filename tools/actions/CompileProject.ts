
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import tsclark = require("../lib/typescript/tsclark");
import fs = require("fs");
import exmlActions = require('../actions/exml');
import LoadConfig = require('./LoadConfig');

class CompileProject {
    compile(options: egret.ToolArgs) {
        //console.log("----compileProject.compile----")
        exmlActions.beforeBuild();
        //编译
        exmlActions.build();
        var result = this.compileProject(options);
        exmlActions.afterBuild();
        if(result.exitStatus)
            return null;

        return result;
    }
    public compileProject(option: egret.ToolArgs, files?: egret.FileChanges) {
        //console.log("----compileProject.compileProject----")
        var compileResult: tsclark.LarkCompileResult;
        if (files && this.recompile) {// console.log("----compileProject.compileProject.A-----")
            files.forEach(f=> f.fileName = f.fileName.replace(option.projectDir, ""));
            var realCWD = process.cwd();
            process.chdir(option.projectDir);
            compileResult = this.recompile(files, option.sourceMap);
            process.chdir(realCWD);
        }
        else {// console.log("----compileProject.compileProject.B-----")
            var compiler = new Compiler();
            var tsList: string[] = FileUtil.search(option.srcDir, "ts");
            var libsList:string[] = FileUtil.search(option.libsDir, "ts");
            var urlConfig = option.projectDir + "tsconfig.json";
            var arr = LoadConfig.loadTsConfig(urlConfig);//加载配置文件
            option.tsconfig = arr[0];
            option.tsconfigerr = arr[1];
            var compileOptions = {
                args: option,
                files: tsList.concat(libsList),
                out: option.out,
                outDir: option.outDir
            };
            if(arr[1].length>0){
                for(var i=0,len=arr[1].length;i<len;i++){
                    console.log(arr[1][i]);//builde -e 的时候输出信息
                }
            }
            compileResult = compiler.compile(compileOptions);
            this.recompile = compileResult.compileWithChanges;
        }

        var fileResult: string[] = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = fileResult;

        return compileResult;

    }

    private recompile: (files: egret.FileChanges, sourceMap?: boolean) => tsclark.LarkCompileResult;
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
