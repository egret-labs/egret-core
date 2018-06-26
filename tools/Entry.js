//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./lib/types.d.ts" />
global.DEBUG = true;
global.egret = global.egret || {};
global.registerClass = "egret";
global.DontExitCode = -0xF000;
require('./globals');
var Parser = require("./parser/Parser");
var earlyParams = require("./parser/ParseEarlyVersionParams");
var utils = require("./lib/utils");
var index_1 = require("./project/index");
var fs = require('fs');
var path = require('path');
var packageJsonConfig;
function getPackageJsonConfig() {
    if (!packageJsonConfig) {
        var txt = fs.readFileSync(getEgretPath() + "/package.json", "utf-8");
        packageJsonConfig = JSON.parse(txt);
    }
    return packageJsonConfig;
}
function getEgretPath() {
    var obj = process.env;
    var egret_path = process.env.EGRET_PATH;
    if (!egret_path) {
        var globalpath = module['paths'].concat();
        var existsFlag = false;
        for (var i = 0; i < globalpath.length; i++) {
            var prefix = globalpath[i];
            var url = path.join(prefix, "../egret-core");
            if (fs.existsSync(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "egret");
            if (fs.existsSync(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "../egret");
            if (fs.existsSync(url)) {
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
function getLanguageInfo() {
    var osLocal = require("./lib/os-local.js");
    var i18n = osLocal();
    i18n = i18n.toLowerCase();
    if (i18n == "zh_cn" || i18n == "zh_tw" || i18n == "zh_hk") {
        require('./locales/zh_CN');
    }
    else {
        require('./locales/en_US');
    }
}
getLanguageInfo(); //引用语言包
function executeCommandLine(args) {
    var options = Parser.parseCommandLine(args);
    egret.args = options;
    var version = getPackageJsonConfig().version;
    console.log("\u60A8\u6B63\u5728\u4F7F\u7528\u767D\u9E6D\u7F16\u8BD1\u5668 " + version + " \u7248\u672C");
    var currentTarget = index_1.projectData.getCurrentTarget();
    if (egret.args.target == "none") {
        egret.args.target = currentTarget;
    }
    earlyParams.parse(options, args);
    var exitcode = entry.executeOption(options);
    if (typeof exitcode == "number") {
        entry.exit(exitcode);
    }
    else {
        exitcode.then(function (value) {
            entry.exit(value);
        }).catch(function (e) {
            if (e instanceof Error) {
                console.error(e.toString());
                entry.exit(9999);
            }
            else if (typeof e == 'string') {
                console.error(e);
                entry.exit(1);
            }
            else if (typeof e == 'number') {
                entry.exit(e);
            }
            else {
                console.error(e);
                entry.exit(9998);
            }
        });
    }
}
exports.executeCommandLine = executeCommandLine;
var Entry = /** @class */ (function () {
    function Entry() {
    }
    Entry.prototype.executeOption = function (options) {
        var self = this;
        options.command = options.command || "help";
        try {
            var CommandClass = require("./commands/" + options.command);
        }
        catch (e) {
            console.log(utils.tr(10002, options.command));
            return 10002;
        }
        var command = new CommandClass();
        var result = command.execute();
        return result;
    };
    Entry.prototype.exit = function (exitCode) {
        if (DontExitCode == exitCode)
            return;
        utils.exit(exitCode);
    };
    return Entry;
}());
var entry = new Entry();
