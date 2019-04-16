
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Path = require('path');
import file = require('../lib/FileUtil');
import * as exml from '../lib/eui/EXML';
import * as EgretProject from '../project';
import exmlParser = require("../lib/eui/EXMLParser");
import jsonParser = require("../lib/eui/JSONParser");
export let isOneByOne: boolean;

export function publishEXML(exmls: exml.EXMLFile[], exmlPublishPolicy: string, themeDatas: egret.EgretEUIThemeConfig[]) {
    if (exmlPublishPolicy == 'debug') {
        exmlPublishPolicy = 'path';
    }

    var oldEXMLS: EXMLFile[] = [];
    //3.将所有的exml信息取出来
    themeDatas.forEach((theme) => {
        if (!theme.exmls || theme.autoGenerateExmlsList) {
            theme.exmls = [];
            for (let exml of exmls) {
                theme.exmls.push(exml.filename);
            }
        }
    })
    //4.主题文件的exmls是一个列表，列表项是一个{path:string,content:string}的格式
    //由于存在一个exml存在于多个主题的情况 把 主题1－>N文件 建立 文件1->N主题的一对多关系表oldEXMLS(数组＋快表)
    let paths: string[] = []
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
            paths.push(path);
        });
    });
    //5.获得排序后的所有exml文件列表
    exmls = exml.sort(exmls);
    //6.对exml文件列表进行筛选
    let screenExmls = []
    let versionExmlHash = {};
    for (let exml of exmls) {
        for (let path of paths) {
            // if (path === exml.filename) {
            //     screenExmls.push(exml);
            // }
            if (path.indexOf(exml.filename) > -1) {
                screenExmls.push(exml);
                versionExmlHash[exml.filename] = path;
                versionExmlHash[path] = exml.filename;
            }
        }
    }

    /**
     * 因为底下发布策略是修改thm.json的元数据， 最后将写道thm.js中，gjs模式还会改变这个文件的格式
     * 在这里直接对做完排序的文件进行autoGenerateExmlsList属性的支持
     * todo：json应该直接维护好自己的，下面的发布最好改成新开辟一块空间做，而不是混在一起，虽然在commonjs或是gjs等模式下thm.json 已经不用了，但是这个文件很难做版本控制
     */
    //7.对于autoGenerateExmlsList属性的支持，是否将新的信息写回
    themeDatas.forEach(theme => theme.exmls = []);
    screenExmls.forEach(e => {
        exmlParser.fileSystem.set(e.filename, e);
        var epath = versionExmlHash[e.filename];
        themeDatas.forEach((thm) => {
            if (epath in oldEXMLS) {
                const exmlFile = oldEXMLS[epath];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0) {
                    thm.exmls.push(epath);
                }
            }
        });
    })
    themeDatas.map((thmData) => {
        if (thmData.autoGenerateExmlsList) {
            file.save(Path.join(egret.args.projectDir, thmData.path), JSON.stringify(thmData, null, '\t'));
        }
    })
    themeDatas.forEach(theme => theme.exmls = []);
    screenExmls.forEach(e => {
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
                let result = parser.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result.code, className: result.className };
                break;
            case "commonjs":
                var parser1 = new exmlParser.EXMLParser();
                let result1 = parser1.parse(e.contents);
                exmlEl = { path: e.filename, gjs: result1.code, className: result1.className };
                break;
            //todo
            case "commonjs2":
                var parser2 = new jsonParser.JSONParser();
                isOneByOne = false;
                let result2 = parser2.parse(e.contents, e.filename);
                exmlEl = { path: e.filename, className: result2.className };
                break;
            case "json":
                var parser3 = new jsonParser.JSONParser();
                isOneByOne = true;
                let result3 = parser3.parse(e.contents, e.filename);
                exmlEl = { path: e.filename, json: result3.json, className: result3.className };
                break;
            //todo
            case "bin":
                break;
            default:
                exmlEl = { path: e.filename, content: e.contents };
                break;
        }
        themeDatas.forEach((thm) => {
            if (versionExmlHash[epath] in oldEXMLS) {
                const exmlFile = oldEXMLS[versionExmlHash[epath]];
                if (exmlFile.theme.indexOf("," + thm.path + ",") >= 0)
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
                };`;
            content += `
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = ${JSON.stringify(thmData.styles)};
                generateEUI.skins = ${JSON.stringify(thmData.skins)};`;


            let namespaces = [];
            for (let item of thmData.exmls) {
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
            let result = namespaces.map(v => `window.${v}=window.${v}||{};`).join("\n");
            content = result + content;
            path = path.replace("thm.json", "thm.js");
            return { path, content }
        }
        else if (exmlPublishPolicy == "commonjs2" || exmlPublishPolicy == "json") {
            if (jsonParser.isError) {
                //已经存在错误了终止
                global.globals.exit()
            }
            let jsonParserStr = file.read(Path.join(egret.root, "tools/lib/eui/JsonParserFactory.js"));
            let content = `${jsonParserStr}`
            content +=
                `window.generateEUI2 = {};
generateEUI2.paths = {};
generateEUI2.styles = ${JSON.stringify(thmData.styles)};
generateEUI2.skins = ${JSON.stringify(thmData.skins)};`;
            path = path.replace("thm.json", "thm.js");
            if (exmlPublishPolicy == "json") {
                content = content.replace(/generateEUI2/g, "generateJSON")
            }
            return { path, content }
        }
        else {
            return { path, content: JSON.stringify(thmData, null, '\t') }
        }
    });
    if (exmlPublishPolicy == "commonjs2") {
        let EuiJson: { path: string, json: string }[] = [];
        let json = jsonParser.eui.toCode();
        if (json == "") {
            json = "{}"
        }
        EuiJson.push({ path: "resource/gameEui.json", json: json });
        return { "files": files, "EuiJson": EuiJson };
    } else if (exmlPublishPolicy == "json") {
        let EuiJson: { path: string, json: string }[] = [];
        for (let theme of themeDatas) {
            for (let json of theme.exmls) {
                let dirPath = json.path.replace(".exml", "_EUI.json");
                let dataJson = json.json;
                let data = { path: dirPath, json: dataJson }
                EuiJson.push(data);
            }
        }
        return { "files": files, "EuiJson": EuiJson };
    }
    else {
        return { "files": files };
    }

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
