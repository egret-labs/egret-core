/**
 * Created by apple on 14-5-8.
 */


var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var exmlc = require("../exml/exmlc.js");
var CodeUtil = require("../core/code_util.js");
var create_manifest = require("./create_manifest.js");


var all_module_file_list = [];


function run(currentDir, args, opts) {
    var source = path.resolve(param.getEgretPath(), "");
    var source = opts["--source"];
    var output = opts["--output"];
    if (!source || !output) {
        globals.exit(1302);
    }
    source = source[0];
    output = output[0];
    if (!source || !output) {
        globals.exit(1302);
    }
    compile(function () {
        console.log("编译成功");
    }, source, output)
}

/**
 * 编译指定的代码
 *
 * @param callback 回调函数
 * @param srcPath 源文件所在的文件夹
 * @param output 输出地址
 * @param sourceList 要编译的文件列表包含ts和exml
 * @param keepGeneratedTypescript 是否保留exml生成的ts文件
 */
function compile(callback, srcPath, output, sourceList, keepGeneratedTypescript) {

    var exmlList = [];
    var tsList = [];
    var length = sourceList.length;
    for (var i = 0; i < length; i++) {
        var p = sourceList[i];
        if (!file.exists(p) || p.indexOf("exml.d.ts") != -1) {
            continue;
        }
        var ext = file.getExtension(p).toLowerCase();
        if (ext == "ts") {
            tsList.push(p);
        }
        else if (ext == "exml") {
            exmlList.push(p);
            tsList.push(p.substring(0, p.length - 4) + "ts");
        }
    }

    globals.addCallBackWhenExit(cleanTempFile);

    async.waterfall([

        //cp所有非ts/exml文件
        function (callback) {
            var all_file = file.searchByFunction(srcPath, filter);
            all_file.forEach(function (item) {
                var itemName = item.substring(srcPath.length);
                file.copy(item, path.join(output, itemName));
            })
            callback(null);

            function filter(path) {
                var index = path.lastIndexOf(".");
                if (index == -1) {
                    return true;
                }
                var ext = path.substring(index).toLowerCase();
                return ext != ".ts" && ext != ".exml";
            }
        },
        //编译exml文件
        function (callback) {
            exmlList.forEach(function (item) {
                exmlc.compile(item, srcPath);
            });

            callback();
        },
        //编译ts文件
        function (callback) {
            tsList = tsList.map(function (item) {
                return "\"" + item + "\"";
            });

            var sourcemap = param.getArgv()["opts"]["-sourcemap"];
            sourcemap = sourcemap ? "--sourcemap " : "";

            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
            file.save("tsc_config_temp.txt", cmd);
            typeScriptCompiler(function (code) {
                if (code == 0) {
                    output = path.join(output, "egret.d.ts");
                    var cmd = sourcemap + tsList.join(" ") + " -d -t ES5 --out " + "\"" + output + "\"";
                    file.save("tsc_config_temp.txt", cmd);
                }
                else {
                    callback(1303);
                }
            });
        }



    ], function (err) {
        callback(err);
    })

    function cleanTempFile() {
        file.remove("tsc_config_temp.txt");
        file.remove("game.d.ts");
        if (!keepGeneratedTypescript && exmlList) {
            exmlList.forEach(function (p) {
                var tsPath = p.substring(0, p.length - 4) + "ts";
                file.remove(tsPath);
            });
        }
    }
}
/*
 var crc32FilePath;
 var crc32Map;
 function parseFromCrc32(tsList) {
 var result = [];
 var argv = param.getArgv();
 var currDir = globals.joinEgretDir(argv.currDir, argv.args[0]);
 crc32FilePath = path.join(currDir, "crc32.temp");
 var crc32Txt = "";
 if (file.exists(crc32FilePath)) {
 crc32Txt = file.read(crc32FilePath);
 crc32Map = JSON.parse(crc32Txt);
 }
 else {
 crc32Map = {};
 }
 var l = tsList.length;
 for (var j = 0; j < l; j++) {
 var tsFilePath = tsList[j];
 if (tsFilePath.indexOf(".d.ts") != -1) {//.d.ts一定要传给编译器
 result.push(tsFilePath);
 continue;
 }
 var tsFileTxt = file.read(tsFilePath);
 var tsFileCrc32Txt = crc32.direct(tsFileTxt);
 if (crc32Map[tsFilePath] && crc32Map[tsFilePath] == tsFileCrc32Txt) {//有过改变的文件需要编译
 continue;
 }
 crc32Map[tsFilePath] = tsFileCrc32Txt;
 result.push(tsFilePath);
 }

 if (isQuickMode()) {
 var projectDTS = //create_manifest.createProjectDTS(result, path.join(currDir, "src"));
 file.save("game.d.ts", projectDTS);
 result.push(path.join(argv.currDir, "game.d.ts"));
 return result;
 }
 else {
 return tsList;
 }
 }
 */

