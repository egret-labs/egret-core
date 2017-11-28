
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import exml = require("../lib/eui/EXML");
import * as EgretProject from '../project';
import exmlParser = require("../lib/eui/EXMLParser");
var parser = new exmlParser.EXMLParser();


export function build(exmls?: string[]): egret.TaskResult {

    generateExmlDTS();
    if (!exmls) {
        exmls = searchEXML();
    }
    return buildChanges(exmls);
}

function buildChanges(exmls: string[]): egret.TaskResult {

    var state: egret.TaskResult = {
        exitCode: 0,
        messages: []
    };
    if (!exmls || exmls.length == 0)
        return state;
    return state;
}
function getSortedEXML(): exml.EXMLFile[] {

    var files = searchEXML();
    var exmls: exml.EXMLFile[] = files.map(path => ({
        path: path,
        content: file.read(path)
    }));
    exmls.forEach(it => it.path = file.getRelativePath(egret.args.projectDir, it.path));
    exmls = exml.sort(exmls);
    return exmls;
}

function generateThemeData() {
    //1.找到项目内后缀名为'.thm.json'的主题文件并返回列表
    const themeFilenames = searchTheme();
    //2.将主题文件读入内存变成json对象
    const themeDatas = themeFilenames.map(filename => {
        const content = file.read(file.joinPath(egret.args.projectDir, filename))
        const data: egret.EgretEUIThemeConfig = JSON.parse(content);
        data.path = filename;
        return data;
    });
    return themeDatas;
}

export function publishEXML(exmlPublishPolicy?: string) {

    if (!exmlPublishPolicy) {
        exmlPublishPolicy = EgretProject.data.getExmlPublishPolicy();
    }
    const themeDatas = generateThemeData();

    var oldEXMLS: EXMLFile[] = [];
    //3.主题文件的exmls是一个列表，列表项是一个{path:string,content:string}的格式
    //由于存在一个exml存在于多个主题的情况 把 主题1－>N文件 建立 文件1->N主题的一对多关系表oldEXMLS(数组＋快表)
    themeDatas.forEach((theme) => {
        theme.exmls && theme.exmls.forEach(e => {
            var path = e.path ? e.path : e;
            if (oldEXMLS[path]) {
                oldEXMLS[path].theme += theme.path + ",";
                return;
            }
            var exmlFile = {
                path: path,
                theme: "," + theme.path + ","
            }
            oldEXMLS[path] = exmlFile;
            oldEXMLS.push(exmlFile);
        });
    });

    //4.获得排序后的所有exml文件列表
    var exmls = getSortedEXML();

    themeDatas.forEach(theme => theme.exmls = []);

    exmls.forEach(e => {
        var epath = e.path;
        var exmlEl;

        switch (exmlPublishPolicy) {
            case "path":
                exmlEl = epath;
                break;
            case "content":
                exmlEl = { path: e.path, content: e.content };
                break;
            case "gjs":
                let result = parser.parse(e.content);
                exmlEl = { path: e.path, gjs: result.code, className: result.className };
                break;
            case "commonjs":
                let result1 = parser.parse(e.content);
                exmlEl = { path: e.path, gjs: result1.code, className: result1.className };
                break;
            //todo
            case "bin":
                break;
            default:
                exmlEl = { path: e.path, content: e.content };
                break;
        }

        themeDatas.forEach((thm) => {
            if (epath in oldEXMLS) {
                const exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0)
                    thm.exmls.push(exmlEl);
            }
            else if (thm.autoGenerateExmlsList) {
                thm.exmls.push(exmlEl);
            }
        });
    });

    let files = themeDatas.map((thmData) => {
        let path = thmData.path;
        if (exmlPublishPolicy == "commonjs") {
            let content = `window.skins = {};
exports.paths = {};
exports.skins = ${JSON.stringify(thmData.skins)}
`;
            for (let item of thmData.exmls) {
                content += `exports.paths['${item.path}'] = window.${item.className} = ${item.gjs}`;
            }
            path = path.replace("thm.json", "thm.js");
            return { path, content }
        }
        else {
            return { path, content: JSON.stringify(thmData, null, '\t') }
        }
    });
    return files;

}

function searchTheme(): string[] {
    let result = EgretProject.data.getThemes();
    if (result) {
        return result;
    }
    var files = file.searchByFunction(egret.args.projectDir, themeFilter);
    files = files.map(it => file.getRelativePath(egret.args.projectDir, it));
    return files;
}

function searchEXML(): string[] {
    let exmlRoots = EgretProject.data.getExmlRoots();
    if (exmlRoots.length == 1) {
        return file.searchByFunction(exmlRoots[0], exmlFilter);
    }
    else {
        return exmlRoots.reduce(function (previousValue: string[], currentValue: string) {
            previousValue = previousValue.concat(file.searchByFunction(currentValue, exmlFilter));
            return previousValue;
        }, []);
    }
}

const ignorePath = EgretProject.data.getIgnorePath();
function exmlFilter(f: string) {
    var isIgnore = false;
    ignorePath.forEach(path => {
        if (f.indexOf(path) != -1) {
            isIgnore = true;
        }
    });
    return /\.exml$/.test(f) && (f.indexOf(egret.args.releaseRootDir) < 0) && !isIgnore;
}
function themeFilter(f: string) {
    return (f.indexOf('.thm.json') > 0) && (f.indexOf(egret.args.releaseRootDir) < 0);
}

export interface SettingData {
    name: string;
    themes: { [name: string]: string | ThemeData };
    defaultTheme: string;
    exmls: Array<EXMLFile>
}

interface ThemeData {
    skins: { [component: string]: string };
}

interface EXMLFile {
    path: string;
    theme?: string;
    preload?: boolean;
}

function getExmlDtsPath() {
    return file.joinPath(egret.args.projectDir, "libs", "exml.e.d.ts");
}

function generateExmlDTS(): string {
    //去掉重复定义
    var classDefinations = {};
    var sourceList = searchEXML();
    var length = sourceList.length;
    if (length == 0)
        return;
    var dts = "";
    for (let source of sourceList) {
        if (!file.exists(source)) {
            continue;
        }
        var ext = file.getExtension(source).toLowerCase();
        if (ext == "exml") {
            //解析exml并返回className和extendName继承关系
            var ret = exml.getDtsInfoFromExml(source);
            //去掉重复定义
            if (classDefinations[ret.className]) {
                continue;
            } else {
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
                    } else {
                        dts += "declare class " + className + " extends " + ret.extendName + "{\n}\n";
                    }
                }
                else {
                    var moduleName = className.substring(0, index);
                    className = className.substring(index + 1);
                    if (ret.extendName == "") {
                        dts += "declare module " + moduleName + "{\n\tclass " + className + "{\n\t}\n}\n";
                    } else {
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