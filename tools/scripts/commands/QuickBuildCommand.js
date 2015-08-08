/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var QuickBuildCommand = (function () {
    function QuickBuildCommand() {
    }
    QuickBuildCommand.prototype.execute = function (callback) {
        console.log(utils.tr(30000));
        var options = egret.options;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.launcherDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({ path: egret.options.projectDir, command: "build" }, function (cmd) {
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
            if (callback)
                callback(cmd.exitCode || 0);
            else
                process.exit(cmd.exitCode || 0);
        }, true);
        return 0;
    };
    return QuickBuildCommand;
})();
module.exports = QuickBuildCommand;
