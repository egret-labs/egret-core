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

function run(dir, args, opts) {
    if (opts["-testJava"]) {
        closureCompiler.checkUserJava();
        return;
    }

    var currDir = globals.joinEgretDir(dir, args[0]);
    currDir = getCurrentDir(currDir);

    var password = getPassword(opts);

    publishNative(currDir, password, opts["-compiler"]);
    publisHtml5(currDir, password, opts["-compiler"]);
}

function publishNative(currDir, password, needCompiler) {
    var sourcePath = currDir;
    var nativePath = currDir;
    var properties = JSON.parse(file.read(path.join(currDir, "egretProperties.json")));
    if (properties && properties["native"] && properties["native"]["support_path"] && properties["native"]["support_path"].length > 0) {
        sourcePath = properties["native"]["support_path"][0];
        nativePath = properties["native"]["support_path"][0];
    }

    //拷贝代码、资源文件到整体base目录
    var releaseDir = path.join(currDir, "release", "base");

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
    var file_list = filelist.getAllFileList(nativePath);
    closureCompiler.compilerSingleFile(nativePath, file_list["native"], path.join(launcherDir, "game-min-native.js"), compilerComplete);
    function compilerComplete() {
        complieCount++;
        if (complieCount == 1) {//全部压缩完毕
            createVersion();

            createZips();
        }
    }

    //生成版本控制
    function createVersion() {
        genVer.run(nativePath, [releaseDir]);
    }

    //筛选

    //生成zip包
    function createZips() {
        var count = 0;
        createZipFile(releaseDir, "android", password, needCompiler, createZipComplete);
        createZipFile(releaseDir, "ios", password, needCompiler, createZipComplete);

        function createZipComplete() {
            count++;
            if (count == 2) {//全部压缩完毕
                copyPlatforms();
            }
        }

    }

    function copyBaseManifest(platform, url) {
        var useList = screening.getUseFilelist(path.join(releaseDir, "baseResource.json"), platform);
        var baseManifest = JSON.parse(file.read(path.join(releaseDir, "base.manifest")));
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

    //拷贝到各个项目
    function copyPlatforms() {
        //apk
        var url = path.join(currDir, "release", "android");
        file.remove(url);
        file.copy(path.join(releaseDir, "game_code_android.zip"), path.join(url, "game_code.zip"));
        file.copy(path.join(releaseDir, "resource"), path.join(url, "resource"));
        screening.run(path.join(url, "resource"), [], {"--platform":["android"]});

        copyBaseManifest("android", url);
        genVer.run("", [url]);

        //ios
        var url = path.join(currDir, "release", "ios");
        file.remove(url);
        file.copy(path.join(releaseDir, "game_code_ios.zip"), path.join(url, "game_code.zip"));
        file.copy(path.join(releaseDir, "resource"), path.join(url, "resource"));
        screening.run(path.join(url, "resource"), [], {"--platform":["ios"]});

        copyBaseManifest("ios", url);
        genVer.run("", [url]);
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
    }
}


function createZipFile(releaseDir, platform, password, compiler, createZipComplete) {
    //拷贝需要zip的文件
    file.copy(path.join(releaseDir, "launcher", "native_loader.js"), path.join(releaseDir, "ziptemp", "launcher", "native_loader.js"));
    file.copy(path.join(releaseDir, "launcher", "runtime_loader.js"), path.join(releaseDir, "ziptemp", "launcher", "runtime_loader.js"));
    file.copy(path.join(releaseDir, "launcher", "native_require.js"), path.join(releaseDir, "ziptemp", "launcher", "native_require.js"));
    file.copy(path.join(releaseDir, "launcher", "game-min-native.js"), path.join(releaseDir, "ziptemp", "launcher", "game-min-native.js"));


    if (!compiler) {//不需要google压缩
        file.copy(path.join(releaseDir, "bin-debug"), path.join(releaseDir, "ziptemp", "bin-debug"));
        file.copy(path.join(releaseDir, "libs"), path.join(releaseDir, "ziptemp", "libs"));

        file.remove(path.join(releaseDir, "ziptemp", "launcher", "game-min-native.js"));
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
    result += "    egret publish [project_name] --version [version] [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    --version    设置发布之后的版本号，可以不设置\n";
    result += "    --runtime    设置发布方式为 html5 或者是 native方式，默认值为html5\n";
    result += "    -zip         设置发布后生成launcher文件夹的zip文件\n";
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
