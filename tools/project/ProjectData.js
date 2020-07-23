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
var EgretProjectData = /** @class */ (function () {
    function EgretProjectData() {
        this.egretProperties = {
            modules: [],
            target: { current: "web" },
            vivo: {},
            ttgame: {}
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
    EgretProjectData.prototype.getVersion = function () {
        return this.egretProperties.egret_version || this.egretProperties.compilerVersion;
    };
    EgretProjectData.prototype.getIgnorePath = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.target, "path_ignore"])) {
            return this.egretProperties[egret.args.target]["path_ignore"];
        }
        return [];
    };
    EgretProjectData.prototype.getCurrentTarget = function () {
        if (globals.hasKeys(this.egretProperties, ["target", "current"])) {
            return this.egretProperties.target.current;
        }
        else {
            return "web";
        }
    };
    EgretProjectData.prototype.getCopyExmlList = function () {
        if (globals.hasKeys(this.egretProperties, [egret.args.target, "copyExmlList"])) {
            return this.egretProperties[egret.args.target]["copyExmlList"];
        }
        return [];
    };
    EgretProjectData.prototype.getNativePath = function (platform) {
        if (globals.hasKeys(this.egretProperties, ["native", platform + "_path"])) {
            return _path.resolve(this.getProjectRoot(), this.egretProperties.native[platform + "_path"]);
        }
        return null;
    };
    EgretProjectData.prototype.getMiniGame = function (type) {
        if (!this.egretProperties.ttgame)
            this.egretProperties.ttgame = {};
        if (!this.egretProperties.ttgame["usePlugin"])
            this.egretProperties.ttgame["usePlugin"] = false;
        return this.egretProperties[type];
    };
    EgretProjectData.prototype.setMiniGameData = function (type, key, value) {
        this.egretProperties[type][key] = value;
    };
    EgretProjectData.prototype.getModulePath2 = function (m) {
        var p = m.path;
        if (!p) {
            var engineVersion = m.version || this.egretProperties.engineVersion;
            if (engineVersion) {
                var versions = exports.launcher.getEgretToolsInstalledByVersion(engineVersion);
                return _path.join(versions, 'build', m.name);
            }
            return _path.join(egret.root, 'build', m.name);
        }
        var egretLibs;
        if (process.platform === 'linux') {
            egretLibs = _path.resolve(__dirname, '../../');
        }
        else {
            egretLibs = getAppDataEnginesRootPath();
        }
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
        var modulePath = this.getModulePath2(m);
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
            _path.join(modulePath)
        ];
        // if (m.path) {
        //     searchPaths.push(modulePath)
        // }
        if (this.isWasmProject()) {
            searchPaths.unshift(_path.join(modulePath, "bin-wasm"));
            searchPaths.unshift(_path.join(modulePath, "bin-wasm", name));
        }
        var dir = file.searchPath(searchPaths);
        if (!dir) {
            globals.exit(1050, name);
        }
        return dir;
    };
    EgretProjectData.prototype.getLibraryFolder = function () {
        return this.getFilePath('libs/modules');
    };
    EgretProjectData.prototype.getModulesConfig = function (platform) {
        var _this = this;
        if (platform == 'ios' || platform == 'android') {
            platform = 'web';
        }
        var result = this.egretProperties.modules.map(function (m) {
            var name = m.name;
            var sourceDir = _this.getModulePath(m);
            var targetDir = _path.join(_this.getLibraryFolder(), name);
            var relative = _path.relative(_this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !_path.isAbsolute(relative)) { // source 在项目中
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
    EgretProjectData.prototype.save = function (version) {
        if (version) {
            this.egretProperties.engineVersion = version;
            this.egretProperties.compilerVersion = version;
        }
        var egretPropertiesPath = this.getFilePath("egretProperties.json");
        var content = JSON.stringify(this.egretProperties, null, "\t");
        file.save(egretPropertiesPath, content);
    };
    __decorate([
        _utils.cache
    ], EgretProjectData.prototype, "getModulesConfig", null);
    return EgretProjectData;
}());
var EgretLauncherProxy = /** @class */ (function () {
    function EgretLauncherProxy() {
    }
    EgretLauncherProxy.prototype.getMinVersion = function () {
        return {
            getAllEngineVersions: '1.0.24',
            getInstalledTools: '1.0.24',
            getTarget: "1.0.45",
            getUserID: "1.0.46",
            sign: "1.0.46"
        };
    };
    EgretLauncherProxy.prototype.getEgretToolsInstalledByVersion = function (checkVersion) {
        if (process.platform === 'linux') {
            return _path.resolve(__dirname, '../../');
        }
        var egretjs = this.getLauncherLibrary();
        var data = egretjs.getAllEngineVersions();
        var versions = [];
        for (var key in data) {
            var item = data[key];
            versions.push({ version: item.version, path: item.root });
        }
        for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
            var versionInfo = versions_1[_i];
            if (versionInfo.version == checkVersion) {
                return versionInfo.path;
            }
        }
        throw "\u627E\u4E0D\u5230\u6307\u5B9A\u7684 egret \u7248\u672C: " + checkVersion;
    };
    EgretLauncherProxy.prototype.getLauncherLibrary = function () {
        var egretjspath = file.joinPath(getEgretLauncherPath(), "egret.js");
        var minVersions = this.getMinVersion();
        var m = require(egretjspath);
        var selector = m.selector;
        if (!this.proxy) {
            this.proxy = new Proxy(selector, {
                get: function (target, p, receiver) {
                    var result = target[p];
                    if (!result) {
                        var minVersion = minVersions[p];
                        throw "\u627E\u4E0D\u5230 LauncherAPI:" + String(p) + ",\u8BF7\u5B89\u88C5\u6700\u65B0\u7684\u767D\u9E6D\u5F15\u64CE\u542F\u52A8\u5668\u5BA2\u6237\u7AEF\u89E3\u51B3\u6B64\u95EE\u9898,\u6700\u4F4E\u7248\u672C\u8981\u6C42:" + minVersion + ",\u4E0B\u8F7D\u5730\u5740:https://egret.com/products"; //i18n
                    }
                    return result.bind(target);
                }
            });
        }
        return this.proxy;
    };
    return EgretLauncherProxy;
}());
function getAppDataPath() {
    var result;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            result = home + "/Library/Application Support/"; //Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            result = file.escapePath(appdata);
            break;
        default:
            ;
    }
    if (!file.exists(result)) {
        throw 'missing appdata path';
    }
    return result;
}
function getAppDataEnginesRootPath() {
    var result = file.joinPath(getAppDataPath(), "Egret/engine/");
    if (!file.exists(result)) {
        throw "\u627E\u4E0D\u5230 " + result + "\uFF0C\u8BF7\u5728 Egret Launcher \u4E2D\u6267\u884C\u4FEE\u590D\u5F15\u64CE"; //todo i18n
    }
    return result;
}
function getEgretLauncherPath() {
    var npmEgretPath;
    if (process.platform === 'darwin') {
        var basicPath = '/usr/local';
        if (!file.existsSync(basicPath)) { //some mac doesn't have path '/usr/local'
            basicPath = '/usr';
        }
        npmEgretPath = file.joinPath(basicPath, 'lib/node_modules/egret/EgretEngine');
    }
    else {
        npmEgretPath = file.joinPath(getAppDataPath(), 'npm/node_modules/egret/EgretEngine');
    }
    if (!file.exists(npmEgretPath)) {
        throw "\u627E\u4E0D\u5230  " + npmEgretPath + "\uFF0C\u8BF7\u5728 Egret Launcher \u4E2D\u6267\u884C\u4FEE\u590D\u5F15\u64CE"; //todo i18n
    }
    var launcherPath = file.joinPath(file.read(npmEgretPath), "../");
    return launcherPath;
}
exports.launcher = new EgretLauncherProxy();
exports.projectData = new EgretProjectData();
