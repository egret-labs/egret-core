
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import Cordova = require('../actions/Cordova');
import Native = require('../actions/NativeProject');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import APITestTool = require('../actions/APITest');
import CHILD_EXEC = require('child_process');
import APITestCommand = require('./apitest');

import Compiler = require('../actions/Compiler');

class Build implements egret.Command {
    execute(callback?: (exitCode: number) => void): number {
        callback = callback || defaultBuildCallback;
        //如果APITest未通过继续执行APITest
        if(!APITestTool.isTestPass(egret.args.projectDir)){
            var apitest_command = new APITestCommand();
            apitest_command.execute(()=>{
                //成功以后再次执行build
                var build = CHILD_EXEC.exec(
                    'node \"'+FileUtil.joinPath(egret.root,'/tools/bin/egret')+'\" build \"'+egret.args.projectDir+"\"",
                    {
                        encoding: 'utf8',
                        timeout: 0,
                        maxBuffer: 200*1024,
                        killSignal: 'SIGTERM',
                        cwd: process.cwd(),
                        env: process.env
                    });
                build.stderr.on("data", (data) =>{
                    console.log(data);
                });
                build.stdout.on("data",(data)=>{
                    console.log(data);
                });
                build.on("exit", (result)=>{
                    process.exit(result);
                });
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
        var packageJson;
        if(packageJson = FileUtil.read(FileUtil.joinPath(options.projectDir, "package.json"))) {
            packageJson = JSON.parse(packageJson);
            this.buildLib(packageJson);
            return 0;
        }
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/egret/'))) {
            CopyFiles.copyLark();
        }
        service.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, cmd => onGotBuildCommandResult(cmd, callback), true);
        return DontExitCode;
    }

    private buildLib(packageJson):void {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var outDir = "bin";
        var compiler = new Compiler;
        for(var i:number = 0 ; i < packageJson.modules.length ; i++) {
            var module = packageJson.modules[i];
            var files = [];
            for(var j:number = 0 ; j < module.files.length ; j++){
                var file = module.files[j];
                if(file.indexOf(".ts") != -1) {
                    files.push(FileUtil.joinPath(options.projectDir, module.root, file));
                }
            }
            compiler.compile({
                args: options,
                def: false,
                out: null,
                files: libFiles.concat(files),
                outDir: FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp")
            });
            compiler.compile({
                args: options,
                def: true,
                out: FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".js"),
                files: libFiles.concat(files),
                outDir: null
            });

            var str = "";
            for(var j:number = 0 ; j < module.files.length ; j++){
                var file = module.files[j];
                if(file.indexOf(".d.ts") != -1) {
                    FileUtil.copy(FileUtil.joinPath(options.projectDir, module.root, file), FileUtil.joinPath(options.projectDir, outDir, module.name, file));
                }
                else if(file.indexOf(".ts") != -1) {
                    str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp", file.replace(".ts", ".js")));
                    str += "\n";
                }
                else if(file.indexOf(".js") != -1) {
                    str += FileUtil.read(FileUtil.joinPath(options.projectDir, module.root, file.replace(".ts", ".js")));
                    str += "\n";
                }
                //todo exml
            }
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".js"), str);
            var minPath = FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".min.js");
            FileUtil.save(minPath, str);
            utils.minify(minPath,minPath);
            FileUtil.remove(FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp"));
        }
    }
}

function onGotBuildCommandResult(cmd: egret.ServiceCommandResult, callback: (exitCode: number) => void) {
    if (cmd.messages) {
        cmd.messages.forEach(m=> console.log(m));
    }

    if (cmd.exitCode > 10000) {
        console.log(utils.tr(cmd.exitCode));
    }


    Native.build();

    if (!cmd.exitCode && egret.args.platform) {
        setTimeout(() => callback(0), 500);
    }
    else
        callback(cmd.exitCode || 0);
}

function defaultBuildCallback(code) {
    utils.exit(code);
}

export = Build;