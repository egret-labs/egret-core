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
var service = require("../service/index");
var FileUtil = require("../lib/FileUtil");
var CompileProject = require("../actions/CompileProject");
var copyNative = require("../actions/CopyNativeFiles");
var EgretProject = require("../project/EgretProject");
console.log(utils.tr(1106, 0));
var timeBuildStart = (new Date()).getTime();
var Clean = (function () {
    function Clean() {
    }
    Clean.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, compileProject, result, manifestPath, indexPath, arr, moduleName_1, timeBuildEnd, timeBuildUsed;
            return __generator(this, function (_a) {
                utils.checkEgret();
                options = egret.args;
                service.client.closeServer(options.projectDir);
                utils.clean(options.debugDir);
                //刷新libs 中 modules 文件
                EgretProject.manager.copyToLibs();
                compileProject = new CompileProject();
                result = compileProject.compile(options);
                if (!result) {
                    return [2 /*return*/, 1];
                }
                manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
                indexPath = FileUtil.joinPath(egret.args.projectDir, "index.html");
                EgretProject.manager.generateManifest(result.files, manifestPath);
                if (!EgretProject.data.useTemplate) {
                    EgretProject.manager.modifyIndex(manifestPath, indexPath);
                }
                //拷贝项目到native工程中
                if (egret.args.runtime == "native") {
                    console.log("----native build-----");
                    EgretProject.manager.modifyNativeRequire(manifestPath);
                    copyNative.refreshNative(true);
                }
                if (EgretProject.data.isWasmProject()) {
                    arr = [
                        "egret.asm.js",
                        "egret.asm.js.mem",
                        "egret.webassembly.js",
                        "egret.webassembly.wasm"
                    ];
                    moduleName_1 = "egret";
                    if (EgretProject.data.hasModule("dragonBones")) {
                        moduleName_1 = "egretWithDragonBones";
                    }
                    arr.forEach(function (item) {
                        FileUtil.copy(FileUtil.joinPath(egret.root, "build", "wasm_libs", moduleName_1, item), FileUtil.joinPath(options.projectDir, "libs", item));
                    });
                }
                timeBuildEnd = new Date().getTime();
                timeBuildUsed = (timeBuildEnd - timeBuildStart) / 1000;
                console.log(utils.tr(1108, timeBuildUsed));
                //Wait for 'shutdown' command, node will exit when there are no tasks.
                return [2 /*return*/, DontExitCode];
            });
        });
    };
    return Clean;
}());
module.exports = Clean;
