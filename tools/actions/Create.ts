
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import CopyFiles = require('../actions/CopyFiles');
import NativeProject = require('../actions/NativeProject');
import CompileProject = require('../actions/CompileProject');
import projectAction = require('../actions/project');
import CompileTemplate = require('../actions/CompileTemplate');
import FileUtil = require('../lib/FileUtil');
import doT = require('../lib/doT');

var TemplatesRoot = "tools/templates/";

class Create implements egret.Command {
    project: egret.ILarkProject;
    execute(): number {
        var proj = this.project;
        var options = egret.args;

        projectAction.normalize(proj);

        var template = FileUtil.joinPath(options.larkRoot, TemplatesRoot + proj.type);
        FileUtil.copy(template, options.projectDir);

        CopyFiles.copyLark();

        compileTemplate(proj);
        var compileProject = new CompileProject();
        var result = compileProject.compileProject(options);
        CopyFiles.copyProjectFiles();
        CompileTemplate.compileTemplates(options, result.files);
        var project = JSON.stringify(this.project, null, "  ");
        var tmpFile = FileUtil.joinPath(options.getTmpDir(), "proj.json");
        FileUtil.save(tmpFile, project);
        console.log(utils.tr(10017));
        return result.exitStatus;
    }
}

function compileTemplate(project: egret.ILarkProject) {
    var options = egret.args;
    var moduleScripts: string[] = [];

    var modules = project.modules;
    var platform = project.platform;

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


export = Create;
