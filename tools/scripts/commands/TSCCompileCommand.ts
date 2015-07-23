/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import globals = require("../Globals");

class TSCCompileCommand implements egret.Command {
    cmd;

    execute(callback?:(exitCode:number)=>void):number {
        file.save("tsc_config_temp.txt", this.cmd);//todo performance-optimize
        var tsc = require('../../lib/core/typescript/tsc');

        tsc.exit = function () {
            if (callback) {
                callback(0);
            }
            else
            {
                process.exit(0);
            }
        };
        var defaultTscLib = null;//exports.defaultTscLib = null;
        tsc.executeCommandLine(["@tsc_config_temp.txt"], defaultTscLib);
        return 0;
    }
}

export = TSCCompileCommand;