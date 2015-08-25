
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import entry = require('../entry');
import createAction = require('../actions/Create');
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');

class Create implements egret.Command {

    execute(): number {
        var option = egret.args;
        var project = option.getProject(true);
        if (project.type) {
            var create = new createAction();
            create.project = project;
            return create.execute();
        }
        else {
            option.port = 3000 + Math.ceil(Math.random() * 30000);
            var url = option.manageUrl + "create/";
            var exist = FileUtil.exists(option.srcDir);
            if (exist)
                url += "?exist=true";
            server.startServer(option, url);
            console.log(utils.tr(10016, url));
            return DontExitCode;
        }
    }
}


export = Create;