function typeScriptCompiler(quitFunc) {
    var TypeScript = require('../core/typescript/tsc.js');
    TypeScript.IO.arguments = ["@tsc_config_temp.txt"];
    TypeScript.IO.quit = quitFunc;
    TypeScript.Emitter.prototype.emitClass = function (classDecl) {
        var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl);
        this.pushDecl(pullDecl);

        var svClassNode = this.thisClassNode;
        this.thisClassNode = classDecl;
        var className = classDecl.identifier.text();
        this.emitComments(classDecl, true);
        var temp = this.setContainer(3 /* Class */);

        this.recordSourceMappingStart(classDecl);
        this.writeToOutput("var " + className);

        var hasBaseClass = TypeScript.ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses) !== null;
        var baseTypeReference = null;
        var varDecl = null;

        if (hasBaseClass) {
            this.writeLineToOutput(" = (function (_super) {");
        } else {
            this.writeLineToOutput(" = (function () {");
        }

        this.recordSourceMappingNameStart(className);
        this.indenter.increaseIndent();

        if (hasBaseClass) {
            baseTypeReference = TypeScript.ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses).typeNames.nonSeparatorAt(0);
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord("__extends(" + className + ", _super)", baseTypeReference);
            this.writeLineToOutput(";");
        }

        this.emitIndent();

        var constrDecl = getLastConstructor(classDecl);

        if (constrDecl) {
            this.emit(constrDecl);
            this.writeLineToOutput("");
        } else {
            this.recordSourceMappingStart(classDecl);

            this.indenter.increaseIndent();
            this.writeLineToOutput("function " + classDecl.identifier.text() + "() {");
            this.recordSourceMappingNameStart("constructor");
            if (hasBaseClass) {
                this.emitIndent();
                this.writeToOutputWithSourceMapRecord("_super.apply(this, arguments)", baseTypeReference);
                this.writeLineToOutput(";");
            }

            if (this.shouldCaptureThis(classDecl)) {
                this.writeCaptureThisStatement(classDecl);
            }

            this.emitParameterPropertyAndMemberVariableAssignments();

            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord("}", classDecl.closeBraceToken);
            this.writeLineToOutput("");

            this.recordSourceMappingNameEnd();
            this.recordSourceMappingEnd(classDecl);
        }

        this.emitClassMembers(classDecl);

        this.emitIndent();
        this.writeToOutputWithSourceMapRecord("return " + className + ";", classDecl.closeBraceToken);
        this.writeLineToOutput("");
        this.indenter.decreaseIndent();
        this.emitIndent();
        this.writeToOutputWithSourceMapRecord("}", classDecl.closeBraceToken);
        this.recordSourceMappingNameEnd();
        this.recordSourceMappingStart(classDecl);
        this.writeToOutput(")(");
        if (hasBaseClass) {
            this.emitJavascript(baseTypeReference, false);
        }
        this.writeToOutput(");");
        this.recordSourceMappingEnd(classDecl);

        if ((temp === 1 /* Module */ || temp === 2 /* DynamicModule */) && TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */)) {
            this.writeLineToOutput("");
            this.emitIndent();
            var modName = temp === 1 /* Module */ ? this.moduleName : "exports";
            this.writeToOutputWithSourceMapRecord(modName + "." + className + " = " + className + ";", classDecl);

            var fullClassName = pullDecl.name;
            var parentDecl = pullDecl.getParentDecl();
            while (parentDecl && !(parentDecl instanceof TypeScript.RootPullDecl)) {
                fullClassName = parentDecl.name + "." + fullClassName;
                parentDecl = parentDecl.getParentDecl();
            }
            this.writeLineToOutput("");
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord(className + ".prototype.__class__ = \"" + fullClassName + "\";", classDecl);
        }
        else {
            this.writeLineToOutput("");
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord(className + ".prototype.__class__ = \"" + className + "\";", classDecl);
        }

        this.recordSourceMappingEnd(classDecl);
        this.emitComments(classDecl, false);
        this.setContainer(temp);
        this.thisClassNode = svClassNode;

        this.popDecl(pullDecl);
    };

    if (isQuickMode()) {//快速构建，去掉类型检查阶段
        TypeScript.PullTypeResolver.typeCheck = function (compilationSettings, semanticInfoChain, document) {
            var sourceUnit = document.sourceUnit();

            var resolver = semanticInfoChain.getResolver();
            var context = new TypeScript.PullTypeResolutionContext(resolver, true, sourceUnit.fileName());

            if (resolver.canTypeCheckAST(sourceUnit, context)) {
                resolver.resolveAST(sourceUnit, false, context);
            }
        };
    }

    var batch = new TypeScript.BatchCompiler(TypeScript.IO);
    batch.batchCompile();
}

function isQuickMode() {
    var opts = param.getArgv().opts;
    if ((opts["-quick"] || opts["-q"]) && !opts["-e"]) {
        return true;
    }
    return false;
}

function getModuleConfig(moduleName) {
    var coreList = globals.require("tools/lib/manifest/" + moduleName + ".json");
    return coreList
}

