/// <reference path="../lib/types.d.ts" />
var service = require('../service/index');
var Quit = (function () {
    function Quit() {
    }
    Quit.prototype.execute = function () {
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