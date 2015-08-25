
/// <reference path="../lib/types.d.ts" />

import doT = require('../lib/doT');
import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import project = require('../actions/project');
import htmlparser = require("../lib/htmlparser");
import tsclark = require("../lib/typescript/tsclark");

class CompileTemplate {
	public static compileTemplates(options: egret.LarkToolArgs,scripts:string[]) {

        var index = FileUtil.joinPath(options.templateDir, "index.html");
        if (!FileUtil.exists(index))
            return;

        var content = FileUtil.read(index);
        if(options.publish)
            content = replaceReleaseScript(content);

        scripts = options.publish ? ['main.min.js'] : scripts;

        var temp = doT.template(content);
        content = temp({ scripts: scripts });
        var outputFile = FileUtil.joinPath(options.outDir, "index.html");
        FileUtil.save(outputFile, content);

        CompileTemplate.compileNativeRequire(options);
    }

    public static compileNativeRequire(options: egret.LarkToolArgs) {

        var index = FileUtil.joinPath(options.outDir, "index.html");
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


        var requirejs = FileUtil.joinPath(options.templateDir, 'launcher/native_require.js');
        var requireContent = FileUtil.read(requirejs);
        var temp = doT.template(requireContent);
        requireContent = temp(proj);
        FileUtil.save(FileUtil.joinPath(options.outDir, 'launcher/native_require.js'), requireContent);

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
