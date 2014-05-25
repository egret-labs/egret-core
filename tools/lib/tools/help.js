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
    console.log("用法: egret <command>\n");
    console.log("command 列表:")
    list.forEach(function (item) {

        var tool = require("./" + item);
        var tool_name = item.split(".")[0];


        if (tool.help_title) {
            var title = tool.help_title();
            console.log("  " + tool_name + getSpace(30 - tool_name.length) + title);
        }




    })
    console.log ("");
}

function getSpace(num) {
    var result = "";
    for (var i = 0; i < num; i++) {
        result += " ";
    }
    return result;
}

exports.run = run;