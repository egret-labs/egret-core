var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var file = require("../lib/FileUtil");
var _utils = require("../lib/utils");
var _path = require("path");
var cp = require("child_process");
var EgretProjectData = (function () {
    function EgretProjectData() {
        this.egretProperties = {
            modules: []
        };
        this.projectRoot = "";
    }
    EgretProjectData.prototype.init = function (projectRoot) {
        this.projectRoot = projectRoot;
        this.reload();
    };
    EgretProjectData.prototype.invalid = function (report) {
        var result = !this.egretProperties.modules ||
            this.egretProperties.modules.length == 0;
        if (result && report) {
            console.log(_utils.tr(1602)); //缺少egretProperties.json
        }
        return result;
    };
    EgretProjectData.prototype.hasEUI = function () {
        return this.egretProperties.modules.some(function (m) { return m.name == "eui"; });
    };
    EgretProjectData.prototype.reload = function () {
        this.egretProperties = { modules: [] };
        var egretPropertiesPath = this.getFilePath("egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            this.egretProperties = JSON.parse(file.read(egretPropertiesPath));
            var useGUIorEUI = 0;
            for (var _i = 0, _a = this.egretProperties.modules; _i < _a.length; _i++) {
                var m = _a[_i];
                //兼容小写
                if (m.name == "dragonbones") {
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
    EgretProjectData.prototype.getProjectRoot = function () {
        return this.projectRoot;
    };
    EgretProjectData.prototype.getFilePath = function (fileName) {
        return _path.resolve(this.getProjectRoot(), fileName);
    };
    /**
     * 获取项目使用的egret版本号
     */
    EgretProjectData.prototype.getVersion = function () {
        return this.egretProperties.egret_version;
    };
    EgretProjectData.prototype.getReleaseRoot = function () {
        var p = "bin-release";
        if (globals.hasKeys(this.egretProperties, ["publish", "path"])) {
            p = this.egretProperties.publish.path;
        }
        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    };
    EgretProjectData.prototype.getVersionCode = function (runtime) {
        if (globals.hasKeys(this.egretProperties, ["publish", "baseVersion"])) {
            return this.egretProperties["publish"]["baseVersion"];
        }
        return 1;
    };
    EgretProjectData.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "path_ignore"])) {
            return this.egretProperties[egret.args.runtime]["path_ignore"];
        }
        return [];
    };
    EgretProjectData.prototype.getExmlRoots = function () {
        if (globals.hasKeys(this.egretProperties, ["eui", "exmlRoot"])) {
            var result = this.egretProperties.eui.exmlRoot;
            if (typeof result == "string") {
                return [_path.join(egret.args.projectDir, result)];
            }
            else {
                var temp = this.egretProperties.eui.exmlRoot;
                return temp.reduce(function (previousValue, currentValue) {
                    previousValue.push(_path.join(egret.args.projectDir, currentValue));
                    return previousValue;
                }, []);
            }
        }
        return [egret.args.projectDir];
    };
    EgretProjectData.prototype.getThemes = function () {
        if (globals.hasKeys(this.egretProperties, ["eui", "themes"])) {
            return this.egretProperties.eui.themes;
        }
        return null;
    };
    EgretProjectData.prototype.getExmlPublishPolicy = function () {
        if (globals.hasKeys(this.egretProperties, ["eui", "exmlPublishPolicy"])) {
            return this.egretProperties.eui.exmlPublishPolicy;
        }
        return "content";
    };
    EgretProjectData.prototype.getCopyExmlList = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "copyExmlList"])) {
            return this.egretProperties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    };
    EgretProjectData.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.egretProperties, ["native", platform + "_path"])) {
            return _path.resolve(this.getProjectRoot(), this.egretProperties.native[platform + "_path"]);
        }
        return null;
    };
    EgretProjectData.prototype.getModulePath2 = function (p) {
        if (!p) {
            return egret.root;
        }
        var egretLibs = getAppDataEnginesRootPath();
        var keyword = '${EGRET_APP_DATA}';
        if (p.indexOf(keyword) >= 0) {
            p = p.replace(keyword, egretLibs);
        }
        var keyword2 = '${EGRET_DEFAULT}';
        if (p.indexOf(keyword2) >= 0) {
            p = p.replace(keyword2, egret.root);
        }
        return p;
    };
    EgretProjectData.prototype.getModulePath = function (m) {
        var modulePath = this.getModulePath2(m.path);
        modulePath = file.getAbsolutePath(modulePath);
        var name = m.name;
        if (this.isWasmProject()) {
            if (name == "egret" || name == "eui" || name == "dragonBones" || name == "game") {
                name += "-wasm";
            }
        }
        var searchPaths = [
            _path.join(modulePath, "bin", name),
            _path.join(modulePath, "bin"),
            _path.join(modulePath, "build", name),
            modulePath
        ];
        if (this.isWasmProject()) {
            searchPaths.unshift(_path.join(modulePath, "bin-wasm"));
            searchPaths.unshift(_path.join(modulePath, "bin-wasm", name));
        }
        var dir = file.searchPath(searchPaths);
        if (!dir) {
            globals.exit(1050, modulePath);
        }
        return dir;
    };
    EgretProjectData.prototype.getLibraryFolder = function () {
        return this.getFilePath('libs/modules');
    };
    EgretProjectData.prototype.getEgretVersionInfos = function () {
        var build = cp.spawnSync("egret", ["versions"], {
            encoding: "utf-8"
        });
        var versions;
        if (build && build.stdout) {
            versions = build.stdout.toString().split("\n");
            //删除最后一行空格
            versions = versions.slice(0, versions.length - 1);
        }
        else {
            versions = [];
        }
        var result = versions.map(function (versionStr) {
            var version;
            var path;
            var versionRegExp = /(\d+\.){2}\d+(\.\d+)?/g;
            var matchResultVersion = versionStr.match(versionRegExp);
            if (matchResultVersion && matchResultVersion.length > 0) {
                version = matchResultVersion[0];
            }
            var pathRegExp = /(?:[a-zA-Z]\:)?(?:[\\|\/][^\\|\/]+)+[\\|\/]?/g;
            var matchResult2 = versionStr.match(pathRegExp);
            if (matchResult2 && matchResult2.length > 0) {
                path = _path.join(matchResult2[0], '.');
            }
            return { version: version, path: path };
        });
        return result;
    };
    EgretProjectData.prototype.getModulesConfig = function (platform) {
        var _this = this;
        var result = this.egretProperties.modules.map(function (m) {
            var name = m.name;
            var sourceDir = _this.getModulePath(m);
            var targetDir = _path.join(_this.getLibraryFolder(), name);
            var relative = _path.relative(_this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !_path.isAbsolute(relative)) {
                targetDir = sourceDir;
            }
            targetDir = file.escapePath(_path.relative(_this.getProjectRoot(), targetDir)) + _path.sep;
            var source = [
                file.joinPath(sourceDir, name + ".js"),
                file.joinPath(sourceDir, name + "." + platform + ".js")
            ].filter(file.exists);
            var target = source.map(function (s) {
                var debug = file.joinPath(targetDir, _path.basename(s));
                var release = file.joinPath(targetDir, _path.basename(s, '.js') + '.min.js');
                return {
                    debug: debug,
                    release: release,
                    platform: platform
                };
            });
            return { name: name, target: target, sourceDir: sourceDir, targetDir: targetDir };
        });
        return result;
    };
    EgretProjectData.prototype.isWasmProject = function () {
        if (globals.hasKeys(this.egretProperties, ["wasm"])) {
            return true;
        }
        return false;
    };
    EgretProjectData.prototype.getPublishType = function (runtime) {
        if (globals.hasKeys(this.egretProperties, ["publish", runtime])) {
            return this.egretProperties["publish"][runtime];
        }
        return 0;
    };
    EgretProjectData.prototype.getResources = function () {
        if (globals.hasKeys(this.egretProperties, ["resources"])) {
            return this.egretProperties["resources"];
        }
        return ["resource"];
    };
    Object.defineProperty(EgretProjectData.prototype, "useTemplate", {
        get: function () {
            return this.egretProperties.template != undefined;
        },
        enumerable: true,
        configurable: true
    });
    EgretProjectData.prototype.hasModule = function (name) {
        var result = false;
        this.egretProperties.modules.forEach(function (module) {
            if (module.name == name || module.name == name) {
                result = true;
            }
        });
        return result;
    };
    __decorate([
        _utils.cache
    ], EgretProjectData.prototype, "getModulesConfig", null);
    return EgretProjectData;
}());
exports.EgretProjectData = EgretProjectData;
exports.data = new EgretProjectData();
function getAppDataEnginesRootPath() {
    var path;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            path = home + "/Library/Application Support/Egret/engine/";
            break;
        case 'win32':
            var appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            path = file.escapePath(appdata + "/Egret/engine/");
            break;
        default:
            ;
    }
    if (file.exists(path))
        return path;
    return null;
}
