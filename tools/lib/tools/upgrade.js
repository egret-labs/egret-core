/**
 * Created by apple on 14-8-5.
 */


var file = require("../core/file.js");
var param = require("../core/params_analyze.js");
var path = require("path");
function run(currDir, args, opts) {

//    var extensionDir = path.join(currDir,"egret/src/extension/gui");
//    var list = file.search(extensionDir,"ts");
//    list.forEach(fixSingleTypeScriptFile);
}


function fixSingleTypeScriptFile(item){
    var content = file.read(item);
    content = content.replace("module egret","module egret.gui");
    console.log (content);
    file.save(item,content);
}

function help_title() {
    return "升级项目代码\n";
}

function help_example() {
    return "egret upgrade { your_project }";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;