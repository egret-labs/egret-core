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
        let replace = (egret.args && egret.args.ide) ? "" : replacements[raw];
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
    for (var i = 0; i < length || i < 5; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "ig"), args[i] || "");
    }

    text = formatStdoutString(text);

    return text;
}

export function ti(code: number, injector?: any): string {
    var text = $locale_strings[code];
    if (!text) {
        return "{" + code + "}";
    }
    text = inject.call(this, text, injector);
    return text;
}

export function inject(text: string, injector?: any): string {
    if (injector) {
        for (var p in injector) {
            text = text.replace(new RegExp("\\{" + p + "\\}", "ig"), injector[p]);
        }
    }
    return text;
}

export function exit(code: number, ...args) {
    if (code) {
        var text: string = $locale_strings[code];
        if (text && text.indexOf("{0}") < 0 || args && args.length > 0) {
            var message = tr.apply(this, [code].concat(args));
            console.error(message);
        }
    }
    process.exit(code);
}

function _getEnv() {
    return process.env;
}


export function getEgretRoot() {
    var path = require("path");
    var obj = _getEnv();
    var egretRoot: string;
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


export function open(target, appName?) {
    var command;

    switch (process.platform) {
        case 'darwin':
            if (appName) {
                command = 'open -a "' + escape(appName) + '"';
            } else {
                command = 'open';
            }
            break;
        case 'win32':
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                command = 'start "" "' + escape(appName) + '"';
            } else {
                command = 'start ""';
            }
            break;
        default:
            if (appName) {
                command = escape(appName);
            } else {
                // use Portlands xdg-open everywhere else
                command = path.join(__dirname, '../vendor/xdg-open');
            }
            break;
    }
    executeCommand(command + ' "' + escape(target) + '"')
}

export async function executeCommand(command: string) {
    return new Promise<{ error: Error, stdout: string, stderr: string }>((reslove, reject) => {
        cp.exec(command, {}, (error, stdout, stderr) => {
            reslove({ error, stdout, stderr })
        });
    })
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

export function clean(path: string, excludes?: string[]) {
    var fileList = file.getDirectoryListing(path);
    var length = fileList.length;
    for (var i = 0; i < length; i++) {
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

export function getAvailablePort(callback: (port: number) => void, port = 0) {

    function getPort() {
        var server = net.createServer();
        server.on('listening', function () {
            port = server.address().port
            server.close()
        })
        server.on('close', function () {
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

export function checkEgret() {
    var options = egret.args;
    if (file.exists(options.srcDir) == false ||
        file.exists(options.templateDir) == false) {
        exit(10015, options.projectDir);
    }
}

export function isFormatString(text: string): boolean {
    if (text) {
        if (text.indexOf("\n") != -1) {
            return true;
        }
    }
    return false;
}

export function addIndents(times: number, text: string) {
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

interface MapLike<T> {
    [index: string]: T;
}

export interface Map<T> extends MapLike<T> {
    __mapBrand: any;
}

export function createMap<T>(template?: MapLike<T>): Map<T> {
    const map: Map<T> = Object.create(null); // tslint:disable-line:no-null-keyword

    // Using 'delete' on an object causes V8 to put the object in dictionary mode.
    // This disables creation of hidden classes, which are expensive when an object is
    // constantly changing shape.
    map["__"] = undefined;
    delete map["__"];

    // Copies keys/values from template. Note that for..in will not throw if
    // template is undefined, and instead will just exit the loop.
    for (const key in template) if (Object.prototype.hasOwnProperty.call(template, key)) {
        map[key] = template[key];
    }

    return map;
}

export function shell(path: string, args: string[], opt?: cp.SpawnOptions, verbase?: boolean): Promise<number> {
    let stdout = "";
    let stderr = "";
    var cmd = `${path} ${args.join(" ")}`;
    if (verbase) {
        console.log(cmd);
    }
    let printStdoutBufferMessage = (message) => {
        var str = message.toString();
        stdout += str;
        if (verbase) {
            console.log(str);
        }
    };
    let printStderrBufferMessage = (message) => {
        var str = message.toString();
        stderr += str;
        if (verbase) {
            console.log(str);
        }
    };
    let callback = (reslove, reject) => {
        var shell = cp.spawn(path, args, opt);
        shell.on("error", (message) => { console.log(message); });
        shell.stderr.on("data", printStderrBufferMessage);
        shell.stderr.on("error", printStderrBufferMessage);
        shell.stdout.on("data", printStdoutBufferMessage);
        shell.stdout.on("error", printStdoutBufferMessage);
        shell.on('exit', function (code) {
            if (code != 0) {
                if (verbase) {
                    console.log('Failed: ' + code);
                }
                reject({ code, stdout, stderr });
            }
            else {
                reslove({ code, stdout, stderr });
            }
        });
    };
    return new Promise(callback);
};

let error_code_filename = path.join(__dirname, "../error_code.json");
let errorcode = file.readJSONSync(error_code_filename, { "encoding": "utf-8" });
export class CliException extends Error {

    public message;

    constructor(public errorId, param?: string) {
        super();
        var message: string = errorcode[this.errorId];
        if (message) {
            message = message.replace('{0}', param);
        }
        else {
            message = `unkown error : ${errorId}`;
            console.error(message);
        }
        this.message = message;
    }
}

export function findValidatePathSync(pathStr: string): string {
    if (!pathStr) {
        pathStr = process.cwd();
    } else {
        if (!file.existsSync(pathStr)) {
            pathStr = path.join(process.cwd(), pathStr);
        }
    }
    return pathStr;
}


export const cache: MethodDecorator = (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value;
    let cacheValue = null;
    descriptor.value = function (...arg) {
        if (!cacheValue) {
            cacheValue = method.apply(this, arg);
        }
        return cacheValue;
    }
}
