/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var fileExtensionToIgnore = {
    "ts": true
};
var CopyFiles = (function () {
    function CopyFiles() {
    }
    CopyFiles.copyProjectFiles = function () {
        var targetFolder = egret.args.outDir;
        //copyDirectory(egret.args.srcDir, targetFolder,srcFolderOutputFilter);
    };
    CopyFiles.copyRuntimeFiles = function () {
        var targetFolder = egret.args.outDir;
        copyDirectory(egret.args.templateDir, targetFolder);
    };
    CopyFiles.copyLark = function () {
        CopyFiles.copyToLibs();
        CopyFiles.modifyIndexHTML();
        return 0;
    };
    CopyFiles.copyToLibs = function () {
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
                moduleBin = FileUtil.joinPath(modulePath, "bin", moduleName);
            }
            var targetFile = FileUtil.joinPath(options.libsDir, 'modules', moduleName);
            if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
                FileUtil.copy(moduleBin, targetFile);
            }
        }
    };
    CopyFiles.getLibsScripts = function () {
        var options = egret.args;
        var properties = egret.args.properties;
        var modules = properties.getAllModuleNames();
        var str = "";
        for (var tempK in modules) {
            var moduleName = modules[tempK];
            var debugJs = "";
            var releaseJs = "";
            var moduleReRoot = 'libs/modules/' + moduleName + "/";
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
    };
    CopyFiles.modifyIndexHTML = function () {
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
    };
    return CopyFiles;
})();
function copyDirectory(from, to, filter) {
    var fileList = [];
    if (!filter)
        fileList = FileUtil.getDirectoryListing(from);
    else
        fileList = FileUtil.searchByFunction(from, filter);
    length = fileList.length;
    for (var i = 0; i < length; i++) {
        var path = fileList[i];
        var destPath = path.substring(from.length);
        destPath = FileUtil.joinPath(to, destPath);
        FileUtil.copy(path, destPath);
    }
}
function srcFolderOutputFilter(file) {
    var hasEUI = false;
    if (FileUtil.exists(FileUtil.joinPath(egret.args.projectDir, "egretProperties.json"))) {
        var properties = JSON.parse(FileUtil.read(FileUtil.joinPath(egret.args.projectDir, "egretProperties.json")));
        for (var key in properties["modules"]) {
            hasEUI = hasEUI || properties["modules"][key].name == "eui";
        }
    }
    var extension = FileUtil.getExtension(file);
    if (extension in fileExtensionToIgnore)
        return false;
    else if (extension == "exml" && !hasEUI)
        return false;
    return true;
}
module.exports = CopyFiles;

//# sourceMappingURL=../actions/CopyFiles.js.map