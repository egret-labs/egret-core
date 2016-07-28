/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');
var UpgradeCommand_1_5_0 = (function () {
    function UpgradeCommand_1_5_0() {
    }
    UpgradeCommand_1_5_0.prototype.execute = function () {
        this.upgradeTo_1_5_0();
        return 0;
    };
    UpgradeCommand_1_5_0.prototype.upgradeTo_1_5_0 = function () {
        var projectDir = egret.args.projectDir;
        //更新egretProperties.json
        try {
            var modify = require("../upgrade/ModifyProperties");
            var properties = modify.getProperties();
            if (properties.native && properties.native.support_path && properties.native.support_path.length > 0) {
                for (var i = 0; i < properties.native.support_path.length; i++) {
                    var supP = properties.native.support_path[i];
                    if (supP.indexOf("proj.android") >= 0) {
                        properties.native.android_path = supP.substring(0, supP.indexOf("proj.android") - 1);
                    }
                    else if (supP.indexOf("proj.ios") >= 0) {
                        properties.native.ios_path = supP.substring(0, supP.indexOf("proj.ios") - 1);
                    }
                }
                delete properties.native.support_path;
                modify.save();
            }
        }
        catch (e) {
        }
        //替换 native_loader.js
        var loaderPath = file.joinPath(projectDir, "launcher", "native_loader.js");
        var loaderContent = file.read(loaderPath);
        //保存副本
        file.save(file.joinPath(projectDir, "launcher", "copy_native_loader.js"), loaderContent);
        //生成egret_loader.js样板
        var fileContent = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "runtime_loader.js"));
        file.save(file.joinPath(projectDir, "launcher", "runtime_loader.js"), fileContent);
        var fileContent = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "native_loader.js"));
        file.save(file.joinPath(projectDir, "launcher", "native_loader.js"), fileContent);
        var fileContent = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "native_require.js"));
        file.save(file.joinPath(projectDir, "launcher", "native_require.js"), fileContent);
        var open = globals.getOpen();
        open("https://github.com/egret-labs/egret-core/blob/master/docs/1.5.0_ReleaseNotes.md");
    };
    return UpgradeCommand_1_5_0;
})();
module.exports = UpgradeCommand_1_5_0;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_1_5_0.js.map