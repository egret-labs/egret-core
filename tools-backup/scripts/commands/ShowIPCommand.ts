/// <reference path="../lib/types.d.ts" />

class ShowIPCommand implements egret.Command {

    execute():number {
        console.log("ip:" + this.getIP());
        return 0;
    }

    getIP():string {
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
    }
}

export = ShowIPCommand;