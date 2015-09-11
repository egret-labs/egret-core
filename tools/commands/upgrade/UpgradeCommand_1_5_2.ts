/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_5_2 implements egret.Command {
    execute():number {
        this.upgradeTo_1_5_2();
        return 0;
    }

    private upgradeTo_1_5_2() {
        var native_require_path = file.joinPath(egret.args.projectDir, "launcher", "native_require.js");
        if (file.exists(native_require_path)) {
            var fileContent = file.read(native_require_path);
            fileContent = fileContent.replace("ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);", "ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);\n\n        console.log(\"版本控制文件加载失败，请检查\");\n        completeCall();");
            file.save(native_require_path, fileContent);
        }
    }

}

export = UpgradeCommand_1_5_2;