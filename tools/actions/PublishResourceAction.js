/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
//import globals = require("../globals");
var FileUtil = require("../lib/FileUtil");
var fs = require("fs");
var CopyFilesCommand = require("../commands/copyfile");
var EgretProject = require("../project/EgretProject");
function publishResourceOrigin(projectDir, releaseDir) {
    var config = EgretProject.data;
    var cpFiles = new CopyFilesCommand();
    cpFiles.copyResources(projectDir, releaseDir, config.getIgnorePath());
    return 0;
}
function publishResourceWithVersion(projectDir, releaseDir) {
    var ignorePathList = EgretProject.data.getIgnorePath();
    var allPath = FileUtil.joinPath(releaseDir, "all.manifest");
    var resources = EgretProject.data.getResources();
    var list = [];
    for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var r = resources_1[_i];
        var tempList = FileUtil.search(FileUtil.joinPath(projectDir, r));
        list = list.concat(tempList);
    }
    ignorePathList = ignorePathList.map(function (item) {
        var reg = new RegExp(item);
        return reg;
    });
    var isIgnore = false;
    list = list.filter(function (copyFilePath) {
        isIgnore = false;
        for (var key in ignorePathList) {
            var ignorePath = ignorePathList[key];
            if (copyFilePath.match(ignorePath)) {
                isIgnore = true;
                break;
            }
        }
        if (copyFilePath.indexOf(".html") != -1 || copyFilePath.indexOf(".css") != -1) {
            return false;
        }
        if (!isIgnore) {
            return true;
        }
    });
    var allVersion = {};
    var copyExmlList = EgretProject.data.getCopyExmlList();
    for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
        var filePath = list_1[_a];
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
function publishResource(runtime) {
    var _a = egret.args, releaseDir = _a.releaseDir, projectDir = _a.projectDir;
    var publishType = EgretProject.data.getPublishType(runtime);
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
exports.publishResource = publishResource;
