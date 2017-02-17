
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import copyNative = require("../actions/CopyNativeFiles");

console.log(utils.tr(1106, 0));
var timeBuildStart: number = (new Date()).getTime();
class Clean implements egret.Command {
    execute(): number {
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
    }
}

export = Clean;
