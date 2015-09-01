/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var Native = require('../actions/NativeProject');
var CopyFiles = require('../actions/CopyFiles');
var Build = (function () {
    function Build() {
    }
    Build.prototype.execute = function (callback) {
        callback = callback || defaultBuildCallback;
        var options = egret.args;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (FileUtil.exists(FileUtil.joinPath(options.srcDir, 'libs/lark/')) == false) {
            CopyFiles.copyLark();
        }
        service.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, function (cmd) { return onGotBuildCommandResult(cmd, callback); }, true);
        return DontExitCode;
    };
    return Build;
})();
function onGotBuildCommandResult(cmd, callback) {
    if (cmd.messages) {
        cmd.messages.forEach(function (m) { return console.log(m); });
    }
    if (cmd.exitCode > 10000) {
        console.log(utils.tr(cmd.exitCode));
    }
    if (!cmd.exitCode && egret.args.platform) {
        Native.build();
        setTimeout(function () { return callback(0); }, 500);
    }
    else
        callback(cmd.exitCode || 0);
}
function defaultBuildCallback(code) {
    process.exit(code);
}
module.exports = Build;
//# sourceMappingURL=build.js.map