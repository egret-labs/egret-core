/// <reference path="../lib/types.d.ts" />
var doT = require('../lib/doT');
var FileUtil = require('../lib/FileUtil');
var project = require('../actions/project');
var CompileTemplate = (function () {
    function CompileTemplate() {
    }
    CompileTemplate.compileTemplates = function (options, scripts) {
        CompileTemplate.modifyIndexHTML(scripts);
        CompileTemplate.modifyNativeRequire();
    };
    CompileTemplate.modifyIndexHTML = function (scripts) {
        var options = egret.args;
        var str = "";
        for (var tempK in scripts) {
            var script = scripts[tempK];
            var debugJs = "";
            debugJs = 'bin-debug/' + script;
            str += '\t<script egret="game" src="' + debugJs + '"></script>\n';
        }
        var reg = /<!--game_files_start-->[\s\S]*<!--game_files_end-->/;
        var replaceStr = '<!--game_files_start-->\n' + str + '\t<!--game_files_end-->';
        var list = FileUtil.getDirectoryListing(options.projectDir);
        for (var key in list) {
            var filepath = list[key];
            if (FileUtil.getExtension(filepath) == "html") {
                var htmlContent = FileUtil.read(filepath);
                htmlContent = htmlContent.replace(reg, replaceStr);
                FileUtil.save(filepath, htmlContent);
            }
        }
    };
    CompileTemplate.modifyNativeRequire = function () {
        var options = egret.args;
        var time1 = Date.now();
        var index = FileUtil.joinPath(options.projectDir, "index.html");
        if (!FileUtil.exists(index))
            return;
        var content = FileUtil.read(index);
        var projs = project.parseProjectInfo(content);
        var proj;
        if (projs.length == 0) {
            proj = {};
        }
        else {
            proj = projs[0];
        }
        project.normalize(proj);
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
            'textureScaleFactor: {{=it.textureScaleFactor}}';
        var temp = doT.template(optionStr);
        optionStr = temp(proj);
        var gameFileListStr = '{{~it.nativeScripts :value:index}}\n\t' +
            '{{? index != 0}},{{?}}"{{=value}}"\n\t' +
            '{{~}}';
        var temp = doT.template(gameFileListStr);
        gameFileListStr = temp(proj);
        var requirejs = FileUtil.joinPath(options.templateDir, 'runtime/native_require.js');
        var requireContent = FileUtil.read(requirejs);
        //var temp = doT.template(requireContent);
        //requireContent = temp(proj);
        var reg = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
        var replaceStr = '\/\/----auto game_file_list start----' + gameFileListStr + '\/\/----auto game_file_list end----';
        requireContent = requireContent.replace(reg, replaceStr);
        var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        var replaceStr = '\/\/----auto option start----\n' + optionStr + '\n\/\/----auto option end----';
        requireContent = requireContent.replace(reg, replaceStr);
        FileUtil.save(requirejs, requireContent);
    };
    return CompileTemplate;
})();
module.exports = CompileTemplate;

//# sourceMappingURL=../actions/CompileTemplate.js.map