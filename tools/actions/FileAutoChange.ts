/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require("../ProjectConfig");

class FileAutoChangeCommand implements egret.Command {
    needCompile:boolean;
    debug:boolean;
    versonCtrClassName:string;
    execute():number {
        this.modifyNativeRequire();
        return 0;
    }

    modifyNativeRequire() {
        var url = file.joinPath(egret.args.projectDir, "launcher", "native_require.js");
        var native_require = file.read(url);
        native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (this.needCompile ? "true" : "false") + ";");

        //native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        file.save(url, native_require);


        var url = file.joinPath(egret.args.projectDir, "libs/core/egret/player/Player.js");
        var native_require = file.read(url);

        native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        file.save(url, native_require);
    }
}

export = FileAutoChangeCommand;
