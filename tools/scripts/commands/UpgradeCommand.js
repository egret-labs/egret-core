/// <reference path="../lib/types.d.ts" />
var config = require('../lib/ProjectConfig');
var globals = require("../Globals");
var UpgradeCommand = (function () {
    function UpgradeCommand() {
        this.upgradeConfigArr = [
            { "v": "1.0.3", "command": require("./upgrade/UpgradeCommand_1_0_3") },
            { "v": "1.0.4", "command": require("./upgrade/UpgradeCommand_1_0_4") },
            { "v": "1.0.5", "command": require("./upgrade/UpgradeCommand_1_0_5") },
            { "v": "1.1.0", "command": require("./upgrade/UpgradeCommand_1_1_0") },
            { "v": "1.5.0", "command": require("./upgrade/UpgradeCommand_1_5_0") },
            { "v": "1.5.1", "command": require("./upgrade/UpgradeCommand_1_5_1") },
            { "v": "1.5.2", "command": require("./upgrade/UpgradeCommand_1_5_2") },
            { "v": "1.5.5", "command": require("./upgrade/UpgradeCommand_1_5_5") },
            { "v": "1.7.2" },
            { "v": "1.7.3", "command": require("./upgrade/UpgradeCommand_1_7_3") },
            { "v": "2.4.0" }
        ];
    }
    UpgradeCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    UpgradeCommand.prototype.run = function () {
        //var currDir = params.getProjectRoot();
        //var config = require("../core/projectConfig.js");
        //config.init(currDir);
        var version = config.getVersion();
        if (!version) {
            version = "1.0.0";
        }
        var modify = require("./upgrade/ModifyProperties");
        for (var i = 0; i < this.upgradeConfigArr.length; i++) {
            var info = this.upgradeConfigArr[i];
            var v = info["v"];
            var command = info["command"];
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
    };
    return UpgradeCommand;
})();
module.exports = UpgradeCommand;
