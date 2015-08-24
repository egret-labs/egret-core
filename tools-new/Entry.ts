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

require('./locales/zh_CN');
import EXML = require("./commands/EXMLCommand");
import Run = require("./commands/RunCommand");
import Make = require("./commands/MakeCommand");
import CreateResource = require("./commands/CreateResource");
import Build = require("./commands/BuildCommand");
import Clean = require("./commands/CleanCommand");
import Shutdown = require("./commands/ShutdownCommand");
import DesignService = require("./commands/DesignService");
import AutoCompile = require("./commands/AutoCompileCommand");
import Parser = require("./parser/Parser");
import Info = require("./commands/InfoCommand");
import Help = require("./commands/HelpCommand");
import Create = require("./commands/CreateCommand");
import Publish = require("./commands/PublishCommand");
import utils = require('./lib/utils');
import server = require('./server/server');
import service = require("./service/index");
import FileUtil = require('./lib/FileUtil');

import http = require('http');
import childProcess = require('child_process');

export var DontExitCode = -0xF000;


export function executeCommandLine(args: string[]): void {
    var options = Parser.parseCommandLine(args);
    egret.args = options;
    var exitcode = entry.executeOption(options);
    entry.exit(exitcode);
}

export function executeOption(options: egret.LarkToolArgs): number {
    return entry.executeOption(options);
}


class Entry {

    executeOption(options: egret.LarkToolArgs) {
        var exitCode = 0;
        switch (options.command) {
            case "publish":
                var publish = new Publish();
                exitCode = publish.execute();
                break;
            case "create":
                var create = new Create();
                exitCode = create.execute();
                break;
            case "help":
                new Help().execute();
                exitCode = DontExitCode;
                break;
            case "run":
                var run = new Run();
                run.execute();
                exitCode = DontExitCode;
                break;
            case "exml":
                var exml = new EXML();
                exitCode = exml.execute();
                break;
            case "make":
                var build = new Make();
                build.execute();
                break;
            case "quit":
                new Shutdown().execute();
                exitCode = DontExitCode;
                break;
            case "service":
                service.run();
                exitCode = DontExitCode;
                break;
            case "autocompile":
                new AutoCompile().execute();
                exitCode = DontExitCode;
                break;
            case "clean":
                new Clean().execute();
                exitCode = DontExitCode;
                break;
            case "build":
                new Build().execute();
                exitCode = DontExitCode;
                break;
            case "designservice":
                exitCode = new DesignService().execute();
                break;
            case "createresource":
                exitCode = new CreateResource().execute();
                break;
            case "info":
            default:
                exitCode = new Info().execute();
                break;
        }
        return exitCode;
    }

    exit(exitCode) {
        if(DontExitCode == exitCode)
            return;
        process.exit(exitCode);
    }
}

var entry = new Entry();


export function gotCommandResult(cmd: egret.ServiceCommandResult) {
    if (cmd.messages) {
        cmd.messages.forEach(m=> console.log(m));
    }
    process.exit(cmd.exitCode || 0);
}

