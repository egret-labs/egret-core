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
        历史版本根目录/${version}
    引擎安装目录/egret
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


var commandsToSkip = {
    "upgrade": true,
    "help": true
};



function entry() {
    readConfig();
    args = parseArgs();
    var requestVersion:any = args.egretversion || args.ev;
    if (requestVersion === true)
        requestVersion = undefined;
    var handled = false;

    if (args.command == "versions") {
        return printVersions();
    }

    if (requestVersion) {
        handled = executeVersion(requestVersion);
        if (!handled) {
            console.error("Can not find Egret Engine " + requestVersion);
        }
        return;
    }

    var defaultVersion = getDefaultEngineInfo();
    if (!defaultVersion.root) {
        console.error("Can not find default Egret Engine");
    }

    var projectVersion = getProjectVersion();

    if (projectVersion && !(args.command in commandsToSkip)) {
        handled = executeVersion(projectVersion);
    }

    if (!handled) {
        executeVersion(defaultVersion.version, defaultVersion.root);
    }
}

function printVersions() {
    var versions = getEngineVersions();

    versions.forEach(engine=> {
        console.log(`Egret Engine ${engine.version}  ` + engine.root);
    });
}


function executeVersion(version: string, root?: string): boolean {
    if (!root) {
        var targetEngine = getEngineInfo(version);
        if (!targetEngine.root) {
            return false;
        }
        root = targetEngine.root;
    }
    process.env["EGRET_PATH"] = root;

    var bin = getBin(root);
    require(bin);
    return true;
}

function getProjectVersion(): string {
    var propsPath = file.joinPath(args.projectDir, "egretProperties.json");
    if (file.exists(propsPath)) {
        var jsonText = file.read(propsPath);
        var props = JSON.parse(jsonText);
        return props["version"];
    }
    return null;
}

function getEngineInfo(version: string): EngineVersion {
    version = version || DEFAULT_ENGINE;
    var defaultRoot: string = null;
    if (configData && configData.egret&& configData.egret[version]) {
        return {
            version: version,
            root: configData.egret[version].root
        }
    }
    if (!defaultRoot) {
        var versionPath = getEnginesRootPath() + version;
        if (file.exists(versionPath)) {
            defaultRoot = versionPath
        }
        
    }

    if (!defaultRoot && version != DEFAULT_ENGINE) {
        var info = getLastEgretEngine();
        if (info && info.version == version)
            return info;
    }
    

    var versionInfo = getEngineVersion(defaultRoot);
    return versionInfo || <any>{};
    
}

function getDefaultEngineInfo(): EngineVersion {
    var defaultRoot: string = null;
    var version: string = null;
    if (configData) {
        var defaultVersion: string = <any>configData.egret[DEFAULT_ENGINE]
        if (defaultVersion) {
            var engineInfo = configData.egret[defaultVersion];
            if (engineInfo) {
                defaultRoot = engineInfo.root;
            }
            else {
                var versionPath = getEnginesRootPath() + defaultVersion;
                if (file.exists(versionPath)) {
                    defaultRoot = versionPath;
                }
            }
        }
    }
    if (!defaultRoot) {
        var info = getLastEgretEngine();
        if (info && info.root) {
            defaultRoot = info.root;
        }
    }

    if (!defaultRoot) {
        console.log("Can not find Egret Engine");
        process.exit(1);
    }
    return {
        version: version,
        root: defaultRoot
    };
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
    var packageData = JSON.parse(packageText);
    var engineInfo = {
        version: <string>packageData['version'],
        root: <string>root
    }

    return engineInfo;
}

function readConfig() {

    var configPath = getEnginesRootPath() + "config.json";
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

function getLastEgretEngine(): EngineVersion {
    var root;
    var globalpath = module['paths'].concat();
    var existsFlag = false;
    for (var i = 0; i < globalpath.length; i++) {
        var prefix = globalpath[i];
        var url = file.joinPath(prefix, '../');
        if (file.exists(file.joinPath(url, 'egret/tools/bin/egret'))) {
            existsFlag = true;
            break;
        }
        url = prefix;
        if (file.exists(file.joinPath(url, 'egret/tools/bin/egret'))) {
            existsFlag = true;
            break;
        }
    }
    if (!existsFlag) {
        return null;
    }
    root = file.escapePath(file.joinPath(url, '/egret/'));

    return getEngineVersion(root);

}

function getEnginesRootPath(): string {
    var path: string;

    switch (process.platform) {
        case 'darwin':
            var user = process.env.NAME || process.env.LOGNAME;
            if (!user)
                return null;
            path = `/Users/${user}/Library/Application Support/Egret/engine/`;
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

function getEngineVersions(): EngineVersion[] {
    var root = getEnginesRootPath();
    var versions: EngineVersion[] = []
    var egret = getLastEgretEngine();
    versions.push(egret);
    versions[egret.version] = egret;

    if (!root)
        return versions;

    var versionRoots = file.getDirectoryListing(root);
    versionRoots && versionRoots.forEach(versionRoot=> {
        versionRoot = file.escapePath(versionRoot);
        var bin = getBin(versionRoot);
        var exist = file.exists(bin);

        if (exist) {
            var version = file.getFileName(versionRoot);
            var info = {
                root: versionRoot,
                version: version
            };
            versions.push(info);
            versions[info.version] = info;
        }
    });

    
    if (configData) {
        for (var v in configData.egret) {
            if (versions[v]) {
                versions[v].root = file.escapePath(configData.egret[v].root);
            }
            else {
                var info = {
                    root: configData.egret[v].root,
                    version: v
                };
                if (info.root) {
                    info.root = file.escapePath(info.root);
                    versions.push(info);
                    versions[info.version] = info;
                }
            }
        }
    }
    return versions;
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


entry();
