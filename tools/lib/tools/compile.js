/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var async = require('../core/async');
var cp_exec = require('child_process').exec;
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var exmlc = require("../exml/exmlc.js");
var CodeUtil = require("../core/code_util.js");
var create_manifest = require("./create_manifest.js");
var crc32 = require("../core/crc32.js");


function run(currentDir, args, opts) {
    var source = path.resolve(param.getEgretPath(), "");
    var source = opts["--source"];
    var output = opts["--output"];
    if (!source || !output) {
        globals.exit(1302);
    }
    source = source[0];
    output = output[0];
    if (!source || !output) {
        globals.exit(1302);
    }
    compile(function () {
        console.log("编译成功");
    }, source, output)
}

/**
 * 编译指定的代码
 *
 * @param callback 回调函数
 * @param srcPath 源文件所在的文件夹
 * @param output 输出地址
 * @param sourceList 要编译的文件列表包含ts和exml
 * @param keepGeneratedTypescript 是否保留exml生成的ts文件
 */
function compile(callback, srcPath, output, sourceList, keepGeneratedTypescript) {

    var exmlList = [];
    var tsList = [];
    var length = sourceList.length;
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p)) {
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

    if (isQuickMode()) {
        tsList = parseFromCrc32(tsList);
    }

    globals.addCallBackWhenExit(cleanTempFile);

    async.waterfall([

        //cp所有非ts/exml文件
        function (callback) {
            var all_file = file.searchByFunction(srcPath, filter);
            all_file.forEach(function (item) {
                var itemName = item.substring(srcPath.length);
                file.copy(item, path.join(output, itemName));
            })
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
                return "\"" + item + "\"";
            });

            var sourcemap = param.getArgv()["opts"]["-sourcemap"];
            sourcemap = sourcemap ? "--sourcemap " : "";

            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            file.save("tsc_config_temp.txt", cmd);
            typeScriptCompiler(function (code) {
                cleanTempFile();
                if (code == 0) {
                    callback(null, srcPath);
                }
                else {
                    callback(1303);
                }
            });
        }



    ], function (err) {
        callback(err);
    })

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

function parseFromCrc32(tsList) {
    var result = [];
    var argv = param.getArgv();
    var currDir = globals.joinEgretDir(argv.currDir, argv.args[0]);
    var crc32FilePath = path.join(currDir, "crc32.temp");
    var crc32Txt = "";
    var crc32Map;
    if (file.exists(crc32FilePath)) {
        crc32Txt = file.read(crc32FilePath);
        crc32Map = JSON.parse(crc32Txt);
    }
    else {
        crc32Map = {};
    }
    var l = tsList.length;
    for (var j = 0; j < l; j++) {
        var tsFilePath = tsList[j];
        if(tsFilePath.indexOf(".d.ts") != -1) {//.d.ts一定要传给编译器
            result.push(tsFilePath);
            continue;
        }
        var tsFileTxt = file.read(tsFilePath);
        var crc32Txt = crc32.direct(tsFileTxt);
        if (crc32Map[tsFilePath] && crc32Map[tsFilePath] == crc32Txt) {//有过改变的文件需要编译
            continue;
        }
        crc32Map[tsFilePath] = crc32Txt;
        result.push(tsFilePath);
    }
    file.save(crc32FilePath, JSON.stringify(crc32Map));
    var projectDTS = create_manifest.createProjectDTS(result, path.join(currDir, "src"));
    file.save("game.d.ts", projectDTS);
    result.push(path.join(argv.currDir, "game.d.ts"));
    return result;
}

function typeScriptCompiler(quitFunc) {
    var TypeScript = require('../core/typescript/tsc.js');
    TypeScript.IO.arguments = ["@tsc_config_temp.txt"];
    TypeScript.IO.quit = quitFunc;

    if (isQuickMode()) {//快速构建，去掉类型检查阶段
        TypeScript.PullTypeResolver.typeCheck = function (compilationSettings, semanticInfoChain, document) {
            var sourceUnit = document.sourceUnit();

            var resolver = semanticInfoChain.getResolver();
            var context = new TypeScript.PullTypeResolutionContext(resolver, true, sourceUnit.fileName());

            if (resolver.canTypeCheckAST(sourceUnit, context)) {
                resolver.resolveAST(sourceUnit, false, context);
            }
        };
        TypeScript.IO.stderr = {
            Write: function (str) {
                writeError(str);
            },
            WriteLine: function (str) {
                writeError(str + '\n');
            },
            Close: function () {
            }
        }
    }

    var batch = new TypeScript.BatchCompiler(TypeScript.IO);
    batch.batchCompile();

    function writeError(error) {//只输出严重级bug
        if(error.indexOf("error TS1") != -1 || error.indexOf("error TS5") != -1) {
            process.stderr.write(error);
        }
    }
}

