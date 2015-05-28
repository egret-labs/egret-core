/**
 * Created by yjtx on 15-5-27.
 */
var path = require("path");
var file = require("../core/file.js");

exports.modifyNativeRequire = function (url, needCompile, debug, versonCtrClassName) {
    var native_require = file.read(path.join(url, "launcher", "native_require.js"));
    console.log(url)
    native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (needCompile ? "true" : "false") + ";");

    native_require = native_require.replace(/var egretNeedVersionCtr =.*/, "var egretNeedVersionCtr = " + ((debug || !versonCtrClassName) ? "false" : "true") + ";");
    console.log((!!debug || !versonCtrClassName) ? "false" : "true");
    console.log(!!debug);
    console.log(versonCtrClassName);
    file.save(path.join(url, "launcher", "native_require.js"), native_require);
};