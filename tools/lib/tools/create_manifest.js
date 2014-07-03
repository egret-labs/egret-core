var file = require("../core/file.js");
var globals = require("../core/globals.js");
var create_file_list = require("./create_file_list.js");

/**
 * 生成manifest.json文件
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currDir, args, opts) {
    currDir = globals.joinEgretDir(currDir, args[0]);
    var srcPath = file.joinPath(currDir,"src/");
    var sourceList = file.searchByFunction(srcPath,filterFunc);
    var fileListText = create_file_list.create(sourceList,srcPath,true);
    fileListText = fileListText.split(".js\"").join(".ts\"");
    file.save(file.joinPath(currDir,"manifest.json"),fileListText);
    globals.log("manifest.json生成成功");
}

function filterFunc(item){
    if(item.indexOf(".d.ts")==-1&&file.getExtension(item)=="ts"){
        return true;
    }
    return false;
}

function help_title() {
    return "在工程目录下生成manifest.json清单文件\n";
}


function help_example() {
    return "egret create_manifest [project_name]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;