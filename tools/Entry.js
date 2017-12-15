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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    return __awaiter(this, void 0, void 0, function () {
        var options, version, exitcode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = Parser.parseCommandLine(args);
                    egret.args = options;
                    version = getPackageJsonConfig().version;
                    console.log("\u60A8\u6B63\u5728\u4F7F\u7528\u767D\u9E6D\u7F16\u8BD1\u5668 " + version + " \u7248\u672C");
                    return [4 /*yield*/, index_1.engineData.init()];
                case 1:
                    _a.sent();
                    earlyParams.parse(options, args);
                    exitcode = entry.executeOption(options);
                    if (typeof exitcode == "number") {
                        entry.exit(exitcode);
                    }
                    else {
                        exitcode.then(function (value) {
                            entry.exit(value);
                        }).catch(function (e) { return console.log(e); });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.executeCommandLine = executeCommandLine;
var Entry = (function () {
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
