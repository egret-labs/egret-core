/**
 * Created by apple on 14-8-15.
 */


var file = require("../core/file.js");
var param = require("./params_analyze.js");
var path = require("path");
var global = require("../core/globals");
var projectConfig;
var projectName;

function init(name){
    projectName = name;
    var projectPath = path.join(projectName,"egretProperties.json");
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
    if (!projectConfig.native){
        projectConfig.native = {};
    }
    exports.data = projectConfig;
    exports.projectGlobalPath = name;
}

function save(){
    var projectPath = path.join(projectName,"egretProperties.json");
    var content = JSON.stringify(projectConfig,null,"\t");
    file.save(projectPath,content);
}

function getModule(runtime){
    var moduleList = projectConfig.modules.concat();

    moduleList.push({"name":runtime});
    return moduleList;
}



exports.init = init;
exports.save = save;
exports.getModule = getModule;
exports.getOutputDir = function(){

    var argv = param.getArgv();
    var currDir = process.cwd();
    var projectName = argv.args[0];
    if (projectName) {
        currDir = path.resolve(projectName);
    }

    var stat2 = file.exists(path.join(currDir, "src"));
    var stat3 = file.exists(path.join(currDir, "launcher"));
    if (!stat2 || !stat3) {//存在egret项目缺少的文件目录
        global.exit(8002);
    }


    var runtime = param.getOption(argv.opts, "--runtime", ["html5", "native"]);
    if (runtime == "native") {
        if (projectConfig && projectConfig.native && projectConfig.native.android_path  && projectConfig.native.android_path != "") {
            var support_path = projectConfig.native.android_path;
            support_path = path.join(currDir, support_path, "__temp");
            return support_path;
        }
        else if (projectConfig && projectConfig.native && projectConfig.native.ios_path  && projectConfig.native.ios_path != "") {
            var support_path = projectConfig.native.ios_path;
            support_path = path.join(currDir, support_path, "__temp");
            return support_path;
        }
        else {
            global.exit(8004);
            return null;
        }
    }
    return null;//"/Users/wander/Documents/egret_workspace/temp_build_for_native";
};

exports.getIgnorePath = function(){
    if(projectConfig && projectConfig.native && projectConfig.native.path_ignore) {
        return projectConfig.native.path_ignore;
    }
    return [];
};

function hasNativeUrl() {
    if (getProjectUrl("android") == null && getProjectUrl("ios") == null) {
        return false;
    }
    return true;
}

function getProjectUrl(platform) {
    if (platform == "android" || platform == "ios") {
        if (projectConfig && projectConfig.native && projectConfig.native[platform + "_path"]  && projectConfig.native[platform + "_path"] != "") {
            var support_path = projectConfig.native[platform + "_path"];
            return path.join(projectName, support_path);
        }
        else {
            return null;
        }
    }
}

function getSaveUrl(platform) {
    var url = getProjectUrl(platform);
    if (url != null) {
        return path.join(url, "temp");
    }
    return null;
}

function getProjectAssetsUrl(platform) {
    var url = getProjectUrl(platform);
    if (url != null) {
        if (platform == "android") {
            return path.join(url, "proj.android/assets/egret-game");
        }
        else if (platform == "ios") {
            return path.join(url, "Resources/egret-game");
        }
    }
    return null;
}

function getReleaseUrl() {
    if (projectConfig.release && projectConfig.release != "") {
        return projectConfig.release;
    }

    return "release";
}

exports.hasNativeUrl = hasNativeUrl;
exports.getProjectUrl = getProjectUrl;
exports.getSaveUrl = getSaveUrl;
exports.getProjectAssetsUrl = getProjectAssetsUrl;
exports.getReleaseUrl = getReleaseUrl;