/**
 * 将TypeScript编译为JavaScript
 */
var create_file_list = require("./create_file_list.js");
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js");
var exmlc = require("../exml/exmlc.js");
var file = require("../core/file.js");

function run(dir, args, opts) {
    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    var currDir = globals.joinEgretDir(dir, args[0]);

    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var task = [];

    var exmlList = [];
    task.push(function(callback){
        if(!keepGeneratedTypescript){
            globals.addCallBackWhenExit(cleanEXMLList);
        }
        var source = path.join(currDir, "src");
        exmlList = file.search(source,"exml");
        source += "/";
        exmlList.forEach(function (item) {
            exmlc.compile(item,source);
        });

        callback();
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
        var exist = file.exists(file.joinPath(currDir,"bin-debug","lib"));
        if (!exist){
            globals.exit(1102)
        }
    }

    task.push(
        function (callback) {
            var gameListPath = currDir+"/bin-debug/src/game_file_list.js";
            if(!file.exists(currDir+"/src/game_file_list.js")){
                var list = file.search(currDir+"/src/","ts")
                var gameListText = create_file_list.create(list,currDir+"/src/");
                file.save(gameListPath,gameListText);
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
            globals.log("构建成功");
        }
        else{
            globals.exit(err);
        }
    })

    function cleanEXMLList(){
        if(exmlList){
            var source = path.join(currDir, "src");
            exmlList.forEach(function (item) {
                var tsPath = path.join(source,item);
                tsPath = tsPath.substring(0,tsPath.length-5)+".ts";
                file.remove(tsPath);
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