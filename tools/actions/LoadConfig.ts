import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import ts = require("../lib/typescript-plus/lib/typescript");
import * as path from 'path';
export function loadTsConfig(url, options: egret.ToolArgs): void {


    var configObj: any;
    try {
        configObj = JSON.parse(file.read(url));
    } catch (e) {
        // errLog.push(utils.tr(1117));//不是有效的 json 文件
    }

    var configParseResult = ts.parseJsonConfigFileContent(configObj, ts.sys, path.dirname(url));
    let compilerOptions = configParseResult.options;
    compilerOptions.defines = getCompilerDefines(options, true);

    // var notSupport = ["target", "outDir", "module", "noLib", "outFile", "rootDir", "out"];
    // for (let optionName of notSupport) {
    //     if (compilerOptions.hasOwnProperty(optionName)) {
    //         var outputError = true;
    //         //下面几种情况不输出错误信息
    //         if (optionName == 'target' && (<string><any>compilerOptions[optionName]).toLowerCase() == 'es5') {
    //             outputError = false;
    //         } else if (optionName == 'outDir') {
    //             var outdir = compilerOptions[optionName].toLowerCase();
    //             if (outdir == 'bin-debug' || outdir == './bin-debug') {
    //                 outputError = false;
    //             }
    //         }
    //         if (outputError) {
    //             var error = utils.tr(1116, optionName);//这个编译选项目前不支持修改
    //             console.log(error);//build -e 的时候输出
    //             delete compilerOptions[optionName];
    //         }
    //     }
    // }


    compilerOptions.target = 1;

    options.compilerOptions = compilerOptions;
    options.tsconfigError = configParseResult.errors.map(d => d.messageText.toString());
}


function getCompilerDefines(args: egret.ToolArgs, debug?: boolean) {
    let defines: any = {};
    if (debug != undefined) {
        defines.DEBUG = debug;
        defines.RELEASE = !debug;
    }
    else if (args.publish) {
        defines.DEBUG = false;
        defines.RELEASE = true;
    }
    else {
        defines.DEBUG = true;
        defines.RELEASE = false;
    }
    return defines;

}