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
}

export function copyOtherManifest(releasePath, releaseOutputPath, nozip) {
}

export function copyBuildManifest(url) {
}

export function getClassName() {
    return null;
}