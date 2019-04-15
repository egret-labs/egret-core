/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var file = require("../lib/FileUtil");
var exml = require("../lib/eui/EXML");
var exmlParser = require("../lib/eui/EXMLParser");
var jsonParser = require("../lib/eui/JSONParser");
function publishEXML(exmls, exmlPublishPolicy, themeDatas) {
    if (exmlPublishPolicy == 'debug') {
        exmlPublishPolicy = 'path';
    }
    var oldEXMLS = [];
    //3.将所有的exml信息取出来
    themeDatas.forEach(function (theme) {
        if (!theme.exmls || theme.autoGenerateExmlsList) {
            theme.exmls = [];
            for (var _i = 0, exmls_2 = exmls; _i < exmls_2.length; _i++) {
                var exml_1 = exmls_2[_i];
                theme.exmls.push(exml_1.filename);
            }
        }
    });
    //4.主题文件的exmls是一个列表，列表项是一个{path:string,content:string}的格式
    //由于存在一个exml存在于多个主题的情况 把 主题1－>N文件 建立 文件1->N主题的一对多关系表oldEXMLS(数组＋快表)
    var paths = [];
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
            paths.push(path);
        });
    });
    //5.获得排序后的所有exml文件列表
    exmls = exml.sort(exmls);
    //6.对exml文件列表进行筛选
    var screenExmls = [];
    var versionExmlHash = {};
    for (var _i = 0, exmls_1 = exmls; _i < exmls_1.length; _i++) {
        var exml_2 = exmls_1[_i];
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            // if (path === exml.filename) {
            //     screenExmls.push(exml);
            // }
            if (path.indexOf(exml_2.filename) > -1) {
                screenExmls.push(exml_2);
                versionExmlHash[exml_2.filename] = path;
                versionExmlHash[path] = exml_2.filename;
            }
        }
    }
    /**
     * 因为底下发布策略是修改thm.json的元数据， 最后将写道thm.js中，gjs模式还会改变这个文件的格式
     * 在这里直接对做完排序的文件进行autoGenerateExmlsList属性的支持
     * todo：json应该直接维护好自己的，下面的发布最好改成新开辟一块空间做，而不是混在一起，虽然在commonjs或是gjs等模式下thm.json 已经不用了，但是这个文件很难做版本控制
     */
    //7.对于autoGenerateExmlsList属性的支持，是否将新的信息写回
    themeDatas.forEach(function (theme) { return theme.exmls = []; });
    screenExmls.forEach(function (e) {
        exmlParser.fileSystem.set(e.filename, e);
        var epath = versionExmlHash[e.filename];
        themeDatas.forEach(function (thm) {
            if (epath in oldEXMLS) {
                var exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0) {
                    thm.exmls.push(epath);
                }
            }
        });
    });
    themeDatas.map(function (thmData) {
        if (thmData.autoGenerateExmlsList) {
            file.save(Path.join(egret.args.projectDir, thmData.path), JSON.stringify(thmData, null, '\t'));
        }
    });
    themeDatas.forEach(function (theme) { return theme.exmls = []; });
    screenExmls.forEach(function (e) {
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
                var parser = new exmlParser.EXMLParser();
                var result = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result.code, className: result.className };
                break;
            case "commonjs":
                var parser1 = new exmlParser.EXMLParser();
                var result1 = parser1.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result1.code, className: result1.className };
                break;
            //todo
            case "commonjs2":
                var parser2 = new jsonParser.JSONParser();
                exports.isOneByOne = false;
                var result2 = parser2.parse(e.contents, e.filename);
                exmlEl = { path: e.filename, className: result2.className };
                break;
            case "json":
                var parser3 = new jsonParser.JSONParser();
                exports.isOneByOne = true;
                var result3 = parser3.parse(e.contents, e.filename);
                exmlEl = { path: e.filename, json: result3.json, className: result3.className };
                break;
            //todo
            case "bin":
                break;
            default:
                exmlEl = { path: e.filename, content: e.contents };
                break;
        }
        themeDatas.forEach(function (thm) {
            if (versionExmlHash[epath] in oldEXMLS) {
                var exmlFile = oldEXMLS[versionExmlHash[epath]];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0)
                    thm.exmls.push(exmlEl);
            }
        });
    });
    var files = themeDatas.map(function (thmData) {
        var path = thmData.path;
        if (exmlPublishPolicy == "commonjs") {
            var content = "\n                function __extends(d, b) {\n                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n                        function __() {\n                            this.constructor = d;\n                        }\n                    __.prototype = b.prototype;\n                    d.prototype = new __();\n                };";
            content += "\n                window.generateEUI = {};\n                generateEUI.paths = {};\n                generateEUI.styles = " + JSON.stringify(thmData.styles) + ";\n                generateEUI.skins = " + JSON.stringify(thmData.skins) + ";";
            var namespaces = [];
            for (var _i = 0, _a = thmData.exmls; _i < _a.length; _i++) {
                var item = _a[_i];
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
            var result = namespaces.map(function (v) { return "window." + v + "=window." + v + "||{};"; }).join("\n");
            content = result + content;
            path = path.replace("thm.json", "thm.js");
            return { path: path, content: content };
        }
        else if (exmlPublishPolicy == "commonjs2" || exmlPublishPolicy == "json") {
            if (jsonParser.isError) {
                //已经存在错误了终止
                global.globals.exit();
            }
            var jsonParserStr = file.read(Path.join(egret.root, "tools/lib/eui/JsonParserFactory.js"));
            var content = "" + jsonParserStr;
            content +=
                "window.generateEUI2 = {};\ngenerateEUI2.paths = {};\ngenerateEUI2.styles = " + JSON.stringify(thmData.styles) + ";\ngenerateEUI2.skins = " + JSON.stringify(thmData.skins) + ";";
            path = path.replace("thm.json", "thm.js");
            if (exmlPublishPolicy == "json") {
                content = content.replace(/generateEUI2/g, "generateJSON");
            }
            return { path: path, content: content };
        }
        else {
            return { path: path, content: JSON.stringify(thmData, null, '\t') };
        }
    });
    if (exmlPublishPolicy == "commonjs2") {
        var EuiJson = [];
        var json = jsonParser.eui.toCode();
        if (json == "") {
            json = "{}";
        }
        EuiJson.push({ path: "resource/gameEui.json", json: json });
        return { "files": files, "EuiJson": EuiJson };
    }
    else if (exmlPublishPolicy == "json") {
        var EuiJson = [];
        for (var _b = 0, themeDatas_1 = themeDatas; _b < themeDatas_1.length; _b++) {
            var theme = themeDatas_1[_b];
            for (var _c = 0, _d = theme.exmls; _c < _d.length; _c++) {
                var json = _d[_c];
                var dirPath = json.path.replace(".exml", "_EUI.json");
                var dataJson = json.json;
                var data = { path: dirPath, json: dataJson };
                EuiJson.push(data);
            }
        }
        return { "files": files, "EuiJson": EuiJson };
    }
    else {
        return { "files": files };
    }
}
exports.publishEXML = publishEXML;
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
