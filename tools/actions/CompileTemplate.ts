
/// <reference path="../lib/types.d.ts" />

import doT = require('../lib/doT');
import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import project = require('../actions/project');
import htmlparser = require("../lib/htmlparser");
import tsclark = require("../lib/typescript/tsclark");

class CompileTemplate {
	public static compileTemplates(options: egret.ToolArgs,scripts:string[]) {
        CompileTemplate.modifyIndexHTML(scripts);

        CompileTemplate.compileNativeRequire(options);
    }

    static modifyIndexHTML(scripts:string[]){
        var options = egret.args;
        var str = "";
        for (var tempK in scripts) {
            var script = scripts[tempK];
            var debugJs = "";
            debugJs = 'bin-debug/'+ script;

            str += '\t<script src="' + debugJs + '"></script>\n';
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
    }

    public static compileNativeRequire(options: egret.ToolArgs) {
        var time1 = Date.now();
        var index = FileUtil.joinPath(options.projectDir, "index.html");
        if (!FileUtil.exists(index))
            return;
        var content = FileUtil.read(index);

        var projs = project.parseProjectInfo(content);
        var proj: egret.ILarkProject;
        if (projs.length == 0) {
            proj = {};
        } else {
            proj = projs[0];
        }
        project.normalize(proj);

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
            'textureScaleFactor: {{=it.textureScaleFactor}}';

        var temp = doT.template(optionStr);
        optionStr = temp(proj);

        var gameFileListStr =
            '{{~it.nativeScripts :value:index}}\n\t' +
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
        var replaceStr = '\/\/----auto option start----' + optionStr + '\/\/----auto option end----';
        requireContent = requireContent.replace(reg, replaceStr);
        FileUtil.save(requirejs, requireContent);

        console.log(Date.now()-time1);
    }
}

// Use release src to replace the src of scripts
//  from: <script src="libs/lark.js" src-release="libs/lark.min.js"></script>
//  to:   <script src="libs/lark.min.js"></script>
function replaceReleaseScript(html:string):string {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var scriptWithReleaseSrc: htmlparser.Element[] = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(d=> visitDom(d));
    replaceReleaseTags();
    return html;

    function visitDom(el: htmlparser.Element) {
        if (el.type == 'script' && el.attribs && el.attribs['src-release']) {
            scriptWithReleaseSrc.push(el);
        }
        if (el.children) {
            el.children.forEach(e=> visitDom(e));
        }
    }

    function replaceReleaseTags() {
        scriptWithReleaseSrc.forEach(s=> {
            html = html.replace(s.raw, 'script src="' + s.attribs['src-release'] + '"');
        });
    }
}


export = CompileTemplate;
