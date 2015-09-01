/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var Compiler = require('./Compiler');
var FileUtil = require('../lib/FileUtil');
var ANY = 'any';
var CompileEgret = (function () {
    function CompileEgret() {
        this.dtsFiles = [];
    }
    CompileEgret.prototype.make = function () {
        var self = this;
        var code = 0;
        var options = egret.options;
        var manifest = egret.manifest;
        var penddings = [];
        var currentPlatform, currentConfig;
        var outputDir = this.getModuleOutputPath();
        this.compiler = new Compiler();
        var configurations = [
            { name: "debug", declaration: true },
            { name: "release", minify: true }
        ];
        utils.clean(outputDir);
        for (var i = 0; i < manifest.modules.length; i++) {
            var m = manifest.modules[i];
            listModuleFiles(m);
            for (var j = 0; j < configurations.length; j++) {
                var config = configurations[j];
                for (var k = 0; k < manifest.platforms.length; k++) {
                    var platform = manifest.platforms[k];
                    code = this.buildModule(m, platform, config);
                    if (code != 0)
                        return code;
                }
            }
        }
        this.hideInternalMethods();
        return code;
    };
    CompileEgret.prototype.buildModule = function (m, platform, configuration) {
        var _this = this;
        var name = m.name;
        var fileName = name;
        var options = egret.options;
        var egretRoot = egret.options.egretRoot;
        if (platform.name != ANY) {
            fileName += "." + platform.name;
        }
        if (configuration.minify) {
            fileName += ".min";
        }
        var depends = m.dependencies.map(function (name) { return _this.getModuleOutputPath(name, name + '.d.ts'); });
        if (platform.name != ANY) {
            depends.push(this.getModuleOutputPath(m.name, name + '.d.ts'));
        }
        var outDir = this.getModuleOutputPath();
        var declareFile = this.getModuleOutputPath(m.name, fileName + ".d.ts");
        var singleFile = this.getModuleOutputPath(m.name, fileName + ".js");
        var moduleRoot = FileUtil.joinPath(egretRoot, m.root);
        var tss = [];
        m.files.forEach(function (file) {
            var path = null;
            var sourcePlatform = null, sourceConfig = null;
            if (typeof (file) == 'string') {
                path = file;
            }
            else {
                var source = file;
                path = source.path;
                sourcePlatform = source.platform;
                sourceConfig = source.debug === true ? "debug" : source.debug === false ? "release" : null;
            }
            var platformOK = sourcePlatform == null && platform.name == ANY || sourcePlatform == platform.name;
            var configOK = sourceConfig == null || sourceConfig == configuration.name;
            if (platformOK && configOK) {
                tss.push(path);
            }
        });
        if (tss.length == 0)
            return 0;
        tss = depends.concat(tss);
        var dts = platform.declaration && configuration.declaration;
        var result = this.compiler.compile({ args: options, def: dts, out: singleFile, files: tss, outDir: null });
        if (result.exitStatus != 0) {
            result.messages.forEach(function (m) { return console.log(m); });
            return result.exitStatus;
        }
        if (dts) {
            this.dtsFiles.push([declareFile, depends]);
        }
        if (configuration.minify) {
            utils.minify(singleFile, singleFile);
        }
        return 0;
    };
    CompileEgret.prototype.getModuleOutputPath = function (m, filePath) {
        if (filePath === void 0) { filePath = ""; }
        var path = FileUtil.joinPath(egret.options.egretRoot, "build/");
        if (m)
            path += m + '/';
        path += filePath;
        return path;
    };
    CompileEgret.prototype.hideInternalMethods = function () {
        var _this = this;
        var tempDts = [];
        global.ignoreDollar = true;
        this.dtsFiles.forEach(function (d) {
            var dts = d[0], depends = d[1];
            var tempDtsName = dts.replace(/\.d\.ts/, 'd.ts');
            var singleFile = dts.replace(/\.d\.ts/, 'd.js');
            FileUtil.copy(dts, tempDtsName);
            var tss = depends.concat(tempDtsName);
            var result = _this.compiler.compile({ args: egret.options, def: true, out: singleFile, files: tss, outDir: null });
            if (result.messages && result.messages.length) {
                result.messages.forEach(function (m) { return console.log(m); });
            }
            FileUtil.remove(singleFile);
            FileUtil.remove(tempDtsName);
            tempDts.push(tempDtsName.replace(/\.ts$/, '.d.ts'));
        });
        this.dtsFiles.forEach(function (d) {
            FileUtil.remove(d[0]);
        });
        tempDts.forEach(function (d) {
            var dts = d.replace(/d\.d\.ts$/, '.d.ts');
            FileUtil.copy(d, dts);
            FileUtil.remove(d);
        });
        global.ignoreDollar = false;
    };
    return CompileEgret;
})();
function testPlatform(value, array) {
    return (value == ANY && (array == null || array.length == 0)) || (array && array.indexOf(value) >= 0);
}
function testConfig(value, array) {
    return value == ANY || array == null || array.indexOf(value) >= 0;
}
function listModuleFiles(m) {
    var tsFiles = [];
    if (m.noOtherTs !== true)
        tsFiles = FileUtil.search(FileUtil.joinPath(egret.options.egretRoot, m.root), "ts");
    var specFiles = {};
    m.files.forEach(function (f) {
        var fileName = typeof (f) == 'string' ? f : f.path;
        fileName = FileUtil.joinPath(m.root, fileName);
        fileName = FileUtil.joinPath(egret.options.egretRoot, fileName);
        if (f['path'])
            f['path'] = fileName;
        specFiles[fileName] = true;
    });
    tsFiles.forEach(function (f) {
        if (!specFiles[f])
            m.files.push(f);
    });
}
module.exports = CompileEgret;
