
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CompileProject = require('../actions/CompileProject');

class Quit implements egret.Command {
    execute(): number {
        service.client.execCommand({
            path: egret.args.projectDir,
            command: "shutdown",
            option: egret.args
        }, () => process.exit(0), true);
        return DontExitCode;
    }
}

export = Quit;