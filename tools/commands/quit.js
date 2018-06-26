/// <reference path="../lib/types.d.ts" />
var service = require("../service/index");
var Quit = /** @class */ (function () {
    function Quit() {
    }
    Quit.prototype.execute = function () {
        service.client.execCommand({
            path: egret.args.projectDir,
            command: "shutdown",
            option: egret.args
        }, function () { return process.exit(0); }, true);
        return DontExitCode;
    };
    return Quit;
}());
module.exports = Quit;
