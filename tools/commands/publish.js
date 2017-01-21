/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var FileUtil = require("../lib/FileUtil");
var exml = require("../actions/exml");
var CompileProject = require("../actions/CompileProject");
var CompileTemplate = require("../actions/CompileTemplate");
var GenerateVersion = require("../actions/GenerateVersionCommand");
var ZipCMD = require("../actions/ZipCommand");
var project = require("../actions/Project");
var EgretProject = require("../parser/EgretProject");
var copyNative = require("../actions/CopyNativeFiles");
var path = require("path");
var Publish = (function () {
    function Publish() {
    }
    Publish.prototype.getVersionInfo = function () {
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
    };
    Publish.prototype.execute = function () {
        utils.checkEgret();
        var options = egret.args;
        var config = EgretProject.utils;
        //重新设置 releaseDir
        var versionFile = this.getVersionInfo();
        var runtime = egret.args.runtime == 'native' ? 'native' : "web";
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
        (new GenerateVersion).execute();
        //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
        if (exml.updateSetting) {
            exml.updateSetting();
        }
        if (egret.args.runtime == "native") {
            var listInfo = CompileTemplate.modifyNativeRequire(false);
            var allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
            if (FileUtil.exists(allMainfestPath)) {
                FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
            }
            FileUtil.remove(allMainfestPath);
            //先拷贝 launcher
            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
            listInfo.libs.forEach(function (filepath) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, filepath), FileUtil.joinPath(options.releaseDir, "ziptemp", filepath));
            });
            //runtime  打包所有js文件以及all.manifest
            var zip = new ZipCMD(versionFile);
            zip.execute(function (code) {
                copyNative.refreshNative(false, versionFile);
            });
        }
        else {
            var copyAction = new CopyAction(options.projectDir, options.releaseDir);
            copyAction.copy("index.html");
            copyAction.copy("favicon.ico");
            var releaseHtmlPath = FileUtil.joinPath(options.releaseDir, "index.html");
            CompileTemplate.changeHtmlToRelease(releaseHtmlPath);
            var htmlContent = FileUtil.read(releaseHtmlPath);
            //根据 html 拷贝使用的 js 文件
            var libsList = project.getLibsList(htmlContent, false, false);
            copyAction.copy(libsList);
        }
        return DontExitCode;
    };
    return Publish;
}());
var CopyAction = (function () {
    function CopyAction(from, to) {
        this.from = from;
        this.to = to;
    }
    CopyAction.prototype.copy = function (resourcePath) {
        if (typeof resourcePath == 'string') {
            var fromPath = path.resolve(this.from, resourcePath);
            var toPath = path.resolve(this.to, resourcePath);
            if (FileUtil.exists(fromPath)) {
                FileUtil.copy(fromPath, toPath);
            }
        }
        else {
            resourcePath.forEach(this.copy.bind(this));
        }
    };
    return CopyAction;
}());
module.exports = Publish;
