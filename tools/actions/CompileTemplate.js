/// <reference path="../lib/types.d.ts" />
var doT = require('../lib/doT');
var FileUtil = require('../lib/FileUtil');
var project = require('../actions/project');
var htmlparser = require("../lib/htmlparser");
var CompileTemplate = (function () {
    function CompileTemplate() {
    }
    CompileTemplate.compileTemplates = function (options, scripts) {
        var index = FileUtil.joinPath(options.templateDir, "index.html");
        if (!FileUtil.exists(index))
            return;
        var content = FileUtil.read(index);
        if (options.publish)
            content = replaceReleaseScript(content);
        scripts = options.publish ? ['main.min.js'] : scripts;
        var temp = doT.template(content);
        content = temp({ scripts: scripts });
        var outputFile = FileUtil.joinPath(options.outDir, "index.html");
        FileUtil.save(outputFile, content);
        CompileTemplate.compileNativeRequire(options);
    };
    CompileTemplate.compileNativeRequire = function (options) {
        var index = FileUtil.joinPath(options.outDir, "index.html");
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
        var requirejs = FileUtil.joinPath(options.templateDir, 'launcher/native_require.js');
        var requireContent = FileUtil.read(requirejs);
        var temp = doT.template(requireContent);
        requireContent = temp(proj);
        FileUtil.save(FileUtil.joinPath(options.outDir, 'launcher/native_require.js'), requireContent);
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

//# sourceMappingURL=../actions/CompileTemplate.js.map