/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var createAction = require('../actions/Create');
var server = require('../server/server');
var FileUtil = require('../lib/FileUtil');
var Create = (function () {
    function Create() {
    }
    Create.prototype.execute = function () {
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
    };
    return Create;
})();
module.exports = Create;
