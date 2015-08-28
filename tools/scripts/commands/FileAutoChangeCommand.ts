/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require("../lib/ProjectConfig");


class FileAutoChangeCommand implements egret.Command {
    needCompile:boolean;
    debug:boolean;
    versonCtrClassName:string;
    execute():number {
        this.modifyNativeRequire();
        return 0;
    }

    modifyNativeRequire() {
        var url = file.join(params.getProjectRoot(), "launcher", "native_require.js");
        var native_require = file.read(url);
        native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (this.needCompile ? "true" : "false") + ";");

        //native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        file.save(url, native_require);


        var url = file.join(params.getProjectRoot(), "libs/core/egret/player/Player.js");
        var native_require = file.read(url);

        native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        file.save(url, native_require);
    }
}

export = FileAutoChangeCommand;
