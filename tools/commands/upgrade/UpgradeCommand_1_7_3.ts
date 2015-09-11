/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_7_3 implements egret.Command {
    execute():number {
        this.upgradeTo_1_7_3();
        return 0;
    }

    private upgradeTo_1_7_3() {
        var projectDir = egret.args.projectDir;
        //更新egretProperties.json， 将版本控制变成一个单独的模块，并且将新的版本控制作为默认模块
        try {
            var modify = require("../upgrade/ModifyProperties");
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
                properties.modules.splice(1, 0, {"name" : "version_old"});
            }
            modify.save();
        }
        catch (e) {

        }

        //修改native_require.js
        var native_require_path = file.joinPath(egret.args.projectDir, "launcher", "native_require.js");
        if(file.exists(native_require_path)){
            var fileContent = file.read(native_require_path);
            fileContent = fileContent.replace(/var(\s)+ctr(\s)*=(\s)*egret.MainContext.instance.netContext._versionCtr.*/,"//版本控制自动修改 请勿更改\n    //This variable is used to load the file judgement, please do not change it\n    var egretNeedVersionCtr = false;\n    if (!egretNeedVersionCtr) {\n        completeCall();\n        return;\n    }\n\n    var ctr = new egret.NativeVersionController();\n    egret.MainContext.instance.netContext.initVersion(ctr);\n");
            file.save(native_require_path, fileContent);
        }
    }
}

export = UpgradeCommand_1_7_3;