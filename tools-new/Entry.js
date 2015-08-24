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
var EXML = require("./commands/EXMLCommand");
var Run = require("./commands/RunCommand");
var Make = require("./commands/MakeCommand");
var CreateResource = require("./commands/CreateResource");
var Build = require("./commands/BuildCommand");
var Clean = require("./commands/CleanCommand");
var Shutdown = require("./commands/ShutdownCommand");
var DesignService = require("./commands/DesignService");
var AutoCompile = require("./commands/AutoCompileCommand");
var Parser = require("./parser/Parser");
var Info = require("./commands/InfoCommand");
var Help = require("./commands/HelpCommand");
var Create = require("./commands/CreateCommand");
var Publish = require("./commands/PublishCommand");
var service = require("./service/index");
exports.DontExitCode = -0xF000;
function executeCommandLine(args) {
    var options = Parser.parseCommandLine(args);
    egret.args = options;
    var exitcode = entry.executeOption(options);
    entry.exit(exitcode);
}
exports.executeCommandLine = executeCommandLine;
function executeOption(options) {
    return entry.executeOption(options);
}
exports.executeOption = executeOption;
var Entry = (function () {
    function Entry() {
    }
    Entry.prototype.executeOption = function (options) {
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
                exitCode = exports.DontExitCode;
                break;
            case "run":
                var run = new Run();
                run.execute();
                exitCode = exports.DontExitCode;
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
                exitCode = exports.DontExitCode;
                break;
            case "service":
                service.run();
                exitCode = exports.DontExitCode;
                break;
            case "autocompile":
                new AutoCompile().execute();
                exitCode = exports.DontExitCode;
                break;
            case "clean":
                new Clean().execute();
                exitCode = exports.DontExitCode;
                break;
            case "build":
                new Build().execute();
                exitCode = exports.DontExitCode;
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
    };
    Entry.prototype.exit = function (exitCode) {
        if (exports.DontExitCode == exitCode)
            return;
        process.exit(exitCode);
    };
    return Entry;
})();
var entry = new Entry();
function gotCommandResult(cmd) {
    if (cmd.messages) {
        cmd.messages.forEach(function (m) { return console.log(m); });
    }
    process.exit(cmd.exitCode || 0);
}
exports.gotCommandResult = gotCommandResult;
