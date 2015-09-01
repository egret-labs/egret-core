/**
 * Created by huanghaiying on 15/1/3.
 */

var path = require("../core/path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var code_util = require("../core/code_util.js");

var exmlc = require("../exml/exmlc.js");

var projectProperties;
var projectPath;
var moduleReferenceList;

function build(properties, callback, keepGeneratedTypescript) {
    projectProperties = properties;
    projectPath = projectProperties.getProjectPath();

    var time = Date.now();


    //替换入口类
    //var document_class = globals.getDocumentClass(projectPath);
    //if (document_class) {
    //    replaceDocumentClass("index.html", document_class, projectPath);
    //    replaceDocumentClass("release.html", document_class, projectPath);
    //    replaceDocumentClass("native_require.js", document_class, projectPath);
    //}

    //输出路径
    var output = path.join(projectPath, "bin-debug");

    var srcPath = path.join(projectPath, "src/");


    //获取需要的.d.ts文件
    var libs = projectProperties.getModulesDts().concat();

    //加入gui皮肤的.d.ts相关编译代码
    var dts = generateExmlDTS(srcPath);
    if (dts != "") {//有gui皮肤
        libs.push(path.join(projectPath, "libs", "exml.d.ts"));
    }

    var compileConfig = {
        keepGeneratedTypescript: keepGeneratedTypescript,
        output: output
    };

    globals.debugLog(1106);
    var saoTime = Date.now();
    var sourceList;

    var noscan = param.getArgv()["opts"]["-noscan"] != null;
    if (noscan) {
        var gameListFile = file.read(path.join(projectPath, "bin-debug/src/manifest.json"));
        sourceList = JSON.parse(gameListFile);
        sourceList = sourceList.map(function(item) {
            return path.join(projectPath, "src", item);
        });

        moduleReferenceList = null;
    }
    else {
        var generateList = require("../core/gameFileList");

        sourceList = generateList.generateGameFileList(projectPath, "src", projectProperties);
        moduleReferenceList = generateList.getModuleReferenceList();
    }

    //重新对模块文件进行处理
    var moduleList = projectProperties.getAllModules();
    for (var i = 0; i < moduleList.length; i++) {
        var moduleName = moduleList[i]["name"];
        var moduleConfig = projectProperties.getModuleConfig(moduleName);
        if (moduleConfig["decouple"] != null && (moduleConfig["decouple"] == "true" || moduleConfig["decouple"] == true)) {
            //解耦的需要重新生成 .d.json文件
            var detailCfg = properties.getModuleDetailConfig(moduleName);

            var array = [];
            var list = detailCfg["file_list"].filter(function (item) {
                var item = path.join(detailCfg.prefix, detailCfg.source, item);
                array.push(item);

                if (item.indexOf(".js") >= 0) {
                    return true;
                }

                if (!moduleReferenceList || moduleReferenceList.indexOf(item) >= 0) {
                    return true;
                }

                return false;
            });

            var output = moduleConfig.output || moduleConfig.name;
            file.save(path.join(projectProperties.getProjectPath(), "libs", output, moduleName + ".d.json"), JSON.stringify({"file_list": list}, null, "\t"));
        }
    }


    globals.debugLog(1107, (Date.now() - saoTime) / 1000);

    async.series([function (tempCallback) {
        compile(tempCallback,
            path.join(projectPath),
            sourceList.concat(libs),
            compileConfig
        );

    }, function (tempCallback) {
        globals.log2(1108, (Date.now() - time) / 1000);
        tempCallback();
    }
    ], callback);


}

function generateExmlDTS(srcPath) {

    var sourceList = file.search(srcPath, "exml");

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

    //保存exml
    var exmlDtsPath = path.join(projectPath, "libs", "exml.d.ts");
    if (dts != "") {
        file.save(exmlDtsPath, dts);
    }
    else {
        file.remove(exmlDtsPath);
    }

    return dts;
}

//替换入口类
function replaceDocumentClass(key, document_class, projectPath) {
    var filePath = path.join(projectPath, "launcher", key);
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


/**
 * 编译指定的代码
 *
 * @param callback 回调函数
 * @param srcPath 源文件所在的文件夹
 * @param output 输出地址
 * @param sourceList 要编译的文件列表包含ts和exml
 * @param compileConfig
 *  @sub-param keepGeneratedTypescript 是否保留exml生成的ts文件
 *  @sub-param outputDir 输出路径
 */
function compile(callback, projectDir, sourceList, projectConfig) {
    projectConfig = projectConfig ? projectConfig : {};
    var keepGeneratedTypescript = projectConfig.keepGeneratedTypescript;

    var srcPath = path.join(projectDir, "src");
    var output = path.join(projectDir, "bin-debug/src");

    var exmlList = [];
    var tsList = [];
    var length = sourceList.length;
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p) || p.indexOf("exml.d.ts") != -1) {
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if (ext == "ts") {
            tsList.push(p);
        }
        else if (ext == "exml") {
            exmlList.push(p);
            tsList.push(p.substring(0, p.length - 4) + "ts");
        }
    }

    globals.addCallBackWhenExit(cleanTempFile);

    async.waterfall([
        //cp所有非ts/exml文件
        function (callback) {
            var all_file = file.searchByFunction(srcPath, filter);
            all_file.forEach(function (item) {
                var itemName = item.substring(srcPath.length);
                file.copy(item, path.join(output, itemName));
            });
            callback(null);

            function filter(path) {
                var index = path.lastIndexOf(".");
                if (index == -1) {
                    return true;
                }
                var ext = path.substring(index).toLowerCase();
                return ext != ".ts" && ext != ".exml";
            }
        },
        //编译exml文件
        function (callback) {
            exmlList.forEach(function (item) {
                exmlc.compile(item, srcPath);
            });

            callback();
        },
        //编译ts文件
        function (callback) {
            tsList = tsList.map(function (item) {
                return globals.addQuotes(item);
            });

            var sourcemap = param.getArgv()["opts"]["-sourcemap"];
            sourcemap = sourcemap ? "--sourcemap " : "";

            globals.debugLog(1109);
            var tempTime = Date.now();
            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + globals.addQuotes(output);
            var typeScriptCompiler = require("../tools/egret_compiler.js");
            typeScriptCompiler.compile(onCompileComplete, cmd, projectProperties.getTscLibUrl());
            globals.debugLog(1110, (Date.now() - tempTime) / 1000);

            function onCompileComplete(code) {
                if (code == 0) {
                    cleanTempFile();
                    callback();
                }
                else {
                    callback(1303);
                }
            }
        }
    ], function (err) {
        callback(err);
    });

    function cleanTempFile() {
        file.remove("tsc_config_temp.txt");
        file.remove("game.d.ts");
        if (!keepGeneratedTypescript && exmlList) {
            exmlList.forEach(function (p) {
                var tsPath = p.substring(0, p.length - 4) + "ts";
                file.remove(tsPath);
            });
        }
    }
}

exports.getModuleReferenceList = function() {
    return moduleReferenceList;
};
exports.build = build;