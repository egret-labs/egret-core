/**
 * 将TypeScript编译为JavaScript
 */
var create_file_list = require("./create_file_list.js");
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js");
var exmlc = require("../exml/exmlc.js");
var file = require("../core/file.js");

function run(dir, args, opts) {
    var needCompileEngine = opts["-e"];
    var keepGeneratedTypescript = opts["-k"];

    var currDir = globals.joinEgretDir(dir, args[0]);

    var task = [];

    var exmlList = [];
    task.push(function(callback){
        if(!keepGeneratedTypescript){
            globals.addCallBackWhenExit(cleanEXMLList);
        }
        var source = path.join(currDir, "src");
        exmlList = file.search(source,"exml");
        source += "/";
        exmlList.forEach(function (item) {
            exmlc.compile(item,source);
        });

        callback();
    })


    if (needCompileEngine) {
        var egretSourceList = [];
        task.push(
            function (callback) {
                var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
                egretSourceList = compiler.generateEgretFileList(runtime,currDir);
                callback();
            },
            function (callback) {
                compiler.compile(callback,
                    path.join(param.getEgretPath(), "src"),
                    path.join(currDir, "bin-debug/lib"),
                    egretSourceList
                );
            },

            function (callback) {
                compiler.exportHeader(callback,
                    currDir,
                    egretSourceList
                );

            }
        );
    }
    else {
        var exist = file.exists(file.joinPath(currDir,"bin-debug","lib"));
        if (!exist){
            globals.exit(1102)
        }
    }

    task.push(
        function (callback) {
            buildProject(callback,currDir);
        }
    )


    async.series(task, function (err) {
        if(!keepGeneratedTypescript) {
            cleanEXMLList();
        }
        if (!err){
            globals.log("构建成功");
        }
        else{
            globals.exit(err);
        }
    })

    function cleanEXMLList(){
        if(exmlList){
            var source = path.join(currDir, "src");
            exmlList.forEach(function (item) {
                var tsPath = path.join(source,item);
                tsPath = tsPath.substring(0,tsPath.length-5)+".ts";
                file.remove(tsPath);
            });
        }
    }
}

function buildProject(callback,currDir){
    var manifestPath = currDir+"/manifest.json";
    var srcPath = currDir+"/src/";
    var libsPath = currDir+"/libs/";
    var sourceList;
    var fileListText = "";
    if(file.exists(manifestPath)){
        sourceList = getManifest(manifestPath,srcPath);
        fileListText = create_file_list.create(sourceList,srcPath,false);
    }
    else{
        sourceList = file.searchByFunction(srcPath,filterFunc);
        fileListText = create_file_list.create(sourceList,srcPath,true);
    }
    fileListText = "var game_file_list = "+fileListText+";";
        file.save(path.join(currDir,"bin-debug/src/game_file_list.js"),fileListText);
    var libs = file.search(libsPath,"d.ts");
    compiler.compile(callback,
        path.join(currDir, "src"),
        path.join(currDir, "bin-debug/src"),
        sourceList.concat(libs)
    );
}

function filterFunc(item){
    if(item.indexOf(".d.ts")==-1&&file.getExtension(item)=="ts"){
        return true;
    }
    return false;
}

function getManifest(file_list,srcPath) {
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


function help_title() {
    return "构建指定项目,编译指定项目的 TypeScript 文件\n";
}


function help_example() {
    var result =  "\n";
    result += "    egret build [project_name] [-e] [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -e           编译指定项目的同时编译引擎目录\n";
    result += "    --runtime    设置构建方式为 html5 或者是 native方式，默认值为html5";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
exports.buildProject = buildProject;