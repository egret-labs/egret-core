/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");

class CreateManifestCommand implements egret.Command {
    execute():number {
        this.run();
        return 0;
    }

    private createAll:boolean;

    initOptions(options:Object):void {
        this.createAll = !!(params.getObjectOption(options, '-all'));
    }

    private run() {
        var currDir = params.getProjectRoot();
        var srcPath = file.joinPath(currDir, "src/");

        var gameList = globals.getCreateManifest().create(srcPath, this.createAll);
        var length = gameList.length;
        for (var i = 0; i < length; i++) {
            var path = gameList[i];
            path = path.substring(srcPath.length);
            gameList[i] = "    \"" + path + "\"";
        }
        var fileListText = "[\n" + gameList.join(",\n") + "\n]";
        file.save(file.joinPath(currDir, "manifest.json"), fileListText);
        globals.log(6);
    }
}

export = CreateManifestCommand;