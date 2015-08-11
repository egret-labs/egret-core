/// <reference path="../lib/types.d.ts" />
var globals = require("../Globals");
var file = require('../lib/FileUtil');
var config = require('../lib/ProjectConfig');
var GetProjectFileListCommand = (function () {
    function GetProjectFileListCommand() {
    }
    GetProjectFileListCommand.prototype.execute = function () {
        //this.generateGameFileList(config.getProjectRoot());
        return 0;
    };
    GetProjectFileListCommand.prototype.getModuleReferenceList = function () {
        return this.moduleReferenceList;
    };
    GetProjectFileListCommand.prototype.generateGameFileList = function () {
        var projectPath = config.getProjectRoot();
        var manifestPath = file.join(projectPath, "manifest.json");
        var srcPath = file.join(projectPath, "src");
        var manifest;
        if (file.exists(manifestPath)) {
            manifest = this.getManifestJson(manifestPath, srcPath);
            this.moduleReferenceList = null;
        }
        else {
            var referenceInfo;
            var referencePath = file.joinPath(projectPath, "libs/module_reference.json");
            if (file.exists(referencePath)) {
                var text = file.read(referencePath);
                try {
                    referenceInfo = JSON.parse(text);
                }
                catch (e) {
                }
            }
            else {
                referenceInfo = config.getModuleReferenceInfo();
            }
            var create_manifest = globals.getCreateManifest();
            manifest = create_manifest.create(srcPath, false, referenceInfo, config.hasSwan());
            this.moduleReferenceList = create_manifest.getModuleReferenceList();
        }
        if (true) {
            var moduleList = [];
            var moduleNames = config.getAllModuleNames();
            moduleNames.forEach(function (moduleName) {
                var file_list = config.getModuleFileList(moduleName);
                var prefix = config.getModulePrefixPath(moduleName);
                var source = config.getModuleSourcePath(moduleName);
                moduleList = moduleList.concat(file_list.map(function (item) {
                    return file.joinPath(prefix, source, item);
                }));
            });
            manifest = manifest.filter(function (item) {
                if (moduleList.indexOf(item) < 0) {
                    return true;
                }
                return false;
            });
        }
        var tempManifest = manifest.map(function (item) {
            return file.relative(srcPath, item);
        });
        file.save(file.join(projectPath, "bin-debug/src/manifest.json"), JSON.stringify(tempManifest, null, "\t"));
        var gameList = this.createFileList(manifest, srcPath);
        var fileListText = "var game_file_list = " + JSON.stringify(gameList, null, "\t") + ";";
        file.save(file.join(projectPath, "bin-debug/src/game_file_list.js"), fileListText);
        return manifest;
    };
    GetProjectFileListCommand.prototype.getManifestJson = function (file_list, srcPath) {
        if (!file.exists(file_list)) {
            return [];
        }
        var content = file.read(file_list);
        try {
            var manifest = JSON.parse(content);
        }
        catch (e) {
            globals.exit(1304, file_list);
        }
        var length = manifest.length;
        for (var i = 0; i < length; i++) {
            manifest[i] = file.joinPath(srcPath, manifest[i]);
        }
        return manifest;
    };
    GetProjectFileListCommand.prototype.createFileList = function (manifest, srcPath) {
        var gameList = [];
        var length = manifest.length;
        for (var i = 0; i < length; i++) {
            var filePath = manifest[i];
            if (filePath.indexOf(".d.ts") != -1) {
                continue;
            }
            var ext = file.getExtension(filePath).toLowerCase();
            if (ext == "ts" && globals.isInterface(filePath)) {
                continue;
            }
            gameList.push(filePath);
        }
        gameList = gameList.map(function (filePath) {
            filePath = file.relative(srcPath, filePath);
            var ext = file.getExtension(filePath).toLowerCase();
            if (!config.hasSwan() && ext == "exml") {
                filePath = filePath.substring(0, filePath.length - 4) + "js";
            }
            else if (ext == "ts") {
                filePath = filePath.substring(0, filePath.length - 2) + "js";
            }
            return filePath;
        });
        return gameList;
    };
    return GetProjectFileListCommand;
})();
module.exports = GetProjectFileListCommand;
