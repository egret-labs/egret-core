/**
 * Created by yanjiaqi on 15/9/7.
 */
/// <reference path="../lib/types.d.ts" />
/// <reference path="../lib/async/async.d.ts" />
var async = require('../lib/async/async');
//import config = require('../lib/ProjectConfig');
//import globals = require("../Globals");
var UpgradeCommand = (function () {
    function UpgradeCommand() {
        this.upgradeConfigArr = [
            //todo
            { "v": "1.0.3", "command": require("./upgrade/UpgradeCommand_1_0_3") },
            { "v": "1.0.4", "command": require("./upgrade/UpgradeCommand_1_0_4") },
            { "v": "1.0.5", "command": require("./upgrade/UpgradeCommand_1_0_5") },
            //{"v" : "1.0.6"},
            { "v": "1.1.0", "command": require("./upgrade/UpgradeCommand_1_1_0") },
            //{"v" : "1.1.1"},
            //{"v" : "1.1.2"},
            //{"v" : "1.1.3"},
            //{"v" : "1.1.4"},
            { "v": "1.5.0", "command": require("./upgrade/UpgradeCommand_1_5_0") },
            { "v": "1.5.1", "command": require("./upgrade/UpgradeCommand_1_5_1") },
            { "v": "1.5.2", "command": require("./upgrade/UpgradeCommand_1_5_2") },
            //{"v" : "1.5.3"},
            //{"v" : "1.5.4"},
            { "v": "1.5.5", "command": require("./upgrade/UpgradeCommand_1_5_5") },
            //{"v" : "1.6.0"},
            //{"v" : "1.6.1"},
            //{"v" : "1.6.2"},
            //{"v" : "1.7.0"},
            //{"v" : "1.7.1"},
            //{"v": "1.7.2"},
            { "v": "1.7.3", "command": require("./upgrade/UpgradeCommand_1_7_3") },
            //{"v": "2.0.0"},
            //{"v": "2.0.1"},
            //{"v": "2.0.2"},
            //{"v": "2.4.0"},
            //{"v": "2.4.1"},
            { "v": "2.5.0", "command": require("./upgrade/UpgradeCommand_2_4_3") },
            { "v": "2.5.1", "command": require("./upgrade/UpgradeCommand_2_5_1") },
            { "v": "2.5.2" },
            { "v": "2.5.3" },
            { "v": "2.5.4" },
            { "v": "2.5.5" }
        ];
        //升级命令是一个异步命令 内含异步控制流程
        this.isAsync = true;
    }
    UpgradeCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    UpgradeCommand.prototype.run = function () {
        //var currDir = params.getProjectRoot();
        //var config = require("../core/projectConfig.js");
        //config.init(currDir);
        var version = egret.args.properties.getVersion();
        if (!version) {
            version = "1.0.0";
        }
        var modify = require("./upgrade/ModifyProperties");
        async.eachSeries(this.upgradeConfigArr, function (info, callback) {
            function handleCallBack(err) {
                if (!err) {
                    modify.save(v);
                    callback();
                }
                else {
                    callback({ name: "", message: err });
                }
            }
            var v = info["v"];
            var command;
            if (info["command"]) {
                command = new info["command"]();
            }
            var result = globals.compressVersion(version, v);
            if (result < 0) {
                globals.log(1704, v);
                if (!command) {
                    handleCallBack();
                }
                else if (command.isAsync) {
                    command.execute(handleCallBack);
                }
                else {
                    var upgradeCommandError = command.execute();
                    if (upgradeCommandError != 0) {
                        handleCallBack('升级中断');
                    }
                    else {
                        handleCallBack();
                    }
                }
            }
            else {
                callback();
            }
        }, function (error) {
            if (error) {
                globals.exit(1705);
            }
            else {
                globals.exit(1702);
            }
        });
        //for (var i = 0; i < this.upgradeConfigArr.length; i++) {
        //    var info = this.upgradeConfigArr[i];
        //    var v = info["v"];
        //    var command = new info["command"]();
        //
        //    var result = globals.compressVersion(version, v);
        //    if (result < 0) {
        //        globals.log(1704, v);
        //        var upgradeCommandError = 0;
        //        if (command) {
        //            upgradeCommandError = command.execute();
        //        }
        //        if (!upgradeCommandError){
        //            modify.save(v);
        //        }
        //    }
        //}
        //
        //globals.exit(1702);
    };
    return UpgradeCommand;
})();
module.exports = UpgradeCommand;

//# sourceMappingURL=../commands/upgrade.js.map