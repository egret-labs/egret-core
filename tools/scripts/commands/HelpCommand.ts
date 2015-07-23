/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");

class HelpCommand implements egret.Command {
    execute(): number {
        var args = params.getCommandArgs();
        if (args[0]) {
            try {

                var bParseConfig = true;

                if( bParseConfig ){
                    var parser = require("../../lib/core/commands/parser.js");
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
            var locale = require( "../../lib/core/locale/local.js" );
            var title = locale.help_dict["title_" + tool_name];
            if (title) {
                console.log(this.getSpace(4) + tool_name + this.getSpace(30 - tool_name.length) + title + "\n");
            }
        });
        globals.log2(1905);
        console.log("");
        globals.log2(1906, this.getSpace(4) + "-v" + this.getSpace(30 - 2));
        console.log("");
        globals.log2(1907)
        return 0;
    }

    private getSpace(num) {
        var result = "";
        for (var i = 0; i < num; i++) {
            result += " ";
        }
        return result;
    }
}

export = HelpCommand;