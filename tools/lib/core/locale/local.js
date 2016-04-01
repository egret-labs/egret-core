var file = require("../file");
var path = require("../../core/path");
var getEgretPath = function () {
    var egret_path = process.env.EGRET_PATH;
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
};
var txt = file.read(getEgretPath() + "/package.json");
var packageJsonConfig = JSON.parse(txt);
var i18n = packageJsonConfig.i18n;
var locale;
if(i18n == "en") {
    locale = require("./en-US.js");
    require('../../../locales/en');
}
else {
    locale = require("./zh-CN.js");
    require('../../../locales/zh_CN');
}

exports.help_dict = locale.help_dict;
exports.error_code = locale.error_code;