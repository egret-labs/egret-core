/// <reference path="lib/node.d.ts" />

/*

此文件需要放在引擎安装目录
    例如 C:\Program Files\Egret\EgretEngine\win\selector.js
    或   /Applications/EgretEngine.app/Contents/Resources/mac/selector.js

根据命令行参数
    --ev 2.4.3
或项目中 egretProperties.json 中指定的引擎版本来执行对应的引擎。

引擎选择优先级为
    --ev
    egretProperties.json
    默认引擎


历史版本的引擎位置为：
    Mac: /Users/${user}/Library/Application Support/Egret/engine/${version}/
    Windows: %AppData%/Egret/engine/${version}/
其中根目录下有 config.json（可选，默认没有） 记录默认引擎和自定义引擎目录
    {
	    "egret":{
		    "2.0.5":{
			    "root":"D:\\Work\\egret-core\\" //自定义目录
		    },
		    "defaultEngine":"2.4.3"
	    }
    }


默认版本查找顺序
    config.json defaultEngine 指定的版本号
    config.json 中指定的自定义路径
    引擎安装目录/egret
    历史版本根目录/${version}
EGRET_PATH环境变量仅仅作为兼容以前版本使用



egret versions 命令输出可用的引擎版本
    Egret Engine 2.4.3  D:/Program Files/Egret/EgretEngine/win/egret/
    Egret Engine 2.0.5  D:/Work/egret-core/


*/


import FS = require("fs");
import Path = require("path");

var DEFAULT_ENGINE = "defaultEngine"
var args: Args;
var configData: ConfigData;
var language: string;
var engines: EnginesMap;

var localsMessages = {
    en: {
        1: "Can not find Egret Engine {0}, please install it with Egret Launcher.",
        2: "Can not find Egret Engine, please open Egret Launcher and press the \"Reset\" button.",
        3: "Egret Engine default version: {0}\nEgret Engine current version: {1}\nYou can upgrade your project via egret upgrade",
        4: "Egret Engine current version: {0}"
    },
    zh: {
        1: "找不到 Egret Engine {0} 请打开引擎面板并添加对应版本的引擎",
        2: "找不到默认引擎，请尝试打开引擎面板并点击“重置引擎”按钮",
        3: "您的默认引擎版本为 {0}\n当前项目使用版本为 {1}\n您可以执行 egret upgrade 命令升级项目",
        4: "您正在使用的引擎版本为 {0}"
    }
}



var commandsToSkip = {
    "upgrade": true
};



function entry() {
    readConfig();
    getLanguage();
    args = parseArgs();
    var requestVersion:any = args.egretversion || args.ev;
    if (requestVersion === true)
        requestVersion = undefined;
    var handled = false;

    if (args.command == "versions") {
        return printVersions();
    }

    var projectVersion = getProjectVersion();
    var defaultVersion = getDefaultEngineInfo();

    if (requestVersion || (projectVersion && !(args.command in commandsToSkip))) {
        requestVersion = requestVersion || projectVersion;

        var isUsingDefault = requestVersion == defaultVersion.version;
        var messageCode = isUsingDefault ? 4 : 3;
        console.log(tr(messageCode, defaultVersion.version, requestVersion));

        if (!engines[requestVersion]) {
            console.log(tr(1, requestVersion));
            process.exit(1);
            return;
        }
        executeVersion(requestVersion);
        return;
    }

    if (!defaultVersion) {
        console.log(tr(2, defaultVersion.version));
        process.exit(2);
        return;
    }


    if (!handled) {
        console.log(tr(4, defaultVersion.version, requestVersion));
        executeVersion(defaultVersion.version, defaultVersion.root);
    }
}




function printVersions() {
    if (!engines) {
        getAllEngineVersions();
    }
    Object.keys(engines).sort(compareVersion).reverse().forEach(v=> {
        console.log(`Egret Engine ${engines[v].version}  ` + engines[v].root);
    });
}


function executeVersion(version: string, root?: string): boolean {
    if (!engines) {
        getAllEngineVersions();
    }
    root = root || engines[version].root;
    

    var bin = getBin(root);
    process.env["EGRET_PATH"] = root;
    //Fix 1.5 can not find typescript lib
    if (process['mainModule']) {
        process['mainModule'].filename = bin;
    }

    require(bin);
    return true;
}




