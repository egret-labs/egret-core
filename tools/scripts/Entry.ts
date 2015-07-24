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

require('./locales/zh_CN');
import Create = require("./commands/CreateCommand");
import PublishCommand = require("./commands/PublishCommand");
import HelpCommand = require("./commands/HelpCommand");
import InfoCommand = require("./commands/InfoCommand");
import CheckCMD = require('./commands/CheckCommand');
import BuildCommand = require('./commands/BuildCommand');
import StartServerCommand = require('./commands/StartServerCommand');
import ZipCommand = require('./commands/ZipCommand');
import ShowIPCommand = require('./commands/ShowIPCommand');
import CompileFilesCommand = require('./commands/CompileFilesCommand');
import CompressJsonCommand = require('./commands/CompressJsonCommand');

import config = require("./lib/ProjectConfig");
import parser = require("./ParamsParser");


global.egret = global.egret || {};

export var DontExitCode = -0xF000;

export function executeCommandLine():void {
    parser.init();
    var cmdName = parser.getCommandName();

    if (["build", "publish", "startserver"].indexOf(cmdName) >= 0) {
        config.init();
        //检测版本
        var exitCode = new CheckCMD().execute();
        if ((exitCode) > 0) {
            process.exit(exitCode);
            return;
        }
    }

    entry.executeOption();
}

class Entry {

    executeOption() {
        var exitCode = 0;
        var cmdName = parser.getCommandName();
        switch (cmdName) {
            case "build":
                var build = new BuildCommand();
                exitCode = build.execute();
                break;
            case "publish":
                var publish = new PublishCommand();
                exitCode = publish.execute();
                break;
            case "create":
                var create = new Create();
                exitCode = create.execute();
                break;
            case "help":
                var help = new HelpCommand();
                help.execute();
                break;
            case "startserver":
                var startserver = new StartServerCommand();
                startserver.execute();
                break;
            case "make":
                break;
            case "quit":
                break;
            case "service":
                break;
            case "autocompile":
                break;
            case "clean":
                break;
            case "zip":
                var zip = new ZipCommand();
                zip.initOptions(parser.getOptions());
                zip.execute();
                break;
            case "compile":
                var compile = new CompileFilesCommand();
                compile.initOptions(parser.getOptions());
                compile.execute();
                break;
            case "compress":
                var compress = new CompressJsonCommand();
                compress.initOptions(parser.getOptions());
                compress.execute();
                break;
            case "showip":
                var showip = new ShowIPCommand();
                showip.execute();
                break;
            case "designservice":
                break;
            case "info":
            default:
                var info = new InfoCommand();
                info.execute();
                break;
        }
        return exitCode;
    }

    exit(exitCode) {
        if (DontExitCode == exitCode)
            return;
        process.exit(exitCode);
    }
}

var entry = new Entry();
