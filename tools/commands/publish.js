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
var utils = require("../lib/utils");
var FileUtil = require("../lib/FileUtil");
var exml = require("../actions/exml");
var CompileProject = require("../actions/CompileProject");
var GenerateVersion = require("../actions/GenerateVersionCommand");
var ZipCMD = require("../actions/ZipCommand");
var EgretProject = require("../project/EgretProject");
var copyNative = require("../actions/CopyNativeFiles");
var path = require("path");
var Publish = (function () {
    function Publish() {
    }
    Publish.prototype.getVersionInfo = function () {
        if (egret.args.version) {
            return egret.args.version;
        }
        var date = new Date();
        var year = date.getFullYear() % 100;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();
        var timeStr = year * 10000000000 + month * 100000000 + day * 1000000 + hour * 10000 + min * 100 + second;
        return timeStr.toString();
        //return (Math.round(Date.now() / 1000)).toString();
    };
    Publish.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, config, versionFile, runtime, compileProject, result, outfile, useResourceMangerPublish, manifestPath, allMainfestPath, zip, indexPath, copyAction, version, commandResult1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils.checkEgret();
                        options = egret.args;
                        config = EgretProject.data;
                        versionFile = this.getVersionInfo();
                        runtime = egret.args.runtime == 'native' ? 'native' : "web";
                        options.releaseDir = FileUtil.joinPath(config.getReleaseRoot(), runtime, versionFile);
                        globals.log(1402, runtime, versionFile);
                        utils.clean(options.releaseDir);
                        options.minify = true;
                        options.publish = true;
                        compileProject = new CompileProject();
                        result = compileProject.compile(options);
                        outfile = FileUtil.joinPath(options.releaseDir, 'main.min.js');
                        utils.minify(outfile, outfile);
                        useResourceMangerPublish = false;
                        if (!useResourceMangerPublish) {
                            (new GenerateVersion).execute();
                        }
                        //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
                        if (exml.updateSetting) {
                            exml.updateSetting();
                        }
                        if (egret.args.runtime == "native") {
                            manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
                            EgretProject.manager.generateManifest(null, manifestPath, false, "native");
                            EgretProject.manager.modifyNativeRequire(manifestPath);
                            allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
                            if (FileUtil.exists(allMainfestPath)) {
                                FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
                            }
                            FileUtil.remove(allMainfestPath);
                            //先拷贝 launcher
                            FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));
                            FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
                            FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));
                            EgretProject.manager.copyLibsForPublish(manifestPath, FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");
                            zip = new ZipCMD(versionFile);
                            zip.execute(function (code) {
                                copyNative.refreshNative(false, versionFile);
                            });
                        }
                        else {
                            manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
                            indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
                            EgretProject.manager.generateManifest(null, manifestPath, false, "web");
                            if (!EgretProject.data.useTemplate) {
                                FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
                                EgretProject.manager.modifyIndex(manifestPath, indexPath);
                            }
                            else {
                                FileUtil.copy(FileUtil.joinPath(options.templateDir, "debug", "index.html"), indexPath);
                                EgretProject.manager.modifyIndex(manifestPath, indexPath);
                            }
                            copyAction = new CopyAction(options.projectDir, options.releaseDir);
                            copyAction.copy("favicon.ico");
                            EgretProject.manager.copyLibsForPublish(manifestPath, options.releaseDir, "web");
                        }
                        if (!useResourceMangerPublish) return [3 /*break*/, 2];
                        version = path.join(runtime, versionFile);
                        return [4 /*yield*/, utils.executeCommand("res publish " + config.getProjectRoot() + " " + options.releaseDir)];
                    case 1:
                        commandResult1 = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, DontExitCode];
                }
            });
        });
    };
    return Publish;
}());
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
module.exports = Publish;
