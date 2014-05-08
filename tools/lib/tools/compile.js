/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var cp_exec = require('child_process').exec;
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");


function run(currentDir, args, opts) {
    var source = path.resolve(param.getEgretPath(), "");
    var source = opts["--source"];
    var output = opts["--output"];
    if (!source || !output){
        libs.exit(1302);
    }
    source = source[0];
    output = output[0];
    if (!source || !output){
        libs.exit(1302);
    }
    buildAllFile(source, output, function () {
        console.log("编译成功");
    })
}

function buildAllFile(source, output, callback) {

    async.waterfall([
        checkCompilerInstalled,

        function (callback) {
            var all_js_file = libs.loopFileSync(source, filter);
            all_js_file.forEach(function (item) {
                libs.copy(path.join(source, item), path.join(output, item));
            })
            callback(null);

            function filter(path) {
                return  path.indexOf(".js") > -1
            }
        },

        function (callback) {
            compile_temp(callback, source)
        },

        function (filepath, callback) {
            build(callback, filepath, output);
        },


        function (result, callback) {
            var allFileList = generateAllTypeScriptFileList(output);
            for (var i = 0; i < allFileList.length; i++) {
                var fileToDelete = path.join(output, allFileList[i]);
                libs.deleteFileSync(fileToDelete);
            }
            callback();
        }



    ], function (err) {

        if (err) {
            libs.exit(err);
        }
        callback();
    })


}

function compile_temp(callback, source) {


    var check_list = ["egret_file_list.js", "game_file_list.js"];
    var exist_flag = false;

    for (var i = 0 , length = check_list.length; i < length; i++) {
        var file = path.join(source, check_list[i]);
        if (fs.existsSync(file)) {
            exist_flag = true;
            var js_content = fs.readFileSync(file, "utf-8");
            eval(js_content);
            var output_path = compileFileList(source, eval(check_list[i].split(".js")[0]));
        }
    }

    if (exist_flag) {
        callback(null, output_path);
    }
    else {
        libs.exit(1301, source);
    }
}


function compileFileList(source, file_list) {
    var output_content = file_list.map(function (item) {

        if (item.indexOf("jslib") >= 0) return "";
        if (item.indexOf("Native") >= 0) return "";
        return "///\<reference path=\"" + item.replace(".js", ".ts") + "\"/>";


    }).join("\n");
    var output_path = path.join(source, "temp.ts");
    fs.writeFileSync(output_path, output_content, "utf-8");
    return output_path;


}


function checkCompilerInstalled(callback) {
    var checkTypeScriptCompiler = "tsc";
    var tsc = cp_exec(checkTypeScriptCompiler);
    tsc.on('exit', function (code) {
            if (code == 0) {
                callback();
            }
            else {
                libs.exit(2);
            }
        }
    );
}

/**
 * 编译单个TypeScript文件
 * @param file
 * @param callback
 */
function build(callback, source, output) {
//    var target = path.join(output,file).replace(".ts",".js");
    var cmd = "tsc " + source + " -t ES5 --outDir " + output;

    var ts = cp_exec(cmd);
    ts.stderr.on("data", function (data) {
        if (data.indexOf("error TS1") >= 0 ||
            data.indexOf("error TS5") >= 0 ||
            data.indexOf("error TS2105") >= 0) {

        }
        console.log(data);
    })


    ts.on('exit', function (code) {
        fs.unlinkSync(source)
        fs.unlinkSync(path.join(output, "temp.js"));
        callback(null, source);
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
        return  path.indexOf(".ts") == path.length - 3 && path.indexOf(".d.ts") == -1
    }
}

exports.compile = buildAllFile;
exports.run = run;