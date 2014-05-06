var libs = require("../core/normal_libs");
var path = require("path");
var fs = require("fs");


function run(currDir, args, opts) {

//    console.log("//创建一个新工程");
//    console.log("egret c|create proj-name [-e engineUrl] [-u url]");
//    console.log("//删除一个工程");
//    console.log("egret r|remove proj-name [-u url]");
//    console.log("//构建一个工程");
//    console.log("egret b|build [-e|(-g [proj-name1, ...])] [-u url]");
//    console.log("");


    var list = fs.readdirSync(__dirname);
    console.log ("egret 子命令")
    list.forEach(function(item){

        var tool = require("./" + item);
        var tool_name = item.split(".")[0];
        console.log ("  " + tool_name + ":");
        if (tool.help_title){
            console.log ("    " + tool.help_title());
        }
        if (tool.help_example){
            console.log ("    例: " + tool.help_example());
        }


    })

}

exports.run = run;