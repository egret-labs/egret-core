/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");
import BuildAllModuleCMD = require("./BuildAllModuleCommand");
import CopyFilesCommand = require("./CopyFilesCommand");
import ChangeEntranceCMD = require("./ChangeEntranceCommand");
import BuildProjectCommand = require("./BuildProjectCommand");
import ModifyHtmlsCommand = require("./ModifyHtmlsCommand");
import FileAutoChangeCommand = require("./FileAutoChangeCommand");

class BuildCommand implements egret.Command {
    execute(callback?:(exitCode:number)=>void):number {
        var task = [];

        var needClean = params.hasOption("-clean");
        var onlyEngine = params.hasOption("--module");
        var needAllCompileEngine = params.hasOption("-e");
        var needCompileEngine = needAllCompileEngine || onlyEngine;
        if (needClean && needAllCompileEngine) {
            file.remove(file.join(config.getProjectRoot(), "libs"));
            file.remove(file.join(config.getProjectRoot(), "bin-debug"));
        }

        if (needCompileEngine) {
            task.push(function (tempCallback) {
                var buildAllCmd = new BuildAllModuleCMD();
                buildAllCmd.execute(function (exitCode) {
                    tempCallback();
                })
            });

            task.push(function (tempCallback) {
                var referenceInfo = config.getModuleReferenceInfo();
                var text = JSON.stringify(referenceInfo, null, "\t");
                file.save(file.joinPath(config.getProjectRoot(), "libs/module_reference.json"), text);
                tempCallback();
            });
        }

        if (!onlyEngine) {
            task.push(
                function (tempCallback) {
                    globals.debugLog(1105);

                    var buildP = new BuildProjectCommand();
                    buildP.execute(function(exitCode) {
                        tempCallback();
                    });
                }
            );
        }

        if (true/*(needCompileEngine) || moduleReferenceList*/) {//修改第三方库列表
            task.push(function (tempCallback) {//修改egret_file_list.js文件
                var moduleNames = config.getAllModuleNames();
                var html5List = [];
                var nativeList = [];
                console.log(moduleNames)

                var libRoot = file.join(config.getProjectRoot(), "libs");
                moduleNames.forEach((moduleName)=> {
                    var outputPath = config.getModuleOutput(moduleName);
                    var dJson = file.join(outputPath, moduleName + ".d.json");
                    var dList = JSON.parse(file.read(dJson));
                    var fileList = dList.file_list.map(function (item) {
                        return file.relative(libRoot, file.join(outputPath, item)).replace(".ts", ".js");
                    });

                    if (module["name"] == "html5") {
                        html5List = html5List.concat(fileList);
                    }
                    else if (module["name"] == "native") {
                        nativeList = nativeList.concat(fileList);
                    }
                    else {
                        html5List = html5List.concat(fileList);
                        nativeList = nativeList.concat(fileList);
                    }
                });

                file.save(file.join(config.getProjectRoot(), "bin-debug", "lib", "egret_file_list.js"), "var egret_file_list = " + JSON.stringify(html5List, null, "\t") + ";");
                file.save(file.join(config.getProjectRoot(), "bin-debug", "lib", "egret_file_list_native.js"), "var egret_file_list = " + JSON.stringify(nativeList, null, "\t") + ";");

                console.log(111111)
                tempCallback();
            });
        }


        if (true) {//修改html文件
            task.push(function (tempCallback) {//修改egret_file_list.js文件
                var modify = new ModifyHtmlsCommand();
                modify.execute();
                tempCallback();
            });
        }

        var runtime = params.getOption("--runtime", ["html5", "native"]);
        if (runtime == "native") {
            task.push(//替换native项目内容
                (tempCallback)=> {
                    this.copyFilesToNative();
                    tempCallback();
                }
            );
        }
        var async = require('../../lib/core/async');
        async.series(task, function (err) {
            if (!err) {
                globals.log(1104);
            }
            else {
                globals.exit(err);
            }
        });
        return 0;
    }

    private copyFilesToNative() {
        //修改文件
        var fileModify = new FileAutoChangeCommand();
        fileModify.needCompile = false;
        fileModify.debug = true;
        fileModify.execute();


        var androidRoot = config.getNativePath("android");
        if (androidRoot != null) {
            var url1 = file.join(androidRoot, "proj.android");
            var url2 = file.join(androidRoot, "proj.android/assets");
            if (file.exists(url1)) {//是egret的android项目
                file.remove(file.join(url2, "egret-game"));

                //拷贝项目到native工程中
                var cpFiles = new CopyFilesCommand();
                cpFiles.outputPath = file.join(url2, "egret-game");
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();

                //修改java文件
                var entrance = new ChangeEntranceCMD();
                entrance.initCommand(url1, "android");
                entrance.execute();
            }
        }

        var iosRoot = config.getNativePath("ios");
        if (iosRoot != null) {
            var url1 = file.join(iosRoot, "proj.ios");
            var url2 = file.join(iosRoot, "Resources");

            if (file.exists(url1)) {//是egret的ios项目
                //拷贝项目到native工程中
                var cpFiles = new CopyFilesCommand();
                cpFiles.outputPath = file.join(url2, "egret-game");
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();

                //修改mm文件
                var entrance = new ChangeEntranceCMD();
                entrance.initCommand(url1, "ios");
                entrance.execute();
            }
        }
    }
}

export = BuildCommand;