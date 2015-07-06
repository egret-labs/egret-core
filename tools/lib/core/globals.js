var locale = require("./locale/local.js");
var param = require("../core/params_analyze.js");
var path = require("../core/path");
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
};

function checkVersion(projectPath) {
    var config = require("../core/projectConfig.js");
    config.init(projectPath);
    var version = config.data.egret_version;
    if (!version) {
        _exit(1701);
    }

    var egret_version = getPackageJsonConfig().version;

    var result = compressVersion(version, egret_version);
    if (result < 0) {
        _exit(1701);
    }
}

var packageJsonConfig;
function getPackageJsonConfig() {
    if(!packageJsonConfig) {
        var txt = file.read(param.getEgretPath() + "/package.json");
        packageJsonConfig = JSON.parse(txt);
    }
    return packageJsonConfig;
}

function getLanguageInfo() {
    var i18n = getPackageJsonConfig().i18n;
    if(!i18n) {
        i18n = "zh_CN";
    }
    else if(i18n == "en") {
        i18n = "en-US";
    }
    else {
        i18n = "zh_CN";
    }
    return i18n;
}

function compressVersion(v1, v2) {
    var version1Arr = v1.split(".");
    var version1_1 = version1Arr[0];
    var version1_2 = version1Arr[1];
    var version1_3 = version1Arr[2];

    var version1Arr = v2.split(".");
    var version2_1 = version1Arr[0];
    var version2_2 = version1Arr[1];
    var version2_3 = version1Arr[2];
    if (version1_1 > version2_1) {
        return 1
    }
    else if (version1_1 < version2_1) {
        return -1;
    }
    else if (version1_2 > version2_2) {
        return 1;
    }
    else if (version1_2 < version2_2) {
        return -1;
    }
    else if (version1_3 > version2_3) {
        return 1;
    }
    else if (version1_3 < version2_3) {
        return -1;
    }
    else {
        return 0;
    }
}

//第三方调用时，可能不支持颜色显示，可通过添加 -nocoloroutput 移除颜色信息
var ColorOutputReplacements = {
    "{color_green}": "\033[1;32;1m",
    "{color_red}": "\033[0;31m",
    "{color_normal}": "\033[0m",
    "{color_gray}": "\033[0;37m",
    "{color_underline}": "\033[4;36;1m"
};
var NoColorOutputReplacements = {
    "{color_green}": "",
    "{color_red}": "",
    "{color_normal}": "",
    "{color_gray}": "",
    "{color_underline}": "",
    "\n": "\\n",
    "\r": ""
};
function formatStdoutString(message) {
    var opt = param.getArgv().opts;
    var nocolor = opt.hasOwnProperty("-nocoloroutput");
    var replacements = nocolor ? NoColorOutputReplacements : ColorOutputReplacements;
    for (var raw in replacements) {
        message = message.split(raw).join(replacements[raw]);
    }
    return message;
}

var callBackList = [];

function addCallBackWhenExit(callBack) {
    callBackList.push(callBack)
}

function _exit(code) {
    var message = getString(code);
    if (!message) {
        _exit(9999, code);
    }
    var length = arguments.length;
    for (var i = 1; i < length; i++) {
        message = message.replace("{" + (i - 1) + "}", arguments[i]);
    }
    console.log(message);
    var opt = param.getArgv().opts;
    var vebose = opt.hasOwnProperty("-printError");
    if (vebose) {
        var url = path.join(process.cwd(), "error.txt")
        file.save(url, message);
    }
    var list = callBackList.concat();
    length = list.length;
    for (i = 0; i < length; i++) {
        var callBack = list[i];
        callBack();
    }
    process.exit(code);
}

function _log() {
    var opt = param.getArgv().opts;
    var vebose = opt.hasOwnProperty("-v");
    if (vebose) {
        var message = getString.apply(null, arguments);
        console.log(message);
    }
}

