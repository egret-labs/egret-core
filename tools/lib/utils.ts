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
import { setTimeout } from 'timers';
import { resolve } from 'url';
import * as EgretProject from '../project';
import * as project from '../project';
import { constants } from 'os';
import * as fs from 'fs';
const crypto = require('crypto');

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

export async function executeCommand(command: string, options = {}) {
    return new Promise<{ error: Error, stdout: string, stderr: string }>((resolve, reject) => {
        cp.exec(command, options, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        });
    })
}



export function endWith(text: string, match: string) {
    return text.lastIndexOf(match) == (text.length - match.length);
}


function escape(s) {
    return s.replace(/"/, '\\\"');
}

export function uglify(sourceFile: any) {
    const defines = {
        DEBUG: false,
        RELEASE: true
    }
    const result = UglifyJS.minify(sourceFile, { compress: { global_defs: defines }, fromString: true, output: { beautify: false } });
    const code = result.code;
    return code;
}

export function minify(sourceFile: string): string
export function minify(sourceFile: string, output: string): void
export function minify(sourceFile: string, output?: string) {
    const defines = {
        DEBUG: false,
        RELEASE: true
    }
    //UglifyJS参数参考这个页面：https://github.com/mishoo/UglifyJS2
    const result = UglifyJS.minify(sourceFile, { compress: { global_defs: defines }, output: { beautify: false } });
    const code = result.code;
    if (output) {
        file.save(output, code);
    }
    else {
        return code;
    }

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


export function measure(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

    const method = descriptor.value;
    descriptor.value = function (...arg) {
        const timeBuildStart = (new Date()).getTime();
        let promise = method.apply(this, arg);

        return promise.then((result) => {
            const timeBuildEnd = (new Date()).getTime();
            const timeBuildUsed = (timeBuildEnd - timeBuildStart) / 1000;
            console.log(tr(1108, timeBuildUsed));
            return result;
        })
    }
}

export function getAvailablePort(port = 0) {
    return new Promise<number>((resolve, reject) => {
        function getPort() {
            var server = net.createServer();
            server.on('listening', function () {
                port = server.address().port
                server.close()
            })
            server.on('close', function () {
                resolve(port)
            })
            server.on('error', function (err) {
                port++;
                getPort();
            })
            server.listen(port)
        }
        getPort();
    })


}

export function checkEgret() {
    var options = egret.args;
    if (file.exists(options.srcDir) == false ||
        file.exists(options.templateDir) == false) {
        exit(10015, options.projectDir);
    }
}

export function checkPlugin() {
    //check if use plugin
    const target = egret.args.target;
    var config: any = EgretProject.projectData;

    if (target == "vivogame") {//use vivo plugin
        if (!config.egretProperties.vivo) config.egretProperties.vivo = {}
        let vivo = config.egretProperties.vivo
        vivo.plugins = [];
        vivo.userLibs = [];
        vivo.userPlugs = [];
        if (vivo.usePlugin == true) {
            let userLibs = [];//用户的自定义库
            let userPlugs = [];//用户用到的插件
            const plugins = ['egret', 'game', 'eui', 'socket', 'tween', 'assetsmanager', 'dragonBones']
            let extra = egret.args.command === 'publish' ? '.min.js' : '.js'
            let modules: string[] = config.egretProperties.modules.map(item => {
                if (item.name != 'promise') {
                    if (plugins.indexOf(item.name) == -1) {
                        userLibs.push(item.name + extra)
                    } else {
                        userPlugs.push(item.name + extra)
                    }
                }
                return item.name
            })
            vivo.plugins = plugins.map(item => {
                if (modules.indexOf(item) < 0) {//用户没用到的库，也全量放进去
                    config.egretProperties.modules.push({ "name": item })
                }
                return item + extra
            })

            vivo.userLibs = userLibs;
            vivo.userPlugs = userPlugs;

            project.manager.copyToLibs();//把新的库拷贝进去
        }
    }
}
export async function pluginManifest(manifest: any, outputDir: string) {
    const target = egret.args.target;
    var { egretProperties }: any = EgretProject.projectData;
    let command = egret.args.command;//publish build
    let contents = null;
    if (target == "vivogame") {//use vivo plugin
        let vivo = egretProperties.vivo
        const jsonPath = path.join(outputDir, 'manifest.json');
        const configPath = path.join(outputDir, '../', "minigame.config.js")
        let jsonData = JSON.parse(file.readFileSync(jsonPath, 'utf-8'))
        const { plugins, userLibs, userPlugs } = vivo;
        const { game } = manifest;
        contents = `if(window.requirePlugin){\n`
        let contents2 = ""
        let configArr = [];

        plugins.map(item => {
            if (vivo.usePlugin == true) {
                configArr.push(JSON.stringify({
                    module_name: `egret-library/${item}`,
                    module_path: `egret-library/${item}`,
                    module_from: `egret-library/${item}`,
                }, null, "\t"))
            } else {
                configArr.push(JSON.stringify({
                    module_name: `./js/${item}`,
                    module_path: `./js/${item}`,
                    module_from: `engine/js/${item}`,
                }, null, "\t"))
            }
        })
        userPlugs.map(item => {
            contents += `  requirePlugin("egret-library/${item}");\n`
            contents2 += `  require("egret-library/${item}");\n`
        })
        contents = `${contents}}else{\n${contents2}}\n`
        userLibs.concat(game).map(item => {
            let basename = path.basename(item)
            contents += `require("./js/${basename}");\n`

            configArr.push(JSON.stringify({
                module_name: `./js/${basename}`,
                module_path: `./js/${basename}`,
                module_from: `engine/js/${basename}`,
            }, null, "\t"))
        })
        if (vivo.usePlugin == true) {
            jsonData.plugins = {
                "egret-library": {
                    "provider": "",
                    "version": egretProperties.engineVersion,
                    "path": "egret-library"
                }
            }
        } else {
            contents = null;
            delete jsonData.plugins
        }
        file.writeFileAsync(jsonPath, JSON.stringify(jsonData, null, "\t"), 'utf-8')
        if (vivo.usePlugin == true && file.existsSync(configPath)) {
            let configContent = fs.readFileSync(configPath, { encoding: "utf8" });
            const reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
            const replaceConfigStr = '\/\/----auto option start----\n\t\t' + configArr.toString() + '\n\t\t\/\/----auto option end----';
            configContent = configContent.replace(reg, replaceConfigStr);
            await file.writeFileAsync(configPath, configContent, 'utf-8')

            let extra = egret.args.command === 'publish' ? '.min.js' : '.js'
            file.createDirectory(path.join(outputDir, "../egret-library"))
            await file.writeJSONAsync(path.join(outputDir, "../egret-library", "plugin.json"), { 'main': "egret" + extra })
        }
    } else if (target == "ttgame") {//use ttgame plugin
        let ttgame = EgretProject.projectData.getMiniGame('ttgame')
        let gameJsonContent = await file.readJSONAsync(path.join(outputDir, 'game.json'))
        
        if (ttgame && ttgame.usePlugin && command === "publish") {//console.log('使用tt插件')
            gameJsonContent.plugins = {}
            const provider = ttgame.provider
            let ttPluginPath = path.join(outputDir, "egret-library")
            file.createDirectory(ttPluginPath)
            await file.writeFileAsync(path.join(ttPluginPath, "index.js"), `console.log("egret-plugin")`, 'utf-8')
            await file.writeJSONAsync(path.join(ttPluginPath, "plugin.json"), { 'main': "index.js" })
            await file.writeJSONAsync(path.join(ttPluginPath, "signature.json"), {
                "provider": provider,
                "signature": ttgame.signature
            })
            gameJsonContent.plugins["egret-library"] = {
                "provider": provider,
                "version": egretProperties.engineVersion,
                "path": "egret-library"
            }
        }else{
            delete gameJsonContent.plugins
        }
        await file.writeJSONAsync(path.join(outputDir, 'game.json'), gameJsonContent)
    }
    return contents;
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

export function sleep(milesecond: number) {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve();
        }, milesecond);

    });
}

