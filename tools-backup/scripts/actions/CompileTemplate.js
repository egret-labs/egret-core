/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var path = require("../core/path");
var CompileTemplate = (function () {
    function CompileTemplate() {
    }
    CompileTemplate.prototype.compileTemplates = function (options, scripts) {
        var fileListText = "var game_file_list = " + JSON.stringify(scripts, null, "\t") + ";";
        FileUtil.save(path.join(options.projectDir, "bin-debug/src/game_file_list.js"), fileListText);
    };
    return CompileTemplate;
})();