function isQuickMode() {
    var opts = param.getArgv().opts;
    if ((opts["-quick"] || opts["-q"]) && !opts["-e"]) {
        return true;
    }
    return false;
}

function exportHeader(callback, projectPath, sourceList) {
    var list = [];
    var length = sourceList.length;
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p)) {
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if (ext == "ts") {
            list.push(p);
        }
        else if (ext == "exml") {
            list.push(p.substring(0, p.length - 4) + "ts");
        }
    }
    list = list.map(function (item) {
        return "\"" + item + "\"";
    })
    var output = path.join(projectPath, "libs/egret.d.ts");
    var source = list.join(" ");
    var cmd = source + " -t ES5 -d --out " + "\"" + output + "\"";
    file.save("tsc_config_temp.txt", cmd);
    typeScriptCompiler(function (code) {
        if (code == 0) {
            var egretDTS = file.read(output);
            var lines = egretDTS.split("\n");
            var length = lines.length;
            for (var i = 0; i < length; i++) {
                var line = lines[i];
                if (line.indexOf("/// <reference path") != -1) {
                    lines.splice(i, 1);
                    i--;
                }
                else {
                    break;
                }
            }
            egretDTS = lines.join("\n");
            file.save(output, egretDTS);
            globals.log(".d.ts文件导出成功");
            if (callback) {
                callback();
            }
        }
        else {
            callback(1303)
        }
    });
}

function generateEgretFileList(runtime, projectPath) {
    var coreList = globals.require("tools/lib/manifest/core.json");
    var runtimeList = globals.require("tools/lib/manifest/" + runtime + ".json");
    var egretPath = param.getEgretPath();
    var manifest = coreList.concat(runtimeList);
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        manifest[i] = file.joinPath(egretPath, "src", manifest[i]);
    }
    var srcPath = path.join(param.getEgretPath(), "src/");
    srcPath = srcPath.split("\\").join("/");
    var egretFileListText = createFileList(manifest, srcPath);
    egretFileListText = "var egret_file_list = " + egretFileListText + ";";
    file.save(file.joinPath(projectPath, "bin-debug/lib/egret_file_list.js"), egretFileListText);
    return manifest;
}

function generateGameFileList(projectPath) {
    var manifestPath = path.join(projectPath, "manifest.json");
    var srcPath = path.join(projectPath, "src/");
    var manifest;
    if (file.exists(manifestPath)) {
        manifest = getManifestJson(manifestPath, srcPath);
    }
    else {
        manifest = create_manifest.create(srcPath);
    }
    var fileListText = createFileList(manifest, srcPath);
    fileListText = "var game_file_list = " + fileListText + ";";
    file.save(path.join(projectPath, "bin-debug/src/game_file_list.js"), fileListText);
    return manifest;
}

function getManifestJson(file_list, srcPath) {
    if (!file.exists(file_list)) {
        return [];
    }
    var content = file.read(file_list);
    try {
        var manifest = JSON.parse(content);
    }
    catch (e) {
        globals.exit(1304, file_list);
    }
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        manifest[i] = file.joinPath(srcPath, manifest[i]);
    }
    return manifest;
}

function createFileList(manifest, srcPath) {

    var gameList = [];
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        var filePath = manifest[i];
        if (filePath.indexOf(".d.ts") != -1) {
            continue;
        }
        var fileName = file.getFileName(filePath);
        if (fileName.charAt(0) == "I") {
            var str = fileName.charAt(1);
            if (str >= "A" && str <= "Z" && isInterface(filePath)) {
                continue;
            }
        }
        gameList.push(filePath);
    }

    length = gameList.length;
    for (i = 0; i < length; i++) {
        filePath = gameList[i];
        filePath = filePath.substring(srcPath.length);
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "exml") {
            filePath = filePath.substring(0, filePath.length - 4) + "js";
        }
        else if (ext == "ts") {
            filePath = filePath.substring(0, filePath.length - 2) + "js";
        }
        gameList[i] = "    \"" + filePath + "\"";
    }
    var gameListText = "[\n" + gameList.join(",\n") + "\n]";
    return gameListText;
}

/**
 * 这个文件是否只含有接口
 */
function isInterface(path) {
    var text = file.read(path);
    text = CodeUtil.removeComment(text);
    text = removeInterface(text);
    if (!CodeUtil.containsVariable("class", text) && !CodeUtil.containsVariable("var", text) && !CodeUtil.containsVariable("function", text)) {
        return true;
    }
    return false;
}

/**
 * 移除代码中的接口定义
 */
function removeInterface(text) {
    var tsText = "";
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("interface", text);
        if (index == -1) {
            tsText += text;
            break;
        }
        tsText += text.substring(0, index);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        text = text.substring(index + 1);
    }
    return tsText;
}


exports.compile = compile;
exports.exportHeader = exportHeader;
exports.run = run;
exports.generateEgretFileList = generateEgretFileList;
exports.generateGameFileList = generateGameFileList;