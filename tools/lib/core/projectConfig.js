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
                    "libs"
                ]
            }
        }

    }
    else{
        projectConfig = JSON.parse(content);
    }
    exports.data = projectConfig;
}

function save(){
    var projectPath = path.join(projectName,"egretProperties.json");
    var content = JSON.stringify(projectConfig,null,"\t");
    file.save(projectPath,content);
}

function getModule(runtime){
    var moduleList = projectConfig.modules.map(function(item){
        return item.name;
    })
    moduleList.push(runtime);
    return moduleList;
}



exports.init = init
exports.save = save
exports.getModule = getModule