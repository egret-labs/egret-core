
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');

import exmlActions = require('../actions/exml');

class Clean implements egret.Command {
    execute(): number {
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
        utils.clean(options.debugDir)

        
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
    }
}

export = Clean;