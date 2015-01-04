/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var buildModule = require("../core/buildModule.js");
var file = require("../core/file.js");
var projectProperties = require("../core/projectProperties.js");
var global = require("../core/globals");


function run(dir, args, opts) {
    var currDir = globals.joinEgretDir(dir, args[0]);
    globals.checkVersion(currDir);

    projectProperties.init(currDir);

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);

    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    buildPlatform(needCompileEngine, keepGeneratedTypescript);
}


function buildPlatform(needCompileEngine, keepGeneratedTypescript) {
    var task = [];

    if (needCompileEngine) {//编译第三方库
        task.push(function (callback) {
            buildModule.compileAllModules(projectProperties, callback);
        });

        task.push(function (tempCallback) {//修改egret_file_list.js文件
            var moduleList = projectProperties.getAllModules();
            var html5List = [];
            var nativeList = [];
            for (var i = 0; i < moduleList.length; i++) {
                var module = projectProperties.getModuleConfig(moduleList[i]["name"]);
                var list = module["file_list"];

                for (var j = 0; j < list.length; j++) {
                    var item = list[j];
                    if (item.indexOf(".d.ts") == -1) {
                        item = item.replace(".ts", ".js");
                        var url = path.join((module["output"] ? module["output"] : module["name"]), item);

                        if (module["name"] == "html5") {
                            html5List.push(url);
                        }
                        else if (module["name"] == "native") {
                            nativeList.push(url);
                        }
                        else {
                            html5List.push(url);
                            nativeList.push(url);
                        }
                    }
                }
            }

            file.save(path.join(projectProperties.getProjectPath(), "bin-debug", "lib", "egret_file_list.js"), "var egret_file_list = " + JSON.stringify(html5List, null, "\t") + ";");
            file.save(path.join(projectProperties.getProjectPath(), "bin-debug", "lib", "egret_file_list_native.js"), "var egret_file_list = " + JSON.stringify(nativeList, null, "\t") + ";");

            tempCallback();
        });
    }

    if (true) {//编译游戏
        task.push(
            function (callback) {
                console.log(Date.now() + "  111");

                var buildP = require("../core/buildProject");
                buildP.build(projectProperties, callback, keepGeneratedTypescript);
            }
        );

        task.push(//修改game_file_list.js文件
            function (callback) {

            }
        );
    }

    if (false) {
        task.push(//替换native项目内容
            function (callback) {

            }
        );
    }

    async.series(task, function (err) {
        if (!err) {
            globals.log("构建成功");
        }
        else {
            globals.exit(err);
        }
    })
}

function help_title() {
    return "构建指定项目,编译指定项目的 TypeScript 文件\n";
}


function help_example() {
    var result = "\n";
    result += "    egret build [project_name] [-e] [--runtime html5|native] [-quick/-q]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -e           编译指定项目的同时编译引擎目录\n";
    result += "    -k           编译EXML文件时保留生成的TS文件\n";
    result += "    --runtime    设置构建方式为 html5 或者是 native方式，默认值为html5";
    result += "    -quick/-q    快速编译，跳过ts严格类型检查阶段";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;