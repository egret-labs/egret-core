/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
//import globals = require("../globals");
var FileUtil = require("../lib/FileUtil");
var fs = require("fs");
var CopyFilesCommand = require("../commands/copyfile");
var EgretProject = require("../project/EgretProject");
function generateVersion(runtime) {
    var tempTime = Date.now();
    //globals.debugLog(1407);
    var releasePath = egret.args.releaseDir;
    var ignorePathList = EgretProject.data.getIgnorePath();
    var allPath = FileUtil.joinPath(releasePath, "all.manifest");
    var sourceRoot = egret.args.projectDir;
    var resources = EgretProject.data.getResources();
    if (EgretProject.data.getPublishType(runtime) == 0) {
        var config = EgretProject.data;
        var cpFiles = new CopyFilesCommand();
        cpFiles.copyResources(sourceRoot, releasePath, config.getIgnorePath());
        return 0;
    }
    var list = [];
    for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var r = resources_1[_i];
        var tempList = FileUtil.search(FileUtil.joinPath(sourceRoot, r));
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
    var length = list.length;
    var copyExmlList = EgretProject.data.getCopyExmlList();
    for (var i = 0; i < length; i++) {
        var filePath = list[i];
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
        var savePath = FileUtil.relative(sourceRoot, filePath);
        allVersion[savePath] = { "v": txtCrc32, "s": fs.statSync(filePath).size };
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
exports.generateVersion = generateVersion;
