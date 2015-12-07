global.DEBUG = true;
global.egret = global.egret || {};
global.registerClass = "egret";
global.DontExitCode = -0xF000;
require('./globals');
require("./lib/core/globals.js");
var Parser = require("./parser/Parser");
var earlyParams = require("./parser/ParseEarlyVersionParams");
var utils = require('./lib/utils');

function executeCommandLine(args) {
    var options = Parser.parseCommandLine(args);
    egret.args = options;
    earlyParams.parse(options, args);
    var exitcode = entry.executeOption(options);
    entry.exit(exitcode);
}
exports.executeCommandLine = executeCommandLine;
var Entry = (function () {
    function Entry() {
    }
    Entry.prototype.executeOption = function (options) {
        var self = this;
        options.command = options.command || "help";
        try {
            var command = require("./commands/" + options.command);
        }
        catch (e) {
            console.log(utils.tr(10002, options.command));
            return 10002;
        }
        var commandInstance = new command();
        if (commandInstance.isAsync) {
            commandInstance.execute();
            return DontExitCode;
        }
        else {
            var exitCode = commandInstance.execute();
            return exitCode;
        }
    };
    Entry.prototype.exit = function (exitCode) {
        if (DontExitCode == exitCode)
            return;
        utils.exit(exitCode);
    };
    return Entry;
})();
var entry = new Entry();
