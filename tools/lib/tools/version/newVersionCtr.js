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
            file.copy(path.join(copyFilePath), path.join(desRootPath, "resource", versionInfo[filePath]["v"] + "_" + versionInfo[filePath]["s"]));
        }
    });
};


//复制将要打包的manifest文件
exports.copyZipManifest = function (releasePath, ziptempPath) {
    file.copy(path.join(releasePath, "nativeBase", "all.manifest"), path.join(ziptempPath, "all.manifest"));
};

exports.copyOtherManifest = function (releasePath, releaseOutputPath) {
};

exports.copyBuildManifest = function (url) {
    file.save(path.join(url, "all.manifest"), "{}");
};

exports.getClassName = function () {
    return "new egret.NativeVersionController()";
};