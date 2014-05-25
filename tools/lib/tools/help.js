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

    if (args[0]){
        try{
            var tool = require("./" + args[0] + ".js");
            console.log ("用法: " + tool.help_example());
        }
        catch(e){
            console.log ("未找到" + args[0] + "命令的帮助文档");
        }


        return;
    }

    var list = fs.readdirSync(__dirname);
    console.log("用法: egret <command> [-v]\n");
    console.log("command 列表:")
    list.forEach(function (item) {
        var tool = require("./" + item);
        var tool_name = item.split(".")[0];


        if (tool.help_title) {
            var title = tool.help_title();
            console.log(getSpace(4) + tool_name + getSpace(30 - tool_name.length) + title);
        }
    })
    console.log ("参数列表:");
    console.log (getSpace(4) + "-v" + getSpace(30 - 2) + "打印详细日志");
    console.log ("");
    console.log ("使用 egret help <command> 了解各个 command 的细节")
}

function getSpace(num) {
    var result = "";
    for (var i = 0; i < num; i++) {
        result += " ";
    }
    return result;
}

exports.run = run;