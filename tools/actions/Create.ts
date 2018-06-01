﻿
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import CompileProject = require('../actions/CompileProject');
import projectAction = require('../actions/Project');
import FileUtil = require('../lib/FileUtil');
import doT = require('../lib/doT');
import * as EgretProject from '../project';

import Clean = require('../commands/clean');


const TemplatesRoot = "tools/templates/";

class Create implements egret.Command {
    project: egret.EgretProjectConfig;
    async execute() {

        var proj = this.project;
        var options = egret.args;
        let project = EgretProject.projectData;

        projectAction.normalize(proj);

        var emptyTemplate = FileUtil.joinPath(egret.root, TemplatesRoot + "empty");
        var template = FileUtil.joinPath(egret.root, TemplatesRoot + proj.type);
        FileUtil.copy(emptyTemplate, project.getProjectRoot());
        FileUtil.copy(template, project.getProjectRoot());
        compileTemplate(proj);
        project.reload();

        new Clean().execute();
        console.log(utils.tr(10017));
        return Promise.resolve(DontExitCode);
    }
}

function compileTemplate(projectConfig: egret.EgretProjectConfig) {
    var options = egret.args;
    updateEgretProperties(projectConfig);

    var files = FileUtil.searchByFunction(options.projectDir, f => f.indexOf("index.html") > 0);
    files.forEach(file => {
        var content = FileUtil.read(file);
        content = doT.template(content)(projectConfig)
        FileUtil.save(file, content);
    });
}

function updateEgretProperties(projectConfig: egret.EgretProjectConfig) {
    let modules = projectConfig.modules;
    var propFile = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
    var jsonString = FileUtil.read(propFile);
    var props: egret.EgretProperty = JSON.parse(jsonString);
    props.engineVersion = egret.version;
    props.compilerVersion = egret.version;
    props.template = {};
    props.target = { current: "web" };
    if (projectConfig.type == "eui") {
        //添加eui项目默认配置
        props.eui = {
            exmlRoot: ["resource/eui_skins"],
            themes: ["resource/default.thm.json"],
            exmlPublishPolicy: "commonjs"
        };
    }
    else if (projectConfig.type == "wasm") {
        props.wasm = {};
    }
    if (!props.modules) {
        props.modules = modules.map(m => ({ name: m.name }));
    }
    let promise = { name: "promise" };
    props.modules.push(promise);
    FileUtil.save(propFile, JSON.stringify(props, null, "  "));
}

export = Create;
