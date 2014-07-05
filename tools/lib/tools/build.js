/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js");
var file = require("../core/file.js");

function run(dir, args, opts) {
    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    var currDir = globals.joinEgretDir(dir, args[0]);

    var task = [];

    if (needCompileEngine) {
        var egretSourceList = [];
        task.push(
            function (callback) {
                var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
                egretSourceList = compiler.generateEgretFileList(runtime,currDir);
                compiler.compile(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, "bin-debug/lib"),
                    egretSourceList,
                    false
                );
            },

            function (callback) {
                compiler.exportHeader(callback,
                    currDir,
                    egretSourceList
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
            buildProject(callback,currDir,keepGeneratedTypescript);
        }
    )


    async.series(task, function (err) {
        if (!err){
            globals.log("构建成功");
        }
        else{
            globals.exit(err);
        }
    })


}

function buildProject(callback,currDir,keepGeneratedTypescript){
    var libsPath = path.join(currDir,"libs/");
    var sourceList = compiler.generateGameFileList(currDir);
    var libs = file.search(libsPath,"d.ts");
    compiler.compile(callback,
        path.join(currDir, "src"),
        path.join(currDir, "bin-debug/src"),
        sourceList.concat(libs),
        keepGeneratedTypescript
    );
}



function help_title() {
    return "构建指定项目,编译指定项目的 TypeScript 文件\n";
}


function help_example() {
    var result =  "\n";
    result += "    egret build [project_name] [-e] [-e] [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -e           编译指定项目的同时编译引擎目录\n";
    result += "    -k           编译EXML文件时保留生成的TS文件\n";
    result += "    --runtime    设置构建方式为 html5 或者是 native方式，默认值为html5";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
exports.buildProject = buildProject;