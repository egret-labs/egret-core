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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var cp = require("child_process");
var path = require("path");
var file = require("./FileUtil");
var UglifyJS = require("./uglify-js/uglifyjs");
var net = require("net");
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
        var replace = (egret.args && egret.args.ide) ? "" : replacements[raw];
        message = message.split(raw).join(replace);
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
function tr(code) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var text = $locale_strings[code];
    if (!text) {
        return "{" + code + "}";
    }
    text = format.apply(this, [text].concat(args));
    return text;
}
exports.tr = tr;
function format(text) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var length = args.length;
    for (var i = 0; i < length || i < 5; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "ig"), args[i] || "");
    }
    text = formatStdoutString(text);
    return text;
}
exports.format = format;
function ti(code, injector) {
    var text = $locale_strings[code];
    if (!text) {
        return "{" + code + "}";
    }
    text = inject.call(this, text, injector);
    return text;
}
exports.ti = ti;
function inject(text, injector) {
    if (injector) {
        for (var p in injector) {
            text = text.replace(new RegExp("\\{" + p + "\\}", "ig"), injector[p]);
        }
    }
    return text;
}
exports.inject = inject;
function exit(code) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (code) {
        var text = $locale_strings[code];
        if (text && text.indexOf("{0}") < 0 || args && args.length > 0) {
            var message = tr.apply(this, [code].concat(args));
            console.error(message);
        }
    }
    process.exit(code);
}
exports.exit = exit;
function _getEnv() {
    return process.env;
}
function getEgretRoot() {
    var path = require("path");
    var obj = _getEnv();
    var egretRoot;
    var globalpath = module['paths'].concat();
    var existsFlag = false;
    for (var i = 0; i < globalpath.length; i++) {
        var prefix = globalpath[i];
        var url = file.joinPath(prefix, '../');
        if (file.exists(file.joinPath(url, 'tools/bin/egret'))) {
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
    egretRoot = url;
    return file.escapePath(file.joinPath(egretRoot, '/'));
}
exports.getEgretRoot = getEgretRoot;
function open(target, appName) {
    var command;
    switch (process.platform) {
        case 'darwin':
            if (appName) {
                command = 'open -a "' + escape(appName) + '"';
            }
            else {
                command = 'open';
            }
            break;
        case 'win32':
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                command = 'start "" "' + escape(appName) + '"';
            }
            else {
                command = 'start ""';
            }
            break;
        default:
            if (appName) {
                command = escape(appName);
            }
            else {
                // use Portlands xdg-open everywhere else
                command = path.join(__dirname, '../vendor/xdg-open');
            }
            break;
    }
    executeCommand(command + ' "' + escape(target) + '"');
}
exports.open = open;
function executeCommand(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (reslove, reject) {
                    cp.exec(command, {}, function (error, stdout, stderr) {
                        reslove({ error: error, stdout: stdout, stderr: stderr });
                    });
                })];
        });
    });
}
exports.executeCommand = executeCommand;
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
function clean(path, excludes) {
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
function getNetworkAddress() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = [];
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
exports.getNetworkAddress = getNetworkAddress;
function getAvailablePort(callback, port) {
    if (port === void 0) { port = 0; }
    function getPort() {
        var server = net.createServer();
        server.on('listening', function () {
            port = server.address().port;
            server.close();
        });
        server.on('close', function () {
            callback(port);
        });
        server.on('error', function (err) {
            port++;
            getPort();
        });
        server.listen(port, '0.0.0.0');
    }
    getPort();
}
exports.getAvailablePort = getAvailablePort;
function checkEgret() {
    var options = egret.args;
    if (file.exists(options.srcDir) == false ||
        file.exists(options.templateDir) == false) {
        exit(10015, options.projectDir);
    }
}
exports.checkEgret = checkEgret;
function isFormatString(text) {
    if (text) {
        if (text.indexOf("\n") != -1) {
            return true;
        }
    }
    return false;
}
exports.isFormatString = isFormatString;
function addIndents(times, text) {
    if (times == 0)
        return text;
    var added = '\t';
    for (var i = 0; i < times - 1; i++) {
        added += added;
    }
    //开头
    if (text != null) {
        text = added + text;
    }
    //替换\n
    return text.replace(new RegExp("\\n", "ig"), '\n' + added);
}
exports.addIndents = addIndents;
function createMap(template) {
    var map = Object.create(null); // tslint:disable-line:no-null-keyword
    // Using 'delete' on an object causes V8 to put the object in dictionary mode.
    // This disables creation of hidden classes, which are expensive when an object is
    // constantly changing shape.
    map["__"] = undefined;
    delete map["__"];
    // Copies keys/values from template. Note that for..in will not throw if
    // template is undefined, and instead will just exit the loop.
    for (var key in template)
        if (Object.prototype.hasOwnProperty.call(template, key)) {
            map[key] = template[key];
        }
    return map;
}
exports.createMap = createMap;
function shell(path, args, opt, verbase) {
    var stdout = "";
    var stderr = "";
    var cmd = path + " " + args.join(" ");
    if (verbase) {
        console.log(cmd);
    }
    var printStdoutBufferMessage = function (message) {
        var str = message.toString();
        stdout += str;
        if (verbase) {
            console.log(str);
        }
    };
    var printStderrBufferMessage = function (message) {
        var str = message.toString();
        stderr += str;
        if (verbase) {
            console.log(str);
        }
    };
    var callback = function (reslove, reject) {
        var shell = cp.spawn(path, args, opt);
        shell.on("error", function (message) { console.log(message); });
        shell.stderr.on("data", printStderrBufferMessage);
        shell.stderr.on("error", printStderrBufferMessage);
        shell.stdout.on("data", printStdoutBufferMessage);
        shell.stdout.on("error", printStdoutBufferMessage);
        shell.on('exit', function (code) {
            if (code != 0) {
                if (verbase) {
                    console.log('Failed: ' + code);
                }
                reject({ code: code, stdout: stdout, stderr: stderr });
            }
            else {
                reslove({ code: code, stdout: stdout, stderr: stderr });
            }
        });
    };
    return new Promise(callback);
}
exports.shell = shell;
;
var error_code_filename = path.join(__dirname, "../error_code.json");
var errorcode = file.readJSONSync(error_code_filename, { "encoding": "utf-8" });
var CliException = (function (_super) {
    __extends(CliException, _super);
    function CliException(errorId, param) {
        var _this = _super.call(this) || this;
        _this.errorId = errorId;
        var message = errorcode[_this.errorId];
        if (message) {
            message = message.replace('{0}', param);
        }
        else {
            message = "unkown error : " + errorId;
            console.error(message);
        }
        _this.message = message;
        return _this;
    }
    return CliException;
}(Error));
exports.CliException = CliException;
function findValidatePathSync(pathStr) {
    if (!pathStr) {
        pathStr = process.cwd();
    }
    else {
        if (!file.existsSync(pathStr)) {
            pathStr = path.join(process.cwd(), pathStr);
        }
    }
    return pathStr;
}
exports.findValidatePathSync = findValidatePathSync;
exports.cache = function (target, propertyKey, descriptor) {
    var method = descriptor.value;
    var cacheValue = null;
    descriptor.value = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (!cacheValue) {
            cacheValue = method.apply(this, arg);
        }
        return cacheValue;
    };
};
