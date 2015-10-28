
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');

import NativeProject = require('../actions/NativeProject');
console.log(utils.tr(1106, 0));
var timeBuildStart: number = (new Date()).getTime();
class Clean implements egret.Command {
    execute(): number {
        utils.checkEgret();

        var options = egret.args;

        service.execCommand({
            path: options.projectDir,
            command: "shutdown",
            option: egret.args
        }, null, false);

        utils.clean(options.debugDir);

        //刷新libs 中 modules 文件
        CopyFiles.copyToLibs();

        //编译 bin-debug 文件
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        if (!result) {
            return 1;
        }

        //修改 html 中 modules 块
        //CopyFiles.modifyHTMLWithModules();

        //修改 html 中 game_list 块
        CompileTemplate.modifyIndexHTML(result.files);

        //根据 index.html 修改 native_require.js 文件，并看情况刷新 native 工程
        NativeProject.build();
        var timeBuildEnd: number = (new Date()).getTime();
        var timeBuildUsed:number = (timeBuildEnd - timeBuildStart)/1000;
        console.log(utils.tr(1108, timeBuildUsed));
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    }
}

export = Clean;
