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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var ts;
(function (ts) {
    var server;
    (function (server) {
        var LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["terse"] = 0] = "terse";
            LogLevel[LogLevel["normal"] = 1] = "normal";
            LogLevel[LogLevel["requestTime"] = 2] = "requestTime";
            LogLevel[LogLevel["verbose"] = 3] = "verbose";
        })(LogLevel = server.LogLevel || (server.LogLevel = {}));
        server.emptyArray = createSortedArray();
        // TODO: Use a const enum (https://github.com/Microsoft/TypeScript/issues/16804)
        var Msg;
        (function (Msg) {
            Msg["Err"] = "Err";
            Msg["Info"] = "Info";
            Msg["Perf"] = "Perf";
        })(Msg = server.Msg || (server.Msg = {}));
        function createInstallTypingsRequest(project, typeAcquisition, unresolvedImports, cachePath) {
            return {
                projectName: project.getProjectName(),
                fileNames: project.getFileNames(/*excludeFilesFromExternalLibraries*/ true, /*excludeConfigFiles*/ true).concat(project.getExcludedFiles()),
                compilerOptions: project.getCompilationSettings(),
                watchOptions: project.projectService.getWatchOptions(project),
                typeAcquisition: typeAcquisition,
                unresolvedImports: unresolvedImports,
                projectRootPath: project.getCurrentDirectory(),
                cachePath: cachePath,
                kind: "discover"
            };
        }
        server.createInstallTypingsRequest = createInstallTypingsRequest;
        var Errors;
        (function (Errors) {
            function ThrowNoProject() {
                throw new Error("No Project.");
            }
            Errors.ThrowNoProject = ThrowNoProject;
            function ThrowProjectLanguageServiceDisabled() {
                throw new Error("The project's language service is disabled.");
            }
            Errors.ThrowProjectLanguageServiceDisabled = ThrowProjectLanguageServiceDisabled;
            function ThrowProjectDoesNotContainDocument(fileName, project) {
                throw new Error("Project '" + project.getProjectName() + "' does not contain document '" + fileName + "'");
            }
            Errors.ThrowProjectDoesNotContainDocument = ThrowProjectDoesNotContainDocument;
        })(Errors = server.Errors || (server.Errors = {}));
        function toNormalizedPath(fileName) {
            return ts.normalizePath(fileName);
        }
        server.toNormalizedPath = toNormalizedPath;
        function normalizedPathToPath(normalizedPath, currentDirectory, getCanonicalFileName) {
            var f = ts.isRootedDiskPath(normalizedPath) ? normalizedPath : ts.getNormalizedAbsolutePath(normalizedPath, currentDirectory);
            return getCanonicalFileName(f);
        }
        server.normalizedPathToPath = normalizedPathToPath;
        function asNormalizedPath(fileName) {
            return fileName;
        }
        server.asNormalizedPath = asNormalizedPath;
        function createNormalizedPathMap() {
            var map = new ts.Map();
            return {
                get: function (path) {
                    return map.get(path);
                },
                set: function (path, value) {
                    map.set(path, value);
                },
                contains: function (path) {
                    return map.has(path);
                },
                remove: function (path) {
                    map.delete(path);
                }
            };
        }
        server.createNormalizedPathMap = createNormalizedPathMap;
        function isInferredProjectName(name) {
            // POSIX defines /dev/null as a device - there should be no file with this prefix
            return /dev\/null\/inferredProject\d+\*/.test(name);
        }
        server.isInferredProjectName = isInferredProjectName;
        function makeInferredProjectName(counter) {
            return "/dev/null/inferredProject" + counter + "*";
        }
        server.makeInferredProjectName = makeInferredProjectName;
        /*@internal*/
        function makeAutoImportProviderProjectName(counter) {
            return "/dev/null/autoImportProviderProject" + counter + "*";
        }
        server.makeAutoImportProviderProjectName = makeAutoImportProviderProjectName;
        function createSortedArray() {
            return []; // TODO: GH#19873
        }
        server.createSortedArray = createSortedArray;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
/* @internal */
var ts;
(function (ts) {
    var server;
    (function (server) {
        var ThrottledOperations = /** @class */ (function () {
            function ThrottledOperations(host, logger) {
                this.host = host;
                this.pendingTimeouts = new ts.Map();
                this.logger = logger.hasLevel(server.LogLevel.verbose) ? logger : undefined;
            }
            /**
             * Wait `number` milliseconds and then invoke `cb`.  If, while waiting, schedule
             * is called again with the same `operationId`, cancel this operation in favor
             * of the new one.  (Note that the amount of time the canceled operation had been
             * waiting does not affect the amount of time that the new operation waits.)
             */
            ThrottledOperations.prototype.schedule = function (operationId, delay, cb) {
                var pendingTimeout = this.pendingTimeouts.get(operationId);
                if (pendingTimeout) {
                    // another operation was already scheduled for this id - cancel it
                    this.host.clearTimeout(pendingTimeout);
                }
                // schedule new operation, pass arguments
                this.pendingTimeouts.set(operationId, this.host.setTimeout(ThrottledOperations.run, delay, this, operationId, cb));
                if (this.logger) {
                    this.logger.info("Scheduled: " + operationId + (pendingTimeout ? ", Cancelled earlier one" : ""));
                }
            };
            ThrottledOperations.prototype.cancel = function (operationId) {
                var pendingTimeout = this.pendingTimeouts.get(operationId);
                if (!pendingTimeout)
                    return false;
                this.host.clearTimeout(pendingTimeout);
                return this.pendingTimeouts.delete(operationId);
            };
            ThrottledOperations.run = function (self, operationId, cb) {
                ts.perfLogger.logStartScheduledOperation(operationId);
                self.pendingTimeouts.delete(operationId);
                if (self.logger) {
                    self.logger.info("Running: " + operationId);
                }
                cb();
                ts.perfLogger.logStopScheduledOperation();
            };
            return ThrottledOperations;
        }());
        server.ThrottledOperations = ThrottledOperations;
        var GcTimer = /** @class */ (function () {
            function GcTimer(host, delay, logger) {
                this.host = host;
                this.delay = delay;
                this.logger = logger;
            }
            GcTimer.prototype.scheduleCollect = function () {
                if (!this.host.gc || this.timerId !== undefined) {
                    // no global.gc or collection was already scheduled - skip this request
                    return;
                }
                this.timerId = this.host.setTimeout(GcTimer.run, this.delay, this);
            };
            GcTimer.run = function (self) {
                self.timerId = undefined;
                ts.perfLogger.logStartScheduledOperation("GC collect");
                var log = self.logger.hasLevel(server.LogLevel.requestTime);
                var before = log && self.host.getMemoryUsage(); // TODO: GH#18217
                self.host.gc(); // TODO: GH#18217
                if (log) {
                    var after = self.host.getMemoryUsage(); // TODO: GH#18217
                    self.logger.perftrc("GC::before " + before + ", after " + after);
                }
                ts.perfLogger.logStopScheduledOperation();
            };
            return GcTimer;
        }());
        server.GcTimer = GcTimer;
        function getBaseConfigFileName(configFilePath) {
            var base = ts.getBaseFileName(configFilePath);
            return base === "tsconfig.json" || base === "jsconfig.json" ? base : undefined;
        }
        server.getBaseConfigFileName = getBaseConfigFileName;
        function removeSorted(array, remove, compare) {
            if (!array || array.length === 0) {
                return;
            }
            if (array[0] === remove) {
                array.splice(0, 1);
                return;
            }
            var removeIndex = ts.binarySearch(array, remove, ts.identity, compare);
            if (removeIndex >= 0) {
                array.splice(removeIndex, 1);
            }
        }
        server.removeSorted = removeSorted;
        var indentStr = "\n    ";
        function indent(str) {
            return indentStr + str.replace(/\n/g, indentStr);
        }
        server.indent = indent;
        /** Put stringified JSON on the next line, indented. */
        function stringifyIndented(json) {
            return indentStr + JSON.stringify(json);
        }
        server.stringifyIndented = stringifyIndented;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
/* @internal */
var ts;
(function (ts) {
    ts.WatchType.ClosedScriptInfo = "Closed Script info";
    ts.WatchType.ConfigFileForInferredRoot = "Config file for the inferred project root";
    ts.WatchType.NodeModulesForClosedScriptInfo = "node_modules for closed script infos in them";
    ts.WatchType.MissingSourceMapFile = "Missing source map file";
    ts.WatchType.NoopConfigFileForInferredRoot = "Noop Config file for the inferred project root";
    ts.WatchType.MissingGeneratedFile = "Missing generated file";
    ts.WatchType.PackageJsonFile = "package.json file for import suggestions";
})(ts || (ts = {}));
/* eslint-disable @typescript-eslint/no-unnecessary-qualifier */
/**
 * Declaration module describing the TypeScript Server protocol
 */
var ts;
(function (ts) {
    var server;
    (function (server) {
        var protocol;
        (function (protocol) {
            // NOTE: If updating this, be sure to also update `allCommandNames` in `testRunner/unittests/tsserver/session.ts`.
            var CommandTypes;
            (function (CommandTypes) {
                CommandTypes["JsxClosingTag"] = "jsxClosingTag";
                CommandTypes["Brace"] = "brace";
                /* @internal */
                CommandTypes["BraceFull"] = "brace-full";
                CommandTypes["BraceCompletion"] = "braceCompletion";
                CommandTypes["GetSpanOfEnclosingComment"] = "getSpanOfEnclosingComment";
                CommandTypes["Change"] = "change";
                CommandTypes["Close"] = "close";
                /** @deprecated Prefer CompletionInfo -- see comment on CompletionsResponse */
                CommandTypes["Completions"] = "completions";
                CommandTypes["CompletionInfo"] = "completionInfo";
                /* @internal */
                CommandTypes["CompletionsFull"] = "completions-full";
                CommandTypes["CompletionDetails"] = "completionEntryDetails";
                /* @internal */
                CommandTypes["CompletionDetailsFull"] = "completionEntryDetails-full";
                CommandTypes["CompileOnSaveAffectedFileList"] = "compileOnSaveAffectedFileList";
                CommandTypes["CompileOnSaveEmitFile"] = "compileOnSaveEmitFile";
                CommandTypes["Configure"] = "configure";
                CommandTypes["Definition"] = "definition";
                /* @internal */
                CommandTypes["DefinitionFull"] = "definition-full";
                CommandTypes["DefinitionAndBoundSpan"] = "definitionAndBoundSpan";
                /* @internal */
                CommandTypes["DefinitionAndBoundSpanFull"] = "definitionAndBoundSpan-full";
                CommandTypes["Implementation"] = "implementation";
                /* @internal */
                CommandTypes["ImplementationFull"] = "implementation-full";
                /* @internal */
                CommandTypes["EmitOutput"] = "emit-output";
                CommandTypes["Exit"] = "exit";
                CommandTypes["Format"] = "format";
                CommandTypes["Formatonkey"] = "formatonkey";
                /* @internal */
                CommandTypes["FormatFull"] = "format-full";
                /* @internal */
                CommandTypes["FormatonkeyFull"] = "formatonkey-full";
                /* @internal */
                CommandTypes["FormatRangeFull"] = "formatRange-full";
                CommandTypes["Geterr"] = "geterr";
                CommandTypes["GeterrForProject"] = "geterrForProject";
                CommandTypes["SemanticDiagnosticsSync"] = "semanticDiagnosticsSync";
                CommandTypes["SyntacticDiagnosticsSync"] = "syntacticDiagnosticsSync";
                CommandTypes["SuggestionDiagnosticsSync"] = "suggestionDiagnosticsSync";
                CommandTypes["NavBar"] = "navbar";
                /* @internal */
                CommandTypes["NavBarFull"] = "navbar-full";
                CommandTypes["Navto"] = "navto";
                /* @internal */
                CommandTypes["NavtoFull"] = "navto-full";
                CommandTypes["NavTree"] = "navtree";
                CommandTypes["NavTreeFull"] = "navtree-full";
                /** @deprecated */
                CommandTypes["Occurrences"] = "occurrences";
                CommandTypes["DocumentHighlights"] = "documentHighlights";
                /* @internal */
                CommandTypes["DocumentHighlightsFull"] = "documentHighlights-full";
                CommandTypes["Open"] = "open";
                CommandTypes["Quickinfo"] = "quickinfo";
                /* @internal */
                CommandTypes["QuickinfoFull"] = "quickinfo-full";
                CommandTypes["References"] = "references";
                /* @internal */
                CommandTypes["ReferencesFull"] = "references-full";
                CommandTypes["Reload"] = "reload";
                CommandTypes["Rename"] = "rename";
                /* @internal */
                CommandTypes["RenameInfoFull"] = "rename-full";
                /* @internal */
                CommandTypes["RenameLocationsFull"] = "renameLocations-full";
                CommandTypes["Saveto"] = "saveto";
                CommandTypes["SignatureHelp"] = "signatureHelp";
                /* @internal */
                CommandTypes["SignatureHelpFull"] = "signatureHelp-full";
                CommandTypes["Status"] = "status";
                CommandTypes["TypeDefinition"] = "typeDefinition";
                CommandTypes["ProjectInfo"] = "projectInfo";
                CommandTypes["ReloadProjects"] = "reloadProjects";
                CommandTypes["Unknown"] = "unknown";
                CommandTypes["OpenExternalProject"] = "openExternalProject";
                CommandTypes["OpenExternalProjects"] = "openExternalProjects";
                CommandTypes["CloseExternalProject"] = "closeExternalProject";
                /* @internal */
                CommandTypes["SynchronizeProjectList"] = "synchronizeProjectList";
                /* @internal */
                CommandTypes["ApplyChangedToOpenFiles"] = "applyChangedToOpenFiles";
                CommandTypes["UpdateOpen"] = "updateOpen";
                /* @internal */
                CommandTypes["EncodedSyntacticClassificationsFull"] = "encodedSyntacticClassifications-full";
                /* @internal */
                CommandTypes["EncodedSemanticClassificationsFull"] = "encodedSemanticClassifications-full";
                /* @internal */
                CommandTypes["Cleanup"] = "cleanup";
                CommandTypes["GetOutliningSpans"] = "getOutliningSpans";
                /* @internal */
                CommandTypes["GetOutliningSpansFull"] = "outliningSpans";
                CommandTypes["TodoComments"] = "todoComments";
                CommandTypes["Indentation"] = "indentation";
                CommandTypes["DocCommentTemplate"] = "docCommentTemplate";
                /* @internal */
                CommandTypes["CompilerOptionsDiagnosticsFull"] = "compilerOptionsDiagnostics-full";
                /* @internal */
                CommandTypes["NameOrDottedNameSpan"] = "nameOrDottedNameSpan";
                /* @internal */
                CommandTypes["BreakpointStatement"] = "breakpointStatement";
                CommandTypes["CompilerOptionsForInferredProjects"] = "compilerOptionsForInferredProjects";
                CommandTypes["GetCodeFixes"] = "getCodeFixes";
                /* @internal */
                CommandTypes["GetCodeFixesFull"] = "getCodeFixes-full";
                CommandTypes["GetCombinedCodeFix"] = "getCombinedCodeFix";
                /* @internal */
                CommandTypes["GetCombinedCodeFixFull"] = "getCombinedCodeFix-full";
                CommandTypes["ApplyCodeActionCommand"] = "applyCodeActionCommand";
                CommandTypes["GetSupportedCodeFixes"] = "getSupportedCodeFixes";
                CommandTypes["GetApplicableRefactors"] = "getApplicableRefactors";
                CommandTypes["GetEditsForRefactor"] = "getEditsForRefactor";
                /* @internal */
                CommandTypes["GetEditsForRefactorFull"] = "getEditsForRefactor-full";
                CommandTypes["OrganizeImports"] = "organizeImports";
                /* @internal */
                CommandTypes["OrganizeImportsFull"] = "organizeImports-full";
                CommandTypes["GetEditsForFileRename"] = "getEditsForFileRename";
                /* @internal */
                CommandTypes["GetEditsForFileRenameFull"] = "getEditsForFileRename-full";
                CommandTypes["ConfigurePlugin"] = "configurePlugin";
                CommandTypes["SelectionRange"] = "selectionRange";
                /* @internal */
                CommandTypes["SelectionRangeFull"] = "selectionRange-full";
                CommandTypes["ToggleLineComment"] = "toggleLineComment";
                /* @internal */
                CommandTypes["ToggleLineCommentFull"] = "toggleLineComment-full";
                CommandTypes["ToggleMultilineComment"] = "toggleMultilineComment";
                /* @internal */
                CommandTypes["ToggleMultilineCommentFull"] = "toggleMultilineComment-full";
                CommandTypes["CommentSelection"] = "commentSelection";
                /* @internal */
                CommandTypes["CommentSelectionFull"] = "commentSelection-full";
                CommandTypes["UncommentSelection"] = "uncommentSelection";
                /* @internal */
                CommandTypes["UncommentSelectionFull"] = "uncommentSelection-full";
                CommandTypes["PrepareCallHierarchy"] = "prepareCallHierarchy";
                CommandTypes["ProvideCallHierarchyIncomingCalls"] = "provideCallHierarchyIncomingCalls";
                CommandTypes["ProvideCallHierarchyOutgoingCalls"] = "provideCallHierarchyOutgoingCalls";
                // NOTE: If updating this, be sure to also update `allCommandNames` in `testRunner/unittests/tsserver/session.ts`.
            })(CommandTypes = protocol.CommandTypes || (protocol.CommandTypes = {}));
            var WatchFileKind;
            (function (WatchFileKind) {
                WatchFileKind["FixedPollingInterval"] = "FixedPollingInterval";
                WatchFileKind["PriorityPollingInterval"] = "PriorityPollingInterval";
                WatchFileKind["DynamicPriorityPolling"] = "DynamicPriorityPolling";
                WatchFileKind["UseFsEvents"] = "UseFsEvents";
                WatchFileKind["UseFsEventsOnParentDirectory"] = "UseFsEventsOnParentDirectory";
            })(WatchFileKind = protocol.WatchFileKind || (protocol.WatchFileKind = {}));
            var WatchDirectoryKind;
            (function (WatchDirectoryKind) {
                WatchDirectoryKind["UseFsEvents"] = "UseFsEvents";
                WatchDirectoryKind["FixedPollingInterval"] = "FixedPollingInterval";
                WatchDirectoryKind["DynamicPriorityPolling"] = "DynamicPriorityPolling";
            })(WatchDirectoryKind = protocol.WatchDirectoryKind || (protocol.WatchDirectoryKind = {}));
            var PollingWatchKind;
            (function (PollingWatchKind) {
                PollingWatchKind["FixedInterval"] = "FixedInterval";
                PollingWatchKind["PriorityInterval"] = "PriorityInterval";
                PollingWatchKind["DynamicPriority"] = "DynamicPriority";
            })(PollingWatchKind = protocol.PollingWatchKind || (protocol.PollingWatchKind = {}));
            var IndentStyle;
            (function (IndentStyle) {
                IndentStyle["None"] = "None";
                IndentStyle["Block"] = "Block";
                IndentStyle["Smart"] = "Smart";
            })(IndentStyle = protocol.IndentStyle || (protocol.IndentStyle = {}));
            var SemicolonPreference;
            (function (SemicolonPreference) {
                SemicolonPreference["Ignore"] = "ignore";
                SemicolonPreference["Insert"] = "insert";
                SemicolonPreference["Remove"] = "remove";
            })(SemicolonPreference = protocol.SemicolonPreference || (protocol.SemicolonPreference = {}));
            var JsxEmit;
            (function (JsxEmit) {
                JsxEmit["None"] = "None";
                JsxEmit["Preserve"] = "Preserve";
                JsxEmit["ReactNative"] = "ReactNative";
                JsxEmit["React"] = "React";
            })(JsxEmit = protocol.JsxEmit || (protocol.JsxEmit = {}));
            var ModuleKind;
            (function (ModuleKind) {
                ModuleKind["None"] = "None";
                ModuleKind["CommonJS"] = "CommonJS";
                ModuleKind["AMD"] = "AMD";
                ModuleKind["UMD"] = "UMD";
                ModuleKind["System"] = "System";
                ModuleKind["ES6"] = "ES6";
                ModuleKind["ES2015"] = "ES2015";
                ModuleKind["ESNext"] = "ESNext";
            })(ModuleKind = protocol.ModuleKind || (protocol.ModuleKind = {}));
            var ModuleResolutionKind;
            (function (ModuleResolutionKind) {
                ModuleResolutionKind["Classic"] = "Classic";
                ModuleResolutionKind["Node"] = "Node";
            })(ModuleResolutionKind = protocol.ModuleResolutionKind || (protocol.ModuleResolutionKind = {}));
            var NewLineKind;
            (function (NewLineKind) {
                NewLineKind["Crlf"] = "Crlf";
                NewLineKind["Lf"] = "Lf";
            })(NewLineKind = protocol.NewLineKind || (protocol.NewLineKind = {}));
            var ScriptTarget;
            (function (ScriptTarget) {
                ScriptTarget["ES3"] = "ES3";
                ScriptTarget["ES5"] = "ES5";
                ScriptTarget["ES6"] = "ES6";
                ScriptTarget["ES2015"] = "ES2015";
                ScriptTarget["ES2016"] = "ES2016";
                ScriptTarget["ES2017"] = "ES2017";
                ScriptTarget["ES2018"] = "ES2018";
                ScriptTarget["ES2019"] = "ES2019";
                ScriptTarget["ES2020"] = "ES2020";
                ScriptTarget["ESNext"] = "ESNext";
            })(ScriptTarget = protocol.ScriptTarget || (protocol.ScriptTarget = {}));
        })(protocol = server.protocol || (server.protocol = {}));
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        /* @internal */
        var TextStorage = /** @class */ (function () {
            function TextStorage(host, info, initialVersion) {
                this.host = host;
                this.info = info;
                /**
                 * True if the text is for the file thats open in the editor
                 */
                this.isOpen = false;
                /**
                 * True if the text present is the text from the file on the disk
                 */
                this.ownFileText = false;
                /**
                 * True when reloading contents of file from the disk is pending
                 */
                this.pendingReloadFromDisk = false;
                this.version = initialVersion || { svc: 0, text: 0 };
            }
            TextStorage.prototype.getVersion = function () {
                return this.svc
                    ? "SVC-" + this.version.svc + "-" + this.svc.getSnapshotVersion()
                    : "Text-" + this.version.text;
            };
            TextStorage.prototype.hasScriptVersionCache_TestOnly = function () {
                return this.svc !== undefined;
            };
            TextStorage.prototype.useScriptVersionCache_TestOnly = function () {
                this.switchToScriptVersionCache();
            };
            TextStorage.prototype.resetSourceMapInfo = function () {
                this.info.sourceFileLike = undefined;
                this.info.closeSourceMapFileWatcher();
                this.info.sourceMapFilePath = undefined;
                this.info.declarationInfoPath = undefined;
                this.info.sourceInfos = undefined;
                this.info.documentPositionMapper = undefined;
            };
            /** Public for testing */
            TextStorage.prototype.useText = function (newText) {
                this.svc = undefined;
                this.text = newText;
                this.lineMap = undefined;
                this.fileSize = undefined;
                this.resetSourceMapInfo();
                this.version.text++;
            };
            TextStorage.prototype.edit = function (start, end, newText) {
                this.switchToScriptVersionCache().edit(start, end - start, newText);
                this.ownFileText = false;
                this.text = undefined;
                this.lineMap = undefined;
                this.fileSize = undefined;
                this.resetSourceMapInfo();
            };
            /**
             * Set the contents as newText
             * returns true if text changed
             */
            TextStorage.prototype.reload = function (newText) {
                ts.Debug.assert(newText !== undefined);
                // Reload always has fresh content
                this.pendingReloadFromDisk = false;
                // If text changed set the text
                // This also ensures that if we had switched to version cache,
                // we are switching back to text.
                // The change to version cache will happen when needed
                // Thus avoiding the computation if there are no changes
                if (this.text !== newText) {
                    this.useText(newText);
                    // We cant guarantee new text is own file text
                    this.ownFileText = false;
                    return true;
                }
                return false;
            };
            /**
             * Reads the contents from tempFile(if supplied) or own file and sets it as contents
             * returns true if text changed
             */
            TextStorage.prototype.reloadWithFileText = function (tempFileName) {
                var _a = this.getFileTextAndSize(tempFileName), newText = _a.text, fileSize = _a.fileSize;
                var reloaded = this.reload(newText);
                this.fileSize = fileSize; // NB: after reload since reload clears it
                this.ownFileText = !tempFileName || tempFileName === this.info.fileName;
                return reloaded;
            };
            /**
             * Reloads the contents from the file if there is no pending reload from disk or the contents of file are same as file text
             * returns true if text changed
             */
            TextStorage.prototype.reloadFromDisk = function () {
                if (!this.pendingReloadFromDisk && !this.ownFileText) {
                    return this.reloadWithFileText();
                }
                return false;
            };
            TextStorage.prototype.delayReloadFromFileIntoText = function () {
                this.pendingReloadFromDisk = true;
            };
            /**
             * For telemetry purposes, we would like to be able to report the size of the file.
             * However, we do not want telemetry to require extra file I/O so we report a size
             * that may be stale (e.g. may not reflect change made on disk since the last reload).
             * NB: Will read from disk if the file contents have never been loaded because
             * telemetry falsely indicating size 0 would be counter-productive.
             */
            TextStorage.prototype.getTelemetryFileSize = function () {
                return !!this.fileSize
                    ? this.fileSize
                    : !!this.text // Check text before svc because its length is cheaper
                        ? this.text.length // Could be wrong if this.pendingReloadFromDisk
                        : !!this.svc
                            ? this.svc.getSnapshot().getLength() // Could be wrong if this.pendingReloadFromDisk
                            : this.getSnapshot().getLength(); // Should be strictly correct
            };
            TextStorage.prototype.getSnapshot = function () {
                return this.useScriptVersionCacheIfValidOrOpen()
                    ? this.svc.getSnapshot()
                    : ts.ScriptSnapshot.fromString(this.getOrLoadText());
            };
            TextStorage.prototype.getAbsolutePositionAndLineText = function (line) {
                return this.switchToScriptVersionCache().getAbsolutePositionAndLineText(line);
            };
            /**
             *  @param line 0 based index
             */
            TextStorage.prototype.lineToTextSpan = function (line) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    var lineMap = this.getLineMap();
                    var start = lineMap[line]; // -1 since line is 1-based
                    var end = line + 1 < lineMap.length ? lineMap[line + 1] : this.text.length;
                    return ts.createTextSpanFromBounds(start, end);
                }
                return this.svc.lineToTextSpan(line);
            };
            /**
             * @param line 1 based index
             * @param offset 1 based index
             */
            TextStorage.prototype.lineOffsetToPosition = function (line, offset, allowEdits) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    return ts.computePositionOfLineAndCharacter(this.getLineMap(), line - 1, offset - 1, this.text, allowEdits);
                }
                // TODO: assert this offset is actually on the line
                return this.svc.lineOffsetToPosition(line, offset);
            };
            TextStorage.prototype.positionToLineOffset = function (position) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    var _a = ts.computeLineAndCharacterOfPosition(this.getLineMap(), position), line = _a.line, character = _a.character;
                    return { line: line + 1, offset: character + 1 };
                }
                return this.svc.positionToLineOffset(position);
            };
            TextStorage.prototype.getFileTextAndSize = function (tempFileName) {
                var _this = this;
                var text;
                var fileName = tempFileName || this.info.fileName;
                var getText = function () { return text === undefined ? (text = _this.host.readFile(fileName) || "") : text; };
                // Only non typescript files have size limitation
                if (!ts.hasTSFileExtension(this.info.fileName)) {
                    var fileSize = this.host.getFileSize ? this.host.getFileSize(fileName) : getText().length;
                    if (fileSize > server.maxFileSize) {
                        ts.Debug.assert(!!this.info.containingProjects.length);
                        var service = this.info.containingProjects[0].projectService;
                        service.logger.info("Skipped loading contents of large file " + fileName + " for info " + this.info.fileName + ": fileSize: " + fileSize);
                        this.info.containingProjects[0].projectService.sendLargeFileReferencedEvent(fileName, fileSize);
                        return { text: "", fileSize: fileSize };
                    }
                }
                return { text: getText() };
            };
            TextStorage.prototype.switchToScriptVersionCache = function () {
                if (!this.svc || this.pendingReloadFromDisk) {
                    this.svc = server.ScriptVersionCache.fromString(this.getOrLoadText());
                    this.version.svc++;
                }
                return this.svc;
            };
            TextStorage.prototype.useScriptVersionCacheIfValidOrOpen = function () {
                // If this is open script, use the cache
                if (this.isOpen) {
                    return this.switchToScriptVersionCache();
                }
                // If there is pending reload from the disk then, reload the text
                if (this.pendingReloadFromDisk) {
                    this.reloadWithFileText();
                }
                // At this point if svc is present its valid
                return this.svc;
            };
            TextStorage.prototype.getOrLoadText = function () {
                if (this.text === undefined || this.pendingReloadFromDisk) {
                    ts.Debug.assert(!this.svc || this.pendingReloadFromDisk, "ScriptVersionCache should not be set when reloading from disk");
                    this.reloadWithFileText();
                }
                return this.text;
            };
            TextStorage.prototype.getLineMap = function () {
                ts.Debug.assert(!this.svc, "ScriptVersionCache should not be set");
                return this.lineMap || (this.lineMap = ts.computeLineStarts(this.getOrLoadText()));
            };
            TextStorage.prototype.getLineInfo = function () {
                var _this = this;
                if (this.svc) {
                    return {
                        getLineCount: function () { return _this.svc.getLineCount(); },
                        getLineText: function (line) { return _this.svc.getAbsolutePositionAndLineText(line + 1).lineText; }
                    };
                }
                var lineMap = this.getLineMap();
                return ts.getLineInfo(this.text, lineMap);
            };
            return TextStorage;
        }());
        server.TextStorage = TextStorage;
        function isDynamicFileName(fileName) {
            return fileName[0] === "^" ||
                ((ts.stringContains(fileName, "walkThroughSnippet:/") || ts.stringContains(fileName, "untitled:/")) &&
                    ts.getBaseFileName(fileName)[0] === "^") ||
                (ts.stringContains(fileName, ":^") && !ts.stringContains(fileName, ts.directorySeparator));
        }
        server.isDynamicFileName = isDynamicFileName;
        var ScriptInfo = /** @class */ (function () {
            function ScriptInfo(host, fileName, scriptKind, hasMixedContent, path, initialVersion) {
                this.host = host;
                this.fileName = fileName;
                this.scriptKind = scriptKind;
                this.hasMixedContent = hasMixedContent;
                this.path = path;
                /**
                 * All projects that include this file
                 */
                this.containingProjects = [];
                this.isDynamic = isDynamicFileName(fileName);
                this.textStorage = new TextStorage(host, this, initialVersion);
                if (hasMixedContent || this.isDynamic) {
                    this.textStorage.reload("");
                    this.realpath = this.path;
                }
                this.scriptKind = scriptKind
                    ? scriptKind
                    : ts.getScriptKindFromFileName(fileName);
            }
            /*@internal*/
            ScriptInfo.prototype.getVersion = function () {
                return this.textStorage.version;
            };
            /*@internal*/
            ScriptInfo.prototype.getTelemetryFileSize = function () {
                return this.textStorage.getTelemetryFileSize();
            };
            /*@internal*/
            ScriptInfo.prototype.isDynamicOrHasMixedContent = function () {
                return this.hasMixedContent || this.isDynamic;
            };
            ScriptInfo.prototype.isScriptOpen = function () {
                return this.textStorage.isOpen;
            };
            ScriptInfo.prototype.open = function (newText) {
                this.textStorage.isOpen = true;
                if (newText !== undefined &&
                    this.textStorage.reload(newText)) {
                    // reload new contents only if the existing contents changed
                    this.markContainingProjectsAsDirty();
                }
            };
            ScriptInfo.prototype.close = function (fileExists) {
                if (fileExists === void 0) { fileExists = true; }
                this.textStorage.isOpen = false;
                if (this.isDynamicOrHasMixedContent() || !fileExists) {
                    if (this.textStorage.reload("")) {
                        this.markContainingProjectsAsDirty();
                    }
                }
                else if (this.textStorage.reloadFromDisk()) {
                    this.markContainingProjectsAsDirty();
                }
            };
            ScriptInfo.prototype.getSnapshot = function () {
                return this.textStorage.getSnapshot();
            };
            ScriptInfo.prototype.ensureRealPath = function () {
                if (this.realpath === undefined) {
                    // Default is just the path
                    this.realpath = this.path;
                    if (this.host.realpath) {
                        ts.Debug.assert(!!this.containingProjects.length);
                        var project = this.containingProjects[0];
                        var realpath = this.host.realpath(this.path);
                        if (realpath) {
                            this.realpath = project.toPath(realpath);
                            // If it is different from this.path, add to the map
                            if (this.realpath !== this.path) {
                                project.projectService.realpathToScriptInfos.add(this.realpath, this); // TODO: GH#18217
                            }
                        }
                    }
                }
            };
            /*@internal*/
            ScriptInfo.prototype.getRealpathIfDifferent = function () {
                return this.realpath && this.realpath !== this.path ? this.realpath : undefined;
            };
            ScriptInfo.prototype.getFormatCodeSettings = function () { return this.formatSettings; };
            ScriptInfo.prototype.getPreferences = function () { return this.preferences; };
            ScriptInfo.prototype.attachToProject = function (project) {
                var isNew = !this.isAttached(project);
                if (isNew) {
                    this.containingProjects.push(project);
                    project.onFileAddedOrRemoved();
                    if (!project.getCompilerOptions().preserveSymlinks) {
                        this.ensureRealPath();
                    }
                }
                return isNew;
            };
            ScriptInfo.prototype.isAttached = function (project) {
                // unrolled for common cases
                switch (this.containingProjects.length) {
                    case 0: return false;
                    case 1: return this.containingProjects[0] === project;
                    case 2: return this.containingProjects[0] === project || this.containingProjects[1] === project;
                    default: return ts.contains(this.containingProjects, project);
                }
            };
            ScriptInfo.prototype.detachFromProject = function (project) {
                // unrolled for common cases
                switch (this.containingProjects.length) {
                    case 0:
                        return;
                    case 1:
                        if (this.containingProjects[0] === project) {
                            project.onFileAddedOrRemoved();
                            this.containingProjects.pop();
                        }
                        break;
                    case 2:
                        if (this.containingProjects[0] === project) {
                            project.onFileAddedOrRemoved();
                            this.containingProjects[0] = this.containingProjects.pop();
                        }
                        else if (this.containingProjects[1] === project) {
                            project.onFileAddedOrRemoved();
                            this.containingProjects.pop();
                        }
                        break;
                    default:
                        if (ts.unorderedRemoveItem(this.containingProjects, project)) {
                            project.onFileAddedOrRemoved();
                        }
                        break;
                }
            };
            ScriptInfo.prototype.detachAllProjects = function () {
                for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    if (server.isConfiguredProject(p)) {
                        p.getCachedDirectoryStructureHost().addOrDeleteFile(this.fileName, this.path, ts.FileWatcherEventKind.Deleted);
                    }
                    var existingRoot = p.getRootFilesMap().get(this.path);
                    // detach is unnecessary since we'll clean the list of containing projects anyways
                    p.removeFile(this, /*fileExists*/ false, /*detachFromProjects*/ false);
                    // If the info was for the external or configured project's root,
                    // add missing file as the root
                    if (existingRoot && !server.isInferredProject(p)) {
                        p.addMissingFileRoot(existingRoot.fileName);
                    }
                }
                ts.clear(this.containingProjects);
            };
            ScriptInfo.prototype.getDefaultProject = function () {
                switch (this.containingProjects.length) {
                    case 0:
                        return server.Errors.ThrowNoProject();
                    case 1:
                        return ensureNotAutoImportProvider(this.containingProjects[0]);
                    default:
                        // If this file belongs to multiple projects, below is the order in which default project is used
                        // - for open script info, its default configured project during opening is default if info is part of it
                        // - first configured project of which script info is not a source of project reference redirect
                        // - first configured project
                        // - first external project
                        // - first inferred project
                        var firstExternalProject = void 0;
                        var firstConfiguredProject = void 0;
                        var firstInferredProject = void 0;
                        var firstNonSourceOfProjectReferenceRedirect = void 0;
                        var defaultConfiguredProject = void 0;
                        for (var index = 0; index < this.containingProjects.length; index++) {
                            var project = this.containingProjects[index];
                            if (server.isConfiguredProject(project)) {
                                if (!project.isSourceOfProjectReferenceRedirect(this.fileName)) {
                                    // If we havent found default configuredProject and
                                    // its not the last one, find it and use that one if there
                                    if (defaultConfiguredProject === undefined &&
                                        index !== this.containingProjects.length - 1) {
                                        defaultConfiguredProject = project.projectService.findDefaultConfiguredProject(this) || false;
                                    }
                                    if (defaultConfiguredProject === project)
                                        return project;
                                    if (!firstNonSourceOfProjectReferenceRedirect)
                                        firstNonSourceOfProjectReferenceRedirect = project;
                                }
                                if (!firstConfiguredProject)
                                    firstConfiguredProject = project;
                            }
                            else if (!firstExternalProject && server.isExternalProject(project)) {
                                firstExternalProject = project;
                            }
                            else if (!firstInferredProject && server.isInferredProject(project)) {
                                firstInferredProject = project;
                            }
                        }
                        return ensureNotAutoImportProvider(defaultConfiguredProject ||
                            firstNonSourceOfProjectReferenceRedirect ||
                            firstConfiguredProject ||
                            firstExternalProject ||
                            firstInferredProject);
                }
            };
            ScriptInfo.prototype.registerFileUpdate = function () {
                for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    p.registerFileUpdate(this.path);
                }
            };
            ScriptInfo.prototype.setOptions = function (formatSettings, preferences) {
                if (formatSettings) {
                    if (!this.formatSettings) {
                        this.formatSettings = ts.getDefaultFormatCodeSettings(this.host.newLine);
                        ts.assign(this.formatSettings, formatSettings);
                    }
                    else {
                        this.formatSettings = __assign(__assign({}, this.formatSettings), formatSettings);
                    }
                }
                if (preferences) {
                    if (!this.preferences) {
                        this.preferences = ts.emptyOptions;
                    }
                    this.preferences = __assign(__assign({}, this.preferences), preferences);
                }
            };
            ScriptInfo.prototype.getLatestVersion = function () {
                // Ensure we have updated snapshot to give back latest version
                this.textStorage.getSnapshot();
                return this.textStorage.getVersion();
            };
            ScriptInfo.prototype.saveTo = function (fileName) {
                this.host.writeFile(fileName, ts.getSnapshotText(this.textStorage.getSnapshot()));
            };
            /*@internal*/
            ScriptInfo.prototype.delayReloadNonMixedContentFile = function () {
                ts.Debug.assert(!this.isDynamicOrHasMixedContent());
                this.textStorage.delayReloadFromFileIntoText();
                this.markContainingProjectsAsDirty();
            };
            ScriptInfo.prototype.reloadFromFile = function (tempFileName) {
                if (this.isDynamicOrHasMixedContent()) {
                    this.textStorage.reload("");
                    this.markContainingProjectsAsDirty();
                    return true;
                }
                else {
                    if (this.textStorage.reloadWithFileText(tempFileName)) {
                        this.markContainingProjectsAsDirty();
                        return true;
                    }
                }
                return false;
            };
            /*@internal*/
            ScriptInfo.prototype.getAbsolutePositionAndLineText = function (line) {
                return this.textStorage.getAbsolutePositionAndLineText(line);
            };
            ScriptInfo.prototype.editContent = function (start, end, newText) {
                this.textStorage.edit(start, end, newText);
                this.markContainingProjectsAsDirty();
            };
            ScriptInfo.prototype.markContainingProjectsAsDirty = function () {
                for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    p.markFileAsDirty(this.path);
                }
            };
            ScriptInfo.prototype.isOrphan = function () {
                return !ts.forEach(this.containingProjects, function (p) { return !p.isOrphan(); });
            };
            /*@internal*/
            ScriptInfo.prototype.isContainedByAutoImportProvider = function () {
                return ts.some(this.containingProjects, function (p) { return p.projectKind === server.ProjectKind.AutoImportProvider; });
            };
            /**
             *  @param line 1 based index
             */
            ScriptInfo.prototype.lineToTextSpan = function (line) {
                return this.textStorage.lineToTextSpan(line);
            };
            ScriptInfo.prototype.lineOffsetToPosition = function (line, offset, allowEdits) {
                return this.textStorage.lineOffsetToPosition(line, offset, allowEdits);
            };
            ScriptInfo.prototype.positionToLineOffset = function (position) {
                failIfInvalidPosition(position);
                var location = this.textStorage.positionToLineOffset(position);
                failIfInvalidLocation(location);
                return location;
            };
            ScriptInfo.prototype.isJavaScript = function () {
                return this.scriptKind === 1 /* JS */ || this.scriptKind === 2 /* JSX */;
            };
            /*@internal*/
            ScriptInfo.prototype.getLineInfo = function () {
                return this.textStorage.getLineInfo();
            };
            /*@internal*/
            ScriptInfo.prototype.closeSourceMapFileWatcher = function () {
                if (this.sourceMapFilePath && !ts.isString(this.sourceMapFilePath)) {
                    ts.closeFileWatcherOf(this.sourceMapFilePath);
                    this.sourceMapFilePath = undefined;
                }
            };
            return ScriptInfo;
        }());
        server.ScriptInfo = ScriptInfo;
        function ensureNotAutoImportProvider(project) {
            if (!project || project.projectKind === server.ProjectKind.AutoImportProvider) {
                return server.Errors.ThrowNoProject();
            }
            return project;
        }
        function failIfInvalidPosition(position) {
            ts.Debug.assert(typeof position === "number", "Expected position " + position + " to be a number.");
            ts.Debug.assert(position >= 0, "Expected position to be non-negative.");
        }
        function failIfInvalidLocation(location) {
            ts.Debug.assert(typeof location.line === "number", "Expected line " + location.line + " to be a number.");
            ts.Debug.assert(typeof location.offset === "number", "Expected offset " + location.offset + " to be a number.");
            ts.Debug.assert(location.line > 0, "Expected line to be non-" + (location.line === 0 ? "zero" : "negative"));
            ts.Debug.assert(location.offset > 0, "Expected offset to be non-" + (location.offset === 0 ? "zero" : "negative"));
        }
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        server.nullTypingsInstaller = {
            isKnownTypesPackageName: ts.returnFalse,
            // Should never be called because we never provide a types registry.
            installPackage: ts.notImplemented,
            enqueueInstallTypingsRequest: ts.noop,
            attach: ts.noop,
            onProjectClosed: ts.noop,
            globalTypingsCacheLocation: undefined // TODO: GH#18217
        };
        function setIsEqualTo(arr1, arr2) {
            if (arr1 === arr2) {
                return true;
            }
            if ((arr1 || server.emptyArray).length === 0 && (arr2 || server.emptyArray).length === 0) {
                return true;
            }
            var set = new ts.Map();
            var unique = 0;
            for (var _i = 0, _a = arr1; _i < _a.length; _i++) {
                var v = _a[_i];
                if (set.get(v) !== true) {
                    set.set(v, true);
                    unique++;
                }
            }
            for (var _b = 0, _c = arr2; _b < _c.length; _b++) {
                var v = _c[_b];
                var isSet = set.get(v);
                if (isSet === undefined) {
                    return false;
                }
                if (isSet === true) {
                    set.set(v, false);
                    unique--;
                }
            }
            return unique === 0;
        }
        function typeAcquisitionChanged(opt1, opt2) {
            return opt1.enable !== opt2.enable ||
                !setIsEqualTo(opt1.include, opt2.include) ||
                !setIsEqualTo(opt1.exclude, opt2.exclude);
        }
        function compilerOptionsChanged(opt1, opt2) {
            // TODO: add more relevant properties
            return opt1.allowJs !== opt2.allowJs;
        }
        function unresolvedImportsChanged(imports1, imports2) {
            if (imports1 === imports2) {
                return false;
            }
            return !ts.arrayIsEqualTo(imports1, imports2);
        }
        /*@internal*/
        var TypingsCache = /** @class */ (function () {
            function TypingsCache(installer) {
                this.installer = installer;
                this.perProjectCache = new ts.Map();
            }
            TypingsCache.prototype.isKnownTypesPackageName = function (name) {
                return this.installer.isKnownTypesPackageName(name);
            };
            TypingsCache.prototype.installPackage = function (options) {
                return this.installer.installPackage(options);
            };
            TypingsCache.prototype.enqueueInstallTypingsForProject = function (project, unresolvedImports, forceRefresh) {
                var typeAcquisition = project.getTypeAcquisition();
                if (!typeAcquisition || !typeAcquisition.enable) {
                    return;
                }
                var entry = this.perProjectCache.get(project.getProjectName());
                if (forceRefresh ||
                    !entry ||
                    typeAcquisitionChanged(typeAcquisition, entry.typeAcquisition) ||
                    compilerOptionsChanged(project.getCompilationSettings(), entry.compilerOptions) ||
                    unresolvedImportsChanged(unresolvedImports, entry.unresolvedImports)) {
                    // Note: entry is now poisoned since it does not really contain typings for a given combination of compiler options\typings options.
                    // instead it acts as a placeholder to prevent issuing multiple requests
                    this.perProjectCache.set(project.getProjectName(), {
                        compilerOptions: project.getCompilationSettings(),
                        typeAcquisition: typeAcquisition,
                        typings: entry ? entry.typings : server.emptyArray,
                        unresolvedImports: unresolvedImports,
                        poisoned: true
                    });
                    // something has been changed, issue a request to update typings
                    this.installer.enqueueInstallTypingsRequest(project, typeAcquisition, unresolvedImports);
                }
            };
            TypingsCache.prototype.updateTypingsForProject = function (projectName, compilerOptions, typeAcquisition, unresolvedImports, newTypings) {
                var typings = ts.sort(newTypings);
                this.perProjectCache.set(projectName, {
                    compilerOptions: compilerOptions,
                    typeAcquisition: typeAcquisition,
                    typings: typings,
                    unresolvedImports: unresolvedImports,
                    poisoned: false
                });
                return !typeAcquisition || !typeAcquisition.enable ? server.emptyArray : typings;
            };
            TypingsCache.prototype.onProjectClosed = function (project) {
                this.perProjectCache.delete(project.getProjectName());
                this.installer.onProjectClosed(project);
            };
            return TypingsCache;
        }());
        server.TypingsCache = TypingsCache;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        var ProjectKind;
        (function (ProjectKind) {
            ProjectKind[ProjectKind["Inferred"] = 0] = "Inferred";
            ProjectKind[ProjectKind["Configured"] = 1] = "Configured";
            ProjectKind[ProjectKind["External"] = 2] = "External";
            ProjectKind[ProjectKind["AutoImportProvider"] = 3] = "AutoImportProvider";
        })(ProjectKind = server.ProjectKind || (server.ProjectKind = {}));
        /* @internal */
        function countEachFileTypes(infos, includeSizes) {
            if (includeSizes === void 0) { includeSizes = false; }
            var result = {
                js: 0, jsSize: 0,
                jsx: 0, jsxSize: 0,
                ts: 0, tsSize: 0,
                tsx: 0, tsxSize: 0,
                dts: 0, dtsSize: 0,
                deferred: 0, deferredSize: 0,
            };
            for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                var info = infos_1[_i];
                var fileSize = includeSizes ? info.getTelemetryFileSize() : 0;
                switch (info.scriptKind) {
                    case 1 /* JS */:
                        result.js += 1;
                        result.jsSize += fileSize;
                        break;
                    case 2 /* JSX */:
                        result.jsx += 1;
                        result.jsxSize += fileSize;
                        break;
                    case 3 /* TS */:
                        if (ts.fileExtensionIs(info.fileName, ".d.ts" /* Dts */)) {
                            result.dts += 1;
                            result.dtsSize += fileSize;
                        }
                        else {
                            result.ts += 1;
                            result.tsSize += fileSize;
                        }
                        break;
                    case 4 /* TSX */:
                        result.tsx += 1;
                        result.tsxSize += fileSize;
                        break;
                    case 7 /* Deferred */:
                        result.deferred += 1;
                        result.deferredSize += fileSize;
                        break;
                }
            }
            return result;
        }
        server.countEachFileTypes = countEachFileTypes;
        function hasOneOrMoreJsAndNoTsFiles(project) {
            var counts = countEachFileTypes(project.getScriptInfos());
            return counts.js > 0 && counts.ts === 0 && counts.tsx === 0;
        }
        function allRootFilesAreJsOrDts(project) {
            var counts = countEachFileTypes(project.getRootScriptInfos());
            return counts.ts === 0 && counts.tsx === 0;
        }
        server.allRootFilesAreJsOrDts = allRootFilesAreJsOrDts;
        function allFilesAreJsOrDts(project) {
            var counts = countEachFileTypes(project.getScriptInfos());
            return counts.ts === 0 && counts.tsx === 0;
        }
        server.allFilesAreJsOrDts = allFilesAreJsOrDts;
        /* @internal */
        function hasNoTypeScriptSource(fileNames) {
            return !fileNames.some(function (fileName) { return (ts.fileExtensionIs(fileName, ".ts" /* Ts */) && !ts.fileExtensionIs(fileName, ".d.ts" /* Dts */)) || ts.fileExtensionIs(fileName, ".tsx" /* Tsx */); });
        }
        server.hasNoTypeScriptSource = hasNoTypeScriptSource;
        function isGeneratedFileWatcher(watch) {
            return watch.generatedFilePath !== undefined;
        }
        var Project = /** @class */ (function () {
            /*@internal*/
            function Project(
            /*@internal*/ projectName, projectKind, projectService, documentRegistry, hasExplicitListOfFiles, lastFileExceededProgramSize, compilerOptions, compileOnSaveEnabled, watchOptions, directoryStructureHost, currentDirectory) {
                var _this = this;
                this.projectName = projectName;
                this.projectKind = projectKind;
                this.projectService = projectService;
                this.documentRegistry = documentRegistry;
                this.compilerOptions = compilerOptions;
                this.compileOnSaveEnabled = compileOnSaveEnabled;
                this.watchOptions = watchOptions;
                this.rootFiles = [];
                this.rootFilesMap = new ts.Map();
                this.plugins = [];
                /*@internal*/
                /**
                 * This is map from files to unresolved imports in it
                 * Maop does not contain entries for files that do not have unresolved imports
                 * This helps in containing the set of files to invalidate
                 */
                this.cachedUnresolvedImportsPerFile = new ts.Map();
                /*@internal*/
                this.hasAddedorRemovedFiles = false;
                /**
                 * Last version that was reported.
                 */
                this.lastReportedVersion = 0;
                /**
                 * Current project's program version. (incremented everytime new program is created that is not complete reuse from the old one)
                 * This property is changed in 'updateGraph' based on the set of files in program
                 */
                this.projectProgramVersion = 0;
                /**
                 * Current version of the project state. It is changed when:
                 * - new root file was added/removed
                 * - edit happen in some file that is currently included in the project.
                 * This property is different from projectStructureVersion since in most cases edits don't affect set of files in the project
                 */
                this.projectStateVersion = 0;
                this.isInitialLoadPending = ts.returnFalse;
                /*@internal*/
                this.dirty = false;
                /*@internal*/
                this.typingFiles = server.emptyArray;
                /*@internal*/
                this.importSuggestionsCache = ts.Completions.createImportSuggestionsForFileCache();
                /*@internal*/
                this.globalCacheResolutionModuleName = ts.JsTyping.nonRelativeModuleNameForTypingCache;
                this.directoryStructureHost = directoryStructureHost;
                this.currentDirectory = this.projectService.getNormalizedAbsolutePath(currentDirectory || "");
                this.getCanonicalFileName = this.projectService.toCanonicalFileName;
                this.cancellationToken = new ts.ThrottledCancellationToken(this.projectService.cancellationToken, this.projectService.throttleWaitMilliseconds);
                if (!this.compilerOptions) {
                    this.compilerOptions = ts.getDefaultCompilerOptions();
                    this.compilerOptions.allowNonTsExtensions = true;
                    this.compilerOptions.allowJs = true;
                }
                else if (hasExplicitListOfFiles || this.compilerOptions.allowJs || this.projectService.hasDeferredExtension()) {
                    // If files are listed explicitly or allowJs is specified, allow all extensions
                    this.compilerOptions.allowNonTsExtensions = true;
                }
                switch (projectService.serverMode) {
                    case ts.LanguageServiceMode.Semantic:
                        this.languageServiceEnabled = true;
                        break;
                    case ts.LanguageServiceMode.PartialSemantic:
                        this.languageServiceEnabled = true;
                        this.compilerOptions.noResolve = true;
                        this.compilerOptions.types = [];
                        break;
                    case ts.LanguageServiceMode.Syntactic:
                        this.languageServiceEnabled = false;
                        this.compilerOptions.noResolve = true;
                        this.compilerOptions.types = [];
                        break;
                    default:
                        ts.Debug.assertNever(projectService.serverMode);
                }
                this.setInternalCompilerOptionsForEmittingJsFiles();
                var host = this.projectService.host;
                if (this.projectService.logger.loggingEnabled()) {
                    this.trace = function (s) { return _this.writeLog(s); };
                }
                else if (host.trace) {
                    this.trace = function (s) { return host.trace(s); };
                }
                this.realpath = ts.maybeBind(host, host.realpath);
                // Use the current directory as resolution root only if the project created using current directory string
                this.resolutionCache = ts.createResolutionCache(this, currentDirectory && this.currentDirectory, 
                /*logChangesWhenResolvingModule*/ true);
                this.languageService = ts.createLanguageService(this, this.documentRegistry, this.projectService.serverMode);
                if (lastFileExceededProgramSize) {
                    this.disableLanguageService(lastFileExceededProgramSize);
                }
                this.markAsDirty();
                if (projectKind !== ProjectKind.AutoImportProvider) {
                    this.projectService.pendingEnsureProjectForOpenFiles = true;
                }
            }
            /*@internal*/
            Project.prototype.getResolvedProjectReferenceToRedirect = function (_fileName) {
                return undefined;
            };
            Project.prototype.isNonTsProject = function () {
                server.updateProjectIfDirty(this);
                return allFilesAreJsOrDts(this);
            };
            Project.prototype.isJsOnlyProject = function () {
                server.updateProjectIfDirty(this);
                return hasOneOrMoreJsAndNoTsFiles(this);
            };
            Project.resolveModule = function (moduleName, initialDir, host, log, logErrors) {
                var resolvedPath = ts.normalizeSlashes(host.resolvePath(ts.combinePaths(initialDir, "node_modules")));
                log("Loading " + moduleName + " from " + initialDir + " (resolved to " + resolvedPath + ")");
                var result = host.require(resolvedPath, moduleName); // TODO: GH#18217
                if (result.error) {
                    var err = result.error.stack || result.error.message || JSON.stringify(result.error);
                    (logErrors || log)("Failed to load module '" + moduleName + "' from " + resolvedPath + ": " + err);
                    return undefined;
                }
                return result.module;
            };
            Project.prototype.isKnownTypesPackageName = function (name) {
                return this.typingsCache.isKnownTypesPackageName(name);
            };
            Project.prototype.installPackage = function (options) {
                return this.typingsCache.installPackage(__assign(__assign({}, options), { projectName: this.projectName, projectRootPath: this.toPath(this.currentDirectory) }));
            };
            /*@internal*/
            Project.prototype.getGlobalTypingsCacheLocation = function () {
                return this.getGlobalCache();
            };
            Object.defineProperty(Project.prototype, "typingsCache", {
                get: function () {
                    return this.projectService.typingsCache;
                },
                enumerable: false,
                configurable: true
            });
            /*@internal*/
            Project.prototype.getSymlinkCache = function () {
                var _a;
                return this.symlinks || (this.symlinks = ts.discoverProbableSymlinks(((_a = this.program) === null || _a === void 0 ? void 0 : _a.getSourceFiles()) || server.emptyArray, this.getCanonicalFileName, this.getCurrentDirectory()));
            };
            // Method of LanguageServiceHost
            Project.prototype.getCompilationSettings = function () {
                return this.compilerOptions;
            };
            // Method to support public API
            Project.prototype.getCompilerOptions = function () {
                return this.getCompilationSettings();
            };
            Project.prototype.getNewLine = function () {
                return this.projectService.host.newLine;
            };
            Project.prototype.getProjectVersion = function () {
                return this.projectStateVersion.toString();
            };
            Project.prototype.getProjectReferences = function () {
                return undefined;
            };
            Project.prototype.getScriptFileNames = function () {
                var _this = this;
                if (!this.rootFiles) {
                    return ts.emptyArray;
                }
                var result;
                this.rootFilesMap.forEach(function (value) {
                    if (_this.languageServiceEnabled || (value.info && value.info.isScriptOpen())) {
                        // if language service is disabled - process only files that are open
                        (result || (result = [])).push(value.fileName);
                    }
                });
                return ts.addRange(result, this.typingFiles) || ts.emptyArray;
            };
            Project.prototype.getOrCreateScriptInfoAndAttachToProject = function (fileName) {
                var scriptInfo = this.projectService.getOrCreateScriptInfoNotOpenedByClient(fileName, this.currentDirectory, this.directoryStructureHost);
                if (scriptInfo) {
                    var existingValue = this.rootFilesMap.get(scriptInfo.path);
                    if (existingValue && existingValue.info !== scriptInfo) {
                        // This was missing path earlier but now the file exists. Update the root
                        this.rootFiles.push(scriptInfo);
                        existingValue.info = scriptInfo;
                    }
                    scriptInfo.attachToProject(this);
                }
                return scriptInfo;
            };
            Project.prototype.getScriptKind = function (fileName) {
                var info = this.getOrCreateScriptInfoAndAttachToProject(fileName);
                return (info && info.scriptKind); // TODO: GH#18217
            };
            Project.prototype.getScriptVersion = function (filename) {
                // Don't attach to the project if version is asked
                var info = this.projectService.getOrCreateScriptInfoNotOpenedByClient(filename, this.currentDirectory, this.directoryStructureHost);
                return (info && info.getLatestVersion()); // TODO: GH#18217
            };
            Project.prototype.getScriptSnapshot = function (filename) {
                var scriptInfo = this.getOrCreateScriptInfoAndAttachToProject(filename);
                if (scriptInfo) {
                    return scriptInfo.getSnapshot();
                }
            };
            Project.prototype.getCancellationToken = function () {
                return this.cancellationToken;
            };
            Project.prototype.getCurrentDirectory = function () {
                return this.currentDirectory;
            };
            Project.prototype.getDefaultLibFileName = function () {
                var nodeModuleBinDir = ts.getDirectoryPath(ts.normalizePath(this.projectService.getExecutingFilePath()));
                return ts.combinePaths(nodeModuleBinDir, ts.getDefaultLibFileName(this.compilerOptions));
            };
            Project.prototype.useCaseSensitiveFileNames = function () {
                return this.projectService.host.useCaseSensitiveFileNames;
            };
            Project.prototype.readDirectory = function (path, extensions, exclude, include, depth) {
                return this.directoryStructureHost.readDirectory(path, extensions, exclude, include, depth);
            };
            Project.prototype.readFile = function (fileName) {
                return this.projectService.host.readFile(fileName);
            };
            Project.prototype.writeFile = function (fileName, content) {
                return this.projectService.host.writeFile(fileName, content);
            };
            Project.prototype.fileExists = function (file) {
                // As an optimization, don't hit the disks for files we already know don't exist
                // (because we're watching for their creation).
                var path = this.toPath(file);
                return !this.isWatchedMissingFile(path) && this.directoryStructureHost.fileExists(file);
            };
            Project.prototype.resolveModuleNames = function (moduleNames, containingFile, reusedNames, redirectedReference) {
                return this.resolutionCache.resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference);
            };
            Project.prototype.getResolvedModuleWithFailedLookupLocationsFromCache = function (moduleName, containingFile) {
                return this.resolutionCache.getResolvedModuleWithFailedLookupLocationsFromCache(moduleName, containingFile);
            };
            Project.prototype.resolveTypeReferenceDirectives = function (typeDirectiveNames, containingFile, redirectedReference) {
                return this.resolutionCache.resolveTypeReferenceDirectives(typeDirectiveNames, containingFile, redirectedReference);
            };
            Project.prototype.directoryExists = function (path) {
                return this.directoryStructureHost.directoryExists(path); // TODO: GH#18217
            };
            Project.prototype.getDirectories = function (path) {
                return this.directoryStructureHost.getDirectories(path); // TODO: GH#18217
            };
            /*@internal*/
            Project.prototype.getCachedDirectoryStructureHost = function () {
                return undefined; // TODO: GH#18217
            };
            /*@internal*/
            Project.prototype.toPath = function (fileName) {
                return ts.toPath(fileName, this.currentDirectory, this.projectService.toCanonicalFileName);
            };
            /*@internal*/
            Project.prototype.watchDirectoryOfFailedLookupLocation = function (directory, cb, flags) {
                return this.projectService.watchFactory.watchDirectory(this.projectService.host, directory, cb, flags, this.projectService.getWatchOptions(this), ts.WatchType.FailedLookupLocations, this);
            };
            /*@internal*/
            Project.prototype.clearInvalidateResolutionOfFailedLookupTimer = function () {
                return this.projectService.throttledOperations.cancel(this.getProjectName() + "FailedLookupInvalidation");
            };
            /*@internal*/
            Project.prototype.scheduleInvalidateResolutionsOfFailedLookupLocations = function () {
                var _this = this;
                this.projectService.throttledOperations.schedule(this.getProjectName() + "FailedLookupInvalidation", /*delay*/ 1000, function () {
                    if (_this.resolutionCache.invalidateResolutionsOfFailedLookupLocations()) {
                        _this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(_this);
                    }
                });
            };
            /*@internal*/
            Project.prototype.invalidateResolutionsOfFailedLookupLocations = function () {
                if (this.clearInvalidateResolutionOfFailedLookupTimer() &&
                    this.resolutionCache.invalidateResolutionsOfFailedLookupLocations()) {
                    this.markAsDirty();
                    this.projectService.delayEnsureProjectForOpenFiles();
                }
            };
            /*@internal*/
            Project.prototype.onInvalidatedResolution = function () {
                this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(this);
            };
            /*@internal*/
            Project.prototype.watchTypeRootsDirectory = function (directory, cb, flags) {
                return this.projectService.watchFactory.watchDirectory(this.projectService.host, directory, cb, flags, this.projectService.getWatchOptions(this), ts.WatchType.TypeRoots, this);
            };
            /*@internal*/
            Project.prototype.hasChangedAutomaticTypeDirectiveNames = function () {
                return this.resolutionCache.hasChangedAutomaticTypeDirectiveNames();
            };
            /*@internal*/
            Project.prototype.onChangedAutomaticTypeDirectiveNames = function () {
                this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(this);
            };
            /*@internal*/
            Project.prototype.getGlobalCache = function () {
                return this.getTypeAcquisition().enable ? this.projectService.typingsInstaller.globalTypingsCacheLocation : undefined;
            };
            /*@internal*/
            Project.prototype.fileIsOpen = function (filePath) {
                return this.projectService.openFiles.has(filePath);
            };
            /*@internal*/
            Project.prototype.writeLog = function (s) {
                this.projectService.logger.info(s);
            };
            Project.prototype.log = function (s) {
                this.writeLog(s);
            };
            Project.prototype.error = function (s) {
                this.projectService.logger.msg(s, server.Msg.Err);
            };
            Project.prototype.setInternalCompilerOptionsForEmittingJsFiles = function () {
                if (this.projectKind === ProjectKind.Inferred || this.projectKind === ProjectKind.External) {
                    this.compilerOptions.noEmitForJsFiles = true;
                }
            };
            /**
             * Get the errors that dont have any file name associated
             */
            Project.prototype.getGlobalProjectErrors = function () {
                return server.emptyArray;
            };
            Project.prototype.getAllProjectErrors = function () {
                return server.emptyArray;
            };
            Project.prototype.getLanguageService = function (ensureSynchronized) {
                if (ensureSynchronized === void 0) { ensureSynchronized = true; }
                if (ensureSynchronized) {
                    server.updateProjectIfDirty(this);
                }
                return this.languageService;
            };
            /** @internal */
            Project.prototype.getSourceMapper = function () {
                return this.getLanguageService().getSourceMapper();
            };
            /** @internal */
            Project.prototype.clearSourceMapperCache = function () {
                this.languageService.clearSourceMapperCache();
            };
            /*@internal*/
            Project.prototype.getDocumentPositionMapper = function (generatedFileName, sourceFileName) {
                return this.projectService.getDocumentPositionMapper(this, generatedFileName, sourceFileName);
            };
            /*@internal*/
            Project.prototype.getSourceFileLike = function (fileName) {
                return this.projectService.getSourceFileLike(fileName, this);
            };
            /*@internal*/
            Project.prototype.shouldEmitFile = function (scriptInfo) {
                return scriptInfo &&
                    !scriptInfo.isDynamicOrHasMixedContent() &&
                    !this.program.isSourceOfProjectReferenceRedirect(scriptInfo.path);
            };
            Project.prototype.getCompileOnSaveAffectedFileList = function (scriptInfo) {
                var _this = this;
                if (!this.languageServiceEnabled) {
                    return [];
                }
                server.updateProjectIfDirty(this);
                this.builderState = ts.BuilderState.create(this.program, this.projectService.toCanonicalFileName, this.builderState);
                return ts.mapDefined(ts.BuilderState.getFilesAffectedBy(this.builderState, this.program, scriptInfo.path, this.cancellationToken, function (data) { return _this.projectService.host.createHash(data); }), // TODO: GH#18217
                function (// TODO: GH#18217
                sourceFile) { return _this.shouldEmitFile(_this.projectService.getScriptInfoForPath(sourceFile.path)) ? sourceFile.fileName : undefined; });
            };
            /**
             * Returns true if emit was conducted
             */
            Project.prototype.emitFile = function (scriptInfo, writeFile) {
                if (!this.languageServiceEnabled || !this.shouldEmitFile(scriptInfo)) {
                    return { emitSkipped: true, diagnostics: server.emptyArray };
                }
                var _a = this.getLanguageService().getEmitOutput(scriptInfo.fileName), emitSkipped = _a.emitSkipped, diagnostics = _a.diagnostics, outputFiles = _a.outputFiles;
                if (!emitSkipped) {
                    for (var _i = 0, outputFiles_1 = outputFiles; _i < outputFiles_1.length; _i++) {
                        var outputFile = outputFiles_1[_i];
                        var outputFileAbsoluteFileName = ts.getNormalizedAbsolutePath(outputFile.name, this.currentDirectory);
                        writeFile(outputFileAbsoluteFileName, outputFile.text, outputFile.writeByteOrderMark);
                    }
                    // Update the signature
                    if (this.builderState && ts.getEmitDeclarations(this.compilerOptions)) {
                        var dtsFiles = outputFiles.filter(function (f) { return ts.fileExtensionIs(f.name, ".d.ts" /* Dts */); });
                        if (dtsFiles.length === 1) {
                            var sourceFile = this.program.getSourceFile(scriptInfo.fileName);
                            ts.BuilderState.updateSignatureOfFile(this.builderState, this.projectService.host.createHash(dtsFiles[0].text), sourceFile.resolvedPath);
                        }
                    }
                }
                return { emitSkipped: emitSkipped, diagnostics: diagnostics };
            };
            Project.prototype.enableLanguageService = function () {
                if (this.languageServiceEnabled || this.projectService.serverMode === ts.LanguageServiceMode.Syntactic) {
                    return;
                }
                this.languageServiceEnabled = true;
                this.lastFileExceededProgramSize = undefined;
                this.projectService.onUpdateLanguageServiceStateForProject(this, /*languageServiceEnabled*/ true);
            };
            Project.prototype.disableLanguageService = function (lastFileExceededProgramSize) {
                if (!this.languageServiceEnabled) {
                    return;
                }
                ts.Debug.assert(this.projectService.serverMode !== ts.LanguageServiceMode.Syntactic);
                this.languageService.cleanupSemanticCache();
                this.languageServiceEnabled = false;
                this.lastFileExceededProgramSize = lastFileExceededProgramSize;
                this.builderState = undefined;
                if (this.autoImportProviderHost) {
                    this.autoImportProviderHost.close();
                }
                this.autoImportProviderHost = undefined;
                this.resolutionCache.closeTypeRootsWatch();
                this.clearGeneratedFileWatch();
                this.projectService.onUpdateLanguageServiceStateForProject(this, /*languageServiceEnabled*/ false);
            };
            Project.prototype.getProjectName = function () {
                return this.projectName;
            };
            Project.prototype.removeLocalTypingsFromTypeAcquisition = function (newTypeAcquisition) {
                if (!newTypeAcquisition || !newTypeAcquisition.include) {
                    // Nothing to filter out, so just return as-is
                    return newTypeAcquisition;
                }
                return __assign(__assign({}, newTypeAcquisition), { include: this.removeExistingTypings(newTypeAcquisition.include) });
            };
            Project.prototype.getExternalFiles = function () {
                var _this = this;
                return ts.sort(ts.flatMap(this.plugins, function (plugin) {
                    if (typeof plugin.module.getExternalFiles !== "function")
                        return;
                    try {
                        return plugin.module.getExternalFiles(_this);
                    }
                    catch (e) {
                        _this.projectService.logger.info("A plugin threw an exception in getExternalFiles: " + e);
                        if (e.stack) {
                            _this.projectService.logger.info(e.stack);
                        }
                    }
                }));
            };
            Project.prototype.getSourceFile = function (path) {
                if (!this.program) {
                    return undefined;
                }
                return this.program.getSourceFileByPath(path);
            };
            /* @internal */
            Project.prototype.getSourceFileOrConfigFile = function (path) {
                var options = this.program.getCompilerOptions();
                return path === options.configFilePath ? options.configFile : this.getSourceFile(path);
            };
            Project.prototype.close = function () {
                var _this = this;
                if (this.program) {
                    // if we have a program - release all files that are enlisted in program but arent root
                    // The releasing of the roots happens later
                    // The project could have pending update remaining and hence the info could be in the files but not in program graph
                    for (var _i = 0, _a = this.program.getSourceFiles(); _i < _a.length; _i++) {
                        var f = _a[_i];
                        this.detachScriptInfoIfNotRoot(f.fileName);
                    }
                    this.program.forEachResolvedProjectReference(function (ref) {
                        if (ref) {
                            _this.detachScriptInfoFromProject(ref.sourceFile.fileName);
                        }
                    });
                }
                // Release external files
                ts.forEach(this.externalFiles, function (externalFile) { return _this.detachScriptInfoIfNotRoot(externalFile); });
                // Always remove root files from the project
                for (var _b = 0, _c = this.rootFiles; _b < _c.length; _b++) {
                    var root = _c[_b];
                    root.detachFromProject(this);
                }
                this.projectService.pendingEnsureProjectForOpenFiles = true;
                this.rootFiles = undefined;
                this.rootFilesMap = undefined;
                this.externalFiles = undefined;
                this.program = undefined;
                this.builderState = undefined;
                this.resolutionCache.clear();
                this.resolutionCache = undefined;
                this.cachedUnresolvedImportsPerFile = undefined;
                this.directoryStructureHost = undefined;
                // Clean up file watchers waiting for missing files
                if (this.missingFilesMap) {
                    ts.clearMap(this.missingFilesMap, ts.closeFileWatcher);
                    this.missingFilesMap = undefined;
                }
                this.clearGeneratedFileWatch();
                this.clearInvalidateResolutionOfFailedLookupTimer();
                if (this.autoImportProviderHost) {
                    this.autoImportProviderHost.close();
                }
                this.autoImportProviderHost = undefined;
                // signal language service to release source files acquired from document registry
                this.languageService.dispose();
                this.languageService = undefined;
            };
            Project.prototype.detachScriptInfoIfNotRoot = function (uncheckedFilename) {
                var info = this.projectService.getScriptInfo(uncheckedFilename);
                // We might not find the script info in case its not associated with the project any more
                // and project graph was not updated (eg delayed update graph in case of files changed/deleted on the disk)
                if (info && !this.isRoot(info)) {
                    info.detachFromProject(this);
                }
            };
            Project.prototype.isClosed = function () {
                return this.rootFiles === undefined;
            };
            Project.prototype.hasRoots = function () {
                return this.rootFiles && this.rootFiles.length > 0;
            };
            /*@internal*/
            Project.prototype.isOrphan = function () {
                return false;
            };
            Project.prototype.getRootFiles = function () {
                return this.rootFiles && this.rootFiles.map(function (info) { return info.fileName; });
            };
            /*@internal*/
            Project.prototype.getRootFilesMap = function () {
                return this.rootFilesMap;
            };
            Project.prototype.getRootScriptInfos = function () {
                return this.rootFiles;
            };
            Project.prototype.getScriptInfos = function () {
                var _this = this;
                if (!this.languageServiceEnabled) {
                    // if language service is not enabled - return just root files
                    return this.rootFiles;
                }
                return ts.map(this.program.getSourceFiles(), function (sourceFile) {
                    var scriptInfo = _this.projectService.getScriptInfoForPath(sourceFile.resolvedPath);
                    ts.Debug.assert(!!scriptInfo, "getScriptInfo", function () { return "scriptInfo for a file '" + sourceFile.fileName + "' Path: '" + sourceFile.path + "' / '" + sourceFile.resolvedPath + "' is missing."; });
                    return scriptInfo;
                });
            };
            Project.prototype.getExcludedFiles = function () {
                return server.emptyArray;
            };
            Project.prototype.getFileNames = function (excludeFilesFromExternalLibraries, excludeConfigFiles) {
                if (!this.program) {
                    return [];
                }
                if (!this.languageServiceEnabled) {
                    // if language service is disabled assume that all files in program are root files + default library
                    var rootFiles = this.getRootFiles();
                    if (this.compilerOptions) {
                        var defaultLibrary = ts.getDefaultLibFilePath(this.compilerOptions);
                        if (defaultLibrary) {
                            (rootFiles || (rootFiles = [])).push(server.asNormalizedPath(defaultLibrary));
                        }
                    }
                    return rootFiles;
                }
                var result = [];
                for (var _i = 0, _a = this.program.getSourceFiles(); _i < _a.length; _i++) {
                    var f = _a[_i];
                    if (excludeFilesFromExternalLibraries && this.program.isSourceFileFromExternalLibrary(f)) {
                        continue;
                    }
                    result.push(server.asNormalizedPath(f.fileName));
                }
                if (!excludeConfigFiles) {
                    var configFile = this.program.getCompilerOptions().configFile;
                    if (configFile) {
                        result.push(server.asNormalizedPath(configFile.fileName));
                        if (configFile.extendedSourceFiles) {
                            for (var _b = 0, _c = configFile.extendedSourceFiles; _b < _c.length; _b++) {
                                var f = _c[_b];
                                result.push(server.asNormalizedPath(f));
                            }
                        }
                    }
                }
                return result;
            };
            /* @internal */
            Project.prototype.getFileNamesWithRedirectInfo = function (includeProjectReferenceRedirectInfo) {
                var _this = this;
                return this.getFileNames().map(function (fileName) { return ({
                    fileName: fileName,
                    isSourceOfProjectReferenceRedirect: includeProjectReferenceRedirectInfo && _this.isSourceOfProjectReferenceRedirect(fileName)
                }); });
            };
            Project.prototype.hasConfigFile = function (configFilePath) {
                if (this.program && this.languageServiceEnabled) {
                    var configFile = this.program.getCompilerOptions().configFile;
                    if (configFile) {
                        if (configFilePath === server.asNormalizedPath(configFile.fileName)) {
                            return true;
                        }
                        if (configFile.extendedSourceFiles) {
                            for (var _i = 0, _a = configFile.extendedSourceFiles; _i < _a.length; _i++) {
                                var f = _a[_i];
                                if (configFilePath === server.asNormalizedPath(f)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };
            Project.prototype.containsScriptInfo = function (info) {
                if (this.isRoot(info))
                    return true;
                if (!this.program)
                    return false;
                var file = this.program.getSourceFileByPath(info.path);
                return !!file && file.resolvedPath === info.path;
            };
            Project.prototype.containsFile = function (filename, requireOpen) {
                var info = this.projectService.getScriptInfoForNormalizedPath(filename);
                if (info && (info.isScriptOpen() || !requireOpen)) {
                    return this.containsScriptInfo(info);
                }
                return false;
            };
            Project.prototype.isRoot = function (info) {
                var _a;
                return this.rootFilesMap && ((_a = this.rootFilesMap.get(info.path)) === null || _a === void 0 ? void 0 : _a.info) === info;
            };
            // add a root file to project
            Project.prototype.addRoot = function (info, fileName) {
                ts.Debug.assert(!this.isRoot(info));
                this.rootFiles.push(info);
                this.rootFilesMap.set(info.path, { fileName: fileName || info.fileName, info: info });
                info.attachToProject(this);
                this.markAsDirty();
            };
            // add a root file that doesnt exist on host
            Project.prototype.addMissingFileRoot = function (fileName) {
                var path = this.projectService.toPath(fileName);
                this.rootFilesMap.set(path, { fileName: fileName });
                this.markAsDirty();
            };
            Project.prototype.removeFile = function (info, fileExists, detachFromProject) {
                if (this.isRoot(info)) {
                    this.removeRoot(info);
                }
                if (fileExists) {
                    // If file is present, just remove the resolutions for the file
                    this.resolutionCache.removeResolutionsOfFile(info.path);
                }
                else {
                    this.resolutionCache.invalidateResolutionOfFile(info.path);
                }
                this.cachedUnresolvedImportsPerFile.delete(info.path);
                if (detachFromProject) {
                    info.detachFromProject(this);
                }
                this.markAsDirty();
            };
            Project.prototype.registerFileUpdate = function (fileName) {
                (this.updatedFileNames || (this.updatedFileNames = new ts.Set())).add(fileName);
            };
            /*@internal*/
            Project.prototype.markFileAsDirty = function (changedFile) {
                this.markAsDirty();
                if (!this.importSuggestionsCache.isEmpty()) {
                    (this.dirtyFilesForSuggestions || (this.dirtyFilesForSuggestions = new ts.Set())).add(changedFile);
                }
            };
            Project.prototype.markAsDirty = function () {
                if (!this.dirty) {
                    this.projectStateVersion++;
                    this.dirty = true;
                }
            };
            /*@internal*/
            Project.prototype.markAutoImportProviderAsDirty = function () {
                var _a;
                if (this.autoImportProviderHost === false) {
                    this.autoImportProviderHost = undefined;
                }
                (_a = this.autoImportProviderHost) === null || _a === void 0 ? void 0 : _a.markAsDirty();
                this.importSuggestionsCache.clear();
            };
            /* @internal */
            Project.prototype.onFileAddedOrRemoved = function () {
                this.hasAddedorRemovedFiles = true;
            };
            /**
             * Updates set of files that contribute to this project
             * @returns: true if set of files in the project stays the same and false - otherwise.
             */
            Project.prototype.updateGraph = function () {
                var _a;
                ts.perfLogger.logStartUpdateGraph();
                this.resolutionCache.startRecordingFilesWithChangedResolutions();
                var hasNewProgram = this.updateGraphWorker();
                var hasAddedorRemovedFiles = this.hasAddedorRemovedFiles;
                this.hasAddedorRemovedFiles = false;
                var changedFiles = this.resolutionCache.finishRecordingFilesWithChangedResolutions() || server.emptyArray;
                for (var _i = 0, changedFiles_1 = changedFiles; _i < changedFiles_1.length; _i++) {
                    var file = changedFiles_1[_i];
                    // delete cached information for changed files
                    this.cachedUnresolvedImportsPerFile.delete(file);
                }
                // update builder only if language service is enabled
                // otherwise tell it to drop its internal state
                if (this.languageServiceEnabled && this.projectService.serverMode === ts.LanguageServiceMode.Semantic) {
                    // 1. no changes in structure, no changes in unresolved imports - do nothing
                    // 2. no changes in structure, unresolved imports were changed - collect unresolved imports for all files
                    // (can reuse cached imports for files that were not changed)
                    // 3. new files were added/removed, but compilation settings stays the same - collect unresolved imports for all new/modified files
                    // (can reuse cached imports for files that were not changed)
                    // 4. compilation settings were changed in the way that might affect module resolution - drop all caches and collect all data from the scratch
                    if (hasNewProgram || changedFiles.length) {
                        this.lastCachedUnresolvedImportsList = getUnresolvedImports(this.program, this.cachedUnresolvedImportsPerFile);
                    }
                    this.projectService.typingsCache.enqueueInstallTypingsForProject(this, this.lastCachedUnresolvedImportsList, hasAddedorRemovedFiles);
                }
                else {
                    this.lastCachedUnresolvedImportsList = undefined;
                }
                var isFirstLoad = this.projectProgramVersion === 0;
                if (hasNewProgram) {
                    this.projectProgramVersion++;
                }
                if (hasAddedorRemovedFiles) {
                    if (!this.autoImportProviderHost)
                        this.autoImportProviderHost = undefined;
                    (_a = this.autoImportProviderHost) === null || _a === void 0 ? void 0 : _a.markAsDirty();
                }
                if (isFirstLoad) {
                    // Preload auto import provider so it's not created during completions request
                    this.getPackageJsonAutoImportProvider();
                }
                ts.perfLogger.logStopUpdateGraph();
                return !hasNewProgram;
            };
            /*@internal*/
            Project.prototype.updateTypingFiles = function (typingFiles) {
                var _this = this;
                ts.enumerateInsertsAndDeletes(typingFiles, this.typingFiles, ts.getStringComparer(!this.useCaseSensitiveFileNames()), 
                /*inserted*/ ts.noop, function (removed) { return _this.detachScriptInfoFromProject(removed); });
                this.typingFiles = typingFiles;
                // Invalidate files with unresolved imports
                this.resolutionCache.setFilesWithInvalidatedNonRelativeUnresolvedImports(this.cachedUnresolvedImportsPerFile);
            };
            /* @internal */
            Project.prototype.getCurrentProgram = function () {
                return this.program;
            };
            Project.prototype.removeExistingTypings = function (include) {
                var existing = ts.getAutomaticTypeDirectiveNames(this.getCompilerOptions(), this.directoryStructureHost);
                return include.filter(function (i) { return existing.indexOf(i) < 0; });
            };
            Project.prototype.updateGraphWorker = function () {
                var _this = this;
                var oldProgram = this.program;
                ts.Debug.assert(!this.isClosed(), "Called update graph worker of closed project");
                this.writeLog("Starting updateGraphWorker: Project: " + this.getProjectName());
                var start = ts.timestamp();
                this.hasInvalidatedResolution = this.resolutionCache.createHasInvalidatedResolution();
                this.resolutionCache.startCachingPerDirectoryResolution();
                this.program = this.languageService.getProgram(); // TODO: GH#18217
                this.dirty = false;
                this.resolutionCache.finishCachingPerDirectoryResolution();
                ts.Debug.assert(oldProgram === undefined || this.program !== undefined);
                // bump up the version if
                // - oldProgram is not set - this is a first time updateGraph is called
                // - newProgram is different from the old program and structure of the old program was not reused.
                var hasNewProgram = this.program && (!oldProgram || (this.program !== oldProgram && !(oldProgram.structureIsReused & 2 /* Completely */)));
                if (hasNewProgram) {
                    if (oldProgram) {
                        for (var _i = 0, _a = oldProgram.getSourceFiles(); _i < _a.length; _i++) {
                            var f = _a[_i];
                            var newFile = this.program.getSourceFileByPath(f.resolvedPath);
                            if (!newFile || (f.resolvedPath === f.path && newFile.resolvedPath !== f.path)) {
                                // new program does not contain this file - detach it from the project
                                // - remove resolutions only if the new program doesnt contain source file by the path (not resolvedPath since path is used for resolution)
                                this.detachScriptInfoFromProject(f.fileName, !!this.program.getSourceFileByPath(f.path));
                            }
                        }
                        oldProgram.forEachResolvedProjectReference(function (resolvedProjectReference, resolvedProjectReferencePath) {
                            if (resolvedProjectReference && !_this.program.getResolvedProjectReferenceByPath(resolvedProjectReferencePath)) {
                                _this.detachScriptInfoFromProject(resolvedProjectReference.sourceFile.fileName);
                            }
                        });
                    }
                    // Update the missing file paths watcher
                    ts.updateMissingFilePathsWatch(this.program, this.missingFilesMap || (this.missingFilesMap = new ts.Map()), 
                    // Watch the missing files
                    function (missingFilePath) { return _this.addMissingFileWatcher(missingFilePath); });
                    if (this.generatedFilesMap) {
                        var outPath = ts.outFile(this.compilerOptions);
                        if (isGeneratedFileWatcher(this.generatedFilesMap)) {
                            // --out
                            if (!outPath || !this.isValidGeneratedFileWatcher(ts.removeFileExtension(outPath) + ".d.ts" /* Dts */, this.generatedFilesMap)) {
                                this.clearGeneratedFileWatch();
                            }
                        }
                        else {
                            // MultiFile
                            if (outPath) {
                                this.clearGeneratedFileWatch();
                            }
                            else {
                                this.generatedFilesMap.forEach(function (watcher, source) {
                                    var sourceFile = _this.program.getSourceFileByPath(source);
                                    if (!sourceFile ||
                                        sourceFile.resolvedPath !== source ||
                                        !_this.isValidGeneratedFileWatcher(ts.getDeclarationEmitOutputFilePathWorker(sourceFile.fileName, _this.compilerOptions, _this.currentDirectory, _this.program.getCommonSourceDirectory(), _this.getCanonicalFileName), watcher)) {
                                        ts.closeFileWatcherOf(watcher);
                                        _this.generatedFilesMap.delete(source);
                                    }
                                });
                            }
                        }
                    }
                    // Watch the type locations that would be added to program as part of automatic type resolutions
                    if (this.languageServiceEnabled && this.projectService.serverMode === ts.LanguageServiceMode.Semantic) {
                        this.resolutionCache.updateTypeRootsWatch();
                    }
                }
                if (!this.importSuggestionsCache.isEmpty()) {
                    if (this.hasAddedorRemovedFiles || oldProgram && !oldProgram.structureIsReused) {
                        this.importSuggestionsCache.clear();
                    }
                    else if (this.dirtyFilesForSuggestions && oldProgram && this.program) {
                        ts.forEachKey(this.dirtyFilesForSuggestions, function (fileName) {
                            var oldSourceFile = oldProgram.getSourceFile(fileName);
                            var sourceFile = _this.program.getSourceFile(fileName);
                            if (_this.sourceFileHasChangedOwnImportSuggestions(oldSourceFile, sourceFile)) {
                                _this.importSuggestionsCache.clear();
                                return true;
                            }
                        });
                    }
                }
                if (this.dirtyFilesForSuggestions) {
                    this.dirtyFilesForSuggestions.clear();
                }
                if (this.hasAddedorRemovedFiles) {
                    this.symlinks = undefined;
                }
                var oldExternalFiles = this.externalFiles || server.emptyArray;
                this.externalFiles = this.getExternalFiles();
                ts.enumerateInsertsAndDeletes(this.externalFiles, oldExternalFiles, ts.getStringComparer(!this.useCaseSensitiveFileNames()), 
                // Ensure a ScriptInfo is created for new external files. This is performed indirectly
                // by the host for files in the program when the program is retrieved above but
                // the program doesn't contain external files so this must be done explicitly.
                function (inserted) {
                    var scriptInfo = _this.projectService.getOrCreateScriptInfoNotOpenedByClient(inserted, _this.currentDirectory, _this.directoryStructureHost);
                    scriptInfo.attachToProject(_this);
                }, function (removed) { return _this.detachScriptInfoFromProject(removed); });
                var elapsed = ts.timestamp() - start;
                this.sendPerformanceEvent("UpdateGraph", elapsed);
                this.writeLog("Finishing updateGraphWorker: Project: " + this.getProjectName() + " Version: " + this.getProjectVersion() + " structureChanged: " + hasNewProgram + " Elapsed: " + elapsed + "ms");
                if (this.hasAddedorRemovedFiles) {
                    this.print(/*writeProjectFileNames*/ true);
                }
                else if (this.program !== oldProgram) {
                    this.writeLog("Different program with same set of files:: oldProgram.structureIsReused:: " + (oldProgram && oldProgram.structureIsReused));
                }
                return hasNewProgram;
            };
            /* @internal */
            Project.prototype.sendPerformanceEvent = function (kind, durationMs) {
                this.projectService.sendPerformanceEvent(kind, durationMs);
            };
            /*@internal*/
            Project.prototype.sourceFileHasChangedOwnImportSuggestions = function (oldSourceFile, newSourceFile) {
                if (!oldSourceFile && !newSourceFile) {
                    return false;
                }
                // Probably shouldn’t get this far, but on the off chance the file was added or removed,
                // we can’t reliably tell anything about it.
                if (!oldSourceFile || !newSourceFile) {
                    return true;
                }
                ts.Debug.assertEqual(oldSourceFile.fileName, newSourceFile.fileName);
                // If ATA is enabled, auto-imports uses existing imports to guess whether you want auto-imports from node.
                // Adding or removing imports from node could change the outcome of that guess, so could change the suggestions list.
                if (this.getTypeAcquisition().enable && ts.consumesNodeCoreModules(oldSourceFile) !== ts.consumesNodeCoreModules(newSourceFile)) {
                    return true;
                }
                // Module agumentation and ambient module changes can add or remove exports available to be auto-imported.
                // Changes elsewhere in the file can change the *type* of an export in a module augmentation,
                // but type info is gathered in getCompletionEntryDetails, which doesn’t use the cache.
                if (!ts.arrayIsEqualTo(oldSourceFile.moduleAugmentations, newSourceFile.moduleAugmentations) ||
                    !this.ambientModuleDeclarationsAreEqual(oldSourceFile, newSourceFile)) {
                    return true;
                }
                return false;
            };
            /*@internal*/
            Project.prototype.ambientModuleDeclarationsAreEqual = function (oldSourceFile, newSourceFile) {
                if (!ts.arrayIsEqualTo(oldSourceFile.ambientModuleNames, newSourceFile.ambientModuleNames)) {
                    return false;
                }
                var oldFileStatementIndex = -1;
                var newFileStatementIndex = -1;
                var _loop_1 = function (ambientModuleName) {
                    var isMatchingModuleDeclaration = function (node) { return ts.isNonGlobalAmbientModule(node) && node.name.text === ambientModuleName; };
                    oldFileStatementIndex = ts.findIndex(oldSourceFile.statements, isMatchingModuleDeclaration, oldFileStatementIndex + 1);
                    newFileStatementIndex = ts.findIndex(newSourceFile.statements, isMatchingModuleDeclaration, newFileStatementIndex + 1);
                    if (oldSourceFile.statements[oldFileStatementIndex] !== newSourceFile.statements[newFileStatementIndex]) {
                        return { value: false };
                    }
                };
                for (var _i = 0, _a = newSourceFile.ambientModuleNames; _i < _a.length; _i++) {
                    var ambientModuleName = _a[_i];
                    var state_1 = _loop_1(ambientModuleName);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                return true;
            };
            Project.prototype.detachScriptInfoFromProject = function (uncheckedFileName, noRemoveResolution) {
                var scriptInfoToDetach = this.projectService.getScriptInfo(uncheckedFileName);
                if (scriptInfoToDetach) {
                    scriptInfoToDetach.detachFromProject(this);
                    if (!noRemoveResolution) {
                        this.resolutionCache.removeResolutionsOfFile(scriptInfoToDetach.path);
                    }
                }
            };
            Project.prototype.addMissingFileWatcher = function (missingFilePath) {
                var _this = this;
                var fileWatcher = this.projectService.watchFactory.watchFile(this.projectService.host, missingFilePath, function (fileName, eventKind) {
                    if (isConfiguredProject(_this)) {
                        _this.getCachedDirectoryStructureHost().addOrDeleteFile(fileName, missingFilePath, eventKind);
                    }
                    if (eventKind === ts.FileWatcherEventKind.Created && _this.missingFilesMap.has(missingFilePath)) {
                        _this.missingFilesMap.delete(missingFilePath);
                        fileWatcher.close();
                        // When a missing file is created, we should update the graph.
                        _this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(_this);
                    }
                }, ts.PollingInterval.Medium, this.projectService.getWatchOptions(this), ts.WatchType.MissingFile, this);
                return fileWatcher;
            };
            Project.prototype.isWatchedMissingFile = function (path) {
                return !!this.missingFilesMap && this.missingFilesMap.has(path);
            };
            /* @internal */
            Project.prototype.addGeneratedFileWatch = function (generatedFile, sourceFile) {
                if (ts.outFile(this.compilerOptions)) {
                    // Single watcher
                    if (!this.generatedFilesMap) {
                        this.generatedFilesMap = this.createGeneratedFileWatcher(generatedFile);
                    }
                }
                else {
                    // Map
                    var path = this.toPath(sourceFile);
                    if (this.generatedFilesMap) {
                        if (isGeneratedFileWatcher(this.generatedFilesMap)) {
                            ts.Debug.fail(this.projectName + " Expected to not have --out watcher for generated file with options: " + JSON.stringify(this.compilerOptions));
                            return;
                        }
                        if (this.generatedFilesMap.has(path))
                            return;
                    }
                    else {
                        this.generatedFilesMap = new ts.Map();
                    }
                    this.generatedFilesMap.set(path, this.createGeneratedFileWatcher(generatedFile));
                }
            };
            Project.prototype.createGeneratedFileWatcher = function (generatedFile) {
                var _this = this;
                return {
                    generatedFilePath: this.toPath(generatedFile),
                    watcher: this.projectService.watchFactory.watchFile(this.projectService.host, generatedFile, function () {
                        _this.clearSourceMapperCache();
                        _this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(_this);
                    }, ts.PollingInterval.High, this.projectService.getWatchOptions(this), ts.WatchType.MissingGeneratedFile, this)
                };
            };
            Project.prototype.isValidGeneratedFileWatcher = function (generateFile, watcher) {
                return this.toPath(generateFile) === watcher.generatedFilePath;
            };
            Project.prototype.clearGeneratedFileWatch = function () {
                if (this.generatedFilesMap) {
                    if (isGeneratedFileWatcher(this.generatedFilesMap)) {
                        ts.closeFileWatcherOf(this.generatedFilesMap);
                    }
                    else {
                        ts.clearMap(this.generatedFilesMap, ts.closeFileWatcherOf);
                    }
                    this.generatedFilesMap = undefined;
                }
            };
            Project.prototype.getScriptInfoForNormalizedPath = function (fileName) {
                var scriptInfo = this.projectService.getScriptInfoForPath(this.toPath(fileName));
                if (scriptInfo && !scriptInfo.isAttached(this)) {
                    return server.Errors.ThrowProjectDoesNotContainDocument(fileName, this);
                }
                return scriptInfo;
            };
            Project.prototype.getScriptInfo = function (uncheckedFileName) {
                return this.projectService.getScriptInfo(uncheckedFileName);
            };
            Project.prototype.filesToString = function (writeProjectFileNames) {
                if (this.isInitialLoadPending())
                    return "\tFiles (0) InitialLoadPending\n";
                if (!this.program)
                    return "\tFiles (0) NoProgram\n";
                var sourceFiles = this.program.getSourceFiles();
                var strBuilder = "\tFiles (" + sourceFiles.length + ")\n";
                if (writeProjectFileNames) {
                    for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
                        var file = sourceFiles_1[_i];
                        strBuilder += "\t" + file.fileName + "\n";
                    }
                }
                return strBuilder;
            };
            /*@internal*/
            Project.prototype.print = function (writeProjectFileNames) {
                this.writeLog("Project '" + this.projectName + "' (" + ProjectKind[this.projectKind] + ")");
                this.writeLog(this.filesToString(writeProjectFileNames && this.projectService.logger.hasLevel(server.LogLevel.verbose)));
                this.writeLog("-----------------------------------------------");
                if (this.autoImportProviderHost) {
                    this.autoImportProviderHost.print(/*writeProjectFileNames*/ false);
                }
            };
            Project.prototype.setCompilerOptions = function (compilerOptions) {
                if (compilerOptions) {
                    compilerOptions.allowNonTsExtensions = true;
                    var oldOptions = this.compilerOptions;
                    this.compilerOptions = compilerOptions;
                    this.setInternalCompilerOptionsForEmittingJsFiles();
                    if (ts.changesAffectModuleResolution(oldOptions, compilerOptions)) {
                        // reset cached unresolved imports if changes in compiler options affected module resolution
                        this.cachedUnresolvedImportsPerFile.clear();
                        this.lastCachedUnresolvedImportsList = undefined;
                        this.resolutionCache.clear();
                    }
                    this.markAsDirty();
                }
            };
            /*@internal*/
            Project.prototype.setWatchOptions = function (watchOptions) {
                this.watchOptions = watchOptions;
            };
            /*@internal*/
            Project.prototype.getWatchOptions = function () {
                return this.watchOptions;
            };
            /* @internal */
            Project.prototype.getChangesSinceVersion = function (lastKnownVersion, includeProjectReferenceRedirectInfo) {
                var _this = this;
                var includeProjectReferenceRedirectInfoIfRequested = includeProjectReferenceRedirectInfo
                    ? function (files) { return ts.arrayFrom(files.entries(), function (_a) {
                        var fileName = _a[0], isSourceOfProjectReferenceRedirect = _a[1];
                        return ({
                            fileName: fileName,
                            isSourceOfProjectReferenceRedirect: isSourceOfProjectReferenceRedirect
                        });
                    }); }
                    : function (files) { return ts.arrayFrom(files.keys()); };
                // Update the graph only if initial configured project load is not pending
                if (!this.isInitialLoadPending()) {
                    server.updateProjectIfDirty(this);
                }
                var info = {
                    projectName: this.getProjectName(),
                    version: this.projectProgramVersion,
                    isInferred: isInferredProject(this),
                    options: this.getCompilationSettings(),
                    languageServiceDisabled: !this.languageServiceEnabled,
                    lastFileExceededProgramSize: this.lastFileExceededProgramSize
                };
                var updatedFileNames = this.updatedFileNames;
                this.updatedFileNames = undefined;
                // check if requested version is the same that we have reported last time
                if (this.lastReportedFileNames && lastKnownVersion === this.lastReportedVersion) {
                    // if current structure version is the same - return info without any changes
                    if (this.projectProgramVersion === this.lastReportedVersion && !updatedFileNames) {
                        return { info: info, projectErrors: this.getGlobalProjectErrors() };
                    }
                    // compute and return the difference
                    var lastReportedFileNames_1 = this.lastReportedFileNames;
                    var externalFiles = this.getExternalFiles().map(function (f) { return ({
                        fileName: server.toNormalizedPath(f),
                        isSourceOfProjectReferenceRedirect: false
                    }); });
                    var currentFiles_1 = ts.arrayToMap(this.getFileNamesWithRedirectInfo(!!includeProjectReferenceRedirectInfo).concat(externalFiles), function (info) { return info.fileName; }, function (info) { return info.isSourceOfProjectReferenceRedirect; });
                    var added_1 = new ts.Map();
                    var removed_1 = new ts.Map();
                    var updated = updatedFileNames ? ts.arrayFrom(updatedFileNames.keys()) : [];
                    var updatedRedirects_1 = [];
                    ts.forEachEntry(currentFiles_1, function (isSourceOfProjectReferenceRedirect, fileName) {
                        if (!lastReportedFileNames_1.has(fileName)) {
                            added_1.set(fileName, isSourceOfProjectReferenceRedirect);
                        }
                        else if (includeProjectReferenceRedirectInfo && isSourceOfProjectReferenceRedirect !== lastReportedFileNames_1.get(fileName)) {
                            updatedRedirects_1.push({
                                fileName: fileName,
                                isSourceOfProjectReferenceRedirect: isSourceOfProjectReferenceRedirect
                            });
                        }
                    });
                    ts.forEachEntry(lastReportedFileNames_1, function (isSourceOfProjectReferenceRedirect, fileName) {
                        if (!currentFiles_1.has(fileName)) {
                            removed_1.set(fileName, isSourceOfProjectReferenceRedirect);
                        }
                    });
                    this.lastReportedFileNames = currentFiles_1;
                    this.lastReportedVersion = this.projectProgramVersion;
                    return {
                        info: info,
                        changes: {
                            added: includeProjectReferenceRedirectInfoIfRequested(added_1),
                            removed: includeProjectReferenceRedirectInfoIfRequested(removed_1),
                            updated: includeProjectReferenceRedirectInfo
                                ? updated.map(function (fileName) { return ({
                                    fileName: fileName,
                                    isSourceOfProjectReferenceRedirect: _this.isSourceOfProjectReferenceRedirect(fileName)
                                }); })
                                : updated,
                            updatedRedirects: includeProjectReferenceRedirectInfo ? updatedRedirects_1 : undefined
                        },
                        projectErrors: this.getGlobalProjectErrors()
                    };
                }
                else {
                    // unknown version - return everything
                    var projectFileNames = this.getFileNamesWithRedirectInfo(!!includeProjectReferenceRedirectInfo);
                    var externalFiles = this.getExternalFiles().map(function (f) { return ({
                        fileName: server.toNormalizedPath(f),
                        isSourceOfProjectReferenceRedirect: false
                    }); });
                    var allFiles = projectFileNames.concat(externalFiles);
                    this.lastReportedFileNames = ts.arrayToMap(allFiles, function (info) { return info.fileName; }, function (info) { return info.isSourceOfProjectReferenceRedirect; });
                    this.lastReportedVersion = this.projectProgramVersion;
                    return {
                        info: info,
                        files: includeProjectReferenceRedirectInfo ? allFiles : allFiles.map(function (f) { return f.fileName; }),
                        projectErrors: this.getGlobalProjectErrors()
                    };
                }
            };
            // remove a root file from project
            Project.prototype.removeRoot = function (info) {
                ts.orderedRemoveItem(this.rootFiles, info);
                this.rootFilesMap.delete(info.path);
            };
            /*@internal*/
            Project.prototype.isSourceOfProjectReferenceRedirect = function (fileName) {
                return !!this.program && this.program.isSourceOfProjectReferenceRedirect(fileName);
            };
            Project.prototype.enableGlobalPlugins = function (options, pluginConfigOverrides) {
                var host = this.projectService.host;
                if (!host.require) {
                    this.projectService.logger.info("Plugins were requested but not running in environment that supports 'require'. Nothing will be loaded");
                    return;
                }
                // Search any globally-specified probe paths, then our peer node_modules
                var searchPaths = __spreadArrays(this.projectService.pluginProbeLocations, [
                    // ../../.. to walk from X/node_modules/typescript/lib/tsserver.js to X/node_modules/
                    ts.combinePaths(this.projectService.getExecutingFilePath(), "../../.."),
                ]);
                if (this.projectService.globalPlugins) {
                    var _loop_2 = function (globalPluginName) {
                        // Skip empty names from odd commandline parses
                        if (!globalPluginName)
                            return "continue";
                        // Skip already-locally-loaded plugins
                        if (options.plugins && options.plugins.some(function (p) { return p.name === globalPluginName; }))
                            return "continue";
                        // Provide global: true so plugins can detect why they can't find their config
                        this_1.projectService.logger.info("Loading global plugin " + globalPluginName);
                        this_1.enablePlugin({ name: globalPluginName, global: true }, searchPaths, pluginConfigOverrides);
                    };
                    var this_1 = this;
                    // Enable global plugins with synthetic configuration entries
                    for (var _i = 0, _a = this.projectService.globalPlugins; _i < _a.length; _i++) {
                        var globalPluginName = _a[_i];
                        _loop_2(globalPluginName);
                    }
                }
            };
            Project.prototype.enablePlugin = function (pluginConfigEntry, searchPaths, pluginConfigOverrides) {
                var _this = this;
                this.projectService.logger.info("Enabling plugin " + pluginConfigEntry.name + " from candidate paths: " + searchPaths.join(","));
                var log = function (message) { return _this.projectService.logger.info(message); };
                var errorLogs;
                var logError = function (message) { (errorLogs || (errorLogs = [])).push(message); };
                var resolvedModule = ts.firstDefined(searchPaths, function (searchPath) {
                    return Project.resolveModule(pluginConfigEntry.name, searchPath, _this.projectService.host, log, logError);
                });
                if (resolvedModule) {
                    var configurationOverride = pluginConfigOverrides && pluginConfigOverrides.get(pluginConfigEntry.name);
                    if (configurationOverride) {
                        // Preserve the name property since it's immutable
                        var pluginName = pluginConfigEntry.name;
                        pluginConfigEntry = configurationOverride;
                        pluginConfigEntry.name = pluginName;
                    }
                    this.enableProxy(resolvedModule, pluginConfigEntry);
                }
                else {
                    ts.forEach(errorLogs, log);
                    this.projectService.logger.info("Couldn't find " + pluginConfigEntry.name);
                }
            };
            Project.prototype.enableProxy = function (pluginModuleFactory, configEntry) {
                try {
                    if (typeof pluginModuleFactory !== "function") {
                        this.projectService.logger.info("Skipped loading plugin " + configEntry.name + " because it did not expose a proper factory function");
                        return;
                    }
                    var info = {
                        config: configEntry,
                        project: this,
                        languageService: this.languageService,
                        languageServiceHost: this,
                        serverHost: this.projectService.host
                    };
                    var pluginModule = pluginModuleFactory({ typescript: ts });
                    var newLS = pluginModule.create(info);
                    for (var _i = 0, _a = Object.keys(this.languageService); _i < _a.length; _i++) {
                        var k = _a[_i];
                        // eslint-disable-next-line no-in-operator
                        if (!(k in newLS)) {
                            this.projectService.logger.info("Plugin activation warning: Missing proxied method " + k + " in created LS. Patching.");
                            newLS[k] = this.languageService[k];
                        }
                    }
                    this.projectService.logger.info("Plugin validation succeded");
                    this.languageService = newLS;
                    this.plugins.push({ name: configEntry.name, module: pluginModule });
                }
                catch (e) {
                    this.projectService.logger.info("Plugin activation failed: " + e);
                }
            };
            /*@internal*/
            Project.prototype.onPluginConfigurationChanged = function (pluginName, configuration) {
                this.plugins.filter(function (plugin) { return plugin.name === pluginName; }).forEach(function (plugin) {
                    if (plugin.module.onConfigurationChanged) {
                        plugin.module.onConfigurationChanged(configuration);
                    }
                });
            };
            /** Starts a new check for diagnostics. Call this if some file has updated that would cause diagnostics to be changed. */
            Project.prototype.refreshDiagnostics = function () {
                this.projectService.sendProjectsUpdatedInBackgroundEvent();
            };
            /*@internal*/
            Project.prototype.getPackageJsonsVisibleToFile = function (fileName, rootDir) {
                return this.projectService.getPackageJsonsVisibleToFile(fileName, rootDir);
            };
            /*@internal*/
            Project.prototype.getPackageJsonsForAutoImport = function (rootDir) {
                var packageJsons = this.getPackageJsonsVisibleToFile(ts.combinePaths(this.currentDirectory, ts.inferredTypesContainingFile), rootDir);
                this.packageJsonsForAutoImport = new ts.Set(packageJsons.map(function (p) { return p.fileName; }));
                return packageJsons;
            };
            /*@internal*/
            Project.prototype.getImportSuggestionsCache = function () {
                return this.importSuggestionsCache;
            };
            /*@internal*/
            Project.prototype.includePackageJsonAutoImports = function () {
                if (this.projectService.includePackageJsonAutoImports() === 0 /* Off */ ||
                    !this.languageServiceEnabled ||
                    ts.isInsideNodeModules(this.currentDirectory) ||
                    !this.isDefaultProjectForOpenFiles()) {
                    return 0 /* Off */;
                }
                return this.projectService.includePackageJsonAutoImports();
            };
            /*@internal*/
            Project.prototype.getModuleResolutionHostForAutoImportProvider = function () {
                var _a, _b;
                if (this.program) {
                    return {
                        fileExists: this.program.fileExists,
                        directoryExists: this.program.directoryExists,
                        realpath: this.program.realpath || ((_a = this.projectService.host.realpath) === null || _a === void 0 ? void 0 : _a.bind(this.projectService.host)),
                        getCurrentDirectory: this.getCurrentDirectory.bind(this),
                        readFile: this.projectService.host.readFile.bind(this.projectService.host),
                        getDirectories: this.projectService.host.getDirectories.bind(this.projectService.host),
                        trace: (_b = this.projectService.host.trace) === null || _b === void 0 ? void 0 : _b.bind(this.projectService.host),
                    };
                }
                return this.projectService.host;
            };
            /*@internal*/
            Project.prototype.getPackageJsonAutoImportProvider = function () {
                if (this.autoImportProviderHost === false) {
                    return undefined;
                }
                if (this.autoImportProviderHost) {
                    server.updateProjectIfDirty(this.autoImportProviderHost);
                    if (!this.autoImportProviderHost.hasRoots()) {
                        this.autoImportProviderHost.close();
                        this.autoImportProviderHost = undefined;
                        return undefined;
                    }
                    return this.autoImportProviderHost.getCurrentProgram();
                }
                var dependencySelection = this.includePackageJsonAutoImports();
                if (dependencySelection) {
                    this.autoImportProviderHost = AutoImportProviderProject.create(dependencySelection, this, this.getModuleResolutionHostForAutoImportProvider(), this.documentRegistry);
                    if (this.autoImportProviderHost) {
                        server.updateProjectIfDirty(this.autoImportProviderHost);
                        return this.autoImportProviderHost.getCurrentProgram();
                    }
                }
            };
            /*@internal*/
            Project.prototype.isDefaultProjectForOpenFiles = function () {
                var _this = this;
                return !!ts.forEachEntry(this.projectService.openFiles, function (_, fileName) { return _this.projectService.tryGetDefaultProjectForFile(server.toNormalizedPath(fileName)) === _this; });
            };
            return Project;
        }());
        server.Project = Project;
        function getUnresolvedImports(program, cachedUnresolvedImportsPerFile) {
            var ambientModules = program.getTypeChecker().getAmbientModules().map(function (mod) { return ts.stripQuotes(mod.getName()); });
            return ts.sortAndDeduplicate(ts.flatMap(program.getSourceFiles(), function (sourceFile) {
                return extractUnresolvedImportsFromSourceFile(sourceFile, ambientModules, cachedUnresolvedImportsPerFile);
            }));
        }
        function extractUnresolvedImportsFromSourceFile(file, ambientModules, cachedUnresolvedImportsPerFile) {
            return ts.getOrUpdate(cachedUnresolvedImportsPerFile, file.path, function () {
                if (!file.resolvedModules)
                    return server.emptyArray;
                var unresolvedImports;
                file.resolvedModules.forEach(function (resolvedModule, name) {
                    // pick unresolved non-relative names
                    if ((!resolvedModule || !ts.resolutionExtensionIsTSOrJson(resolvedModule.extension)) &&
                        !ts.isExternalModuleNameRelative(name) &&
                        !ambientModules.some(function (m) { return m === name; })) {
                        unresolvedImports = ts.append(unresolvedImports, ts.parsePackageName(name).packageName);
                    }
                });
                return unresolvedImports || server.emptyArray;
            });
        }
        function createProjectNameFactoryWithCounter(nameFactory) {
            var nextId = 1;
            return function () { return nameFactory(nextId++); };
        }
        /**
         * If a file is opened and no tsconfig (or jsconfig) is found,
         * the file and its imports/references are put into an InferredProject.
         */
        var InferredProject = /** @class */ (function (_super) {
            __extends(InferredProject, _super);
            /*@internal*/
            function InferredProject(projectService, documentRegistry, compilerOptions, watchOptions, projectRootPath, currentDirectory, pluginConfigOverrides) {
                var _this = _super.call(this, InferredProject.newName(), ProjectKind.Inferred, projectService, documentRegistry, 
                // TODO: GH#18217
                /*files*/ undefined, 
                /*lastFileExceededProgramSize*/ undefined, compilerOptions, 
                /*compileOnSaveEnabled*/ false, watchOptions, projectService.host, currentDirectory) || this;
                _this._isJsInferredProject = false;
                _this.projectRootPath = projectRootPath && projectService.toCanonicalFileName(projectRootPath);
                if (!projectRootPath && !projectService.useSingleInferredProject) {
                    _this.canonicalCurrentDirectory = projectService.toCanonicalFileName(_this.currentDirectory);
                }
                _this.enableGlobalPlugins(_this.getCompilerOptions(), pluginConfigOverrides);
                return _this;
            }
            InferredProject.prototype.toggleJsInferredProject = function (isJsInferredProject) {
                if (isJsInferredProject !== this._isJsInferredProject) {
                    this._isJsInferredProject = isJsInferredProject;
                    this.setCompilerOptions();
                }
            };
            InferredProject.prototype.setCompilerOptions = function (options) {
                // Avoid manipulating the given options directly
                if (!options && !this.getCompilationSettings()) {
                    return;
                }
                var newOptions = ts.cloneCompilerOptions(options || this.getCompilationSettings());
                if (this._isJsInferredProject && typeof newOptions.maxNodeModuleJsDepth !== "number") {
                    newOptions.maxNodeModuleJsDepth = 2;
                }
                else if (!this._isJsInferredProject) {
                    newOptions.maxNodeModuleJsDepth = undefined;
                }
                newOptions.allowJs = true;
                _super.prototype.setCompilerOptions.call(this, newOptions);
            };
            InferredProject.prototype.addRoot = function (info) {
                ts.Debug.assert(info.isScriptOpen());
                this.projectService.startWatchingConfigFilesForInferredProjectRoot(info);
                if (!this._isJsInferredProject && info.isJavaScript()) {
                    this.toggleJsInferredProject(/*isJsInferredProject*/ true);
                }
                _super.prototype.addRoot.call(this, info);
            };
            InferredProject.prototype.removeRoot = function (info) {
                this.projectService.stopWatchingConfigFilesForInferredProjectRoot(info);
                _super.prototype.removeRoot.call(this, info);
                if (this._isJsInferredProject && info.isJavaScript()) {
                    if (ts.every(this.getRootScriptInfos(), function (rootInfo) { return !rootInfo.isJavaScript(); })) {
                        this.toggleJsInferredProject(/*isJsInferredProject*/ false);
                    }
                }
            };
            /*@internal*/
            InferredProject.prototype.isOrphan = function () {
                return !this.hasRoots();
            };
            InferredProject.prototype.isProjectWithSingleRoot = function () {
                // - when useSingleInferredProject is not set and projectRootPath is not set,
                //   we can guarantee that this will be the only root
                // - other wise it has single root if it has single root script info
                return (!this.projectRootPath && !this.projectService.useSingleInferredProject) ||
                    this.getRootScriptInfos().length === 1;
            };
            InferredProject.prototype.close = function () {
                var _this = this;
                ts.forEach(this.getRootScriptInfos(), function (info) { return _this.projectService.stopWatchingConfigFilesForInferredProjectRoot(info); });
                _super.prototype.close.call(this);
            };
            InferredProject.prototype.getTypeAcquisition = function () {
                return {
                    enable: allRootFilesAreJsOrDts(this),
                    include: ts.emptyArray,
                    exclude: ts.emptyArray
                };
            };
            InferredProject.newName = createProjectNameFactoryWithCounter(server.makeInferredProjectName);
            return InferredProject;
        }(Project));
        server.InferredProject = InferredProject;
        var AutoImportProviderProject = /** @class */ (function (_super) {
            __extends(AutoImportProviderProject, _super);
            /*@internal*/
            function AutoImportProviderProject(hostProject, initialRootNames, documentRegistry, compilerOptions) {
                var _this = _super.call(this, AutoImportProviderProject.newName(), ProjectKind.AutoImportProvider, hostProject.projectService, documentRegistry, 
                /*hasExplicitListOfFiles*/ false, 
                /*lastFileExceededProgramSize*/ undefined, compilerOptions, 
                /*compileOnSaveEnabled*/ false, hostProject.getWatchOptions(), hostProject.projectService.host, hostProject.currentDirectory) || this;
                _this.hostProject = hostProject;
                _this.rootFileNames = initialRootNames;
                return _this;
            }
            /*@internal*/
            AutoImportProviderProject.getRootFileNames = function (dependencySelection, hostProject, moduleResolutionHost, compilerOptions) {
                var _a, _b, _c, _d;
                if (!dependencySelection) {
                    return ts.emptyArray;
                }
                var dependencyNames;
                var rootNames;
                var rootFileName = ts.combinePaths(hostProject.currentDirectory, ts.inferredTypesContainingFile);
                var packageJsons = hostProject.getPackageJsonsForAutoImport(ts.combinePaths(hostProject.currentDirectory, rootFileName));
                for (var _i = 0, packageJsons_1 = packageJsons; _i < packageJsons_1.length; _i++) {
                    var packageJson = packageJsons_1[_i];
                    (_a = packageJson.dependencies) === null || _a === void 0 ? void 0 : _a.forEach(function (_, dependenyName) { return addDependency(dependenyName); });
                    (_b = packageJson.peerDependencies) === null || _b === void 0 ? void 0 : _b.forEach(function (_, dependencyName) { return addDependency(dependencyName); });
                }
                if (dependencyNames) {
                    var resolutions = ts.map(ts.arrayFrom(dependencyNames.keys()), function (name) { return ts.resolveTypeReferenceDirective(name, rootFileName, compilerOptions, moduleResolutionHost); });
                    for (var _e = 0, resolutions_1 = resolutions; _e < resolutions_1.length; _e++) {
                        var resolution = resolutions_1[_e];
                        if (!((_c = resolution.resolvedTypeReferenceDirective) === null || _c === void 0 ? void 0 : _c.resolvedFileName))
                            continue;
                        var resolvedFileName = resolution.resolvedTypeReferenceDirective.resolvedFileName;
                        var fileName = ((_d = moduleResolutionHost.realpath) === null || _d === void 0 ? void 0 : _d.call(moduleResolutionHost, resolvedFileName)) || resolvedFileName;
                        if (!hostProject.getCurrentProgram().getSourceFile(fileName) && !hostProject.getCurrentProgram().getSourceFile(resolvedFileName)) {
                            rootNames = ts.append(rootNames, fileName);
                            // Avoid creating a large project that would significantly slow down time to editor interactivity
                            if (dependencySelection === 2 /* Auto */ && rootNames.length > this.maxDependencies) {
                                return ts.emptyArray;
                            }
                        }
                    }
                }
                return rootNames || ts.emptyArray;
                function addDependency(dependency) {
                    if (!ts.startsWith(dependency, "@types/")) {
                        (dependencyNames || (dependencyNames = new ts.Set())).add(dependency);
                    }
                }
            };
            /*@internal*/
            AutoImportProviderProject.create = function (dependencySelection, hostProject, moduleResolutionHost, documentRegistry) {
                if (dependencySelection === 0 /* Off */) {
                    return undefined;
                }
                var compilerOptions = __assign(__assign({}, hostProject.getCompilerOptions()), { noLib: true, diagnostics: false, skipLibCheck: true, types: ts.emptyArray, lib: ts.emptyArray, sourceMap: false });
                var rootNames = this.getRootFileNames(dependencySelection, hostProject, moduleResolutionHost, compilerOptions);
                if (!rootNames.length) {
                    return undefined;
                }
                return new AutoImportProviderProject(hostProject, rootNames, documentRegistry, compilerOptions);
            };
            AutoImportProviderProject.prototype.isOrphan = function () {
                return true;
            };
            AutoImportProviderProject.prototype.updateGraph = function () {
                var rootFileNames = this.rootFileNames;
                if (!rootFileNames) {
                    rootFileNames = AutoImportProviderProject.getRootFileNames(this.hostProject.includePackageJsonAutoImports(), this.hostProject, this.hostProject.getModuleResolutionHostForAutoImportProvider(), this.getCompilationSettings());
                }
                this.projectService.setFileNamesOfAutoImportProviderProject(this, rootFileNames);
                this.rootFileNames = rootFileNames;
                this.hostProject.getImportSuggestionsCache().clear();
                return _super.prototype.updateGraph.call(this);
            };
            AutoImportProviderProject.prototype.markAsDirty = function () {
                this.rootFileNames = undefined;
                _super.prototype.markAsDirty.call(this);
            };
            AutoImportProviderProject.prototype.getScriptFileNames = function () {
                return this.rootFileNames || ts.emptyArray;
            };
            AutoImportProviderProject.prototype.getLanguageService = function () {
                throw new Error("AutoImportProviderProject language service should never be used. To get the program, use `project.getCurrentProgram()`.");
            };
            AutoImportProviderProject.prototype.markAutoImportProviderAsDirty = function () {
                throw new Error("AutoImportProviderProject is an auto import provider; use `markAsDirty()` instead.");
            };
            AutoImportProviderProject.prototype.getModuleResolutionHostForAutoImportProvider = function () {
                throw new Error("AutoImportProviderProject cannot provide its own host; use `hostProject.getModuleResolutionHostForAutomImportProvider()` instead.");
            };
            AutoImportProviderProject.prototype.getProjectReferences = function () {
                return this.hostProject.getProjectReferences();
            };
            AutoImportProviderProject.prototype.useSourceOfProjectReferenceRedirect = function () {
                return true;
            };
            /*@internal*/
            AutoImportProviderProject.prototype.includePackageJsonAutoImports = function () {
                return 0 /* Off */;
            };
            AutoImportProviderProject.prototype.getTypeAcquisition = function () {
                return { enable: false };
            };
            /*@internal*/
            AutoImportProviderProject.prototype.getSymlinkCache = function () {
                return this.hostProject.getSymlinkCache();
            };
            AutoImportProviderProject.newName = createProjectNameFactoryWithCounter(server.makeAutoImportProviderProjectName);
            /*@internal*/
            AutoImportProviderProject.maxDependencies = 10;
            return AutoImportProviderProject;
        }(Project));
        server.AutoImportProviderProject = AutoImportProviderProject;
        /**
         * If a file is opened, the server will look for a tsconfig (or jsconfig)
         * and if successful create a ConfiguredProject for it.
         * Otherwise it will create an InferredProject.
         */
        var ConfiguredProject = /** @class */ (function (_super) {
            __extends(ConfiguredProject, _super);
            /*@internal*/
            function ConfiguredProject(configFileName, projectService, documentRegistry, cachedDirectoryStructureHost) {
                var _this = _super.call(this, configFileName, ProjectKind.Configured, projectService, documentRegistry, 
                /*hasExplicitListOfFiles*/ false, 
                /*lastFileExceededProgramSize*/ undefined, 
                /*compilerOptions*/ {}, 
                /*compileOnSaveEnabled*/ false, 
                /*watchOptions*/ undefined, cachedDirectoryStructureHost, ts.getDirectoryPath(configFileName)) || this;
                /* @internal */
                _this.openFileWatchTriggered = new ts.Map();
                /*@internal*/
                _this.canConfigFileJsonReportNoInputFiles = false;
                /** Ref count to the project when opened from external project */
                _this.externalProjectRefCount = 0;
                /*@internal*/
                _this.isInitialLoadPending = ts.returnTrue;
                /*@internal*/
                _this.sendLoadingProjectFinish = false;
                _this.canonicalConfigFilePath = server.asNormalizedPath(projectService.toCanonicalFileName(configFileName));
                return _this;
            }
            /* @internal */
            ConfiguredProject.prototype.setCompilerHost = function (host) {
                this.compilerHost = host;
            };
            /* @internal */
            ConfiguredProject.prototype.getCompilerHost = function () {
                return this.compilerHost;
            };
            /* @internal */
            ConfiguredProject.prototype.useSourceOfProjectReferenceRedirect = function () {
                return this.languageServiceEnabled;
            };
            /* @internal */
            ConfiguredProject.prototype.setWatchOptions = function (watchOptions) {
                var oldOptions = this.getWatchOptions();
                _super.prototype.setWatchOptions.call(this, watchOptions);
                // If watch options different than older options
                if (this.isInitialLoadPending() &&
                    !ts.isJsonEqual(oldOptions, this.getWatchOptions())) {
                    var oldWatcher = this.configFileWatcher;
                    this.createConfigFileWatcher();
                    if (oldWatcher)
                        oldWatcher.close();
                }
            };
            /* @internal */
            ConfiguredProject.prototype.createConfigFileWatcher = function () {
                var _this = this;
                this.configFileWatcher = this.projectService.watchFactory.watchFile(this.projectService.host, this.getConfigFilePath(), function (_fileName, eventKind) { return _this.projectService.onConfigChangedForConfiguredProject(_this, eventKind); }, ts.PollingInterval.High, this.projectService.getWatchOptions(this), ts.WatchType.ConfigFile, this);
            };
            /**
             * If the project has reload from disk pending, it reloads (and then updates graph as part of that) instead of just updating the graph
             * @returns: true if set of files in the project stays the same and false - otherwise.
             */
            ConfiguredProject.prototype.updateGraph = function () {
                var isInitialLoad = this.isInitialLoadPending();
                this.isInitialLoadPending = ts.returnFalse;
                var reloadLevel = this.pendingReload;
                this.pendingReload = ts.ConfigFileProgramReloadLevel.None;
                var result;
                switch (reloadLevel) {
                    case ts.ConfigFileProgramReloadLevel.Partial:
                        this.openFileWatchTriggered.clear();
                        result = this.projectService.reloadFileNamesOfConfiguredProject(this);
                        break;
                    case ts.ConfigFileProgramReloadLevel.Full:
                        this.openFileWatchTriggered.clear();
                        var reason = ts.Debug.checkDefined(this.pendingReloadReason);
                        this.pendingReloadReason = undefined;
                        this.projectService.reloadConfiguredProject(this, reason, isInitialLoad);
                        result = true;
                        break;
                    default:
                        result = _super.prototype.updateGraph.call(this);
                }
                this.compilerHost = undefined;
                this.projectService.sendProjectLoadingFinishEvent(this);
                this.projectService.sendProjectTelemetry(this);
                return result;
            };
            /*@internal*/
            ConfiguredProject.prototype.getCachedDirectoryStructureHost = function () {
                return this.directoryStructureHost;
            };
            ConfiguredProject.prototype.getConfigFilePath = function () {
                return server.asNormalizedPath(this.getProjectName());
            };
            ConfiguredProject.prototype.getProjectReferences = function () {
                return this.projectReferences;
            };
            ConfiguredProject.prototype.updateReferences = function (refs) {
                this.projectReferences = refs;
                this.potentialProjectReferences = undefined;
            };
            /*@internal*/
            ConfiguredProject.prototype.setPotentialProjectReference = function (canonicalConfigPath) {
                ts.Debug.assert(this.isInitialLoadPending());
                (this.potentialProjectReferences || (this.potentialProjectReferences = new ts.Set())).add(canonicalConfigPath);
            };
            /*@internal*/
            ConfiguredProject.prototype.getResolvedProjectReferenceToRedirect = function (fileName) {
                var program = this.getCurrentProgram();
                return program && program.getResolvedProjectReferenceToRedirect(fileName);
            };
            /*@internal*/
            ConfiguredProject.prototype.enablePluginsWithOptions = function (options, pluginConfigOverrides) {
                var host = this.projectService.host;
                if (!host.require) {
                    this.projectService.logger.info("Plugins were requested but not running in environment that supports 'require'. Nothing will be loaded");
                    return;
                }
                // Search our peer node_modules, then any globally-specified probe paths
                // ../../.. to walk from X/node_modules/typescript/lib/tsserver.js to X/node_modules/
                var searchPaths = __spreadArrays([ts.combinePaths(this.projectService.getExecutingFilePath(), "../../..")], this.projectService.pluginProbeLocations);
                if (this.projectService.allowLocalPluginLoads) {
                    var local = ts.getDirectoryPath(this.canonicalConfigFilePath);
                    this.projectService.logger.info("Local plugin loading enabled; adding " + local + " to search paths");
                    searchPaths.unshift(local);
                }
                // Enable tsconfig-specified plugins
                if (options.plugins) {
                    for (var _i = 0, _a = options.plugins; _i < _a.length; _i++) {
                        var pluginConfigEntry = _a[_i];
                        this.enablePlugin(pluginConfigEntry, searchPaths, pluginConfigOverrides);
                    }
                }
                this.enableGlobalPlugins(options, pluginConfigOverrides);
            };
            /**
             * Get the errors that dont have any file name associated
             */
            ConfiguredProject.prototype.getGlobalProjectErrors = function () {
                return ts.filter(this.projectErrors, function (diagnostic) { return !diagnostic.file; }) || server.emptyArray;
            };
            /**
             * Get all the project errors
             */
            ConfiguredProject.prototype.getAllProjectErrors = function () {
                return this.projectErrors || server.emptyArray;
            };
            ConfiguredProject.prototype.setProjectErrors = function (projectErrors) {
                this.projectErrors = projectErrors;
            };
            ConfiguredProject.prototype.setTypeAcquisition = function (newTypeAcquisition) {
                this.typeAcquisition = this.removeLocalTypingsFromTypeAcquisition(newTypeAcquisition);
            };
            ConfiguredProject.prototype.getTypeAcquisition = function () {
                return this.typeAcquisition || {};
            };
            /*@internal*/
            ConfiguredProject.prototype.watchWildcards = function (wildcardDirectories) {
                var _this = this;
                ts.updateWatchingWildcardDirectories(this.directoriesWatchedForWildcards || (this.directoriesWatchedForWildcards = new ts.Map()), wildcardDirectories, 
                // Create new directory watcher
                function (directory, flags) { return _this.projectService.watchWildcardDirectory(directory, flags, _this); });
            };
            /*@internal*/
            ConfiguredProject.prototype.stopWatchingWildCards = function () {
                if (this.directoriesWatchedForWildcards) {
                    ts.clearMap(this.directoriesWatchedForWildcards, ts.closeFileWatcherOf);
                    this.directoriesWatchedForWildcards = undefined;
                }
            };
            ConfiguredProject.prototype.close = function () {
                if (this.configFileWatcher) {
                    this.configFileWatcher.close();
                    this.configFileWatcher = undefined;
                }
                this.stopWatchingWildCards();
                this.projectErrors = undefined;
                this.configFileSpecs = undefined;
                this.openFileWatchTriggered.clear();
                this.compilerHost = undefined;
                _super.prototype.close.call(this);
            };
            /* @internal */
            ConfiguredProject.prototype.addExternalProjectReference = function () {
                this.externalProjectRefCount++;
            };
            /* @internal */
            ConfiguredProject.prototype.deleteExternalProjectReference = function () {
                this.externalProjectRefCount--;
            };
            /* @internal */
            ConfiguredProject.prototype.isSolution = function () {
                return this.getRootFilesMap().size === 0 &&
                    !this.canConfigFileJsonReportNoInputFiles;
            };
            /* @internal */
            /** Find the configured project from the project references in project which contains the info directly */
            ConfiguredProject.prototype.getDefaultChildProjectFromProjectWithReferences = function (info) {
                return server.forEachResolvedProjectReferenceProject(this, function (child) { return server.projectContainsInfoDirectly(child, info) ?
                    child :
                    undefined; }, server.ProjectReferenceProjectLoadKind.Find);
            };
            /** Returns true if the project is needed by any of the open script info/external project */
            /* @internal */
            ConfiguredProject.prototype.hasOpenRef = function () {
                var _this = this;
                if (!!this.externalProjectRefCount) {
                    return true;
                }
                // Closed project doesnt have any reference
                if (this.isClosed()) {
                    return false;
                }
                var configFileExistenceInfo = this.projectService.getConfigFileExistenceInfo(this);
                if (this.projectService.hasPendingProjectUpdate(this)) {
                    // If there is pending update for this project,
                    // we dont know if this project would be needed by any of the open files impacted by this config file
                    // In that case keep the project alive if there are open files impacted by this project
                    return !!configFileExistenceInfo.openFilesImpactedByConfigFile.size;
                }
                // If there is no pending update for this project,
                // We know exact set of open files that get impacted by this configured project as the files in the project
                // The project is referenced only if open files impacted by this project are present in this project
                return ts.forEachEntry(configFileExistenceInfo.openFilesImpactedByConfigFile, function (_value, infoPath) {
                    var info = _this.projectService.getScriptInfoForPath(infoPath);
                    return _this.containsScriptInfo(info) ||
                        !!server.forEachResolvedProjectReferenceProject(_this, function (child) { return child.containsScriptInfo(info); }, server.ProjectReferenceProjectLoadKind.Find);
                }) || false;
            };
            /*@internal*/
            ConfiguredProject.prototype.hasExternalProjectRef = function () {
                return !!this.externalProjectRefCount;
            };
            ConfiguredProject.prototype.getEffectiveTypeRoots = function () {
                return ts.getEffectiveTypeRoots(this.getCompilationSettings(), this.directoryStructureHost) || [];
            };
            /*@internal*/
            ConfiguredProject.prototype.updateErrorOnNoInputFiles = function (fileNameResult) {
                ts.updateErrorForNoInputFiles(fileNameResult, this.getConfigFilePath(), this.configFileSpecs, this.projectErrors, this.canConfigFileJsonReportNoInputFiles);
            };
            return ConfiguredProject;
        }(Project));
        server.ConfiguredProject = ConfiguredProject;
        /**
         * Project whose configuration is handled externally, such as in a '.csproj'.
         * These are created only if a host explicitly calls `openExternalProject`.
         */
        var ExternalProject = /** @class */ (function (_super) {
            __extends(ExternalProject, _super);
            /*@internal*/
            function ExternalProject(externalProjectName, projectService, documentRegistry, compilerOptions, lastFileExceededProgramSize, compileOnSaveEnabled, projectFilePath, pluginConfigOverrides, watchOptions) {
                var _this = _super.call(this, externalProjectName, ProjectKind.External, projectService, documentRegistry, 
                /*hasExplicitListOfFiles*/ true, lastFileExceededProgramSize, compilerOptions, compileOnSaveEnabled, watchOptions, projectService.host, ts.getDirectoryPath(projectFilePath || ts.normalizeSlashes(externalProjectName))) || this;
                _this.externalProjectName = externalProjectName;
                _this.compileOnSaveEnabled = compileOnSaveEnabled;
                _this.excludedFiles = [];
                _this.enableGlobalPlugins(_this.getCompilerOptions(), pluginConfigOverrides);
                return _this;
            }
            ExternalProject.prototype.updateGraph = function () {
                var result = _super.prototype.updateGraph.call(this);
                this.projectService.sendProjectTelemetry(this);
                return result;
            };
            ExternalProject.prototype.getExcludedFiles = function () {
                return this.excludedFiles;
            };
            ExternalProject.prototype.getTypeAcquisition = function () {
                return this.typeAcquisition || {};
            };
            ExternalProject.prototype.setTypeAcquisition = function (newTypeAcquisition) {
                ts.Debug.assert(!!newTypeAcquisition, "newTypeAcquisition may not be null/undefined");
                ts.Debug.assert(!!newTypeAcquisition.include, "newTypeAcquisition.include may not be null/undefined");
                ts.Debug.assert(!!newTypeAcquisition.exclude, "newTypeAcquisition.exclude may not be null/undefined");
                ts.Debug.assert(typeof newTypeAcquisition.enable === "boolean", "newTypeAcquisition.enable may not be null/undefined");
                this.typeAcquisition = this.removeLocalTypingsFromTypeAcquisition(newTypeAcquisition);
            };
            return ExternalProject;
        }(Project));
        server.ExternalProject = ExternalProject;
        /* @internal */
        function isInferredProject(project) {
            return project.projectKind === ProjectKind.Inferred;
        }
        server.isInferredProject = isInferredProject;
        /* @internal */
        function isConfiguredProject(project) {
            return project.projectKind === ProjectKind.Configured;
        }
        server.isConfiguredProject = isConfiguredProject;
        /* @internal */
        function isExternalProject(project) {
            return project.projectKind === ProjectKind.External;
        }
        server.isExternalProject = isExternalProject;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        server.maxProgramSizeForNonTsFiles = 20 * 1024 * 1024;
        /*@internal*/
        server.maxFileSize = 4 * 1024 * 1024;
        server.ProjectsUpdatedInBackgroundEvent = "projectsUpdatedInBackground";
        server.ProjectLoadingStartEvent = "projectLoadingStart";
        server.ProjectLoadingFinishEvent = "projectLoadingFinish";
        server.LargeFileReferencedEvent = "largeFileReferenced";
        server.ConfigFileDiagEvent = "configFileDiag";
        server.ProjectLanguageServiceStateEvent = "projectLanguageServiceState";
        server.ProjectInfoTelemetryEvent = "projectInfo";
        server.OpenFileInfoTelemetryEvent = "openFileInfo";
        function prepareConvertersForEnumLikeCompilerOptions(commandLineOptions) {
            var map = new ts.Map();
            for (var _i = 0, commandLineOptions_1 = commandLineOptions; _i < commandLineOptions_1.length; _i++) {
                var option = commandLineOptions_1[_i];
                if (typeof option.type === "object") {
                    var optionMap = option.type;
                    // verify that map contains only numbers
                    optionMap.forEach(function (value) {
                        ts.Debug.assert(typeof value === "number");
                    });
                    map.set(option.name, optionMap);
                }
            }
            return map;
        }
        var compilerOptionConverters = prepareConvertersForEnumLikeCompilerOptions(ts.optionDeclarations);
        var watchOptionsConverters = prepareConvertersForEnumLikeCompilerOptions(ts.optionsForWatch);
        var indentStyle = new ts.Map(ts.getEntries({
            none: ts.IndentStyle.None,
            block: ts.IndentStyle.Block,
            smart: ts.IndentStyle.Smart
        }));
        /**
         * How to understand this block:
         *  * The 'match' property is a regexp that matches a filename.
         *  * If 'match' is successful, then:
         *     * All files from 'exclude' are removed from the project. See below.
         *     * All 'types' are included in ATA
         *  * What the heck is 'exclude' ?
         *     * An array of an array of strings and numbers
         *     * Each array is:
         *       * An array of strings and numbers
         *       * The strings are literals
         *       * The numbers refer to capture group indices from the 'match' regexp
         *          * Remember that '1' is the first group
         *       * These are concatenated together to form a new regexp
         *       * Filenames matching these regexps are excluded from the project
         * This default value is tested in tsserverProjectSystem.ts; add tests there
         *   if you are changing this so that you can be sure your regexp works!
         */
        var defaultTypeSafeList = {
            "jquery": {
                // jquery files can have names like "jquery-1.10.2.min.js" (or "jquery.intellisense.js")
                match: /jquery(-(\.?\d+)+)?(\.intellisense)?(\.min)?\.js$/i,
                types: ["jquery"]
            },
            "WinJS": {
                // e.g. c:/temp/UWApp1/lib/winjs-4.0.1/js/base.js
                match: /^(.*\/winjs-[.\d]+)\/js\/base\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["winjs"] // And fetch the @types package for WinJS
            },
            "Kendo": {
                // e.g. /Kendo3/wwwroot/lib/kendo/kendo.all.min.js
                match: /^(.*\/kendo(-ui)?)\/kendo\.all(\.min)?\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["kendo-ui"]
            },
            "Office Nuget": {
                // e.g. /scripts/Office/1/excel-15.debug.js
                match: /^(.*\/office\/1)\/excel-\d+\.debug\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["office"] // @types package to fetch instead
            },
            "References": {
                match: /^(.*\/_references\.js)$/i,
                exclude: [["^", 1, "$"]]
            }
        };
        function convertFormatOptions(protocolOptions) {
            if (ts.isString(protocolOptions.indentStyle)) {
                protocolOptions.indentStyle = indentStyle.get(protocolOptions.indentStyle.toLowerCase());
                ts.Debug.assert(protocolOptions.indentStyle !== undefined);
            }
            return protocolOptions;
        }
        server.convertFormatOptions = convertFormatOptions;
        function convertCompilerOptions(protocolOptions) {
            compilerOptionConverters.forEach(function (mappedValues, id) {
                var propertyValue = protocolOptions[id];
                if (ts.isString(propertyValue)) {
                    protocolOptions[id] = mappedValues.get(propertyValue.toLowerCase());
                }
            });
            return protocolOptions;
        }
        server.convertCompilerOptions = convertCompilerOptions;
        function convertWatchOptions(protocolOptions) {
            var result;
            watchOptionsConverters.forEach(function (mappedValues, id) {
                var propertyValue = protocolOptions[id];
                if (propertyValue === undefined)
                    return;
                (result || (result = {}))[id] = ts.isString(propertyValue) ?
                    mappedValues.get(propertyValue.toLowerCase()) :
                    propertyValue;
            });
            return result;
        }
        server.convertWatchOptions = convertWatchOptions;
        function tryConvertScriptKindName(scriptKindName) {
            return ts.isString(scriptKindName) ? convertScriptKindName(scriptKindName) : scriptKindName;
        }
        server.tryConvertScriptKindName = tryConvertScriptKindName;
        function convertScriptKindName(scriptKindName) {
            switch (scriptKindName) {
                case "JS":
                    return 1 /* JS */;
                case "JSX":
                    return 2 /* JSX */;
                case "TS":
                    return 3 /* TS */;
                case "TSX":
                    return 4 /* TSX */;
                default:
                    return 0 /* Unknown */;
            }
        }
        server.convertScriptKindName = convertScriptKindName;
        /*@internal*/
        function convertUserPreferences(preferences) {
            var lazyConfiguredProjectsFromExternalProject = preferences.lazyConfiguredProjectsFromExternalProject, userPreferences = __rest(preferences, ["lazyConfiguredProjectsFromExternalProject"]);
            return userPreferences;
        }
        server.convertUserPreferences = convertUserPreferences;
        var fileNamePropertyReader = {
            getFileName: function (x) { return x; },
            getScriptKind: function (fileName, extraFileExtensions) {
                var result;
                if (extraFileExtensions) {
                    var fileExtension_1 = ts.getAnyExtensionFromPath(fileName);
                    if (fileExtension_1) {
                        ts.some(extraFileExtensions, function (info) {
                            if (info.extension === fileExtension_1) {
                                result = info.scriptKind;
                                return true;
                            }
                            return false;
                        });
                    }
                }
                return result; // TODO: GH#18217
            },
            hasMixedContent: function (fileName, extraFileExtensions) { return ts.some(extraFileExtensions, function (ext) { return ext.isMixedContent && ts.fileExtensionIs(fileName, ext.extension); }); },
        };
        var externalFilePropertyReader = {
            getFileName: function (x) { return x.fileName; },
            getScriptKind: function (x) { return tryConvertScriptKindName(x.scriptKind); },
            hasMixedContent: function (x) { return !!x.hasMixedContent; },
        };
        function findProjectByName(projectName, projects) {
            for (var _i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                var proj = projects_1[_i];
                if (proj.getProjectName() === projectName) {
                    return proj;
                }
            }
        }
        var ConfigFileWatcherStatus;
        (function (ConfigFileWatcherStatus) {
            ConfigFileWatcherStatus["ReloadingFiles"] = "Reloading configured projects for files";
            ConfigFileWatcherStatus["ReloadingInferredRootFiles"] = "Reloading configured projects for only inferred root files";
            ConfigFileWatcherStatus["UpdatedCallback"] = "Updated the callback";
            ConfigFileWatcherStatus["OpenFilesImpactedByConfigFileAdd"] = "File added to open files impacted by this config file";
            ConfigFileWatcherStatus["OpenFilesImpactedByConfigFileRemove"] = "File removed from open files impacted by this config file";
            ConfigFileWatcherStatus["RootOfInferredProjectTrue"] = "Open file was set as Inferred root";
            ConfigFileWatcherStatus["RootOfInferredProjectFalse"] = "Open file was set as not inferred root";
        })(ConfigFileWatcherStatus || (ConfigFileWatcherStatus = {}));
        function isOpenScriptInfo(infoOrFileNameOrConfig) {
            return !!infoOrFileNameOrConfig.containingProjects;
        }
        function isAncestorConfigFileInfo(infoOrFileNameOrConfig) {
            return !!infoOrFileNameOrConfig.configFileInfo;
        }
        /*@internal*/
        /** Kind of operation to perform to get project reference project */
        var ProjectReferenceProjectLoadKind;
        (function (ProjectReferenceProjectLoadKind) {
            /** Find existing project for project reference */
            ProjectReferenceProjectLoadKind[ProjectReferenceProjectLoadKind["Find"] = 0] = "Find";
            /** Find existing project or create one for the project reference */
            ProjectReferenceProjectLoadKind[ProjectReferenceProjectLoadKind["FindCreate"] = 1] = "FindCreate";
            /** Find existing project or create and load it for the project reference */
            ProjectReferenceProjectLoadKind[ProjectReferenceProjectLoadKind["FindCreateLoad"] = 2] = "FindCreateLoad";
        })(ProjectReferenceProjectLoadKind = server.ProjectReferenceProjectLoadKind || (server.ProjectReferenceProjectLoadKind = {}));
        function forEachResolvedProjectReferenceProject(project, cb, projectReferenceProjectLoadKind, reason) {
            var _a;
            var seenResolvedRefs;
            return worker((_a = project.getCurrentProgram()) === null || _a === void 0 ? void 0 : _a.getResolvedProjectReferences(), project.getCompilerOptions());
            function worker(resolvedProjectReferences, parentOptions) {
                var loadKind = parentOptions.disableReferencedProjectLoad ? ProjectReferenceProjectLoadKind.Find : projectReferenceProjectLoadKind;
                return ts.forEach(resolvedProjectReferences, function (ref) {
                    if (!ref)
                        return undefined;
                    var configFileName = server.toNormalizedPath(ref.sourceFile.fileName);
                    var canonicalPath = project.projectService.toCanonicalFileName(configFileName);
                    var seenValue = seenResolvedRefs === null || seenResolvedRefs === void 0 ? void 0 : seenResolvedRefs.get(canonicalPath);
                    if (seenValue !== undefined && seenValue >= loadKind) {
                        return undefined;
                    }
                    var child = project.projectService.findConfiguredProjectByProjectName(configFileName) || (loadKind === ProjectReferenceProjectLoadKind.Find ?
                        undefined :
                        loadKind === ProjectReferenceProjectLoadKind.FindCreate ?
                            project.projectService.createConfiguredProject(configFileName) :
                            loadKind === ProjectReferenceProjectLoadKind.FindCreateLoad ?
                                project.projectService.createAndLoadConfiguredProject(configFileName, reason) :
                                ts.Debug.assertNever(loadKind));
                    var result = child && cb(child);
                    if (result) {
                        return result;
                    }
                    (seenResolvedRefs || (seenResolvedRefs = new ts.Map())).set(canonicalPath, loadKind);
                    return worker(ref.references, ref.commandLine.options);
                });
            }
        }
        server.forEachResolvedProjectReferenceProject = forEachResolvedProjectReferenceProject;
        /*@internal*/
        function forEachResolvedProjectReference(project, cb) {
            var program = project.getCurrentProgram();
            return program && program.forEachResolvedProjectReference(cb);
        }
        server.forEachResolvedProjectReference = forEachResolvedProjectReference;
        function forEachPotentialProjectReference(project, cb) {
            return project.potentialProjectReferences &&
                ts.forEachKey(project.potentialProjectReferences, cb);
        }
        function forEachAnyProjectReferenceKind(project, cb, cbProjectRef, cbPotentialProjectRef) {
            return project.getCurrentProgram() ?
                forEachResolvedProjectReference(project, cb) :
                project.isInitialLoadPending() ?
                    forEachPotentialProjectReference(project, cbPotentialProjectRef) :
                    ts.forEach(project.getProjectReferences(), cbProjectRef);
        }
        function callbackRefProject(project, cb, refPath) {
            var refProject = refPath && project.projectService.configuredProjects.get(refPath);
            return refProject && cb(refProject);
        }
        function forEachReferencedProject(project, cb) {
            return forEachAnyProjectReferenceKind(project, function (resolvedRef) { return callbackRefProject(project, cb, resolvedRef && resolvedRef.sourceFile.path); }, function (projectRef) { return callbackRefProject(project, cb, project.toPath(projectRef.path)); }, function (potentialProjectRef) { return callbackRefProject(project, cb, potentialProjectRef); });
        }
        function getDetailWatchInfo(watchType, project) {
            return "Project: " + (project ? project.getProjectName() : "") + " WatchType: " + watchType;
        }
        function isScriptInfoWatchedFromNodeModules(info) {
            return !info.isScriptOpen() && info.mTime !== undefined;
        }
        /*@internal*/
        /** true if script info is part of project and is not in project because it is referenced from project reference source */
        function projectContainsInfoDirectly(project, info) {
            return project.containsScriptInfo(info) &&
                !project.isSourceOfProjectReferenceRedirect(info.path);
        }
        server.projectContainsInfoDirectly = projectContainsInfoDirectly;
        /*@internal*/
        function updateProjectIfDirty(project) {
            project.invalidateResolutionsOfFailedLookupLocations();
            return project.dirty && project.updateGraph();
        }
        server.updateProjectIfDirty = updateProjectIfDirty;
        function setProjectOptionsUsed(project) {
            if (server.isConfiguredProject(project)) {
                project.projectOptions = true;
            }
        }
        var ProjectService = /** @class */ (function () {
            function ProjectService(opts) {
                var _this = this;
                /**
                 * Container of all known scripts
                 */
                /*@internal*/
                this.filenameToScriptInfo = new ts.Map();
                this.scriptInfoInNodeModulesWatchers = new ts.Map();
                /**
                 * Contains all the deleted script info's version information so that
                 * it does not reset when creating script info again
                 * (and could have potentially collided with version where contents mismatch)
                 */
                this.filenameToScriptInfoVersion = new ts.Map();
                // Set of all '.js' files ever opened.
                this.allJsFilesForOpenFileTelemetry = new ts.Map();
                /**
                 * maps external project file name to list of config files that were the part of this project
                 */
                this.externalProjectToConfiguredProjectMap = new ts.Map();
                /**
                 * external projects (configuration and list of root files is not controlled by tsserver)
                 */
                this.externalProjects = [];
                /**
                 * projects built from openFileRoots
                 */
                this.inferredProjects = [];
                /**
                 * projects specified by a tsconfig.json file
                 */
                this.configuredProjects = new ts.Map();
                /**
                 * Open files: with value being project root path, and key being Path of the file that is open
                 */
                this.openFiles = new ts.Map();
                /* @internal */
                this.configFileForOpenFiles = new ts.Map();
                /**
                 * Map of open files that are opened without complete path but have projectRoot as current directory
                 */
                this.openFilesWithNonRootedDiskPath = new ts.Map();
                this.compilerOptionsForInferredProjectsPerProjectRoot = new ts.Map();
                this.watchOptionsForInferredProjectsPerProjectRoot = new ts.Map();
                /**
                 * Project size for configured or external projects
                 */
                this.projectToSizeMap = new ts.Map();
                /**
                 * This is a map of config file paths existence that doesnt need query to disk
                 * - The entry can be present because there is inferred project that needs to watch addition of config file to directory
                 *   In this case the exists could be true/false based on config file is present or not
                 * - Or it is present if we have configured project open with config file at that location
                 *   In this case the exists property is always true
                 */
                this.configFileExistenceInfoCache = new ts.Map();
                this.safelist = defaultTypeSafeList;
                this.legacySafelist = new ts.Map();
                this.pendingProjectUpdates = new ts.Map();
                /* @internal */
                this.pendingEnsureProjectForOpenFiles = false;
                /** Tracks projects that we have already sent telemetry for. */
                this.seenProjects = new ts.Map();
                this.host = opts.host;
                this.logger = opts.logger;
                this.cancellationToken = opts.cancellationToken;
                this.useSingleInferredProject = opts.useSingleInferredProject;
                this.useInferredProjectPerProjectRoot = opts.useInferredProjectPerProjectRoot;
                this.typingsInstaller = opts.typingsInstaller || server.nullTypingsInstaller;
                this.throttleWaitMilliseconds = opts.throttleWaitMilliseconds;
                this.eventHandler = opts.eventHandler;
                this.suppressDiagnosticEvents = opts.suppressDiagnosticEvents;
                this.globalPlugins = opts.globalPlugins || server.emptyArray;
                this.pluginProbeLocations = opts.pluginProbeLocations || server.emptyArray;
                this.allowLocalPluginLoads = !!opts.allowLocalPluginLoads;
                this.typesMapLocation = (opts.typesMapLocation === undefined) ? ts.combinePaths(ts.getDirectoryPath(this.getExecutingFilePath()), "typesMap.json") : opts.typesMapLocation;
                if (opts.serverMode !== undefined) {
                    this.serverMode = opts.serverMode;
                    this.syntaxOnly = this.serverMode === ts.LanguageServiceMode.Syntactic;
                }
                else if (opts.syntaxOnly) {
                    this.serverMode = ts.LanguageServiceMode.Syntactic;
                    this.syntaxOnly = true;
                }
                else {
                    this.serverMode = ts.LanguageServiceMode.Semantic;
                    this.syntaxOnly = false;
                }
                ts.Debug.assert(!!this.host.createHash, "'ServerHost.createHash' is required for ProjectService");
                if (this.host.realpath) {
                    this.realpathToScriptInfos = ts.createMultiMap();
                }
                this.currentDirectory = server.toNormalizedPath(this.host.getCurrentDirectory());
                this.toCanonicalFileName = ts.createGetCanonicalFileName(this.host.useCaseSensitiveFileNames);
                this.globalCacheLocationDirectoryPath = this.typingsInstaller.globalTypingsCacheLocation
                    ? ts.ensureTrailingDirectorySeparator(this.toPath(this.typingsInstaller.globalTypingsCacheLocation))
                    : undefined;
                this.throttledOperations = new server.ThrottledOperations(this.host, this.logger);
                if (this.typesMapLocation) {
                    this.loadTypesMap();
                }
                else {
                    this.logger.info("No types map provided; using the default");
                }
                this.typingsInstaller.attach(this);
                this.typingsCache = new server.TypingsCache(this.typingsInstaller);
                this.hostConfiguration = {
                    formatCodeOptions: ts.getDefaultFormatCodeSettings(this.host.newLine),
                    preferences: ts.emptyOptions,
                    hostInfo: "Unknown host",
                    extraFileExtensions: [],
                };
                this.documentRegistry = ts.createDocumentRegistryInternal(this.host.useCaseSensitiveFileNames, this.currentDirectory, this);
                var watchLogLevel = this.logger.hasLevel(server.LogLevel.verbose) ? ts.WatchLogLevel.Verbose :
                    this.logger.loggingEnabled() ? ts.WatchLogLevel.TriggerOnly : ts.WatchLogLevel.None;
                var log = watchLogLevel !== ts.WatchLogLevel.None ? (function (s) { return _this.logger.info(s); }) : ts.noop;
                this.packageJsonCache = server.createPackageJsonCache(this);
                this.watchFactory = this.serverMode !== ts.LanguageServiceMode.Semantic ?
                    {
                        watchFile: ts.returnNoopFileWatcher,
                        watchFilePath: ts.returnNoopFileWatcher,
                        watchDirectory: ts.returnNoopFileWatcher,
                    } :
                    ts.getWatchFactory(watchLogLevel, log, getDetailWatchInfo);
            }
            ProjectService.prototype.toPath = function (fileName) {
                return ts.toPath(fileName, this.currentDirectory, this.toCanonicalFileName);
            };
            /*@internal*/
            ProjectService.prototype.getExecutingFilePath = function () {
                return this.getNormalizedAbsolutePath(this.host.getExecutingFilePath());
            };
            /*@internal*/
            ProjectService.prototype.getNormalizedAbsolutePath = function (fileName) {
                return ts.getNormalizedAbsolutePath(fileName, this.host.getCurrentDirectory());
            };
            /*@internal*/
            ProjectService.prototype.setDocument = function (key, path, sourceFile) {
                var info = ts.Debug.checkDefined(this.getScriptInfoForPath(path));
                info.cacheSourceFile = { key: key, sourceFile: sourceFile };
            };
            /*@internal*/
            ProjectService.prototype.getDocument = function (key, path) {
                var info = this.getScriptInfoForPath(path);
                return info && info.cacheSourceFile && info.cacheSourceFile.key === key ? info.cacheSourceFile.sourceFile : undefined;
            };
            /* @internal */
            ProjectService.prototype.ensureInferredProjectsUpToDate_TestOnly = function () {
                this.ensureProjectStructuresUptoDate();
            };
            /* @internal */
            ProjectService.prototype.getCompilerOptionsForInferredProjects = function () {
                return this.compilerOptionsForInferredProjects;
            };
            /* @internal */
            ProjectService.prototype.onUpdateLanguageServiceStateForProject = function (project, languageServiceEnabled) {
                if (!this.eventHandler) {
                    return;
                }
                var event = {
                    eventName: server.ProjectLanguageServiceStateEvent,
                    data: { project: project, languageServiceEnabled: languageServiceEnabled }
                };
                this.eventHandler(event);
            };
            ProjectService.prototype.loadTypesMap = function () {
                try {
                    var fileContent = this.host.readFile(this.typesMapLocation); // TODO: GH#18217
                    if (fileContent === undefined) {
                        this.logger.info("Provided types map file \"" + this.typesMapLocation + "\" doesn't exist");
                        return;
                    }
                    var raw = JSON.parse(fileContent);
                    // Parse the regexps
                    for (var _i = 0, _a = Object.keys(raw.typesMap); _i < _a.length; _i++) {
                        var k = _a[_i];
                        raw.typesMap[k].match = new RegExp(raw.typesMap[k].match, "i");
                    }
                    // raw is now fixed and ready
                    this.safelist = raw.typesMap;
                    for (var key in raw.simpleMap) {
                        if (raw.simpleMap.hasOwnProperty(key)) {
                            this.legacySafelist.set(key, raw.simpleMap[key].toLowerCase());
                        }
                    }
                }
                catch (e) {
                    this.logger.info("Error loading types map: " + e);
                    this.safelist = defaultTypeSafeList;
                    this.legacySafelist.clear();
                }
            };
            ProjectService.prototype.updateTypingsForProject = function (response) {
                var project = this.findProject(response.projectName);
                if (!project) {
                    return;
                }
                switch (response.kind) {
                    case server.ActionSet:
                        // Update the typing files and update the project
                        project.updateTypingFiles(this.typingsCache.updateTypingsForProject(response.projectName, response.compilerOptions, response.typeAcquisition, response.unresolvedImports, response.typings));
                        break;
                    case server.ActionInvalidate:
                        // Do not clear resolution cache, there was changes detected in typings, so enque typing request and let it get us correct results
                        this.typingsCache.enqueueInstallTypingsForProject(project, project.lastCachedUnresolvedImportsList, /*forceRefresh*/ true);
                        return;
                }
                this.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project);
            };
            /*@internal*/
            ProjectService.prototype.delayEnsureProjectForOpenFiles = function () {
                var _this = this;
                this.pendingEnsureProjectForOpenFiles = true;
                this.throttledOperations.schedule("*ensureProjectForOpenFiles*", /*delay*/ 2500, function () {
                    if (_this.pendingProjectUpdates.size !== 0) {
                        _this.delayEnsureProjectForOpenFiles();
                    }
                    else {
                        if (_this.pendingEnsureProjectForOpenFiles) {
                            _this.ensureProjectForOpenFiles();
                            // Send the event to notify that there were background project updates
                            // send current list of open files
                            _this.sendProjectsUpdatedInBackgroundEvent();
                        }
                    }
                });
            };
            ProjectService.prototype.delayUpdateProjectGraph = function (project) {
                var _this = this;
                project.markAsDirty();
                var projectName = project.getProjectName();
                this.pendingProjectUpdates.set(projectName, project);
                this.throttledOperations.schedule(projectName, /*delay*/ 250, function () {
                    if (_this.pendingProjectUpdates.delete(projectName)) {
                        updateProjectIfDirty(project);
                    }
                });
            };
            /*@internal*/
            ProjectService.prototype.hasPendingProjectUpdate = function (project) {
                return this.pendingProjectUpdates.has(project.getProjectName());
            };
            /* @internal */
            ProjectService.prototype.sendProjectsUpdatedInBackgroundEvent = function () {
                var _this = this;
                if (!this.eventHandler) {
                    return;
                }
                var event = {
                    eventName: server.ProjectsUpdatedInBackgroundEvent,
                    data: {
                        openFiles: ts.arrayFrom(this.openFiles.keys(), function (path) { return _this.getScriptInfoForPath(path).fileName; })
                    }
                };
                this.eventHandler(event);
            };
            /* @internal */
            ProjectService.prototype.sendLargeFileReferencedEvent = function (file, fileSize) {
                if (!this.eventHandler) {
                    return;
                }
                var event = {
                    eventName: server.LargeFileReferencedEvent,
                    data: { file: file, fileSize: fileSize, maxFileSize: server.maxFileSize }
                };
                this.eventHandler(event);
            };
            /* @internal */
            ProjectService.prototype.sendProjectLoadingStartEvent = function (project, reason) {
                if (!this.eventHandler) {
                    return;
                }
                project.sendLoadingProjectFinish = true;
                var event = {
                    eventName: server.ProjectLoadingStartEvent,
                    data: { project: project, reason: reason }
                };
                this.eventHandler(event);
            };
            /* @internal */
            ProjectService.prototype.sendProjectLoadingFinishEvent = function (project) {
                if (!this.eventHandler || !project.sendLoadingProjectFinish) {
                    return;
                }
                project.sendLoadingProjectFinish = false;
                var event = {
                    eventName: server.ProjectLoadingFinishEvent,
                    data: { project: project }
                };
                this.eventHandler(event);
            };
            /* @internal */
            ProjectService.prototype.sendPerformanceEvent = function (kind, durationMs) {
                if (this.performanceEventHandler) {
                    this.performanceEventHandler({ kind: kind, durationMs: durationMs });
                }
            };
            /* @internal */
            ProjectService.prototype.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles = function (project) {
                this.delayUpdateProjectGraph(project);
                this.delayEnsureProjectForOpenFiles();
            };
            ProjectService.prototype.delayUpdateProjectGraphs = function (projects, clearSourceMapperCache) {
                if (projects.length) {
                    for (var _i = 0, projects_2 = projects; _i < projects_2.length; _i++) {
                        var project = projects_2[_i];
                        // Even if program doesnt change, clear the source mapper cache
                        if (clearSourceMapperCache)
                            project.clearSourceMapperCache();
                        this.delayUpdateProjectGraph(project);
                    }
                    this.delayEnsureProjectForOpenFiles();
                }
            };
            ProjectService.prototype.setCompilerOptionsForInferredProjects = function (projectCompilerOptions, projectRootPath) {
                ts.Debug.assert(projectRootPath === undefined || this.useInferredProjectPerProjectRoot, "Setting compiler options per project root path is only supported when useInferredProjectPerProjectRoot is enabled");
                var compilerOptions = convertCompilerOptions(projectCompilerOptions);
                var watchOptions = convertWatchOptions(projectCompilerOptions);
                // always set 'allowNonTsExtensions' for inferred projects since user cannot configure it from the outside
                // previously we did not expose a way for user to change these settings and this option was enabled by default
                compilerOptions.allowNonTsExtensions = true;
                var canonicalProjectRootPath = projectRootPath && this.toCanonicalFileName(projectRootPath);
                if (canonicalProjectRootPath) {
                    this.compilerOptionsForInferredProjectsPerProjectRoot.set(canonicalProjectRootPath, compilerOptions);
                    this.watchOptionsForInferredProjectsPerProjectRoot.set(canonicalProjectRootPath, watchOptions || false);
                }
                else {
                    this.compilerOptionsForInferredProjects = compilerOptions;
                    this.watchOptionsForInferredProjects = watchOptions;
                }
                for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                    var project = _a[_i];
                    // Only update compiler options in the following cases:
                    // - Inferred projects without a projectRootPath, if the new options do not apply to
                    //   a workspace root
                    // - Inferred projects with a projectRootPath, if the new options do not apply to a
                    //   workspace root and there is no more specific set of options for that project's
                    //   root path
                    // - Inferred projects with a projectRootPath, if the new options apply to that
                    //   project root path.
                    if (canonicalProjectRootPath ?
                        project.projectRootPath === canonicalProjectRootPath :
                        !project.projectRootPath || !this.compilerOptionsForInferredProjectsPerProjectRoot.has(project.projectRootPath)) {
                        project.setCompilerOptions(compilerOptions);
                        project.setWatchOptions(watchOptions);
                        project.compileOnSaveEnabled = compilerOptions.compileOnSave;
                        project.markAsDirty();
                        this.delayUpdateProjectGraph(project);
                    }
                }
                this.delayEnsureProjectForOpenFiles();
            };
            ProjectService.prototype.findProject = function (projectName) {
                if (projectName === undefined) {
                    return undefined;
                }
                if (server.isInferredProjectName(projectName)) {
                    return findProjectByName(projectName, this.inferredProjects);
                }
                return this.findExternalProjectByProjectName(projectName) || this.findConfiguredProjectByProjectName(server.toNormalizedPath(projectName));
            };
            /* @internal */
            ProjectService.prototype.forEachProject = function (cb) {
                this.externalProjects.forEach(cb);
                this.configuredProjects.forEach(cb);
                this.inferredProjects.forEach(cb);
            };
            /* @internal */
            ProjectService.prototype.forEachEnabledProject = function (cb) {
                this.forEachProject(function (project) {
                    if (!project.isOrphan() && project.languageServiceEnabled) {
                        cb(project);
                    }
                });
            };
            ProjectService.prototype.getDefaultProjectForFile = function (fileName, ensureProject) {
                return ensureProject ? this.ensureDefaultProjectForFile(fileName) : this.tryGetDefaultProjectForFile(fileName);
            };
            /* @internal */
            ProjectService.prototype.tryGetDefaultProjectForFile = function (fileName) {
                var scriptInfo = this.getScriptInfoForNormalizedPath(fileName);
                return scriptInfo && !scriptInfo.isOrphan() ? scriptInfo.getDefaultProject() : undefined;
            };
            /* @internal */
            ProjectService.prototype.ensureDefaultProjectForFile = function (fileName) {
                return this.tryGetDefaultProjectForFile(fileName) || this.doEnsureDefaultProjectForFile(fileName);
            };
            ProjectService.prototype.doEnsureDefaultProjectForFile = function (fileName) {
                this.ensureProjectStructuresUptoDate();
                var scriptInfo = this.getScriptInfoForNormalizedPath(fileName);
                return scriptInfo ? scriptInfo.getDefaultProject() : (this.logErrorForScriptInfoNotFound(fileName), server.Errors.ThrowNoProject());
            };
            ProjectService.prototype.getScriptInfoEnsuringProjectsUptoDate = function (uncheckedFileName) {
                this.ensureProjectStructuresUptoDate();
                return this.getScriptInfo(uncheckedFileName);
            };
            /**
             * Ensures the project structures are upto date
             * This means,
             * - we go through all the projects and update them if they are dirty
             * - if updates reflect some change in structure or there was pending request to ensure projects for open files
             *   ensure that each open script info has project
             */
            ProjectService.prototype.ensureProjectStructuresUptoDate = function () {
                var hasChanges = this.pendingEnsureProjectForOpenFiles;
                this.pendingProjectUpdates.clear();
                var updateGraph = function (project) {
                    hasChanges = updateProjectIfDirty(project) || hasChanges;
                };
                this.externalProjects.forEach(updateGraph);
                this.configuredProjects.forEach(updateGraph);
                this.inferredProjects.forEach(updateGraph);
                if (hasChanges) {
                    this.ensureProjectForOpenFiles();
                }
            };
            ProjectService.prototype.getFormatCodeOptions = function (file) {
                var info = this.getScriptInfoForNormalizedPath(file);
                return info && info.getFormatCodeSettings() || this.hostConfiguration.formatCodeOptions;
            };
            ProjectService.prototype.getPreferences = function (file) {
                var info = this.getScriptInfoForNormalizedPath(file);
                return __assign(__assign({}, this.hostConfiguration.preferences), info && info.getPreferences());
            };
            ProjectService.prototype.getHostFormatCodeOptions = function () {
                return this.hostConfiguration.formatCodeOptions;
            };
            ProjectService.prototype.getHostPreferences = function () {
                return this.hostConfiguration.preferences;
            };
            ProjectService.prototype.onSourceFileChanged = function (fileName, eventKind, path) {
                var info = this.getScriptInfoForPath(path);
                if (!info) {
                    this.logger.msg("Error: got watch notification for unknown file: " + fileName);
                }
                else {
                    if (info.containingProjects) {
                        info.containingProjects.forEach(function (project) { return project.resolutionCache.removeResolutionsFromProjectReferenceRedirects(info.path); });
                    }
                    if (eventKind === ts.FileWatcherEventKind.Deleted) {
                        // File was deleted
                        this.handleDeletedFile(info);
                    }
                    else if (!info.isScriptOpen()) {
                        // file has been changed which might affect the set of referenced files in projects that include
                        // this file and set of inferred projects
                        info.delayReloadNonMixedContentFile();
                        this.delayUpdateProjectGraphs(info.containingProjects, /*clearSourceMapperCache*/ false);
                        this.handleSourceMapProjects(info);
                    }
                }
            };
            ProjectService.prototype.handleSourceMapProjects = function (info) {
                // Change in d.ts, update source projects as well
                if (info.sourceMapFilePath) {
                    if (ts.isString(info.sourceMapFilePath)) {
                        var sourceMapFileInfo = this.getScriptInfoForPath(info.sourceMapFilePath);
                        this.delayUpdateSourceInfoProjects(sourceMapFileInfo && sourceMapFileInfo.sourceInfos);
                    }
                    else {
                        this.delayUpdateSourceInfoProjects(info.sourceMapFilePath.sourceInfos);
                    }
                }
                // Change in mapInfo, update declarationProjects and source projects
                this.delayUpdateSourceInfoProjects(info.sourceInfos);
                if (info.declarationInfoPath) {
                    this.delayUpdateProjectsOfScriptInfoPath(info.declarationInfoPath);
                }
            };
            ProjectService.prototype.delayUpdateSourceInfoProjects = function (sourceInfos) {
                var _this = this;
                if (sourceInfos) {
                    sourceInfos.forEach(function (_value, path) { return _this.delayUpdateProjectsOfScriptInfoPath(path); });
                }
            };
            ProjectService.prototype.delayUpdateProjectsOfScriptInfoPath = function (path) {
                var info = this.getScriptInfoForPath(path);
                if (info) {
                    this.delayUpdateProjectGraphs(info.containingProjects, /*clearSourceMapperCache*/ true);
                }
            };
            ProjectService.prototype.handleDeletedFile = function (info) {
                this.stopWatchingScriptInfo(info);
                if (!info.isScriptOpen()) {
                    this.deleteScriptInfo(info);
                    // capture list of projects since detachAllProjects will wipe out original list
                    var containingProjects = info.containingProjects.slice();
                    info.detachAllProjects();
                    // update projects to make sure that set of referenced files is correct
                    this.delayUpdateProjectGraphs(containingProjects, /*clearSourceMapperCache*/ false);
                    this.handleSourceMapProjects(info);
                    info.closeSourceMapFileWatcher();
                    // need to recalculate source map from declaration file
                    if (info.declarationInfoPath) {
                        var declarationInfo = this.getScriptInfoForPath(info.declarationInfoPath);
                        if (declarationInfo) {
                            declarationInfo.sourceMapFilePath = undefined;
                        }
                    }
                }
            };
            /**
             * This is to watch whenever files are added or removed to the wildcard directories
             */
            /*@internal*/
            ProjectService.prototype.watchWildcardDirectory = function (directory, flags, project) {
                var _this = this;
                var watchOptions = this.getWatchOptions(project);
                return this.watchFactory.watchDirectory(this.host, directory, function (fileOrDirectory) {
                    var fileOrDirectoryPath = _this.toPath(fileOrDirectory);
                    var fsResult = project.getCachedDirectoryStructureHost().addOrDeleteFileOrDirectory(fileOrDirectory, fileOrDirectoryPath);
                    var configFileName = project.getConfigFilePath();
                    if (ts.getBaseFileName(fileOrDirectoryPath) === "package.json" && !ts.isInsideNodeModules(fileOrDirectoryPath) &&
                        (fsResult && fsResult.fileExists || !fsResult && _this.host.fileExists(fileOrDirectoryPath))) {
                        _this.logger.info("Project: " + configFileName + " Detected new package.json: " + fileOrDirectory);
                        _this.onAddPackageJson(fileOrDirectoryPath);
                    }
                    if (ts.isIgnoredFileFromWildCardWatching({
                        watchedDirPath: directory,
                        fileOrDirectory: fileOrDirectory,
                        fileOrDirectoryPath: fileOrDirectoryPath,
                        configFileName: configFileName,
                        configFileSpecs: project.configFileSpecs,
                        extraFileExtensions: _this.hostConfiguration.extraFileExtensions,
                        currentDirectory: _this.currentDirectory,
                        options: project.getCompilationSettings(),
                        program: project.getCurrentProgram(),
                        useCaseSensitiveFileNames: _this.host.useCaseSensitiveFileNames,
                        writeLog: function (s) { return _this.logger.info(s); }
                    }))
                        return;
                    // don't trigger callback on open, existing files
                    if (project.fileIsOpen(fileOrDirectoryPath)) {
                        if (project.pendingReload !== ts.ConfigFileProgramReloadLevel.Full) {
                            var info = ts.Debug.checkDefined(_this.getScriptInfoForPath(fileOrDirectoryPath));
                            if (info.isAttached(project)) {
                                project.openFileWatchTriggered.set(fileOrDirectoryPath, true);
                            }
                            else {
                                project.pendingReload = ts.ConfigFileProgramReloadLevel.Partial;
                                _this.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project);
                            }
                        }
                        return;
                    }
                    // Reload is pending, do the reload
                    if (project.pendingReload !== ts.ConfigFileProgramReloadLevel.Full) {
                        project.pendingReload = ts.ConfigFileProgramReloadLevel.Partial;
                        _this.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project);
                    }
                }, flags, watchOptions, ts.WatchType.WildcardDirectory, project);
            };
            /** Gets the config file existence info for the configured project */
            /*@internal*/
            ProjectService.prototype.getConfigFileExistenceInfo = function (project) {
                return this.configFileExistenceInfoCache.get(project.canonicalConfigFilePath);
            };
            /*@internal*/
            ProjectService.prototype.onConfigChangedForConfiguredProject = function (project, eventKind) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(project);
                if (eventKind === ts.FileWatcherEventKind.Deleted) {
                    // Update the cached status
                    // We arent updating or removing the cached config file presence info as that will be taken care of by
                    // setConfigFilePresenceByClosedConfigFile when the project is closed (depending on tracking open files)
                    configFileExistenceInfo.exists = false;
                    this.removeProject(project);
                    // Reload the configured projects for the open files in the map as they are affected by this config file
                    // Since the configured project was deleted, we want to reload projects for all the open files including files
                    // that are not root of the inferred project
                    this.logConfigFileWatchUpdate(project.getConfigFilePath(), project.canonicalConfigFilePath, configFileExistenceInfo, "Reloading configured projects for files" /* ReloadingFiles */);
                    this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, /*ignoreIfNotInferredProjectRoot*/ false);
                }
                else {
                    this.logConfigFileWatchUpdate(project.getConfigFilePath(), project.canonicalConfigFilePath, configFileExistenceInfo, "Reloading configured projects for only inferred root files" /* ReloadingInferredRootFiles */);
                    // Skip refresh if project is not yet loaded
                    if (project.isInitialLoadPending())
                        return;
                    project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                    project.pendingReloadReason = "Change in config file detected";
                    this.delayUpdateProjectGraph(project);
                    // As we scheduled the update on configured project graph,
                    // we would need to schedule the project reload for only the root of inferred projects
                    this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, /*ignoreIfNotInferredProjectRoot*/ true);
                }
            };
            /**
             * This is the callback function for the config file add/remove/change at any location
             * that matters to open script info but doesnt have configured project open
             * for the config file
             */
            ProjectService.prototype.onConfigFileChangeForOpenScriptInfo = function (configFileName, eventKind) {
                // This callback is called only if we dont have config file project for this config file
                var canonicalConfigPath = server.normalizedPathToPath(configFileName, this.currentDirectory, this.toCanonicalFileName);
                var configFileExistenceInfo = this.configFileExistenceInfoCache.get(canonicalConfigPath);
                configFileExistenceInfo.exists = (eventKind !== ts.FileWatcherEventKind.Deleted);
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigPath, configFileExistenceInfo, "Reloading configured projects for files" /* ReloadingFiles */);
                // Because there is no configured project open for the config file, the tracking open files map
                // will only have open files that need the re-detection of the project and hence
                // reload projects for all the tracking open files in the map
                this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, /*ignoreIfNotInferredProjectRoot*/ false);
            };
            ProjectService.prototype.removeProject = function (project) {
                var _this = this;
                this.logger.info("`remove Project::");
                project.print(/*writeProjectFileNames*/ true);
                project.close();
                if (ts.Debug.shouldAssert(1 /* Normal */)) {
                    this.filenameToScriptInfo.forEach(function (info) { return ts.Debug.assert(!info.isAttached(project), "Found script Info still attached to project", function () { return project.projectName + ": ScriptInfos still attached: " + JSON.stringify(ts.arrayFrom(ts.mapDefinedIterator(_this.filenameToScriptInfo.values(), function (info) { return info.isAttached(project) ?
                        {
                            fileName: info.fileName,
                            projects: info.containingProjects.map(function (p) { return p.projectName; }),
                            hasMixedContent: info.hasMixedContent
                        } : undefined; })), 
                    /*replacer*/ undefined, " "); }); });
                }
                // Remove the project from pending project updates
                this.pendingProjectUpdates.delete(project.getProjectName());
                switch (project.projectKind) {
                    case server.ProjectKind.External:
                        ts.unorderedRemoveItem(this.externalProjects, project);
                        this.projectToSizeMap.delete(project.getProjectName());
                        break;
                    case server.ProjectKind.Configured:
                        this.configuredProjects.delete(project.canonicalConfigFilePath);
                        this.projectToSizeMap.delete(project.canonicalConfigFilePath);
                        this.setConfigFileExistenceInfoByClosedConfiguredProject(project);
                        break;
                    case server.ProjectKind.Inferred:
                        ts.unorderedRemoveItem(this.inferredProjects, project);
                        break;
                }
            };
            /*@internal*/
            ProjectService.prototype.assignOrphanScriptInfoToInferredProject = function (info, projectRootPath) {
                ts.Debug.assert(info.isOrphan());
                var project = this.getOrCreateInferredProjectForProjectRootPathIfEnabled(info, projectRootPath) ||
                    this.getOrCreateSingleInferredProjectIfEnabled() ||
                    this.getOrCreateSingleInferredWithoutProjectRoot(info.isDynamic ?
                        projectRootPath || this.currentDirectory :
                        ts.getDirectoryPath(ts.isRootedDiskPath(info.fileName) ?
                            info.fileName :
                            ts.getNormalizedAbsolutePath(info.fileName, projectRootPath ?
                                this.getNormalizedAbsolutePath(projectRootPath) :
                                this.currentDirectory)));
                project.addRoot(info);
                if (info.containingProjects[0] !== project) {
                    // Ensure this is first project, we could be in this scenario because info could be part of orphan project
                    info.detachFromProject(project);
                    info.containingProjects.unshift(project);
                }
                project.updateGraph();
                if (!this.useSingleInferredProject && !project.projectRootPath) {
                    var _loop_3 = function (inferredProject) {
                        if (inferredProject === project || inferredProject.isOrphan()) {
                            return "continue";
                        }
                        // Remove the inferred project if the root of it is now part of newly created inferred project
                        // e.g through references
                        // Which means if any root of inferred project is part of more than 1 project can be removed
                        // This logic is same as iterating over all open files and calling
                        // this.removeRootOfInferredProjectIfNowPartOfOtherProject(f);
                        // Since this is also called from refreshInferredProject and closeOpen file
                        // to update inferred projects of the open file, this iteration might be faster
                        // instead of scanning all open files
                        var roots = inferredProject.getRootScriptInfos();
                        ts.Debug.assert(roots.length === 1 || !!inferredProject.projectRootPath);
                        if (roots.length === 1 && ts.forEach(roots[0].containingProjects, function (p) { return p !== roots[0].containingProjects[0] && !p.isOrphan(); })) {
                            inferredProject.removeFile(roots[0], /*fileExists*/ true, /*detachFromProject*/ true);
                        }
                    };
                    // Note that we need to create a copy of the array since the list of project can change
                    for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                        var inferredProject = _a[_i];
                        _loop_3(inferredProject);
                    }
                }
                return project;
            };
            ProjectService.prototype.assignOrphanScriptInfosToInferredProject = function () {
                var _this = this;
                // collect orphaned files and assign them to inferred project just like we treat open of a file
                this.openFiles.forEach(function (projectRootPath, path) {
                    var info = _this.getScriptInfoForPath(path);
                    // collect all orphaned script infos from open files
                    if (info.isOrphan()) {
                        _this.assignOrphanScriptInfoToInferredProject(info, projectRootPath);
                    }
                });
            };
            /**
             * Remove this file from the set of open, non-configured files.
             * @param info The file that has been closed or newly configured
             */
            ProjectService.prototype.closeOpenFile = function (info, skipAssignOrphanScriptInfosToInferredProject) {
                // Closing file should trigger re-reading the file content from disk. This is
                // because the user may chose to discard the buffer content before saving
                // to the disk, and the server's version of the file can be out of sync.
                var fileExists = info.isDynamic ? false : this.host.fileExists(info.fileName);
                info.close(fileExists);
                this.stopWatchingConfigFilesForClosedScriptInfo(info);
                var canonicalFileName = this.toCanonicalFileName(info.fileName);
                if (this.openFilesWithNonRootedDiskPath.get(canonicalFileName) === info) {
                    this.openFilesWithNonRootedDiskPath.delete(canonicalFileName);
                }
                // collect all projects that should be removed
                var ensureProjectsForOpenFiles = false;
                for (var _i = 0, _a = info.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    if (server.isConfiguredProject(p)) {
                        if (info.hasMixedContent) {
                            info.registerFileUpdate();
                        }
                        // Do not remove the project so that we can reuse this project
                        // if it would need to be re-created with next file open
                        // If project had open file affecting
                        // Reload the root Files from config if its not already scheduled
                        if (p.openFileWatchTriggered.has(info.path)) {
                            p.openFileWatchTriggered.delete(info.path);
                            if (!p.pendingReload) {
                                p.pendingReload = ts.ConfigFileProgramReloadLevel.Partial;
                                p.markFileAsDirty(info.path);
                            }
                        }
                    }
                    else if (server.isInferredProject(p) && p.isRoot(info)) {
                        // If this was the last open root file of inferred project
                        if (p.isProjectWithSingleRoot()) {
                            ensureProjectsForOpenFiles = true;
                        }
                        p.removeFile(info, fileExists, /*detachFromProject*/ true);
                        // Do not remove the project even if this was last root of the inferred project
                        // so that we can reuse this project, if it would need to be re-created with next file open
                    }
                    if (!p.languageServiceEnabled) {
                        // if project language service is disabled then we create a program only for open files.
                        // this means that project should be marked as dirty to force rebuilding of the program
                        // on the next request
                        p.markAsDirty();
                    }
                }
                this.openFiles.delete(info.path);
                this.configFileForOpenFiles.delete(info.path);
                if (!skipAssignOrphanScriptInfosToInferredProject && ensureProjectsForOpenFiles) {
                    this.assignOrphanScriptInfosToInferredProject();
                }
                // Cleanup script infos that arent part of any project (eg. those could be closed script infos not referenced by any project)
                // is postponed to next file open so that if file from same project is opened,
                // we wont end up creating same script infos
                // If the current info is being just closed - add the watcher file to track changes
                // But if file was deleted, handle that part
                if (fileExists) {
                    this.watchClosedScriptInfo(info);
                }
                else {
                    this.handleDeletedFile(info);
                }
                return ensureProjectsForOpenFiles;
            };
            ProjectService.prototype.deleteScriptInfo = function (info) {
                this.filenameToScriptInfo.delete(info.path);
                this.filenameToScriptInfoVersion.set(info.path, info.getVersion());
                var realpath = info.getRealpathIfDifferent();
                if (realpath) {
                    this.realpathToScriptInfos.remove(realpath, info); // TODO: GH#18217
                }
            };
            ProjectService.prototype.configFileExists = function (configFileName, canonicalConfigFilePath, info) {
                var configFileExistenceInfo = this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                if (configFileExistenceInfo) {
                    // By default the info would get impacted by presence of config file since its in the detection path
                    // Only adding the info as a root to inferred project will need the existence to be watched by file watcher
                    if (isOpenScriptInfo(info) && !configFileExistenceInfo.openFilesImpactedByConfigFile.has(info.path)) {
                        configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, false);
                        this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File added to open files impacted by this config file" /* OpenFilesImpactedByConfigFileAdd */);
                    }
                    return configFileExistenceInfo.exists;
                }
                // Theoretically we should be adding watch for the directory here itself.
                // In practice there will be very few scenarios where the config file gets added
                // somewhere inside the another config file directory.
                // And technically we could handle that case in configFile's directory watcher in some cases
                // But given that its a rare scenario it seems like too much overhead. (we werent watching those directories earlier either)
                // So what we are now watching is: configFile if the configured project corresponding to it is open
                // Or the whole chain of config files for the roots of the inferred projects
                // Cache the host value of file exists and add the info to map of open files impacted by this config file
                var exists = this.host.fileExists(configFileName);
                var openFilesImpactedByConfigFile = new ts.Map();
                if (isOpenScriptInfo(info)) {
                    openFilesImpactedByConfigFile.set(info.path, false);
                }
                configFileExistenceInfo = { exists: exists, openFilesImpactedByConfigFile: openFilesImpactedByConfigFile };
                this.configFileExistenceInfoCache.set(canonicalConfigFilePath, configFileExistenceInfo);
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File added to open files impacted by this config file" /* OpenFilesImpactedByConfigFileAdd */);
                return exists;
            };
            ProjectService.prototype.setConfigFileExistenceByNewConfiguredProject = function (project) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(project);
                if (configFileExistenceInfo) {
                    // The existence might not be set if the file watcher is not invoked by the time config project is created by external project
                    configFileExistenceInfo.exists = true;
                    // close existing watcher
                    if (configFileExistenceInfo.configFileWatcherForRootOfInferredProject) {
                        var configFileName = project.getConfigFilePath();
                        configFileExistenceInfo.configFileWatcherForRootOfInferredProject.close();
                        configFileExistenceInfo.configFileWatcherForRootOfInferredProject = undefined;
                        this.logConfigFileWatchUpdate(configFileName, project.canonicalConfigFilePath, configFileExistenceInfo, "Updated the callback" /* UpdatedCallback */);
                    }
                }
                else {
                    // We could be in this scenario if project is the configured project tracked by external project
                    // Since that route doesnt check if the config file is present or not
                    this.configFileExistenceInfoCache.set(project.canonicalConfigFilePath, {
                        exists: true,
                        openFilesImpactedByConfigFile: new ts.Map()
                    });
                }
            };
            /**
             * Returns true if the configFileExistenceInfo is needed/impacted by open files that are root of inferred project
             */
            ProjectService.prototype.configFileExistenceImpactsRootOfInferredProject = function (configFileExistenceInfo) {
                return ts.forEachEntry(configFileExistenceInfo.openFilesImpactedByConfigFile, function (isRootOfInferredProject) { return isRootOfInferredProject; });
            };
            ProjectService.prototype.setConfigFileExistenceInfoByClosedConfiguredProject = function (closedProject) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(closedProject);
                ts.Debug.assert(!!configFileExistenceInfo);
                if (configFileExistenceInfo.openFilesImpactedByConfigFile.size) {
                    var configFileName = closedProject.getConfigFilePath();
                    // If there are open files that are impacted by this config file existence
                    // but none of them are root of inferred project, the config file watcher will be
                    // created when any of the script infos are added as root of inferred project
                    if (this.configFileExistenceImpactsRootOfInferredProject(configFileExistenceInfo)) {
                        ts.Debug.assert(!configFileExistenceInfo.configFileWatcherForRootOfInferredProject);
                        this.createConfigFileWatcherOfConfigFileExistence(configFileName, closedProject.canonicalConfigFilePath, configFileExistenceInfo);
                    }
                }
                else {
                    // There is not a single file open thats tracking the status of this config file. Remove from cache
                    this.configFileExistenceInfoCache.delete(closedProject.canonicalConfigFilePath);
                }
            };
            ProjectService.prototype.logConfigFileWatchUpdate = function (configFileName, canonicalConfigFilePath, configFileExistenceInfo, status) {
                var _this = this;
                if (!this.logger.hasLevel(server.LogLevel.verbose)) {
                    return;
                }
                var inferredRoots = [];
                var otherFiles = [];
                configFileExistenceInfo.openFilesImpactedByConfigFile.forEach(function (isRootOfInferredProject, key) {
                    var info = _this.getScriptInfoForPath(key);
                    (isRootOfInferredProject ? inferredRoots : otherFiles).push(info.fileName);
                });
                var watches = [];
                if (configFileExistenceInfo.configFileWatcherForRootOfInferredProject) {
                    watches.push(configFileExistenceInfo.configFileWatcherForRootOfInferredProject === ts.noopFileWatcher ?
                        ts.WatchType.NoopConfigFileForInferredRoot :
                        ts.WatchType.ConfigFileForInferredRoot);
                }
                if (this.configuredProjects.has(canonicalConfigFilePath)) {
                    watches.push(ts.WatchType.ConfigFile);
                }
                this.logger.info("ConfigFilePresence:: Current Watches: " + watches + ":: File: " + configFileName + " Currently impacted open files: RootsOfInferredProjects: " + inferredRoots + " OtherOpenFiles: " + otherFiles + " Status: " + status);
            };
            /**
             * Create the watcher for the configFileExistenceInfo
             */
            ProjectService.prototype.createConfigFileWatcherOfConfigFileExistence = function (configFileName, canonicalConfigFilePath, configFileExistenceInfo) {
                var _this = this;
                configFileExistenceInfo.configFileWatcherForRootOfInferredProject =
                    ts.canWatchDirectory(ts.getDirectoryPath(canonicalConfigFilePath)) ?
                        this.watchFactory.watchFile(this.host, configFileName, function (_filename, eventKind) { return _this.onConfigFileChangeForOpenScriptInfo(configFileName, eventKind); }, ts.PollingInterval.High, this.hostConfiguration.watchOptions, ts.WatchType.ConfigFileForInferredRoot) :
                        ts.noopFileWatcher;
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Updated the callback" /* UpdatedCallback */);
            };
            /**
             * Close the config file watcher in the cached ConfigFileExistenceInfo
             *   if there arent any open files that are root of inferred project
             */
            ProjectService.prototype.closeConfigFileWatcherOfConfigFileExistenceInfo = function (configFileExistenceInfo) {
                // Close the config file watcher if there are no more open files that are root of inferred project
                if (configFileExistenceInfo.configFileWatcherForRootOfInferredProject &&
                    !this.configFileExistenceImpactsRootOfInferredProject(configFileExistenceInfo)) {
                    configFileExistenceInfo.configFileWatcherForRootOfInferredProject.close();
                    configFileExistenceInfo.configFileWatcherForRootOfInferredProject = undefined;
                }
            };
            /**
             * This is called on file close, so that we stop watching the config file for this script info
             */
            ProjectService.prototype.stopWatchingConfigFilesForClosedScriptInfo = function (info) {
                var _this = this;
                ts.Debug.assert(!info.isScriptOpen());
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (configFileExistenceInfo) {
                        var infoIsRootOfInferredProject = configFileExistenceInfo.openFilesImpactedByConfigFile.get(info.path);
                        // Delete the info from map, since this file is no more open
                        configFileExistenceInfo.openFilesImpactedByConfigFile.delete(info.path);
                        _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File removed from open files impacted by this config file" /* OpenFilesImpactedByConfigFileRemove */);
                        // If the script info was not root of inferred project,
                        // there wont be config file watch open because of this script info
                        if (infoIsRootOfInferredProject) {
                            // But if it is a root, it could be the last script info that is root of inferred project
                            // and hence we would need to close the config file watcher
                            _this.closeConfigFileWatcherOfConfigFileExistenceInfo(configFileExistenceInfo);
                        }
                        // If there are no open files that are impacted by configFileExistenceInfo after closing this script info
                        // there is no configured project present, remove the cached existence info
                        if (!configFileExistenceInfo.openFilesImpactedByConfigFile.size &&
                            !_this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath)) {
                            ts.Debug.assert(!configFileExistenceInfo.configFileWatcherForRootOfInferredProject);
                            _this.configFileExistenceInfoCache.delete(canonicalConfigFilePath);
                        }
                    }
                });
            };
            /**
             * This is called by inferred project whenever script info is added as a root
             */
            /* @internal */
            ProjectService.prototype.startWatchingConfigFilesForInferredProjectRoot = function (info) {
                var _this = this;
                ts.Debug.assert(info.isScriptOpen());
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (!configFileExistenceInfo) {
                        // Create the cache
                        configFileExistenceInfo = {
                            exists: _this.host.fileExists(configFileName),
                            openFilesImpactedByConfigFile: new ts.Map()
                        };
                        _this.configFileExistenceInfoCache.set(canonicalConfigFilePath, configFileExistenceInfo);
                    }
                    // Set this file as the root of inferred project
                    configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, true);
                    _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Open file was set as Inferred root" /* RootOfInferredProjectTrue */);
                    // If there is no configured project for this config file, add the file watcher
                    if (!configFileExistenceInfo.configFileWatcherForRootOfInferredProject &&
                        !_this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath)) {
                        _this.createConfigFileWatcherOfConfigFileExistence(configFileName, canonicalConfigFilePath, configFileExistenceInfo);
                    }
                });
            };
            /**
             * This is called by inferred project whenever root script info is removed from it
             */
            /* @internal */
            ProjectService.prototype.stopWatchingConfigFilesForInferredProjectRoot = function (info) {
                var _this = this;
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (configFileExistenceInfo && configFileExistenceInfo.openFilesImpactedByConfigFile.has(info.path)) {
                        ts.Debug.assert(info.isScriptOpen());
                        // Info is not root of inferred project any more
                        configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, false);
                        _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Open file was set as not inferred root" /* RootOfInferredProjectFalse */);
                        // Close the config file watcher
                        _this.closeConfigFileWatcherOfConfigFileExistenceInfo(configFileExistenceInfo);
                    }
                });
            };
            /**
             * This function tries to search for a tsconfig.json for the given file.
             * This is different from the method the compiler uses because
             * the compiler can assume it will always start searching in the
             * current directory (the directory in which tsc was invoked).
             * The server must start searching from the directory containing
             * the newly opened file.
             */
            ProjectService.prototype.forEachConfigFileLocation = function (info, action) {
                var _this = this;
                if (this.serverMode !== ts.LanguageServiceMode.Semantic) {
                    return undefined;
                }
                ts.Debug.assert(!isOpenScriptInfo(info) || this.openFiles.has(info.path));
                var projectRootPath = this.openFiles.get(info.path);
                var scriptInfo = ts.Debug.checkDefined(this.getScriptInfo(info.path));
                if (scriptInfo.isDynamic)
                    return undefined;
                var searchPath = server.asNormalizedPath(ts.getDirectoryPath(info.fileName));
                var isSearchPathInProjectRoot = function () { return ts.containsPath(projectRootPath, searchPath, _this.currentDirectory, !_this.host.useCaseSensitiveFileNames); };
                // If projectRootPath doesn't contain info.path, then do normal search for config file
                var anySearchPathOk = !projectRootPath || !isSearchPathInProjectRoot();
                // For ancestor of config file always ignore its own directory since its going to result in itself
                var searchInDirectory = !isAncestorConfigFileInfo(info);
                do {
                    if (searchInDirectory) {
                        var canonicalSearchPath = server.normalizedPathToPath(searchPath, this.currentDirectory, this.toCanonicalFileName);
                        var tsconfigFileName = server.asNormalizedPath(ts.combinePaths(searchPath, "tsconfig.json"));
                        var result = action(tsconfigFileName, ts.combinePaths(canonicalSearchPath, "tsconfig.json"));
                        if (result)
                            return tsconfigFileName;
                        var jsconfigFileName = server.asNormalizedPath(ts.combinePaths(searchPath, "jsconfig.json"));
                        result = action(jsconfigFileName, ts.combinePaths(canonicalSearchPath, "jsconfig.json"));
                        if (result)
                            return jsconfigFileName;
                        // If we started within node_modules, don't look outside node_modules.
                        // Otherwise, we might pick up a very large project and pull in the world,
                        // causing an editor delay.
                        if (ts.isNodeModulesDirectory(canonicalSearchPath)) {
                            break;
                        }
                    }
                    var parentPath = server.asNormalizedPath(ts.getDirectoryPath(searchPath));
                    if (parentPath === searchPath)
                        break;
                    searchPath = parentPath;
                    searchInDirectory = true;
                } while (anySearchPathOk || isSearchPathInProjectRoot());
                return undefined;
            };
            /*@internal*/
            ProjectService.prototype.findDefaultConfiguredProject = function (info) {
                if (!info.isScriptOpen())
                    return undefined;
                var configFileName = this.getConfigFileNameForFile(info);
                var project = configFileName &&
                    this.findConfiguredProjectByProjectName(configFileName);
                return project && projectContainsInfoDirectly(project, info) ?
                    project : project === null || project === void 0 ? void 0 : project.getDefaultChildProjectFromProjectWithReferences(info);
            };
            /**
             * This function tries to search for a tsconfig.json for the given file.
             * This is different from the method the compiler uses because
             * the compiler can assume it will always start searching in the
             * current directory (the directory in which tsc was invoked).
             * The server must start searching from the directory containing
             * the newly opened file.
             * If script info is passed in, it is asserted to be open script info
             * otherwise just file name
             */
            ProjectService.prototype.getConfigFileNameForFile = function (info) {
                var _this = this;
                if (isOpenScriptInfo(info)) {
                    ts.Debug.assert(info.isScriptOpen());
                    var result = this.configFileForOpenFiles.get(info.path);
                    if (result !== undefined)
                        return result || undefined;
                }
                this.logger.info("Search path: " + ts.getDirectoryPath(info.fileName));
                var configFileName = this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    return _this.configFileExists(configFileName, canonicalConfigFilePath, info);
                });
                if (configFileName) {
                    this.logger.info("For info: " + info.fileName + " :: Config file name: " + configFileName);
                }
                else {
                    this.logger.info("For info: " + info.fileName + " :: No config files found.");
                }
                if (isOpenScriptInfo(info)) {
                    this.configFileForOpenFiles.set(info.path, configFileName || false);
                }
                return configFileName;
            };
            ProjectService.prototype.printProjects = function () {
                var _this = this;
                if (!this.logger.hasLevel(server.LogLevel.normal)) {
                    return;
                }
                this.logger.startGroup();
                this.externalProjects.forEach(printProjectWithoutFileNames);
                this.configuredProjects.forEach(printProjectWithoutFileNames);
                this.inferredProjects.forEach(printProjectWithoutFileNames);
                this.logger.info("Open files: ");
                this.openFiles.forEach(function (projectRootPath, path) {
                    var info = _this.getScriptInfoForPath(path);
                    _this.logger.info("\tFileName: " + info.fileName + " ProjectRootPath: " + projectRootPath);
                    _this.logger.info("\t\tProjects: " + info.containingProjects.map(function (p) { return p.getProjectName(); }));
                });
                this.logger.endGroup();
            };
            /*@internal*/
            ProjectService.prototype.findConfiguredProjectByProjectName = function (configFileName) {
                // make sure that casing of config file name is consistent
                var canonicalConfigFilePath = server.asNormalizedPath(this.toCanonicalFileName(configFileName));
                return this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath);
            };
            ProjectService.prototype.getConfiguredProjectByCanonicalConfigFilePath = function (canonicalConfigFilePath) {
                return this.configuredProjects.get(canonicalConfigFilePath);
            };
            ProjectService.prototype.findExternalProjectByProjectName = function (projectFileName) {
                return findProjectByName(projectFileName, this.externalProjects);
            };
            /** Get a filename if the language service exceeds the maximum allowed program size; otherwise returns undefined. */
            ProjectService.prototype.getFilenameForExceededTotalSizeLimitForNonTsFiles = function (name, options, fileNames, propertyReader) {
                if (options && options.disableSizeLimit || !this.host.getFileSize) {
                    return;
                }
                var availableSpace = server.maxProgramSizeForNonTsFiles;
                this.projectToSizeMap.set(name, 0);
                this.projectToSizeMap.forEach(function (val) { return (availableSpace -= (val || 0)); });
                var totalNonTsFileSize = 0;
                for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
                    var f = fileNames_1[_i];
                    var fileName = propertyReader.getFileName(f);
                    if (ts.hasTSFileExtension(fileName)) {
                        continue;
                    }
                    totalNonTsFileSize += this.host.getFileSize(fileName);
                    if (totalNonTsFileSize > server.maxProgramSizeForNonTsFiles || totalNonTsFileSize > availableSpace) {
                        this.logger.info(getExceedLimitMessage({ propertyReader: propertyReader, hasTSFileExtension: ts.hasTSFileExtension, host: this.host }, totalNonTsFileSize)); // eslint-disable-line @typescript-eslint/no-unnecessary-qualifier
                        // Keep the size as zero since it's disabled
                        return fileName;
                    }
                }
                this.projectToSizeMap.set(name, totalNonTsFileSize);
                return;
                function getExceedLimitMessage(context, totalNonTsFileSize) {
                    var files = getTop5LargestFiles(context);
                    return "Non TS file size exceeded limit (" + totalNonTsFileSize + "). Largest files: " + files.map(function (file) { return file.name + ":" + file.size; }).join(", ");
                }
                function getTop5LargestFiles(_a) {
                    var propertyReader = _a.propertyReader, hasTSFileExtension = _a.hasTSFileExtension, host = _a.host;
                    return fileNames.map(function (f) { return propertyReader.getFileName(f); })
                        .filter(function (name) { return hasTSFileExtension(name); })
                        .map(function (name) { return ({ name: name, size: host.getFileSize(name) }); }) // TODO: GH#18217
                        .sort(function (a, b) { return b.size - a.size; })
                        .slice(0, 5);
                }
            };
            ProjectService.prototype.createExternalProject = function (projectFileName, files, options, typeAcquisition, excludedFiles) {
                var compilerOptions = convertCompilerOptions(options);
                var watchOptions = convertWatchOptions(options);
                var project = new server.ExternalProject(projectFileName, this, this.documentRegistry, compilerOptions, 
                /*lastFileExceededProgramSize*/ this.getFilenameForExceededTotalSizeLimitForNonTsFiles(projectFileName, compilerOptions, files, externalFilePropertyReader), options.compileOnSave === undefined ? true : options.compileOnSave, 
                /*projectFilePath*/ undefined, this.currentPluginConfigOverrides, watchOptions);
                project.excludedFiles = excludedFiles;
                this.addFilesToNonInferredProject(project, files, externalFilePropertyReader, typeAcquisition);
                this.externalProjects.push(project);
                return project;
            };
            /*@internal*/
            ProjectService.prototype.sendProjectTelemetry = function (project) {
                if (this.seenProjects.has(project.projectName)) {
                    setProjectOptionsUsed(project);
                    return;
                }
                this.seenProjects.set(project.projectName, true);
                if (!this.eventHandler || !this.host.createSHA256Hash) {
                    setProjectOptionsUsed(project);
                    return;
                }
                var projectOptions = server.isConfiguredProject(project) ? project.projectOptions : undefined;
                setProjectOptionsUsed(project);
                var data = {
                    projectId: this.host.createSHA256Hash(project.projectName),
                    fileStats: server.countEachFileTypes(project.getScriptInfos(), /*includeSizes*/ true),
                    compilerOptions: ts.convertCompilerOptionsForTelemetry(project.getCompilationSettings()),
                    typeAcquisition: convertTypeAcquisition(project.getTypeAcquisition()),
                    extends: projectOptions && projectOptions.configHasExtendsProperty,
                    files: projectOptions && projectOptions.configHasFilesProperty,
                    include: projectOptions && projectOptions.configHasIncludeProperty,
                    exclude: projectOptions && projectOptions.configHasExcludeProperty,
                    compileOnSave: project.compileOnSaveEnabled,
                    configFileName: configFileName(),
                    projectType: project instanceof server.ExternalProject ? "external" : "configured",
                    languageServiceEnabled: project.languageServiceEnabled,
                    version: ts.version,
                };
                this.eventHandler({ eventName: server.ProjectInfoTelemetryEvent, data: data });
                function configFileName() {
                    if (!server.isConfiguredProject(project)) {
                        return "other";
                    }
                    return server.getBaseConfigFileName(project.getConfigFilePath()) || "other";
                }
                function convertTypeAcquisition(_a) {
                    var enable = _a.enable, include = _a.include, exclude = _a.exclude;
                    return {
                        enable: enable,
                        include: include !== undefined && include.length !== 0,
                        exclude: exclude !== undefined && exclude.length !== 0,
                    };
                }
            };
            ProjectService.prototype.addFilesToNonInferredProject = function (project, files, propertyReader, typeAcquisition) {
                this.updateNonInferredProjectFiles(project, files, propertyReader);
                project.setTypeAcquisition(typeAcquisition);
            };
            /* @internal */
            ProjectService.prototype.createConfiguredProject = function (configFileName) {
                var cachedDirectoryStructureHost = ts.createCachedDirectoryStructureHost(this.host, this.host.getCurrentDirectory(), this.host.useCaseSensitiveFileNames); // TODO: GH#18217
                this.logger.info("Opened configuration file " + configFileName);
                var project = new server.ConfiguredProject(configFileName, this, this.documentRegistry, cachedDirectoryStructureHost);
                // TODO: We probably should also watch the configFiles that are extended
                project.createConfigFileWatcher();
                this.configuredProjects.set(project.canonicalConfigFilePath, project);
                this.setConfigFileExistenceByNewConfiguredProject(project);
                return project;
            };
            /* @internal */
            ProjectService.prototype.createConfiguredProjectWithDelayLoad = function (configFileName, reason) {
                var project = this.createConfiguredProject(configFileName);
                project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                project.pendingReloadReason = reason;
                return project;
            };
            /* @internal */
            ProjectService.prototype.createAndLoadConfiguredProject = function (configFileName, reason) {
                var project = this.createConfiguredProject(configFileName);
                this.loadConfiguredProject(project, reason);
                return project;
            };
            /* @internal */
            ProjectService.prototype.createLoadAndUpdateConfiguredProject = function (configFileName, reason) {
                var project = this.createAndLoadConfiguredProject(configFileName, reason);
                project.updateGraph();
                return project;
            };
            /**
             * Read the config file of the project, and update the project root file names.
             */
            /* @internal */
            ProjectService.prototype.loadConfiguredProject = function (project, reason) {
                var _this = this;
                this.sendProjectLoadingStartEvent(project, reason);
                // Read updated contents from disk
                var configFilename = ts.normalizePath(project.getConfigFilePath());
                var configFileContent = ts.tryReadFile(configFilename, function (fileName) { return _this.host.readFile(fileName); });
                var result = ts.parseJsonText(configFilename, ts.isString(configFileContent) ? configFileContent : "");
                var configFileErrors = result.parseDiagnostics;
                if (!ts.isString(configFileContent))
                    configFileErrors.push(configFileContent);
                var parsedCommandLine = ts.parseJsonSourceFileConfigFileContent(result, project.getCachedDirectoryStructureHost(), ts.getDirectoryPath(configFilename), 
                /*existingOptions*/ {}, configFilename, 
                /*resolutionStack*/ [], this.hostConfiguration.extraFileExtensions, 
                /*extendedConfigCache*/ undefined);
                if (parsedCommandLine.errors.length) {
                    configFileErrors.push.apply(configFileErrors, parsedCommandLine.errors);
                }
                this.logger.info("Config: " + configFilename + " : " + JSON.stringify({
                    rootNames: parsedCommandLine.fileNames,
                    options: parsedCommandLine.options,
                    projectReferences: parsedCommandLine.projectReferences
                }, /*replacer*/ undefined, " "));
                ts.Debug.assert(!!parsedCommandLine.fileNames);
                var compilerOptions = parsedCommandLine.options;
                // Update the project
                if (!project.projectOptions) {
                    project.projectOptions = {
                        configHasExtendsProperty: parsedCommandLine.raw.extends !== undefined,
                        configHasFilesProperty: parsedCommandLine.raw.files !== undefined,
                        configHasIncludeProperty: parsedCommandLine.raw.include !== undefined,
                        configHasExcludeProperty: parsedCommandLine.raw.exclude !== undefined
                    };
                }
                project.configFileSpecs = parsedCommandLine.configFileSpecs;
                project.canConfigFileJsonReportNoInputFiles = ts.canJsonReportNoInputFiles(parsedCommandLine.raw);
                project.setProjectErrors(configFileErrors);
                project.updateReferences(parsedCommandLine.projectReferences);
                var lastFileExceededProgramSize = this.getFilenameForExceededTotalSizeLimitForNonTsFiles(project.canonicalConfigFilePath, compilerOptions, parsedCommandLine.fileNames, fileNamePropertyReader);
                if (lastFileExceededProgramSize) {
                    project.disableLanguageService(lastFileExceededProgramSize);
                    project.stopWatchingWildCards();
                }
                else {
                    project.setCompilerOptions(compilerOptions);
                    project.setWatchOptions(parsedCommandLine.watchOptions);
                    project.enableLanguageService();
                    project.watchWildcards(new ts.Map(ts.getEntries(parsedCommandLine.wildcardDirectories))); // TODO: GH#18217
                }
                project.enablePluginsWithOptions(compilerOptions, this.currentPluginConfigOverrides);
                var filesToAdd = parsedCommandLine.fileNames.concat(project.getExternalFiles());
                this.updateRootAndOptionsOfNonInferredProject(project, filesToAdd, fileNamePropertyReader, compilerOptions, parsedCommandLine.typeAcquisition, parsedCommandLine.compileOnSave, parsedCommandLine.watchOptions);
            };
            ProjectService.prototype.updateNonInferredProjectFiles = function (project, files, propertyReader) {
                var projectRootFilesMap = project.getRootFilesMap();
                var newRootScriptInfoMap = new ts.Map();
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var f = files_1[_i];
                    var newRootFile = propertyReader.getFileName(f);
                    var fileName = server.toNormalizedPath(newRootFile);
                    var isDynamic = server.isDynamicFileName(fileName);
                    var path = void 0;
                    // Use the project's fileExists so that it can use caching instead of reaching to disk for the query
                    if (!isDynamic && !project.fileExists(newRootFile)) {
                        path = server.normalizedPathToPath(fileName, this.currentDirectory, this.toCanonicalFileName);
                        var existingValue = projectRootFilesMap.get(path);
                        if (existingValue) {
                            if (existingValue.info) {
                                project.removeFile(existingValue.info, /*fileExists*/ false, /*detachFromProject*/ true);
                                existingValue.info = undefined;
                            }
                            existingValue.fileName = fileName;
                        }
                        else {
                            projectRootFilesMap.set(path, { fileName: fileName });
                        }
                    }
                    else {
                        var scriptKind = propertyReader.getScriptKind(f, this.hostConfiguration.extraFileExtensions);
                        var hasMixedContent = propertyReader.hasMixedContent(f, this.hostConfiguration.extraFileExtensions);
                        var scriptInfo = ts.Debug.checkDefined(this.getOrCreateScriptInfoNotOpenedByClientForNormalizedPath(fileName, project.currentDirectory, scriptKind, hasMixedContent, project.directoryStructureHost));
                        path = scriptInfo.path;
                        var existingValue = projectRootFilesMap.get(path);
                        // If this script info is not already a root add it
                        if (!existingValue || existingValue.info !== scriptInfo) {
                            project.addRoot(scriptInfo, fileName);
                            if (scriptInfo.isScriptOpen()) {
                                // if file is already root in some inferred project
                                // - remove the file from that project and delete the project if necessary
                                this.removeRootOfInferredProjectIfNowPartOfOtherProject(scriptInfo);
                            }
                        }
                        else {
                            // Already root update the fileName
                            existingValue.fileName = fileName;
                        }
                    }
                    newRootScriptInfoMap.set(path, true);
                }
                // project's root file map size is always going to be same or larger than new roots map
                // as we have already all the new files to the project
                if (projectRootFilesMap.size > newRootScriptInfoMap.size) {
                    projectRootFilesMap.forEach(function (value, path) {
                        if (!newRootScriptInfoMap.has(path)) {
                            if (value.info) {
                                project.removeFile(value.info, project.fileExists(path), /*detachFromProject*/ true);
                            }
                            else {
                                projectRootFilesMap.delete(path);
                            }
                        }
                    });
                }
                // Just to ensure that even if root files dont change, the changes to the non root file are picked up,
                // mark the project as dirty unconditionally
                project.markAsDirty();
            };
            ProjectService.prototype.updateRootAndOptionsOfNonInferredProject = function (project, newUncheckedFiles, propertyReader, newOptions, newTypeAcquisition, compileOnSave, watchOptions) {
                project.setCompilerOptions(newOptions);
                project.setWatchOptions(watchOptions);
                // VS only set the CompileOnSaveEnabled option in the request if the option was changed recently
                // therefore if it is undefined, it should not be updated.
                if (compileOnSave !== undefined) {
                    project.compileOnSaveEnabled = compileOnSave;
                }
                this.addFilesToNonInferredProject(project, newUncheckedFiles, propertyReader, newTypeAcquisition);
            };
            /**
             * Reload the file names from config file specs and update the project graph
             */
            /*@internal*/
            ProjectService.prototype.reloadFileNamesOfConfiguredProject = function (project) {
                var configFileSpecs = project.configFileSpecs; // TODO: GH#18217
                var configFileName = project.getConfigFilePath();
                var fileNamesResult = ts.getFileNamesFromConfigSpecs(configFileSpecs, ts.getDirectoryPath(configFileName), project.getCompilationSettings(), project.getCachedDirectoryStructureHost(), this.hostConfiguration.extraFileExtensions);
                project.updateErrorOnNoInputFiles(fileNamesResult);
                this.updateNonInferredProjectFiles(project, fileNamesResult.fileNames.concat(project.getExternalFiles()), fileNamePropertyReader);
                return project.updateGraph();
            };
            /*@internal*/
            ProjectService.prototype.setFileNamesOfAutoImportProviderProject = function (project, fileNames) {
                this.updateNonInferredProjectFiles(project, fileNames, fileNamePropertyReader);
            };
            /**
             * Read the config file of the project again by clearing the cache and update the project graph
             */
            /* @internal */
            ProjectService.prototype.reloadConfiguredProject = function (project, reason, isInitialLoad) {
                // At this point, there is no reason to not have configFile in the host
                var host = project.getCachedDirectoryStructureHost();
                // Clear the cache since we are reloading the project from disk
                host.clearCache();
                var configFileName = project.getConfigFilePath();
                this.logger.info((isInitialLoad ? "Loading" : "Reloading") + " configured project " + configFileName);
                // Load project from the disk
                this.loadConfiguredProject(project, reason);
                project.updateGraph();
                this.sendConfigFileDiagEvent(project, configFileName);
            };
            ProjectService.prototype.sendConfigFileDiagEvent = function (project, triggerFile) {
                if (!this.eventHandler || this.suppressDiagnosticEvents) {
                    return;
                }
                var diagnostics = project.getLanguageService().getCompilerOptionsDiagnostics();
                diagnostics.push.apply(diagnostics, project.getAllProjectErrors());
                this.eventHandler({
                    eventName: server.ConfigFileDiagEvent,
                    data: { configFileName: project.getConfigFilePath(), diagnostics: diagnostics, triggerFile: triggerFile }
                });
            };
            ProjectService.prototype.getOrCreateInferredProjectForProjectRootPathIfEnabled = function (info, projectRootPath) {
                if (!this.useInferredProjectPerProjectRoot ||
                    // Its a dynamic info opened without project root
                    (info.isDynamic && projectRootPath === undefined)) {
                    return undefined;
                }
                if (projectRootPath) {
                    var canonicalProjectRootPath = this.toCanonicalFileName(projectRootPath);
                    // if we have an explicit project root path, find (or create) the matching inferred project.
                    for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                        var project = _a[_i];
                        if (project.projectRootPath === canonicalProjectRootPath) {
                            return project;
                        }
                    }
                    return this.createInferredProject(projectRootPath, /*isSingleInferredProject*/ false, projectRootPath);
                }
                // we don't have an explicit root path, so we should try to find an inferred project
                // that more closely contains the file.
                var bestMatch;
                for (var _b = 0, _c = this.inferredProjects; _b < _c.length; _b++) {
                    var project = _c[_b];
                    // ignore single inferred projects (handled elsewhere)
                    if (!project.projectRootPath)
                        continue;
                    // ignore inferred projects that don't contain the root's path
                    if (!ts.containsPath(project.projectRootPath, info.path, this.host.getCurrentDirectory(), !this.host.useCaseSensitiveFileNames))
                        continue;
                    // ignore inferred projects that are higher up in the project root.
                    // TODO(rbuckton): Should we add the file as a root to these as well?
                    if (bestMatch && bestMatch.projectRootPath.length > project.projectRootPath.length)
                        continue;
                    bestMatch = project;
                }
                return bestMatch;
            };
            ProjectService.prototype.getOrCreateSingleInferredProjectIfEnabled = function () {
                if (!this.useSingleInferredProject) {
                    return undefined;
                }
                // If `useInferredProjectPerProjectRoot` is not enabled, then there will only be one
                // inferred project for all files. If `useInferredProjectPerProjectRoot` is enabled
                // then we want to put all files that are not opened with a `projectRootPath` into
                // the same inferred project.
                //
                // To avoid the cost of searching through the array and to optimize for the case where
                // `useInferredProjectPerProjectRoot` is not enabled, we will always put the inferred
                // project for non-rooted files at the front of the array.
                if (this.inferredProjects.length > 0 && this.inferredProjects[0].projectRootPath === undefined) {
                    return this.inferredProjects[0];
                }
                // Single inferred project does not have a project root and hence no current directory
                return this.createInferredProject(/*currentDirectory*/ undefined, /*isSingleInferredProject*/ true);
            };
            ProjectService.prototype.getOrCreateSingleInferredWithoutProjectRoot = function (currentDirectory) {
                ts.Debug.assert(!this.useSingleInferredProject);
                var expectedCurrentDirectory = this.toCanonicalFileName(this.getNormalizedAbsolutePath(currentDirectory || ""));
                // Reuse the project with same current directory but no roots
                for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                    var inferredProject = _a[_i];
                    if (!inferredProject.projectRootPath &&
                        inferredProject.isOrphan() &&
                        inferredProject.canonicalCurrentDirectory === expectedCurrentDirectory) {
                        return inferredProject;
                    }
                }
                return this.createInferredProject(currentDirectory);
            };
            ProjectService.prototype.createInferredProject = function (currentDirectory, isSingleInferredProject, projectRootPath) {
                var compilerOptions = projectRootPath && this.compilerOptionsForInferredProjectsPerProjectRoot.get(projectRootPath) || this.compilerOptionsForInferredProjects; // TODO: GH#18217
                var watchOptions;
                if (projectRootPath) {
                    watchOptions = this.watchOptionsForInferredProjectsPerProjectRoot.get(projectRootPath);
                }
                if (watchOptions === undefined) {
                    watchOptions = this.watchOptionsForInferredProjects;
                }
                var project = new server.InferredProject(this, this.documentRegistry, compilerOptions, watchOptions || undefined, projectRootPath, currentDirectory, this.currentPluginConfigOverrides);
                if (isSingleInferredProject) {
                    this.inferredProjects.unshift(project);
                }
                else {
                    this.inferredProjects.push(project);
                }
                return project;
            };
            /*@internal*/
            ProjectService.prototype.getOrCreateScriptInfoNotOpenedByClient = function (uncheckedFileName, currentDirectory, hostToQueryFileExistsOn) {
                return this.getOrCreateScriptInfoNotOpenedByClientForNormalizedPath(server.toNormalizedPath(uncheckedFileName), currentDirectory, /*scriptKind*/ undefined, 
                /*hasMixedContent*/ undefined, hostToQueryFileExistsOn);
            };
            ProjectService.prototype.getScriptInfo = function (uncheckedFileName) {
                return this.getScriptInfoForNormalizedPath(server.toNormalizedPath(uncheckedFileName));
            };
            /* @internal */
            ProjectService.prototype.getScriptInfoOrConfig = function (uncheckedFileName) {
                var path = server.toNormalizedPath(uncheckedFileName);
                var info = this.getScriptInfoForNormalizedPath(path);
                if (info)
                    return info;
                var configProject = this.configuredProjects.get(this.toPath(uncheckedFileName));
                return configProject && configProject.getCompilerOptions().configFile;
            };
            /* @internal */
            ProjectService.prototype.logErrorForScriptInfoNotFound = function (fileName) {
                var names = ts.arrayFrom(this.filenameToScriptInfo.entries()).map(function (_a) {
                    var path = _a[0], scriptInfo = _a[1];
                    return ({ path: path, fileName: scriptInfo.fileName });
                });
                this.logger.msg("Could not find file " + JSON.stringify(fileName) + ".\nAll files are: " + JSON.stringify(names), server.Msg.Err);
            };
            /**
             * Returns the projects that contain script info through SymLink
             * Note that this does not return projects in info.containingProjects
             */
            /*@internal*/
            ProjectService.prototype.getSymlinkedProjects = function (info) {
                var projects;
                if (this.realpathToScriptInfos) {
                    var realpath = info.getRealpathIfDifferent();
                    if (realpath) {
                        ts.forEach(this.realpathToScriptInfos.get(realpath), combineProjects);
                    }
                    ts.forEach(this.realpathToScriptInfos.get(info.path), combineProjects);
                }
                return projects;
                function combineProjects(toAddInfo) {
                    if (toAddInfo !== info) {
                        var _loop_4 = function (project) {
                            // Add the projects only if they can use symLink targets and not already in the list
                            if (project.languageServiceEnabled &&
                                !project.isOrphan() &&
                                !project.getCompilerOptions().preserveSymlinks &&
                                !info.isAttached(project)) {
                                if (!projects) {
                                    projects = ts.createMultiMap();
                                    projects.add(toAddInfo.path, project);
                                }
                                else if (!ts.forEachEntry(projects, function (projs, path) { return path === toAddInfo.path ? false : ts.contains(projs, project); })) {
                                    projects.add(toAddInfo.path, project);
                                }
                            }
                        };
                        for (var _i = 0, _a = toAddInfo.containingProjects; _i < _a.length; _i++) {
                            var project = _a[_i];
                            _loop_4(project);
                        }
                    }
                }
            };
            ProjectService.prototype.watchClosedScriptInfo = function (info) {
                var _this = this;
                ts.Debug.assert(!info.fileWatcher);
                // do not watch files with mixed content - server doesn't know how to interpret it
                // do not watch files in the global cache location
                if (!info.isDynamicOrHasMixedContent() &&
                    (!this.globalCacheLocationDirectoryPath ||
                        !ts.startsWith(info.path, this.globalCacheLocationDirectoryPath))) {
                    var indexOfNodeModules = info.path.indexOf("/node_modules/");
                    if (!this.host.getModifiedTime || indexOfNodeModules === -1) {
                        info.fileWatcher = this.watchFactory.watchFilePath(this.host, info.fileName, function (fileName, eventKind, path) { return _this.onSourceFileChanged(fileName, eventKind, path); }, ts.PollingInterval.Medium, this.hostConfiguration.watchOptions, info.path, ts.WatchType.ClosedScriptInfo);
                    }
                    else {
                        info.mTime = this.getModifiedTime(info);
                        info.fileWatcher = this.watchClosedScriptInfoInNodeModules(info.path.substr(0, indexOfNodeModules));
                    }
                }
            };
            ProjectService.prototype.watchClosedScriptInfoInNodeModules = function (dir) {
                var _this = this;
                // Watch only directory
                var existing = this.scriptInfoInNodeModulesWatchers.get(dir);
                if (existing) {
                    existing.refCount++;
                    return existing;
                }
                var watchDir = dir + "/node_modules";
                var watcher = this.watchFactory.watchDirectory(this.host, watchDir, function (fileOrDirectory) {
                    var fileOrDirectoryPath = ts.removeIgnoredPath(_this.toPath(fileOrDirectory));
                    if (!fileOrDirectoryPath)
                        return;
                    // Has extension
                    ts.Debug.assert(result.refCount > 0);
                    if (watchDir === fileOrDirectoryPath) {
                        _this.refreshScriptInfosInDirectory(watchDir);
                    }
                    else {
                        var info = _this.getScriptInfoForPath(fileOrDirectoryPath);
                        if (info) {
                            if (isScriptInfoWatchedFromNodeModules(info)) {
                                _this.refreshScriptInfo(info);
                            }
                        }
                        // Folder
                        else if (!ts.hasExtension(fileOrDirectoryPath)) {
                            _this.refreshScriptInfosInDirectory(fileOrDirectoryPath);
                        }
                    }
                }, 1 /* Recursive */, this.hostConfiguration.watchOptions, ts.WatchType.NodeModulesForClosedScriptInfo);
                var result = {
                    close: function () {
                        if (result.refCount === 1) {
                            watcher.close();
                            _this.scriptInfoInNodeModulesWatchers.delete(dir);
                        }
                        else {
                            result.refCount--;
                        }
                    },
                    refCount: 1
                };
                this.scriptInfoInNodeModulesWatchers.set(dir, result);
                return result;
            };
            ProjectService.prototype.getModifiedTime = function (info) {
                return (this.host.getModifiedTime(info.path) || ts.missingFileModifiedTime).getTime();
            };
            ProjectService.prototype.refreshScriptInfo = function (info) {
                var mTime = this.getModifiedTime(info);
                if (mTime !== info.mTime) {
                    var eventKind = ts.getFileWatcherEventKind(info.mTime, mTime);
                    info.mTime = mTime;
                    this.onSourceFileChanged(info.fileName, eventKind, info.path);
                }
            };
            ProjectService.prototype.refreshScriptInfosInDirectory = function (dir) {
                var _this = this;
                dir = dir + ts.directorySeparator;
                this.filenameToScriptInfo.forEach(function (info) {
                    if (isScriptInfoWatchedFromNodeModules(info) && ts.startsWith(info.path, dir)) {
                        _this.refreshScriptInfo(info);
                    }
                });
            };
            ProjectService.prototype.stopWatchingScriptInfo = function (info) {
                if (info.fileWatcher) {
                    info.fileWatcher.close();
                    info.fileWatcher = undefined;
                }
            };
            ProjectService.prototype.getOrCreateScriptInfoNotOpenedByClientForNormalizedPath = function (fileName, currentDirectory, scriptKind, hasMixedContent, hostToQueryFileExistsOn) {
                if (ts.isRootedDiskPath(fileName) || server.isDynamicFileName(fileName)) {
                    return this.getOrCreateScriptInfoWorker(fileName, currentDirectory, /*openedByClient*/ false, /*fileContent*/ undefined, scriptKind, hasMixedContent, hostToQueryFileExistsOn);
                }
                // This is non rooted path with different current directory than project service current directory
                // Only paths recognized are open relative file paths
                var info = this.openFilesWithNonRootedDiskPath.get(this.toCanonicalFileName(fileName));
                if (info) {
                    return info;
                }
                // This means triple slash references wont be resolved in dynamic and unsaved files
                // which is intentional since we dont know what it means to be relative to non disk files
                return undefined;
            };
            ProjectService.prototype.getOrCreateScriptInfoOpenedByClientForNormalizedPath = function (fileName, currentDirectory, fileContent, scriptKind, hasMixedContent) {
                return this.getOrCreateScriptInfoWorker(fileName, currentDirectory, /*openedByClient*/ true, fileContent, scriptKind, hasMixedContent);
            };
            ProjectService.prototype.getOrCreateScriptInfoForNormalizedPath = function (fileName, openedByClient, fileContent, scriptKind, hasMixedContent, hostToQueryFileExistsOn) {
                return this.getOrCreateScriptInfoWorker(fileName, this.currentDirectory, openedByClient, fileContent, scriptKind, hasMixedContent, hostToQueryFileExistsOn);
            };
            ProjectService.prototype.getOrCreateScriptInfoWorker = function (fileName, currentDirectory, openedByClient, fileContent, scriptKind, hasMixedContent, hostToQueryFileExistsOn) {
                var _this = this;
                ts.Debug.assert(fileContent === undefined || openedByClient, "ScriptInfo needs to be opened by client to be able to set its user defined content");
                var path = server.normalizedPathToPath(fileName, currentDirectory, this.toCanonicalFileName);
                var info = this.getScriptInfoForPath(path);
                if (!info) {
                    var isDynamic = server.isDynamicFileName(fileName);
                    ts.Debug.assert(ts.isRootedDiskPath(fileName) || isDynamic || openedByClient, "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nScript info with non-dynamic relative file name can only be open script info or in context of host currentDirectory"; });
                    ts.Debug.assert(!ts.isRootedDiskPath(fileName) || this.currentDirectory === currentDirectory || !this.openFilesWithNonRootedDiskPath.has(this.toCanonicalFileName(fileName)), "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nOpen script files with non rooted disk path opened with current directory context cannot have same canonical names"; });
                    ts.Debug.assert(!isDynamic || this.currentDirectory === currentDirectory || this.useInferredProjectPerProjectRoot, "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nDynamic files must always be opened with service's current directory or service should support inferred project per projectRootPath."; });
                    // If the file is not opened by client and the file doesnot exist on the disk, return
                    if (!openedByClient && !isDynamic && !(hostToQueryFileExistsOn || this.host).fileExists(fileName)) {
                        return;
                    }
                    info = new server.ScriptInfo(this.host, fileName, scriptKind, !!hasMixedContent, path, this.filenameToScriptInfoVersion.get(path)); // TODO: GH#18217
                    this.filenameToScriptInfo.set(info.path, info);
                    this.filenameToScriptInfoVersion.delete(info.path);
                    if (!openedByClient) {
                        this.watchClosedScriptInfo(info);
                    }
                    else if (!ts.isRootedDiskPath(fileName) && (!isDynamic || this.currentDirectory !== currentDirectory)) {
                        // File that is opened by user but isn't rooted disk path
                        this.openFilesWithNonRootedDiskPath.set(this.toCanonicalFileName(fileName), info);
                    }
                }
                if (openedByClient) {
                    // Opening closed script info
                    // either it was created just now, or was part of projects but was closed
                    this.stopWatchingScriptInfo(info);
                    info.open(fileContent);
                    if (hasMixedContent) {
                        info.registerFileUpdate();
                    }
                }
                return info;
            };
            /**
             * This gets the script info for the normalized path. If the path is not rooted disk path then the open script info with project root context is preferred
             */
            ProjectService.prototype.getScriptInfoForNormalizedPath = function (fileName) {
                return !ts.isRootedDiskPath(fileName) && this.openFilesWithNonRootedDiskPath.get(this.toCanonicalFileName(fileName)) ||
                    this.getScriptInfoForPath(server.normalizedPathToPath(fileName, this.currentDirectory, this.toCanonicalFileName));
            };
            ProjectService.prototype.getScriptInfoForPath = function (fileName) {
                return this.filenameToScriptInfo.get(fileName);
            };
            /*@internal*/
            ProjectService.prototype.getDocumentPositionMapper = function (project, generatedFileName, sourceFileName) {
                var _this = this;
                // Since declaration info and map file watches arent updating project's directory structure host (which can cache file structure) use host
                var declarationInfo = this.getOrCreateScriptInfoNotOpenedByClient(generatedFileName, project.currentDirectory, this.host);
                if (!declarationInfo) {
                    if (sourceFileName) {
                        // Project contains source file and it generates the generated file name
                        project.addGeneratedFileWatch(generatedFileName, sourceFileName);
                    }
                    return undefined;
                }
                // Try to get from cache
                declarationInfo.getSnapshot(); // Ensure synchronized
                if (ts.isString(declarationInfo.sourceMapFilePath)) {
                    // Ensure mapper is synchronized
                    var sourceMapFileInfo_1 = this.getScriptInfoForPath(declarationInfo.sourceMapFilePath);
                    if (sourceMapFileInfo_1) {
                        sourceMapFileInfo_1.getSnapshot();
                        if (sourceMapFileInfo_1.documentPositionMapper !== undefined) {
                            sourceMapFileInfo_1.sourceInfos = this.addSourceInfoToSourceMap(sourceFileName, project, sourceMapFileInfo_1.sourceInfos);
                            return sourceMapFileInfo_1.documentPositionMapper ? sourceMapFileInfo_1.documentPositionMapper : undefined;
                        }
                    }
                    declarationInfo.sourceMapFilePath = undefined;
                }
                else if (declarationInfo.sourceMapFilePath) {
                    declarationInfo.sourceMapFilePath.sourceInfos = this.addSourceInfoToSourceMap(sourceFileName, project, declarationInfo.sourceMapFilePath.sourceInfos);
                    return undefined;
                }
                else if (declarationInfo.sourceMapFilePath !== undefined) {
                    // Doesnt have sourceMap
                    return undefined;
                }
                // Create the mapper
                var sourceMapFileInfo;
                var mapFileNameFromDeclarationInfo;
                var readMapFile = function (mapFileName, mapFileNameFromDts) {
                    var mapInfo = _this.getOrCreateScriptInfoNotOpenedByClient(mapFileName, project.currentDirectory, _this.host);
                    if (!mapInfo) {
                        mapFileNameFromDeclarationInfo = mapFileNameFromDts;
                        return undefined;
                    }
                    sourceMapFileInfo = mapInfo;
                    var snap = mapInfo.getSnapshot();
                    if (mapInfo.documentPositionMapper !== undefined)
                        return mapInfo.documentPositionMapper;
                    return snap.getText(0, snap.getLength());
                };
                var projectName = project.projectName;
                var documentPositionMapper = ts.getDocumentPositionMapper({ getCanonicalFileName: this.toCanonicalFileName, log: function (s) { return _this.logger.info(s); }, getSourceFileLike: function (f) { return _this.getSourceFileLike(f, projectName, declarationInfo); } }, declarationInfo.fileName, declarationInfo.getLineInfo(), readMapFile);
                readMapFile = undefined; // Remove ref to project
                if (sourceMapFileInfo) {
                    declarationInfo.sourceMapFilePath = sourceMapFileInfo.path;
                    sourceMapFileInfo.declarationInfoPath = declarationInfo.path;
                    sourceMapFileInfo.documentPositionMapper = documentPositionMapper || false;
                    sourceMapFileInfo.sourceInfos = this.addSourceInfoToSourceMap(sourceFileName, project, sourceMapFileInfo.sourceInfos);
                }
                else if (mapFileNameFromDeclarationInfo) {
                    declarationInfo.sourceMapFilePath = {
                        watcher: this.addMissingSourceMapFile(project.currentDirectory === this.currentDirectory ?
                            mapFileNameFromDeclarationInfo :
                            ts.getNormalizedAbsolutePath(mapFileNameFromDeclarationInfo, project.currentDirectory), declarationInfo.path),
                        sourceInfos: this.addSourceInfoToSourceMap(sourceFileName, project)
                    };
                }
                else {
                    declarationInfo.sourceMapFilePath = false;
                }
                return documentPositionMapper;
            };
            ProjectService.prototype.addSourceInfoToSourceMap = function (sourceFileName, project, sourceInfos) {
                if (sourceFileName) {
                    // Attach as source
                    var sourceInfo = this.getOrCreateScriptInfoNotOpenedByClient(sourceFileName, project.currentDirectory, project.directoryStructureHost);
                    (sourceInfos || (sourceInfos = new ts.Set())).add(sourceInfo.path);
                }
                return sourceInfos;
            };
            ProjectService.prototype.addMissingSourceMapFile = function (mapFileName, declarationInfoPath) {
                var _this = this;
                var fileWatcher = this.watchFactory.watchFile(this.host, mapFileName, function () {
                    var declarationInfo = _this.getScriptInfoForPath(declarationInfoPath);
                    if (declarationInfo && declarationInfo.sourceMapFilePath && !ts.isString(declarationInfo.sourceMapFilePath)) {
                        // Update declaration and source projects
                        _this.delayUpdateProjectGraphs(declarationInfo.containingProjects, /*clearSourceMapperCache*/ true);
                        _this.delayUpdateSourceInfoProjects(declarationInfo.sourceMapFilePath.sourceInfos);
                        declarationInfo.closeSourceMapFileWatcher();
                    }
                }, ts.PollingInterval.High, this.hostConfiguration.watchOptions, ts.WatchType.MissingSourceMapFile);
                return fileWatcher;
            };
            /*@internal*/
            ProjectService.prototype.getSourceFileLike = function (fileName, projectNameOrProject, declarationInfo) {
                var project = projectNameOrProject.projectName ? projectNameOrProject : this.findProject(projectNameOrProject);
                if (project) {
                    var path = project.toPath(fileName);
                    var sourceFile = project.getSourceFile(path);
                    if (sourceFile && sourceFile.resolvedPath === path)
                        return sourceFile;
                }
                // Need to look for other files.
                var info = this.getOrCreateScriptInfoNotOpenedByClient(fileName, (project || this).currentDirectory, project ? project.directoryStructureHost : this.host);
                if (!info)
                    return undefined;
                // Attach as source
                if (declarationInfo && ts.isString(declarationInfo.sourceMapFilePath) && info !== declarationInfo) {
                    var sourceMapInfo = this.getScriptInfoForPath(declarationInfo.sourceMapFilePath);
                    if (sourceMapInfo) {
                        (sourceMapInfo.sourceInfos || (sourceMapInfo.sourceInfos = new ts.Set())).add(info.path);
                    }
                }
                // Key doesnt matter since its only for text and lines
                if (info.cacheSourceFile)
                    return info.cacheSourceFile.sourceFile;
                // Create sourceFileLike
                if (!info.sourceFileLike) {
                    info.sourceFileLike = {
                        get text() {
                            ts.Debug.fail("shouldnt need text");
                            return "";
                        },
                        getLineAndCharacterOfPosition: function (pos) {
                            var lineOffset = info.positionToLineOffset(pos);
                            return { line: lineOffset.line - 1, character: lineOffset.offset - 1 };
                        },
                        getPositionOfLineAndCharacter: function (line, character, allowEdits) { return info.lineOffsetToPosition(line + 1, character + 1, allowEdits); }
                    };
                }
                return info.sourceFileLike;
            };
            /*@internal*/
            ProjectService.prototype.setPerformanceEventHandler = function (performanceEventHandler) {
                this.performanceEventHandler = performanceEventHandler;
            };
            ProjectService.prototype.setHostConfiguration = function (args) {
                var _this = this;
                if (args.file) {
                    var info = this.getScriptInfoForNormalizedPath(server.toNormalizedPath(args.file));
                    if (info) {
                        info.setOptions(convertFormatOptions(args.formatOptions), args.preferences);
                        this.logger.info("Host configuration update for file " + args.file);
                    }
                }
                else {
                    if (args.hostInfo !== undefined) {
                        this.hostConfiguration.hostInfo = args.hostInfo;
                        this.logger.info("Host information " + args.hostInfo);
                    }
                    if (args.formatOptions) {
                        this.hostConfiguration.formatCodeOptions = __assign(__assign({}, this.hostConfiguration.formatCodeOptions), convertFormatOptions(args.formatOptions));
                        this.logger.info("Format host information updated");
                    }
                    if (args.preferences) {
                        var _a = this.hostConfiguration.preferences, lazyConfiguredProjectsFromExternalProject = _a.lazyConfiguredProjectsFromExternalProject, includePackageJsonAutoImports = _a.includePackageJsonAutoImports;
                        this.hostConfiguration.preferences = __assign(__assign({}, this.hostConfiguration.preferences), args.preferences);
                        if (lazyConfiguredProjectsFromExternalProject && !this.hostConfiguration.preferences.lazyConfiguredProjectsFromExternalProject) {
                            // Load configured projects for external projects that are pending reload
                            this.configuredProjects.forEach(function (project) {
                                if (project.hasExternalProjectRef() &&
                                    project.pendingReload === ts.ConfigFileProgramReloadLevel.Full &&
                                    !_this.pendingProjectUpdates.has(project.getProjectName())) {
                                    project.updateGraph();
                                }
                            });
                        }
                        if (includePackageJsonAutoImports !== args.preferences.includePackageJsonAutoImports) {
                            this.invalidateProjectAutoImports(/*packageJsonPath*/ undefined);
                        }
                    }
                    if (args.extraFileExtensions) {
                        this.hostConfiguration.extraFileExtensions = args.extraFileExtensions;
                        // We need to update the project structures again as it is possible that existing
                        // project structure could have more or less files depending on extensions permitted
                        this.reloadProjects();
                        this.logger.info("Host file extension mappings updated");
                    }
                    if (args.watchOptions) {
                        this.hostConfiguration.watchOptions = convertWatchOptions(args.watchOptions);
                        this.logger.info("Host watch options changed to " + JSON.stringify(this.hostConfiguration.watchOptions) + ", it will be take effect for next watches.");
                    }
                }
            };
            /*@internal*/
            ProjectService.prototype.getWatchOptions = function (project) {
                var projectOptions = project.getWatchOptions();
                return projectOptions && this.hostConfiguration.watchOptions ? __assign(__assign({}, this.hostConfiguration.watchOptions), projectOptions) :
                    projectOptions || this.hostConfiguration.watchOptions;
            };
            ProjectService.prototype.closeLog = function () {
                this.logger.close();
            };
            /**
             * This function rebuilds the project for every file opened by the client
             * This does not reload contents of open files from disk. But we could do that if needed
             */
            ProjectService.prototype.reloadProjects = function () {
                this.logger.info("reload projects.");
                // If we want this to also reload open files from disk, we could do that,
                // but then we need to make sure we arent calling this function
                // (and would separate out below reloading of projects to be called when immediate reload is needed)
                // as there is no need to load contents of the files from the disk
                // Reload Projects
                this.reloadConfiguredProjectForFiles(this.openFiles, /*delayReload*/ false, ts.returnTrue, "User requested reload projects");
                this.ensureProjectForOpenFiles();
            };
            ProjectService.prototype.delayReloadConfiguredProjectForFiles = function (configFileExistenceInfo, ignoreIfNotRootOfInferredProject) {
                // Get open files to reload projects for
                this.reloadConfiguredProjectForFiles(configFileExistenceInfo.openFilesImpactedByConfigFile, 
                /*delayReload*/ true, ignoreIfNotRootOfInferredProject ?
                    function (isRootOfInferredProject) { return isRootOfInferredProject; } : // Reload open files if they are root of inferred project
                    ts.returnTrue, // Reload all the open files impacted by config file
                "Change in config file detected");
                this.delayEnsureProjectForOpenFiles();
            };
            /**
             * This function goes through all the openFiles and tries to file the config file for them.
             * If the config file is found and it refers to existing project, it reloads it either immediately
             * or schedules it for reload depending on delayReload option
             * If the there is no existing project it just opens the configured project for the config file
             * reloadForInfo provides a way to filter out files to reload configured project for
             */
            ProjectService.prototype.reloadConfiguredProjectForFiles = function (openFiles, delayReload, shouldReloadProjectFor, reason) {
                var _this = this;
                var updatedProjects = new ts.Map();
                var reloadChildProject = function (child) {
                    if (!updatedProjects.has(child.canonicalConfigFilePath)) {
                        updatedProjects.set(child.canonicalConfigFilePath, true);
                        _this.reloadConfiguredProject(child, reason, /*isInitialLoad*/ false);
                    }
                };
                // try to reload config file for all open files
                openFiles.forEach(function (openFileValue, path) {
                    // Invalidate default config file name for open file
                    _this.configFileForOpenFiles.delete(path);
                    // Filter out the files that need to be ignored
                    if (!shouldReloadProjectFor(openFileValue)) {
                        return;
                    }
                    var info = _this.getScriptInfoForPath(path); // TODO: GH#18217
                    ts.Debug.assert(info.isScriptOpen());
                    // This tries to search for a tsconfig.json for the given file. If we found it,
                    // we first detect if there is already a configured project created for it: if so,
                    // we re- read the tsconfig file content and update the project only if we havent already done so
                    // otherwise we create a new one.
                    var configFileName = _this.getConfigFileNameForFile(info);
                    if (configFileName) {
                        var project = _this.findConfiguredProjectByProjectName(configFileName) || _this.createConfiguredProject(configFileName);
                        if (!updatedProjects.has(project.canonicalConfigFilePath)) {
                            updatedProjects.set(project.canonicalConfigFilePath, true);
                            if (delayReload) {
                                project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                                project.pendingReloadReason = reason;
                                _this.delayUpdateProjectGraph(project);
                            }
                            else {
                                // reload from the disk
                                _this.reloadConfiguredProject(project, reason, /*isInitialLoad*/ false);
                                // If this project does not contain this file directly, reload the project till the reloaded project contains the script info directly
                                if (!projectContainsInfoDirectly(project, info)) {
                                    var referencedProject = forEachResolvedProjectReferenceProject(project, function (child) {
                                        reloadChildProject(child);
                                        return projectContainsInfoDirectly(child, info);
                                    }, ProjectReferenceProjectLoadKind.FindCreate);
                                    if (referencedProject) {
                                        // Reload the project's tree that is already present
                                        forEachResolvedProjectReferenceProject(project, reloadChildProject, ProjectReferenceProjectLoadKind.Find);
                                    }
                                }
                            }
                        }
                    }
                });
            };
            /**
             * Remove the root of inferred project if script info is part of another project
             */
            ProjectService.prototype.removeRootOfInferredProjectIfNowPartOfOtherProject = function (info) {
                // If the script info is root of inferred project, it could only be first containing project
                // since info is added as root to the inferred project only when there are no other projects containing it
                // So when it is root of the inferred project and after project structure updates its now part
                // of multiple project it needs to be removed from that inferred project because:
                // - references in inferred project supersede the root part
                // - root / reference in non - inferred project beats root in inferred project
                // eg. say this is structure /a/b/a.ts /a/b/c.ts where c.ts references a.ts
                // When a.ts is opened, since there is no configured project/external project a.ts can be part of
                // a.ts is added as root to inferred project.
                // Now at time of opening c.ts, c.ts is also not aprt of any existing project,
                // so it will be added to inferred project as a root. (for sake of this example assume single inferred project is false)
                // So at this poing a.ts is part of first inferred project and second inferred project (of which c.ts is root)
                // And hence it needs to be removed from the first inferred project.
                ts.Debug.assert(info.containingProjects.length > 0);
                var firstProject = info.containingProjects[0];
                if (!firstProject.isOrphan() &&
                    server.isInferredProject(firstProject) &&
                    firstProject.isRoot(info) &&
                    ts.forEach(info.containingProjects, function (p) { return p !== firstProject && !p.isOrphan(); })) {
                    firstProject.removeFile(info, /*fileExists*/ true, /*detachFromProject*/ true);
                }
            };
            /**
             * This function is to update the project structure for every inferred project.
             * It is called on the premise that all the configured projects are
             * up to date.
             * This will go through open files and assign them to inferred project if open file is not part of any other project
             * After that all the inferred project graphs are updated
             */
            ProjectService.prototype.ensureProjectForOpenFiles = function () {
                var _this = this;
                this.logger.info("Before ensureProjectForOpenFiles:");
                this.printProjects();
                this.openFiles.forEach(function (projectRootPath, path) {
                    var info = _this.getScriptInfoForPath(path);
                    // collect all orphaned script infos from open files
                    if (info.isOrphan()) {
                        _this.assignOrphanScriptInfoToInferredProject(info, projectRootPath);
                    }
                    else {
                        // Or remove the root of inferred project if is referenced in more than one projects
                        _this.removeRootOfInferredProjectIfNowPartOfOtherProject(info);
                    }
                });
                this.pendingEnsureProjectForOpenFiles = false;
                this.inferredProjects.forEach(updateProjectIfDirty);
                this.logger.info("After ensureProjectForOpenFiles:");
                this.printProjects();
            };
            /**
             * Open file whose contents is managed by the client
             * @param filename is absolute pathname
             * @param fileContent is a known version of the file content that is more up to date than the one on disk
             */
            ProjectService.prototype.openClientFile = function (fileName, fileContent, scriptKind, projectRootPath) {
                return this.openClientFileWithNormalizedPath(server.toNormalizedPath(fileName), fileContent, scriptKind, /*hasMixedContent*/ false, projectRootPath ? server.toNormalizedPath(projectRootPath) : undefined);
            };
            /*@internal*/
            ProjectService.prototype.getOriginalLocationEnsuringConfiguredProject = function (project, location) {
                var _this = this;
                var originalLocation = project.isSourceOfProjectReferenceRedirect(location.fileName) ?
                    location :
                    project.getSourceMapper().tryGetSourcePosition(location);
                if (!originalLocation)
                    return undefined;
                var fileName = originalLocation.fileName;
                if (!this.getScriptInfo(fileName) && !this.host.fileExists(fileName))
                    return undefined;
                var originalFileInfo = { fileName: server.toNormalizedPath(fileName), path: this.toPath(fileName) };
                var configFileName = this.getConfigFileNameForFile(originalFileInfo);
                if (!configFileName)
                    return undefined;
                var configuredProject = this.findConfiguredProjectByProjectName(configFileName) ||
                    this.createAndLoadConfiguredProject(configFileName, "Creating project for original file: " + originalFileInfo.fileName + (location !== originalLocation ? " for location: " + location.fileName : ""));
                updateProjectIfDirty(configuredProject);
                var projectContainsOriginalInfo = function (project) {
                    var info = _this.getScriptInfo(fileName);
                    return info && projectContainsInfoDirectly(project, info);
                };
                if (configuredProject.isSolution() || !projectContainsOriginalInfo(configuredProject)) {
                    // Find the project that is referenced from this solution that contains the script info directly
                    configuredProject = forEachResolvedProjectReferenceProject(configuredProject, function (child) {
                        updateProjectIfDirty(child);
                        return projectContainsOriginalInfo(child) ? child : undefined;
                    }, configuredProject.getCompilerOptions().disableReferencedProjectLoad ? ProjectReferenceProjectLoadKind.Find : ProjectReferenceProjectLoadKind.FindCreateLoad, "Creating project referenced in solution " + configuredProject.projectName + " to find possible configured project for original file: " + originalFileInfo.fileName + (location !== originalLocation ? " for location: " + location.fileName : ""));
                    if (!configuredProject)
                        return undefined;
                    if (configuredProject === project)
                        return originalLocation;
                }
                // Keep this configured project as referenced from project
                addOriginalConfiguredProject(configuredProject);
                var originalScriptInfo = this.getScriptInfo(fileName);
                if (!originalScriptInfo || !originalScriptInfo.containingProjects.length)
                    return undefined;
                // Add configured projects as referenced
                originalScriptInfo.containingProjects.forEach(function (project) {
                    if (server.isConfiguredProject(project)) {
                        addOriginalConfiguredProject(project);
                    }
                });
                return originalLocation;
                function addOriginalConfiguredProject(originalProject) {
                    if (!project.originalConfiguredProjects) {
                        project.originalConfiguredProjects = new ts.Set();
                    }
                    project.originalConfiguredProjects.add(originalProject.canonicalConfigFilePath);
                }
            };
            /** @internal */
            ProjectService.prototype.fileExists = function (fileName) {
                return !!this.getScriptInfoForNormalizedPath(fileName) || this.host.fileExists(fileName);
            };
            ProjectService.prototype.findExternalProjectContainingOpenScriptInfo = function (info) {
                return ts.find(this.externalProjects, function (proj) {
                    // Ensure project structure is up-to-date to check if info is present in external project
                    updateProjectIfDirty(proj);
                    return proj.containsScriptInfo(info);
                });
            };
            ProjectService.prototype.getOrCreateOpenScriptInfo = function (fileName, fileContent, scriptKind, hasMixedContent, projectRootPath) {
                var info = this.getOrCreateScriptInfoOpenedByClientForNormalizedPath(fileName, projectRootPath ? this.getNormalizedAbsolutePath(projectRootPath) : this.currentDirectory, fileContent, scriptKind, hasMixedContent); // TODO: GH#18217
                this.openFiles.set(info.path, projectRootPath);
                return info;
            };
            ProjectService.prototype.assignProjectToOpenedScriptInfo = function (info) {
                var _this = this;
                var configFileName;
                var configFileErrors;
                var project = this.findExternalProjectContainingOpenScriptInfo(info);
                var retainProjects;
                var projectForConfigFileDiag;
                var defaultConfigProjectIsCreated = false;
                if (!project && this.serverMode === ts.LanguageServiceMode.Semantic) { // Checking semantic mode is an optimization
                    configFileName = this.getConfigFileNameForFile(info);
                    if (configFileName) {
                        project = this.findConfiguredProjectByProjectName(configFileName);
                        if (!project) {
                            project = this.createLoadAndUpdateConfiguredProject(configFileName, "Creating possible configured project for " + info.fileName + " to open");
                            defaultConfigProjectIsCreated = true;
                        }
                        else {
                            // Ensure project is ready to check if it contains opened script info
                            updateProjectIfDirty(project);
                        }
                        projectForConfigFileDiag = project.containsScriptInfo(info) ? project : undefined;
                        retainProjects = project;
                        // If this configured project doesnt contain script info but
                        // it is solution with project references, try those project references
                        if (!projectContainsInfoDirectly(project, info)) {
                            forEachResolvedProjectReferenceProject(project, function (child) {
                                updateProjectIfDirty(child);
                                // Retain these projects
                                if (!ts.isArray(retainProjects)) {
                                    retainProjects = [project, child];
                                }
                                else {
                                    retainProjects.push(child);
                                }
                                // If script info belongs to this child project, use this as default config project
                                if (projectContainsInfoDirectly(child, info)) {
                                    projectForConfigFileDiag = child;
                                    return child;
                                }
                                // If this project uses the script info (even through project reference), if default project is not found, use this for configFileDiag
                                if (!projectForConfigFileDiag && child.containsScriptInfo(info)) {
                                    projectForConfigFileDiag = child;
                                }
                            }, ProjectReferenceProjectLoadKind.FindCreateLoad, "Creating project referenced in solution " + project.projectName + " to find possible configured project for " + info.fileName + " to open");
                        }
                        // Send the event only if the project got created as part of this open request and info is part of the project
                        if (projectForConfigFileDiag) {
                            configFileName = projectForConfigFileDiag.getConfigFilePath();
                            if (projectForConfigFileDiag !== project || defaultConfigProjectIsCreated) {
                                configFileErrors = projectForConfigFileDiag.getAllProjectErrors();
                                this.sendConfigFileDiagEvent(projectForConfigFileDiag, info.fileName);
                            }
                        }
                        else {
                            // Since the file isnt part of configured project, do not send config file info
                            configFileName = undefined;
                        }
                        // Create ancestor configured project
                        this.createAncestorProjects(info, project);
                    }
                }
                // Project we have at this point is going to be updated since its either found through
                // - external project search, which updates the project before checking if info is present in it
                // - configured project - either created or updated to ensure we know correct status of info
                // At this point we need to ensure that containing projects of the info are uptodate
                // This will ensure that later question of info.isOrphan() will return correct answer
                // and we correctly create inferred project for the info
                info.containingProjects.forEach(updateProjectIfDirty);
                // At this point if file is part of any any configured or external project, then it would be present in the containing projects
                // So if it still doesnt have any containing projects, it needs to be part of inferred project
                if (info.isOrphan()) {
                    // Even though this info did not belong to any of the configured projects, send the config file diag
                    if (ts.isArray(retainProjects)) {
                        retainProjects.forEach(function (project) { return _this.sendConfigFileDiagEvent(project, info.fileName); });
                    }
                    else if (retainProjects) {
                        this.sendConfigFileDiagEvent(retainProjects, info.fileName);
                    }
                    ts.Debug.assert(this.openFiles.has(info.path));
                    this.assignOrphanScriptInfoToInferredProject(info, this.openFiles.get(info.path));
                }
                ts.Debug.assert(!info.isOrphan());
                return { configFileName: configFileName, configFileErrors: configFileErrors, retainProjects: retainProjects };
            };
            ProjectService.prototype.createAncestorProjects = function (info, project) {
                // Skip if info is not part of default configured project
                if (!info.isAttached(project))
                    return;
                // Create configured project till project root
                while (true) {
                    // Skip if project is not composite
                    if (!project.isInitialLoadPending() &&
                        (!project.getCompilerOptions().composite ||
                            project.getCompilerOptions().disableSolutionSearching))
                        return;
                    // Get config file name
                    var configFileName = this.getConfigFileNameForFile({
                        fileName: project.getConfigFilePath(),
                        path: info.path,
                        configFileInfo: true
                    });
                    if (!configFileName)
                        return;
                    // find or delay load the project
                    var ancestor = this.findConfiguredProjectByProjectName(configFileName) ||
                        this.createConfiguredProjectWithDelayLoad(configFileName, "Creating project possibly referencing default composite project " + project.getProjectName() + " of open file " + info.fileName);
                    if (ancestor.isInitialLoadPending()) {
                        // Set a potential project reference
                        ancestor.setPotentialProjectReference(project.canonicalConfigFilePath);
                    }
                    project = ancestor;
                }
            };
            /*@internal*/
            ProjectService.prototype.loadAncestorProjectTree = function (forProjects) {
                forProjects = forProjects || ts.mapDefinedEntries(this.configuredProjects, function (key, project) { return !project.isInitialLoadPending() ? [key, true] : undefined; });
                var seenProjects = new ts.Set();
                // Work on array copy as we could add more projects as part of callback
                for (var _i = 0, _a = ts.arrayFrom(this.configuredProjects.values()); _i < _a.length; _i++) {
                    var project = _a[_i];
                    // If this project has potential project reference for any of the project we are loading ancestor tree for
                    // we need to load this project tree
                    if (forEachPotentialProjectReference(project, function (potentialRefPath) { return forProjects.has(potentialRefPath); }) || forEachResolvedProjectReference(project, function (_ref, resolvedPath) { return forProjects.has(resolvedPath); })) {
                        // Load children
                        this.ensureProjectChildren(project, seenProjects);
                    }
                }
            };
            ProjectService.prototype.ensureProjectChildren = function (project, seenProjects) {
                var _this = this;
                if (!ts.tryAddToSet(seenProjects, project.canonicalConfigFilePath))
                    return;
                // Update the project
                updateProjectIfDirty(project);
                // Create tree because project is uptodate we only care of resolved references
                forEachResolvedProjectReferenceProject(project, function (child) { return _this.ensureProjectChildren(child, seenProjects); }, ProjectReferenceProjectLoadKind.FindCreateLoad, "Creating project for reference of project: " + project.projectName);
            };
            ProjectService.prototype.cleanupAfterOpeningFile = function (toRetainConfigProjects) {
                // This was postponed from closeOpenFile to after opening next file,
                // so that we can reuse the project if we need to right away
                this.removeOrphanConfiguredProjects(toRetainConfigProjects);
                // Remove orphan inferred projects now that we have reused projects
                // We need to create a duplicate because we cant guarantee order after removal
                for (var _i = 0, _a = this.inferredProjects.slice(); _i < _a.length; _i++) {
                    var inferredProject = _a[_i];
                    if (inferredProject.isOrphan()) {
                        this.removeProject(inferredProject);
                    }
                }
                // Delete the orphan files here because there might be orphan script infos (which are not part of project)
                // when some file/s were closed which resulted in project removal.
                // It was then postponed to cleanup these script infos so that they can be reused if
                // the file from that old project is reopened because of opening file from here.
                this.removeOrphanScriptInfos();
            };
            ProjectService.prototype.openClientFileWithNormalizedPath = function (fileName, fileContent, scriptKind, hasMixedContent, projectRootPath) {
                var info = this.getOrCreateOpenScriptInfo(fileName, fileContent, scriptKind, hasMixedContent, projectRootPath);
                var _a = this.assignProjectToOpenedScriptInfo(info), retainProjects = _a.retainProjects, result = __rest(_a, ["retainProjects"]);
                this.cleanupAfterOpeningFile(retainProjects);
                this.telemetryOnOpenFile(info);
                this.printProjects();
                return result;
            };
            ProjectService.prototype.removeOrphanConfiguredProjects = function (toRetainConfiguredProjects) {
                var _this = this;
                var toRemoveConfiguredProjects = new ts.Map(this.configuredProjects);
                var markOriginalProjectsAsUsed = function (project) {
                    if (!project.isOrphan() && project.originalConfiguredProjects) {
                        project.originalConfiguredProjects.forEach(function (_value, configuredProjectPath) {
                            var project = _this.getConfiguredProjectByCanonicalConfigFilePath(configuredProjectPath);
                            return project && retainConfiguredProject(project);
                        });
                    }
                };
                if (toRetainConfiguredProjects) {
                    if (ts.isArray(toRetainConfiguredProjects)) {
                        toRetainConfiguredProjects.forEach(retainConfiguredProject);
                    }
                    else {
                        retainConfiguredProject(toRetainConfiguredProjects);
                    }
                }
                // Do not remove configured projects that are used as original projects of other
                this.inferredProjects.forEach(markOriginalProjectsAsUsed);
                this.externalProjects.forEach(markOriginalProjectsAsUsed);
                this.configuredProjects.forEach(function (project) {
                    // If project has open ref (there are more than zero references from external project/open file), keep it alive as well as any project it references
                    if (project.hasOpenRef()) {
                        retainConfiguredProject(project);
                    }
                    else if (toRemoveConfiguredProjects.has(project.canonicalConfigFilePath)) {
                        // If the configured project for project reference has more than zero references, keep it alive
                        forEachReferencedProject(project, function (ref) { return isRetained(ref) && retainConfiguredProject(project); });
                    }
                });
                // Remove all the non marked projects
                toRemoveConfiguredProjects.forEach(function (project) { return _this.removeProject(project); });
                function isRetained(project) {
                    return project.hasOpenRef() || !toRemoveConfiguredProjects.has(project.canonicalConfigFilePath);
                }
                function retainConfiguredProject(project) {
                    if (toRemoveConfiguredProjects.delete(project.canonicalConfigFilePath)) {
                        // Keep original projects used
                        markOriginalProjectsAsUsed(project);
                        // Keep all the references alive
                        forEachReferencedProject(project, retainConfiguredProject);
                    }
                }
            };
            ProjectService.prototype.removeOrphanScriptInfos = function () {
                var _this = this;
                var toRemoveScriptInfos = new ts.Map(this.filenameToScriptInfo);
                this.filenameToScriptInfo.forEach(function (info) {
                    // If script info is open or orphan, retain it and its dependencies
                    if (!info.isScriptOpen() && info.isOrphan() && !info.isContainedByAutoImportProvider()) {
                        // Otherwise if there is any source info that is alive, this alive too
                        if (!info.sourceMapFilePath)
                            return;
                        var sourceInfos = void 0;
                        if (ts.isString(info.sourceMapFilePath)) {
                            var sourceMapInfo = _this.getScriptInfoForPath(info.sourceMapFilePath);
                            sourceInfos = sourceMapInfo && sourceMapInfo.sourceInfos;
                        }
                        else {
                            sourceInfos = info.sourceMapFilePath.sourceInfos;
                        }
                        if (!sourceInfos)
                            return;
                        if (!ts.forEachKey(sourceInfos, function (path) {
                            var info = _this.getScriptInfoForPath(path);
                            return !!info && (info.isScriptOpen() || !info.isOrphan());
                        })) {
                            return;
                        }
                    }
                    // Retain this script info
                    toRemoveScriptInfos.delete(info.path);
                    if (info.sourceMapFilePath) {
                        var sourceInfos = void 0;
                        if (ts.isString(info.sourceMapFilePath)) {
                            // And map file info and source infos
                            toRemoveScriptInfos.delete(info.sourceMapFilePath);
                            var sourceMapInfo = _this.getScriptInfoForPath(info.sourceMapFilePath);
                            sourceInfos = sourceMapInfo && sourceMapInfo.sourceInfos;
                        }
                        else {
                            sourceInfos = info.sourceMapFilePath.sourceInfos;
                        }
                        if (sourceInfos) {
                            sourceInfos.forEach(function (_value, path) { return toRemoveScriptInfos.delete(path); });
                        }
                    }
                });
                toRemoveScriptInfos.forEach(function (info) {
                    // if there are not projects that include this script info - delete it
                    _this.stopWatchingScriptInfo(info);
                    _this.deleteScriptInfo(info);
                    info.closeSourceMapFileWatcher();
                });
            };
            ProjectService.prototype.telemetryOnOpenFile = function (scriptInfo) {
                if (this.serverMode !== ts.LanguageServiceMode.Semantic || !this.eventHandler || !scriptInfo.isJavaScript() || !ts.addToSeen(this.allJsFilesForOpenFileTelemetry, scriptInfo.path)) {
                    return;
                }
                var project = scriptInfo.getDefaultProject();
                if (!project.languageServiceEnabled) {
                    return;
                }
                var sourceFile = project.getSourceFile(scriptInfo.path);
                var checkJs = !!sourceFile && !!sourceFile.checkJsDirective;
                this.eventHandler({ eventName: server.OpenFileInfoTelemetryEvent, data: { info: { checkJs: checkJs } } });
            };
            ProjectService.prototype.closeClientFile = function (uncheckedFileName, skipAssignOrphanScriptInfosToInferredProject) {
                var info = this.getScriptInfoForNormalizedPath(server.toNormalizedPath(uncheckedFileName));
                var result = info ? this.closeOpenFile(info, skipAssignOrphanScriptInfosToInferredProject) : false;
                if (!skipAssignOrphanScriptInfosToInferredProject) {
                    this.printProjects();
                }
                return result;
            };
            ProjectService.prototype.collectChanges = function (lastKnownProjectVersions, currentProjects, includeProjectReferenceRedirectInfo, result) {
                var _loop_5 = function (proj) {
                    var knownProject = ts.find(lastKnownProjectVersions, function (p) { return p.projectName === proj.getProjectName(); });
                    result.push(proj.getChangesSinceVersion(knownProject && knownProject.version, includeProjectReferenceRedirectInfo));
                };
                for (var _i = 0, currentProjects_1 = currentProjects; _i < currentProjects_1.length; _i++) {
                    var proj = currentProjects_1[_i];
                    _loop_5(proj);
                }
            };
            /* @internal */
            ProjectService.prototype.synchronizeProjectList = function (knownProjects, includeProjectReferenceRedirectInfo) {
                var files = [];
                this.collectChanges(knownProjects, this.externalProjects, includeProjectReferenceRedirectInfo, files);
                this.collectChanges(knownProjects, ts.arrayFrom(this.configuredProjects.values()), includeProjectReferenceRedirectInfo, files);
                this.collectChanges(knownProjects, this.inferredProjects, includeProjectReferenceRedirectInfo, files);
                return files;
            };
            /* @internal */
            ProjectService.prototype.applyChangesInOpenFiles = function (openFiles, changedFiles, closedFiles) {
                var _this = this;
                var openScriptInfos;
                var assignOrphanScriptInfosToInferredProject = false;
                if (openFiles) {
                    while (true) {
                        var iterResult = openFiles.next();
                        if (iterResult.done)
                            break;
                        var file = iterResult.value;
                        // Create script infos so we have the new content for all the open files before we do any updates to projects
                        var info = this.getOrCreateOpenScriptInfo(server.toNormalizedPath(file.fileName), file.content, tryConvertScriptKindName(file.scriptKind), file.hasMixedContent, file.projectRootPath ? server.toNormalizedPath(file.projectRootPath) : undefined);
                        (openScriptInfos || (openScriptInfos = [])).push(info);
                    }
                }
                if (changedFiles) {
                    while (true) {
                        var iterResult = changedFiles.next();
                        if (iterResult.done)
                            break;
                        var file = iterResult.value;
                        var scriptInfo = this.getScriptInfo(file.fileName);
                        ts.Debug.assert(!!scriptInfo);
                        // Make edits to script infos and marks containing project as dirty
                        this.applyChangesToFile(scriptInfo, file.changes);
                    }
                }
                if (closedFiles) {
                    for (var _i = 0, closedFiles_1 = closedFiles; _i < closedFiles_1.length; _i++) {
                        var file = closedFiles_1[_i];
                        // Close files, but dont assign projects to orphan open script infos, that part comes later
                        assignOrphanScriptInfosToInferredProject = this.closeClientFile(file, /*skipAssignOrphanScriptInfosToInferredProject*/ true) || assignOrphanScriptInfosToInferredProject;
                    }
                }
                // All the script infos now exist, so ok to go update projects for open files
                var retainProjects;
                if (openScriptInfos) {
                    retainProjects = ts.flatMap(openScriptInfos, function (info) { return _this.assignProjectToOpenedScriptInfo(info).retainProjects; });
                }
                // While closing files there could be open files that needed assigning new inferred projects, do it now
                if (assignOrphanScriptInfosToInferredProject) {
                    this.assignOrphanScriptInfosToInferredProject();
                }
                if (openScriptInfos) {
                    // Cleanup projects
                    this.cleanupAfterOpeningFile(retainProjects);
                    // Telemetry
                    openScriptInfos.forEach(function (info) { return _this.telemetryOnOpenFile(info); });
                    this.printProjects();
                }
                else if (ts.length(closedFiles)) {
                    this.printProjects();
                }
            };
            /* @internal */
            ProjectService.prototype.applyChangesToFile = function (scriptInfo, changes) {
                while (true) {
                    var iterResult = changes.next();
                    if (iterResult.done)
                        break;
                    var change = iterResult.value;
                    scriptInfo.editContent(change.span.start, change.span.start + change.span.length, change.newText);
                }
            };
            ProjectService.prototype.closeConfiguredProjectReferencedFromExternalProject = function (configFile) {
                var configuredProject = this.findConfiguredProjectByProjectName(configFile);
                if (configuredProject) {
                    configuredProject.deleteExternalProjectReference();
                    if (!configuredProject.hasOpenRef()) {
                        this.removeProject(configuredProject);
                        return;
                    }
                }
            };
            ProjectService.prototype.closeExternalProject = function (uncheckedFileName) {
                var fileName = server.toNormalizedPath(uncheckedFileName);
                var configFiles = this.externalProjectToConfiguredProjectMap.get(fileName);
                if (configFiles) {
                    for (var _i = 0, configFiles_1 = configFiles; _i < configFiles_1.length; _i++) {
                        var configFile = configFiles_1[_i];
                        this.closeConfiguredProjectReferencedFromExternalProject(configFile);
                    }
                    this.externalProjectToConfiguredProjectMap.delete(fileName);
                }
                else {
                    // close external project
                    var externalProject = this.findExternalProjectByProjectName(uncheckedFileName);
                    if (externalProject) {
                        this.removeProject(externalProject);
                    }
                }
            };
            ProjectService.prototype.openExternalProjects = function (projects) {
                var _this = this;
                // record project list before the update
                var projectsToClose = ts.arrayToMap(this.externalProjects, function (p) { return p.getProjectName(); }, function (_) { return true; });
                ts.forEachKey(this.externalProjectToConfiguredProjectMap, function (externalProjectName) {
                    projectsToClose.set(externalProjectName, true);
                });
                for (var _i = 0, projects_3 = projects; _i < projects_3.length; _i++) {
                    var externalProject = projects_3[_i];
                    this.openExternalProject(externalProject);
                    // delete project that is present in input list
                    projectsToClose.delete(externalProject.projectFileName);
                }
                // close projects that were missing in the input list
                ts.forEachKey(projectsToClose, function (externalProjectName) {
                    _this.closeExternalProject(externalProjectName);
                });
            };
            ProjectService.escapeFilenameForRegex = function (filename) {
                return filename.replace(this.filenameEscapeRegexp, "\\$&");
            };
            ProjectService.prototype.resetSafeList = function () {
                this.safelist = defaultTypeSafeList;
            };
            ProjectService.prototype.applySafeList = function (proj) {
                var _this = this;
                var rootFiles = proj.rootFiles;
                var typeAcquisition = proj.typeAcquisition;
                ts.Debug.assert(!!typeAcquisition, "proj.typeAcquisition should be set by now");
                // If type acquisition has been explicitly disabled, do not exclude anything from the project
                if (typeAcquisition.enable === false) {
                    return [];
                }
                var typeAcqInclude = typeAcquisition.include || (typeAcquisition.include = []);
                var excludeRules = [];
                var normalizedNames = rootFiles.map(function (f) { return ts.normalizeSlashes(f.fileName); });
                var excludedFiles = [];
                var _loop_6 = function (name) {
                    var rule = this_2.safelist[name];
                    for (var _i = 0, normalizedNames_1 = normalizedNames; _i < normalizedNames_1.length; _i++) {
                        var root = normalizedNames_1[_i];
                        if (rule.match.test(root)) {
                            this_2.logger.info("Excluding files based on rule " + name + " matching file '" + root + "'");
                            // If the file matches, collect its types packages and exclude rules
                            if (rule.types) {
                                for (var _a = 0, _b = rule.types; _a < _b.length; _a++) {
                                    var type = _b[_a];
                                    // Best-effort de-duping here - doesn't need to be unduplicated but
                                    // we don't want the list to become a 400-element array of just 'kendo'
                                    if (typeAcqInclude.indexOf(type) < 0) {
                                        typeAcqInclude.push(type);
                                    }
                                }
                            }
                            if (rule.exclude) {
                                var _loop_8 = function (exclude) {
                                    var processedRule = root.replace(rule.match, function () {
                                        var groups = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            groups[_i] = arguments[_i];
                                        }
                                        return exclude.map(function (groupNumberOrString) {
                                            // RegExp group numbers are 1-based, but the first element in groups
                                            // is actually the original string, so it all works out in the end.
                                            if (typeof groupNumberOrString === "number") {
                                                if (!ts.isString(groups[groupNumberOrString])) {
                                                    // Specification was wrong - exclude nothing!
                                                    _this.logger.info("Incorrect RegExp specification in safelist rule " + name + " - not enough groups");
                                                    // * can't appear in a filename; escape it because it's feeding into a RegExp
                                                    return "\\*";
                                                }
                                                return ProjectService.escapeFilenameForRegex(groups[groupNumberOrString]);
                                            }
                                            return groupNumberOrString;
                                        }).join("");
                                    });
                                    if (excludeRules.indexOf(processedRule) === -1) {
                                        excludeRules.push(processedRule);
                                    }
                                };
                                for (var _c = 0, _d = rule.exclude; _c < _d.length; _c++) {
                                    var exclude = _d[_c];
                                    _loop_8(exclude);
                                }
                            }
                            else {
                                // If not rules listed, add the default rule to exclude the matched file
                                var escaped = ProjectService.escapeFilenameForRegex(root);
                                if (excludeRules.indexOf(escaped) < 0) {
                                    excludeRules.push(escaped);
                                }
                            }
                        }
                    }
                };
                var this_2 = this;
                for (var _i = 0, _a = Object.keys(this.safelist); _i < _a.length; _i++) {
                    var name = _a[_i];
                    _loop_6(name);
                }
                var excludeRegexes = excludeRules.map(function (e) { return new RegExp(e, "i"); });
                var filesToKeep = [];
                var _loop_7 = function (i) {
                    if (excludeRegexes.some(function (re) { return re.test(normalizedNames[i]); })) {
                        excludedFiles.push(normalizedNames[i]);
                    }
                    else {
                        var exclude = false;
                        if (typeAcquisition.enable || typeAcquisition.enableAutoDiscovery) {
                            var baseName = ts.getBaseFileName(ts.toFileNameLowerCase(normalizedNames[i]));
                            if (ts.fileExtensionIs(baseName, "js")) {
                                var inferredTypingName = ts.removeFileExtension(baseName);
                                var cleanedTypingName = ts.removeMinAndVersionNumbers(inferredTypingName);
                                var typeName = this_3.legacySafelist.get(cleanedTypingName);
                                if (typeName !== undefined) {
                                    this_3.logger.info("Excluded '" + normalizedNames[i] + "' because it matched " + cleanedTypingName + " from the legacy safelist");
                                    excludedFiles.push(normalizedNames[i]);
                                    // *exclude* it from the project...
                                    exclude = true;
                                    // ... but *include* it in the list of types to acquire
                                    // Same best-effort dedupe as above
                                    if (typeAcqInclude.indexOf(typeName) < 0) {
                                        typeAcqInclude.push(typeName);
                                    }
                                }
                            }
                        }
                        if (!exclude) {
                            // Exclude any minified files that get this far
                            if (/^.+[\.-]min\.js$/.test(normalizedNames[i])) {
                                excludedFiles.push(normalizedNames[i]);
                            }
                            else {
                                filesToKeep.push(proj.rootFiles[i]);
                            }
                        }
                    }
                };
                var this_3 = this;
                for (var i = 0; i < proj.rootFiles.length; i++) {
                    _loop_7(i);
                }
                proj.rootFiles = filesToKeep;
                return excludedFiles;
            };
            ProjectService.prototype.openExternalProject = function (proj) {
                // typingOptions has been deprecated and is only supported for backward compatibility
                // purposes. It should be removed in future releases - use typeAcquisition instead.
                if (proj.typingOptions && !proj.typeAcquisition) {
                    var typeAcquisition = ts.convertEnableAutoDiscoveryToEnable(proj.typingOptions);
                    proj.typeAcquisition = typeAcquisition;
                }
                proj.typeAcquisition = proj.typeAcquisition || {};
                proj.typeAcquisition.include = proj.typeAcquisition.include || [];
                proj.typeAcquisition.exclude = proj.typeAcquisition.exclude || [];
                if (proj.typeAcquisition.enable === undefined) {
                    proj.typeAcquisition.enable = server.hasNoTypeScriptSource(proj.rootFiles.map(function (f) { return f.fileName; }));
                }
                var excludedFiles = this.applySafeList(proj);
                var tsConfigFiles;
                var rootFiles = [];
                for (var _i = 0, _a = proj.rootFiles; _i < _a.length; _i++) {
                    var file = _a[_i];
                    var normalized = server.toNormalizedPath(file.fileName);
                    if (server.getBaseConfigFileName(normalized)) {
                        if (this.serverMode === ts.LanguageServiceMode.Semantic && this.host.fileExists(normalized)) {
                            (tsConfigFiles || (tsConfigFiles = [])).push(normalized);
                        }
                    }
                    else {
                        rootFiles.push(file);
                    }
                }
                // sort config files to simplify comparison later
                if (tsConfigFiles) {
                    tsConfigFiles.sort();
                }
                var externalProject = this.findExternalProjectByProjectName(proj.projectFileName);
                var exisingConfigFiles;
                if (externalProject) {
                    externalProject.excludedFiles = excludedFiles;
                    if (!tsConfigFiles) {
                        var compilerOptions = convertCompilerOptions(proj.options);
                        var watchOptions = convertWatchOptions(proj.options);
                        var lastFileExceededProgramSize = this.getFilenameForExceededTotalSizeLimitForNonTsFiles(proj.projectFileName, compilerOptions, proj.rootFiles, externalFilePropertyReader);
                        if (lastFileExceededProgramSize) {
                            externalProject.disableLanguageService(lastFileExceededProgramSize);
                        }
                        else {
                            externalProject.enableLanguageService();
                        }
                        // external project already exists and not config files were added - update the project and return;
                        // The graph update here isnt postponed since any file open operation needs all updated external projects
                        this.updateRootAndOptionsOfNonInferredProject(externalProject, proj.rootFiles, externalFilePropertyReader, compilerOptions, proj.typeAcquisition, proj.options.compileOnSave, watchOptions);
                        externalProject.updateGraph();
                        return;
                    }
                    // some config files were added to external project (that previously were not there)
                    // close existing project and later we'll open a set of configured projects for these files
                    this.closeExternalProject(proj.projectFileName);
                }
                else if (this.externalProjectToConfiguredProjectMap.get(proj.projectFileName)) {
                    // this project used to include config files
                    if (!tsConfigFiles) {
                        // config files were removed from the project - close existing external project which in turn will close configured projects
                        this.closeExternalProject(proj.projectFileName);
                    }
                    else {
                        // project previously had some config files - compare them with new set of files and close all configured projects that correspond to unused files
                        var oldConfigFiles = this.externalProjectToConfiguredProjectMap.get(proj.projectFileName);
                        var iNew = 0;
                        var iOld = 0;
                        while (iNew < tsConfigFiles.length && iOld < oldConfigFiles.length) {
                            var newConfig = tsConfigFiles[iNew];
                            var oldConfig = oldConfigFiles[iOld];
                            if (oldConfig < newConfig) {
                                this.closeConfiguredProjectReferencedFromExternalProject(oldConfig);
                                iOld++;
                            }
                            else if (oldConfig > newConfig) {
                                iNew++;
                            }
                            else {
                                // record existing config files so avoid extra add-refs
                                (exisingConfigFiles || (exisingConfigFiles = [])).push(oldConfig);
                                iOld++;
                                iNew++;
                            }
                        }
                        for (var i = iOld; i < oldConfigFiles.length; i++) {
                            // projects for all remaining old config files should be closed
                            this.closeConfiguredProjectReferencedFromExternalProject(oldConfigFiles[i]);
                        }
                    }
                }
                if (tsConfigFiles) {
                    // store the list of tsconfig files that belong to the external project
                    this.externalProjectToConfiguredProjectMap.set(proj.projectFileName, tsConfigFiles);
                    for (var _b = 0, tsConfigFiles_1 = tsConfigFiles; _b < tsConfigFiles_1.length; _b++) {
                        var tsconfigFile = tsConfigFiles_1[_b];
                        var project = this.findConfiguredProjectByProjectName(tsconfigFile);
                        if (!project) {
                            // errors are stored in the project, do not need to update the graph
                            project = this.getHostPreferences().lazyConfiguredProjectsFromExternalProject ?
                                this.createConfiguredProjectWithDelayLoad(tsconfigFile, "Creating configured project in external project: " + proj.projectFileName) :
                                this.createLoadAndUpdateConfiguredProject(tsconfigFile, "Creating configured project in external project: " + proj.projectFileName);
                        }
                        if (project && !ts.contains(exisingConfigFiles, tsconfigFile)) {
                            // keep project alive even if no documents are opened - its lifetime is bound to the lifetime of containing external project
                            project.addExternalProjectReference();
                        }
                    }
                }
                else {
                    // no config files - remove the item from the collection
                    // Create external project and update its graph, do not delay update since
                    // any file open operation needs all updated external projects
                    this.externalProjectToConfiguredProjectMap.delete(proj.projectFileName);
                    var project = this.createExternalProject(proj.projectFileName, rootFiles, proj.options, proj.typeAcquisition, excludedFiles);
                    project.updateGraph();
                }
            };
            ProjectService.prototype.hasDeferredExtension = function () {
                for (var _i = 0, _a = this.hostConfiguration.extraFileExtensions; _i < _a.length; _i++) { // TODO: GH#18217
                    var extension = _a[_i];
                    if (extension.scriptKind === 7 /* Deferred */) {
                        return true;
                    }
                }
                return false;
            };
            ProjectService.prototype.configurePlugin = function (args) {
                // For any projects that already have the plugin loaded, configure the plugin
                this.forEachEnabledProject(function (project) { return project.onPluginConfigurationChanged(args.pluginName, args.configuration); });
                // Also save the current configuration to pass on to any projects that are yet to be loaded.
                // If a plugin is configured twice, only the latest configuration will be remembered.
                this.currentPluginConfigOverrides = this.currentPluginConfigOverrides || new ts.Map();
                this.currentPluginConfigOverrides.set(args.pluginName, args.configuration);
            };
            /*@internal*/
            ProjectService.prototype.getPackageJsonsVisibleToFile = function (fileName, rootDir) {
                var _this = this;
                var packageJsonCache = this.packageJsonCache;
                var rootPath = rootDir && this.toPath(rootDir);
                var filePath = this.toPath(fileName);
                var result = [];
                var processDirectory = function (directory) {
                    switch (packageJsonCache.directoryHasPackageJson(directory)) {
                        // Sync and check same directory again
                        case 1 /* Maybe */:
                            packageJsonCache.searchDirectoryAndAncestors(directory);
                            return processDirectory(directory);
                        // Check package.json
                        case -1 /* True */:
                            var packageJsonFileName = ts.combinePaths(directory, "package.json");
                            _this.watchPackageJsonFile(packageJsonFileName);
                            var info = packageJsonCache.getInDirectory(directory);
                            if (info)
                                result.push(info);
                    }
                    if (rootPath && rootPath === _this.toPath(directory)) {
                        return true;
                    }
                };
                ts.forEachAncestorDirectory(ts.getDirectoryPath(filePath), processDirectory);
                return result;
            };
            /*@internal*/
            ProjectService.prototype.watchPackageJsonFile = function (path) {
                var _this = this;
                var watchers = this.packageJsonFilesMap || (this.packageJsonFilesMap = new ts.Map());
                if (!watchers.has(path)) {
                    this.invalidateProjectAutoImports(path);
                    watchers.set(path, this.watchFactory.watchFile(this.host, path, function (fileName, eventKind) {
                        var path = _this.toPath(fileName);
                        switch (eventKind) {
                            case ts.FileWatcherEventKind.Created:
                                return ts.Debug.fail();
                            case ts.FileWatcherEventKind.Changed:
                                _this.packageJsonCache.addOrUpdate(path);
                                _this.invalidateProjectAutoImports(path);
                                break;
                            case ts.FileWatcherEventKind.Deleted:
                                _this.packageJsonCache.delete(path);
                                _this.invalidateProjectAutoImports(path);
                                watchers.get(path).close();
                                watchers.delete(path);
                        }
                    }, ts.PollingInterval.Low, this.hostConfiguration.watchOptions, ts.WatchType.PackageJsonFile));
                }
            };
            /*@internal*/
            ProjectService.prototype.onAddPackageJson = function (path) {
                this.packageJsonCache.addOrUpdate(path);
                this.watchPackageJsonFile(path);
            };
            /*@internal*/
            ProjectService.prototype.includePackageJsonAutoImports = function () {
                switch (this.hostConfiguration.preferences.includePackageJsonAutoImports) {
                    case "on": return 1 /* On */;
                    case "off": return 0 /* Off */;
                    default: return 2 /* Auto */;
                }
            };
            /*@internal*/
            ProjectService.prototype.invalidateProjectAutoImports = function (packageJsonPath) {
                if (this.includePackageJsonAutoImports()) {
                    this.configuredProjects.forEach(invalidate);
                    this.inferredProjects.forEach(invalidate);
                    this.externalProjects.forEach(invalidate);
                }
                function invalidate(project) {
                    var _a;
                    if (!packageJsonPath || ((_a = project.packageJsonsForAutoImport) === null || _a === void 0 ? void 0 : _a.has(packageJsonPath))) {
                        project.markAutoImportProviderAsDirty();
                    }
                }
            };
            /** Makes a filename safe to insert in a RegExp */
            ProjectService.filenameEscapeRegexp = /[-\/\\^$*+?.()|[\]{}]/g;
            return ProjectService;
        }());
        server.ProjectService = ProjectService;
        /* @internal */
        function isConfigFile(config) {
            return config.kind !== undefined;
        }
        server.isConfigFile = isConfigFile;
        function printProjectWithoutFileNames(project) {
            project.print(/*writeProjectFileNames*/ false);
        }
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
/*@internal*/
var ts;
(function (ts) {
    var server;
    (function (server) {
        function createPackageJsonCache(host) {
            var packageJsons = new ts.Map();
            var directoriesWithoutPackageJson = new ts.Map();
            return {
                addOrUpdate: addOrUpdate,
                forEach: packageJsons.forEach.bind(packageJsons),
                get: packageJsons.get.bind(packageJsons),
                delete: function (fileName) {
                    packageJsons.delete(fileName);
                    directoriesWithoutPackageJson.set(ts.getDirectoryPath(fileName), true);
                },
                getInDirectory: function (directory) {
                    return packageJsons.get(ts.combinePaths(directory, "package.json")) || undefined;
                },
                directoryHasPackageJson: directoryHasPackageJson,
                searchDirectoryAndAncestors: function (directory) {
                    ts.forEachAncestorDirectory(directory, function (ancestor) {
                        if (directoryHasPackageJson(ancestor) !== 1 /* Maybe */) {
                            return true;
                        }
                        var packageJsonFileName = host.toPath(ts.combinePaths(ancestor, "package.json"));
                        if (ts.tryFileExists(host, packageJsonFileName)) {
                            addOrUpdate(packageJsonFileName);
                        }
                        else {
                            directoriesWithoutPackageJson.set(ancestor, true);
                        }
                    });
                },
            };
            function addOrUpdate(fileName) {
                var packageJsonInfo = ts.Debug.checkDefined(ts.createPackageJsonInfo(fileName, host.host));
                packageJsons.set(fileName, packageJsonInfo);
                directoriesWithoutPackageJson.delete(ts.getDirectoryPath(fileName));
            }
            function directoryHasPackageJson(directory) {
                return packageJsons.has(ts.combinePaths(directory, "package.json")) ? -1 /* True */ :
                    directoriesWithoutPackageJson.has(directory) ? 0 /* False */ :
                        1 /* Maybe */;
            }
        }
        server.createPackageJsonCache = createPackageJsonCache;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        server.nullCancellationToken = {
            isCancellationRequested: function () { return false; },
            setRequest: function () { return void 0; },
            resetRequest: function () { return void 0; }
        };
        function hrTimeToMilliseconds(time) {
            var seconds = time[0];
            var nanoseconds = time[1];
            return ((1e9 * seconds) + nanoseconds) / 1000000.0;
        }
        function isDeclarationFileInJSOnlyNonConfiguredProject(project, file) {
            // Checking for semantic diagnostics is an expensive process. We want to avoid it if we
            // know for sure it is not needed.
            // For instance, .d.ts files injected by ATA automatically do not produce any relevant
            // errors to a JS- only project.
            //
            // Note that configured projects can set skipLibCheck (on by default in jsconfig.json) to
            // disable checking for declaration files. We only need to verify for inferred projects (e.g.
            // miscellaneous context in VS) and external projects(e.g.VS.csproj project) with only JS
            // files.
            //
            // We still want to check .js files in a JS-only inferred or external project (e.g. if the
            // file has '// @ts-check').
            if ((server.isInferredProject(project) || server.isExternalProject(project)) &&
                project.isJsOnlyProject()) {
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                return scriptInfo && !scriptInfo.isJavaScript();
            }
            return false;
        }
        function dtsChangeCanAffectEmit(compilationSettings) {
            return ts.getEmitDeclarations(compilationSettings) || !!compilationSettings.emitDecoratorMetadata;
        }
        function formatDiag(fileName, project, diag) {
            var scriptInfo = project.getScriptInfoForNormalizedPath(fileName); // TODO: GH#18217
            return {
                start: scriptInfo.positionToLineOffset(diag.start),
                end: scriptInfo.positionToLineOffset(diag.start + diag.length),
                text: ts.flattenDiagnosticMessageText(diag.messageText, "\n"),
                code: diag.code,
                category: ts.diagnosticCategoryName(diag),
                reportsUnnecessary: diag.reportsUnnecessary,
                reportsDeprecated: diag.reportsDeprecated,
                source: diag.source,
                relatedInformation: ts.map(diag.relatedInformation, formatRelatedInformation),
            };
        }
        function formatRelatedInformation(info) {
            if (!info.file) {
                return {
                    message: ts.flattenDiagnosticMessageText(info.messageText, "\n"),
                    category: ts.diagnosticCategoryName(info),
                    code: info.code
                };
            }
            return {
                span: {
                    start: convertToLocation(ts.getLineAndCharacterOfPosition(info.file, info.start)),
                    end: convertToLocation(ts.getLineAndCharacterOfPosition(info.file, info.start + info.length)),
                    file: info.file.fileName
                },
                message: ts.flattenDiagnosticMessageText(info.messageText, "\n"),
                category: ts.diagnosticCategoryName(info),
                code: info.code
            };
        }
        function convertToLocation(lineAndCharacter) {
            return { line: lineAndCharacter.line + 1, offset: lineAndCharacter.character + 1 };
        }
        function formatDiagnosticToProtocol(diag, includeFileName) {
            var start = (diag.file && convertToLocation(ts.getLineAndCharacterOfPosition(diag.file, diag.start))); // TODO: GH#18217
            var end = (diag.file && convertToLocation(ts.getLineAndCharacterOfPosition(diag.file, diag.start + diag.length))); // TODO: GH#18217
            var text = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
            var code = diag.code, source = diag.source;
            var category = ts.diagnosticCategoryName(diag);
            var common = {
                start: start,
                end: end,
                text: text,
                code: code,
                category: category,
                reportsUnnecessary: diag.reportsUnnecessary,
                reportsDeprecated: diag.reportsDeprecated,
                source: source,
                relatedInformation: ts.map(diag.relatedInformation, formatRelatedInformation),
            };
            return includeFileName
                ? __assign(__assign({}, common), { fileName: diag.file && diag.file.fileName }) : common;
        }
        function allEditsBeforePos(edits, pos) {
            return edits.every(function (edit) { return ts.textSpanEnd(edit.span) < pos; });
        }
        server.CommandNames = server.protocol.CommandTypes;
        function formatMessage(msg, logger, byteLength, newLine) {
            var verboseLogging = logger.hasLevel(server.LogLevel.verbose);
            var json = JSON.stringify(msg);
            if (verboseLogging) {
                logger.info(msg.type + ":" + server.indent(json));
            }
            var len = byteLength(json, "utf8");
            return "Content-Length: " + (1 + len) + "\r\n\r\n" + json + newLine;
        }
        server.formatMessage = formatMessage;
        /**
         * Represents operation that can schedule its next step to be executed later.
         * Scheduling is done via instance of NextStep. If on current step subsequent step was not scheduled - operation is assumed to be completed.
         */
        var MultistepOperation = /** @class */ (function () {
            function MultistepOperation(operationHost) {
                this.operationHost = operationHost;
            }
            MultistepOperation.prototype.startNew = function (action) {
                this.complete();
                this.requestId = this.operationHost.getCurrentRequestId();
                this.executeAction(action);
            };
            MultistepOperation.prototype.complete = function () {
                if (this.requestId !== undefined) {
                    this.operationHost.sendRequestCompletedEvent(this.requestId);
                    this.requestId = undefined;
                }
                this.setTimerHandle(undefined);
                this.setImmediateId(undefined);
            };
            MultistepOperation.prototype.immediate = function (action) {
                var _this = this;
                var requestId = this.requestId;
                ts.Debug.assert(requestId === this.operationHost.getCurrentRequestId(), "immediate: incorrect request id");
                this.setImmediateId(this.operationHost.getServerHost().setImmediate(function () {
                    _this.immediateId = undefined;
                    _this.operationHost.executeWithRequestId(requestId, function () { return _this.executeAction(action); });
                }));
            };
            MultistepOperation.prototype.delay = function (ms, action) {
                var _this = this;
                var requestId = this.requestId;
                ts.Debug.assert(requestId === this.operationHost.getCurrentRequestId(), "delay: incorrect request id");
                this.setTimerHandle(this.operationHost.getServerHost().setTimeout(function () {
                    _this.timerHandle = undefined;
                    _this.operationHost.executeWithRequestId(requestId, function () { return _this.executeAction(action); });
                }, ms));
            };
            MultistepOperation.prototype.executeAction = function (action) {
                var stop = false;
                try {
                    if (this.operationHost.isCancellationRequested()) {
                        stop = true;
                    }
                    else {
                        action(this);
                    }
                }
                catch (e) {
                    stop = true;
                    // ignore cancellation request
                    if (!(e instanceof ts.OperationCanceledException)) {
                        this.operationHost.logError(e, "delayed processing of request " + this.requestId);
                    }
                }
                if (stop || !this.hasPendingWork()) {
                    this.complete();
                }
            };
            MultistepOperation.prototype.setTimerHandle = function (timerHandle) {
                if (this.timerHandle !== undefined) {
                    this.operationHost.getServerHost().clearTimeout(this.timerHandle);
                }
                this.timerHandle = timerHandle;
            };
            MultistepOperation.prototype.setImmediateId = function (immediateId) {
                if (this.immediateId !== undefined) {
                    this.operationHost.getServerHost().clearImmediate(this.immediateId);
                }
                this.immediateId = immediateId;
            };
            MultistepOperation.prototype.hasPendingWork = function () {
                return !!this.timerHandle || !!this.immediateId;
            };
            return MultistepOperation;
        }());
        /** @internal */
        function toEvent(eventName, body) {
            return {
                seq: 0,
                type: "event",
                event: eventName,
                body: body
            };
        }
        server.toEvent = toEvent;
        /**
         * This helper function processes a list of projects and return the concatenated, sortd and deduplicated output of processing each project.
         */
        function combineProjectOutput(defaultValue, getValue, projects, action) {
            var outputs = ts.flatMapToMutable(ts.isArray(projects) ? projects : projects.projects, function (project) { return action(project, defaultValue); });
            if (!ts.isArray(projects) && projects.symLinkedProjects) {
                projects.symLinkedProjects.forEach(function (projects, path) {
                    var value = getValue(path);
                    outputs.push.apply(outputs, ts.flatMap(projects, function (project) { return action(project, value); }));
                });
            }
            return ts.deduplicate(outputs, ts.equateValues);
        }
        function combineOutputResultContains(outputs, output, areEqual) {
            return outputs.some(function (_a) {
                var result = _a.result;
                return ts.contains(result, output, areEqual);
            });
        }
        function addToCombineOutputResult(outputs, project, result) {
            if (result.length)
                outputs.push({ project: project, result: result });
        }
        function combineProjectOutputFromEveryProject(projectService, action, areEqual) {
            var outputs = [];
            projectService.loadAncestorProjectTree();
            projectService.forEachEnabledProject(function (project) {
                var theseOutputs = action(project);
                addToCombineOutputResult(outputs, project, ts.filter(theseOutputs, function (output) { return !combineOutputResultContains(outputs, output, areEqual); }));
            });
            return outputs;
        }
        function flattenCombineOutputResult(outputs) {
            return ts.flatMap(outputs, function (_a) {
                var result = _a.result;
                return result;
            });
        }
        function combineProjectOutputWhileOpeningReferencedProjects(projects, defaultProject, action, getLocation, resultsEqual) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, 
            /*initialLocation*/ undefined, function (project, _, tryAddToTodo) {
                var theseOutputs = action(project);
                addToCombineOutputResult(outputs, project, ts.filter(theseOutputs, function (output) { return !combineOutputResultContains(outputs, output, resultsEqual) && !tryAddToTodo(project, getLocation(output)); }));
            });
            return outputs;
        }
        function combineProjectOutputForRenameLocations(projects, defaultProject, initialLocation, findInStrings, findInComments, hostPreferences) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, initialLocation, function (project, location, tryAddToTodo) {
                for (var _i = 0, _a = project.getLanguageService().findRenameLocations(location.fileName, location.pos, findInStrings, findInComments, hostPreferences.providePrefixAndSuffixTextForRename) || server.emptyArray; _i < _a.length; _i++) {
                    var output = _a[_i];
                    if (!ts.contains(outputs, output, ts.documentSpansEqual) && !tryAddToTodo(project, documentSpanLocation(output))) {
                        outputs.push(output);
                    }
                }
            });
            return outputs;
        }
        function getDefinitionLocation(defaultProject, initialLocation) {
            var infos = defaultProject.getLanguageService().getDefinitionAtPosition(initialLocation.fileName, initialLocation.pos);
            var info = infos && ts.firstOrUndefined(infos);
            return info && !info.isLocal ? { fileName: info.fileName, pos: info.textSpan.start } : undefined;
        }
        function combineProjectOutputForReferences(projects, defaultProject, initialLocation) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, initialLocation, function (project, location, getMappedLocation) {
                var _loop_9 = function (outputReferencedSymbol) {
                    var mappedDefinitionFile = getMappedLocation(project, documentSpanLocation(outputReferencedSymbol.definition));
                    var definition = mappedDefinitionFile === undefined ?
                        outputReferencedSymbol.definition : __assign(__assign({}, outputReferencedSymbol.definition), { textSpan: ts.createTextSpan(mappedDefinitionFile.pos, outputReferencedSymbol.definition.textSpan.length), fileName: mappedDefinitionFile.fileName, contextSpan: getMappedContextSpan(outputReferencedSymbol.definition, project) });
                    var symbolToAddTo = ts.find(outputs, function (o) { return ts.documentSpansEqual(o.definition, definition); });
                    if (!symbolToAddTo) {
                        symbolToAddTo = { definition: definition, references: [] };
                        outputs.push(symbolToAddTo);
                    }
                    for (var _i = 0, _a = outputReferencedSymbol.references; _i < _a.length; _i++) {
                        var ref = _a[_i];
                        // If it's in a mapped file, that is added to the todo list by `getMappedLocation`.
                        if (!ts.contains(symbolToAddTo.references, ref, ts.documentSpansEqual) && !getMappedLocation(project, documentSpanLocation(ref))) {
                            symbolToAddTo.references.push(ref);
                        }
                    }
                };
                for (var _i = 0, _a = project.getLanguageService().findReferences(location.fileName, location.pos) || server.emptyArray; _i < _a.length; _i++) {
                    var outputReferencedSymbol = _a[_i];
                    _loop_9(outputReferencedSymbol);
                }
            });
            return outputs.filter(function (o) { return o.references.length !== 0; });
        }
        function forEachProjectInProjects(projects, path, cb) {
            for (var _i = 0, _a = ts.isArray(projects) ? projects : projects.projects; _i < _a.length; _i++) {
                var project = _a[_i];
                cb(project, path);
            }
            if (!ts.isArray(projects) && projects.symLinkedProjects) {
                projects.symLinkedProjects.forEach(function (symlinkedProjects, symlinkedPath) {
                    for (var _i = 0, symlinkedProjects_1 = symlinkedProjects; _i < symlinkedProjects_1.length; _i++) {
                        var project = symlinkedProjects_1[_i];
                        cb(project, symlinkedPath);
                    }
                });
            }
        }
        function combineProjectOutputWorker(projects, defaultProject, initialLocation, cb) {
            var projectService = defaultProject.projectService;
            var toDo;
            var seenProjects = new ts.Set();
            forEachProjectInProjects(projects, initialLocation && initialLocation.fileName, function (project, path) {
                // TLocation should be either `DocumentPosition` or `undefined`. Since `initialLocation` is `TLocation` this cast should be valid.
                var location = (initialLocation ? { fileName: path, pos: initialLocation.pos } : undefined);
                toDo = callbackProjectAndLocation(project, location, projectService, toDo, seenProjects, cb);
            });
            // After initial references are collected, go over every other project and see if it has a reference for the symbol definition.
            if (initialLocation) {
                var defaultDefinition_1 = getDefinitionLocation(defaultProject, initialLocation);
                if (defaultDefinition_1) {
                    var getGeneratedDefinition_1 = ts.memoize(function () { return defaultProject.isSourceOfProjectReferenceRedirect(defaultDefinition_1.fileName) ?
                        defaultDefinition_1 :
                        defaultProject.getLanguageService().getSourceMapper().tryGetGeneratedPosition(defaultDefinition_1); });
                    var getSourceDefinition_1 = ts.memoize(function () { return defaultProject.isSourceOfProjectReferenceRedirect(defaultDefinition_1.fileName) ?
                        defaultDefinition_1 :
                        defaultProject.getLanguageService().getSourceMapper().tryGetSourcePosition(defaultDefinition_1); });
                    projectService.loadAncestorProjectTree(seenProjects);
                    projectService.forEachEnabledProject(function (project) {
                        if (!addToSeen(seenProjects, project))
                            return;
                        var definition = mapDefinitionInProject(defaultDefinition_1, project, getGeneratedDefinition_1, getSourceDefinition_1);
                        if (definition) {
                            toDo = callbackProjectAndLocation(project, definition, projectService, toDo, seenProjects, cb);
                        }
                    });
                }
            }
            while (toDo && toDo.length) {
                var next = toDo.pop();
                ts.Debug.assertIsDefined(next);
                toDo = callbackProjectAndLocation(next.project, next.location, projectService, toDo, seenProjects, cb);
            }
        }
        function mapDefinitionInProject(definition, project, getGeneratedDefinition, getSourceDefinition) {
            // If the definition is actually from the project, definition is correct as is
            if (project.containsFile(server.toNormalizedPath(definition.fileName)) &&
                !isLocationProjectReferenceRedirect(project, definition)) {
                return definition;
            }
            var generatedDefinition = getGeneratedDefinition();
            if (generatedDefinition && project.containsFile(server.toNormalizedPath(generatedDefinition.fileName)))
                return generatedDefinition;
            var sourceDefinition = getSourceDefinition();
            return sourceDefinition && project.containsFile(server.toNormalizedPath(sourceDefinition.fileName)) ? sourceDefinition : undefined;
        }
        function isLocationProjectReferenceRedirect(project, location) {
            if (!location)
                return false;
            var program = project.getLanguageService().getProgram();
            if (!program)
                return false;
            var sourceFile = program.getSourceFile(location.fileName);
            // It is possible that location is attached to project but
            // the program actually includes its redirect instead.
            // This happens when rootFile in project is one of the file from referenced project
            // Thus root is attached but program doesnt have the actual .ts file but .d.ts
            // If this is not the file we were actually looking, return rest of the toDo
            return !!sourceFile &&
                sourceFile.resolvedPath !== sourceFile.path &&
                sourceFile.resolvedPath !== project.toPath(location.fileName);
        }
        function callbackProjectAndLocation(project, location, projectService, toDo, seenProjects, cb) {
            if (project.getCancellationToken().isCancellationRequested())
                return undefined; // Skip rest of toDo if cancelled
            // If this is not the file we were actually looking, return rest of the toDo
            if (isLocationProjectReferenceRedirect(project, location))
                return toDo;
            cb(project, location, function (innerProject, location) {
                addToSeen(seenProjects, project);
                var originalLocation = projectService.getOriginalLocationEnsuringConfiguredProject(innerProject, location);
                if (!originalLocation)
                    return undefined;
                var originalScriptInfo = projectService.getScriptInfo(originalLocation.fileName);
                toDo = toDo || [];
                for (var _i = 0, _a = originalScriptInfo.containingProjects; _i < _a.length; _i++) {
                    var project_1 = _a[_i];
                    addToTodo(project_1, originalLocation, toDo, seenProjects);
                }
                var symlinkedProjectsMap = projectService.getSymlinkedProjects(originalScriptInfo);
                if (symlinkedProjectsMap) {
                    symlinkedProjectsMap.forEach(function (symlinkedProjects, symlinkedPath) {
                        for (var _i = 0, symlinkedProjects_2 = symlinkedProjects; _i < symlinkedProjects_2.length; _i++) {
                            var symlinkedProject = symlinkedProjects_2[_i];
                            addToTodo(symlinkedProject, { fileName: symlinkedPath, pos: originalLocation.pos }, toDo, seenProjects);
                        }
                    });
                }
                return originalLocation === location ? undefined : originalLocation;
            });
            return toDo;
        }
        function addToTodo(project, location, toDo, seenProjects) {
            if (addToSeen(seenProjects, project))
                toDo.push({ project: project, location: location });
        }
        function addToSeen(seenProjects, project) {
            return ts.tryAddToSet(seenProjects, getProjectKey(project));
        }
        function getProjectKey(project) {
            return server.isConfiguredProject(project) ? project.canonicalConfigFilePath : project.getProjectName();
        }
        function documentSpanLocation(_a) {
            var fileName = _a.fileName, textSpan = _a.textSpan;
            return { fileName: fileName, pos: textSpan.start };
        }
        function getMappedLocation(location, project) {
            var mapsTo = project.getSourceMapper().tryGetSourcePosition(location);
            return mapsTo && project.projectService.fileExists(server.toNormalizedPath(mapsTo.fileName)) ? mapsTo : undefined;
        }
        function getMappedDocumentSpan(documentSpan, project) {
            var newPosition = getMappedLocation(documentSpanLocation(documentSpan), project);
            if (!newPosition)
                return undefined;
            return {
                fileName: newPosition.fileName,
                textSpan: {
                    start: newPosition.pos,
                    length: documentSpan.textSpan.length
                },
                originalFileName: documentSpan.fileName,
                originalTextSpan: documentSpan.textSpan,
                contextSpan: getMappedContextSpan(documentSpan, project),
                originalContextSpan: documentSpan.contextSpan
            };
        }
        function getMappedContextSpan(documentSpan, project) {
            var contextSpanStart = documentSpan.contextSpan && getMappedLocation({ fileName: documentSpan.fileName, pos: documentSpan.contextSpan.start }, project);
            var contextSpanEnd = documentSpan.contextSpan && getMappedLocation({ fileName: documentSpan.fileName, pos: documentSpan.contextSpan.start + documentSpan.contextSpan.length }, project);
            return contextSpanStart && contextSpanEnd ?
                { start: contextSpanStart.pos, length: contextSpanEnd.pos - contextSpanStart.pos } :
                undefined;
        }
        var invalidPartialSemanticModeCommands = [
            server.CommandNames.OpenExternalProject,
            server.CommandNames.OpenExternalProjects,
            server.CommandNames.CloseExternalProject,
            server.CommandNames.SynchronizeProjectList,
            server.CommandNames.EmitOutput,
            server.CommandNames.CompileOnSaveAffectedFileList,
            server.CommandNames.CompileOnSaveEmitFile,
            server.CommandNames.CompilerOptionsDiagnosticsFull,
            server.CommandNames.EncodedSemanticClassificationsFull,
            server.CommandNames.SemanticDiagnosticsSync,
            server.CommandNames.SyntacticDiagnosticsSync,
            server.CommandNames.SuggestionDiagnosticsSync,
            server.CommandNames.Geterr,
            server.CommandNames.GeterrForProject,
            server.CommandNames.Reload,
            server.CommandNames.ReloadProjects,
            server.CommandNames.GetCodeFixes,
            server.CommandNames.GetCodeFixesFull,
            server.CommandNames.GetCombinedCodeFix,
            server.CommandNames.GetCombinedCodeFixFull,
            server.CommandNames.ApplyCodeActionCommand,
            server.CommandNames.GetSupportedCodeFixes,
            server.CommandNames.GetApplicableRefactors,
            server.CommandNames.GetEditsForRefactor,
            server.CommandNames.GetEditsForRefactorFull,
            server.CommandNames.OrganizeImports,
            server.CommandNames.OrganizeImportsFull,
            server.CommandNames.GetEditsForFileRename,
            server.CommandNames.GetEditsForFileRenameFull,
            server.CommandNames.ConfigurePlugin,
            server.CommandNames.PrepareCallHierarchy,
            server.CommandNames.ProvideCallHierarchyIncomingCalls,
            server.CommandNames.ProvideCallHierarchyOutgoingCalls,
        ];
        var invalidSyntacticModeCommands = __spreadArrays(invalidPartialSemanticModeCommands, [
            server.CommandNames.Definition,
            server.CommandNames.DefinitionFull,
            server.CommandNames.DefinitionAndBoundSpan,
            server.CommandNames.DefinitionAndBoundSpanFull,
            server.CommandNames.TypeDefinition,
            server.CommandNames.Implementation,
            server.CommandNames.ImplementationFull,
            server.CommandNames.References,
            server.CommandNames.ReferencesFull,
            server.CommandNames.Rename,
            server.CommandNames.RenameLocationsFull,
            server.CommandNames.RenameInfoFull,
            server.CommandNames.Quickinfo,
            server.CommandNames.QuickinfoFull,
            server.CommandNames.CompletionInfo,
            server.CommandNames.Completions,
            server.CommandNames.CompletionsFull,
            server.CommandNames.CompletionDetails,
            server.CommandNames.CompletionDetailsFull,
            server.CommandNames.SignatureHelp,
            server.CommandNames.SignatureHelpFull,
            server.CommandNames.Navto,
            server.CommandNames.NavtoFull,
            server.CommandNames.Occurrences,
            server.CommandNames.DocumentHighlights,
            server.CommandNames.DocumentHighlightsFull,
        ]);
        var Session = /** @class */ (function () {
            function Session(opts) {
                var _a;
                var _this = this;
                this.changeSeq = 0;
                this.handlers = new ts.Map(ts.getEntries((_a = {},
                    _a[server.CommandNames.Status] = function () {
                        var response = { version: ts.version }; // eslint-disable-line @typescript-eslint/no-unnecessary-qualifier
                        return _this.requiredResponse(response);
                    },
                    _a[server.CommandNames.OpenExternalProject] = function (request) {
                        _this.projectService.openExternalProject(request.arguments);
                        // TODO: GH#20447 report errors
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.OpenExternalProjects] = function (request) {
                        _this.projectService.openExternalProjects(request.arguments.projects);
                        // TODO: GH#20447 report errors
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.CloseExternalProject] = function (request) {
                        _this.projectService.closeExternalProject(request.arguments.projectFileName);
                        // TODO: GH#20447 report errors
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.SynchronizeProjectList] = function (request) {
                        var result = _this.projectService.synchronizeProjectList(request.arguments.knownProjects, request.arguments.includeProjectReferenceRedirectInfo);
                        if (!result.some(function (p) { return p.projectErrors && p.projectErrors.length !== 0; })) {
                            return _this.requiredResponse(result);
                        }
                        var converted = ts.map(result, function (p) {
                            if (!p.projectErrors || p.projectErrors.length === 0) {
                                return p;
                            }
                            return {
                                info: p.info,
                                changes: p.changes,
                                files: p.files,
                                projectErrors: _this.convertToDiagnosticsWithLinePosition(p.projectErrors, /*scriptInfo*/ undefined)
                            };
                        });
                        return _this.requiredResponse(converted);
                    },
                    _a[server.CommandNames.UpdateOpen] = function (request) {
                        _this.changeSeq++;
                        _this.projectService.applyChangesInOpenFiles(request.arguments.openFiles && ts.mapIterator(ts.arrayIterator(request.arguments.openFiles), function (file) { return ({
                            fileName: file.file,
                            content: file.fileContent,
                            scriptKind: file.scriptKindName,
                            projectRootPath: file.projectRootPath
                        }); }), request.arguments.changedFiles && ts.mapIterator(ts.arrayIterator(request.arguments.changedFiles), function (file) { return ({
                            fileName: file.fileName,
                            changes: ts.mapDefinedIterator(ts.arrayReverseIterator(file.textChanges), function (change) {
                                var scriptInfo = ts.Debug.checkDefined(_this.projectService.getScriptInfo(file.fileName));
                                var start = scriptInfo.lineOffsetToPosition(change.start.line, change.start.offset);
                                var end = scriptInfo.lineOffsetToPosition(change.end.line, change.end.offset);
                                return start >= 0 ? { span: { start: start, length: end - start }, newText: change.newText } : undefined;
                            })
                        }); }), request.arguments.closedFiles);
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.ApplyChangedToOpenFiles] = function (request) {
                        _this.changeSeq++;
                        _this.projectService.applyChangesInOpenFiles(request.arguments.openFiles && ts.arrayIterator(request.arguments.openFiles), request.arguments.changedFiles && ts.mapIterator(ts.arrayIterator(request.arguments.changedFiles), function (file) { return ({
                            fileName: file.fileName,
                            // apply changes in reverse order
                            changes: ts.arrayReverseIterator(file.changes)
                        }); }), request.arguments.closedFiles);
                        // TODO: report errors
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.Exit] = function () {
                        _this.exit();
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Definition] = function (request) {
                        return _this.requiredResponse(_this.getDefinition(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.DefinitionFull] = function (request) {
                        return _this.requiredResponse(_this.getDefinition(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.DefinitionAndBoundSpan] = function (request) {
                        return _this.requiredResponse(_this.getDefinitionAndBoundSpan(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.DefinitionAndBoundSpanFull] = function (request) {
                        return _this.requiredResponse(_this.getDefinitionAndBoundSpan(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.EmitOutput] = function (request) {
                        return _this.requiredResponse(_this.getEmitOutput(request.arguments));
                    },
                    _a[server.CommandNames.TypeDefinition] = function (request) {
                        return _this.requiredResponse(_this.getTypeDefinition(request.arguments));
                    },
                    _a[server.CommandNames.Implementation] = function (request) {
                        return _this.requiredResponse(_this.getImplementation(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.ImplementationFull] = function (request) {
                        return _this.requiredResponse(_this.getImplementation(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.References] = function (request) {
                        return _this.requiredResponse(_this.getReferences(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.ReferencesFull] = function (request) {
                        return _this.requiredResponse(_this.getReferences(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.Rename] = function (request) {
                        return _this.requiredResponse(_this.getRenameLocations(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.RenameLocationsFull] = function (request) {
                        return _this.requiredResponse(_this.getRenameLocations(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.RenameInfoFull] = function (request) {
                        return _this.requiredResponse(_this.getRenameInfo(request.arguments));
                    },
                    _a[server.CommandNames.Open] = function (request) {
                        _this.openClientFile(server.toNormalizedPath(request.arguments.file), request.arguments.fileContent, server.convertScriptKindName(request.arguments.scriptKindName), // TODO: GH#18217
                        request.arguments.projectRootPath ? server.toNormalizedPath(request.arguments.projectRootPath) : undefined);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Quickinfo] = function (request) {
                        return _this.requiredResponse(_this.getQuickInfoWorker(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.QuickinfoFull] = function (request) {
                        return _this.requiredResponse(_this.getQuickInfoWorker(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.GetOutliningSpans] = function (request) {
                        return _this.requiredResponse(_this.getOutliningSpans(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.GetOutliningSpansFull] = function (request) {
                        return _this.requiredResponse(_this.getOutliningSpans(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.TodoComments] = function (request) {
                        return _this.requiredResponse(_this.getTodoComments(request.arguments));
                    },
                    _a[server.CommandNames.Indentation] = function (request) {
                        return _this.requiredResponse(_this.getIndentation(request.arguments));
                    },
                    _a[server.CommandNames.NameOrDottedNameSpan] = function (request) {
                        return _this.requiredResponse(_this.getNameOrDottedNameSpan(request.arguments));
                    },
                    _a[server.CommandNames.BreakpointStatement] = function (request) {
                        return _this.requiredResponse(_this.getBreakpointStatement(request.arguments));
                    },
                    _a[server.CommandNames.BraceCompletion] = function (request) {
                        return _this.requiredResponse(_this.isValidBraceCompletion(request.arguments));
                    },
                    _a[server.CommandNames.DocCommentTemplate] = function (request) {
                        return _this.requiredResponse(_this.getDocCommentTemplate(request.arguments));
                    },
                    _a[server.CommandNames.GetSpanOfEnclosingComment] = function (request) {
                        return _this.requiredResponse(_this.getSpanOfEnclosingComment(request.arguments));
                    },
                    _a[server.CommandNames.Format] = function (request) {
                        return _this.requiredResponse(_this.getFormattingEditsForRange(request.arguments));
                    },
                    _a[server.CommandNames.Formatonkey] = function (request) {
                        return _this.requiredResponse(_this.getFormattingEditsAfterKeystroke(request.arguments));
                    },
                    _a[server.CommandNames.FormatFull] = function (request) {
                        return _this.requiredResponse(_this.getFormattingEditsForDocumentFull(request.arguments));
                    },
                    _a[server.CommandNames.FormatonkeyFull] = function (request) {
                        return _this.requiredResponse(_this.getFormattingEditsAfterKeystrokeFull(request.arguments));
                    },
                    _a[server.CommandNames.FormatRangeFull] = function (request) {
                        return _this.requiredResponse(_this.getFormattingEditsForRangeFull(request.arguments));
                    },
                    _a[server.CommandNames.CompletionInfo] = function (request) {
                        return _this.requiredResponse(_this.getCompletions(request.arguments, server.CommandNames.CompletionInfo));
                    },
                    _a[server.CommandNames.Completions] = function (request) {
                        return _this.requiredResponse(_this.getCompletions(request.arguments, server.CommandNames.Completions));
                    },
                    _a[server.CommandNames.CompletionsFull] = function (request) {
                        return _this.requiredResponse(_this.getCompletions(request.arguments, server.CommandNames.CompletionsFull));
                    },
                    _a[server.CommandNames.CompletionDetails] = function (request) {
                        return _this.requiredResponse(_this.getCompletionEntryDetails(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.CompletionDetailsFull] = function (request) {
                        return _this.requiredResponse(_this.getCompletionEntryDetails(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.CompileOnSaveAffectedFileList] = function (request) {
                        return _this.requiredResponse(_this.getCompileOnSaveAffectedFileList(request.arguments));
                    },
                    _a[server.CommandNames.CompileOnSaveEmitFile] = function (request) {
                        return _this.requiredResponse(_this.emitFile(request.arguments));
                    },
                    _a[server.CommandNames.SignatureHelp] = function (request) {
                        return _this.requiredResponse(_this.getSignatureHelpItems(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.SignatureHelpFull] = function (request) {
                        return _this.requiredResponse(_this.getSignatureHelpItems(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.CompilerOptionsDiagnosticsFull] = function (request) {
                        return _this.requiredResponse(_this.getCompilerOptionsDiagnostics(request.arguments));
                    },
                    _a[server.CommandNames.EncodedSyntacticClassificationsFull] = function (request) {
                        return _this.requiredResponse(_this.getEncodedSyntacticClassifications(request.arguments));
                    },
                    _a[server.CommandNames.EncodedSemanticClassificationsFull] = function (request) {
                        return _this.requiredResponse(_this.getEncodedSemanticClassifications(request.arguments));
                    },
                    _a[server.CommandNames.Cleanup] = function () {
                        _this.cleanup();
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.SemanticDiagnosticsSync] = function (request) {
                        return _this.requiredResponse(_this.getSemanticDiagnosticsSync(request.arguments));
                    },
                    _a[server.CommandNames.SyntacticDiagnosticsSync] = function (request) {
                        return _this.requiredResponse(_this.getSyntacticDiagnosticsSync(request.arguments));
                    },
                    _a[server.CommandNames.SuggestionDiagnosticsSync] = function (request) {
                        return _this.requiredResponse(_this.getSuggestionDiagnosticsSync(request.arguments));
                    },
                    _a[server.CommandNames.Geterr] = function (request) {
                        _this.errorCheck.startNew(function (next) { return _this.getDiagnostics(next, request.arguments.delay, request.arguments.files); });
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.GeterrForProject] = function (request) {
                        _this.errorCheck.startNew(function (next) { return _this.getDiagnosticsForProject(next, request.arguments.delay, request.arguments.file); });
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Change] = function (request) {
                        _this.change(request.arguments);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Configure] = function (request) {
                        _this.projectService.setHostConfiguration(request.arguments);
                        _this.doOutput(/*info*/ undefined, server.CommandNames.Configure, request.seq, /*success*/ true);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Reload] = function (request) {
                        _this.reload(request.arguments, request.seq);
                        return _this.requiredResponse({ reloadFinished: true });
                    },
                    _a[server.CommandNames.Saveto] = function (request) {
                        var savetoArgs = request.arguments;
                        _this.saveToTmp(savetoArgs.file, savetoArgs.tmpfile);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Close] = function (request) {
                        var closeArgs = request.arguments;
                        _this.closeClientFile(closeArgs.file);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Navto] = function (request) {
                        return _this.requiredResponse(_this.getNavigateToItems(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.NavtoFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigateToItems(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.Brace] = function (request) {
                        return _this.requiredResponse(_this.getBraceMatching(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.BraceFull] = function (request) {
                        return _this.requiredResponse(_this.getBraceMatching(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.NavBar] = function (request) {
                        return _this.requiredResponse(_this.getNavigationBarItems(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.NavBarFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigationBarItems(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.NavTree] = function (request) {
                        return _this.requiredResponse(_this.getNavigationTree(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.NavTreeFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigationTree(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.Occurrences] = function (request) {
                        return _this.requiredResponse(_this.getOccurrences(request.arguments));
                    },
                    _a[server.CommandNames.DocumentHighlights] = function (request) {
                        return _this.requiredResponse(_this.getDocumentHighlights(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.DocumentHighlightsFull] = function (request) {
                        return _this.requiredResponse(_this.getDocumentHighlights(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.CompilerOptionsForInferredProjects] = function (request) {
                        _this.setCompilerOptionsForInferredProjects(request.arguments);
                        return _this.requiredResponse(/*response*/ true);
                    },
                    _a[server.CommandNames.ProjectInfo] = function (request) {
                        return _this.requiredResponse(_this.getProjectInfo(request.arguments));
                    },
                    _a[server.CommandNames.ReloadProjects] = function () {
                        _this.projectService.reloadProjects();
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.JsxClosingTag] = function (request) {
                        return _this.requiredResponse(_this.getJsxClosingTag(request.arguments));
                    },
                    _a[server.CommandNames.GetCodeFixes] = function (request) {
                        return _this.requiredResponse(_this.getCodeFixes(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.GetCodeFixesFull] = function (request) {
                        return _this.requiredResponse(_this.getCodeFixes(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.GetCombinedCodeFix] = function (request) {
                        return _this.requiredResponse(_this.getCombinedCodeFix(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.GetCombinedCodeFixFull] = function (request) {
                        return _this.requiredResponse(_this.getCombinedCodeFix(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.ApplyCodeActionCommand] = function (request) {
                        return _this.requiredResponse(_this.applyCodeActionCommand(request.arguments));
                    },
                    _a[server.CommandNames.GetSupportedCodeFixes] = function () {
                        return _this.requiredResponse(_this.getSupportedCodeFixes());
                    },
                    _a[server.CommandNames.GetApplicableRefactors] = function (request) {
                        return _this.requiredResponse(_this.getApplicableRefactors(request.arguments));
                    },
                    _a[server.CommandNames.GetEditsForRefactor] = function (request) {
                        return _this.requiredResponse(_this.getEditsForRefactor(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.GetEditsForRefactorFull] = function (request) {
                        return _this.requiredResponse(_this.getEditsForRefactor(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.OrganizeImports] = function (request) {
                        return _this.requiredResponse(_this.organizeImports(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.OrganizeImportsFull] = function (request) {
                        return _this.requiredResponse(_this.organizeImports(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.GetEditsForFileRename] = function (request) {
                        return _this.requiredResponse(_this.getEditsForFileRename(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.GetEditsForFileRenameFull] = function (request) {
                        return _this.requiredResponse(_this.getEditsForFileRename(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.ConfigurePlugin] = function (request) {
                        _this.configurePlugin(request.arguments);
                        _this.doOutput(/*info*/ undefined, server.CommandNames.ConfigurePlugin, request.seq, /*success*/ true);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.SelectionRange] = function (request) {
                        return _this.requiredResponse(_this.getSmartSelectionRange(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.SelectionRangeFull] = function (request) {
                        return _this.requiredResponse(_this.getSmartSelectionRange(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.PrepareCallHierarchy] = function (request) {
                        return _this.requiredResponse(_this.prepareCallHierarchy(request.arguments));
                    },
                    _a[server.CommandNames.ProvideCallHierarchyIncomingCalls] = function (request) {
                        return _this.requiredResponse(_this.provideCallHierarchyIncomingCalls(request.arguments));
                    },
                    _a[server.CommandNames.ProvideCallHierarchyOutgoingCalls] = function (request) {
                        return _this.requiredResponse(_this.provideCallHierarchyOutgoingCalls(request.arguments));
                    },
                    _a[server.CommandNames.ToggleLineComment] = function (request) {
                        return _this.requiredResponse(_this.toggleLineComment(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.ToggleLineCommentFull] = function (request) {
                        return _this.requiredResponse(_this.toggleLineComment(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.ToggleMultilineComment] = function (request) {
                        return _this.requiredResponse(_this.toggleMultilineComment(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.ToggleMultilineCommentFull] = function (request) {
                        return _this.requiredResponse(_this.toggleMultilineComment(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.CommentSelection] = function (request) {
                        return _this.requiredResponse(_this.commentSelection(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.CommentSelectionFull] = function (request) {
                        return _this.requiredResponse(_this.commentSelection(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a[server.CommandNames.UncommentSelection] = function (request) {
                        return _this.requiredResponse(_this.uncommentSelection(request.arguments, /*simplifiedResult*/ true));
                    },
                    _a[server.CommandNames.UncommentSelectionFull] = function (request) {
                        return _this.requiredResponse(_this.uncommentSelection(request.arguments, /*simplifiedResult*/ false));
                    },
                    _a)));
                this.host = opts.host;
                this.cancellationToken = opts.cancellationToken;
                this.typingsInstaller = opts.typingsInstaller;
                this.byteLength = opts.byteLength;
                this.hrtime = opts.hrtime;
                this.logger = opts.logger;
                this.canUseEvents = opts.canUseEvents;
                this.suppressDiagnosticEvents = opts.suppressDiagnosticEvents;
                this.noGetErrOnBackgroundUpdate = opts.noGetErrOnBackgroundUpdate;
                var throttleWaitMilliseconds = opts.throttleWaitMilliseconds;
                this.eventHandler = this.canUseEvents
                    ? opts.eventHandler || (function (event) { return _this.defaultEventHandler(event); })
                    : undefined;
                var multistepOperationHost = {
                    executeWithRequestId: function (requestId, action) { return _this.executeWithRequestId(requestId, action); },
                    getCurrentRequestId: function () { return _this.currentRequestId; },
                    getServerHost: function () { return _this.host; },
                    logError: function (err, cmd) { return _this.logError(err, cmd); },
                    sendRequestCompletedEvent: function (requestId) { return _this.sendRequestCompletedEvent(requestId); },
                    isCancellationRequested: function () { return _this.cancellationToken.isCancellationRequested(); }
                };
                this.errorCheck = new MultistepOperation(multistepOperationHost);
                var settings = {
                    host: this.host,
                    logger: this.logger,
                    cancellationToken: this.cancellationToken,
                    useSingleInferredProject: opts.useSingleInferredProject,
                    useInferredProjectPerProjectRoot: opts.useInferredProjectPerProjectRoot,
                    typingsInstaller: this.typingsInstaller,
                    throttleWaitMilliseconds: throttleWaitMilliseconds,
                    eventHandler: this.eventHandler,
                    suppressDiagnosticEvents: this.suppressDiagnosticEvents,
                    globalPlugins: opts.globalPlugins,
                    pluginProbeLocations: opts.pluginProbeLocations,
                    allowLocalPluginLoads: opts.allowLocalPluginLoads,
                    typesMapLocation: opts.typesMapLocation,
                    syntaxOnly: opts.syntaxOnly,
                    serverMode: opts.serverMode,
                };
                this.projectService = new server.ProjectService(settings);
                this.projectService.setPerformanceEventHandler(this.performanceEventHandler.bind(this));
                this.gcTimer = new server.GcTimer(this.host, /*delay*/ 7000, this.logger);
                // Make sure to setup handlers to throw error for not allowed commands on syntax server
                switch (this.projectService.serverMode) {
                    case ts.LanguageServiceMode.Semantic:
                        break;
                    case ts.LanguageServiceMode.PartialSemantic:
                        invalidPartialSemanticModeCommands.forEach(function (commandName) {
                            return _this.handlers.set(commandName, function (request) {
                                throw new Error("Request: " + request.command + " not allowed in LanguageServiceMode.PartialSemantic");
                            });
                        });
                        break;
                    case ts.LanguageServiceMode.Syntactic:
                        invalidSyntacticModeCommands.forEach(function (commandName) {
                            return _this.handlers.set(commandName, function (request) {
                                throw new Error("Request: " + request.command + " not allowed in LanguageServiceMode.Syntactic");
                            });
                        });
                        break;
                    default:
                        ts.Debug.assertNever(this.projectService.serverMode);
                }
            }
            Session.prototype.sendRequestCompletedEvent = function (requestId) {
                this.event({ request_seq: requestId }, "requestCompleted");
            };
            Session.prototype.addPerformanceData = function (key, value) {
                var _a;
                if (!this.performanceData) {
                    this.performanceData = {};
                }
                this.performanceData[key] = ((_a = this.performanceData[key]) !== null && _a !== void 0 ? _a : 0) + value;
            };
            Session.prototype.performanceEventHandler = function (event) {
                switch (event.kind) {
                    case "UpdateGraph":
                        this.addPerformanceData("updateGraphDurationMs", event.durationMs);
                        break;
                    case "CreatePackageJsonAutoImportProvider":
                        this.addPerformanceData("createAutoImportProviderProgramDurationMs", event.durationMs);
                        break;
                }
            };
            Session.prototype.defaultEventHandler = function (event) {
                switch (event.eventName) {
                    case server.ProjectsUpdatedInBackgroundEvent:
                        var openFiles = event.data.openFiles;
                        this.projectsUpdatedInBackgroundEvent(openFiles);
                        break;
                    case server.ProjectLoadingStartEvent:
                        var _a = event.data, project = _a.project, reason = _a.reason;
                        this.event({ projectName: project.getProjectName(), reason: reason }, server.ProjectLoadingStartEvent);
                        break;
                    case server.ProjectLoadingFinishEvent:
                        var finishProject = event.data.project;
                        this.event({ projectName: finishProject.getProjectName() }, server.ProjectLoadingFinishEvent);
                        break;
                    case server.LargeFileReferencedEvent:
                        var _b = event.data, file = _b.file, fileSize = _b.fileSize, maxFileSize_1 = _b.maxFileSize;
                        this.event({ file: file, fileSize: fileSize, maxFileSize: maxFileSize_1 }, server.LargeFileReferencedEvent);
                        break;
                    case server.ConfigFileDiagEvent:
                        var _c = event.data, triggerFile = _c.triggerFile, configFile = _c.configFileName, diagnostics = _c.diagnostics;
                        var bakedDiags = ts.map(diagnostics, function (diagnostic) { return formatDiagnosticToProtocol(diagnostic, /*includeFileName*/ true); });
                        this.event({
                            triggerFile: triggerFile,
                            configFile: configFile,
                            diagnostics: bakedDiags
                        }, server.ConfigFileDiagEvent);
                        break;
                    case server.ProjectLanguageServiceStateEvent: {
                        var eventName = server.ProjectLanguageServiceStateEvent;
                        this.event({
                            projectName: event.data.project.getProjectName(),
                            languageServiceEnabled: event.data.languageServiceEnabled
                        }, eventName);
                        break;
                    }
                    case server.ProjectInfoTelemetryEvent: {
                        var eventName = "telemetry";
                        this.event({
                            telemetryEventName: event.eventName,
                            payload: event.data,
                        }, eventName);
                        break;
                    }
                }
            };
            Session.prototype.projectsUpdatedInBackgroundEvent = function (openFiles) {
                var _this = this;
                this.projectService.logger.info("got projects updated in background, updating diagnostics for " + openFiles);
                if (openFiles.length) {
                    if (!this.suppressDiagnosticEvents && !this.noGetErrOnBackgroundUpdate) {
                        // For now only queue error checking for open files. We can change this to include non open files as well
                        this.errorCheck.startNew(function (next) { return _this.updateErrorCheck(next, openFiles, 100, /*requireOpen*/ true); });
                    }
                    // Send project changed event
                    this.event({
                        openFiles: openFiles
                    }, server.ProjectsUpdatedInBackgroundEvent);
                }
            };
            Session.prototype.logError = function (err, cmd) {
                this.logErrorWorker(err, cmd);
            };
            Session.prototype.logErrorWorker = function (err, cmd, fileRequest) {
                var msg = "Exception on executing command " + cmd;
                if (err.message) {
                    msg += ":\n" + server.indent(err.message);
                    if (err.stack) {
                        msg += "\n" + server.indent(err.stack);
                    }
                }
                if (this.logger.hasLevel(server.LogLevel.verbose)) {
                    if (fileRequest) {
                        try {
                            var _a = this.getFileAndProject(fileRequest), file = _a.file, project = _a.project;
                            var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                            if (scriptInfo) {
                                var text = ts.getSnapshotText(scriptInfo.getSnapshot());
                                msg += "\n\nFile text of " + fileRequest.file + ":" + server.indent(text) + "\n";
                            }
                        }
                        catch (_b) { } // eslint-disable-line no-empty
                    }
                    if (err.ProgramFiles) {
                        msg += "\n\nProgram files: " + JSON.stringify(err.ProgramFiles) + "\n";
                        msg += "\n\nProjects::\n";
                        var counter_1 = 0;
                        var addProjectInfo = function (project) {
                            msg += "\nProject '" + project.projectName + "' (" + server.ProjectKind[project.projectKind] + ") " + counter_1 + "\n";
                            msg += project.filesToString(/*writeProjectFileNames*/ true);
                            msg += "\n-----------------------------------------------\n";
                            counter_1++;
                        };
                        this.projectService.externalProjects.forEach(addProjectInfo);
                        this.projectService.configuredProjects.forEach(addProjectInfo);
                        this.projectService.inferredProjects.forEach(addProjectInfo);
                    }
                }
                this.logger.msg(msg, server.Msg.Err);
            };
            Session.prototype.send = function (msg) {
                if (msg.type === "event" && !this.canUseEvents) {
                    if (this.logger.hasLevel(server.LogLevel.verbose)) {
                        this.logger.info("Session does not support events: ignored event: " + JSON.stringify(msg));
                    }
                    return;
                }
                var msgText = formatMessage(msg, this.logger, this.byteLength, this.host.newLine);
                ts.perfLogger.logEvent("Response message size: " + msgText.length);
                this.host.write(msgText);
            };
            Session.prototype.event = function (body, eventName) {
                this.send(toEvent(eventName, body));
            };
            // For backwards-compatibility only.
            /** @deprecated */
            Session.prototype.output = function (info, cmdName, reqSeq, errorMsg) {
                this.doOutput(info, cmdName, reqSeq, /*success*/ !errorMsg, errorMsg); // TODO: GH#18217
            };
            Session.prototype.doOutput = function (info, cmdName, reqSeq, success, message) {
                var res = {
                    seq: 0,
                    type: "response",
                    command: cmdName,
                    request_seq: reqSeq,
                    success: success,
                    performanceData: this.performanceData
                };
                if (success) {
                    var metadata = void 0;
                    if (ts.isArray(info)) {
                        res.body = info;
                        metadata = info.metadata;
                        delete info.metadata;
                    }
                    else if (typeof info === "object") {
                        if (info.metadata) {
                            var _a = info, infoMetadata = _a.metadata, body = __rest(_a, ["metadata"]);
                            res.body = body;
                            metadata = infoMetadata;
                        }
                        else {
                            res.body = info;
                        }
                    }
                    else {
                        res.body = info;
                    }
                    if (metadata)
                        res.metadata = metadata;
                }
                else {
                    ts.Debug.assert(info === undefined);
                }
                if (message) {
                    res.message = message;
                }
                this.send(res);
            };
            Session.prototype.semanticCheck = function (file, project) {
                var diags = isDeclarationFileInJSOnlyNonConfiguredProject(project, file)
                    ? server.emptyArray
                    : project.getLanguageService().getSemanticDiagnostics(file).filter(function (d) { return !!d.file; });
                this.sendDiagnosticsEvent(file, project, diags, "semanticDiag");
            };
            Session.prototype.syntacticCheck = function (file, project) {
                this.sendDiagnosticsEvent(file, project, project.getLanguageService().getSyntacticDiagnostics(file), "syntaxDiag");
            };
            Session.prototype.suggestionCheck = function (file, project) {
                this.sendDiagnosticsEvent(file, project, project.getLanguageService().getSuggestionDiagnostics(file), "suggestionDiag");
            };
            Session.prototype.sendDiagnosticsEvent = function (file, project, diagnostics, kind) {
                try {
                    this.event({ file: file, diagnostics: diagnostics.map(function (diag) { return formatDiag(file, project, diag); }) }, kind);
                }
                catch (err) {
                    this.logError(err, kind);
                }
            };
            /** It is the caller's responsibility to verify that `!this.suppressDiagnosticEvents`. */
            Session.prototype.updateErrorCheck = function (next, checkList, ms, requireOpen) {
                var _this = this;
                if (requireOpen === void 0) { requireOpen = true; }
                ts.Debug.assert(!this.suppressDiagnosticEvents); // Caller's responsibility
                var seq = this.changeSeq;
                var followMs = Math.min(ms, 200);
                var index = 0;
                var goNext = function () {
                    index++;
                    if (checkList.length > index) {
                        next.delay(followMs, checkOne);
                    }
                };
                var checkOne = function () {
                    if (_this.changeSeq !== seq) {
                        return;
                    }
                    var item = checkList[index];
                    if (ts.isString(item)) {
                        // Find out project for the file name
                        item = _this.toPendingErrorCheck(item);
                        if (!item) {
                            // Ignore file if there is no project for the file
                            goNext();
                            return;
                        }
                    }
                    var fileName = item.fileName, project = item.project;
                    // Ensure the project is upto date before checking if this file is present in the project
                    server.updateProjectIfDirty(project);
                    if (!project.containsFile(fileName, requireOpen)) {
                        return;
                    }
                    _this.syntacticCheck(fileName, project);
                    if (_this.changeSeq !== seq) {
                        return;
                    }
                    next.immediate(function () {
                        _this.semanticCheck(fileName, project);
                        if (_this.changeSeq !== seq) {
                            return;
                        }
                        if (_this.getPreferences(fileName).disableSuggestions) {
                            goNext();
                        }
                        else {
                            next.immediate(function () {
                                _this.suggestionCheck(fileName, project);
                                goNext();
                            });
                        }
                    });
                };
                if (checkList.length > index && this.changeSeq === seq) {
                    next.delay(ms, checkOne);
                }
            };
            Session.prototype.cleanProjects = function (caption, projects) {
                if (!projects) {
                    return;
                }
                this.logger.info("cleaning " + caption);
                for (var _i = 0, projects_4 = projects; _i < projects_4.length; _i++) {
                    var p = projects_4[_i];
                    p.getLanguageService(/*ensureSynchronized*/ false).cleanupSemanticCache();
                }
            };
            Session.prototype.cleanup = function () {
                this.cleanProjects("inferred projects", this.projectService.inferredProjects);
                this.cleanProjects("configured projects", ts.arrayFrom(this.projectService.configuredProjects.values()));
                this.cleanProjects("external projects", this.projectService.externalProjects);
                if (this.host.gc) {
                    this.logger.info("host.gc()");
                    this.host.gc();
                }
            };
            Session.prototype.getEncodedSyntacticClassifications = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                return languageService.getEncodedSyntacticClassifications(file, args);
            };
            Session.prototype.getEncodedSemanticClassifications = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                return project.getLanguageService().getEncodedSemanticClassifications(file, args);
            };
            Session.prototype.getProject = function (projectFileName) {
                return projectFileName === undefined ? undefined : this.projectService.findProject(projectFileName);
            };
            Session.prototype.getConfigFileAndProject = function (args) {
                var project = this.getProject(args.projectFileName);
                var file = server.toNormalizedPath(args.file);
                return {
                    configFile: project && project.hasConfigFile(file) ? file : undefined,
                    project: project
                };
            };
            Session.prototype.getConfigFileDiagnostics = function (configFile, project, includeLinePosition) {
                var projectErrors = project.getAllProjectErrors();
                var optionsErrors = project.getLanguageService().getCompilerOptionsDiagnostics();
                var diagnosticsForConfigFile = ts.filter(ts.concatenate(projectErrors, optionsErrors), function (diagnostic) { return !!diagnostic.file && diagnostic.file.fileName === configFile; });
                return includeLinePosition ?
                    this.convertToDiagnosticsWithLinePositionFromDiagnosticFile(diagnosticsForConfigFile) :
                    ts.map(diagnosticsForConfigFile, function (diagnostic) { return formatDiagnosticToProtocol(diagnostic, /*includeFileName*/ false); });
            };
            Session.prototype.convertToDiagnosticsWithLinePositionFromDiagnosticFile = function (diagnostics) {
                var _this = this;
                return diagnostics.map(function (d) { return ({
                    message: ts.flattenDiagnosticMessageText(d.messageText, _this.host.newLine),
                    start: d.start,
                    length: d.length,
                    category: ts.diagnosticCategoryName(d),
                    code: d.code,
                    source: d.source,
                    startLocation: (d.file && convertToLocation(ts.getLineAndCharacterOfPosition(d.file, d.start))),
                    endLocation: (d.file && convertToLocation(ts.getLineAndCharacterOfPosition(d.file, d.start + d.length))),
                    reportsUnnecessary: d.reportsUnnecessary,
                    reportsDeprecated: d.reportsDeprecated,
                    relatedInformation: ts.map(d.relatedInformation, formatRelatedInformation)
                }); });
            };
            Session.prototype.getCompilerOptionsDiagnostics = function (args) {
                var project = this.getProject(args.projectFileName);
                // Get diagnostics that dont have associated file with them
                // The diagnostics which have file would be in config file and
                // would be reported as part of configFileDiagnostics
                return this.convertToDiagnosticsWithLinePosition(ts.filter(project.getLanguageService().getCompilerOptionsDiagnostics(), function (diagnostic) { return !diagnostic.file; }), 
                /*scriptInfo*/ undefined);
            };
            Session.prototype.convertToDiagnosticsWithLinePosition = function (diagnostics, scriptInfo) {
                var _this = this;
                return diagnostics.map(function (d) { return ({
                    message: ts.flattenDiagnosticMessageText(d.messageText, _this.host.newLine),
                    start: d.start,
                    length: d.length,
                    category: ts.diagnosticCategoryName(d),
                    code: d.code,
                    source: d.source,
                    startLocation: scriptInfo && scriptInfo.positionToLineOffset(d.start),
                    endLocation: scriptInfo && scriptInfo.positionToLineOffset(d.start + d.length),
                    reportsUnnecessary: d.reportsUnnecessary,
                    reportsDeprecated: d.reportsDeprecated,
                    relatedInformation: ts.map(d.relatedInformation, formatRelatedInformation),
                }); });
            };
            Session.prototype.getDiagnosticsWorker = function (args, isSemantic, selector, includeLinePosition) {
                var _a = this.getFileAndProject(args), project = _a.project, file = _a.file;
                if (isSemantic && isDeclarationFileInJSOnlyNonConfiguredProject(project, file)) {
                    return server.emptyArray;
                }
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                var diagnostics = selector(project, file);
                return includeLinePosition
                    ? this.convertToDiagnosticsWithLinePosition(diagnostics, scriptInfo)
                    : diagnostics.map(function (d) { return formatDiag(file, project, d); });
            };
            Session.prototype.getDefinition = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var definitions = this.mapDefinitionInfoLocations(project.getLanguageService().getDefinitionAtPosition(file, position) || server.emptyArray, project);
                return simplifiedResult ? this.mapDefinitionInfo(definitions, project) : definitions.map(Session.mapToOriginalLocation);
            };
            Session.prototype.mapDefinitionInfoLocations = function (definitions, project) {
                return definitions.map(function (info) {
                    var newDocumentSpan = getMappedDocumentSpan(info, project);
                    return !newDocumentSpan ? info : __assign(__assign({}, newDocumentSpan), { containerKind: info.containerKind, containerName: info.containerName, kind: info.kind, name: info.name });
                });
            };
            Session.prototype.getDefinitionAndBoundSpan = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var scriptInfo = ts.Debug.checkDefined(project.getScriptInfo(file));
                var unmappedDefinitionAndBoundSpan = project.getLanguageService().getDefinitionAndBoundSpan(file, position);
                if (!unmappedDefinitionAndBoundSpan || !unmappedDefinitionAndBoundSpan.definitions) {
                    return {
                        definitions: server.emptyArray,
                        textSpan: undefined // TODO: GH#18217
                    };
                }
                var definitions = this.mapDefinitionInfoLocations(unmappedDefinitionAndBoundSpan.definitions, project);
                var textSpan = unmappedDefinitionAndBoundSpan.textSpan;
                if (simplifiedResult) {
                    return {
                        definitions: this.mapDefinitionInfo(definitions, project),
                        textSpan: toProtocolTextSpan(textSpan, scriptInfo)
                    };
                }
                return {
                    definitions: definitions.map(Session.mapToOriginalLocation),
                    textSpan: textSpan,
                };
            };
            Session.prototype.getEmitOutput = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                if (!project.shouldEmitFile(project.getScriptInfo(file))) {
                    return { emitSkipped: true, outputFiles: [], diagnostics: [] };
                }
                var result = project.getLanguageService().getEmitOutput(file);
                return args.richResponse ? __assign(__assign({}, result), { diagnostics: args.includeLinePosition ?
                        this.convertToDiagnosticsWithLinePositionFromDiagnosticFile(result.diagnostics) :
                        result.diagnostics.map(function (d) { return formatDiagnosticToProtocol(d, /*includeFileName*/ true); }) }) :
                    result;
            };
            Session.prototype.mapDefinitionInfo = function (definitions, project) {
                var _this = this;
                return definitions.map(function (def) { return _this.toFileSpanWithContext(def.fileName, def.textSpan, def.contextSpan, project); });
            };
            /*
             * When we map a .d.ts location to .ts, Visual Studio gets confused because there's no associated Roslyn Document in
             * the same project which corresponds to the file. VS Code has no problem with this, and luckily we have two protocols.
             * This retains the existing behavior for the "simplified" (VS Code) protocol but stores the .d.ts location in a
             * set of additional fields, and does the reverse for VS (store the .d.ts location where
             * it used to be and stores the .ts location in the additional fields).
            */
            Session.mapToOriginalLocation = function (def) {
                if (def.originalFileName) {
                    ts.Debug.assert(def.originalTextSpan !== undefined, "originalTextSpan should be present if originalFileName is");
                    return __assign(__assign({}, def), { fileName: def.originalFileName, textSpan: def.originalTextSpan, targetFileName: def.fileName, targetTextSpan: def.textSpan, contextSpan: def.originalContextSpan, targetContextSpan: def.contextSpan });
                }
                return def;
            };
            Session.prototype.toFileSpan = function (fileName, textSpan, project) {
                var ls = project.getLanguageService();
                var start = ls.toLineColumnOffset(fileName, textSpan.start); // TODO: GH#18217
                var end = ls.toLineColumnOffset(fileName, ts.textSpanEnd(textSpan));
                return {
                    file: fileName,
                    start: { line: start.line + 1, offset: start.character + 1 },
                    end: { line: end.line + 1, offset: end.character + 1 }
                };
            };
            Session.prototype.toFileSpanWithContext = function (fileName, textSpan, contextSpan, project) {
                var fileSpan = this.toFileSpan(fileName, textSpan, project);
                var context = contextSpan && this.toFileSpan(fileName, contextSpan, project);
                return context ? __assign(__assign({}, fileSpan), { contextStart: context.start, contextEnd: context.end }) :
                    fileSpan;
            };
            Session.prototype.getTypeDefinition = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var definitions = this.mapDefinitionInfoLocations(project.getLanguageService().getTypeDefinitionAtPosition(file, position) || server.emptyArray, project);
                return this.mapDefinitionInfo(definitions, project);
            };
            Session.prototype.mapImplementationLocations = function (implementations, project) {
                return implementations.map(function (info) {
                    var newDocumentSpan = getMappedDocumentSpan(info, project);
                    return !newDocumentSpan ? info : __assign(__assign({}, newDocumentSpan), { kind: info.kind, displayParts: info.displayParts });
                });
            };
            Session.prototype.getImplementation = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var implementations = this.mapImplementationLocations(project.getLanguageService().getImplementationAtPosition(file, position) || server.emptyArray, project);
                return simplifiedResult ?
                    implementations.map(function (_a) {
                        var fileName = _a.fileName, textSpan = _a.textSpan, contextSpan = _a.contextSpan;
                        return _this.toFileSpanWithContext(fileName, textSpan, contextSpan, project);
                    }) :
                    implementations.map(Session.mapToOriginalLocation);
            };
            Session.prototype.getOccurrences = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var occurrences = project.getLanguageService().getOccurrencesAtPosition(file, position);
                return occurrences ?
                    occurrences.map(function (occurrence) {
                        var fileName = occurrence.fileName, isWriteAccess = occurrence.isWriteAccess, textSpan = occurrence.textSpan, isInString = occurrence.isInString, contextSpan = occurrence.contextSpan;
                        var scriptInfo = project.getScriptInfo(fileName);
                        return __assign(__assign(__assign({}, toProtocolTextSpanWithContext(textSpan, contextSpan, scriptInfo)), { file: fileName, isWriteAccess: isWriteAccess }), (isInString ? { isInString: isInString } : undefined));
                    }) :
                    server.emptyArray;
            };
            Session.prototype.getSyntacticDiagnosticsSync = function (args) {
                var configFile = this.getConfigFileAndProject(args).configFile;
                if (configFile) {
                    // all the config file errors are reported as part of semantic check so nothing to report here
                    return server.emptyArray;
                }
                return this.getDiagnosticsWorker(args, /*isSemantic*/ false, function (project, file) { return project.getLanguageService().getSyntacticDiagnostics(file); }, !!args.includeLinePosition);
            };
            Session.prototype.getSemanticDiagnosticsSync = function (args) {
                var _a = this.getConfigFileAndProject(args), configFile = _a.configFile, project = _a.project;
                if (configFile) {
                    return this.getConfigFileDiagnostics(configFile, project, !!args.includeLinePosition); // TODO: GH#18217
                }
                return this.getDiagnosticsWorker(args, /*isSemantic*/ true, function (project, file) { return project.getLanguageService().getSemanticDiagnostics(file).filter(function (d) { return !!d.file; }); }, !!args.includeLinePosition);
            };
            Session.prototype.getSuggestionDiagnosticsSync = function (args) {
                var configFile = this.getConfigFileAndProject(args).configFile;
                if (configFile) {
                    // Currently there are no info diagnostics for config files.
                    return server.emptyArray;
                }
                // isSemantic because we don't want to info diagnostics in declaration files for JS-only users
                return this.getDiagnosticsWorker(args, /*isSemantic*/ true, function (project, file) { return project.getLanguageService().getSuggestionDiagnostics(file); }, !!args.includeLinePosition);
            };
            Session.prototype.getJsxClosingTag = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                var tag = languageService.getJsxClosingTagAtPosition(file, position);
                return tag === undefined ? undefined : { newText: tag.newText, caretOffset: 0 };
            };
            Session.prototype.getDocumentHighlights = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var documentHighlights = project.getLanguageService().getDocumentHighlights(file, position, args.filesToSearch);
                if (!documentHighlights)
                    return server.emptyArray;
                if (!simplifiedResult)
                    return documentHighlights;
                return documentHighlights.map(function (_a) {
                    var fileName = _a.fileName, highlightSpans = _a.highlightSpans;
                    var scriptInfo = project.getScriptInfo(fileName);
                    return {
                        file: fileName,
                        highlightSpans: highlightSpans.map(function (_a) {
                            var textSpan = _a.textSpan, kind = _a.kind, contextSpan = _a.contextSpan;
                            return (__assign(__assign({}, toProtocolTextSpanWithContext(textSpan, contextSpan, scriptInfo)), { kind: kind }));
                        })
                    };
                });
            };
            Session.prototype.setCompilerOptionsForInferredProjects = function (args) {
                this.projectService.setCompilerOptionsForInferredProjects(args.options, args.projectRootPath);
            };
            Session.prototype.getProjectInfo = function (args) {
                return this.getProjectInfoWorker(args.file, args.projectFileName, args.needFileNameList, /*excludeConfigFiles*/ false);
            };
            Session.prototype.getProjectInfoWorker = function (uncheckedFileName, projectFileName, needFileNameList, excludeConfigFiles) {
                var project = this.getFileAndProjectWorker(uncheckedFileName, projectFileName).project;
                server.updateProjectIfDirty(project);
                var projectInfo = {
                    configFileName: project.getProjectName(),
                    languageServiceDisabled: !project.languageServiceEnabled,
                    fileNames: needFileNameList ? project.getFileNames(/*excludeFilesFromExternalLibraries*/ false, excludeConfigFiles) : undefined
                };
                return projectInfo;
            };
            Session.prototype.getRenameInfo = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                return project.getLanguageService().getRenameInfo(file, position, { allowRenameOfImportPath: this.getPreferences(file).allowRenameOfImportPath });
            };
            Session.prototype.getProjects = function (args, getScriptInfoEnsuringProjectsUptoDate, ignoreNoProjectError) {
                var _a;
                var projects;
                var symLinkedProjects;
                if (args.projectFileName) {
                    var project = this.getProject(args.projectFileName);
                    if (project) {
                        projects = [project];
                    }
                }
                else {
                    var scriptInfo = getScriptInfoEnsuringProjectsUptoDate ?
                        this.projectService.getScriptInfoEnsuringProjectsUptoDate(args.file) :
                        this.projectService.getScriptInfo(args.file);
                    if (!scriptInfo) {
                        if (ignoreNoProjectError)
                            return server.emptyArray;
                        this.projectService.logErrorForScriptInfoNotFound(args.file);
                        return server.Errors.ThrowNoProject();
                    }
                    projects = scriptInfo.containingProjects;
                    symLinkedProjects = this.projectService.getSymlinkedProjects(scriptInfo);
                }
                // filter handles case when 'projects' is undefined
                projects = ts.filter(projects, function (p) { return p.languageServiceEnabled && !p.isOrphan(); });
                if (!ignoreNoProjectError && (!projects || !projects.length) && !symLinkedProjects) {
                    this.projectService.logErrorForScriptInfoNotFound((_a = args.file) !== null && _a !== void 0 ? _a : args.projectFileName);
                    return server.Errors.ThrowNoProject();
                }
                return symLinkedProjects ? { projects: projects, symLinkedProjects: symLinkedProjects } : projects; // TODO: GH#18217
            };
            Session.prototype.getDefaultProject = function (args) {
                if (args.projectFileName) {
                    var project = this.getProject(args.projectFileName);
                    if (project) {
                        return project;
                    }
                    if (!args.file) {
                        return server.Errors.ThrowNoProject();
                    }
                }
                var info = this.projectService.getScriptInfo(args.file);
                return info.getDefaultProject();
            };
            Session.prototype.getRenameLocations = function (args, simplifiedResult) {
                var file = server.toNormalizedPath(args.file);
                var position = this.getPositionInFile(args, file);
                var projects = this.getProjects(args);
                var locations = combineProjectOutputForRenameLocations(projects, this.getDefaultProject(args), { fileName: args.file, pos: position }, !!args.findInStrings, !!args.findInComments, this.getPreferences(file));
                if (!simplifiedResult)
                    return locations;
                var defaultProject = this.getDefaultProject(args);
                var renameInfo = this.mapRenameInfo(defaultProject.getLanguageService().getRenameInfo(file, position, { allowRenameOfImportPath: this.getPreferences(file).allowRenameOfImportPath }), ts.Debug.checkDefined(this.projectService.getScriptInfo(file)));
                return { info: renameInfo, locs: this.toSpanGroups(locations) };
            };
            Session.prototype.mapRenameInfo = function (info, scriptInfo) {
                if (info.canRename) {
                    var canRename = info.canRename, fileToRename = info.fileToRename, displayName = info.displayName, fullDisplayName = info.fullDisplayName, kind = info.kind, kindModifiers = info.kindModifiers, triggerSpan = info.triggerSpan;
                    return ts.identity({ canRename: canRename, fileToRename: fileToRename, displayName: displayName, fullDisplayName: fullDisplayName, kind: kind, kindModifiers: kindModifiers, triggerSpan: toProtocolTextSpan(triggerSpan, scriptInfo) });
                }
                else {
                    return info;
                }
            };
            Session.prototype.toSpanGroups = function (locations) {
                var map = new ts.Map();
                for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                    var _a = locations_1[_i];
                    var fileName = _a.fileName, textSpan = _a.textSpan, contextSpan = _a.contextSpan, _2 = _a.originalContextSpan, _ = _a.originalTextSpan, _1 = _a.originalFileName, prefixSuffixText = __rest(_a, ["fileName", "textSpan", "contextSpan", "originalContextSpan", "originalTextSpan", "originalFileName"]);
                    var group_1 = map.get(fileName);
                    if (!group_1)
                        map.set(fileName, group_1 = { file: fileName, locs: [] });
                    var scriptInfo = ts.Debug.checkDefined(this.projectService.getScriptInfo(fileName));
                    group_1.locs.push(__assign(__assign({}, toProtocolTextSpanWithContext(textSpan, contextSpan, scriptInfo)), prefixSuffixText));
                }
                return ts.arrayFrom(map.values());
            };
            Session.prototype.getReferences = function (args, simplifiedResult) {
                var _this = this;
                var file = server.toNormalizedPath(args.file);
                var projects = this.getProjects(args);
                var position = this.getPositionInFile(args, file);
                var references = combineProjectOutputForReferences(projects, this.getDefaultProject(args), { fileName: args.file, pos: position });
                if (!simplifiedResult)
                    return references;
                var defaultProject = this.getDefaultProject(args);
                var scriptInfo = defaultProject.getScriptInfoForNormalizedPath(file);
                var nameInfo = defaultProject.getLanguageService().getQuickInfoAtPosition(file, position);
                var symbolDisplayString = nameInfo ? ts.displayPartsToString(nameInfo.displayParts) : "";
                var nameSpan = nameInfo && nameInfo.textSpan;
                var symbolStartOffset = nameSpan ? scriptInfo.positionToLineOffset(nameSpan.start).offset : 0;
                var symbolName = nameSpan ? scriptInfo.getSnapshot().getText(nameSpan.start, ts.textSpanEnd(nameSpan)) : "";
                var refs = ts.flatMap(references, function (referencedSymbol) {
                    return referencedSymbol.references.map(function (_a) {
                        var fileName = _a.fileName, textSpan = _a.textSpan, contextSpan = _a.contextSpan, isWriteAccess = _a.isWriteAccess, isDefinition = _a.isDefinition;
                        var scriptInfo = ts.Debug.checkDefined(_this.projectService.getScriptInfo(fileName));
                        var span = toProtocolTextSpanWithContext(textSpan, contextSpan, scriptInfo);
                        var lineSpan = scriptInfo.lineToTextSpan(span.start.line - 1);
                        var lineText = scriptInfo.getSnapshot().getText(lineSpan.start, ts.textSpanEnd(lineSpan)).replace(/\r|\n/g, "");
                        return __assign(__assign({ file: fileName }, span), { lineText: lineText,
                            isWriteAccess: isWriteAccess,
                            isDefinition: isDefinition });
                    });
                });
                return { refs: refs, symbolName: symbolName, symbolStartOffset: symbolStartOffset, symbolDisplayString: symbolDisplayString };
            };
            /**
             * @param fileName is the name of the file to be opened
             * @param fileContent is a version of the file content that is known to be more up to date than the one on disk
             */
            Session.prototype.openClientFile = function (fileName, fileContent, scriptKind, projectRootPath) {
                this.projectService.openClientFileWithNormalizedPath(fileName, fileContent, scriptKind, /*hasMixedContent*/ false, projectRootPath);
            };
            Session.prototype.getPosition = function (args, scriptInfo) {
                return args.position !== undefined ? args.position : scriptInfo.lineOffsetToPosition(args.line, args.offset);
            };
            Session.prototype.getPositionInFile = function (args, file) {
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                return this.getPosition(args, scriptInfo);
            };
            Session.prototype.getFileAndProject = function (args) {
                return this.getFileAndProjectWorker(args.file, args.projectFileName);
            };
            Session.prototype.getFileAndLanguageServiceForSyntacticOperation = function (args) {
                // Since this is syntactic operation, there should always be project for the file
                // we wouldnt have to ensure project but rather throw if we dont get project
                var file = server.toNormalizedPath(args.file);
                var project = this.getProject(args.projectFileName) || this.projectService.tryGetDefaultProjectForFile(file);
                if (!project) {
                    return server.Errors.ThrowNoProject();
                }
                return {
                    file: file,
                    languageService: project.getLanguageService(/*ensureSynchronized*/ false)
                };
            };
            Session.prototype.getFileAndProjectWorker = function (uncheckedFileName, projectFileName) {
                var file = server.toNormalizedPath(uncheckedFileName);
                var project = this.getProject(projectFileName) || this.projectService.ensureDefaultProjectForFile(file);
                return { file: file, project: project };
            };
            Session.prototype.getOutliningSpans = function (args, simplifiedResult) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var spans = languageService.getOutliningSpans(file);
                if (simplifiedResult) {
                    var scriptInfo_1 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return spans.map(function (s) { return ({
                        textSpan: toProtocolTextSpan(s.textSpan, scriptInfo_1),
                        hintSpan: toProtocolTextSpan(s.hintSpan, scriptInfo_1),
                        bannerText: s.bannerText,
                        autoCollapse: s.autoCollapse,
                        kind: s.kind
                    }); });
                }
                else {
                    return spans;
                }
            };
            Session.prototype.getTodoComments = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                return project.getLanguageService().getTodoComments(file, args.descriptors);
            };
            Session.prototype.getDocCommentTemplate = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                return languageService.getDocCommentTemplateAtPosition(file, position);
            };
            Session.prototype.getSpanOfEnclosingComment = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var onlyMultiLine = args.onlyMultiLine;
                var position = this.getPositionInFile(args, file);
                return languageService.getSpanOfEnclosingComment(file, position, onlyMultiLine);
            };
            Session.prototype.getIndentation = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                var indentation = languageService.getIndentationAtPosition(file, position, options);
                return { position: position, indentation: indentation };
            };
            Session.prototype.getBreakpointStatement = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                return languageService.getBreakpointStatementAtPosition(file, position);
            };
            Session.prototype.getNameOrDottedNameSpan = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                return languageService.getNameOrDottedNameSpan(file, position, position);
            };
            Session.prototype.isValidBraceCompletion = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var position = this.getPositionInFile(args, file);
                return languageService.isValidBraceCompletionAtPosition(file, position, args.openingBrace.charCodeAt(0));
            };
            Session.prototype.getQuickInfoWorker = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var quickInfo = project.getLanguageService().getQuickInfoAtPosition(file, this.getPosition(args, scriptInfo));
                if (!quickInfo) {
                    return undefined;
                }
                if (simplifiedResult) {
                    var displayString = ts.displayPartsToString(quickInfo.displayParts);
                    var docString = ts.displayPartsToString(quickInfo.documentation);
                    return {
                        kind: quickInfo.kind,
                        kindModifiers: quickInfo.kindModifiers,
                        start: scriptInfo.positionToLineOffset(quickInfo.textSpan.start),
                        end: scriptInfo.positionToLineOffset(ts.textSpanEnd(quickInfo.textSpan)),
                        displayString: displayString,
                        documentation: docString,
                        tags: quickInfo.tags || []
                    };
                }
                else {
                    return quickInfo;
                }
            };
            Session.prototype.getFormattingEditsForRange = function (args) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var startPosition = scriptInfo.lineOffsetToPosition(args.line, args.offset);
                var endPosition = scriptInfo.lineOffsetToPosition(args.endLine, args.endOffset);
                // TODO: avoid duplicate code (with formatonkey)
                var edits = languageService.getFormattingEditsForRange(file, startPosition, endPosition, this.getFormatOptions(file));
                if (!edits) {
                    return undefined;
                }
                return edits.map(function (edit) { return _this.convertTextChangeToCodeEdit(edit, scriptInfo); });
            };
            Session.prototype.getFormattingEditsForRangeFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsForRange(file, args.position, args.endPosition, options); // TODO: GH#18217
            };
            Session.prototype.getFormattingEditsForDocumentFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsForDocument(file, options);
            };
            Session.prototype.getFormattingEditsAfterKeystrokeFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsAfterKeystroke(file, args.position, args.key, options); // TODO: GH#18217
            };
            Session.prototype.getFormattingEditsAfterKeystroke = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = scriptInfo.lineOffsetToPosition(args.line, args.offset);
                var formatOptions = this.getFormatOptions(file);
                var edits = languageService.getFormattingEditsAfterKeystroke(file, position, args.key, formatOptions);
                // Check whether we should auto-indent. This will be when
                // the position is on a line containing only whitespace.
                // This should leave the edits returned from
                // getFormattingEditsAfterKeystroke either empty or pertaining
                // only to the previous line.  If all this is true, then
                // add edits necessary to properly indent the current line.
                if ((args.key === "\n") && ((!edits) || (edits.length === 0) || allEditsBeforePos(edits, position))) {
                    var _b = scriptInfo.getAbsolutePositionAndLineText(args.line), lineText = _b.lineText, absolutePosition = _b.absolutePosition;
                    if (lineText && lineText.search("\\S") < 0) {
                        var preferredIndent = languageService.getIndentationAtPosition(file, position, formatOptions);
                        var hasIndent = 0;
                        var i = void 0, len = void 0;
                        for (i = 0, len = lineText.length; i < len; i++) {
                            if (lineText.charAt(i) === " ") {
                                hasIndent++;
                            }
                            else if (lineText.charAt(i) === "\t") {
                                hasIndent += formatOptions.tabSize; // TODO: GH#18217
                            }
                            else {
                                break;
                            }
                        }
                        // i points to the first non whitespace character
                        if (preferredIndent !== hasIndent) {
                            var firstNoWhiteSpacePosition = absolutePosition + i;
                            edits.push({
                                span: ts.createTextSpanFromBounds(absolutePosition, firstNoWhiteSpacePosition),
                                newText: ts.formatting.getIndentationString(preferredIndent, formatOptions)
                            });
                        }
                    }
                }
                if (!edits) {
                    return undefined;
                }
                return edits.map(function (edit) {
                    return {
                        start: scriptInfo.positionToLineOffset(edit.span.start),
                        end: scriptInfo.positionToLineOffset(ts.textSpanEnd(edit.span)),
                        newText: edit.newText ? edit.newText : ""
                    };
                });
            };
            Session.prototype.getCompletions = function (args, kind) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var completions = project.getLanguageService().getCompletionsAtPosition(file, position, __assign(__assign({}, server.convertUserPreferences(this.getPreferences(file))), { triggerCharacter: args.triggerCharacter, includeExternalModuleExports: args.includeExternalModuleExports, includeInsertTextCompletions: args.includeInsertTextCompletions }));
                if (completions === undefined)
                    return undefined;
                if (kind === "completions-full" /* CompletionsFull */)
                    return completions;
                var prefix = args.prefix || "";
                var entries = ts.mapDefined(completions.entries, function (entry) {
                    if (completions.isMemberCompletion || ts.startsWith(entry.name.toLowerCase(), prefix.toLowerCase())) {
                        var name = entry.name, kind_1 = entry.kind, kindModifiers = entry.kindModifiers, sortText = entry.sortText, insertText = entry.insertText, replacementSpan = entry.replacementSpan, hasAction = entry.hasAction, source = entry.source, isRecommended = entry.isRecommended, isPackageJsonImport = entry.isPackageJsonImport;
                        var convertedSpan = replacementSpan ? toProtocolTextSpan(replacementSpan, scriptInfo) : undefined;
                        // Use `hasAction || undefined` to avoid serializing `false`.
                        return { name: name, kind: kind_1, kindModifiers: kindModifiers, sortText: sortText, insertText: insertText, replacementSpan: convertedSpan, hasAction: hasAction || undefined, source: source, isRecommended: isRecommended, isPackageJsonImport: isPackageJsonImport };
                    }
                }).sort(function (a, b) { return ts.compareStringsCaseSensitiveUI(a.name, b.name); });
                if (kind === "completions" /* Completions */) {
                    if (completions.metadata)
                        entries.metadata = completions.metadata;
                    return entries;
                }
                var res = __assign(__assign({}, completions), { entries: entries });
                return res;
            };
            Session.prototype.getCompletionEntryDetails = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var formattingOptions = project.projectService.getFormatCodeOptions(file);
                var result = ts.mapDefined(args.entryNames, function (entryName) {
                    var _a = typeof entryName === "string" ? { name: entryName, source: undefined } : entryName, name = _a.name, source = _a.source;
                    return project.getLanguageService().getCompletionEntryDetails(file, position, name, formattingOptions, source, _this.getPreferences(file));
                });
                return simplifiedResult
                    ? result.map(function (details) { return (__assign(__assign({}, details), { codeActions: ts.map(details.codeActions, function (action) { return _this.mapCodeAction(action); }) })); })
                    : result;
            };
            Session.prototype.getCompileOnSaveAffectedFileList = function (args) {
                var _this = this;
                var projects = this.getProjects(args, /*getScriptInfoEnsuringProjectsUptoDate*/ true, /*ignoreNoProjectError*/ true);
                var info = this.projectService.getScriptInfo(args.file);
                if (!info) {
                    return server.emptyArray;
                }
                return combineProjectOutput(info, function (path) { return _this.projectService.getScriptInfoForPath(path); }, projects, function (project, info) {
                    if (!project.compileOnSaveEnabled || !project.languageServiceEnabled || project.isOrphan()) {
                        return undefined;
                    }
                    var compilationSettings = project.getCompilationSettings();
                    if (!!compilationSettings.noEmit || ts.fileExtensionIs(info.fileName, ".d.ts" /* Dts */) && !dtsChangeCanAffectEmit(compilationSettings)) {
                        // avoid triggering emit when a change is made in a .d.ts when declaration emit and decorator metadata emit are disabled
                        return undefined;
                    }
                    return {
                        projectFileName: project.getProjectName(),
                        fileNames: project.getCompileOnSaveAffectedFileList(info),
                        projectUsesOutFile: !!ts.outFile(compilationSettings)
                    };
                });
            };
            Session.prototype.emitFile = function (args) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                if (!project) {
                    server.Errors.ThrowNoProject();
                }
                if (!project.languageServiceEnabled) {
                    return args.richResponse ? { emitSkipped: true, diagnostics: [] } : false;
                }
                var scriptInfo = project.getScriptInfo(file);
                var _b = project.emitFile(scriptInfo, function (path, data, writeByteOrderMark) { return _this.host.writeFile(path, data, writeByteOrderMark); }), emitSkipped = _b.emitSkipped, diagnostics = _b.diagnostics;
                return args.richResponse ?
                    {
                        emitSkipped: emitSkipped,
                        diagnostics: args.includeLinePosition ?
                            this.convertToDiagnosticsWithLinePositionFromDiagnosticFile(diagnostics) :
                            diagnostics.map(function (d) { return formatDiagnosticToProtocol(d, /*includeFileName*/ true); })
                    } :
                    !emitSkipped;
            };
            Session.prototype.getSignatureHelpItems = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var helpItems = project.getLanguageService().getSignatureHelpItems(file, position, args);
                if (!helpItems) {
                    return undefined;
                }
                if (simplifiedResult) {
                    var span = helpItems.applicableSpan;
                    return {
                        items: helpItems.items,
                        applicableSpan: {
                            start: scriptInfo.positionToLineOffset(span.start),
                            end: scriptInfo.positionToLineOffset(span.start + span.length)
                        },
                        selectedItemIndex: helpItems.selectedItemIndex,
                        argumentIndex: helpItems.argumentIndex,
                        argumentCount: helpItems.argumentCount,
                    };
                }
                else {
                    return helpItems;
                }
            };
            Session.prototype.toPendingErrorCheck = function (uncheckedFileName) {
                var fileName = server.toNormalizedPath(uncheckedFileName);
                var project = this.projectService.tryGetDefaultProjectForFile(fileName);
                return project && { fileName: fileName, project: project };
            };
            Session.prototype.getDiagnostics = function (next, delay, fileNames) {
                if (this.suppressDiagnosticEvents) {
                    return;
                }
                if (fileNames.length > 0) {
                    this.updateErrorCheck(next, fileNames, delay);
                }
            };
            Session.prototype.change = function (args) {
                var scriptInfo = this.projectService.getScriptInfo(args.file);
                ts.Debug.assert(!!scriptInfo);
                var start = scriptInfo.lineOffsetToPosition(args.line, args.offset);
                var end = scriptInfo.lineOffsetToPosition(args.endLine, args.endOffset);
                if (start >= 0) {
                    this.changeSeq++;
                    this.projectService.applyChangesToFile(scriptInfo, ts.singleIterator({
                        span: { start: start, length: end - start },
                        newText: args.insertString // TODO: GH#18217
                    }));
                }
            };
            Session.prototype.reload = function (args, reqSeq) {
                var file = server.toNormalizedPath(args.file);
                var tempFileName = args.tmpfile === undefined ? undefined : server.toNormalizedPath(args.tmpfile);
                var info = this.projectService.getScriptInfoForNormalizedPath(file);
                if (info) {
                    this.changeSeq++;
                    // make sure no changes happen before this one is finished
                    if (info.reloadFromFile(tempFileName)) {
                        this.doOutput(/*info*/ undefined, server.CommandNames.Reload, reqSeq, /*success*/ true);
                    }
                }
            };
            Session.prototype.saveToTmp = function (fileName, tempFileName) {
                var scriptInfo = this.projectService.getScriptInfo(fileName);
                if (scriptInfo) {
                    scriptInfo.saveTo(tempFileName);
                }
            };
            Session.prototype.closeClientFile = function (fileName) {
                if (!fileName) {
                    return;
                }
                var file = ts.normalizePath(fileName);
                this.projectService.closeClientFile(file);
            };
            Session.prototype.mapLocationNavigationBarItems = function (items, scriptInfo) {
                var _this = this;
                return ts.map(items, function (item) { return ({
                    text: item.text,
                    kind: item.kind,
                    kindModifiers: item.kindModifiers,
                    spans: item.spans.map(function (span) { return toProtocolTextSpan(span, scriptInfo); }),
                    childItems: _this.mapLocationNavigationBarItems(item.childItems, scriptInfo),
                    indent: item.indent
                }); });
            };
            Session.prototype.getNavigationBarItems = function (args, simplifiedResult) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var items = languageService.getNavigationBarItems(file);
                return !items
                    ? undefined
                    : simplifiedResult
                        ? this.mapLocationNavigationBarItems(items, this.projectService.getScriptInfoForNormalizedPath(file))
                        : items;
            };
            Session.prototype.toLocationNavigationTree = function (tree, scriptInfo) {
                var _this = this;
                return {
                    text: tree.text,
                    kind: tree.kind,
                    kindModifiers: tree.kindModifiers,
                    spans: tree.spans.map(function (span) { return toProtocolTextSpan(span, scriptInfo); }),
                    nameSpan: tree.nameSpan && toProtocolTextSpan(tree.nameSpan, scriptInfo),
                    childItems: ts.map(tree.childItems, function (item) { return _this.toLocationNavigationTree(item, scriptInfo); })
                };
            };
            Session.prototype.getNavigationTree = function (args, simplifiedResult) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var tree = languageService.getNavigationTree(file);
                return !tree
                    ? undefined
                    : simplifiedResult
                        ? this.toLocationNavigationTree(tree, this.projectService.getScriptInfoForNormalizedPath(file))
                        : tree;
            };
            Session.prototype.getNavigateToItems = function (args, simplifiedResult) {
                var full = this.getFullNavigateToItems(args);
                return !simplifiedResult ?
                    flattenCombineOutputResult(full) :
                    ts.flatMap(full, function (_a) {
                        var project = _a.project, result = _a.result;
                        return result.map(function (navItem) {
                            var scriptInfo = project.getScriptInfo(navItem.fileName);
                            var bakedItem = {
                                name: navItem.name,
                                kind: navItem.kind,
                                kindModifiers: navItem.kindModifiers,
                                isCaseSensitive: navItem.isCaseSensitive,
                                matchKind: navItem.matchKind,
                                file: navItem.fileName,
                                start: scriptInfo.positionToLineOffset(navItem.textSpan.start),
                                end: scriptInfo.positionToLineOffset(ts.textSpanEnd(navItem.textSpan))
                            };
                            if (navItem.kindModifiers && (navItem.kindModifiers !== "")) {
                                bakedItem.kindModifiers = navItem.kindModifiers;
                            }
                            if (navItem.containerName && (navItem.containerName.length > 0)) {
                                bakedItem.containerName = navItem.containerName;
                            }
                            if (navItem.containerKind && (navItem.containerKind.length > 0)) {
                                bakedItem.containerKind = navItem.containerKind;
                            }
                            return bakedItem;
                        });
                    });
            };
            Session.prototype.getFullNavigateToItems = function (args) {
                var currentFileOnly = args.currentFileOnly, searchValue = args.searchValue, maxResultCount = args.maxResultCount, projectFileName = args.projectFileName;
                if (currentFileOnly) {
                    ts.Debug.assertDefined(args.file);
                    var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                    return [{ project: project, result: project.getLanguageService().getNavigateToItems(searchValue, maxResultCount, file) }];
                }
                else if (!args.file && !projectFileName) {
                    return combineProjectOutputFromEveryProject(this.projectService, function (project) { return project.getLanguageService().getNavigateToItems(searchValue, maxResultCount, /*filename*/ undefined, /*excludeDts*/ project.isNonTsProject()); }, navigateToItemIsEqualTo);
                }
                var fileArgs = args;
                return combineProjectOutputWhileOpeningReferencedProjects(this.getProjects(fileArgs), this.getDefaultProject(fileArgs), function (project) { return project.getLanguageService().getNavigateToItems(searchValue, maxResultCount, /*fileName*/ undefined, /*excludeDts*/ project.isNonTsProject()); }, documentSpanLocation, navigateToItemIsEqualTo);
                function navigateToItemIsEqualTo(a, b) {
                    if (a === b) {
                        return true;
                    }
                    if (!a || !b) {
                        return false;
                    }
                    return a.containerKind === b.containerKind &&
                        a.containerName === b.containerName &&
                        a.fileName === b.fileName &&
                        a.isCaseSensitive === b.isCaseSensitive &&
                        a.kind === b.kind &&
                        a.kindModifiers === b.kindModifiers &&
                        a.matchKind === b.matchKind &&
                        a.name === b.name &&
                        a.textSpan.start === b.textSpan.start &&
                        a.textSpan.length === b.textSpan.length;
                }
            };
            Session.prototype.getSupportedCodeFixes = function () {
                return ts.getSupportedCodeFixes();
            };
            Session.prototype.isLocation = function (locationOrSpan) {
                return locationOrSpan.line !== undefined;
            };
            Session.prototype.extractPositionOrRange = function (args, scriptInfo) {
                var position;
                var textRange;
                if (this.isLocation(args)) {
                    position = getPosition(args);
                }
                else {
                    textRange = this.getRange(args, scriptInfo);
                }
                return ts.Debug.checkDefined(position === undefined ? textRange : position);
                function getPosition(loc) {
                    return loc.position !== undefined ? loc.position : scriptInfo.lineOffsetToPosition(loc.line, loc.offset);
                }
            };
            Session.prototype.getRange = function (args, scriptInfo) {
                var _a = this.getStartAndEndPosition(args, scriptInfo), startPosition = _a.startPosition, endPosition = _a.endPosition;
                return { pos: startPosition, end: endPosition };
            };
            Session.prototype.getApplicableRefactors = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                return project.getLanguageService().getApplicableRefactors(file, this.extractPositionOrRange(args, scriptInfo), this.getPreferences(file), args.triggerReason);
            };
            Session.prototype.getEditsForRefactor = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                var result = project.getLanguageService().getEditsForRefactor(file, this.getFormatOptions(file), this.extractPositionOrRange(args, scriptInfo), args.refactor, args.action, this.getPreferences(file));
                if (result === undefined) {
                    return {
                        edits: []
                    };
                }
                if (simplifiedResult) {
                    var renameFilename = result.renameFilename, renameLocation = result.renameLocation, edits = result.edits;
                    var mappedRenameLocation = void 0;
                    if (renameFilename !== undefined && renameLocation !== undefined) {
                        var renameScriptInfo = project.getScriptInfoForNormalizedPath(server.toNormalizedPath(renameFilename));
                        mappedRenameLocation = getLocationInNewDocument(ts.getSnapshotText(renameScriptInfo.getSnapshot()), renameFilename, renameLocation, edits);
                    }
                    return { renameLocation: mappedRenameLocation, renameFilename: renameFilename, edits: this.mapTextChangesToCodeEdits(edits) };
                }
                else {
                    return result;
                }
            };
            Session.prototype.organizeImports = function (_a, simplifiedResult) {
                var scope = _a.scope;
                ts.Debug.assert(scope.type === "file");
                var _b = this.getFileAndProject(scope.args), file = _b.file, project = _b.project;
                var changes = project.getLanguageService().organizeImports({ type: "file", fileName: file }, this.getFormatOptions(file), this.getPreferences(file));
                if (simplifiedResult) {
                    return this.mapTextChangesToCodeEdits(changes);
                }
                else {
                    return changes;
                }
            };
            Session.prototype.getEditsForFileRename = function (args, simplifiedResult) {
                var _this = this;
                var oldPath = server.toNormalizedPath(args.oldFilePath);
                var newPath = server.toNormalizedPath(args.newFilePath);
                var formatOptions = this.getHostFormatOptions();
                var preferences = this.getHostPreferences();
                var changes = flattenCombineOutputResult(combineProjectOutputFromEveryProject(this.projectService, function (project) { return project.getLanguageService().getEditsForFileRename(oldPath, newPath, formatOptions, preferences); }, function (a, b) { return a.fileName === b.fileName; }));
                return simplifiedResult ? changes.map(function (c) { return _this.mapTextChangeToCodeEdit(c); }) : changes;
            };
            Session.prototype.getCodeFixes = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                var _b = this.getStartAndEndPosition(args, scriptInfo), startPosition = _b.startPosition, endPosition = _b.endPosition;
                var codeActions = project.getLanguageService().getCodeFixesAtPosition(file, startPosition, endPosition, args.errorCodes, this.getFormatOptions(file), this.getPreferences(file));
                return simplifiedResult ? codeActions.map(function (codeAction) { return _this.mapCodeFixAction(codeAction); }) : codeActions;
            };
            Session.prototype.getCombinedCodeFix = function (_a, simplifiedResult) {
                var scope = _a.scope, fixId = _a.fixId;
                ts.Debug.assert(scope.type === "file");
                var _b = this.getFileAndProject(scope.args), file = _b.file, project = _b.project;
                var res = project.getLanguageService().getCombinedCodeFix({ type: "file", fileName: file }, fixId, this.getFormatOptions(file), this.getPreferences(file));
                if (simplifiedResult) {
                    return { changes: this.mapTextChangesToCodeEdits(res.changes), commands: res.commands };
                }
                else {
                    return res;
                }
            };
            Session.prototype.applyCodeActionCommand = function (args) {
                var commands = args.command; // They should be sending back the command we sent them.
                for (var _i = 0, _a = ts.toArray(commands); _i < _a.length; _i++) {
                    var command = _a[_i];
                    var _b = this.getFileAndProject(command), file = _b.file, project = _b.project;
                    project.getLanguageService().applyCodeActionCommand(command, this.getFormatOptions(file)).then(function (_result) { }, function (_error) { });
                }
                return {};
            };
            Session.prototype.getStartAndEndPosition = function (args, scriptInfo) {
                var startPosition, endPosition;
                if (args.startPosition !== undefined) {
                    startPosition = args.startPosition;
                }
                else {
                    startPosition = scriptInfo.lineOffsetToPosition(args.startLine, args.startOffset);
                    // save the result so we don't always recompute
                    args.startPosition = startPosition;
                }
                if (args.endPosition !== undefined) {
                    endPosition = args.endPosition;
                }
                else {
                    endPosition = scriptInfo.lineOffsetToPosition(args.endLine, args.endOffset);
                    args.endPosition = endPosition;
                }
                return { startPosition: startPosition, endPosition: endPosition };
            };
            Session.prototype.mapCodeAction = function (_a) {
                var description = _a.description, changes = _a.changes, commands = _a.commands;
                return { description: description, changes: this.mapTextChangesToCodeEdits(changes), commands: commands };
            };
            Session.prototype.mapCodeFixAction = function (_a) {
                var fixName = _a.fixName, description = _a.description, changes = _a.changes, commands = _a.commands, fixId = _a.fixId, fixAllDescription = _a.fixAllDescription;
                return { fixName: fixName, description: description, changes: this.mapTextChangesToCodeEdits(changes), commands: commands, fixId: fixId, fixAllDescription: fixAllDescription };
            };
            Session.prototype.mapTextChangesToCodeEdits = function (textChanges) {
                var _this = this;
                return textChanges.map(function (change) { return _this.mapTextChangeToCodeEdit(change); });
            };
            Session.prototype.mapTextChangeToCodeEdit = function (textChanges) {
                var scriptInfo = this.projectService.getScriptInfoOrConfig(textChanges.fileName);
                if (!!textChanges.isNewFile === !!scriptInfo) {
                    if (!scriptInfo) { // and !isNewFile
                        this.projectService.logErrorForScriptInfoNotFound(textChanges.fileName);
                    }
                    ts.Debug.fail("Expected isNewFile for (only) new files. " + JSON.stringify({ isNewFile: !!textChanges.isNewFile, hasScriptInfo: !!scriptInfo }));
                }
                return scriptInfo
                    ? { fileName: textChanges.fileName, textChanges: textChanges.textChanges.map(function (textChange) { return convertTextChangeToCodeEdit(textChange, scriptInfo); }) }
                    : convertNewFileTextChangeToCodeEdit(textChanges);
            };
            Session.prototype.convertTextChangeToCodeEdit = function (change, scriptInfo) {
                return {
                    start: scriptInfo.positionToLineOffset(change.span.start),
                    end: scriptInfo.positionToLineOffset(change.span.start + change.span.length),
                    newText: change.newText ? change.newText : ""
                };
            };
            Session.prototype.getBraceMatching = function (args, simplifiedResult) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var spans = languageService.getBraceMatchingAtPosition(file, position);
                return !spans
                    ? undefined
                    : simplifiedResult
                        ? spans.map(function (span) { return toProtocolTextSpan(span, scriptInfo); })
                        : spans;
            };
            Session.prototype.getDiagnosticsForProject = function (next, delay, fileName) {
                if (this.suppressDiagnosticEvents) {
                    return;
                }
                var _a = this.getProjectInfoWorker(fileName, /*projectFileName*/ undefined, /*needFileNameList*/ true, /*excludeConfigFiles*/ true), fileNames = _a.fileNames, languageServiceDisabled = _a.languageServiceDisabled;
                if (languageServiceDisabled) {
                    return;
                }
                // No need to analyze lib.d.ts
                var fileNamesInProject = fileNames.filter(function (value) { return !ts.stringContains(value, "lib.d.ts"); }); // TODO: GH#18217
                if (fileNamesInProject.length === 0) {
                    return;
                }
                // Sort the file name list to make the recently touched files come first
                var highPriorityFiles = [];
                var mediumPriorityFiles = [];
                var lowPriorityFiles = [];
                var veryLowPriorityFiles = [];
                var normalizedFileName = server.toNormalizedPath(fileName);
                var project = this.projectService.ensureDefaultProjectForFile(normalizedFileName);
                for (var _i = 0, fileNamesInProject_1 = fileNamesInProject; _i < fileNamesInProject_1.length; _i++) {
                    var fileNameInProject = fileNamesInProject_1[_i];
                    if (this.getCanonicalFileName(fileNameInProject) === this.getCanonicalFileName(fileName)) {
                        highPriorityFiles.push(fileNameInProject);
                    }
                    else {
                        var info = this.projectService.getScriptInfo(fileNameInProject); // TODO: GH#18217
                        if (!info.isScriptOpen()) {
                            if (ts.fileExtensionIs(fileNameInProject, ".d.ts" /* Dts */)) {
                                veryLowPriorityFiles.push(fileNameInProject);
                            }
                            else {
                                lowPriorityFiles.push(fileNameInProject);
                            }
                        }
                        else {
                            mediumPriorityFiles.push(fileNameInProject);
                        }
                    }
                }
                var sortedFiles = __spreadArrays(highPriorityFiles, mediumPriorityFiles, lowPriorityFiles, veryLowPriorityFiles);
                var checkList = sortedFiles.map(function (fileName) { return ({ fileName: fileName, project: project }); });
                // Project level error analysis runs on background files too, therefore
                // doesn't require the file to be opened
                this.updateErrorCheck(next, checkList, delay, /*requireOpen*/ false);
            };
            Session.prototype.configurePlugin = function (args) {
                this.projectService.configurePlugin(args);
            };
            Session.prototype.getSmartSelectionRange = function (args, simplifiedResult) {
                var _this = this;
                var locations = args.locations;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = ts.Debug.checkDefined(this.projectService.getScriptInfo(file));
                return ts.map(locations, function (location) {
                    var pos = _this.getPosition(location, scriptInfo);
                    var selectionRange = languageService.getSmartSelectionRange(file, pos);
                    return simplifiedResult ? _this.mapSelectionRange(selectionRange, scriptInfo) : selectionRange;
                });
            };
            Session.prototype.toggleLineComment = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfo(file);
                var textRange = this.getRange(args, scriptInfo);
                var textChanges = languageService.toggleLineComment(file, textRange);
                if (simplifiedResult) {
                    var scriptInfo_2 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return textChanges.map(function (textChange) { return _this.convertTextChangeToCodeEdit(textChange, scriptInfo_2); });
                }
                return textChanges;
            };
            Session.prototype.toggleMultilineComment = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var textRange = this.getRange(args, scriptInfo);
                var textChanges = languageService.toggleMultilineComment(file, textRange);
                if (simplifiedResult) {
                    var scriptInfo_3 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return textChanges.map(function (textChange) { return _this.convertTextChangeToCodeEdit(textChange, scriptInfo_3); });
                }
                return textChanges;
            };
            Session.prototype.commentSelection = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var textRange = this.getRange(args, scriptInfo);
                var textChanges = languageService.commentSelection(file, textRange);
                if (simplifiedResult) {
                    var scriptInfo_4 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return textChanges.map(function (textChange) { return _this.convertTextChangeToCodeEdit(textChange, scriptInfo_4); });
                }
                return textChanges;
            };
            Session.prototype.uncommentSelection = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var textRange = this.getRange(args, scriptInfo);
                var textChanges = languageService.uncommentSelection(file, textRange);
                if (simplifiedResult) {
                    var scriptInfo_5 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return textChanges.map(function (textChange) { return _this.convertTextChangeToCodeEdit(textChange, scriptInfo_5); });
                }
                return textChanges;
            };
            Session.prototype.mapSelectionRange = function (selectionRange, scriptInfo) {
                var result = {
                    textSpan: toProtocolTextSpan(selectionRange.textSpan, scriptInfo),
                };
                if (selectionRange.parent) {
                    result.parent = this.mapSelectionRange(selectionRange.parent, scriptInfo);
                }
                return result;
            };
            Session.prototype.getScriptInfoFromProjectService = function (file) {
                var normalizedFile = server.toNormalizedPath(file);
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(normalizedFile);
                if (!scriptInfo) {
                    this.projectService.logErrorForScriptInfoNotFound(normalizedFile);
                    return server.Errors.ThrowNoProject();
                }
                return scriptInfo;
            };
            Session.prototype.toProtocolCallHierarchyItem = function (item) {
                var scriptInfo = this.getScriptInfoFromProjectService(item.file);
                return {
                    name: item.name,
                    kind: item.kind,
                    kindModifiers: item.kindModifiers,
                    file: item.file,
                    containerName: item.containerName,
                    span: toProtocolTextSpan(item.span, scriptInfo),
                    selectionSpan: toProtocolTextSpan(item.selectionSpan, scriptInfo)
                };
            };
            Session.prototype.toProtocolCallHierarchyIncomingCall = function (incomingCall) {
                var scriptInfo = this.getScriptInfoFromProjectService(incomingCall.from.file);
                return {
                    from: this.toProtocolCallHierarchyItem(incomingCall.from),
                    fromSpans: incomingCall.fromSpans.map(function (fromSpan) { return toProtocolTextSpan(fromSpan, scriptInfo); })
                };
            };
            Session.prototype.toProtocolCallHierarchyOutgoingCall = function (outgoingCall, scriptInfo) {
                return {
                    to: this.toProtocolCallHierarchyItem(outgoingCall.to),
                    fromSpans: outgoingCall.fromSpans.map(function (fromSpan) { return toProtocolTextSpan(fromSpan, scriptInfo); })
                };
            };
            Session.prototype.prepareCallHierarchy = function (args) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                if (scriptInfo) {
                    var position = this.getPosition(args, scriptInfo);
                    var result = project.getLanguageService().prepareCallHierarchy(file, position);
                    return result && ts.mapOneOrMany(result, function (item) { return _this.toProtocolCallHierarchyItem(item); });
                }
                return undefined;
            };
            Session.prototype.provideCallHierarchyIncomingCalls = function (args) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.getScriptInfoFromProjectService(file);
                var incomingCalls = project.getLanguageService().provideCallHierarchyIncomingCalls(file, this.getPosition(args, scriptInfo));
                return incomingCalls.map(function (call) { return _this.toProtocolCallHierarchyIncomingCall(call); });
            };
            Session.prototype.provideCallHierarchyOutgoingCalls = function (args) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.getScriptInfoFromProjectService(file);
                var outgoingCalls = project.getLanguageService().provideCallHierarchyOutgoingCalls(file, this.getPosition(args, scriptInfo));
                return outgoingCalls.map(function (call) { return _this.toProtocolCallHierarchyOutgoingCall(call, scriptInfo); });
            };
            Session.prototype.getCanonicalFileName = function (fileName) {
                var name = this.host.useCaseSensitiveFileNames ? fileName : ts.toFileNameLowerCase(fileName);
                return ts.normalizePath(name);
            };
            Session.prototype.exit = function () { };
            Session.prototype.notRequired = function () {
                return { responseRequired: false };
            };
            Session.prototype.requiredResponse = function (response) {
                return { response: response, responseRequired: true };
            };
            Session.prototype.addProtocolHandler = function (command, handler) {
                if (this.handlers.has(command)) {
                    throw new Error("Protocol handler already exists for command \"" + command + "\"");
                }
                this.handlers.set(command, handler);
            };
            Session.prototype.setCurrentRequest = function (requestId) {
                ts.Debug.assert(this.currentRequestId === undefined);
                this.currentRequestId = requestId;
                this.cancellationToken.setRequest(requestId);
            };
            Session.prototype.resetCurrentRequest = function (requestId) {
                ts.Debug.assert(this.currentRequestId === requestId);
                this.currentRequestId = undefined; // TODO: GH#18217
                this.cancellationToken.resetRequest(requestId);
            };
            Session.prototype.executeWithRequestId = function (requestId, f) {
                try {
                    this.setCurrentRequest(requestId);
                    return f();
                }
                finally {
                    this.resetCurrentRequest(requestId);
                }
            };
            Session.prototype.executeCommand = function (request) {
                var handler = this.handlers.get(request.command);
                if (handler) {
                    return this.executeWithRequestId(request.seq, function () { return handler(request); });
                }
                else {
                    this.logger.msg("Unrecognized JSON command:" + server.stringifyIndented(request), server.Msg.Err);
                    this.doOutput(/*info*/ undefined, server.CommandNames.Unknown, request.seq, /*success*/ false, "Unrecognized JSON command: " + request.command);
                    return { responseRequired: false };
                }
            };
            Session.prototype.onMessage = function (message) {
                this.gcTimer.scheduleCollect();
                this.performanceData = undefined;
                var start;
                if (this.logger.hasLevel(server.LogLevel.requestTime)) {
                    start = this.hrtime();
                    if (this.logger.hasLevel(server.LogLevel.verbose)) {
                        this.logger.info("request:" + server.indent(message));
                    }
                }
                var request;
                var relevantFile;
                try {
                    request = JSON.parse(message);
                    relevantFile = request.arguments && request.arguments.file ? request.arguments : undefined;
                    ts.perfLogger.logStartCommand("" + request.command, message.substring(0, 100));
                    var _a = this.executeCommand(request), response = _a.response, responseRequired = _a.responseRequired;
                    if (this.logger.hasLevel(server.LogLevel.requestTime)) {
                        var elapsedTime = hrTimeToMilliseconds(this.hrtime(start)).toFixed(4);
                        if (responseRequired) {
                            this.logger.perftrc(request.seq + "::" + request.command + ": elapsed time (in milliseconds) " + elapsedTime);
                        }
                        else {
                            this.logger.perftrc(request.seq + "::" + request.command + ": async elapsed time (in milliseconds) " + elapsedTime);
                        }
                    }
                    // Note: Log before writing the response, else the editor can complete its activity before the server does
                    ts.perfLogger.logStopCommand("" + request.command, "Success");
                    if (response) {
                        this.doOutput(response, request.command, request.seq, /*success*/ true);
                    }
                    else if (responseRequired) {
                        this.doOutput(/*info*/ undefined, request.command, request.seq, /*success*/ false, "No content available.");
                    }
                }
                catch (err) {
                    if (err instanceof ts.OperationCanceledException) {
                        // Handle cancellation exceptions
                        ts.perfLogger.logStopCommand("" + (request && request.command), "Canceled: " + err);
                        this.doOutput({ canceled: true }, request.command, request.seq, /*success*/ true);
                        return;
                    }
                    this.logErrorWorker(err, message, relevantFile);
                    ts.perfLogger.logStopCommand("" + (request && request.command), "Error: " + err);
                    this.doOutput(
                    /*info*/ undefined, request ? request.command : server.CommandNames.Unknown, request ? request.seq : 0, 
                    /*success*/ false, "Error processing request. " + err.message + "\n" + err.stack);
                }
            };
            Session.prototype.getFormatOptions = function (file) {
                return this.projectService.getFormatCodeOptions(file);
            };
            Session.prototype.getPreferences = function (file) {
                return this.projectService.getPreferences(file);
            };
            Session.prototype.getHostFormatOptions = function () {
                return this.projectService.getHostFormatCodeOptions();
            };
            Session.prototype.getHostPreferences = function () {
                return this.projectService.getHostPreferences();
            };
            return Session;
        }());
        server.Session = Session;
        function toProtocolTextSpan(textSpan, scriptInfo) {
            return {
                start: scriptInfo.positionToLineOffset(textSpan.start),
                end: scriptInfo.positionToLineOffset(ts.textSpanEnd(textSpan))
            };
        }
        function toProtocolTextSpanWithContext(span, contextSpan, scriptInfo) {
            var textSpan = toProtocolTextSpan(span, scriptInfo);
            var contextTextSpan = contextSpan && toProtocolTextSpan(contextSpan, scriptInfo);
            return contextTextSpan ? __assign(__assign({}, textSpan), { contextStart: contextTextSpan.start, contextEnd: contextTextSpan.end }) :
                textSpan;
        }
        function convertTextChangeToCodeEdit(change, scriptInfo) {
            return { start: positionToLineOffset(scriptInfo, change.span.start), end: positionToLineOffset(scriptInfo, ts.textSpanEnd(change.span)), newText: change.newText };
        }
        function positionToLineOffset(info, position) {
            return server.isConfigFile(info) ? locationFromLineAndCharacter(info.getLineAndCharacterOfPosition(position)) : info.positionToLineOffset(position);
        }
        function locationFromLineAndCharacter(lc) {
            return { line: lc.line + 1, offset: lc.character + 1 };
        }
        function convertNewFileTextChangeToCodeEdit(textChanges) {
            ts.Debug.assert(textChanges.textChanges.length === 1);
            var change = ts.first(textChanges.textChanges);
            ts.Debug.assert(change.span.start === 0 && change.span.length === 0);
            return { fileName: textChanges.fileName, textChanges: [{ start: { line: 0, offset: 0 }, end: { line: 0, offset: 0 }, newText: change.newText }] };
        }
        /* @internal */ // Exported only for tests
        function getLocationInNewDocument(oldText, renameFilename, renameLocation, edits) {
            var newText = applyEdits(oldText, renameFilename, edits);
            var _a = ts.computeLineAndCharacterOfPosition(ts.computeLineStarts(newText), renameLocation), line = _a.line, character = _a.character;
            return { line: line + 1, offset: character + 1 };
        }
        server.getLocationInNewDocument = getLocationInNewDocument;
        function applyEdits(text, textFilename, edits) {
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var _a = edits_1[_i], fileName = _a.fileName, textChanges_1 = _a.textChanges;
                if (fileName !== textFilename) {
                    continue;
                }
                for (var i = textChanges_1.length - 1; i >= 0; i--) {
                    var _b = textChanges_1[i], newText = _b.newText, _c = _b.span, start = _c.start, length_1 = _c.length;
                    text = text.slice(0, start) + newText + text.slice(start + length_1);
                }
            }
            return text;
        }
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
/*@internal*/
var ts;
(function (ts) {
    var server;
    (function (server) {
        var lineCollectionCapacity = 4;
        var CharRangeSection;
        (function (CharRangeSection) {
            CharRangeSection[CharRangeSection["PreStart"] = 0] = "PreStart";
            CharRangeSection[CharRangeSection["Start"] = 1] = "Start";
            CharRangeSection[CharRangeSection["Entire"] = 2] = "Entire";
            CharRangeSection[CharRangeSection["Mid"] = 3] = "Mid";
            CharRangeSection[CharRangeSection["End"] = 4] = "End";
            CharRangeSection[CharRangeSection["PostEnd"] = 5] = "PostEnd";
        })(CharRangeSection || (CharRangeSection = {}));
        var EditWalker = /** @class */ (function () {
            function EditWalker() {
                this.goSubtree = true;
                this.lineIndex = new LineIndex();
                this.endBranch = [];
                this.state = 2 /* Entire */;
                this.initialText = "";
                this.trailingText = "";
                this.lineIndex.root = new LineNode();
                this.startPath = [this.lineIndex.root];
                this.stack = [this.lineIndex.root];
            }
            Object.defineProperty(EditWalker.prototype, "done", {
                get: function () { return false; },
                enumerable: false,
                configurable: true
            });
            EditWalker.prototype.insertLines = function (insertedText, suppressTrailingText) {
                if (suppressTrailingText) {
                    this.trailingText = "";
                }
                if (insertedText) {
                    insertedText = this.initialText + insertedText + this.trailingText;
                }
                else {
                    insertedText = this.initialText + this.trailingText;
                }
                var lm = LineIndex.linesFromText(insertedText);
                var lines = lm.lines;
                if (lines.length > 1) {
                    if (lines[lines.length - 1] === "") {
                        lines.pop();
                    }
                }
                var branchParent;
                var lastZeroCount;
                for (var k = this.endBranch.length - 1; k >= 0; k--) {
                    this.endBranch[k].updateCounts();
                    if (this.endBranch[k].charCount() === 0) {
                        lastZeroCount = this.endBranch[k];
                        if (k > 0) {
                            branchParent = this.endBranch[k - 1];
                        }
                        else {
                            branchParent = this.branchNode;
                        }
                    }
                }
                if (lastZeroCount) {
                    branchParent.remove(lastZeroCount);
                }
                // path at least length two (root and leaf)
                var leafNode = this.startPath[this.startPath.length - 1];
                if (lines.length > 0) {
                    leafNode.text = lines[0];
                    if (lines.length > 1) {
                        var insertedNodes = new Array(lines.length - 1);
                        var startNode = leafNode;
                        for (var i = 1; i < lines.length; i++) {
                            insertedNodes[i - 1] = new LineLeaf(lines[i]);
                        }
                        var pathIndex = this.startPath.length - 2;
                        while (pathIndex >= 0) {
                            var insertionNode = this.startPath[pathIndex];
                            insertedNodes = insertionNode.insertAt(startNode, insertedNodes);
                            pathIndex--;
                            startNode = insertionNode;
                        }
                        var insertedNodesLen = insertedNodes.length;
                        while (insertedNodesLen > 0) {
                            var newRoot = new LineNode();
                            newRoot.add(this.lineIndex.root);
                            insertedNodes = newRoot.insertAt(this.lineIndex.root, insertedNodes);
                            insertedNodesLen = insertedNodes.length;
                            this.lineIndex.root = newRoot;
                        }
                        this.lineIndex.root.updateCounts();
                    }
                    else {
                        for (var j = this.startPath.length - 2; j >= 0; j--) {
                            this.startPath[j].updateCounts();
                        }
                    }
                }
                else {
                    var insertionNode = this.startPath[this.startPath.length - 2];
                    // no content for leaf node, so delete it
                    insertionNode.remove(leafNode);
                    for (var j = this.startPath.length - 2; j >= 0; j--) {
                        this.startPath[j].updateCounts();
                    }
                }
                return this.lineIndex;
            };
            EditWalker.prototype.post = function (_relativeStart, _relativeLength, lineCollection) {
                // have visited the path for start of range, now looking for end
                // if range is on single line, we will never make this state transition
                if (lineCollection === this.lineCollectionAtBranch) {
                    this.state = 4 /* End */;
                }
                // always pop stack because post only called when child has been visited
                this.stack.pop();
            };
            EditWalker.prototype.pre = function (_relativeStart, _relativeLength, lineCollection, _parent, nodeType) {
                // currentNode corresponds to parent, but in the new tree
                var currentNode = this.stack[this.stack.length - 1];
                if ((this.state === 2 /* Entire */) && (nodeType === 1 /* Start */)) {
                    // if range is on single line, we will never make this state transition
                    this.state = 1 /* Start */;
                    this.branchNode = currentNode;
                    this.lineCollectionAtBranch = lineCollection;
                }
                var child;
                function fresh(node) {
                    if (node.isLeaf()) {
                        return new LineLeaf("");
                    }
                    else
                        return new LineNode();
                }
                switch (nodeType) {
                    case 0 /* PreStart */:
                        this.goSubtree = false;
                        if (this.state !== 4 /* End */) {
                            currentNode.add(lineCollection);
                        }
                        break;
                    case 1 /* Start */:
                        if (this.state === 4 /* End */) {
                            this.goSubtree = false;
                        }
                        else {
                            child = fresh(lineCollection);
                            currentNode.add(child);
                            this.startPath.push(child);
                        }
                        break;
                    case 2 /* Entire */:
                        if (this.state !== 4 /* End */) {
                            child = fresh(lineCollection);
                            currentNode.add(child);
                            this.startPath.push(child);
                        }
                        else {
                            if (!lineCollection.isLeaf()) {
                                child = fresh(lineCollection);
                                currentNode.add(child);
                                this.endBranch.push(child);
                            }
                        }
                        break;
                    case 3 /* Mid */:
                        this.goSubtree = false;
                        break;
                    case 4 /* End */:
                        if (this.state !== 4 /* End */) {
                            this.goSubtree = false;
                        }
                        else {
                            if (!lineCollection.isLeaf()) {
                                child = fresh(lineCollection);
                                currentNode.add(child);
                                this.endBranch.push(child);
                            }
                        }
                        break;
                    case 5 /* PostEnd */:
                        this.goSubtree = false;
                        if (this.state !== 1 /* Start */) {
                            currentNode.add(lineCollection);
                        }
                        break;
                }
                if (this.goSubtree) {
                    this.stack.push(child);
                }
            };
            // just gather text from the leaves
            EditWalker.prototype.leaf = function (relativeStart, relativeLength, ll) {
                if (this.state === 1 /* Start */) {
                    this.initialText = ll.text.substring(0, relativeStart);
                }
                else if (this.state === 2 /* Entire */) {
                    this.initialText = ll.text.substring(0, relativeStart);
                    this.trailingText = ll.text.substring(relativeStart + relativeLength);
                }
                else {
                    // state is CharRangeSection.End
                    this.trailingText = ll.text.substring(relativeStart + relativeLength);
                }
            };
            return EditWalker;
        }());
        // text change information
        var TextChange = /** @class */ (function () {
            function TextChange(pos, deleteLen, insertedText) {
                this.pos = pos;
                this.deleteLen = deleteLen;
                this.insertedText = insertedText;
            }
            TextChange.prototype.getTextChangeRange = function () {
                return ts.createTextChangeRange(ts.createTextSpan(this.pos, this.deleteLen), this.insertedText ? this.insertedText.length : 0);
            };
            return TextChange;
        }());
        var ScriptVersionCache = /** @class */ (function () {
            function ScriptVersionCache() {
                this.changes = [];
                this.versions = new Array(ScriptVersionCache.maxVersions);
                this.minVersion = 0; // no versions earlier than min version will maintain change history
                this.currentVersion = 0;
            }
            ScriptVersionCache.prototype.versionToIndex = function (version) {
                if (version < this.minVersion || version > this.currentVersion) {
                    return undefined;
                }
                return version % ScriptVersionCache.maxVersions;
            };
            ScriptVersionCache.prototype.currentVersionToIndex = function () {
                return this.currentVersion % ScriptVersionCache.maxVersions;
            };
            // REVIEW: can optimize by coalescing simple edits
            ScriptVersionCache.prototype.edit = function (pos, deleteLen, insertedText) {
                this.changes.push(new TextChange(pos, deleteLen, insertedText));
                if (this.changes.length > ScriptVersionCache.changeNumberThreshold ||
                    deleteLen > ScriptVersionCache.changeLengthThreshold ||
                    insertedText && insertedText.length > ScriptVersionCache.changeLengthThreshold) {
                    this.getSnapshot();
                }
            };
            ScriptVersionCache.prototype.getSnapshot = function () { return this._getSnapshot(); };
            ScriptVersionCache.prototype._getSnapshot = function () {
                var snap = this.versions[this.currentVersionToIndex()];
                if (this.changes.length > 0) {
                    var snapIndex = snap.index;
                    for (var _i = 0, _a = this.changes; _i < _a.length; _i++) {
                        var change = _a[_i];
                        snapIndex = snapIndex.edit(change.pos, change.deleteLen, change.insertedText);
                    }
                    snap = new LineIndexSnapshot(this.currentVersion + 1, this, snapIndex, this.changes);
                    this.currentVersion = snap.version;
                    this.versions[this.currentVersionToIndex()] = snap;
                    this.changes = [];
                    if ((this.currentVersion - this.minVersion) >= ScriptVersionCache.maxVersions) {
                        this.minVersion = (this.currentVersion - ScriptVersionCache.maxVersions) + 1;
                    }
                }
                return snap;
            };
            ScriptVersionCache.prototype.getSnapshotVersion = function () {
                return this._getSnapshot().version;
            };
            ScriptVersionCache.prototype.getAbsolutePositionAndLineText = function (oneBasedLine) {
                return this._getSnapshot().index.lineNumberToInfo(oneBasedLine);
            };
            ScriptVersionCache.prototype.lineOffsetToPosition = function (line, column) {
                return this._getSnapshot().index.absolutePositionOfStartOfLine(line) + (column - 1);
            };
            ScriptVersionCache.prototype.positionToLineOffset = function (position) {
                return this._getSnapshot().index.positionToLineOffset(position);
            };
            ScriptVersionCache.prototype.lineToTextSpan = function (line) {
                var index = this._getSnapshot().index;
                var _a = index.lineNumberToInfo(line + 1), lineText = _a.lineText, absolutePosition = _a.absolutePosition;
                var len = lineText !== undefined ? lineText.length : index.absolutePositionOfStartOfLine(line + 2) - absolutePosition;
                return ts.createTextSpan(absolutePosition, len);
            };
            ScriptVersionCache.prototype.getTextChangesBetweenVersions = function (oldVersion, newVersion) {
                if (oldVersion < newVersion) {
                    if (oldVersion >= this.minVersion) {
                        var textChangeRanges = [];
                        for (var i = oldVersion + 1; i <= newVersion; i++) {
                            var snap = this.versions[this.versionToIndex(i)]; // TODO: GH#18217
                            for (var _i = 0, _a = snap.changesSincePreviousVersion; _i < _a.length; _i++) {
                                var textChange = _a[_i];
                                textChangeRanges.push(textChange.getTextChangeRange());
                            }
                        }
                        return ts.collapseTextChangeRangesAcrossMultipleVersions(textChangeRanges);
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    return ts.unchangedTextChangeRange;
                }
            };
            ScriptVersionCache.prototype.getLineCount = function () {
                return this._getSnapshot().index.getLineCount();
            };
            ScriptVersionCache.fromString = function (script) {
                var svc = new ScriptVersionCache();
                var snap = new LineIndexSnapshot(0, svc, new LineIndex());
                svc.versions[svc.currentVersion] = snap;
                var lm = LineIndex.linesFromText(script);
                snap.index.load(lm.lines);
                return svc;
            };
            ScriptVersionCache.changeNumberThreshold = 8;
            ScriptVersionCache.changeLengthThreshold = 256;
            ScriptVersionCache.maxVersions = 8;
            return ScriptVersionCache;
        }());
        server.ScriptVersionCache = ScriptVersionCache;
        var LineIndexSnapshot = /** @class */ (function () {
            function LineIndexSnapshot(version, cache, index, changesSincePreviousVersion) {
                if (changesSincePreviousVersion === void 0) { changesSincePreviousVersion = server.emptyArray; }
                this.version = version;
                this.cache = cache;
                this.index = index;
                this.changesSincePreviousVersion = changesSincePreviousVersion;
            }
            LineIndexSnapshot.prototype.getText = function (rangeStart, rangeEnd) {
                return this.index.getText(rangeStart, rangeEnd - rangeStart);
            };
            LineIndexSnapshot.prototype.getLength = function () {
                return this.index.getLength();
            };
            LineIndexSnapshot.prototype.getChangeRange = function (oldSnapshot) {
                if (oldSnapshot instanceof LineIndexSnapshot && this.cache === oldSnapshot.cache) {
                    if (this.version <= oldSnapshot.version) {
                        return ts.unchangedTextChangeRange;
                    }
                    else {
                        return this.cache.getTextChangesBetweenVersions(oldSnapshot.version, this.version);
                    }
                }
            };
            return LineIndexSnapshot;
        }());
        var LineIndex = /** @class */ (function () {
            function LineIndex() {
                // set this to true to check each edit for accuracy
                this.checkEdits = false;
            }
            LineIndex.prototype.absolutePositionOfStartOfLine = function (oneBasedLine) {
                return this.lineNumberToInfo(oneBasedLine).absolutePosition;
            };
            LineIndex.prototype.positionToLineOffset = function (position) {
                var _a = this.root.charOffsetToLineInfo(1, position), oneBasedLine = _a.oneBasedLine, zeroBasedColumn = _a.zeroBasedColumn;
                return { line: oneBasedLine, offset: zeroBasedColumn + 1 };
            };
            LineIndex.prototype.positionToColumnAndLineText = function (position) {
                return this.root.charOffsetToLineInfo(1, position);
            };
            LineIndex.prototype.getLineCount = function () {
                return this.root.lineCount();
            };
            LineIndex.prototype.lineNumberToInfo = function (oneBasedLine) {
                var lineCount = this.getLineCount();
                if (oneBasedLine <= lineCount) {
                    var _a = this.root.lineNumberToInfo(oneBasedLine, 0), position = _a.position, leaf = _a.leaf;
                    return { absolutePosition: position, lineText: leaf && leaf.text };
                }
                else {
                    return { absolutePosition: this.root.charCount(), lineText: undefined };
                }
            };
            LineIndex.prototype.load = function (lines) {
                if (lines.length > 0) {
                    var leaves = [];
                    for (var i = 0; i < lines.length; i++) {
                        leaves[i] = new LineLeaf(lines[i]);
                    }
                    this.root = LineIndex.buildTreeFromBottom(leaves);
                }
                else {
                    this.root = new LineNode();
                }
            };
            LineIndex.prototype.walk = function (rangeStart, rangeLength, walkFns) {
                this.root.walk(rangeStart, rangeLength, walkFns);
            };
            LineIndex.prototype.getText = function (rangeStart, rangeLength) {
                var accum = "";
                if ((rangeLength > 0) && (rangeStart < this.root.charCount())) {
                    this.walk(rangeStart, rangeLength, {
                        goSubtree: true,
                        done: false,
                        leaf: function (relativeStart, relativeLength, ll) {
                            accum = accum.concat(ll.text.substring(relativeStart, relativeStart + relativeLength));
                        }
                    });
                }
                return accum;
            };
            LineIndex.prototype.getLength = function () {
                return this.root.charCount();
            };
            LineIndex.prototype.every = function (f, rangeStart, rangeEnd) {
                if (!rangeEnd) {
                    rangeEnd = this.root.charCount();
                }
                var walkFns = {
                    goSubtree: true,
                    done: false,
                    leaf: function (relativeStart, relativeLength, ll) {
                        if (!f(ll, relativeStart, relativeLength)) {
                            this.done = true;
                        }
                    }
                };
                this.walk(rangeStart, rangeEnd - rangeStart, walkFns);
                return !walkFns.done;
            };
            LineIndex.prototype.edit = function (pos, deleteLength, newText) {
                if (this.root.charCount() === 0) {
                    ts.Debug.assert(deleteLength === 0); // Can't delete from empty document
                    if (newText !== undefined) {
                        this.load(LineIndex.linesFromText(newText).lines);
                        return this;
                    }
                    return undefined; // TODO: GH#18217
                }
                else {
                    var checkText = void 0;
                    if (this.checkEdits) {
                        var source = this.getText(0, this.root.charCount());
                        checkText = source.slice(0, pos) + newText + source.slice(pos + deleteLength);
                    }
                    var walker = new EditWalker();
                    var suppressTrailingText = false;
                    if (pos >= this.root.charCount()) {
                        // insert at end
                        pos = this.root.charCount() - 1;
                        var endString = this.getText(pos, 1);
                        if (newText) {
                            newText = endString + newText;
                        }
                        else {
                            newText = endString;
                        }
                        deleteLength = 0;
                        suppressTrailingText = true;
                    }
                    else if (deleteLength > 0) {
                        // check whether last characters deleted are line break
                        var e = pos + deleteLength;
                        var _a = this.positionToColumnAndLineText(e), zeroBasedColumn = _a.zeroBasedColumn, lineText = _a.lineText;
                        if (zeroBasedColumn === 0) {
                            // move range end just past line that will merge with previous line
                            deleteLength += lineText.length; // TODO: GH#18217
                            // store text by appending to end of insertedText
                            newText = newText ? newText + lineText : lineText;
                        }
                    }
                    this.root.walk(pos, deleteLength, walker);
                    walker.insertLines(newText, suppressTrailingText);
                    if (this.checkEdits) {
                        var updatedText = walker.lineIndex.getText(0, walker.lineIndex.getLength());
                        ts.Debug.assert(checkText === updatedText, "buffer edit mismatch");
                    }
                    return walker.lineIndex;
                }
            };
            LineIndex.buildTreeFromBottom = function (nodes) {
                if (nodes.length < lineCollectionCapacity) {
                    return new LineNode(nodes);
                }
                var interiorNodes = new Array(Math.ceil(nodes.length / lineCollectionCapacity));
                var nodeIndex = 0;
                for (var i = 0; i < interiorNodes.length; i++) {
                    var end = Math.min(nodeIndex + lineCollectionCapacity, nodes.length);
                    interiorNodes[i] = new LineNode(nodes.slice(nodeIndex, end));
                    nodeIndex = end;
                }
                return this.buildTreeFromBottom(interiorNodes);
            };
            LineIndex.linesFromText = function (text) {
                var lineMap = ts.computeLineStarts(text);
                if (lineMap.length === 0) {
                    return { lines: [], lineMap: lineMap };
                }
                var lines = new Array(lineMap.length);
                var lc = lineMap.length - 1;
                for (var lmi = 0; lmi < lc; lmi++) {
                    lines[lmi] = text.substring(lineMap[lmi], lineMap[lmi + 1]);
                }
                var endText = text.substring(lineMap[lc]);
                if (endText.length > 0) {
                    lines[lc] = endText;
                }
                else {
                    lines.pop();
                }
                return { lines: lines, lineMap: lineMap };
            };
            return LineIndex;
        }());
        server.LineIndex = LineIndex;
        var LineNode = /** @class */ (function () {
            function LineNode(children) {
                if (children === void 0) { children = []; }
                this.children = children;
                this.totalChars = 0;
                this.totalLines = 0;
                if (children.length)
                    this.updateCounts();
            }
            LineNode.prototype.isLeaf = function () {
                return false;
            };
            LineNode.prototype.updateCounts = function () {
                this.totalChars = 0;
                this.totalLines = 0;
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    this.totalChars += child.charCount();
                    this.totalLines += child.lineCount();
                }
            };
            LineNode.prototype.execWalk = function (rangeStart, rangeLength, walkFns, childIndex, nodeType) {
                if (walkFns.pre) {
                    walkFns.pre(rangeStart, rangeLength, this.children[childIndex], this, nodeType);
                }
                if (walkFns.goSubtree) {
                    this.children[childIndex].walk(rangeStart, rangeLength, walkFns);
                    if (walkFns.post) {
                        walkFns.post(rangeStart, rangeLength, this.children[childIndex], this, nodeType);
                    }
                }
                else {
                    walkFns.goSubtree = true;
                }
                return walkFns.done;
            };
            LineNode.prototype.skipChild = function (relativeStart, relativeLength, childIndex, walkFns, nodeType) {
                if (walkFns.pre && (!walkFns.done)) {
                    walkFns.pre(relativeStart, relativeLength, this.children[childIndex], this, nodeType);
                    walkFns.goSubtree = true;
                }
            };
            LineNode.prototype.walk = function (rangeStart, rangeLength, walkFns) {
                // assume (rangeStart < this.totalChars) && (rangeLength <= this.totalChars)
                var childIndex = 0;
                var childCharCount = this.children[childIndex].charCount();
                // find sub-tree containing start
                var adjustedStart = rangeStart;
                while (adjustedStart >= childCharCount) {
                    this.skipChild(adjustedStart, rangeLength, childIndex, walkFns, 0 /* PreStart */);
                    adjustedStart -= childCharCount;
                    childIndex++;
                    childCharCount = this.children[childIndex].charCount();
                }
                // Case I: both start and end of range in same subtree
                if ((adjustedStart + rangeLength) <= childCharCount) {
                    if (this.execWalk(adjustedStart, rangeLength, walkFns, childIndex, 2 /* Entire */)) {
                        return;
                    }
                }
                else {
                    // Case II: start and end of range in different subtrees (possibly with subtrees in the middle)
                    if (this.execWalk(adjustedStart, childCharCount - adjustedStart, walkFns, childIndex, 1 /* Start */)) {
                        return;
                    }
                    var adjustedLength = rangeLength - (childCharCount - adjustedStart);
                    childIndex++;
                    var child = this.children[childIndex];
                    childCharCount = child.charCount();
                    while (adjustedLength > childCharCount) {
                        if (this.execWalk(0, childCharCount, walkFns, childIndex, 3 /* Mid */)) {
                            return;
                        }
                        adjustedLength -= childCharCount;
                        childIndex++;
                        childCharCount = this.children[childIndex].charCount();
                    }
                    if (adjustedLength > 0) {
                        if (this.execWalk(0, adjustedLength, walkFns, childIndex, 4 /* End */)) {
                            return;
                        }
                    }
                }
                // Process any subtrees after the one containing range end
                if (walkFns.pre) {
                    var clen = this.children.length;
                    if (childIndex < (clen - 1)) {
                        for (var ej = childIndex + 1; ej < clen; ej++) {
                            this.skipChild(0, 0, ej, walkFns, 5 /* PostEnd */);
                        }
                    }
                }
            };
            // Input position is relative to the start of this node.
            // Output line number is absolute.
            LineNode.prototype.charOffsetToLineInfo = function (lineNumberAccumulator, relativePosition) {
                if (this.children.length === 0) {
                    // Root node might have no children if this is an empty document.
                    return { oneBasedLine: lineNumberAccumulator, zeroBasedColumn: relativePosition, lineText: undefined };
                }
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child.charCount() > relativePosition) {
                        if (child.isLeaf()) {
                            return { oneBasedLine: lineNumberAccumulator, zeroBasedColumn: relativePosition, lineText: child.text };
                        }
                        else {
                            return child.charOffsetToLineInfo(lineNumberAccumulator, relativePosition);
                        }
                    }
                    else {
                        relativePosition -= child.charCount();
                        lineNumberAccumulator += child.lineCount();
                    }
                }
                // Skipped all children
                var leaf = this.lineNumberToInfo(this.lineCount(), 0).leaf;
                return { oneBasedLine: this.lineCount(), zeroBasedColumn: leaf ? leaf.charCount() : 0, lineText: undefined };
            };
            /**
             * Input line number is relative to the start of this node.
             * Output line number is relative to the child.
             * positionAccumulator will be an absolute position once relativeLineNumber reaches 0.
             */
            LineNode.prototype.lineNumberToInfo = function (relativeOneBasedLine, positionAccumulator) {
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childLineCount = child.lineCount();
                    if (childLineCount >= relativeOneBasedLine) {
                        return child.isLeaf() ? { position: positionAccumulator, leaf: child } : child.lineNumberToInfo(relativeOneBasedLine, positionAccumulator);
                    }
                    else {
                        relativeOneBasedLine -= childLineCount;
                        positionAccumulator += child.charCount();
                    }
                }
                return { position: positionAccumulator, leaf: undefined };
            };
            LineNode.prototype.splitAfter = function (childIndex) {
                var splitNode;
                var clen = this.children.length;
                childIndex++;
                var endLength = childIndex;
                if (childIndex < clen) {
                    splitNode = new LineNode();
                    while (childIndex < clen) {
                        splitNode.add(this.children[childIndex]);
                        childIndex++;
                    }
                    splitNode.updateCounts();
                }
                this.children.length = endLength;
                return splitNode;
            };
            LineNode.prototype.remove = function (child) {
                var childIndex = this.findChildIndex(child);
                var clen = this.children.length;
                if (childIndex < (clen - 1)) {
                    for (var i = childIndex; i < (clen - 1); i++) {
                        this.children[i] = this.children[i + 1];
                    }
                }
                this.children.pop();
            };
            LineNode.prototype.findChildIndex = function (child) {
                var childIndex = this.children.indexOf(child);
                ts.Debug.assert(childIndex !== -1);
                return childIndex;
            };
            LineNode.prototype.insertAt = function (child, nodes) {
                var childIndex = this.findChildIndex(child);
                var clen = this.children.length;
                var nodeCount = nodes.length;
                // if child is last and there is more room and only one node to place, place it
                if ((clen < lineCollectionCapacity) && (childIndex === (clen - 1)) && (nodeCount === 1)) {
                    this.add(nodes[0]);
                    this.updateCounts();
                    return [];
                }
                else {
                    var shiftNode = this.splitAfter(childIndex);
                    var nodeIndex = 0;
                    childIndex++;
                    while ((childIndex < lineCollectionCapacity) && (nodeIndex < nodeCount)) {
                        this.children[childIndex] = nodes[nodeIndex];
                        childIndex++;
                        nodeIndex++;
                    }
                    var splitNodes = [];
                    var splitNodeCount = 0;
                    if (nodeIndex < nodeCount) {
                        splitNodeCount = Math.ceil((nodeCount - nodeIndex) / lineCollectionCapacity);
                        splitNodes = new Array(splitNodeCount);
                        var splitNodeIndex = 0;
                        for (var i = 0; i < splitNodeCount; i++) {
                            splitNodes[i] = new LineNode();
                        }
                        var splitNode = splitNodes[0];
                        while (nodeIndex < nodeCount) {
                            splitNode.add(nodes[nodeIndex]);
                            nodeIndex++;
                            if (splitNode.children.length === lineCollectionCapacity) {
                                splitNodeIndex++;
                                splitNode = splitNodes[splitNodeIndex];
                            }
                        }
                        for (var i = splitNodes.length - 1; i >= 0; i--) {
                            if (splitNodes[i].children.length === 0) {
                                splitNodes.pop();
                            }
                        }
                    }
                    if (shiftNode) {
                        splitNodes.push(shiftNode);
                    }
                    this.updateCounts();
                    for (var i = 0; i < splitNodeCount; i++) {
                        splitNodes[i].updateCounts();
                    }
                    return splitNodes;
                }
            };
            // assume there is room for the item; return true if more room
            LineNode.prototype.add = function (collection) {
                this.children.push(collection);
                ts.Debug.assert(this.children.length <= lineCollectionCapacity);
            };
            LineNode.prototype.charCount = function () {
                return this.totalChars;
            };
            LineNode.prototype.lineCount = function () {
                return this.totalLines;
            };
            return LineNode;
        }());
        var LineLeaf = /** @class */ (function () {
            function LineLeaf(text) {
                this.text = text;
            }
            LineLeaf.prototype.isLeaf = function () {
                return true;
            };
            LineLeaf.prototype.walk = function (rangeStart, rangeLength, walkFns) {
                walkFns.leaf(rangeStart, rangeLength, this);
            };
            LineLeaf.prototype.charCount = function () {
                return this.text.length;
            };
            LineLeaf.prototype.lineCount = function () {
                return 1;
            };
            return LineLeaf;
        }());
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
//# sourceMappingURL=server.js.map