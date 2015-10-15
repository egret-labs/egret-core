

/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import exmlc = require('../lib/exml/exmlc');

export function beforeBuild() {
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
export function beforeBuildChanges(exmlsChanged: egret.FileChanges) {

    if (!exmlsChanged || exmlsChanged.length == 0)
        return;
    var addedOrRemoved = exmlsChanged.filter(e=> e.type == "added" || e.type == "removed");
    if (addedOrRemoved.length == 0) {
        return;
    }
    beforeBuild();
}

export function build(): egret.TaskResult {

    var exmls = file.search(egret.args.srcDir, 'exml');
    return buildChanges(exmls);

}

export function buildChanges(exmls: string[]): egret.TaskResult {

    var state: egret.TaskResult = {
        exitCode: 0,
        messages: []
    };

    if(!exmls ||exmls.length == 0){
        return state;
    }

    exmls.forEach(exml=> {
        if (!file.exists(exml))
            return;
        var result = exmlc.compile(exml, egret.args.srcDir);
        if (result.exitCode != 0) {
            state.exitCode = result.exitCode;
            state.messages = state.messages.concat(result.messages);
        }
    });
    state.messages.forEach(m=> console.log(m));

    return state;
}

export function afterBuild() {

    if (egret.args.keepEXMLTS)
        return;
    var exmls = file.search(egret.args.srcDir, 'exml');
    //删除exml编译的ts文件
    exmls.forEach(exml => {
        var tsPath = exml.substring(0, exml.length - 4) + "g.ts";
        file.remove(tsPath);
    });

    generateExmlDTS();
}


export function afterBuildChanges(exmlsChanged: egret.FileChanges) {

    if (egret.args.keepEXMLTS)
        return;

    if (!exmlsChanged || exmlsChanged.length == 0)
        return;

    //删除exml编译的ts文件
    exmlsChanged.forEach(exml => {
        var tsPath = exml.fileName.substring(0, exml.fileName.length - 4) + "g.ts";
        file.remove(tsPath);
    });

    var addedOrRemoved = exmlsChanged.filter(e=> e.type == "added" || e.type == "removed");
    if (addedOrRemoved.length == 0) {
        return;
    }

    generateExmlDTS();
}



function generateExmlDTS(): string {
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
