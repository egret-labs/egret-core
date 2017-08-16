/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var file = require("../lib/FileUtil");
var exml = require("../lib/eui/EXML");
var EgretProject = require("../project/EgretProject");
var exmlParser = require("../lib/eui/EXMLParser");
var parser = new exmlParser.EXMLParser();
function beforeBuild() {
    generateExmlDTS();
}
exports.beforeBuild = beforeBuild;
function beforeBuildChanges(exmlsChanged) {
    generateExmlDTS();
}
exports.beforeBuildChanges = beforeBuildChanges;
function build() {
    var exmls = searchEXML();
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
}
exports.afterBuild = afterBuild;
function afterBuildChanges(exmlsChanged) {
    afterBuild();
}
exports.afterBuildChanges = afterBuildChanges;
function getSortedEXML() {
    var files = searchEXML();
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
        var exmlEl = epath;
        if (merge) {
            var state = EgretProject.data.getExmlPublishPolicy();
            switch (state) {
                case "path":
                    break;
                case "content":
                    exmlEl = { path: e.path, content: e.content };
                    break;
                case "gjs":
                    var result = parser.parse(e.content);
                    exmlEl = { path: e.path, gjs: result.code, className: result.className };
                    break;
                //todo
                case "bin":
                    break;
                default:
                    exmlEl = { path: e.path, content: e.content };
                    break;
            }
        }
        themeDatas.forEach(function (thm, i) {
            if (epath in oldEXMLS) {
                var thmPath = themes[i];
                var exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thmPath + ",") >= 0)
                    thm.exmls.push(exmlEl);
            }
            else if (thm.autoGenerateExmlsList) {
                thm.exmls.push(exmlEl);
            }
        });
    });
    themes.forEach(function (thm, i) {
        var path = file.joinPath(egret.args.projectDir, thm);
        var thmData = JSON.stringify(themeDatas[i], null, "  ");
        file.save(path, thmData);
    });
}
exports.updateSetting = updateSetting;
function searchTheme() {
    var result = EgretProject.data.getThemes();
    if (result) {
        return result;
    }
    var files = file.searchByFunction(egret.args.projectDir, themeFilter);
    files = files.map(function (it) { return file.getRelativePath(egret.args.projectDir, it); });
    return files;
}
function searchEXML() {
    var exmlRoots = EgretProject.data.getExmlRoots();
    if (exmlRoots.length == 1) {
        return file.searchByFunction(exmlRoots[0], exmlFilter);
    }
    else {
        return exmlRoots.reduce(function (previousValue, currentValue) {
            previousValue = previousValue.concat(file.searchByFunction(currentValue, exmlFilter));
            return previousValue;
        }, []);
    }
}
var ignorePath = EgretProject.data.getIgnorePath();
function exmlFilter(f) {
    var isIgnore = false;
    ignorePath.forEach(function (path) {
        if (f.indexOf(path) != -1) {
            isIgnore = true;
        }
    });
    return /\.exml$/.test(f) && (f.indexOf(egret.args.releaseRootDir) < 0) && !isIgnore;
}
function themeFilter(f) {
    return (f.indexOf('.thm.json') > 0) && (f.indexOf(egret.args.releaseRootDir) < 0);
}
function getExmlDtsPath() {
    return file.joinPath(egret.args.projectDir, "libs", "exml.e.d.ts");
}
function generateExmlDTS() {
    //去掉重复定义
    var classDefinations = {};
    var sourceList = searchEXML();
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
            //去掉重复定义
            if (classDefinations[ret.className]) {
                continue;
            }
            else {
                classDefinations[ret.className] = ret.extendName;
            }
            //var className = p.substring(srcPath.length, p.length - 5);
            var className = ret.className;
            //className = className.split("/").join(".");
            if (className != "eui.Skin") {
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
                        dts += "declare module " + moduleName + "{\n\tclass " + className + "{\n\t}\n}\n";
                    }
                    else {
                        dts += "declare module " + moduleName + "{\n\tclass " + className + " extends " + ret.extendName + "{\n\t}\n}\n";
                    }
                }
            }
        }
    }
    //保存exml
    var exmlDtsPath = getExmlDtsPath();
    file.save(exmlDtsPath, dts);
    return dts;
}
