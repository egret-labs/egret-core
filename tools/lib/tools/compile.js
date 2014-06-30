/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var async = require('../core/async');
var cp_exec = require('child_process').exec;
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var create_file_list = require("./create_file_list.js");

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
 * @param srcPath 源文件所在的文件夹
 * @param output 输出地址
 * @param sourceList 要编译的ts文件列表
 */
function buildAllFile(callback, srcPath, output, sourceList) {

    for(var i=sourceList.length;i>=0;i--){
        var p = sourceList[i];
        if(file.getExtension(p)!="ts"||!file.exists(p)){
            sourceList.splice(i,1);
        }
    }
    async.waterfall([
        checkCompilerInstalled,

        //cp所有非ts/exml文件
        function (callback) {
            var all_file = file.searchByFunction(srcPath, filter);
            all_file.forEach(function (item) {
                var itemName = item.substring(srcPath.length);
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
            sourceList = sourceList.map(function(item){
                    return "\"" + item + "\"";
                });
            var cmd = "" + sourceList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            file.save("tsc_config_temp.txt", cmd);
            var ts = cp_exec("tsc @tsc_config_temp.txt");
            ts.stderr.on("data", function (data) {
                console.log(data);
            })


            ts.on('exit', function (code) {
                file.remove("tsc_config_temp.txt");

                if (code == 0) {
                    callback(null, srcPath);
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

function exportHeader(callback, projectPath, list) {
    list = list.map(function(item){
            return "\"" + item + "\"";
        })
    var output = path.join(projectPath,"libs/egret.d.ts");
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

function generateEgretFileList(runtime,projectPath){
    var coreList = globals.require("tools/lib/manifest/core.json");
    var runtimeList = globals.require("tools/lib/manifest/"+runtime+".json");
    var egretPath = param.getEgretPath();
    var manifest = coreList.concat(runtimeList);
    var length = manifest.length;
    for(var i=0;i<length;i++){
        manifest[i] = file.joinPath(egretPath,"src",manifest[i]);
    }
    var egretFileListText = create_file_list.create(manifest,path.join(param.getEgretPath(),"src"),false);
    egretFileListText = "var egret_file_list = "+egretFileListText+";";
    file.save(file.joinPath(projectPath,"bin-debug/lib/egret_file_list.js"),egretFileListText);
    return manifest;
}



exports.compile = buildAllFile;
exports.exportHeader = exportHeader;
exports.run = run;
exports.generateEgretFileList = generateEgretFileList;