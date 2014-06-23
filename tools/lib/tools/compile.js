/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var async = require('../core/async');
var cp_exec = require('child_process').exec;
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");

function run(currentDir, args, opts) {
    var source = path.resolve(param.getEgretPath(), "");
    var source = opts["--source"];
    var output = opts["--output"];
    if (!source || !output) {
        globals.exit(1302);
    }
    source = source[0];
    output = output[0];
    if (!source || !output) {
        globals.exit(1302);
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

        //cp所有非ts/exml文件
        function (callback) {
            var all_file = file.searchByFunction(source, filter);
            all_file.forEach(function (item) {
                var itemName = item.substring(source.length);
                file.copy(item, path.join(output, itemName));
            })
            callback(null);

            function filter(path) {
                var index = path.lastIndexOf(".");
                if(index==-1){
                    return true;
                }
                var ext = path.substring(index).toLowerCase();
                return ext!=".ts"&&ext!=".exml";
            }
        },

        function (callback) {
            var sourceList = getFileList(file_list);
            sourceList = sourceList.map(function (item) {
                return path.join(source, item).replace(".js", ".ts");
            }).filter(function (item) {
                    return file.exists(item);
                }).map(function(item){
                    return "\"" + item + "\"";
                })

            var cmd = "" + sourceList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            file.save("tsc_config_temp.txt", cmd);
            var ts = cp_exec("tsc @tsc_config_temp.txt");
            ts.stderr.on("data", function (data) {
                console.log(data);
            })


            ts.on('exit', function (code) {
                file.remove("tsc_config_temp.txt");

                if (code == 0) {
                    globals.log("编译 " + file_list + " 成功");
                    callback(null, source);
                }
                else {
                    callback(1303);
                }

            });
        }



    ], function (err) {
        callback(err);
    })


}

function getFileList(file_list) {
    if (file.exists(file_list)) {
        var js_content = file.read(file_list);
        eval(js_content);
        var path = require("path");
        var varname = path.basename(file_list).split(".js")[0];
        return eval(varname);
    }
    else {
        globals.exit(1301, file_list);
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
                globals.exit(2);
            }
        }
    );
}

function generateEgretFileList(callback, egret_file, runtime) {
    var file_list = globals.require("tools/lib/core/file_list.js");
    var required_file_list = file_list.core.concat(file_list[runtime]);

    var content = required_file_list.map(function (item) {
        return "\"" + item + "\""
    }).join(",\n")
    content = "var egret_file_list = [\n" + content + "\n]";
    file.createDirectory(file.getDirectory(egret_file));
    file.save(egret_file, content);
    callback();

}


function exportHeader(callback, source, output, file_list) {
    var list = getFileList(file_list);
    list = list.map(function (item) {
        return path.join(source, item).replace(".js", ".ts");
    }).filter(function (item) {
            return file.exists(item);
        }).map(function(item){
            return "\"" + item + "\"";
        })
    var source = list.join(" ");
    var cmd = source + " -t ES5 -d --out " + "\"" + output + "\"";
    file.save("tsc_config_temp.txt", cmd);
    var ts = cp_exec("tsc @tsc_config_temp.txt");
    ts.stderr.on("data", function (data) {
        console.log(data);
    })

    ts.on('exit', function (code) {
        if (code == 0) {
            var egretDTS = file.read(output);
            var lines = egretDTS.split("\n");
            var length = lines.length;
            for(var i=0;i<length;i++){
                var line = lines[i];
                if(line.indexOf("/// <reference path")!=-1){
                    lines.splice(i,1);
                    i--;
                }
                else{
                    break;
                }
            }
            egretDTS = lines.join("\n");
            file.save(output,egretDTS);
            globals.log(".d.ts文件导出成功");
            if (callback) {
                callback();
            }
        }
        else {
            callback(1303)
        }

    });
}

exports.compile = buildAllFile;
exports.exportHeader = exportHeader;
exports.generateEgretFileList = generateEgretFileList;
exports.run = run;