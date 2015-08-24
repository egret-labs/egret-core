/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var CopyFiles = require('../actions/CopyFiles');
var NativeProject = require('../actions/NativeProject');
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var FileUtil = require('../lib/FileUtil');
var DoCreateCommand = (function () {
    function DoCreateCommand() {
    }
    DoCreateCommand.prototype.execute = function () {
        var proj = this.project;
        var options = egret.args;
        var template = FileUtil.joinPath(options.larkRoot, "tools/templates/" + proj.template);
        FileUtil.copy(template, options.projectDir);
        CopyFiles.copyLark();
        copyTemplate(proj);
        var compileProject = new CompileProject();
        var result = compileProject.compileProject(options);
        CopyFiles.copyProjectFiles();
        CompileTemplate.compileTemplates(options, result.files);
        var project = JSON.stringify(this.project, null, "  ");
        var tmpFile = FileUtil.joinPath(options.getTmpDir(), "proj.json");
        FileUtil.save(tmpFile, project);
        console.log(utils.tr(10017));
        return result.exitStatus;
    };
    return DoCreateCommand;
})();
function copyTemplate(project) {
    var options = egret.args;
    var larkFiles = [];
    var modules = project.modules;
    var platform = project.platform;
    modules.forEach(function (m) {
        larkFiles.push(utils.format("libs/{0}/{0}", m.name));
        var scriptName = utils.format("libs/{0}/{0}.{1}", m.name, platform);
        if (FileUtil.exists(FileUtil.joinPath(options.srcDir, scriptName + ".js")))
            larkFiles.push(scriptName);
    });
    var scripts = larkFiles.map(function (f) { return utils.format('<script src="{0}.js" src-release="{0}.min.js"></script>', f); }).join('\r\n    ');
    var files = FileUtil.searchByFunction(options.projectDir, function (f) { return f.indexOf("html") > 0; });
    files.forEach(function (file) {
        var content = FileUtil.read(file);
        content = content.replace('<script id="lark"></script>', scripts);
        content = content.replace(/\$\{entryClass\}/ig, "Main");
        content = content.replace(/\$\{background\}/ig, project.background || "#888888");
        content = content.replace(/\$\{scaleMode\}/ig, project.scaleMode || "noScale");
        content = content.replace(/\$\{orientationMode\}/ig, project.orientationMode || "auto");
        content = content.replace(/\$\{frameRate\}/ig, (project.frameRate || 30).toString());
        content = content.replace(/\$\{contentWidth\}/ig, project.contentWidth.toString());
        content = content.replace(/\$\{contentHeight\}/ig, project.contentHeight.toString());
        content = content.replace(/\$\{showPaintRects\}/ig, 'false');
        FileUtil.save(file, content);
    });
    if (platform == 'native')
        NativeProject.copyNativeTemplate();
}
module.exports = DoCreateCommand;
