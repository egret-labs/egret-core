/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var file = require("../lib/FileUtil");
var ts = require("../lib/typescript-plus/lib/typescript");
var path = require("path");
var Compiler = (function () {
    function Compiler() {
        this.files = {};
    }
    Compiler.prototype.compile = function (options, rootFileNames) {
        var _this = this;
        this.errors = [];
        this.fileNames = rootFileNames;
        this.sortedFiles = rootFileNames;
        // initialize the list of files
        rootFileNames.forEach(function (fileName) {
            _this.files[fileName] = { version: 0 };
        });
        if (options.locale) {
            ts.validateLocaleAndSetLanguage(options.locale, ts.sys);
        }
        // Create the language service host to allow the LS to communicate with the host
        var servicesHost = {
            getScriptFileNames: function () { return _this.sortedFiles; },
            getNewLine: function () {
                var carriageReturnLineFeed = "\r\n";
                var lineFeed = "\n";
                if (options.newLine === 0 /* CarriageReturnLineFeed */) {
                    return carriageReturnLineFeed;
                }
                else if (options.newLine === 1 /* LineFeed */) {
                    return lineFeed;
                }
                else if (ts.sys) {
                    return ts.sys.newLine;
                }
                return carriageReturnLineFeed;
            },
            getScriptVersion: function (fileName) { return _this.files[fileName] && _this.files[fileName].version.toString(); },
            getScriptSnapshot: function (fileName) {
                if (!file.exists(fileName)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(file.read(fileName, true).toString());
            },
            getCurrentDirectory: function () { return process.cwd(); },
            getCompilationSettings: function () { return options; },
            getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
        };
        // Create the language service files
        this.services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
        this.sortFiles();
        var output = this.services.getEmitOutput(undefined);
        this.logErrors(undefined);
        output.outputFiles.forEach(function (o) {
            file.save(o.name, o.text);
        });
        return { files: this.sortedFiles, program: this.services.getProgram(), exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    };
    Compiler.prototype.sortFiles = function () {
        var program = this.services.getProgram();
        var sortResult = ts.reorderSourceFiles(program);
        if (sortResult.circularReferences.length > 0) {
            var error = "";
            error += "error: circular references '" + "' :" + ts.sys.newLine;
            error += "    at " + sortResult.circularReferences.join(ts.sys.newLine + "    at ") + ts.sys.newLine + "    at ...";
            console.log(error);
            this.errors.push(error);
        }
        this.sortedFiles = sortResult.sortedFileNames;
    };
    Compiler.prototype.emitFile = function (fileName) {
        var output = this.services.getEmitOutput(fileName);
        this.logErrors(fileName);
        output.outputFiles.forEach(function (o) {
            file.save(o.name, o.text);
        });
    };
    Compiler.prototype.logErrors = function (fileName) {
        var _this = this;
        var allDiagnostics = this.services.getCompilerOptionsDiagnostics()
            .concat(this.services.getSyntacticDiagnostics(fileName))
            .concat(this.services.getSemanticDiagnostics(fileName));
        allDiagnostics.forEach(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            var msg;
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                msg = diagnostic.file.fileName + "(" + (line + 1) + "," + (character + 1) + "): error TS" + diagnostic.code + ": " + message;
            }
            else {
                msg = "" + message;
            }
            console.log(msg);
            _this.errors.push(msg);
        });
    };
    Compiler.prototype.compileWithChanges = function (filesChanged, sourceMap) {
        var _this = this;
        this.errors = [];
        filesChanged.forEach(function (file) {
            if (file.type == "added") {
                _this.fileNames.push(file.fileName);
                _this.files[file.fileName] = { version: 0 };
            }
            else if (file.type == "removed") {
                var index = _this.fileNames.indexOf(file.fileName);
                if (index >= 0) {
                    _this.fileNames.splice(index, 1);
                }
            }
            else {
                _this.files[file.fileName].version++;
            }
        });
        this.sortFiles();
        filesChanged.forEach(function (file) {
            _this.emitFile(file.fileName);
        });
        return { files: this.sortedFiles, program: this.services.getProgram(), exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    };
    Compiler.prototype.parseTsconfig = function () {
        var url = egret.args.projectDir + "tsconfig.json";
        var options = egret.args;
        var configObj;
        try {
            configObj = JSON.parse(file.read(url));
        }
        catch (e) {
            // errLog.push(utils.tr(1117));//不是有效的 json 文件
            configObj = {
                "compilerOptions": {
                    "target": "es5",
                    "experimentalDecorators": true,
                    "lib": [
                        "es5", "dom", "es2015.promise"
                    ]
                },
                "exclude": [
                    "node_modules"
                ]
            };
        }
        var notSupport = ["module", "noLib", "outFile", "rootDir", "out"];
        var defaultSupport = { target: "es5", outDir: "bin-debug" };
        var compilerOptions = configObj.compilerOptions;
        for (var _i = 0, notSupport_1 = notSupport; _i < notSupport_1.length; _i++) {
            var optionName = notSupport_1[_i];
            if (compilerOptions.hasOwnProperty(optionName)) {
                var error = utils.tr(1116, optionName); //这个编译选项目前不支持修改
                console.log(error); //build -e 的时候输出
                delete compilerOptions[optionName];
            }
        }
        for (var optionName in defaultSupport) {
            if (compilerOptions[optionName] != defaultSupport[optionName]) {
                if (compilerOptions[optionName]) {
                    var error = utils.tr(1116, optionName);
                    console.log(error + " \u5C06\u88AB\u8C03\u6574\u4E3A'" + defaultSupport[optionName] + "'");
                }
                compilerOptions[optionName] = defaultSupport[optionName];
            }
        }
        var configParseResult = ts.parseJsonConfigFileContent(configObj, ts.sys, path.dirname(url));
        compilerOptions = configParseResult.options;
        compilerOptions.defines = getCompilerDefines(options);
        return configParseResult;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
function getCompilerDefines(args, debug) {
    var defines = {};
    if (debug != undefined) {
        defines.DEBUG = debug;
        defines.RELEASE = !debug;
    }
    else if (args.publish) {
        defines.DEBUG = false;
        defines.RELEASE = true;
    }
    else {
        defines.DEBUG = true;
        defines.RELEASE = false;
    }
    return defines;
}
