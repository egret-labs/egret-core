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

module ts {
    var version = "1.4.0.0";
    var formatedMessages: string[] = [];
    /**
     * Checks to see if the locale is in the appropriate format,
     * and if it is, attempts to set the appropriate language.
     */
    function validateLocaleAndSetLanguage(locale: string, errors: Diagnostic[]): boolean {
        var matchResult = /^([a-z]+)([_\-]([a-z]+))?$/.exec(locale.toLowerCase());

        if (!matchResult) {
            errors.push(createCompilerDiagnostic(Diagnostics.Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1, 'en', 'ja-jp'));
            return false;
        }

        var language = matchResult[1];
        var territory = matchResult[3];

        // First try the entire locale, then fall back to just language if that's all we have.
        if (!trySetLanguageAndTerritory(language, territory, errors) &&
            !trySetLanguageAndTerritory(language, undefined, errors)) {

            errors.push(createCompilerDiagnostic(Diagnostics.Unsupported_locale_0, locale));
            return false;
        }

        return true;
    }

    function trySetLanguageAndTerritory(language: string, territory: string, errors: Diagnostic[]): boolean {
        var compilerFilePath = normalizePath(sys.getExecutingFilePath());
        var containingDirectoryPath = getDirectoryPath(compilerFilePath);

        var filePath = combinePaths(containingDirectoryPath, language);

        if (territory) {
            filePath = filePath + "-" + territory;
        }

        filePath = sys.resolvePath(combinePaths(filePath, "diagnosticMessages.generated.json"));

        if (!sys.fileExists(filePath)) {
            return false;
        }

        // TODO: Add codePage support for readFile?
        try {
            var fileContents = sys.readFile(filePath);
        }
        catch (e) {
            errors.push(createCompilerDiagnostic(Diagnostics.Unable_to_open_file_0, filePath));
            return false;
        }
        try {
            ts.localizedDiagnosticMessages = JSON.parse(fileContents);
        }
        catch (e) {
            errors.push(createCompilerDiagnostic(Diagnostics.Corrupted_locale_file_0, filePath));
            return false;
        }

        return true;
    }

    function countLines(program: Program): number {
        var count = 0;
        forEach(program.getSourceFiles(), file => {
            count += file.getLineAndCharacterFromPosition(file.end).line;
        });
        return count;
    }

    function getDiagnosticText(message: DiagnosticMessage, ...args: any[]): string {
        var diagnostic: Diagnostic = createCompilerDiagnostic.apply(undefined, arguments);
        return diagnostic.messageText;
    }

    function reportDiagnostic(diagnostic: Diagnostic) {
        var output = "";

        if (diagnostic.file) {
            var loc = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);

            output += diagnostic.file.filename + "(" + loc.line + "," + loc.character + "): ";
        }

        var category = DiagnosticCategory[diagnostic.category].toLowerCase();
        output += category + " TS" + diagnostic.code + ": " + diagnostic.messageText;

