/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import CHILD_EXEC = require('child_process');
import * as project from '../parser/EgretProject';
import ts = require('../lib/typescript-plus/lib/typescript')

import * as Compiler from '../actions/Compiler';
console.log(utils.tr(1004, 0));
var timeBuildStart: number = (new Date()).getTime();
class Build implements egret.Command {
    execute(callback?: (exitCode: number) => void): number {
        callback = callback || defaultBuildCallback;

        var options = egret.args;
        let packageJsonContent
        if (packageJsonContent = FileUtil.read(project.utils.getFilePath("package.json"))) {
            let packageJson: project.Package_JSON = JSON.parse(packageJsonContent);
            if (packageJson.modules) {//通过有modules来识别是egret库项目
                this.buildLib(packageJson);
                return 0;
            }
        }
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/modules/egret/'))) {
            CompileTemplate.copyToLibs();
        }

        service.client.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, cmd => onGotBuildCommandResult(cmd, callback), true);
        return DontExitCode;
    }

    private buildLib(packageJson: project.Package_JSON): void {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var outDir = "bin";
        var compiler = new Compiler.Compiler();
        utils.clean(FileUtil.joinPath(options.projectDir, outDir));
        for (let m of packageJson.modules) {
            var files: string[];
            var length = m.files.length;
            if (length > 0) {
                files = m.files
                    .filter(file => file.indexOf(".ts") != -1)
                    .map(file => FileUtil.joinPath(options.projectDir, m.root, file))
            }
            else {
                //todo exml
                files = FileUtil.search(FileUtil.joinPath(options.projectDir, m.root), "ts");
            }
            //解决根目录没文件编译异常问题
            var tmpFilePath = FileUtil.joinPath(options.projectDir, m.root, "tmp.ts");
            var hasTmpTsFile = false;
            if (!FileUtil.exists(tmpFilePath)) {
                hasTmpTsFile = true;
                FileUtil.save(tmpFilePath, "");
            }
            else if (FileUtil.read(tmpFilePath) == "") {
                hasTmpTsFile = true;
            }

            let compilerOptions: ts.CompilerOptions = {
                target: ts.ScriptTarget.ES5,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"),
                declaration: true
            };
            var compileFiles = libFiles.concat(files);
            if (hasTmpTsFile) {
                compileFiles.push(tmpFilePath);
            }

            var result = compiler.compile(compilerOptions, compileFiles)

            if (hasTmpTsFile) {
                FileUtil.remove(tmpFilePath);
            }

            var minPath = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".min.js");
            utils.minify(compilerOptions.out, minPath);
        }
    }
}

function onGotBuildCommandResult(cmd: egret.ServiceCommandResult, callback: (exitCode: number) => void) {
    if (cmd.messages) {
        cmd.messages.forEach(m => console.log(m));
    }

    if (!cmd.exitCode && egret.args.platform) {
        setTimeout(() => callback(0), 500);
    }
    else
        callback(cmd.exitCode || 0);
}

function defaultBuildCallback(code) {
    var timeBuildEnd: number = (new Date()).getTime();
    var timeBuildUsed: number = (timeBuildEnd - timeBuildStart) / 1000;
    console.log(utils.tr(1108, timeBuildUsed));
    utils.exit(code);
}
export = Build;
