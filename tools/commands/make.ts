
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import CompileEgretEngine = require("../actions/CompileEgretEngine");

class MakeCommand implements egret.Command {
    execute():number {
        var options = egret.args;
        
        var compiler = new CompileEgretEngine();
        return compiler.make();
    }
}

export = MakeCommand;