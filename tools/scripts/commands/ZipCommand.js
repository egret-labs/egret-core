/// <reference path="../lib/types.d.ts" />
/**
 * 打zip包
 */
var globals = require("../Globals");
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var ZipCommand = (function () {
    function ZipCommand() {
    }
    ZipCommand.prototype.initOptions = function (options) {
        this.outputFile = (params.getObjectOption(options, '--output'));
        this.sourcePath = (params.getObjectOption(options, '--source'));
        this.password = (params.getObjectOption(options, '--password')) || "";
        var dic = file.getDirectory(this.outputFile);
        if (!file.exists(dic)) {
            file.createDirectory(dic);
        }
    };
    ZipCommand.prototype.execute = function (callback) {
        var _this = this;
        //
        var tempTime = Date.now();
        globals.debugLog(1410);
        this.outputFile = globals.addQuotes(this.outputFile);
        this.sourcePath = globals.addQuotes(this.sourcePath);
        var compilerPath = file.join(params.getEgretRoot(), "tools/lib/zip/EGTZipTool_v1.0.2.jar");
        compilerPath = globals.addQuotes(compilerPath);
        var cmd = globals.getGlobalJava() + ' -jar ' + compilerPath + ' zip ' + this.outputFile + ' ' + this.sourcePath + ' ' + this.password;
        var cp_exec1 = require('child_process').exec;
        var build = cp_exec1(cmd);
        build.stdout.on("data", function (data) {
            //console.log(data);
        });
        build.stderr.on("data", function (data) {
            //console.log(data);
        });
        build.on("exit", function (result) {
            if (result == 0) {
                //结束
                file.remove(_this.sourcePath);
                globals.debugLog(1411, (Date.now() - tempTime) / 1000);
                if (callback)
                    callback(result);
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
//# sourceMappingURL=ZipCommand.js.map