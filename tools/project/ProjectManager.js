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
        ProjectData_1.data.getModulesConfig(platform).forEach(function (m) {
            m.target.forEach(function (m) {
                initial.push(m.debug);
            });
        });
        if (isDebug) {
            gameFileList.forEach(function (m) {
                initial.push("bin-debug/" + m);
            });
        }
        else {
            initial.push("main.min.js");
        }
        //todo res config
        var manifest = { initial: initial };
        if (!manifestPath) {
            manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
        }
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
    }
    manager.generateManifest = generateManifest;
    function modifyNativeRequire() {
        var options = egret.args;
        var indexPath = ProjectData_1.data.getFilePath('index.html');
        var requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
        var requireContent = FileUtil.read(requirePath);
        if (requireContent == "") {
            globals.exit(10021);
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
        var fileLength = manifest.initial.length;
        ProjectData_1.data.getModulesConfig(platform).forEach(function (m) {
            m.target.forEach(function (m) {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, m.release), FileUtil.joinPath(toPath, m.release));
                for (var i = 0; i < fileLength; i++) {
                    if (manifest.initial[i] == m.debug) {
                        manifest.initial.splice(i, 1, m.release);
                        break;
                    }
                }
            });
        });
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
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
})(manager = exports.manager || (exports.manager = {}));
