/// <reference path="../../lib/types.d.ts" />
var params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
var UpgradeCommand_1_0_5 = (function () {
    function UpgradeCommand_1_0_5() {
    }
    UpgradeCommand_1_0_5.prototype.execute = function () {
        this.upgradeTo_1_0_5();
        return 0;
    };
    UpgradeCommand_1_0_5.prototype.upgradeTo_1_0_5 = function () {
        var releasePath = file.join(params.getProjectRoot(), "launcher/index.html");
        var txt = file.read(releasePath);
        txt = txt.replace("\"libs/core/\"", "\"libs/\"");
        file.save(releasePath, txt);
        var releasePath = file.join(params.getProjectRoot(), "launcher/native_loader.js");
        var txt = file.read(releasePath);
        txt = txt.replace("\"libs/core", "\"libs");
        file.save(releasePath, txt);
        var releasePath = file.join(params.getProjectRoot(), "launcher/egret_loader.js");
        var txt = file.read(releasePath);
        txt = txt.replace("egret.StageScaleMode.SHOW_ALL", "egret.StageScaleMode.NO_BORDER");
        file.save(releasePath, txt);
    };
    return UpgradeCommand_1_0_5;
})();
module.exports = UpgradeCommand_1_0_5;
//# sourceMappingURL=UpgradeCommand_1_0_5.js.map