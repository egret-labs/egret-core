Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../lib/utils");
var file = require("../lib/FileUtil");
var ts = require("../lib/typescript-plus/lib/typescript");
var path = require("path");
var compilerHost;
var hostGetSourceFile;
var hostFileExists;
var cachedProgram;
var cachedExistingFiles;
var changedFileNames = [];
var getSourceFile = function (fileName, languageVersion, onError) {
    if (cachedProgram && changedFileNames.indexOf(fileName) == -1) {
        var sourceFile_1 = cachedProgram.getSourceFile(fileName);
        if (sourceFile_1) {
            return sourceFile_1;
        }
    }
    var sourceFile = hostGetSourceFile(fileName, languageVersion, onError);
    return sourceFile;
};
var cachedFileExists = function (fileName) {
    return fileName in cachedExistingFiles
        ? cachedExistingFiles[fileName]
        : cachedExistingFiles[fileName] = hostFileExists(fileName);
};
var Compiler = (function () {
    function Compiler() {
        this.errors = [];
    }
    Compiler.prototype.compile = function (options, rootFileNames) {
        this.fileNames = rootFileNames;
        this.options = options;
        cachedProgram = null;
        compilerHost = ts.createCompilerHost(options);
        hostGetSourceFile = compilerHost.getSourceFile;
        compilerHost.getSourceFile = getSourceFile;
        hostFileExists = compilerHost.fileExists;
        compilerHost.fileExists = cachedFileExists;
        return this.doCompile();
    };
    Compiler.prototype.sortFiles = function () {
        var program = this.program;
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
    Compiler.prototype.logErrors = function (diagnostics) {
        var _this = this;
        var allDiagnostics = ts.getPreEmitDiagnostics(this.program).concat(diagnostics);
        allDiagnostics.forEach(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            var msg;
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                msg = "  Error " + diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message;
            }
            else {
                msg = "  Error: " + message;
            }
            console.log(msg);
            _this.errors.push(msg);
        });
    };
    Compiler.prototype.compileWithChanges = function (filesChanged, sourceMap) {
        var _this = this;
        this.errors = [];
        changedFileNames = [];
        var hasAddOrRemoved = false;
        filesChanged.forEach(function (file) {
            if (file.type == "added") {
                hasAddOrRemoved = true;
                _this.fileNames.push(file.fileName);
            }
            else if (file.type == "removed") {
                hasAddOrRemoved = true;
                var index = _this.fileNames.indexOf(file.fileName);
                if (index >= 0) {
                    _this.fileNames.splice(index, 1);
                }
            }
            else {
                changedFileNames.push(file.fileName);
            }
        });
        if (hasAddOrRemoved) {
            cachedProgram = undefined;
        }
        return this.doCompile();
    };
    Compiler.prototype.doCompile = function () {
        cachedExistingFiles = utils.createMap();
        this.program = ts.createProgram(this.fileNames, this.options, compilerHost);
        this.sortFiles();
        var emitResult = this.program.emit();
        this.logErrors(emitResult.diagnostics);
        cachedProgram = this.program;
        return { files: this.sortedFiles, program: this.program, exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    };
    Compiler.prototype.parseTsconfig = function (projectRoot, isPublish) {
        var url = projectRoot + "tsconfig.json";
        var configObj;
        try {
            configObj = JSON.parse(file.read(url));
        }
        catch (e) {
            console.log(utils.tr(1117)); //不是有效的 json 文件
            // errLog.push();
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
        var notSupport = ["module", "noLib", "rootDir", "out"];
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
        compilerOptions.defines = getCompilerDefines(isPublish);
        return configParseResult;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
function getCompilerDefines(isPublish) {
    var defines = {};
    if (isPublish) {
        defines.DEBUG = false;
        defines.RELEASE = true;
    }
    else {
        defines.DEBUG = true;
        defines.RELEASE = false;
    }
    return defines;
}
