/// <reference path="program.ts"/>
/// <reference path="commandLineParser.ts"/>
/// <reference path="sort.ts"/>

namespace ts {
    export interface SourceFile {
        fileWatcher?: FileWatcher;
    }

    /**
     * Checks to see if the locale is in the appropriate format,
     * and if it is, attempts to set the appropriate language.
     */
    function validateLocaleAndSetLanguage(locale: string, errors: Diagnostic[]): boolean {
        let matchResult = /^([a-z]+)([_\-]([a-z]+))?$/.exec(locale.toLowerCase());

        if (!matchResult) {
            errors.push(createCompilerDiagnostic(Diagnostics.Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1, "en", "ja-jp"));
            return false;
        }

        let language = matchResult[1];
        let territory = matchResult[3];

        // First try the entire locale, then fall back to just language if that's all we have.
        if (!trySetLanguageAndTerritory(language, territory, errors) &&
            !trySetLanguageAndTerritory(language, undefined, errors)) {

            errors.push(createCompilerDiagnostic(Diagnostics.Unsupported_locale_0, locale));
            return false;
        }

        return true;
    }

    function trySetLanguageAndTerritory(language: string, territory: string, errors: Diagnostic[]): boolean {
        let compilerFilePath = normalizePath(sys.getExecutingFilePath());
        let containingDirectoryPath = getDirectoryPath(compilerFilePath);

        let filePath = combinePaths(containingDirectoryPath, language);

        if (territory) {
            filePath = filePath + "-" + territory;
        }

        filePath = sys.resolvePath(combinePaths(filePath, "diagnosticMessages.generated.json"));

        if (!sys.fileExists(filePath)) {
            return false;
        }

        // TODO: Add codePage support for readFile?
        let fileContents = "";
        try {
            fileContents = sys.readFile(filePath);
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
        let count = 0;
        forEach(program.getSourceFiles(), file => {
            count += getLineStarts(file).length;
        });
        return count;
    }

    function getDiagnosticText(message: DiagnosticMessage, ...args: any[]): string {
        let diagnostic = createCompilerDiagnostic.apply(undefined, arguments);
        return <string>diagnostic.messageText;
    }

    function reportDiagnostic(diagnostic: Diagnostic) {
        let output = "";

        if (diagnostic.file) {
            let loc = getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            output += `${ diagnostic.file.fileName }(${ loc.line + 1 },${ loc.character + 1 }): `;
        }

        let category = DiagnosticCategory[diagnostic.category].toLowerCase();
        output += `${ category } TS${ diagnostic.code }: ${ flattenDiagnosticMessageText(diagnostic.messageText, sys.newLine) }${ sys.newLine }`;

        formatedMessages.push(output);
    }

    function reportDiagnostics(diagnostics: Diagnostic[]) {
        for (let i = 0; i < diagnostics.length; i++) {
            reportDiagnostic(diagnostics[i]);
        }
    }

    function reportWatchDiagnostic(diagnostic: Diagnostic) {
        let output = new Date().toLocaleTimeString() + " - ";

        if (diagnostic.file) {
            let loc = getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            output += `${ diagnostic.file.fileName }(${ loc.line + 1 },${ loc.character + 1 }): `;
        }

        output += `${ flattenDiagnosticMessageText(diagnostic.messageText, sys.newLine) }${ sys.newLine }`;

        sys.write(output);
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

    function isJSONSupported() {
        return typeof JSON === "object" && typeof JSON.parse === "function";
    }

    export function executeCommandLine(args: string[]): number {
        let commandLine = parseCommandLine(args);
        let configFileName: string;                                 // Configuration file name (if any)
        let cachedConfigFileText: string;                           // Cached configuration file text, used for reparsing (if any)
        let configFileWatcher: FileWatcher;                         // Configuration file watcher
        let directoryWatcher: FileWatcher;                          // Directory watcher to monitor source file addition/removal
        let cachedProgram: Program;                                 // Program cached from last compilation
        let rootFileNames: string[];                                // Root fileNames for compilation
        let compilerOptions: CompilerOptions;                       // Compiler options for compilation
        let compilerHost: CompilerHost;                             // Compiler host
        let hostGetSourceFile: typeof compilerHost.getSourceFile;   // getSourceFile method from default host
        let timerHandleForRecompilation: number;                    // Handle for 0.25s wait timer to trigger recompilation
        let timerHandleForDirectoryChanges: number;                 // Handle for 0.25s wait timer to trigger directory change handler

        if (commandLine.options.locale) {
            if (!isJSONSupported()) {
                reportDiagnostic(createCompilerDiagnostic(Diagnostics.The_current_host_does_not_support_the_0_option, "--locale"));
                return sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
            }
            validateLocaleAndSetLanguage(commandLine.options.locale, commandLine.errors);
        }

        // If there are any errors due to command line parsing and/or
        // setting up localization, report them and quit.
        if (commandLine.errors.length > 0) {
            reportDiagnostics(commandLine.errors);
            return sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }

        if (commandLine.options.init) {
            writeConfigFile(commandLine.options, commandLine.fileNames);
            return sys.exit(ExitStatus.Success);
        }

        if (commandLine.options.version) {
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.Version_0, ts.version));
            return sys.exit(ExitStatus.Success);
        }

        if (commandLine.options.help) {
            printVersion();
            printHelp();
            return sys.exit(ExitStatus.Success);
        }

        if (commandLine.options.project) {
            if (!isJSONSupported()) {
                reportDiagnostic(createCompilerDiagnostic(Diagnostics.The_current_host_does_not_support_the_0_option, "--project"));
                return sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
            }
            configFileName = normalizePath(combinePaths(commandLine.options.project, "tsconfig.json"));
            if (commandLine.fileNames.length !== 0) {
                reportDiagnostic(createCompilerDiagnostic(Diagnostics.Option_project_cannot_be_mixed_with_source_files_on_a_command_line));
                return sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
            }
        }
        else if (commandLine.fileNames.length === 0 && isJSONSupported()) {
            let searchPath = normalizePath(sys.getCurrentDirectory());
            configFileName = findConfigFile(searchPath, sys.fileExists);
        }

        if (commandLine.fileNames.length === 0 && !configFileName) {
            printVersion();
            printHelp();
            return sys.exit(ExitStatus.Success);
        }

        // Firefox has Object.prototype.watch
        if (commandLine.options.watch && commandLine.options.hasOwnProperty("watch")) {
            if (!sys.watchFile) {
                reportDiagnostic(createCompilerDiagnostic(Diagnostics.The_current_host_does_not_support_the_0_option, "--watch"));
                return sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
            }
            if (configFileName) {
                configFileWatcher = sys.watchFile(<Path>configFileName, configFileChanged);
            }
            if (sys.watchDirectory && configFileName) {
                let directory = ts.getDirectoryPath(configFileName);
                directoryWatcher = sys.watchDirectory(
                    // When the configFileName is just "tsconfig.json", the watched directory should be
                    // the current direcotry; if there is a given "project" parameter, then the configFileName
                    // is an absolute file name.
                    directory == "" ? "." : directory,
                    watchedDirectoryChanged, /*recursive*/ true);
            }
        }

        performCompilation();

        function parseConfigFile(): ParsedCommandLine {
            if (!cachedConfigFileText) {
                try {
                    cachedConfigFileText = sys.readFile(configFileName);
                }
                catch (e) {
                    let error = createCompilerDiagnostic(Diagnostics.Cannot_read_file_0_Colon_1, configFileName, e.message);
                    reportWatchDiagnostic(error);
                    sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
                    return;
                }
            }

            let result = parseConfigFileTextToJson(configFileName, cachedConfigFileText);
            let configObject = result.config;
            let configParseResult = parseJsonConfigFileContent(configObject, sys, getDirectoryPath(configFileName));
            if (configParseResult.errors.length > 0) {
                reportDiagnostics(configParseResult.errors);
                sys.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
                return;
            }
            return configParseResult;
        }

        // Invoked to perform initial compilation or re-compilation in watch mode
        function performCompilation() {

            if (!cachedProgram) {
                if (configFileName) {
                    let configParseResult = parseConfigFile();
                    rootFileNames = configParseResult.fileNames;
                    compilerOptions = extend(commandLine.options, configParseResult.options);
                }
                else {
                    rootFileNames = commandLine.fileNames;
                    compilerOptions = commandLine.options;
                }
                compilerHost = createCompilerHost(compilerOptions);
                hostGetSourceFile = compilerHost.getSourceFile;
                compilerHost.getSourceFile = getSourceFile;
            }

            let compileResult = compile(rootFileNames, compilerOptions, compilerHost);

            if (!compilerOptions.watch) {
                return sys.exit(compileResult.exitStatus);
            }

            setCachedProgram(compileResult.program);
            reportWatchDiagnostic(createCompilerDiagnostic(Diagnostics.Compilation_complete_Watching_for_file_changes));
        }

        function getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void) {
            // Return existing SourceFile object if one is available
            if (cachedProgram) {
                let sourceFile = cachedProgram.getSourceFile(fileName);
                // A modified source file has no watcher and should not be reused
                if (sourceFile && sourceFile.fileWatcher) {
                    return sourceFile;
                }
            }
            // Use default host function
            let sourceFile = hostGetSourceFile(fileName, languageVersion, onError);
            if (sourceFile && compilerOptions.watch) {
                // Attach a file watcher
                sourceFile.fileWatcher = sys.watchFile(sourceFile.path, (fileName: string, removed?: boolean) => sourceFileChanged(sourceFile, removed));
            }
            return sourceFile;
        }

