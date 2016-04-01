/// <reference path="../../lib/types.d.ts" />

import fs = require("fs");
import file = require('../../lib/FileUtil');
import utils = require('../../lib/utils');
import modify = require("./ModifyProperties");

class UpgradeCommand_2_5_1 implements egret.Command {
    isAsync = false;
    private asyncCallback:(err?:Error)=>void = null;

    execute(asyncCallback?:(err?: Error)=>void): number{
        this.upgradeTo_2_5_1();
        return 0;
    }

    /**
     * step1.创建新项目
     * step2.配置新项目
     * step3.API检测
     */
    private upgradeTo_2_5_1(){
        var projectPath = egret.args.projectDir;
        //拷贝主题适配器
        var themePath = file.joinPath(projectPath, "src", "ThemeAdapter.ts");
        if(!file.exists(themePath)) {
            var module;
            if(modify.hasModule("gui")) {
                module = "gui";
            }
            if(modify.hasModule("eui")) {
                module = "eui";
            }
            if(module) {
                file.copy(file.joinPath(egret.root, "tools", "templates", module, "src", "ThemeAdapter.ts"), themePath);
            }
        }
    }
}

export = UpgradeCommand_2_5_1;
