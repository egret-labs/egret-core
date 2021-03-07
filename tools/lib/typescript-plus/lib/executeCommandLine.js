"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ts;
(function (ts) {
    function countLines(program) {
        var counts = getCountsMap();
        ts.forEach(program.getSourceFiles(), function (file) {
            var key = getCountKey(program, file);
            var lineCount = ts.getLineStarts(file).length;
            counts.set(key, counts.get(key) + lineCount);
        });
        return counts;
    }
    function countNodes(program) {
        var counts = getCountsMap();
        ts.forEach(program.getSourceFiles(), function (file) {
            var key = getCountKey(program, file);
            counts.set(key, counts.get(key) + file.nodeCount);
        });
        return counts;
    }
    function getCountsMap() {
        var counts = ts.createMap();
        counts.set("Library", 0);
        counts.set("Definitions", 0);
        counts.set("TypeScript", 0);
        counts.set("JavaScript", 0);
        counts.set("JSON", 0);
        counts.set("Other", 0);
        return counts;
    }
    function getCountKey(program, file) {
        if (program.isSourceFileDefaultLibrary(file)) {
            return "Library";
        }
        else if (file.isDeclarationFile) {
            return "Definitions";
        }
        var path = file.path;
        if (ts.fileExtensionIsOneOf(path, ts.supportedTSExtensions)) {
            return "TypeScript";
        }
        else if (ts.fileExtensionIsOneOf(path, ts.supportedJSExtensions)) {
            return "JavaScript";
        }
        else if (ts.fileExtensionIs(path, ".json" /* Json */)) {
            return "JSON";
        }
        else {
            return "Other";
        }
    }
    function updateReportDiagnostic(sys, existing, options) {
        return shouldBePretty(sys, options) ?
            ts.createDiagnosticReporter(sys, /*pretty*/ true) :
            existing;
    }
    function defaultIsPretty(sys) {
        return !!sys.writeOutputIsTTY && sys.writeOutputIsTTY();
    }
    function shouldBePretty(sys, options) {
        if (!options || typeof options.pretty === "undefined") {
            return defaultIsPretty(sys);
        }
        return options.pretty;
    }
    function getOptionsForHelp(commandLine) {
        // Sort our options by their names, (e.g. "--noImplicitAny" comes before "--watch")
        return !!commandLine.options.all ?
            ts.sort(ts.optionDeclarations, function (a, b) { return ts.compareStringsCaseInsensitive(a.name, b.name); }) :
            ts.filter(ts.optionDeclarations.slice(), function (v) { return !!v.showInSimplifiedHelpView; });
    }
    function printVersion(sys) {
        sys.write(ts.getDiagnosticText(ts.Diagnostics.Version_0, ts.version) + sys.newLine);
    }
    function printHelp(sys, optionsList, syntaxPrefix) {
        if (syntaxPrefix === void 0) { syntaxPrefix = ""; }
        var output = [];
        // We want to align our "syntax" and "examples" commands to a certain margin.
        var syntaxLength = ts.getDiagnosticText(ts.Diagnostics.Syntax_Colon_0, "").length;
        var examplesLength = ts.getDiagnosticText(ts.Diagnostics.Examples_Colon_0, "").length;
        var marginLength = Math.max(syntaxLength, examplesLength);
        // Build up the syntactic skeleton.
        var syntax = makePadding(marginLength - syntaxLength);
        syntax += "tsc " + syntaxPrefix + "[" + ts.getDiagnosticText(ts.Diagnostics.options) + "] [" + ts.getDiagnosticText(ts.Diagnostics.file) + "...]";
        output.push(ts.getDiagnosticText(ts.Diagnostics.Syntax_Colon_0, syntax));
        output.push(sys.newLine + sys.newLine);
        // Build up the list of examples.
        var padding = makePadding(marginLength);
        output.push(ts.getDiagnosticText(ts.Diagnostics.Examples_Colon_0, makePadding(marginLength - examplesLength) + "tsc hello.ts") + sys.newLine);
        output.push(padding + "tsc --outFile file.js file.ts" + sys.newLine);
        output.push(padding + "tsc @args.txt" + sys.newLine);
        output.push(padding + "tsc --build tsconfig.json" + sys.newLine);
        output.push(sys.newLine);
        output.push(ts.getDiagnosticText(ts.Diagnostics.Options_Colon) + sys.newLine);
        // We want our descriptions to align at the same column in our output,
        // so we keep track of the longest option usage string.
        marginLength = 0;
        var usageColumn = []; // Things like "-d, --declaration" go in here.
        var descriptionColumn = [];
        var optionsDescriptionMap = new ts.Map(); // Map between option.description and list of option.type if it is a kind
        for (var _i = 0, optionsList_1 = optionsList; _i < optionsList_1.length; _i++) {
            var option = optionsList_1[_i];
            // If an option lacks a description,
            // it is not officially supported.
            if (!option.description) {
                continue;
            }
            var usageText_1 = " ";
            if (option.shortName) {
                usageText_1 += "-" + option.shortName;
                usageText_1 += getParamType(option);
                usageText_1 += ", ";
            }
            usageText_1 += "--" + option.name;
            usageText_1 += getParamType(option);
            usageColumn.push(usageText_1);
            var description = void 0;
            if (option.name === "lib") {
                description = ts.getDiagnosticText(option.description);
                var element = option.element;
                var typeMap = element.type;
                optionsDescriptionMap.set(description, ts.arrayFrom(typeMap.keys()).map(function (key) { return "'" + key + "'"; }));
            }
            else {
                description = ts.getDiagnosticText(option.description);
            }
            descriptionColumn.push(description);
            // Set the new margin for the description column if necessary.
            marginLength = Math.max(usageText_1.length, marginLength);
        }
        // Special case that can't fit in the loop.
        var usageText = " @<" + ts.getDiagnosticText(ts.Diagnostics.file) + ">";
        usageColumn.push(usageText);
        descriptionColumn.push(ts.getDiagnosticText(ts.Diagnostics.Insert_command_line_options_and_files_from_a_file));
        marginLength = Math.max(usageText.length, marginLength);
        // Print out each row, aligning all the descriptions on the same column.
        for (var i = 0; i < usageColumn.length; i++) {
            var usage = usageColumn[i];
            var description = descriptionColumn[i];
            var kindsList = optionsDescriptionMap.get(description);
            output.push(usage + makePadding(marginLength - usage.length + 2) + description + sys.newLine);
            if (kindsList) {
                output.push(makePadding(marginLength + 4));
                for (var _a = 0, kindsList_1 = kindsList; _a < kindsList_1.length; _a++) {
                    var kind = kindsList_1[_a];
                    output.push(kind + " ");
                }
                output.push(sys.newLine);
            }
        }
        for (var _b = 0, output_1 = output; _b < output_1.length; _b++) {
            var line = output_1[_b];
            sys.write(line);
        }
        return;
        function getParamType(option) {
            if (option.paramType !== undefined) {
                return " " + ts.getDiagnosticText(option.paramType);
            }
            return "";
        }
        function makePadding(paddingLength) {
            return Array(paddingLength + 1).join(" ");
        }
    }
    function executeCommandLineWorker(sys, cb, commandLine) {
        var reportDiagnostic = ts.createDiagnosticReporter(sys);
        if (commandLine.options.build) {
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Option_build_must_be_the_first_command_line_argument));
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        // Configuration file name (if any)
        var configFileName;
        if (commandLine.options.locale) {
            ts.validateLocaleAndSetLanguage(commandLine.options.locale, sys, commandLine.errors);
        }
        // If there are any errors due to command line parsing and/or
        // setting up localization, report them and quit.
        if (commandLine.errors.length > 0) {
            commandLine.errors.forEach(reportDiagnostic);
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        if (commandLine.options.init) {
            writeConfigFile(sys, reportDiagnostic, commandLine.options, commandLine.fileNames);
            return sys.exit(ts.ExitStatus.Success);
        }
        if (commandLine.options.version) {
            printVersion(sys);
            return sys.exit(ts.ExitStatus.Success);
        }
        if (commandLine.options.help || commandLine.options.all) {
            printVersion(sys);
            printHelp(sys, getOptionsForHelp(commandLine));
            return sys.exit(ts.ExitStatus.Success);
        }
        if (commandLine.options.watch && commandLine.options.listFilesOnly) {
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Options_0_and_1_cannot_be_combined, "watch", "listFilesOnly"));
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        if (commandLine.options.project) {
            if (commandLine.fileNames.length !== 0) {
                reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Option_project_cannot_be_mixed_with_source_files_on_a_command_line));
                return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
            }
            var fileOrDirectory = ts.normalizePath(commandLine.options.project);
            if (!fileOrDirectory /* current directory "." */ || sys.directoryExists(fileOrDirectory)) {
                configFileName = ts.combinePaths(fileOrDirectory, "tsconfig.json");
                if (!sys.fileExists(configFileName)) {
                    reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Cannot_find_a_tsconfig_json_file_at_the_specified_directory_Colon_0, commandLine.options.project));
                    return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
                }
            }
            else {
                configFileName = fileOrDirectory;
                if (!sys.fileExists(configFileName)) {
                    reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.The_specified_path_does_not_exist_Colon_0, commandLine.options.project));
                    return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
                }
            }
        }
        else if (commandLine.fileNames.length === 0) {
            var searchPath = ts.normalizePath(sys.getCurrentDirectory());
            configFileName = ts.findConfigFile(searchPath, function (fileName) { return sys.fileExists(fileName); });
        }
        if (commandLine.fileNames.length === 0 && !configFileName) {
            if (commandLine.options.showConfig) {
                reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Cannot_find_a_tsconfig_json_file_at_the_current_directory_Colon_0, ts.normalizePath(sys.getCurrentDirectory())));
            }
            else {
                printVersion(sys);
                printHelp(sys, getOptionsForHelp(commandLine));
            }
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        var currentDirectory = sys.getCurrentDirectory();
        var commandLineOptions = ts.convertToOptionsWithAbsolutePaths(commandLine.options, function (fileName) { return ts.getNormalizedAbsolutePath(fileName, currentDirectory); });
        if (configFileName) {
            var configParseResult = ts.parseConfigFileWithSystem(configFileName, commandLineOptions, commandLine.watchOptions, sys, reportDiagnostic); // TODO: GH#18217
            if (commandLineOptions.showConfig) {
                if (configParseResult.errors.length !== 0) {
                    reportDiagnostic = updateReportDiagnostic(sys, reportDiagnostic, configParseResult.options);
                    configParseResult.errors.forEach(reportDiagnostic);
                    return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
                }
                // eslint-disable-next-line no-null/no-null
                sys.write(JSON.stringify(ts.convertToTSConfig(configParseResult, configFileName, sys), null, 4) + sys.newLine);
                return sys.exit(ts.ExitStatus.Success);
            }
            reportDiagnostic = updateReportDiagnostic(sys, reportDiagnostic, configParseResult.options);
            if (ts.isWatchSet(configParseResult.options)) {
                if (reportWatchModeWithoutSysSupport(sys, reportDiagnostic))
                    return;
                return createWatchOfConfigFile(sys, cb, reportDiagnostic, configParseResult, commandLineOptions, commandLine.watchOptions);
            }
            else if (ts.isIncrementalCompilation(configParseResult.options)) {
                performIncrementalCompilation(sys, cb, reportDiagnostic, configParseResult);
            }
            else {
                performCompilation(sys, cb, reportDiagnostic, configParseResult);
            }
        }
        else {
            if (commandLineOptions.showConfig) {
                // eslint-disable-next-line no-null/no-null
                sys.write(JSON.stringify(ts.convertToTSConfig(commandLine, ts.combinePaths(currentDirectory, "tsconfig.json"), sys), null, 4) + sys.newLine);
                return sys.exit(ts.ExitStatus.Success);
            }
            reportDiagnostic = updateReportDiagnostic(sys, reportDiagnostic, commandLineOptions);
            if (ts.isWatchSet(commandLineOptions)) {
                if (reportWatchModeWithoutSysSupport(sys, reportDiagnostic))
                    return;
                return createWatchOfFilesAndCompilerOptions(sys, cb, reportDiagnostic, commandLine.fileNames, commandLineOptions, commandLine.watchOptions);
            }
            else if (ts.isIncrementalCompilation(commandLineOptions)) {
                performIncrementalCompilation(sys, cb, reportDiagnostic, __assign(__assign({}, commandLine), { options: commandLineOptions }));
            }
            else {
                performCompilation(sys, cb, reportDiagnostic, __assign(__assign({}, commandLine), { options: commandLineOptions }));
            }
        }
    }
    function isBuild(commandLineArgs) {
        if (commandLineArgs.length > 0 && commandLineArgs[0].charCodeAt(0) === 45 /* minus */) {
            var firstOption = commandLineArgs[0].slice(commandLineArgs[0].charCodeAt(1) === 45 /* minus */ ? 2 : 1).toLowerCase();
            return firstOption === "build" || firstOption === "b";
        }
        return false;
    }
    ts.isBuild = isBuild;
    function executeCommandLine(system, cb, commandLineArgs) {
        if (isBuild(commandLineArgs)) {
            var _a = ts.parseBuildCommand(commandLineArgs.slice(1)), buildOptions_1 = _a.buildOptions, watchOptions_1 = _a.watchOptions, projects_1 = _a.projects, errors_1 = _a.errors;
            if (buildOptions_1.generateCpuProfile && system.enableCPUProfiler) {
                system.enableCPUProfiler(buildOptions_1.generateCpuProfile, function () { return performBuild(system, cb, buildOptions_1, watchOptions_1, projects_1, errors_1); });
            }
            else {
                return performBuild(system, cb, buildOptions_1, watchOptions_1, projects_1, errors_1);
            }
        }
        var commandLine = ts.parseCommandLine(commandLineArgs, function (path) { return system.readFile(path); });
        if (commandLine.options.generateCpuProfile && system.enableCPUProfiler) {
            system.enableCPUProfiler(commandLine.options.generateCpuProfile, function () { return executeCommandLineWorker(system, cb, commandLine); });
        }
        else {
            return executeCommandLineWorker(system, cb, commandLine);
        }
    }
    ts.executeCommandLine = executeCommandLine;
    function reportWatchModeWithoutSysSupport(sys, reportDiagnostic) {
        if (!sys.watchFile || !sys.watchDirectory) {
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.The_current_host_does_not_support_the_0_option, "--watch"));
            sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
            return true;
        }
        return false;
    }
    function performBuild(sys, cb, buildOptions, watchOptions, projects, errors) {
        // Update to pretty if host supports it
        var reportDiagnostic = updateReportDiagnostic(sys, ts.createDiagnosticReporter(sys), buildOptions);
        if (buildOptions.locale) {
            ts.validateLocaleAndSetLanguage(buildOptions.locale, sys, errors);
        }
        if (errors.length > 0) {
            errors.forEach(reportDiagnostic);
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        if (buildOptions.help) {
            printVersion(sys);
            printHelp(sys, ts.buildOpts, "--build ");
            return sys.exit(ts.ExitStatus.Success);
        }
        if (projects.length === 0) {
            printVersion(sys);
            printHelp(sys, ts.buildOpts, "--build ");
            return sys.exit(ts.ExitStatus.Success);
        }
        if (!sys.getModifiedTime || !sys.setModifiedTime || (buildOptions.clean && !sys.deleteFile)) {
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.The_current_host_does_not_support_the_0_option, "--build"));
            return sys.exit(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
        }
        if (buildOptions.watch) {
            if (reportWatchModeWithoutSysSupport(sys, reportDiagnostic))
                return;
            var buildHost_1 = ts.createSolutionBuilderWithWatchHost(sys, 
            /*createProgram*/ undefined, reportDiagnostic, ts.createBuilderStatusReporter(sys, shouldBePretty(sys, buildOptions)), createWatchStatusReporter(sys, buildOptions));
            updateSolutionBuilderHost(sys, cb, buildHost_1);
            var builder_1 = ts.createSolutionBuilderWithWatch(buildHost_1, projects, buildOptions, watchOptions);
            builder_1.build();
            return builder_1;
        }
        var buildHost = ts.createSolutionBuilderHost(sys, 
        /*createProgram*/ undefined, reportDiagnostic, ts.createBuilderStatusReporter(sys, shouldBePretty(sys, buildOptions)), createReportErrorSummary(sys, buildOptions));
        updateSolutionBuilderHost(sys, cb, buildHost);
        var builder = ts.createSolutionBuilder(buildHost, projects, buildOptions);
        var exitStatus = buildOptions.clean ? builder.clean() : builder.build();
        ts.tracing === null || ts.tracing === void 0 ? void 0 : ts.tracing.dumpLegend();
        return sys.exit(exitStatus);
    }
    function createReportErrorSummary(sys, options) {
        return shouldBePretty(sys, options) ?
            function (errorCount) { return sys.write(ts.getErrorSummaryText(errorCount, sys.newLine)); } :
            undefined;
    }
    function performCompilation(sys, cb, reportDiagnostic, config) {
        var fileNames = config.fileNames, options = config.options, projectReferences = config.projectReferences;
        var host = ts.createCompilerHostWorker(options, /*setParentPos*/ undefined, sys);
        var currentDirectory = host.getCurrentDirectory();
        var getCanonicalFileName = ts.createGetCanonicalFileName(host.useCaseSensitiveFileNames());
        ts.changeCompilerHostLikeToUseCache(host, function (fileName) { return ts.toPath(fileName, currentDirectory, getCanonicalFileName); });
        enableStatisticsAndTracing(sys, options, /*isBuildMode*/ false);
        var programOptions = {
            rootNames: fileNames,
            options: options,
            projectReferences: projectReferences,
            host: host,
            configFileParsingDiagnostics: ts.getConfigFileParsingDiagnostics(config)
        };
        var program = ts.createProgram(programOptions);
        var exitStatus = ts.emitFilesAndReportErrorsAndGetExitStatus(program, reportDiagnostic, function (s) { return sys.write(s + sys.newLine); }, createReportErrorSummary(sys, options));
        reportStatistics(sys, program);
        cb(program);
        return sys.exit(exitStatus);
    }
    function performIncrementalCompilation(sys, cb, reportDiagnostic, config) {
        var options = config.options, fileNames = config.fileNames, projectReferences = config.projectReferences;
        enableStatisticsAndTracing(sys, options, /*isBuildMode*/ false);
        var host = ts.createIncrementalCompilerHost(options, sys);
        var exitStatus = ts.performIncrementalCompilation({
            host: host,
            system: sys,
            rootNames: fileNames,
            options: options,
            configFileParsingDiagnostics: ts.getConfigFileParsingDiagnostics(config),
            projectReferences: projectReferences,
            reportDiagnostic: reportDiagnostic,
            reportErrorSummary: createReportErrorSummary(sys, options),
            afterProgramEmitAndDiagnostics: function (builderProgram) {
                reportStatistics(sys, builderProgram.getProgram());
                cb(builderProgram);
            }
        });
        return sys.exit(exitStatus);
    }
    function updateSolutionBuilderHost(sys, cb, buildHost) {
        updateCreateProgram(sys, buildHost);
        buildHost.afterProgramEmitAndDiagnostics = function (program) {
            reportStatistics(sys, program.getProgram());
            cb(program);
        };
        buildHost.afterEmitBundle = cb;
    }
    function updateCreateProgram(sys, host) {
        var compileUsingBuilder = host.createProgram;
        host.createProgram = function (rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences) {
            ts.Debug.assert(rootNames !== undefined || (options === undefined && !!oldProgram));
            if (options !== undefined) {
                enableStatisticsAndTracing(sys, options, /*isBuildMode*/ true);
            }
            return compileUsingBuilder(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
        };
    }
    function updateWatchCompilationHost(sys, cb, watchCompilerHost) {
        updateCreateProgram(sys, watchCompilerHost);
        var emitFilesUsingBuilder = watchCompilerHost.afterProgramCreate; // TODO: GH#18217
        watchCompilerHost.afterProgramCreate = function (builderProgram) {
            emitFilesUsingBuilder(builderProgram);
            reportStatistics(sys, builderProgram.getProgram());
            cb(builderProgram);
        };
    }
    function createWatchStatusReporter(sys, options) {
        return ts.createWatchStatusReporter(sys, shouldBePretty(sys, options));
    }
    function createWatchOfConfigFile(system, cb, reportDiagnostic, configParseResult, optionsToExtend, watchOptionsToExtend) {
        var watchCompilerHost = ts.createWatchCompilerHostOfConfigFile({
            configFileName: configParseResult.options.configFilePath,
            optionsToExtend: optionsToExtend,
            watchOptionsToExtend: watchOptionsToExtend,
            system: system,
            reportDiagnostic: reportDiagnostic,
            reportWatchStatus: createWatchStatusReporter(system, configParseResult.options)
        });
        updateWatchCompilationHost(system, cb, watchCompilerHost);
        watchCompilerHost.configFileParsingResult = configParseResult;
        return ts.createWatchProgram(watchCompilerHost);
    }
    function createWatchOfFilesAndCompilerOptions(system, cb, reportDiagnostic, rootFiles, options, watchOptions) {
        var watchCompilerHost = ts.createWatchCompilerHostOfFilesAndCompilerOptions({
            rootFiles: rootFiles,
            options: options,
            watchOptions: watchOptions,
            system: system,
            reportDiagnostic: reportDiagnostic,
            reportWatchStatus: createWatchStatusReporter(system, options)
        });
        updateWatchCompilationHost(system, cb, watchCompilerHost);
        return ts.createWatchProgram(watchCompilerHost);
    }
    function canReportDiagnostics(system, compilerOptions) {
        return system === ts.sys && (compilerOptions.diagnostics || compilerOptions.extendedDiagnostics);
    }
    function canTrace(system, compilerOptions) {
        return system === ts.sys && compilerOptions.generateTrace;
    }
    function enableStatisticsAndTracing(system, compilerOptions, isBuildMode) {
        if (canReportDiagnostics(system, compilerOptions)) {
            ts.performance.enable(system);
        }
        if (canTrace(system, compilerOptions)) {
            ts.startTracing(isBuildMode ? 1 /* Build */ : 0 /* Project */, compilerOptions.generateTrace, compilerOptions.configFilePath);
        }
    }
    function reportStatistics(sys, program) {
        var compilerOptions = program.getCompilerOptions();
        if (canTrace(sys, compilerOptions)) {
            ts.tracing === null || ts.tracing === void 0 ? void 0 : ts.tracing.stopTracing(program.getTypeCatalog());
        }
        var statistics;
        if (canReportDiagnostics(sys, compilerOptions)) {
            statistics = [];
            var memoryUsed = sys.getMemoryUsage ? sys.getMemoryUsage() : -1;
            reportCountStatistic("Files", program.getSourceFiles().length);
            var lineCounts = countLines(program);
            var nodeCounts = countNodes(program);
            if (compilerOptions.extendedDiagnostics) {
                for (var _i = 0, _a = ts.arrayFrom(lineCounts.keys()); _i < _a.length; _i++) {
                    var key = _a[_i];
                    reportCountStatistic("Lines of " + key, lineCounts.get(key));
                }
                for (var _b = 0, _c = ts.arrayFrom(nodeCounts.keys()); _b < _c.length; _b++) {
                    var key = _c[_b];
                    reportCountStatistic("Nodes of " + key, nodeCounts.get(key));
                }
            }
            else {
                reportCountStatistic("Lines", ts.reduceLeftIterator(lineCounts.values(), function (sum, count) { return sum + count; }, 0));
                reportCountStatistic("Nodes", ts.reduceLeftIterator(nodeCounts.values(), function (sum, count) { return sum + count; }, 0));
            }
            reportCountStatistic("Identifiers", program.getIdentifierCount());
            reportCountStatistic("Symbols", program.getSymbolCount());
            reportCountStatistic("Types", program.getTypeCount());
            reportCountStatistic("Instantiations", program.getInstantiationCount());
            if (memoryUsed >= 0) {
                reportStatisticalValue("Memory used", Math.round(memoryUsed / 1000) + "K");
            }
            var isPerformanceEnabled = ts.performance.isEnabled();
            var programTime = isPerformanceEnabled ? ts.performance.getDuration("Program") : 0;
            var bindTime = isPerformanceEnabled ? ts.performance.getDuration("Bind") : 0;
            var checkTime = isPerformanceEnabled ? ts.performance.getDuration("Check") : 0;
            var emitTime = isPerformanceEnabled ? ts.performance.getDuration("Emit") : 0;
            if (compilerOptions.extendedDiagnostics) {
                var caches = program.getRelationCacheSizes();
                reportCountStatistic("Assignability cache size", caches.assignable);
                reportCountStatistic("Identity cache size", caches.identity);
                reportCountStatistic("Subtype cache size", caches.subtype);
                reportCountStatistic("Strict subtype cache size", caches.strictSubtype);
                if (isPerformanceEnabled) {
                    ts.performance.forEachMeasure(function (name, duration) { return reportTimeStatistic(name + " time", duration); });
                }
            }
            else if (isPerformanceEnabled) {
                // Individual component times.
                // Note: To match the behavior of previous versions of the compiler, the reported parse time includes
                // I/O read time and processing time for triple-slash references and module imports, and the reported
                // emit time includes I/O write time. We preserve this behavior so we can accurately compare times.
                reportTimeStatistic("I/O read", ts.performance.getDuration("I/O Read"));
                reportTimeStatistic("I/O write", ts.performance.getDuration("I/O Write"));
                reportTimeStatistic("Parse time", programTime);
                reportTimeStatistic("Bind time", bindTime);
                reportTimeStatistic("Check time", checkTime);
                reportTimeStatistic("Emit time", emitTime);
            }
            if (isPerformanceEnabled) {
                reportTimeStatistic("Total time", programTime + bindTime + checkTime + emitTime);
            }
            reportStatistics();
            if (!isPerformanceEnabled) {
                sys.write(ts.Diagnostics.Performance_timings_for_diagnostics_or_extendedDiagnostics_are_not_available_in_this_session_A_native_implementation_of_the_Web_Performance_API_could_not_be_found.message + "\n");
            }
            else {
                ts.performance.disable();
            }
        }
        function reportStatistics() {
            var nameSize = 0;
            var valueSize = 0;
            for (var _i = 0, statistics_1 = statistics; _i < statistics_1.length; _i++) {
                var _a = statistics_1[_i], name = _a.name, value = _a.value;
                if (name.length > nameSize) {
                    nameSize = name.length;
                }
                if (value.length > valueSize) {
                    valueSize = value.length;
                }
            }
            for (var _b = 0, statistics_2 = statistics; _b < statistics_2.length; _b++) {
                var _c = statistics_2[_b], name = _c.name, value = _c.value;
                sys.write(ts.padRight(name + ":", nameSize + 2) + ts.padLeft(value.toString(), valueSize) + sys.newLine);
            }
        }
        function reportStatisticalValue(name, value) {
            statistics.push({ name: name, value: value });
        }
        function reportCountStatistic(name, count) {
            reportStatisticalValue(name, "" + count);
        }
        function reportTimeStatistic(name, time) {
            reportStatisticalValue(name, (time / 1000).toFixed(2) + "s");
        }
    }
    function writeConfigFile(sys, reportDiagnostic, options, fileNames) {
        var currentDirectory = sys.getCurrentDirectory();
        var file = ts.normalizePath(ts.combinePaths(currentDirectory, "tsconfig.json"));
        if (sys.fileExists(file)) {
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.A_tsconfig_json_file_is_already_defined_at_Colon_0, file));
        }
        else {
            sys.writeFile(file, ts.generateTSConfig(options, fileNames, sys.newLine));
            reportDiagnostic(ts.createCompilerDiagnostic(ts.Diagnostics.Successfully_created_a_tsconfig_json_file));
        }
        return;
    }
})(ts || (ts = {}));
//# sourceMappingURL=executeCommandLine.js.map