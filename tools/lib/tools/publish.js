var path = require("path");
var param = require("../core/params_analyze.js");
var globals = require("../core/globals");
var file = require("../core/file.js");
var compile = require("../tools/compile.js");

var screening = require("../tools/screeningfiles");

var closureCompiler = require("../core/closureCompiler");
var zip = require("../core/createzip.js");

var filelist = require("../core/getProjectFilelist.js");
var genVer = require("../tools/generate_version");
var projectProperties = require("../core/projectProperties.js");
var async = require('../core/async');

function run(dir, args, opts) {
    if (opts["-testJava"]) {
        closureCompiler.checkUserJava();
        return;
    }

    var currDir = globals.joinEgretDir(dir, args[0]);
    globals.checkVersion(currDir);
    globals.setShowDebugLog();

    projectProperties.init(currDir);

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
    if (runtime == "native") {
        publishNative(opts);
    }
    else {
        publishHtml5(opts);
    }
}

function publishNative(opts) {

    var timeMinSec = Date.now();
    var time = Math.round(Date.now() / 1000);

    console.log("开始发布%s版本：%d", "native", time);

    var projectPath = projectProperties.getProjectPath();
    var releasePath = path.join(projectPath, projectProperties.getReleaseUrl());
    var ziptempPath = path.join(releasePath, "ziptemp");
    file.remove(ziptempPath);

    var releaseOutputPath = path.join(releasePath, "android", time + "");
    file.createDirectory(releaseOutputPath);

    var task = [];

    //js文件
    //获取gamelist以及egretlist
    var file_list = filelist.getAllFileList(projectPath, "native");
    var needCompile = (opts["-compile"] || opts["-compiler"]) ? true : false;

    if (needCompile) {//压缩js文件，并拷贝到ziptemp目录中
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            globals.debugLog("开始压缩js文件");
            closureCompiler.compilerSingleFile(path.join(ziptempPath, "launcher", "__game-min-native.js"),
                file_list, path.join(ziptempPath, "launcher", "game-min-native.js"), function () {

                    globals.debugLog("压缩js文件耗时：%d秒", (Date.now() - tempTime) / 1000);
                    tempCallback();
                });
        });
    }
    else {
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            //拷贝到ziptemp目录中
            globals.debugLog("未压缩js文件，拷贝js文件");
            file_list.map(function (item) {
                var re = path.relative(projectPath, item);
                file.copy(item, path.join(ziptempPath, re));
            });

            file.copy(path.join(projectPath, "bin-debug", "lib", "egret_file_list_native.js"), path.join(ziptempPath, "bin-debug", "lib", "egret_file_list.js"));
            file.copy(path.join(projectPath, "bin-debug", "src", "game_file_list.js"), path.join(ziptempPath, "bin-debug", "src", "game_file_list.js"));

            globals.debugLog("拷贝js文件耗时：%d秒", (Date.now() - tempTime) / 1000);
            tempCallback();
        });
    }

    //生成版本控制文件到nativeBase里
    var noVerion = (opts["-noversion"]) ? true : false;
    if (!noVerion) {
        task.push(function (tempCallback) {
            //是否要重新生成当前版本的baseVersion文件
            var freshBaseVersion = (opts["-freshBaseVersion"]) ? true : false;
            if (freshBaseVersion) {
                file.remove(path.join(releasePath, "nativeBase"));
            }

            var tempTime = Date.now();
            globals.debugLog("扫描版本控制文件");

            genVer.generate(projectPath, path.join(releasePath, "nativeBase"), projectProperties.getVersionCode("native"));

            globals.debugLog("生成版本控制文件耗时：%d秒", (Date.now() - tempTime) / 1000);
            tempCallback();
        });
    }

    if (true) {//拷贝其他需要打到zip包里的文件
        task.push(function (tempCallback) {
            //拷贝需要zip的文件
            file.copy(path.join(projectPath, "launcher", "native_loader.js"), path.join(ziptempPath, "launcher", "native_loader.js"));
            file.copy(path.join(projectPath, "launcher", "runtime_loader.js"), path.join(ziptempPath, "launcher", "runtime_loader.js"));
            file.copy(path.join(projectPath, "launcher", "native_require.js"), path.join(ziptempPath, "launcher", "native_require.js"));
            if (noVerion) {
                file.save(path.join(ziptempPath, "version.manifest"), "{}");
                file.save(path.join(ziptempPath, "code.manifest"), JSON.stringify({code:1}));
            }
            else {
                file.copy(path.join(releasePath, "nativeBase", "version.manifest"), path.join(ziptempPath, "version.manifest"));
                file.copy(path.join(releasePath, "nativeBase", "code.manifest"), path.join(ziptempPath, "code.manifest"));
            }


            if (file.exists(path.join(ziptempPath, "launcher", "native_require.js"))) {
                var native_require = file.read(path.join(ziptempPath, "launcher", "native_require.js"));
                native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (needCompile ? "true" : "false") + ";");
                file.save(path.join(ziptempPath, "launcher", "native_require.js"), native_require);
            }

            tempCallback();
        });
    }

    //打zip包
    if (opts["-nozip"]) {//不需要打zip包
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            globals.debugLog("未打zip包，拷贝文件到release");
            file.copy(ziptempPath, releaseOutputPath);
            file.remove(ziptempPath);
            globals.debugLog("拷贝文件到release耗时：%d秒", (Date.now() - tempTime) / 1000);
            tempCallback();
        });
    }
    else {//打zip包
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            globals.debugLog("开始打zip包");
            var password = getPassword(opts);
            var zipFile = path.join(releaseOutputPath, "game_code_" + time + ".zip");
            zip.createZipFile(ziptempPath, zipFile, function () {
                file.remove(ziptempPath);

                globals.debugLog("打zip包耗时：%d秒", (Date.now() - tempTime) / 1000);
                tempCallback();
            }, password);
        });
    }

    //拷贝其他资源文件
    if (true) {//拷贝其他文件到发布目录
        task.push(function (tempCallback) {
            copyFilesWithIgnore(path.join(projectPath, "resource"), path.join(releaseOutputPath, "resource"));

            if (noVerion) {
                file.save(path.join(releaseOutputPath, "base.manifest"), "{}");
            }
            else {
                file.copy(path.join(releasePath, "nativeBase", "base.manifest"), path.join(releaseOutputPath, "base.manifest"));
            }

            compressJson(releaseOutputPath);
            tempCallback();
        });
    }

    //拷贝到native工程中
    if (true) {
        task.push(function (tempCallback) {
            var startTime = Date.now();

            //apk
            if (projectProperties.getNativePath("android")) {
                var url = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("android"), "proj.android/assets");
                if (file.exists(url)) {//是egret的android项目
                    //1、清除文件夹
                    file.remove(url);
                    file.copy(releaseOutputPath, path.join(url, "egret-game"));
                }
            }

            if (projectProperties.getNativePath("ios")) {
                var url1 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "proj.ios");
                var url2 = path.join(projectProperties.getProjectPath(), projectProperties.getNativePath("ios"), "Resources");

                if (file.exists(url1)
                    && file.exists(url2)) {//是egret的ios项目
                    //1、清除文件夹
                    file.remove(url2);
                    file.copy(releaseOutputPath, path.join(url2, "egret-game"));
                }
            }

            console.log("native拷贝共计耗时：%d秒", (Date.now() - startTime) / 1000);

            tempCallback();
        });
    }


    async.series(task, function (err) {
        if (!err) {
            console.log("发布完成共计耗时：%d秒", (Date.now() - timeMinSec) / 1000);
        }
        else {
            globals.exit(err);
        }
    });


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
}

