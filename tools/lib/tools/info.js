var file = require("../core/file.js");
var param = require("../core/params_analyze.js");

function run(currDir, args, opts) {
    var txt = file.read(param.getEgretPath() + "/package.json");
    var config = JSON.parse(txt);
    console.log("当前Egret版本：" + config.version);
    console.log("Egret安装路径：" + param.getEgretPath());
}

function help_title() {
    return "获得Egret信息\n";
}

function help_example() {
    return "egret info";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;