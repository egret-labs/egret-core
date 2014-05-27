var path = require("path");
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var fs = require("fs");
var async = require('../core/async');
var compiler = require("./compile.js")


/**
 * 创建新项目
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currDir, args, opts) {
    var projectName = args[0];
    if (!projectName) {
        libs.exit(1001);
    }

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
    var egret_file = path.join(currDir, projectName, "bin-debug/lib/egret_file_list.js");

    async.series([

        function (callback) {
            createNewProject(projectName);
            callback();
        },

        function (callback) {

            compiler.generateEgretFileList(callback, egret_file, runtime);

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

        },

        function (callback) {
            compiler.compile(callback,
                path.join(currDir, projectName, "src"),
                path.join(currDir, projectName, "bin-debug/src"),
                path.join(currDir, projectName, "src/game_file_list.js")
            );
        },

        function (callback) {
            libs.log("创建成功");
        }
    ])


}

//创建 游戏目录
function createNewProject(projectName) {
    var template = path.join(param.getEgretPath(), "tools/templates/game");
    var projPath = path.join(process.cwd(), projectName);
    libs.copy(template, projPath);
}

function help_title() {
    return "创建新项目";
}


function help_example() {
    return "egret create [project_name] [--runtime html5|native]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;