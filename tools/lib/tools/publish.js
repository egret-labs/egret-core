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

var projectConfig = require("../core/projectConfig.js");

function run(dir, args, opts) {
    if (opts["-testJava"]) {
        closureCompiler.checkUserJava();
        return;
    }

    var currDir = globals.joinEgretDir(dir, args[0]);
    currDir = getCurrentDir(currDir);

    var password = getPassword(opts);

    var needCompile = opts["-compile"] ? true : false;

    projectConfig.init(currDir);

    var time = Math.round(Date.now() / 1000);
    publishPlatform(currDir, "android", time, password, needCompile);
    publishPlatform(currDir, "ios", time, password, needCompile);
    publisHtml5(currDir, password, needCompile);
}

function publishPlatform(currDir, platform, time, password, needCompiler) {
    if (projectConfig.getSaveUrl(platform) == null) {//没有native项目
        return;
    }

    var sourcePath = path.join(projectConfig.getSaveUrl(platform));

    if (file.exists(path.join(sourcePath, "launcher", "native_require.js"))) {
        var native_require = file.read(path.join(sourcePath, "launcher", "native_require.js"));
        native_require = native_require.replace(/var needCompile =.*/, "var needCompile = " + (needCompiler ? "true" : "false") + ";");
        file.save(path.join(sourcePath, "launcher", "native_require.js"), native_require);
    }

    genVer.run(sourcePath, [sourcePath]);

    var output = path.join(currDir, "release", platform, time + "");

    //筛选文件
    screening.run(path.join(sourcePath, "resource"), [], {"--platform":[platform]});
    //版本控制文件
    copyBaseManifest(platform, sourcePath);
    genVer.run("", [sourcePath]);

    //google压缩
    if (needCompiler) {
        var file_list = filelist.getAllFileList(sourcePath);
        closureCompiler.compilerSingleFile(sourcePath, file_list["native"], path.join(sourcePath, "launcher", "game-min-native.js"), function compilerComplete() {
            createZips();
        });
    }
    else {
        createZips();
    }

    //生成zip包
    function createZips() {
        createZipFile(sourcePath, platform, password, needCompiler, function() {
            copyPlatform(platform, time);
        });
    }

    //拷贝到各个项目
    function copyPlatform(platform, time) {
        //apk
        var projectUrl = projectConfig.getProjectAssetsUrl(platform);
        if (projectUrl != null) {
            file.copy(path.join(sourcePath, "game_code_" + platform + ".zip"), path.join(output, "game_code_" + time +".zip"));
            file.copy(path.join(sourcePath, "resource"), path.join(output, "resource"));
            file.copy(path.join(sourcePath, "base.manifest"), path.join(output, "base.manifest"));

            file.remove(projectUrl);
            file.copy(output, projectUrl);

            end();
        }
    }

    function copyBaseManifest(platform, url) {
        var useList = screening.getUseFilelist(path.join(sourcePath, "baseResource.json"), platform);
        var baseManifest = JSON.parse(file.read(path.join(sourcePath, "base.manifest")));
//        for (var key in baseManifest) {
//            var i = 0;
//            for (; i < useList.length; i++) {
//                if (key.indexOf(useList[i]) >= 0) {
//                    break;
//                }
//            }
//            if (i == useList.length) {
//                delete baseManifest[key];
//            }
//        }
        file.save(path.join(url, "base.manifest"), JSON.stringify(baseManifest));

    }

    function end() {
        file.remove(path.join(sourcePath, "launcher", "game-min-native.js"));
        file.remove(path.join(sourcePath, "game_code_" + platform + ".zip"));
    }
}

