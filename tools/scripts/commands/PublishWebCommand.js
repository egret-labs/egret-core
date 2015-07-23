/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var config = require("../lib/ProjectConfig");
var globals = require("../Globals");
var file = require("../lib/FileUtil");
var CompressJsonCMD = require("./CompressJsonCommand");
var CompileFilesCMD = require("./CompileFilesCommand");
var PublishWebCommand = (function () {
    function PublishWebCommand() {
    }
    PublishWebCommand.prototype.execute = function () {
        //获取到版本号
        var versionFile = params.getOption("--version") || Math.round(Date.now() / 1000);
        //当前发布的平台
        this.publish(versionFile);
        return 0;
    };
    PublishWebCommand.prototype.publish = function (versionFile) {
        var _this = this;
        var timeMinSec = Date.now();
        globals.log2(1402, "html5", versionFile + "");
        var projectPath = params.getProjectRoot();
        var releasePath = config.getReleaseRoot();
        var releaseOutputPath = file.join(releasePath, "html5", versionFile + "");
        if (file.exists(releaseOutputPath)) {
            file.remove(releaseOutputPath);
        }
        file.createDirectory(releaseOutputPath);
        var task = [];
        //js文件
        //获取gamelist以及egretlist
        var file_list = config.getAllFileList("html5");
        var needCompile = params.hasOption("-compile") || params.hasOption("-compiler");
        if (true) {
            task.push(function (tempCallback) {
                var adapt = new CompileFilesCMD();
                var options = {
                    "--output": file.joinPath(releaseOutputPath, "launcher", "game-min.js"),
                    "--filelist": file_list
                };
                if (params.hasOption("--method")) {
                    options["--method"] = params.getOption("--method");
                }
                adapt.initOptions(options);
                adapt.execute(function (exitCode) {
                    tempCallback();
                });
            });
        }
        else {
            task.push(function (tempCallback) {
                var tempTime = Date.now();
                //拷贝到ziptemp目录中
                globals.debugLog(1405);
                file_list.map(function (item) {
                    var re = file.relative(projectPath, item);
                    file.copy(item, file.join(releaseOutputPath, re));
                });
                file.copy(file.join(projectPath, "bin-debug", "lib", "egret_file_list.js"), file.join(releaseOutputPath, "bin-debug", "lib", "egret_file_list.js"));
                file.copy(file.join(projectPath, "bin-debug", "src", "game_file_list.js"), file.join(releaseOutputPath, "bin-debug", "src", "game_file_list.js"));
                globals.debugLog(1406, (Date.now() - tempTime) / 1000);
                tempCallback();
            });
        }
        if (true) {
            task.push(function (tempCallback) {
                //拷贝
                //拷贝release.html到外面，并且改名为index.html
                file.copy(file.join(projectPath, "launcher", "release.html"), file.join(releaseOutputPath, "index.html"));
                //拷贝其他的launcher内文件
                _this.copyFilesWithIgnoreList(file.join(projectPath, "launcher"), file.join(releaseOutputPath, "launcher"), ["game-min.js", "index.html", "release.html", "native_loader.js", "runtime_loader.js", "native_require.js"]);
                tempCallback();
            });
        }
        //拷贝其他资源文件
        if (true) {
            task.push(function (tempCallback) {
                file.copy(file.join(projectPath, "resource"), file.join(releaseOutputPath, "resource"));
                var compressJson = new CompressJsonCMD();
                compressJson.initOptions({
                    "--source": releaseOutputPath
                });
                compressJson.execute();
                tempCallback();
            });
        }
        var async = require('../../lib/core/async');
        async.series(task, function (err) {
            if (!err) {
                globals.log2(1413, (Date.now() - timeMinSec) / 1000);
            }
            else {
                globals.exit(err);
            }
        });
    };
    PublishWebCommand.prototype.copyFilesWithIgnoreList = function (sourceRootPath, destRootPath, ignorePathList) {
        var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath));
        ignorePathList = ignorePathList.map(function (item) {
            var reg = new RegExp(item);
            return reg;
        });
        var isIgnore = false;
        copyFilePathList.forEach(function (copyFilePath) {
            isIgnore = false;
            for (var key in ignorePathList) {
                var ignorePath = ignorePathList[key];
                if (copyFilePath.match(ignorePath)) {
                    isIgnore = true;
                    break;
                }
            }
            if (!isIgnore) {
                var copyFileRePath = file.relative(sourceRootPath, copyFilePath);
                file.copy(file.join(copyFilePath), file.join(destRootPath, copyFileRePath));
            }
        });
    };
    return PublishWebCommand;
})();
module.exports = PublishWebCommand;
