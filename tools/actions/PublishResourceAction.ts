/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
import FileUtil = require('../lib/FileUtil');
var fs = require("fs");
import CopyFilesCommand = require("../commands/copyfile");
import EgretProject = require('../project/EgretProject');


function publishResourceOrigin(projectDir: string, releaseDir: string) {
    var config = EgretProject.data;
    var cpFiles = new CopyFilesCommand();
    cpFiles.copyResources(projectDir, releaseDir, config.getIgnorePath());
    return 0;
}

function publishResourceWithVersion(projectDir: string, releaseDir: string) {
    var ignorePathList = EgretProject.data.getIgnorePath();
    var allPath = FileUtil.joinPath(releaseDir, "all.manifest");

    let resources = EgretProject.data.getResources();
    var list = [];
    for (let r of resources) {
        let tempList = FileUtil.search(FileUtil.joinPath(projectDir, r));
        list = list.concat(tempList);
    }
    ignorePathList = ignorePathList.map(function (item) {
        var reg = new RegExp(item);
        return reg;
    });
    var isIgnore = false;
    list = list.filter(function (copyFilePath) {
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

        if (!isIgnore) {//不在忽略列表的路径，拷贝过去
            return true;
        }

    });

    var allVersion = {};

    const copyExmlList = EgretProject.data.getCopyExmlList();
    for (let filePath of list) {
        if (copyExmlList.length && filePath.slice(filePath.lastIndexOf(".") + 1) == "exml") {
            var needCopy = false;
            for (var j = 0; j < copyExmlList.length; j++) {
                if (filePath.indexOf(copyExmlList[j]) != -1) {
                    needCopy = true;
                    break;
                }
            }
            if (!needCopy) {
                continue;
            }
        }
        var txt = FileUtil.read(filePath);

        var crc32 = globals.getCrc32();
        var txtCrc32 = crc32(txt);
        var savePath = FileUtil.relative(projectDir, filePath);

        allVersion[savePath] = { "v": txtCrc32, "s": fs.statSync(filePath).size };
    }

    FileUtil.save(allPath, JSON.stringify(allVersion));

    for (var tempPath in allVersion) {
        var outputFilePath = FileUtil.joinPath(releaseDir, "resource", allVersion[tempPath]["v"].substring(0, 2), allVersion[tempPath]["v"] + "_" + allVersion[tempPath]["s"] + "." + tempPath.substring(tempPath.lastIndexOf(".") + 1));

        FileUtil.copy(FileUtil.joinPath(projectDir, tempPath), outputFilePath);
    }
    return 0;

    ////删除原始资源文件
    //for (var key in resources) {
    //    FileUtil.remove(FileUtil.joinPath(releasePath, resources[key]));
    //}
    //
    //FileUtil.copy(FileUtil.joinPath(releasePath, "egretResourceRoot"), FileUtil.joinPath(releasePath, "resource"));
    //
    //FileUtil.remove(FileUtil.joinPath(releasePath, "egretResourceRoot"));

    //globals.debugLog(1408, (Date.now() - tempTime) / 1000);
}

export function publishResource(runtime: "web" | "native"): number {

    let { releaseDir, projectDir } = egret.args;

    let publishType = EgretProject.data.getPublishType(runtime);
    switch (publishType) {
        case 0:
            return publishResourceOrigin(projectDir, releaseDir);
            break;
        case 1:
            return publishResourceWithVersion(projectDir, releaseDir);
            break;
        default:
            return 1;
    }
}