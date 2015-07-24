/**
 * Created by yjtx on 15-7-21.
 */
import globals = require("./Globals");
import file = require('./lib/FileUtil');

var multies:Array<string>;
function initOptionTypes() {
    multies = [];
    multies.push("--filelist");
}

var argv;
export function init() {
    var arr = process.argv.slice(2);

    initOptionTypes();

    var args = [];
    var i = 1, li = arr.length;
    for (; i < li; i++) {
        var itemi = arr[i];
        if (itemi.search(/-(\w*)/) == 0) break;
        args.push(itemi);
    }

    var opts = {};
    var values4Opt = [];
    var name = null;
    for (; i < li; i++) {
        var itemi = arr[i];
        if (itemi.search(/-(\w*)/) == 0) {
            if (!name) name = itemi;
            else {
                opts[name] = values4Opt;
                name = itemi;
                values4Opt = [];
            }
        } else {
            values4Opt.push(itemi);
        }
    }

    if (name) opts[name] = values4Opt;

    for (var key in opts) {
        if (multies.indexOf(name) < 0) {
            opts[key] = opts[key][0] || true;
        }
    }
    setArgv({
        name: arr[0],
        currDir: process.cwd(),
        args: args,
        opts: opts
    });
}

export function toString() {
    var s = "";
    for (var key in argv["opts"]) {
        s += key + "=" + argv["opts"][key] + "\n";
    }
    return s;
}

export function setArgv(newArgv) {
    argv = newArgv;
    setCurrDir();
}

export function getCommandName() {
    return argv["name"];
}

export function getNotNeedProjectCmds() {
    return ["create", "create_app", "zip", "compile", "compress", "help", "showip"];
}

export function getCommandArgs() {
    return argv["args"];
}

var currDir;
function setCurrDir() {
    currDir = argv["currDir"];
    var projectName = argv["args"][0];
    if (argv["name"] == "create" && projectName) {
        currDir = file.resolve(projectName);
    }

    if (getNotNeedProjectCmds().indexOf(getCommandName()) >= 0) {

    }
    else {
        var stat2 = file.exists(file.joinPath(currDir, "src"));
        var stat3 = file.exists(file.joinPath(currDir, "launcher"));
        if (!stat2 || !stat3) {//存在egret项目缺少的文件目录
            globals.exit(8002);
        }
    }

}

export function getProjectRoot() {
    return currDir;
}

/**
 * 获取到Egret的根路径
 * @returns {string}
 */
export function getEgretRoot() {
    var egretRoot = process.env.EGRET_PATH;
    if (!egretRoot) {
        var globalpath = module['paths'].concat();
        var existsFlag = false;
        for (var i = 0; i < globalpath.length; i++) {
            var prefix = globalpath[i];
            var url = file.joinPath(prefix, "../egret");
            if (file.isDirectory(url)) {
                existsFlag = true;
                break;
            }
            var url = file.joinPath(prefix, "egret");
            if (file.isDirectory(url)) {
                existsFlag = true;
                break;
            }
        }
        if (!existsFlag) {
            throw new Error("can't find Lark");
        }

        egretRoot = url;
    }
    return file.joinPath(egretRoot, '/');
}

export function getEgretVersion() {
    var txt = file.read(file.joinPath(getEgretRoot(), "package.json"));
    var packageJsonConfig = JSON.parse(txt);
    return packageJsonConfig["version"]
}

/**
 *
 * @param key
 * @param enumList
 * @returns {any}
 */
export function getOption(key, enumList?:Array<any>) {
    var options = argv["opts"];
    if (!options[key]) {
        if (enumList) {
            return enumList[0];
        }
        return null;
    }

    var value = options[key];
    if (enumList == null) {
        if (value == null) {
            globals.exit(8001, key);
        }
        return value;
    }

    if (!value || enumList.indexOf(value) == -1) {
        //globals.exit(8001, key, enumList);
    }
    return value;
}

export function getOptions() {
    return argv["opts"];
}

/**
 *
 * @param key
 * @param enumList
 * @returns {any}
 */
export function getObjectOption(options, key, enumList?:Array<any>) {
    if (!options[key]) {
        if (enumList) {
            return enumList[0];
        }
        return null;
    }

    var value = options[key];
    if (enumList == null) {
        if (value == null) {
            globals.exit(8001, key);
        }
        return value;
    }

    if (!value || enumList.indexOf(value) == -1) {
        //globals.exit(8001, key, enumList);
    }
    return value;
}

/**
 * 是否含有
 * @param key
 * @returns {boolean}
 */
export function hasOption(key) {
    var options = argv["opts"];

    return !!options[key];
}