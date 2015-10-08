/// <reference path="../lib/types.d.ts" />
/**
 * 打zip包
 */
var file = require('../lib/FileUtil');
var FileUtil = require('../lib/FileUtil');
var ZipCommand = (function () {
    function ZipCommand(versionFile) {
        this.versionFile = versionFile;
    }
    ZipCommand.prototype.init = function () {
        this.useList = [];
        //拷贝所需文件到 ziptemp目录
        var releasePath = egret.args.releaseDir;
        var ziptempPath = FileUtil.joinPath(releasePath, "ziptemp");
        FileUtil.createDirectory(ziptempPath);
        //runtime  打包所有js文件以及all.manifest
        this.outputFile = FileUtil.joinPath(releasePath, "game_code_" + this.versionFile + ".zip");
        this.sourcePath = ziptempPath;
        this.password = egret.args.password || "";
    };
    ZipCommand.prototype.execute = function (callback) {
        var _this = this;
        //
        var tempTime = Date.now();
        globals.debugLog(1410);
        this.init();
        var compilerPath = FileUtil.joinPath(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.jar");
        compilerPath = globals.addQuotes(compilerPath);
        var cmd = globals.getGlobalJava() + ' -jar ' + compilerPath + ' zip ' + globals.addQuotes(this.outputFile) + ' ' + globals.addQuotes(this.sourcePath) + ' ' + this.password;
        var cp_exec1 = require('child_process').exec;
        var build = cp_exec1(cmd);
        build.stdout.on("data", function (data) {
            //console.log(data);
        });
        build.stderr.on("data", function (data) {
            //console.log(data);
        });
        var self = this;
        build.on("exit", function (result) {
            if (result == 0) {
                //结束
                file.remove(_this.sourcePath);
                var releasePath = egret.args.releaseDir;
                for (var tempKey in self.useList) {
                    FileUtil.remove(self.useList[tempKey]);
                }
                //globals.debugLog(1411, (Date.now() - tempTime) / 1000);
                if (callback) {
                    callback(result);
                }
                else
                    process.exit(result);
            }
            else {
                //todo zip异常
                //globals.warn(result);
                console.error("打zip包出现异常！");
            }
        });
        return 0;
    };
    return ZipCommand;
})();
module.exports = ZipCommand;

//# sourceMappingURL=../actions/ZipCommand.js.map