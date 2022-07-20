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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var path = require("path");
var os = require("os");
var watch = require("../lib/watch");
var FileUtil = require("../lib/FileUtil");
var utils = require("../lib/utils");
var Server = require("../server/server");
var service = require("../service/index");
var StartServerPlugin = /** @class */ (function () {
    /**
     *
     * @param target
     * @param port
     * @param serverOnly
     */
    function StartServerPlugin(options) {
        this.options = options;
        this.projectDir = "";
        this._params = "";
        if (!this.options) {
            this.options = {};
        }
        if (!this.options.target) {
            this.options.target = "web";
        }
        if (!this.options.watch) {
            this.options.watch = true;
        }
        if (!this.options.port) {
            this.options.port = 3000;
        }
        if (!this.options.serverOnly) {
            this.options.serverOnly = false;
        }
    }
    StartServerPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, file];
            });
        });
    };
    StartServerPlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.projectDir = commandContext.projectRoot;
                        return [4 /*yield*/, this.execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartServerPlugin.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var target, _a, _port;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        target = this.options.target;
                        this._params = this.genParams(this.projectDir);
                        _a = target;
                        switch (_a) {
                            case "web": return [3 /*break*/, 1];
                            case "wxgame": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, utils.getAvailablePort(this.options.port)];
                    case 2:
                        _port = _b.sent();
                        this.initServer(_port);
                        return [2 /*return*/, DontExitCode];
                    case 3: return [4 /*yield*/, runWxIde()];
                    case 4: return [2 /*return*/, (_b.sent())];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    StartServerPlugin.prototype.getStartURL = function (host, port) {
        var url = "http://" + host + ':' + port + '/index.html';
        return url;
    };
    StartServerPlugin.prototype.initServer = function (port) {
        var addresses = utils.getNetworkAddress();
        var startUrl = this.getStartURL(addresses[0], port);
        var serverOnly = this.options.serverOnly;
        var openWithBrowser = !serverOnly;
        var server = new Server();
        server.use(Server.fileReader(this.projectDir));
        server.start(this.projectDir, port, this.wrapByParams(startUrl), openWithBrowser);
        if (serverOnly) {
            console.log("Url:" + this.wrapByParams(startUrl));
        }
        else {
            console.log('\n');
            console.log("    " + utils.tr(10013, ''));
            console.log('\n');
            console.log('        ' + this.wrapByParams(startUrl));
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + this.wrapByParams(this.getStartURL(addresses[i], port)));
            }
            console.log('\n');
        }
        if (this.options.watch) {
            console.log('    ' + utils.tr(10010));
            this.watchFiles(FileUtil.joinPath(this.projectDir, "src/"));
        }
    };
    StartServerPlugin.prototype.watchFiles = function (dir) {
        var _this = this;
        watch.createMonitor(dir, { persistent: true, interval: 2007, filter: function (f, stat) { return !f.match(/\.g(\.d)?\.ts/); } }, function (m) {
            m.on("created", function (f) { return _this.sendBuildCMD(f, "added"); })
                .on("removed", function (f) { return _this.sendBuildCMD(f, "removed"); })
                .on("changed", function (f) { return _this.sendBuildCMD(f, "modified"); });
        });
        watch.createMonitor(path.dirname(dir), {
            persistent: true, interval: 2007, filter: function (f, stat) {
                if (path.basename(f) == "egretProperties.json" || path.basename(f) == "tsconfig.json") {
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
    StartServerPlugin.prototype.sendBuildCMD = function (file, type) {
        file = FileUtil.escapePath(file);
        egret.args[type] = [file];
        service.client.execCommand({
            command: "build",
            path: this.projectDir,
            option: egret.args
        }, function (cmd) {
            if (!cmd.exitCode)
                console.log('    ' + "自动编译完成.");
            else
                console.log('    ' + "自动编译失败，请参考下面的错误信息：");
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
        });
    };
    StartServerPlugin.prototype.shutDown = function (file, type) {
        globals.log(10022, file);
        service.client.execCommand({
            path: this.projectDir,
            command: "shutdown",
            option: egret.args
        }, function () { return process.exit(0); }, true);
    };
    StartServerPlugin.prototype.wrapByParams = function (url) {
        return url + this._params;
    };
    StartServerPlugin.prototype.genParams = function (projectDir) {
        var result = "";
        var propertyFilePath = FileUtil.joinPath(projectDir, "egretProperties.json");
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
    return StartServerPlugin;
}());
exports.StartServerPlugin = StartServerPlugin;
function runWxIde() {
    return __awaiter(this, void 0, void 0, function () {
        var wxPaths, _a, result, stdout_1, iconv, encoding, binaryEncoding, result2, stdout, stdoutArr, exePath, wxpath, projectPath, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
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
                    result = _b.sent();
                    if (result.stdout != '') {
                        stdout_1 = result.stdout.replace(/\n/g, "");
                        wxPaths = [FileUtil.joinPath(stdout_1, "/Contents/Resources/app.nw/bin/cli")];
                    }
                    // defaults read
                    wxPaths.push("/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli");
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
                    result2 = _b.sent();
                    stdout = iconv.decode(new Buffer(result2.stdout, binaryEncoding), encoding);
                    if (stdout != '') {
                        stdoutArr = stdout.split("\r\n");
                        exePath = stdoutArr.find(function (path) { return path.indexOf(".exe") != -1; });
                        exePath = exePath.split("  ").find(function (path) { return path.indexOf(".exe") != -1; });
                        exePath = path.join(path.dirname(exePath), 'cli.bat');
                        wxPaths.unshift(exePath);
                    }
                    return [3 /*break*/, 5];
                case 5:
                    wxpath = wxPaths.find(function (wxpath) { return FileUtil.exists(wxpath); });
                    if (!wxpath) return [3 /*break*/, 11];
                    projectPath = egret.args.projectDir;
                    projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_wxgame");
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 10]);
                    return [4 /*yield*/, utils.shell(wxpath, ["-o", projectPath, "-f", "egret"], null, true)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 8:
                    e_1 = _b.sent();
                    return [4 /*yield*/, utils.shell(wxpath, ["-o", projectPath], null, true)];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11: throw '请安装最新微信开发者工具';
                case 12: return [2 /*return*/, DontExitCode];
            }
        });
    });
}
