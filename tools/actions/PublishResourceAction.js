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
//import globals = require("../globals");
var FileUtil = require("../lib/FileUtil");
var fs = require("fs");
var path = require("path");
var CopyFilesCommand = require("../commands/copyfile");
var EgretProject = require("../project/EgretProject");
var ZipCommand = require("./ZipCommand");
var copyNative = require("./CopyNativeFiles");
var exml = require("./exml");
function publishResourceOrigin(projectDir, releaseDir) {
    var config = EgretProject.data;
    var cpFiles = new CopyFilesCommand();
    cpFiles.copyResources(projectDir, releaseDir, config.getIgnorePath());
    return 0;
}
function publishResourceWithVersion(projectDir, releaseDir) {
    var ignorePathList = EgretProject.data.getIgnorePath();
    var allPath = FileUtil.joinPath(releaseDir, "all.manifest");
    var resources = EgretProject.data.getResources();
    var list = [];
    for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var r = resources_1[_i];
        var tempList = FileUtil.search(FileUtil.joinPath(projectDir, r));
        list = list.concat(tempList);
    }
    ignorePathList = ignorePathList.map(function (item) {
        var reg = new RegExp(item);
        return reg;
    });
    var isIgnore = false;
    list = list.filter(function (copyFilePath) {
        isIgnore = false;
        for (var key in ignorePathList) {
            var ignorePath = ignorePathList[key];
            if (copyFilePath.match(ignorePath)) {
                isIgnore = true;
                break;
            }
        }
        if (copyFilePath.indexOf(".html") != -1 || copyFilePath.indexOf(".css") != -1) {
            return false;
        }
        if (!isIgnore) {
            return true;
        }
    });
    var allVersion = {};
    var copyExmlList = EgretProject.data.getCopyExmlList();
    for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
        var filePath = list_1[_a];
        if (copyExmlList.length && filePath.slice(filePath.lastIndexOf(".") + 1) == "exml") {
            var needCopy = false;
            for (var j = 0; j < copyExmlList.length; j++) {
                if (filePath.indexOf(copyExmlList[j]) != -1) {
                    needCopy = true;
                    break;
                }
            }
            if (!needCopy) {
                continue;
            }
        }
        var txt = FileUtil.read(filePath);
        var crc32 = globals.getCrc32();
        var txtCrc32 = crc32(txt);
        var savePath = FileUtil.relative(projectDir, filePath);
        allVersion[savePath] = { "v": txtCrc32, "s": fs.statSync(filePath).size };
    }
    FileUtil.save(allPath, JSON.stringify(allVersion));
    for (var tempPath in allVersion) {
        var outputFilePath = FileUtil.joinPath(releaseDir, "resource", allVersion[tempPath]["v"].substring(0, 2), allVersion[tempPath]["v"] + "_" + allVersion[tempPath]["s"] + "." + tempPath.substring(tempPath.lastIndexOf(".") + 1));
        FileUtil.copy(FileUtil.joinPath(projectDir, tempPath), outputFilePath);
    }
    return 0;
    ////删除原始资源文件
    //for (var key in resources) {
    //    FileUtil.remove(FileUtil.joinPath(releasePath, resources[key]));
    //}
    //
    //FileUtil.copy(FileUtil.joinPath(releasePath, "egretResourceRoot"), FileUtil.joinPath(releasePath, "resource"));
    //
    //FileUtil.remove(FileUtil.joinPath(releasePath, "egretResourceRoot"));
    //globals.debugLog(1408, (Date.now() - tempTime) / 1000);
}
function publishWithResourceManager(projectDir, releaseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var res, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publishResourceOrigin(projectDir, releaseDir);
                    res = require('../lib/res/res.js');
                    command = "publish";
                    res.createPlugin({
                        "name": "test",
                        onFile: function (file) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, file];
                            });
                        }); },
                        onFinish: function () {
                            legacyPublishHTML5();
                        }
                    });
                    res.createPlugin({
                        "name": "cleanEXML",
                        onFile: function (file) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, file];
                            });
                        }); },
                        onFinish: function () {
                            exml.updateSetting(false);
                        }
                    });
                    return [4 /*yield*/, res.build({ projectRoot: releaseDir, debug: true, command: command })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function publishResource(version, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
                return [4 /*yield*/, publishResource_2(runtime)];
                case 1:
                    //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.publishResource = publishResource;
function publishResource_2(runtime) {
    var _a = egret.args, releaseDir = _a.releaseDir, projectDir = _a.projectDir;
    var publishType = EgretProject.data.getPublishType(runtime);
    switch (publishType) {
        case 0:
            return publishResourceOrigin(projectDir, releaseDir);
            break;
        case 1:
            return publishResourceWithVersion(projectDir, releaseDir);
            break;
        case 2:
            return publishWithResourceManager(projectDir, releaseDir);
            break;
        default:
            return 1;
    }
}
function legacyPublishNative(versionFile) {
    var options = egret.args;
    var manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
    EgretProject.manager.generateManifest(null, manifestPath, false, "native");
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
    EgretProject.manager.copyLibsForPublish(manifestPath, FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");
    //runtime  打包所有js文件以及all.manifest
    var zip = new ZipCommand(versionFile);
    zip.execute(function (code) {
        copyNative.refreshNative(false, versionFile);
    });
}
exports.legacyPublishNative = legacyPublishNative;
function legacyPublishHTML5() {
    var options = egret.args;
    var manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
    var indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
    EgretProject.manager.generateManifest(null, manifestPath, false, "web");
    if (!EgretProject.data.useTemplate) {
        FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    else {
        FileUtil.copy(FileUtil.joinPath(options.templateDir, "web", "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    var copyAction = new CopyAction(options.projectDir, options.releaseDir);
    copyAction.copy("favicon.ico");
    EgretProject.manager.copyLibsForPublish(manifestPath, options.releaseDir, "web");
}
exports.legacyPublishHTML5 = legacyPublishHTML5;
var CopyAction = (function () {
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
