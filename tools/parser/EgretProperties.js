/// <reference path="../lib/types.d.ts" />
var file = require("../lib/FileUtil");
var utils = require("../lib/utils");
var path = require("path");
var EgretProperties = (function () {
    function EgretProperties() {
        this.properties = {
            modules: []
        };
        this.projectRoot = "";
    }
    EgretProperties.prototype.init = function (projectRoot) {
        this.projectRoot = projectRoot;
        this.reload();
    };
    EgretProperties.prototype.invalid = function (report) {
        var result = !this.properties.modules ||
            this.properties.modules.length == 0;
        if (result && report) {
            console.log(utils.tr(1602)); //缺少egretProperties.json
        }
        return result;
    };
    EgretProperties.prototype.hasEUI = function () {
        return this.properties.modules.some(function (m) { return m.name == "eui"; });
    };
    EgretProperties.prototype.reload = function () {
        this.properties = { modules: [] };
        var egretPropertiesPath = file.joinPath(this.projectRoot, "egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            this.properties = JSON.parse(file.read(egretPropertiesPath));
            var useGUIorEUI = 0;
            for (var _i = 0, _a = this.properties.modules; _i < _a.length; _i++) {
                var m = _a[_i];
                //兼容小写
                if (m.name == "dragonbones" && !m.path) {
                    m.name = "dragonBones";
                }
                if (m.name == "gui" || m.name == "eui") {
                    useGUIorEUI++;
                }
            }
            if (useGUIorEUI >= 2) {
                globals.log2(8);
                process.exit(1);
            }
        }
    };
    // /**
    //  * 是否有swan
    //  */
    // hasEUI(): boolean {
    //     return this.properties.modules.some(m => m.name == "eui");
    // }
    /**
     * 获取项目的根路径
     * @returns {*}
     */
    EgretProperties.prototype.getProjectRoot = function () {
        return egret.args.projectDir;
    };
    /**
     * 获取项目使用的egret版本号
     * @returns {any}
     */
    EgretProperties.prototype.getVersion = function () {
        return this.properties.egret_version;
    };
    /**
     * 发布路径的根目录
     * @returns {string}
     */
    EgretProperties.prototype.getReleaseRoot = function () {
        var p = "bin-release";
        if (globals.hasKeys(this.properties, ["publish", "path"])) {
            p = this.properties.publish.path;
        }
        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    };
    //获得egret_file_list
    EgretProperties.prototype.getFileList = function (file_list) {
        var js_content = file.read(file_list);
        js_content = js_content.match(/\[[^\]]*\]/)[0];
        return JSON.parse(js_content);
    };
    /**
     * 获取已经生成的js文件列表
     * @param runtime
     * @returns {string[]|T[]}
     */
    EgretProperties.prototype.getAllFileList = function (runtime) {
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
    EgretProperties.prototype.getVersionCode = function (runtime) {
        if (globals.hasKeys(this.properties, ["publish", "baseVersion"])) {
            return this.properties["publish"]["baseVersion"];
        }
        return 1;
    };
    EgretProperties.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "path_ignore"])) {
            return this.properties[egret.args.runtime]["path_ignore"];
        }
        return [];
    };
    EgretProperties.prototype.getCopyExmlList = function () {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "copyExmlList"])) {
            return this.properties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    };
    EgretProperties.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.properties, ["native", platform + "_path"])) {
            return path.resolve(this.getProjectRoot(), this.properties.native[platform + "_path"]);
        }
        return null;
    };
    EgretProperties.prototype.getModulePath = function (moduleName) {
        for (var _i = 0, _a = this.properties.modules; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.name == moduleName) {
                return m.path;
            }
        }
        return null;
    };
    EgretProperties.prototype.getModuleConfig = function (moduleName) {
        var moduleJsonPath;
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            moduleJsonPath = file.joinPath(egret.root, "tools/lib/manifest", moduleName + ".json");
        }
        else {
            moduleJsonPath = file.joinPath(egret.args.projectDir, modulePath, moduleName + ".json");
        }
        var content = file.read(moduleJsonPath);
        if (!content) {
            globals.exit(8003, moduleJsonPath);
        }
        return JSON.parse(content);
    };
    //绝对路径
    EgretProperties.prototype.getModuleOutput = function (moduleName) {
        var output = this.getModuleConfig(moduleName)["output"] || moduleName;
        return file.joinPath(this.getProjectRoot(), "libs", output);
    };
    EgretProperties.prototype.getModuleFileList = function (moduleName) {
        return this.getModuleConfig(moduleName)["file_list"].concat();
    };
    EgretProperties.prototype.getModuleFileListWithAbsolutePath = function (moduleName) {
        var list = this.getModuleConfig(moduleName)["file_list"].concat();
        var prefix = this.getModulePrefixPath(moduleName);
        var source = this.getModuleSourcePath(moduleName);
        return list.map(function (item) {
            return file.joinPath(prefix, source, item);
        });
    };
    EgretProperties.prototype.getModulePrefixPath = function (moduleName) {
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            return file.joinPath(egret.root);
        }
        else {
            return file.joinPath(this.getProjectRoot(), modulePath);
        }
    };
    EgretProperties.prototype.getModuleSourcePath = function (moduleName) {
        return this.getModuleConfig(moduleName)["source"] || "";
    };
    EgretProperties.prototype.getModuleDependenceList = function (moduleName) {
        return (this.getModuleConfig(moduleName)["dependence"] || []).concat();
    };
    EgretProperties.prototype.getAllModuleNames = function () {
        return this.properties.modules.map(function (m) { return m.name; });
    };
    EgretProperties.prototype.getModuleDecouple = function (moduleName) {
        return this.getModuleConfig(moduleName)["decouple"] == "true" || this.getModuleConfig(moduleName)["decouple"] == true;
    };
    //获取项目需要的所有模块的.d.ts文件
    EgretProperties.prototype.getModulesDts = function () {
        var _this = this;
        return this.properties.modules.map(function (m) {
            var output = _this.getModuleOutput(m.name);
            var dtsFile = file.joinPath(output, m.name + ".d.ts");
            return dtsFile;
        });
    };
    EgretProperties.prototype.getModuleReferenceInfo = function () {
        var _this = this;
        var fileList = [];
        var moduleNames = this.getAllModuleNames();
        moduleNames.map(function (moduleName) {
            var file_list = _this.getModuleFileList(moduleName);
            var prefix = _this.getModulePrefixPath(moduleName);
            var source = _this.getModuleSourcePath(moduleName);
            file_list.map(function (item) {
                var tsFile = file.joinPath(prefix, source, item);
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
    EgretProperties.prototype.getPublishType = function (runtime) {
        if (globals.hasKeys(this.properties, ["publish", runtime])) {
            return this.properties["publish"][runtime];
        }
        return 0;
    };
    EgretProperties.prototype.getResources = function () {
        if (globals.hasKeys(this.properties, ["resources"])) {
            return this.properties["resources"];
        }
        return ["resource"];
    };
    return EgretProperties;
}());
var config = config || new EgretProperties();
module.exports = config;
