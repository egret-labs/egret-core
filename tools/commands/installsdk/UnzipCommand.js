var FileUtil = require("../../lib/FileUtil");
var UnzipCommand = (function () {
    function UnzipCommand() {
    }
    UnzipCommand.unzip = function (srcPath, destPath, callback) {
        var compilerPath = FileUtil.joinPath(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.js");
        compilerPath = globals.addQuotes(compilerPath);
        compilerPath = FileUtil.escapePath(compilerPath);
        var nodePath = globals.addQuotes(process.execPath);
        nodePath = FileUtil.escapePath(nodePath);
        srcPath = globals.addQuotes(srcPath);
        srcPath = FileUtil.escapePath(srcPath);
        destPath = globals.addQuotes(destPath);
        destPath = FileUtil.escapePath(destPath);
        var cmd = nodePath + " " + compilerPath + " unzip " + srcPath + " " + destPath;
        // console.log(cmd);
        var cp_exec1 = require('child_process').exec;
        var build = cp_exec1(cmd);
        build.stdout.on("data", function (data) {
            //console.log(data);
        });
        build.stderr.on("data", function (data) {
            //console.log(data);
        });
        build.on("exit", function (result) {
            if (callback) {
                callback(result);
            }
        });
        return build;
    };
    ;
    return UnzipCommand;
}());
module.exports = UnzipCommand;
