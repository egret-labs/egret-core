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
        var egretPropertiesPath = this.getFilePath("egretProperties.json");
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
        return path.resolve(this.getProjectRoot(), fileName);
    };
    /**
     * 获取项目使用的egret版本号
     */
    EgretProject.prototype.getVersion = function () {
        return this.egretProperties.egret_version;
    };
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
    EgretProject.prototype.getModulePath = function (m) {
        var dir = "";
        if (m.path == null) {
            dir = path.join(egret.root, "build", m.name);
        }
        else {
            var tempModulePath = file.getAbsolutePath(m.path);
            dir = path.join(tempModulePath, "bin", m.name);
            if (!file.exists(dir)) {
                dir = tempModulePath;
            }
        }
        return dir;
    };
    EgretProject.prototype.getLibraryFolder = function () {
        return this.getFilePath('libs/modules');
    };
    EgretProject.prototype.getModulesConfig = function (platform) {
        var _this = this;
        return this.egretProperties.modules.map(function (m) {
            var name = m.name;
            var sourceDir = _this.getModulePath(m);
            var targetDir = path.join(_this.getLibraryFolder(), name);
            var relative = path.relative(_this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !path.isAbsolute(relative)) {
                targetDir = sourceDir;
            }
            targetDir = file.escapePath(path.relative(_this.getProjectRoot(), targetDir)) + path.sep;
            var source = [
                file.joinPath(sourceDir, name + ".js"),
                file.joinPath(sourceDir, name + "." + platform + ".js")
            ].filter(file.exists);
            var target = source.map(function (s) {
                var debug = file.joinPath(targetDir, path.basename(s));
                var release = file.joinPath(targetDir, path.basename(s, '.js') + '.min.js');
                return {
                    debug: debug,
                    release: release,
                    platform: platform
                };
            });
            return { name: name, target: target, sourceDir: sourceDir, targetDir: targetDir };
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
