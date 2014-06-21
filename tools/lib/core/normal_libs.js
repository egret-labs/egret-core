var fs = require('fs');
var locale = require("./locale/zh-CN.js");
var param = require("../core/params_analyze.js");

var path = require("path");

var loopFileSync = function (dir, filter) {

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
        module = require(path.join(param.getEgretPath(), moduleName));
    }
    catch (e) {
        var errorMessage = "加载模块 " + moduleName + " 失败\n请确认在" + process.argv[1] + "所在目录下已执行 npm install " + moduleName
        console.log(errorMessage);
        process.exit([1])
    }
    return module;

}


function remove(path) {
    try{
        fs.lstatSync(path).isDirectory()
            ? rmdir(path)
            : rmfile(path)
    }
    catch (e){
    }
}

var rmfile = fs.unlinkSync
function rmdir(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                rmdir(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
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

function formatStdoutString(message) {
    return message.split("{color_green}").join("\033[1;32;1m")
        .split("{color_red}").join("\033[0;31m")
        .split("{color_normal}").join("\033[0m")
        .split("{color_gray}").join("\033[0;37m")
        .split("{color_underline}").join("\033[4;36;1m");
}

var callBackList = [];

function addCallBackWhenExit(callBack){
    callBackList.push(callBack)
}

function _exit(code) {
    var message = locale.error_code[code];
    if (!message) {
        _exit(9999, code);
    }
    message = formatStdoutString(message);
    var length = arguments.length;
    for(var i=1;i<length;i++){
        message = message.replace("{"+(i-1)+"}", arguments[i]);
    }
    console.log(message);
    var list = callBackList.concat();
    length = list.length;
    for(i=0;i<length;i++){
        var callBack = list[i];
        callBack();
    }
    process.exit(code);
}

function _log() {
    var opt = param.getArgv().opts;
    var vebose = opt.hasOwnProperty("-v");
    if (vebose) {
        console.log.apply(console, arguments);
    }


}
function _warn(code) {
    var message = locale.error_code[code];
    if (!message) {
        _exit(9999, code);
    }
    message = formatStdoutString(message);
    var length = arguments.length;
    for(var i=1;i<length;i++){
        message = message.replace("{"+(i-1)+"}", arguments[i]);
    }
    console.log(message);
}

function _joinEgretDir(dir, projectName) {
    var currDir = dir;
    if (projectName) {
        currDir = path.join(currDir, projectName);
    }

    var stat2 = fs.existsSync(path.join(currDir, "src"));
    var stat3 = fs.existsSync(path.join(currDir, "launcher"));
    if (!stat2 || !stat3) {//存在egret项目缺少的文件目录
        _exit(8002);
    }

    return currDir;
}

function getConfig(filepath) {
    var exists = fs.existsSync(filepath);
    if (!exists){
        _exit(8003,filepath)
    }
    var content = fs.readFileSync(filepath,"utf-8");
    var obj = JSON.parse(content);
    return obj;
}

function searchExtension(filePath, extension) {
    var list = [];
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()&&extension) {
        extension = extension.toLowerCase();
        search(filePath,extension,list);
    }
    return list;
}
function search(filePath,extension,list) {
    var files = fs.readdirSync(filePath);
    var length = files.length;
    var len = extension.length;
    for (var i = 0; i < length; i++) {
        var path = filePath + files[i];
        var stat = fs.statSync(path);
        if (path.charAt(0) == ".") {
            continue;
        }
        if (stat.isDirectory()) {
            search(path + "/", extension, list);
        } else {
            if(path.charAt(path.length-len-1)=="."&&
                path.substr(path.length-len,len).toLowerCase()==extension){
                list.push(path);
            }
        }
    }
}

exports.loopFileSync = loopFileSync;
exports.require = _require;
exports.copy = copy;
exports.deleteFileSync = remove;
exports.exit = _exit;
exports.warn = _warn;
exports.mkdir = mkdirSync;
exports.log = _log;
exports.joinEgretDir = _joinEgretDir;
exports.getConfig = getConfig;
exports.remove = remove;
exports.addCallBackWhenExit = addCallBackWhenExit;
exports.searchExtension = searchExtension;