var fe = {};
fe.fs = require("fs");

fe.loop = function (filePath, callback) {
    if (filePath.indexOf(".svn") >= 0) return;
    var stat = fe.fs.statSync(filePath);
    if (stat.isDirectory()) {
        var list = fe.fs.readdirSync(filePath);
        list.forEach(function (fileName) {
            fe.loop(filePath + "/" + fileName, callback);
        });
    }
    else {
        callback.call(fe, filePath);
    }
}

fe.run = function (filePath, callback) {

    fe.loop(filePath, callback);

}

exports.run = fe.run;