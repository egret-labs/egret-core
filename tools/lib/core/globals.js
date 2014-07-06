var locale = require("./locale/zh-CN.js");
var param = require("../core/params_analyze.js");
var path = require("path");
var file = require("./file");

var _require = function (moduleName) {

    var module;
    try {
        module = require(path.join(param.getEgretPath(), moduleName));
    }
    catch (e) {
        var errorMessage = "加载模块 " + moduleName + " 失败\n请确认在" + param.getEgretPath() + "所在目录下已执行 npm install " + moduleName
        console.log(errorMessage);
        process.exit(1);
    }
    return module;

}

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

    var stat2 = file.exists(path.join(currDir, "src"));
    var stat3 = file.exists(path.join(currDir, "launcher"));
    if (!stat2 || !stat3) {//存在egret项目缺少的文件目录
        _exit(8002);
    }

    return currDir;
}

function getConfig(filepath) {
    var exists = file.exists(filepath);
    if (!exists){
        _exit(8003,filepath)
    }
    var content = file.read(filepath);
    var obj = JSON.parse(content);
    return obj;
}

var egretConfig;

function getDocumentClass(currDir){
    if(!egretConfig){
        var configPath = path.join(currDir,"egretProperties.json");
        egretConfig = getConfig(configPath);
    }
    return egretConfig["document_class"];
}

exports.require = _require;
exports.exit = _exit;
exports.warn = _warn;
exports.log = _log;
exports.joinEgretDir = _joinEgretDir;
exports.getConfig = getConfig;
exports.addCallBackWhenExit = addCallBackWhenExit;
exports.getDocumentClass = getDocumentClass;