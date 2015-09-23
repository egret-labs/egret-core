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
        copyDirectory(egret.args.srcDir, targetFolder, srcFolderOutputFilter);
        copyDirectory(egret.args.templateDir, targetFolder);
    };
    CopyFiles.copyLark = function () {
        var options = egret.args;
        FileUtil.remove(FileUtil.joinPath(options.srcDir, 'libs'));
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
            var targetFile = FileUtil.joinPath(options.srcDir, 'libs', moduleName);
            if (options.projectDir.toLowerCase() != egret.root.toLowerCase()) {
                FileUtil.copy(moduleBin, targetFile);
            }
        }
        var list = FileUtil.getDirectoryListing(options.templateDir);
        for (var key in list) {
            var filepath = list[key];
            if (FileUtil.getExtension(filepath) == "html") {
                var htmlContent = FileUtil.read(filepath);
                var str = "";
                for (var tempK in modules) {
                    var moduleName = modules[tempK];
                    var debugJs = "";
                    var releaseJs = "";
                    var jsDebugpath = FileUtil.joinPath(options.srcDir, 'libs', moduleName, moduleName + ".js");
                    var jsReleasepath = FileUtil.joinPath(options.srcDir, 'libs', moduleName, moduleName + ".min.js");
                    if (FileUtil.exists(jsDebugpath)) {
                        debugJs = 'libs/' + moduleName + "/" + moduleName + ".js";
                    }
                    if (FileUtil.exists(jsReleasepath)) {
                        releaseJs = 'libs/' + moduleName + "/" + moduleName + ".min.js";
                    }
                    if (debugJs == "") {
                        debugJs = releaseJs;
                    }
                    if (releaseJs == "") {
                        releaseJs = debugJs;
                    }
                    if (debugJs != "") {
                        str += '\t<script src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n\n';
                    }
                    debugJs = "";
                    releaseJs = "";
                    jsDebugpath = FileUtil.joinPath(options.srcDir, 'libs', moduleName, moduleName + ".web.js");
                    jsReleasepath = FileUtil.joinPath(options.srcDir, 'libs', moduleName, moduleName + ".web.min.js");
                    if (FileUtil.exists(jsDebugpath)) {
                        debugJs = 'libs/' + moduleName + "/" + moduleName + ".web.js";
                    }
                    if (FileUtil.exists(jsReleasepath)) {
                        releaseJs = 'libs/' + moduleName + "/" + moduleName + ".web.min.js";
                    }
                    if (debugJs == "") {
                        debugJs = releaseJs;
                    }
                    if (releaseJs == "") {
                        releaseJs = debugJs;
                    }
                    if (debugJs != "") {
                        str += '\t<script src="' + debugJs + '" src-release="' + releaseJs + '"></script>\n\n';
                    }
                }
                var reg = /<!--libs_files_start-->[\s\S]*<!--libs_files_end-->/;
                htmlContent = htmlContent.replace(reg, '<!--libs_files_start-->\n' + str + '\t<!--libs_files_end-->');
                FileUtil.save(filepath, htmlContent);
            }
        }
        return 0;
    };
    CopyFiles.copyOutputToNative = function () {
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