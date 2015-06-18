/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("../core/path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var buildModule = require("../core/buildModuleJs.js");
var file = require("../core/file.js");
var projectProperties = require("../core/projectProperties.js");
var global = require("../core/globals");

var projectPath

function run(dir, args, opts){

    var projectName = args[0];
    if (!projectName) {
        globals.exit(1001);
    }
    projectPath = path.resolve(projectName);

    globals.setShowDebugLog();

    async.series([


        function(callback){
            copyTemplate(callback,projectPath)
        },

        function(callback){
            compileModule(callback,"core")
        },

        function(callback){
            compileModule(callback,"gui");
        },

        function(callback){
            compileModule(callback,"dragonbones");
        }
    ])
}


function copyTemplate(callback,projectPath){

    copyFileDir(projectPath, "tools/templates/javascript/empty");
    callback();
}


function copyFileDir(projectPath, dir) {
    file.copy(path.join(param.getEgretPath(), dir), projectPath);
}


function compileModule(callback,moduleName){
    var moduleConfig = projectProperties.getModuleConfigByModuleName(moduleName);
    var moduleFileList = moduleConfig.getAbsoluteFilePath();

    if (moduleName == "core"){
        var appendModule = projectProperties.getModuleConfigByModuleName("html5");
        var appendModuleFileList = appendModule.getAbsoluteFilePath();
        moduleFileList = moduleFileList.concat(appendModuleFileList);
    }


    var dependencyList = moduleConfig.getDependencyList().map(function(item) {return path.join(projectPath,item)});




    moduleFileList = moduleFileList.concat(dependencyList);

    var compiler = require("./egret_compiler.js");
    var cmd = moduleFileList.join(" ") + " --out " + path.join(projectPath,moduleConfig.name + ".js") + " -t ES5"
    compiler.compile( function(){


        var cmd = moduleFileList.join(" ") + " -d --out " + path.join(projectPath,moduleConfig.name + ".d.ts") + " -t ES5";
        compiler.compile(callback,cmd);

    } ,cmd);
}

exports.run = run;
