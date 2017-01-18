/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

import FileUtil = require('../lib/FileUtil');
import project = require("../actions/Project");
import htmlparser = require("../lib/htmlparser");
import doT = require('../lib/doT');
import * as EgretProject from '../parser/EgretProject';


export function changeHtmlToRelease(htmlPath) {

    var htmlContent = FileUtil.read(htmlPath);

    //替换使用 html 中的 src-release 目录
    var reg = /src[^>]*src-release/g;
    htmlContent = htmlContent.replace(reg, "src");

    //替换 game_files 脚本
    var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
    var replaceStr = '<!--game_files_start-->\n' + getScript("none", "main.min.js") + '\t<!--game_files_end-->';
    htmlContent = htmlContent.replace(reg, replaceStr);

    FileUtil.save(htmlPath, htmlContent);
}

export function modifyNativeRequire(isDebug: boolean) {
    let indexHTML = EgretProject.utils.getFilePath('index.html');
    return refreshNativeRequire(indexHTML, isDebug);
}

export function modifyIndexHTML(scripts?: string[]) {

    let projectDir = EgretProject.utils.getProjectRoot();
    let list = FileUtil.getDirectoryListing(projectDir).filter(filepath => FileUtil.getExtension(filepath) == "html");
    list.forEach(htmlFilePath => refreshDebugHtml(htmlFilePath, scripts));
}


function refreshDebugHtml(htmlPath, gameScripts?: string[]) {
    var libsScriptsStr = getModuleScripts();
    var reg = /<!--(\s)*modules_files_start(\s)*-->[\s\S]*<!--(\s)*modules_files_end(\s)*-->/;
    var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';

    var htmlContent = FileUtil.read(htmlPath, true);

    htmlContent = htmlContent.replace(reg, replaceStr);
    if (gameScripts) {
        let str = gameScripts.map(script => getScript('game', 'bin-debug/' + script)).join("");
        var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
        var replaceStr = '<!--game_files_start-->\n' + str + '\t<!--game_files_end-->';
        htmlContent = htmlContent.replace(reg, replaceStr);
    }


    FileUtil.save(htmlPath, htmlContent);
}

export function copyToLibs() {
    let project = EgretProject.utils;
    let moduleDir = project.getLibraryFolder();
    FileUtil.remove(moduleDir);

    project.getModulesConfig().forEach(m => {
        FileUtil.copy(m.source, project.getFilePath(m.target));
    })
}

function getScript(type: 'lib' | 'game' | 'none', src, releaseSrc?) {
    switch (type) {
        case 'lib':
            return `\t<script egret="${type}" src="${src}" src-release="${releaseSrc}"></script>\n`
            break;
        case 'game':
            return `\t<script egret="${type}" src="${src}"></script>\n`;
            break;
        case 'none':
            return `\t<script  src="${src}"></script>\n`;
            break;
    }
}

//只刷新 modules
export function getModuleScripts() {
    var properties = EgretProject.utils;
    let projectRoot = properties.getProjectRoot();
    var modules = properties.getModulesConfig();
    var str = "";
    for (let m of modules) {
        let moduleName = m.name;
        let targetFolder = m.target;
        var debugJs = "";
        var releaseJs = "";
        var jsDebugpath = FileUtil.joinPath(projectRoot, targetFolder, moduleName + ".js");
        var jsReleasepath = FileUtil.joinPath(projectRoot, targetFolder, moduleName + ".min.js");
        
        if (FileUtil.exists(jsDebugpath)) {
            debugJs = targetFolder + moduleName + ".js";
        }

        if (FileUtil.exists(jsReleasepath)) {
            releaseJs = targetFolder + moduleName + ".min.js";
        }

        if (debugJs == "") {
            debugJs = releaseJs;
        }
        if (releaseJs == "") {
            releaseJs = debugJs;
        }

        if (debugJs != "") {
            str += getScript('lib', debugJs, releaseJs);
        }

        debugJs = "";
        releaseJs = "";
        jsDebugpath = FileUtil.joinPath(projectRoot, targetFolder, moduleName + ".web.js");
        jsReleasepath = FileUtil.joinPath(projectRoot, targetFolder, moduleName + ".web.min.js");
        if (FileUtil.exists(jsDebugpath)) {
            debugJs = targetFolder + moduleName + ".web.js";
        }

        if (FileUtil.exists(jsReleasepath)) {
            releaseJs = targetFolder + moduleName + ".web.min.js";
        }

        if (debugJs == "") {
            debugJs = releaseJs;
        }
        if (releaseJs == "") {
            releaseJs = debugJs;
        }

        if (debugJs != "") {
            str += getScript('lib', debugJs, releaseJs);
        }
    }
    return str;
}

function refreshNativeRequire(htmlPath, isDebug) {
    var options = egret.args;
    //生成 获取列表
    var listInfo = getLibsList(FileUtil.read(htmlPath), true, isDebug);

    var allList = [];
    if (!isDebug) {
        allList = listInfo.libs.concat(["main.min.js"]);
    }
    else {
        allList = listInfo.libs.concat(listInfo.game);
    }

    var listStr = "\n";
    allList.forEach(function (filepath) {
        listStr += '\t"' + filepath + '",\n';
    });

    var requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
    var requireContent = FileUtil.read(requirePath);
    if (requireContent == "") {
        globals.exit(10021);
    }
    var reg = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
    var replaceStr = '\/\/----auto game_file_list start----' + listStr + '\t\/\/----auto game_file_list end----';
    requireContent = requireContent.replace(reg, replaceStr);

    var optionStr = project.getNativeProjectInfo(htmlPath);
    var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
    var replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
    requireContent = requireContent.replace(reg, replaceStr);

    FileUtil.save(requirePath, requireContent);

    return listInfo;
}

function getLibsList(html: string, isNative: boolean, isDebug: boolean) {
    var gameList: string[] = [];
    var libsList: string[] = [];

    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var resultArr: string[] = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(d => visitDom(d));

    return { game: gameList, libs: libsList };

    function visitDom(el: htmlparser.Element) {
        if (el.type == "script" && el.attribs && el.attribs["egret"]) {
            if (isDebug) {
                var src = el.attribs['src'];
                if (isNative) {
                    src = src.replace(".web.", ".native.");
                }

                if (el.attribs["egret"] == "lib") {
                    libsList.push(src);
                }
                else {
                    gameList.push(src);
                }
            }
            else {
                var src = el.attribs['src-release'] || el.attribs['src'];
                if (isNative) {
                    src = src.replace(".web.", ".native.");

                    if (el.attribs["egret"] == "lib") {
                        libsList.push(src);
                    }
                    else {
                        gameList.push(src);
                    }
                }

            }
            if (src) {
                resultArr.push(src);
            }
        }

        if (el.children) {
            el.children.forEach(e => visitDom(e));
        }
    }
}