function publisHtml5(currDir, password, needCompiler) {
    var sourcePath = currDir;

    //拷贝代码、资源文件到整体base目录
    var releaseDir = path.join(currDir, "release", "html5Base");

    var launcherDir = path.join(releaseDir, "launcher");
    var resourceDir = path.join(releaseDir, "resource");
    var libs = path.join(releaseDir, "libs");
    var bindebug = path.join(releaseDir, "bin-debug");

    //删除原来
    file.remove(launcherDir);
    file.copy(path.join(sourcePath, "launcher"), launcherDir);
    file.remove(resourceDir);
    file.copy(path.join(sourcePath, "resource"), resourceDir);
    file.remove(libs);
    file.copy(path.join(sourcePath, "libs"), libs);
    file.remove(bindebug);
    file.copy(path.join(sourcePath, "bin-debug"), bindebug);

    //google压缩
    var complieCount = 0;
    var file_list = filelist.getAllFileList(currDir);
    closureCompiler.compilerSingleFile(currDir, file_list["html5"], path.join(launcherDir, "game-min.js"), compilerComplete);
    function compilerComplete() {
        complieCount++;
        if (complieCount == 1) {//全部压缩完毕
            createVersion();

            copyPlatforms();
        }
    }

    //生成版本控制
    function createVersion() {
        genVer.run(currDir, [releaseDir]);
    }

    //拷贝到各个项目
    function copyPlatforms() {
        //html5
        var url = path.join(currDir, "release", "html5");
        file.remove(url);

        file.copy(path.join(releaseDir, "launcher"), path.join(url, "launcher"));
        file.copy(path.join(url, "launcher", "release.html"), path.join(url, "index.html"));
        file.remove(path.join(url, "launcher", "game-min-native.js"));
        file.remove(path.join(url, "launcher", "native_loader.js"));
        file.remove(path.join(url, "launcher", "index.html"));
        file.remove(path.join(url, "launcher", "release.html"));

        file.copy(path.join(releaseDir, "resource"), path.join(url, "resource"));
        file.copy(path.join(releaseDir, "base.manifest"), path.join(url, "base.manifest"));
        file.copy(path.join(releaseDir, "version.manifest"), path.join(url, "version.manifest"));

        end();
    }

    function end() {
        file.remove(releaseDir);
    }
}


function createZipFile(releaseDir, platform, password, compiler, createZipComplete) {
    //拷贝需要zip的文件
    file.copy(path.join(releaseDir, "launcher", "native_loader.js"), path.join(releaseDir, "ziptemp", "launcher", "native_loader.js"));
    file.copy(path.join(releaseDir, "launcher", "runtime_loader.js"), path.join(releaseDir, "ziptemp", "launcher", "runtime_loader.js"));
    file.copy(path.join(releaseDir, "launcher", "native_require.js"), path.join(releaseDir, "ziptemp", "launcher", "native_require.js"));
    file.copy(path.join(releaseDir, "version.manifest"), path.join(releaseDir, "ziptemp", "version.manifest"));


    if (!compiler) {//不需要google压缩
        file.copy(path.join(releaseDir, "bin-debug"), path.join(releaseDir, "ziptemp", "bin-debug"));
        file.copy(path.join(releaseDir, "libs"), path.join(releaseDir, "ziptemp", "libs"));

        file.remove(path.join(releaseDir, "ziptemp", "launcher", "game-min-native.js"));
    }
    else {
        file.copy(path.join(releaseDir, "launcher", "game-min-native.js"), path.join(releaseDir, "ziptemp", "launcher", "game-min-native.js"));
    }

    var zipFile = path.join(releaseDir, "game_code_" + platform + ".zip");

    zip.createZipFile(path.join(releaseDir, 'ziptemp'), zipFile, function () {
        file.remove(path.join(releaseDir, "ziptemp"));
        createZipComplete();
    }, password);
}

function help_title() {
    return "发布项目，使用GoogleClosureCompiler压缩代码\n";
}


function help_example() {
    var result = "\n";
    result += "    egret publish [project_name] -compile [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    --runtime    设置发布方式为 html5 或者是 native方式，默认值为html5\n";
    result += "    -compile         设置发布后js文件是否需要压缩\n";
    result += "    --password   设置发布zip文件的解压密码";
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


function compressJson(currDir,opts){
    //扫描json数据
    if (opts["-compressjson"]) {
        var compress = require(path.join("..", "tools", "compress_json.js"));
        compress.run(path.join(currDir, "release"), []);
    }
}


function getCurrentDir(projectName){
    var projectConfig = require("../core/projectConfig.js");
    projectConfig.init(projectName);
    var outputDir = projectConfig.getOutputDir()
    if (outputDir){
        return outputDir;
    }
    else{
        return projectName;
    }
}


exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
