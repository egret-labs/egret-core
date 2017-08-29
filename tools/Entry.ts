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

/// <reference path="./lib/types.d.ts" />

declare var global: any;

global.DEBUG = true;
global.egret = global.egret || {};
global.registerClass = "egret";
global.DontExitCode = -0xF000;

require('./globals');
import Parser = require("./parser/Parser");
import earlyParams = require("./parser/ParseEarlyVersionParams");
import utils = require('./lib/utils');


var fs = require('fs')
var path = require('path')
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
    let osLocal = require("./lib/os-local.js");
    let i18n:string = osLocal();
    i18n = i18n.toLowerCase();
    if (i18n == "zh_cn" || i18n == "zh_tw" || i18n == "zh_hk") {
        require('./locales/zh_CN');
    }
    else {
        require('./locales/en_US');
    }
}
getLanguageInfo();//引用语言包


export function executeCommandLine(args: string[]): void {
    var options = Parser.parseCommandLine(args);
    egret.args = options;

    earlyParams.parse(options, args);
    var exitcode = entry.executeOption(options);
    if (typeof exitcode == "number") {
        entry.exit(exitcode);
    }
    else {
        exitcode.then(value => entry.exit(value)).catch(e => console.log(e))
    }
}
class Entry {

    executeOption(options: egret.ToolArgs) {
        var self = this;
        options.command = options.command || "help";
        try {
            var CommandClass: { new (): egret.Command } = require("./commands/" + options.command);
        }
        catch (e) {
            console.log(utils.tr(10002, options.command));
            return 10002;
        }
        var command = new CommandClass();
        return command.execute();
    }

    exit(exitCode) {
        if (DontExitCode == exitCode)
            return;
        utils.exit(exitCode);

    }
}

var entry = new Entry();
