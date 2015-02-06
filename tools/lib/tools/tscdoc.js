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

    var outputPath = "/Volumes/WORK/Sites/api/js/data/";

    var moduleArr = ["core", "html5", "native", "gui", "socket", "dragonbones"];
    var tsList = [];
    for (var i = 0; i < moduleArr.length; i++) {
        tsList = tsList.concat(getModuleList(moduleArr[i]));
    }

    var typeScriptCompiler = require("../tools/egret_tsc_api.js");

    var tempTime = Date.now();
    var cmd = tsList.join(" ") + " -d -t ES5 --out " + outputPath + "a.d.ts";
    var apiArr = typeScriptCompiler.compile(function () {
        console.log("sdfasf");
    }, cmd, null);

    globals.debugLog("耗时：%d秒", (Date.now() - tempTime) / 1000);

    var tempClassArr = sdoc.screening(apiArr);
    var extendsObj = addExtends.addExtends(tempClassArr);

    file.remove(outputPath);
    addExtends.save(extendsObj, outputPath);



}

function getModuleList(moduleName) {
    var modulePath = path.join(param.getEgretPath(), "tools/lib/manifest", moduleName + ".json");

    var moduleConfig = JSON.parse(file.read(modulePath));

    //获取源文件地址
    var tsList = moduleConfig.file_list;
    tsList = tsList.map(function (item) {
        return globals.addQuotes(path.join(param.getEgretPath(), moduleConfig.source, item));
    }).filter(function (item) {
        return item.indexOf(".js") == -1;
    });

    return tsList;
}

exports.run = run;
