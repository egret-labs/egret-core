/// <reference path="../lib/types.d.ts" />
import FileUtil = require('../lib/FileUtil');
import path = require("../core/path");

class CompileTemplate{
    public compileTemplates(options, scripts):void {
        var fileListText = "var game_file_list = " + JSON.stringify(scripts, null, "\t") + ";";
        FileUtil.save(path.join(options.projectDir, "bin-debug/src/game_file_list.js"), fileListText);
    }
}