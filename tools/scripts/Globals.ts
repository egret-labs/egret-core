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
    return require("../lib/exml/exmlc.js");
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