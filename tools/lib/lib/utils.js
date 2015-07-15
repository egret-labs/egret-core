//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/// <reference path="./node.d.ts" />
var cp = require('child_process');
var path = require('path');
var file = require('./FileUtil');
var UglifyJS = require("../uglify-js/uglifyjs");
global["$locale_strings"] = global["$locale_strings"] || {};
var $locale_strings = global["$locale_strings"];
/**
    * 全局多语言翻译函数
    * @param code 要查询的字符串代码
    * @param args 替换字符串中{0}标志的参数列表
    * @returns 返回拼接后的字符串
    */
function tr(code) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var text = $locale_strings[code];
    if (!text) {
        return "{" + code + "}";
    }
    text = format(text, args);
    return text;
}
exports.tr = tr;
function format(text) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var length = args.length;
    for (var i = 0; i < length; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "ig"), args[i]);
    }
    return text;
}
exports.format = format;
function exit(code) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var message = tr.apply(this, [code].concat(args));
    console.error(message);
    process.exit(code);
}
exports.exit = exit;
function _getEnv() {
    return process.env;
}
function getEgretRoot() {
    var path = require("../core/path");
    var egret_path = _getEnv().EGRET_PATH;
    if (!egret_path) {
        var globalpath = module.paths.concat();
        var existsFlag = false;
        for (var i = 0; i < globalpath.length; i++) {
            var prefix = globalpath[i];
            var url = path.join(prefix, "../egret-core");
            if (file.exists(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "egret");
            if (file.exists(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "../egret");
            if (file.exists(url)) {
                existsFlag = true;
                break;
            }


        }
        if (!existsFlag) {
            throw new Error("can't find Egret");
        }


        egret_path = url;
    }
    return egret_path;
}
exports.getEgretRoot = getEgretRoot;
function open(target, appName, callback) {
    var opener;
    if (typeof (appName) === 'function') {
        callback = appName;
        appName = null;
    }
    switch (process.platform) {
        case 'darwin':
            if (appName) {
                opener = 'open -a "' + escape(appName) + '"';
            }
            else {
                opener = 'open';
            }
            break;
        case 'win32':
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                opener = 'start "" "' + escape(appName) + '"';
            }
            else {
                opener = 'start ""';
            }
            break;
        default:
            if (appName) {
                opener = escape(appName);
            }
            else {
                // use Portlands xdg-open everywhere else
                opener = path.join(__dirname, '../vendor/xdg-open');
            }
            break;
    }
    return cp.exec(opener + ' "' + escape(target) + '"', null, callback);
}
exports.open = open;
function endWith(text, match) {
    return text.lastIndexOf(match) == (text.length - match.length);
}
exports.endWith = endWith;
function escape(s) {
    return s.replace(/"/, '\\\"');
}
function minify(sourceFile, output) {
    var defines = {
        DEBUG: false,
        RELEASE: true
    };
    //UglifyJS参数参考这个页面：https://github.com/mishoo/UglifyJS2
    var result = UglifyJS.minify(sourceFile, { compress: { global_defs: defines }, output: { beautify: false } });
    file.save(output, result.code);
}
exports.minify = minify;
function clean(path) {
    var excludes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludes[_i - 1] = arguments[_i];
    }
    var fileList = file.getDirectoryListing(path);
    var length = fileList.length;
    for (var i = 0; i < length; i++) {
        var path = fileList[i];
        if (excludes && excludes.indexOf(path) >= 0)
            continue;
        file.remove(path);
    }
}
exports.clean = clean;
