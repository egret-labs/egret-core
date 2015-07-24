/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var FileAutoChangeCommand = (function () {
    function FileAutoChangeCommand() {
    }
    FileAutoChangeCommand.prototype.execute = function () {
        this.modifyNativeRequire();
        return 0;
    };
    FileAutoChangeCommand.prototype.modifyNativeRequire = function () {
        var url = params.getProjectRoot();
        var native_require = file.read(file.join(url, "launcher", "native_require.js"));
        native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (this.needCompile ? "true" : "false") + ";");
        native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        file.save(file.join(url, "launcher", "native_require.js"), native_require);
    };
    return FileAutoChangeCommand;
})();
module.exports = FileAutoChangeCommand;
