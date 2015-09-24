/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var exml = require("../actions/exml");
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var GenerateVersion = require('../actions/GenerateVersionCommand');
var ZipCMD = require("../actions/ZipCommand");
var project = require("../actions/Project");
var copyNative = require("../actions/CopyNativeFiles");
var Publish = (function () {
    function Publish() {
    }
    Publish.prototype.execute = function () {
        var options = egret.args;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        options.minify = true;
        options.publish = true;
        utils.clean(options.releaseDir);
        exml.beforeBuild();
        var compileProject = new CompileProject();
        exml.build();
        var result = compileProject.compileProject(options);
        if (result.exitStatus)
            return result.exitStatus;
        exml.afterBuild();
        CompileTemplate.modifyIndexHTML(result.files);
        CompileTemplate.modifyNativeRequire();
        utils.minify(options.out, options.out);
        //生成 all.manifest
        (new GenerateVersion).execute();
        if (egret.args.runtime == "native") {
            var rootHtmlPath = FileUtil.joinPath(options.projectDir, "index.html");
            //生成 获取列表
            var libsList = project.getLibsList(FileUtil.read(rootHtmlPath), true, false);
            var listStr = "\n";
            libsList.forEach(function (filepath) {
                listStr += '\t"' + filepath + '",\n';
            });
            listStr += '\t"main.min.js"\n';
            var requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
            var requireContent = FileUtil.read(requirePath);
            var reg = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
            var replaceStr = '\/\/----auto game_file_list start----' + listStr + '\t\/\/----auto game_file_list end----';
            requireContent = requireContent.replace(reg, replaceStr);
            var optionStr = project.getNativeProjectInfo(rootHtmlPath);
            var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
            var replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
            requireContent = requireContent.replace(reg, replaceStr);
            FileUtil.save(requirePath, requireContent);
            //先拷贝 launcher
            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
            libsList.forEach(function (filepath) {
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
            var htmlContent = FileUtil.read(releaseHtmlPath);
            //替换使用 html 中的 src-release 目录
            var reg = /src[^>]*src-release/g;
            htmlContent = htmlContent.replace(reg, "src");
            //替换 game_files 脚本
            var reg = /<!--game_files_start-->[\s\S]*<!--game_files_end-->/;
            var replaceStr = '<!--game_files_start-->\n' + '\t<script src="main.min.js"></script>\n' + '\t<!--game_files_end-->';
            htmlContent = htmlContent.replace(reg, replaceStr);
            FileUtil.save(releaseHtmlPath, htmlContent);
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