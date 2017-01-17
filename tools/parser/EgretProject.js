/// <reference path="../lib/types.d.ts" />
var file = require("../lib/FileUtil");
var _utils = require("../lib/utils");
var path = require("path");
var EgretProject = (function () {
    function EgretProject() {
        this.properties = {
            modules: []
        };
        this.projectRoot = "";
    }
    EgretProject.prototype.init = function (projectRoot) {
        this.projectRoot = projectRoot;
        this.reload();
    };
    EgretProject.prototype.invalid = function (report) {
        var result = !this.properties.modules ||
            this.properties.modules.length == 0;
        if (result && report) {
            console.log(_utils.tr(1602)); //缺少egretProperties.json
        }
        return result;
    };
    EgretProject.prototype.hasEUI = function () {
        return this.properties.modules.some(function (m) { return m.name == "eui"; });
    };
    EgretProject.prototype.reload = function () {
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
    /**
     * 获取项目的根路径
     */
    EgretProject.prototype.getProjectRoot = function () {
        return this.projectRoot;
    };
    EgretProject.prototype.getFilePath = function (fileName) {
        return file.joinPath(this.getProjectRoot(), fileName);
    };
    /**
     * 获取项目使用的egret版本号
     * @returns {any}
     */
    EgretProject.prototype.getVersion = function () {
        return this.properties.egret_version;
    };
    /**
     * 发布路径的根目录
     * @returns {string}
     */
    EgretProject.prototype.getReleaseRoot = function () {
        var p = "bin-release";
        if (globals.hasKeys(this.properties, ["publish", "path"])) {
            p = this.properties.publish.path;
        }
        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    };
    EgretProject.prototype.getVersionCode = function (runtime) {
        if (globals.hasKeys(this.properties, ["publish", "baseVersion"])) {
            return this.properties["publish"]["baseVersion"];
        }
        return 1;
    };
    EgretProject.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "path_ignore"])) {
            return this.properties[egret.args.runtime]["path_ignore"];
        }
        return [];
    };
    EgretProject.prototype.getCopyExmlList = function () {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "copyExmlList"])) {
            return this.properties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    };
    EgretProject.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.properties, ["native", platform + "_path"])) {
            return path.resolve(this.getProjectRoot(), this.properties.native[platform + "_path"]);
        }
        return null;
    };
    EgretProject.prototype.getModulePath = function (moduleName) {
        for (var _i = 0, _a = this.properties.modules; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.name == moduleName) {
                return m.path;
            }
        }
        return null;
    };
    EgretProject.prototype.getModuleConfig = function (moduleName) {
        var moduleJsonPath;
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            moduleJsonPath = file.joinPath(egret.root, "tools/lib/manifest", moduleName + ".json");
        }
        else {
            moduleJsonPath = file.joinPath(this.projectRoot, modulePath, moduleName + ".json");
        }
        var content = file.read(moduleJsonPath);
        if (!content) {
            globals.exit(8003, moduleJsonPath);
        }
        return JSON.parse(content);
    };
    EgretProject.prototype.getModuleSourcePath = function (moduleName) {
        return this.getModuleConfig(moduleName)["source"] || "";
    };
    EgretProject.prototype.getAllModuleNames = function () {
        return this.properties.modules.map(function (m) { return m.name; });
    };
    EgretProject.prototype.getPublishType = function (runtime) {
        if (globals.hasKeys(this.properties, ["publish", runtime])) {
            return this.properties["publish"][runtime];
        }
        return 0;
    };
    EgretProject.prototype.getResources = function () {
        if (globals.hasKeys(this.properties, ["resources"])) {
            return this.properties["resources"];
        }
        return ["resource"];
    };
    return EgretProject;
}());
exports.EgretProject = EgretProject;
exports.utils = new EgretProject();
