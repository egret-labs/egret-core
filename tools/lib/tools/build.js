/**
 * 将TypeScript编译为JavaScript
 */
var create_file_list = require("./create_file_list.js");
var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js")
var exmlc = require("../exml/exmlc.js");
function run(dir, args, opts) {
    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    var currDir = libs.joinEgretDir(dir, args[0]);

    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var task = [];

    var exmlList = [];
    task.push(function(callback){
        if(!keepGeneratedTypescript){
            libs.addCallBackWhenExit(cleanEXMLList);
        }
        var source = path.join(currDir, "src");
        exmlList = libs.loopFileSync(source, filter);
        source += "/";
        exmlList.forEach(function (item) {
            exmlc.compile(item,source);
        });

        callback();

        function filter(path) {
            var index = path.lastIndexOf(".");
            if(index==-1){
                return false;
            }
            return path.substring(index).toLowerCase()==".exml";
        }
    })


    if (needCompileEngine) {
        task.push(
            function (callback) {
                var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
                compiler.generateEgretFileList(callback, egret_file, runtime);

            },
            function (callback) {
                compiler.compile(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, "bin-debug/lib"),
                    egret_file
                );
            },

            function (callback) {
                compiler.exportHeader(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, "src", "egret.d.ts"),
                    egret_file
                );

            }
        );
    }
    else {
        var exist = fs.existsSync(path.join(currDir,"bin-debug","lib"));
        if (!exist){
            libs.exit(1102)
        }
    }

    task.push(
        function (callback) {
            var gameListPath = currDir+"/bin-debug/src/game_file_list.js";
            if(!fs.existsSync(currDir+"/src/game_file_list.js")){
                var gameListText = create_file_list.create(currDir+"/src/");
                if(!fs.existsSync(currDir+"/bin-debug/src/")){
                    fs.mkdirSync(currDir+"/bin-debug/src/");
                }
                fs.writeFileSync(gameListPath,gameListText,"utf-8");
            }
            compiler.compile(callback,
                path.join(currDir, "src"),
                path.join(currDir, "bin-debug/src"),
                gameListPath
            );
        }
    )


    async.series(task, function (err) {
        if(!keepGeneratedTypescript) {
            cleanEXMLList();
        }
        if (!err){
            libs.log("构建成功");
        }
        else{
            libs.exit(err);
        }
    })

    function cleanEXMLList(){
        if(exmlList){
            var source = path.join(currDir, "src");
            exmlList.forEach(function (item) {
                var tsPath = path.join(source,item);
                tsPath = tsPath.substring(0,tsPath.length-5)+".ts";
                libs.remove(tsPath);
            });
        }
    }
}


function help_title() {
    return "构建指定项目,编译指定项目的 TypeScript 文件\n";
}


function help_example() {
    var result =  "\n";
    result += "    egret build [project_name] [-e] [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -e           编译指定项目的同时编译引擎目录\n";
    result += "    --runtime    设置构建方式为 html5 或者是 native方式，默认值为html5";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;