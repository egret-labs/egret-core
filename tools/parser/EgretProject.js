/// <reference path="../lib/types.d.ts" />
var file = require("../lib/FileUtil");
var _utils = require("../lib/utils");
var path = require("path");
var EgretProject = (function () {
    function EgretProject() {
        this.egretProperties = {
            modules: []
        };
        this.projectRoot = "";
    }
    EgretProject.prototype.init = function (projectRoot) {
        this.projectRoot = projectRoot;
        this.reload();
    };
    EgretProject.prototype.invalid = function (report) {
        var result = !this.egretProperties.modules ||
            this.egretProperties.modules.length == 0;
        if (result && report) {
            console.log(_utils.tr(1602)); //缺少egretProperties.json
        }
        return result;
    };
    EgretProject.prototype.hasEUI = function () {
        return this.egretProperties.modules.some(function (m) { return m.name == "eui"; });
    };
    EgretProject.prototype.reload = function () {
        this.egretProperties = { modules: [] };
        var egretPropertiesPath = file.joinPath(this.projectRoot, "egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            this.egretProperties = JSON.parse(file.read(egretPropertiesPath));
            var useGUIorEUI = 0;
            for (var _i = 0, _a = this.egretProperties.modules; _i < _a.length; _i++) {
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
        return this.egretProperties.egret_version;
    };
    /**
     * 发布路径的根目录
     * @returns {string}
     */
    EgretProject.prototype.getReleaseRoot = function () {
        var p = "bin-release";
        if (globals.hasKeys(this.egretProperties, ["publish", "path"])) {
            p = this.egretProperties.publish.path;
        }
        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    };
    EgretProject.prototype.getVersionCode = function (runtime) {
        if (globals.hasKeys(this.egretProperties, ["publish", "baseVersion"])) {
            return this.egretProperties["publish"]["baseVersion"];
        }
        return 1;
    };
    EgretProject.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "path_ignore"])) {
            return this.egretProperties[egret.args.runtime]["path_ignore"];
        }
        return [];
    };
    EgretProject.prototype.getCopyExmlList = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "copyExmlList"])) {
            return this.egretProperties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    };
    EgretProject.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.egretProperties, ["native", platform + "_path"])) {
            return path.resolve(this.getProjectRoot(), this.egretProperties.native[platform + "_path"]);
        }
        return null;
    };
    EgretProject.prototype.getModulePath = function (moduleName) {
        for (var _i = 0, _a = this.egretProperties.modules; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.name == moduleName) {
                var moduleBin = void 0;
                if (m.path == null) {
                    moduleBin = path.join(egret.root, "build", moduleName);
                }
                else {
                    var tempModulePath = file.getAbsolutePath(m.path);
                    moduleBin = path.join(tempModulePath, "bin", moduleName);
                }
                return moduleBin;
            }
        }
        return null;
    };
    EgretProject.prototype.getModulesConfig = function () {
        var _this = this;
        //todo refactor
        return this.egretProperties.modules.map(function (m) { return m.name; }).map(function (name) {
            var path = _this.getModulePath(name);
            return { name: name, path: path };
        });
    };
    EgretProject.prototype.getPublishType = function (runtime) {
        if (globals.hasKeys(this.egretProperties, ["publish", runtime])) {
            return this.egretProperties["publish"][runtime];
        }
        return 0;
    };
    EgretProject.prototype.getResources = function () {
        if (globals.hasKeys(this.egretProperties, ["resources"])) {
            return this.egretProperties["resources"];
        }
        return ["resource"];
    };
    return EgretProject;
}());
exports.EgretProject = EgretProject;
exports.utils = new EgretProject();
