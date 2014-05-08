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

    var game_path = args[0];
    if (!game_path) {
        libs.exit(1101);
    }

    var task = [];
    if (needCompileEngine) {
        task.push(
            function (callback) {
                compiler.compile(path.join(param.getEgretPath(), "src"), path.join(currDir, game_path, "bin-debug/lib"), callback);
            }
        );
    }

    task.push(
        function (callback) {
            compiler.compile(path.join(currDir, game_path, "src"), path.join(currDir, game_path, "bin-debug/src"), callback);
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