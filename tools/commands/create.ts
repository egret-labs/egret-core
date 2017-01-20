
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import entry = require('../entry');
import createAction = require('../actions/Create');
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');

class Create implements egret.Command {

    execute() {

        var option = egret.args;
        if (FileUtil.exists(option.projectDir)) {
            globals.log(1002);
            return 0;
        }
        else {
            globals.log(1003);
            FileUtil.createDirectory(option.projectDir);
        }
        var project = option.getProject(true);
        globals.log(1004);
        project.type = project.type || "game";

        let hasProjectTypeInManifest = egret.manifest.templates.some(t => t.name == project.type);
        if (!hasProjectTypeInManifest) {
            project.type = "game";
        }

        var create = new createAction();
        create.project = project;
        parseProjectInfoFromTemplate(project);
        return create.execute();

    }
}

function parseProjectInfoFromTemplate(project: egret.EgretProjectConfig) {
    if (!project.modules || !project.modules.length) {

        var templates = egret.manifest.templates.filter(t => t.name == project.type)
        var template = templates.length ? templates[0] : egret.manifest.templates[0];

        project.modules = template.modules.map(t => ({ name: t }));
    }
}


export = Create;
