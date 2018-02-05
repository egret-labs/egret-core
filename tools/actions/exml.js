/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var file = require("../lib/FileUtil");
var exml = require("../lib/eui/EXML");
var EgretProject = require("../project");
var exmlParser = require("../lib/eui/EXMLParser");
var parser = new exmlParser.EXMLParser();
function generateThemeData() {
    //1.找到项目内后缀名为'.thm.json'的主题文件并返回列表
    var themeFilenames = searchTheme();
    //2.将主题文件读入内存变成json对象
    var themeDatas = themeFilenames.map(function (filename) {
        var content = file.read(file.joinPath(egret.args.projectDir, filename));
        var data = JSON.parse(content);
        data.path = filename;
        return data;
    });
    return themeDatas;
}
function publishEXML(exmls, exmlPublishPolicy) {
    if (!exmlPublishPolicy || exmlPublishPolicy == "default") {
        exmlPublishPolicy = EgretProject.projectData.getExmlPublishPolicy();
    }
    else if (exmlPublishPolicy == 'debug') {
        exmlPublishPolicy = 'path';
    }
    var themeDatas = generateThemeData();
    var oldEXMLS = [];
    //3.主题文件的exmls是一个列表，列表项是一个{path:string,content:string}的格式
    //由于存在一个exml存在于多个主题的情况 把 主题1－>N文件 建立 文件1->N主题的一对多关系表oldEXMLS(数组＋快表)
    themeDatas.forEach(function (theme) {
        theme.exmls && theme.exmls.forEach(function (e) {
            var path = e.path ? e.path : e;
            if (oldEXMLS[path]) {
                oldEXMLS[path].theme += theme.path + ",";
                return;
            }
            var exmlFile = {
                path: path,
                theme: "," + theme.path + ","
            };
            oldEXMLS[path] = exmlFile;
            oldEXMLS.push(exmlFile);
        });
    });
    //4.获得排序后的所有exml文件列表
    exmls = exml.sort(exmls);
    themeDatas.forEach(function (theme) { return theme.exmls = []; });
    exmls.forEach(function (e) {
        exmlParser.fileSystem.set(e.filename, e);
        var epath = e.filename;
        var exmlEl;
        switch (exmlPublishPolicy) {
            case "path":
                exmlEl = epath;
                break;
            case "content":
                exmlEl = { path: e.filename, content: e.contents };
                break;
            case "gjs":
                var result = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result.code, className: result.className };
                break;
            case "commonjs":
                var result1 = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result1.code, className: result1.className };
                break;
            //todo
            case "bin":
                break;
            default:
                exmlEl = { path: e.filename, content: e.contents };
                break;
        }
        themeDatas.forEach(function (thm) {
            if (epath in oldEXMLS) {
                var exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0)
                    thm.exmls.push(exmlEl);
            }
            else if (thm.autoGenerateExmlsList) {
                thm.exmls.push(exmlEl);
            }
        });
    });
    var files = themeDatas.map(function (thmData) {
        var path = thmData.path;
        if (exmlPublishPolicy == "commonjs") {
            var content = "\nfunction __extends(d, b) {\n    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n        function __() {\n            this.constructor = d;\n        }\n    __.prototype = b.prototype;\n    d.prototype = new __();\n};\n";
            content += "window.generateEUI = {};\ngenerateEUI.paths = {};\ngenerateEUI.styles = " + JSON.stringify(thmData.styles) + ";\ngenerateEUI.skins = " + JSON.stringify(thmData.skins) + "\n";
            var namespaces = [];
            for (var _i = 0, _a = thmData.exmls; _i < _a.length; _i++) {
                var item = _a[_i];
                // skins.items = {};
                //skins.items.EUIComponent
                //items.EUIComponent;
                var packages = item.className.split(".");
                var temp = '';
                for (var i = 0; i < packages.length - 1; i++) {
                    temp = i == 0 ? packages[i] : temp + "." + packages[i];
                    if (namespaces.indexOf(temp) == -1) {
                        namespaces.push(temp);
                    }
                }
                content += "generateEUI.paths['" + item.path + "'] = window." + item.className + " = " + item.gjs;
            }
            var result = namespaces.map(function (v) { return "window." + v + "={};"; }).join("\n");
            content = result + content;
            path = path.replace("thm.json", "thm.js");
            return { path: path, content: content };
        }
        else {
            return { path: path, content: JSON.stringify(thmData, null, '\t') };
        }
    });
    return files;
}
exports.publishEXML = publishEXML;
function searchTheme() {
    var result = EgretProject.projectData.getThemes();
    if (result) {
        return result;
    }
    var files = file.searchByFunction(egret.args.projectDir, themeFilter);
    files = files.map(function (it) { return file.getRelativePath(egret.args.projectDir, it); });
    return files;
}
var ignorePath = EgretProject.projectData.getIgnorePath();
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
function generateExmlDTS(exmls) {
    //去掉重复定义
    var classDefinations = {};
    var sourceList = exmls; // ? exmls.map(exml => exml.filename) : searchEXML();
    var dts = "";
    for (var _i = 0, sourceList_1 = sourceList; _i < sourceList_1.length; _i++) {
        var source = sourceList_1[_i];
        //解析exml并返回className和extendName继承关系
        var result = exml.getDtsInfoFromExml(source);
        //去掉重复定义
        if (classDefinations[result.className]) {
            continue;
        }
        else {
            classDefinations[result.className] = result.extendName;
        }
        //var className = p.substring(srcPath.length, p.length - 5);
        var className = result.className;
        //className = className.split("/").join(".");
        if (className != "eui.Skin") {
            var index = className.lastIndexOf(".");
            if (index == -1) {
                if (result.extendName == "") {
                    dts += "declare class " + className + "{\n}\n";
                }
                else {
                    dts += "declare class " + className + " extends " + result.extendName + "{\n}\n";
                }
            }
            else {
                var moduleName = className.substring(0, index);
                className = className.substring(index + 1);
                if (result.extendName == "") {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + "{\n\t}\n}\n";
                }
                else {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + " extends " + result.extendName + "{\n\t}\n}\n";
                }
            }
        }
    }
    return dts;
}
exports.generateExmlDTS = generateExmlDTS;
