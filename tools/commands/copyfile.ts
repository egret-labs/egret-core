/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import EgretProject = require('../project/EgretProject');
//import config = require('../ProjectConfig');
var config = EgretProject.data;
class CopyFilesCommand implements egret.Command {
    outputPath: string;
    ignorePathList: Array<any>;
    execute(): number {
        this.copyFilesToNative(egret.args.projectDir, this.outputPath, this.ignorePathList);
        return 0;
    }

    private copyFilesToNative(projectPath, outputPath, ignorePathList) {
        var startTime = Date.now();

        //1、清除文件夹
        file.remove(outputPath);

        //js
        file.copy(file.joinPath(projectPath, "bin-debug"), file.joinPath(outputPath, "bin-debug"));

        //resource
        this.copyResources(projectPath, outputPath, ignorePathList);

        globals.log2(7, (Date.now() - startTime) / 1000);
    }

    copyResources(projectPath, outputPath, ignorePathList) {
        var resources = config.getResources();
        for (var key in resources) {
            if (file.exists(file.joinPath(projectPath, resources[key]))) {
                this.copyFilesWithIgnore(file.joinPath(projectPath, resources[key]), file.joinPath(outputPath, resources[key]), ignorePathList);
            }
        }
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