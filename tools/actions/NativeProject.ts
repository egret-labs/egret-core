import CompileTemplate = require('../actions/CompileTemplate');
import copyNative = require("../actions/CopyNativeFiles");

export function build() {
    CompileTemplate.modifyNativeRequire(true);

    //拷贝项目到native工程中
    if (egret.args.runtime == "native") {
        console.log("----native build-----");

        copyNative.refreshNative(true);
    }
}
