/// <reference path="../lib/types.d.ts" />
var createAction = require("../actions/Create");
var FileUtil = require("../lib/FileUtil");
var Create = (function () {
    function Create() {
    }
    Create.prototype.execute = function () {
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
        var hasProjectTypeInManifest = egret.manifest.templates.some(function (t) { return t.name == project.type; });
        if (!hasProjectTypeInManifest) {
            project.type = "game";
        }
        var create = new createAction();
        create.project = project;
        parseProjectInfoFromTemplate(project);
        return create.execute();
    };
    return Create;
}());
function parseProjectInfoFromTemplate(project) {
    if (!project.modules || !project.modules.length) {
        var templates = egret.manifest.templates.filter(function (t) { return t.name == project.type; });
        var template = templates.length ? templates[0] : egret.manifest.templates[0];
        project.modules = template.modules.map(function (t) { return ({ name: t }); });
    }
}
module.exports = Create;
