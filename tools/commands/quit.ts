
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');

class Quit implements egret.Command {
    execute(): number {
        service.execCommand({
            path: egret.args.projectDir,
            command: "shutdown",
            option: egret.args
        }, () => process.exit(0), true);
        return DontExitCode;
    }
}

export = Quit;