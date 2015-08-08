/// <reference path="../lib/types.d.ts" />
import utils = require('../lib/utils');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');

class QuickBuildCommand implements egret.Command {
    execute(callback?:(exitCode:number)=>void): number {
        console.log(utils.tr(30000));
        var options = egret.options;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.launcherDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({ path: egret.options.projectDir, command: "build" }, function (cmd) {
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
            if (callback)
                callback(cmd.exitCode || 0);
            else
                process.exit(cmd.exitCode || 0);
        }, true);
        return 0;
    }
}

export = QuickBuildCommand;