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

            //写入语言包文件
            url = "core/egret/i18n/" + globals.getPackageJsonConfig().i18n + ".js";
            html5List.unshift(url);
            nativeList.unshift(url);

            file.save(path.join(projectProperties.getProjectPath(), "bin-debug", "lib", "egret_file_list.js"), "var egret_file_list = " + JSON.stringify(html5List, null, "\t") + ";");
            file.save(path.join(projectProperties.getProjectPath(), "bin-debug", "lib", "egret_file_list_native.js"), "var egret_file_list = " + JSON.stringify(nativeList, null, "\t") + ";");

            tempCallback();
        });
    }

    var onlyEngine = param.getArgv()["opts"]["--module"] != null;
    if (!onlyEngine) {//编译游戏
        task.push(
            function (tempCallback) {
                globals.debugLog(1105);

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
                    var url1 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("android"), "proj.android");
                    if (file.exists(url1)) {//是egret的android项目

                        //拷贝项目到native工程中
                        var cpFiles = require("../core/copyProjectFiles.js");
                        cpFiles.copyFilesToNative(projectProperties.getProjectPath(),
                            path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("android")),
                            "android", projectProperties.getIgnorePath());

                        //修改java文件
                        var javaEntr = require('../core/changeJavaEntrance');
                        javaEntr.changeBuild(url1, "android");
                    }
                }

                if (projectProperties.getNativePath("ios")) {
                    var url1 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "proj.ios");

                    if (file.exists(url1)) {//是egret的ios项目

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
            globals.log(1104);
        }
        else {
            globals.exit(err);
        }
    })
}

exports.run = run;
