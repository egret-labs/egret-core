/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var EgretProject = require("../parser/EgretProject");
function copyToLibs() {
    var options = egret.args;
    var moduleDir = FileUtil.joinPath(options.libsDir, 'modules');
    FileUtil.remove(moduleDir);
    var project = EgretProject.utils;
    project.getModulesConfig().forEach(function (m) {
        var targetFile = FileUtil.joinPath(moduleDir, m.name);
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
            FileUtil.copy(m.path, targetFile);
        }
    });
}
exports.copyToLibs = copyToLibs;
