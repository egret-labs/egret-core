/**
 * Created by apple on 14-8-15.
 */


var file = require("../core/file.js");
var path = require("path");
var projectConfig;
var projectName;

function init(name){
    projectName = name;
    var projectPath = path.join(projectName,"egretProperties.json")
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



exports.init = init
exports.save = save
exports.getModule = getModule
exports.getOutputDir = function(){
    return null;//"/Users/wander/Documents/egret_workspace/temp_build_for_native";
}