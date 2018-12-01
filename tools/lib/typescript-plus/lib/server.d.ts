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
    function stringifyIndented(json: {}): string;
}
declare namespace ts.server.protocol {
    const enum CommandTypes {
        JsxClosingTag = "jsxClosingTag",
        Brace = "brace",
        BraceFull = "brace-full",
        BraceCompletion = "braceCompletion",
        GetSpanOfEnclosingComment = "getSpanOfEnclosingComment",
        Change = "change",
        Close = "close",
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
    interface Message {
        seq: number;
        type: "request" | "response" | "event";
    }
    interface Request extends Message {
        type: "request";
        command: string;
        arguments?: any;
    }
    interface ReloadProjectsRequest extends Message {
        command: CommandTypes.ReloadProjects;
    }
    interface Event extends Message {
        type: "event";
        event: string;
        body?: any;
    }
    interface Response extends Message {
        type: "response";
        request_seq: number;
        success: boolean;
        command: string;
        message?: string;
        body?: any;
        metadata?: unknown;
    }
    interface FileRequestArgs {
        file: string;
        projectFileName?: string;
    }
    interface StatusRequest extends Request {
        command: CommandTypes.Status;
    }
    interface StatusResponseBody {
        version: string;
    }
    interface StatusResponse extends Response {
        body: StatusResponseBody;
    }
    interface DocCommentTemplateRequest extends FileLocationRequest {
        command: CommandTypes.DocCommentTemplate;
    }
    interface DocCommandTemplateResponse extends Response {
        body?: TextInsertion;
    }
    interface TodoCommentRequest extends FileRequest {
        command: CommandTypes.TodoComments;
        arguments: TodoCommentRequestArgs;
    }
    interface TodoCommentRequestArgs extends FileRequestArgs {
        descriptors: TodoCommentDescriptor[];
    }
    interface TodoCommentsResponse extends Response {
        body?: TodoComment[];
    }
    interface SpanOfEnclosingCommentRequest extends FileLocationRequest {
        command: CommandTypes.GetSpanOfEnclosingComment;
        arguments: SpanOfEnclosingCommentRequestArgs;
    }
    interface SpanOfEnclosingCommentRequestArgs extends FileLocationRequestArgs {
        onlyMultiLine: boolean;
    }
    interface OutliningSpansRequest extends FileRequest {
        command: CommandTypes.GetOutliningSpans;
    }
    interface OutliningSpan {
        textSpan: TextSpan;
        hintSpan: TextSpan;
        bannerText: string;
        autoCollapse: boolean;
        kind: OutliningSpanKind;
    }
    interface OutliningSpansResponse extends Response {
        body?: OutliningSpan[];
    }
    interface OutliningSpansRequestFull extends FileRequest {
        command: CommandTypes.GetOutliningSpansFull;
    }
    interface OutliningSpansResponseFull extends Response {
        body?: ts.OutliningSpan[];
    }
    interface IndentationRequest extends FileLocationRequest {
        command: CommandTypes.Indentation;
        arguments: IndentationRequestArgs;
    }
    interface IndentationResponse extends Response {
        body?: IndentationResult;
    }
    interface IndentationResult {
        position: number;
        indentation: number;
    }
    interface IndentationRequestArgs extends FileLocationRequestArgs {
        options?: EditorSettings;
    }
    interface ProjectInfoRequestArgs extends FileRequestArgs {
        needFileNameList: boolean;
    }
    interface ProjectInfoRequest extends Request {
        command: CommandTypes.ProjectInfo;
        arguments: ProjectInfoRequestArgs;
    }
    interface CompilerOptionsDiagnosticsRequest extends Request {
        arguments: CompilerOptionsDiagnosticsRequestArgs;
    }
    interface CompilerOptionsDiagnosticsRequestArgs {
        projectFileName: string;
    }
    interface ProjectInfo {
        configFileName: string;
        fileNames?: string[];
        languageServiceDisabled?: boolean;
    }
    interface DiagnosticWithLinePosition {
        message: string;
        start: number;
        length: number;
        startLocation: Location;
        endLocation: Location;
        category: string;
        code: number;
        reportsUnnecessary?: {};
        relatedInformation?: DiagnosticRelatedInformation[];
    }
    interface ProjectInfoResponse extends Response {
        body?: ProjectInfo;
    }
    interface FileRequest extends Request {
        arguments: FileRequestArgs;
    }
    interface FileLocationRequestArgs extends FileRequestArgs {
        line: number;
        offset: number;
        position?: number;
    }
    type FileLocationOrRangeRequestArgs = FileLocationRequestArgs | FileRangeRequestArgs;
    interface GetApplicableRefactorsRequest extends Request {
        command: CommandTypes.GetApplicableRefactors;
        arguments: GetApplicableRefactorsRequestArgs;
    }
    type GetApplicableRefactorsRequestArgs = FileLocationOrRangeRequestArgs;
    interface GetApplicableRefactorsResponse extends Response {
        body?: ApplicableRefactorInfo[];
    }
    interface ApplicableRefactorInfo {
        name: string;
        description: string;
        inlineable?: boolean;
        actions: RefactorActionInfo[];
    }
    interface RefactorActionInfo {
        name: string;
        description: string;
    }
    interface GetEditsForRefactorRequest extends Request {
        command: CommandTypes.GetEditsForRefactor;
        arguments: GetEditsForRefactorRequestArgs;
    }
    type GetEditsForRefactorRequestArgs = FileLocationOrRangeRequestArgs & {
        refactor: string;
        action: string;
    };
    interface GetEditsForRefactorResponse extends Response {
        body?: RefactorEditInfo;
    }
    interface RefactorEditInfo {
        edits: FileCodeEdits[];
        renameLocation?: Location;
        renameFilename?: string;
    }
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
    interface GetEditsForFileRenameRequestArgs {
        readonly oldFilePath: string;
        readonly newFilePath: string;
    }
    interface GetEditsForFileRenameResponse extends Response {
        body: ReadonlyArray<FileCodeEdits>;
    }
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
        startLine: number;
        startOffset: number;
        startPosition?: number;
        endLine: number;
        endOffset: number;
        endPosition?: number;
    }
    interface CodeFixRequestArgs extends FileRangeRequestArgs {
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
        command: {};
    }
    interface GetCodeFixesResponse extends Response {
        body?: CodeAction[];
    }
    interface FileLocationRequest extends FileRequest {
        arguments: FileLocationRequestArgs;
    }
    interface GetSupportedCodeFixesRequest extends Request {
        command: CommandTypes.GetSupportedCodeFixes;
    }
    interface GetSupportedCodeFixesResponse extends Response {
        body?: string[];
    }
    interface EncodedSemanticClassificationsRequest extends FileRequest {
        arguments: EncodedSemanticClassificationsRequestArgs;
    }
    interface EncodedSemanticClassificationsRequestArgs extends FileRequestArgs {
        start: number;
        length: number;
    }
    interface DocumentHighlightsRequestArgs extends FileLocationRequestArgs {
        filesToSearch: string[];
    }
    interface DefinitionRequest extends FileLocationRequest {
        command: CommandTypes.Definition;
    }
    interface DefinitionAndBoundSpanRequest extends FileLocationRequest {
        readonly command: CommandTypes.DefinitionAndBoundSpan;
    }
    interface DefinitionAndBoundSpanResponse extends Response {
        readonly body: DefinitionInfoAndBoundSpan;
    }
    interface EmitOutputRequest extends FileRequest {
    }
    interface EmitOutputResponse extends Response {
        readonly body: EmitOutput;
    }
    interface TypeDefinitionRequest extends FileLocationRequest {
        command: CommandTypes.TypeDefinition;
    }
    interface ImplementationRequest extends FileLocationRequest {
        command: CommandTypes.Implementation;
    }
    interface Location {
        line: number;
        offset: number;
    }
    interface TextSpan {
        start: Location;
        end: Location;
    }
    interface FileSpan extends TextSpan {
        file: string;
    }
    interface DefinitionInfoAndBoundSpan {
        definitions: ReadonlyArray<FileSpan>;
        textSpan: TextSpan;
    }
    interface DefinitionResponse extends Response {
        body?: FileSpan[];
    }
    interface DefinitionInfoAndBoundSpanReponse extends Response {
        body?: DefinitionInfoAndBoundSpan;
    }
    interface TypeDefinitionResponse extends Response {
        body?: FileSpan[];
    }
    interface ImplementationResponse extends Response {
        body?: FileSpan[];
    }
    interface BraceCompletionRequest extends FileLocationRequest {
        command: CommandTypes.BraceCompletion;
        arguments: BraceCompletionRequestArgs;
    }
    interface BraceCompletionRequestArgs extends FileLocationRequestArgs {
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
    interface OccurrencesRequest extends FileLocationRequest {
        command: CommandTypes.Occurrences;
    }
    interface OccurrencesResponseItem extends FileSpan {
        isWriteAccess: boolean;
        isInString?: true;
    }
    interface OccurrencesResponse extends Response {
        body?: OccurrencesResponseItem[];
    }
    interface DocumentHighlightsRequest extends FileLocationRequest {
        command: CommandTypes.DocumentHighlights;
        arguments: DocumentHighlightsRequestArgs;
    }
    interface HighlightSpan extends TextSpan {
        kind: HighlightSpanKind;
    }
    interface DocumentHighlightsItem {
        file: string;
        highlightSpans: HighlightSpan[];
    }
    interface DocumentHighlightsResponse extends Response {
        body?: DocumentHighlightsItem[];
    }
    interface ReferencesRequest extends FileLocationRequest {
        command: CommandTypes.References;
    }
    interface ReferencesResponseItem extends FileSpan {
        lineText: string;
        isWriteAccess: boolean;
        isDefinition: boolean;
    }
    interface ReferencesResponseBody {
        refs: ReadonlyArray<ReferencesResponseItem>;
        symbolName: string;
        symbolStartOffset: number;
        symbolDisplayString: string;
    }
    interface ReferencesResponse extends Response {
        body?: ReferencesResponseBody;
    }
    interface RenameRequestArgs extends FileLocationRequestArgs {
        findInComments?: boolean;
        findInStrings?: boolean;
    }
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
    type RenameInfo = RenameInfoSuccess | RenameInfoFailure;
    interface RenameInfoSuccess {
        canRename: true;
        fileToRename?: string;
        displayName: string;
        fullDisplayName: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        triggerSpan: TextSpan;
    }
    interface RenameInfoFailure {
        canRename: false;
        localizedErrorMessage: string;
    }
    interface SpanGroup {
        file: string;
        locs: RenameTextSpan[];
    }
    interface RenameTextSpan extends TextSpan {
        readonly prefixText?: string;
        readonly suffixText?: string;
    }
    interface RenameResponseBody {
        info: RenameInfo;
        locs: ReadonlyArray<SpanGroup>;
    }
    interface RenameResponse extends Response {
        body?: RenameResponseBody;
    }
    interface ExternalFile {
        fileName: string;
        scriptKind?: ScriptKindName | ts.ScriptKind;
        hasMixedContent?: boolean;
        content?: string;
    }
    interface ExternalProject {
        projectFileName: string;
        rootFiles: ExternalFile[];
        options: ExternalProjectCompilerOptions;
        typingOptions?: TypeAcquisition;
        typeAcquisition?: TypeAcquisition;
    }
    interface CompileOnSaveMixin {
        compileOnSave?: boolean;
    }
    type ExternalProjectCompilerOptions = CompilerOptions & CompileOnSaveMixin;
    interface ProjectVersionInfo {
        projectName: string;
        isInferred: boolean;
        version: number;
        options: ts.CompilerOptions;
        languageServiceDisabled: boolean;
        lastFileExceededProgramSize?: string;
    }
    interface ProjectChanges {
        added: string[];
        removed: string[];
        updated: string[];
    }
    interface ProjectFiles {
        info?: ProjectVersionInfo;
        files?: string[];
        changes?: ProjectChanges;
    }
    interface ProjectFilesWithDiagnostics extends ProjectFiles {
        projectErrors: DiagnosticWithLinePosition[];
    }
    interface ChangedOpenFile {
        fileName: string;
        changes: ts.TextChange[];
    }
    interface ConfigureRequestArguments {
        hostInfo?: string;
        file?: string;
        formatOptions?: FormatCodeSettings;
        preferences?: UserPreferences;
        extraFileExtensions?: FileExtensionInfo[];
    }
    interface ConfigureRequest extends Request {
        command: CommandTypes.Configure;
        arguments: ConfigureRequestArguments;
    }
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
    interface OpenRequestArgs extends FileRequestArgs {
        fileContent?: string;
        scriptKindName?: ScriptKindName;
        projectRootPath?: string;
    }
    type ScriptKindName = "TS" | "JS" | "TSX" | "JSX";
    interface OpenRequest extends Request {
        command: CommandTypes.Open;
        arguments: OpenRequestArgs;
    }
    interface OpenExternalProjectRequest extends Request {
        command: CommandTypes.OpenExternalProject;
        arguments: OpenExternalProjectArgs;
    }
    type OpenExternalProjectArgs = ExternalProject;
    interface OpenExternalProjectsRequest extends Request {
        command: CommandTypes.OpenExternalProjects;
        arguments: OpenExternalProjectsArgs;
    }
    interface OpenExternalProjectsArgs {
        projects: ExternalProject[];
    }
    interface OpenExternalProjectResponse extends Response {
    }
    interface OpenExternalProjectsResponse extends Response {
    }
    interface CloseExternalProjectRequest extends Request {
        command: CommandTypes.CloseExternalProject;
        arguments: CloseExternalProjectRequestArgs;
    }
    interface CloseExternalProjectRequestArgs {
        projectFileName: string;
    }
    interface CloseExternalProjectResponse extends Response {
    }
    interface SynchronizeProjectListRequest extends Request {
        arguments: SynchronizeProjectListRequestArgs;
    }
    interface SynchronizeProjectListRequestArgs {
        knownProjects: protocol.ProjectVersionInfo[];
    }
    interface ApplyChangedToOpenFilesRequest extends Request {
        arguments: ApplyChangedToOpenFilesRequestArgs;
    }
    interface ApplyChangedToOpenFilesRequestArgs {
        openFiles?: ExternalFile[];
        changedFiles?: ChangedOpenFile[];
        closedFiles?: string[];
    }
    interface SetCompilerOptionsForInferredProjectsRequest extends Request {
        command: CommandTypes.CompilerOptionsForInferredProjects;
        arguments: SetCompilerOptionsForInferredProjectsArgs;
    }
    interface SetCompilerOptionsForInferredProjectsArgs {
        options: ExternalProjectCompilerOptions;
        projectRootPath?: string;
    }
    interface SetCompilerOptionsForInferredProjectsResponse extends Response {
    }
    interface ExitRequest extends Request {
        command: CommandTypes.Exit;
    }
    interface CloseRequest extends FileRequest {
        command: CommandTypes.Close;
    }
    interface CompileOnSaveAffectedFileListRequest extends FileRequest {
        command: CommandTypes.CompileOnSaveAffectedFileList;
    }
    interface CompileOnSaveAffectedFileListSingleProject {
        projectFileName: string;
        fileNames: string[];
        projectUsesOutFile: boolean;
    }
    interface CompileOnSaveAffectedFileListResponse extends Response {
        body: CompileOnSaveAffectedFileListSingleProject[];
    }
    interface CompileOnSaveEmitFileRequest extends FileRequest {
        command: CommandTypes.CompileOnSaveEmitFile;
        arguments: CompileOnSaveEmitFileRequestArgs;
    }
    interface CompileOnSaveEmitFileRequestArgs extends FileRequestArgs {
        forced?: boolean;
    }
    interface QuickInfoRequest extends FileLocationRequest {
        command: CommandTypes.Quickinfo;
    }
    interface QuickInfoResponseBody {
        kind: ScriptElementKind;
        kindModifiers: string;
        start: Location;
        end: Location;
        displayString: string;
        documentation: string;
        tags: JSDocTagInfo[];
    }
    interface QuickInfoResponse extends Response {
        body?: QuickInfoResponseBody;
    }
    interface FormatRequestArgs extends FileLocationRequestArgs {
        endLine: number;
        endOffset: number;
        endPosition?: number;
        options?: FormatCodeSettings;
    }
    interface FormatRequest extends FileLocationRequest {
        command: CommandTypes.Format;
        arguments: FormatRequestArgs;
    }
    interface CodeEdit {
        start: Location;
        end: Location;
        newText: string;
    }
    interface FileCodeEdits {
        fileName: string;
        textChanges: CodeEdit[];
    }
    interface CodeFixResponse extends Response {
        body?: CodeFixAction[];
    }
    interface CodeAction {
        description: string;
        changes: FileCodeEdits[];
        commands?: {}[];
    }
    interface CombinedCodeActions {
        changes: ReadonlyArray<FileCodeEdits>;
        commands?: ReadonlyArray<{}>;
    }
    interface CodeFixAction extends CodeAction {
        fixName: string;
        fixId?: {};
        fixAllDescription?: string;
    }
    interface FormatResponse extends Response {
        body?: CodeEdit[];
    }
    interface FormatOnKeyRequestArgs extends FileLocationRequestArgs {
        key: string;
        options?: FormatCodeSettings;
    }
    interface FormatOnKeyRequest extends FileLocationRequest {
        command: CommandTypes.Formatonkey;
        arguments: FormatOnKeyRequestArgs;
    }
    type CompletionsTriggerCharacter = "." | '"' | "'" | "`" | "/" | "@" | "<";
    interface CompletionsRequestArgs extends FileLocationRequestArgs {
        prefix?: string;
        triggerCharacter?: CompletionsTriggerCharacter;
        includeExternalModuleExports?: boolean;
        includeInsertTextCompletions?: boolean;
    }
    interface CompletionsRequest extends FileLocationRequest {
        command: CommandTypes.Completions | CommandTypes.CompletionInfo;
        arguments: CompletionsRequestArgs;
    }
    interface CompletionDetailsRequestArgs extends FileLocationRequestArgs {
        entryNames: (string | CompletionEntryIdentifier)[];
    }
    interface CompletionEntryIdentifier {
        name: string;
        source?: string;
    }
    interface CompletionDetailsRequest extends FileLocationRequest {
        command: CommandTypes.CompletionDetails;
        arguments: CompletionDetailsRequestArgs;
    }
    interface SymbolDisplayPart {
        text: string;
        kind: string;
    }
    interface CompletionEntry {
        name: string;
        kind: ScriptElementKind;
        kindModifiers?: string;
        sortText: string;
        insertText?: string;
        replacementSpan?: TextSpan;
        hasAction?: true;
        source?: string;
        isRecommended?: true;
    }
    interface CompletionEntryDetails {
        name: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        displayParts: SymbolDisplayPart[];
        documentation?: SymbolDisplayPart[];
        tags?: JSDocTagInfo[];
        codeActions?: CodeAction[];
        source?: SymbolDisplayPart[];
    }
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
    interface SignatureHelpParameter {
        name: string;
        documentation: SymbolDisplayPart[];
        displayParts: SymbolDisplayPart[];
        isOptional: boolean;
    }
    interface SignatureHelpItem {
        isVariadic: boolean;
        prefixDisplayParts: SymbolDisplayPart[];
        suffixDisplayParts: SymbolDisplayPart[];
        separatorDisplayParts: SymbolDisplayPart[];
        parameters: SignatureHelpParameter[];
        documentation: SymbolDisplayPart[];
        tags: JSDocTagInfo[];
    }
    interface SignatureHelpItems {
        items: SignatureHelpItem[];
        applicableSpan: TextSpan;
        selectedItemIndex: number;
        argumentIndex: number;
        argumentCount: number;
    }
    type SignatureHelpTriggerCharacter = "," | "(" | "<";
    type SignatureHelpRetriggerCharacter = SignatureHelpTriggerCharacter | ")";
    interface SignatureHelpRequestArgs extends FileLocationRequestArgs {
        triggerReason?: SignatureHelpTriggerReason;
    }
    type SignatureHelpTriggerReason = SignatureHelpInvokedReason | SignatureHelpCharacterTypedReason | SignatureHelpRetriggeredReason;
    interface SignatureHelpInvokedReason {
        kind: "invoked";
        triggerCharacter?: undefined;
    }
    interface SignatureHelpCharacterTypedReason {
        kind: "characterTyped";
        triggerCharacter: SignatureHelpTriggerCharacter;
    }
    interface SignatureHelpRetriggeredReason {
        kind: "retrigger";
        triggerCharacter?: SignatureHelpRetriggerCharacter;
    }
    interface SignatureHelpRequest extends FileLocationRequest {
        command: CommandTypes.SignatureHelp;
        arguments: SignatureHelpRequestArgs;
    }
    interface SignatureHelpResponse extends Response {
        body?: SignatureHelpItems;
    }
    interface SemanticDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SemanticDiagnosticsSync;
        arguments: SemanticDiagnosticsSyncRequestArgs;
    }
    interface SemanticDiagnosticsSyncRequestArgs extends FileRequestArgs {
        includeLinePosition?: boolean;
    }
    interface SemanticDiagnosticsSyncResponse extends Response {
        body?: Diagnostic[] | DiagnosticWithLinePosition[];
    }
    interface SuggestionDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SuggestionDiagnosticsSync;
        arguments: SuggestionDiagnosticsSyncRequestArgs;
    }
    type SuggestionDiagnosticsSyncRequestArgs = SemanticDiagnosticsSyncRequestArgs;
    type SuggestionDiagnosticsSyncResponse = SemanticDiagnosticsSyncResponse;
    interface SyntacticDiagnosticsSyncRequest extends FileRequest {
        command: CommandTypes.SyntacticDiagnosticsSync;
        arguments: SyntacticDiagnosticsSyncRequestArgs;
    }
    interface SyntacticDiagnosticsSyncRequestArgs extends FileRequestArgs {
        includeLinePosition?: boolean;
    }
    interface SyntacticDiagnosticsSyncResponse extends Response {
        body?: Diagnostic[] | DiagnosticWithLinePosition[];
    }
    interface GeterrForProjectRequestArgs {
        file: string;
        delay: number;
    }
    interface GeterrForProjectRequest extends Request {
        command: CommandTypes.GeterrForProject;
        arguments: GeterrForProjectRequestArgs;
    }
    interface GeterrRequestArgs {
        files: string[];
        delay: number;
    }
    interface GeterrRequest extends Request {
        command: CommandTypes.Geterr;
        arguments: GeterrRequestArgs;
    }
    type RequestCompletedEventName = "requestCompleted";
    interface RequestCompletedEvent extends Event {
        event: RequestCompletedEventName;
        body: RequestCompletedEventBody;
    }
    interface RequestCompletedEventBody {
        request_seq: number;
    }
    interface Diagnostic {
        start: Location;
        end: Location;
        text: string;
        category: string;
        reportsUnnecessary?: {};
        relatedInformation?: DiagnosticRelatedInformation[];
        code?: number;
        source?: string;
    }
    interface DiagnosticWithFileName extends Diagnostic {
        fileName: string;
    }
    interface DiagnosticRelatedInformation {
        category: string;
        code: number;
        message: string;
        span?: FileSpan;
    }
    interface DiagnosticEventBody {
        file: string;
        diagnostics: Diagnostic[];
    }
    type DiagnosticEventKind = "semanticDiag" | "syntaxDiag" | "suggestionDiag";
    interface DiagnosticEvent extends Event {
        body?: DiagnosticEventBody;
        event: DiagnosticEventKind;
    }
    interface ConfigFileDiagnosticEventBody {
        triggerFile: string;
        configFile: string;
        diagnostics: DiagnosticWithFileName[];
    }
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
        projectName: string;
        languageServiceEnabled: boolean;
    }
    type ProjectsUpdatedInBackgroundEventName = "projectsUpdatedInBackground";
    interface ProjectsUpdatedInBackgroundEvent extends Event {
        event: ProjectsUpdatedInBackgroundEventName;
        body: ProjectsUpdatedInBackgroundEventBody;
    }
    interface ProjectsUpdatedInBackgroundEventBody {
        openFiles: string[];
    }
    type ProjectLoadingStartEventName = "projectLoadingStart";
    interface ProjectLoadingStartEvent extends Event {
        event: ProjectLoadingStartEventName;
        body: ProjectLoadingStartEventBody;
    }
    interface ProjectLoadingStartEventBody {
        projectName: string;
        reason: string;
    }
    type ProjectLoadingFinishEventName = "projectLoadingFinish";
    interface ProjectLoadingFinishEvent extends Event {
        event: ProjectLoadingFinishEventName;
        body: ProjectLoadingFinishEventBody;
    }
    interface ProjectLoadingFinishEventBody {
        projectName: string;
    }
    type SurveyReadyEventName = "surveyReady";
    interface SurveyReadyEvent extends Event {
        event: SurveyReadyEventName;
        body: SurveyReadyEventBody;
    }
    interface SurveyReadyEventBody {
        surveyId: string;
    }
    type LargeFileReferencedEventName = "largeFileReferenced";
    interface LargeFileReferencedEvent extends Event {
        event: LargeFileReferencedEventName;
        body: LargeFileReferencedEventBody;
    }
    interface LargeFileReferencedEventBody {
        file: string;
        fileSize: number;
        maxFileSize: number;
    }
    type AnyEvent = RequestCompletedEvent | DiagnosticEvent | ConfigFileDiagnosticEvent | ProjectLanguageServiceStateEvent | TelemetryEvent | ProjectsUpdatedInBackgroundEvent | ProjectLoadingStartEvent | ProjectLoadingFinishEvent | SurveyReadyEvent | LargeFileReferencedEvent;
    interface ReloadRequestArgs extends FileRequestArgs {
        tmpfile: string;
    }
    interface ReloadRequest extends FileRequest {
        command: CommandTypes.Reload;
        arguments: ReloadRequestArgs;
    }
    interface ReloadResponse extends Response {
    }
    interface SavetoRequestArgs extends FileRequestArgs {
        tmpfile: string;
    }
    interface SavetoRequest extends FileRequest {
        command: CommandTypes.Saveto;
        arguments: SavetoRequestArgs;
    }
    interface NavtoRequestArgs extends FileRequestArgs {
        searchValue: string;
        maxResultCount?: number;
        currentFileOnly?: boolean;
        projectFileName?: string;
    }
    interface NavtoRequest extends FileRequest {
        command: CommandTypes.Navto;
        arguments: NavtoRequestArgs;
    }
    interface NavtoItem extends FileSpan {
        name: string;
        kind: ScriptElementKind;
        matchKind: string;
        isCaseSensitive: boolean;
        kindModifiers?: string;
        containerName?: string;
        containerKind?: ScriptElementKind;
    }
    interface NavtoResponse extends Response {
        body?: NavtoItem[];
    }
    interface ChangeRequestArgs extends FormatRequestArgs {
        insertString?: string;
    }
    interface ChangeRequest extends FileLocationRequest {
        command: CommandTypes.Change;
        arguments: ChangeRequestArgs;
    }
    interface BraceResponse extends Response {
        body?: TextSpan[];
    }
    interface BraceRequest extends FileLocationRequest {
        command: CommandTypes.Brace;
    }
    interface NavBarRequest extends FileRequest {
        command: CommandTypes.NavBar;
    }
    interface NavTreeRequest extends FileRequest {
        command: CommandTypes.NavTree;
    }
    interface NavigationBarItem {
        text: string;
        kind: ScriptElementKind;
        kindModifiers?: string;
        spans: TextSpan[];
        childItems?: NavigationBarItem[];
        indent: number;
    }
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
        installedPackages: string;
        installSuccess: boolean;
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
        eventId: number;
        packages: ReadonlyArray<string>;
    }
    interface BeginInstallTypesEventBody extends InstallTypesEventBody {
    }
    interface EndInstallTypesEventBody extends InstallTypesEventBody {
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
        readonly quotePreference?: "double" | "single";
        readonly includeCompletionsForModuleExports?: boolean;
        readonly includeCompletionsWithInsertText?: boolean;
        readonly importModuleSpecifierPreference?: "relative" | "non-relative";
        readonly allowTextChangesInNewFiles?: boolean;
        readonly lazyConfiguredProjectsFromExternalProject?: boolean;
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
        private svc;
        private text;
        private lineMap;
        private fileSize;
        isOpen: boolean;
        private ownFileText;
        private pendingReloadFromDisk;
        constructor(host: ServerHost, fileName: NormalizedPath, initialVersion: ScriptInfoVersion | undefined, info: ScriptInfo);
        getVersion(): string;
        hasScriptVersionCache_TestOnly(): boolean;
        useScriptVersionCache_TestOnly(): void;
        useText(newText?: string): void;
        edit(start: number, end: number, newText: string): void;
        reload(newText: string): boolean;
        reloadWithFileText(tempFileName?: string): boolean;
        reloadFromDisk(): boolean;
        delayReloadFromFileIntoText(): void;
        getTelemetryFileSize(): number;
        getSnapshot(): IScriptSnapshot;
        getLineInfo(line: number): AbsolutePositionAndLineText;
        lineToTextSpan(line: number): TextSpan;
        lineOffsetToPosition(line: number, offset: number): number;
        positionToLineOffset(position: number): protocol.Location;
        private getFileTextAndSize;
        private switchToScriptVersionCache;
        private useScriptVersionCacheIfValidOrOpen;
        private getOrLoadText;
        private getLineMap;
    }
    function isDynamicFileName(fileName: NormalizedPath): boolean;
    interface DocumentRegistrySourceFileCache {
        key: DocumentRegistryBucketKey;
        sourceFile: SourceFile;
    }
    class ScriptInfo {
        private readonly host;
        readonly fileName: NormalizedPath;
        readonly scriptKind: ScriptKind;
        readonly hasMixedContent: boolean;
        readonly path: Path;
        readonly containingProjects: Project[];
        private formatSettings;
        private preferences;
        fileWatcher: FileWatcher | undefined;
        private textStorage;
        readonly isDynamic: boolean;
        private realpath;
        cacheSourceFile: DocumentRegistrySourceFileCache | undefined;
        mTime?: number;
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
        getLineInfo(line: number): AbsolutePositionAndLineText;
        editContent(start: number, end: number, newText: string): void;
        markContainingProjectsAsDirty(): void;
        isOrphan(): boolean;
        lineToTextSpan(line: number): TextSpan;
        lineOffsetToPosition(line: number, offset: number): number;
        positionToLineOffset(position: number): protocol.Location;
        isJavaScript(): boolean;
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
        cachedUnresolvedImportsPerFile: Map<ReadonlyArray<string>>;
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
        private updatedFileNames;
        private lastReportedFileNames;
        private lastReportedVersion;
        private projectProgramVersion;
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
        getGlobalProjectErrors(): ReadonlyArray<Diagnostic>;
        getAllProjectErrors(): ReadonlyArray<Diagnostic>;
        getLanguageService(ensureSynchronized?: boolean): LanguageService;
        getSourceMapper(): SourceMapper;
        private shouldEmitFile;
        getCompileOnSaveAffectedFileList(scriptInfo: ScriptInfo): string[];
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
        refreshDiagnostics(): void;
    }
    class InferredProject extends Project {
        private static readonly newName;
        private _isJsInferredProject;
        toggleJsInferredProject(isJsInferredProject: boolean): void;
        setCompilerOptions(options?: CompilerOptions): void;
        readonly projectRootPath: string | undefined;
        readonly canonicalCurrentDirectory: string | undefined;
        constructor(projectService: ProjectService, documentRegistry: DocumentRegistry, compilerOptions: CompilerOptions, projectRootPath: NormalizedPath | undefined, currentDirectory: string | undefined, pluginConfigOverrides: Map<any> | undefined);
        addRoot(info: ScriptInfo): void;
        removeRoot(info: ScriptInfo): void;
        isOrphan(): boolean;
        isProjectWithSingleRoot(): boolean;
        close(): void;
        getTypeAcquisition(): TypeAcquisition;
    }
    class ConfiguredProject extends Project {
        private typeAcquisition;
        configFileWatcher: FileWatcher | undefined;
        private directoriesWatchedForWildcards;
        readonly canonicalConfigFilePath: NormalizedPath;
        pendingReload: ConfigFileProgramReloadLevel | undefined;
        pendingReloadReason: string | undefined;
        configFileSpecs: ConfigFileSpecs | undefined;
        canConfigFileJsonReportNoInputFiles: boolean;
        private externalProjectRefCount;
        private projectErrors;
        private projectReferences;
        projectOptions?: ProjectOptions | true;
        protected isInitialLoadPending: () => boolean;
        sendLoadingProjectFinish: boolean;
        constructor(configFileName: NormalizedPath, projectService: ProjectService, documentRegistry: DocumentRegistry, cachedDirectoryStructureHost: CachedDirectoryStructureHost);
        updateGraph(): boolean;
        getCachedDirectoryStructureHost(): CachedDirectoryStructureHost;
        getConfigFilePath(): NormalizedPath;
        getProjectReferences(): ReadonlyArray<ProjectReference> | undefined;
        updateReferences(refs: ReadonlyArray<ProjectReference> | undefined): void;
        forEachResolvedProjectReference<T>(cb: (resolvedProjectReference: ResolvedProjectReference | undefined, resolvedProjectReferencePath: Path) => T | undefined): T | undefined;
        enablePluginsWithOptions(options: CompilerOptions, pluginConfigOverrides: Map<any> | undefined): void;
        getGlobalProjectErrors(): ReadonlyArray<Diagnostic>;
        getAllProjectErrors(): ReadonlyArray<Diagnostic>;
        setProjectErrors(projectErrors: Diagnostic[]): void;
        setTypeAcquisition(newTypeAcquisition: TypeAcquisition): void;
        getTypeAcquisition(): TypeAcquisition;
        watchWildcards(wildcardDirectories: Map<WatchDirectoryFlags>): void;
        stopWatchingWildCards(): void;
        close(): void;
        addExternalProjectReference(): void;
        deleteExternalProjectReference(): void;
        hasOpenRef(): boolean;
        hasExternalProjectRef(): boolean;
        getEffectiveTypeRoots(): string[];
        updateErrorOnNoInputFiles(fileNameResult: ExpandResult): void;
    }
    class ExternalProject extends Project {
        externalProjectName: string;
        compileOnSaveEnabled: boolean;
        excludedFiles: ReadonlyArray<NormalizedPath>;
        private typeAcquisition;
        constructor(externalProjectName: string, projectService: ProjectService, documentRegistry: DocumentRegistry, compilerOptions: CompilerOptions, lastFileExceededProgramSize: string | undefined, compileOnSaveEnabled: boolean, projectFilePath?: string);
        updateGraph(): boolean;
        getExcludedFiles(): ReadonlyArray<NormalizedPath>;
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
    const SurveyReady = "surveyReady";
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
    interface SurveyReady {
        eventName: typeof SurveyReady;
        data: {
            surveyId: string;
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
    interface ProjectInfoTelemetryEvent {
        readonly eventName: typeof ProjectInfoTelemetryEvent;
        readonly data: ProjectInfoTelemetryEventData;
    }
    interface ProjectInfoTelemetryEventData {
        readonly projectId: string;
        readonly fileStats: FileStats;
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
        readonly version: string;
    }
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
    type ProjectServiceEvent = LargeFileReferencedEvent | SurveyReady | ProjectsUpdatedInBackgroundEvent | ProjectLoadingStartEvent | ProjectLoadingFinishEvent | ConfigFileDiagEvent | ProjectLanguageServiceStateEvent | ProjectInfoTelemetryEvent | OpenFileInfoTelemetryEvent;
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
    const enum WatchType {
        ConfigFilePath = "Config file for the program",
        MissingFilePath = "Missing file from program",
        WildcardDirectories = "Wild card directory",
        ClosedScriptInfo = "Closed Script info",
        ConfigFileForInferredRoot = "Config file for the inferred project root",
        FailedLookupLocation = "Directory of Failed lookup locations in module resolution",
        TypeRoots = "Type root directory",
        NodeModulesForClosedScriptInfo = "node_modules for closed script infos in them"
    }
    interface ConfigFileExistenceInfo {
        exists: boolean;
        openFilesImpactedByConfigFile: Map<boolean>;
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
    class ProjectService {
        readonly typingsCache: TypingsCache;
        readonly documentRegistry: DocumentRegistry;
        private readonly filenameToScriptInfo;
        private readonly scriptInfoInNodeModulesWatchers;
        private readonly filenameToScriptInfoVersion;
        private readonly allJsFilesForOpenFileTelemetry;
        readonly realpathToScriptInfos: MultiMap<ScriptInfo> | undefined;
        private readonly externalProjectToConfiguredProjectMap;
        readonly externalProjects: ExternalProject[];
        readonly inferredProjects: InferredProject[];
        readonly configuredProjects: Map<ConfiguredProject>;
        readonly openFiles: Map<NormalizedPath | undefined>;
        private readonly openFilesWithNonRootedDiskPath;
        private compilerOptionsForInferredProjects;
        private compilerOptionsForInferredProjectsPerProjectRoot;
        private readonly projectToSizeMap;
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
        private readonly seenProjects;
        private readonly seenSurveyProjects;
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
        updateTypingsForProject(response: SetTypings | InvalidateCachedTypings | PackageInstalledResponse | BeginInstallTypes | EndInstallTypes): void;
        private delayEnsureProjectForOpenFiles;
        private delayUpdateProjectGraph;
        hasPendingProjectUpdate(project: Project): boolean;
        sendProjectsUpdatedInBackgroundEvent(): void;
        sendSurveyReadyEvent(surveyId: string): void;
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
        private ensureProjectStructuresUptoDate;
        getFormatCodeOptions(file: NormalizedPath): FormatCodeSettings;
        getPreferences(file: NormalizedPath): protocol.UserPreferences;
        getHostFormatCodeOptions(): FormatCodeSettings;
        getHostPreferences(): protocol.UserPreferences;
        private onSourceFileChanged;
        private handleDeletedFile;
        watchWildcardDirectory(directory: Path, flags: WatchDirectoryFlags, project: ConfiguredProject): FileWatcher;
        getConfigFileExistenceInfo(project: ConfiguredProject): ConfigFileExistenceInfo;
        private onConfigChangedForConfiguredProject;
        private onConfigFileChangeForOpenScriptInfo;
        private removeProject;
        assignOrphanScriptInfoToInferredProject(info: ScriptInfo, projectRootPath: NormalizedPath | undefined): InferredProject;
        private closeOpenFile;
        private deleteScriptInfo;
        private configFileExists;
        private setConfigFileExistenceByNewConfiguredProject;
        private configFileExistenceImpactsRootOfInferredProject;
        private setConfigFileExistenceInfoByClosedConfiguredProject;
        private logConfigFileWatchUpdate;
        private createConfigFileWatcherOfConfigFileExistence;
        private closeConfigFileWatcherOfConfigFileExistenceInfo;
        private stopWatchingConfigFilesForClosedScriptInfo;
        startWatchingConfigFilesForInferredProjectRoot(info: ScriptInfo): void;
        stopWatchingConfigFilesForInferredProjectRoot(info: ScriptInfo): void;
        private forEachConfigFileLocation;
        private getConfigFileNameForFile;
        private printProjects;
        private findConfiguredProjectByProjectName;
        private getConfiguredProjectByCanonicalConfigFilePath;
        private findExternalProjectByProjectName;
        private getFilenameForExceededTotalSizeLimitForNonTsFiles;
        private createExternalProject;
        sendSurveyReady(project: ExternalProject | ConfiguredProject): void;
        sendProjectTelemetry(project: ExternalProject | ConfiguredProject): void;
        private addFilesToNonInferredProject;
        private createConfiguredProject;
        private createConfiguredProjectWithDelayLoad;
        private createAndLoadConfiguredProject;
        private createLoadAndUpdateConfiguredProject;
        private loadConfiguredProject;
        private updateNonInferredProjectFiles;
        private updateRootAndOptionsOfNonInferredProject;
        reloadFileNamesOfConfiguredProject(project: ConfiguredProject): boolean;
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
        getScriptInfoForNormalizedPath(fileName: NormalizedPath): ScriptInfo | undefined;
        getScriptInfoForPath(fileName: Path): ScriptInfo | undefined;
        setHostConfiguration(args: protocol.ConfigureRequestArguments): void;
        closeLog(): void;
        reloadProjects(): void;
        private delayReloadConfiguredProjectForFiles;
        private reloadConfiguredProjectForFiles;
        private removeRootOfInferredProjectIfNowPartOfOtherProject;
        private ensureProjectForOpenFiles;
        openClientFile(fileName: string, fileContent?: string, scriptKind?: ScriptKind, projectRootPath?: string): OpenConfiguredProjectResult;
        getOriginalLocationEnsuringConfiguredProject(project: Project, location: DocumentPosition): DocumentPosition | undefined;
        fileExists(fileName: NormalizedPath): boolean;
        private findExternalProjectContainingOpenScriptInfo;
        openClientFileWithNormalizedPath(fileName: NormalizedPath, fileContent?: string, scriptKind?: ScriptKind, hasMixedContent?: boolean, projectRootPath?: NormalizedPath): OpenConfiguredProjectResult;
        private removeOrphanConfiguredProjects;
        private telemetryOnOpenFile;
        closeClientFile(uncheckedFileName: string): void;
        private collectChanges;
        synchronizeProjectList(knownProjects: protocol.ProjectVersionInfo[]): ProjectFilesWithTSDiagnostics[];
        applyChangesInOpenFiles(openFiles: protocol.ExternalFile[] | undefined, changedFiles: protocol.ChangedOpenFile[] | undefined, closedFiles: string[] | undefined): void;
        applyChangesToFile(scriptInfo: ScriptInfo, changes: TextChange[]): void;
        private closeConfiguredProjectReferencedFromExternalProject;
        closeExternalProject(uncheckedFileName: string): void;
        openExternalProjects(projects: protocol.ExternalProject[]): void;
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
        canUseEvents: boolean;
        eventHandler?: ProjectServiceEventHandler;
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
        output(info: any, cmdName: string, reqSeq?: number, errorMsg?: string): void;
        private doOutput;
        private semanticCheck;
        private syntacticCheck;
        private suggestionCheck;
        private sendDiagnosticsEvent;
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
        getLineInfo(line: number): AbsolutePositionAndLineText;
        lineOffsetToPosition(line: number, column: number): number;
        positionToLineOffset(position: number): protocol.Location;
        lineToTextSpan(line: number): TextSpan;
        getTextChangesBetweenVersions(oldVersion: number, newVersion: number): TextChangeRange | undefined;
        static fromString(script: string): ScriptVersionCache;
    }
    class LineIndex {
        root: LineNode;
        checkEdits: boolean;
        absolutePositionOfStartOfLine(oneBasedLine: number): number;
        positionToLineOffset(position: number): protocol.Location;
        private positionToColumnAndLineText;
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