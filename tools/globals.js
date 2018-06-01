/// <reference path="lib/types.d.ts" />
var globals;
(function (globals) {
    var utils = require("./lib/utils");
    var file = require("./lib/FileUtil");
    function exit(code) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return utils.exit.apply(null, arguments);
    }
    globals.exit = exit;
    function log2(code) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(utils.tr.apply(null, arguments));
    }
    globals.log2 = log2;
    function log(code) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(utils.tr.apply(null, arguments));
    }
    globals.log = log;
    function warn(code) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
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
    globals.warn = warn;
    function debugLog(code) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (egret.args.log) {
            console.log(utils.tr.apply(null, arguments));
        }
    }
    globals.debugLog = debugLog;
    function hasKeys(obj, keys) {
        var temp = obj;
        for (var i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
            if (temp == null) {
                return false;
            }
        }
        return true;
    }
    globals.hasKeys = hasKeys;
    function getCrc32() {
        return require("./lib/core/crc32");
    }
    globals.getCrc32 = getCrc32;
    function addQuotes(str) {
        return "\"" + str + "\"";
    }
    globals.addQuotes = addQuotes;
    function compressVersion(v1, v2) {
        var version1Arr = v1.split(".");
        var version1_1 = parseInt(version1Arr[0]);
        var version1_2 = parseInt(version1Arr[1]);
        var version1_3 = parseInt(version1Arr[2]);
        var version1Arr = v2.split(".");
        var version2_1 = parseInt(version1Arr[0]);
        var version2_2 = parseInt(version1Arr[1]);
        var version2_3 = parseInt(version1Arr[2]);
        if (version1_1 > version2_1) {
            return 1;
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
    globals.compressVersion = compressVersion;
})(globals || (globals = {}));
global.globals = globals;
