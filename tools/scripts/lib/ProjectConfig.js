/**
 * Created by yjtx on 15-7-21.
 */
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
//import globals = require('../Globals');
var ProjectConfig = (function () {
    function ProjectConfig() {
        this.modulesConfig = {};
    }
    ProjectConfig.prototype.init = function () {
        var projectRoot = params.getProjectRoot();
        if (file.exists(file.joinPath(projectRoot, "egretProperties.json"))) {
            this.properties = JSON.parse(file.read(file.joinPath(projectRoot, "egretProperties.json")));
            for (var key in this.properties["modules"]) {
                this.modulesConfig[this.properties["modules"][key]["name"]] = this.properties["modules"][key];
            }
            this.modulesConfig["html5"] = { "name": "html5" };
            this.modulesConfig["native"] = { "name": "native" };
        }
        if (this.modulesConfig["swan"] != null && this.modulesConfig["gui"] != null) {
            globals.log2(8);
            process.exit(1);
        }
    };
    /**
     * 是否有swan
     */
    ProjectConfig.prototype.hasSwan = function () {
        return this.modulesConfig["swan"] != null;
    };
    /**
     * 获取项目的根路径
     * @returns {*}
     */
    ProjectConfig.prototype.getProjectRoot = function () {
        return params.getProjectRoot();
    };
    /**
     * 获取项目使用的egret版本号
     * @returns {any}
     */
    ProjectConfig.prototype.getVersion = function () {
        return this.properties["egret_version"];
    };
    /**
     * 发布路径的根目录
     * @returns {string}
     */
    ProjectConfig.prototype.getReleaseRoot = function () {
        var p = "release";
        if (globals.hasKeys(this.properties, ["release"])) {
            p = this.properties["release"];
        }
        return file.joinPath(params.getProjectRoot(), p);
    };
    //获得egret_file_list
    ProjectConfig.prototype.getFileList = function (file_list) {
        var js_content = file.read(file_list);
        js_content = js_content.match(/\[[^\]]*\]/)[0];
        return JSON.parse(js_content);
    };
    /**
     * 获取已经生成的js文件列表
     * @param runtime
     * @returns {string[]|T[]}
     */
    ProjectConfig.prototype.getAllFileList = function (runtime) {
        var egret_file;
        var currDir = this.getProjectRoot();
        if (runtime == "html5") {
            egret_file = file.joinPath(currDir, "bin-debug/lib/egret_file_list.js");
        }
        else {
            egret_file = file.joinPath(currDir, "bin-debug/lib/egret_file_list_native.js");
        }
        var egretFileList = this.getFileList(egret_file).map(function (item) {
            return file.joinPath(currDir, "libs", item);
        });
        var game_file = file.joinPath(currDir, "bin-debug/src/game_file_list.js");
        var gameFileList = this.getFileList(game_file).map(function (item) {
            return file.joinPath(currDir, "bin-debug", "src", item);
        });
        return egretFileList.concat(gameFileList);
    };
    ProjectConfig.prototype.getVersionCode = function (runtime) {
        if (globals.hasKeys(this.properties, ["publish", "baseVersion"])) {
            return this.properties["publish"]["baseVersion"];
        }
        return 1;
    };
    ProjectConfig.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.properties, ["native", "path_ignore"])) {
            return this.properties["native"]["path_ignore"];
        }
        return [];
    };
    ProjectConfig.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.properties, ["native", platform + "_path"])) {
            return file.joinPath(this.getProjectRoot(), this.properties["native"][platform + "_path"]);
        }
        return null;
    };
    ProjectConfig.prototype.getModulePath = function (moduleName) {
        if (this.modulesConfig[moduleName]) {
            return this.modulesConfig[moduleName]["path"] || null;
        }
        return null;
    };
    ProjectConfig.prototype.getModuleConfig = function (moduleName) {
        var moduleJsonPath;
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            moduleJsonPath = file.joinPath(params.getEgretRoot(), "tools/lib/manifest", moduleName + ".json");
        }
        else {
            moduleJsonPath = file.joinPath(this.getProjectRoot(), modulePath, moduleName + ".json");
        }
        var content = file.read(moduleJsonPath);
        if (!content) {
            globals.exit(8003, moduleJsonPath);
        }
        return JSON.parse(content);
    };
    //绝对路径
    ProjectConfig.prototype.getModuleOutput = function (moduleName) {
        var output = this.getModuleConfig(moduleName)["output"] || moduleName;
        return file.joinPath(this.getProjectRoot(), "libs", output);
    };
    ProjectConfig.prototype.getModuleFileList = function (moduleName) {
        return this.getModuleConfig(moduleName)["file_list"].concat();
    };
    ProjectConfig.prototype.getModuleFileListWithAbsolutePath = function (moduleName) {
        var list = this.getModuleConfig(moduleName)["file_list"].concat();
        var prefix = this.getModulePrefixPath(moduleName);
        var source = this.getModuleSourcePath(moduleName);
        return list.map(function (item) {
            return file.joinPath(prefix, source, item);
        });
    };
    ProjectConfig.prototype.getModulePrefixPath = function (moduleName) {
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            return file.joinPath(params.getEgretRoot());
        }
        else {
            return file.join(this.getProjectRoot(), modulePath);
        }
    };
    ProjectConfig.prototype.getModuleSourcePath = function (moduleName) {
        return this.getModuleConfig(moduleName)["source"] || "";
    };
    ProjectConfig.prototype.getModuleDependenceList = function (moduleName) {
        return (this.getModuleConfig(moduleName)["dependence"] || []).concat();
    };
    ProjectConfig.prototype.getAllModuleNames = function () {
        var names = [];
        for (var key in this.properties["modules"]) {
            names.push(this.properties["modules"][key]["name"]);
            if (this.properties["modules"][key]["name"] == "core") {
                names.push("html5");
                names.push("native");
            }
        }
        //for (var key in this.modulesConfig) {
        //    names.push(key);
        //}
        return names;
    };
    ProjectConfig.prototype.getModuleDecouple = function (moduleName) {
        return this.getModuleConfig(moduleName)["decouple"] == "true" || this.getModuleConfig(moduleName)["decouple"] == true;
    };
    //获取项目需要的所有模块的.d.ts文件
    ProjectConfig.prototype.getModulesDts = function () {
        var libs = [];
        for (var moduleName in this.modulesConfig) {
            var moduleConfig = this.modulesConfig[moduleName];
            var output = this.getModuleOutput(moduleName);
            var dtsFile = file.join(output, moduleConfig.name + ".d.ts");
            libs.push(dtsFile);
        }
        return libs;
    };
    ProjectConfig.prototype.getModuleReferenceInfo = function () {
        var _this = this;
        var fileList = [];
        var moduleNames = this.getAllModuleNames();
        moduleNames.map(function (moduleName) {
            var file_list = _this.getModuleFileList(moduleName);
            var prefix = _this.getModulePrefixPath(moduleName);
            var source = _this.getModuleSourcePath(moduleName);
            file_list.map(function (item) {
                var tsFile = file.join(prefix, source, item);
                var ext = file.getExtension(tsFile).toLowerCase();
                if (ext == "ts" && item.indexOf(".d.ts") == -1) {
                    fileList.push(tsFile);
                }
            });
        });
        //todo
        var create_manifest = require("../../lib/tools/create_manifest.js");
        var referenceInfo = create_manifest.getModuleReferenceInfo(fileList);
        return referenceInfo;
    };
    ProjectConfig.prototype.getResourceName = function () {
        if (this.properties["resource"]) {
            return this.properties["resource"];
        }
        return "resource";
    };
    return ProjectConfig;
})();
var config = config || new ProjectConfig();
module.exports = config;
//# sourceMappingURL=ProjectConfig.js.map