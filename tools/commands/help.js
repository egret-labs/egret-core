/// <reference path="../lib/types.d.ts" />
var helpParser = require('./help/helpParser');
var Help = (function () {
    function Help() {
    }
    Help.prototype.execute = function () {
        //utils.open("http://edn.egret.com/cn/index.php/article/index/id/301");
        this.parse();
        return DontExitCode;
    };
    Help.prototype.parse = function () {
        var self = this;
        var helpName = egret.args.commands ? egret.args.commands[1] : null;
        if (helpName) {
            try {
                var bParseConfig = true;
                if (bParseConfig) {
                    var result = helpParser.logHelpDef(helpName);
                }
                return;
            }
            catch (e) {
                console.log(e);
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
        globals.log2(1907);
        console.log("");
    };
    Help.prototype.getSpace = function (num) {
        var result = "";
        for (var i = 0; i < num; i++) {
            result += " ";
        }
        return result;
    };
    return Help;
})();
module.exports = Help;

//# sourceMappingURL=../commands/help.js.map