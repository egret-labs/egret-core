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
var create_app = require("./create_app.js");


function run(dir, args, opts) {


    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    var currDir = globals.joinEgretDir(dir, args[0]);
    globals.checkVersion(currDir);
    var task = [];

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);

    if (needCompileEngine) {


        task.push(function (callback) {
            compiler.compileModules(callback, currDir, runtime);
        });
    }
    task.push(
        function (callback) {
            buildProject(callback, currDir, keepGeneratedTypescript, runtime);
        },

        function (callback) {
            var create_app = require("./create_app.js");
            create_app.build_copy_from(currDir);
            callback();
        }
    )


    async.series(task, function (err) {
        if (!err) {
            globals.log("构建成功");
            process.exit(0);
        }
        else {
            globals.exit(err);
        }
    })
}

function buildProject(callback, currDir, keepGeneratedTypescript, runtime) {
    var document_class = globals.getDocumentClass(currDir);
    if (document_class) {
        replaceDocumentClass("index.html", document_class, currDir);
        replaceDocumentClass("release.html", document_class, currDir);
        replaceDocumentClass("native_loader.js", document_class, currDir);
    }

    var projectConfig = require("../core/projectConfig.js");
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

    async.series([
        function (callback) {
            compiler.compile(callback,
                path.join(currDir),
                sourceList.concat(libs),
                compileConfig
            );
        },

        function (callback) {
            if (output){
                var resource_dir = path.join(currDir,"resource");
                var output_dir = path.join(output,"resource");
                file.copy(resource_dir,output_dir);

                var resource_dir = path.join(currDir,"launcher");
                var output_dir = path.join(output,"launcher");
                file.copy(resource_dir,output_dir);
            }
            callback();
        }


    ], callback)


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
        globals.exit(1305, key);
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