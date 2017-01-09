/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import exmlActions = require('../actions/exml');
import path = require('path');

class CompileProject {
    compile(options: egret.ToolArgs) {
        //console.log("----compileProject.compile----")
        exmlActions.beforeBuild();
        //编译
        exmlActions.build();
        var result = this.compileProject(options);
        exmlActions.afterBuild();
        if (result.exitStatus)
            return null;

        return result;
    }
    private compilerOptions: ts.CompilerOptions;
    public compileProject(args: egret.ToolArgs, files?: egret.FileChanges) {
        //console.log("----compileProject.compileProject----")
        if (files && this.compilerHost) {// console.log("----compileProject.compileProject.B-----")
            files.forEach(f => f.fileName = f.fileName.replace(args.projectDir, ""));
            var realCWD = process.cwd();
            process.chdir(args.projectDir);

            var sourceMap = args.sourceMap;
            if (sourceMap == undefined) {
                sourceMap = this.compilerOptions.sourceMap;
            }
            this.compilerHost = this.compilerHost.compileWithChanges(files, sourceMap);
            process.chdir(realCWD);
        }
        else { //console.log("----compileProject.compileProject.A-----")
            var compiler = new Compiler();
            var tsList = FileUtil.search(args.srcDir, "ts");
            var libsList = FileUtil.search(args.libsDir, "ts");
            let configParsedResult = compiler.loadTsconfig(args.projectDir + "tsconfig.json", args);
            this.compilerOptions = configParsedResult.options;
            args.compilerOptions = configParsedResult.options;
            args.tsconfigError = configParsedResult.errors.map(d => d.messageText.toString());
            this.compilerOptions.outDir = path.join(args.projectDir, "bin-debug");
            if (args.sourceMap == true) {
                this.compilerOptions.sourceMap = true;//引擎命令行的sourcemap属性优先
            }
            this.compilerOptions.allowUnreachableCode = true;
            this.compilerOptions.emitReflection = true;
            this.compilerHost = compiler.compileGame(this.compilerOptions, tsList.concat(libsList));
        }
        let relative = f => path.relative(args.projectDir, f)

        var fileResult = GetJavaScriptFileNames(this.compilerHost.files.map(relative), /^src\//)
        this.compilerHost.files = fileResult;

        if (this.compilerHost.messages.length > 0) {
            this.compilerHost.exitStatus = 1303;
        }

        return this.compilerHost;

    }

    private compilerHost: egret.EgretCompilerHost;
}

function GetJavaScriptFileNames(tsFiles: string[], root: string | RegExp, prefix?: string) {
    var files: string[] = [];
    tsFiles.forEach(f => {
        if (!f)
            return;
        if (/\.d\.ts$/.test(f))
            return;
        f = FileUtil.escapePath(f);
        f = f.replace(<any>root, '').replace(/\.ts$/, '.js').replace(/^\//, '');
        if (prefix) {
            f = prefix + f;
        }
        files.push(f);
    });
    return files;
}


export = CompileProject;