        formatedMessages.push(output);
    }

    function reportDiagnostics(diagnostics: Diagnostic[]) {
        for (var i = 0; i < diagnostics.length; i++) {
            reportDiagnostic(diagnostics[i]);
        }
    }

    function padLeft(s: string, length: number) {
        while (s.length < length) {
            s = " " + s;
        }
        return s;
    }

    function padRight(s: string, length: number) {
        while (s.length < length) {
            s = s + " ";
        }

        return s;
    }

    function reportStatisticalValue(name: string, value: string) {
        sys.write(padRight(name + ":", 12) + padLeft(value.toString(), 10) + sys.newLine);
    }

    function reportCountStatistic(name: string, count: number) {
        reportStatisticalValue(name, "" + count);
    }

    function reportTimeStatistic(name: string, time: number) {
        reportStatisticalValue(name, (time / 1000).toFixed(2) + "s");
    }


    export function executeWithOption(commandLine: ParsedCommandLine): LarkCompileResult {
        var compilerOptions = commandLine.options;
        formatedMessages = [];
        var result: LarkCompileResult = {
            exitStatus: EmitReturnStatus.Succeeded,
            program: null,
            compileWithChanges: null,
            files: [],
            messages: formatedMessages
        };

        // If there are any errors due to command line parsing and/or
        // setting up localization, report them and quit.
        if (commandLine.errors.length > 0) {
            reportDiagnostics(commandLine.errors);
            result.exitStatus = EmitReturnStatus.CompilerOptionsErrors;
            return result;
        }

        if (commandLine.filenames.length === 0) {
            result.exitStatus = EmitReturnStatus.CompilerOptionsErrors;
            return result;
        }

        var defaultCompilerHost = createCompilerHost(compilerOptions);

        return watchProgram(commandLine, defaultCompilerHost);
    }

    /**
     * Compiles the program once, and then watches all given and referenced files for changes.
     * Upon detecting a file change, watchProgram will queue up file modification events for the next
     * 250ms and then perform a recompilation. The reasoning is that in some cases, an editor can
     * save all files at once, and we'd like to just perform a single recompilation.
     */
    function watchProgram(commandLine: ParsedCommandLine, compilerHost: CompilerHost): LarkCompileResult {
        var watchers: Map<FileWatcher> = {};
        var updatedFiles: Map<boolean> = {};

        // Compile the program the first time and watch all given/referenced files.
        var result = compile(commandLine, compilerHost);
        var program = result.program;
        result.compileWithChanges = compileWithChanges;
        return result;

        function compileWithChanges(filesChanged: egret.FileChanges): LarkCompileResult {

            filesChanged.forEach(file=> {
                if (file.type == "added") {
                    commandLine.filenames.push(file.fileName);
                    updatedFiles[getCanonicalName(file.fileName)] = true
                }
                else if (file.type == "removed") {
                    var index = commandLine.filenames.indexOf(file.fileName);
                    if (index >= 0)
                        commandLine.filenames.splice(index, 1);
                }
                else {
                    updatedFiles[getCanonicalName(file.fileName)] = true
                }
            });
            var changedFiles = updatedFiles;
            updatedFiles = {};
            return recompile(changedFiles);
        }


        function recompile(changedFiles: Map<boolean>): LarkCompileResult {
            console.log(changedFiles);

            // Reuse source files from the last compilation so long as they weren't changed.
            var oldSourceFiles = arrayToMap(
                filter(program.getSourceFiles(), file => !hasProperty(changedFiles, getCanonicalName(file.filename))),
                file => getCanonicalName(file.filename));

            // We create a new compiler host for this compilation cycle.
            // This new host is effectively the same except that 'getSourceFile'
            // will try to reuse the SourceFiles from the last compilation cycle
            // so long as they were not modified.
            var newCompilerHost = clone(compilerHost);
            newCompilerHost.getSourceFile = (fileName, languageVersion, onError) => {
                fileName = getCanonicalName(fileName);

                var sourceFile = lookUp(oldSourceFiles, fileName);
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

        function getCanonicalName(fileName: string) {
            return compilerHost.getCanonicalFileName(fileName);
        }
    }

    export interface LarkCompileResult {
        program: ts.Program;
        files?: string[];
        exitStatus: EmitReturnStatus;
        compileWithChanges?: (filesChanged: egret.FileChanges) => LarkCompileResult;
        messages?: string[];
    }

    export interface FileChanges {
        added: string[];
        modified: string[];
        removed: string[];
    }

    function compile(commandLine: ParsedCommandLine, compilerHost: CompilerHost, changedFiles?:string[]): LarkCompileResult {
        var parseStart = new Date().getTime();
        var compilerOptions = commandLine.options;
        var program = createProgram(commandLine.filenames, compilerOptions, compilerHost);

        var bindStart = new Date().getTime();
        var errors: Diagnostic[] = program.getDiagnostics();
        var exitStatus: EmitReturnStatus;

        if (errors.length) {
            var checkStart = bindStart;
            var emitStart = bindStart;
            var reportStart = bindStart;
            exitStatus = EmitReturnStatus.AllOutputGenerationSkipped;
        }
        else {
            var checker = program.getTypeChecker(/*fullTypeCheckMode*/ true);
            var checkStart = new Date().getTime();
            errors = checker.getDiagnostics();
            if (checker.isEmitBlocked()) {
                exitStatus = EmitReturnStatus.AllOutputGenerationSkipped;
            }
            else {
                var sortHelper = new SortHelper();
                sortHelper.orderFiles(checker, program);
                var emitStart = new Date().getTime();
                var emitErrors: Diagnostic[];
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
                errors = concatenate(errors, emitErrors);
            }
        }

        reportDiagnostics(errors);
        if (commandLine.options.diagnostics) {
            var memoryUsed = sys.getMemoryUsage ? sys.getMemoryUsage() : -1;
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


        var sortErrors = SortHelper.getErrors();
        if (sortErrors && sortErrors.length > 0) {
            exitStatus = sortErrors[0].code;
            formatedMessages = formatedMessages.concat(sortErrors.map(e=> e.messageText));
        }
        var result = { program, exitStatus, files: ts.SortHelper.getOrderedFiles(), messages: formatedMessages.concat() };
        formatedMessages = [];
        return result;
    }

}



class Compiler {
    static executeWithOption(options: egret.ToolArgs, files: string[], out?: string, outDir?: string): ts.LarkCompileResult {

        var target = options.esTarget.toLowerCase();
        var targetEnum = ts.ScriptTarget.ES5;
        if (target == 'es6')
            targetEnum = ts.ScriptTarget.ES6;

        var parsedCmd: ts.ParsedCommandLine = {
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
    }
    static exit: (exitCode: number) => number = null;
    static write = msg=> console.log(msg);
}
module.exports.Compiler = Compiler;
module.exports.tsc = ts;
ts.sys.exit = function (code) {
    return Compiler.exit(code);
}

ts.sys.write = function (msg) {
    return Compiler.write(msg);
};
