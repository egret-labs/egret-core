/**
 * Created by yjtx on 15-5-27.
 */
import file = require("../lib/FileUtil");

export function copyFilesWithIgnore(sourceRootPath, desRootPath, versionInfo) {
    var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath, "resource"));

    copyFilePathList.forEach(function (copyFilePath) {
        var filePath = file.relative(sourceRootPath, copyFilePath);
        if (versionInfo[filePath]) {//不在忽略列表的路径，拷贝过去
            var copyFileRePath = file.relative(sourceRootPath, copyFilePath);
            file.copy(file.join(copyFilePath), file.join(desRootPath, copyFileRePath));
        }
    });
}

//复制将要打包的manifest文件
export function copyZipManifest(releasePath, ziptempPath) {
    file.copy(file.join(releasePath, "nativeBase", "version.manifest"), file.join(ziptempPath, "version.manifest"));
    file.copy(file.join(releasePath, "nativeBase", "code.manifest"), file.join(ziptempPath, "code.manifest"));
}

export function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
    if (nozip) {
        file.save(file.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({
            "version": Date.now(),
            "debug": 1
        }));
    }
    else {
        file.save(file.join(releaseOutputPath, "appVersion.manifest"), JSON.stringify({"version": Date.now()}));
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

export function copyBuildManifest(url) {
}

export function getClassName() {
    return "new egret.NativeVersionController()";
}