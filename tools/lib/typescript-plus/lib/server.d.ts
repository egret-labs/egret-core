declare namespace ts.server {
    interface CompressedData {
        length: number;
        compressionKind: string;
        data: any;
    }
    type RequireResult = {
        module: {};
        error: undefined;
    } | {
        module: undefined;
        error: {
            stack?: string;
            message?: string;
        };
    };
    interface ServerHost extends System {
        watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
        watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
        setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
        clearTimeout(timeoutId: any): void;
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): any;
        clearImmediate(timeoutId: any): void;
        gc?(): void;
        trace?(s: string): void;
        require?(initialPath: string, moduleName: string): RequireResult;
    }
}
declare namespace ts.server {
    enum LogLevel {
        terse = 0,
        normal = 1,
        requestTime = 2,
        verbose = 3
    }
    const emptyArray: SortedReadonlyArray<never>;
    interface Logger {
        close(): void;
        hasLevel(level: LogLevel): boolean;
        loggingEnabled(): boolean;
        perftrc(s: string): void;
        info(s: string): void;
        startGroup(): void;
        endGroup(): void;
        msg(s: string, type?: Msg): void;
        getLogFileName(): string | undefined;
    }
    enum Msg {
        Err = "Err",
        Info = "Info",
        Perf = "Perf"
    }
    namespace Msg {
        /** @deprecated Only here for backwards-compatibility. Prefer just `Msg`. */
        type Types = Msg;
    }
    function createInstallTypingsRequest(project: Project, typeAcquisition: TypeAcquisition, unresolvedImports: SortedReadonlyArray<string>, cachePath?: string): DiscoverTypings;
    namespace Errors {
        function ThrowNoProject(): never;
        function ThrowProjectLanguageServiceDisabled(): never;
        function ThrowProjectDoesNotContainDocument(fileName: string, project: Project): never;
    }
    type NormalizedPath = string & {
        __normalizedPathTag: any;
    };
    function toNormalizedPath(fileName: string): NormalizedPath;
    function normalizedPathToPath(normalizedPath: NormalizedPath, currentDirectory: string, getCanonicalFileName: (f: string) => string): Path;
    function asNormalizedPath(fileName: string): NormalizedPath;
    interface NormalizedPathMap<T> {
        get(path: NormalizedPath): T | undefined;
        set(path: NormalizedPath, value: T): void;
        contains(path: NormalizedPath): boolean;
        remove(path: NormalizedPath): void;
    }
    function createNormalizedPathMap<T>(): NormalizedPathMap<T>;
    interface ProjectOptions {
        configHasExtendsProperty: boolean;
        /**
         * true if config file explicitly listed files
         */
        configHasFilesProperty: boolean;
        configHasIncludeProperty: boolean;
        configHasExcludeProperty: boolean;
    }
    function isInferredProjectName(name: string): boolean;
    function makeInferredProjectName(counter: number): string;
    function createSortedArray<T>(): SortedArray<T>;
}
declare namespace ts.server {
    class ThrottledOperations {
        private readonly host;
        private readonly pendingTimeouts;
        private readonly logger?;
        constructor(host: ServerHost, logger: Logger);
        /**
         * Wait `number` milliseconds and then invoke `cb`.  If, while waiting, schedule
         * is called again with the same `operationId`, cancel this operation in favor
         * of the new one.  (Note that the amount of time the canceled operation had been
         * waiting does not affect the amount of time that the new operation waits.)
         */
        schedule(operationId: string, delay: number, cb: () => void): void;
        private static run;
    }
    class GcTimer {
        private readonly host;
        private readonly delay;
        private readonly logger;
        private timerId;
        constructor(host: ServerHost, delay: number, logger: Logger);
        scheduleCollect(): void;
        private static run;
    }
    function getBaseConfigFileName(configFilePath: NormalizedPath): "tsconfig.json" | "jsconfig.json" | undefined;
    function removeSorted<T>(array: SortedArray<T>, remove: T, compare: Comparer<T>): void;
    function indent(str: string): string;
    /** Put stringified JSON on the next line, indented. */
    function stringifyIndented(json: {}): string;
}
declare namespace ts {
    const enum WatchType {
        ClosedScriptInfo = "Closed Script info",
        ConfigFileForInferredRoot = "Config file for the inferred project root",
        NodeModulesForClosedScriptInfo = "node_modules for closed script infos in them",
        MissingSourceMapFile = "Missing source map file"
    }
}
/**
 * Declaration module describing the TypeScript Server protocol
 */
