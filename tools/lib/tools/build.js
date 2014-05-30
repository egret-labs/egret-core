/**
 * 将TypeScript编译为JavaScript
 */
var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js")
function run(dir, args, opts) {
    var needCompileEngine = opts["-e"];

    var currDir = libs.joinEgretDir(dir, args[0]);

    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var task = [];
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

    task.push(
        function (callback) {
            compiler.compile(callback,
                path.join(currDir, "src"),
                path.join(currDir, "bin-debug/src"),
                path.join(currDir, "src/game_file_list.js")
            );
        }
    )

    async.series(task, function (err) {
        libs.log("构建成功");
    })
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