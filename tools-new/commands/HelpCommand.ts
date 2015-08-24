
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import watch = require("../lib/watch");
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');
import service = require('../service/index');

class HelpCommand implements egret.Command {

    execute(): number {
        utils.open("https://github.com/egret-labs/Lark/blob/master/docs/cmd-tools.md");
        return 0;
    }
}

export = HelpCommand;