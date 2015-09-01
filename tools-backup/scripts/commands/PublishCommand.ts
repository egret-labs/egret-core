/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import PublishNativeCMD = require("./PublishNativeCommand");
import PublishWebCMD = require("./PublishWebCommand");


class PublishCommand implements egret.Command {
    execute():number {

        //当前发布的平台
        var runtime = params.getOption("--runtime", ["html5", "native"]);
        if (runtime == "native") {
            new PublishNativeCMD().execute();
        }
        else {
            new PublishWebCMD().execute();
        }
        return 0;
    }
}

export = PublishCommand;