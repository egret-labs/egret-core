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
        var targetFile = FileUtil.joinPath(moduleDir, moduleName);
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
            FileUtil.copy(modulePath, targetFile);
        }
    });
}
exports.copyToLibs = copyToLibs;
