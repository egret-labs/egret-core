import path = require("path");
import FileUtil = require('../../lib/FileUtil');

class UnzipCommand {
    static unzip(srcPath, destPath, callback): any {
        let compilerPath = FileUtil.joinPath(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.js");
        compilerPath = globals.addQuotes(compilerPath);
        compilerPath = FileUtil.escapePath(compilerPath);
        let nodePath = globals.addQuotes(process.execPath);
        nodePath = FileUtil.escapePath(nodePath);

        srcPath = globals.addQuotes(srcPath);
        srcPath = FileUtil.escapePath(srcPath);

        destPath = globals.addQuotes(destPath);
        destPath = FileUtil.escapePath(destPath);

        let cmd = `${nodePath} ${compilerPath} unzip ${srcPath} ${destPath}`;


        // console.log(cmd);

        let cp_exec1 = require('child_process').exec;
        let build = cp_exec1(cmd);
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
}

export = UnzipCommand;