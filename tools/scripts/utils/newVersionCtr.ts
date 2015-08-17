/**
 * Created by yjtx on 15-5-27.
 */
import file = require("../lib/FileUtil");

export function copyFilesWithIgnore(sourceRootPath, desRootPath, versionInfo, resourceName) {
    var copyFilePathList = file.getDirectoryAllListing(file.join(sourceRootPath, resourceName));

    copyFilePathList.forEach(function (copyFilePath) {
        var filePath = file.relative(sourceRootPath, copyFilePath);
        if (versionInfo[filePath]) {//不在忽略列表的路径，拷贝过去
            file.copy(file.join(copyFilePath), file.join(desRootPath, resourceName, versionInfo[filePath]["v"].substring(0, 2), versionInfo[filePath]["v"] + "_" + versionInfo[filePath]["s"]));
        }
    });
}

//复制将要打包的manifest文件
export function copyZipManifest(releasePath, ziptempPath) {
    file.copy(file.join(releasePath, "nativeBase", "all.manifest"), file.join(ziptempPath, "all.manifest"));
}

export function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
}

export function copyBuildManifest(url) {
    file.save(file.join(url, "all.manifest"), "{}");
}

export function getClassName() {
    return "new egret.NativeVersionController()";
}

