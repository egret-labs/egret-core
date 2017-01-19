var fs = require('fs')
var path = require('path')
var packageJsonConfig;
let param = require('./param')
function getPackageJsonConfig() {
    if(!packageJsonConfig) {
        var txt = fs.readFileSync(param.getEgretPath() + "/package.json","utf-8");
        packageJsonConfig = JSON.parse(txt);
    }
    return packageJsonConfig;
}

function getEgretPath() {
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


function getLanguageInfo() {
    var i18n = getPackageJsonConfig().i18n;
    if(i18n == "en") {
        i18n = "en_US";
        require('../../locales/en_US');
    }
    else {
        i18n = "zh_CN";
        require('../../locales/zh_CN');
    }
    return i18n;
}
getLanguageInfo();//引用语言包