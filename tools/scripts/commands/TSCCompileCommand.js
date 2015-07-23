/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var TSCCompileCommand = (function () {
    function TSCCompileCommand() {
    }
    TSCCompileCommand.prototype.execute = function (callback) {
        file.save("tsc_config_temp.txt", this.cmd); //todo performance-optimize
        var tsc = require('../../lib/core/typescript/tsc');
        tsc.exit = function () {
            if (callback) {
                callback(0);
            }
            else {
                process.exit(0);
            }
        };
        var defaultTscLib = null; //exports.defaultTscLib = null;
        tsc.executeCommandLine(["@tsc_config_temp.txt"], defaultTscLib);
        return 0;
    };
    return TSCCompileCommand;
})();
module.exports = TSCCompileCommand;
