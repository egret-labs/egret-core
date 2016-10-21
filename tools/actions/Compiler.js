/// <reference path="../lib/types.d.ts" />
/// <reference path="../lib/typescript/tsclark.d.ts" />
var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
var tsclark = require("../lib/typescript/tsclark");
var ts = require("../lib/typescript-plus/typescript");
var Compiler = (function () {
    function Compiler() {
        this.files = {};
    }
    Compiler.prototype.compile = function (option) {
        //console.log('---Compiler.compile---')
        var args = option.args, def = option.def, files = option.files, out = option.out, outDir = option.outDir;
        var defTemp = args.declaration;
        args.declaration = def;
        var realCWD = process.cwd();
        var cwd = file.escapePath(args.projectDir);
        files = files.map(function (f) { return f.replace(cwd, ""); });
        if (out)
            out = file.getRelativePath(cwd, out);
        if (outDir)
            outDir = file.getRelativePath(cwd, outDir);
        process.chdir(cwd);
        var parsedCmd = {
            fileNames: files,
            options: {},
            errors: []
        };
        if (args.compilerOptions) {
            parsedCmd.options = args.compilerOptions;
        }
        if (out) {
            //make 使用引擎的配置,必须用下面的参数
            parsedCmd.options.target = 1;
            // parsedCmd.options.stripInternal = true;
            parsedCmd.options.sourceMap = args.sourceMap;
            parsedCmd.options.removeComments = args.removeComments;
            parsedCmd.options.declaration = args.declaration;
            parsedCmd.options.out = out;
        }
        else {
            //console.log("args.compilerOptions:",parsedCmd.options.outDir)
            parsedCmd.options.outDir = outDir;
        }
        if (args.sourceMap == true) {
            parsedCmd.options.sourceMap = true; //引擎命令行的sourcemap属性优先
        }
        parsedCmd.options.allowUnreachableCode = true;
        parsedCmd.options.emitReflection = true;
        parsedCmd.options["forSortFile"] = option.forSortFile;
        if (args.experimental) {
            console.log("use typescript 2.0.3");
            return this.compileNew(parsedCmd);
        }
        else {
            // var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
            var compileResult = tsclark.Compiler.executeWithOption(parsedCmd);
            args.declaration = defTemp;
            if (compileResult.messages) {
                compileResult.messages.forEach(function (m) { return console.log(m); });
            }
            process.chdir(realCWD);
            return compileResult;
        }
    };
    Compiler.prototype.compileNew = function (parsedCmd) {
        var _this = this;
        this.errors = [];
        this.parsedCmd = parsedCmd;
        var options = parsedCmd.options;
        var rootFileNames = parsedCmd.fileNames;
        this.sortedFiles = rootFileNames;
        // initialize the list of files
        rootFileNames.forEach(function (fileName) {
            _this.files[fileName] = { version: 0 };
        });
        // Create the language service host to allow the LS to communicate with the host
        var servicesHost = {
            getScriptFileNames: function () { return _this.sortedFiles; },
            getScriptVersion: function (fileName) { return _this.files[fileName] && _this.files[fileName].version.toString(); },
            getScriptSnapshot: function (fileName) {
                if (!file.exists(fileName)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(file.read(fileName, true).toString());
            },
            getCurrentDirectory: function () { return process.cwd(); },
            getCompilationSettings: function () { return _this.parsedCmd.options; },
            getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
        };
        // Create the language service files
        this.services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
        this.sortFiles();
        if (!options.forSortFile) {
            var output = this.services.getEmitOutput(undefined);
            this.logErrors(undefined);
            output.outputFiles.forEach(function (o) {
                file.save(o.name, o.text);
            });
        }
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
        this.sortedFiles = this.services.getProgram().getRootFileNames();
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
        var allDiagnostics = this.services.getCompilerOptionsDiagnostics();
        if (fileName) {
            allDiagnostics.concat(this.services.getSyntacticDiagnostics(fileName))
                .concat(this.services.getSemanticDiagnostics(fileName));
        }
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
        filesChanged.forEach(function (file) {
            if (file.type == "added") {
                _this.parsedCmd.fileNames.push(file.fileName);
                _this.files[file.fileName] = { version: 0 };
            }
            else if (file.type == "removed") {
                var index = _this.parsedCmd.fileNames.indexOf(file.fileName);
                if (index >= 0)
                    _this.parsedCmd.fileNames.splice(index, 1);
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
    return Compiler;
}());
tsclark.Compiler.exit = function (exitCode) {
    if (exitCode != 0)
        console.log(utils.tr(10003, exitCode));
    return exitCode;
};
module.exports = Compiler;