function _log2() {
    var message = getString.apply(null, arguments);
    console.log(message);
}

function _warn(code) {
    var message = getString(code);
    if (!message) {
        _exit(9999, code);
    }
    var length = arguments.length;
    for (var i = 1; i < length; i++) {
        message = message.replace("{" + (i - 1) + "}", arguments[i]);
    }
    console.log(message);
}

function _joinEgretDir(dir, projectName,ignoreCheck) {
    var currDir = dir;
    if (projectName) {
        currDir = path.resolve(projectName);
    }

    if (ignoreCheck){
        return currDir;
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
    if (!exists) {
        _exit(8003, filepath)
    }
    var content = file.read(filepath);
    var obj = JSON.parse(content);
    return obj;
}

var egretConfig;

function getDocumentClass(currDir) {
    if (!egretConfig) {
        var configPath = path.join(currDir, "egretProperties.json");
        if (file.exists(configPath)) {
            var content = file.read(configPath);
            try {
                egretConfig = JSON.parse(content);
            }
            catch (e) {
            }
        }
    }
    if (egretConfig) {
        return egretConfig["document_class"];
    }
    return "";
}

function addQuotes(str) {
    return "\"" + str + "\"";
}


var CodeUtil = require("../core/code_util.js");
/**
 * 这个文件是否只含有接口
 */
function isInterface(path) {
    var text = file.read(path);
    text = CodeUtil.removeComment(text, path);
    text = removeInterface(text);

    if (!CodeUtil.containsVariable("class", text) && !CodeUtil.containsVariable("var", text) && !CodeUtil.containsVariable("function", text)) {
        return true;
    }
    return false;
}

/**
 * 移除代码中的接口定义
 */
function removeInterface(text) {
    var tsText = "";

    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("interface", text);
        if (index == -1) {
            tsText += text;
            break;
        }
        tsText += text.substring(0, index);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        if (index == -1) {
            text = text.substring(9);
        }
        else {
            text = text.substring(index + 1);
        }
    }
    return tsText;
}

var isShow;
function setShowDebugLog() {
    isShow = param.getArgv()["opts"]["-debugLog"] != null
            || param.getArgv()["opts"]["-debuglog"] != null
            || param.getArgv()["opts"]["-log"] != null;
}

function debugLog(logStr) {
    if (isShow) {
        _log2.apply(null, arguments);
    }
}

function getGlobalJava() {
    var JAVA_EXT = process.platform == 'win32' ? '.exe' : '';

    var java = path.join(process.execPath,"../jre/bin","java" + JAVA_EXT);
    if(!file.exists(java)){
        java = null;
        if (process.env["JAVA_HOME"]) {
            java = path.join(process.env["JAVA_HOME"], "bin", "java" + JAVA_EXT);
            if (!file.exists(java)) {
                java = null;
            }
        }
    }
    if (!java) {
        java = "java";
    }
    else {
        java = '"' + java + '"';
    }
    return java;
}

function getString(id) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var message = locale.error_code[id];
    if (message) {
        var length = args.length;
        for (var i = 0; i < length; i++) {
            message = message.replace("{" + i + "}", args[i]);
        }
        message = formatStdoutString(message);
    }
    return message;
}

exports.getGlobalJava = getGlobalJava;

exports.setShowDebugLog = setShowDebugLog;
exports.debugLog = debugLog;


exports.isInterface = isInterface;
exports.require = _require;
exports.exit = _exit;
exports.warn = _warn;
exports.log = _log;
exports.log2 = _log2;
exports.joinEgretDir = _joinEgretDir;
exports.getConfig = getConfig;
exports.addCallBackWhenExit = addCallBackWhenExit;
exports.getDocumentClass = getDocumentClass;
exports.checkVersion = checkVersion;
exports.compressVersion = compressVersion;
exports.addQuotes = addQuotes;
exports.getPackageJsonConfig = getPackageJsonConfig;
exports.getLanguageInfo = getLanguageInfo;