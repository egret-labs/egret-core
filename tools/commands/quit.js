/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var Quit = (function () {
    function Quit() {
    }
    Quit.prototype.execute = function () {
        var options = egret.args;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({
            path: egret.args.projectDir,
            command: "shutdown",
            option: egret.args
        }, function () { return process.exit(0); }, true);
        return DontExitCode;
    };
    return Quit;
})();
module.exports = Quit;

//# sourceMappingURL=../commands/quit.js.map