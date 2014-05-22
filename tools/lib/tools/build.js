/**
 * 将TypeScript编译为JavaScript
 */
var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js")
var currDir_global;
function run(currDir, args, opts) {
    currDir_global = currDir;
    var needCompileEngine = opts["-e"];

    var projectName = args[0];
    if (!projectName) {
        libs.exit(1101);
    }
    var egret_file = path.join(currDir, projectName, "bin-debug/lib/egret_file_list.js");
    var task = [];
    if (needCompileEngine) {
        task.push(
            function (callback) {
                var runtime = param.getOption(opts,"--runtime",["html5","native"]);
                compiler.generateEgretFileList(callback,egret_file,runtime);

            },
            function (callback) {
                compiler.compile(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, projectName, "bin-debug/lib"),
                    egret_file
                );
            },

            function (callback) {
                compiler.exportHeader(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, projectName, "src", "egret.d.ts"),
                    egret_file
                );

            }
        );
    }

    task.push(
        function (callback) {
            compiler.compile(callback,
                path.join(currDir, projectName, "src"),
                path.join(currDir, projectName, "bin-debug/src"),
                path.join(currDir, projectName, "src/game_file_list.js")
            );
        }
    )

    async.series(task, function (err) {
        console.log("编译成功");
    })
}


function help_title() {
    return "编译指定项目";
}


function help_example() {
    return "egret build [project_name]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;