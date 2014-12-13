/**
 * Created by huanghaiying on 14/12/3.
 */
var path = require("path");
var param = require("../core/params_analyze.js");
var globals = require("../core/globals");

var cp_exec = require('child_process').exec;

function createZipFile(sourcePath, outputFile, call, password) {
    var compilerPath = path.join(param.getEgretPath(), "tools/lib/zip/EGTZipTool_v1.0.1.jar");
    compilerPath = "\"" + compilerPath + "\"";

    var cmd = 'java -jar ' + compilerPath + ' zip ' + outputFile + ' ' + sourcePath + ' ' + (password || "");
    var build = cp_exec(cmd);
//        build.stdout.on("data", function(data) {
//            globals.log(data);
//        });
    build.stderr.on("data", function(data) {
        globals.log(data);
    });
    build.on("exit", function(result) {
        call();
        if (result == 0) {
            //结束
        } else {
            //todo zip异常
            //globals.warn(result);
        }
    });
}

exports.createZipFile = createZipFile;