function publishHtml5(opts) {
    var timeMinSec = Date.now();
    var time = Math.round(Date.now() / 1000);

    console.log("开始发布%s版本：%d", "html5", time);

    var projectPath = projectProperties.getProjectPath();
    var releasePath = path.join(projectPath, projectProperties.getReleaseUrl());

    var releaseOutputPath = path.join(releasePath, "html5", time + "");
    file.createDirectory(releaseOutputPath);

    var task = [];

    //js文件
    //获取gamelist以及egretlist
    var file_list = filelist.getAllFileList(projectPath, "html5");
    var needCompile = (opts["-compile"] || opts["-compiler"]) ? true : false;

    if (true) {//压缩js文件，并拷贝到ziptemp目录中
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            globals.debugLog("开始压缩js文件");
            closureCompiler.compilerSingleFile(path.join(releaseOutputPath, "launcher", "__game-min.js"),
                file_list, path.join(releaseOutputPath, "launcher", "game-min.js"), function () {

                    globals.debugLog("压缩js文件耗时：%d秒", (Date.now() - tempTime) / 1000);
                    tempCallback();
                });
        });
    }
    else {
        task.push(function (tempCallback) {
            var tempTime = Date.now();
            //拷贝到ziptemp目录中
            globals.debugLog("未压缩js文件，拷贝js文件");
            file_list.map(function (item) {
                var re = path.relative(projectPath, item);
                file.copy(item, path.join(releaseOutputPath, re));
            });

            file.copy(path.join(projectPath, "bin-debug", "lib", "egret_file_list.js"), path.join(releaseOutputPath, "bin-debug", "lib", "egret_file_list.js"));
            file.copy(path.join(projectPath, "bin-debug", "src", "game_file_list.js"), path.join(releaseOutputPath, "bin-debug", "src", "game_file_list.js"));

            globals.debugLog("拷贝js文件耗时：%d秒", (Date.now() - tempTime) / 1000);
            tempCallback();
        });
    }

    //生成版本控制文件到nativeBase里
    var noVerion = true;//(opts["-noversion"]) ? true : false;
    //if (!noVerion) {
    //    task.push(function (tempCallback) {
    //        var tempTime = Date.now();
    //        globals.debugLog("扫描版本控制文件");
    //
    //        genVer.generate(projectPath, path.join(releasePath, "html5Base"), projectProperties.getVersionCode("html5"));
    //
    //        globals.debugLog("生成版本控制文件耗时：%d秒", (Date.now() - tempTime) / 1000);
    //        tempCallback();
    //    });
    //}


    if (true) {//拷贝其他文件
        task.push(function (tempCallback) {
            //拷贝
            file.copy(path.join(projectPath, "launcher"), path.join(releaseOutputPath, "launcher"));

            if (noVerion) {
                file.save(path.join(releaseOutputPath, "version.manifest"), "{}");
            }
            else {
                file.copy(path.join(releasePath, "html5Base", "version.manifest"), path.join(releaseOutputPath, "version.manifest"));
            }

            file.copy(path.join(projectPath, "launcher", "release.html"), path.join(releaseOutputPath, "index.html"));

            file.remove(path.join(releaseOutputPath, "launcher", "native_loader.js"));
            file.remove(path.join(releaseOutputPath, "launcher", "runtime_loader.js"));
            file.remove(path.join(releaseOutputPath, "launcher", "native_require.js"));
            file.remove(path.join(releaseOutputPath, "launcher", "index.html"));
            file.remove(path.join(releaseOutputPath, "launcher", "release.html"));

            tempCallback();
        });
    }

    //拷贝其他资源文件
    if (true) {//拷贝
        task.push(function (tempCallback) {
            file.copy(path.join(projectPath, "resource"), path.join(releaseOutputPath, "resource"));

            if (noVerion) {
                file.save(path.join(releaseOutputPath, "base.manifest"), "{}");
            }
            else {
                file.copy(path.join(releasePath, "html5Base", "base.manifest"), path.join(releaseOutputPath, "base.manifest"));
            }


            compressJson(releaseOutputPath);

            tempCallback();
        });
    }

    async.series(task, function (err) {
        if (!err) {
            console.log("发布完成共计耗时：%d秒", (Date.now() - timeMinSec) / 1000);
        }
        else {
            globals.exit(err);
        }
    });
}


function help_title() {
    return "发布项目，使用GoogleClosureCompiler压缩代码\n";
}


function help_example() {
    var result = "\n";
    result += "    egret publish [project_name] [-compile] [--password your_passsword] [--runtime html5|native] [-log]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    --runtime    设置发布方式为 html5 或者是 native方式，默认值为html5\n";
    result += "    -compile         设置发布后js文件是否需要压缩\n";
    result += "    --password   设置发布zip文件的解压密码";
    result += "    -log   显示执行过程";
    return result;
}

function getOptsValue(opts, typeArr) {
    for (var key in typeArr) {
        var type = typeArr[key];

        if (opts[type] && opts[type][0]) {
            return opts[type][0];
        }
    }
    return "";
}


function getPassword(opts) {
    return getOptsValue(opts, ["--password"]);
}


function compressJson(releasePath) {
    //扫描json数据
    if (param.getArgv()["opts"]["-compressjson"]) {
        var compress = require("../tools/compress_json.js");
        compress.run(releasePath, []);
    }
}


exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
