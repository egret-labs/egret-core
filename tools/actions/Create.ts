
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import CopyFiles = require('../actions/CopyFiles');
import NativeProject = require('../actions/NativeProject');
import CompileProject = require('../actions/CompileProject');
import projectAction = require('../actions/Project');
import CompileTemplate = require('../actions/CompileTemplate');
import FileUtil = require('../lib/FileUtil');
import doT = require('../lib/doT');

var TemplatesRoot = "tools/templates/";
import Clean = require('../commands/clean');

class Create implements egret.Command {
    project: egret.ILarkProject;
    execute(): number {

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
    }
}

function compileTemplate(project: egret.ILarkProject) {
    var options = egret.args;
    var moduleScripts: string[] = [];

    var modules = project.modules;
    var platform = project.platform;

    updateEgretProperties(modules);

    modules.forEach(m=> {
        moduleScripts.push(utils.format("libs/{0}/{0}", m.name));
        var scriptName = utils.format("libs/{0}/{0}.{1}", m.name, platform);
        if (FileUtil.exists(FileUtil.joinPath(options.srcDir, scriptName + ".js")))
            moduleScripts.push(scriptName);
    });

    var scriptTemplate = `<!--{{~it.scripts :value:index}}-->
    <script src="{{=value}}"></script>
    <!--{{~}}-->`;
    project.moduleScripts = moduleScripts;
    project['scriptTemplate'] = scriptTemplate;

    var files = FileUtil.searchByFunction(options.projectDir, f=> f.indexOf("index.html") > 0);
    files.forEach(file=> {
        var content = FileUtil.read(file);
        var temp = doT.template(content);
        content = temp(project);
        FileUtil.save(file, content);
    });

    if (platform == 'native')
        NativeProject.copyNativeTemplate();
}

function updateEgretProperties(modules: egret.EgretModule[]) {
    var propFile = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
    var jsonString = FileUtil.read(propFile);
    var props: egret.EgretProperties = JSON.parse(jsonString);
    props.egret_version = egret.version;
    props.modules = modules.map(m=> ({ name: m.name }));
    FileUtil.save(propFile, JSON.stringify(props, null, "  "));
}

export = Create;
