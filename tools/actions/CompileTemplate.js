/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var project = require("../actions/Project");
var htmlparser = require("../lib/htmlparser");
var EgretProject = require("../parser/EgretProject");
function changeHtmlToRelease(htmlPath) {
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
exports.changeHtmlToRelease = changeHtmlToRelease;
function modifyNativeRequire(isDebug) {
    var indexHTML = EgretProject.utils.getFilePath('index.html');
    return refreshNativeRequire(indexHTML, isDebug);
}
exports.modifyNativeRequire = modifyNativeRequire;
function modifyIndexHTML(scripts) {
    var projectDir = EgretProject.utils.getProjectRoot();
    var list = FileUtil.getDirectoryListing(projectDir).filter(function (filepath) { return FileUtil.getExtension(filepath) == "html"; });
    list.forEach(function (htmlFilePath) { return refreshDebugHtml(htmlFilePath, scripts); });
}
exports.modifyIndexHTML = modifyIndexHTML;
function refreshDebugHtml(htmlPath, gameScripts) {
    var libsScriptsStr = getModuleScripts();
    var reg = /<!--(\s)*modules_files_start(\s)*-->[\s\S]*<!--(\s)*modules_files_end(\s)*-->/;
    var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';
    var htmlContent = FileUtil.read(htmlPath, true);
    htmlContent = htmlContent.replace(reg, replaceStr);
    if (gameScripts) {
        var str = gameScripts.map(function (script) { return getScript('game', 'bin-debug/' + script); }).join("");
        var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
        var replaceStr = '<!--game_files_start-->\n' + str + '\t<!--game_files_end-->';
        htmlContent = htmlContent.replace(reg, replaceStr);
    }
    FileUtil.save(htmlPath, htmlContent);
}
function copyToLibs() {
    var project = EgretProject.utils;
    var moduleDir = project.getLibraryFolder();
    FileUtil.remove(moduleDir);
    project.getModulesConfig("web").forEach(function (m) {
        FileUtil.copy(m.sourceDir, project.getFilePath(m.targetDir));
    });
}
exports.copyToLibs = copyToLibs;
function getScript(type, src, releaseSrc) {
    switch (type) {
        case 'lib':
            return "\t<script egret=\"" + type + "\" src=\"" + src + "\" src-release=\"" + releaseSrc + "\"></script>\n";
            break;
        case 'game':
            return "\t<script egret=\"" + type + "\" src=\"" + src + "\"></script>\n";
            break;
        case 'none':
            return "\t<script src=\"" + src + "\"></script>\n";
            break;
    }
}
//只刷新 modules
function getModuleScripts() {
    var properties = EgretProject.utils;
    var projectRoot = properties.getProjectRoot();
    var modules = properties.getModulesConfig("web");
    var str = "";
    for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
        var m = modules_1[_i];
        var moduleName = m.name;
        m.target.forEach(function (s) {
            str += getScript("lib", s.debug, s.release);
        });
    }
    return str;
}
exports.getModuleScripts = getModuleScripts;
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
function getLibsList(html, isNative, isDebug) {
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
}
