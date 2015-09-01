/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var fileExtensionToIgnore = {
    "ts": true
};
var CopyFiles = (function () {
    function CopyFiles() {
    }
    CopyFiles.copyProjectFiles = function () {
        var targetFolder = egret.args.outDir;
        copyDirectory(egret.args.srcDir, targetFolder, srcFolderOutputFilter);
        copyDirectory(egret.args.templateDir, targetFolder);
    };
    CopyFiles.copyLark = function () {
        var options = egret.args;
        var moduleBin = FileUtil.joinPath(options.larkRoot, "build");
        var targetFile = FileUtil.joinPath(options.srcDir, '/libs/');
        if (options.projectDir.toLowerCase() != options.larkRoot.toLowerCase())
            FileUtil.copy(moduleBin, targetFile);
        return 0;
    };
    CopyFiles.copyOutputToNative = function () {
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
//# sourceMappingURL=CopyFiles.js.map