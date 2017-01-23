var CompileTemplate = require("../actions/CompileTemplate");
var copyNative = require("../actions/CopyNativeFiles");
function build() {
    CompileTemplate.modifyNativeRequire(true);
    //拷贝项目到native工程中
    if (egret.args.runtime == "native") {
        console.log("----native build-----");
        copyNative.refreshNative(true);
    }
}
exports.build = build;
