
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import entry = require('../entry');
import DoCreate = require('./DoCreateCommand');
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');

class CreateCommand implements egret.Command {
	
    execute():number {
        var option = egret.args;
        var project = option.getProject(true);
        if (project.template) {
            var create = new DoCreate();
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
            return entry.DontExitCode;
        }
    }
}


export = CreateCommand;
