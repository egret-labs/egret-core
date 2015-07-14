/**
 * Created by huanghaiying on 15/3/18.
 */
var file = require("../core/file.js");
exports.compilerSingleFile = function (fileList, outputFile, tempFile, callback) {
    var uglifyJs = require("../uglify-js/uglifyjs");
    var defines = {
        DEBUG: false,
        RELEASE: true
    };

    fileList = fileList.filter(function (item) {
        if (item.indexOf("")) {

        }
    });

    var result = uglifyJs.minify(fileList, { compress: { global_defs: defines }, output: { beautify: false } });

    //var result = uglifyJs.minify(fileList);
    file.save(outputFile, result.code);

    setTimeout(function () {
        callback();
    }, 100);
};
