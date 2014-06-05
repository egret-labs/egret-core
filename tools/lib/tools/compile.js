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
    if (!source || !output) {
        libs.exit(1302);
    }
    source = source[0];
    output = output[0];
    if (!source || !output) {
        libs.exit(1302);
    }
    buildAllFile(function () {
        console.log("编译成功");
    }, source, output)
}

/**
 * 编译指定的代码
 *
 * @param callback 回调函数
 * @param source 源文件所在的文件夹
 * @param output 输出地址
 * @param file_list 文件名称，默认为source/src/game_file_list.js或 source/src/egret_file_list.js
 */
function buildAllFile(callback, source, output, file_list) {

    async.waterfall([
        checkCompilerInstalled,

        //cp所有js文件
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
            var sourceList = getFileList(file_list);
            sourceList = sourceList.map(function (item) {
                return path.join(source, item).replace(".js", ".ts");
            }).filter(function (item) {
                    return fs.existsSync(item);
                }).map(function(item){
                    return "\"" + item + "\"";
                })

            var cmd = "" + sourceList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            fs.writeFileSync("tsc_config_temp.txt", cmd, "utf-8");
            var ts = cp_exec("tsc @tsc_config_temp.txt");
            ts.stderr.on("data", function (data) {
                console.log(data);
            })


            ts.on('exit', function (code) {
                fs.unlinkSync("tsc_config_temp.txt");

                if (code == 0) {
                    libs.log("编译 " + file_list + " 成功");
                    callback(null, source);
                }
                else {
                    libs.log(1303)
                }

            });
        }



    ], function (err) {

        if (err) {
            libs.exit(err);
        }
        callback();
    })


}

function getFileList(file_list) {
    if (fs.existsSync(file_list)) {
        var js_content = fs.readFileSync(file_list, "utf-8");
        eval(js_content);
        var path = require("path");
        var varname = path.basename(file_list).split(".js")[0];
        return eval(varname);
    }
    else {
        libs.exit(1301, file_list);
    }
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

function generateEgretFileList(callback, egret_file, runtime) {
    var file_list = libs.require("tools/lib/core/file_list.js");
    var required_file_list = file_list.core.concat(file_list[runtime]);

    var content = required_file_list.map(function (item) {
        return "\"" + item + "\""
    }).join(",\n")
    content = "var egret_file_list = [\n" + content + "\n]";
    libs.mkdir(path.dirname(egret_file));
    fs.writeFileSync(egret_file, content, "utf-8");
    callback();

}


function exportHeader(callback, source, output, file_list) {
    var list = getFileList(file_list);
    list = list.map(function (item) {
        return path.join(source, item).replace(".js", ".ts");
    }).filter(function (item) {
            return fs.existsSync(item);
        }).map(function(item){
            return "\"" + item + "\"";
        })
    var source = list.join(" ");
    var cmd = source + " -t ES5 -d --out " + "\"" + output + "\"";
    fs.writeFileSync("tsc_config_temp.txt", cmd, "utf-8");
    var ts = cp_exec("tsc @tsc_config_temp.txt");
    ts.stderr.on("data", function (data) {
        console.log(data);
    })

    ts.on('exit', function (code) {
        if (code == 0) {
            libs.log(".d.ts文件导出成功");
            if (callback) {
                callback();
            }
        }
        else {
            libs.exit(1303);
        }

    });
}

exports.compile = buildAllFile;
exports.exportHeader = exportHeader;
exports.generateEgretFileList = generateEgretFileList;
exports.run = run;