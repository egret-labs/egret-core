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
    projectConfig = JSON.parse(content);
    exports.data = projectConfig
}

function save(){
    var projectPath = path.join(projectName,"egretProperties.json");
    var content = JSON.stringify(projectConfig,null,"\t");
    file.save(projectPath,content);
}

function getModule(){
    return projectConfig.modules.map(function(item){
        return item.name;
    })
}



exports.init = init
exports.save = save
exports.getModule = getModule