export function shell2(command: string, args: string[]) {
    const cmd = command + " " + args.join(" ");
    return new Promise((resolve, reject) => {
        var shell = cp.exec(cmd, (error, stdout, stderr) => {
            if (!error) {
                resolve();
            }
            else {
                console.log(stderr);
                reject();
            }
        });
    })

}

export function shell(path: string, args: string[], opt?: cp.ExecOptions, verbase?: boolean) {
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

    type Result = { code: number, stdout: string, stderr: string, path: string, args: any[] };

    return new Promise<Result>((resolve, reject) => {
        // path = "\"" + path + "\"";
        // var shell = cp.spawn(path + " " + args.join(" "));
        var shell = cp.spawn(path, args);
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
                reject({ code, stdout, stderr, path, args });
            }
            else {
                resolve({ code, stdout, stderr, path, args });
            }
        });
    });
};



export class CliException extends Error {

    public message;

    constructor(public errorId, param?: string) {
        super();
        // var message: string = errorcode[this.errorId];
        // if (message) {
        //     message = message.replace('{0}', param);
        // }
        // else {
        //     message = `unkown error : ${errorId}`;
        //     console.error(message);
        // }
        this.message = errorId;
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

export function createHash(data: string) {
    var hash = crypto.createHash("md5");
    hash.update(data);
    return hash.digest("hex");
}
