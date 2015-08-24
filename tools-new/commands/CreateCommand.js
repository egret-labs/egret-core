/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var entry = require('../entry');
var DoCreate = require('./DoCreateCommand');
var server = require('../server/server');
var FileUtil = require('../lib/FileUtil');
var CreateCommand = (function () {
    function CreateCommand() {
    }
    CreateCommand.prototype.execute = function () {
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
    };
    return CreateCommand;
})();
module.exports = CreateCommand;
