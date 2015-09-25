/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
import FileUtil = require('../lib/FileUtil');
var fs = require("fs");
import CopyFilesCommand = require("../commands/copyfile");

class GenerateVersionCommand implements egret.Command {
    execute():number {
        var tempTime = Date.now();
        //globals.debugLog(1407);

        var releasePath = egret.args.releaseDir;
        var ignorePathList = egret.args.properties.getIgnorePath();
        var allPath = FileUtil.joinPath(releasePath, "all.manifest");

        var sourceRoot = egret.args.projectDir;

        var resources = egret.args.properties.getResources();

        if (egret.args.properties.getPublishType(egret.args.runtime) != 1) {
            var config = egret.args.properties;
            var cpFiles = new CopyFilesCommand();
            cpFiles.copyResources(sourceRoot, releasePath, config.getIgnorePath());
            return 0;
        }

        var list = [];
        for (var key in resources) {
            var tempList = FileUtil.search(FileUtil.joinPath(sourceRoot, resources[key]));
            list = list.concat(tempList);
        }
        ignorePathList = ignorePathList.map(function(item) {
            var reg = new RegExp(item);
            return reg;
        });
        var isIgnore = false;
        list = list.filter(function(copyFilePath) {
            isIgnore = false;
            for (var key in ignorePathList) {//检测忽略列表
                var ignorePath = ignorePathList[key];

                if (copyFilePath.match(ignorePath)) {
                    isIgnore = true;
                    break;
                }
            }

            if (copyFilePath.indexOf(".html") != -1 || copyFilePath.indexOf(".css") != -1) {
                return false;
            }

            if(!isIgnore) {//不在忽略列表的路径，拷贝过去
                return true;
            }

        });

        var allVersion = {};

        var length = list.length;

        for(var i = 0 ; i < length ; i++) {
            var filePath = list[i];
            var txt = FileUtil.read(filePath);

            var crc32 = globals.getCrc32();
            var txtCrc32 = crc32(txt);
            var savePath = FileUtil.relative(sourceRoot, filePath);

            allVersion[savePath] = {"v":txtCrc32, "s":fs.statSync(filePath).size};
        }

        FileUtil.save(allPath, JSON.stringify(allVersion));

        for (var tempPath in allVersion) {
            var outputFilePath = FileUtil.joinPath(releasePath, "resource", allVersion[tempPath]["v"].substring(0, 2), allVersion[tempPath]["v"] + "_" + allVersion[tempPath]["s"] + "." + tempPath.substring(tempPath.lastIndexOf(".") + 1));

            FileUtil.copy(FileUtil.joinPath(sourceRoot, tempPath), outputFilePath);
        }

        ////删除原始资源文件
        //for (var key in resources) {
        //    FileUtil.remove(FileUtil.joinPath(releasePath, resources[key]));
        //}
        //
        //FileUtil.copy(FileUtil.joinPath(releasePath, "egretResourceRoot"), FileUtil.joinPath(releasePath, "resource"));
        //
        //FileUtil.remove(FileUtil.joinPath(releasePath, "egretResourceRoot"));

        //globals.debugLog(1408, (Date.now() - tempTime) / 1000);
        return 0;
    }
}

export = GenerateVersionCommand;