        // Change cached program to the given program
        function setCachedProgram(program: Program) {
            if (cachedProgram) {
                let newSourceFiles = program ? program.getSourceFiles() : undefined;
                forEach(cachedProgram.getSourceFiles(), sourceFile => {
                    if (!(newSourceFiles && contains(newSourceFiles, sourceFile))) {
                        if (sourceFile.fileWatcher) {
                            sourceFile.fileWatcher.close();
                            sourceFile.fileWatcher = undefined;
                        }
                    }
                });
            }
            cachedProgram = program;
        }

        // If a source file changes, mark it as unwatched and start the recompilation timer
        function sourceFileChanged(sourceFile: SourceFile, removed?: boolean) {
            sourceFile.fileWatcher.close();
            sourceFile.fileWatcher = undefined;
            if (removed) {
                let index = rootFileNames.indexOf(sourceFile.fileName);
                if (index >= 0) {
                    rootFileNames.splice(index, 1);
                }
            }
            startTimerForRecompilation();
        }

        // If the configuration file changes, forget cached program and start the recompilation timer
        function configFileChanged() {
            setCachedProgram(undefined);
            cachedConfigFileText = undefined;
            startTimerForRecompilation();
        }

        function watchedDirectoryChanged(fileName: string) {
            if (fileName && !ts.isSupportedSourceFileName(fileName)) {
                return;
            }

            startTimerForHandlingDirectoryChanges();
        }

