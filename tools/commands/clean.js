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
        //刷新libs 中 modules 文件
        CopyFiles.copyToLibs();
        //编译 bin-debug 文件
        exmlActions.beforeBuild();
        var compileProject = new CompileProject();
        //编译
        exmlActions.build();
        var result = compileProject.compileProject(options);
        if (result.exitStatus)
            return result.exitStatus;
        //修改 html 中 modules 块
        CopyFiles.modifyHTMLWithModules();
        //修改 html 中 game_list 块
        CompileTemplate.modifyIndexHTML(result.files);
        //根据 index.html 修改 native_require.js 文件
        CompileTemplate.modifyNativeRequire();
        exmlActions.afterBuild();
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    };
    return Clean;
})();
module.exports = Clean;

//# sourceMappingURL=../commands/clean.js.map