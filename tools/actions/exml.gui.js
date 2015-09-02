/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var exmlc = require('../lib/exml/exmlc');
function beforeBuild() {
    var exmlDtsPath = getExmlDtsPath();
    file.remove(exmlDtsPath);
}
exports.beforeBuild = beforeBuild;
function build() {
    var exmls = file.search(egret.args.srcDir, 'exml');
    return buildChanges(exmls);
}
exports.build = build;
function buildChanges(exmls) {
    var state = {
        exitCode: 0,
        messages: []
    };
    exmls.forEach(function (exml) { return exmlc.compile(exml, egret.args.srcDir); });
    exmls.forEach(function (exml) {
        var result = exmlc.compile(exml, egret.args.srcDir);
        if (result.exitCode != 0) {
            state.exitCode = result.exitCode;
            state.messages = state.messages.concat(result.messages);
        }
    });
    return state;
}
exports.buildChanges = buildChanges;
function afterBuild() {
    if (egret.args.keepEXMLTS)
        return;
    var exmls = file.search(egret.args.srcDir, 'exml');
    //删除exml编译的ts文件
    exmls.forEach(function (exml) {
        var tsPath = exml.substring(0, exml.length - 4) + "g.ts";
        file.remove(tsPath);
    });
    generateExmlDTS();
}
exports.afterBuild = afterBuild;
function generateExmlDTS() {
    var srcPath = egret.args.srcDir;
    var projectPath = egret.args.projectDir;
    var sourceList = file.search(srcPath, "exml");
    var length = sourceList.length;
    var dts = "";
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p)) {
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if (ext == "exml") {
            var className = p.substring(srcPath.length, p.length - 5);
            className = className.split("/").join(".");
            var index = className.lastIndexOf(".");
            if (index == -1) {
                dts += "declare class " + className + " extends egret.gui.Skin{\n}\n";
            }
            else {
                var moduleName = className.substring(0, index);
                className = className.substring(index + 1);
                dts += "declare module " + moduleName + "{\n\tclass " + className + " extends egret.gui.Skin{\n\t}\n}\n";
            }
        }
    }
    //保存exml
    var exmlDtsPath = getExmlDtsPath();
    if (dts != "") {
        file.save(exmlDtsPath, dts);
    }
    else {
        file.remove(exmlDtsPath);
    }
    return dts;
}
function getExmlDtsPath() {
    return file.joinPath(egret.args.srcDir, "libs", "exml.g.d.ts");
}
