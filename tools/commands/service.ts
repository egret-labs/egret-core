
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import service = require("../service/index");


class Service implements egret.Command {
    execute() {
        service.run();
        return DontExitCode
    }
}

export = Service;