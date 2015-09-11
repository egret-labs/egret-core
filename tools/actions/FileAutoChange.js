/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />
var FileAutoChangeCommand = (function () {
    function FileAutoChangeCommand() {
    }
    FileAutoChangeCommand.prototype.execute = function () {
        this.modifyNativeRequire();
        return 0;
    };
    FileAutoChangeCommand.prototype.modifyNativeRequire = function () {
        //var url = file.joinPath(egret.args.projectDir, "launcher", "native_require.js");
        //var native_require = file.read(url);
        //native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (this.needCompile ? "true" : "false") + ";");
        //
        ////native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        //file.save(url, native_require);
        //
        //
        //var url = file.joinPath(egret.args.projectDir, "libs/core/egret/player/Player.js");
        //var native_require = file.read(url);
        //
        //native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((this.debug || !this.versonCtrClassName) ? "false" : "true") + ";");
        //file.save(url, native_require);
    };
    return FileAutoChangeCommand;
})();
module.exports = FileAutoChangeCommand;

//# sourceMappingURL=../actions/FileAutoChange.js.map