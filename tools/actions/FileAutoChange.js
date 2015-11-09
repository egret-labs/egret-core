/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var project = require("../actions/Project");
var htmlparser = require("../lib/htmlparser");
var doT = require('../lib/doT');
var FileAutoChangeCommand = (function () {
    function FileAutoChangeCommand() {
    }
    FileAutoChangeCommand.prototype.execute = function () {
        return 0;
    };
    FileAutoChangeCommand.prototype.changeHtmlToRelease = function (htmlPath) {
        var htmlContent = FileUtil.read(htmlPath);
        //替换使用 html 中的 src-release 目录
        var reg = /src[^>]*src-release/g;
        htmlContent = htmlContent.replace(reg, "src");
        //替换 game_files 脚本
        var reg = /<!--game_files_start-->[\s\S]*<!--game_files_end-->/;
        var replaceStr = '<!--game_files_start-->\n' + '\t<script src="main.min.js"></script>\n' + '\t<!--game_files_end-->';
        htmlContent = htmlContent.replace(reg, replaceStr);
        FileUtil.save(htmlPath, htmlContent);
    };
    FileAutoChangeCommand.prototype.refreshDebugHtml = function (htmlPath, gameScripts) {
        var libsScriptsStr = this.getModuleScripts();
        var reg = /<!--modules_files_start-->[\s\S]*<!--modules_files_end-->/;
        var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';
        var htmlContent = FileUtil.read(htmlPath);
        htmlContent = htmlContent.replace(reg, replaceStr);
        var str = "";
        for (var tempK in gameScripts) {
            var script = gameScripts[tempK];
            var debugJs = "";
            debugJs = 'bin-debug/' + script;
            str += '\t<script egret="game" src="' + debugJs + '"></script>\n';
        }
        var reg = /<!--game_files_start-->[\s\S]*<!--game_files_end-->/;
        var replaceStr = '<!--game_files_start-->\n' + str + '\t<!--game_files_end-->';
        htmlContent = htmlContent.replace(reg, replaceStr);
        FileUtil.save(htmlPath, htmlContent);
    };
    //只刷新 modules
    FileAutoChangeCommand.prototype.getModuleScripts = function () {
        var options = egret.args;
        var properties = egret.args.properties;
        var modules = properties.getAllModuleNames();
        var str = "";
        for (var tempK in modules) {
            var moduleName = modules[tempK];
            var debugJs = "";
            var releaseJs = "";
            var moduleReRoot = 'libs/modules/' + moduleName + "/";
            var jsDebugpath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".js");
            var jsReleasepath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".min.js");
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
                str += '\t<script egret="lib" src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n';
            }
            debugJs = "";
            releaseJs = "";
            jsDebugpath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".web.js");
            jsReleasepath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".web.min.js");
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
                str += '\t<script egret="lib" src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n';
            }
        }
        return str;
    };
    FileAutoChangeCommand.prototype.refreshNativeRequire = function (htmlPath, isDebug) {
        var options = egret.args;
        //生成 获取列表
        var listInfo = this.getLibsList(FileUtil.read(htmlPath), true, isDebug);
        var allList = [];
        if (!isDebug) {
            allList = listInfo["libs"].concat(["main.min.js"]);
        }
        else {
            allList = listInfo["libs"].concat(listInfo["game"]);
        }
        var listStr = "\n";
        allList.forEach(function (filepath) {
            listStr += '\t"' + filepath + '",\n';
        });
        var requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
        var requireContent = FileUtil.read(requirePath);
        var reg = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
        var replaceStr = '\/\/----auto game_file_list start----' + listStr + '\t\/\/----auto game_file_list end----';
        requireContent = requireContent.replace(reg, replaceStr);
        var optionStr = this.getNativeProjectInfo(htmlPath);
        var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        var replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        requireContent = requireContent.replace(reg, replaceStr);
        FileUtil.save(requirePath, requireContent);
        return listInfo;
    };
    FileAutoChangeCommand.prototype.getLibsList = function (html, isNative, isDebug) {
        var gameList = [];
        var libsList = [];
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
            if (error)
                console.log(error);
        });
        var resultArr = [];
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(html);
        handler.dom.forEach(function (d) { return visitDom(d); });
        return { game: gameList, libs: libsList };
        function visitDom(el) {
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
                el.children.forEach(function (e) { return visitDom(e); });
            }
        }
    };
    FileAutoChangeCommand.prototype.getNativeProjectInfo = function (html) {
        if (!FileUtil.exists(html))
            return;
        var content = FileUtil.read(html, true);
        var projs = project.parseProjectInfo(content);
        var proj;
        if (projs.length == 0) {
            proj = {};
        }
        else {
            proj = projs[0];
        }
        var optionStr = 'entryClassName: "{{=it.entryClass}}",\n\t\t' +
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
    };
    return FileAutoChangeCommand;
})();
module.exports = FileAutoChangeCommand;

//# sourceMappingURL=../actions/FileAutoChange.js.map