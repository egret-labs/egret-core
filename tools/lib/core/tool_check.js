var path = require("../core/path");
var fs = require("fs");
var globals = require("./globals.js");
var name_map = {
    "c": "create",
    "b": "build"
}


function getTool(name) {
    var fileName = name_map[name] ? name_map[name] : name;
    var pluginPath = path.join(__dirname, "../tools", fileName + ".js");
    if (!fs.existsSync(pluginPath)) {
        return require(path.join(__dirname, "../tools/help.js"));
    }
    return require(pluginPath);
}

global.egret = global.egret || {};
function run(option) {
    var fileName = option.name;
    if (fileName == "autocompile" || fileName == "service" || fileName == "quickbuild" || fileName == "quit") {
        executeCommandLine();
        return;
    }
    var tool = getTool(fileName);
    tool.run(option.currDir, option.args, option.opts);
}

var e = new Error("eee");
console.log(e.stack);

var Build = require("../commands/BuildCommand");
var AutoCompile = require("../commands/AutoCompileCommand");
var Parser = require("../parser/Parser");
var service = require("../service/index");
var Shutdown = require("../commands/ShutdownCommand");
global.egret = global.egret || {};
var DontExitCode = -0xF000;
function executeCommandLine() {
    var options = Parser.parseCommandLine(process.argv.slice(2));
    egret.options = options;
    var exitcode = entry.executeOption(options);
    entry.exit(exitcode);
}
exports.executeCommandLine = executeCommandLine;
function executeOption(options) {
    return entry.executeOption(options);
}
exports.executeOption = executeOption;
var Entry = (function () {
    function Entry() {
    }
    Entry.prototype.executeOption = function (options) {
        var exitCode = 0;
        switch (options.action) {
            case "service":
                service.run();
                exitCode = DontExitCode;
                break;
            case "autocompile":
                new AutoCompile().execute();
                exitCode = DontExitCode;
                break;
            case "quickbuild":
                new Build().execute();
                exitCode = DontExitCode;
                break;
            case "quit":
                new Shutdown().execute();
                exitCode = DontExitCode;
                break;
        }
        return exitCode;
    };
    Entry.prototype.exit = function (exitCode) {
        if (DontExitCode == exitCode)
            return;
        process.exit(exitCode);
    };
    return Entry;
})();
var entry = new Entry();

exports.run = run;