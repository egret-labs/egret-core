/**
 * Created by huanghaiying on 15/3/18.
 */
var file = require("../core/file.js");
exports.compilerSingleFile = function (fileList, outputFile, tempFile, callback) {
    var uglifyJs = require("../uglify-js/uglifyjs");
    var result = uglifyJs.minify(fileList);
    file.save(outputFile, result.code);

    setTimeout(function () {
        callback();
    }, 100);
};
