
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
import exml = require("../actions/exml");
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import GenerateVersion = require('../actions/GenerateVersionCommand');
import ZipCMD = require("../actions/ZipCommand");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

import project = require("../actions/Project");

import copyNative = require("../actions/CopyNativeFiles");

import Clean = require("../commands/clean");

import FileAutoChange = require("../actions/FileAutoChange");

class Publish implements egret.Command {
    execute():number {
        utils.checkEgret();

        var options = egret.args;
        utils.clean(options.releaseDir);
        options.minify = true;
        options.publish = true;

        var compileProject = new CompileProject();
        var result = compileProject.compile(options);

        utils.minify(options.out,options.out);

        //生成 all.manifest 并拷贝资源
        (new GenerateVersion).execute();

        if (egret.args.runtime == "native") {
            var rootHtmlPath = FileUtil.joinPath(options.projectDir, "index.html");

            //修改 native_require.js
            var autoChange = new FileAutoChange();
            autoChange.refreshNativeRequire(rootHtmlPath, false);

            //先拷贝 launcher
            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));

            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));

            autoChange.libsList.forEach(function (filepath) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, filepath), FileUtil.joinPath(options.releaseDir, "ziptemp", filepath));
            });

            var versionFile = (egret.args.version || Math.round(Date.now() / 1000)).toString();

            //runtime  打包所有js文件以及all.manifest
            var zip = new ZipCMD(versionFile);
            zip.execute(function (code) {
                copyNative.refreshNative(false, versionFile);
            });
        }
        else {
            var releaseHtmlPath = FileUtil.joinPath(options.releaseDir, "index.html");
            FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), releaseHtmlPath);

            //修改 html
            var autoChange = new FileAutoChange();
            autoChange.changeHtmlToRelease(releaseHtmlPath);

            var htmlContent = FileUtil.read(releaseHtmlPath);

            //根据 html 拷贝使用的 js 文件
            var libsList = project.getLibsList(htmlContent, false, false);
            libsList.forEach(function (filepath) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, filepath), FileUtil.joinPath(options.releaseDir, filepath));
            });
        }

        return DontExitCode;
    }

}

export = Publish;
