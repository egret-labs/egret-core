/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var fileExtensionToIgnore = {
    "ts": true,
    "exml": true
};
var CopyFiles = (function () {
    function CopyFiles() {
    }
    CopyFiles.copyProjectFiles = function () {
        var targetFolder = egret.options.outDir;
        copyDirectory(egret.options.srcDir, targetFolder, srcFolderOutputFilter);
    };
    CopyFiles.copyEgret = function () {
        var options = egret.options;
        var moduleBin = FileUtil.joinPath(options.egretRoot, "build");
        var targetFile = FileUtil.joinPath(options.srcDir, '/libs/');
        if (options.projectDir.toLowerCase() != options.egretRoot.toLowerCase())
            FileUtil.copy(moduleBin, targetFile);
        return 0;
    };
    return CopyFiles;
})();
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
module.exports = CopyFiles;
