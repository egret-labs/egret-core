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
    file.copy(file.join(releasePath, "nativeBase", "version.manifest"), file.join(ziptempPath, "version.manifest"));
    file.copy(file.join(releasePath, "nativeBase", "code.manifest"), file.join(ziptempPath, "code.manifest"));
}
exports.copyZipManifest = copyZipManifest;
function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
    if (nozip) {
        file.save(file.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({
            "version": Date.now(),
            "debug": 1
        }));
    }
    else {
        file.save(file.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({ "version": Date.now() }));
    }
    file.copy(file.join(releasePath, "nativeBase", "base.manifest"), file.join(releaseOutputPath, "base.manifest"));
    var baseJson = JSON.parse(file.read(file.join(releasePath, "nativeBase", "base.manifest")));
    var versionJson = JSON.parse(file.read(file.join(releasePath, "nativeBase", "version.manifest")));
    for (var key in versionJson) {
        if (versionJson[key]["d"] == 1) {
            delete baseJson[key];
        }
        else if (baseJson[key] == null || versionJson[key]["v"] != baseJson[key]["v"]) {
            baseJson[key] = versionJson[key];
        }
    }
    file.save(file.join(releaseOutputPath, "localVersion.manifest"), JSON.stringify(baseJson));
}
exports.copyOtherManifest = copyOtherManifest;
function copyBuildManifest(url) {
}
exports.copyBuildManifest = copyBuildManifest;
function getClassName() {
    return "new egret.NativeVersionController()";
}
exports.getClassName = getClassName;
