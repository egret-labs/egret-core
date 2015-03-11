var globals = require("../core/globals");
var path = require("path");
var file = require("../core/file");
var locale = require( "../core/locale/zh-CN.js" );

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
                globals.log2(1902, tool.help_example());
            }
            return;

        }
        catch (e) {
            console.log (e)
            globals.log2(1901, args[0]);
        }


        return;
    }

    var list = file.getDirectoryListing(__dirname,true);
    globals.log2(1903);
    console.log("");
    globals.log2(1904);
    console.log("");
    list.forEach(function (item) {
        if (item.indexOf(".js") == -1) {
            return;
        }
        var tool = require("./" + item);
        var tool_name = item.split(".")[0];
        var title = locale.help_dict["title_" + tool_name];
        if (title) {
            console.log(getSpace(4) + tool_name + getSpace(30 - tool_name.length) + title + "\n");
        }
    });
    globals.log2(1905);
    console.log("");
    globals.log2(1906, getSpace(4) + "-v" + getSpace(30 - 2));
    console.log("");
    globals.log2(1907)
}

function getSpace(num) {
    var result = "";
    for (var i = 0; i < num; i++) {
        result += " ";
    }
    return result;
}

exports.run = run;