var libs = {};
libs.loopFileSync = function (dir, filter) {

    var fs = require("fs");
    var path = require("path");
    var result = [];
    loop(dir, filter);

    function loop(filePath, callback) {
        if (filePath.indexOf(".svn") >= 0) return;
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            var list = fs.readdirSync(filePath);
            list.forEach(function (fileName) {
                loop(filePath + "/" + fileName, callback);
            });
        }
        else {
            if (callback.call(libs, filePath)){

                result.push(path.relative(dir,filePath));
            }

        }
    }
    return result;

}

exports.loopFileSync = libs.loopFileSync;