
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import htmlparser = require("../lib/htmlparser");
import tsclark = require("../lib/typescript/tsclark");

class CompileTemplate {
	public static compileTemplates(options: egret.LarkToolArgs,scripts:string[]) {

        var templateFile = FileUtil.joinPath(options.templateDir, "index.html");
        if (!FileUtil.exists(templateFile))
            return;
        var content = FileUtil.read(templateFile);
        if(options.publish)
            content = replaceReleaseScript(content);

        scripts = options.publish ? ['main.min.js'] : scripts; 
        var scriptTags = scripts.map(f=> utils.format('<script src="{0}"></script>', f)).join('\r\n    ');
        content = content.replace('<script id="project"></script>', scriptTags);

        var outputFile = FileUtil.joinPath(options.outDir, "index.html");
        FileUtil.save(outputFile, content);
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
