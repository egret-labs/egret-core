/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var ShutdownCommand = (function () {
    function ShutdownCommand() {
    }
    ShutdownCommand.prototype.execute = function (callback) {
        var options = egret.options;
        if (FileUtil.exists(options.srcDir) == false || FileUtil.exists(options.launcherDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({ path: egret.options.projectDir, command: "shutdown" }, function () {
            return process.exit(0);
        }, true);
        return 0;
    };
    return ShutdownCommand;
})();
module.exports = ShutdownCommand;