function getDefaultEngineInfo(): EngineVersion {
    var defaultRoot: string = null;
    var version: string = null;

    if (!engines) {
        getAllEngineVersions();
    }

    if (configData && configData.egret) {
        var defaultVersion: string = <any>configData.egret[DEFAULT_ENGINE]
        if (defaultVersion && engines[defaultVersion]) {
            version = defaultVersion;
        }
    }
    if (!version) {
        var info = getEngineInfoInInstaller();
        if (info && info.root) {
            version = info.version;
        }
    }

    if (!version || !engines[version]) {
        console.log(tr(2, version));
        process.exit(2);
    }
    return engines[version];
}

function getBin(versionRoot: string) {
    return file.joinPath(versionRoot, "tools/bin/egret");
}

function getEngineVersion(root: string): EngineVersion {
    var packagePath = file.joinPath(root||"", "package.json");
    if (!file.exists(packagePath)) {
        return null;
    }
    var packageText = file.read(packagePath);
    try {
        var packageData = JSON.parse(packageText);
    }
    catch (e) {
        console.log(packagePath, "is not a egret package file");
        return null;
    }
    var engineInfo = {
        version: <string>packageData['version'],
        root: <string>root
    }

    return engineInfo;
}


function getProjectVersion(): string {
    var propsPath = file.joinPath(args.projectDir, "egretProperties.json");
    if (file.exists(propsPath)) {
        var jsonText = file.read(propsPath);
        var props = JSON.parse(jsonText);
        return props["egret_version"];
    }
    return null;
}

function readConfig() {

    var configPath = getAppDataEnginesRootPath() + "config.json";
    if (file.exists(configPath)) {
        var jsonText = file.read(configPath);
        try {
            configData = JSON.parse(jsonText);
        }
        catch (e) {
            configData = null;
        }
    }
}

function getEngineInfoInInstaller(): EngineVersion {
    var selector: string = process['mainModule'].filename;
    var root = file.escapePath(file.joinPath(Path.dirname(selector), './egret/'));
    return getEngineVersion(root);
}

