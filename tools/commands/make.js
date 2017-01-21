var utils = require("../lib/utils");
var Compiler_1 = require("../actions/Compiler");
var FileUtil = require("../lib/FileUtil");
var path = require("path");
var ts = require("../lib/typescript-plus/lib/typescript");
var ANY = 'any';
var CompileEgretEngine = (function () {
    function CompileEgretEngine() {
        this.dtsFiles = [];
        //     private hideInternalMethods() {
        //         return;
        //         var tempDts: string[] = [];
        //         global.ignoreDollar = true;
        //         this.dtsFiles.forEach(d => {
        //             var dts = d[0], depends = d[1];
        //             var tempDtsName = dts.replace(/\.d\.ts/, 'd.ts');
        //             var singleFile = dts.replace(/\.d\.ts/, 'd.js');
        //             FileUtil.copy(dts, tempDtsName);
        //             var tss = depends.concat(tempDtsName);
        //             var result = this.compiler.compile({
        //                 args: egret.args,
        //                 def: true,
        //                 out: singleFile,
        //                 files: tss,
        //                 outDir: null
        //             });
        //             if (result.messages && result.messages.length) {
        //                 result.messages.forEach(m => console.log(m));
        //             }
        //             FileUtil.remove(singleFile);
        //             FileUtil.remove(tempDtsName);
        //             tempDts.push(tempDtsName.replace(/\.ts$/, '.d.ts'));
        //         });
        //         this.dtsFiles.forEach(d => {
        //             FileUtil.remove(d[0]);
        //         });
        //         tempDts.forEach(d => {
        //             var dts = d.replace(/d\.d\.ts$/, '.d.ts');
        //             FileUtil.copy(d, dts);
        //             FileUtil.remove(d);
        //         })
        //         global.ignoreDollar = false;
        //     }
    }
    CompileEgretEngine.prototype.execute = function () {
        var code = 0;
        var options = egret.args;
        var manifest = egret.manifest;
        var penddings = [];
        var currentPlatform, currentConfig;
        global.registerClass = manifest.registerClass;
        var outputDir = this.getModuleOutputPath();
        this.compiler = new Compiler_1.Compiler();
        global.registerClass = manifest.registerClass;
        var configurations = [
            { name: "debug", declaration: true },
            { name: "release", minify: true }
        ];
        var excludeList = [
            FileUtil.escapePath(path.join(outputDir, "egret3d")),
            FileUtil.escapePath(path.join(outputDir, "nest")),
            FileUtil.escapePath(path.join(outputDir, "dragonBones"))
        ];
        utils.clean(outputDir, excludeList);
        for (var i = 0; i < manifest.modules.length; i++) {
            var m = manifest.modules[i];
            preduceSwanModule(m);
            listModuleFiles(m);
            for (var j = 0; j < configurations.length; j++) {
                var config = configurations[j];
                for (var k = 0; k < manifest.platforms.length; k++) {
                    var platform = manifest.platforms[k];
                    code = this.buildModule(m, platform, config);
                    if (code != 0) {
                        delSwanTemp(m);
                        return code;
                    }
                }
            }
            delSwanTemp(m);
        }
        // this.hideInternalMethods();
        return code;
    };
    CompileEgretEngine.prototype.buildModule = function (m, platform, configuration) {
        var _this = this;
        var name = m.name;
        var fileName = name;
        var options = egret.args;
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
        var outDir = this.getModuleOutputPath(null, null, m.outFile);
        var declareFile = this.getModuleOutputPath(m.name, fileName + ".d.ts", m.outFile);
        var singleFile = this.getModuleOutputPath(m.name, fileName + ".js", m.outFile);
        var moduleRoot = FileUtil.joinPath(egret.root, m.root);
        if (!m.root) {
            return 0;
        }
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
        var tsconfig = path.join(egret.root, 'src/egret/tsconfig.json');
        var compileOptions = {}; // this.compiler.loadTsconfig(tsconfig,options).options
        //make 使用引擎的配置,必须用下面的参数
        compileOptions.target = ts.ScriptTarget.ES5;
        // parsedCmd.options.stripInternal = true;
        compileOptions.sourceMap = options.sourceMap;
        compileOptions.removeComments = options.removeComments;
        compileOptions.declaration = dts;
        compileOptions.out = singleFile;
        compileOptions.newLine = ts.NewLineKind.LineFeed;
        compileOptions.allowUnreachableCode = true;
        compileOptions.emitReflection = true;
        compileOptions.lib = ['lib.es5.d.ts',
            'lib.dom.d.ts',
            'lib.es2015.promise.d.ts',
            'lib.scripthost.d.ts'
        ];
        var defines = {};
        if (configuration.name == "debug") {
            defines.DEBUG = true;
            defines.RELEASE = false;
        }
        compileOptions.defines = defines;
        var result = this.compiler.compile(compileOptions, tss);
        if (result.exitStatus != 0) {
            result.messages.forEach(function (m) { return console.log(m); });
        }
        if (result.exitStatus != 0) {
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
    CompileEgretEngine.prototype.getModuleOutputPath = function (m, filePath, outFile) {
        if (filePath === void 0) { filePath = ""; }
        if (outFile === void 0) { outFile = "build/"; }
        var path = FileUtil.joinPath(egret.root, outFile);
        if (m)
            path += m + '/';
        path += filePath;
        return path;
    };
    return CompileEgretEngine;
}());
function listModuleFiles(m) {
    var tsFiles = [];
    if (m.noOtherTs !== true)
        tsFiles = FileUtil.search(FileUtil.joinPath(egret.root, m.root), "ts");
    var specFiles = {};
    m.files.forEach(function (f, i) {
        var fileName = typeof (f) == 'string' ? f : f.path;
        fileName = FileUtil.joinPath(m.root, fileName);
        fileName = FileUtil.joinPath(egret.root, fileName);
        if (f['path'])
            f['path'] = fileName;
        else
            m.files[i] = fileName;
        specFiles[fileName] = true;
    });
    tsFiles.forEach(function (f) {
        if (!specFiles[f])
            m.files.push(f);
    });
}
function delSwanTemp(m) {
    if (m.name != "eui" || !m.sourceRoot) {
        return;
    }
    var pathBefore = FileUtil.joinPath(egret.root, m.root);
    FileUtil.remove(pathBefore);
}
function preduceSwanModule(m) {
    if (m.name != "eui" || !m.sourceRoot) {
        return;
    }
    var replaces = [
        ["Egret 2.4"],
        ["egret."],
        ["IEventEmitter", "IEventDispatcher"],
        ["EventEmitter", "EventDispatcher"],
        [".on(", ".addEventListener("],
        [".removeListener(", ".removeEventListener("],
        [".emit(", ".dispatchEvent("],
        [".emitWith(", ".dispatchEventWith("],
        [".hasListener(", ".hasEventListener("],
        [".emitTouchEvent(", ".dispatchTouchEvent("],
        [".BitmapData", ".Texture"],
        [".Sprite", ".DisplayObjectContainer"],
        [".TextInput", ".TextField"],
        [".ImageLoader", ".URLLoader"],
        [".HttpRequest", ".URLLoader"],
    ];
    var tsFiles = [];
    if (m.noOtherTs !== true)
        tsFiles = FileUtil.search(FileUtil.joinPath(egret.root, m.sourceRoot), "ts");
    var pathBefore = FileUtil.joinPath(egret.root, m.sourceRoot);
    for (var i = 0; i < tsFiles.length; i++) {
        var content = FileUtil.read(tsFiles[i]);
        var saveFile = FileUtil.joinPath(egret.root, m.root);
        var currenFile = tsFiles[i];
        var resultFile = currenFile.slice(pathBefore.length, currenFile.length);
        saveFile += resultFile;
        for (var r = 0; r < replaces.length; r++) {
            if (!replaces[r]) {
                console.log("r = ", r);
            }
            content = replaceAll(content, replaces[r][0], replaces[r][1]);
        }
        FileUtil.save(saveFile, content);
    }
}
function replaceAll(content, search, replace) {
    var slen = search.length;
    var rlen = replace.length;
    for (var i = 0; i < content.length; i++) {
        if (content.slice(i, i + slen) == search) {
            content = content.slice(0, i) + replace + content.slice(i + slen, content.length);
            i += rlen - slen;
        }
    }
    return content;
}
function changeDefine(content, current, change) {
    var cuIF = "//if " + current;
    var chIF = "//if " + change;
    for (var i = 0; i < content.length; i++) {
        if (content.slice(i, i + cuIF.length) == cuIF) {
            content = content.slice(0, i) + "/*" + content.slice(i, content.length);
            i += 2;
            for (; i < content.length; i++) {
                if (content.slice(i, i + 9) == "//endif*/") {
                    i++;
                    break;
                }
            }
        }
        else if (content.slice(i, i + chIF.length) == chIF) {
            var before = content.slice(0, i - 2);
            var end = content.slice(i, content.length);
            content = before + end;
            i += 2;
            for (; i < content.length; i++) {
                if (content.slice(i, i + 9) == "//endif*/") {
                    i++;
                    break;
                }
            }
        }
    }
    return content;
}
module.exports = CompileEgretEngine;
