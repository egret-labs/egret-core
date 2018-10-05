/// <reference path="../lib/types.d.ts" />
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
var tasks = require("../tasks");
var FileUtil = require("../lib/FileUtil");
var path = require("path");
var EgretProject = require("../project");
var parseConfig = require("./ParseConfig");
function publishResource(version) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, releaseDir, projectDir, projectRoot, res, command, debug, target, projectConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = egret.args, releaseDir = _a.releaseDir, projectDir = _a.projectDir;
                    projectRoot = projectDir;
                    res = require('../lib/resourcemanager');
                    tasks.run();
                    command = "publish";
                    debug = true;
                    target = egret.args.target;
                    projectConfig = parseConfig.parseConfig();
                    return [4 /*yield*/, res.build({ projectRoot: projectRoot, debug: debug, command: command, target: target, version: version, projectConfig: projectConfig })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.publishResource = publishResource;
function legacyPublishNative(versionFile) {
    var options = egret.args;
    var manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
    EgretProject.manager.generateManifest(null, { debug: false, platform: 'native' }, manifestPath);
    EgretProject.manager.modifyNativeRequire(manifestPath);
    var allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
    if (FileUtil.exists(allMainfestPath)) {
        FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
    }
    FileUtil.remove(allMainfestPath);
    //先拷贝 launcher
    FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
    FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
    FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
    // EgretProject.manager.copyLibsForPublish(FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");
    //runtime  打包所有js文件以及all.manifest
    // const zip = new ZipCommand(versionFile);
    // zip.execute(function (code) {
    //     copyNative.refreshNative(false, versionFile);
    // });
}
exports.legacyPublishNative = legacyPublishNative;
function legacyPublishHTML5() {
    var options = egret.args;
    var manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
    var indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
    EgretProject.manager.generateManifest(null, { debug: false, platform: "web" }, manifestPath);
    if (!EgretProject.projectData.useTemplate) {
        FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    else {
        FileUtil.copy(FileUtil.joinPath(options.templateDir, "web", "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    var copyAction = new CopyAction(options.projectDir, options.releaseDir);
    copyAction.copy("favicon.ico");
    // EgretProject.manager.copyLibsForPublish(options.releaseDir, "web");
}
exports.legacyPublishHTML5 = legacyPublishHTML5;
var CopyAction = /** @class */ (function () {
    function CopyAction(from, to) {
        this.from = from;
        this.to = to;
    }
    CopyAction.prototype.copy = function (resourcePath) {
        if (typeof resourcePath == 'string') {
            var fromPath = path.resolve(this.from, resourcePath);
            var toPath = path.resolve(this.to, resourcePath);
            if (FileUtil.exists(fromPath)) {
                FileUtil.copy(fromPath, toPath);
            }
        }
        else {
            resourcePath.forEach(this.copy.bind(this));
        }
    };
    return CopyAction;
}());
