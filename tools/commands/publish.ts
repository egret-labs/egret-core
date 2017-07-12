
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import exml = require("../actions/exml");
import CompileProject = require('../actions/CompileProject');
import GenerateVersion = require('../actions/GenerateVersionCommand');
import ZipCMD = require("../actions/ZipCommand");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

import project = require("../actions/Project");
import EgretProject = require("../project/EgretProject");

import copyNative = require("../actions/CopyNativeFiles");

import Clean = require("../commands/clean");

import path = require('path');

class Publish implements egret.Command {
    private getVersionInfo(): string {
        if (egret.args.version) {
            return egret.args.version;
        }

        var date = new Date();
        var year = date.getFullYear() % 100;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();
        var timeStr = year * 10000000000 + month * 100000000 + day * 1000000 + hour * 10000 + min * 100 + second;
        return timeStr.toString();

        //return (Math.round(Date.now() / 1000)).toString();
    }

    async execute(): Promise<number> {
        utils.checkEgret();

        var options = egret.args;
        var config = EgretProject.data;
        //重新设置 releaseDir
        var versionFile = this.getVersionInfo();

        let runtime = egret.args.runtime == 'native' ? 'native' : "web";
        options.releaseDir = FileUtil.joinPath(config.getReleaseRoot(), runtime, versionFile);
        globals.log(1402, runtime, versionFile);

        utils.clean(options.releaseDir);
        options.minify = true;
        options.publish = true;

        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        var outfile = FileUtil.joinPath(options.releaseDir, 'main.min.js');
        utils.minify(outfile, outfile);

        //生成 all.manifest 并拷贝资源

        // let commandResult = await utils.executeCommand("res config");
        let useResourceMangerPublish = false;//commandResult.error && egret.args.runtime == "web" ? false : true;
        if (!useResourceMangerPublish) {
            (new GenerateVersion).execute();
        }


        //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
        if (exml.updateSetting) {
            exml.updateSetting();
        }
        let manifestPath;
        if (egret.args.runtime == "native") {
            manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
            EgretProject.manager.generateManifest(null, manifestPath, false, "native");
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

            EgretProject.manager.copyLibsForPublish(manifestPath, FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");

            //runtime  打包所有js文件以及all.manifest
            var zip = new ZipCMD(versionFile);
            zip.execute(function (code) {
                copyNative.refreshNative(false, versionFile);
            });
        }
        else {
            manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
            let indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
            EgretProject.manager.generateManifest(null, manifestPath, false, "web");
            if (!EgretProject.data.useTemplate) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
                EgretProject.manager.modifyIndex(manifestPath, indexPath);
            }
            else {
                FileUtil.copy(FileUtil.joinPath(options.templateDir, "debug", "index.html"), indexPath);
                EgretProject.manager.modifyIndex(manifestPath, indexPath);
            }

            let copyAction = new CopyAction(options.projectDir, options.releaseDir);
            copyAction.copy("favicon.ico");

            EgretProject.manager.copyLibsForPublish(manifestPath, options.releaseDir, "web");
        }

        if (useResourceMangerPublish) {
            let version = path.join(runtime, versionFile);
            let commandResult1 = await utils.executeCommand(`res publish ${config.getProjectRoot()} ${options.releaseDir}`);
        }

        return DontExitCode;
    }

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

export = Publish;
