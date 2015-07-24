/**
 * Created by yjtx on 15-7-21.
 */

import utils = require("./lib/utils");
import file = require("./lib/FileUtil");
import params = require("./ParamsParser");
export function exit(code:number, ...args) {
    return utils.exit.apply(null, arguments);
}

export function log2(code:number, ...args) {
    console.log(utils.tr.apply(null, arguments));
}
export function log(code:number, ...args) {

}
export function debugLog(code:number, ...args) {
    if (params.hasOption(["-log"])) {
        console.log(utils.tr.apply(null, arguments));
    }
}

export function hasKeys(obj:Object, keys:Array<string>) {
    var temp = obj;
    for (var i = 0; i < keys.length; i++) {
        temp = temp[keys[i]];
        if (temp == null) {
            return false;
        }
    }
    return true;
}


export function getAsync() {
    return require('../lib/core/async');
}

export function getCrc32() {
    return require("../lib/core/crc32");
}

export function getCompiler(method) {
    if (method == "uglify") {
        return require("../lib/uglify-js/uglify_adapt");
    }
    else {
        return require("../lib/core/closureCompiler");
    }
}

export function getExmlc() {
    return require("../lib/exml/exmlc");
}

export function getCodeUtil() {
    return require("../lib/core/code_util");
}

export function getOpen() {
    return require("../lib/core/open");
}

export function getCreateManifest() {
    return require("../lib/tools/create_manifest.js");
}

export function addQuotes(str) {
    return "\"" + str + "\"";
}

export function getGlobalJava() {
    var JAVA_EXT = process.platform == 'win32' ? '.exe' : '';

    var java = file.join(process.execPath,"../jre/bin","java" + JAVA_EXT);
    if(!file.exists(java)){
        java = null;
        if (process.env["JAVA_HOME"]) {
            java = file.join(process.env["JAVA_HOME"], "bin", "java" + JAVA_EXT);
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

var CodeUtil = require("../lib/core/code_util.js");
/**
 * 这个文件是否只含有接口
 */
export function isInterface(path) {
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

export function compressVersion(v1, v2):number {
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