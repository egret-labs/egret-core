/// <reference path="../lib/types.d.ts" />
import utils = require('../lib/utils');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');

class ShutdownCommand implements egret.Command {
    execute(callback?:(exitCode:number)=>void): number {
        var options = egret.options;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.launcherDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({ path: egret.options.projectDir, command: "shutdown" }, function () { return process.exit(0); }, true);
        return 0;
    }
}

export = ShutdownCommand;