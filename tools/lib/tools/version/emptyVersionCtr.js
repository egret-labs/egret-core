/**
 * Created by yjtx on 15-5-27.
 */
var path = require("../../core/path");
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
};

exports.copyOtherManifest = function (releasePath, releaseOutputPath) {

};

exports.copyBuildManifest = function (url) {
};

exports.getClassName = function () {
    return null;
};