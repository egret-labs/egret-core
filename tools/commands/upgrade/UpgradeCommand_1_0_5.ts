/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_0_5 implements egret.Command {
    execute():number {
        this.upgradeTo_1_0_5();
        return 0;
    }
    private upgradeTo_1_0_5() {
        var releasePath = file.joinPath(egret.args.projectDir, "launcher/index.html");
        var txt = file.read(releasePath);
        txt = txt.replace("\"libs/core/\"", "\"libs/\"");
        file.save(releasePath, txt);


        var releasePath = file.joinPath(egret.args.projectDir, "launcher/native_loader.js");
        var txt = file.read(releasePath);
        txt = txt.replace("\"libs/core", "\"libs");
        file.save(releasePath, txt);


        var releasePath = file.joinPath(egret.args.projectDir, "launcher/egret_loader.js");
        var txt = file.read(releasePath);
        txt = txt.replace("egret.StageScaleMode.SHOW_ALL", "egret.StageScaleMode.NO_BORDER");
        file.save(releasePath, txt);
    }
}

export = UpgradeCommand_1_0_5;