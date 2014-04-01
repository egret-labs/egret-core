var copy = require('cp-r')

var loopFileSync = function (dir, filter) {

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
            if (callback.call(this, filePath)){

                result.push(path.relative(dir,filePath));
            }
        }
    }
    return result;

}


var _require = function(moduleName){

    var module;
    try{
        module = require(moduleName)
    }
    catch(e) {
        var errorMessage = "加载模块 " + moduleName + " 失败\n请确认在" + process.argv[1] + "所在目录下已执行 npm install " + moduleName
        console.log (errorMessage);
        process.exit([1])
    }
    return module;

}

var _copy = function(sourceFile, outputFile, callback) {
    copy(sourceFile, outputFile).read(callback);
}

exports.loopFileSync = loopFileSync;
exports.require = _require;
exports.copy = _copy;