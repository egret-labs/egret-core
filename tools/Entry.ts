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

/// <reference path="./lib/types.d.ts" />

global.DEBUG = true;
global.egret = global.egret || {};
global.registerClass = "egret";
global.DontExitCode = -0xF000;

require('./locales/zh_CN');
require('./globals');
import Parser = require("./parser/Parser");
import earlyParams = require("./parser/ParseEarlyVersionParams");
import version = require("./parser/Version");
import utils = require('./lib/utils');



export function executeCommandLine(args: string[]): void {
    var options = Parser.parseCommandLine(args);
    egret.args = options;

    var versionCheck = version.check();
    var shouldUseOtherVersion = false;
    var commandsUseCurrentVersion = {
        "upgrade": true,
        "versions": true
    };
    // 如果项手动指定了引擎版本,那么使用需要的版本执行命令
    if (versionCheck.requestOtherVersion) {
        shouldUseOtherVersion = true;
    }
    // 如果项目版本跟引擎版本不一致，那么使用需要的版本执行命令
    if (versionCheck.projectUsingOtherVersion && !(options.command in commandsUseCurrentVersion)) {
        shouldUseOtherVersion = true;
    }
    //如果用户没有安装需要的引擎，使用当前版本执行
    if (versionCheck.hasTargetEngine == false) {
        shouldUseOtherVersion = false;
    }

    if (shouldUseOtherVersion) {
        version.execute(versionCheck.targetEngineRoot);
    }
    else {
        earlyParams.parse(options, args);
        var exitcode = entry.executeOption(options);
        entry.exit(exitcode);
    }
}


class Entry {

    executeOption(options: egret.ToolArgs) {
        options.command = options.command || "info";
        try {
            var command: { new (): egret.Command } = require("./commands/" + options.command);
        }
        catch (e) {
            console.log(utils.tr(10002, options.command));
            return 10002;
        }
        var exitCode = new command().execute();
        return exitCode;
    }

    exit(exitCode) {
        if(DontExitCode == exitCode)
            return;
        utils.exit(exitCode);
        
    }
}

var entry = new Entry();

