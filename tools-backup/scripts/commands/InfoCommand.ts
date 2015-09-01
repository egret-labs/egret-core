/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");

class InfoCommand implements egret.Command {
    execute():number {
        var config;
        var txt = file.read(params.getEgretRoot() + "/package.json");
        config = JSON.parse(txt);
        globals.log2(1801, config.version);
        globals.log2(1802, params.getEgretRoot());
        return 0;
    }
}

export = InfoCommand;