/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');
var UpgradeCommand_1_0_5 = (function () {
    function UpgradeCommand_1_0_5() {
    }
    UpgradeCommand_1_0_5.prototype.execute = function () {
        this.upgradeTo_1_0_5();
        return 0;
    };
    UpgradeCommand_1_0_5.prototype.upgradeTo_1_0_5 = function () {
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
    };
    return UpgradeCommand_1_0_5;
})();
module.exports = UpgradeCommand_1_0_5;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_1_0_5.js.map