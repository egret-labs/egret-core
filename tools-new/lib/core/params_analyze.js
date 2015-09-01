var globals = require("./globals.js");
var path = require("../core/path");
var file = require("../core/file.js")

var argv;
getArgv = function () {
    if(argv) {
        return argv;
    }
    var arr = process.argv.slice(2);

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

    argv = {
        name: arr[0],
        currDir: process.cwd(),
        args: args,
        opts: opts
    }

    return argv;
};

function _getEnv() {
    return process.env;
}

function getOption(option, key, enumList) {
    if (!option[key]) {
        return enumList[0];
    }

    var value = option[key][0]
    if (!value || enumList.indexOf(value) == -1) {
        globals.exit(8001, key, enumList);
    }
    return value;
}


exports.getEnv = _getEnv;


/**
 * 获取egret所在的位置
 * @returns {*}
 */
exports.getEgretPath = function () {
    var path = require("../core/path");
    var obj = _getEnv();
    var egret_path = _getEnv().EGRET_PATH;
    if (!egret_path) {
        var globalpath = module.paths.concat();
        var existsFlag = false;
        for (var i = 0; i < globalpath.length; i++) {
            var prefix = globalpath[i];
            var url = path.join(prefix, "../egret-core");
            if (file.exists(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "egret");
            if (file.exists(url)) {
                existsFlag = true;
                break;
            }
            var url = path.join(prefix, "../egret");
            if (file.exists(url)) {
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


exports.getArgv = getArgv;

exports.getOption = getOption;