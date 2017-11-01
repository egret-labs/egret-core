/// <reference path="lib/types.d.ts" />



module globals {
    var utils = require("./lib/utils");
    var file = require("./lib/FileUtil");
    export function exit(code: number, ...args) {
        return utils.exit.apply(null, arguments);
    }

    export function log2(code: number, ...args) {
        console.log(utils.tr.apply(null, arguments));
    }
    export function log(code: number, ...args) {
        console.log(utils.tr.apply(null, arguments));
    }
    export function warn(code: number, ...args) {
        var message = utils.tr.apply(null, arguments);
        if (!message) {
            exit(9999, code);
        }
        var length = arguments.length;
        for (var i = 1; i < length; i++) {
            message = message.replace("{" + (i - 1) + "}", arguments[i]);
        }
        console.log(message);
    }

    export function debugLog(code: number, ...args) {
        if (egret.args.log) {
            console.log(utils.tr.apply(null, arguments));
        }
    }

    export function hasKeys(obj: Object, keys: Array<string>) {
        var temp = obj;
        for (var i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
            if (temp == null) {
                return false;
            }
        }
        return true;
    }

    export function getCrc32() {
        return require("./lib/core/crc32");
    }

    export function addQuotes(str) {
        return "\"" + str + "\"";
    }

    var CodeUtil = require("./lib/exml/code_util.js");

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

    export function compressVersion(v1, v2): number {
        var version1Arr = v1.split(".");
        var version1_1 = parseInt(version1Arr[0]);
        var version1_2 = parseInt(version1Arr[1]);
        var version1_3 = parseInt(version1Arr[2]);

        var version1Arr = v2.split(".");
        var version2_1 = parseInt(version1Arr[0]);
        var version2_2 = parseInt(version1Arr[1]);
        var version2_3 = parseInt(version1Arr[2]);
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
}
declare var global: any;
global.globals = globals;