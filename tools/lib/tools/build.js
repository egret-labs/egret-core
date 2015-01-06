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
                        copyFilesToNative(path.join(url, "egret-game"), "android");
                    }
                }

                if (projectProperties.getNativePath("ios")) {
                    var url1 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "proj.ios");
                    var url2 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "Resources");

                    if (file.exists(url1)
                        && file.exists(url2)) {//是egret的ios项目
                        copyFilesToNative(path.join(url2, "egret-game"), "ios");
                    }
                }

                tempCallback();
            }
        );
    }

    function copyFilesToNative(url, platform) {
        var startTime = Date.now();

        //1、清除文件夹
        file.remove(url);

        var projectPath = projectProperties.getProjectPath();

        //2、拷贝文件
        //launcher
        file.copy(path.join(projectPath, "launcher/native_loader.js"), path.join(url, "launcher/native_loader.js"));
        file.copy(path.join(projectPath, "launcher/native_require.js"), path.join(url, "launcher/native_require.js"));

        //js
        file.copy(path.join(projectPath, "bin-debug/src"), path.join(url, "bin-debug/src"));
        file.copy(path.join(projectPath, "bin-debug/lib/egret_file_list_native.js"), path.join(url, "bin-debug/lib/egret_file_list.js"));

        //libs
        file.copy(path.join(projectPath, "libs"), path.join(url, "libs"));

        //resource
        copyFilesWithIgnore(path.join(projectPath, "resource"), path.join(url, "resource"));

        //3、生成空版本控制文件
        //编译版本控制文件 生成2个空文件
        file.save(path.join(url, "base.manifest"), "{}");
        file.save(path.join(url, "version.manifest"), "{}");

        //4、修改native_require.js文件
        var native_require = file.read(path.join(url, "launcher/native_require.js"));
        native_require = native_require.replace(/var needCompile =.*/, "var needCompile = false;");
        file.save(path.join(url, "launcher/native_require.js"), native_require);

        //5、修改native入口文件
        if (platform == "android") {

        }
        else if (platform == "ios") {

        }

        console.log("native拷贝共计耗时：%d秒", (Date.now() - startTime) / 1000);
    }

    function copyFilesWithIgnore(sourceRootPath, desRootPath) {
        var copyFilePathList = file.getDirectoryAllListing(path.join(sourceRootPath));

        var ignorePathList = projectProperties.getIgnorePath();
        ignorePathList = ignorePathList.map(function(item) {

            var reg = new RegExp(item);
            return reg;
        });

        var isIgnore = false;
        copyFilePathList.forEach(function(copyFilePath) {
            isIgnore = false;

            for (var key in ignorePathList) {//检测忽略列表
                var ignorePath = ignorePathList[key];

                if (copyFilePath.match(ignorePath)) {
                    isIgnore = true;
                    break;
                }
            }

            if(!isIgnore) {//不在忽略列表的路径，拷贝过去
                var copyFileRePath = path.relative(sourceRootPath, copyFilePath);
                file.copy(path.join(copyFilePath), path.join(desRootPath, copyFileRePath));
            }
        });
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