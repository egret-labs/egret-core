/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var CopyFiles = require('../actions/CopyFiles');
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var NativeProject = require('../actions/NativeProject');
console.log(utils.tr(1106, 0));
var timeBuildStart = (new Date()).getTime();
var Clean = (function () {
    function Clean() {
    }
    Clean.prototype.execute = function () {
        utils.checkEgret();
        var options = egret.args;
        service.execCommand({
            path: options.projectDir,
            command: "shutdown",
            option: egret.args
        }, null, false);
        utils.clean(options.debugDir);
        CopyFiles.copyToLibs();
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        if (!result) {
            return 1;
        }
        CompileTemplate.modifyIndexHTML(result.files);
        NativeProject.build();
        var timeBuildEnd = (new Date()).getTime();
        var timeBuildUsed = (timeBuildEnd - timeBuildStart) / 1000;
        console.log(utils.tr(1108, timeBuildUsed));
        return DontExitCode;
    };
    return Clean;
})();
module.exports = Clean;
