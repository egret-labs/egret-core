
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');

var fileExtensionToIgnore = {
    "ts": true
};

class CopyFiles {
    static copyToLibs() {
        var options = egret.args;
        FileUtil.remove(FileUtil.joinPath(options.libsDir, 'modules'));

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
        }
    }

    static getLibsScripts():string {
        var options = egret.args;
        var properties = egret.args.properties;
        var modules = properties.getAllModuleNames();
        var str = "";
        for (var tempK in modules) {
            var moduleName = modules[tempK];
            var debugJs = "";
            var releaseJs = "";

            var moduleReRoot = 'libs/modules/'+ moduleName + "/";

            var jsDebugpath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".js");
            var jsReleasepath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".min.js");
            if (FileUtil.exists(jsDebugpath)) {
                debugJs = moduleReRoot + moduleName + ".js";
            }

            if (FileUtil.exists(jsReleasepath)) {
                releaseJs = moduleReRoot + moduleName + ".min.js";
            }

            if (debugJs == "") {
                debugJs = releaseJs;
            }
            if (releaseJs == "") {
                releaseJs = debugJs;
            }

            if (debugJs != "") {
                str += '\t<script egret="lib" src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n';
            }

            debugJs = "";
            releaseJs = "";
            jsDebugpath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".web.js");
            jsReleasepath = FileUtil.joinPath(options.projectDir, moduleReRoot, moduleName + ".web.min.js");
            if (FileUtil.exists(jsDebugpath)) {
                debugJs = moduleReRoot + moduleName + ".web.js";
            }

            if (FileUtil.exists(jsReleasepath)) {
                releaseJs = moduleReRoot + moduleName + ".web.min.js";
            }

            if (debugJs == "") {
                debugJs = releaseJs;
            }
            if (releaseJs == "") {
                releaseJs = debugJs;
            }

            if (debugJs != "") {
                str += '\t<script egret="lib" src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n';
            }
        }
        return str;
    }

    static modifyHTMLWithModules(){
        var options = egret.args;
        var libsScriptsStr = CopyFiles.getLibsScripts();
        var reg = /<!--modules_files_start-->[\s\S]*<!--modules_files_end-->/;
        var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';

        var list = FileUtil.getDirectoryListing(options.projectDir);
        for (var key in list) {
            var filepath = list[key];
            if (FileUtil.getExtension(filepath) == "html") {
                var htmlContent = FileUtil.read(filepath);

                htmlContent = htmlContent.replace(reg, replaceStr);
                FileUtil.save(filepath, htmlContent);
            }
        }
    }
}

export = CopyFiles;