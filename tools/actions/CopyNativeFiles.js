/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var CopyFilesCommand = require("../commands/copyfile");
var ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");
var EgretProject = require("../project/EgretProject");
var CopyNativeFiles = (function () {
    function CopyNativeFiles() {
    }
    CopyNativeFiles.copyProjectFiles = function (platform, nativePath, isDebug) {
        var options = egret.args;
        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android" || platform == "android_as") {
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
        }
        else if (platform == "ios") {
            url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");
        }
        FileUtil.remove(url2);
        if (isDebug) {
            var config = EgretProject.data;
            try {
                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }
            catch (e) {
                globals.exit(10021);
            }
            var sourceRuntime = FileUtil.joinPath(options.templateDir, "runtime");
            var outputRuntime = FileUtil.joinPath(url2, "launcher");
            FileUtil.copy(sourceRuntime, outputRuntime);
            if (EgretProject.data.useTemplate) {
                EgretProject.manager.copyManifestForNative(FileUtil.joinPath(url2, "manifest.json"));
            }
            EgretProject.data.getModulesConfig('native').forEach(function (m) {
                FileUtil.copy(m.sourceDir, FileUtil.joinPath(url2, m.targetDir));
            });
        }
        else {
            FileUtil.copy(options.releaseDir, url2);
        }
    };
    CopyNativeFiles.refreshNative = function (isDebug, versionFile) {
        if (versionFile === void 0) { versionFile = null; }
        var config = EgretProject.data;
        var nativePath;
        if (nativePath = config.getNativePath("android_as")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            CopyNativeFiles.copyProjectFiles("android_as", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android_as", versionFile);
            entrance.execute();
        }
        if (nativePath = config.getNativePath("android")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            CopyNativeFiles.copyProjectFiles("android", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android", versionFile);
            entrance.execute();
        }
        if (nativePath = config.getNativePath("ios")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.ios");
            CopyNativeFiles.copyProjectFiles("ios", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "ios", versionFile);
            entrance.execute();
        }
    };
    return CopyNativeFiles;
}());
module.exports = CopyNativeFiles;
