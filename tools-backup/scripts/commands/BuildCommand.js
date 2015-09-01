/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var config = require('../lib/ProjectConfig');
var globals = require("../Globals");
var BuildAllModuleCMD = require("./BuildAllModuleCommand");
var CopyFilesCommand = require("./CopyFilesCommand");
var ChangeEntranceCMD = require("./ChangeEntranceCommand");
var BuildProjectCommand = require("./BuildProjectCommand");
var ModifyHtmlsCommand = require("./ModifyHtmlsCommand");
var FileAutoChangeCommand = require("./FileAutoChangeCommand");
var ParseConfigCommand = require("./ParseConfigCommand");
var BuildCommand = (function () {
    function BuildCommand() {
    }
    BuildCommand.prototype.execute = function (callback) {
        var _this = this;
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
                });
            });
            task.push(function (tempCallback) {
                var referenceInfo = config.getModuleReferenceInfo();
                var text = JSON.stringify(referenceInfo, null, "\t");
                file.save(file.joinPath(config.getProjectRoot(), "libs/module_reference.json"), text);
                tempCallback();
            });
        }
        if (!onlyEngine) {
            task.push(function (tempCallback) {
                globals.debugLog(1105);
                var buildP = new BuildProjectCommand();
                buildP.execute(function (exitCode) {
                    tempCallback();
                });
            });
        }
        if (true /*(needCompileEngine) || moduleReferenceList*/) {
            task.push(function (tempCallback) {
                var moduleNames = config.getAllModuleNames();
                var html5List = [];
                var nativeList = [];
                var libRoot = file.join(config.getProjectRoot(), "libs");
                moduleNames.forEach(function (moduleName) {
                    var outputPath = config.getModuleOutput(moduleName);
                    var dJson = file.join(outputPath, moduleName + ".d.json");
                    var dList = JSON.parse(file.read(dJson));
                    var fileList = dList.file_list.map(function (item) {
                        return file.relative(libRoot, file.join(outputPath, item)).replace(".ts", ".js");
                    });
                    if (moduleName == "html5") {
                        html5List = html5List.concat(fileList);
                    }
                    else if (moduleName == "native") {
                        nativeList = nativeList.concat(fileList);
                    }
                    else {
                        html5List = html5List.concat(fileList);
                        nativeList = nativeList.concat(fileList);
                    }
                });
                file.save(file.join(config.getProjectRoot(), "bin-debug", "lib", "egret_file_list.js"), "var egret_file_list = " + JSON.stringify(html5List, null, "\t") + ";");
                file.save(file.join(config.getProjectRoot(), "bin-debug", "lib", "egret_file_list_native.js"), "var egret_file_list = " + JSON.stringify(nativeList, null, "\t") + ";");
                tempCallback();
            });
        }
        if (true) {
            task.push(function (tempCallback) {
                var modify = new ModifyHtmlsCommand();
                modify.execute();
                tempCallback();
            });
        }
        var runtime = params.getOption("--runtime", ["html5", "native"]);
        if (runtime == "native") {
            task.push(function (tempCallback) {
                _this.copyFilesToNative();
                tempCallback();
            });
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
    };
    BuildCommand.prototype.copyFilesToNative = function () {
        //修改native项目配置
        new ParseConfigCommand().execute();
        //修改文件
        var fileModify = new FileAutoChangeCommand();
        fileModify.needCompile = false;
        fileModify.debug = true;
        fileModify.execute();
        var androidRoot = config.getNativePath("android");
        if (androidRoot != null) {
            var url1 = file.join(androidRoot, "proj.android");
            var url2 = file.join(androidRoot, "proj.android/assets");
            if (file.exists(url1)) {
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
            if (file.exists(url1)) {
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
    };
    return BuildCommand;
})();
module.exports = BuildCommand;
//# sourceMappingURL=BuildCommand.js.map