function getAppDataEnginesRootPath(): string {
    var path: string;

    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            path = `${home}/Library/Application Support/Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || `${process.env.USERPROFILE}/AppData/Roaming/`;
            path = file.escapePath(`${appdata}/Egret/engine/`);
            break;
        default:
            ;
    }
    if (file.exists(path))
        return path;
    return null;
}

export interface EngineVersion {
    version: string;
    root: string;
}

export interface EnginesMap {
    [name: string]: EngineVersion
}

function getAllEngineVersions() {
    var root = getAppDataEnginesRootPath();
    var egret = getEngineInfoInInstaller();
    engines = {};

    if (!root) {
        engines[egret.version] = egret;
        return;
    }

    var versionRoots = file.getDirectoryListing(root);
    versionRoots && versionRoots.forEach(versionRoot=> {
        versionRoot = file.escapePath(versionRoot);
        var bin = getBin(versionRoot);
        var exist = file.exists(bin);

        if (exist) {
            var info = getEngineVersion(versionRoot);
            if (!info) {
                return;
            }
            engines[info.version] = info;
        }
    });


    // AppData 中的引擎不能覆盖默认安装，确保用户能够用新安装覆盖原来有问题的引擎
    engines[egret.version] = egret;
    
    if (configData) {
        for (var v in configData.egret) {
            if (!configData.egret[v].root) {
                continue;
            }
            var rootInConfig = file.escapePath(configData.egret[v].root);
            var bin = getBin(rootInConfig);
            var exist = file.exists(bin);

            if (exist) {
                var info = getEngineVersion(rootInConfig);
                if (!info) {
                    continue;
                }
                engines[info.version] = info;
            }
        }
    }
}



function tr(code, ...args: any[]) {
    var messages = localsMessages[language];
    var message = messages[code];
    message = format(message, args);
    return message;
}

function format(text: string, args: any[]): string {
    var length = args.length;
    for (var i = 0; i < length; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "ig"), args[i]);
    }
    return text;
}

interface ConfigData {
    egret: {
        [version: string]: {
            root: string
        };
    };
}
interface Args {
    command?: string;
    projectDir?: string;
    egretversion?: string;
    ev?: string;
}

function parseArgs(): Args {
    var i = 0;
    var commands: string[] = [];
    var options: Args = {}
    var args: string[] = process.argv.concat();
    args.splice(0, 2);
    while (i < args.length) {
        var s = args[i++];
        if (s.charAt(0) === '-') {
            s = s.slice(s.charAt(1) === '-' ? 2 : 1).toLowerCase();

            if (!args[i] || args[i].charAt(0) == '-') {
                options[s] = true;
            }
            else {
                options[s] = args[i++] || "";
            }
                
        }
        else {
            commands.push(s);
        }
    }

    if (commands.length > 0) {
        options.command = commands[0];
        if (commands.length >1 && file.isDirectory(commands[1]) ) {
            options.projectDir = commands[1];
        }
    }
    if (options.projectDir == null) {
        options.projectDir = process.cwd()
    }
    else {
        var absPath = file.joinPath(process.cwd(), options.projectDir);
        if (file.isDirectory(absPath)) {
            options.projectDir = absPath;
        }
    }
    options.projectDir = file.joinPath(options.projectDir, "/");
    return options;
}

function compareVersion(v1: string, v2: string) {
    return versionToNumber(v1) - versionToNumber(v2);
    function versionToNumber(v: string): number {
        var numbers = v.split(".").map(n=> {
            try {
                return parseInt(n) || 0;
            }
            catch (e) {
                return 0;
            }
        });
        var total = 0;
        numbers.forEach((n, i) => {
            total += n * Math.pow(0.01, i);
        });
        return total;
    }   
}


module file {
    var charset = "utf-8";
    /**
     * 指定路径的文件或文件夹是否存在
     */
    export function exists(path: string): boolean {
        path = escapePath(path);
        return FS.existsSync(path);
    }

    /**
     * 转换本机路径为Unix风格路径。
     */
    export function escapePath(path: string): string {
        if (!path)
            return "";
        return path.split("\\").join("/");
    }

    /**
     * 读取文本文件,返回打开文本的字符串内容，若失败，返回"".
     * @param path 要打开的文件路径
     */
    export function read(path: string, ignoreCache = false): string {
        path = escapePath(path);

        try {
            var text = FS.readFileSync(path, charset);
            text = text.replace(/^\uFEFF/, '');
        }
        catch (err0) {
            return "";
        }
        return text;
    }
    /**
     * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
     */
    export function joinPath(dir: string, ...filename: string[]): string {
        var path = Path.join.apply(null, arguments);
        path = escapePath(path);
        return path;
    }
    export function isDirectory(path: string): boolean {
        path = escapePath(path);
        try {
            var stat = FS.statSync(path);
        }
        catch (e) {
            return false;
        }
        return stat.isDirectory();
    }
    /**
     * 获取指定文件夹下的文件或文件夹列表，不包含子文件夹内的文件。
     * @param path 要搜索的文件夹
     * @param relative 是否返回相对路径，若不传入或传入false，都返回绝对路径。
     */
    export function getDirectoryListing(path: string, relative: boolean = false): string[] {
        path = escapePath(path);
        try {
            var list = FS.readdirSync(path);
        }
        catch (e) {
            return [];
        }
        var length = list.length;
        if (!relative) {
            for (var i = length - 1; i >= 0; i--) {
                if (list[i].charAt(0) == ".") {
                    list.splice(i, 1);
                }
                else {
                    list[i] = joinPath(path, list[i]);
                }
            }
        }
        else {
            for (i = length - 1; i >= 0; i--) {
                if (list[i].charAt(0) == ".") {
                    list.splice(i, 1);
                }
            }
        }
        return list;
    }
    /**
     * 获取路径的文件名(不含扩展名)或文件夹名
     */
    export function getFileName(path: string): string {
        if (!path)
            return "";
        path = escapePath(path);
        var startIndex = path.lastIndexOf("/");
        var endIndex;
        if (startIndex > 0 && startIndex == path.length - 1) {
            path = path.substring(0, path.length - 1);
            startIndex = path.lastIndexOf("/");
            endIndex = path.length;
            return path.substring(startIndex + 1, endIndex);
        }
        endIndex = path.lastIndexOf(".");
        if (endIndex == -1 || isDirectory(path))
            endIndex = path.length;
        return path.substring(startIndex + 1, endIndex);
    }
}

function getLanguage() {
    var selector: string = process['mainModule'].filename;
    var languageXML = file.escapePath(file.joinPath(Path.dirname(selector), '../locales/language.xml'));
    if (file.exists(languageXML)) {
        var xml = file.read(languageXML);
        var lang = /\<language\>([\w_]*)\<\/language>/.exec(xml);
        if (lang) {
            var localParts = lang[1].split('_');
            if (localParts.length >= 1) {
                language = localParts[0];
            }
        }
    }

    if (!language || language != "zh") {
        language = "en";
    }
}

entry();
