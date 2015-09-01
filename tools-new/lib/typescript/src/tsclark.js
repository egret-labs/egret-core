/// <reference path="core.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="types.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="commandLineParser.ts"/>
/// <reference path="sort.ts" />
/// <reference path="../../types.d.ts" />
var ts;
(function (ts) {
    var version = "1.4.0.0";
    var formatedMessages = [];
    /**
     * Checks to see if the locale is in the appropriate format,
     * and if it is, attempts to set the appropriate language.
     */
    function validateLocaleAndSetLanguage(locale, errors) {
        var matchResult = /^([a-z]+)([_\-]([a-z]+))?$/.exec(locale.toLowerCase());
        if (!matchResult) {
            errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1, 'en', 'ja-jp'));
            return false;
        }
        var language = matchResult[1];
        var territory = matchResult[3];
        // First try the entire locale, then fall back to just language if that's all we have.
        if (!trySetLanguageAndTerritory(language, territory, errors) &&
            !trySetLanguageAndTerritory(language, undefined, errors)) {
            errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Unsupported_locale_0, locale));
            return false;
        }
        return true;
    }
    function trySetLanguageAndTerritory(language, territory, errors) {
        var compilerFilePath = ts.normalizePath(ts.sys.getExecutingFilePath());
        var containingDirectoryPath = ts.getDirectoryPath(compilerFilePath);
        var filePath = ts.combinePaths(containingDirectoryPath, language);
        if (territory) {
            filePath = filePath + "-" + territory;
        }
        filePath = ts.sys.resolvePath(ts.combinePaths(filePath, "diagnosticMessages.generated.json"));
        if (!ts.sys.fileExists(filePath)) {
            return false;
        }
        // TODO: Add codePage support for readFile?
        try {
            var fileContents = ts.sys.readFile(filePath);
        }
        catch (e) {
            errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Unable_to_open_file_0, filePath));
            return false;
        }
        try {
            ts.localizedDiagnosticMessages = JSON.parse(fileContents);
        }
        catch (e) {
            errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Corrupted_locale_file_0, filePath));
            return false;
        }
        return true;
    }
    function countLines(program) {
        var count = 0;
        ts.forEach(program.getSourceFiles(), function (file) {
            count += file.getLineAndCharacterFromPosition(file.end).line;
        });
        return count;
    }
    function getDiagnosticText(message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var diagnostic = ts.createCompilerDiagnostic.apply(undefined, arguments);
        return diagnostic.messageText;
    }
    function reportDiagnostic(diagnostic) {
        var output = "";
        if (diagnostic.file) {
            var loc = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
            output += diagnostic.file.filename + "(" + loc.line + "," + loc.character + "): ";
        }
        var category = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
        output += category + " TS" + diagnostic.code + ": " + diagnostic.messageText;
        formatedMessages.push(output);
    }
    function reportDiagnostics(diagnostics) {
        for (var i = 0; i < diagnostics.length; i++) {
            reportDiagnostic(diagnostics[i]);
        }
    }
    function padLeft(s, length) {
        while (s.length < length) {
            s = " " + s;
        }
        return s;
    }
    function padRight(s, length) {
        while (s.length < length) {
            s = s + " ";
        }
        return s;
    }
    function reportStatisticalValue(name, value) {
        ts.sys.write(padRight(name + ":", 12) + padLeft(value.toString(), 10) + ts.sys.newLine);
    }
    function reportCountStatistic(name, count) {
        reportStatisticalValue(name, "" + count);
    }
    function reportTimeStatistic(name, time) {
        reportStatisticalValue(name, (time / 1000).toFixed(2) + "s");
    }
    function executeWithOption(commandLine) {
        var compilerOptions = commandLine.options;
        formatedMessages = [];
        var result = {
            exitStatus: ts.EmitReturnStatus.Succeeded,
            program: null,
            compileWithChanges: null,
            files: [],
            messages: formatedMessages
        };
        // If there are any errors due to command line parsing and/or
        // setting up localization, report them and quit.
        if (commandLine.errors.length > 0) {
            reportDiagnostics(commandLine.errors);
            result.exitStatus = ts.EmitReturnStatus.CompilerOptionsErrors;
            return result;
        }
        if (commandLine.filenames.length === 0) {
            result.exitStatus = ts.EmitReturnStatus.CompilerOptionsErrors;
            return result;
        }
        var defaultCompilerHost = ts.createCompilerHost(compilerOptions);
        return watchProgram(commandLine, defaultCompilerHost);
    }
    ts.executeWithOption = executeWithOption;
    /**
     * Compiles the program once, and then watches all given and referenced files for changes.
     * Upon detecting a file change, watchProgram will queue up file modification events for the next
     * 250ms and then perform a recompilation. The reasoning is that in some cases, an editor can
     * save all files at once, and we'd like to just perform a single recompilation.
     */
    function watchProgram(commandLine, compilerHost) {
        var watchers = {};
        var updatedFiles = {};
        // Compile the program the first time and watch all given/referenced files.
        var result = compile(commandLine, compilerHost);
        var program = result.program;
        result.compileWithChanges = compileWithChanges;
        return result;
        function compileWithChanges(filesChanged) {
            filesChanged.forEach(function (filename) { return updatedFiles[getCanonicalName(filename)] = true; });
            var changedFiles = updatedFiles;
            updatedFiles = {};
            return recompile(changedFiles);
        }
        function recompile(changedFiles) {
            console.log(changedFiles);
            // Reuse source files from the last compilation so long as they weren't changed.
            var oldSourceFiles = ts.arrayToMap(ts.filter(program.getSourceFiles(), function (file) { return !ts.hasProperty(changedFiles, getCanonicalName(file.filename)); }), function (file) { return getCanonicalName(file.filename); });
            // We create a new compiler host for this compilation cycle.
            // This new host is effectively the same except that 'getSourceFile'
            // will try to reuse the SourceFiles from the last compilation cycle
            // so long as they were not modified.
            var newCompilerHost = ts.clone(compilerHost);
            newCompilerHost.getSourceFile = function (fileName, languageVersion, onError) {
                fileName = getCanonicalName(fileName);
                var sourceFile = ts.lookUp(oldSourceFiles, fileName);
                if (sourceFile) {
                    return sourceFile;
                }
                return compilerHost.getSourceFile(fileName, languageVersion, onError);
            };
            var result = compile(commandLine, newCompilerHost, Object.keys(changedFiles));
            program = result.program;
            result.compileWithChanges = compileWithChanges;
            return result;
        }
        function getCanonicalName(fileName) {
            return compilerHost.getCanonicalFileName(fileName);
        }
    }
    function compile(commandLine, compilerHost, changedFiles) {
        var parseStart = new Date().getTime();
        var compilerOptions = commandLine.options;
        var program = ts.createProgram(commandLine.filenames, compilerOptions, compilerHost);
        var bindStart = new Date().getTime();
        var errors = program.getDiagnostics();
        var exitStatus;
        if (errors.length) {
            var checkStart = bindStart;
            var emitStart = bindStart;
            var reportStart = bindStart;
            exitStatus = ts.EmitReturnStatus.AllOutputGenerationSkipped;
        }
        else {
            var checker = program.getTypeChecker(true);
            var checkStart = new Date().getTime();
            errors = checker.getDiagnostics();
            if (checker.isEmitBlocked()) {
                exitStatus = ts.EmitReturnStatus.AllOutputGenerationSkipped;
            }
            else {
                var sortHelper = new ts.SortHelper();
                sortHelper.orderFiles(checker, program);
                var emitStart = new Date().getTime();
                var emitErrors;
                //if (!changedFiles) {
                var emitOutput = checker.emitFiles();
                emitErrors = emitOutput.diagnostics;
                exitStatus = emitOutput.emitResultStatus;
                //}
                //else {
                //    emitErrors = [];
                //    changedFiles.forEach(file=> {
                //        var emitOutput = checker.emitFiles(program.getSourceFile(file));
                //        emitErrors = emitErrors.concat(emitOutput.diagnostics);
                //        if (emitOutput.emitResultStatus != EmitReturnStatus.Succeeded)
                //            exitStatus = emitOutput.emitResultStatus;
                //    });
                //}
                var reportStart = new Date().getTime();
                errors = ts.concatenate(errors, emitErrors);
            }
        }
        reportDiagnostics(errors);
        if (commandLine.options.diagnostics) {
            var memoryUsed = ts.sys.getMemoryUsage ? ts.sys.getMemoryUsage() : -1;
            reportCountStatistic("Files", program.getSourceFiles().length);
            reportCountStatistic("Lines", countLines(program));
            reportCountStatistic("Nodes", checker ? checker.getNodeCount() : 0);
            reportCountStatistic("Identifiers", checker ? checker.getIdentifierCount() : 0);
            reportCountStatistic("Symbols", checker ? checker.getSymbolCount() : 0);
            reportCountStatistic("Types", checker ? checker.getTypeCount() : 0);
            if (memoryUsed >= 0) {
                reportStatisticalValue("Memory used", Math.round(memoryUsed / 1000) + "K");
            }
            reportTimeStatistic("Parse time", bindStart - parseStart);
            reportTimeStatistic("Bind time", checkStart - bindStart);
            reportTimeStatistic("Check time", emitStart - checkStart);
            reportTimeStatistic("Emit time", reportStart - emitStart);
            reportTimeStatistic("Total time", reportStart - parseStart);
        }
        var sortErrors = ts.SortHelper.getErrors();
        if (sortErrors && sortErrors.length > 0) {
            exitStatus = sortErrors[0].code;
            formatedMessages = formatedMessages.concat(sortErrors.map(function (e) { return e.messageText; }));
        }
        var result = { program: program, exitStatus: exitStatus, files: ts.SortHelper.getOrderedFiles(), messages: formatedMessages.concat() };
        formatedMessages = [];
        return result;
    }
})(ts || (ts = {}));
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.executeWithOption = function (options, files, out, outDir) {
        var target = options.esTarget.toLowerCase();
        var targetEnum = 1 /* ES5 */;
        if (target == 'es6')
            targetEnum = 2 /* ES6 */;
        var parsedCmd = {
            filenames: files,
            options: {
                sourceMap: options.sourceMap,
                target: targetEnum,
                removeComments: options.removeComments,
                declaration: options.declaration,
                diagnostics: options.debug
            },
            errors: []
        };
        if (out) {
            parsedCmd.options.out = out;
        }
        else {
            parsedCmd.options.outDir = outDir;
        }
        return ts.executeWithOption(parsedCmd);
    };
    Compiler.exit = null;
    Compiler.write = function (msg) { return console.log(msg); };
    return Compiler;
})();
module.exports.Compiler = Compiler;
module.exports.tsc = ts;
ts.sys.exit = function (code) {
    return Compiler.exit(code);
};
ts.sys.write = function (msg) {
    return Compiler.write(msg);
};
//# sourceMappingURL=tsclark.js.map