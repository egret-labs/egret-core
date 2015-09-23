/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var CopyFiles = require('../actions/CopyFiles');
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var Clean = (function () {
    function Clean() {
    }
    Clean.prototype.execute = function () {
        var options = egret.args;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        service.execCommand({
            path: options.projectDir,
            command: "shutdown",
            option: egret.args
        }, null, false);
        utils.clean(options.debugDir);
        CopyFiles.copyLark();
        var compileProject = new CompileProject();
        var result = compileProject.compileProject(options);
        CopyFiles.copyProjectFiles();
        CompileTemplate.compileTemplates(options, result.files);
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    };
    return Clean;
})();
module.exports = Clean;

//# sourceMappingURL=../commands/clean.js.map