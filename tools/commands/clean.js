/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var service = require("../service/index");
var CompileProject = require("../actions/CompileProject");
var CompileTemplate = require("../actions/CompileTemplate");
var copyNative = require("../actions/CopyNativeFiles");
console.log(utils.tr(1106, 0));
var timeBuildStart = (new Date()).getTime();
var Clean = (function () {
    function Clean() {
    }
    Clean.prototype.execute = function () {
        utils.checkEgret();
        var options = egret.args;
        service.client.closeServer(options.projectDir);
        utils.clean(options.debugDir);
        //刷新libs 中 modules 文件
        CompileTemplate.copyToLibs();
        CompileTemplate.modifyIndexHTML();
        //编译 bin-debug 文件
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        if (!result) {
            return 1;
        }
        //修改 html 中 game_list 块
        CompileTemplate.modifyIndexHTML(result.files);
        CompileTemplate.modifyNativeRequire(true);
        //拷贝项目到native工程中
        if (egret.args.runtime == "native") {
            console.log("----native build-----");
            copyNative.refreshNative(true);
        }
        var timeBuildEnd = new Date().getTime();
        var timeBuildUsed = (timeBuildEnd - timeBuildStart) / 1000;
        console.log(utils.tr(1108, timeBuildUsed));
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    };
    return Clean;
}());
module.exports = Clean;
