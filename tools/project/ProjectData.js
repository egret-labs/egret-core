var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var file = require("../lib/FileUtil");
var _utils = require("../lib/utils");
var _path = require("path");
var EgretProjectData = (function () {
    function EgretProjectData() {
        this.egretProperties = {
            modules: [],
            target: { current: "web" }
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
    EgretProjectData.prototype.getCurrentTarget = function () {
        if (globals.hasKeys(this.egretProperties, ["target", "current"])) {
            return this.egretProperties.target.current;
        }
        else {
            return "web";
        }
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
    EgretProjectData.prototype.getModulePath2 = function (m) {
        var p = m.path;
        if (!p) {
            var engineVersion = m.version || this.egretProperties.engineVersion;
            if (engineVersion) {
                var versions = exports.engineData.getEgretToolsInstalledByVersion(engineVersion);
                return _path.join(versions, 'build', m.name);
            }
            return _path.join(egret.root, 'build', m.name);
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
    return EgretProjectData;
}());
__decorate([
    _utils.cache
], EgretProjectData.prototype, "getModulesConfig", null);
var EngineData = (function () {
    function EngineData() {
        this.versions = [];
    }
    EngineData.prototype.getEgretToolsInstalledByVersion = function (checkVersion) {
        for (var _i = 0, _a = this.versions; _i < _a.length; _i++) {
            var versionInfo = _a[_i];
            if (versionInfo.version == checkVersion) {
                return versionInfo.path;
            }
        }
        throw "\u627E\u4E0D\u5230\u6307\u5B9A\u7684 egret \u7248\u672C: " + checkVersion;
    };
    EngineData.prototype.getLauncherLibrary = function () {
        var egretjspath = file.joinPath(getEgretLauncherPath(), "egret.js");
        var m = require(egretjspath);
        var selector = m.selector;
        if (!this.proxy) {
            this.proxy = new Proxy(selector, {
                get: function (target, p, receiver) {
                    var result = target[p];
                    if (!result) {
                        throw "\u627E\u4E0D\u5230 Launcher API: " + p + ",\u8BF7\u5347\u7EA7\u6700\u65B0\u7684 Egret Launcher \u4EE5\u89E3\u51B3\u6B64\u95EE\u9898"; //i18n
                    }
                    return result.bind(target);
                }
            });
        }
        return this.proxy;
    };
    EngineData.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var egretjs, data, item, value;
            return __generator(this, function (_a) {
                egretjs = this.getLauncherLibrary();
                data = egretjs.getAllEngineVersions();
                for (item in data) {
                    value = data[item];
                    this.versions.push({ version: value.version, path: value.root });
                }
                return [2 /*return*/];
            });
        });
    };
    return EngineData;
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
        if (!file.existsSync(basicPath)) {
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
exports.projectData = new EgretProjectData();
exports.engineData = new EngineData();
