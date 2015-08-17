/**
 * Created by yjtx on 15-5-27.
 */
var file = require("../lib/FileUtil");
function copyFilesWithIgnore(sourceRootPath, desRootPath, versionInfo, resourceName) {
    var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath, resourceName));
    copyFilePathList.forEach(function (copyFilePath) {
        var filePath = file.relative(sourceRootPath, copyFilePath);
        if (versionInfo[filePath]) {
            var copyFileRePath = file.relative(sourceRootPath, copyFilePath);
            file.copy(file.join(copyFilePath), file.join(desRootPath, copyFileRePath));
        }
    });
}
exports.copyFilesWithIgnore = copyFilesWithIgnore;
//复制将要打包的manifest文件
function copyZipManifest(releasePath, ziptempPath) {
}
exports.copyZipManifest = copyZipManifest;
function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
}
exports.copyOtherManifest = copyOtherManifest;
function copyBuildManifest(url) {
}
exports.copyBuildManifest = copyBuildManifest;
function getClassName() {
    return null;
}
exports.getClassName = getClassName;