function generateGameFileList(projectPath) {
    var manifestPath = path.join(projectPath, "manifest.json");
    var srcPath = path.join(projectPath, "src/");
    var manifest;
    if (file.exists(manifestPath)) {
        manifest = getManifestJson(manifestPath, srcPath);
    }
    else {
        manifest = create_manifest.create(srcPath);
    }
    var fileListText = createFileList(manifest, srcPath);
    fileListText = "var game_file_list = " + fileListText + ";";
    file.save(path.join(projectPath, "bin-debug/src/game_file_list.js"), fileListText);
    return manifest;
}

function getManifestJson(file_list, srcPath) {
    if (!file.exists(file_list)) {
        return [];
    }
    var content = file.read(file_list);
    try {
        var manifest = JSON.parse(content);
    }
    catch (e) {
        globals.exit(1304, file_list);
    }
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        manifest[i] = file.joinPath(srcPath, manifest[i]);
    }
    return manifest;
}

function createFileList(manifest, srcPath) {

    var gameList = [];
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        var filePath = manifest[i];
        if (filePath.indexOf(".d.ts") != -1) {
            continue;
        }
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "ts" && isInterface(filePath)) {
            continue;
        }
        gameList.push(filePath);
    }

    length = gameList.length;
    for (i = 0; i < length; i++) {
        filePath = gameList[i];
        filePath = filePath.substring(srcPath.length);
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "exml") {
            filePath = filePath.substring(0, filePath.length - 4) + "js";
        }
        else if (ext == "ts") {
            filePath = filePath.substring(0, filePath.length - 2) + "js";
        }
        gameList[i] = "    \"" + filePath + "\"";
    }
    var gameListText = "[\n" + gameList.join(",\n") + "\n]";
    return gameListText;
}

/**
 * 这个文件是否只含有接口
 */
function isInterface(path) {
    var text = file.read(path);
    text = CodeUtil.removeComment(text, path);
    text = removeInterface(text);
    if (!CodeUtil.containsVariable("class", text) && !CodeUtil.containsVariable("var", text) && !CodeUtil.containsVariable("function", text)) {
        return true;
    }
    return false;
}

/**
 * 移除代码中的接口定义
 */
function removeInterface(text) {
    var tsText = "";
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("interface", text);
        if (index == -1) {
            tsText += text;
            break;
        }
        tsText += text.substring(0, index);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        text = text.substring(index + 1);
    }
    return tsText;
}

function getLastConstructor(classDecl) {
    return classDecl.classElements.lastOrDefault(function (e) {
        return e.kind() === 137 /* ConstructorDeclaration */;
    });
}


function compileModule(callback, moduleName, prefix, projectDir) {

    var moduleConfig = getModuleConfig(moduleName)
    var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
    output = path.join(projectDir, "libs", output);
    var tsList = moduleConfig.file_list;
    tsList = tsList.map(function (item) {
        return "\"" + path.join(prefix, item) + "\"";
    }).filter(function (item) {
            return item.indexOf(".js") == -1
        })
    all_module_file_list = all_module_file_list.concat(moduleConfig.file_list);
    var dependencyList = moduleConfig.dependence;
    if (dependencyList) {
        for (var i = 0; i < dependencyList.length; i++) {
            var dependencyModule = getModuleConfig(dependencyList[i]);
            var dependencyModuleOutput = dependencyModule.output ? dependencyModule.output : dependencyModule.name;
            dependencyModuleOutput = path.join(projectDir, "libs", dependencyModuleOutput);
            tsList.push(path.join(dependencyModuleOutput, dependencyModule.name + ".d.ts"));
        }
    }


    var sourcemap = param.getArgv()["opts"]["-sourcemap"];
    sourcemap = sourcemap ? "--sourcemap " : "";

    var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + "\"" + output + "\"";
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize
    typeScriptCompiler(function (code) {
        if (code == 0) {
            var cmd = sourcemap + tsList.join(" ") + " -d -t ES5 --out " + "\"" + path.join(output, moduleName + ".d.ts") + "\"";
            file.save("tsc_config_temp.txt", cmd);
            typeScriptCompiler(function (code) {
                if (code == 0) {
                    callback(null, prefix);
                }
            });
        }
        else {
            callback(1303);
        }
    });

}

function generateAllModuleFileList(projectDir) {


    var manifest = all_module_file_list;


    var egretPath = param.getEgretPath();
//    var manifest = coreList.concat(runtimeList);
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        manifest[i] = file.joinPath(egretPath, "src", manifest[i]);
    }

    var srcPath = path.join(param.getEgretPath(), "src/");
    srcPath = srcPath.split("\\").join("/");
    var egretFileListText = createFileList(manifest, srcPath);
    egretFileListText = "var egret_file_list = " + egretFileListText + ";";
    file.save(file.joinPath(projectDir, "bin-debug/lib/egret_file_list.js"), egretFileListText);
    return manifest;



}

exports.generateAllModuleFileList = generateAllModuleFileList;
exports.compileModule = compileModule;
exports.compile = compile;
exports.run = run;
exports.generateGameFileList = generateGameFileList;