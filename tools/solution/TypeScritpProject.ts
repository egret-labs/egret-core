/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import path = require('path');
import * as Compiler from '../actions/Compiler';
import * as Server from '../server/server';

class TypeScriptProject {

    private compilerOptions: ts.CompilerOptions;

    constructor(private projectDir) {

    }

    public compile(files?: egret.FileChanges) {
        if (files && this.compilerHost) {
            // files.forEach(f => f.fileName = f.fileName.replace(args.projectDir, ""));
            // var realCWD = process.cwd();
            // process.chdir(args.projectDir);
            this.compilerHost = this.compilerHost.compileWithChanges(files, false);
            // process.chdir(realCWD);
        }
        else {
            var compiler = new Compiler.Compiler();
            let configParsedResult = compiler.parseTsconfig();
            this.compilerOptions = configParsedResult.options;
            let fileNames = configParsedResult.fileNames;
            let tsconfigError = configParsedResult.errors.map(d => d.messageText.toString());
            this.compilerOptions.outDir = path.join(this.projectDir, "bin-debug");
            // this.compilerOptions.outFile = path.join(args.releaseDir, "main.min.js");
            // this.compilerOptions.sourceMap = true;//引擎命令行的sourcemap属性优先
            this.compilerOptions.allowUnreachableCode = true;
            this.compilerOptions.emitReflection = true;
            this.compilerHost = compiler.compile(this.compilerOptions, fileNames);
        }
        let relative = f => path.relative(this.projectDir, f)

        var fileResult = GetJavaScriptFileNames(this.compilerHost.files.map(relative), /^src\//)
        this.compilerHost.files = fileResult;

        if (this.compilerHost.messages.length > 0) {
            this.compilerHost.exitStatus = 1303;
        }

        return this.compilerHost;

    }

    private compilerHost: Compiler.EgretCompilerHost;
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


export var middleware: Server.Middleware = () => {

    return async (request, response) => {
        let project = new TypeScriptProject(egret.args.projectDir);
        console.log(111)
        project.compile();
        console.log(112)
    }
}




