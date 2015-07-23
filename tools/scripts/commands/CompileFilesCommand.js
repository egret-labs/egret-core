/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var globals = require("../Globals");
var CompileFilesCommand = (function () {
    function CompileFilesCommand() {
    }
    /**
     var options = {
                    "--output": file.joinPath(releaseOutputPath, "launcher", "game-min.js"),
                    "--filelist": file_list,
                    "--method": "uglify";
                };
     */
    CompileFilesCommand.prototype.initOptions = function (options) {
        this.outputFile = (params.getObjectOption(options, '--output'));
        this.fileList = (params.getObjectOption(options, '--filelist'));
        this.method = (params.getObjectOption(options, '--method', ["closure", "uglify"]));
        var dic = file.getDirectory(this.outputFile);
        if (!file.exists(dic)) {
            file.createDirectory(dic);
        }
    };
    CompileFilesCommand.prototype.execute = function (callback) {
        var tempTime = Date.now();
        globals.debugLog(1403);
        var adapt = globals.getCompiler(this.method);
        adapt.compilerSingleFile(this.fileList, this.outputFile, file.joinPath(this.outputFile, "..", "__game-min-native.js"), function () {
            globals.debugLog(1404, (Date.now() - tempTime) / 1000);
            if (callback)
                callback(0);
            else
                process.exit(0);
        });
        return 0;
    };
    return CompileFilesCommand;
})();
module.exports = CompileFilesCommand;
