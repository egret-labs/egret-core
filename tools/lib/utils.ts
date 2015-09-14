﻿//////////////////////////////////////////////////////////////////////////////////////
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

import cp = require('child_process');
import path = require('path');
import file = require('./FileUtil');
import UglifyJS = require("./uglify-js/uglifyjs");
import net = require('net');


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
    var replacements = ColorOutputReplacements;
    for (var raw in replacements) {
        message = message.split(raw).join(replacements[raw]);
    }
    return message;
}

global["$locale_strings"] = global["$locale_strings"] || {};
var $locale_strings = global["$locale_strings"];
/**
    * 全局多语言翻译函数
    * @param code 要查询的字符串代码
    * @param args 替换字符串中{0}标志的参数列表
    * @returns 返回拼接后的字符串
    */
export function tr(code: number, ...args): string {
    var text = $locale_strings[code];
    if (!text) {
        return "{" + code + "}";
    }
    text = format.apply(this, [text].concat(args));
    return text;
}

export function format(text: string, ...args): string {
    var length = args.length;
    for (var i = 0; i < length; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "ig"), args[i]);
    }

    text = formatStdoutString(text);

    return text;
}

export function exit(code: number, ...args) {
    if (code) {
        var message = tr.apply(this, [code].concat(args));
        console.error(message);
    }
    process.exit(code);
}

function _getEnv() {
    return process.env;
}


export function getEgretRoot() {
    var path = require("path");
    var obj = _getEnv();
    var larkRoot = _getEnv().EGRET_PATH;
    if (!larkRoot) {
        var globalpath = module['paths'].concat();
        var existsFlag = false;
        for (var i = 0; i < globalpath.length; i++) {
            var prefix = globalpath[i];
            var url = file.joinPath(prefix, '../');
            if (file.exists(file.joinPath(url,'tools/bin/egret'))) {
                existsFlag = true;
                break;
            }
            url = prefix;
            if (file.exists(file.joinPath(url, 'tools/bin/egret'))) {
                existsFlag = true;
                break;
            }
        }
        if (!existsFlag) {
            throw new Error("can't find Egret");
        }


        larkRoot = url;
    }
    return file.escapePath(file.joinPath(larkRoot, '/'));
}




export function open(target, appName?, callback?) {
    var opener;

    if (typeof (appName) === 'function') {
        callback = appName;
        appName = null;
    }

    switch (process.platform) {
        case 'darwin':
            if (appName) {
                opener = 'open -a "' + escape(appName) + '"';
            } else {
                opener = 'open';
            }
            break;
        case 'win32':
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                opener = 'start "" "' + escape(appName) + '"';
            } else {
                opener = 'start ""';
            }
            break;
        default:
            if (appName) {
                opener = escape(appName);
            } else {
                // use Portlands xdg-open everywhere else
                opener = path.join(__dirname, '../vendor/xdg-open');
            }
            break;
    }

    return cp.exec(opener + ' "' + escape(target) + '"',null, callback);
}



export function endWith(text: string, match: string) {
    return text.lastIndexOf(match) == (text.length - match.length);
}


function escape(s) {
    return s.replace(/"/, '\\\"');
}

export function minify(sourceFile: string, output: string) {


    var defines = {
        DEBUG: false,
        RELEASE: true
    }
    //UglifyJS参数参考这个页面：https://github.com/mishoo/UglifyJS2
    var result = UglifyJS.minify(sourceFile, { compress: { global_defs: defines }, output: { beautify: false } });
    file.save(output, result.code);
}

export function clean(path: string,...excludes:string[]) {
    var fileList = file.getDirectoryListing(path);
    var length = fileList.length;
    for (var i = 0; i < length; i++)
    {
        var path = fileList[i];
        if (excludes && excludes.indexOf(path) >= 0)
            continue;
        file.remove(path);
    }
}

export function getNetworkAddress(): string[] {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips: string[] = [];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            ips.push(iface.address);
        });
    });

    return ips;
}

export function getAvailablePort(callback: (port: number) => void, port= 0) {

    function getPort() {
        var server = net.createServer();
        server.on('listening', function () {
            port = server.address().port
            server.close()
        })
        server.on('close', function () {
            console.log("Got port", port);
            callback(port)
        })
        server.on('error', function (err) {
            port++;
            getPort();
        })
        server.listen(port, '0.0.0.0')
    }

    getPort();
}