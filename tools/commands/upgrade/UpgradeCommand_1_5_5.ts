/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_5_5 implements egret.Command {
    execute():number {
        this.upgradeTo_1_5_5();
        return 0;
    }

    private upgradeTo_1_5_5() {
        var projectDir = egret.args.projectDir;
        //更新egretProperties.json， 将res变成一个单独的模块
        try {
            var modify = require("../upgrade/ModifyProperties");
            var properties = modify.getProperties();

            var hasRes = false;
            for (var key in properties.modules) {
                var module = properties.modules[key];
                if (module.name == "res") {
                    hasRes = true;
                    break;
                }
            }
            if (!hasRes) {
                properties.modules.splice(1, 0, {"name" : "res"});
            }
            modify.save();
        }
        catch (e) {

        }
    }

}

export = UpgradeCommand_1_5_5;