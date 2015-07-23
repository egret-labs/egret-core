/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var PublishNativeCMD = require("./PublishNativeCommand");
var PublishWebCMD = require("./PublishWebCommand");
var PublishCommand = (function () {
    function PublishCommand() {
    }
    PublishCommand.prototype.execute = function () {
        //当前发布的平台
        var runtime = params.getOption("--runtime", ["html5", "native"]);
        if (runtime == "native") {
            new PublishNativeCMD().execute();
        }
        else {
            new PublishWebCMD().execute();
        }
        return 0;
    };
    return PublishCommand;
})();
module.exports = PublishCommand;
