/**
 * Created by apple on 14-4-29.
 */
var cp_exec = require('child_process').exec;
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var path = require("path");

function run(currDir, args, opts) {

    var egret_path = path.join(param.getEgretPath(),"src");
    var list = generateAllTypeScriptFileList(egret_path);
    list = list.map(function(item){
        return path.join(egret_path,item);
    })
    var source = list.join(" ");

    var out = "test.d.ts";
    var cmd = "tsc " + source + " -t ES5 -d --out " +  out;
    console.log (cmd);
//    return;

    var ts = cp_exec(cmd);
    ts.stderr.on("data", function (data) {

        console.log(data);

    })

    ts.on('exit', function (code) {
        console.log("[success]");
//        callback(null, file);
    });
}



/**
 * 生成source下的所有TypeScript文件列表
 * @param source
 * @returns {Array}
 */

function generateAllTypeScriptFileList(source) {

    return libs.loopFileSync(source, filter);

    function filter(path) {
        return  path.indexOf(".ts") == path.length - 3 && path.indexOf(".d.ts") == -1 &&
            path.indexOf("Native") == -1
    }
}


exports.run = run;