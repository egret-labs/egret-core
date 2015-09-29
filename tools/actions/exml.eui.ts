
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import exml = require("../lib/eui/EXML");

export function beforeBuild() {

}
export function beforeBuildChanges(exmlsChanged: egret.FileChanges) {

}

export function build(): egret.TaskResult {
    var exmls = file.search(egret.args.projectDir, 'exml');
    return buildChanges(exmls);
}

export function buildChanges(exmls: string[]): egret.TaskResult {

    var state: egret.TaskResult = {
        exitCode: 0,
        messages: []
    };

    if (!exmls || exmls.length == 0)
        return state;

    return state;
}

export function afterBuild() {
    updateSetting(egret.args.publish);
}
export function afterBuildChanges(exmlsChanged: egret.FileChanges) {
    afterBuild();
}




function getSortedEXML(): exml.EXMLFile[] {

    var files = file.search(egret.args.projectDir, "exml");
    var exmls: exml.EXMLFile[] = files.map(path=> ({
        path: path,
        content: file.read(path)
    }));
    exmls.forEach(it=> it.path = file.getRelativePath(egret.args.projectDir, it.path));
    exmls = exml.sort(exmls);
    return exmls;
}


export function updateSetting(merge = false) {

    var themeDatas: egret.ILarkTheme[] = [];

    var themes = searchTheme();
    if (themes.length == 0) {
        return;
    }

    themeDatas = themes.map(t=> {
        try {
            var data = JSON.parse(file.read(file.joinPath(egret.args.projectDir, t)));
            return data || {};
        }
        catch (e) {
            return {};
        }
    });

    var oldEXMLS: EXMLFile[] = [];

    themeDatas.forEach((thm, i) => {
        thm.exmls && thm.exmls.forEach(e=> {
            var path = e.path ? e.path : e;
            if (oldEXMLS[path]) {
                oldEXMLS[path].theme += themes[i] + ",";
                return;
            }
            var exmlFile = {
                path: path,
                theme: "," + themes[i] + ","
            }
            oldEXMLS[path] = exmlFile;
            oldEXMLS.push(exmlFile);
        });
    });


    var exmls = getSortedEXML();

    themeDatas.forEach(thm=> thm.exmls = []);

    exmls.forEach(e=> {
        var epath = e.path;
        var exmlEl = merge ? { path: e.path, content: e.content } : epath;
        themeDatas.forEach((thm, i) => {
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


    themes.forEach((thm, i) => {
        if (themeDatas[i].autoGenerateExmlsList == false)
            return;
        var path = file.joinPath(egret.args.projectDir, thm);
        themeDatas[i].autoGenerateExmlsList;
        var thmData = JSON.stringify(themeDatas[i], null, "  ");
        file.save(path, thmData);
    });

}

function searchTheme(): string[] {
    var files = file.searchByFunction(egret.args.projectDir, f=> f.indexOf('.thm.json') > 0);
    files = files.map(it=> file.getRelativePath(egret.args.projectDir, it));
    console.log(files);
    return files;
}

function sort(exmls: exml.EXMLFile[]) {

    var preload = exmls.filter(e=> e.preload);


}


export interface SettingData {
    name: string;
    themes: { [name: string]: string|ThemeData };
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