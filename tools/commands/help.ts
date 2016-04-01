
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import watch = require("../lib/watch");
import server = require('../server/server');
import FileUtil = require('../lib/FileUtil');
import service = require('../service/index');
import parser = require('../parser/Parser');

import helpParser = require('./help/helpParser');

class Help implements egret.Command {

    execute(): number {
        //utils.open("http://edn.egret.com/cn/index.php/article/index/id/301");
        this.parse();
        return DontExitCode;
    }

    parse() {
        var self = this;
        var helpName = egret.args.commands ? egret.args.commands[1] :null;
        if (helpName) {
            try {

                var bParseConfig = true;

                if( bParseConfig ){
                    var result = helpParser.logHelpDef( helpName );
                    //console.log( ">>>: " + result );
                }

                return;

            }
            catch (e) {
                console.log (e)
                globals.log2(1901, helpName);
            }


            return;
        }

        //var list =  FileUtil.getDirectoryListing(__dirname,true);
        globals.log2(1903);
        console.log("");
        globals.log2(1904);
        console.log("");

        var list = helpModule.help_title;
        for (var key in list) {
            var tool_name = key;
            var title = list[key];
            console.log(self.getSpace(4) + tool_name + self.getSpace(30 - tool_name.length) + title + "\n");

        }

        console.log("");
        globals.log2(1907)
        console.log("");
    }

    getSpace(num) {
        var result = "";
        for (var i = 0; i < num; i++) {
            result += " ";
        }
        return result;
    }

}

export = Help;