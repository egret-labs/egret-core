/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_0_4 implements egret.Command {
    execute():number {
        this.upgradeTo_1_0_4();
        return 0;
    }
    private upgradeTo_1_0_4() {
        //新的publish改之后，需要把base给删掉
        var releasePath = file.joinPath(egret.args.projectDir, "launcher/release.html");
        var txt = file.read(releasePath);
        txt = txt.replace("<base href=\"../\"/>", "");
        file.save(releasePath, txt);
        file.remove(file.joinPath(egret.args.projectDir, "libs/egret.d.ts"));
        var releasePath = file.joinPath(egret.args.projectDir, "launcher/index.html");
        var txt = file.read(releasePath);
        txt = txt.replace("\"bin-debug/lib/\"", "\"libs/core/\"");
        file.save(releasePath, txt);

        var modify = require("../upgrade/ModifyProperties");
        var projectConfig = modify.getProperties();
        projectConfig.modules = [
            {
                "name": "core"
            },
            {
                "name": "gui"
            },
            {
                "name": "dragonbones"
            }
        ];
        projectConfig.native.path_ignore = [];
    }
}

export = UpgradeCommand_1_0_4;