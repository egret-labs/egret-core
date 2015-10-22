/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var exml = require("../lib/eui/EXML");
function beforeBuild() {
    var exmlDtsPath = getExmlDtsPath();
    if (file.exists(exmlDtsPath)) {
        file.save(exmlDtsPath, "");
    }
}
exports.beforeBuild = beforeBuild;
function beforeBuildChanges(exmlsChanged) {
}
exports.beforeBuildChanges = beforeBuildChanges;
function build() {
    var exmls = file.search(egret.args.projectDir, 'exml');
    return buildChanges(exmls);
}
exports.build = build;
function buildChanges(exmls) {
    var state = {
        exitCode: 0,
        messages: []
    };
    if (!exmls || exmls.length == 0)
        return state;
    return state;
}
exports.buildChanges = buildChanges;
function afterBuild() {
    updateSetting(egret.args.publish);
    generateExmlDTS();
}
exports.afterBuild = afterBuild;
function afterBuildChanges(exmlsChanged) {
    afterBuild();
}
exports.afterBuildChanges = afterBuildChanges;
function getSortedEXML() {
    var files = file.search(egret.args.projectDir, "exml");
    var exmls = files.map(function (path) { return ({
        path: path,
        content: file.read(path)
    }); });
    exmls.forEach(function (it) { return it.path = file.getRelativePath(egret.args.projectDir, it.path); });
    exmls = exml.sort(exmls);
    return exmls;
}
function updateSetting(merge) {
    if (merge === void 0) { merge = false; }
    var themeDatas = [];
    //1.找到项目内后缀名为'.thm.json'的主题文件并返回列表
    var themes = searchTheme();
    if (themes.length == 0) {
        return;
    }
    //2.将主题文件读入内存变成json对象
    themeDatas = themes.map(function (t) {
        try {
            var data = JSON.parse(file.read(file.joinPath(egret.args.projectDir, t)));
            return data || {};
        }
        catch (e) {
            return {};
        }
    });
    var oldEXMLS = [];
    //3.主题文件的exmls是一个列表，列表项是一个{path:string,content:string}的格式
    //由于存在一个exml存在于多个主题的情况 把 主题1－>N文件 建立 文件1->N主题的一对多关系表oldEXMLS(数组＋快表)
    themeDatas.forEach(function (thm, i) {
        thm.exmls && thm.exmls.forEach(function (e) {
            var path = e.path ? e.path : e;
            if (oldEXMLS[path]) {
                oldEXMLS[path].theme += themes[i] + ",";
                return;
            }
            var exmlFile = {
                path: path,
                theme: "," + themes[i] + ","
            };
            oldEXMLS[path] = exmlFile;
            oldEXMLS.push(exmlFile);
        });
    });
    //4.获得排序后的所有exml文件列表
    var exmls = getSortedEXML();
    themeDatas.forEach(function (thm) { return thm.exmls = []; });
    exmls.forEach(function (e) {
        var epath = e.path;
        var exmlEl = merge ? { path: e.path, content: e.content } : epath;
        themeDatas.forEach(function (thm, i) {
            if (epath in oldEXMLS) {
                var thmPath = themes[i];
                var exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thmPath + ",") >= 0)
                    thm.exmls.push(exmlEl);
            }
            else
                thm.exmls.push(exmlEl);
        });
    });
    themes.forEach(function (thm, i) {
        if (themeDatas[i].autoGenerateExmlsList == false)
            return;
        var path = file.joinPath(egret.args.projectDir, thm);
        themeDatas[i].autoGenerateExmlsList;
        var thmData = JSON.stringify(themeDatas[i], null, "  ");
        file.save(path, thmData);
    });
}
exports.updateSetting = updateSetting;
function searchTheme() {
    var files = file.searchByFunction(egret.args.projectDir, function (f) { return f.indexOf('.thm.json') > 0; });
    files = files.map(function (it) { return file.getRelativePath(egret.args.projectDir, it); });
    return files;
}
function sort(exmls) {
    var preload = exmls.filter(function (e) { return e.preload; });
}
function getExmlDtsPath() {
    return file.joinPath(egret.args.projectDir, "libs", "exml.e.d.ts");
}
function generateExmlDTS() {
    var sourceList = file.search(egret.args.projectDir, "exml");
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
            //解析exml并返回className和extendName继承关系
            var ret = exml.getDtsInfoFromExml(p);
            //var className = p.substring(srcPath.length, p.length - 5);
            var className = ret.className;
            //className = className.split("/").join(".");
            var index = className.lastIndexOf(".");
            if (index == -1) {
                if (ret.extendName == "") {
                    dts += "declare class " + className + "{\n}\n";
                }
                else {
                    dts += "declare class " + className + " extends " + ret.extendName + "{\n}\n";
                }
            }
            else {
                var moduleName = className.substring(0, index);
                className = className.substring(index + 1);
                if (ret.extendName == "") {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + "{\n}\n}\n";
                }
                else {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + " extends " + ret.extendName + "{\n}\n}\n";
                }
            }
        }
    }
    //保存exml
    var exmlDtsPath = getExmlDtsPath();
    file.save(exmlDtsPath, dts);
    return dts;
}

//# sourceMappingURL=../actions/exml.eui.js.map