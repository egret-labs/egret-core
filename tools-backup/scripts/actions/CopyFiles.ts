/// <reference path="../lib/types.d.ts" />
import FileUtil = require('../lib/FileUtil');
var fileExtensionToIgnore = {
    "ts": true,
    "exml": true
};

class CopyFiles {
    public static copyProjectFiles():void {
        var targetFolder = egret.options.outDir;
        copyDirectory(egret.options.srcDir, targetFolder, srcFolderOutputFilter);
    }

    public static copyEgret():number {
        var options = egret.options;
        var moduleBin = FileUtil.joinPath(options.egretRoot, "build");
        var targetFile = FileUtil.joinPath(options.srcDir, '/libs/');
        if (options.projectDir.toLowerCase() != options.egretRoot.toLowerCase())
            FileUtil.copy(moduleBin, targetFile);
        return 0;
    }
}

function copyDirectory(from, to, filter) {
    var fileList = [];
    if (!filter)
        fileList = FileUtil.getDirectoryListing(from);
    else
        fileList = FileUtil.searchByFunction(from, filter);
    length = fileList.length;
    for (var i = 0; i < length; i++) {
        var path = fileList[i];
        var destPath = path.substring(from.length);
        destPath = FileUtil.joinPath(to, destPath);
        FileUtil.copy(path, destPath);
    }
}
function srcFolderOutputFilter(file) {
    var extension = FileUtil.getExtension(file);
    if (extension in fileExtensionToIgnore)
        return false;
    return true;
}

export = CopyFiles;