/// <reference path="../../lib/types.d.ts" />
var params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
var UpgradeCommand_1_7_3 = (function () {
    function UpgradeCommand_1_7_3() {
    }
    UpgradeCommand_1_7_3.prototype.execute = function () {
        this.upgradeTo_1_7_3();
        return 0;
    };
    UpgradeCommand_1_7_3.prototype.upgradeTo_1_7_3 = function () {
        var projectDir = params.getProjectRoot();
        try {
            var modify = require("./upgrade/ModifyProperties");
            var properties = modify.getProperties();
            var hasRes = false;
            for (var key in properties.modules) {
                var module = properties.modules[key];
                if (module.name == "version" && !module.path) {
                    hasRes = true;
                    break;
                }
                else if (module.name == "version_old" && !module.path) {
                    hasRes = true;
                    break;
                }
            }
            if (!hasRes) {
                properties.modules.splice(1, 0, { "name": "version_old" });
            }
            modify.save();
        }
        catch (e) {
        }
        //修改native_require.js
        var native_require_path = file.join(params.getProjectRoot(), "launcher", "native_require.js");
        if (file.exists(native_require_path)) {
            var fileContent = file.read(native_require_path);
            fileContent = fileContent.replace(/var(\s)+ctr(\s)*=(\s)*egret.MainContext.instance.netContext._versionCtr.*/, "//版本控制自动修改 请勿更改\n    //This variable is used to load the file judgement, please do not change it\n    var egretNeedVersionCtr = false;\n    if (!egretNeedVersionCtr) {\n        completeCall();\n        return;\n    }\n\n    var ctr = new egret.NativeVersionController();\n    egret.MainContext.instance.netContext.initVersion(ctr);\n");
            file.save(native_require_path, fileContent);
        }
    };
    return UpgradeCommand_1_7_3;
})();
module.exports = UpgradeCommand_1_7_3;
