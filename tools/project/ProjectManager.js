var ProjectData_1 = require("./ProjectData");
var FileUtil = require("../lib/FileUtil");
var project = require("../actions/Project");
var manager;
(function (manager) {
    function copyToLibs() {
        var moduleDir = ProjectData_1.data.getLibraryFolder();
        FileUtil.remove(moduleDir);
        ProjectData_1.data.getModulesConfig("web").forEach(function (m) {
            FileUtil.copy(m.sourceDir, ProjectData_1.data.getFilePath(m.targetDir));
        });
    }
    manager.copyToLibs = copyToLibs;
    function generateManifest(gameFileList, manifestPath, isDebug, platform) {
        if (isDebug === void 0) { isDebug = true; }
        if (platform === void 0) { platform = "web"; }
        var initial = [];
        var game = [];
        ProjectData_1.data.getModulesConfig(platform).forEach(function (m) {
            m.target.forEach(function (m) {
                initial.push(isDebug ? m.debug : m.release);
            });
        });
        if (isDebug) {
            gameFileList.forEach(function (m) {
                game.push("bin-debug/" + m);
            });
        }
        else {
            game.push("main.min.js");
        }
        var manifest = { initial: initial, game: game };
        if (!manifestPath) {
            manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
        }
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
    }
    manager.generateManifest = generateManifest;
    function modifyNativeRequire(manifestPath) {
        var options = egret.args;
        var indexPath = ProjectData_1.data.getFilePath('index.html');
        var requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
        var requireContent = FileUtil.read(requirePath);
        if (requireContent == "") {
            globals.exit(10021);
        }
        if (!ProjectData_1.data.useTemplate) {
            var manifest = JSON.parse(FileUtil.read(manifestPath));
            var fileList = manifest.initial.concat(manifest.game);
            var listStr_1 = "\n";
            fileList.forEach(function (filepath) {
                filepath = filepath.replace(".web.", ".native.");
                listStr_1 += '\t"' + filepath + '",\n';
            });
            var reg_1 = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
            var replaceStr_1 = '\/\/----auto game_file_list start----' + listStr_1 + '\t\/\/----auto game_file_list end----';
            requireContent = requireContent.replace(reg_1, replaceStr_1);
        }
        var optionStr = project.getNativeProjectInfo(indexPath);
        var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        var replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        requireContent = requireContent.replace(reg, replaceStr);
        FileUtil.save(requirePath, requireContent);
    }
    manager.modifyNativeRequire = modifyNativeRequire;
    function copyLibsForPublish(manifestPath, toPath, platform) {
        var options = egret.args;
        var manifest = JSON.parse(FileUtil.read(manifestPath));
        ProjectData_1.data.getModulesConfig(platform).forEach(function (m) {
            m.target.forEach(function (m) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, m.release), FileUtil.joinPath(toPath, m.release));
            });
        });
    }
    manager.copyLibsForPublish = copyLibsForPublish;
    function copyManifestForNative(toPath) {
        var options = egret.args;
        var manifest = JSON.parse(FileUtil.read(FileUtil.joinPath(options.projectDir, "manifest.json")));
        var fileLength = manifest.initial.length;
        for (var i = 0; i < fileLength; i++) {
            if (manifest.initial[i].indexOf(".web.") != -1) {
                manifest.initial[i] = manifest.initial[i].replace(".web.", ".native.");
            }
        }
        FileUtil.save(toPath, JSON.stringify(manifest));
    }
    manager.copyManifestForNative = copyManifestForNative;
    function modifyIndex(manifestPath, indexPath) {
        if (!ProjectData_1.data.useTemplate) {
            var manifest = JSON.parse(FileUtil.read(manifestPath, true));
            var libs = manifest.initial;
            var libsScriptsStr = "";
            libs.forEach(function (m) {
                libsScriptsStr += getScript("lib", m);
            });
            var game = manifest.game;
            var gameStr = "";
            game.forEach(function (m) {
                gameStr += getScript("lib", m);
            });
            var reg = /<!--(\s)*modules_files_start(\s)*-->[\s\S]*<!--(\s)*modules_files_end(\s)*-->/;
            var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';
            var htmlContent = FileUtil.read(indexPath, true);
            htmlContent = htmlContent.replace(reg, replaceStr);
            var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
            var replaceStr = '<!--game_files_start-->\n' + gameStr + '\t<!--game_files_end-->';
            htmlContent = htmlContent.replace(reg, replaceStr);
            var reg = /<!--(\s)*other_libs_files_start(\s)*-->[\s\S]*<!--(\s)*other_libs_files_end(\s)*-->/;
            var replaceStr = '';
            htmlContent = htmlContent.replace(reg, replaceStr);
            FileUtil.save(indexPath, htmlContent);
        }
    }
    manager.modifyIndex = modifyIndex;
    function getScript(type, src) {
        switch (type) {
            case 'lib':
                return "\t<script egret=\"" + type + "\" src=\"" + src + "\"></script>\n";
                break;
            case 'game':
                return "\t<script egret=\"" + type + "\" src=\"" + src + "\"></script>\n";
                break;
        }
    }
})(manager = exports.manager || (exports.manager = {}));
