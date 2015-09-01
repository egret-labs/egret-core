/// <reference path="../lib/types.d.ts" />
var ShowIPCommand = (function () {
    function ShowIPCommand() {
    }
    ShowIPCommand.prototype.execute = function () {
        console.log("ip:" + this.getIP());
        return 0;
    };
    ShowIPCommand.prototype.getIP = function () {
        var os = require("os");
        var ipConfig = os.networkInterfaces();
        var ip = "localhost";
        for (var key in ipConfig) {
            var arr = ipConfig[key];
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var ipData = arr[i];
                if (!ipData.internal && ipData.family == "IPv4") {
                    ip = ipData.address;
                    return ip;
                }
            }
        }
        return ip;
    };
    return ShowIPCommand;
})();
module.exports = ShowIPCommand;
//# sourceMappingURL=ShowIPCommand.js.map