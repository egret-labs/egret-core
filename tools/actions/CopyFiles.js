/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var EgretProject = require("../parser/EgretProject");
var fileExtensionToIgnore = {
    "ts": true
};
function copyToLibs() {
    var options = egret.args;
    var moduleDir = FileUtil.joinPath(options.libsDir, 'modules');
    FileUtil.remove(moduleDir);
    var project = EgretProject.utils;
    project.getAllModuleNames().map(function (moduleName) {
        var modulePath = project.getModulePath(moduleName);
        var moduleBin;
        if (modulePath == null) {
            moduleBin = FileUtil.joinPath(egret.root, "build", moduleName);
        }
        else {
            var tempModulePath = FileUtil.getAbsolutePath(modulePath);
            moduleBin = FileUtil.joinPath(tempModulePath, "bin", moduleName);
        }
        var targetFile = FileUtil.joinPath(moduleDir, moduleName);
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
            FileUtil.copy(moduleBin, targetFile);
        }
    });
}
exports.copyToLibs = copyToLibs;
