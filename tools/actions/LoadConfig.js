var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
/// <reference path="../lib/typescript/tsclark.d.ts" />
function loadTsConfig(url, options) {
    var configStr = file.read(url);
    var configObj;
    var errLog = [];
    if (configStr) {
        try {
            configObj = JSON.parse(configStr);
        }
        catch (e) {
            errLog.push(utils.tr(1117)); //不是有效的 json 文件
        }
    }
    var compilerOptions = {};
    if (configObj) {
        compilerOptions = configObj["compilerOptions"];
        if (compilerOptions) {
            var notSupport = ["target", "outDir", "module", "noLib", "outFile", "rootDir", "out"];
            for (var i = 0, len = notSupport.length; i < len; i++) {
                var optionName = notSupport[i];
                if (compilerOptions.hasOwnProperty(optionName)) {
                    var outputError = true;
                    //下面几种情况不输出错误信息
                    if (optionName == 'target' && compilerOptions[optionName].toLowerCase() == 'es5') {
                        outputError = false;
                    }
                    else if (optionName == 'outDir') {
                        var outdir = compilerOptions[optionName].toLowerCase();
                        if (outdir == 'bin-debug' || outdir == './bin-debug') {
                            outputError = false;
                        }
                    }
                    if (outputError) {
                        var error = utils.tr(1116, optionName); //这个编译选项目前不支持修改
                        errLog.push(error);
                        console.log(error); //build -e 的时候输出
                        delete compilerOptions[optionName];
                    }
                }
            }
        }
    }
    compilerOptions.target = 1; //ES5
    options.compilerOptions = compilerOptions;
    options.tsconfigError = errLog;
}
exports.loadTsConfig = loadTsConfig;

//# sourceMappingURL=LoadConfig.js.map
