/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js");
var file = require("../core/file.js");
var code_util = require("../core/code_util.js");
var projectConfig = require("../core/projectConfig.js");
var global = require("../core/globals");


function run(dir, args, opts) {
    var currDir = globals.joinEgretDir(dir, args[0]);
    globals.checkVersion(currDir);

    projectConfig.init(currDir);
    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
    if (runtime == "native" && !projectConfig.hasNativeUrl()) {
        global.exit(8004);
        return null;
    }

    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    if (runtime == "native") {
        buildPlatform("android", currDir, needCompileEngine, keepGeneratedTypescript);
        buildPlatform("ios", currDir, needCompileEngine, keepGeneratedTypescript);
    }
    else {
        buildPlatform("html5", currDir, needCompileEngine, keepGeneratedTypescript);
    }
}

function buildPlatform(platform, currDir, needCompileEngine, keepGeneratedTypescript) {
    var task = [];
    var runtime = platform != "html5" ? "native" : "html5";
    if (runtime == "native") {
        var projectPath = projectConfig.getProjectUrl(platform);
        if (projectPath == null) {
            return;
        }

        var tempPath = path.join(projectPath, "temp");
        if (!file.exists(path.join(tempPath, "libs"))) {
            needCompileEngine = true;
        }
    }

    copyProject(currDir, platform);

    if (needCompileEngine) {
        task.push(function (callback) {
            compiler.compileModules(callback, currDir, runtime);
        });
    }
    task.push(
        function (callback) {
            buildProject(callback, currDir, keepGeneratedTypescript, runtime);
        }
    );

    if (runtime == "native") {
        task.push(
            function (callback) {
                var output = path.join(projectConfig.getProjectUrl(platform), "__temp");
                if (!needCompileEngine) {
                    file.remove(path.join(output, "libs"));
                }

                if (file.exists(path.join(output, "../temp", "base.manifest"))) {
                    file.copy(path.join(output, "../temp", "base.manifest"), path.join(output, "base.manifest"));
                }
                if (file.exists(path.join(output, "../temp", "baseResource.json"))) {
                    file.copy(path.join(output, "../temp", "baseResource.json"), path.join(output, "baseResource.json"));
                }
                file.remove(path.join(output, "tsc_config_temp.txt"));

                var genVer = require("../tools/generate_version");
                genVer.run("", [output]);

                file.remove(path.join(output, "../temp"));
                file.copy(output, path.join(output, "../temp"));

                file.remove(projectConfig.getProjectAssetsUrl(platform));
                file.copy(path.join(output, "../temp"), projectConfig.getProjectAssetsUrl(platform));

                file.remove(output);

                if (file.exists(projectConfig.getProjectAssetsUrl(platform), "launcher", "native_require.js")) {
                    var native_require = file.read(path.join(projectConfig.getProjectAssetsUrl(platform), "launcher", "native_require.js"));
                    native_require = native_require.replace(/var needCompile =.*/, "var needCompile = false;");
                    file.save(path.join(projectConfig.getProjectAssetsUrl(platform), "launcher", "native_require.js"), native_require);
                }


                callback();
            }
        );
    }


    async.series(task, function (err) {
        if (!err) {
            globals.log("构建成功");
//            process.exit(0);
        }
        else {
            globals.exit(err);
        }
    })
}



/**
 * 构建模式为native时候，拷贝一份到native目录
 */
function copyProject(currDir, platform) {
    var output = projectConfig.getProjectUrl(platform);
    if (output) {
        output = path.join(output, "__temp");
        var ignorePathList = projectConfig.getIgnorePath();
        var copyFilePathList = file.getDirectoryListing(currDir);
        var isIgnore = false;
        copyFilePathList.forEach(function(copyFilePath) {
            isIgnore = false;
            copyFilePath = path.basename(copyFilePath);
            ignorePathList.forEach(function(ignorePath) {//检测忽略列表
                if(copyFilePath.indexOf(ignorePath) != -1) {
                    isIgnore = true;
                }
            });
            if(!isIgnore) {//不在忽略列表的路径，拷贝过去
                file.copy(path.join(currDir, copyFilePath),path.join(output, copyFilePath));
            }
        });
    }
}

function buildProject(callback, currDir, keepGeneratedTypescript, runtime) {
    var document_class = globals.getDocumentClass(currDir);
    if (document_class) {
        replaceDocumentClass("index.html", document_class, currDir);
        replaceDocumentClass("release.html", document_class, currDir);
        replaceDocumentClass("native_require.js", document_class, currDir);
    }

    projectConfig.init(currDir);
    var output = projectConfig.getOutputDir();

    var libsPath = path.join(currDir, "libs/");
    var srcPath = path.join(currDir, "src/");
    var exmlList = file.search(srcPath, "exml");
    var dts = generateExmlDTS(exmlList, srcPath);
    var exmlDtsPath = path.join(currDir, "libs", "exml.d.ts");
    if (dts) {
        file.save(exmlDtsPath, dts);
    }
    else {
        file.remove(exmlDtsPath);
    }
    var libs = file.search(libsPath, "d.ts");

    var compileConfig = {
        keepGeneratedTypescript: keepGeneratedTypescript,
        output: output
    }

    var sourceList = compiler.generateGameFileList(currDir, runtime);

    async.series([function (callback) {
        compiler.compile(callback,
            path.join(currDir),
            sourceList.concat(libs),
            compileConfig
        );
    }
    ], callback);


}

function generateExmlDTS(sourceList, srcPath) {
    srcPath = srcPath.split("\\").join("/");
    if (srcPath.charAt(srcPath.length - 1) != "/") {
        srcPath += "/";
    }
    var length = sourceList.length;
    var dts = "";
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p)) {
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if (ext == "exml") {
            var className = p.substring(srcPath.length, p.length - 5);
            className = className.split("/").join(".");
            var index = className.lastIndexOf(".");
            if (index == -1) {
                dts += "declare class " + className + " extends egret.gui.Skin{\n}\n";
            }
            else {
                var moduleName = className.substring(0, index);
                className = className.substring(index + 1);
                dts += "declare module " + moduleName + "{\n\tclass " + className + " extends egret.gui.Skin{\n\t}\n}\n";
            }
        }
    }
    return dts;
}

function replaceDocumentClass(key, document_class, currDir) {
    var filePath = path.join(currDir, "launcher", key);
    var indexHtml = file.read(filePath);
    if (!indexHtml) {
//        globals.exit(1305, key);
        return;
    }
    var html = "";
    var found = false;
    while (indexHtml.length > 0) {
        var index = code_util.getFirstVariableIndex("document_class", indexHtml);
        if (index == -1) {
            html += indexHtml;
            break;
        }
        html += indexHtml.substring(0, index + 14);
        indexHtml = indexHtml.substring(index + 14).trim();
        if (indexHtml.charAt(0) == "=") {
            html += " = ";
            indexHtml = indexHtml.substring(1).trim();
            var quote = indexHtml.charAt(0);
            if (quote == "\"" || quote == "'") {
                html += quote;
                indexHtml = indexHtml.substring(1);
                index = indexHtml.indexOf(quote);
                if (index != -1) {
                    html += document_class;
                    indexHtml = indexHtml.substring(index);
                    found = true;
                }
            }
        }
    }
    if (!found) {
        globals.exit(1306, key);
    }
    file.save(filePath, html);
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
exports.buildProject = buildProject;