/**
 * Created by huanghaiying on 14/12/3.
 */
var path = require("path");
var param = require("../core/params_analyze.js");
var globals = require("../core/globals");

var cp_exec = require('child_process').exec;

function createZipFile(sourcePath, outputFile, call, password) {
    var compilerPath = path.join(param.getEgretPath(), "tools/lib/zip/EGTZipTool_v1.0.1.jar");
    compilerPath = globals.addQuotes(compilerPath);
    outputFile = globals.addQuotes(outputFile);
    sourcePath = globals.addQuotes(sourcePath);

    var cmd = globals.getGlobalJava() + ' -jar ' + compilerPath + ' zip ' + outputFile + ' ' + sourcePath + ' ' + (password || "");
    var build = cp_exec(cmd);
//        build.stdout.on("data", function(data) {
//            globals.log(data);
//        });
    build.stderr.on("data", function(data) {
        globals.log(data);
    });
    build.on("exit", function(result) {
        if (result == 0) {
            //结束
            call();
        } else {
            //todo zip异常
            //globals.warn(result);
            console.error("打zip包出现异常！");
        }
    });
}

exports.createZipFile = createZipFile;