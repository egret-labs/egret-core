/**
 * Created by yjtx on 15-5-27.
 */
var file = require("../lib/FileUtil");
function copyFilesWithIgnore(sourceRootPath, desRootPath, versionInfo, resourceName, nozip) {
    var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath, resourceName));
    if (nozip) {
        copyFilePathList.forEach(function (copyFilePath) {
            var filePath = file.relative(sourceRootPath, copyFilePath);
            if (versionInfo[filePath]) {
                var copyFileRePath = file.relative(sourceRootPath, copyFilePath);
                file.copy(file.join(copyFilePath), file.join(desRootPath, copyFileRePath));
            }
        });
    }
    else {
        copyFilePathList.forEach(function (copyFilePath) {
            var filePath = file.relative(sourceRootPath, copyFilePath);
            if (versionInfo[filePath]) {
                file.copy(file.join(copyFilePath), file.join(desRootPath, resourceName, versionInfo[filePath]["v"].substring(0, 2), versionInfo[filePath]["v"] + "_" + versionInfo[filePath]["s"]));
            }
        });
    }
}
exports.copyFilesWithIgnore = copyFilesWithIgnore;
//复制将要打包的manifest文件
function copyZipManifest(releasePath, ziptempPath) {
    file.copy(file.join(releasePath, "nativeBase", "all.manifest"), file.join(ziptempPath, "all.manifest"));
}
exports.copyZipManifest = copyZipManifest;
function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
}
exports.copyOtherManifest = copyOtherManifest;
function copyBuildManifest(url) {
    file.save(file.join(url, "all.manifest"), "{}");
}
exports.copyBuildManifest = copyBuildManifest;
function getClassName() {
    return "new egret.NativeVersionController()";
}
exports.getClassName = getClassName;
