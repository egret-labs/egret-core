/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");

import * as Compiler from './Compiler';
import * as tasks from '../tasks';
import * as utils from '../lib/utils';
import FileUtil = require('../lib/FileUtil');
import * as fs from 'fs';
import * as path from 'path';
import * as EgretProject from '../project';
import ZipCommand = require("./ZipCommand");
import CompileProject = require('./CompileProject');
import * as parseConfig from './ParseConfig'



export async function publishResource(version: string) {


    let { releaseDir, projectDir } = egret.args;
    const projectRoot = projectDir;
    const res = require('../lib/resourcemanager');
    tasks.run();
    const command = "publish";
    const debug = true;
    const target = egret.args.target;
    const projectConfig = parseConfig.parseConfig();
    return await res.build({ projectRoot, debug, command, target, version, projectConfig });

}

export function legacyPublishNative(versionFile: string) {
    const options = egret.args;
    const manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
    EgretProject.manager.generateManifest(null, { debug: false, platform: 'native' }, manifestPath);
    EgretProject.manager.modifyNativeRequire(manifestPath);
    var allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
    if (FileUtil.exists(allMainfestPath)) {
        FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
    }
    FileUtil.remove(allMainfestPath);

    //先拷贝 launcher
    FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));

    FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
    FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));

    // EgretProject.manager.copyLibsForPublish(FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");

    //runtime  打包所有js文件以及all.manifest
    // const zip = new ZipCommand(versionFile);
    // zip.execute(function (code) {
    //     copyNative.refreshNative(false, versionFile);
    // });
}

export function legacyPublishHTML5() {
    const options = egret.args;
    const manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
    const indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
    EgretProject.manager.generateManifest(null, { debug: false, platform: "web" }, manifestPath);
    if (!EgretProject.projectData.useTemplate) {
        FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    else {
        FileUtil.copy(FileUtil.joinPath(options.templateDir, "web", "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }

    const copyAction = new CopyAction(options.projectDir, options.releaseDir);
    copyAction.copy("favicon.ico");

    // EgretProject.manager.copyLibsForPublish(options.releaseDir, "web");
}

class CopyAction {

    constructor(private from, private to) {
    }

    public copy(resourcePath: string | string[]) {
        if (typeof resourcePath == 'string') {
            let fromPath = path.resolve(this.from, resourcePath);
            let toPath = path.resolve(this.to, resourcePath)
            if (FileUtil.exists(fromPath)) {
                FileUtil.copy(fromPath, toPath);
            }
        }
        else {
            resourcePath.forEach(this.copy.bind(this));
        }

    }

}