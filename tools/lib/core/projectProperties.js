/**
 * Created by apple on 14-8-15.
 */


var file = require("../core/file.js");
var param = require("./params_analyze.js");
var path = require("../core/path");
var globals = require("../core/globals");
var projectConfig;
var projectName;

var modules = {};
var modulesConfig = {};
function init(name){
    projectName = name;
    var projectPath = path.join(projectName, "egretProperties.json");
    var content = file.read(projectPath);
    if (!content){
        projectConfig = {
            "modules": [
                {
                    "name": "core"
                }
            ],
            "native": {
                "path_ignore": [
                ]
            }
        }
    }
    else{
        projectConfig = JSON.parse(content);
    }

    for (var i = 0; i < projectConfig["modules"].length; i++) {
        var module = projectConfig["modules"][i];
        if (module["name"] == "core") {
            projectConfig["modules"].splice(i + 1, 0, {"name" : "html5"}, {"name" : "native"});
            break;
        }
    }

    if (!projectConfig.native){
        projectConfig.native = {};
    }

    for (var key in projectConfig["modules"]) {
        modules[projectConfig["modules"][key]["name"]] = projectConfig["modules"][key];
    }

    initConfigJson();

    exports.data = projectConfig;
    exports.projectGlobalPath = name;
}

function initConfigJson() {
    for (var key in modules) {
        var module = modules[key];
        modulesConfig[key] = getModuleConfigByModuleName(module["name"]);
    }
}

function getModuleConfigByModuleName(moduleName) {
    var moduleJsonPath;

    var modulePath = getModulePath(moduleName);
    if (modulePath == null) {
        moduleJsonPath = path.join(param.getEgretPath(), "tools/lib/manifest", moduleName + ".json");
    }
    else {
        moduleJsonPath = path.join(projectName, modulePath, moduleName + ".json");
    }
    var content = file.read(moduleJsonPath);
    if (!content) {
        globals.exit(8003, moduleJsonPath);
    }

    var moduleConfig = JSON.parse(content);

    if (modulePath == null) {
        moduleConfig.prefix = path.join(param.getEgretPath());
    }
    else {
        moduleConfig.prefix = path.join(projectName, modulePath);
    }

    //写入语言包文件
    if(moduleConfig.name == "core") {
        moduleConfig.file_list.unshift("egret/i18n/" + globals.getLanguageInfo() + ".ts");
    }

    moduleConfig.getAbsoluteFilePath = function (){
        return moduleConfig.file_list.map( function(item){
            return path.join(moduleConfig.prefix,moduleConfig.source,item);
        })
    }

    var self = this;

    moduleConfig.getDependencyList = function () {
        var tsList = [];
        //如果有依赖，则需要将依赖的库.d.ts（已生成在项目中）文件也放入到list中
        var dependencyList = this.dependence;
        if (dependencyList) {
            for (var i = 0; i < dependencyList.length; i++) {
                var depModuleName = dependencyList[i];
                tsList.push(depModuleName + ".d.ts");
            }
        }
        return tsList;
    }

    return moduleConfig;
}


function getAllModules() {
    return projectConfig["modules"];
}

function getModulePath(moduleName) {
    if (modules[moduleName] && modules[moduleName]["path"] != "") {
        return modules[moduleName]["path"];
    }
    return null;
}

function getModuleConfig(moduleName) {
    return modulesConfig[moduleName];
}

function getProjectPath() {
    return projectName;
}

function getModulesDts() {
    var libs = [];
    for (var key in modulesConfig) {
        var moduleConfig = modulesConfig[key];

        var dependencyModuleOutput = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
        var dtsFile = path.join(projectName, "libs", dependencyModuleOutput, moduleConfig.name + ".d.ts");
        libs.push(dtsFile);
    }

    return libs;
}

function getNativePath(platform) {
    if (projectConfig.native && projectConfig.native[platform + "_path"] && projectConfig.native[platform + "_path"] != "") {
        return projectConfig.native[platform + "_path"];
    }

    return null;
}

function getTscLibUrl() {
    if (projectConfig.tscLib && projectConfig.tscLib != null) {
        return path.join(projectName, projectConfig["tscLib"]);
    }
    return null;
}

exports.getIgnorePath = function(){
    if(projectConfig && projectConfig.native && projectConfig.native.path_ignore) {
        return projectConfig.native.path_ignore;
    }
    return [];
};



function getReleaseUrl() {
    if (projectConfig.release && projectConfig.release != "") {
        return projectConfig.release;
    }

    return "release";
}

function getVersionCode(runtime) {
    if (hasKeys(projectConfig, ["publish", "baseVersion"])) {
        return projectConfig["publish"]["baseVersion"];
    }

    return 1;
}

function hasKeys(obj, keys) {
    var temp = obj;
    for (var i = 0; i < keys.length; i++) {
        temp = temp[keys[i]];
        if (temp == null) {
            return false;
        }
    }
    return true;
}

function getModuleDetailConfig(name) {
    var moduleConfig = getModuleConfigByModuleName(name);
    var jsList = moduleConfig.file_list;

    for (var i = 0; i < jsList.length; i++) {
        var item = jsList[i];

        var filePath = path.join(moduleConfig.prefix, moduleConfig.source, item);
        if (item.indexOf(".d.ts") > -1) {
            jsList.splice(i, 1);
            i--;
            continue;
        }
        else if (item.indexOf(".js") > -1) {//将js文件拷贝到libs中
        }
        else {
            //纯interface从jslist中去掉
            if (globals.isInterface(filePath)) {
                jsList.splice(i, 1);
                i--;
                continue;
            }
            else {
            }
        }
    }
    return moduleConfig;
}


function getModuleReferenceInfo() {
    var fileList = [];
    var modules = getAllModules();
    modules.map(function (moduleConfig) {
        var moduleConfig = getModuleConfig(moduleConfig["name"]);
        moduleConfig.file_list.map(function (item) {
            var tsFile = file.joinPath(moduleConfig.prefix, moduleConfig.source, item);
            var ext = file.getExtension(tsFile).toLowerCase();
            if (ext == "ts" && item.indexOf(".d.ts") == -1) {
                fileList.push(tsFile);
            }
        })
    });
    var create_manifest = require("../tools/create_manifest.js");
    var referenceInfo = create_manifest.getModuleReferenceInfo(fileList);
    return referenceInfo;
}

exports.getModuleReferenceInfo = getModuleReferenceInfo;


exports.getModuleDetailConfig = getModuleDetailConfig;

exports.getVersionCode = getVersionCode;
exports.getReleaseUrl = getReleaseUrl;

exports.getTscLibUrl = getTscLibUrl;
exports.getNativePath = getNativePath;

exports.init = init;
exports.getAllModules = getAllModules;
exports.getModulePath = getModulePath;
exports.getModuleConfig = getModuleConfig;
exports.getProjectPath = getProjectPath;
exports.getModulesDts = getModulesDts;

exports.getModuleConfigByModuleName = getModuleConfigByModuleName;