declare namespace ts.server.protocol {
    const enum CommandTypes {
        JsxClosingTag = "jsxClosingTag",
        Brace = "brace",
        BraceFull = "brace-full",
        BraceCompletion = "braceCompletion",
        GetSpanOfEnclosingComment = "getSpanOfEnclosingComment",
        Change = "change",
        Close = "close",
        /** @deprecated Prefer CompletionInfo -- see comment on CompletionsResponse */
        Completions = "completions",
        CompletionInfo = "completionInfo",
        CompletionsFull = "completions-full",
        CompletionDetails = "completionEntryDetails",
        CompletionDetailsFull = "completionEntryDetails-full",
        CompileOnSaveAffectedFileList = "compileOnSaveAffectedFileList",
        CompileOnSaveEmitFile = "compileOnSaveEmitFile",
        Configure = "configure",
        Definition = "definition",
        DefinitionFull = "definition-full",
        DefinitionAndBoundSpan = "definitionAndBoundSpan",
        DefinitionAndBoundSpanFull = "definitionAndBoundSpan-full",
        Implementation = "implementation",
        ImplementationFull = "implementation-full",
        EmitOutput = "emit-output",
        Exit = "exit",
        Format = "format",
        Formatonkey = "formatonkey",
        FormatFull = "format-full",
        FormatonkeyFull = "formatonkey-full",
        FormatRangeFull = "formatRange-full",
        Geterr = "geterr",
        GeterrForProject = "geterrForProject",
        SemanticDiagnosticsSync = "semanticDiagnosticsSync",
        SyntacticDiagnosticsSync = "syntacticDiagnosticsSync",
        SuggestionDiagnosticsSync = "suggestionDiagnosticsSync",
        NavBar = "navbar",
        NavBarFull = "navbar-full",
        Navto = "navto",
        NavtoFull = "navto-full",
        NavTree = "navtree",
        NavTreeFull = "navtree-full",
        /** @deprecated */
        Occurrences = "occurrences",
        DocumentHighlights = "documentHighlights",
        DocumentHighlightsFull = "documentHighlights-full",
        Open = "open",
        Quickinfo = "quickinfo",
        QuickinfoFull = "quickinfo-full",
        References = "references",
        ReferencesFull = "references-full",
        Reload = "reload",
        Rename = "rename",
        RenameInfoFull = "rename-full",
        RenameLocationsFull = "renameLocations-full",
        Saveto = "saveto",
        SignatureHelp = "signatureHelp",
        SignatureHelpFull = "signatureHelp-full",
        Status = "status",
        TypeDefinition = "typeDefinition",
        ProjectInfo = "projectInfo",
        ReloadProjects = "reloadProjects",
        Unknown = "unknown",
        OpenExternalProject = "openExternalProject",
        OpenExternalProjects = "openExternalProjects",
        CloseExternalProject = "closeExternalProject",
        SynchronizeProjectList = "synchronizeProjectList",
        ApplyChangedToOpenFiles = "applyChangedToOpenFiles",
        UpdateOpen = "updateOpen",
        EncodedSemanticClassificationsFull = "encodedSemanticClassifications-full",
        Cleanup = "cleanup",
        GetOutliningSpans = "getOutliningSpans",
        GetOutliningSpansFull = "outliningSpans",
        TodoComments = "todoComments",
        Indentation = "indentation",
        DocCommentTemplate = "docCommentTemplate",
        CompilerOptionsDiagnosticsFull = "compilerOptionsDiagnostics-full",
        NameOrDottedNameSpan = "nameOrDottedNameSpan",
        BreakpointStatement = "breakpointStatement",
        CompilerOptionsForInferredProjects = "compilerOptionsForInferredProjects",
        GetCodeFixes = "getCodeFixes",
        GetCodeFixesFull = "getCodeFixes-full",
        GetCombinedCodeFix = "getCombinedCodeFix",
        GetCombinedCodeFixFull = "getCombinedCodeFix-full",
        ApplyCodeActionCommand = "applyCodeActionCommand",
        GetSupportedCodeFixes = "getSupportedCodeFixes",
        GetApplicableRefactors = "getApplicableRefactors",
        GetEditsForRefactor = "getEditsForRefactor",
        GetEditsForRefactorFull = "getEditsForRefactor-full",
        OrganizeImports = "organizeImports",
        OrganizeImportsFull = "organizeImports-full",
        GetEditsForFileRename = "getEditsForFileRename",
        GetEditsForFileRenameFull = "getEditsForFileRename-full",
        ConfigurePlugin = "configurePlugin"
    }
    /**
     * A TypeScript Server message
     */
    interface Message {
        /**
         * Sequence number of the message
         */
        seq: number;
        /**
         * One of "request", "response", or "event"
         */
        type: "request" | "response" | "event";
    }
    /**
     * Client-initiated request message
     */
    interface Request extends Message {
        type: "request";
        /**
         * The command to execute
         */
        command: string;
        /**
         * Object containing arguments for the command
         */
        arguments?: any;
    }
    /**
     * Request to reload the project structure for all the opened files
     */
    interface ReloadProjectsRequest extends Message {
        command: CommandTypes.ReloadProjects;
    }
    /**
     * Server-initiated event message
     */
    interface Event extends Message {
        type: "event";
        /**
         * Name of event
         */
        event: string;
        /**
         * Event-specific information
         */
        body?: any;
    }
    /**
     * Response by server to client request message.
     */
    interface Response extends Message {
        type: "response";
        /**
         * Sequence number of the request message.
         */
        request_seq: number;
        /**
         * Outcome of the request.
         */
        success: boolean;
        /**
         * The command requested.
         */
        command: string;
        /**
         * If success === false, this should always be provided.
         * Otherwise, may (or may not) contain a success message.
         */
        message?: string;
        /**
         * Contains message body if success === true.
         */
        body?: any;
        /**
         * Contains extra information that plugin can include to be passed on
         */
        metadata?: unknown;
    }
    /**
     * Arguments for FileRequest messages.
     */
    interface FileRequestArgs {
        /**
         * The file for the request (absolute pathname required).
         */
        file: string;
        projectFileName?: string;
    }
    interface StatusRequest extends Request {
        command: CommandTypes.Status;
    }
    interface StatusResponseBody {
        /**
         * The TypeScript version (`ts.version`).
         */
        version: string;
    }
    /**
     * Response to StatusRequest
     */
    interface StatusResponse extends Response {
        body: StatusResponseBody;
    }
    /**
     * Requests a JS Doc comment template for a given position
     */
    interface DocCommentTemplateRequest extends FileLocationRequest {
        command: CommandTypes.DocCommentTemplate;
    }
    /**
     * Response to DocCommentTemplateRequest
     */
    interface DocCommandTemplateResponse extends Response {
        body?: TextInsertion;
    }
    /**
     * A request to get TODO comments from the file
     */
    interface TodoCommentRequest extends FileRequest {
        command: CommandTypes.TodoComments;
        arguments: TodoCommentRequestArgs;
    }
    /**
     * Arguments for TodoCommentRequest request.
     */
    interface TodoCommentRequestArgs extends FileRequestArgs {
        /**
         * Array of target TodoCommentDescriptors that describes TODO comments to be found
         */
        descriptors: TodoCommentDescriptor[];
    }
    /**
     * Response for TodoCommentRequest request.
     */
    interface TodoCommentsResponse extends Response {
        body?: TodoComment[];
    }
    /**
     * A request to determine if the caret is inside a comment.
     */
    interface SpanOfEnclosingCommentRequest extends FileLocationRequest {
        command: CommandTypes.GetSpanOfEnclosingComment;
        arguments: SpanOfEnclosingCommentRequestArgs;
    }
    interface SpanOfEnclosingCommentRequestArgs extends FileLocationRequestArgs {
        /**
         * Requires that the enclosing span be a multi-line comment, or else the request returns undefined.
         */
        onlyMultiLine: boolean;
    }
    /**
     * Request to obtain outlining spans in file.
     */
    interface OutliningSpansRequest extends FileRequest {
        command: CommandTypes.GetOutliningSpans;
    }
    interface OutliningSpan {
        /** The span of the document to actually collapse. */
        textSpan: TextSpan;
        /** The span of the document to display when the user hovers over the collapsed span. */
        hintSpan: TextSpan;
        /** The text to display in the editor for the collapsed region. */
        bannerText: string;
        /**
         * Whether or not this region should be automatically collapsed when
         * the 'Collapse to Definitions' command is invoked.
         */
        autoCollapse: boolean;
        /**
         * Classification of the contents of the span
         */
        kind: OutliningSpanKind;
    }
    /**
     * Response to OutliningSpansRequest request.
     */
    interface OutliningSpansResponse extends Response {
        body?: OutliningSpan[];
    }
    /**
     * Request to obtain outlining spans in file.
     */
    interface OutliningSpansRequestFull extends FileRequest {
        command: CommandTypes.GetOutliningSpansFull;
    }
    /**
     * Response to OutliningSpansRequest request.
     */
    interface OutliningSpansResponseFull extends Response {
        body?: ts.OutliningSpan[];
    }
    /**
     * A request to get indentation for a location in file
     */
    interface IndentationRequest extends FileLocationRequest {
        command: CommandTypes.Indentation;
        arguments: IndentationRequestArgs;
    }
    /**
     * Response for IndentationRequest request.
     */
    interface IndentationResponse extends Response {
        body?: IndentationResult;
    }
    /**
     * Indentation result representing where indentation should be placed
     */
    interface IndentationResult {
        /**
         * The base position in the document that the indent should be relative to
         */
        position: number;
        /**
         * The number of columns the indent should be at relative to the position's column.
         */
        indentation: number;
    }
    /**
     * Arguments for IndentationRequest request.
     */
    interface IndentationRequestArgs extends FileLocationRequestArgs {
        /**
         * An optional set of settings to be used when computing indentation.
         * If argument is omitted - then it will use settings for file that were previously set via 'configure' request or global settings.
         */
        options?: EditorSettings;
    }
    /**
     * Arguments for ProjectInfoRequest request.
     */
    interface ProjectInfoRequestArgs extends FileRequestArgs {
        /**
         * Indicate if the file name list of the project is needed
         */
        needFileNameList: boolean;
    }
    /**
     * A request to get the project information of the current file.
     */
    interface ProjectInfoRequest extends Request {
        command: CommandTypes.ProjectInfo;
        arguments: ProjectInfoRequestArgs;
    }
    /**
     * A request to retrieve compiler options diagnostics for a project
     */
    interface CompilerOptionsDiagnosticsRequest extends Request {
        arguments: CompilerOptionsDiagnosticsRequestArgs;
    }
    /**
     * Arguments for CompilerOptionsDiagnosticsRequest request.
     */
    interface CompilerOptionsDiagnosticsRequestArgs {
        /**
         * Name of the project to retrieve compiler options diagnostics.
         */
        projectFileName: string;
    }
    /**
     * Response message body for "projectInfo" request
     */
    interface ProjectInfo {
        /**
         * For configured project, this is the normalized path of the 'tsconfig.json' file
         * For inferred project, this is undefined
         */
        configFileName: string;
        /**
         * The list of normalized file name in the project, including 'lib.d.ts'
         */
        fileNames?: string[];
        /**
         * Indicates if the project has a active language service instance
         */
        languageServiceDisabled?: boolean;
    }
    /**
     * Represents diagnostic info that includes location of diagnostic in two forms
     * - start position and length of the error span
     * - startLocation and endLocation - a pair of Location objects that store start/end line and offset of the error span.
     */
    interface DiagnosticWithLinePosition {
        message: string;
        start: number;
        length: number;
        startLocation: Location;
        endLocation: Location;
        category: string;
        code: number;
        /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
        reportsUnnecessary?: {};
        relatedInformation?: DiagnosticRelatedInformation[];
    }
    /**
     * Response message for "projectInfo" request
     */
    interface ProjectInfoResponse extends Response {
        body?: ProjectInfo;
    }
    /**
     * Request whose sole parameter is a file name.
     */
    interface FileRequest extends Request {
        arguments: FileRequestArgs;
    }
    /**
     * Instances of this interface specify a location in a source file:
     * (file, line, character offset), where line and character offset are 1-based.
     */
    interface FileLocationRequestArgs extends FileRequestArgs {
        /**
         * The line number for the request (1-based).
         */
        line: number;
        /**
         * The character offset (on the line) for the request (1-based).
         */
        offset: number;
        /**
         * Position (can be specified instead of line/offset pair)
         */
        position?: number;
    }
    type FileLocationOrRangeRequestArgs = FileLocationRequestArgs | FileRangeRequestArgs;
    /**
     * Request refactorings at a given position or selection area.
     */
    interface GetApplicableRefactorsRequest extends Request {
        command: CommandTypes.GetApplicableRefactors;
        arguments: GetApplicableRefactorsRequestArgs;
    }
    type GetApplicableRefactorsRequestArgs = FileLocationOrRangeRequestArgs;
    /**
     * Response is a list of available refactorings.
     * Each refactoring exposes one or more "Actions"; a user selects one action to invoke a refactoring
     */
    interface GetApplicableRefactorsResponse extends Response {
        body?: ApplicableRefactorInfo[];
    }
    /**
     * A set of one or more available refactoring actions, grouped under a parent refactoring.
     */
    interface ApplicableRefactorInfo {
        /**
         * The programmatic name of the refactoring
         */
        name: string;
        /**
         * A description of this refactoring category to show to the user.
         * If the refactoring gets inlined (see below), this text will not be visible.
         */
        description: string;
        /**
         * Inlineable refactorings can have their actions hoisted out to the top level
         * of a context menu. Non-inlineanable refactorings should always be shown inside
         * their parent grouping.
         *
         * If not specified, this value is assumed to be 'true'
         */
        inlineable?: boolean;
        actions: RefactorActionInfo[];
    }
    /**
     * Represents a single refactoring action - for example, the "Extract Method..." refactor might
     * offer several actions, each corresponding to a surround class or closure to extract into.
     */
    interface RefactorActionInfo {
        /**
         * The programmatic name of the refactoring action
         */
        name: string;
        /**
         * A description of this refactoring action to show to the user.
         * If the parent refactoring is inlined away, this will be the only text shown,
         * so this description should make sense by itself if the parent is inlineable=true
         */
        description: string;
    }
    interface GetEditsForRefactorRequest extends Request {
        command: CommandTypes.GetEditsForRefactor;
        arguments: GetEditsForRefactorRequestArgs;
    }
    /**
     * Request the edits that a particular refactoring action produces.
     * Callers must specify the name of the refactor and the name of the action.
     */
    type GetEditsForRefactorRequestArgs = FileLocationOrRangeRequestArgs & {
        refactor: string;
        action: string;
    };
    interface GetEditsForRefactorResponse extends Response {
        body?: RefactorEditInfo;
    }
    interface RefactorEditInfo {
        edits: FileCodeEdits[];
        /**
         * An optional location where the editor should start a rename operation once
         * the refactoring edits have been applied
         */
        renameLocation?: Location;
        renameFilename?: string;
    }
    /**
     * Organize imports by:
     *   1) Removing unused imports
     *   2) Coalescing imports from the same module
     *   3) Sorting imports
     */
    interface OrganizeImportsRequest extends Request {
        command: CommandTypes.OrganizeImports;
        arguments: OrganizeImportsRequestArgs;
    }
    type OrganizeImportsScope = GetCombinedCodeFixScope;
    interface OrganizeImportsRequestArgs {
        scope: OrganizeImportsScope;
    }
    interface OrganizeImportsResponse extends Response {
        body: ReadonlyArray<FileCodeEdits>;
    }
    interface GetEditsForFileRenameRequest extends Request {
        command: CommandTypes.GetEditsForFileRename;
        arguments: GetEditsForFileRenameRequestArgs;
    }
    /** Note: Paths may also be directories. */
    interface GetEditsForFileRenameRequestArgs {
        readonly oldFilePath: string;
        readonly newFilePath: string;
    }
    interface GetEditsForFileRenameResponse extends Response {
        body: ReadonlyArray<FileCodeEdits>;
    }
    /**
     * Request for the available codefixes at a specific position.
     */
    interface CodeFixRequest extends Request {
        command: CommandTypes.GetCodeFixes;
        arguments: CodeFixRequestArgs;
    }
    interface GetCombinedCodeFixRequest extends Request {
        command: CommandTypes.GetCombinedCodeFix;
        arguments: GetCombinedCodeFixRequestArgs;
    }
    interface GetCombinedCodeFixResponse extends Response {
        body: CombinedCodeActions;
    }
    interface ApplyCodeActionCommandRequest extends Request {
        command: CommandTypes.ApplyCodeActionCommand;
        arguments: ApplyCodeActionCommandRequestArgs;
    }
    interface ApplyCodeActionCommandResponse extends Response {
    }
    interface FileRangeRequestArgs extends FileRequestArgs {
        /**
         * The line number for the request (1-based).
         */
        startLine: number;
        /**
         * The character offset (on the line) for the request (1-based).
         */
        startOffset: number;
        /**
         * Position (can be specified instead of line/offset pair)
         */
        startPosition?: number;
        /**
         * The line number for the request (1-based).
         */
        endLine: number;
        /**
         * The character offset (on the line) for the request (1-based).
         */
        endOffset: number;
        /**
         * Position (can be specified instead of line/offset pair)
         */
        endPosition?: number;
    }
    /**
     * Instances of this interface specify errorcodes on a specific location in a sourcefile.
     */
    interface CodeFixRequestArgs extends FileRangeRequestArgs {
        /**
         * Errorcodes we want to get the fixes for.
         */
        errorCodes: ReadonlyArray<number>;
    }
    interface GetCombinedCodeFixRequestArgs {
        scope: GetCombinedCodeFixScope;
        fixId: {};
    }
    interface GetCombinedCodeFixScope {
        type: "file";
        args: FileRequestArgs;
    }
    interface ApplyCodeActionCommandRequestArgs {
        /** May also be an array of commands. */
        command: {};
    }
    /**
     * Response for GetCodeFixes request.
     */
    interface GetCodeFixesResponse extends Response {
        body?: CodeAction[];
    }
    /**
     * A request whose arguments specify a file location (file, line, col).
     */
    interface FileLocationRequest extends FileRequest {
        arguments: FileLocationRequestArgs;
    }
    /**
     * A request to get codes of supported code fixes.
     */
    interface GetSupportedCodeFixesRequest extends Request {
        command: CommandTypes.GetSupportedCodeFixes;
    }
    /**
     * A response for GetSupportedCodeFixesRequest request.
     */
    interface GetSupportedCodeFixesResponse extends Response {
        /**
         * List of error codes supported by the server.
         */
        body?: string[];
    }
    /**
     * A request to get encoded semantic classifications for a span in the file
     */
    /** @internal */
    interface EncodedSemanticClassificationsRequest extends FileRequest {
        arguments: EncodedSemanticClassificationsRequestArgs;
    }
    /**
     * Arguments for EncodedSemanticClassificationsRequest request.
     */
    interface EncodedSemanticClassificationsRequestArgs extends FileRequestArgs {
        /**
         * Start position of the span.
         */
        start: number;
        /**
         * Length of the span.
         */
        length: number;
    }
    /**
     * Arguments in document highlight request; include: filesToSearch, file,
     * line, offset.
     */
    interface DocumentHighlightsRequestArgs extends FileLocationRequestArgs {
        /**
         * List of files to search for document highlights.
         */
        filesToSearch: string[];
    }
    /**
     * Go to definition request; value of command field is
     * "definition". Return response giving the file locations that
     * define the symbol found in file at location line, col.
     */
    interface DefinitionRequest extends FileLocationRequest {
        command: CommandTypes.Definition;
    }
    interface DefinitionAndBoundSpanRequest extends FileLocationRequest {
        readonly command: CommandTypes.DefinitionAndBoundSpan;
    }
    interface DefinitionAndBoundSpanResponse extends Response {
        readonly body: DefinitionInfoAndBoundSpan;
    }
    /** @internal */
    interface EmitOutputRequest extends FileRequest {
    }
    /** @internal */
    interface EmitOutputResponse extends Response {
        readonly body: EmitOutput;
    }
    /**
     * Go to type request; value of command field is
     * "typeDefinition". Return response giving the file locations that
     * define the type for the symbol found in file at location line, col.
     */
    interface TypeDefinitionRequest extends FileLocationRequest {
        command: CommandTypes.TypeDefinition;
    }
    /**
     * Go to implementation request; value of command field is
     * "implementation". Return response giving the file locations that
     * implement the symbol found in file at location line, col.
     */
    interface ImplementationRequest extends FileLocationRequest {
        command: CommandTypes.Implementation;
    }
    /**
     * Location in source code expressed as (one-based) line and (one-based) column offset.
     */
    interface Location {
        line: number;
        offset: number;
    }
    /**
     * Object found in response messages defining a span of text in source code.
     */
    interface TextSpan {
        /**
         * First character of the definition.
         */
        start: Location;
        /**
         * One character past last character of the definition.
         */
        end: Location;
    }
    /**
     * Object found in response messages defining a span of text in a specific source file.
     */
    interface FileSpan extends TextSpan {
        /**
         * File containing text span.
         */
        file: string;
    }
    interface DefinitionInfoAndBoundSpan {
        definitions: ReadonlyArray<FileSpan>;
        textSpan: TextSpan;
    }
    /**
     * Definition response message.  Gives text range for definition.
     */
    interface DefinitionResponse extends Response {
        body?: FileSpan[];
    }
    interface DefinitionInfoAndBoundSpanReponse extends Response {
        body?: DefinitionInfoAndBoundSpan;
    }
    /**
     * Definition response message.  Gives text range for definition.
     */
    interface TypeDefinitionResponse extends Response {
        body?: FileSpan[];
    }
    /**
     * Implementation response message.  Gives text range for implementations.
     */
    interface ImplementationResponse extends Response {
        body?: FileSpan[];
    }
    /**
     * Request to get brace completion for a location in the file.
     */
    interface BraceCompletionRequest extends FileLocationRequest {
        command: CommandTypes.BraceCompletion;
        arguments: BraceCompletionRequestArgs;
    }
    /**
     * Argument for BraceCompletionRequest request.
     */
    interface BraceCompletionRequestArgs extends FileLocationRequestArgs {
        /**
         * Kind of opening brace
         */
        openingBrace: string;
    }
    interface JsxClosingTagRequest extends FileLocationRequest {
        readonly command: CommandTypes.JsxClosingTag;
        readonly arguments: JsxClosingTagRequestArgs;
    }
    interface JsxClosingTagRequestArgs extends FileLocationRequestArgs {
    }
    interface JsxClosingTagResponse extends Response {
        readonly body: TextInsertion;
    }
    /**
     * @deprecated
     * Get occurrences request; value of command field is
     * "occurrences". Return response giving spans that are relevant
     * in the file at a given line and column.
     */
    interface OccurrencesRequest extends FileLocationRequest {
        command: CommandTypes.Occurrences;
    }
    /** @deprecated */
    interface OccurrencesResponseItem extends FileSpan {
        /**
         * True if the occurrence is a write location, false otherwise.
         */
        isWriteAccess: boolean;
        /**
         * True if the occurrence is in a string, undefined otherwise;
         */
        isInString?: true;
    }
    /** @deprecated */
    interface OccurrencesResponse extends Response {
        body?: OccurrencesResponseItem[];
    }
    /**
     * Get document highlights request; value of command field is
     * "documentHighlights". Return response giving spans that are relevant
     * in the file at a given line and column.
     */
    interface DocumentHighlightsRequest extends FileLocationRequest {
        command: CommandTypes.DocumentHighlights;
        arguments: DocumentHighlightsRequestArgs;
    }
    /**
     * Span augmented with extra information that denotes the kind of the highlighting to be used for span.
     */
    interface HighlightSpan extends TextSpan {
        kind: HighlightSpanKind;
    }
    /**
     * Represents a set of highligh spans for a give name
     */
    interface DocumentHighlightsItem {
        /**
         * File containing highlight spans.
         */
        file: string;
        /**
         * Spans to highlight in file.
         */
        highlightSpans: HighlightSpan[];
    }
    /**
     * Response for a DocumentHighlightsRequest request.
     */
    interface DocumentHighlightsResponse extends Response {
        body?: DocumentHighlightsItem[];
    }
    /**
     * Find references request; value of command field is
     * "references". Return response giving the file locations that
     * reference the symbol found in file at location line, col.
     */
    interface ReferencesRequest extends FileLocationRequest {
        command: CommandTypes.References;
    }
    interface ReferencesResponseItem extends FileSpan {
        /** Text of line containing the reference.  Including this
         *  with the response avoids latency of editor loading files
         * to show text of reference line (the server already has
         * loaded the referencing files).
         */
        lineText: string;
        /**
         * True if reference is a write location, false otherwise.
         */
        isWriteAccess: boolean;
        /**
         * True if reference is a definition, false otherwise.
         */
        isDefinition: boolean;
    }
    /**
     * The body of a "references" response message.
     */
    interface ReferencesResponseBody {
        /**
         * The file locations referencing the symbol.
         */
        refs: ReadonlyArray<ReferencesResponseItem>;
        /**
         * The name of the symbol.
         */
        symbolName: string;
        /**
         * The start character offset of the symbol (on the line provided by the references request).
         */
        symbolStartOffset: number;
        /**
         * The full display name of the symbol.
         */
        symbolDisplayString: string;
    }
    /**
     * Response to "references" request.
     */
    interface ReferencesResponse extends Response {
        body?: ReferencesResponseBody;
    }
    /**
     * Argument for RenameRequest request.
     */
    interface RenameRequestArgs extends FileLocationRequestArgs {
        /**
         * Should text at specified location be found/changed in comments?
         */
        findInComments?: boolean;
        /**
         * Should text at specified location be found/changed in strings?
         */
        findInStrings?: boolean;
    }
    /**
     * Rename request; value of command field is "rename". Return
     * response giving the file locations that reference the symbol
     * found in file at location line, col. Also return full display
     * name of the symbol so that client can print it unambiguously.
     */
    interface RenameRequest extends FileLocationRequest {
        command: CommandTypes.Rename;
        arguments: RenameRequestArgs;
    }
    interface RenameFullRequest extends FileLocationRequest {
        readonly command: CommandTypes.RenameLocationsFull;
        readonly arguments: RenameRequestArgs;
    }
    interface RenameFullResponse extends Response {
        readonly body: ReadonlyArray<RenameLocation>;
    }
    /**
     * Information about the item to be renamed.
     */
    type RenameInfo = RenameInfoSuccess | RenameInfoFailure;
    interface RenameInfoSuccess {
        /**
         * True if item can be renamed.
         */
        canRename: true;
        /**
         * File or directory to rename.
         * If set, `getEditsForFileRename` should be called instead of `findRenameLocations`.
         */
        fileToRename?: string;
        /**
         * Display name of the item to be renamed.
         */
        displayName: string;
        /**
         * Full display name of item to be renamed.
         */
        fullDisplayName: string;
        /**
         * The items's kind (such as 'className' or 'parameterName' or plain 'text').
         */
        kind: ScriptElementKind;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers: string;
        /** Span of text to rename. */
        triggerSpan: TextSpan;
    }
    interface RenameInfoFailure {
        canRename: false;
        /**
         * Error message if item can not be renamed.
         */
        localizedErrorMessage: string;
    }
    /**
     *  A group of text spans, all in 'file'.
     */
    interface SpanGroup {
        /** The file to which the spans apply */
        file: string;
        /** The text spans in this group */
        locs: RenameTextSpan[];
    }
    interface RenameTextSpan extends TextSpan {
        readonly prefixText?: string;
        readonly suffixText?: string;
    }
    interface RenameResponseBody {
        /**
         * Information about the item to be renamed.
         */
        info: RenameInfo;
        /**
         * An array of span groups (one per file) that refer to the item to be renamed.
         */
        locs: ReadonlyArray<SpanGroup>;
    }
    /**
     * Rename response message.
     */
    interface RenameResponse extends Response {
        body?: RenameResponseBody;
    }
    /**
     * Represents a file in external project.
     * External project is project whose set of files, compilation options and open\close state
     * is maintained by the client (i.e. if all this data come from .csproj file in Visual Studio).
     * External project will exist even if all files in it are closed and should be closed explicitly.
     * If external project includes one or more tsconfig.json/jsconfig.json files then tsserver will
     * create configured project for every config file but will maintain a link that these projects were created
     * as a result of opening external project so they should be removed once external project is closed.
     */
    interface ExternalFile {
        /**
         * Name of file file
         */
        fileName: string;
        /**
         * Script kind of the file
         */
        scriptKind?: ScriptKindName | ts.ScriptKind;
        /**
         * Whether file has mixed content (i.e. .cshtml file that combines html markup with C#/JavaScript)
         */
        hasMixedContent?: boolean;
        /**
         * Content of the file
         */
        content?: string;
    }
    /**
     * Represent an external project
     */
    interface ExternalProject {
        /**
         * Project name
         */
        projectFileName: string;
        /**
         * List of root files in project
         */
        rootFiles: ExternalFile[];
        /**
         * Compiler options for the project
         */
        options: ExternalProjectCompilerOptions;
        /**
         * @deprecated typingOptions. Use typeAcquisition instead
         */
        typingOptions?: TypeAcquisition;
        /**
         * Explicitly specified type acquisition for the project
         */
        typeAcquisition?: TypeAcquisition;
    }
    interface CompileOnSaveMixin {
        /**
         * If compile on save is enabled for the project
         */
        compileOnSave?: boolean;
    }
    /**
     * For external projects, some of the project settings are sent together with
     * compiler settings.
     */
    type ExternalProjectCompilerOptions = CompilerOptions & CompileOnSaveMixin;
    /**
     * Contains information about current project version
     */
    interface ProjectVersionInfo {
        /**
         * Project name
         */
        projectName: string;
        /**
         * true if project is inferred or false if project is external or configured
         */
        isInferred: boolean;
        /**
         * Project version
         */
        version: number;
        /**
         * Current set of compiler options for project
         */
        options: ts.CompilerOptions;
        /**
         * true if project language service is disabled
         */
        languageServiceDisabled: boolean;
        /**
         * Filename of the last file analyzed before disabling the language service. undefined, if the language service is enabled.
         */
        lastFileExceededProgramSize?: string;
    }
    /**
     * Represents a set of changes that happen in project
     */
    interface ProjectChanges {
        /**
         * List of added files
         */
        added: string[];
        /**
         * List of removed files
         */
        removed: string[];
        /**
         * List of updated files
         */
        updated: string[];
    }
    /**
     * Describes set of files in the project.
     * info might be omitted in case of inferred projects
     * if files is set - then this is the entire set of files in the project
     * if changes is set - then this is the set of changes that should be applied to existing project
     * otherwise - assume that nothing is changed
     */
    interface ProjectFiles {
        /**
         * Information about project verison
         */
        info?: ProjectVersionInfo;
        /**
         * List of files in project (might be omitted if current state of project can be computed using only information from 'changes')
         */
        files?: string[];
        /**
         * Set of changes in project (omitted if the entire set of files in project should be replaced)
         */
        changes?: ProjectChanges;
    }
    /**
     * Combines project information with project level errors.
     */
    interface ProjectFilesWithDiagnostics extends ProjectFiles {
        /**
         * List of errors in project
         */
        projectErrors: DiagnosticWithLinePosition[];
    }
    /**
     * Represents set of changes in open file
     */
    interface ChangedOpenFile {
        /**
         * Name of file
         */
        fileName: string;
        /**
         * List of changes that should be applied to known open file
         */
        changes: ts.TextChange[];
    }
    /**
     * Information found in a configure request.
     */
    interface ConfigureRequestArguments {
        /**
         * Information about the host, for example 'Emacs 24.4' or
         * 'Sublime Text version 3075'
         */
        hostInfo?: string;
        /**
         * If present, tab settings apply only to this file.
         */
        file?: string;
        /**
         * The format options to use during formatting and other code editing features.
         */
        formatOptions?: FormatCodeSettings;
        preferences?: UserPreferences;
        /**
         * The host's additional supported .js file extensions
         */
        extraFileExtensions?: FileExtensionInfo[];
    }
    /**
     *  Configure request; value of command field is "configure".  Specifies
     *  host information, such as host type, tab size, and indent size.
     */
    interface ConfigureRequest extends Request {
        command: CommandTypes.Configure;
        arguments: ConfigureRequestArguments;
    }
    /**
     * Response to "configure" request.  This is just an acknowledgement, so
     * no body field is required.
     */
    interface ConfigureResponse extends Response {
    }
    interface ConfigurePluginRequestArguments {
        pluginName: string;
        configuration: any;
    }
    interface ConfigurePluginRequest extends Request {
        command: CommandTypes.ConfigurePlugin;
        arguments: ConfigurePluginRequestArguments;
    }
    /**
     *  Information found in an "open" request.
     */
    interface OpenRequestArgs extends FileRequestArgs {
        /**
         * Used when a version of the file content is known to be more up to date than the one on disk.
         * Then the known content will be used upon opening instead of the disk copy
         */
        fileContent?: string;
        /**
         * Used to specify the script kind of the file explicitly. It could be one of the following:
         *      "TS", "JS", "TSX", "JSX"
         */
        scriptKindName?: ScriptKindName;
        /**
         * Used to limit the searching for project config file. If given the searching will stop at this
         * root path; otherwise it will go all the way up to the dist root path.
         */
        projectRootPath?: string;
    }
    type ScriptKindName = "TS" | "JS" | "TSX" | "JSX";
    /**
     * Open request; value of command field is "open". Notify the
     * server that the client has file open.  The server will not
     * monitor the filesystem for changes in this file and will assume
     * that the client is updating the server (using the change and/or
     * reload messages) when the file changes. Server does not currently
     * send a response to an open request.
     */
    interface OpenRequest extends Request {
        command: CommandTypes.Open;
        arguments: OpenRequestArgs;
    }
    /**
     * Request to open or update external project
     */
    interface OpenExternalProjectRequest extends Request {
        command: CommandTypes.OpenExternalProject;
        arguments: OpenExternalProjectArgs;
    }
    /**
     * Arguments to OpenExternalProjectRequest request
     */
    type OpenExternalProjectArgs = ExternalProject;
    /**
     * Request to open multiple external projects
     */
    interface OpenExternalProjectsRequest extends Request {
        command: CommandTypes.OpenExternalProjects;
        arguments: OpenExternalProjectsArgs;
    }
    /**
     * Arguments to OpenExternalProjectsRequest
     */
    interface OpenExternalProjectsArgs {
        /**
         * List of external projects to open or update
         */
        projects: ExternalProject[];
    }
    /**
     * Response to OpenExternalProjectRequest request. This is just an acknowledgement, so
     * no body field is required.
     */
    interface OpenExternalProjectResponse extends Response {
    }
    /**
     * Response to OpenExternalProjectsRequest request. This is just an acknowledgement, so
     * no body field is required.
     */
    interface OpenExternalProjectsResponse extends Response {
    }
    /**
     * Request to close external project.
     */
    interface CloseExternalProjectRequest extends Request {
        command: CommandTypes.CloseExternalProject;
        arguments: CloseExternalProjectRequestArgs;
    }
    /**
     * Arguments to CloseExternalProjectRequest request
     */
    interface CloseExternalProjectRequestArgs {
        /**
         * Name of the project to close
         */
        projectFileName: string;
    }
    /**
     * Response to CloseExternalProjectRequest request. This is just an acknowledgement, so
     * no body field is required.
     */
    interface CloseExternalProjectResponse extends Response {
    }
    /**
     * Request to check if given list of projects is up-to-date and synchronize them if necessary
     */
    interface SynchronizeProjectListRequest extends Request {
        arguments: SynchronizeProjectListRequestArgs;
    }
    /**
     * Arguments to SynchronizeProjectListRequest
     */
    interface SynchronizeProjectListRequestArgs {
        /**
         * List of last known projects
         */
        knownProjects: protocol.ProjectVersionInfo[];
    }
    /**
     * Request to synchronize list of open files with the client
     */
    interface ApplyChangedToOpenFilesRequest extends Request {
        arguments: ApplyChangedToOpenFilesRequestArgs;
    }
    /**
     * Arguments to ApplyChangedToOpenFilesRequest
     */
    interface ApplyChangedToOpenFilesRequestArgs {
        /**
         * List of newly open files
         */
        openFiles?: ExternalFile[];
        /**
         * List of open files files that were changes
         */
        changedFiles?: ChangedOpenFile[];
        /**
         * List of files that were closed
         */
        closedFiles?: string[];
    }
    /**
     * Request to synchronize list of open files with the client
     */
    interface UpdateOpenRequest extends Request {
        command: CommandTypes.UpdateOpen;
        arguments: UpdateOpenRequestArgs;
    }
    /**
     * Arguments to UpdateOpenRequest
     */
    interface UpdateOpenRequestArgs {
        /**
         * List of newly open files
         */
        openFiles?: OpenRequestArgs[];
        /**
         * List of open files files that were changes
         */
        changedFiles?: FileCodeEdits[];
        /**
         * List of files that were closed
         */
        closedFiles?: string[];
    }
    /**
     * Request to set compiler options for inferred projects.
     * External projects are opened / closed explicitly.
     * Configured projects are opened when user opens loose file that has 'tsconfig.json' or 'jsconfig.json' anywhere in one of containing folders.
     * This configuration file will be used to obtain a list of files and configuration settings for the project.
     * Inferred projects are created when user opens a loose file that is not the part of external project
     * or configured project and will contain only open file and transitive closure of referenced files if 'useOneInferredProject' is false,
     * or all open loose files and its transitive closure of referenced files if 'useOneInferredProject' is true.
     */
    interface SetCompilerOptionsForInferredProjectsRequest extends Request {
        command: CommandTypes.CompilerOptionsForInferredProjects;
        arguments: SetCompilerOptionsForInferredProjectsArgs;
    }
    /**
     * Argument for SetCompilerOptionsForInferredProjectsRequest request.
     */
    interface SetCompilerOptionsForInferredProjectsArgs {
        /**
         * Compiler options to be used with inferred projects.
         */
        options: ExternalProjectCompilerOptions;
        /**
         * Specifies the project root path used to scope compiler options.
         * It is an error to provide this property if the server has not been started with
         * `useInferredProjectPerProjectRoot` enabled.
         */
        projectRootPath?: string;
    }
    /**
     * Response to SetCompilerOptionsForInferredProjectsResponse request. This is just an acknowledgement, so
     * no body field is required.
     */
    interface SetCompilerOptionsForInferredProjectsResponse extends Response {
    }
    /**
     *  Exit request; value of command field is "exit".  Ask the server process
     *  to exit.
     */
    interface ExitRequest extends Request {
        command: CommandTypes.Exit;
    }
    /**
     * Close request; value of command field is "close". Notify the
     * server that the client has closed a previously open file.  If
     * file is still referenced by open files, the server will resume
     * monitoring the filesystem for changes to file.  Server does not
     * currently send a response to a close request.
     */
    interface CloseRequest extends FileRequest {
        command: CommandTypes.Close;
    }
    /**
     * Request to obtain the list of files that should be regenerated if target file is recompiled.
     * NOTE: this us query-only operation and does not generate any output on disk.
     */
    interface CompileOnSaveAffectedFileListRequest extends FileRequest {
        command: CommandTypes.CompileOnSaveAffectedFileList;
    }
    /**
     * Contains a list of files that should be regenerated in a project
     */
    interface CompileOnSaveAffectedFileListSingleProject {
        /**
         * Project name
         */
        projectFileName: string;
        /**
         * List of files names that should be recompiled
         */
        fileNames: string[];
        /**
         * true if project uses outFile or out compiler option
         */
        projectUsesOutFile: boolean;
    }
    /**
     * Response for CompileOnSaveAffectedFileListRequest request;
     */
    interface CompileOnSaveAffectedFileListResponse extends Response {
        body: CompileOnSaveAffectedFileListSingleProject[];
    }
    /**
     * Request to recompile the file. All generated outputs (.js, .d.ts or .js.map files) is written on disk.
     */
    interface CompileOnSaveEmitFileRequest extends FileRequest {
        command: CommandTypes.CompileOnSaveEmitFile;
        arguments: CompileOnSaveEmitFileRequestArgs;
    }
    /**
     * Arguments for CompileOnSaveEmitFileRequest
     */
    interface CompileOnSaveEmitFileRequestArgs extends FileRequestArgs {
        /**
         * if true - then file should be recompiled even if it does not have any changes.
         */
        forced?: boolean;
    }
    /**
     * Quickinfo request; value of command field is
     * "quickinfo". Return response giving a quick type and
     * documentation string for the symbol found in file at location
     * line, col.
     */
    interface QuickInfoRequest extends FileLocationRequest {
        command: CommandTypes.Quickinfo;
    }
    /**
     * Body of QuickInfoResponse.
     */
    interface QuickInfoResponseBody {
        /**
         * The symbol's kind (such as 'className' or 'parameterName' or plain 'text').
         */
        kind: ScriptElementKind;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers: string;
        /**
         * Starting file location of symbol.
         */
        start: Location;
        /**
         * One past last character of symbol.
         */
        end: Location;
        /**
         * Type and kind of symbol.
         */
        displayString: string;
        /**
         * Documentation associated with symbol.
         */
        documentation: string;
        /**
         * JSDoc tags associated with symbol.
         */
        tags: JSDocTagInfo[];
    }
    /**
     * Quickinfo response message.
     */
    interface QuickInfoResponse extends Response {
        body?: QuickInfoResponseBody;
    }
    /**
     * Arguments for format messages.
     */
    interface FormatRequestArgs extends FileLocationRequestArgs {
        /**
         * Last line of range for which to format text in file.
         */
        endLine: number;
        /**
         * Character offset on last line of range for which to format text in file.
         */
        endOffset: number;
        /**
         * End position of the range for which to format text in file.
         */
        endPosition?: number;
        /**
         * Format options to be used.
         */
        options?: FormatCodeSettings;
    }
    /**
     * Format request; value of command field is "format".  Return
     * response giving zero or more edit instructions.  The edit
     * instructions will be sorted in file order.  Applying the edit
     * instructions in reverse to file will result in correctly
     * reformatted text.
     */
    interface FormatRequest extends FileLocationRequest {
        command: CommandTypes.Format;
        arguments: FormatRequestArgs;
    }
    /**
     * Object found in response messages defining an editing
     * instruction for a span of text in source code.  The effect of
     * this instruction is to replace the text starting at start and
     * ending one character before end with newText. For an insertion,
     * the text span is empty.  For a deletion, newText is empty.
     */
    interface CodeEdit {
        /**
         * First character of the text span to edit.
         */
        start: Location;
        /**
         * One character past last character of the text span to edit.
         */
        end: Location;
        /**
         * Replace the span defined above with this string (may be
         * the empty string).
         */
        newText: string;
    }
    interface FileCodeEdits {
        fileName: string;
        textChanges: CodeEdit[];
    }
    interface CodeFixResponse extends Response {
        /** The code actions that are available */
        body?: CodeFixAction[];
    }
    interface CodeAction {
        /** Description of the code action to display in the UI of the editor */
        description: string;
        /** Text changes to apply to each file as part of the code action */
        changes: FileCodeEdits[];
        /** A command is an opaque object that should be passed to `ApplyCodeActionCommandRequestArgs` without modification.  */
        commands?: {}[];
    }
    interface CombinedCodeActions {
        changes: ReadonlyArray<FileCodeEdits>;
        commands?: ReadonlyArray<{}>;
    }
    interface CodeFixAction extends CodeAction {
        /** Short name to identify the fix, for use by telemetry. */
        fixName: string;
        /**
         * If present, one may call 'getCombinedCodeFix' with this fixId.
         * This may be omitted to indicate that the code fix can't be applied in a group.
         */
        fixId?: {};
        /** Should be present if and only if 'fixId' is. */
        fixAllDescription?: string;
    }
    /**
     * Format and format on key response message.
     */
    interface FormatResponse extends Response {
        body?: CodeEdit[];
    }
    /**
     * Arguments for format on key messages.
     */
    interface FormatOnKeyRequestArgs extends FileLocationRequestArgs {
        /**
         * Key pressed (';', '\n', or '}').
         */
        key: string;
        options?: FormatCodeSettings;
    }
    /**
     * Format on key request; value of command field is
     * "formatonkey". Given file location and key typed (as string),
     * return response giving zero or more edit instructions.  The
     * edit instructions will be sorted in file order.  Applying the
     * edit instructions in reverse to file will result in correctly
     * reformatted text.
     */
    interface FormatOnKeyRequest extends FileLocationRequest {
        command: CommandTypes.Formatonkey;
        arguments: FormatOnKeyRequestArgs;
    }
    type CompletionsTriggerCharacter = "." | '"' | "'" | "`" | "/" | "@" | "<";
    /**
     * Arguments for completions messages.
     */
    interface CompletionsRequestArgs extends FileLocationRequestArgs {
        /**
         * Optional prefix to apply to possible completions.
         */
        prefix?: string;
        /**
         * Character that was responsible for triggering completion.
         * Should be `undefined` if a user manually requested completion.
         */
        triggerCharacter?: CompletionsTriggerCharacter;
        /**
         * @deprecated Use UserPreferences.includeCompletionsForModuleExports
         */
        includeExternalModuleExports?: boolean;
        /**
         * @deprecated Use UserPreferences.includeCompletionsWithInsertText
         */
        includeInsertTextCompletions?: boolean;
    }
    /**
     * Completions request; value of command field is "completions".
     * Given a file location (file, line, col) and a prefix (which may
     * be the empty string), return the possible completions that
     * begin with prefix.
     */
    interface CompletionsRequest extends FileLocationRequest {
        command: CommandTypes.Completions | CommandTypes.CompletionInfo;
        arguments: CompletionsRequestArgs;
    }
    /**
     * Arguments for completion details request.
     */
    interface CompletionDetailsRequestArgs extends FileLocationRequestArgs {
        /**
         * Names of one or more entries for which to obtain details.
         */
        entryNames: (string | CompletionEntryIdentifier)[];
    }
    interface CompletionEntryIdentifier {
        name: string;
        source?: string;
    }
    /**
     * Completion entry details request; value of command field is
     * "completionEntryDetails".  Given a file location (file, line,
     * col) and an array of completion entry names return more
     * detailed information for each completion entry.
     */
    interface CompletionDetailsRequest extends FileLocationRequest {
        command: CommandTypes.CompletionDetails;
        arguments: CompletionDetailsRequestArgs;
    }
    /**
     * Part of a symbol description.
     */
    interface SymbolDisplayPart {
        /**
         * Text of an item describing the symbol.
         */
        text: string;
        /**
         * The symbol's kind (such as 'className' or 'parameterName' or plain 'text').
         */
        kind: string;
    }
    /**
     * An item found in a completion response.
     */
    interface CompletionEntry {
        /**
         * The symbol's name.
         */
        name: string;
        /**
         * The symbol's kind (such as 'className' or 'parameterName').
         */
        kind: ScriptElementKind;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers?: string;
        /**
         * A string that is used for comparing completion items so that they can be ordered.  This
         * is often the same as the name but may be different in certain circumstances.
         */
        sortText: string;
        /**
         * Text to insert instead of `name`.
         * This is used to support bracketed completions; If `name` might be "a-b" but `insertText` would be `["a-b"]`,
         * coupled with `replacementSpan` to replace a dotted access with a bracket access.
         */
        insertText?: string;
        /**
         * An optional span that indicates the text to be replaced by this completion item.
         * If present, this span should be used instead of the default one.
         * It will be set if the required span differs from the one generated by the default replacement behavior.
         */
        replacementSpan?: TextSpan;
        /**
         * Indicates whether commiting this completion entry will require additional code actions to be
         * made to avoid errors. The CompletionEntryDetails will have these actions.
         */
        hasAction?: true;
        /**
         * Identifier (not necessarily human-readable) identifying where this completion came from.
         */
        source?: string;
        /**
         * If true, this completion should be highlighted as recommended. There will only be one of these.
         * This will be set when we know the user should write an expression with a certain type and that type is an enum or constructable class.
         * Then either that enum/class or a namespace containing it will be the recommended symbol.
         */
        isRecommended?: true;
    }
    /**
     * Additional completion entry details, available on demand
     */
    interface CompletionEntryDetails {
        /**
         * The symbol's name.
         */
        name: string;
        /**
         * The symbol's kind (such as 'className' or 'parameterName').
         */
        kind: ScriptElementKind;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers: string;
        /**
         * Display parts of the symbol (similar to quick info).
         */
        displayParts: SymbolDisplayPart[];
        /**
         * Documentation strings for the symbol.
         */
        documentation?: SymbolDisplayPart[];
        /**
         * JSDoc tags for the symbol.
         */
        tags?: JSDocTagInfo[];
        /**
         * The associated code actions for this entry
         */
        codeActions?: CodeAction[];
        /**
         * Human-readable description of the `source` from the CompletionEntry.
         */
        source?: SymbolDisplayPart[];
    }
    /** @deprecated Prefer CompletionInfoResponse, which supports several top-level fields in addition to the array of entries. */
    interface CompletionsResponse extends Response {
        body?: CompletionEntry[];
    }
    interface CompletionInfoResponse extends Response {
        body?: CompletionInfo;
    }
    interface CompletionInfo {
        readonly isGlobalCompletion: boolean;
        readonly isMemberCompletion: boolean;
        readonly isNewIdentifierLocation: boolean;
        readonly entries: ReadonlyArray<CompletionEntry>;
    }
    interface CompletionDetailsResponse extends Response {
        body?: CompletionEntryDetails[];
    }
    /**
     * Signature help information for a single parameter
     */
    interface SignatureHelpParameter {
        /**
         * The parameter's name
         */
        name: string;
        /**
         * Documentation of the parameter.
         */
        documentation: SymbolDisplayPart[];
        /**
         * Display parts of the parameter.
         */
        displayParts: SymbolDisplayPart[];
        /**
         * Whether the parameter is optional or not.
         */
        isOptional: boolean;
    }
    /**
     * Represents a single signature to show in signature help.
     */
    interface SignatureHelpItem {
        /**
         * Whether the signature accepts a variable number of arguments.
         */
        isVariadic: boolean;
        /**
         * The prefix display parts.
         */
        prefixDisplayParts: SymbolDisplayPart[];
        /**
         * The suffix display parts.
         */
        suffixDisplayParts: SymbolDisplayPart[];
        /**
         * The separator display parts.
         */
        separatorDisplayParts: SymbolDisplayPart[];
        /**
         * The signature helps items for the parameters.
         */
        parameters: SignatureHelpParameter[];
        /**
         * The signature's documentation
         */
        documentation: SymbolDisplayPart[];
        /**
         * The signature's JSDoc tags
         */
        tags: JSDocTagInfo[];
    }
    /**
     * Signature help items found in the response of a signature help request.
     */
    interface SignatureHelpItems {
        /**
         * The signature help items.
         */
        items: SignatureHelpItem[];
        /**
         * The span for which signature help should appear on a signature
         */
        applicableSpan: TextSpan;
        /**
         * The item selected in the set of available help items.
         */
        selectedItemIndex: number;
        /**
         * The argument selected in the set of parameters.
         */
        argumentIndex: number;
        /**
         * The argument count
         */
        argumentCount: number;
    }
    type SignatureHelpTriggerCharacter = "," | "(" | "<";
    type SignatureHelpRetriggerCharacter = SignatureHelpTriggerCharacter | ")";
    /**
     * Arguments of a signature help request.
     */
    interface SignatureHelpRequestArgs extends FileLocationRequestArgs {
        /**
         * Reason why signature help was invoked.
         * See each individual possible
         */
        triggerReason?: SignatureHelpTriggerReason;
    }
    type SignatureHelpTriggerReason = SignatureHelpInvokedReason | SignatureHelpCharacterTypedReason | SignatureHelpRetriggeredReason;
    /**
     * Signals that the user manually requested signature help.
     * The language service will unconditionally attempt to provide a result.
     */
    interface SignatureHelpInvokedReason {
        kind: "invoked";
        triggerCharacter?: undefined;
    }
    /**
     * Signals that the signature help request came from a user typing a character.
     * Depending on the character and the syntactic context, the request may or may not be served a result.
     */
    interface SignatureHelpCharacterTypedReason {
        kind: "characterTyped";
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter: SignatureHelpTriggerCharacter;
    }
    /**
     * Signals that this signature help request came from typing a character or moving the cursor.
     * This should only occur if a signature help session was already active and the editor needs to see if it should adjust.
     * The language service will unconditionally attempt to provide a result.
     * `triggerCharacter` can be `undefined` for a retrigger caused by a cursor move.
     */
    interface SignatureHelpRetriggeredReason {
        kind: "retrigger";
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter?: SignatureHelpRetriggerCharacter;
    }
    /**
     * Signature help request; value of command field is "signatureHelp".
     * Given a file location (file, line, col), return the signature
     * help.
     */
    interface SignatureHelpRequest extends FileLocationRequest {
        command: CommandTypes.SignatureHelp;
        arguments: SignatureHelpRequestArgs;
    }
    /**
     * Response object for a SignatureHelpRequest.
     */
    interface SignatureHelpResponse extends Response {
        body?: SignatureHelpItems;
    }
    /**
     * Synchronous request for semantic diagnostics of one file.
     */
    interface SemanticDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SemanticDiagnosticsSync;
        arguments: SemanticDiagnosticsSyncRequestArgs;
    }
    interface SemanticDiagnosticsSyncRequestArgs extends FileRequestArgs {
        includeLinePosition?: boolean;
    }
    /**
     * Response object for synchronous sematic diagnostics request.
     */
    interface SemanticDiagnosticsSyncResponse extends Response {
        body?: Diagnostic[] | DiagnosticWithLinePosition[];
    }
    interface SuggestionDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SuggestionDiagnosticsSync;
        arguments: SuggestionDiagnosticsSyncRequestArgs;
    }
    type SuggestionDiagnosticsSyncRequestArgs = SemanticDiagnosticsSyncRequestArgs;
    type SuggestionDiagnosticsSyncResponse = SemanticDiagnosticsSyncResponse;
    /**
     * Synchronous request for syntactic diagnostics of one file.
     */
    interface SyntacticDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SyntacticDiagnosticsSync;
        arguments: SyntacticDiagnosticsSyncRequestArgs;
    }
    interface SyntacticDiagnosticsSyncRequestArgs extends FileRequestArgs {
        includeLinePosition?: boolean;
    }
    /**
     * Response object for synchronous syntactic diagnostics request.
     */
    interface SyntacticDiagnosticsSyncResponse extends Response {
        body?: Diagnostic[] | DiagnosticWithLinePosition[];
    }
    /**
     * Arguments for GeterrForProject request.
     */
    interface GeterrForProjectRequestArgs {
        /**
         * the file requesting project error list
         */
        file: string;
        /**
         * Delay in milliseconds to wait before starting to compute
         * errors for the files in the file list
         */
        delay: number;
    }
    /**
     * GeterrForProjectRequest request; value of command field is
     * "geterrForProject". It works similarly with 'Geterr', only
     * it request for every file in this project.
     */
    interface GeterrForProjectRequest extends Request {
        command: CommandTypes.GeterrForProject;
        arguments: GeterrForProjectRequestArgs;
    }
    /**
     * Arguments for geterr messages.
     */
    interface GeterrRequestArgs {
        /**
         * List of file names for which to compute compiler errors.
         * The files will be checked in list order.
         */
        files: string[];
        /**
         * Delay in milliseconds to wait before starting to compute
         * errors for the files in the file list
         */
        delay: number;
    }
    /**
     * Geterr request; value of command field is "geterr". Wait for
     * delay milliseconds and then, if during the wait no change or
     * reload messages have arrived for the first file in the files
     * list, get the syntactic errors for the file, field requests,
     * and then get the semantic errors for the file.  Repeat with a
     * smaller delay for each subsequent file on the files list.  Best
     * practice for an editor is to send a file list containing each
     * file that is currently visible, in most-recently-used order.
     */
    interface GeterrRequest extends Request {
        command: CommandTypes.Geterr;
        arguments: GeterrRequestArgs;
    }
    type RequestCompletedEventName = "requestCompleted";
    /**
     * Event that is sent when server have finished processing request with specified id.
     */
    interface RequestCompletedEvent extends Event {
        event: RequestCompletedEventName;
        body: RequestCompletedEventBody;
    }
    interface RequestCompletedEventBody {
        request_seq: number;
    }
    /**
     * Item of diagnostic information found in a DiagnosticEvent message.
     */
    interface Diagnostic {
        /**
         * Starting file location at which text applies.
         */
        start: Location;
        /**
         * The last file location at which the text applies.
         */
        end: Location;
        /**
         * Text of diagnostic message.
         */
        text: string;
        /**
         * The category of the diagnostic message, e.g. "error", "warning", or "suggestion".
         */
        category: string;
        reportsUnnecessary?: {};
        /**
         * Any related spans the diagnostic may have, such as other locations relevant to an error, such as declarartion sites
         */
        relatedInformation?: DiagnosticRelatedInformation[];
        /**
         * The error code of the diagnostic message.
         */
        code?: number;
        /**
         * The name of the plugin reporting the message.
         */
        source?: string;
    }
    interface DiagnosticWithFileName extends Diagnostic {
        /**
         * Name of the file the diagnostic is in
         */
        fileName: string;
    }
    /**
     * Represents additional spans returned with a diagnostic which are relevant to it
     */
    interface DiagnosticRelatedInformation {
        /**
         * The category of the related information message, e.g. "error", "warning", or "suggestion".
         */
        category: string;
        /**
         * The code used ot identify the related information
         */
        code: number;
        /**
         * Text of related or additional information.
         */
        message: string;
        /**
         * Associated location
         */
        span?: FileSpan;
    }
    interface DiagnosticEventBody {
        /**
         * The file for which diagnostic information is reported.
         */
        file: string;
        /**
         * An array of diagnostic information items.
         */
        diagnostics: Diagnostic[];
    }
    type DiagnosticEventKind = "semanticDiag" | "syntaxDiag" | "suggestionDiag";
    /**
     * Event message for DiagnosticEventKind event types.
     * These events provide syntactic and semantic errors for a file.
     */
    interface DiagnosticEvent extends Event {
        body?: DiagnosticEventBody;
        event: DiagnosticEventKind;
    }
    interface ConfigFileDiagnosticEventBody {
        /**
         * The file which trigged the searching and error-checking of the config file
         */
        triggerFile: string;
        /**
         * The name of the found config file.
         */
        configFile: string;
        /**
         * An arry of diagnostic information items for the found config file.
         */
        diagnostics: DiagnosticWithFileName[];
    }
    /**
     * Event message for "configFileDiag" event type.
     * This event provides errors for a found config file.
     */
    interface ConfigFileDiagnosticEvent extends Event {
        body?: ConfigFileDiagnosticEventBody;
        event: "configFileDiag";
    }
    type ProjectLanguageServiceStateEventName = "projectLanguageServiceState";
    interface ProjectLanguageServiceStateEvent extends Event {
        event: ProjectLanguageServiceStateEventName;
        body?: ProjectLanguageServiceStateEventBody;
    }
    interface ProjectLanguageServiceStateEventBody {
        /**
         * Project name that has changes in the state of language service.
         * For configured projects this will be the config file path.
         * For external projects this will be the name of the projects specified when project was open.
         * For inferred projects this event is not raised.
         */
        projectName: string;
        /**
         * True if language service state switched from disabled to enabled
         * and false otherwise.
         */
        languageServiceEnabled: boolean;
    }
    type ProjectsUpdatedInBackgroundEventName = "projectsUpdatedInBackground";
    interface ProjectsUpdatedInBackgroundEvent extends Event {
        event: ProjectsUpdatedInBackgroundEventName;
        body: ProjectsUpdatedInBackgroundEventBody;
    }
    interface ProjectsUpdatedInBackgroundEventBody {
        /**
         * Current set of open files
         */
        openFiles: string[];
    }
    type ProjectLoadingStartEventName = "projectLoadingStart";
    interface ProjectLoadingStartEvent extends Event {
        event: ProjectLoadingStartEventName;
        body: ProjectLoadingStartEventBody;
    }
    interface ProjectLoadingStartEventBody {
        /** name of the project */
        projectName: string;
        /** reason for loading */
        reason: string;
    }
    type ProjectLoadingFinishEventName = "projectLoadingFinish";
    interface ProjectLoadingFinishEvent extends Event {
        event: ProjectLoadingFinishEventName;
        body: ProjectLoadingFinishEventBody;
    }
    interface ProjectLoadingFinishEventBody {
        /** name of the project */
        projectName: string;
    }
    type SurveyReadyEventName = "surveyReady";
    interface SurveyReadyEvent extends Event {
        event: SurveyReadyEventName;
        body: SurveyReadyEventBody;
    }
    interface SurveyReadyEventBody {
        /** Name of the survey. This is an internal machine- and programmer-friendly name */
        surveyId: string;
    }
    type LargeFileReferencedEventName = "largeFileReferenced";
    interface LargeFileReferencedEvent extends Event {
        event: LargeFileReferencedEventName;
        body: LargeFileReferencedEventBody;
    }
    interface LargeFileReferencedEventBody {
        /**
         * name of the large file being loaded
         */
        file: string;
        /**
         * size of the file
         */
        fileSize: number;
        /**
         * max file size allowed on the server
         */
        maxFileSize: number;
    }
    type AnyEvent = RequestCompletedEvent | DiagnosticEvent | ConfigFileDiagnosticEvent | ProjectLanguageServiceStateEvent | TelemetryEvent | ProjectsUpdatedInBackgroundEvent | ProjectLoadingStartEvent | ProjectLoadingFinishEvent | SurveyReadyEvent | LargeFileReferencedEvent;
    /**
     * Arguments for reload request.
     */
    interface ReloadRequestArgs extends FileRequestArgs {
        /**
         * Name of temporary file from which to reload file
         * contents. May be same as file.
         */
        tmpfile: string;
    }
    /**
     * Reload request message; value of command field is "reload".
     * Reload contents of file with name given by the 'file' argument
     * from temporary file with name given by the 'tmpfile' argument.
     * The two names can be identical.
     */
    interface ReloadRequest extends FileRequest {
        command: CommandTypes.Reload;
        arguments: ReloadRequestArgs;
    }
    /**
     * Response to "reload" request. This is just an acknowledgement, so
     * no body field is required.
     */
    interface ReloadResponse extends Response {
    }
    /**
     * Arguments for saveto request.
     */
    interface SavetoRequestArgs extends FileRequestArgs {
        /**
         * Name of temporary file into which to save server's view of
         * file contents.
         */
        tmpfile: string;
    }
    /**
     * Saveto request message; value of command field is "saveto".
     * For debugging purposes, save to a temporaryfile (named by
     * argument 'tmpfile') the contents of file named by argument
     * 'file'.  The server does not currently send a response to a
     * "saveto" request.
     */
    interface SavetoRequest extends FileRequest {
        command: CommandTypes.Saveto;
        arguments: SavetoRequestArgs;
    }
    /**
     * Arguments for navto request message.
     */
    interface NavtoRequestArgs extends FileRequestArgs {
        /**
         * Search term to navigate to from current location; term can
         * be '.*' or an identifier prefix.
         */
        searchValue: string;
        /**
         *  Optional limit on the number of items to return.
         */
        maxResultCount?: number;
        /**
         * Optional flag to indicate we want results for just the current file
         * or the entire project.
         */
        currentFileOnly?: boolean;
        projectFileName?: string;
    }
    /**
     * Navto request message; value of command field is "navto".
     * Return list of objects giving file locations and symbols that
     * match the search term given in argument 'searchTerm'.  The
     * context for the search is given by the named file.
     */
    interface NavtoRequest extends FileRequest {
        command: CommandTypes.Navto;
        arguments: NavtoRequestArgs;
    }
    /**
     * An item found in a navto response.
     */
    interface NavtoItem extends FileSpan {
        /**
         * The symbol's name.
         */
        name: string;
        /**
         * The symbol's kind (such as 'className' or 'parameterName').
         */
        kind: ScriptElementKind;
        /**
         * exact, substring, or prefix.
         */
        matchKind: string;
        /**
         * If this was a case sensitive or insensitive match.
         */
        isCaseSensitive: boolean;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers?: string;
        /**
         * Name of symbol's container symbol (if any); for example,
         * the class name if symbol is a class member.
         */
        containerName?: string;
        /**
         * Kind of symbol's container symbol (if any).
         */
        containerKind?: ScriptElementKind;
    }
    /**
     * Navto response message. Body is an array of navto items.  Each
     * item gives a symbol that matched the search term.
     */
    interface NavtoResponse extends Response {
        body?: NavtoItem[];
    }
    /**
     * Arguments for change request message.
     */
    interface ChangeRequestArgs extends FormatRequestArgs {
        /**
         * Optional string to insert at location (file, line, offset).
         */
        insertString?: string;
    }
    /**
     * Change request message; value of command field is "change".
     * Update the server's view of the file named by argument 'file'.
     * Server does not currently send a response to a change request.
     */
    interface ChangeRequest extends FileLocationRequest {
        command: CommandTypes.Change;
        arguments: ChangeRequestArgs;
    }
    /**
     * Response to "brace" request.
     */
    interface BraceResponse extends Response {
        body?: TextSpan[];
    }
    /**
     * Brace matching request; value of command field is "brace".
     * Return response giving the file locations of matching braces
     * found in file at location line, offset.
     */
    interface BraceRequest extends FileLocationRequest {
        command: CommandTypes.Brace;
    }
    /**
     * NavBar items request; value of command field is "navbar".
     * Return response giving the list of navigation bar entries
     * extracted from the requested file.
     */
    interface NavBarRequest extends FileRequest {
        command: CommandTypes.NavBar;
    }
    /**
     * NavTree request; value of command field is "navtree".
     * Return response giving the navigation tree of the requested file.
     */
    interface NavTreeRequest extends FileRequest {
        command: CommandTypes.NavTree;
    }
    interface NavigationBarItem {
        /**
         * The item's display text.
         */
        text: string;
        /**
         * The symbol's kind (such as 'className' or 'parameterName').
         */
        kind: ScriptElementKind;
        /**
         * Optional modifiers for the kind (such as 'public').
         */
        kindModifiers?: string;
        /**
         * The definition locations of the item.
         */
        spans: TextSpan[];
        /**
         * Optional children.
         */
        childItems?: NavigationBarItem[];
        /**
         * Number of levels deep this item should appear.
         */
        indent: number;
    }
    /** protocol.NavigationTree is identical to ts.NavigationTree, except using protocol.TextSpan instead of ts.TextSpan */
    interface NavigationTree {
        text: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        spans: TextSpan[];
        nameSpan: TextSpan | undefined;
        childItems?: NavigationTree[];
    }
    type TelemetryEventName = "telemetry";
    interface TelemetryEvent extends Event {
        event: TelemetryEventName;
        body: TelemetryEventBody;
    }
    interface TelemetryEventBody {
        telemetryEventName: string;
        payload: any;
    }
    type TypesInstallerInitializationFailedEventName = "typesInstallerInitializationFailed";
    interface TypesInstallerInitializationFailedEvent extends Event {
        event: TypesInstallerInitializationFailedEventName;
        body: TypesInstallerInitializationFailedEventBody;
    }
    interface TypesInstallerInitializationFailedEventBody {
        message: string;
    }
    type TypingsInstalledTelemetryEventName = "typingsInstalled";
    interface TypingsInstalledTelemetryEventBody extends TelemetryEventBody {
        telemetryEventName: TypingsInstalledTelemetryEventName;
        payload: TypingsInstalledTelemetryEventPayload;
    }
    interface TypingsInstalledTelemetryEventPayload {
        /**
         * Comma separated list of installed typing packages
         */
        installedPackages: string;
        /**
         * true if install request succeeded, otherwise - false
         */
        installSuccess: boolean;
        /**
         * version of typings installer
         */
        typingsInstallerVersion: string;
    }
    type BeginInstallTypesEventName = "beginInstallTypes";
    type EndInstallTypesEventName = "endInstallTypes";
    interface BeginInstallTypesEvent extends Event {
        event: BeginInstallTypesEventName;
        body: BeginInstallTypesEventBody;
    }
    interface EndInstallTypesEvent extends Event {
        event: EndInstallTypesEventName;
        body: EndInstallTypesEventBody;
    }
    interface InstallTypesEventBody {
        /**
         * correlation id to match begin and end events
         */
        eventId: number;
        /**
         * list of packages to install
         */
        packages: ReadonlyArray<string>;
    }
    interface BeginInstallTypesEventBody extends InstallTypesEventBody {
    }
    interface EndInstallTypesEventBody extends InstallTypesEventBody {
        /**
         * true if installation succeeded, otherwise false
         */
        success: boolean;
    }
    interface NavBarResponse extends Response {
        body?: NavigationBarItem[];
    }
    interface NavTreeResponse extends Response {
        body?: NavigationTree;
    }
    const enum IndentStyle {
        None = "None",
        Block = "Block",
        Smart = "Smart"
    }
    interface EditorSettings {
        baseIndentSize?: number;
        indentSize?: number;
        tabSize?: number;
        newLineCharacter?: string;
        convertTabsToSpaces?: boolean;
        indentStyle?: IndentStyle | ts.IndentStyle;
    }
    interface FormatCodeSettings extends EditorSettings {
        insertSpaceAfterCommaDelimiter?: boolean;
        insertSpaceAfterSemicolonInForStatements?: boolean;
        insertSpaceBeforeAndAfterBinaryOperators?: boolean;
        insertSpaceAfterConstructor?: boolean;
        insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
        insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
        insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
        insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
        insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
        insertSpaceAfterTypeAssertion?: boolean;
        insertSpaceBeforeFunctionParenthesis?: boolean;
        placeOpenBraceOnNewLineForFunctions?: boolean;
        placeOpenBraceOnNewLineForControlBlocks?: boolean;
        insertSpaceBeforeTypeAnnotation?: boolean;
    }
    interface UserPreferences {
        readonly disableSuggestions?: boolean;
        readonly quotePreference?: "auto" | "double" | "single";
        /**
         * If enabled, TypeScript will search through all external modules' exports and add them to the completions list.
         * This affects lone identifier completions but not completions on the right hand side of `obj.`.
         */
        readonly includeCompletionsForModuleExports?: boolean;
        /**
         * If enabled, the completion list will include completions with invalid identifier names.
         * For those entries, The `insertText` and `replacementSpan` properties will be set to change from `.x` property access to `["x"]`.
         */
        readonly includeCompletionsWithInsertText?: boolean;
        readonly importModuleSpecifierPreference?: "relative" | "non-relative";
        readonly allowTextChangesInNewFiles?: boolean;
        readonly lazyConfiguredProjectsFromExternalProject?: boolean;
        readonly providePrefixAndSuffixTextForRename?: boolean;
        readonly allowRenameOfImportPath?: boolean;
    }
    interface CompilerOptions {
        allowJs?: boolean;
        allowSyntheticDefaultImports?: boolean;
        allowUnreachableCode?: boolean;
        allowUnusedLabels?: boolean;
        alwaysStrict?: boolean;
        baseUrl?: string;
        charset?: string;
        checkJs?: boolean;
        declaration?: boolean;
        declarationDir?: string;
        disableSizeLimit?: boolean;
        downlevelIteration?: boolean;
        emitBOM?: boolean;
        emitDecoratorMetadata?: boolean;
        experimentalDecorators?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        importHelpers?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        isolatedModules?: boolean;
        jsx?: JsxEmit | ts.JsxEmit;
        lib?: string[];
        locale?: string;
        mapRoot?: string;
        maxNodeModuleJsDepth?: number;
        module?: ModuleKind | ts.ModuleKind;
        moduleResolution?: ModuleResolutionKind | ts.ModuleResolutionKind;
        newLine?: NewLineKind | ts.NewLineKind;
        noEmit?: boolean;
        noEmitHelpers?: boolean;
        noEmitOnError?: boolean;
        noErrorTruncation?: boolean;
        noFallthroughCasesInSwitch?: boolean;
        noImplicitAny?: boolean;
        noImplicitReturns?: boolean;
        noImplicitThis?: boolean;
        noUnusedLocals?: boolean;
        noUnusedParameters?: boolean;
        noImplicitUseStrict?: boolean;
        noLib?: boolean;
        noResolve?: boolean;
        out?: string;
        outDir?: string;
        outFile?: string;
        paths?: MapLike<string[]>;
        plugins?: PluginImport[];
        preserveConstEnums?: boolean;
        preserveSymlinks?: boolean;
        project?: string;
        reactNamespace?: string;
        removeComments?: boolean;
        references?: ProjectReference[];
        rootDir?: string;
        rootDirs?: string[];
        skipLibCheck?: boolean;
        skipDefaultLibCheck?: boolean;
        sourceMap?: boolean;
        sourceRoot?: string;
        strict?: boolean;
        strictNullChecks?: boolean;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        target?: ScriptTarget | ts.ScriptTarget;
        traceResolution?: boolean;
        resolveJsonModule?: boolean;
        types?: string[];
        /** Paths used to used to compute primary types search locations */
        typeRoots?: string[];
        [option: string]: CompilerOptionsValue | undefined;
    }
    const enum JsxEmit {
        None = "None",
        Preserve = "Preserve",
        ReactNative = "ReactNative",
        React = "React"
    }
    const enum ModuleKind {
        None = "None",
        CommonJS = "CommonJS",
        AMD = "AMD",
        UMD = "UMD",
        System = "System",
        ES6 = "ES6",
        ES2015 = "ES2015",
        ESNext = "ESNext"
    }
    const enum ModuleResolutionKind {
        Classic = "Classic",
        Node = "Node"
    }
    const enum NewLineKind {
        Crlf = "Crlf",
        Lf = "Lf"
    }
    const enum ScriptTarget {
        ES3 = "ES3",
        ES5 = "ES5",
        ES6 = "ES6",
        ES2015 = "ES2015",
        ES2016 = "ES2016",
        ES2017 = "ES2017",
        ESNext = "ESNext"
    }
}
declare namespace ts.server {
    interface ScriptInfoVersion {
        svc: number;
        text: number;
    }
    class TextStorage {
        private readonly host;
        private readonly fileName;
        private readonly info;
        version: ScriptInfoVersion;
        /**
         * Generated only on demand (based on edits, or information requested)
         * The property text is set to undefined when edits happen on the cache
         */
        private svc;
        /**
         * Stores the text when there are no changes to the script version cache
         * The script version cache is generated on demand and text is still retained.
         * Only on edits to the script version cache, the text will be set to undefined
         */
        private text;
        /**
         * Line map for the text when there is no script version cache present
         */
        private lineMap;
        /**
         * When a large file is loaded, text will artificially be set to "".
         * In order to be able to report correct telemetry, we store the actual
         * file size in this case.  (In other cases where text === "", e.g.
         * for mixed content or dynamic files, fileSize will be undefined.)
         */
        private fileSize;
        /**
         * True if the text is for the file thats open in the editor
         */
        isOpen: boolean;
        /**
         * True if the text present is the text from the file on the disk
         */
        private ownFileText;
        /**
         * True when reloading contents of file from the disk is pending
         */
        private pendingReloadFromDisk;
        constructor(host: ServerHost, fileName: NormalizedPath, initialVersion: ScriptInfoVersion | undefined, info: ScriptInfo);
        getVersion(): string;
        hasScriptVersionCache_TestOnly(): boolean;
        useScriptVersionCache_TestOnly(): void;
        private resetSourceMapInfo;
        /** Public for testing */
        useText(newText?: string): void;
        edit(start: number, end: number, newText: string): void;
        /**
         * Set the contents as newText
         * returns true if text changed
         */
        reload(newText: string): boolean;
        /**
         * Reads the contents from tempFile(if supplied) or own file and sets it as contents
         * returns true if text changed
         */
        reloadWithFileText(tempFileName?: string): boolean;
        /**
         * Reloads the contents from the file if there is no pending reload from disk or the contents of file are same as file text
         * returns true if text changed
         */
        reloadFromDisk(): boolean;
        delayReloadFromFileIntoText(): void;
        /**
         * For telemetry purposes, we would like to be able to report the size of the file.
         * However, we do not want telemetry to require extra file I/O so we report a size
         * that may be stale (e.g. may not reflect change made on disk since the last reload).
         * NB: Will read from disk if the file contents have never been loaded because
         * telemetry falsely indicating size 0 would be counter-productive.
         */
        getTelemetryFileSize(): number;
        getSnapshot(): IScriptSnapshot;
        getAbsolutePositionAndLineText(line: number): AbsolutePositionAndLineText;
        /**
         *  @param line 0 based index
         */
        lineToTextSpan(line: number): TextSpan;
        /**
         * @param line 1 based index
         * @param offset 1 based index
         */
        lineOffsetToPosition(line: number, offset: number, allowEdits?: true): number;
        positionToLineOffset(position: number): protocol.Location;
        private getFileTextAndSize;
        private switchToScriptVersionCache;
        private useScriptVersionCacheIfValidOrOpen;
        private getOrLoadText;
        private getLineMap;
        getLineInfo(): LineInfo;
    }
    function isDynamicFileName(fileName: NormalizedPath): boolean;
    interface DocumentRegistrySourceFileCache {
        key: DocumentRegistryBucketKey;
        sourceFile: SourceFile;
    }
    interface SourceMapFileWatcher {
        watcher: FileWatcher;
        sourceInfos?: Map<true>;
    }
    class ScriptInfo {
        private readonly host;
        readonly fileName: NormalizedPath;
        readonly scriptKind: ScriptKind;
        readonly hasMixedContent: boolean;
        readonly path: Path;
        /**
         * All projects that include this file
         */
        readonly containingProjects: Project[];
        private formatSettings;
        private preferences;
        fileWatcher: FileWatcher | undefined;
        private textStorage;
        readonly isDynamic: boolean;
        /** Set to real path if path is different from info.path */
        private realpath;
        cacheSourceFile: DocumentRegistrySourceFileCache | undefined;
        mTime?: number;
        sourceFileLike?: SourceFileLike;
        sourceMapFilePath?: Path | SourceMapFileWatcher | false;
        declarationInfoPath?: Path;
        sourceInfos?: Map<true>;
        documentPositionMapper?: DocumentPositionMapper | false;
        constructor(host: ServerHost, fileName: NormalizedPath, scriptKind: ScriptKind, hasMixedContent: boolean, path: Path, initialVersion?: ScriptInfoVersion);
        getVersion(): ScriptInfoVersion;
        getTelemetryFileSize(): number;
        isDynamicOrHasMixedContent(): boolean;
        isScriptOpen(): boolean;
        open(newText: string): void;
        close(fileExists?: boolean): void;
        getSnapshot(): IScriptSnapshot;
        private ensureRealPath;
        getRealpathIfDifferent(): Path | undefined;
        getFormatCodeSettings(): FormatCodeSettings | undefined;
        getPreferences(): protocol.UserPreferences | undefined;
        attachToProject(project: Project): boolean;
        isAttached(project: Project): boolean;
        detachFromProject(project: Project): void;
        detachAllProjects(): void;
        getDefaultProject(): Project;
        registerFileUpdate(): void;
        setOptions(formatSettings: FormatCodeSettings, preferences: protocol.UserPreferences | undefined): void;
        getLatestVersion(): string;
        saveTo(fileName: string): void;
        delayReloadNonMixedContentFile(): void;
        reloadFromFile(tempFileName?: NormalizedPath): boolean;
        getAbsolutePositionAndLineText(line: number): AbsolutePositionAndLineText;
        editContent(start: number, end: number, newText: string): void;
        markContainingProjectsAsDirty(): void;
        isOrphan(): boolean;
        /**
         *  @param line 1 based index
         */
        lineToTextSpan(line: number): TextSpan;
        /**
         * @param line 1 based index
         * @param offset 1 based index
         */
        lineOffsetToPosition(line: number, offset: number): number;
        lineOffsetToPosition(line: number, offset: number, allowEdits?: true): number;
        positionToLineOffset(position: number): protocol.Location;
        isJavaScript(): boolean;
        getLineInfo(): LineInfo;
        closeSourceMapFileWatcher(): void;
    }
}
declare namespace ts.server {
    interface InstallPackageOptionsWithProject extends InstallPackageOptions {
        projectName: string;
        projectRootPath: Path;
    }
    interface ITypingsInstaller {
        isKnownTypesPackageName(name: string): boolean;
        installPackage(options: InstallPackageOptionsWithProject): Promise<ApplyCodeActionCommandResult>;
        inspectValue(options: InspectValueOptions): Promise<ValueInfo>;
        enqueueInstallTypingsRequest(p: Project, typeAcquisition: TypeAcquisition, unresolvedImports: SortedReadonlyArray<string> | undefined): void;
        attach(projectService: ProjectService): void;
        onProjectClosed(p: Project): void;
        readonly globalTypingsCacheLocation: string | undefined;
    }
    const nullTypingsInstaller: ITypingsInstaller;
    class TypingsCache {
        private readonly installer;
        private readonly perProjectCache;
        constructor(installer: ITypingsInstaller);
        isKnownTypesPackageName(name: string): boolean;
        installPackage(options: InstallPackageOptionsWithProject): Promise<ApplyCodeActionCommandResult>;
        inspectValue(options: InspectValueOptions): Promise<ValueInfo>;
        enqueueInstallTypingsForProject(project: Project, unresolvedImports: SortedReadonlyArray<string> | undefined, forceRefresh: boolean): void;
        updateTypingsForProject(projectName: string, compilerOptions: CompilerOptions, typeAcquisition: TypeAcquisition, unresolvedImports: SortedReadonlyArray<string>, newTypings: string[]): SortedReadonlyArray<string>;
        onProjectClosed(project: Project): void;
    }
}
declare namespace ts.server {
    enum ProjectKind {
        Inferred = 0,
        Configured = 1,
        External = 2
    }
    type Mutable<T> = {
        -readonly [K in keyof T]: T[K];
    };
    function countEachFileTypes(infos: ScriptInfo[], includeSizes?: boolean): FileStats;
    function allRootFilesAreJsOrDts(project: Project): boolean;
    function allFilesAreJsOrDts(project: Project): boolean;
    function hasNoTypeScriptSource(fileNames: string[]): boolean;
    interface ProjectFilesWithTSDiagnostics extends protocol.ProjectFiles {
        projectErrors: ReadonlyArray<Diagnostic>;
    }
    interface PluginCreateInfo {
        project: Project;
        languageService: LanguageService;
        languageServiceHost: LanguageServiceHost;
        serverHost: ServerHost;
        config: any;
    }
    interface PluginModule {
        create(createInfo: PluginCreateInfo): LanguageService;
        getExternalFiles?(proj: Project): string[];
        onConfigurationChanged?(config: any): void;
    }
    interface PluginModuleWithName {
        name: string;
        module: PluginModule;
    }
    type PluginModuleFactory = (mod: {
        typescript: typeof ts;
    }) => PluginModule;
    /**
     * The project root can be script info - if root is present,
     * or it could be just normalized path if root wasnt present on the host(only for non inferred project)
     */
    type ProjectRoot = ScriptInfo | NormalizedPath;
    function isScriptInfo(value: ProjectRoot): value is ScriptInfo;
    abstract class Project implements LanguageServiceHost, ModuleResolutionHost {
        readonly projectName: string;
        readonly projectKind: ProjectKind;
        readonly projectService: ProjectService;
        private documentRegistry;
        private compilerOptions;
        compileOnSaveEnabled: boolean;
        private rootFiles;
        private rootFilesMap;
        private program;
        private externalFiles;
        private missingFilesMap;
        private plugins;
        /**
         * This is map from files to unresolved imports in it
         * Maop does not contain entries for files that do not have unresolved imports
         * This helps in containing the set of files to invalidate
         */
        cachedUnresolvedImportsPerFile: Map<readonly string[]>;
        lastCachedUnresolvedImportsList: SortedReadonlyArray<string> | undefined;
        private hasAddedorRemovedFiles;
        private lastFileExceededProgramSize;
        protected languageService: LanguageService;
        languageServiceEnabled: boolean;
        readonly trace?: (s: string) => void;
        readonly realpath?: (path: string) => string;
        hasInvalidatedResolution: HasInvalidatedResolution | undefined;
        resolutionCache: ResolutionCache;
        private builderState;
        /**
         * Set of files names that were updated since the last call to getChangesSinceVersion.
         */
        private updatedFileNames;
        /**
         * Set of files that was returned from the last call to getChangesSinceVersion.
         */
        private lastReportedFileNames;
        /**
         * Last version that was reported.
         */
        private lastReportedVersion;
        /**
         * Current project's program version. (incremented everytime new program is created that is not complete reuse from the old one)
         * This property is changed in 'updateGraph' based on the set of files in program
         */
        private projectProgramVersion;
        /**
         * Current version of the project state. It is changed when:
         * - new root file was added/removed
         * - edit happen in some file that is currently included in the project.
         * This property is different from projectStructureVersion since in most cases edits don't affect set of files in the project
         */
        private projectStateVersion;
        protected isInitialLoadPending: () => boolean;
        dirty: boolean;
        hasChangedAutomaticTypeDirectiveNames: boolean;
        typingFiles: SortedReadonlyArray<string>;
        originalConfiguredProjects: Map<true> | undefined;
        private readonly cancellationToken;
        isNonTsProject(): boolean;
        isJsOnlyProject(): boolean;
        static resolveModule(moduleName: string, initialDir: string, host: ServerHost, log: (message: string) => void): {} | undefined;
        readonly currentDirectory: string;
        directoryStructureHost: DirectoryStructureHost;
        readonly getCanonicalFileName: GetCanonicalFileName;
        constructor(projectName: string, projectKind: ProjectKind, projectService: ProjectService, documentRegistry: DocumentRegistry, hasExplicitListOfFiles: boolean, lastFileExceededProgramSize: string | undefined, compilerOptions: CompilerOptions, compileOnSaveEnabled: boolean, directoryStructureHost: DirectoryStructureHost, currentDirectory: string | undefined);
        isKnownTypesPackageName(name: string): boolean;
        installPackage(options: InstallPackageOptions): Promise<ApplyCodeActionCommandResult>;
        inspectValue(options: InspectValueOptions): Promise<ValueInfo>;
        private readonly typingsCache;
        getCompilationSettings(): CompilerOptions;
        getCompilerOptions(): CompilerOptions;
        getNewLine(): string;
        getProjectVersion(): string;
        getProjectReferences(): ReadonlyArray<ProjectReference> | undefined;
        getScriptFileNames(): string[];
        private getOrCreateScriptInfoAndAttachToProject;
        getScriptKind(fileName: string): ScriptKind;
        getScriptVersion(filename: string): string;
        getScriptSnapshot(filename: string): IScriptSnapshot | undefined;
        getCancellationToken(): HostCancellationToken;
        getCurrentDirectory(): string;
        getDefaultLibFileName(): string;
        useCaseSensitiveFileNames(): boolean;
        readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
        readFile(fileName: string): string | undefined;
        writeFile(fileName: string, content: string): void;
        fileExists(file: string): boolean;
        resolveModuleNames(moduleNames: string[], containingFile: string, reusedNames?: string[], redirectedReference?: ResolvedProjectReference): (ResolvedModuleFull | undefined)[];
        getResolvedModuleWithFailedLookupLocationsFromCache(moduleName: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
        resolveTypeReferenceDirectives(typeDirectiveNames: string[], containingFile: string, redirectedReference?: ResolvedProjectReference): (ResolvedTypeReferenceDirective | undefined)[];
        directoryExists(path: string): boolean;
        getDirectories(path: string): string[];
        getCachedDirectoryStructureHost(): CachedDirectoryStructureHost;
        toPath(fileName: string): Path;
        watchDirectoryOfFailedLookupLocation(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
        onInvalidatedResolution(): void;
        watchTypeRootsDirectory(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
        onChangedAutomaticTypeDirectiveNames(): void;
        getGlobalCache(): string | undefined;
        writeLog(s: string): void;
        log(s: string): void;
        error(s: string): void;
        private setInternalCompilerOptionsForEmittingJsFiles;
        /**
         * Get the errors that dont have any file name associated
         */
        getGlobalProjectErrors(): ReadonlyArray<Diagnostic>;
        getAllProjectErrors(): ReadonlyArray<Diagnostic>;
        getLanguageService(ensureSynchronized?: boolean): LanguageService;
        /** @internal */
        getSourceMapper(): SourceMapper;
        getDocumentPositionMapper(generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
        getSourceFileLike(fileName: string): SourceFileLike | undefined;
        private shouldEmitFile;
        getCompileOnSaveAffectedFileList(scriptInfo: ScriptInfo): string[];
        /**
         * Returns true if emit was conducted
         */
        emitFile(scriptInfo: ScriptInfo, writeFile: (path: string, data: string, writeByteOrderMark?: boolean) => void): boolean;
        enableLanguageService(): void;
        disableLanguageService(lastFileExceededProgramSize?: string): void;
        getProjectName(): string;
        abstract getTypeAcquisition(): TypeAcquisition;
        protected removeLocalTypingsFromTypeAcquisition(newTypeAcquisition: TypeAcquisition): TypeAcquisition;
        getExternalFiles(): SortedReadonlyArray<string>;
        getSourceFile(path: Path): SourceFile | undefined;
        getSourceFileOrConfigFile(path: Path): SourceFile | undefined;
        close(): void;
        private detachScriptInfoIfNotRoot;
        isClosed(): boolean;
        hasRoots(): boolean;
        isOrphan(): boolean;
        getRootFiles(): NormalizedPath[];
        getRootFilesMap(): Map<ProjectRoot>;
        getRootScriptInfos(): ScriptInfo[];
        getScriptInfos(): ScriptInfo[];
        getExcludedFiles(): ReadonlyArray<NormalizedPath>;
        getFileNames(excludeFilesFromExternalLibraries?: boolean, excludeConfigFiles?: boolean): NormalizedPath[];
        hasConfigFile(configFilePath: NormalizedPath): boolean;
        containsScriptInfo(info: ScriptInfo): boolean;
        containsFile(filename: NormalizedPath, requireOpen?: boolean): boolean;
        isRoot(info: ScriptInfo): boolean;
        addRoot(info: ScriptInfo): void;
        addMissingFileRoot(fileName: NormalizedPath): void;
        removeFile(info: ScriptInfo, fileExists: boolean, detachFromProject: boolean): void;
        registerFileUpdate(fileName: string): void;
        markAsDirty(): void;
        onFileAddedOrRemoved(): void;
        /**
         * Updates set of files that contribute to this project
         * @returns: true if set of files in the project stays the same and false - otherwise.
         */
        updateGraph(): boolean;
        updateTypingFiles(typingFiles: SortedReadonlyArray<string>): void;
        getCurrentProgram(): Program | undefined;
        protected removeExistingTypings(include: string[]): string[];
        private updateGraphWorker;
        private detachScriptInfoFromProject;
        private addMissingFileWatcher;
        private isWatchedMissingFile;
        getScriptInfoForNormalizedPath(fileName: NormalizedPath): ScriptInfo | undefined;
        getScriptInfo(uncheckedFileName: string): ScriptInfo | undefined;
        filesToString(writeProjectFileNames: boolean): string;
        print(counter?: number): void;
        setCompilerOptions(compilerOptions: CompilerOptions): void;
        getChangesSinceVersion(lastKnownVersion?: number): ProjectFilesWithTSDiagnostics;
        protected removeRoot(info: ScriptInfo): void;
        protected enableGlobalPlugins(options: CompilerOptions, pluginConfigOverrides: Map<any> | undefined): void;
        protected enablePlugin(pluginConfigEntry: PluginImport, searchPaths: string[], pluginConfigOverrides: Map<any> | undefined): void;
        private enableProxy;
        onPluginConfigurationChanged(pluginName: string, configuration: any): void;
        /** Starts a new check for diagnostics. Call this if some file has updated that would cause diagnostics to be changed. */
        refreshDiagnostics(): void;
    }
    /**
     * If a file is opened and no tsconfig (or jsconfig) is found,
     * the file and its imports/references are put into an InferredProject.
     */
    class InferredProject extends Project {
        private static readonly newName;
        private _isJsInferredProject;
        toggleJsInferredProject(isJsInferredProject: boolean): void;
        setCompilerOptions(options?: CompilerOptions): void;
        /** this is canonical project root path */
        readonly projectRootPath: string | undefined;
        /** stored only if their is no projectRootPath and this isnt single inferred project */
        readonly canonicalCurrentDirectory: string | undefined;
        constructor(projectService: ProjectService, documentRegistry: DocumentRegistry, compilerOptions: CompilerOptions, projectRootPath: NormalizedPath | undefined, currentDirectory: string | undefined, pluginConfigOverrides: Map<any> | undefined);
        addRoot(info: ScriptInfo): void;
        removeRoot(info: ScriptInfo): void;
        isOrphan(): boolean;
        isProjectWithSingleRoot(): boolean;
        close(): void;
        getTypeAcquisition(): TypeAcquisition;
    }
    /**
     * If a file is opened, the server will look for a tsconfig (or jsconfig)
     * and if successfull create a ConfiguredProject for it.
     * Otherwise it will create an InferredProject.
     */
    class ConfiguredProject extends Project {
        private typeAcquisition;
        configFileWatcher: FileWatcher | undefined;
        private directoriesWatchedForWildcards;
        readonly canonicalConfigFilePath: NormalizedPath;
        pendingReload: ConfigFileProgramReloadLevel | undefined;
        pendingReloadReason: string | undefined;
        configFileSpecs: ConfigFileSpecs | undefined;
        canConfigFileJsonReportNoInputFiles: boolean;
        /** Ref count to the project when opened from external project */
        private externalProjectRefCount;
        private projectErrors;
        private projectReferences;
        projectOptions?: ProjectOptions | true;
        protected isInitialLoadPending: () => boolean;
        sendLoadingProjectFinish: boolean;
        constructor(configFileName: NormalizedPath, projectService: ProjectService, documentRegistry: DocumentRegistry, cachedDirectoryStructureHost: CachedDirectoryStructureHost);
        /**
         * If the project has reload from disk pending, it reloads (and then updates graph as part of that) instead of just updating the graph
         * @returns: true if set of files in the project stays the same and false - otherwise.
         */
        updateGraph(): boolean;
        getCachedDirectoryStructureHost(): CachedDirectoryStructureHost;
        getConfigFilePath(): NormalizedPath;
        getProjectReferences(): ReadonlyArray<ProjectReference> | undefined;
        updateReferences(refs: ReadonlyArray<ProjectReference> | undefined): void;
        forEachResolvedProjectReference<T>(cb: (resolvedProjectReference: ResolvedProjectReference | undefined, resolvedProjectReferencePath: Path) => T | undefined): T | undefined;
        enablePluginsWithOptions(options: CompilerOptions, pluginConfigOverrides: Map<any> | undefined): void;
        /**
         * Get the errors that dont have any file name associated
         */
        getGlobalProjectErrors(): ReadonlyArray<Diagnostic>;
        /**
         * Get all the project errors
         */
        getAllProjectErrors(): ReadonlyArray<Diagnostic>;
        setProjectErrors(projectErrors: Diagnostic[]): void;
        setTypeAcquisition(newTypeAcquisition: TypeAcquisition): void;
        getTypeAcquisition(): TypeAcquisition;
        watchWildcards(wildcardDirectories: Map<WatchDirectoryFlags>): void;
        stopWatchingWildCards(): void;
        close(): void;
        addExternalProjectReference(): void;
        deleteExternalProjectReference(): void;
        /** Returns true if the project is needed by any of the open script info/external project */
        hasOpenRef(): boolean;
        hasExternalProjectRef(): boolean;
        getEffectiveTypeRoots(): string[];
        updateErrorOnNoInputFiles(fileNameResult: ExpandResult): void;
    }
    /**
     * Project whose configuration is handled externally, such as in a '.csproj'.
     * These are created only if a host explicitly calls `openExternalProject`.
     */
    class ExternalProject extends Project {
        externalProjectName: string;
        compileOnSaveEnabled: boolean;
        excludedFiles: ReadonlyArray<NormalizedPath>;
        private typeAcquisition;
        constructor(externalProjectName: string, projectService: ProjectService, documentRegistry: DocumentRegistry, compilerOptions: CompilerOptions, lastFileExceededProgramSize: string | undefined, compileOnSaveEnabled: boolean, projectFilePath?: string);
        updateGraph(): boolean;
        getExcludedFiles(): readonly NormalizedPath[];
        getTypeAcquisition(): TypeAcquisition;
        setTypeAcquisition(newTypeAcquisition: TypeAcquisition): void;
    }
}
declare namespace ts.server {
    const maxProgramSizeForNonTsFiles: number;
    const maxFileSize: number;
    const ProjectsUpdatedInBackgroundEvent = "projectsUpdatedInBackground";
    const ProjectLoadingStartEvent = "projectLoadingStart";
    const ProjectLoadingFinishEvent = "projectLoadingFinish";
    const LargeFileReferencedEvent = "largeFileReferenced";
    const ConfigFileDiagEvent = "configFileDiag";
    const ProjectLanguageServiceStateEvent = "projectLanguageServiceState";
    const ProjectInfoTelemetryEvent = "projectInfo";
    const OpenFileInfoTelemetryEvent = "openFileInfo";
    interface ProjectsUpdatedInBackgroundEvent {
        eventName: typeof ProjectsUpdatedInBackgroundEvent;
        data: {
            openFiles: string[];
        };
    }
    interface ProjectLoadingStartEvent {
        eventName: typeof ProjectLoadingStartEvent;
        data: {
            project: Project;
            reason: string;
        };
    }
    interface ProjectLoadingFinishEvent {
        eventName: typeof ProjectLoadingFinishEvent;
        data: {
            project: Project;
        };
    }
    interface LargeFileReferencedEvent {
        eventName: typeof LargeFileReferencedEvent;
        data: {
            file: string;
            fileSize: number;
            maxFileSize: number;
        };
    }
    interface ConfigFileDiagEvent {
        eventName: typeof ConfigFileDiagEvent;
        data: {
            triggerFile: string;
            configFileName: string;
            diagnostics: ReadonlyArray<Diagnostic>;
        };
    }
    interface ProjectLanguageServiceStateEvent {
        eventName: typeof ProjectLanguageServiceStateEvent;
        data: {
            project: Project;
            languageServiceEnabled: boolean;
        };
    }
    /** This will be converted to the payload of a protocol.TelemetryEvent in session.defaultEventHandler. */
    interface ProjectInfoTelemetryEvent {
        readonly eventName: typeof ProjectInfoTelemetryEvent;
        readonly data: ProjectInfoTelemetryEventData;
    }
    interface ProjectInfoTelemetryEventData {
        /** Cryptographically secure hash of project file location. */
        readonly projectId: string;
        /** Count of file extensions seen in the project. */
        readonly fileStats: FileStats;
        /**
         * Any compiler options that might contain paths will be taken out.
         * Enum compiler options will be converted to strings.
         */
        readonly compilerOptions: CompilerOptions;
        readonly extends: boolean | undefined;
        readonly files: boolean | undefined;
        readonly include: boolean | undefined;
        readonly exclude: boolean | undefined;
        readonly compileOnSave: boolean;
        readonly typeAcquisition: ProjectInfoTypeAcquisitionData;
        readonly configFileName: "tsconfig.json" | "jsconfig.json" | "other";
        readonly projectType: "external" | "configured";
        readonly languageServiceEnabled: boolean;
        /** TypeScript version used by the server. */
        readonly version: string;
    }
    /**
     * Info that we may send about a file that was just opened.
     * Info about a file will only be sent once per session, even if the file changes in ways that might affect the info.
     * Currently this is only sent for '.js' files.
     */
    interface OpenFileInfoTelemetryEvent {
        readonly eventName: typeof OpenFileInfoTelemetryEvent;
        readonly data: OpenFileInfoTelemetryEventData;
    }
    interface OpenFileInfoTelemetryEventData {
        readonly info: OpenFileInfo;
    }
    interface ProjectInfoTypeAcquisitionData {
        readonly enable: boolean | undefined;
        readonly include: boolean;
        readonly exclude: boolean;
    }
    interface FileStats {
        readonly js: number;
        readonly jsSize?: number;
        readonly jsx: number;
        readonly jsxSize?: number;
        readonly ts: number;
        readonly tsSize?: number;
        readonly tsx: number;
        readonly tsxSize?: number;
        readonly dts: number;
        readonly dtsSize?: number;
        readonly deferred: number;
        readonly deferredSize?: number;
    }
    interface OpenFileInfo {
        readonly checkJs: boolean;
    }
    type ProjectServiceEvent = LargeFileReferencedEvent | ProjectsUpdatedInBackgroundEvent | ProjectLoadingStartEvent | ProjectLoadingFinishEvent | ConfigFileDiagEvent | ProjectLanguageServiceStateEvent | ProjectInfoTelemetryEvent | OpenFileInfoTelemetryEvent;
    type ProjectServiceEventHandler = (event: ProjectServiceEvent) => void;
    interface SafeList {
        [name: string]: {
            match: RegExp;
            exclude?: (string | number)[][];
            types?: string[];
        };
    }
    interface TypesMapFile {
        typesMap: SafeList;
        simpleMap: {
            [libName: string]: string;
        };
    }
    function convertFormatOptions(protocolOptions: protocol.FormatCodeSettings): FormatCodeSettings;
    function convertCompilerOptions(protocolOptions: protocol.ExternalProjectCompilerOptions): CompilerOptions & protocol.CompileOnSaveMixin;
    function tryConvertScriptKindName(scriptKindName: protocol.ScriptKindName | ScriptKind): ScriptKind;
    function convertScriptKindName(scriptKindName: protocol.ScriptKindName): ScriptKind.Unknown | ScriptKind.JS | ScriptKind.JSX | ScriptKind.TS | ScriptKind.TSX;
    function convertUserPreferences(preferences: protocol.UserPreferences): UserPreferences;
    interface HostConfiguration {
        formatCodeOptions: FormatCodeSettings;
        preferences: protocol.UserPreferences;
        hostInfo: string;
        extraFileExtensions?: FileExtensionInfo[];
    }
    interface OpenConfiguredProjectResult {
        configFileName?: NormalizedPath;
        configFileErrors?: ReadonlyArray<Diagnostic>;
    }
    interface ConfigFileExistenceInfo {
        /**
         * Cached value of existence of config file
         * It is true if there is configured project open for this file.
         * It can be either true or false if this is the config file that is being watched by inferred project
         *   to decide when to update the structure so that it knows about updating the project for its files
         *   (config file may include the inferred project files after the change and hence may be wont need to be in inferred project)
         */
        exists: boolean;
        /**
         * openFilesImpactedByConfigFiles is a map of open files that would be impacted by this config file
         *   because these are the paths being looked up for their default configured project location
         * The value in the map is true if the open file is root of the inferred project
         * It is false when the open file that would still be impacted by existance of
         *   this config file but it is not the root of inferred project
         */
        openFilesImpactedByConfigFile: Map<boolean>;
        /**
         * The file watcher watching the config file because there is open script info that is root of
         * inferred project and will be impacted by change in the status of the config file
         * The watcher is present only when there is no open configured project for the config file
         */
        configFileWatcherForRootOfInferredProject?: FileWatcher;
    }
    interface ProjectServiceOptions {
        host: ServerHost;
        logger: Logger;
        cancellationToken: HostCancellationToken;
        useSingleInferredProject: boolean;
        useInferredProjectPerProjectRoot: boolean;
        typingsInstaller: ITypingsInstaller;
        eventHandler?: ProjectServiceEventHandler;
        suppressDiagnosticEvents?: boolean;
        throttleWaitMilliseconds?: number;
        globalPlugins?: ReadonlyArray<string>;
        pluginProbeLocations?: ReadonlyArray<string>;
        allowLocalPluginLoads?: boolean;
        typesMapLocation?: string;
        syntaxOnly?: boolean;
    }
    function updateProjectIfDirty(project: Project): boolean;
    interface OpenFileArguments {
        fileName: string;
        content?: string;
        scriptKind?: protocol.ScriptKindName | ScriptKind;
        hasMixedContent?: boolean;
        projectRootPath?: string;
    }
    interface ChangeFileArguments {
        fileName: string;
        changes: Iterator<TextChange>;
    }
    class ProjectService {
        readonly typingsCache: TypingsCache;
        readonly documentRegistry: DocumentRegistry;
        /**
         * Container of all known scripts
         */
        readonly filenameToScriptInfo: Map<ScriptInfo>;
        private readonly scriptInfoInNodeModulesWatchers;
        /**
         * Contains all the deleted script info's version information so that
         * it does not reset when creating script info again
         * (and could have potentially collided with version where contents mismatch)
         */
        private readonly filenameToScriptInfoVersion;
        private readonly allJsFilesForOpenFileTelemetry;
        /**
         * Map to the real path of the infos
         */
        readonly realpathToScriptInfos: MultiMap<ScriptInfo> | undefined;
        /**
         * maps external project file name to list of config files that were the part of this project
         */
        private readonly externalProjectToConfiguredProjectMap;
        /**
         * external projects (configuration and list of root files is not controlled by tsserver)
         */
        readonly externalProjects: ExternalProject[];
        /**
         * projects built from openFileRoots
         */
        readonly inferredProjects: InferredProject[];
        /**
         * projects specified by a tsconfig.json file
         */
        readonly configuredProjects: Map<ConfiguredProject>;
        /**
         * Open files: with value being project root path, and key being Path of the file that is open
         */
        readonly openFiles: Map<NormalizedPath | undefined>;
        /**
         * Map of open files that are opened without complete path but have projectRoot as current directory
         */
        private readonly openFilesWithNonRootedDiskPath;
        private compilerOptionsForInferredProjects;
        private compilerOptionsForInferredProjectsPerProjectRoot;
        /**
         * Project size for configured or external projects
         */
        private readonly projectToSizeMap;
        /**
         * This is a map of config file paths existance that doesnt need query to disk
         * - The entry can be present because there is inferred project that needs to watch addition of config file to directory
         *   In this case the exists could be true/false based on config file is present or not
         * - Or it is present if we have configured project open with config file at that location
         *   In this case the exists property is always true
         */
        private readonly configFileExistenceInfoCache;
        private readonly throttledOperations;
        private readonly hostConfiguration;
        private safelist;
        private readonly legacySafelist;
        private pendingProjectUpdates;
        pendingEnsureProjectForOpenFiles: boolean;
        readonly currentDirectory: NormalizedPath;
        readonly toCanonicalFileName: (f: string) => string;
        readonly host: ServerHost;
        readonly logger: Logger;
        readonly cancellationToken: HostCancellationToken;
        readonly useSingleInferredProject: boolean;
        readonly useInferredProjectPerProjectRoot: boolean;
        readonly typingsInstaller: ITypingsInstaller;
        private readonly globalCacheLocationDirectoryPath;
        readonly throttleWaitMilliseconds?: number;
        private readonly eventHandler?;
        private readonly suppressDiagnosticEvents?;
        readonly globalPlugins: ReadonlyArray<string>;
        readonly pluginProbeLocations: ReadonlyArray<string>;
        readonly allowLocalPluginLoads: boolean;
        private currentPluginConfigOverrides;
        readonly typesMapLocation: string | undefined;
        readonly syntaxOnly?: boolean;
        /** Tracks projects that we have already sent telemetry for. */
        private readonly seenProjects;
        readonly watchFactory: WatchFactory<WatchType, Project>;
        constructor(opts: ProjectServiceOptions);
        toPath(fileName: string): Path;
        getExecutingFilePath(): string;
        getNormalizedAbsolutePath(fileName: string): string;
        setDocument(key: DocumentRegistryBucketKey, path: Path, sourceFile: SourceFile): void;
        getDocument(key: DocumentRegistryBucketKey, path: Path): SourceFile | undefined;
        ensureInferredProjectsUpToDate_TestOnly(): void;
        getCompilerOptionsForInferredProjects(): CompilerOptions | undefined;
        onUpdateLanguageServiceStateForProject(project: Project, languageServiceEnabled: boolean): void;
        private loadTypesMap;
        updateTypingsForProject(response: SetTypings | InvalidateCachedTypings | PackageInstalledResponse): void;
        /** @internal */
        updateTypingsForProject(response: SetTypings | InvalidateCachedTypings | PackageInstalledResponse | BeginInstallTypes | EndInstallTypes): void;
        private delayEnsureProjectForOpenFiles;
        private delayUpdateProjectGraph;
        hasPendingProjectUpdate(project: Project): boolean;
        sendProjectsUpdatedInBackgroundEvent(): void;
        sendLargeFileReferencedEvent(file: string, fileSize: number): void;
        sendProjectLoadingStartEvent(project: ConfiguredProject, reason: string): void;
        sendProjectLoadingFinishEvent(project: ConfiguredProject): void;
        delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles(project: Project): void;
        private delayUpdateProjectGraphs;
        setCompilerOptionsForInferredProjects(projectCompilerOptions: protocol.ExternalProjectCompilerOptions, projectRootPath?: string): void;
        findProject(projectName: string): Project | undefined;
        private forEachProject;
        forEachEnabledProject(cb: (project: Project) => void): void;
        getDefaultProjectForFile(fileName: NormalizedPath, ensureProject: boolean): Project | undefined;
        tryGetDefaultProjectForFile(fileName: NormalizedPath): Project | undefined;
        ensureDefaultProjectForFile(fileName: NormalizedPath): Project;
        private doEnsureDefaultProjectForFile;
        getScriptInfoEnsuringProjectsUptoDate(uncheckedFileName: string): ScriptInfo | undefined;
        /**
         * Ensures the project structures are upto date
         * This means,
         * - we go through all the projects and update them if they are dirty
         * - if updates reflect some change in structure or there was pending request to ensure projects for open files
         *   ensure that each open script info has project
         */
        private ensureProjectStructuresUptoDate;
        getFormatCodeOptions(file: NormalizedPath): FormatCodeSettings;
        getPreferences(file: NormalizedPath): protocol.UserPreferences;
        getHostFormatCodeOptions(): FormatCodeSettings;
        getHostPreferences(): protocol.UserPreferences;
        private onSourceFileChanged;
        private handleSourceMapProjects;
        private delayUpdateSourceInfoProjects;
        private delayUpdateProjectsOfScriptInfoPath;
        private handleDeletedFile;
        /**
         * This is to watch whenever files are added or removed to the wildcard directories
         */
        watchWildcardDirectory(directory: Path, flags: WatchDirectoryFlags, project: ConfiguredProject): FileWatcher;
        /** Gets the config file existence info for the configured project */
        getConfigFileExistenceInfo(project: ConfiguredProject): ConfigFileExistenceInfo;
        private onConfigChangedForConfiguredProject;
        /**
         * This is the callback function for the config file add/remove/change at any location
         * that matters to open script info but doesnt have configured project open
         * for the config file
         */
        private onConfigFileChangeForOpenScriptInfo;
        private removeProject;
        assignOrphanScriptInfoToInferredProject(info: ScriptInfo, projectRootPath: NormalizedPath | undefined): InferredProject;
        private assignOrphanScriptInfosToInferredProject;
        /**
         * Remove this file from the set of open, non-configured files.
         * @param info The file that has been closed or newly configured
         */
        private closeOpenFile;
        private deleteScriptInfo;
        private configFileExists;
        private setConfigFileExistenceByNewConfiguredProject;
        /**
         * Returns true if the configFileExistenceInfo is needed/impacted by open files that are root of inferred project
         */
        private configFileExistenceImpactsRootOfInferredProject;
        private setConfigFileExistenceInfoByClosedConfiguredProject;
        private logConfigFileWatchUpdate;
        /**
         * Create the watcher for the configFileExistenceInfo
         */
        private createConfigFileWatcherOfConfigFileExistence;
        /**
         * Close the config file watcher in the cached ConfigFileExistenceInfo
         *   if there arent any open files that are root of inferred project
         */
        private closeConfigFileWatcherOfConfigFileExistenceInfo;
        /**
         * This is called on file close, so that we stop watching the config file for this script info
         */
        private stopWatchingConfigFilesForClosedScriptInfo;
        /**
         * This is called by inferred project whenever script info is added as a root
         */
        startWatchingConfigFilesForInferredProjectRoot(info: ScriptInfo): void;
        /**
         * This is called by inferred project whenever root script info is removed from it
         */
        stopWatchingConfigFilesForInferredProjectRoot(info: ScriptInfo): void;
        /**
         * This function tries to search for a tsconfig.json for the given file.
         * This is different from the method the compiler uses because
         * the compiler can assume it will always start searching in the
         * current directory (the directory in which tsc was invoked).
         * The server must start searching from the directory containing
         * the newly opened file.
         */
        private forEachConfigFileLocation;
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
        private getConfigFileNameForFile;
        private printProjects;
        private findConfiguredProjectByProjectName;
        private getConfiguredProjectByCanonicalConfigFilePath;
        private findExternalProjectByProjectName;
        /** Get a filename if the language service exceeds the maximum allowed program size; otherwise returns undefined. */
        private getFilenameForExceededTotalSizeLimitForNonTsFiles;
        private createExternalProject;
        sendProjectTelemetry(project: ExternalProject | ConfiguredProject): void;
        private addFilesToNonInferredProject;
        private createConfiguredProject;
        private createConfiguredProjectWithDelayLoad;
        private createAndLoadConfiguredProject;
        private createLoadAndUpdateConfiguredProject;
        /**
         * Read the config file of the project, and update the project root file names.
         */
        private loadConfiguredProject;
        private updateNonInferredProjectFiles;
        private updateRootAndOptionsOfNonInferredProject;
        /**
         * Reload the file names from config file specs and update the project graph
         */
        reloadFileNamesOfConfiguredProject(project: ConfiguredProject): boolean;
        /**
         * Read the config file of the project again by clearing the cache and update the project graph
         */
        reloadConfiguredProject(project: ConfiguredProject, reason: string): void;
        private sendConfigFileDiagEvent;
        private getOrCreateInferredProjectForProjectRootPathIfEnabled;
        private getOrCreateSingleInferredProjectIfEnabled;
        private getOrCreateSingleInferredWithoutProjectRoot;
        private createInferredProject;
        getOrCreateScriptInfoNotOpenedByClient(uncheckedFileName: string, currentDirectory: string, hostToQueryFileExistsOn: DirectoryStructureHost): ScriptInfo | undefined;
        getScriptInfo(uncheckedFileName: string): ScriptInfo | undefined;
        getScriptInfoOrConfig(uncheckedFileName: string): ScriptInfoOrConfig | undefined;
        logErrorForScriptInfoNotFound(fileName: string): void;
        /**
         * Returns the projects that contain script info through SymLink
         * Note that this does not return projects in info.containingProjects
         */
        getSymlinkedProjects(info: ScriptInfo): MultiMap<Project> | undefined;
        private watchClosedScriptInfo;
        private watchClosedScriptInfoInNodeModules;
        private getModifiedTime;
        private refreshScriptInfo;
        private refreshScriptInfosInDirectory;
        private stopWatchingScriptInfo;
        private getOrCreateScriptInfoNotOpenedByClientForNormalizedPath;
        private getOrCreateScriptInfoOpenedByClientForNormalizedPath;
        getOrCreateScriptInfoForNormalizedPath(fileName: NormalizedPath, openedByClient: boolean, fileContent?: string, scriptKind?: ScriptKind, hasMixedContent?: boolean, hostToQueryFileExistsOn?: {
            fileExists(path: string): boolean;
        }): ScriptInfo | undefined;
        private getOrCreateScriptInfoWorker;
        /**
         * This gets the script info for the normalized path. If the path is not rooted disk path then the open script info with project root context is preferred
         */
        getScriptInfoForNormalizedPath(fileName: NormalizedPath): ScriptInfo | undefined;
        getScriptInfoForPath(fileName: Path): ScriptInfo | undefined;
        getDocumentPositionMapper(project: Project, generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
        private addSourceInfoToSourceMap;
        private addMissingSourceMapFile;
        getSourceFileLike(fileName: string, projectNameOrProject: string | Project, declarationInfo?: ScriptInfo): SourceFileLike | undefined;
        setHostConfiguration(args: protocol.ConfigureRequestArguments): void;
        closeLog(): void;
        /**
         * This function rebuilds the project for every file opened by the client
         * This does not reload contents of open files from disk. But we could do that if needed
         */
        reloadProjects(): void;
        private delayReloadConfiguredProjectForFiles;
        /**
         * This function goes through all the openFiles and tries to file the config file for them.
         * If the config file is found and it refers to existing project, it reloads it either immediately
         * or schedules it for reload depending on delayReload option
         * If the there is no existing project it just opens the configured project for the config file
         * reloadForInfo provides a way to filter out files to reload configured project for
         */
        private reloadConfiguredProjectForFiles;
        /**
         * Remove the root of inferred project if script info is part of another project
         */
        private removeRootOfInferredProjectIfNowPartOfOtherProject;
        /**
         * This function is to update the project structure for every inferred project.
         * It is called on the premise that all the configured projects are
         * up to date.
         * This will go through open files and assign them to inferred project if open file is not part of any other project
         * After that all the inferred project graphs are updated
         */
        private ensureProjectForOpenFiles;
        /**
         * Open file whose contents is managed by the client
         * @param filename is absolute pathname
         * @param fileContent is a known version of the file content that is more up to date than the one on disk
         */
        openClientFile(fileName: string, fileContent?: string, scriptKind?: ScriptKind, projectRootPath?: string): OpenConfiguredProjectResult;
        getOriginalLocationEnsuringConfiguredProject(project: Project, location: DocumentPosition): DocumentPosition | undefined;
        /** @internal */
        fileExists(fileName: NormalizedPath): boolean;
        private findExternalProjectContainingOpenScriptInfo;
        private getOrCreateOpenScriptInfo;
        private assignProjectToOpenedScriptInfo;
        private cleanupAfterOpeningFile;
        openClientFileWithNormalizedPath(fileName: NormalizedPath, fileContent?: string, scriptKind?: ScriptKind, hasMixedContent?: boolean, projectRootPath?: NormalizedPath): OpenConfiguredProjectResult;
        private removeOrphanConfiguredProjects;
        private removeOrphanScriptInfos;
        private telemetryOnOpenFile;
        /**
         * Close file whose contents is managed by the client
         * @param filename is absolute pathname
         */
        closeClientFile(uncheckedFileName: string): void;
        closeClientFile(uncheckedFileName: string, skipAssignOrphanScriptInfosToInferredProject: true): boolean;
        private collectChanges;
        synchronizeProjectList(knownProjects: protocol.ProjectVersionInfo[]): ProjectFilesWithTSDiagnostics[];
        applyChangesInOpenFiles(openFiles: Iterator<OpenFileArguments> | undefined, changedFiles?: Iterator<ChangeFileArguments>, closedFiles?: string[]): void;
        applyChangesToFile(scriptInfo: ScriptInfo, changes: Iterator<TextChange>): void;
        private closeConfiguredProjectReferencedFromExternalProject;
        closeExternalProject(uncheckedFileName: string): void;
        openExternalProjects(projects: protocol.ExternalProject[]): void;
        /** Makes a filename safe to insert in a RegExp */
        private static readonly filenameEscapeRegexp;
        private static escapeFilenameForRegex;
        resetSafeList(): void;
        applySafeList(proj: protocol.ExternalProject): NormalizedPath[];
        openExternalProject(proj: protocol.ExternalProject): void;
        hasDeferredExtension(): boolean;
        configurePlugin(args: protocol.ConfigurePluginRequestArguments): void;
    }
    type ScriptInfoOrConfig = ScriptInfo | TsConfigSourceFile;
    function isConfigFile(config: ScriptInfoOrConfig): config is TsConfigSourceFile;
}
declare namespace ts.server {
    interface ServerCancellationToken extends HostCancellationToken {
        setRequest(requestId: number): void;
        resetRequest(requestId: number): void;
    }
    const nullCancellationToken: ServerCancellationToken;
    interface PendingErrorCheck {
        fileName: NormalizedPath;
        project: Project;
    }
    type CommandNames = protocol.CommandTypes;
    const CommandNames: any;
    function formatMessage<T extends protocol.Message>(msg: T, logger: Logger, byteLength: (s: string, encoding: string) => number, newLine: string): string;
    type Event = <T extends object>(body: T, eventName: string) => void;
    interface EventSender {
        event: Event;
    }
    /** @internal */
    function toEvent(eventName: string, body: object): protocol.Event;
    interface SessionOptions {
        host: ServerHost;
        cancellationToken: ServerCancellationToken;
        useSingleInferredProject: boolean;
        useInferredProjectPerProjectRoot: boolean;
        typingsInstaller: ITypingsInstaller;
        byteLength: (buf: string, encoding?: string) => number;
        hrtime: (start?: number[]) => number[];
        logger: Logger;
        /**
         * If falsy, all events are suppressed.
         */
        canUseEvents: boolean;
        eventHandler?: ProjectServiceEventHandler;
        /** Has no effect if eventHandler is also specified. */
        suppressDiagnosticEvents?: boolean;
        syntaxOnly?: boolean;
        throttleWaitMilliseconds?: number;
        noGetErrOnBackgroundUpdate?: boolean;
        globalPlugins?: ReadonlyArray<string>;
        pluginProbeLocations?: ReadonlyArray<string>;
        allowLocalPluginLoads?: boolean;
        typesMapLocation?: string;
    }
    class Session implements EventSender {
        private readonly gcTimer;
        protected projectService: ProjectService;
        private changeSeq;
        private currentRequestId;
        private errorCheck;
        protected host: ServerHost;
        private readonly cancellationToken;
        protected readonly typingsInstaller: ITypingsInstaller;
        protected byteLength: (buf: string, encoding?: string) => number;
        private hrtime;
        protected logger: Logger;
        protected canUseEvents: boolean;
        private suppressDiagnosticEvents?;
        private eventHandler;
        private readonly noGetErrOnBackgroundUpdate?;
        constructor(opts: SessionOptions);
        private sendRequestCompletedEvent;
        private defaultEventHandler;
        private projectsUpdatedInBackgroundEvent;
        logError(err: Error, cmd: string): void;
        private logErrorWorker;
        send(msg: protocol.Message): void;
        event<T extends object>(body: T, eventName: string): void;
        /** @deprecated */
        output(info: any, cmdName: string, reqSeq?: number, errorMsg?: string): void;
        private doOutput;
        private semanticCheck;
        private syntacticCheck;
        private suggestionCheck;
        private sendDiagnosticsEvent;
        /** It is the caller's responsibility to verify that `!this.suppressDiagnosticEvents`. */
        private updateErrorCheck;
        private cleanProjects;
        private cleanup;
        private getEncodedSemanticClassifications;
        private getProject;
        private getConfigFileAndProject;
        private getConfigFileDiagnostics;
        private convertToDiagnosticsWithLinePositionFromDiagnosticFile;
        private getCompilerOptionsDiagnostics;
        private convertToDiagnosticsWithLinePosition;
        private getDiagnosticsWorker;
        private getDefinition;
        private mapDefinitionInfoLocations;
        private getDefinitionAndBoundSpan;
        private getEmitOutput;
        private mapDefinitionInfo;
        private static mapToOriginalLocation;
        private toFileSpan;
        private getTypeDefinition;
        private mapImplementationLocations;
        private getImplementation;
        private getOccurrences;
        private getSyntacticDiagnosticsSync;
        private getSemanticDiagnosticsSync;
        private getSuggestionDiagnosticsSync;
        private getJsxClosingTag;
        private getDocumentHighlights;
        private setCompilerOptionsForInferredProjects;
        private getProjectInfo;
        private getProjectInfoWorker;
        private getRenameInfo;
        private getProjects;
        private getDefaultProject;
        private getRenameLocations;
        private mapRenameInfo;
        private toSpanGroups;
        private getReferences;
        /**
         * @param fileName is the name of the file to be opened
         * @param fileContent is a version of the file content that is known to be more up to date than the one on disk
         */
        private openClientFile;
        private getPosition;
        private getPositionInFile;
        private getFileAndProject;
        private getFileAndLanguageServiceForSyntacticOperation;
        private getFileAndProjectWorker;
        private getOutliningSpans;
        private getTodoComments;
        private getDocCommentTemplate;
        private getSpanOfEnclosingComment;
        private getIndentation;
        private getBreakpointStatement;
        private getNameOrDottedNameSpan;
        private isValidBraceCompletion;
        private getQuickInfoWorker;
        private getFormattingEditsForRange;
        private getFormattingEditsForRangeFull;
        private getFormattingEditsForDocumentFull;
        private getFormattingEditsAfterKeystrokeFull;
        private getFormattingEditsAfterKeystroke;
        private getCompletions;
        private getCompletionEntryDetails;
        private getCompileOnSaveAffectedFileList;
        private emitFile;
        private getSignatureHelpItems;
        private createCheckList;
        private getDiagnostics;
        private change;
        private reload;
        private saveToTmp;
        private closeClientFile;
        private mapLocationNavigationBarItems;
        private getNavigationBarItems;
        private toLocationNavigationTree;
        private toLocationTextSpan;
        private getNavigationTree;
        private getNavigateToItems;
        private getFullNavigateToItems;
        private getSupportedCodeFixes;
        private isLocation;
        private extractPositionOrRange;
        private getApplicableRefactors;
        private getEditsForRefactor;
        private organizeImports;
        private getEditsForFileRename;
        private getCodeFixes;
        private getCombinedCodeFix;
        private applyCodeActionCommand;
        private getStartAndEndPosition;
        private mapCodeAction;
        private mapCodeFixAction;
        private mapTextChangesToCodeEdits;
        private mapTextChangeToCodeEdit;
        private convertTextChangeToCodeEdit;
        private getBraceMatching;
        private getDiagnosticsForProject;
        private configurePlugin;
        getCanonicalFileName(fileName: string): string;
        exit(): void;
        private notRequired;
        private requiredResponse;
        private handlers;
        addProtocolHandler(command: string, handler: (request: protocol.Request) => HandlerResponse): void;
        private setCurrentRequest;
        private resetCurrentRequest;
        executeWithRequestId<T>(requestId: number, f: () => T): T;
        executeCommand(request: protocol.Request): HandlerResponse;
        onMessage(message: string): void;
        private getFormatOptions;
        private getPreferences;
        private getHostFormatOptions;
        private getHostPreferences;
    }
    interface HandlerResponse {
        response?: {};
        responseRequired?: boolean;
    }
    function getLocationInNewDocument(oldText: string, renameFilename: string, renameLocation: number, edits: ReadonlyArray<FileTextChanges>): protocol.Location;
}
declare namespace ts.server {
    interface LineCollection {
        charCount(): number;
        lineCount(): number;
        isLeaf(): this is LineLeaf;
        walk(rangeStart: number, rangeLength: number, walkFns: LineIndexWalker): void;
    }
    interface AbsolutePositionAndLineText {
        absolutePosition: number;
        lineText: string | undefined;
    }
    const enum CharRangeSection {
        PreStart = 0,
        Start = 1,
        Entire = 2,
        Mid = 3,
        End = 4,
        PostEnd = 5
    }
    interface LineIndexWalker {
        goSubtree: boolean;
        done: boolean;
        leaf(relativeStart: number, relativeLength: number, lineCollection: LineLeaf): void;
        pre?(relativeStart: number, relativeLength: number, lineCollection: LineCollection, parent: LineNode, nodeType: CharRangeSection): void;
        post?(relativeStart: number, relativeLength: number, lineCollection: LineCollection, parent: LineNode, nodeType: CharRangeSection): void;
    }
    class ScriptVersionCache {
        private changes;
        private readonly versions;
        private minVersion;
        private currentVersion;
        private static readonly changeNumberThreshold;
        private static readonly changeLengthThreshold;
        private static readonly maxVersions;
        private versionToIndex;
        private currentVersionToIndex;
        edit(pos: number, deleteLen: number, insertedText?: string): void;
        getSnapshot(): IScriptSnapshot;
        private _getSnapshot;
        getSnapshotVersion(): number;
        getAbsolutePositionAndLineText(oneBasedLine: number): AbsolutePositionAndLineText;
        lineOffsetToPosition(line: number, column: number): number;
        positionToLineOffset(position: number): protocol.Location;
        lineToTextSpan(line: number): TextSpan;
        getTextChangesBetweenVersions(oldVersion: number, newVersion: number): TextChangeRange | undefined;
        getLineCount(): number;
        static fromString(script: string): ScriptVersionCache;
    }
    class LineIndex {
        root: LineNode;
        checkEdits: boolean;
        absolutePositionOfStartOfLine(oneBasedLine: number): number;
        positionToLineOffset(position: number): protocol.Location;
        private positionToColumnAndLineText;
        getLineCount(): number;
        lineNumberToInfo(oneBasedLine: number): AbsolutePositionAndLineText;
        load(lines: string[]): void;
        walk(rangeStart: number, rangeLength: number, walkFns: LineIndexWalker): void;
        getText(rangeStart: number, rangeLength: number): string;
        getLength(): number;
        every(f: (ll: LineLeaf, s: number, len: number) => boolean, rangeStart: number, rangeEnd?: number): boolean;
        edit(pos: number, deleteLength: number, newText?: string): LineIndex;
        private static buildTreeFromBottom;
        static linesFromText(text: string): {
            lines: string[];
            lineMap: number[];
        };
    }
    class LineNode implements LineCollection {
        private readonly children;
        totalChars: number;
        totalLines: number;
        constructor(children?: LineCollection[]);
        isLeaf(): boolean;
        updateCounts(): void;
        private execWalk;
        private skipChild;
        walk(rangeStart: number, rangeLength: number, walkFns: LineIndexWalker): void;
        charOffsetToLineInfo(lineNumberAccumulator: number, relativePosition: number): {
            oneBasedLine: number;
            zeroBasedColumn: number;
            lineText: string | undefined;
        };
        /**
         * Input line number is relative to the start of this node.
         * Output line number is relative to the child.
         * positionAccumulator will be an absolute position once relativeLineNumber reaches 0.
         */
        lineNumberToInfo(relativeOneBasedLine: number, positionAccumulator: number): {
            position: number;
            leaf: LineLeaf | undefined;
        };
        private splitAfter;
        remove(child: LineCollection): void;
        private findChildIndex;
        insertAt(child: LineCollection, nodes: LineCollection[]): LineNode[];
        add(collection: LineCollection): void;
        charCount(): number;
        lineCount(): number;
    }
    class LineLeaf implements LineCollection {
        text: string;
        constructor(text: string);
        isLeaf(): boolean;
        walk(rangeStart: number, rangeLength: number, walkFns: LineIndexWalker): void;
        charCount(): number;
        lineCount(): number;
    }
}
//# sourceMappingURL=server.d.ts.map