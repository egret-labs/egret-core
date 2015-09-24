/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var CopyFiles = require('../actions/CopyFiles');
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var exmlActions = require('../actions/exml');
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
        exmlActions.beforeBuild();
        var compileProject = new CompileProject();
        //编译
        var exmlresult = exmlActions.build();
        var result = compileProject.compileProject(options);
        //操作其他文件
        CompileTemplate.compileTemplates(options, result.files);
        exmlActions.afterBuild();
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    };
    return Clean;
})();
module.exports = Clean;

//# sourceMappingURL=../commands/clean.js.map