/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var exmlc = require('../lib/exml/exmlc');
function beforeBuild() {
    //todo move to upgrade
    var oldPath = file.joinPath(egret.args.srcDir, "libs", "exml.g.d.ts");
    if (file.exists(oldPath)) {
        var srclib = file.joinPath(egret.args.srcDir, "libs");
        var others = file.getDirectoryListing(srclib);
        if (others.length == 1) {
            file.remove(srclib);
        }
        else {
            file.remove(oldPath);
        }
    }
    var exmlDtsPath = getExmlDtsPath();
    if (file.exists(exmlDtsPath)) {
        file.save(exmlDtsPath, "");
    }
}
exports.beforeBuild = beforeBuild;
function beforeBuildChanges(exmlsChanged) {
    if (!exmlsChanged || exmlsChanged.length == 0)
        return;
    var addedOrRemoved = exmlsChanged.filter(function (e) { return e.type == "added" || e.type == "removed"; });
    if (addedOrRemoved.length == 0) {
        return;
    }
    beforeBuild();
}
exports.beforeBuildChanges = beforeBuildChanges;
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
    if (!exmls || exmls.length == 0) {
        return state;
    }
    exmls.forEach(function (exml) {
        if (!file.exists(exml))
            return;
        var result = exmlc.compile(exml, egret.args.srcDir);
        if (result.exitCode != 0) {
            state.exitCode = result.exitCode;
            state.messages = state.messages.concat(result.messages);
        }
    });
    state.messages.forEach(function (m) { return console.log(m); });
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
function afterBuildChanges(exmlsChanged) {
    if (egret.args.keepEXMLTS)
        return;
    if (!exmlsChanged || exmlsChanged.length == 0)
        return;
    //删除exml编译的ts文件
    exmlsChanged.forEach(function (exml) {
        var tsPath = exml.fileName.substring(0, exml.fileName.length - 4) + "g.ts";
        file.remove(tsPath);
    });
    var addedOrRemoved = exmlsChanged.filter(function (e) { return e.type == "added" || e.type == "removed"; });
    if (addedOrRemoved.length == 0) {
        return;
    }
    generateExmlDTS();
}
exports.afterBuildChanges = afterBuildChanges;
function generateExmlDTS() {
    var srcPath = egret.args.srcDir;
    var projectPath = egret.args.projectDir;
    var sourceList = file.search(srcPath, "exml");
    var length = sourceList.length;
    if (length == 0)
        return;
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
    file.save(exmlDtsPath, dts);
    return dts;
}
function getExmlDtsPath() {
    return file.joinPath(egret.args.projectDir, "libs", "exml.g.d.ts");
}

//# sourceMappingURL=../actions/exml.gui.js.map