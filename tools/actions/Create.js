/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var NativeProject = require('../actions/NativeProject');
var projectAction = require('../actions/Project');
var FileUtil = require('../lib/FileUtil');
var doT = require('../lib/doT');
var TemplatesRoot = "tools/templates/";
var Clean = require('../commands/clean');
var Create = (function () {
    function Create() {
    }
    Create.prototype.execute = function () {
        var proj = this.project;
        var options = egret.args;
        projectAction.normalize(proj);
        var emptyTemplate = FileUtil.joinPath(egret.root, TemplatesRoot + "empty");
        var template = FileUtil.joinPath(egret.root, TemplatesRoot + proj.type);
        FileUtil.copy(emptyTemplate, options.projectDir);
        FileUtil.copy(template, options.projectDir);
        //options.outDir = FileUtil.joinPath("..", options.outDir);
        compileTemplate(proj);
        var properties = egret.args.properties;
        properties.reload();
        new Clean().execute();
        console.log(utils.tr(10017));
        return DontExitCode;
    };
    return Create;
})();
function compileTemplate(project) {
    var options = egret.args;
    var moduleScripts = [];
    var modules = project.modules;
    var platform = project.platform;
    updateEgretProperties(modules);
    modules.forEach(function (m) {
        moduleScripts.push(utils.format("libs/{0}/{0}", m.name));
        var scriptName = utils.format("libs/{0}/{0}.{1}", m.name, platform);
        if (FileUtil.exists(FileUtil.joinPath(options.srcDir, scriptName + ".js")))
            moduleScripts.push(scriptName);
    });
    var scriptTemplate = "<!--{{~it.scripts :value:index}}-->\n    <script src=\"{{=value}}\"></script>\n    <!--{{~}}-->";
    project.moduleScripts = moduleScripts;
    project['scriptTemplate'] = scriptTemplate;
    var files = FileUtil.searchByFunction(options.projectDir, function (f) { return f.indexOf("index.html") > 0; });
    files.forEach(function (file) {
        var content = FileUtil.read(file);
        var temp = doT.template(content);
        content = temp(project);
        FileUtil.save(file, content);
    });
    if (platform == 'native')
        NativeProject.copyNativeTemplate();
}
function updateEgretProperties(modules) {
    var propFile = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
    var jsonString = FileUtil.read(propFile);
    var props = JSON.parse(jsonString);
    props.egret_version = egret.version;
    props.modules = modules.map(function (m) { return ({ name: m.name }); });
    FileUtil.save(propFile, JSON.stringify(props, null, "  "));
}
module.exports = Create;

//# sourceMappingURL=../actions/Create.js.map