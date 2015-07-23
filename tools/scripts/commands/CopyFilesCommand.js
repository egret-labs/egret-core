/// <reference path="../lib/types.d.ts" />
var globals = require("../Globals");
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var CopyFilesCommand = (function () {
    function CopyFilesCommand() {
    }
    CopyFilesCommand.prototype.execute = function () {
        this.copyFilesToNative(params.getProjectRoot(), this.outputPath, this.ignorePathList);
        return 0;
    };
    CopyFilesCommand.prototype.copyFilesToNative = function (projectPath, outputPath, ignorePathList) {
        var url = outputPath;
        var startTime = Date.now();
        //1、清除文件夹
        file.remove(url);
        //2、拷贝文件
        //launcher
        file.copy(file.join(projectPath, "launcher/runtime_loader.js"), file.join(url, "launcher/runtime_loader.js"));
        file.copy(file.join(projectPath, "launcher/native_loader.js"), file.join(url, "launcher/native_loader.js"));
        file.copy(file.join(projectPath, "launcher/native_require.js"), file.join(url, "launcher/native_require.js"));
        //js
        file.copy(file.join(projectPath, "bin-debug/src"), file.join(url, "bin-debug/src"));
        file.copy(file.join(projectPath, "bin-debug/lib/egret_file_list_native.js"), file.join(url, "bin-debug/lib/egret_file_list.js"));
        //libs
        file.copy(file.join(projectPath, "libs"), file.join(url, "libs"));
        //resource
        if (file.exists(file.join(projectPath, "resource"))) {
            this.copyFilesWithIgnore(file.join(projectPath, "resource"), file.join(url, "resource"), ignorePathList);
        }
        globals.log2(7, (Date.now() - startTime) / 1000);
    };
    CopyFilesCommand.prototype.copyFilesWithIgnore = function (sourceRootPath, desRootPath, ignorePathList) {
        ignorePathList = ignorePathList.map(function (item) {
            var reg = new RegExp(item);
            return reg;
        });
        var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath));
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
                file.copy(file.join(copyFilePath), file.join(desRootPath, copyFileRePath));
            }
        });
    };
    return CopyFilesCommand;
})();
module.exports = CopyFilesCommand;
