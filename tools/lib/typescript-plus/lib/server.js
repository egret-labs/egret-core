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
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
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
        var Msg;
        (function (Msg) {
            Msg["Err"] = "Err";
            Msg["Info"] = "Info";
            Msg["Perf"] = "Perf";
        })(Msg = server.Msg || (server.Msg = {}));
        function createInstallTypingsRequest(project, typeAcquisition, unresolvedImports, cachePath) {
            return {
                projectName: project.getProjectName(),
                fileNames: project.getFileNames(true, true).concat(project.getExcludedFiles()),
                compilerOptions: project.getCompilationSettings(),
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
        function getDefaultFormatCodeSettings(host) {
            return {
                indentSize: 4,
                tabSize: 4,
                newLineCharacter: host.newLine || "\n",
                convertTabsToSpaces: true,
                indentStyle: ts.IndentStyle.Smart,
                insertSpaceAfterConstructor: false,
                insertSpaceAfterCommaDelimiter: true,
                insertSpaceAfterSemicolonInForStatements: true,
                insertSpaceBeforeAndAfterBinaryOperators: true,
                insertSpaceAfterKeywordsInControlFlowStatements: true,
                insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
                insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
                insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
                insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
                insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
                insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: false,
                insertSpaceBeforeFunctionParenthesis: false,
                placeOpenBraceOnNewLineForFunctions: false,
                placeOpenBraceOnNewLineForControlBlocks: false,
            };
        }
        server.getDefaultFormatCodeSettings = getDefaultFormatCodeSettings;
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
            var map = ts.createMap();
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
            return /dev\/null\/inferredProject\d+\*/.test(name);
        }
        server.isInferredProjectName = isInferredProjectName;
        function makeInferredProjectName(counter) {
            return "/dev/null/inferredProject" + counter + "*";
        }
        server.makeInferredProjectName = makeInferredProjectName;
        function createSortedArray() {
            return [];
        }
        server.createSortedArray = createSortedArray;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
(function (ts) {
    var server;
    (function (server) {
        var ThrottledOperations = (function () {
            function ThrottledOperations(host, logger) {
                this.host = host;
                this.pendingTimeouts = ts.createMap();
                this.logger = logger.hasLevel(server.LogLevel.verbose) ? logger : undefined;
            }
            ThrottledOperations.prototype.schedule = function (operationId, delay, cb) {
                var pendingTimeout = this.pendingTimeouts.get(operationId);
                if (pendingTimeout) {
                    this.host.clearTimeout(pendingTimeout);
                }
                this.pendingTimeouts.set(operationId, this.host.setTimeout(ThrottledOperations.run, delay, this, operationId, cb));
                if (this.logger) {
                    this.logger.info("Scheduled: " + operationId + (pendingTimeout ? ", Cancelled earlier one" : ""));
                }
            };
            ThrottledOperations.run = function (self, operationId, cb) {
                self.pendingTimeouts.delete(operationId);
                if (self.logger) {
                    self.logger.info("Running: " + operationId);
                }
                cb();
            };
            return ThrottledOperations;
        }());
        server.ThrottledOperations = ThrottledOperations;
        var GcTimer = (function () {
            function GcTimer(host, delay, logger) {
                this.host = host;
                this.delay = delay;
                this.logger = logger;
            }
            GcTimer.prototype.scheduleCollect = function () {
                if (!this.host.gc || this.timerId !== undefined) {
                    return;
                }
                this.timerId = this.host.setTimeout(GcTimer.run, this.delay, this);
            };
            GcTimer.run = function (self) {
                self.timerId = undefined;
                var log = self.logger.hasLevel(server.LogLevel.requestTime);
                var before = log && self.host.getMemoryUsage();
                self.host.gc();
                if (log) {
                    var after = self.host.getMemoryUsage();
                    self.logger.perftrc("GC::before " + before + ", after " + after);
                }
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
        function toSortedArray(arr, comparer) {
            arr.sort(comparer);
            return arr;
        }
        server.toSortedArray = toSortedArray;
        function toDeduplicatedSortedArray(arr) {
            arr.sort();
            ts.filterMutate(arr, isNonDuplicateInSortedArray);
            return arr;
        }
        server.toDeduplicatedSortedArray = toDeduplicatedSortedArray;
        function isNonDuplicateInSortedArray(value, index, array) {
            return index === 0 || value !== array[index - 1];
        }
        function indent(str) {
            return "\n    " + str;
        }
        server.indent = indent;
        function stringifyIndented(json) {
            return "\n    " + JSON.stringify(json);
        }
        server.stringifyIndented = stringifyIndented;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        var protocol;
        (function (protocol) {
            var CommandTypes;
            (function (CommandTypes) {
                CommandTypes["JsxClosingTag"] = "jsxClosingTag";
                CommandTypes["Brace"] = "brace";
                CommandTypes["BraceFull"] = "brace-full";
                CommandTypes["BraceCompletion"] = "braceCompletion";
                CommandTypes["GetSpanOfEnclosingComment"] = "getSpanOfEnclosingComment";
                CommandTypes["Change"] = "change";
                CommandTypes["Close"] = "close";
                CommandTypes["Completions"] = "completions";
                CommandTypes["CompletionInfo"] = "completionInfo";
                CommandTypes["CompletionsFull"] = "completions-full";
                CommandTypes["CompletionDetails"] = "completionEntryDetails";
                CommandTypes["CompletionDetailsFull"] = "completionEntryDetails-full";
                CommandTypes["CompileOnSaveAffectedFileList"] = "compileOnSaveAffectedFileList";
                CommandTypes["CompileOnSaveEmitFile"] = "compileOnSaveEmitFile";
                CommandTypes["Configure"] = "configure";
                CommandTypes["Definition"] = "definition";
                CommandTypes["DefinitionFull"] = "definition-full";
                CommandTypes["DefinitionAndBoundSpan"] = "definitionAndBoundSpan";
                CommandTypes["DefinitionAndBoundSpanFull"] = "definitionAndBoundSpan-full";
                CommandTypes["Implementation"] = "implementation";
                CommandTypes["ImplementationFull"] = "implementation-full";
                CommandTypes["EmitOutput"] = "emit-output";
                CommandTypes["Exit"] = "exit";
                CommandTypes["Format"] = "format";
                CommandTypes["Formatonkey"] = "formatonkey";
                CommandTypes["FormatFull"] = "format-full";
                CommandTypes["FormatonkeyFull"] = "formatonkey-full";
                CommandTypes["FormatRangeFull"] = "formatRange-full";
                CommandTypes["Geterr"] = "geterr";
                CommandTypes["GeterrForProject"] = "geterrForProject";
                CommandTypes["SemanticDiagnosticsSync"] = "semanticDiagnosticsSync";
                CommandTypes["SyntacticDiagnosticsSync"] = "syntacticDiagnosticsSync";
                CommandTypes["SuggestionDiagnosticsSync"] = "suggestionDiagnosticsSync";
                CommandTypes["NavBar"] = "navbar";
                CommandTypes["NavBarFull"] = "navbar-full";
                CommandTypes["Navto"] = "navto";
                CommandTypes["NavtoFull"] = "navto-full";
                CommandTypes["NavTree"] = "navtree";
                CommandTypes["NavTreeFull"] = "navtree-full";
                CommandTypes["Occurrences"] = "occurrences";
                CommandTypes["DocumentHighlights"] = "documentHighlights";
                CommandTypes["DocumentHighlightsFull"] = "documentHighlights-full";
                CommandTypes["Open"] = "open";
                CommandTypes["Quickinfo"] = "quickinfo";
                CommandTypes["QuickinfoFull"] = "quickinfo-full";
                CommandTypes["References"] = "references";
                CommandTypes["ReferencesFull"] = "references-full";
                CommandTypes["Reload"] = "reload";
                CommandTypes["Rename"] = "rename";
                CommandTypes["RenameInfoFull"] = "rename-full";
                CommandTypes["RenameLocationsFull"] = "renameLocations-full";
                CommandTypes["Saveto"] = "saveto";
                CommandTypes["SignatureHelp"] = "signatureHelp";
                CommandTypes["SignatureHelpFull"] = "signatureHelp-full";
                CommandTypes["Status"] = "status";
                CommandTypes["TypeDefinition"] = "typeDefinition";
                CommandTypes["ProjectInfo"] = "projectInfo";
                CommandTypes["ReloadProjects"] = "reloadProjects";
                CommandTypes["Unknown"] = "unknown";
                CommandTypes["OpenExternalProject"] = "openExternalProject";
                CommandTypes["OpenExternalProjects"] = "openExternalProjects";
                CommandTypes["CloseExternalProject"] = "closeExternalProject";
                CommandTypes["SynchronizeProjectList"] = "synchronizeProjectList";
                CommandTypes["ApplyChangedToOpenFiles"] = "applyChangedToOpenFiles";
                CommandTypes["EncodedSemanticClassificationsFull"] = "encodedSemanticClassifications-full";
                CommandTypes["Cleanup"] = "cleanup";
                CommandTypes["GetOutliningSpans"] = "getOutliningSpans";
                CommandTypes["GetOutliningSpansFull"] = "outliningSpans";
                CommandTypes["TodoComments"] = "todoComments";
                CommandTypes["Indentation"] = "indentation";
                CommandTypes["DocCommentTemplate"] = "docCommentTemplate";
                CommandTypes["CompilerOptionsDiagnosticsFull"] = "compilerOptionsDiagnostics-full";
                CommandTypes["NameOrDottedNameSpan"] = "nameOrDottedNameSpan";
                CommandTypes["BreakpointStatement"] = "breakpointStatement";
                CommandTypes["CompilerOptionsForInferredProjects"] = "compilerOptionsForInferredProjects";
                CommandTypes["GetCodeFixes"] = "getCodeFixes";
                CommandTypes["GetCodeFixesFull"] = "getCodeFixes-full";
                CommandTypes["GetCombinedCodeFix"] = "getCombinedCodeFix";
                CommandTypes["GetCombinedCodeFixFull"] = "getCombinedCodeFix-full";
                CommandTypes["ApplyCodeActionCommand"] = "applyCodeActionCommand";
                CommandTypes["GetSupportedCodeFixes"] = "getSupportedCodeFixes";
                CommandTypes["GetApplicableRefactors"] = "getApplicableRefactors";
                CommandTypes["GetEditsForRefactor"] = "getEditsForRefactor";
                CommandTypes["GetEditsForRefactorFull"] = "getEditsForRefactor-full";
                CommandTypes["OrganizeImports"] = "organizeImports";
                CommandTypes["OrganizeImportsFull"] = "organizeImports-full";
                CommandTypes["GetEditsForFileRename"] = "getEditsForFileRename";
                CommandTypes["GetEditsForFileRenameFull"] = "getEditsForFileRename-full";
            })(CommandTypes = protocol.CommandTypes || (protocol.CommandTypes = {}));
            var IndentStyle;
            (function (IndentStyle) {
                IndentStyle["None"] = "None";
                IndentStyle["Block"] = "Block";
                IndentStyle["Smart"] = "Smart";
            })(IndentStyle = protocol.IndentStyle || (protocol.IndentStyle = {}));
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
                ScriptTarget["ESNext"] = "ESNext";
            })(ScriptTarget = protocol.ScriptTarget || (protocol.ScriptTarget = {}));
        })(protocol = server.protocol || (server.protocol = {}));
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        var TextStorage = (function () {
            function TextStorage(host, fileName, initialVersion, info) {
                this.host = host;
                this.fileName = fileName;
                this.info = info;
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
            TextStorage.prototype.useText = function (newText) {
                this.svc = undefined;
                this.text = newText;
                this.lineMap = undefined;
                this.version.text++;
            };
            TextStorage.prototype.edit = function (start, end, newText) {
                this.switchToScriptVersionCache().edit(start, end - start, newText);
                this.ownFileText = false;
                this.text = undefined;
                this.lineMap = undefined;
            };
            TextStorage.prototype.reload = function (newText) {
                ts.Debug.assert(newText !== undefined);
                this.pendingReloadFromDisk = false;
                if (this.text !== newText) {
                    this.useText(newText);
                    this.ownFileText = false;
                    return true;
                }
            };
            TextStorage.prototype.reloadWithFileText = function (tempFileName) {
                var reloaded = this.reload(this.getFileText(tempFileName));
                this.ownFileText = !tempFileName || tempFileName === this.fileName;
                return reloaded;
            };
            TextStorage.prototype.reloadFromDisk = function () {
                if (!this.pendingReloadFromDisk && !this.ownFileText) {
                    return this.reloadWithFileText();
                }
                return false;
            };
            TextStorage.prototype.delayReloadFromFileIntoText = function () {
                this.pendingReloadFromDisk = true;
            };
            TextStorage.prototype.getSnapshot = function () {
                return this.useScriptVersionCacheIfValidOrOpen()
                    ? this.svc.getSnapshot()
                    : ts.ScriptSnapshot.fromString(this.getOrLoadText());
            };
            TextStorage.prototype.getLineInfo = function (line) {
                return this.switchToScriptVersionCache().getLineInfo(line);
            };
            TextStorage.prototype.lineToTextSpan = function (line) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    var lineMap = this.getLineMap();
                    var start = lineMap[line];
                    var end = line + 1 < lineMap.length ? lineMap[line + 1] : this.text.length;
                    return ts.createTextSpanFromBounds(start, end);
                }
                return this.svc.lineToTextSpan(line);
            };
            TextStorage.prototype.lineOffsetToPosition = function (line, offset) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    return ts.computePositionOfLineAndCharacter(this.getLineMap(), line - 1, offset - 1, this.text);
                }
                return this.svc.lineOffsetToPosition(line, offset);
            };
            TextStorage.prototype.positionToLineOffset = function (position) {
                if (!this.useScriptVersionCacheIfValidOrOpen()) {
                    var _a = ts.computeLineAndCharacterOfPosition(this.getLineMap(), position), line = _a.line, character = _a.character;
                    return { line: line + 1, offset: character + 1 };
                }
                return this.svc.positionToLineOffset(position);
            };
            TextStorage.prototype.getFileText = function (tempFileName) {
                var _this = this;
                var text;
                var fileName = tempFileName || this.fileName;
                var getText = function () { return text === undefined ? (text = _this.host.readFile(fileName) || "") : text; };
                if (!ts.hasTSFileExtension(this.fileName)) {
                    var fileSize = this.host.getFileSize ? this.host.getFileSize(fileName) : getText().length;
                    if (fileSize > server.maxFileSize) {
                        ts.Debug.assert(!!this.info.containingProjects.length);
                        var service = this.info.containingProjects[0].projectService;
                        service.logger.info("Skipped loading contents of large file " + fileName + " for info " + this.info.fileName + ": fileSize: " + fileSize);
                        this.info.containingProjects[0].projectService.sendLargeFileReferencedEvent(fileName, fileSize);
                        return "";
                    }
                }
                return getText();
            };
            TextStorage.prototype.switchToScriptVersionCache = function () {
                if (!this.svc || this.pendingReloadFromDisk) {
                    this.svc = server.ScriptVersionCache.fromString(this.getOrLoadText());
                    this.version.svc++;
                }
                return this.svc;
            };
            TextStorage.prototype.useScriptVersionCacheIfValidOrOpen = function () {
                if (this.isOpen) {
                    return this.switchToScriptVersionCache();
                }
                if (this.pendingReloadFromDisk) {
                    this.reloadWithFileText();
                }
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
            return TextStorage;
        }());
        server.TextStorage = TextStorage;
        function isDynamicFileName(fileName) {
            return fileName[0] === "^" || ts.getBaseFileName(fileName)[0] === "^";
        }
        server.isDynamicFileName = isDynamicFileName;
        var ScriptInfo = (function () {
            function ScriptInfo(host, fileName, scriptKind, hasMixedContent, path, initialVersion) {
                this.host = host;
                this.fileName = fileName;
                this.scriptKind = scriptKind;
                this.hasMixedContent = hasMixedContent;
                this.path = path;
                this.containingProjects = [];
                this.isDynamic = isDynamicFileName(fileName);
                this.textStorage = new TextStorage(host, fileName, initialVersion, this);
                if (hasMixedContent || this.isDynamic) {
                    this.textStorage.reload("");
                    this.realpath = this.path;
                }
                this.scriptKind = scriptKind
                    ? scriptKind
                    : ts.getScriptKindFromFileName(fileName);
            }
            ScriptInfo.prototype.getVersion = function () {
                return this.textStorage.version;
            };
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
                    this.realpath = this.path;
                    if (this.host.realpath) {
                        ts.Debug.assert(!!this.containingProjects.length);
                        var project = this.containingProjects[0];
                        var realpath = this.host.realpath(this.path);
                        if (realpath) {
                            this.realpath = project.toPath(realpath);
                            if (this.realpath !== this.path) {
                                project.projectService.realpathToScriptInfos.add(this.realpath, this);
                            }
                        }
                    }
                }
            };
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
                switch (this.containingProjects.length) {
                    case 0: return false;
                    case 1: return this.containingProjects[0] === project;
                    case 2: return this.containingProjects[0] === project || this.containingProjects[1] === project;
                    default: return ts.contains(this.containingProjects, project);
                }
            };
            ScriptInfo.prototype.detachFromProject = function (project) {
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
                    if (p.projectKind === server.ProjectKind.Configured) {
                        p.getCachedDirectoryStructureHost().addOrDeleteFile(this.fileName, this.path, ts.FileWatcherEventKind.Deleted);
                    }
                    var isInfoRoot = p.isRoot(this);
                    p.removeFile(this, false, false);
                    if (isInfoRoot && p.projectKind !== server.ProjectKind.Inferred) {
                        p.addMissingFileRoot(this.fileName);
                    }
                }
                ts.clear(this.containingProjects);
            };
            ScriptInfo.prototype.getDefaultProject = function () {
                switch (this.containingProjects.length) {
                    case 0:
                        return server.Errors.ThrowNoProject();
                    case 1:
                        return this.containingProjects[0];
                    default:
                        var firstExternalProject = void 0;
                        for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
                            var project = _a[_i];
                            if (project.projectKind === server.ProjectKind.Configured) {
                                return project;
                            }
                            else if (project.projectKind === server.ProjectKind.External && !firstExternalProject) {
                                firstExternalProject = project;
                            }
                        }
                        return firstExternalProject || this.containingProjects[0];
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
                        this.formatSettings = server.getDefaultFormatCodeSettings(this.host);
                        ts.assign(this.formatSettings, formatSettings);
                    }
                    else {
                        this.formatSettings = __assign({}, this.formatSettings, formatSettings);
                    }
                }
                if (preferences) {
                    if (!this.preferences) {
                        this.preferences = ts.emptyOptions;
                    }
                    this.preferences = __assign({}, this.preferences, preferences);
                }
            };
            ScriptInfo.prototype.getLatestVersion = function () {
                return this.textStorage.getVersion();
            };
            ScriptInfo.prototype.saveTo = function (fileName) {
                this.host.writeFile(fileName, ts.getSnapshotText(this.textStorage.getSnapshot()));
            };
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
            ScriptInfo.prototype.getLineInfo = function (line) {
                return this.textStorage.getLineInfo(line);
            };
            ScriptInfo.prototype.editContent = function (start, end, newText) {
                this.textStorage.edit(start, end, newText);
                this.markContainingProjectsAsDirty();
            };
            ScriptInfo.prototype.markContainingProjectsAsDirty = function () {
                for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    p.markAsDirty();
                }
            };
            ScriptInfo.prototype.isOrphan = function () {
                return !ts.forEach(this.containingProjects, function (p) { return !p.isOrphan(); });
            };
            ScriptInfo.prototype.lineToTextSpan = function (line) {
                return this.textStorage.lineToTextSpan(line);
            };
            ScriptInfo.prototype.lineOffsetToPosition = function (line, offset) {
                return this.textStorage.lineOffsetToPosition(line, offset);
            };
            ScriptInfo.prototype.positionToLineOffset = function (position) {
                return this.textStorage.positionToLineOffset(position);
            };
            ScriptInfo.prototype.isJavaScript = function () {
                return this.scriptKind === 1 || this.scriptKind === 2;
            };
            return ScriptInfo;
        }());
        server.ScriptInfo = ScriptInfo;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        server.nullTypingsInstaller = {
            isKnownTypesPackageName: ts.returnFalse,
            installPackage: ts.notImplemented,
            inspectValue: ts.notImplemented,
            enqueueInstallTypingsRequest: ts.noop,
            attach: ts.noop,
            onProjectClosed: ts.noop,
            globalTypingsCacheLocation: undefined
        };
        function setIsEqualTo(arr1, arr2) {
            if (arr1 === arr2) {
                return true;
            }
            if ((arr1 || server.emptyArray).length === 0 && (arr2 || server.emptyArray).length === 0) {
                return true;
            }
            var set = ts.createMap();
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
            return opt1.allowJs !== opt2.allowJs;
        }
        function unresolvedImportsChanged(imports1, imports2) {
            if (imports1 === imports2) {
                return false;
            }
            return !ts.arrayIsEqualTo(imports1, imports2);
        }
        var TypingsCache = (function () {
            function TypingsCache(installer) {
                this.installer = installer;
                this.perProjectCache = ts.createMap();
            }
            TypingsCache.prototype.isKnownTypesPackageName = function (name) {
                return this.installer.isKnownTypesPackageName(name);
            };
            TypingsCache.prototype.installPackage = function (options) {
                return this.installer.installPackage(options);
            };
            TypingsCache.prototype.inspectValue = function (options) {
                return this.installer.inspectValue(options);
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
                    this.perProjectCache.set(project.getProjectName(), {
                        compilerOptions: project.getCompilationSettings(),
                        typeAcquisition: typeAcquisition,
                        typings: entry ? entry.typings : server.emptyArray,
                        unresolvedImports: unresolvedImports,
                        poisoned: true
                    });
                    this.installer.enqueueInstallTypingsRequest(project, typeAcquisition, unresolvedImports);
                }
            };
            TypingsCache.prototype.updateTypingsForProject = function (projectName, compilerOptions, typeAcquisition, unresolvedImports, newTypings) {
                var typings = server.toSortedArray(newTypings);
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
        })(ProjectKind = server.ProjectKind || (server.ProjectKind = {}));
        function countEachFileTypes(infos) {
            var result = { js: 0, jsx: 0, ts: 0, tsx: 0, dts: 0, deferred: 0 };
            for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                var info = infos_1[_i];
                switch (info.scriptKind) {
                    case 1:
                        result.js += 1;
                        break;
                    case 2:
                        result.jsx += 1;
                        break;
                    case 3:
                        ts.fileExtensionIs(info.fileName, ".d.ts")
                            ? result.dts += 1
                            : result.ts += 1;
                        break;
                    case 4:
                        result.tsx += 1;
                        break;
                    case 7:
                        result.deferred += 1;
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
        function hasNoTypeScriptSource(fileNames) {
            return !fileNames.some(function (fileName) { return (ts.fileExtensionIs(fileName, ".ts") && !ts.fileExtensionIs(fileName, ".d.ts")) || ts.fileExtensionIs(fileName, ".tsx"); });
        }
        server.hasNoTypeScriptSource = hasNoTypeScriptSource;
        function isScriptInfo(value) {
            return value instanceof server.ScriptInfo;
        }
        server.isScriptInfo = isScriptInfo;
        var Project = (function () {
            function Project(projectName, projectKind, projectService, documentRegistry, hasExplicitListOfFiles, lastFileExceededProgramSize, compilerOptions, compileOnSaveEnabled, directoryStructureHost, currentDirectory) {
                var _this = this;
                this.projectName = projectName;
                this.projectKind = projectKind;
                this.projectService = projectService;
                this.documentRegistry = documentRegistry;
                this.compilerOptions = compilerOptions;
                this.compileOnSaveEnabled = compileOnSaveEnabled;
                this.rootFiles = [];
                this.rootFilesMap = ts.createMap();
                this.plugins = [];
                this.cachedUnresolvedImportsPerFile = ts.createMap();
                this.hasAddedorRemovedFiles = false;
                this.lastReportedVersion = 0;
                this.projectProgramVersion = 0;
                this.projectStateVersion = 0;
                this.isInitialLoadPending = ts.returnFalse;
                this.dirty = false;
                this.hasChangedAutomaticTypeDirectiveNames = false;
                this.typingFiles = server.emptyArray;
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
                    this.compilerOptions.allowNonTsExtensions = true;
                }
                this.languageServiceEnabled = !projectService.syntaxOnly;
                this.setInternalCompilerOptionsForEmittingJsFiles();
                var host = this.projectService.host;
                if (this.projectService.logger.loggingEnabled()) {
                    this.trace = function (s) { return _this.writeLog(s); };
                }
                else if (host.trace) {
                    this.trace = function (s) { return host.trace(s); };
                }
                if (host.realpath) {
                    this.realpath = function (path) { return host.realpath(path); };
                }
                this.resolutionCache = ts.createResolutionCache(this, currentDirectory && this.currentDirectory, true);
                this.languageService = ts.createLanguageService(this, this.documentRegistry, projectService.syntaxOnly);
                if (lastFileExceededProgramSize) {
                    this.disableLanguageService(lastFileExceededProgramSize);
                }
                this.markAsDirty();
                this.projectService.pendingEnsureProjectForOpenFiles = true;
            }
            Project.prototype.isNonTsProject = function () {
                server.updateProjectIfDirty(this);
                return allFilesAreJsOrDts(this);
            };
            Project.prototype.isJsOnlyProject = function () {
                server.updateProjectIfDirty(this);
                return hasOneOrMoreJsAndNoTsFiles(this);
            };
            Project.resolveModule = function (moduleName, initialDir, host, log) {
                var resolvedPath = ts.normalizeSlashes(host.resolvePath(ts.combinePaths(initialDir, "node_modules")));
                log("Loading " + moduleName + " from " + initialDir + " (resolved to " + resolvedPath + ")");
                var result = host.require(resolvedPath, moduleName);
                if (result.error) {
                    var err = result.error.stack || result.error.message || JSON.stringify(result.error);
                    log("Failed to load module '" + moduleName + "': " + err);
                    return undefined;
                }
                return result.module;
            };
            Project.prototype.isKnownTypesPackageName = function (name) {
                return this.typingsCache.isKnownTypesPackageName(name);
            };
            Project.prototype.installPackage = function (options) {
                return this.typingsCache.installPackage(__assign({}, options, { projectName: this.projectName, projectRootPath: this.toPath(this.currentDirectory) }));
            };
            Project.prototype.inspectValue = function (options) {
                return this.typingsCache.inspectValue(options);
            };
            Object.defineProperty(Project.prototype, "typingsCache", {
                get: function () {
                    return this.projectService.typingsCache;
                },
                enumerable: true,
                configurable: true
            });
            Project.prototype.getCompilationSettings = function () {
                return this.compilerOptions;
            };
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
                return server.emptyArray;
            };
            Project.prototype.getScriptFileNames = function () {
                var _this = this;
                if (!this.rootFiles) {
                    return ts.emptyArray;
                }
                var result;
                this.rootFilesMap.forEach(function (value) {
                    if (_this.languageServiceEnabled || (isScriptInfo(value) && value.isScriptOpen())) {
                        (result || (result = [])).push(isScriptInfo(value) ? value.fileName : value);
                    }
                });
                return ts.addRange(result, this.typingFiles) || ts.emptyArray;
            };
            Project.prototype.getOrCreateScriptInfoAndAttachToProject = function (fileName) {
                var scriptInfo = this.projectService.getOrCreateScriptInfoNotOpenedByClient(fileName, this.currentDirectory, this.directoryStructureHost);
                if (scriptInfo) {
                    var existingValue = this.rootFilesMap.get(scriptInfo.path);
                    if (existingValue !== scriptInfo && existingValue !== undefined) {
                        this.rootFiles.push(scriptInfo);
                        this.rootFilesMap.set(scriptInfo.path, scriptInfo);
                    }
                    scriptInfo.attachToProject(this);
                }
                return scriptInfo;
            };
            Project.prototype.getScriptKind = function (fileName) {
                var info = this.getOrCreateScriptInfoAndAttachToProject(fileName);
                return (info && info.scriptKind);
            };
            Project.prototype.getScriptVersion = function (filename) {
                var info = this.getOrCreateScriptInfoAndAttachToProject(filename);
                return (info && info.getLatestVersion());
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
                var path = this.toPath(file);
                return !this.isWatchedMissingFile(path) && this.directoryStructureHost.fileExists(file);
            };
            Project.prototype.resolveModuleNames = function (moduleNames, containingFile, reusedNames) {
                return this.resolutionCache.resolveModuleNames(moduleNames, containingFile, reusedNames);
            };
            Project.prototype.getResolvedModuleWithFailedLookupLocationsFromCache = function (moduleName, containingFile) {
                return this.resolutionCache.getResolvedModuleWithFailedLookupLocationsFromCache(moduleName, containingFile);
            };
            Project.prototype.resolveTypeReferenceDirectives = function (typeDirectiveNames, containingFile) {
                return this.resolutionCache.resolveTypeReferenceDirectives(typeDirectiveNames, containingFile);
            };
            Project.prototype.directoryExists = function (path) {
                return this.directoryStructureHost.directoryExists(path);
            };
            Project.prototype.getDirectories = function (path) {
                return this.directoryStructureHost.getDirectories(path);
            };
            Project.prototype.getCachedDirectoryStructureHost = function () {
                return undefined;
            };
            Project.prototype.toPath = function (fileName) {
                return ts.toPath(fileName, this.currentDirectory, this.projectService.toCanonicalFileName);
            };
            Project.prototype.watchDirectoryOfFailedLookupLocation = function (directory, cb, flags) {
                return this.projectService.watchFactory.watchDirectory(this.projectService.host, directory, cb, flags, "Directory of Failed lookup locations in module resolution", this);
            };
            Project.prototype.onInvalidatedResolution = function () {
                this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(this);
            };
            Project.prototype.watchTypeRootsDirectory = function (directory, cb, flags) {
                return this.projectService.watchFactory.watchDirectory(this.projectService.host, directory, cb, flags, "Type root directory", this);
            };
            Project.prototype.onChangedAutomaticTypeDirectiveNames = function () {
                this.hasChangedAutomaticTypeDirectiveNames = true;
                this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(this);
            };
            Project.prototype.getGlobalCache = function () {
                return this.getTypeAcquisition().enable ? this.projectService.typingsInstaller.globalTypingsCacheLocation : undefined;
            };
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
            Project.prototype.getSourceMapper = function () {
                return this.getLanguageService().getSourceMapper();
            };
            Project.prototype.shouldEmitFile = function (scriptInfo) {
                return scriptInfo && !scriptInfo.isDynamicOrHasMixedContent();
            };
            Project.prototype.getCompileOnSaveAffectedFileList = function (scriptInfo) {
                var _this = this;
                if (!this.languageServiceEnabled) {
                    return [];
                }
                server.updateProjectIfDirty(this);
                this.builderState = ts.BuilderState.create(this.program, this.projectService.toCanonicalFileName, this.builderState);
                return ts.mapDefined(ts.BuilderState.getFilesAffectedBy(this.builderState, this.program, scriptInfo.path, this.cancellationToken, function (data) { return _this.projectService.host.createHash(data); }), function (sourceFile) { return _this.shouldEmitFile(_this.projectService.getScriptInfoForPath(sourceFile.path)) ? sourceFile.fileName : undefined; });
            };
            Project.prototype.emitFile = function (scriptInfo, writeFile) {
                if (!this.languageServiceEnabled || !this.shouldEmitFile(scriptInfo)) {
                    return false;
                }
                var _a = this.getLanguageService(false).getEmitOutput(scriptInfo.fileName), emitSkipped = _a.emitSkipped, outputFiles = _a.outputFiles;
                if (!emitSkipped) {
                    for (var _i = 0, outputFiles_1 = outputFiles; _i < outputFiles_1.length; _i++) {
                        var outputFile = outputFiles_1[_i];
                        var outputFileAbsoluteFileName = ts.getNormalizedAbsolutePath(outputFile.name, this.currentDirectory);
                        writeFile(outputFileAbsoluteFileName, outputFile.text, outputFile.writeByteOrderMark);
                    }
                }
                return !emitSkipped;
            };
            Project.prototype.enableLanguageService = function () {
                if (this.languageServiceEnabled || this.projectService.syntaxOnly) {
                    return;
                }
                this.languageServiceEnabled = true;
                this.lastFileExceededProgramSize = undefined;
                this.projectService.onUpdateLanguageServiceStateForProject(this, true);
            };
            Project.prototype.disableLanguageService = function (lastFileExceededProgramSize) {
                if (!this.languageServiceEnabled) {
                    return;
                }
                ts.Debug.assert(!this.projectService.syntaxOnly);
                this.languageService.cleanupSemanticCache();
                this.languageServiceEnabled = false;
                this.lastFileExceededProgramSize = lastFileExceededProgramSize;
                this.builderState = undefined;
                this.resolutionCache.closeTypeRootsWatch();
                this.projectService.onUpdateLanguageServiceStateForProject(this, false);
            };
            Project.prototype.getProjectName = function () {
                return this.projectName;
            };
            Project.prototype.removeLocalTypingsFromTypeAcquisition = function (newTypeAcquisition) {
                if (!newTypeAcquisition || !newTypeAcquisition.include) {
                    return newTypeAcquisition;
                }
                return __assign({}, newTypeAcquisition, { include: this.removeExistingTypings(newTypeAcquisition.include) });
            };
            Project.prototype.getExternalFiles = function () {
                var _this = this;
                return server.toSortedArray(ts.flatMap(this.plugins, function (plugin) {
                    if (typeof plugin.getExternalFiles !== "function")
                        return;
                    try {
                        return plugin.getExternalFiles(_this);
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
            Project.prototype.getSourceFileOrConfigFile = function (path) {
                var options = this.program.getCompilerOptions();
                return path === options.configFilePath ? options.configFile : this.getSourceFile(path);
            };
            Project.prototype.close = function () {
                var _this = this;
                if (this.program) {
                    for (var _i = 0, _a = this.program.getSourceFiles(); _i < _a.length; _i++) {
                        var f = _a[_i];
                        this.detachScriptInfoIfNotRoot(f.fileName);
                    }
                    var projectReferences = this.program.getResolvedProjectReferences();
                    if (projectReferences) {
                        for (var _b = 0, projectReferences_1 = projectReferences; _b < projectReferences_1.length; _b++) {
                            var ref = projectReferences_1[_b];
                            if (ref) {
                                this.detachScriptInfoFromProject(ref.sourceFile.fileName);
                            }
                        }
                    }
                }
                ts.forEach(this.externalFiles, function (externalFile) { return _this.detachScriptInfoIfNotRoot(externalFile); });
                for (var _c = 0, _d = this.rootFiles; _c < _d.length; _c++) {
                    var root = _d[_c];
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
                if (this.missingFilesMap) {
                    ts.clearMap(this.missingFilesMap, ts.closeFileWatcher);
                    this.missingFilesMap = undefined;
                }
                this.languageService.dispose();
                this.languageService = undefined;
            };
            Project.prototype.detachScriptInfoIfNotRoot = function (uncheckedFilename) {
                var info = this.projectService.getScriptInfo(uncheckedFilename);
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
            Project.prototype.isOrphan = function () {
                return false;
            };
            Project.prototype.getRootFiles = function () {
                return this.rootFiles && this.rootFiles.map(function (info) { return info.fileName; });
            };
            Project.prototype.getRootFilesMap = function () {
                return this.rootFilesMap;
            };
            Project.prototype.getRootScriptInfos = function () {
                return this.rootFiles;
            };
            Project.prototype.getScriptInfos = function () {
                var _this = this;
                if (!this.languageServiceEnabled) {
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
                return this.isRoot(info) || (this.program && this.program.getSourceFileByPath(info.path) !== undefined);
            };
            Project.prototype.containsFile = function (filename, requireOpen) {
                var info = this.projectService.getScriptInfoForNormalizedPath(filename);
                if (info && (info.isScriptOpen() || !requireOpen)) {
                    return this.containsScriptInfo(info);
                }
                return false;
            };
            Project.prototype.isRoot = function (info) {
                return this.rootFilesMap && this.rootFilesMap.get(info.path) === info;
            };
            Project.prototype.addRoot = function (info) {
                ts.Debug.assert(!this.isRoot(info));
                this.rootFiles.push(info);
                this.rootFilesMap.set(info.path, info);
                info.attachToProject(this);
                this.markAsDirty();
            };
            Project.prototype.addMissingFileRoot = function (fileName) {
                var path = this.projectService.toPath(fileName);
                this.rootFilesMap.set(path, fileName);
                this.markAsDirty();
            };
            Project.prototype.removeFile = function (info, fileExists, detachFromProject) {
                if (this.isRoot(info)) {
                    this.removeRoot(info);
                }
                if (fileExists) {
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
                (this.updatedFileNames || (this.updatedFileNames = ts.createMap())).set(fileName, true);
            };
            Project.prototype.markAsDirty = function () {
                if (!this.dirty) {
                    this.projectStateVersion++;
                    this.dirty = true;
                }
            };
            Project.prototype.extractUnresolvedImportsFromSourceFile = function (file, ambientModules) {
                var cached = this.cachedUnresolvedImportsPerFile.get(file.path);
                if (cached) {
                    return cached;
                }
                var unresolvedImports;
                if (file.resolvedModules) {
                    file.resolvedModules.forEach(function (resolvedModule, name) {
                        if (!resolvedModule && !ts.isExternalModuleNameRelative(name) && !isAmbientlyDeclaredModule(name)) {
                            var trimmed = name.trim();
                            var i = trimmed.indexOf("/");
                            if (i !== -1 && trimmed.charCodeAt(0) === 64) {
                                i = trimmed.indexOf("/", i + 1);
                            }
                            if (i !== -1) {
                                trimmed = trimmed.substr(0, i);
                            }
                            (unresolvedImports || (unresolvedImports = [])).push(trimmed);
                        }
                    });
                }
                this.cachedUnresolvedImportsPerFile.set(file.path, unresolvedImports || server.emptyArray);
                return unresolvedImports || server.emptyArray;
                function isAmbientlyDeclaredModule(name) {
                    return ambientModules.some(function (m) { return m === name; });
                }
            };
            Project.prototype.onFileAddedOrRemoved = function () {
                this.hasAddedorRemovedFiles = true;
            };
            Project.prototype.updateGraph = function () {
                var _a;
                this.resolutionCache.startRecordingFilesWithChangedResolutions();
                var hasNewProgram = this.updateGraphWorker();
                var hasAddedorRemovedFiles = this.hasAddedorRemovedFiles;
                this.hasAddedorRemovedFiles = false;
                var changedFiles = this.resolutionCache.finishRecordingFilesWithChangedResolutions() || server.emptyArray;
                for (var _i = 0, changedFiles_1 = changedFiles; _i < changedFiles_1.length; _i++) {
                    var file = changedFiles_1[_i];
                    this.cachedUnresolvedImportsPerFile.delete(file);
                }
                if (this.languageServiceEnabled) {
                    if (hasNewProgram || changedFiles.length) {
                        var result = void 0;
                        var ambientModules = this.program.getTypeChecker().getAmbientModules().map(function (mod) { return ts.stripQuotes(mod.getName()); });
                        for (var _b = 0, _c = this.program.getSourceFiles(); _b < _c.length; _b++) {
                            var sourceFile = _c[_b];
                            var unResolved = this.extractUnresolvedImportsFromSourceFile(sourceFile, ambientModules);
                            if (unResolved !== server.emptyArray) {
                                (_a = (result || (result = []))).push.apply(_a, unResolved);
                            }
                        }
                        this.lastCachedUnresolvedImportsList = result ? server.toDeduplicatedSortedArray(result) : server.emptyArray;
                    }
                    this.projectService.typingsCache.enqueueInstallTypingsForProject(this, this.lastCachedUnresolvedImportsList, hasAddedorRemovedFiles);
                }
                else {
                    this.lastCachedUnresolvedImportsList = undefined;
                }
                if (hasNewProgram) {
                    this.projectProgramVersion++;
                }
                return !hasNewProgram;
            };
            Project.prototype.updateTypingFiles = function (typingFiles) {
                var _this = this;
                ts.enumerateInsertsAndDeletes(typingFiles, this.typingFiles, ts.getStringComparer(!this.useCaseSensitiveFileNames()), ts.noop, function (removed) { return _this.detachScriptInfoFromProject(removed); });
                this.typingFiles = typingFiles;
                this.resolutionCache.setFilesWithInvalidatedNonRelativeUnresolvedImports(this.cachedUnresolvedImportsPerFile);
            };
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
                this.program = this.languageService.getProgram();
                this.dirty = false;
                this.resolutionCache.finishCachingPerDirectoryResolution();
                ts.Debug.assert(oldProgram === undefined || this.program !== undefined);
                var hasNewProgram = this.program && (!oldProgram || (this.program !== oldProgram && !(oldProgram.structureIsReused & 2)));
                this.hasChangedAutomaticTypeDirectiveNames = false;
                if (hasNewProgram) {
                    if (oldProgram) {
                        for (var _i = 0, _a = oldProgram.getSourceFiles(); _i < _a.length; _i++) {
                            var f = _a[_i];
                            if (this.program.getSourceFileByPath(f.path)) {
                                continue;
                            }
                            this.detachScriptInfoFromProject(f.fileName);
                        }
                    }
                    ts.updateMissingFilePathsWatch(this.program, this.missingFilesMap || (this.missingFilesMap = ts.createMap()), function (missingFilePath) { return _this.addMissingFileWatcher(missingFilePath); });
                    if (this.languageServiceEnabled) {
                        this.resolutionCache.updateTypeRootsWatch();
                    }
                }
                var oldExternalFiles = this.externalFiles || server.emptyArray;
                this.externalFiles = this.getExternalFiles();
                ts.enumerateInsertsAndDeletes(this.externalFiles, oldExternalFiles, ts.getStringComparer(!this.useCaseSensitiveFileNames()), function (inserted) {
                    var scriptInfo = _this.projectService.getOrCreateScriptInfoNotOpenedByClient(inserted, _this.currentDirectory, _this.directoryStructureHost);
                    scriptInfo.attachToProject(_this);
                }, function (removed) { return _this.detachScriptInfoFromProject(removed); });
                var elapsed = ts.timestamp() - start;
                this.writeLog("Finishing updateGraphWorker: Project: " + this.getProjectName() + " Version: " + this.getProjectVersion() + " structureChanged: " + hasNewProgram + " Elapsed: " + elapsed + "ms");
                return hasNewProgram;
            };
            Project.prototype.detachScriptInfoFromProject = function (uncheckedFileName) {
                var scriptInfoToDetach = this.projectService.getScriptInfo(uncheckedFileName);
                if (scriptInfoToDetach) {
                    scriptInfoToDetach.detachFromProject(this);
                    this.resolutionCache.removeResolutionsOfFile(scriptInfoToDetach.path);
                }
            };
            Project.prototype.addMissingFileWatcher = function (missingFilePath) {
                var _this = this;
                var fileWatcher = this.projectService.watchFactory.watchFile(this.projectService.host, missingFilePath, function (fileName, eventKind) {
                    if (_this.projectKind === ProjectKind.Configured) {
                        _this.getCachedDirectoryStructureHost().addOrDeleteFile(fileName, missingFilePath, eventKind);
                    }
                    if (eventKind === ts.FileWatcherEventKind.Created && _this.missingFilesMap.has(missingFilePath)) {
                        _this.missingFilesMap.delete(missingFilePath);
                        fileWatcher.close();
                        _this.projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(_this);
                    }
                }, ts.PollingInterval.Medium, "Missing file from program", this);
                return fileWatcher;
            };
            Project.prototype.isWatchedMissingFile = function (path) {
                return this.missingFilesMap && this.missingFilesMap.has(path);
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
                if (!this.program) {
                    return "\tFiles (0)\n";
                }
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
            Project.prototype.setCompilerOptions = function (compilerOptions) {
                if (compilerOptions) {
                    compilerOptions.allowNonTsExtensions = true;
                    var oldOptions = this.compilerOptions;
                    this.compilerOptions = compilerOptions;
                    this.setInternalCompilerOptionsForEmittingJsFiles();
                    if (ts.changesAffectModuleResolution(oldOptions, compilerOptions)) {
                        this.cachedUnresolvedImportsPerFile.clear();
                        this.lastCachedUnresolvedImportsList = undefined;
                        this.resolutionCache.clear();
                    }
                    this.markAsDirty();
                }
            };
            Project.prototype.getChangesSinceVersion = function (lastKnownVersion) {
                if (!this.isInitialLoadPending()) {
                    server.updateProjectIfDirty(this);
                }
                var info = {
                    projectName: this.getProjectName(),
                    version: this.projectProgramVersion,
                    isInferred: this.projectKind === ProjectKind.Inferred,
                    options: this.getCompilationSettings(),
                    languageServiceDisabled: !this.languageServiceEnabled,
                    lastFileExceededProgramSize: this.lastFileExceededProgramSize
                };
                var updatedFileNames = this.updatedFileNames;
                this.updatedFileNames = undefined;
                if (this.lastReportedFileNames && lastKnownVersion === this.lastReportedVersion) {
                    if (this.projectProgramVersion === this.lastReportedVersion && !updatedFileNames) {
                        return { info: info, projectErrors: this.getGlobalProjectErrors() };
                    }
                    var lastReportedFileNames_1 = this.lastReportedFileNames;
                    var externalFiles = this.getExternalFiles().map(function (f) { return server.toNormalizedPath(f); });
                    var currentFiles_1 = ts.arrayToSet(this.getFileNames().concat(externalFiles));
                    var added_1 = [];
                    var removed_1 = [];
                    var updated = updatedFileNames ? ts.arrayFrom(updatedFileNames.keys()) : [];
                    ts.forEachKey(currentFiles_1, function (id) {
                        if (!lastReportedFileNames_1.has(id)) {
                            added_1.push(id);
                        }
                    });
                    ts.forEachKey(lastReportedFileNames_1, function (id) {
                        if (!currentFiles_1.has(id)) {
                            removed_1.push(id);
                        }
                    });
                    this.lastReportedFileNames = currentFiles_1;
                    this.lastReportedVersion = this.projectProgramVersion;
                    return { info: info, changes: { added: added_1, removed: removed_1, updated: updated }, projectErrors: this.getGlobalProjectErrors() };
                }
                else {
                    var projectFileNames = this.getFileNames();
                    var externalFiles = this.getExternalFiles().map(function (f) { return server.toNormalizedPath(f); });
                    var allFiles = projectFileNames.concat(externalFiles);
                    this.lastReportedFileNames = ts.arrayToSet(allFiles);
                    this.lastReportedVersion = this.projectProgramVersion;
                    return { info: info, files: allFiles, projectErrors: this.getGlobalProjectErrors() };
                }
            };
            Project.prototype.removeRoot = function (info) {
                ts.orderedRemoveItem(this.rootFiles, info);
                this.rootFilesMap.delete(info.path);
            };
            Project.prototype.enableGlobalPlugins = function (options) {
                var host = this.projectService.host;
                if (!host.require) {
                    this.projectService.logger.info("Plugins were requested but not running in environment that supports 'require'. Nothing will be loaded");
                    return;
                }
                var searchPaths = [ts.combinePaths(this.projectService.getExecutingFilePath(), "../../..")].concat(this.projectService.pluginProbeLocations);
                if (this.projectService.globalPlugins) {
                    var _loop_1 = function (globalPluginName) {
                        if (!globalPluginName)
                            return "continue";
                        if (options.plugins && options.plugins.some(function (p) { return p.name === globalPluginName; }))
                            return "continue";
                        this_1.projectService.logger.info("Loading global plugin " + globalPluginName);
                        this_1.enablePlugin({ name: globalPluginName, global: true }, searchPaths);
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = this.projectService.globalPlugins; _i < _a.length; _i++) {
                        var globalPluginName = _a[_i];
                        _loop_1(globalPluginName);
                    }
                }
            };
            Project.prototype.enablePlugin = function (pluginConfigEntry, searchPaths) {
                var _this = this;
                this.projectService.logger.info("Enabling plugin " + pluginConfigEntry.name + " from candidate paths: " + searchPaths.join(","));
                var log = function (message) {
                    _this.projectService.logger.info(message);
                };
                var resolvedModule = ts.firstDefined(searchPaths, function (searchPath) {
                    return Project.resolveModule(pluginConfigEntry.name, searchPath, _this.projectService.host, log);
                });
                if (resolvedModule) {
                    this.enableProxy(resolvedModule, pluginConfigEntry);
                }
                else {
                    this.projectService.logger.info("Couldn't find " + pluginConfigEntry.name);
                }
            };
            Project.prototype.refreshDiagnostics = function () {
                this.projectService.sendProjectsUpdatedInBackgroundEvent();
            };
            Project.prototype.enableProxy = function (pluginModuleFactory, configEntry) {
                try {
                    if (typeof pluginModuleFactory !== "function") {
                        this.projectService.logger.info("Skipped loading plugin " + configEntry.name + " because it did expose a proper factory function");
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
                        if (!(k in newLS)) {
                            this.projectService.logger.info("Plugin activation warning: Missing proxied method " + k + " in created LS. Patching.");
                            newLS[k] = this.languageService[k];
                        }
                    }
                    this.projectService.logger.info("Plugin validation succeded");
                    this.languageService = newLS;
                    this.plugins.push(pluginModule);
                }
                catch (e) {
                    this.projectService.logger.info("Plugin activation failed: " + e);
                }
            };
            return Project;
        }());
        server.Project = Project;
        var InferredProject = (function (_super) {
            __extends(InferredProject, _super);
            function InferredProject(projectService, documentRegistry, compilerOptions, projectRootPath, currentDirectory) {
                var _this = _super.call(this, InferredProject.newName(), ProjectKind.Inferred, projectService, documentRegistry, undefined, undefined, compilerOptions, false, projectService.host, currentDirectory) || this;
                _this._isJsInferredProject = false;
                _this.projectRootPath = projectRootPath && projectService.toCanonicalFileName(projectRootPath);
                if (!projectRootPath && !projectService.useSingleInferredProject) {
                    _this.canonicalCurrentDirectory = projectService.toCanonicalFileName(_this.currentDirectory);
                }
                _this.enableGlobalPlugins(_this.getCompilerOptions());
                return _this;
            }
            InferredProject.prototype.toggleJsInferredProject = function (isJsInferredProject) {
                if (isJsInferredProject !== this._isJsInferredProject) {
                    this._isJsInferredProject = isJsInferredProject;
                    this.setCompilerOptions();
                }
            };
            InferredProject.prototype.setCompilerOptions = function (options) {
                var newOptions = options ? ts.cloneCompilerOptions(options) : this.getCompilationSettings();
                if (!newOptions) {
                    return;
                }
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
                    this.toggleJsInferredProject(true);
                }
                _super.prototype.addRoot.call(this, info);
            };
            InferredProject.prototype.removeRoot = function (info) {
                this.projectService.stopWatchingConfigFilesForInferredProjectRoot(info);
                _super.prototype.removeRoot.call(this, info);
                if (this._isJsInferredProject && info.isJavaScript()) {
                    if (ts.every(this.getRootScriptInfos(), function (rootInfo) { return !rootInfo.isJavaScript(); })) {
                        this.toggleJsInferredProject(false);
                    }
                }
            };
            InferredProject.prototype.isOrphan = function () {
                return !this.hasRoots();
            };
            InferredProject.prototype.isProjectWithSingleRoot = function () {
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
                    include: [],
                    exclude: []
                };
            };
            InferredProject.newName = (function () {
                var nextId = 1;
                return function () {
                    var id = nextId;
                    nextId++;
                    return server.makeInferredProjectName(id);
                };
            })();
            return InferredProject;
        }(Project));
        server.InferredProject = InferredProject;
        var ConfiguredProject = (function (_super) {
            __extends(ConfiguredProject, _super);
            function ConfiguredProject(configFileName, projectService, documentRegistry, cachedDirectoryStructureHost) {
                var _this = _super.call(this, configFileName, ProjectKind.Configured, projectService, documentRegistry, false, undefined, {}, false, cachedDirectoryStructureHost, ts.getDirectoryPath(configFileName)) || this;
                _this.externalProjectRefCount = 0;
                _this.isInitialLoadPending = ts.returnTrue;
                _this.canonicalConfigFilePath = server.asNormalizedPath(projectService.toCanonicalFileName(configFileName));
                return _this;
            }
            ConfiguredProject.prototype.updateGraph = function () {
                this.isInitialLoadPending = ts.returnFalse;
                var reloadLevel = this.pendingReload;
                this.pendingReload = ts.ConfigFileProgramReloadLevel.None;
                var result;
                switch (reloadLevel) {
                    case ts.ConfigFileProgramReloadLevel.Partial:
                        result = this.projectService.reloadFileNamesOfConfiguredProject(this);
                        break;
                    case ts.ConfigFileProgramReloadLevel.Full:
                        this.projectService.reloadConfiguredProject(this);
                        result = true;
                        break;
                    default:
                        result = _super.prototype.updateGraph.call(this);
                }
                this.projectService.sendProjectTelemetry(this);
                this.projectService.sendSurveyReady(this);
                return result;
            };
            ConfiguredProject.prototype.getCachedDirectoryStructureHost = function () {
                return this.directoryStructureHost;
            };
            ConfiguredProject.prototype.getConfigFilePath = function () {
                return server.asNormalizedPath(this.getProjectName());
            };
            ConfiguredProject.prototype.getProjectReferences = function () {
                return this.projectReferences || server.emptyArray;
            };
            ConfiguredProject.prototype.updateReferences = function (refs) {
                this.projectReferences = refs;
            };
            ConfiguredProject.prototype.getResolvedProjectReferences = function () {
                var program = this.getCurrentProgram();
                return program && program.getResolvedProjectReferences();
            };
            ConfiguredProject.prototype.enablePlugins = function () {
                this.enablePluginsWithOptions(this.getCompilerOptions());
            };
            ConfiguredProject.prototype.enablePluginsWithOptions = function (options) {
                var host = this.projectService.host;
                if (!host.require) {
                    this.projectService.logger.info("Plugins were requested but not running in environment that supports 'require'. Nothing will be loaded");
                    return;
                }
                var searchPaths = [ts.combinePaths(this.projectService.getExecutingFilePath(), "../../..")].concat(this.projectService.pluginProbeLocations);
                if (this.projectService.allowLocalPluginLoads) {
                    var local = ts.getDirectoryPath(this.canonicalConfigFilePath);
                    this.projectService.logger.info("Local plugin loading enabled; adding " + local + " to search paths");
                    searchPaths.unshift(local);
                }
                if (options.plugins) {
                    for (var _i = 0, _a = options.plugins; _i < _a.length; _i++) {
                        var pluginConfigEntry = _a[_i];
                        this.enablePlugin(pluginConfigEntry, searchPaths);
                    }
                }
                this.enableGlobalPlugins(options);
            };
            ConfiguredProject.prototype.getGlobalProjectErrors = function () {
                return ts.filter(this.projectErrors, function (diagnostic) { return !diagnostic.file; }) || server.emptyArray;
            };
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
                return this.typeAcquisition;
            };
            ConfiguredProject.prototype.watchWildcards = function (wildcardDirectories) {
                var _this = this;
                ts.updateWatchingWildcardDirectories(this.directoriesWatchedForWildcards || (this.directoriesWatchedForWildcards = ts.createMap()), wildcardDirectories, function (directory, flags) { return _this.projectService.watchWildcardDirectory(directory, flags, _this); });
            };
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
                _super.prototype.close.call(this);
            };
            ConfiguredProject.prototype.addExternalProjectReference = function () {
                this.externalProjectRefCount++;
            };
            ConfiguredProject.prototype.deleteExternalProjectReference = function () {
                this.externalProjectRefCount--;
            };
            ConfiguredProject.prototype.hasOpenRef = function () {
                var _this = this;
                if (!!this.externalProjectRefCount) {
                    return true;
                }
                if (this.isClosed()) {
                    return false;
                }
                var configFileExistenceInfo = this.projectService.getConfigFileExistenceInfo(this);
                if (this.projectService.hasPendingProjectUpdate(this)) {
                    return !!configFileExistenceInfo.openFilesImpactedByConfigFile.size;
                }
                return ts.forEachEntry(configFileExistenceInfo.openFilesImpactedByConfigFile, function (_value, infoPath) { return _this.containsScriptInfo(_this.projectService.getScriptInfoForPath(infoPath)); }) || false;
            };
            ConfiguredProject.prototype.hasExternalProjectRef = function () {
                return !!this.externalProjectRefCount;
            };
            ConfiguredProject.prototype.getEffectiveTypeRoots = function () {
                return ts.getEffectiveTypeRoots(this.getCompilationSettings(), this.directoryStructureHost) || [];
            };
            ConfiguredProject.prototype.updateErrorOnNoInputFiles = function (hasFileNames) {
                if (hasFileNames) {
                    ts.filterMutate(this.projectErrors, function (error) { return !ts.isErrorNoInputFiles(error); });
                }
                else if (!this.configFileSpecs.filesSpecs && !ts.some(this.projectErrors, ts.isErrorNoInputFiles)) {
                    this.projectErrors.push(ts.getErrorForNoInputFiles(this.configFileSpecs, this.getConfigFilePath()));
                }
            };
            return ConfiguredProject;
        }(Project));
        server.ConfiguredProject = ConfiguredProject;
        var ExternalProject = (function (_super) {
            __extends(ExternalProject, _super);
            function ExternalProject(externalProjectName, projectService, documentRegistry, compilerOptions, lastFileExceededProgramSize, compileOnSaveEnabled, projectFilePath) {
                var _this = _super.call(this, externalProjectName, ProjectKind.External, projectService, documentRegistry, true, lastFileExceededProgramSize, compilerOptions, compileOnSaveEnabled, projectService.host, ts.getDirectoryPath(projectFilePath || ts.normalizeSlashes(externalProjectName))) || this;
                _this.externalProjectName = externalProjectName;
                _this.compileOnSaveEnabled = compileOnSaveEnabled;
                _this.excludedFiles = [];
                return _this;
            }
            ExternalProject.prototype.updateGraph = function () {
                var result = _super.prototype.updateGraph.call(this);
                this.projectService.sendProjectTelemetry(this);
                this.projectService.sendSurveyReady(this);
                return result;
            };
            ExternalProject.prototype.getExcludedFiles = function () {
                return this.excludedFiles;
            };
            ExternalProject.prototype.getTypeAcquisition = function () {
                return this.typeAcquisition;
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
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
var ts;
(function (ts) {
    var server;
    (function (server) {
        server.maxProgramSizeForNonTsFiles = 20 * 1024 * 1024;
        server.maxFileSize = 4 * 1024 * 1024;
        server.ProjectsUpdatedInBackgroundEvent = "projectsUpdatedInBackground";
        server.SurveyReady = "surveyReady";
        server.LargeFileReferencedEvent = "largeFileReferenced";
        server.ConfigFileDiagEvent = "configFileDiag";
        server.ProjectLanguageServiceStateEvent = "projectLanguageServiceState";
        server.ProjectInfoTelemetryEvent = "projectInfo";
        server.OpenFileInfoTelemetryEvent = "openFileInfo";
        function prepareConvertersForEnumLikeCompilerOptions(commandLineOptions) {
            var map = ts.createMap();
            for (var _i = 0, commandLineOptions_1 = commandLineOptions; _i < commandLineOptions_1.length; _i++) {
                var option = commandLineOptions_1[_i];
                if (typeof option.type === "object") {
                    var optionMap = option.type;
                    optionMap.forEach(function (value) {
                        ts.Debug.assert(typeof value === "number");
                    });
                    map.set(option.name, optionMap);
                }
            }
            return map;
        }
        var compilerOptionConverters = prepareConvertersForEnumLikeCompilerOptions(ts.optionDeclarations);
        var indentStyle = ts.createMapFromTemplate({
            none: ts.IndentStyle.None,
            block: ts.IndentStyle.Block,
            smart: ts.IndentStyle.Smart
        });
        var defaultTypeSafeList = {
            "jquery": {
                match: /jquery(-(\.?\d+)+)?(\.intellisense)?(\.min)?\.js$/i,
                types: ["jquery"]
            },
            "WinJS": {
                match: /^(.*\/winjs-[.\d]+)\/js\/base\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["winjs"]
            },
            "Kendo": {
                match: /^(.*\/kendo(-ui)?)\/kendo\.all(\.min)?\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["kendo-ui"]
            },
            "Office Nuget": {
                match: /^(.*\/office\/1)\/excel-\d+\.debug\.js$/i,
                exclude: [["^", 1, "/.*"]],
                types: ["office"]
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
        function tryConvertScriptKindName(scriptKindName) {
            return ts.isString(scriptKindName) ? convertScriptKindName(scriptKindName) : scriptKindName;
        }
        server.tryConvertScriptKindName = tryConvertScriptKindName;
        function convertScriptKindName(scriptKindName) {
            switch (scriptKindName) {
                case "JS":
                    return 1;
                case "JSX":
                    return 2;
                case "TS":
                    return 3;
                case "TSX":
                    return 4;
                default:
                    return 0;
            }
        }
        server.convertScriptKindName = convertScriptKindName;
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
                return result;
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
        var WatchType;
        (function (WatchType) {
            WatchType["ConfigFilePath"] = "Config file for the program";
            WatchType["MissingFilePath"] = "Missing file from program";
            WatchType["WildcardDirectories"] = "Wild card directory";
            WatchType["ClosedScriptInfo"] = "Closed Script info";
            WatchType["ConfigFileForInferredRoot"] = "Config file for the inferred project root";
            WatchType["FailedLookupLocation"] = "Directory of Failed lookup locations in module resolution";
            WatchType["TypeRoots"] = "Type root directory";
            WatchType["NodeModulesForClosedScriptInfo"] = "node_modules for closed script infos in them";
        })(WatchType = server.WatchType || (server.WatchType = {}));
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
        function isOpenScriptInfo(infoOrFileName) {
            return !!infoOrFileName.containingProjects;
        }
        function getDetailWatchInfo(watchType, project) {
            return "Project: " + (project ? project.getProjectName() : "") + " WatchType: " + watchType;
        }
        function isScriptInfoWatchedFromNodeModules(info) {
            return !info.isScriptOpen() && info.mTime !== undefined;
        }
        function updateProjectIfDirty(project) {
            return project.dirty && project.updateGraph();
        }
        server.updateProjectIfDirty = updateProjectIfDirty;
        function setProjectOptionsUsed(project) {
            if (project.projectKind === server.ProjectKind.Configured) {
                project.projectOptions = true;
            }
        }
        var ProjectService = (function () {
            function ProjectService(opts) {
                var _this = this;
                this.filenameToScriptInfo = ts.createMap();
                this.scriptInfoInNodeModulesWatchers = ts.createMap();
                this.filenameToScriptInfoVersion = ts.createMap();
                this.allJsFilesForOpenFileTelemetry = ts.createMap();
                this.externalProjectToConfiguredProjectMap = ts.createMap();
                this.externalProjects = [];
                this.inferredProjects = [];
                this.configuredProjects = ts.createMap();
                this.openFiles = ts.createMap();
                this.openFilesWithNonRootedDiskPath = ts.createMap();
                this.compilerOptionsForInferredProjectsPerProjectRoot = ts.createMap();
                this.projectToSizeMap = ts.createMap();
                this.configFileExistenceInfoCache = ts.createMap();
                this.safelist = defaultTypeSafeList;
                this.legacySafelist = {};
                this.pendingProjectUpdates = ts.createMap();
                this.seenProjects = ts.createMap();
                this.seenSurveyProjects = ts.createMap();
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
                this.syntaxOnly = opts.syntaxOnly;
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
                    formatCodeOptions: server.getDefaultFormatCodeSettings(this.host),
                    preferences: ts.emptyOptions,
                    hostInfo: "Unknown host",
                    extraFileExtensions: []
                };
                this.documentRegistry = ts.createDocumentRegistryInternal(this.host.useCaseSensitiveFileNames, this.currentDirectory, this);
                var watchLogLevel = this.logger.hasLevel(server.LogLevel.verbose) ? ts.WatchLogLevel.Verbose :
                    this.logger.loggingEnabled() ? ts.WatchLogLevel.TriggerOnly : ts.WatchLogLevel.None;
                var log = watchLogLevel !== ts.WatchLogLevel.None ? (function (s) { return _this.logger.info(s); }) : ts.noop;
                this.watchFactory = ts.getWatchFactory(watchLogLevel, log, getDetailWatchInfo);
            }
            ProjectService.prototype.toPath = function (fileName) {
                return ts.toPath(fileName, this.currentDirectory, this.toCanonicalFileName);
            };
            ProjectService.prototype.getExecutingFilePath = function () {
                return this.getNormalizedAbsolutePath(this.host.getExecutingFilePath());
            };
            ProjectService.prototype.getNormalizedAbsolutePath = function (fileName) {
                return ts.getNormalizedAbsolutePath(fileName, this.host.getCurrentDirectory());
            };
            ProjectService.prototype.setDocument = function (key, path, sourceFile) {
                var info = ts.Debug.assertDefined(this.getScriptInfoForPath(path));
                info.cacheSourceFile = { key: key, sourceFile: sourceFile };
            };
            ProjectService.prototype.getDocument = function (key, path) {
                var info = this.getScriptInfoForPath(path);
                return info && info.cacheSourceFile && info.cacheSourceFile.key === key ? info.cacheSourceFile.sourceFile : undefined;
            };
            ProjectService.prototype.ensureInferredProjectsUpToDate_TestOnly = function () {
                this.ensureProjectStructuresUptoDate();
            };
            ProjectService.prototype.getCompilerOptionsForInferredProjects = function () {
                return this.compilerOptionsForInferredProjects;
            };
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
                    var fileContent = this.host.readFile(this.typesMapLocation);
                    if (fileContent === undefined) {
                        this.logger.info("Provided types map file \"" + this.typesMapLocation + "\" doesn't exist");
                        return;
                    }
                    var raw = JSON.parse(fileContent);
                    for (var _i = 0, _a = Object.keys(raw.typesMap); _i < _a.length; _i++) {
                        var k = _a[_i];
                        raw.typesMap[k].match = new RegExp(raw.typesMap[k].match, "i");
                    }
                    this.safelist = raw.typesMap;
                    for (var key in raw.simpleMap) {
                        if (raw.simpleMap.hasOwnProperty(key)) {
                            this.legacySafelist[key] = raw.simpleMap[key].toLowerCase();
                        }
                    }
                }
                catch (e) {
                    this.logger.info("Error loading types map: " + e);
                    this.safelist = defaultTypeSafeList;
                    this.legacySafelist = {};
                }
            };
            ProjectService.prototype.updateTypingsForProject = function (response) {
                var project = this.findProject(response.projectName);
                if (!project) {
                    return;
                }
                switch (response.kind) {
                    case server.ActionSet:
                        project.updateTypingFiles(this.typingsCache.updateTypingsForProject(response.projectName, response.compilerOptions, response.typeAcquisition, response.unresolvedImports, response.typings));
                        break;
                    case server.ActionInvalidate:
                        this.typingsCache.enqueueInstallTypingsForProject(project, project.lastCachedUnresolvedImportsList, true);
                        return;
                }
                this.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project);
            };
            ProjectService.prototype.delayEnsureProjectForOpenFiles = function () {
                var _this = this;
                this.pendingEnsureProjectForOpenFiles = true;
                this.throttledOperations.schedule("*ensureProjectForOpenFiles*", 250, function () {
                    if (_this.pendingProjectUpdates.size !== 0) {
                        _this.delayEnsureProjectForOpenFiles();
                    }
                    else {
                        if (_this.pendingEnsureProjectForOpenFiles) {
                            _this.ensureProjectForOpenFiles();
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
                this.throttledOperations.schedule(projectName, 250, function () {
                    if (_this.pendingProjectUpdates.delete(projectName)) {
                        updateProjectIfDirty(project);
                    }
                });
            };
            ProjectService.prototype.hasPendingProjectUpdate = function (project) {
                return this.pendingProjectUpdates.has(project.getProjectName());
            };
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
            ProjectService.prototype.sendSurveyReadyEvent = function (surveyId) {
                if (!this.eventHandler) {
                    return;
                }
                this.eventHandler({ eventName: server.SurveyReady, data: { surveyId: surveyId } });
            };
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
            ProjectService.prototype.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles = function (project) {
                this.delayUpdateProjectGraph(project);
                this.delayEnsureProjectForOpenFiles();
            };
            ProjectService.prototype.delayUpdateProjectGraphs = function (projects) {
                if (projects.length) {
                    for (var _i = 0, projects_2 = projects; _i < projects_2.length; _i++) {
                        var project = projects_2[_i];
                        this.delayUpdateProjectGraph(project);
                    }
                    this.delayEnsureProjectForOpenFiles();
                }
            };
            ProjectService.prototype.setCompilerOptionsForInferredProjects = function (projectCompilerOptions, projectRootPath) {
                ts.Debug.assert(projectRootPath === undefined || this.useInferredProjectPerProjectRoot, "Setting compiler options per project root path is only supported when useInferredProjectPerProjectRoot is enabled");
                var compilerOptions = convertCompilerOptions(projectCompilerOptions);
                compilerOptions.allowNonTsExtensions = true;
                var canonicalProjectRootPath = projectRootPath && this.toCanonicalFileName(projectRootPath);
                if (canonicalProjectRootPath) {
                    this.compilerOptionsForInferredProjectsPerProjectRoot.set(canonicalProjectRootPath, compilerOptions);
                }
                else {
                    this.compilerOptionsForInferredProjects = compilerOptions;
                }
                for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                    var project = _a[_i];
                    if (canonicalProjectRootPath ?
                        project.projectRootPath === canonicalProjectRootPath :
                        !project.projectRootPath || !this.compilerOptionsForInferredProjectsPerProjectRoot.has(project.projectRootPath)) {
                        project.setCompilerOptions(compilerOptions);
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
            ProjectService.prototype.forEachProject = function (cb) {
                this.inferredProjects.forEach(cb);
                this.configuredProjects.forEach(cb);
                this.externalProjects.forEach(cb);
            };
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
            ProjectService.prototype.tryGetDefaultProjectForFile = function (fileName) {
                var scriptInfo = this.getScriptInfoForNormalizedPath(fileName);
                return scriptInfo && !scriptInfo.isOrphan() ? scriptInfo.getDefaultProject() : undefined;
            };
            ProjectService.prototype.ensureDefaultProjectForFile = function (fileName) {
                return this.tryGetDefaultProjectForFile(fileName) || this.doEnsureDefaultProjectForFile(fileName);
            };
            ProjectService.prototype.doEnsureDefaultProjectForFile = function (fileName) {
                this.ensureProjectStructuresUptoDate();
                var scriptInfo = this.getScriptInfoForNormalizedPath(fileName);
                return scriptInfo ? scriptInfo.getDefaultProject() : server.Errors.ThrowNoProject();
            };
            ProjectService.prototype.getScriptInfoEnsuringProjectsUptoDate = function (uncheckedFileName) {
                this.ensureProjectStructuresUptoDate();
                return this.getScriptInfo(uncheckedFileName);
            };
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
                return info && info.getPreferences() || this.hostConfiguration.preferences;
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
                else if (eventKind === ts.FileWatcherEventKind.Deleted) {
                    this.handleDeletedFile(info);
                }
                else if (!info.isScriptOpen()) {
                    info.delayReloadNonMixedContentFile();
                    this.delayUpdateProjectGraphs(info.containingProjects);
                }
            };
            ProjectService.prototype.handleDeletedFile = function (info) {
                this.stopWatchingScriptInfo(info);
                if (!info.isScriptOpen()) {
                    this.deleteScriptInfo(info);
                    var containingProjects = info.containingProjects.slice();
                    info.detachAllProjects();
                    this.delayUpdateProjectGraphs(containingProjects);
                }
            };
            ProjectService.prototype.watchWildcardDirectory = function (directory, flags, project) {
                var _this = this;
                return this.watchFactory.watchDirectory(this.host, directory, function (fileOrDirectory) {
                    var fileOrDirectoryPath = _this.toPath(fileOrDirectory);
                    project.getCachedDirectoryStructureHost().addOrDeleteFileOrDirectory(fileOrDirectory, fileOrDirectoryPath);
                    var configFilename = project.getConfigFilePath();
                    if (fileOrDirectoryPath !== directory && ts.hasExtension(fileOrDirectoryPath) && !ts.isSupportedSourceFileName(fileOrDirectory, project.getCompilationSettings(), _this.hostConfiguration.extraFileExtensions)) {
                        _this.logger.info("Project: " + configFilename + " Detected file add/remove of non supported extension: " + fileOrDirectory);
                        return;
                    }
                    if (project.pendingReload !== ts.ConfigFileProgramReloadLevel.Full) {
                        project.pendingReload = ts.ConfigFileProgramReloadLevel.Partial;
                        _this.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project);
                    }
                }, flags, "Wild card directory", project);
            };
            ProjectService.prototype.getConfigFileExistenceInfo = function (project) {
                return this.configFileExistenceInfoCache.get(project.canonicalConfigFilePath);
            };
            ProjectService.prototype.onConfigChangedForConfiguredProject = function (project, eventKind) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(project);
                if (eventKind === ts.FileWatcherEventKind.Deleted) {
                    configFileExistenceInfo.exists = false;
                    this.removeProject(project);
                    this.logConfigFileWatchUpdate(project.getConfigFilePath(), project.canonicalConfigFilePath, configFileExistenceInfo, "Reloading configured projects for files");
                    this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, false);
                }
                else {
                    this.logConfigFileWatchUpdate(project.getConfigFilePath(), project.canonicalConfigFilePath, configFileExistenceInfo, "Reloading configured projects for only inferred root files");
                    project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                    this.delayUpdateProjectGraph(project);
                    this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, true);
                }
            };
            ProjectService.prototype.onConfigFileChangeForOpenScriptInfo = function (configFileName, eventKind) {
                var canonicalConfigPath = server.normalizedPathToPath(configFileName, this.currentDirectory, this.toCanonicalFileName);
                var configFileExistenceInfo = this.configFileExistenceInfoCache.get(canonicalConfigPath);
                configFileExistenceInfo.exists = (eventKind !== ts.FileWatcherEventKind.Deleted);
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigPath, configFileExistenceInfo, "Reloading configured projects for files");
                this.delayReloadConfiguredProjectForFiles(configFileExistenceInfo, false);
            };
            ProjectService.prototype.removeProject = function (project) {
                this.logger.info("remove project: " + project.getRootFiles().toString());
                project.close();
                if (ts.Debug.shouldAssert(1)) {
                    this.filenameToScriptInfo.forEach(function (info) { return ts.Debug.assert(!info.isAttached(project)); });
                }
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
            ProjectService.prototype.assignOrphanScriptInfoToInferredProject = function (info, projectRootPath) {
                ts.Debug.assert(info.isOrphan());
                var project = this.getOrCreateInferredProjectForProjectRootPathIfEnabled(info, projectRootPath) ||
                    this.getOrCreateSingleInferredProjectIfEnabled() ||
                    this.getOrCreateSingleInferredWithoutProjectRoot(info.isDynamic ? this.currentDirectory : ts.getDirectoryPath(info.path));
                project.addRoot(info);
                if (info.containingProjects[0] !== project) {
                    info.detachFromProject(project);
                    info.containingProjects.unshift(project);
                }
                project.updateGraph();
                if (!this.useSingleInferredProject && !project.projectRootPath) {
                    var _loop_2 = function (inferredProject) {
                        if (inferredProject === project || inferredProject.isOrphan()) {
                            return "continue";
                        }
                        var roots = inferredProject.getRootScriptInfos();
                        ts.Debug.assert(roots.length === 1 || !!inferredProject.projectRootPath);
                        if (roots.length === 1 && ts.forEach(roots[0].containingProjects, function (p) { return p !== roots[0].containingProjects[0] && !p.isOrphan(); })) {
                            inferredProject.removeFile(roots[0], true, true);
                        }
                    };
                    for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                        var inferredProject = _a[_i];
                        _loop_2(inferredProject);
                    }
                }
                return project;
            };
            ProjectService.prototype.closeOpenFile = function (info) {
                var _this = this;
                var fileExists = this.host.fileExists(info.fileName);
                info.close(fileExists);
                this.stopWatchingConfigFilesForClosedScriptInfo(info);
                var canonicalFileName = this.toCanonicalFileName(info.fileName);
                if (this.openFilesWithNonRootedDiskPath.get(canonicalFileName) === info) {
                    this.openFilesWithNonRootedDiskPath.delete(canonicalFileName);
                }
                var ensureProjectsForOpenFiles = false;
                for (var _i = 0, _a = info.containingProjects; _i < _a.length; _i++) {
                    var p = _a[_i];
                    if (p.projectKind === server.ProjectKind.Configured) {
                        if (info.hasMixedContent) {
                            info.registerFileUpdate();
                        }
                    }
                    else if (p.projectKind === server.ProjectKind.Inferred && p.isRoot(info)) {
                        if (p.isProjectWithSingleRoot()) {
                            ensureProjectsForOpenFiles = true;
                        }
                        p.removeFile(info, fileExists, true);
                    }
                    if (!p.languageServiceEnabled) {
                        p.markAsDirty();
                    }
                }
                this.openFiles.delete(info.path);
                if (ensureProjectsForOpenFiles) {
                    this.openFiles.forEach(function (projectRootPath, path) {
                        var info = _this.getScriptInfoForPath(path);
                        if (info.isOrphan()) {
                            _this.assignOrphanScriptInfoToInferredProject(info, projectRootPath);
                        }
                    });
                }
                if (fileExists) {
                    this.watchClosedScriptInfo(info);
                }
                else {
                    this.handleDeletedFile(info);
                }
            };
            ProjectService.prototype.deleteScriptInfo = function (info) {
                this.filenameToScriptInfo.delete(info.path);
                this.filenameToScriptInfoVersion.set(info.path, info.getVersion());
                var realpath = info.getRealpathIfDifferent();
                if (realpath) {
                    this.realpathToScriptInfos.remove(realpath, info);
                }
            };
            ProjectService.prototype.configFileExists = function (configFileName, canonicalConfigFilePath, info) {
                var configFileExistenceInfo = this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                if (configFileExistenceInfo) {
                    if (isOpenScriptInfo(info) && !configFileExistenceInfo.openFilesImpactedByConfigFile.has(info.path)) {
                        configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, false);
                        this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File added to open files impacted by this config file");
                    }
                    return configFileExistenceInfo.exists;
                }
                var exists = this.host.fileExists(configFileName);
                var openFilesImpactedByConfigFile = ts.createMap();
                if (isOpenScriptInfo(info)) {
                    openFilesImpactedByConfigFile.set(info.path, false);
                }
                configFileExistenceInfo = { exists: exists, openFilesImpactedByConfigFile: openFilesImpactedByConfigFile };
                this.configFileExistenceInfoCache.set(canonicalConfigFilePath, configFileExistenceInfo);
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File added to open files impacted by this config file");
                return exists;
            };
            ProjectService.prototype.setConfigFileExistenceByNewConfiguredProject = function (project) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(project);
                if (configFileExistenceInfo) {
                    ts.Debug.assert(configFileExistenceInfo.exists);
                    if (configFileExistenceInfo.configFileWatcherForRootOfInferredProject) {
                        var configFileName = project.getConfigFilePath();
                        configFileExistenceInfo.configFileWatcherForRootOfInferredProject.close();
                        configFileExistenceInfo.configFileWatcherForRootOfInferredProject = undefined;
                        this.logConfigFileWatchUpdate(configFileName, project.canonicalConfigFilePath, configFileExistenceInfo, "Updated the callback");
                    }
                }
                else {
                    this.configFileExistenceInfoCache.set(project.canonicalConfigFilePath, {
                        exists: true,
                        openFilesImpactedByConfigFile: ts.createMap()
                    });
                }
            };
            ProjectService.prototype.configFileExistenceImpactsRootOfInferredProject = function (configFileExistenceInfo) {
                return ts.forEachEntry(configFileExistenceInfo.openFilesImpactedByConfigFile, function (isRootOfInferredProject) { return isRootOfInferredProject; });
            };
            ProjectService.prototype.setConfigFileExistenceInfoByClosedConfiguredProject = function (closedProject) {
                var configFileExistenceInfo = this.getConfigFileExistenceInfo(closedProject);
                ts.Debug.assert(!!configFileExistenceInfo);
                if (configFileExistenceInfo.openFilesImpactedByConfigFile.size) {
                    var configFileName = closedProject.getConfigFilePath();
                    if (this.configFileExistenceImpactsRootOfInferredProject(configFileExistenceInfo)) {
                        ts.Debug.assert(!configFileExistenceInfo.configFileWatcherForRootOfInferredProject);
                        this.createConfigFileWatcherOfConfigFileExistence(configFileName, closedProject.canonicalConfigFilePath, configFileExistenceInfo);
                    }
                }
                else {
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
                    watches.push("Config file for the inferred project root");
                }
                if (this.configuredProjects.has(canonicalConfigFilePath)) {
                    watches.push("Config file for the program");
                }
                this.logger.info("ConfigFilePresence:: Current Watches: " + watches + ":: File: " + configFileName + " Currently impacted open files: RootsOfInferredProjects: " + inferredRoots + " OtherOpenFiles: " + otherFiles + " Status: " + status);
            };
            ProjectService.prototype.createConfigFileWatcherOfConfigFileExistence = function (configFileName, canonicalConfigFilePath, configFileExistenceInfo) {
                var _this = this;
                configFileExistenceInfo.configFileWatcherForRootOfInferredProject = this.watchFactory.watchFile(this.host, configFileName, function (_filename, eventKind) { return _this.onConfigFileChangeForOpenScriptInfo(configFileName, eventKind); }, ts.PollingInterval.High, "Config file for the inferred project root");
                this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Updated the callback");
            };
            ProjectService.prototype.closeConfigFileWatcherOfConfigFileExistenceInfo = function (configFileExistenceInfo) {
                if (configFileExistenceInfo.configFileWatcherForRootOfInferredProject &&
                    !this.configFileExistenceImpactsRootOfInferredProject(configFileExistenceInfo)) {
                    configFileExistenceInfo.configFileWatcherForRootOfInferredProject.close();
                    configFileExistenceInfo.configFileWatcherForRootOfInferredProject = undefined;
                }
            };
            ProjectService.prototype.stopWatchingConfigFilesForClosedScriptInfo = function (info) {
                var _this = this;
                ts.Debug.assert(!info.isScriptOpen());
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (configFileExistenceInfo) {
                        var infoIsRootOfInferredProject = configFileExistenceInfo.openFilesImpactedByConfigFile.get(info.path);
                        configFileExistenceInfo.openFilesImpactedByConfigFile.delete(info.path);
                        _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "File removed from open files impacted by this config file");
                        if (infoIsRootOfInferredProject) {
                            _this.closeConfigFileWatcherOfConfigFileExistenceInfo(configFileExistenceInfo);
                        }
                        if (!configFileExistenceInfo.openFilesImpactedByConfigFile.size &&
                            !_this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath)) {
                            ts.Debug.assert(!configFileExistenceInfo.configFileWatcherForRootOfInferredProject);
                            _this.configFileExistenceInfoCache.delete(canonicalConfigFilePath);
                        }
                    }
                });
            };
            ProjectService.prototype.startWatchingConfigFilesForInferredProjectRoot = function (info) {
                var _this = this;
                ts.Debug.assert(info.isScriptOpen());
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (!configFileExistenceInfo) {
                        configFileExistenceInfo = {
                            exists: _this.host.fileExists(configFileName),
                            openFilesImpactedByConfigFile: ts.createMap()
                        };
                        _this.configFileExistenceInfoCache.set(canonicalConfigFilePath, configFileExistenceInfo);
                    }
                    configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, true);
                    _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Open file was set as Inferred root");
                    if (!configFileExistenceInfo.configFileWatcherForRootOfInferredProject &&
                        !_this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath)) {
                        _this.createConfigFileWatcherOfConfigFileExistence(configFileName, canonicalConfigFilePath, configFileExistenceInfo);
                    }
                });
            };
            ProjectService.prototype.stopWatchingConfigFilesForInferredProjectRoot = function (info) {
                var _this = this;
                this.forEachConfigFileLocation(info, function (configFileName, canonicalConfigFilePath) {
                    var configFileExistenceInfo = _this.configFileExistenceInfoCache.get(canonicalConfigFilePath);
                    if (configFileExistenceInfo && configFileExistenceInfo.openFilesImpactedByConfigFile.has(info.path)) {
                        ts.Debug.assert(info.isScriptOpen());
                        configFileExistenceInfo.openFilesImpactedByConfigFile.set(info.path, false);
                        _this.logConfigFileWatchUpdate(configFileName, canonicalConfigFilePath, configFileExistenceInfo, "Open file was set as not inferred root");
                        _this.closeConfigFileWatcherOfConfigFileExistenceInfo(configFileExistenceInfo);
                    }
                });
            };
            ProjectService.prototype.forEachConfigFileLocation = function (info, action) {
                var _this = this;
                if (this.syntaxOnly) {
                    return undefined;
                }
                ts.Debug.assert(!isOpenScriptInfo(info) || this.openFiles.has(info.path));
                var projectRootPath = this.openFiles.get(info.path);
                var searchPath = server.asNormalizedPath(ts.getDirectoryPath(info.fileName));
                var isSearchPathInProjectRoot = function () { return ts.containsPath(projectRootPath, searchPath, _this.currentDirectory, !_this.host.useCaseSensitiveFileNames); };
                var anySearchPathOk = !projectRootPath || !isSearchPathInProjectRoot();
                do {
                    var canonicalSearchPath = server.normalizedPathToPath(searchPath, this.currentDirectory, this.toCanonicalFileName);
                    var tsconfigFileName = server.asNormalizedPath(ts.combinePaths(searchPath, "tsconfig.json"));
                    var result = action(tsconfigFileName, ts.combinePaths(canonicalSearchPath, "tsconfig.json"));
                    if (result) {
                        return tsconfigFileName;
                    }
                    var jsconfigFileName = server.asNormalizedPath(ts.combinePaths(searchPath, "jsconfig.json"));
                    result = action(jsconfigFileName, ts.combinePaths(canonicalSearchPath, "jsconfig.json"));
                    if (result) {
                        return jsconfigFileName;
                    }
                    var parentPath = server.asNormalizedPath(ts.getDirectoryPath(searchPath));
                    if (parentPath === searchPath) {
                        break;
                    }
                    searchPath = parentPath;
                } while (anySearchPathOk || isSearchPathInProjectRoot());
                return undefined;
            };
            ProjectService.prototype.getConfigFileNameForFile = function (info) {
                var _this = this;
                if (isOpenScriptInfo(info))
                    ts.Debug.assert(info.isScriptOpen());
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
                return configFileName;
            };
            ProjectService.prototype.printProjects = function () {
                var _this = this;
                if (!this.logger.hasLevel(server.LogLevel.normal)) {
                    return;
                }
                var writeProjectFileNames = this.logger.hasLevel(server.LogLevel.verbose);
                this.logger.startGroup();
                var counter = 0;
                var printProjects = function (projects, counter) {
                    for (var _i = 0, projects_3 = projects; _i < projects_3.length; _i++) {
                        var project = projects_3[_i];
                        _this.logger.info("Project '" + project.getProjectName() + "' (" + server.ProjectKind[project.projectKind] + ") " + counter);
                        _this.logger.info(project.filesToString(writeProjectFileNames));
                        _this.logger.info("-----------------------------------------------");
                        counter++;
                    }
                    return counter;
                };
                counter = printProjects(this.externalProjects, counter);
                counter = printProjects(ts.arrayFrom(this.configuredProjects.values()), counter);
                printProjects(this.inferredProjects, counter);
                this.logger.info("Open files: ");
                this.openFiles.forEach(function (projectRootPath, path) {
                    var info = _this.getScriptInfoForPath(path);
                    _this.logger.info("\tFileName: " + info.fileName + " ProjectRootPath: " + projectRootPath);
                    if (writeProjectFileNames) {
                        _this.logger.info("\t\tProjects: " + info.containingProjects.map(function (p) { return p.getProjectName(); }));
                    }
                });
                this.logger.endGroup();
            };
            ProjectService.prototype.findConfiguredProjectByProjectName = function (configFileName) {
                var canonicalConfigFilePath = server.asNormalizedPath(this.toCanonicalFileName(configFileName));
                return this.getConfiguredProjectByCanonicalConfigFilePath(canonicalConfigFilePath);
            };
            ProjectService.prototype.getConfiguredProjectByCanonicalConfigFilePath = function (canonicalConfigFilePath) {
                return this.configuredProjects.get(canonicalConfigFilePath);
            };
            ProjectService.prototype.findExternalProjectByProjectName = function (projectFileName) {
                return findProjectByName(projectFileName, this.externalProjects);
            };
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
                        this.logger.info(getExceedLimitMessage({ propertyReader: propertyReader, hasTSFileExtension: ts.hasTSFileExtension, host: this.host }, totalNonTsFileSize));
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
                        .map(function (name) { return ({ name: name, size: host.getFileSize(name) }); })
                        .sort(function (a, b) { return b.size - a.size; })
                        .slice(0, 5);
                }
            };
            ProjectService.prototype.createExternalProject = function (projectFileName, files, options, typeAcquisition, excludedFiles) {
                var compilerOptions = convertCompilerOptions(options);
                var project = new server.ExternalProject(projectFileName, this, this.documentRegistry, compilerOptions, this.getFilenameForExceededTotalSizeLimitForNonTsFiles(projectFileName, compilerOptions, files, externalFilePropertyReader), options.compileOnSave === undefined ? true : options.compileOnSave);
                project.excludedFiles = excludedFiles;
                this.addFilesToNonInferredProject(project, files, externalFilePropertyReader, typeAcquisition);
                this.externalProjects.push(project);
                return project;
            };
            ProjectService.prototype.sendSurveyReady = function (project) {
                if (this.seenSurveyProjects.has(project.projectName)) {
                    return;
                }
                if (project.getCompilerOptions().checkJs !== undefined) {
                    var name = "checkJs";
                    this.logger.info("Survey " + name + " is ready");
                    this.sendSurveyReadyEvent(name);
                    this.seenSurveyProjects.set(project.projectName, true);
                }
            };
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
                var projectOptions = project.projectKind === server.ProjectKind.Configured ? project.projectOptions : undefined;
                setProjectOptionsUsed(project);
                var data = {
                    projectId: this.host.createSHA256Hash(project.projectName),
                    fileStats: server.countEachFileTypes(project.getScriptInfos()),
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
                    if (!(project instanceof server.ConfiguredProject)) {
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
            ProjectService.prototype.createConfiguredProject = function (configFileName) {
                var _this = this;
                var cachedDirectoryStructureHost = ts.createCachedDirectoryStructureHost(this.host, this.host.getCurrentDirectory(), this.host.useCaseSensitiveFileNames);
                this.logger.info("Opened configuration file " + configFileName);
                var project = new server.ConfiguredProject(configFileName, this, this.documentRegistry, cachedDirectoryStructureHost);
                project.configFileWatcher = this.watchFactory.watchFile(this.host, configFileName, function (_fileName, eventKind) { return _this.onConfigChangedForConfiguredProject(project, eventKind); }, ts.PollingInterval.High, "Config file for the program", project);
                this.configuredProjects.set(project.canonicalConfigFilePath, project);
                this.setConfigFileExistenceByNewConfiguredProject(project);
                return project;
            };
            ProjectService.prototype.createConfiguredProjectWithDelayLoad = function (configFileName) {
                var project = this.createConfiguredProject(configFileName);
                project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                return project;
            };
            ProjectService.prototype.createAndLoadConfiguredProject = function (configFileName) {
                var project = this.createConfiguredProject(configFileName);
                this.loadConfiguredProject(project);
                return project;
            };
            ProjectService.prototype.createLoadAndUpdateConfiguredProject = function (configFileName) {
                var project = this.createAndLoadConfiguredProject(configFileName);
                project.updateGraph();
                return project;
            };
            ProjectService.prototype.loadConfiguredProject = function (project) {
                var configFilename = ts.normalizePath(project.getConfigFilePath());
                var configFileContent = this.host.readFile(configFilename);
                var result = ts.parseJsonText(configFilename, configFileContent);
                if (!result.endOfFileToken) {
                    result.endOfFileToken = { kind: 1 };
                }
                var configFileErrors = result.parseDiagnostics;
                var parsedCommandLine = ts.parseJsonSourceFileConfigFileContent(result, project.getCachedDirectoryStructureHost(), ts.getDirectoryPath(configFilename), {}, configFilename, [], this.hostConfiguration.extraFileExtensions);
                if (parsedCommandLine.errors.length) {
                    configFileErrors.push.apply(configFileErrors, parsedCommandLine.errors);
                }
                ts.Debug.assert(!!parsedCommandLine.fileNames);
                var compilerOptions = parsedCommandLine.options;
                if (!project.projectOptions) {
                    project.projectOptions = {
                        configHasExtendsProperty: parsedCommandLine.raw.extends !== undefined,
                        configHasFilesProperty: parsedCommandLine.raw.files !== undefined,
                        configHasIncludeProperty: parsedCommandLine.raw.include !== undefined,
                        configHasExcludeProperty: parsedCommandLine.raw.exclude !== undefined
                    };
                }
                project.configFileSpecs = parsedCommandLine.configFileSpecs;
                project.setProjectErrors(configFileErrors);
                project.updateReferences(parsedCommandLine.projectReferences);
                var lastFileExceededProgramSize = this.getFilenameForExceededTotalSizeLimitForNonTsFiles(project.canonicalConfigFilePath, compilerOptions, parsedCommandLine.fileNames, fileNamePropertyReader);
                if (lastFileExceededProgramSize) {
                    project.disableLanguageService(lastFileExceededProgramSize);
                    project.stopWatchingWildCards();
                }
                else {
                    project.enableLanguageService();
                    project.watchWildcards(ts.createMapFromTemplate(parsedCommandLine.wildcardDirectories));
                }
                project.enablePluginsWithOptions(compilerOptions);
                var filesToAdd = parsedCommandLine.fileNames.concat(project.getExternalFiles());
                this.updateRootAndOptionsOfNonInferredProject(project, filesToAdd, fileNamePropertyReader, compilerOptions, parsedCommandLine.typeAcquisition, parsedCommandLine.compileOnSave);
            };
            ProjectService.prototype.updateNonInferredProjectFiles = function (project, files, propertyReader) {
                var projectRootFilesMap = project.getRootFilesMap();
                var newRootScriptInfoMap = ts.createMap();
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var f = files_1[_i];
                    var newRootFile = propertyReader.getFileName(f);
                    var normalizedPath = server.toNormalizedPath(newRootFile);
                    var isDynamic = server.isDynamicFileName(normalizedPath);
                    var scriptInfo = void 0;
                    var path = void 0;
                    if (!isDynamic && !project.fileExists(newRootFile)) {
                        path = server.normalizedPathToPath(normalizedPath, this.currentDirectory, this.toCanonicalFileName);
                        var existingValue = projectRootFilesMap.get(path);
                        if (server.isScriptInfo(existingValue)) {
                            project.removeFile(existingValue, false, true);
                        }
                        projectRootFilesMap.set(path, normalizedPath);
                        scriptInfo = normalizedPath;
                    }
                    else {
                        var scriptKind = propertyReader.getScriptKind(f, this.hostConfiguration.extraFileExtensions);
                        var hasMixedContent = propertyReader.hasMixedContent(f, this.hostConfiguration.extraFileExtensions);
                        scriptInfo = this.getOrCreateScriptInfoNotOpenedByClientForNormalizedPath(normalizedPath, project.currentDirectory, scriptKind, hasMixedContent, project.directoryStructureHost);
                        path = scriptInfo.path;
                        if (!project.isRoot(scriptInfo)) {
                            project.addRoot(scriptInfo);
                            if (scriptInfo.isScriptOpen()) {
                                this.removeRootOfInferredProjectIfNowPartOfOtherProject(scriptInfo);
                            }
                        }
                    }
                    newRootScriptInfoMap.set(path, scriptInfo);
                }
                if (projectRootFilesMap.size > newRootScriptInfoMap.size) {
                    projectRootFilesMap.forEach(function (value, path) {
                        if (!newRootScriptInfoMap.has(path)) {
                            if (server.isScriptInfo(value)) {
                                project.removeFile(value, project.fileExists(path), true);
                            }
                            else {
                                projectRootFilesMap.delete(path);
                            }
                        }
                    });
                }
                project.markAsDirty();
            };
            ProjectService.prototype.updateRootAndOptionsOfNonInferredProject = function (project, newUncheckedFiles, propertyReader, newOptions, newTypeAcquisition, compileOnSave) {
                project.setCompilerOptions(newOptions);
                if (compileOnSave !== undefined) {
                    project.compileOnSaveEnabled = compileOnSave;
                }
                this.addFilesToNonInferredProject(project, newUncheckedFiles, propertyReader, newTypeAcquisition);
            };
            ProjectService.prototype.reloadFileNamesOfConfiguredProject = function (project) {
                var configFileSpecs = project.configFileSpecs;
                var configFileName = project.getConfigFilePath();
                var fileNamesResult = ts.getFileNamesFromConfigSpecs(configFileSpecs, ts.getDirectoryPath(configFileName), project.getCompilationSettings(), project.getCachedDirectoryStructureHost(), this.hostConfiguration.extraFileExtensions);
                project.updateErrorOnNoInputFiles(fileNamesResult.fileNames.length !== 0);
                this.updateNonInferredProjectFiles(project, fileNamesResult.fileNames.concat(project.getExternalFiles()), fileNamePropertyReader);
                return project.updateGraph();
            };
            ProjectService.prototype.reloadConfiguredProject = function (project) {
                var host = project.getCachedDirectoryStructureHost();
                host.clearCache();
                var configFileName = project.getConfigFilePath();
                this.logger.info("Reloading configured project " + configFileName);
                this.loadConfiguredProject(project);
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
                if (info.isDynamic || !this.useInferredProjectPerProjectRoot) {
                    return undefined;
                }
                if (projectRootPath) {
                    var canonicalProjectRootPath = this.toCanonicalFileName(projectRootPath);
                    for (var _i = 0, _a = this.inferredProjects; _i < _a.length; _i++) {
                        var project = _a[_i];
                        if (project.projectRootPath === canonicalProjectRootPath) {
                            return project;
                        }
                    }
                    return this.createInferredProject(projectRootPath, false, projectRootPath);
                }
                var bestMatch;
                for (var _b = 0, _c = this.inferredProjects; _b < _c.length; _b++) {
                    var project = _c[_b];
                    if (!project.projectRootPath)
                        continue;
                    if (!ts.containsPath(project.projectRootPath, info.path, this.host.getCurrentDirectory(), !this.host.useCaseSensitiveFileNames))
                        continue;
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
                if (this.inferredProjects.length > 0 && this.inferredProjects[0].projectRootPath === undefined) {
                    return this.inferredProjects[0];
                }
                return this.createInferredProject(undefined, true);
            };
            ProjectService.prototype.getOrCreateSingleInferredWithoutProjectRoot = function (currentDirectory) {
                ts.Debug.assert(!this.useSingleInferredProject);
                var expectedCurrentDirectory = this.toCanonicalFileName(this.getNormalizedAbsolutePath(currentDirectory || ""));
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
                var compilerOptions = projectRootPath && this.compilerOptionsForInferredProjectsPerProjectRoot.get(projectRootPath) || this.compilerOptionsForInferredProjects;
                var project = new server.InferredProject(this, this.documentRegistry, compilerOptions, projectRootPath, currentDirectory);
                if (isSingleInferredProject) {
                    this.inferredProjects.unshift(project);
                }
                else {
                    this.inferredProjects.push(project);
                }
                return project;
            };
            ProjectService.prototype.getOrCreateScriptInfoNotOpenedByClient = function (uncheckedFileName, currentDirectory, hostToQueryFileExistsOn) {
                return this.getOrCreateScriptInfoNotOpenedByClientForNormalizedPath(server.toNormalizedPath(uncheckedFileName), currentDirectory, undefined, undefined, hostToQueryFileExistsOn);
            };
            ProjectService.prototype.getScriptInfo = function (uncheckedFileName) {
                return this.getScriptInfoForNormalizedPath(server.toNormalizedPath(uncheckedFileName));
            };
            ProjectService.prototype.getScriptInfoOrConfig = function (uncheckedFileName) {
                var path = server.toNormalizedPath(uncheckedFileName);
                var info = this.getScriptInfoForNormalizedPath(path);
                if (info)
                    return info;
                var configProject = this.configuredProjects.get(uncheckedFileName);
                return configProject && configProject.getCompilerOptions().configFile;
            };
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
                        var _loop_3 = function (project) {
                            if (project.languageServiceEnabled &&
                                !project.isOrphan() &&
                                !project.getCompilerOptions().preserveSymlinks &&
                                !ts.contains(info.containingProjects, project)) {
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
                            _loop_3(project);
                        }
                    }
                }
            };
            ProjectService.prototype.watchClosedScriptInfo = function (info) {
                var _this = this;
                ts.Debug.assert(!info.fileWatcher);
                if (!info.isDynamicOrHasMixedContent() &&
                    (!this.globalCacheLocationDirectoryPath ||
                        !ts.startsWith(info.path, this.globalCacheLocationDirectoryPath))) {
                    var indexOfNodeModules = info.path.indexOf("/node_modules/");
                    if (!this.host.getModifiedTime || indexOfNodeModules === -1) {
                        info.fileWatcher = this.watchFactory.watchFilePath(this.host, info.fileName, function (fileName, eventKind, path) { return _this.onSourceFileChanged(fileName, eventKind, path); }, ts.PollingInterval.Medium, info.path, "Closed Script info");
                    }
                    else {
                        info.mTime = this.getModifiedTime(info);
                        info.fileWatcher = this.watchClosedScriptInfoInNodeModules(info.path.substr(0, indexOfNodeModules));
                    }
                }
            };
            ProjectService.prototype.watchClosedScriptInfoInNodeModules = function (dir) {
                var _this = this;
                var existing = this.scriptInfoInNodeModulesWatchers.get(dir);
                if (existing) {
                    existing.refCount++;
                    return existing;
                }
                var watchDir = dir + "/node_modules";
                var watcher = this.watchFactory.watchDirectory(this.host, watchDir, function (fileOrDirectory) {
                    var fileOrDirectoryPath = _this.toPath(fileOrDirectory);
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
                        else if (!ts.hasExtension(fileOrDirectoryPath)) {
                            _this.refreshScriptInfosInDirectory(fileOrDirectoryPath);
                        }
                    }
                }, 1, "node_modules for closed script infos in them");
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
                return this.getOrCreateScriptInfoWorker(fileName, currentDirectory, false, undefined, scriptKind, hasMixedContent, hostToQueryFileExistsOn);
            };
            ProjectService.prototype.getOrCreateScriptInfoOpenedByClientForNormalizedPath = function (fileName, currentDirectory, fileContent, scriptKind, hasMixedContent) {
                return this.getOrCreateScriptInfoWorker(fileName, currentDirectory, true, fileContent, scriptKind, hasMixedContent);
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
                    ts.Debug.assert(ts.isRootedDiskPath(fileName) || isDynamic || openedByClient, "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nScript info with non-dynamic relative file name can only be open script info"; });
                    ts.Debug.assert(!ts.isRootedDiskPath(fileName) || this.currentDirectory === currentDirectory || !this.openFilesWithNonRootedDiskPath.has(this.toCanonicalFileName(fileName)), "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nOpen script files with non rooted disk path opened with current directory context cannot have same canonical names"; });
                    ts.Debug.assert(!isDynamic || this.currentDirectory === currentDirectory, "", function () { return JSON.stringify({ fileName: fileName, currentDirectory: currentDirectory, hostCurrentDirectory: _this.currentDirectory, openKeys: ts.arrayFrom(_this.openFilesWithNonRootedDiskPath.keys()) }) + "\nDynamic files must always have current directory context since containing external project name will always match the script info name."; });
                    if (!openedByClient && !isDynamic && !(hostToQueryFileExistsOn || this.host).fileExists(fileName)) {
                        return;
                    }
                    info = new server.ScriptInfo(this.host, fileName, scriptKind, !!hasMixedContent, path, this.filenameToScriptInfoVersion.get(path));
                    this.filenameToScriptInfo.set(info.path, info);
                    this.filenameToScriptInfoVersion.delete(info.path);
                    if (!openedByClient) {
                        this.watchClosedScriptInfo(info);
                    }
                    else if (!ts.isRootedDiskPath(fileName) && currentDirectory !== this.currentDirectory) {
                        this.openFilesWithNonRootedDiskPath.set(this.toCanonicalFileName(fileName), info);
                    }
                }
                if (openedByClient && !info.isScriptOpen()) {
                    this.stopWatchingScriptInfo(info);
                    info.open(fileContent);
                    if (hasMixedContent) {
                        info.registerFileUpdate();
                    }
                }
                else {
                    ts.Debug.assert(fileContent === undefined);
                }
                return info;
            };
            ProjectService.prototype.getScriptInfoForNormalizedPath = function (fileName) {
                return !ts.isRootedDiskPath(fileName) && this.openFilesWithNonRootedDiskPath.get(this.toCanonicalFileName(fileName)) ||
                    this.getScriptInfoForPath(server.normalizedPathToPath(fileName, this.currentDirectory, this.toCanonicalFileName));
            };
            ProjectService.prototype.getScriptInfoForPath = function (fileName) {
                return this.filenameToScriptInfo.get(fileName);
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
                        this.hostConfiguration.formatCodeOptions = __assign({}, this.hostConfiguration.formatCodeOptions, convertFormatOptions(args.formatOptions));
                        this.logger.info("Format host information updated");
                    }
                    if (args.preferences) {
                        var lazyConfiguredProjectsFromExternalProject = this.hostConfiguration.preferences.lazyConfiguredProjectsFromExternalProject;
                        this.hostConfiguration.preferences = __assign({}, this.hostConfiguration.preferences, args.preferences);
                        if (lazyConfiguredProjectsFromExternalProject && !this.hostConfiguration.preferences.lazyConfiguredProjectsFromExternalProject) {
                            this.configuredProjects.forEach(function (project) {
                                if (project.hasExternalProjectRef() &&
                                    project.pendingReload === ts.ConfigFileProgramReloadLevel.Full &&
                                    !_this.pendingProjectUpdates.has(project.getProjectName())) {
                                    _this.loadConfiguredProject(project);
                                    project.updateGraph();
                                }
                            });
                        }
                    }
                    if (args.extraFileExtensions) {
                        this.hostConfiguration.extraFileExtensions = args.extraFileExtensions;
                        this.reloadProjects();
                        this.logger.info("Host file extension mappings updated");
                    }
                }
            };
            ProjectService.prototype.closeLog = function () {
                this.logger.close();
            };
            ProjectService.prototype.reloadProjects = function () {
                this.logger.info("reload projects.");
                this.reloadConfiguredProjectForFiles(this.openFiles, false, ts.returnTrue);
                this.ensureProjectForOpenFiles();
            };
            ProjectService.prototype.delayReloadConfiguredProjectForFiles = function (configFileExistenceInfo, ignoreIfNotRootOfInferredProject) {
                this.reloadConfiguredProjectForFiles(configFileExistenceInfo.openFilesImpactedByConfigFile, true, ignoreIfNotRootOfInferredProject ?
                    function (isRootOfInferredProject) { return isRootOfInferredProject; } :
                    ts.returnTrue);
                this.delayEnsureProjectForOpenFiles();
            };
            ProjectService.prototype.reloadConfiguredProjectForFiles = function (openFiles, delayReload, shouldReloadProjectFor) {
                var _this = this;
                var updatedProjects = ts.createMap();
                openFiles.forEach(function (openFileValue, path) {
                    if (!shouldReloadProjectFor(openFileValue)) {
                        return;
                    }
                    var info = _this.getScriptInfoForPath(path);
                    ts.Debug.assert(info.isScriptOpen());
                    var configFileName = _this.getConfigFileNameForFile(info);
                    if (configFileName) {
                        var project = _this.findConfiguredProjectByProjectName(configFileName) || _this.createConfiguredProject(configFileName);
                        if (!updatedProjects.has(configFileName)) {
                            if (delayReload) {
                                project.pendingReload = ts.ConfigFileProgramReloadLevel.Full;
                                _this.delayUpdateProjectGraph(project);
                            }
                            else {
                                _this.reloadConfiguredProject(project);
                            }
                            updatedProjects.set(configFileName, true);
                        }
                    }
                });
            };
            ProjectService.prototype.removeRootOfInferredProjectIfNowPartOfOtherProject = function (info) {
                ts.Debug.assert(info.containingProjects.length > 0);
                var firstProject = info.containingProjects[0];
                if (!firstProject.isOrphan() &&
                    firstProject.projectKind === server.ProjectKind.Inferred &&
                    firstProject.isRoot(info) &&
                    ts.forEach(info.containingProjects, function (p) { return p !== firstProject && !p.isOrphan(); })) {
                    firstProject.removeFile(info, true, true);
                }
            };
            ProjectService.prototype.ensureProjectForOpenFiles = function () {
                var _this = this;
                this.logger.info("Structure before ensureProjectForOpenFiles:");
                this.printProjects();
                this.openFiles.forEach(function (projectRootPath, path) {
                    var info = _this.getScriptInfoForPath(path);
                    if (info.isOrphan()) {
                        _this.assignOrphanScriptInfoToInferredProject(info, projectRootPath);
                    }
                    else {
                        _this.removeRootOfInferredProjectIfNowPartOfOtherProject(info);
                    }
                });
                this.pendingEnsureProjectForOpenFiles = false;
                this.inferredProjects.forEach(updateProjectIfDirty);
                this.logger.info("Structure after ensureProjectForOpenFiles:");
                this.printProjects();
            };
            ProjectService.prototype.openClientFile = function (fileName, fileContent, scriptKind, projectRootPath) {
                return this.openClientFileWithNormalizedPath(server.toNormalizedPath(fileName), fileContent, scriptKind, false, projectRootPath ? server.toNormalizedPath(projectRootPath) : undefined);
            };
            ProjectService.prototype.getOriginalLocationEnsuringConfiguredProject = function (project, location) {
                var originalLocation = project.getSourceMapper().tryGetOriginalLocation(location);
                if (!originalLocation)
                    return undefined;
                var fileName = originalLocation.fileName;
                if (!this.getScriptInfo(fileName) && !this.host.fileExists(fileName))
                    return undefined;
                var originalFileInfo = { fileName: server.toNormalizedPath(fileName), path: this.toPath(fileName) };
                var configFileName = this.getConfigFileNameForFile(originalFileInfo);
                if (!configFileName)
                    return undefined;
                var configuredProject = this.findConfiguredProjectByProjectName(configFileName) || this.createAndLoadConfiguredProject(configFileName);
                updateProjectIfDirty(configuredProject);
                addOriginalConfiguredProject(configuredProject);
                var originalScriptInfo = this.getScriptInfo(fileName);
                if (!originalScriptInfo || !originalScriptInfo.containingProjects.length)
                    return undefined;
                originalScriptInfo.containingProjects.forEach(function (project) {
                    if (project.projectKind === server.ProjectKind.Configured) {
                        addOriginalConfiguredProject(project);
                    }
                });
                return originalLocation;
                function addOriginalConfiguredProject(originalProject) {
                    if (!project.originalConfiguredProjects) {
                        project.originalConfiguredProjects = ts.createMap();
                    }
                    project.originalConfiguredProjects.set(originalProject.canonicalConfigFilePath, true);
                }
            };
            ProjectService.prototype.fileExists = function (fileName) {
                return this.filenameToScriptInfo.has(fileName) || this.host.fileExists(fileName);
            };
            ProjectService.prototype.findExternalProjectContainingOpenScriptInfo = function (info) {
                return ts.find(this.externalProjects, function (proj) {
                    updateProjectIfDirty(proj);
                    return proj.containsScriptInfo(info);
                });
            };
            ProjectService.prototype.openClientFileWithNormalizedPath = function (fileName, fileContent, scriptKind, hasMixedContent, projectRootPath) {
                var _this = this;
                var configFileName;
                var configFileErrors;
                var info = this.getOrCreateScriptInfoOpenedByClientForNormalizedPath(fileName, projectRootPath ? this.getNormalizedAbsolutePath(projectRootPath) : this.currentDirectory, fileContent, scriptKind, hasMixedContent);
                this.openFiles.set(info.path, projectRootPath);
                var project = this.findExternalProjectContainingOpenScriptInfo(info);
                if (!project && !this.syntaxOnly) {
                    configFileName = this.getConfigFileNameForFile(info);
                    if (configFileName) {
                        project = this.findConfiguredProjectByProjectName(configFileName);
                        if (!project) {
                            project = this.createLoadAndUpdateConfiguredProject(configFileName);
                            if (info.isOrphan()) {
                                configFileName = undefined;
                            }
                            else {
                                configFileErrors = project.getAllProjectErrors();
                                this.sendConfigFileDiagEvent(project, fileName);
                            }
                        }
                        else {
                            updateProjectIfDirty(project);
                        }
                    }
                }
                info.containingProjects.forEach(updateProjectIfDirty);
                if (info.isOrphan()) {
                    this.assignOrphanScriptInfoToInferredProject(info, projectRootPath);
                }
                ts.Debug.assert(!info.isOrphan());
                this.removeOrphanConfiguredProjects();
                for (var _i = 0, _a = this.inferredProjects.slice(); _i < _a.length; _i++) {
                    var inferredProject = _a[_i];
                    if (inferredProject.isOrphan()) {
                        this.removeProject(inferredProject);
                    }
                }
                this.filenameToScriptInfo.forEach(function (info) {
                    if (!info.isScriptOpen() && info.isOrphan()) {
                        _this.stopWatchingScriptInfo(info);
                        _this.deleteScriptInfo(info);
                    }
                });
                this.printProjects();
                this.telemetryOnOpenFile(info);
                return { configFileName: configFileName, configFileErrors: configFileErrors };
            };
            ProjectService.prototype.removeOrphanConfiguredProjects = function () {
                var _this = this;
                var toRemoveConfiguredProjects = ts.cloneMap(this.configuredProjects);
                this.inferredProjects.forEach(markOriginalProjectsAsUsed);
                this.externalProjects.forEach(markOriginalProjectsAsUsed);
                this.configuredProjects.forEach(function (project) {
                    if (project.hasOpenRef()) {
                        toRemoveConfiguredProjects.delete(project.canonicalConfigFilePath);
                        markOriginalProjectsAsUsed(project);
                    }
                    else {
                        var resolvedProjectReferences = project.getResolvedProjectReferences();
                        if (resolvedProjectReferences) {
                            for (var _i = 0, resolvedProjectReferences_1 = resolvedProjectReferences; _i < resolvedProjectReferences_1.length; _i++) {
                                var ref = resolvedProjectReferences_1[_i];
                                if (ref) {
                                    var refProject = _this.configuredProjects.get(ref.sourceFile.path);
                                    if (refProject && refProject.hasOpenRef()) {
                                        toRemoveConfiguredProjects.delete(project.canonicalConfigFilePath);
                                    }
                                }
                            }
                        }
                    }
                });
                toRemoveConfiguredProjects.forEach(function (project) { return _this.removeProject(project); });
                function markOriginalProjectsAsUsed(project) {
                    if (!project.isOrphan() && project.originalConfiguredProjects) {
                        project.originalConfiguredProjects.forEach(function (_value, configuredProjectPath) { return toRemoveConfiguredProjects.delete(configuredProjectPath); });
                    }
                }
            };
            ProjectService.prototype.telemetryOnOpenFile = function (scriptInfo) {
                if (this.syntaxOnly || !this.eventHandler || !scriptInfo.isJavaScript() || !ts.addToSeen(this.allJsFilesForOpenFileTelemetry, scriptInfo.path)) {
                    return;
                }
                var info = { checkJs: !!scriptInfo.getDefaultProject().getSourceFile(scriptInfo.path).checkJsDirective };
                this.eventHandler({ eventName: server.OpenFileInfoTelemetryEvent, data: { info: info } });
            };
            ProjectService.prototype.closeClientFile = function (uncheckedFileName) {
                var info = this.getScriptInfoForNormalizedPath(server.toNormalizedPath(uncheckedFileName));
                if (info) {
                    this.closeOpenFile(info);
                }
                this.printProjects();
            };
            ProjectService.prototype.collectChanges = function (lastKnownProjectVersions, currentProjects, result) {
                var _loop_4 = function (proj) {
                    var knownProject = ts.find(lastKnownProjectVersions, function (p) { return p.projectName === proj.getProjectName(); });
                    result.push(proj.getChangesSinceVersion(knownProject && knownProject.version));
                };
                for (var _i = 0, currentProjects_1 = currentProjects; _i < currentProjects_1.length; _i++) {
                    var proj = currentProjects_1[_i];
                    _loop_4(proj);
                }
            };
            ProjectService.prototype.synchronizeProjectList = function (knownProjects) {
                var files = [];
                this.collectChanges(knownProjects, this.externalProjects, files);
                this.collectChanges(knownProjects, ts.arrayFrom(this.configuredProjects.values()), files);
                this.collectChanges(knownProjects, this.inferredProjects, files);
                return files;
            };
            ProjectService.prototype.applyChangesInOpenFiles = function (openFiles, changedFiles, closedFiles) {
                if (openFiles) {
                    for (var _i = 0, openFiles_1 = openFiles; _i < openFiles_1.length; _i++) {
                        var file = openFiles_1[_i];
                        var scriptInfo = this.getScriptInfo(file.fileName);
                        ts.Debug.assert(!scriptInfo || !scriptInfo.isScriptOpen(), "Script should not exist and not be open already");
                        var normalizedPath = scriptInfo ? scriptInfo.fileName : server.toNormalizedPath(file.fileName);
                        this.openClientFileWithNormalizedPath(normalizedPath, file.content, tryConvertScriptKindName(file.scriptKind), file.hasMixedContent);
                    }
                }
                if (changedFiles) {
                    for (var _a = 0, changedFiles_2 = changedFiles; _a < changedFiles_2.length; _a++) {
                        var file = changedFiles_2[_a];
                        var scriptInfo = this.getScriptInfo(file.fileName);
                        ts.Debug.assert(!!scriptInfo);
                        this.applyChangesToFile(scriptInfo, file.changes);
                    }
                }
                if (closedFiles) {
                    for (var _b = 0, closedFiles_1 = closedFiles; _b < closedFiles_1.length; _b++) {
                        var file = closedFiles_1[_b];
                        this.closeClientFile(file);
                    }
                }
            };
            ProjectService.prototype.applyChangesToFile = function (scriptInfo, changes) {
                for (var i = changes.length - 1; i >= 0; i--) {
                    var change = changes[i];
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
                    var externalProject = this.findExternalProjectByProjectName(uncheckedFileName);
                    if (externalProject) {
                        this.removeProject(externalProject);
                    }
                }
            };
            ProjectService.prototype.openExternalProjects = function (projects) {
                var _this = this;
                var projectsToClose = ts.arrayToMap(this.externalProjects, function (p) { return p.getProjectName(); }, function (_) { return true; });
                ts.forEachKey(this.externalProjectToConfiguredProjectMap, function (externalProjectName) {
                    projectsToClose.set(externalProjectName, true);
                });
                for (var _i = 0, projects_4 = projects; _i < projects_4.length; _i++) {
                    var externalProject = projects_4[_i];
                    this.openExternalProject(externalProject);
                    projectsToClose.delete(externalProject.projectFileName);
                }
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
                if (typeAcquisition.enable === false) {
                    return [];
                }
                var typeAcqInclude = typeAcquisition.include || (typeAcquisition.include = []);
                var excludeRules = [];
                var normalizedNames = rootFiles.map(function (f) { return ts.normalizeSlashes(f.fileName); });
                var excludedFiles = [];
                var _loop_5 = function (name) {
                    var rule = this_2.safelist[name];
                    for (var _i = 0, normalizedNames_1 = normalizedNames; _i < normalizedNames_1.length; _i++) {
                        var root = normalizedNames_1[_i];
                        if (rule.match.test(root)) {
                            this_2.logger.info("Excluding files based on rule " + name + " matching file '" + root + "'");
                            if (rule.types) {
                                for (var _a = 0, _b = rule.types; _a < _b.length; _a++) {
                                    var type = _b[_a];
                                    if (typeAcqInclude.indexOf(type) < 0) {
                                        typeAcqInclude.push(type);
                                    }
                                }
                            }
                            if (rule.exclude) {
                                var _loop_7 = function (exclude) {
                                    var processedRule = root.replace(rule.match, function () {
                                        var groups = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            groups[_i] = arguments[_i];
                                        }
                                        return exclude.map(function (groupNumberOrString) {
                                            if (typeof groupNumberOrString === "number") {
                                                if (!ts.isString(groups[groupNumberOrString])) {
                                                    _this.logger.info("Incorrect RegExp specification in safelist rule " + name + " - not enough groups");
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
                                    _loop_7(exclude);
                                }
                            }
                            else {
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
                    _loop_5(name);
                }
                var excludeRegexes = excludeRules.map(function (e) { return new RegExp(e, "i"); });
                var filesToKeep = [];
                var _loop_6 = function (i) {
                    if (excludeRegexes.some(function (re) { return re.test(normalizedNames[i]); })) {
                        excludedFiles.push(normalizedNames[i]);
                    }
                    else {
                        var exclude = false;
                        if (typeAcquisition.enable || typeAcquisition.enableAutoDiscovery) {
                            var baseName = ts.getBaseFileName(normalizedNames[i].toLowerCase());
                            if (ts.fileExtensionIs(baseName, "js")) {
                                var inferredTypingName = ts.removeFileExtension(baseName);
                                var cleanedTypingName = ts.removeMinAndVersionNumbers(inferredTypingName);
                                if (this_3.legacySafelist[cleanedTypingName]) {
                                    this_3.logger.info("Excluded '" + normalizedNames[i] + "' because it matched " + cleanedTypingName + " from the legacy safelist");
                                    excludedFiles.push(normalizedNames[i]);
                                    exclude = true;
                                    var typeName = this_3.legacySafelist[cleanedTypingName];
                                    if (typeAcqInclude.indexOf(typeName) < 0) {
                                        typeAcqInclude.push(typeName);
                                    }
                                }
                            }
                        }
                        if (!exclude) {
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
                    _loop_6(i);
                }
                proj.rootFiles = filesToKeep;
                return excludedFiles;
            };
            ProjectService.prototype.openExternalProject = function (proj) {
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
                        if (!this.syntaxOnly && this.host.fileExists(normalized)) {
                            (tsConfigFiles || (tsConfigFiles = [])).push(normalized);
                        }
                    }
                    else {
                        rootFiles.push(file);
                    }
                }
                if (tsConfigFiles) {
                    tsConfigFiles.sort();
                }
                var externalProject = this.findExternalProjectByProjectName(proj.projectFileName);
                var exisingConfigFiles;
                if (externalProject) {
                    externalProject.excludedFiles = excludedFiles;
                    if (!tsConfigFiles) {
                        var compilerOptions = convertCompilerOptions(proj.options);
                        var lastFileExceededProgramSize = this.getFilenameForExceededTotalSizeLimitForNonTsFiles(proj.projectFileName, compilerOptions, proj.rootFiles, externalFilePropertyReader);
                        if (lastFileExceededProgramSize) {
                            externalProject.disableLanguageService(lastFileExceededProgramSize);
                        }
                        else {
                            externalProject.enableLanguageService();
                        }
                        this.updateRootAndOptionsOfNonInferredProject(externalProject, proj.rootFiles, externalFilePropertyReader, compilerOptions, proj.typeAcquisition, proj.options.compileOnSave);
                        externalProject.updateGraph();
                        return;
                    }
                    this.closeExternalProject(proj.projectFileName);
                }
                else if (this.externalProjectToConfiguredProjectMap.get(proj.projectFileName)) {
                    if (!tsConfigFiles) {
                        this.closeExternalProject(proj.projectFileName);
                    }
                    else {
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
                                (exisingConfigFiles || (exisingConfigFiles = [])).push(oldConfig);
                                iOld++;
                                iNew++;
                            }
                        }
                        for (var i = iOld; i < oldConfigFiles.length; i++) {
                            this.closeConfiguredProjectReferencedFromExternalProject(oldConfigFiles[i]);
                        }
                    }
                }
                if (tsConfigFiles) {
                    this.externalProjectToConfiguredProjectMap.set(proj.projectFileName, tsConfigFiles);
                    for (var _b = 0, tsConfigFiles_1 = tsConfigFiles; _b < tsConfigFiles_1.length; _b++) {
                        var tsconfigFile = tsConfigFiles_1[_b];
                        var project = this.findConfiguredProjectByProjectName(tsconfigFile);
                        if (!project) {
                            project = this.getHostPreferences().lazyConfiguredProjectsFromExternalProject ?
                                this.createConfiguredProjectWithDelayLoad(tsconfigFile) :
                                this.createLoadAndUpdateConfiguredProject(tsconfigFile);
                        }
                        if (project && !ts.contains(exisingConfigFiles, tsconfigFile)) {
                            project.addExternalProjectReference();
                        }
                    }
                }
                else {
                    this.externalProjectToConfiguredProjectMap.delete(proj.projectFileName);
                    var project = this.createExternalProject(proj.projectFileName, rootFiles, proj.options, proj.typeAcquisition, excludedFiles);
                    project.updateGraph();
                }
            };
            ProjectService.prototype.hasDeferredExtension = function () {
                for (var _i = 0, _a = this.hostConfiguration.extraFileExtensions; _i < _a.length; _i++) {
                    var extension = _a[_i];
                    if (extension.scriptKind === 7) {
                        return true;
                    }
                }
                return false;
            };
            ProjectService.filenameEscapeRegexp = /[-\/\\^$*+?.()|[\]{}]/g;
            return ProjectService;
        }());
        server.ProjectService = ProjectService;
        function isConfigFile(config) {
            return config.kind !== undefined;
        }
        server.isConfigFile = isConfigFile;
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
            if ((project.projectKind === server.ProjectKind.Inferred || project.projectKind === server.ProjectKind.External) &&
                project.isJsOnlyProject()) {
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                return scriptInfo && !scriptInfo.isJavaScript();
            }
            return false;
        }
        function formatDiag(fileName, project, diag) {
            var scriptInfo = project.getScriptInfoForNormalizedPath(fileName);
            return {
                start: scriptInfo.positionToLineOffset(diag.start),
                end: scriptInfo.positionToLineOffset(diag.start + diag.length),
                text: ts.flattenDiagnosticMessageText(diag.messageText, "\n"),
                code: diag.code,
                category: ts.diagnosticCategoryName(diag),
                reportsUnnecessary: diag.reportsUnnecessary,
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
        function formatConfigFileDiag(diag, includeFileName) {
            var start = (diag.file && convertToLocation(ts.getLineAndCharacterOfPosition(diag.file, diag.start)));
            var end = (diag.file && convertToLocation(ts.getLineAndCharacterOfPosition(diag.file, diag.start + diag.length)));
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
                source: source,
                relatedInformation: ts.map(diag.relatedInformation, formatRelatedInformation),
            };
            return includeFileName
                ? __assign({}, common, { fileName: diag.file && diag.file.fileName }) : common;
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
        var MultistepOperation = (function () {
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
        function toEvent(eventName, body) {
            return {
                seq: 0,
                type: "event",
                event: eventName,
                body: body
            };
        }
        server.toEvent = toEvent;
        function combineProjectOutput(defaultValue, getValue, projects, action) {
            var outputs = ts.flatMap(ts.isArray(projects) ? projects : projects.projects, function (project) { return action(project, defaultValue); });
            if (!ts.isArray(projects) && projects.symLinkedProjects) {
                projects.symLinkedProjects.forEach(function (projects, path) {
                    var value = getValue(path);
                    outputs.push.apply(outputs, ts.flatMap(projects, function (project) { return action(project, value); }));
                });
            }
            return ts.deduplicate(outputs, ts.equateValues);
        }
        function combineProjectOutputFromEveryProject(projectService, action, areEqual) {
            var outputs = [];
            projectService.forEachEnabledProject(function (project) {
                var theseOutputs = action(project);
                outputs.push.apply(outputs, theseOutputs.filter(function (output) { return !outputs.some(function (o) { return areEqual(o, output); }); }));
            });
            return outputs;
        }
        function combineProjectOutputWhileOpeningReferencedProjects(projects, defaultProject, projectService, action, getLocation, resultsEqual) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, undefined, projectService, function (_a, tryAddToTodo) {
                var project = _a.project;
                for (var _i = 0, _b = action(project); _i < _b.length; _i++) {
                    var output = _b[_i];
                    if (!ts.contains(outputs, output, resultsEqual) && !tryAddToTodo(project, getLocation(output))) {
                        outputs.push(output);
                    }
                }
            }, undefined);
            return outputs;
        }
        function combineProjectOutputForRenameLocations(projects, defaultProject, initialLocation, projectService, findInStrings, findInComments) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, initialLocation, projectService, function (_a, tryAddToTodo) {
                var project = _a.project, location = _a.location;
                for (var _i = 0, _b = project.getLanguageService().findRenameLocations(location.fileName, location.position, findInStrings, findInComments) || server.emptyArray; _i < _b.length; _i++) {
                    var output = _b[_i];
                    if (!ts.contains(outputs, output, ts.documentSpansEqual) && !tryAddToTodo(project, documentSpanLocation(output))) {
                        outputs.push(output);
                    }
                }
            }, function () { return getDefinitionLocation(defaultProject, initialLocation); });
            return outputs;
        }
        function getDefinitionLocation(defaultProject, initialLocation) {
            var infos = defaultProject.getLanguageService().getDefinitionAtPosition(initialLocation.fileName, initialLocation.position);
            var info = infos && ts.firstOrUndefined(infos);
            return info && { fileName: info.fileName, position: info.textSpan.start };
        }
        function combineProjectOutputForReferences(projects, defaultProject, initialLocation, projectService) {
            var outputs = [];
            combineProjectOutputWorker(projects, defaultProject, initialLocation, projectService, function (_a, getMappedLocation) {
                var project = _a.project, location = _a.location;
                var _loop_8 = function (outputReferencedSymbol) {
                    var mappedDefinitionFile = getMappedLocation(project, documentSpanLocation(outputReferencedSymbol.definition));
                    var definition = mappedDefinitionFile === undefined ? outputReferencedSymbol.definition : __assign({}, outputReferencedSymbol.definition, { textSpan: ts.createTextSpan(mappedDefinitionFile.position, outputReferencedSymbol.definition.textSpan.length), fileName: mappedDefinitionFile.fileName });
                    var symbolToAddTo = ts.find(outputs, function (o) { return ts.documentSpansEqual(o.definition, definition); });
                    if (!symbolToAddTo) {
                        symbolToAddTo = { definition: definition, references: [] };
                        outputs.push(symbolToAddTo);
                    }
                    for (var _i = 0, _a = outputReferencedSymbol.references; _i < _a.length; _i++) {
                        var ref = _a[_i];
                        if (!ts.contains(symbolToAddTo.references, ref, ts.documentSpansEqual) && !getMappedLocation(project, documentSpanLocation(ref))) {
                            symbolToAddTo.references.push(ref);
                        }
                    }
                };
                for (var _i = 0, _b = project.getLanguageService().findReferences(location.fileName, location.position) || server.emptyArray; _i < _b.length; _i++) {
                    var outputReferencedSymbol = _b[_i];
                    _loop_8(outputReferencedSymbol);
                }
            }, function () { return getDefinitionLocation(defaultProject, initialLocation); });
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
        function combineProjectOutputWorker(projects, defaultProject, initialLocation, projectService, cb, getDefinition) {
            var toDo;
            var seenProjects = ts.createMap();
            forEachProjectInProjects(projects, initialLocation && initialLocation.fileName, function (project, path) {
                var location = (initialLocation ? { fileName: path, position: initialLocation.position } : undefined);
                toDo = callbackProjectAndLocation({ project: project, location: location }, projectService, toDo, seenProjects, cb);
            });
            if (getDefinition) {
                var memGetDefinition_1 = ts.memoize(getDefinition);
                projectService.forEachEnabledProject(function (project) {
                    if (!ts.addToSeen(seenProjects, project.projectName))
                        return;
                    var definition = getDefinitionInProject(memGetDefinition_1(), defaultProject, project);
                    if (definition) {
                        toDo = callbackProjectAndLocation({ project: project, location: definition }, projectService, toDo, seenProjects, cb);
                    }
                });
            }
            while (toDo && toDo.length) {
                toDo = callbackProjectAndLocation(ts.Debug.assertDefined(toDo.pop()), projectService, toDo, seenProjects, cb);
            }
        }
        function getDefinitionInProject(definition, definingProject, project) {
            if (!definition || project.containsFile(server.toNormalizedPath(definition.fileName)))
                return definition;
            var mappedDefinition = definingProject.getLanguageService().getSourceMapper().tryGetGeneratedLocation(definition);
            return mappedDefinition && project.containsFile(server.toNormalizedPath(mappedDefinition.fileName)) ? mappedDefinition : undefined;
        }
        function callbackProjectAndLocation(projectAndLocation, projectService, toDo, seenProjects, cb) {
            if (projectAndLocation.project.getCancellationToken().isCancellationRequested())
                return undefined;
            cb(projectAndLocation, function (project, location) {
                seenProjects.set(projectAndLocation.project.projectName, true);
                var originalLocation = projectService.getOriginalLocationEnsuringConfiguredProject(project, location);
                if (!originalLocation)
                    return undefined;
                var originalScriptInfo = projectService.getScriptInfo(originalLocation.fileName);
                toDo = toDo || [];
                for (var _i = 0, _a = originalScriptInfo.containingProjects; _i < _a.length; _i++) {
                    var project_1 = _a[_i];
                    addToTodo({ project: project_1, location: originalLocation }, toDo, seenProjects);
                }
                var symlinkedProjectsMap = projectService.getSymlinkedProjects(originalScriptInfo);
                if (symlinkedProjectsMap) {
                    symlinkedProjectsMap.forEach(function (symlinkedProjects) {
                        for (var _i = 0, symlinkedProjects_2 = symlinkedProjects; _i < symlinkedProjects_2.length; _i++) {
                            var symlinkedProject = symlinkedProjects_2[_i];
                            addToTodo({ project: symlinkedProject, location: originalLocation }, toDo, seenProjects);
                        }
                    });
                }
                return originalLocation;
            });
            return toDo;
        }
        function addToTodo(projectAndLocation, toDo, seenProjects) {
            if (ts.addToSeen(seenProjects, projectAndLocation.project.projectName))
                toDo.push(projectAndLocation);
        }
        function documentSpanLocation(_a) {
            var fileName = _a.fileName, textSpan = _a.textSpan;
            return { fileName: fileName, position: textSpan.start };
        }
        function getMappedLocation(location, projectService, project) {
            var mapsTo = project.getSourceMapper().tryGetOriginalLocation(location);
            return mapsTo && projectService.fileExists(server.toNormalizedPath(mapsTo.fileName)) ? mapsTo : undefined;
        }
        var Session = (function () {
            function Session(opts) {
                var _a;
                var _this = this;
                this.changeSeq = 0;
                this.handlers = ts.createMapFromTemplate((_a = {},
                    _a[server.CommandNames.Status] = function () {
                        var response = { version: ts.version };
                        return _this.requiredResponse(response);
                    },
                    _a[server.CommandNames.OpenExternalProject] = function (request) {
                        _this.projectService.openExternalProject(request.arguments);
                        return _this.requiredResponse(true);
                    },
                    _a[server.CommandNames.OpenExternalProjects] = function (request) {
                        _this.projectService.openExternalProjects(request.arguments.projects);
                        return _this.requiredResponse(true);
                    },
                    _a[server.CommandNames.CloseExternalProject] = function (request) {
                        _this.projectService.closeExternalProject(request.arguments.projectFileName);
                        return _this.requiredResponse(true);
                    },
                    _a[server.CommandNames.SynchronizeProjectList] = function (request) {
                        var result = _this.projectService.synchronizeProjectList(request.arguments.knownProjects);
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
                                projectErrors: _this.convertToDiagnosticsWithLinePosition(p.projectErrors, undefined)
                            };
                        });
                        return _this.requiredResponse(converted);
                    },
                    _a[server.CommandNames.ApplyChangedToOpenFiles] = function (request) {
                        _this.changeSeq++;
                        _this.projectService.applyChangesInOpenFiles(request.arguments.openFiles, request.arguments.changedFiles, request.arguments.closedFiles);
                        return _this.requiredResponse(true);
                    },
                    _a[server.CommandNames.Exit] = function () {
                        _this.exit();
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Definition] = function (request) {
                        return _this.requiredResponse(_this.getDefinition(request.arguments, true));
                    },
                    _a[server.CommandNames.DefinitionFull] = function (request) {
                        return _this.requiredResponse(_this.getDefinition(request.arguments, false));
                    },
                    _a[server.CommandNames.DefinitionAndBoundSpan] = function (request) {
                        return _this.requiredResponse(_this.getDefinitionAndBoundSpan(request.arguments, true));
                    },
                    _a[server.CommandNames.DefinitionAndBoundSpanFull] = function (request) {
                        return _this.requiredResponse(_this.getDefinitionAndBoundSpan(request.arguments, false));
                    },
                    _a[server.CommandNames.EmitOutput] = function (request) {
                        return _this.requiredResponse(_this.getEmitOutput(request.arguments));
                    },
                    _a[server.CommandNames.TypeDefinition] = function (request) {
                        return _this.requiredResponse(_this.getTypeDefinition(request.arguments));
                    },
                    _a[server.CommandNames.Implementation] = function (request) {
                        return _this.requiredResponse(_this.getImplementation(request.arguments, true));
                    },
                    _a[server.CommandNames.ImplementationFull] = function (request) {
                        return _this.requiredResponse(_this.getImplementation(request.arguments, false));
                    },
                    _a[server.CommandNames.References] = function (request) {
                        return _this.requiredResponse(_this.getReferences(request.arguments, true));
                    },
                    _a[server.CommandNames.ReferencesFull] = function (request) {
                        return _this.requiredResponse(_this.getReferences(request.arguments, false));
                    },
                    _a[server.CommandNames.Rename] = function (request) {
                        return _this.requiredResponse(_this.getRenameLocations(request.arguments, true));
                    },
                    _a[server.CommandNames.RenameLocationsFull] = function (request) {
                        return _this.requiredResponse(_this.getRenameLocations(request.arguments, false));
                    },
                    _a[server.CommandNames.RenameInfoFull] = function (request) {
                        return _this.requiredResponse(_this.getRenameInfo(request.arguments));
                    },
                    _a[server.CommandNames.Open] = function (request) {
                        _this.openClientFile(server.toNormalizedPath(request.arguments.file), request.arguments.fileContent, server.convertScriptKindName(request.arguments.scriptKindName), request.arguments.projectRootPath ? server.toNormalizedPath(request.arguments.projectRootPath) : undefined);
                        return _this.notRequired();
                    },
                    _a[server.CommandNames.Quickinfo] = function (request) {
                        return _this.requiredResponse(_this.getQuickInfoWorker(request.arguments, true));
                    },
                    _a[server.CommandNames.QuickinfoFull] = function (request) {
                        return _this.requiredResponse(_this.getQuickInfoWorker(request.arguments, false));
                    },
                    _a[server.CommandNames.GetOutliningSpans] = function (request) {
                        return _this.requiredResponse(_this.getOutliningSpans(request.arguments, true));
                    },
                    _a[server.CommandNames.GetOutliningSpansFull] = function (request) {
                        return _this.requiredResponse(_this.getOutliningSpans(request.arguments, false));
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
                        return _this.requiredResponse(_this.getCompletionEntryDetails(request.arguments, true));
                    },
                    _a[server.CommandNames.CompletionDetailsFull] = function (request) {
                        return _this.requiredResponse(_this.getCompletionEntryDetails(request.arguments, false));
                    },
                    _a[server.CommandNames.CompileOnSaveAffectedFileList] = function (request) {
                        return _this.requiredResponse(_this.getCompileOnSaveAffectedFileList(request.arguments));
                    },
                    _a[server.CommandNames.CompileOnSaveEmitFile] = function (request) {
                        return _this.requiredResponse(_this.emitFile(request.arguments));
                    },
                    _a[server.CommandNames.SignatureHelp] = function (request) {
                        return _this.requiredResponse(_this.getSignatureHelpItems(request.arguments, true));
                    },
                    _a[server.CommandNames.SignatureHelpFull] = function (request) {
                        return _this.requiredResponse(_this.getSignatureHelpItems(request.arguments, false));
                    },
                    _a[server.CommandNames.CompilerOptionsDiagnosticsFull] = function (request) {
                        return _this.requiredResponse(_this.getCompilerOptionsDiagnostics(request.arguments));
                    },
                    _a[server.CommandNames.EncodedSemanticClassificationsFull] = function (request) {
                        return _this.requiredResponse(_this.getEncodedSemanticClassifications(request.arguments));
                    },
                    _a[server.CommandNames.Cleanup] = function () {
                        _this.cleanup();
                        return _this.requiredResponse(true);
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
                        _this.doOutput(undefined, server.CommandNames.Configure, request.seq, true);
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
                        return _this.requiredResponse(_this.getNavigateToItems(request.arguments, true));
                    },
                    _a[server.CommandNames.NavtoFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigateToItems(request.arguments, false));
                    },
                    _a[server.CommandNames.Brace] = function (request) {
                        return _this.requiredResponse(_this.getBraceMatching(request.arguments, true));
                    },
                    _a[server.CommandNames.BraceFull] = function (request) {
                        return _this.requiredResponse(_this.getBraceMatching(request.arguments, false));
                    },
                    _a[server.CommandNames.NavBar] = function (request) {
                        return _this.requiredResponse(_this.getNavigationBarItems(request.arguments, true));
                    },
                    _a[server.CommandNames.NavBarFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigationBarItems(request.arguments, false));
                    },
                    _a[server.CommandNames.NavTree] = function (request) {
                        return _this.requiredResponse(_this.getNavigationTree(request.arguments, true));
                    },
                    _a[server.CommandNames.NavTreeFull] = function (request) {
                        return _this.requiredResponse(_this.getNavigationTree(request.arguments, false));
                    },
                    _a[server.CommandNames.Occurrences] = function (request) {
                        return _this.requiredResponse(_this.getOccurrences(request.arguments));
                    },
                    _a[server.CommandNames.DocumentHighlights] = function (request) {
                        return _this.requiredResponse(_this.getDocumentHighlights(request.arguments, true));
                    },
                    _a[server.CommandNames.DocumentHighlightsFull] = function (request) {
                        return _this.requiredResponse(_this.getDocumentHighlights(request.arguments, false));
                    },
                    _a[server.CommandNames.CompilerOptionsForInferredProjects] = function (request) {
                        _this.setCompilerOptionsForInferredProjects(request.arguments);
                        return _this.requiredResponse(true);
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
                        return _this.requiredResponse(_this.getCodeFixes(request.arguments, true));
                    },
                    _a[server.CommandNames.GetCodeFixesFull] = function (request) {
                        return _this.requiredResponse(_this.getCodeFixes(request.arguments, false));
                    },
                    _a[server.CommandNames.GetCombinedCodeFix] = function (request) {
                        return _this.requiredResponse(_this.getCombinedCodeFix(request.arguments, true));
                    },
                    _a[server.CommandNames.GetCombinedCodeFixFull] = function (request) {
                        return _this.requiredResponse(_this.getCombinedCodeFix(request.arguments, false));
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
                        return _this.requiredResponse(_this.getEditsForRefactor(request.arguments, true));
                    },
                    _a[server.CommandNames.GetEditsForRefactorFull] = function (request) {
                        return _this.requiredResponse(_this.getEditsForRefactor(request.arguments, false));
                    },
                    _a[server.CommandNames.OrganizeImports] = function (request) {
                        return _this.requiredResponse(_this.organizeImports(request.arguments, true));
                    },
                    _a[server.CommandNames.OrganizeImportsFull] = function (request) {
                        return _this.requiredResponse(_this.organizeImports(request.arguments, false));
                    },
                    _a[server.CommandNames.GetEditsForFileRename] = function (request) {
                        return _this.requiredResponse(_this.getEditsForFileRename(request.arguments, true));
                    },
                    _a[server.CommandNames.GetEditsForFileRenameFull] = function (request) {
                        return _this.requiredResponse(_this.getEditsForFileRename(request.arguments, false));
                    },
                    _a));
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
                    syntaxOnly: opts.syntaxOnly,
                };
                this.projectService = new server.ProjectService(settings);
                this.gcTimer = new server.GcTimer(this.host, 7000, this.logger);
            }
            Session.prototype.sendRequestCompletedEvent = function (requestId) {
                this.event({ request_seq: requestId }, "requestCompleted");
            };
            Session.prototype.defaultEventHandler = function (event) {
                switch (event.eventName) {
                    case server.ProjectsUpdatedInBackgroundEvent:
                        var openFiles = event.data.openFiles;
                        this.projectsUpdatedInBackgroundEvent(openFiles);
                        break;
                    case server.LargeFileReferencedEvent:
                        var _a = event.data, file = _a.file, fileSize = _a.fileSize, maxFileSize_1 = _a.maxFileSize;
                        this.event({ file: file, fileSize: fileSize, maxFileSize: maxFileSize_1 }, "largeFileReferenced");
                        break;
                    case server.ConfigFileDiagEvent:
                        var _b = event.data, triggerFile = _b.triggerFile, configFile = _b.configFileName, diagnostics = _b.diagnostics;
                        var bakedDiags = ts.map(diagnostics, function (diagnostic) { return formatConfigFileDiag(diagnostic, true); });
                        this.event({
                            triggerFile: triggerFile,
                            configFile: configFile,
                            diagnostics: bakedDiags
                        }, "configFileDiag");
                        break;
                    case server.SurveyReady:
                        var surveyId = event.data.surveyId;
                        this.event({ surveyId: surveyId }, "surveyReady");
                        break;
                    case server.ProjectLanguageServiceStateEvent: {
                        var eventName = "projectLanguageServiceState";
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
                        var checkList_1 = this.createCheckList(openFiles);
                        this.errorCheck.startNew(function (next) { return _this.updateErrorCheck(next, checkList_1, 100, true); });
                    }
                    this.event({
                        openFiles: openFiles
                    }, "projectsUpdatedInBackground");
                }
            };
            Session.prototype.logError = function (err, cmd) {
                var msg = "Exception on executing command " + cmd;
                if (err.message) {
                    msg += ":\n" + server.indent(err.message);
                    if (err.stack) {
                        msg += "\n" + server.indent(err.stack);
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
                this.host.write(formatMessage(msg, this.logger, this.byteLength, this.host.newLine));
            };
            Session.prototype.event = function (body, eventName) {
                this.send(toEvent(eventName, body));
            };
            Session.prototype.output = function (info, cmdName, reqSeq, errorMsg) {
                this.doOutput(info, cmdName, reqSeq, !errorMsg, errorMsg);
            };
            Session.prototype.doOutput = function (info, cmdName, reqSeq, success, message) {
                var res = {
                    seq: 0,
                    type: "response",
                    command: cmdName,
                    request_seq: reqSeq,
                    success: success,
                };
                if (success) {
                    res.body = info;
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
                    : project.getLanguageService().getSemanticDiagnostics(file);
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
            Session.prototype.updateErrorCheck = function (next, checkList, ms, requireOpen) {
                var _this = this;
                if (requireOpen === void 0) { requireOpen = true; }
                ts.Debug.assert(!this.suppressDiagnosticEvents);
                var seq = this.changeSeq;
                var followMs = Math.min(ms, 200);
                var index = 0;
                var checkOne = function () {
                    if (_this.changeSeq !== seq) {
                        return;
                    }
                    var _a = checkList[index], fileName = _a.fileName, project = _a.project;
                    index++;
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
                        var goNext = function () {
                            if (checkList.length > index) {
                                next.delay(followMs, checkOne);
                            }
                        };
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
                for (var _i = 0, projects_5 = projects; _i < projects_5.length; _i++) {
                    var p = projects_5[_i];
                    p.getLanguageService(false).cleanupSemanticCache();
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
                    ts.map(diagnosticsForConfigFile, function (diagnostic) { return formatConfigFileDiag(diagnostic, false); });
            };
            Session.prototype.convertToDiagnosticsWithLinePositionFromDiagnosticFile = function (diagnostics) {
                var _this = this;
                return diagnostics.map(function (d) { return ({
                    message: ts.flattenDiagnosticMessageText(d.messageText, _this.host.newLine),
                    start: d.start,
                    length: d.length,
                    category: ts.diagnosticCategoryName(d),
                    code: d.code,
                    startLocation: (d.file && convertToLocation(ts.getLineAndCharacterOfPosition(d.file, d.start))),
                    endLocation: (d.file && convertToLocation(ts.getLineAndCharacterOfPosition(d.file, d.start + d.length))),
                    relatedInformation: ts.map(d.relatedInformation, formatRelatedInformation)
                }); });
            };
            Session.prototype.getCompilerOptionsDiagnostics = function (args) {
                var project = this.getProject(args.projectFileName);
                return this.convertToDiagnosticsWithLinePosition(ts.filter(project.getLanguageService().getCompilerOptionsDiagnostics(), function (diagnostic) { return !diagnostic.file; }), undefined);
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
                var _this = this;
                return definitions.map(function (info) {
                    var newLoc = getMappedLocation(documentSpanLocation(info), _this.projectService, project);
                    return !newLoc ? info : {
                        containerKind: info.containerKind,
                        containerName: info.containerName,
                        fileName: newLoc.fileName,
                        kind: info.kind,
                        name: info.name,
                        textSpan: {
                            start: newLoc.position,
                            length: info.textSpan.length
                        },
                        originalFileName: info.fileName,
                        originalTextSpan: info.textSpan,
                    };
                });
            };
            Session.prototype.getDefinitionAndBoundSpan = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var scriptInfo = ts.Debug.assertDefined(project.getScriptInfo(file));
                var unmappedDefinitionAndBoundSpan = project.getLanguageService().getDefinitionAndBoundSpan(file, position);
                if (!unmappedDefinitionAndBoundSpan || !unmappedDefinitionAndBoundSpan.definitions) {
                    return {
                        definitions: server.emptyArray,
                        textSpan: undefined
                    };
                }
                var definitions = this.mapDefinitionInfoLocations(unmappedDefinitionAndBoundSpan.definitions, project);
                var textSpan = unmappedDefinitionAndBoundSpan.textSpan;
                if (simplifiedResult) {
                    return {
                        definitions: this.mapDefinitionInfo(definitions, project),
                        textSpan: this.toLocationTextSpan(textSpan, scriptInfo)
                    };
                }
                return {
                    definitions: definitions.map(Session.mapToOriginalLocation),
                    textSpan: textSpan,
                };
            };
            Session.prototype.getEmitOutput = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                return project.getLanguageService().getEmitOutput(file);
            };
            Session.prototype.mapDefinitionInfo = function (definitions, project) {
                var _this = this;
                return definitions.map(function (def) { return _this.toFileSpan(def.fileName, def.textSpan, project); });
            };
            Session.mapToOriginalLocation = function (def) {
                if (def.originalFileName) {
                    ts.Debug.assert(def.originalTextSpan !== undefined, "originalTextSpan should be present if originalFileName is");
                    return __assign({}, def, { fileName: def.originalFileName, textSpan: def.originalTextSpan, targetFileName: def.fileName, targetTextSpan: def.textSpan });
                }
                return def;
            };
            Session.prototype.toFileSpan = function (fileName, textSpan, project) {
                var ls = project.getLanguageService();
                var start = ls.toLineColumnOffset(fileName, textSpan.start);
                var end = ls.toLineColumnOffset(fileName, ts.textSpanEnd(textSpan));
                return {
                    file: fileName,
                    start: { line: start.line + 1, offset: start.character + 1 },
                    end: { line: end.line + 1, offset: end.character + 1 }
                };
            };
            Session.prototype.getTypeDefinition = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var definitions = this.mapDefinitionInfoLocations(project.getLanguageService().getTypeDefinitionAtPosition(file, position) || server.emptyArray, project);
                return this.mapDefinitionInfo(definitions, project);
            };
            Session.prototype.mapImplementationLocations = function (implementations, project) {
                var _this = this;
                return implementations.map(function (info) {
                    var newLoc = getMappedLocation(documentSpanLocation(info), _this.projectService, project);
                    return !newLoc ? info : {
                        fileName: newLoc.fileName,
                        kind: info.kind,
                        displayParts: info.displayParts,
                        textSpan: {
                            start: newLoc.position,
                            length: info.textSpan.length
                        },
                        originalFileName: info.fileName,
                        originalTextSpan: info.textSpan,
                    };
                });
            };
            Session.prototype.getImplementation = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var implementations = this.mapImplementationLocations(project.getLanguageService().getImplementationAtPosition(file, position) || server.emptyArray, project);
                if (simplifiedResult) {
                    return implementations.map(function (_a) {
                        var fileName = _a.fileName, textSpan = _a.textSpan;
                        return _this.toFileSpan(fileName, textSpan, project);
                    });
                }
                return implementations.map(Session.mapToOriginalLocation);
            };
            Session.prototype.getOccurrences = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var occurrences = project.getLanguageService().getOccurrencesAtPosition(file, position);
                if (!occurrences) {
                    return server.emptyArray;
                }
                return occurrences.map(function (occurrence) {
                    var fileName = occurrence.fileName, isWriteAccess = occurrence.isWriteAccess, textSpan = occurrence.textSpan, isInString = occurrence.isInString;
                    var scriptInfo = project.getScriptInfo(fileName);
                    var result = {
                        start: scriptInfo.positionToLineOffset(textSpan.start),
                        end: scriptInfo.positionToLineOffset(ts.textSpanEnd(textSpan)),
                        file: fileName,
                        isWriteAccess: isWriteAccess,
                    };
                    if (isInString) {
                        result.isInString = isInString;
                    }
                    return result;
                });
            };
            Session.prototype.getSyntacticDiagnosticsSync = function (args) {
                var configFile = this.getConfigFileAndProject(args).configFile;
                if (configFile) {
                    return server.emptyArray;
                }
                return this.getDiagnosticsWorker(args, false, function (project, file) { return project.getLanguageService().getSyntacticDiagnostics(file); }, !!args.includeLinePosition);
            };
            Session.prototype.getSemanticDiagnosticsSync = function (args) {
                var _a = this.getConfigFileAndProject(args), configFile = _a.configFile, project = _a.project;
                if (configFile) {
                    return this.getConfigFileDiagnostics(configFile, project, !!args.includeLinePosition);
                }
                return this.getDiagnosticsWorker(args, true, function (project, file) { return project.getLanguageService().getSemanticDiagnostics(file); }, !!args.includeLinePosition);
            };
            Session.prototype.getSuggestionDiagnosticsSync = function (args) {
                var configFile = this.getConfigFileAndProject(args).configFile;
                if (configFile) {
                    return server.emptyArray;
                }
                return this.getDiagnosticsWorker(args, true, function (project, file) { return project.getLanguageService().getSuggestionDiagnostics(file); }, !!args.includeLinePosition);
            };
            Session.prototype.getJsxClosingTag = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var tag = project.getLanguageService().getJsxClosingTagAtPosition(file, position);
                return tag === undefined ? undefined : { newText: tag.newText, caretOffset: 0 };
            };
            Session.prototype.getDocumentHighlights = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                var documentHighlights = project.getLanguageService().getDocumentHighlights(file, position, args.filesToSearch);
                if (!documentHighlights) {
                    return server.emptyArray;
                }
                if (simplifiedResult) {
                    return documentHighlights.map(convertToDocumentHighlightsItem);
                }
                else {
                    return documentHighlights;
                }
                function convertToDocumentHighlightsItem(documentHighlights) {
                    var fileName = documentHighlights.fileName, highlightSpans = documentHighlights.highlightSpans;
                    var scriptInfo = project.getScriptInfo(fileName);
                    return {
                        file: fileName,
                        highlightSpans: highlightSpans.map(convertHighlightSpan)
                    };
                    function convertHighlightSpan(highlightSpan) {
                        var textSpan = highlightSpan.textSpan, kind = highlightSpan.kind;
                        var start = scriptInfo.positionToLineOffset(textSpan.start);
                        var end = scriptInfo.positionToLineOffset(ts.textSpanEnd(textSpan));
                        return { start: start, end: end, kind: kind };
                    }
                }
            };
            Session.prototype.setCompilerOptionsForInferredProjects = function (args) {
                this.projectService.setCompilerOptionsForInferredProjects(args.options, args.projectRootPath);
            };
            Session.prototype.getProjectInfo = function (args) {
                return this.getProjectInfoWorker(args.file, args.projectFileName, args.needFileNameList, false);
            };
            Session.prototype.getProjectInfoWorker = function (uncheckedFileName, projectFileName, needFileNameList, excludeConfigFiles) {
                var project = this.getFileAndProjectWorker(uncheckedFileName, projectFileName).project;
                server.updateProjectIfDirty(project);
                var projectInfo = {
                    configFileName: project.getProjectName(),
                    languageServiceDisabled: !project.languageServiceEnabled,
                    fileNames: needFileNameList ? project.getFileNames(false, excludeConfigFiles) : undefined
                };
                return projectInfo;
            };
            Session.prototype.getRenameInfo = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var position = this.getPositionInFile(args, file);
                return project.getLanguageService().getRenameInfo(file, position);
            };
            Session.prototype.getProjects = function (args, getScriptInfoEnsuringProjectsUptoDate, ignoreNoProjectError) {
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
                        return ignoreNoProjectError ? server.emptyArray : server.Errors.ThrowNoProject();
                    }
                    projects = scriptInfo.containingProjects;
                    symLinkedProjects = this.projectService.getSymlinkedProjects(scriptInfo);
                }
                projects = ts.filter(projects, function (p) { return p.languageServiceEnabled && !p.isOrphan(); });
                if (!ignoreNoProjectError && (!projects || !projects.length) && !symLinkedProjects) {
                    return server.Errors.ThrowNoProject();
                }
                return symLinkedProjects ? { projects: projects, symLinkedProjects: symLinkedProjects } : projects;
            };
            Session.prototype.getDefaultProject = function (args) {
                if (args.projectFileName) {
                    var project = this.getProject(args.projectFileName);
                    if (project) {
                        return project;
                    }
                }
                var info = this.projectService.getScriptInfo(args.file);
                return info.getDefaultProject();
            };
            Session.prototype.getRenameLocations = function (args, simplifiedResult) {
                var file = server.toNormalizedPath(args.file);
                var position = this.getPositionInFile(args, file);
                var projects = this.getProjects(args);
                var locations = combineProjectOutputForRenameLocations(projects, this.getDefaultProject(args), { fileName: args.file, position: position }, this.projectService, !!args.findInStrings, !!args.findInComments);
                if (!simplifiedResult)
                    return locations;
                var defaultProject = this.getDefaultProject(args);
                var renameInfo = this.mapRenameInfo(defaultProject.getLanguageService().getRenameInfo(file, position), ts.Debug.assertDefined(this.projectService.getScriptInfo(file)));
                return { info: renameInfo, locs: this.toSpanGroups(locations) };
            };
            Session.prototype.mapRenameInfo = function (info, scriptInfo) {
                if (info.canRename) {
                    var canRename = info.canRename, fileToRename = info.fileToRename, displayName = info.displayName, fullDisplayName = info.fullDisplayName, kind = info.kind, kindModifiers = info.kindModifiers, triggerSpan = info.triggerSpan;
                    return ts.identity({ canRename: canRename, fileToRename: fileToRename, displayName: displayName, fullDisplayName: fullDisplayName, kind: kind, kindModifiers: kindModifiers, triggerSpan: this.toLocationTextSpan(triggerSpan, scriptInfo) });
                }
                else {
                    return info;
                }
            };
            Session.prototype.toSpanGroups = function (locations) {
                var map = ts.createMap();
                for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                    var _a = locations_1[_i], fileName = _a.fileName, textSpan = _a.textSpan;
                    var group_1 = map.get(fileName);
                    if (!group_1)
                        map.set(fileName, group_1 = { file: fileName, locs: [] });
                    group_1.locs.push(this.toLocationTextSpan(textSpan, ts.Debug.assertDefined(this.projectService.getScriptInfo(fileName))));
                }
                return ts.arrayFrom(map.values());
            };
            Session.prototype.getReferences = function (args, simplifiedResult) {
                var _this = this;
                var file = server.toNormalizedPath(args.file);
                var projects = this.getProjects(args);
                var position = this.getPositionInFile(args, file);
                var references = combineProjectOutputForReferences(projects, this.getDefaultProject(args), { fileName: args.file, position: position }, this.projectService);
                if (simplifiedResult) {
                    var defaultProject = this.getDefaultProject(args);
                    var scriptInfo = defaultProject.getScriptInfoForNormalizedPath(file);
                    var nameInfo = defaultProject.getLanguageService().getQuickInfoAtPosition(file, position);
                    var symbolDisplayString = nameInfo ? ts.displayPartsToString(nameInfo.displayParts) : "";
                    var nameSpan = nameInfo && nameInfo.textSpan;
                    var symbolStartOffset = nameSpan ? scriptInfo.positionToLineOffset(nameSpan.start).offset : 0;
                    var symbolName_1 = nameSpan ? scriptInfo.getSnapshot().getText(nameSpan.start, ts.textSpanEnd(nameSpan)) : "";
                    var refs = ts.flatMap(references, function (referencedSymbol) {
                        return referencedSymbol.references.map(function (_a) {
                            var fileName = _a.fileName, textSpan = _a.textSpan, isWriteAccess = _a.isWriteAccess, isDefinition = _a.isDefinition;
                            var scriptInfo = ts.Debug.assertDefined(_this.projectService.getScriptInfo(fileName));
                            var start = scriptInfo.positionToLineOffset(textSpan.start);
                            var lineSpan = scriptInfo.lineToTextSpan(start.line - 1);
                            var lineText = scriptInfo.getSnapshot().getText(lineSpan.start, ts.textSpanEnd(lineSpan)).replace(/\r|\n/g, "");
                            return __assign({}, toFileSpan(fileName, textSpan, scriptInfo), { lineText: lineText, isWriteAccess: isWriteAccess, isDefinition: isDefinition });
                        });
                    });
                    var result = { refs: refs, symbolName: symbolName_1, symbolStartOffset: symbolStartOffset, symbolDisplayString: symbolDisplayString };
                    return result;
                }
                else {
                    return references;
                }
            };
            Session.prototype.openClientFile = function (fileName, fileContent, scriptKind, projectRootPath) {
                this.projectService.openClientFileWithNormalizedPath(fileName, fileContent, scriptKind, false, projectRootPath);
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
                var file = server.toNormalizedPath(args.file);
                var project = this.getProject(args.projectFileName) || this.projectService.tryGetDefaultProjectForFile(file);
                if (!project) {
                    return server.Errors.ThrowNoProject();
                }
                return {
                    file: file,
                    languageService: project.getLanguageService(false)
                };
            };
            Session.prototype.getFileAndProjectWorker = function (uncheckedFileName, projectFileName) {
                var file = server.toNormalizedPath(uncheckedFileName);
                var project = this.getProject(projectFileName) || this.projectService.ensureDefaultProjectForFile(file);
                return { file: file, project: project };
            };
            Session.prototype.getOutliningSpans = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var spans = languageService.getOutliningSpans(file);
                if (simplifiedResult) {
                    var scriptInfo_1 = this.projectService.getScriptInfoForNormalizedPath(file);
                    return spans.map(function (s) { return ({
                        textSpan: _this.toLocationTextSpan(s.textSpan, scriptInfo_1),
                        hintSpan: _this.toLocationTextSpan(s.hintSpan, scriptInfo_1),
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
                var edits = languageService.getFormattingEditsForRange(file, startPosition, endPosition, this.getFormatOptions(file));
                if (!edits) {
                    return undefined;
                }
                return edits.map(function (edit) { return _this.convertTextChangeToCodeEdit(edit, scriptInfo); });
            };
            Session.prototype.getFormattingEditsForRangeFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsForRange(file, args.position, args.endPosition, options);
            };
            Session.prototype.getFormattingEditsForDocumentFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsForDocument(file, options);
            };
            Session.prototype.getFormattingEditsAfterKeystrokeFull = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var options = args.options ? server.convertFormatOptions(args.options) : this.getFormatOptions(file);
                return languageService.getFormattingEditsAfterKeystroke(file, args.position, args.key, options);
            };
            Session.prototype.getFormattingEditsAfterKeystroke = function (args) {
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = scriptInfo.lineOffsetToPosition(args.line, args.offset);
                var formatOptions = this.getFormatOptions(file);
                var edits = languageService.getFormattingEditsAfterKeystroke(file, position, args.key, formatOptions);
                if ((args.key === "\n") && ((!edits) || (edits.length === 0) || allEditsBeforePos(edits, position))) {
                    var _b = scriptInfo.getLineInfo(args.line), lineText = _b.lineText, absolutePosition = _b.absolutePosition;
                    if (lineText && lineText.search("\\S") < 0) {
                        var preferredIndent = languageService.getIndentationAtPosition(file, position, formatOptions);
                        var hasIndent = 0;
                        var i = void 0, len = void 0;
                        for (i = 0, len = lineText.length; i < len; i++) {
                            if (lineText.charAt(i) === " ") {
                                hasIndent++;
                            }
                            else if (lineText.charAt(i) === "\t") {
                                hasIndent += formatOptions.tabSize;
                            }
                            else {
                                break;
                            }
                        }
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
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var completions = project.getLanguageService().getCompletionsAtPosition(file, position, __assign({}, server.convertUserPreferences(this.getPreferences(file)), { triggerCharacter: args.triggerCharacter, includeExternalModuleExports: args.includeExternalModuleExports, includeInsertTextCompletions: args.includeInsertTextCompletions }));
                if (completions === undefined)
                    return undefined;
                if (kind === "completions-full")
                    return completions;
                var prefix = args.prefix || "";
                var entries = ts.mapDefined(completions.entries, function (entry) {
                    if (completions.isMemberCompletion || ts.startsWith(entry.name.toLowerCase(), prefix.toLowerCase())) {
                        var name = entry.name, kind_1 = entry.kind, kindModifiers = entry.kindModifiers, sortText = entry.sortText, insertText = entry.insertText, replacementSpan = entry.replacementSpan, hasAction = entry.hasAction, source = entry.source, isRecommended = entry.isRecommended;
                        var convertedSpan = replacementSpan ? _this.toLocationTextSpan(replacementSpan, scriptInfo) : undefined;
                        return { name: name, kind: kind_1, kindModifiers: kindModifiers, sortText: sortText, insertText: insertText, replacementSpan: convertedSpan, hasAction: hasAction || undefined, source: source, isRecommended: isRecommended };
                    }
                }).sort(function (a, b) { return ts.compareStringsCaseSensitiveUI(a.name, b.name); });
                if (kind === "completions")
                    return entries;
                var res = __assign({}, completions, { entries: entries });
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
                    ? result.map(function (details) { return (__assign({}, details, { codeActions: ts.map(details.codeActions, function (action) { return _this.mapCodeAction(action); }) })); })
                    : result;
            };
            Session.prototype.getCompileOnSaveAffectedFileList = function (args) {
                var _this = this;
                var projects = this.getProjects(args, true, true);
                var info = this.projectService.getScriptInfo(args.file);
                if (!info) {
                    return server.emptyArray;
                }
                return combineProjectOutput(info, function (path) { return _this.projectService.getScriptInfoForPath(path); }, projects, function (project, info) {
                    var result;
                    if (project.compileOnSaveEnabled && project.languageServiceEnabled && !project.isOrphan() && !project.getCompilationSettings().noEmit) {
                        result = {
                            projectFileName: project.getProjectName(),
                            fileNames: project.getCompileOnSaveAffectedFileList(info),
                            projectUsesOutFile: !!project.getCompilationSettings().outFile || !!project.getCompilationSettings().out
                        };
                    }
                    return result;
                });
            };
            Session.prototype.emitFile = function (args) {
                var _this = this;
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                if (!project) {
                    server.Errors.ThrowNoProject();
                }
                if (!project.languageServiceEnabled) {
                    return false;
                }
                var scriptInfo = project.getScriptInfo(file);
                return project.emitFile(scriptInfo, function (path, data, writeByteOrderMark) { return _this.host.writeFile(path, data, writeByteOrderMark); });
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
            Session.prototype.createCheckList = function (fileNames, defaultProject) {
                var _this = this;
                return ts.mapDefined(fileNames, function (uncheckedFileName) {
                    var fileName = server.toNormalizedPath(uncheckedFileName);
                    var project = defaultProject || _this.projectService.tryGetDefaultProjectForFile(fileName);
                    return project && { fileName: fileName, project: project };
                });
            };
            Session.prototype.getDiagnostics = function (next, delay, fileNames) {
                if (this.suppressDiagnosticEvents) {
                    return;
                }
                var checkList = this.createCheckList(fileNames);
                if (checkList.length > 0) {
                    this.updateErrorCheck(next, checkList, delay);
                }
            };
            Session.prototype.change = function (args) {
                var scriptInfo = this.projectService.getScriptInfo(args.file);
                ts.Debug.assert(!!scriptInfo);
                var start = scriptInfo.lineOffsetToPosition(args.line, args.offset);
                var end = scriptInfo.lineOffsetToPosition(args.endLine, args.endOffset);
                if (start >= 0) {
                    this.changeSeq++;
                    this.projectService.applyChangesToFile(scriptInfo, [{
                            span: { start: start, length: end - start },
                            newText: args.insertString
                        }]);
                }
            };
            Session.prototype.reload = function (args, reqSeq) {
                var file = server.toNormalizedPath(args.file);
                var tempFileName = args.tmpfile === undefined ? undefined : server.toNormalizedPath(args.tmpfile);
                var info = this.projectService.getScriptInfoForNormalizedPath(file);
                if (info) {
                    this.changeSeq++;
                    if (info.reloadFromFile(tempFileName)) {
                        this.doOutput(undefined, server.CommandNames.Reload, reqSeq, true);
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
                    spans: item.spans.map(function (span) { return _this.toLocationTextSpan(span, scriptInfo); }),
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
                    spans: tree.spans.map(function (span) { return _this.toLocationTextSpan(span, scriptInfo); }),
                    nameSpan: tree.nameSpan && this.toLocationTextSpan(tree.nameSpan, scriptInfo),
                    childItems: ts.map(tree.childItems, function (item) { return _this.toLocationNavigationTree(item, scriptInfo); })
                };
            };
            Session.prototype.toLocationTextSpan = function (span, scriptInfo) {
                return {
                    start: scriptInfo.positionToLineOffset(span.start),
                    end: scriptInfo.positionToLineOffset(ts.textSpanEnd(span))
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
                var _this = this;
                var full = this.getFullNavigateToItems(args);
                return !simplifiedResult ? full : full.map(function (navItem) {
                    var _a = _this.getFileAndProject({ file: navItem.fileName }), file = _a.file, project = _a.project;
                    var scriptInfo = project.getScriptInfo(file);
                    var bakedItem = {
                        name: navItem.name,
                        kind: navItem.kind,
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
            };
            Session.prototype.getFullNavigateToItems = function (args) {
                var currentFileOnly = args.currentFileOnly, searchValue = args.searchValue, maxResultCount = args.maxResultCount;
                if (currentFileOnly) {
                    var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                    return project.getLanguageService().getNavigateToItems(searchValue, maxResultCount, file);
                }
                else {
                    return combineProjectOutputWhileOpeningReferencedProjects(this.getProjects(args), this.getDefaultProject(args), this.projectService, function (project) {
                        return project.getLanguageService().getNavigateToItems(searchValue, maxResultCount, undefined, project.isNonTsProject());
                    }, documentSpanLocation, navigateToItemIsEqualTo);
                }
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
                        a.kindModifiers === b.containerName &&
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
            Session.prototype.extractPositionAndRange = function (args, scriptInfo) {
                var position;
                var textRange;
                if (this.isLocation(args)) {
                    position = getPosition(args);
                }
                else {
                    var _a = this.getStartAndEndPosition(args, scriptInfo), startPosition = _a.startPosition, endPosition = _a.endPosition;
                    textRange = { pos: startPosition, end: endPosition };
                }
                return { position: position, textRange: textRange };
                function getPosition(loc) {
                    return loc.position !== undefined ? loc.position : scriptInfo.lineOffsetToPosition(loc.line, loc.offset);
                }
            };
            Session.prototype.getApplicableRefactors = function (args) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                var _b = this.extractPositionAndRange(args, scriptInfo), position = _b.position, textRange = _b.textRange;
                return project.getLanguageService().getApplicableRefactors(file, position || textRange, this.getPreferences(file));
            };
            Session.prototype.getEditsForRefactor = function (args, simplifiedResult) {
                var _a = this.getFileAndProject(args), file = _a.file, project = _a.project;
                var scriptInfo = project.getScriptInfoForNormalizedPath(file);
                var _b = this.extractPositionAndRange(args, scriptInfo), position = _b.position, textRange = _b.textRange;
                var result = project.getLanguageService().getEditsForRefactor(file, this.getFormatOptions(file), position || textRange, args.refactor, args.action, this.getPreferences(file));
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
                var changes = combineProjectOutputFromEveryProject(this.projectService, function (project) { return project.getLanguageService().getEditsForFileRename(oldPath, newPath, formatOptions, preferences); }, function (a, b) { return a.fileName === b.fileName; });
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
                var commands = args.command;
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
            Session.prototype.mapTextChangeToCodeEdit = function (change) {
                return mapTextChangesToCodeEdits(change, this.projectService.getScriptInfoOrConfig(change.fileName));
            };
            Session.prototype.convertTextChangeToCodeEdit = function (change, scriptInfo) {
                return {
                    start: scriptInfo.positionToLineOffset(change.span.start),
                    end: scriptInfo.positionToLineOffset(change.span.start + change.span.length),
                    newText: change.newText ? change.newText : ""
                };
            };
            Session.prototype.getBraceMatching = function (args, simplifiedResult) {
                var _this = this;
                var _a = this.getFileAndLanguageServiceForSyntacticOperation(args), file = _a.file, languageService = _a.languageService;
                var scriptInfo = this.projectService.getScriptInfoForNormalizedPath(file);
                var position = this.getPosition(args, scriptInfo);
                var spans = languageService.getBraceMatchingAtPosition(file, position);
                return !spans
                    ? undefined
                    : simplifiedResult
                        ? spans.map(function (span) { return _this.toLocationTextSpan(span, scriptInfo); })
                        : spans;
            };
            Session.prototype.getDiagnosticsForProject = function (next, delay, fileName) {
                if (this.suppressDiagnosticEvents) {
                    return;
                }
                var _a = this.getProjectInfoWorker(fileName, undefined, true, true), fileNames = _a.fileNames, languageServiceDisabled = _a.languageServiceDisabled;
                if (languageServiceDisabled) {
                    return;
                }
                var fileNamesInProject = fileNames.filter(function (value) { return !ts.stringContains(value, "lib.d.ts"); });
                if (fileNamesInProject.length === 0) {
                    return;
                }
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
                        var info = this.projectService.getScriptInfo(fileNameInProject);
                        if (!info.isScriptOpen()) {
                            if (ts.fileExtensionIs(fileNameInProject, ".d.ts")) {
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
                var sortedFiles = highPriorityFiles.concat(mediumPriorityFiles, lowPriorityFiles, veryLowPriorityFiles);
                var checkList = sortedFiles.map(function (fileName) { return ({ fileName: fileName, project: project }); });
                this.updateErrorCheck(next, checkList, delay, false);
            };
            Session.prototype.getCanonicalFileName = function (fileName) {
                var name = this.host.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
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
                this.currentRequestId = undefined;
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
                    this.doOutput(undefined, server.CommandNames.Unknown, request.seq, false, "Unrecognized JSON command: " + request.command);
                    return { responseRequired: false };
                }
            };
            Session.prototype.onMessage = function (message) {
                this.gcTimer.scheduleCollect();
                var start;
                if (this.logger.hasLevel(server.LogLevel.requestTime)) {
                    start = this.hrtime();
                    if (this.logger.hasLevel(server.LogLevel.verbose)) {
                        this.logger.info("request:" + server.indent(message));
                    }
                }
                var request;
                try {
                    request = JSON.parse(message);
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
                    if (response) {
                        this.doOutput(response, request.command, request.seq, true);
                    }
                    else if (responseRequired) {
                        this.doOutput(undefined, request.command, request.seq, false, "No content available.");
                    }
                }
                catch (err) {
                    if (err instanceof ts.OperationCanceledException) {
                        this.doOutput({ canceled: true }, request.command, request.seq, true);
                        return;
                    }
                    this.logError(err, message);
                    this.doOutput(undefined, request ? request.command : server.CommandNames.Unknown, request ? request.seq : 0, false, "Error processing request. " + err.message + "\n" + err.stack);
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
        function toFileSpan(fileName, textSpan, scriptInfo) {
            return { file: fileName, start: scriptInfo.positionToLineOffset(textSpan.start), end: scriptInfo.positionToLineOffset(ts.textSpanEnd(textSpan)) };
        }
        function mapTextChangesToCodeEdits(textChanges, scriptInfo) {
            ts.Debug.assert(!!textChanges.isNewFile === !scriptInfo, "Expected isNewFile for (only) new files", function () { return JSON.stringify({ isNewFile: !!textChanges.isNewFile, hasScriptInfo: !!scriptInfo }); });
            return scriptInfo
                ? { fileName: textChanges.fileName, textChanges: textChanges.textChanges.map(function (textChange) { return convertTextChangeToCodeEdit(textChange, scriptInfo); }) }
                : convertNewFileTextChangeToCodeEdit(textChanges);
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
        var EditWalker = (function () {
            function EditWalker() {
                this.goSubtree = true;
                this.lineIndex = new LineIndex();
                this.endBranch = [];
                this.state = 2;
                this.initialText = "";
                this.trailingText = "";
                this.lineIndex.root = new LineNode();
                this.startPath = [this.lineIndex.root];
                this.stack = [this.lineIndex.root];
            }
            Object.defineProperty(EditWalker.prototype, "done", {
                get: function () { return false; },
                enumerable: true,
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
                    insertionNode.remove(leafNode);
                    for (var j = this.startPath.length - 2; j >= 0; j--) {
                        this.startPath[j].updateCounts();
                    }
                }
                return this.lineIndex;
            };
            EditWalker.prototype.post = function (_relativeStart, _relativeLength, lineCollection) {
                if (lineCollection === this.lineCollectionAtBranch) {
                    this.state = 4;
                }
                this.stack.pop();
            };
            EditWalker.prototype.pre = function (_relativeStart, _relativeLength, lineCollection, _parent, nodeType) {
                var currentNode = this.stack[this.stack.length - 1];
                if ((this.state === 2) && (nodeType === 1)) {
                    this.state = 1;
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
                    case 0:
                        this.goSubtree = false;
                        if (this.state !== 4) {
                            currentNode.add(lineCollection);
                        }
                        break;
                    case 1:
                        if (this.state === 4) {
                            this.goSubtree = false;
                        }
                        else {
                            child = fresh(lineCollection);
                            currentNode.add(child);
                            this.startPath.push(child);
                        }
                        break;
                    case 2:
                        if (this.state !== 4) {
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
                    case 3:
                        this.goSubtree = false;
                        break;
                    case 4:
                        if (this.state !== 4) {
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
                    case 5:
                        this.goSubtree = false;
                        if (this.state !== 1) {
                            currentNode.add(lineCollection);
                        }
                        break;
                }
                if (this.goSubtree) {
                    this.stack.push(child);
                }
            };
            EditWalker.prototype.leaf = function (relativeStart, relativeLength, ll) {
                if (this.state === 1) {
                    this.initialText = ll.text.substring(0, relativeStart);
                }
                else if (this.state === 2) {
                    this.initialText = ll.text.substring(0, relativeStart);
                    this.trailingText = ll.text.substring(relativeStart + relativeLength);
                }
                else {
                    this.trailingText = ll.text.substring(relativeStart + relativeLength);
                }
            };
            return EditWalker;
        }());
        var TextChange = (function () {
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
        var ScriptVersionCache = (function () {
            function ScriptVersionCache() {
                this.changes = [];
                this.versions = new Array(ScriptVersionCache.maxVersions);
                this.minVersion = 0;
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
            ScriptVersionCache.prototype.getLineInfo = function (line) {
                return this._getSnapshot().index.lineNumberToInfo(line);
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
                            var snap = this.versions[this.versionToIndex(i)];
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
        var LineIndexSnapshot = (function () {
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
        var LineIndex = (function () {
            function LineIndex() {
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
            LineIndex.prototype.lineNumberToInfo = function (oneBasedLine) {
                var lineCount = this.root.lineCount();
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
                    ts.Debug.assert(deleteLength === 0);
                    if (newText !== undefined) {
                        this.load(LineIndex.linesFromText(newText).lines);
                        return this;
                    }
                    return undefined;
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
                        var e = pos + deleteLength;
                        var _a = this.positionToColumnAndLineText(e), zeroBasedColumn = _a.zeroBasedColumn, lineText = _a.lineText;
                        if (zeroBasedColumn === 0) {
                            deleteLength += lineText.length;
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
        var LineNode = (function () {
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
                var childIndex = 0;
                var childCharCount = this.children[childIndex].charCount();
                var adjustedStart = rangeStart;
                while (adjustedStart >= childCharCount) {
                    this.skipChild(adjustedStart, rangeLength, childIndex, walkFns, 0);
                    adjustedStart -= childCharCount;
                    childIndex++;
                    childCharCount = this.children[childIndex].charCount();
                }
                if ((adjustedStart + rangeLength) <= childCharCount) {
                    if (this.execWalk(adjustedStart, rangeLength, walkFns, childIndex, 2)) {
                        return;
                    }
                }
                else {
                    if (this.execWalk(adjustedStart, childCharCount - adjustedStart, walkFns, childIndex, 1)) {
                        return;
                    }
                    var adjustedLength = rangeLength - (childCharCount - adjustedStart);
                    childIndex++;
                    var child = this.children[childIndex];
                    childCharCount = child.charCount();
                    while (adjustedLength > childCharCount) {
                        if (this.execWalk(0, childCharCount, walkFns, childIndex, 3)) {
                            return;
                        }
                        adjustedLength -= childCharCount;
                        childIndex++;
                        childCharCount = this.children[childIndex].charCount();
                    }
                    if (adjustedLength > 0) {
                        if (this.execWalk(0, adjustedLength, walkFns, childIndex, 4)) {
                            return;
                        }
                    }
                }
                if (walkFns.pre) {
                    var clen = this.children.length;
                    if (childIndex < (clen - 1)) {
                        for (var ej = childIndex + 1; ej < clen; ej++) {
                            this.skipChild(0, 0, ej, walkFns, 5);
                        }
                    }
                }
            };
            LineNode.prototype.charOffsetToLineInfo = function (lineNumberAccumulator, relativePosition) {
                if (this.children.length === 0) {
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
                var leaf = this.lineNumberToInfo(this.lineCount(), 0).leaf;
                return { oneBasedLine: this.lineCount(), zeroBasedColumn: leaf ? leaf.charCount() : 0, lineText: undefined };
            };
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
        var LineLeaf = (function () {
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