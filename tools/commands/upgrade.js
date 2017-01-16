/**
 * Created by yanjiaqi on 15/9/7.
 */
/// <reference path="../lib/types.d.ts" />
/// <reference path="../lib/async/async.d.ts" />
var async = require("../lib/async/async");
var service = require("../service/index");
var UpgradeCommand = (function () {
    function UpgradeCommand() {
        this.upgradeConfigArr = [
            { "v": "4.0.0" }
        ];
    }
    UpgradeCommand.prototype.execute = function () {
        this.run();
        return DontExitCode;
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
            var v = info.v;
            var command;
            if (info.command) {
                command = new info.command();
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
                service.execCommand({
                    path: egret.args.projectDir,
                    command: "shutdown",
                    option: egret.args
                }, function () {
                    globals.log(1702);
                    return globals.exit(0);
                }, true);
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
}());
/**
 * todo
 */
function executeCommands(commands, callback) {
    if (commands.length == 0) {
        callback();
    }
    else {
        var command = commands.shift();
        var result = command.execute();
        if (typeof (result) == 'number') {
            executeCommands(commands, callback);
        }
        else {
            result.then(function () {
                executeCommands(commands, callback);
            });
        }
    }
}
module.exports = UpgradeCommand;
