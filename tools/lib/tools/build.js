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

    var currDir = dir;
    var projectName = args[0];
    if (projectName) {
        currDir = path.join(currDir, projectName);
    }

    var stat1 = fs.existsSync(path.join(currDir, "bin-debug"));
    var stat2 = fs.existsSync(path.join(currDir, "src"));
    var stat3 = fs.existsSync(path.join(currDir, "launcher"));
    if (!stat1 || !stat2 || !stat3) {//存在egret项目缺少的文件目录
        libs.exit(8002);
    }


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
    return "构建指定项目";
}


function help_example() {
    return "egret build [project_name] [--runtime html5|native]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;