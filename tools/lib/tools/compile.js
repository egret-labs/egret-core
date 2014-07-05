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
var create_manifest = require("./create_manifest.js")


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
    buildAllFile(function () {
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
function buildAllFile(callback, srcPath, output, sourceList,keepGeneratedTypescript) {

    var exmlList = [];
    var tsList = [];
    var length = sourceList.length;
    for(var i=0;i<length;i++){
        var p = sourceList[i];
        if(!file.exists(p)){
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if(ext=="ts"){
            tsList.push(p);
        }
        else if(ext=="exml"){
            exmlList.push(p);
            tsList.push(p.substring(0, p.length-4)+"ts");
        }
    }

    globals.addCallBackWhenExit(cleanTempFile);

    async.waterfall([
        checkCompilerInstalled,

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
                if(index==-1){
                    return true;
                }
                var ext = path.substring(index).toLowerCase();
                return ext!=".ts"&&ext!=".exml";
            }
        },
        //编译exml文件
        function(callback){
            exmlList.forEach(function (item) {
                exmlc.compile(item,srcPath);
            });

            callback();
        },
        //编译ts文件
        function (callback) {
            tsList = tsList.map(function(item){
                return "\"" + item + "\"";
            });
            var cmd = "" + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            file.save("tsc_config_temp.txt", cmd);
            var ts = cp_exec("tsc @tsc_config_temp.txt");
            ts.stderr.on("data", function (data) {
                console.log(data);
            })


            ts.on('exit', function (code) {
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

    function cleanTempFile(){
        file.remove("tsc_config_temp.txt");
        if(!keepGeneratedTypescript&&exmlList){
            exmlList.forEach(function (p) {
                var tsPath = p.substring(0, p.length-4)+"ts";
                file.remove(tsPath);
            });
        }
    }
}

function checkCompilerInstalled(callback) {
    var checkTypeScriptCompiler = "tsc";
    var tsc = cp_exec(checkTypeScriptCompiler);
    tsc.on('exit', function (code) {
            if (code == 0) {
                callback();
            }
            else {
                globals.exit(2);
            }
        }
    );
}

function exportHeader(callback, projectPath, sourceList) {
    var list = [];
    var length = sourceList.length;
    for(var i=0;i<length;i++){
        var p = sourceList[i];
        if(!file.exists(p)){
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if(ext=="ts"){
            list.push(p);
        }
        else if(ext=="exml"){
            list.push(p.substring(0, p.length-4)+"ts");
        }
    }
    list = list.map(function(item){
        return "\"" + item + "\"";
    })
    var output = path.join(projectPath,"libs/egret.d.ts");
    var source = list.join(" ");
    var cmd = source + " -t ES5 -d --out " + "\"" + output + "\"";
    file.save("tsc_config_temp.txt", cmd);
    var ts = cp_exec("tsc @tsc_config_temp.txt");
    ts.stderr.on("data", function (data) {
        console.log(data);
    })

    ts.on('exit', function (code) {
        if (code == 0) {
            var egretDTS = file.read(output);
            var lines = egretDTS.split("\n");
            var length = lines.length;
            for(var i=0;i<length;i++){
                var line = lines[i];
                if(line.indexOf("/// <reference path")!=-1){
                    lines.splice(i,1);
                    i--;
                }
                else{
                    break;
                }
            }
            egretDTS = lines.join("\n");
            file.save(output,egretDTS);
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

function generateEgretFileList(runtime,projectPath){
    var coreList = globals.require("tools/lib/manifest/core.json");
    var runtimeList = globals.require("tools/lib/manifest/"+runtime+".json");
    var egretPath = param.getEgretPath();
    var manifest = coreList.concat(runtimeList);
    var length = manifest.length;
    for(var i=0;i<length;i++){
        manifest[i] = file.joinPath(egretPath,"src",manifest[i]);
    }
    var srcPath = path.join(param.getEgretPath(),"src/");
    srcPath = srcPath.split("\\").join("/");
    var egretFileListText = createFileList(manifest,srcPath);
    egretFileListText = "var egret_file_list = "+egretFileListText+";";
    file.save(file.joinPath(projectPath,"bin-debug/lib/egret_file_list.js"),egretFileListText);
    return manifest;
}

function generateGameFileList(projectPath) {
    var manifestPath = path.join(projectPath,"manifest.json");
    var srcPath = path.join(projectPath,"src/");
    var manifest;
    if(file.exists(manifestPath)){
        manifest = getManifestJson(manifestPath,srcPath);
    }
    else{
        manifest = create_manifest.create(srcPath);
    }
    var fileListText = createFileList(manifest,srcPath);
    fileListText = "var game_file_list = "+fileListText+";";
    file.save(path.join(projectPath,"bin-debug/src/game_file_list.js"),fileListText);
    return manifest;
}

function getManifestJson(file_list,srcPath) {
    if(!file.exists(file_list)){
        return [];
    }
    var content = file.read(file_list);
    try{
        var manifest = JSON.parse(content);
    }
    catch (e){
        globals.exit(1304,file_list);
    }
    var length = manifest.length;
    for(var i=0;i<length;i++){
        manifest[i] = file.joinPath(srcPath,manifest[i]);
    }
    return manifest;
}

function createFileList(manifest, srcPath) {

    var gameList = [];
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        var filePath = manifest[i];
        if (filePath.indexOf(".d.ts") == -1) {
            gameList.push(filePath);
        }
    }

    length = gameList.length;
    for (i = 0; i < length; i++) {
        filePath = gameList[i];
        filePath = filePath.substring(srcPath.length);
        var ext = file.getExtension(filePath).toLowerCase();
        if(ext=="exml"){
            filePath = filePath.substring(0, filePath.length - 4) + "js";
        }
        else if(ext=="ts"){
            filePath = filePath.substring(0, filePath.length - 2) + "js";
        }
        gameList[i] = "    \"" + filePath + "\"";
    }
    var gameListText = "[\n" + gameList.join(",\n") + "\n]";
    return gameListText;
}



exports.compile = buildAllFile;
exports.exportHeader = exportHeader;
exports.run = run;
exports.generateEgretFileList = generateEgretFileList;
exports.generateGameFileList = generateGameFileList;