/// <reference path="../../lib/types.d.ts" />
var globals = require("../../Globals");
var UpgradeCommand_2_4_2 = (function () {
    function UpgradeCommand_2_4_2() {
    }
    UpgradeCommand_2_4_2.prototype.execute = function () {
        this.upgradeTo_2_4_2();
        return 0;
    };
    UpgradeCommand_2_4_2.prototype.upgradeTo_2_4_2 = function () {
        var open = globals.getOpen();
        open("https://github.com/egret-labs/egret-core/tree/v2.4.2/docs/cn/2.4.2_ReleaseNotes.md");
        globals.exit(1702);
    };
    return UpgradeCommand_2_4_2;
})();
module.exports = UpgradeCommand_2_4_2;
