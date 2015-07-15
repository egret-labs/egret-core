/**
 * Created by yjtx on 15-5-27.
 */
var path = require("../core/path");
var file = require("../core/file.js");

/**
 * 如果debug是true，则最后一个参数无需传入
 */
exports.modifyNativeRequire = function (url, needCompile, debug, versonCtrClassName) {
    var native_require = file.read(path.join(url, "launcher", "native_require.js"));
    native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (needCompile ? "true" : "false") + ";");

    native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((debug || !versonCtrClassName) ? "false" : "true") + ";");
    file.save(path.join(url, "launcher", "native_require.js"), native_require);
};