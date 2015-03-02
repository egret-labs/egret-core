/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var sdoc = require("./save_docs");
var addExtends = require("./addExtends");

function run(dir, args, opts) {
    if (opts["--output"] == null || opts["--output"].length == 0 || opts["--output"][0] == "") {
        console.log("请设置输出api地址  egret tscdoc --output path");
        return;
    }
    var outputPath = opts["--output"][0] || "";

    var moduleArr = ["core", "res", "html5", "native", "gui", "socket", "dragonbones"];
    var tsList = [];
    for (var i = 0; i < moduleArr.length; i++) {
        tsList = tsList.concat(getModuleList(moduleArr[i]));
    }

    var typeScriptCompiler = require("../tools/egret_tsc_api.js");

    var tempTime = Date.now();
    var cmd = tsList.join(" ") + " -d -t ES5 --out " + globals.addQuotes(path.join(outputPath, "a.d.ts"));
    var apiArr = typeScriptCompiler.compile(function () {
    }, cmd);

    globals.debugLog("耗时：%d秒", (Date.now() - tempTime) / 1000);

    var tempClassArr = sdoc.screening(apiArr);
    tempClassArr = addExtends.addChildClasses(tempClassArr);
    var extendsObj = addExtends.addExtends(tempClassArr);

    file.remove(outputPath);
    addExtends.save(extendsObj, outputPath);

    file.remove("tsc_config_temp.txt");
}

function getModuleList(moduleName) {
    var egretPath = path.join(process.argv[1], "../../../");

    var modulePath = path.join(egretPath, "tools/lib/manifest", moduleName + ".json");

    var moduleConfig = JSON.parse(file.read(modulePath));

    //获取源文件地址
    var tsList = moduleConfig.file_list;
    tsList = tsList.map(function (item) {
        return globals.addQuotes(path.join(egretPath, moduleConfig.source, item));
    }).filter(function (item) {
        return item.indexOf(".js") == -1;
    });

    return tsList;
}

exports.run = run;
