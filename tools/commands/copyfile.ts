/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../ProjectConfig');

class CopyFilesCommand implements egret.Command {
    outputPath:string;
    ignorePathList:Array<any>;
    execute():number {
        this.copyFilesToNative(egret.args.projectDir, this.outputPath, this.ignorePathList);
        return 0;
    }

    private copyFilesToNative(projectPath, outputPath, ignorePathList) {
        var url = outputPath;

        var startTime = Date.now();

        //1、清除文件夹
        file.remove(url);


        //2、拷贝文件
        //launcher
        file.copy(file.joinPath(projectPath, "launcher/runtime_loader.js"), file.joinPath(url, "launcher/runtime_loader.js"));
        file.copy(file.joinPath(projectPath, "launcher/native_loader.js"), file.joinPath(url, "launcher/native_loader.js"));
        file.copy(file.joinPath(projectPath, "launcher/native_require.js"), file.joinPath(url, "launcher/native_require.js"));

        //js
        file.copy(file.joinPath(projectPath, "bin-debug/src"), file.joinPath(url, "bin-debug/src"));
        file.copy(file.joinPath(projectPath, "bin-debug/lib/egret_file_list_native.js"), file.joinPath(url, "bin-debug/lib/egret_file_list.js"));

        //libs
        file.copy(file.joinPath(projectPath, "libs"), file.joinPath(url, "libs"));

        //resource
        if (file.exists(file.joinPath(projectPath, config.getResourceName()))) {
            this.copyFilesWithIgnore(file.joinPath(projectPath, config.getResourceName()), file.joinPath(url, config.getResourceName()), ignorePathList);
        }

        globals.log2(7, (Date.now() - startTime) / 1000);
    }

    private copyFilesWithIgnore(sourceRootPath, desRootPath, ignorePathList) {
        ignorePathList = ignorePathList.map(function (item) {
            var reg = new RegExp(item);
            return reg;
        });

        var copyFilePathList = file.getDirectoryAllListing(file.joinPath(sourceRootPath));
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
                file.copy(file.joinPath(copyFilePath), file.joinPath(desRootPath, copyFileRePath));
            }
        });
    }
}

export = CopyFilesCommand;