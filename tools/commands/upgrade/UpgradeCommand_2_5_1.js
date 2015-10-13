/// <reference path="../../lib/types.d.ts" />
var file = require('../../lib/FileUtil');
var modify = require("./ModifyProperties");
var UpgradeCommand_2_5_1 = (function () {
    function UpgradeCommand_2_5_1() {
        this.isAsync = false;
        this.asyncCallback = null;
    }
    UpgradeCommand_2_5_1.prototype.execute = function (asyncCallback) {
        this.upgradeTo_2_5_1();
        return 0;
    };
    /**
     * step1.创建新项目
     * step2.配置新项目
     * step3.API检测
     */
    UpgradeCommand_2_5_1.prototype.upgradeTo_2_5_1 = function () {
        var projectPath = egret.args.projectDir;
        //拷贝主题适配器
        var themePath = file.joinPath(projectPath, "src", "ThemeAdapter.ts");
        if (!file.exists(themePath)) {
            var module;
            if (modify.hasModule("gui")) {
                module = "gui";
            }
            if (modify.hasModule("eui")) {
                module = "eui";
            }
            if (module) {
                file.copy(file.joinPath(egret.root, "tools", "templates", module, "src", "ThemeAdapter.ts"), themePath);
            }
        }
    };
    return UpgradeCommand_2_5_1;
})();
module.exports = UpgradeCommand_2_5_1;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_2_5_1.js.map