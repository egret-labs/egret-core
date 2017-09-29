
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');

import CompileProject = require('../actions/CompileProject');
import { publishResource, legacyPublishHTML5, legacyPublishNative } from '../actions/PublishResourceAction';
import ZipCommand = require("../actions/ZipCommand");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

import project = require("../actions/Project");
import EgretProject = require("../project/EgretProject");



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

        const runtime = egret.args.runtime == 'native' ? 'native' : "web";
        options.releaseDir = FileUtil.joinPath(config.getReleaseRoot(), runtime, versionFile);
        globals.log(1402, runtime, versionFile);

        utils.clean(options.releaseDir);
        options.minify = true;
        options.publish = true;

        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        var outfile = FileUtil.joinPath(options.releaseDir, 'main.min.js');
        utils.minify(outfile, outfile);

        await publishResource(versionFile, runtime);


        return DontExitCode;
    }

}



export = Publish;
