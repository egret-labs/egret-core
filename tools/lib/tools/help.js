var globals = require("../core/globals");
var path = require("path");
var file = require("../core/file");


function run(currDir, args, opts) {

//    console.log("//创建一个新工程");
//    console.log("egret c|create proj-name [-e engineUrl] [-u url]");
//    console.log("//删除一个工程");
//    console.log("egret r|remove proj-name [-u url]");
//    console.log("//构建一个工程");
//    console.log("egret b|build [-e|(-g [proj-name1, ...])] [-u url]");
//    console.log("");

    if (args[0]) {
        try {

           var bParseConfig = true;

           if( bParseConfig ){
              var parser = require("../core/commands/parser.js");
              var result = parser.logHelpDef( args[0] );
              //console.log( ">>>: " + result );
           }

            if ( !result ){
                var tool = require("./" + args[0] + ".js");
                console.log("用法: " + tool.help_example());
            }
            return;

        }
        catch (e) {
            console.log (e)
            console.log("无法找到" + args[0] + "命令的帮助文档");
        }


        return;
    }

    var list = file.getDirectoryListing(__dirname,true);
    console.log("用法: egret <command> [-v]\n");
    console.log("command 列表:\n")
    list.forEach(function (item) {
        if (item.indexOf(".js") == -1) {
            return;
        }
        var tool = require("./" + item);
        var tool_name = item.split(".")[0];
        if (tool.help_title) {
            var title = tool.help_title();
            console.log(getSpace(4) + tool_name + getSpace(30 - tool_name.length) + title);
        }
    })
    console.log("参数列表:\n");
    console.log(getSpace(4) + "-v" + getSpace(30 - 2) + "打印详细日志");
    console.log("");
    console.log("使用 egret help <command> 了解各个 command 的细节")
}

function getSpace(num) {
    var result = "";
    for (var i = 0; i < num; i++) {
        result += " ";
    }
    return result;
}

exports.run = run;