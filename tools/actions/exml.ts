﻿
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import * as exml from '../lib/eui/EXML';
import * as EgretProject from '../project';
import exmlParser = require("../lib/eui/EXMLParser");
var parser = new exmlParser.EXMLParser();



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

export function publishEXML(exmls: exml.EXMLFile[], exmlPublishPolicy: string) {
    if (!exmlPublishPolicy || exmlPublishPolicy == "default") {
        exmlPublishPolicy = EgretProject.projectData.getExmlPublishPolicy();
    }
    else if (exmlPublishPolicy == 'debug') {
        exmlPublishPolicy = 'path';
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
    exmls = exml.sort(exmls);

    themeDatas.forEach(theme => theme.exmls = []);

    exmls.forEach(e => {
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
                let result = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result.code, className: result.className };
                break;
            case "commonjs":
                let result1 = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result1.code, className: result1.className };
                break;
            //todo
            case "bin":
                break;
            default:
                exmlEl = { path: e.filename, content: e.contents };
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
            let content = `
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
    __.prototype = b.prototype;
    d.prototype = new __();
};
`;
            content += `window.generateEUI = {};
generateEUI.paths = {};
generateEUI.styles = ${JSON.stringify(thmData.styles)};
generateEUI.skins = ${JSON.stringify(thmData.skins)}
`;


            let namespaces = [];

            for (let item of thmData.exmls) {
                // skins.items = {};
                //skins.items.EUIComponent
                //items.EUIComponent;
                let packages: string[] = item.className.split(".")
                let temp = '';
                for (let i = 0; i < packages.length - 1; i++) {
                    temp = i == 0 ? packages[i] : temp + "." + packages[i];
                    if (namespaces.indexOf(temp) == -1) {
                        namespaces.push(temp);
                    }
                }

                content += `generateEUI.paths['${item.path}'] = window.${item.className} = ${item.gjs}`;
            }
            let result = namespaces.map(v => `window.${v}={};`).join("\n");
            content = result + content;
            path = path.replace("thm.json", "thm.js");
            return { path, content }
        }
        else {
            return { path, content: JSON.stringify(thmData, null, '\t') }
        }
    });
    return files;

}

function searchTheme() {
    let result = EgretProject.projectData.getThemes();
    if (result) {
        return result;
    }
    var files = file.searchByFunction(egret.args.projectDir, themeFilter);
    files = files.map(it => file.getRelativePath(egret.args.projectDir, it));
    return files;
}

const ignorePath = EgretProject.projectData.getIgnorePath();
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

export function generateExmlDTS(exmls: exml.EXMLFile[]) {
    //去掉重复定义
    var classDefinations = {};
    var sourceList = exmls// ? exmls.map(exml => exml.filename) : searchEXML();
    var dts = "";
    for (let source of sourceList) {
        //解析exml并返回className和extendName继承关系
        var result = exml.getDtsInfoFromExml(source);
        //去掉重复定义
        if (classDefinations[result.className]) {
            continue;
        } else {
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
                } else {
                    dts += "declare class " + className + " extends " + result.extendName + "{\n}\n";
                }
            }
            else {
                var moduleName = className.substring(0, index);
                className = className.substring(index + 1);
                if (result.extendName == "") {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + "{\n\t}\n}\n";
                } else {
                    dts += "declare module " + moduleName + "{\n\tclass " + className + " extends " + result.extendName + "{\n\t}\n}\n";
                }
            }
        }
    }
    return dts;
}