/**
 * Created by yanjiaqi on 15/9/7.
 */
/// <reference path="../lib/types.d.ts" />

//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
//import config = require('../lib/ProjectConfig');
//import globals = require("../Globals");

class UpgradeCommand implements egret.Command {
    execute():number {
        this.run();
        return 0;
    }

    private run() {
        //var currDir = params.getProjectRoot();

        //var config = require("../core/projectConfig.js");
        //config.init(currDir);
        var version = egret.args.properties.getVersion();
        if (!version) {
            version = "1.0.0";
        }
        var modify = require("./upgrade/ModifyProperties");
        for (var i = 0; i < this.upgradeConfigArr.length; i++) {
            var info = this.upgradeConfigArr[i];
            var v = info["v"];
            var command = new info["command"]();

            var result = globals.compressVersion(version, v);
            if (result < 0) {
                globals.log(1704, v);

                if (command) {
                    command.execute();
                }

                modify.save(v);
            }
        }

        globals.exit(1702);
    }

    private upgradeConfigArr = [
        //todo
        {"v": "1.0.3", "command": require("./upgrade/UpgradeCommand_1_0_3")},
        {"v": "1.0.4", "command": require("./upgrade/UpgradeCommand_1_0_4")},
        {"v": "1.0.5", "command": require("./upgrade/UpgradeCommand_1_0_5")},
        //{"v" : "1.0.6"},
        {"v": "1.1.0", "command": require("./upgrade/UpgradeCommand_1_1_0")},
        //{"v" : "1.1.1"},
        //{"v" : "1.1.2"},
        //{"v" : "1.1.3"},
        //{"v" : "1.1.4"},
        {"v": "1.5.0", "command": require("./upgrade/UpgradeCommand_1_5_0")},
        {"v": "1.5.1", "command": require("./upgrade/UpgradeCommand_1_5_1")},
        {"v": "1.5.2", "command": require("./upgrade/UpgradeCommand_1_5_2")},
        //{"v" : "1.5.3"},
        //{"v" : "1.5.4"},
        {"v": "1.5.5", "command": require("./upgrade/UpgradeCommand_1_5_5")},
        //{"v" : "1.6.0"},
        //{"v" : "1.6.1"},
        //{"v" : "1.6.2"},
        //{"v" : "1.7.0"},
        //{"v" : "1.7.1"},
        //{"v": "1.7.2"},
        {"v": "1.7.3", "command": require("./upgrade/UpgradeCommand_1_7_3")},
        //{"v": "2.0.0"},
        //{"v": "2.0.1"},
        //{"v": "2.0.2"},
        //{"v": "2.4.0"},
        //{"v": "2.4.1"},
        {"v": "2.4.2", "command": require("./upgrade/UpgradeCommand_2_4_2")}
    ];
}

export = UpgradeCommand;