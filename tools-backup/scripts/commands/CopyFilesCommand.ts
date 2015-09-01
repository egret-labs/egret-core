/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');

class CopyFilesCommand implements egret.Command {
    outputPath:string;
    ignorePathList:Array<any>;
    execute():number {
        this.copyFilesToNative(params.getProjectRoot(), this.outputPath, this.ignorePathList);
        return 0;
    }

    private copyFilesToNative(projectPath, outputPath, ignorePathList) {
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
        if (file.exists(file.join(projectPath, config.getResourceName()))) {
            this.copyFilesWithIgnore(file.join(projectPath, config.getResourceName()), file.join(url, config.getResourceName()), ignorePathList);
        }

        globals.log2(7, (Date.now() - startTime) / 1000);
    }

    private copyFilesWithIgnore(sourceRootPath, desRootPath, ignorePathList) {
        ignorePathList = ignorePathList.map(function (item) {
            var reg = new RegExp(item);
            return reg;
        });

        var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath));
        var isIgnore = false;
        copyFilePathList.forEach(function (copyFilePath) {
            isIgnore = false;

            for (var key in ignorePathList) {//检测忽略列表
                var ignorePath = ignorePathList[key];

                if (copyFilePath.match(ignorePath)) {
                    isIgnore = true;
                    break;
                }
            }

            if (!isIgnore) {//不在忽略列表的路径，拷贝过去
                var copyFileRePath = file.relative(sourceRootPath, copyFilePath);
                file.copy(file.join(copyFilePath), file.join(desRootPath, copyFileRePath));
            }
        });
    }
}

export = CopyFilesCommand;