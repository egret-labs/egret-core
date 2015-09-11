
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import watch = require("../lib/watch");
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');
import service = require('../service/index');

class Help implements egret.Command {

    execute(): number {
        utils.open("http://edn.egret.com/cn/index.php/article/index/id/301");
        return DontExitCode;
    }
}

export = Help;