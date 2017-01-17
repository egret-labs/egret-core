
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import CompileTemplate = require('./CompileTemplate');

var fileExtensionToIgnore = {
    "ts": true
};

export function copyToLibs() {
    var options = egret.args;
    var exitsModules = [];
    var moduleDir = FileUtil.joinPath(options.libsDir, 'modules');
    var list = FileUtil.getDirectoryListing(moduleDir);
    for (var i = 0; i < list.length; i++) {
        if (FileUtil.isDirectory(list[i])) {
            exitsModules.push(FileUtil.getRelativePath(moduleDir, list[i]));
        }
    }

    var properties = egret.args.properties;
    var modules = properties.getAllModuleNames();

    for (var tempK in modules) {
        var moduleName = modules[tempK];
        var modulePath = properties.getModulePath(moduleName);
        if (modulePath == null) {
            var moduleBin = FileUtil.joinPath(egret.root, "build", moduleName);
        }
        else {
            var tempModulePath = FileUtil.getAbsolutePath(modulePath);
            moduleBin = FileUtil.joinPath(tempModulePath, "bin", moduleName);

            //if (FileUtil.exists(FileUtil.joinPath(modulePath))) {
            //    moduleBin = FileUtil.joinPath(modulePath, "bin", moduleName);
            //}
            //else {
            //    moduleBin = FileUtil.joinPath(options.projectDir, modulePath, "bin", moduleName);
            //}
        }
        var targetFile = FileUtil.joinPath(options.libsDir, 'modules', moduleName);
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
            FileUtil.copy(moduleBin, targetFile);
        }
        var index = exitsModules.indexOf(moduleName);
        if (index != -1) {
            exitsModules.splice(index, 1);
        }
    }
    var length = exitsModules.length;
    if (length > 0) {
        for (var i = 0; i < exitsModules.length; i++) {
            FileUtil.remove(FileUtil.joinPath(moduleDir, exitsModules[i]));
        }
    }
}