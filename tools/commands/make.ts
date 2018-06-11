import utils = require('../lib/utils');
import { Compiler } from '../actions/Compiler';
import FileUtil = require('../lib/FileUtil');
import path = require('path');
import ts = require("../lib/typescript-plus/lib/typescript");

const ANY = 'any';
declare var global: any;

class CompileEgretEngine implements egret.Command {

    private compiler: Compiler;

    public execute(): number {

        var code = 0;
        var options = egret.args;
        var manifest = egret.manifest;
        var penddings: egret.EgretModule[] = [];
        var currentPlatform: string, currentConfig: string;
        global.registerClass = manifest.registerClass;
        var outputDir = this.getModuleOutputPath();
        this.compiler = new Compiler();
        global.registerClass = manifest.registerClass;
        var configurations: egret.CompileConfiguration[] = [
            { name: "debug", declaration: true },
            { name: "release", minify: true }
        ];

        let excludeList = [
            FileUtil.escapePath(path.join(outputDir, "egretia-sdk")),
            FileUtil.escapePath(path.join(outputDir, "egret-facebook")),
            FileUtil.escapePath(path.join(outputDir, "promise")),
            FileUtil.escapePath(path.join(outputDir, "resourcemanager")),
            FileUtil.escapePath(path.join(outputDir, "assetsmanager")),
            FileUtil.escapePath(path.join(outputDir, "egret3d")),
            FileUtil.escapePath(path.join(outputDir, "egret-wasm")),
            FileUtil.escapePath(path.join(outputDir, "eui-wasm")),
            FileUtil.escapePath(path.join(outputDir, "dragonBones-wasm")),
            FileUtil.escapePath(path.join(outputDir, "game-wasm")),
            FileUtil.escapePath(path.join(outputDir, "wasm_libs")),
            FileUtil.escapePath(path.join(outputDir, "media")),
            FileUtil.escapePath(path.join(outputDir, "nest")),
            FileUtil.escapePath(path.join(outputDir, "res")),
            FileUtil.escapePath(path.join(outputDir, "dragonBones"))
        ];
        utils.clean(outputDir, excludeList);
        for (let m of manifest.modules) {
            preduceSwanModule(m);
            listModuleFiles(m);
            for (let config of configurations) {
                for (let platform of manifest.platforms) {
                    code = this.buildModule(m, platform, config);
                    if (code != 0) {
                        delSwanTemp(m);
                        return code;
                    }
                }
            }
            // break;
            delSwanTemp(m);
        }



        // this.hideInternalMethods();
        return code;
    }

    private buildModule(m: egret.EgretModule, platform: egret.target.Info, configuration: egret.CompileConfiguration) {


        var name = m.name;
        var fileName = name;
        var options = egret.args;
        if (platform.name != ANY) {
            fileName += "." + platform.name;
        }
        if (configuration.minify) {
            fileName += ".min";
        }
        var depends = m.dependencies.map(name => this.getModuleOutputPath(name, name + '.d.ts'));

        if (platform.name != ANY) {
            depends.push(this.getModuleOutputPath(m.name, name + '.d.ts'));
        }

        var outDir = this.getModuleOutputPath(null, null, m.outFile);
        var declareFile = this.getModuleOutputPath(m.name, fileName + ".d.ts", m.outFile);
        var singleFile = this.getModuleOutputPath(m.name, fileName + ".js", m.outFile);
        //var modFile = this.getModuleOutputPath(m.name, fileName + ".mod.js", m.outFile);

        var moduleRoot = FileUtil.joinPath(egret.root, m.root);
        if (!m.root) {
            return 0;
        }
        var tss: string[] = [];
        m.files.forEach((file) => {
            var path: string = null;
            var sourcePlatform: string = null, sourceConfig: string = null;
            if (typeof (file) == 'string') {
                path = file;
            }
            else {
                path = file.path;
                sourcePlatform = file.platform;
                sourceConfig = file.debug === true ? "debug" : file.debug === false ? "release" : null;
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
        let tsconfig = path.join(egret.root, 'src/egret/');
        let isPublish = configuration.name != "debug"
        let compileOptions: ts.CompilerOptions = this.compiler.parseTsconfig(tsconfig, isPublish).options;
        // com
        //make 使用引擎的配置,必须用下面的参数
        compileOptions.declaration = dts;
        compileOptions.out = singleFile;
        compileOptions.emitReflection = true;


        var result = this.compiler.compile(compileOptions, tss);
        if (result.exitStatus != 0) {
            result.messages.forEach(m => console.log(m));
            return result.exitStatus;
        }
        if (configuration.minify) {
            utils.minify(singleFile, singleFile);
        }

        return 0;
    }

    private getModuleOutputPath(m?: string, filePath: string = "", outFile: string = "build/") {
        var path = FileUtil.joinPath(egret.root, outFile);
        if (m)
            path += m + '/';
        path += filePath;
        return path;
    }

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

function listModuleFiles(m: egret.EgretModule) {
    var tsFiles = [];
    if (m.noOtherTs !== true)
        tsFiles = FileUtil.search(FileUtil.joinPath(egret.root, m.root), "ts");
    var specFiles = {};
    m.files.forEach((f, i) => {
        var fileName = typeof (f) == 'string' ? f : f.path;
        fileName = FileUtil.joinPath(m.root, fileName);
        fileName = FileUtil.joinPath(egret.root, fileName);
        if (f['path'])
            f['path'] = fileName;
        else
            m.files[i] = fileName;
        specFiles[fileName] = true;
    });
    tsFiles.forEach(f => {
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

function preduceSwanModule(m: egret.EgretModule) {
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

export = CompileEgretEngine;