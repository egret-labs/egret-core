
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import CompileTemplate = require('./CompileTemplate');
import * as EgretProject from '../parser/EgretProject';

var fileExtensionToIgnore = {
    "ts": true
};

export function copyToLibs() {
    var options = egret.args;
    let moduleDir = FileUtil.joinPath(options.libsDir, 'modules');
    FileUtil.remove(moduleDir);
    let project = EgretProject.utils;
    project.getAllModuleNames().map(moduleName => {
        let modulePath = project.getModulePath(moduleName);
        let targetFile = FileUtil.joinPath(moduleDir, moduleName);
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
            FileUtil.copy(modulePath, targetFile);
        }
    })
}