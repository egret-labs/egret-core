/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var htmlparser = require("../lib/htmlparser");
var CompileTemplate = (function () {
    function CompileTemplate() {
    }
    CompileTemplate.compileTemplates = function (options, scripts) {
        var templateFile = FileUtil.joinPath(options.templateDir, "index.html");
        if (!FileUtil.exists(templateFile))
            return;
        var content = FileUtil.read(templateFile);
        if (options.publish)
            content = replaceReleaseScript(content);
        scripts = options.publish ? ['main.min.js'] : scripts;
        var scriptTags = scripts.map(function (f) { return utils.format('<script src="{0}"></script>', f); }).join('\r\n    ');
        content = content.replace('<script id="project"></script>', scriptTags);
        var outputFile = FileUtil.joinPath(options.outDir, "index.html");
        FileUtil.save(outputFile, content);
    };
    return CompileTemplate;
})();
// Use release src to replace the src of scripts
//  from: <script src="libs/lark.js" src-release="libs/lark.min.js"></script>
//  to:   <script src="libs/lark.min.js"></script>
function replaceReleaseScript(html) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var scriptWithReleaseSrc = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(function (d) { return visitDom(d); });
    replaceReleaseTags();
    return html;
    function visitDom(el) {
        if (el.type == 'script' && el.attribs && el.attribs['src-release']) {
            scriptWithReleaseSrc.push(el);
        }
        if (el.children) {
            el.children.forEach(function (e) { return visitDom(e); });
        }
    }
    function replaceReleaseTags() {
        scriptWithReleaseSrc.forEach(function (s) {
            html = html.replace(s.raw, 'script src="' + s.attribs['src-release'] + '"');
        });
    }
}
module.exports = CompileTemplate;