        function startTimerForHandlingDirectoryChanges() {
            if (timerHandleForDirectoryChanges) {
                clearTimeout(timerHandleForDirectoryChanges);
            }
            timerHandleForDirectoryChanges = setTimeout(directoryChangeHandler, 250);
        }

        function directoryChangeHandler() {
            let parsedCommandLine = parseConfigFile();
            let newFileNames = ts.map(parsedCommandLine.fileNames, compilerHost.getCanonicalFileName);
            let canonicalRootFileNames = ts.map(rootFileNames, compilerHost.getCanonicalFileName);

            if (!arrayStructurallyIsEqualTo(newFileNames, canonicalRootFileNames)) {
                setCachedProgram(undefined);
                startTimerForRecompilation();
            }
        }

        // Upon detecting a file change, wait for 250ms and then perform a recompilation. This gives batch
        // operations (such as saving all modified files in an editor) a chance to complete before we kick
        // off a new compilation.
        function startTimerForRecompilation() {
            if (timerHandleForRecompilation) {
                clearTimeout(timerHandleForRecompilation);
            }
            timerHandleForRecompilation = setTimeout(recompile, 250);
        }

        function recompile() {
            timerHandleForRecompilation = undefined;
            reportWatchDiagnostic(createCompilerDiagnostic(Diagnostics.File_change_detected_Starting_incremental_compilation));
            performCompilation();
        }
    }

    function compile(fileNames: string[], compilerOptions: CompilerOptions, compilerHost: CompilerHost):EgretCompileResult {
        ioReadTime = 0;
        ioWriteTime = 0;
        programTime = 0;
        bindTime = 0;
        checkTime = 0;
        emitTime = 0;

        let program = createProgram(fileNames, compilerOptions, compilerHost);
        let exitStatus = compileProgram();
        let emitReturnStatus = exitStatus == ExitStatus.Success ? 0 : 5;

        if (compilerOptions.listFiles) {
            forEach(program.getSourceFiles(), file => {
                sys.write(file.fileName + sys.newLine);
            });
        }

        if (compilerOptions.diagnostics) {
            let memoryUsed = sys.getMemoryUsage ? sys.getMemoryUsage() : -1;
            reportCountStatistic("Files", program.getSourceFiles().length);
            reportCountStatistic("Lines", countLines(program));
            reportCountStatistic("Nodes", program.getNodeCount());
            reportCountStatistic("Identifiers", program.getIdentifierCount());
            reportCountStatistic("Symbols", program.getSymbolCount());
            reportCountStatistic("Types", program.getTypeCount());

            if (memoryUsed >= 0) {
                reportStatisticalValue("Memory used", Math.round(memoryUsed / 1000) + "K");
            }

            // Individual component times.
            // Note: To match the behavior of previous versions of the compiler, the reported parse time includes
            // I/O read time and processing time for triple-slash references and module imports, and the reported
            // emit time includes I/O write time. We preserve this behavior so we can accurately compare times.
            reportTimeStatistic("I/O read", ioReadTime);
            reportTimeStatistic("I/O write", ioWriteTime);
            reportTimeStatistic("Parse time", programTime);
            reportTimeStatistic("Bind time", bindTime);
            reportTimeStatistic("Check time", checkTime);
            reportTimeStatistic("Emit time", emitTime);
            reportTimeStatistic("Total time", programTime + bindTime + checkTime + emitTime);
        }
        var sortErrors = SortHelper.getErrors();
        if (sortErrors && sortErrors.length > 0) {
            emitReturnStatus = sortErrors[0].code;
            formatedMessages = formatedMessages.concat(sortErrors.map((e:any)=> e.messageText));
        }
        var result = { program:program, exitStatus:emitReturnStatus, files: ts.SortHelper.getOrderedFiles(), messages: formatedMessages.concat() };
        formatedMessages = [];
        return result;

        function compileProgram(): ExitStatus {
            let diagnostics: Diagnostic[];

            // First get and report any syntactic errors.
            diagnostics = program.getSyntacticDiagnostics();

            // If we didn't have any syntactic errors, then also try getting the global and
            // semantic errors.
            if (diagnostics.length === 0) {
                diagnostics = program.getOptionsDiagnostics().concat(program.getGlobalDiagnostics());

                if (diagnostics.length === 0) {
                    diagnostics = program.getSemanticDiagnostics();
                }
            }

            reportDiagnostics(diagnostics);

            // If the user doesn't want us to emit, then we're done at this point.
            if (compilerOptions.noEmit) {
                return diagnostics.length
                    ? ExitStatus.DiagnosticsPresent_OutputsSkipped
                    : ExitStatus.Success;
            }

            var checker = program.getTypeChecker();
            var sortHelper = new SortHelper();
            sortHelper.orderFiles(checker, program);

            // Otherwise, emit and report any errors we ran into.
            let emitOutput = program.emit();
            reportDiagnostics(emitOutput.diagnostics);

            // If the emitter didn't emit anything, then pass that value along.
            if (emitOutput.emitSkipped) {
                return ExitStatus.DiagnosticsPresent_OutputsSkipped;
            }

            // The emitter emitted something, inform the caller if that happened in the presence
            // of diagnostics or not.
            if (diagnostics.length > 0 || emitOutput.diagnostics.length > 0) {
                return ExitStatus.DiagnosticsPresent_OutputsGenerated;
            }

            return ExitStatus.Success;
        }
    }

    function printVersion() {
        sys.write(getDiagnosticText(Diagnostics.Version_0, ts.version) + sys.newLine);
    }

    function printHelp() {
        let output = "";

        // We want to align our "syntax" and "examples" commands to a certain margin.
        let syntaxLength = getDiagnosticText(Diagnostics.Syntax_Colon_0, "").length;
        let examplesLength = getDiagnosticText(Diagnostics.Examples_Colon_0, "").length;
        let marginLength = Math.max(syntaxLength, examplesLength);

        // Build up the syntactic skeleton.
        let syntax = makePadding(marginLength - syntaxLength);
        syntax += "tsc [" + getDiagnosticText(Diagnostics.options) + "] [" + getDiagnosticText(Diagnostics.file) + " ...]";

        output += getDiagnosticText(Diagnostics.Syntax_Colon_0, syntax);
        output += sys.newLine + sys.newLine;

        // Build up the list of examples.
        let padding = makePadding(marginLength);
        output += getDiagnosticText(Diagnostics.Examples_Colon_0, makePadding(marginLength - examplesLength) + "tsc hello.ts") + sys.newLine;
        output += padding + "tsc --out file.js file.ts" + sys.newLine;
        output += padding + "tsc @args.txt" + sys.newLine;
        output += sys.newLine;

        output += getDiagnosticText(Diagnostics.Options_Colon) + sys.newLine;

        // Sort our options by their names, (e.g. "--noImplicitAny" comes before "--watch")
        let optsList = filter(optionDeclarations.slice(), v => !v.experimental);
        optsList.sort((a, b) => compareValues<string>(a.name.toLowerCase(), b.name.toLowerCase()));

        // We want our descriptions to align at the same column in our output,
        // so we keep track of the longest option usage string.
        marginLength = 0;
        let usageColumn: string[] = []; // Things like "-d, --declaration" go in here.
        let descriptionColumn: string[] = [];

        for (let i = 0; i < optsList.length; i++) {
            let option = optsList[i];

            // If an option lacks a description,
            // it is not officially supported.
            if (!option.description) {
                continue;
            }

            let usageText = " ";
            if (option.shortName) {
                usageText += "-" + option.shortName;
                usageText += getParamType(option);
                usageText += ", ";
            }

            usageText += "--" + option.name;
            usageText += getParamType(option);

            usageColumn.push(usageText);
            descriptionColumn.push(getDiagnosticText(option.description));

            // Set the new margin for the description column if necessary.
            marginLength = Math.max(usageText.length, marginLength);
        }

        // Special case that can't fit in the loop.
        let usageText = " @<" + getDiagnosticText(Diagnostics.file) + ">";
        usageColumn.push(usageText);
        descriptionColumn.push(getDiagnosticText(Diagnostics.Insert_command_line_options_and_files_from_a_file));
        marginLength = Math.max(usageText.length, marginLength);

        // Print out each row, aligning all the descriptions on the same column.
        for (let i = 0; i < usageColumn.length; i++) {
            let usage = usageColumn[i];
            let description = descriptionColumn[i];
            output += usage + makePadding(marginLength - usage.length + 2) + description + sys.newLine;
        }

        sys.write(output);
        return;

        function getParamType(option: CommandLineOption) {
            if (option.paramType !== undefined) {
                return " " + getDiagnosticText(option.paramType);
            }
            return "";
        }

        function makePadding(paddingLength: number): string {
            return Array(paddingLength + 1).join(" ");
        }
    }

    function writeConfigFile(options: CompilerOptions, fileNames: string[]) {
        let currentDirectory = sys.getCurrentDirectory();
        let file = combinePaths(currentDirectory, "tsconfig.json");
        if (sys.fileExists(file)) {
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.A_tsconfig_json_file_is_already_defined_at_Colon_0, file));
        }
        else {
            let compilerOptions = extend(options, defaultInitCompilerOptions);
            let configurations: any = {
                compilerOptions: serializeCompilerOptions(compilerOptions),
                exclude: ["node_modules"]
            };

            if (fileNames && fileNames.length) {
                // only set the files property if we have at least one file
                configurations.files = fileNames;
            }

            sys.writeFile(file, JSON.stringify(configurations, undefined, 4));
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.Successfully_created_a_tsconfig_json_file));
        }

        return;

        function serializeCompilerOptions(options: CompilerOptions): Map<string | number | boolean> {
            let result: Map<string | number | boolean> = {};
            let optionsNameMap = getOptionNameMap().optionNameMap;

            for (let name in options) {
                if (hasProperty(options, name)) {
                    let value = options[name];
                    switch (name) {
                        case "init":
                        case "watch":
                        case "version":
                        case "help":
                        case "project":
                            break;
                        default:
                            let optionDefinition = optionsNameMap[name.toLowerCase()];
                            if (optionDefinition) {
                                if (typeof optionDefinition.type === "string") {
                                    // string, number or boolean
                                    result[name] = value;
                                }
                                else {
                                    // Enum
                                    let typeMap = <Map<number>>optionDefinition.type;
                                    for (let key in typeMap) {
                                        if (hasProperty(typeMap, key)) {
                                            if (typeMap[key] === value)
                                                result[name] = key;
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            return result;
        }
    }

    var formatedMessages: string[] = [];

    export function executeWithOption(commandLine: ParsedCommandLine): EgretCompileResult {
        var compilerOptions = commandLine.options;
        formatedMessages = [];
        var result: EgretCompileResult = {
            exitStatus: 0,
            program: null,
            compileWithChanges: null,
            files: [],
            messages: formatedMessages
        };

        // If there are any errors due to command line parsing and/or
        // setting up localization, report them and quit.
        if (commandLine.errors.length > 0) {
            reportDiagnostics(commandLine.errors);
            result.exitStatus = 5;
            return result;
        }

        if (commandLine.fileNames.length === 0) {
            result.exitStatus = 5;
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
    function watchProgram(commandLine: ParsedCommandLine, compilerHost: CompilerHost): EgretCompileResult {
        var watchers: Map<FileWatcher> = {};
        var updatedFiles: Map<boolean> = {};

        // Compile the program the first time and watch all given/referenced files.
        var result = compile(commandLine.fileNames, commandLine.options, compilerHost);
        var program = result.program;
        result.compileWithChanges = compileWithChanges;
        return result;

        function compileWithChanges(filesChanged: egret.FileChanges, sourceMap?: boolean): EgretCompileResult {

            commandLine.options.sourceMap = !!sourceMap;

            filesChanged.forEach((file: any)=> {
                if (file.type == "added") {
                    commandLine.fileNames.push(file.fileName);
                    updatedFiles[getCanonicalName(file.fileName)] = true
                }
                else if (file.type == "removed") {
                    var index = commandLine.fileNames.indexOf(file.fileName);
                    if (index >= 0)
                        commandLine.fileNames.splice(index, 1);
                }
                else {
                    updatedFiles[getCanonicalName(file.fileName)] = true
                }
            });
            var changedFiles = updatedFiles;
            updatedFiles = {};
            return recompile(changedFiles);
        }


        function recompile(changedFiles: Map<boolean>): EgretCompileResult {
            //console.log(changedFiles);
            formatedMessages = [];
            // Reuse source files from the last compilation so long as they weren't changed.
            var oldSourceFiles = arrayToMap(
                filter(program.getSourceFiles(), file => !hasProperty(changedFiles, getCanonicalName(file.fileName))),
                file => getCanonicalName(file.fileName));

            // We create a new compiler host for this compilation cycle.
            // This new host is effectively the same except that 'getSourceFile'
            // will try to reuse the SourceFiles from the last compilation cycle
            // so long as they were not modified.
            var newCompilerHost = clone(compilerHost);
            newCompilerHost.getSourceFile = (fileName, languageVersion, onError) => {
                var name = getCanonicalName(fileName);

                var sourceFile = lookUp(oldSourceFiles, name);
                if (sourceFile) {
                    return sourceFile;
                }

                return compilerHost.getSourceFile(fileName, languageVersion, onError);
            };

            var result:EgretCompileResult = compile(commandLine.fileNames, commandLine.options, newCompilerHost);
            program = result.program;
            result.compileWithChanges = compileWithChanges;
            return result;
        }

        function getCanonicalName(fileName: string) {
            return compilerHost.getCanonicalFileName(fileName);
        }
    }

    export interface EgretCompileResult {
        program: ts.Program;
        files?: string[];
        exitStatus: number;
        compileWithChanges?: (filesChanged: egret.FileChanges, sourceMap?: boolean) => EgretCompileResult;
        messages?: string[];
    }
}

//ts.executeCommandLine(ts.sys.args);


declare module egret {
    export type ToolArgs = any;
    export type FileChanges = any;
}

class Compiler {
    static executeWithOption(parsedCommandLine: ts.ParsedCommandLine): ts.EgretCompileResult {
        return ts.executeWithOption(parsedCommandLine);
    }
    static exit: (exitCode: number) => number = null;
    static write = (msg: string)=> console.log(msg);
}
declare var module: any;
module.exports.Compiler = Compiler;
module.exports.tsc = ts;
ts.sys.exit = function (code) {
    return Compiler.exit(code);
};

ts.sys.write = function (msg) {
    return Compiler.write(msg);
};
