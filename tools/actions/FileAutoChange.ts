/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

import FileUtil = require('../lib/FileUtil');
import project = require("../actions/Project");
import htmlparser = require("../lib/htmlparser");
import doT = require('../lib/doT');


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

export function refreshDebugHtml(htmlPath, gameScripts: string[]) {
    var libsScriptsStr = getModuleScripts();
    var reg = /<!--(\s)*modules_files_start(\s)*-->[\s\S]*<!--(\s)*modules_files_end(\s)*-->/;
    var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';

    var htmlContent = FileUtil.read(htmlPath, true);

    htmlContent = htmlContent.replace(reg, replaceStr);

    let str = gameScripts.map(script => getScript('game', 'bin-debug/' + script)).join("");

    var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
    var replaceStr = '<!--game_files_start-->\n' + str + '\t<!--game_files_end-->';
    htmlContent = htmlContent.replace(reg, replaceStr);

    FileUtil.save(htmlPath, htmlContent);
}

function getScript(type: 'lib' | 'game' | 'none', src, releaseSrc?) {
    switch (type) {
        case 'lib':
            return `\t<script egret="${type}" src="${src}" src-release="${releaseSrc}"></script>\n'`
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
function getModuleScripts() {
    var properties = egret.args.properties;
    let projectRoot = properties.getProjectRoot();
    var modules = properties.getAllModuleNames();
    var str = "";
    for (let moduleName of modules) {
        var debugJs = "";
        var releaseJs = "";

        var moduleReRoot = 'libs/modules/' + moduleName + "/";

        var jsDebugpath = FileUtil.joinPath(projectRoot, moduleReRoot, moduleName + ".js");
        var jsReleasepath = FileUtil.joinPath(projectRoot, moduleReRoot, moduleName + ".min.js");
        if (FileUtil.exists(jsDebugpath)) {
            debugJs = moduleReRoot + moduleName + ".js";
        }

        if (FileUtil.exists(jsReleasepath)) {
            releaseJs = moduleReRoot + moduleName + ".min.js";
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
        jsDebugpath = FileUtil.joinPath(projectRoot, moduleReRoot, moduleName + ".web.js");
        jsReleasepath = FileUtil.joinPath(projectRoot, moduleReRoot, moduleName + ".web.min.js");
        if (FileUtil.exists(jsDebugpath)) {
            debugJs = moduleReRoot + moduleName + ".web.js";
        }

        if (FileUtil.exists(jsReleasepath)) {
            releaseJs = moduleReRoot + moduleName + ".web.min.js";
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

export function refreshNativeRequire(htmlPath, isDebug) {
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

    var optionStr = getNativeProjectInfo(htmlPath);
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

function getNativeProjectInfo(html: string) {
    if (!FileUtil.exists(html))
        return;
    var content = FileUtil.read(html, true);

    var projs = project.parseProjectInfo(content);
    var proj: egret.EgretProjectConfig;
    if (projs.length == 0) {
        proj = {};
    } else {
        proj = projs[0];
    }

    var optionStr =
        'entryClassName: "{{=it.entryClass}}",\n\t\t' +
        'frameRate: {{=it.frameRate}},\n\t\t' +
        'scaleMode: "{{=it.scaleMode}}",\n\t\t' +
        'contentWidth: {{=it.contentWidth}},\n\t\t' +
        'contentHeight: {{=it.contentHeight}},\n\t\t' +
        'showPaintRect: {{=it.showPaintRect}},\n\t\t' +
        'showFPS: {{=it.showFPS}},\n\t\t' +
        'fpsStyles: "{{=it.fpsStyles}}",\n\t\t' +
        'showLog: {{=it.showLog}},\n\t\t' +
        'logFilter: "{{=it.logFilter}}",\n\t\t' +
        'maxTouches: {{=it.maxTouches}},\n\t\t' +
        'textureScaleFactor: 1';

    var temp = doT.template(optionStr);
    optionStr = temp(proj);

    return optionStr;
}
