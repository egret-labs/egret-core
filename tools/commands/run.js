/// <reference path="../lib/types.d.ts" />
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
var utils = require("../lib/utils");
// import fileUtil = require('../lib/FileUtil');
var watch = require("../lib/watch");
var path = require("path");
var Build = require("./build");
var Server = require("../server/server");
var FileUtil = require("../lib/FileUtil");
var service = require("../service/index");
var project_1 = require("../project");
var os = require("os");
var Run = /** @class */ (function () {
    function Run() {
        this.initVersion = ""; //初始化的 egret 版本，如果版本变化了，关掉当前的进程
    }
    Run.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exitCode, target, toolsList, _a, port;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, new Build().execute()];
                    case 1:
                        exitCode = _b.sent();
                        target = egret.args.target;
                        toolsList = project_1.launcher.getLauncherLibrary().getInstalledTools();
                        _a = target;
                        switch (_a) {
                            case "web": return [3 /*break*/, 2];
                            case "wxgame": return [3 /*break*/, 4];
                            case 'bricks': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 2: return [4 /*yield*/, utils.getAvailablePort(egret.args.port)];
                    case 3:
                        port = _b.sent();
                        this.initServer(port);
                        return [2 /*return*/, DontExitCode];
                    case 4: return [4 /*yield*/, runWxIde()];
                    case 5: return [2 /*return*/, (_b.sent())];
                    case 6: return [4 /*yield*/, runBricks()];
                    case 7: return [2 /*return*/, (_b.sent())];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Run.prototype.initServer = function (port) {
        egret.args.port = port;
        var addresses = utils.getNetworkAddress();
        if (addresses.length > 0) {
            egret.args.host = addresses[0];
        }
        var openWithBrowser = !egret.args.serverOnly;
        var server = new Server();
        var projectDir = egret.args.projectDir;
        server.use(Server.fileReader(projectDir));
        server.start(projectDir, port, this.wrapByParams(egret.args.startUrl), openWithBrowser);
        if (egret.args.serverOnly) {
            console.log("Url:" + this.wrapByParams(egret.args.startUrl));
        }
        else {
            console.log('\n');
            console.log("    " + utils.tr(10013, ''));
            console.log('\n');
            console.log('        ' + this.wrapByParams(egret.args.startUrl));
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + this.wrapByParams(egret.args.getStartURL(addresses[i])));
            }
            console.log('\n');
        }
        if (egret.args.autoCompile) {
            console.log('    ' + utils.tr(10010));
            this.watchFiles(egret.args.srcDir);
            //this.watchFiles(egret.args.templateDir);
        }
        else if (!egret.args.serverOnly) {
            console.log('    ' + utils.tr(10012));
        }
    };
    Run.prototype.watchFiles = function (dir) {
        var _this = this;
        watch.createMonitor(dir, { persistent: true, interval: 2007, filter: function (f, stat) { return !f.match(/\.g(\.d)?\.ts/); } }, function (m) {
            m.on("created", function (f) { return _this.sendBuildCMD(f, "added"); })
                .on("removed", function (f) { return _this.sendBuildCMD(f, "removed"); })
                .on("changed", function (f) { return _this.sendBuildCMD(f, "modified"); });
        });
        /*//监听build文件夹的变化
        watch.createMonitor(path.join(egret.root,'build'), { persistent: true, interval: 2007, filter: function (f, stat) {
            return true;
        } }, function (m) {
            m.on("created", (f) => this.shutDown(f, "added"))
                .on("removed", (f) => this.shutDown(f, "removed"))
                .on("changed", (f) => this.shutDown(f, "modified"));
        });*/
        watch.createMonitor(path.dirname(dir), {
            persistent: true, interval: 2007, filter: function (f, stat) {
                if (path.basename(f) == "egretProperties.json") {
                    _this.initVersion = _this.getVersion(f);
                    return true;
                }
                else {
                    return false;
                }
            }
        }, function (m) {
            m.on("created", function (f) { return _this.shutDown(f, "added"); })
                .on("removed", function (f) { return _this.shutDown(f, "removed"); })
                .on("changed", function (f) { return _this.shutDown(f, "modified"); });
        });
    };
    Run.prototype.shutDown = function (file, type) {
        file = FileUtil.escapePath(file);
        var isShutdown = false;
        if (path.basename(file) == 'egretProperties.json') {
            var nowVersion = this.getVersion(file);
            if (this.initVersion != nowVersion) {
                isShutdown = true;
            }
        }
        else {
            isShutdown = true;
        }
        if (isShutdown) {
            service.client.execCommand({
                path: egret.args.projectDir,
                command: "shutdown",
                option: egret.args
            }, function () { return process.exit(0); }, true);
        }
    };
    Run.prototype.sendBuildCMD = function (file, type) {
        file = FileUtil.escapePath(file);
        egret.args[type] = [file];
        service.client.execCommand({ command: "build", path: egret.args.projectDir, option: egret.args }, function (cmd) {
            if (!cmd.exitCode)
                console.log('    ' + utils.tr(10011));
            else
                console.log('    ' + utils.tr(10014), cmd.exitCode);
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
        });
    };
    Run.prototype.getVersion = function (filePath) {
        var jsstr = FileUtil.read(filePath);
        var js = JSON.parse(jsstr);
        return js["egret_version"];
    };
    Run.prototype.wrapByParams = function (url) {
        return url + this.genParams();
    };
    Run.prototype.genParams = function () {
        var result = "";
        var propertyFilePath = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
        if (FileUtil.exists(propertyFilePath)) {
            var urlParams = JSON.parse(FileUtil.read(propertyFilePath)).urlParams;
            if (urlParams) {
                var hasParams = false;
                for (var key in urlParams) {
                    hasParams = true;
                    result += key + "=" + urlParams[key] + "&";
                }
                if (hasParams) {
                    result = "?" + result.substr(0, result.length - 1);
                }
            }
        }
        return result;
    };
    __decorate([
        utils.cache
    ], Run.prototype, "genParams", null);
    return Run;
}());
function runWxIde() {
    return __awaiter(this, void 0, void 0, function () {
        var wxPaths, packagePath, _a, result, stdout_1, iconv, encoding, binaryEncoding, result2, stdout, stdoutArr, exePath, packageJson, _b, _c, _d, wxpath, projectPath, result, e_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    wxPaths = [];
                    _a = os.platform();
                    switch (_a) {
                        case "darwin": return [3 /*break*/, 1];
                        case "win32": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, utils.executeCommand("defaults read com.tencent.wechat.devtools LastRunAppBundlePath")];
                case 2:
                    result = _e.sent();
                    if (result.stdout != '') {
                        stdout_1 = result.stdout.replace(/\n/g, "");
                        wxPaths = [FileUtil.joinPath(stdout_1, "/Contents/Resources/app.nw/bin/cli")];
                    }
                    // defaults read
                    wxPaths.push("/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli");
                    packagePath = "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/package.json";
                    return [3 /*break*/, 5];
                case 3:
                    // defaults read
                    wxPaths = [
                        "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat",
                        "C:\\Program Files\\Tencent\\微信web开发者工具\\cli.bat"
                    ];
                    iconv = require('../lib/iconv-lite');
                    encoding = 'cp936';
                    binaryEncoding = 'binary';
                    return [4 /*yield*/, utils.executeCommand('REG QUERY "HKLM\\SOFTWARE\\Wow6432Node\\Tencent\\微信web开发者工具"', { encoding: binaryEncoding })];
                case 4:
                    result2 = _e.sent();
                    stdout = iconv.decode(new Buffer(result2.stdout, binaryEncoding), encoding);
                    if (stdout != '') {
                        stdoutArr = stdout.split("\r\n");
                        exePath = stdoutArr.find(function (path) { return path.indexOf(".exe") != -1; });
                        exePath = exePath.split("  ").find(function (path) { return path.indexOf(".exe") != -1; });
                        exePath = path.join(path.dirname(exePath), 'cli.bat');
                        wxPaths.unshift(exePath);
                        packagePath = path.resolve(exePath, "../package.nw/package.json");
                    }
                    return [3 /*break*/, 5];
                case 5:
                    if (!(!!packagePath)) return [3 /*break*/, 7];
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, FileUtil.readFileAsync(packagePath, null)];
                case 6:
                    _b = _d.apply(_c, [_e.sent()]);
                    return [3 /*break*/, 8];
                case 7:
                    _b = null;
                    _e.label = 8;
                case 8:
                    packageJson = _b;
                    wxpath = wxPaths.find(function (wxpath) { return FileUtil.exists(wxpath); });
                    if (!wxpath) return [3 /*break*/, 16];
                    projectPath = egret.args.projectDir;
                    projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_wxgame");
                    _e.label = 9;
                case 9:
                    _e.trys.push([9, 14, , 15]);
                    result = globals.compressVersion(packageJson.version, "1.02.1801081");
                    if (!(result > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, utils.shell(wxpath, ["-o", projectPath, "-f", "egret"], null, true)];
                case 10:
                    _e.sent();
                    return [3 /*break*/, 13];
                case 11:
                    console.log("当前web开发者工具版本为:", packageJson.version, ", 请升级最新的微信web开发者工具");
                    return [4 /*yield*/, utils.shell(wxpath, ["-o", projectPath], null, true)];
                case 12:
                    _e.sent();
                    _e.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    e_1 = _e.sent();
                    return [2 /*return*/, 1];
                case 15: return [3 /*break*/, 17];
                case 16: throw '请安装最新微信开发者工具';
                case 17: return [2 /*return*/, DontExitCode];
            }
        });
    });
}
function runBricks() {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath;
        return __generator(this, function (_a) {
            switch (os.platform()) {
                case "darwin":
                    projectPath = egret.args.projectDir;
                    projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_bricks", "PublicBrickEngineGame.xcodeproj");
                    utils.open(projectPath);
                    return [2 /*return*/, 0];
                    break;
                case "win32":
                    throw '目前玩一玩仅支持 MacOS 平台开发';
                    break;
            }
            return [2 /*return*/, 1];
        });
    });
}
module.exports = Run;
