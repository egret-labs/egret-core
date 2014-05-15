var fs = require('fs');
var locale = require("./locale/zh-CN.js");


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
            if (callback.call(this, filePath)) {

                result.push(path.relative(dir, filePath));
            }
        }
    }
    return result;
}


var _require = function (moduleName) {

    var module;
    try {
        module = require(moduleName)
    }
    catch (e) {
        var errorMessage = "加载模块 " + moduleName + " 失败\n请确认在" + process.argv[1] + "所在目录下已执行 npm install " + moduleName
        console.log(errorMessage);
        process.exit([1])
    }
    return module;

}


function remove(path) {
    fs.lstatSync(path).isDirectory()
        ? rmdir(path)
        : rmfile(path)
}

var rmfile = fs.unlinkSync
var rmdir = function (path) {
    fs.readdirSync(path).forEach(function (name) {
        remove(join(path, name))
    })
    fs.rmdirSync(path)
}


function copy(sourceFile, outputFile) {
    var stat = fs.lstatSync(sourceFile);
    if (stat.isFile()) {
        _copy_file(sourceFile, outputFile);
    }
    else if (stat.isDirectory()) {
        _copy_dir(sourceFile, outputFile);
    }
    else if (s.isSymbolicLink()) {
//        fs.symlink(fs.readlink(a)
    }
}

function _copy_file(source_file, output_file) {
    var path = require("path");
    mkdirSync(path.dirname(output_file))
    var byteArray = fs.readFileSync(source_file);
    fs.writeFileSync(output_file, byteArray);
}

function _copy_dir(sourceDir, outputDir) {
    var path = require("path");
    mkdirSync(outputDir);
    var list = fs.readdirSync(sourceDir);
    list.forEach(function (fileName) {

        copy(path.join(sourceDir, fileName), path.join(outputDir, fileName));
    });
}

function mkdirSync(p, mode, made) {
    var path = require("path");
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = mkdirSync(path.dirname(p), mode, made);
                mkdirSync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

function formatStdoutString(message){
    return message.split("{color_green}").join("\033[1;32;1m")
        .split("{color_normal}").join("\033[0m")
        .split("{color_underline}").join("\033[4;36;1m");
}

function _exit(code){
    var message = locale.error_code[code];
    if (!message){
        _exit(9999,code);
    }
    console.log (formatStdoutString(message).replace("{0}",arguments[1]));
    process.exit(code);
}


exports.loopFileSync = loopFileSync;
exports.require = _require;
exports.copy = copy;
exports.deleteFileSync = remove;
exports.exit = _exit;
exports.mkdir = mkdirSync;