/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var FileAutoChange = require("../actions/FileAutoChange");
var CompileTemplate = (function () {
    function CompileTemplate() {
    }
    CompileTemplate.modifyIndexHTML = function (scripts) {
        //修改 native_require.js
        var autoChange = new FileAutoChange();
        var options = egret.args;
        var list = FileUtil.getDirectoryListing(options.projectDir);
        for (var key in list) {
            var filepath = list[key];
            if (FileUtil.getExtension(filepath) == "html") {
                autoChange.refreshDebugHtml(filepath, scripts);
            }
        }
    };
    CompileTemplate.modifyNativeRequire = function () {
        var options = egret.args;
        var index = FileUtil.joinPath(options.projectDir, "index.html");
        //修改 native_require.js
        var autoChange = new FileAutoChange();
        autoChange.refreshNativeRequire(index, true);
    };
    return CompileTemplate;
})();
module.exports = CompileTemplate;

//# sourceMappingURL=../actions/CompileTemplate.js.map