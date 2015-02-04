/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var exmlc = require("../exml/exmlc.js");
var CodeUtil = require("../core/code_util.js");
var create_manifest = require("./create_manifest.js");


var all_module = [];


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
        if (ext == "ts"){//} && moduleFileList.indexOf(p) == -1) {
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

            console.log(Date.now() + "  333");
            var sourcemap = param.getArgv()["opts"]["-sourcemap"];
            sourcemap = sourcemap ? "--sourcemap " : "";

            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            var typeScriptCompiler = require("./egret_compiler.js");
            typeScriptCompiler.compile(onCompileComplete, cmd);
            console.log(Date.now() + "  444");

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
/*
 var crc32FilePath;
 var crc32Map;
 function parseFromCrc32(tsList) {
 var result = [];
 var argv = param.getArgv();
 var currDir = globals.joinEgretDir(argv.currDir, argv.args[0]);
 crc32FilePath = path.join(currDir, "crc32.temp");
 var crc32Txt = "";
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
 if (tsFilePath.indexOf(".d.ts") != -1) {//.d.ts一定要传给编译器
 result.push(tsFilePath);
 continue;
 }
 var tsFileTxt = file.read(tsFilePath);
 var tsFileCrc32Txt = crc32.direct(tsFileTxt);
 if (crc32Map[tsFilePath] && crc32Map[tsFilePath] == tsFileCrc32Txt) {//有过改变的文件需要编译
 continue;
 }
 crc32Map[tsFilePath] = tsFileCrc32Txt;
 result.push(tsFilePath);
 }

 if (isQuickMode()) {
 var projectDTS = //create_manifest.createProjectDTS(result, path.join(currDir, "src"));
 file.save("game.d.ts", projectDTS);
 result.push(path.join(argv.currDir, "game.d.ts"));
 return result;
 }
 else {
 return tsList;
 }
 }
 */


function getModuleConfig(module, projectDir) {
    var moduleName;
    if (typeof (module) == "string") {
        moduleName = path.join(param.getEgretPath(), "tools/lib/manifest", module + ".json");
    }
    else {
        if (module.path) {
            moduleName = path.join(projectDir, module.path, module.name + ".json");
        }
        else {
            moduleName = path.join(param.getEgretPath(), "tools/lib/manifest", module.name + ".json");
        }
    }
    var content = file.read(moduleName);
    if (!content) {
        globals.exit(8003, moduleName);
    }
    var moduleConfig = JSON.parse(content);

    if (!module.path) {
        moduleConfig.prefix = path.join(param.getEgretPath());
    }
    else {
        moduleConfig.prefix = path.join(projectDir, module.path);
    }


    return moduleConfig
}

function generateGameFileList(projectPath) {
    var manifestPath = path.join(projectPath, "manifest.json");
    var srcPath = path.join(projectPath, "src/");
    var manifest;
    if (file.exists(manifestPath)) {
        manifest = getManifestJson(manifestPath, srcPath);
    }
    else {
        var referenceInfo;
        var referencePath = file.joinPath(srcPath, "../libs/module_reference.json");
        if (file.exists(referencePath)) {
            var text = file.read(referencePath);
            try {
                referenceInfo = JSON.parse(text);
            }
            catch (e) {
            }
        }
//        if (all_module.length == 0) {
//            var projectConfig = require("../core/projectConfig.js");
//            projectConfig.init(projectPath);
//            var moduleList = projectConfig.getModule(runtime);
//            moduleList.map(function (module) {
//                var moduleConfig = getModuleConfig(module, projectPath);
//                all_module.push(moduleConfig);
//            })
//        }
        manifest = create_manifest.create(srcPath, false, referenceInfo);
        var moduleReferenceList = create_manifest.getModuleReferenceList();

        //todo
//        generateAllModuleFileList(projectPath, moduleReferenceList);
    }



//    //=========================
//    // 这段逻辑的作用是把第三方 module 的 ts文件不要随着 game_file_list 编译进去
//    var moduleFileList = getAllModuleTypeScriptFileList(projectPath);
//    //windows系统路径修正
//    moduleFileList = moduleFileList.map(function(item){
//        return item.replace(/\\/g,"/");
//    });
//    manifest = manifest.filter(function(item){
//        return moduleFileList.indexOf(item) == -1;
//    });
//    //=========================

    file.save(path.join(projectPath, "bin-debug/src/manifest.json"), JSON.stringify(manifest, null, "\t"));

    var fileListText = createFileList(manifest, srcPath);
    fileListText = "var game_file_list = " + fileListText + ";";

//    projectConfig = require("../core/projectConfig.js");
//    var output = projectConfig.getOutputDir();
//    output = output ? output : projectPath;
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
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "ts" && isInterface(filePath)) {
            continue;
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
    text = CodeUtil.removeComment(text, path);
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


function compileModule(callback, module, projectDir,outputPrefix) {


    var typeScriptCompiler = require("./egret_compiler.js");

    var moduleConfig = getModuleConfig(module, projectDir);
    var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
    outputPrefix = outputPrefix ? path.join(outputPrefix,"libs") : path.join(projectDir, "libs");
    output = path.join(outputPrefix, output);
    var tsList = moduleConfig.file_list;
    tsList = tsList.map(function (item) {
        return "\"" + path.join(moduleConfig.prefix, moduleConfig.source, item) + "\"";
    }).filter(function (item) {
        return item.indexOf(".js") == -1 //&& item.indexOf(".d.ts") == -1;
    })
    if (tsList.length == 0){
        globals.exit(1307,moduleConfig.name);
    }

    var dependencyList = moduleConfig.dependence;
    if (dependencyList) {
        for (var i = 0; i < dependencyList.length; i++) {
            var dependencyModule = getModuleConfig(dependencyList[i], projectDir);
            var dependencyModuleOutput = dependencyModule.output ? dependencyModule.output : dependencyModule.name;
            dependencyModuleOutput = path.join(outputPrefix, dependencyModuleOutput);

            var dtsFile = "\"" + path.join(dependencyModuleOutput, dependencyModule.name + ".d.ts") + "\"";
            tsList.push(dtsFile);
        }
    }

    var sourcemap = param.getArgv()["opts"]["-sourcemap"];
    sourcemap = sourcemap ? "--sourcemap " : "";
    all_module.push(moduleConfig);


    async.series([

        function (callback) {
            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            typeScriptCompiler.compile(callback, cmd);
        },


        function (callback) {
            var cmd = sourcemap + tsList.join(" ") + " -d -t ES5 --out " + "\"" + path.join(output, moduleConfig.name + ".d.ts") + "\"";
            typeScriptCompiler.compile(callback, cmd);
        },

        function (callback) {
            var jsList = moduleConfig.file_list;
            jsList = jsList.filter(function (item) {
                return item.indexOf(".js") > -1 || item.indexOf(".d.ts") > -1;
            })
            jsList.map(function (item) {
                var source = path.join(moduleConfig.prefix, moduleConfig.source, item);
                var target = path.join(output, item);
                file.copy(source, target);
            })
            callback()


        }


    ], function (err) {
        if (err) {
            globals.exit(1303);
        }
        else {
            callback();
        }
    })

}


function compileModules(callback, projectDir, runtime) {



    var projectConfig = require("../core/projectConfig.js");
    projectConfig.init(projectDir);
    var output = projectConfig.getOutputDir();
    var moduleList = projectConfig.getModule(runtime);

    var tasks = [];
    moduleList.map(function (module) {
        tasks.push(
            function (callback) {
                compileModule(
                    callback, module, projectDir,output);
            });
    })

    tasks.push(
        function (callback) {
            generateAllModuleReference(projectDir);
            var manifestPath = path.join(projectDir, "manifest.json");
            if (file.exists(manifestPath)) {
                generateAllModuleFileList(projectDir);
            }
            callback();
        }
    );
    async.series(tasks, callback);


}

function generateAllModuleReference(projectDir) {
    var fileList = [];
    all_module.map(function (moduleConfig) {
        moduleConfig.file_list.map(function (item) {
            var tsFile = file.joinPath(moduleConfig.prefix, moduleConfig.source, item)
            var ext = file.getExtension(tsFile).toLowerCase();
            if (ext == "ts" && item.indexOf(".d.ts") == -1) {
                fileList.push(tsFile);
            }
        })
    })
    var referenceInfo = create_manifest.getModuleReferenceInfo(fileList);
    var text = JSON.stringify(referenceInfo);
    file.save(file.joinPath(projectDir, "libs/module_reference.json"), text);
    return referenceInfo;
}

function generateAllModuleFileList(projectDir, moduleReferenceList) {

    if(moduleReferenceList){
        var length = moduleReferenceList.length;
        for(var i=0;i<length;i++){
            moduleReferenceList[i] = moduleReferenceList[i].toLowerCase();
        }
    }
    var projectConfig = require("../core/projectConfig.js");
    var output = projectConfig.getOutputDir();
    var all_module_file_list = [];
    all_module.map(function (moduleConfig) {
        moduleConfig.file_list.map(function (item) {
            var tsFile = file.joinPath(moduleConfig.prefix, moduleConfig.source, item);
            var tsFileLowerCase = file.joinPath(moduleConfig.prefix, moduleConfig.source, item).toLowerCase();
            if (item.indexOf(".d.ts") != -1) {
                return;
            }
            var ext = file.getExtension(tsFile).toLowerCase();
            if (ext == "ts") {
                if (moduleConfig.decouple == "true" && moduleReferenceList &&
                    moduleReferenceList.indexOf(tsFileLowerCase) == -1) {
                    return;
                }
                if (isInterface(tsFile))
                    return;
            }
            var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
            all_module_file_list.push(path.join(output, item));
        })
    })

    var egretFileListText = all_module_file_list.map(function (item) {
        return "\"" + item.replace(".ts", ".js").replace(new RegExp(/\\/g), "/") + "\"";
    }).join(",\n");
    egretFileListText = "[\n" + egretFileListText + "];\n";
    egretFileListText = "var egret_file_list = " + egretFileListText + ";";
    output = output ? output : projectDir;
    file.save(file.joinPath(output, "bin-debug/lib/egret_file_list.js"), egretFileListText);

}


function getAllModuleTypeScriptFileList(projectDir){
    var projectConfig = require("../core/projectConfig.js");
    projectConfig.init(projectDir);
    var moduleList = projectConfig.getModule("html5");
    var moduleFileList = [];
    for (var key in moduleList) {
        var module = moduleList[key];
        if (module.path) {

            var moduleConfig = getModuleConfig(module, projectDir);
            var file_list = moduleConfig.file_list;
            file_list = file_list.map(function (item) {
                return  path.join(moduleConfig.prefix, moduleConfig.source, item);
            }).filter(function (item) {
                return item.indexOf(".js") == -1 && item.indexOf(".d.ts") == -1;
            })


            moduleFileList = moduleFileList.concat(file_list)
        }
    }
    return moduleFileList;
}

exports.compileModules = compileModules;
exports.compile = compile;
exports.run = run;
exports.generateGameFileList = generateGameFileList;
exports.getModuleConfig = getModuleConfig;
