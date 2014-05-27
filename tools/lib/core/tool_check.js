var path = require("path");
var fs = require("fs");

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

function run(option) {
    var tool = getTool(option.name);

    tool.run(option.currDir, option.args, option.opts);
}

exports.run = run;