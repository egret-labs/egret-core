/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var CompileProject = require('../actions/CompileProject');
var GenerateVersion = require('../actions/GenerateVersionCommand');
var ZipCMD = require("../actions/ZipCommand");
var project = require("../actions/Project");
var copyNative = require("../actions/CopyNativeFiles");
var FileAutoChange = require("../actions/FileAutoChange");
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
        var config = egret.args.properties;
        //重新设置 releaseDir
        var versionFile = this.getVersionInfo();
        if (egret.args.runtime == "native") {
            options.releaseDir = FileUtil.joinPath(config.getReleaseRoot(), "native", versionFile);
            globals.log(1402, "native", versionFile);
        }
        else {
            options.releaseDir = FileUtil.joinPath(config.getReleaseRoot(), "web", versionFile);
            globals.log(1402, "web", versionFile);
        }
        utils.clean(options.releaseDir);
        options.minify = true;
        options.publish = true;
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        utils.minify(options.out, options.out);
        //生成 all.manifest 并拷贝资源
        (new GenerateVersion).execute();
        if (egret.args.runtime == "native") {
            var rootHtmlPath = FileUtil.joinPath(options.projectDir, "index.html");
            //修改 native_require.js
            var autoChange = new FileAutoChange();
            var listInfo = autoChange.refreshNativeRequire(rootHtmlPath, false);
            var allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
            if (FileUtil.exists(allMainfestPath)) {
                FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
            }
            FileUtil.remove(allMainfestPath);
            //先拷贝 launcher
            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
            listInfo["libs"].forEach(function (filepath) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, filepath), FileUtil.joinPath(options.releaseDir, "ziptemp", filepath));
            });
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
    };
    return Publish;
})();
module.exports = Publish;

//# sourceMappingURL=../commands/publish.js.map