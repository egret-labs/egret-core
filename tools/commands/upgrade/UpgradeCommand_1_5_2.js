/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');
var UpgradeCommand_1_5_2 = (function () {
    function UpgradeCommand_1_5_2() {
    }
    UpgradeCommand_1_5_2.prototype.execute = function () {
        this.upgradeTo_1_5_2();
        return 0;
    };
    UpgradeCommand_1_5_2.prototype.upgradeTo_1_5_2 = function () {
        var native_require_path = file.joinPath(egret.args.projectDir, "launcher", "native_require.js");
        if (file.exists(native_require_path)) {
            var fileContent = file.read(native_require_path);
            fileContent = fileContent.replace("ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);", "ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);\n\n        console.log(\"版本控制文件加载失败，请检查\");\n        completeCall();");
            file.save(native_require_path, fileContent);
        }
    };
    return UpgradeCommand_1_5_2;
})();
module.exports = UpgradeCommand_1_5_2;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_1_5_2.js.map