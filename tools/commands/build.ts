/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import Cordova = require('../actions/Cordova');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import APITestTool = require('../actions/APITest');
import CHILD_EXEC = require('child_process');
import APITestCommand = require('./apitest');
import * as project from '../parser/EgretProject';

import Compiler = require('../actions/Compiler');
console.log(utils.tr(1004, 0));
var timeBuildStart: number = (new Date()).getTime();
class Build implements egret.Command {
    execute(callback?: (exitCode: number) => void): number {
        callback = callback || defaultBuildCallback;
        //如果APITest未通过继续执行APITest
        if (!APITestTool.isTestPass(egret.args.projectDir)) {
            var apitest_command = new APITestCommand();
            apitest_command.execute(() => {
                globals.log2(1715);//项目检测成功
                //成功以后再次执行build
                var build = CHILD_EXEC.exec(
                    globals.addQuotes(process.execPath) + " \"" +
                    FileUtil.joinPath(egret.root, '/tools/bin/egret') + '\" build \"' + egret.args.projectDir + "\"",
                    {
                        encoding: 'utf8',
                        timeout: 0,
                        maxBuffer: 200 * 1024,
                        killSignal: 'SIGTERM',
                        cwd: process.cwd(),
                        env: process.env
                    });
                build.stderr.on("data", (data) => {
                    console.log(data);
                });
                build.stdout.on("data", (data) => {
                    console.log(data);
                });
                build.on("exit", (result) => {
                    process.exit(result);
                });
                //返回true截断默认的exit操作
                return true;
            });
            //var build = CHILD_EXEC.exec(
            //    'node \"'+FileUtil.joinPath(egret.root,'/tools/bin/egret')+'\" apitest \"'+egret.args.projectDir+"\"",
            //    {
            //        encoding: 'utf8',
            //        timeout: 0,
            //        maxBuffer: 200*1024,
            //        killSignal: 'SIGTERM',
            //        cwd: process.cwd(),
            //        env: process.env
            //    });
            //build.stderr.on("data", (data) =>{
            //    console.log(data);
            //});
            //build.stdout.on("data",(data)=>{
            //    console.log(data);
            //});
            //build.on("exit", (result)=>{
            //    process.exit(result);
            //});
            return DontExitCode;
        }

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
            CopyFiles.copyToLibs();
        }

        service.execCommand({
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
        var compiler = new Compiler();
        utils.clean(FileUtil.joinPath(options.projectDir, outDir));
        for (let m of packageJson.modules) {
            var files = [];
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
            options['compilerOptions'] = { target: "ES5" as any as number };//ES5
            var compileFiles = libFiles.concat(files);
            if (hasTmpTsFile) {
                compileFiles.push(tmpFilePath);
            }
            //编译js文件到临时目录
            var result = compiler.compile({
                args: options,
                def: false,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp"),
                files: compileFiles,
                outDir: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp")
            });
            //编译dts文件
            compiler.compile({
                args: options,
                def: true,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"),
                files: compileFiles,//,
                outDir: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp")
            });


            //兼容 Wing 用的旧版 TypeScript，删除 readonly 关键字
            let declareFile = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts");
            let dtsContent = FileUtil.read(declareFile);
            dtsContent = dtsContent.replace(/readonly /g, "");
            FileUtil.save(declareFile, dtsContent);

            if (hasTmpTsFile) {
                FileUtil.remove(tmpFilePath);
            }
            var str = "";
            var dtsStr = FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts"));
            if (length > 0) {
                for (var j = 0; j < m.files.length; j++) {
                    var file = m.files[j];
                    if (file.indexOf(".d.ts") != -1) {
                        dtsStr += "\n";
                        dtsStr += FileUtil.read(FileUtil.joinPath(options.projectDir, m.root, file));
                    }
                    else if (file.indexOf(".ts") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp", file.replace(".ts", ".js")));
                        str += "\n";
                    }
                    else if (file.indexOf(".js") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, m.root, file.replace(".ts", ".js")));
                        str += "\n";
                    }
                    //todo exml
                }
            }
            else {
                for (var j = 0; j < result.files.length; j++) {
                    let file = result.files[j];
                    if (file.indexOf(".ts") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp", file.replace(m.root + "/", "").replace(".ts", ".js")));
                        str += "\n";
                    }
                    //todo exml
                }
            }
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts"), dtsStr);
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"), str);
            var minPath = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".min.js");
            FileUtil.save(minPath, str);
            utils.minify(minPath, minPath);
            FileUtil.remove(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp"));
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
