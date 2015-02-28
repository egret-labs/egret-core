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
    globals.setShowDebugLog();

    projectProperties.init(currDir);

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);

    var needCompileEngine = opts["-e"] || opts["--module"];
    var keepGeneratedTypescript = opts["-k"];

    buildPlatform(needCompileEngine, keepGeneratedTypescript);
}


function buildPlatform(needCompileEngine, keepGeneratedTypescript) {
    var task = [];

    var needClean = param.getArgv()["opts"]["-clean"] != null;
    if (needClean) {
        if (param.getArgv()["opts"]["-e"] != null) {
            file.remove(path.join(projectProperties.getProjectPath(), "libs"));
            file.remove(path.join(projectProperties.getProjectPath(), "bin-debug"));
        }
    }

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

                        url = url.replace(/(\\\\|\\)/g, "/");
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

    var onlyEngine = param.getArgv()["opts"]["--module"] != null;
    if (!onlyEngine) {//编译游戏
        task.push(
            function (tempCallback) {
                globals.debugLog("编译项目：");

                var buildP = require("../core/buildProject");
                buildP.build(projectProperties, tempCallback, keepGeneratedTypescript);
            }
        );

        task.push(//修改game_file_list.js文件
            function (tempCallback) {
                tempCallback();
            }
        );
    }

    var runtime = param.getOption(param.getArgv()["opts"], "--runtime", ["html5", "native"]);

    if (runtime == "native") {
        task.push(//替换native项目内容
            function (tempCallback) {
                if (projectProperties.getNativePath("android")) {
                    var url = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("android"), "proj.android/assets");
                    if (file.exists(url)) {//是egret的android项目

                        //拷贝项目到native工程中
                        var cpFiles = require("../core/copyProjectFiles.js");
                        cpFiles.copyFilesToNative(projectProperties.getProjectPath(),
                            path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("android")),
                            "android", projectProperties.getIgnorePath());
                    }
                }

                if (projectProperties.getNativePath("ios")) {
                    var url1 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "proj.ios");
                    var url2 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "Resources");

                    if (file.exists(url1)
                        && file.exists(url2)) {//是egret的ios项目

                        //拷贝项目到native工程中
                        var cpFiles = require("../core/copyProjectFiles.js");
                        cpFiles.copyFilesToNative(projectProperties.getProjectPath(),
                            path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios")),
                            "ios", projectProperties.getIgnorePath());
                    }
                }

                tempCallback();
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
    result += "    egret build [project_name] [-e [-clean]|--module [core gui]] [-k] [--runtime native][-noscan] [-log]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -e           编译指定项目的同时编译引擎目录\n";
    result += "    -clean       清除libs以及bin-debug文件夹，只有在-e的前提下才会生效\n";
    //result += "    --module     只编译引擎中指定的部分模块，不编译项目；不填则编译全部模块\n";
    result += "    -k           编译EXML文件时保留生成的TS文件\n";
    result += "    --runtime    如果有native工程，则会将文件拷贝到工程里\n";
    //result += "    -noscan      编译游戏时，根据game_file_list获取编译列表\n";
    result += "    -log         显示执行过程";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;