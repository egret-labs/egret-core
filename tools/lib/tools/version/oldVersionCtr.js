/**
 * Created by yjtx on 15-5-27.
 */
var path = require("path");
var file = require("../../core/file.js");
exports.copyFilesWithIgnore = function (sourceRootPath, desRootPath, versionInfo) {
    var copyFilePathList = file.getDirectoryAllListing(path.join(sourceRootPath, "resource"));

    copyFilePathList.forEach(function (copyFilePath) {
        var filePath = path.relative(sourceRootPath, copyFilePath);
        if (versionInfo[filePath]) {//不在忽略列表的路径，拷贝过去
            var copyFileRePath = path.relative(sourceRootPath, copyFilePath);
            file.copy(path.join(copyFilePath), path.join(desRootPath, copyFileRePath));
        }
    });
};

//复制将要打包的manifest文件
exports.copyZipManifest = function (releasePath, ziptempPath) {
    file.copy(path.join(releasePath, "nativeBase", "version.manifest"), path.join(ziptempPath, "version.manifest"));
    file.copy(path.join(releasePath, "nativeBase", "code.manifest"), path.join(ziptempPath, "code.manifest"));
};

exports.copyOtherManifest = function (releasePath, releaseOutputPath, nozip) {
    if (nozip) {
        file.save(path.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({
            "version": Date.now(),
            "debug": 1
        }));
    }
    else {
        file.save(path.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({"version": Date.now()}));
    }

    file.copy(path.join(releasePath, "nativeBase", "base.manifest"), path.join(releaseOutputPath, "base.manifest"));

    var baseJson = JSON.parse(file.read(path.join(releasePath, "nativeBase", "base.manifest")));
    var versionJson = JSON.parse(file.read(path.join(releasePath, "nativeBase", "version.manifest")));

    for (var key in versionJson) {
        if (versionJson[key]["d"] == 1) {
            delete baseJson[key];
        }
        else if (baseJson[key] == null || versionJson[key]["v"] != baseJson[key]["v"]) {
            baseJson[key] = versionJson[key];
        }
    }
    file.save(path.join(releaseOutputPath, "localVersion.manifest"), JSON.stringify(baseJson));
};

exports.copyBuildManifest = function (url) {
};

exports.getClassName = function () {
    return "new egret.NativeVersionController()";
};