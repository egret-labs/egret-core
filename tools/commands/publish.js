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
    Publish.prototype.execute = function () {
        utils.checkEgret();
        var options = egret.args;
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
            //先拷贝 launcher
            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
            listInfo["libs"].forEach(function (filepath) {
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
    };
    return Publish;
})();
module.exports = Publish;

//# sourceMappingURL=../commands/publish.js.map