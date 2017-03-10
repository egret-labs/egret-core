/**
 * Created by jackyanjiaqi on 17/3/8.
 */
var config = require("./native/config");
var EgretNative = (function () {
    function EgretNative() {
    }
    EgretNative.prototype.execute = function () {
        var commands = egret.args.commands;
        if (commands[1]) {
            console.log("projectDir:", egret.args.projectDir);
            console.log("egret.args:", egret.args);
            if (!egret.args.projectDir) {
                globals.exit(13000);
            }
            else {
                try {
                    var subCommander = commands[1];
                    var runner = require("./native/" + subCommander);
                    config.initConfig(egret.args.projectDir);
                    runner.run(egret.args);
                }
                catch (err) {
                    console.error(err);
                    console.log(commands);
                }
            }
        }
        return DontExitCode;
    };
    return EgretNative;
}());
module.exports = EgretNative;
