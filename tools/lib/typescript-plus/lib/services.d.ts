declare namespace ts {
    interface Node {
        getSourceFile(): SourceFile;
        getChildCount(sourceFile?: SourceFile): number;
        getChildAt(index: number, sourceFile?: SourceFile): Node;
        getChildren(sourceFile?: SourceFile): Node[];
        getChildren(sourceFile?: SourceFileLike): Node[];
        getStart(sourceFile?: SourceFile, includeJsDocComment?: boolean): number;
        getStart(sourceFile?: SourceFileLike, includeJsDocComment?: boolean): number;
        getFullStart(): number;
        getEnd(): number;
        getWidth(sourceFile?: SourceFileLike): number;
        getFullWidth(): number;
        getLeadingTriviaWidth(sourceFile?: SourceFile): number;
        getFullText(sourceFile?: SourceFile): string;
        getText(sourceFile?: SourceFile): string;
        getFirstToken(sourceFile?: SourceFile): Node | undefined;
        getLastToken(sourceFile?: SourceFile): Node | undefined;
        forEachChild<T>(cbNode: (node: Node) => T | undefined, cbNodeArray?: (nodes: NodeArray<Node>) => T | undefined): T | undefined;
    }
    interface Identifier {
        readonly text: string;
    }
    interface Symbol {
        readonly name: string;
        getFlags(): SymbolFlags;
        getEscapedName(): __String;
        getName(): string;
        getDeclarations(): Declaration[] | undefined;
        getDocumentationComment(typeChecker: TypeChecker | undefined): SymbolDisplayPart[];
        getJsDocTags(): JSDocTagInfo[];
    }
    interface Type {
        getFlags(): TypeFlags;
        getSymbol(): Symbol | undefined;
        getProperties(): Symbol[];
        getProperty(propertyName: string): Symbol | undefined;
        getApparentProperties(): Symbol[];
        getCallSignatures(): ReadonlyArray<Signature>;
        getConstructSignatures(): ReadonlyArray<Signature>;
        getStringIndexType(): Type | undefined;
        getNumberIndexType(): Type | undefined;
        getBaseTypes(): BaseType[] | undefined;
        getNonNullableType(): Type;
        getConstraint(): Type | undefined;
        getDefault(): Type | undefined;
        isUnion(): this is UnionType;
        isIntersection(): this is IntersectionType;
        isUnionOrIntersection(): this is UnionOrIntersectionType;
        isLiteral(): this is LiteralType;
        isStringLiteral(): this is StringLiteralType;
        isNumberLiteral(): this is NumberLiteralType;
        isTypeParameter(): this is TypeParameter;
        isClassOrInterface(): this is InterfaceType;
        isClass(): this is InterfaceType;
    }
    interface Signature {
        getDeclaration(): SignatureDeclaration;
        getTypeParameters(): TypeParameter[] | undefined;
        getParameters(): Symbol[];
        getReturnType(): Type;
        getDocumentationComment(typeChecker: TypeChecker | undefined): SymbolDisplayPart[];
        getJsDocTags(): JSDocTagInfo[];
    }
    interface SourceFile {
        version: string;
        scriptSnapshot: IScriptSnapshot | undefined;
        nameTable: UnderscoreEscapedMap<number> | undefined;
        getNamedDeclarations(): Map<ReadonlyArray<Declaration>>;
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
        getLineEndOfPosition(pos: number): number;
        getLineStarts(): ReadonlyArray<number>;
        getPositionOfLineAndCharacter(line: number, character: number): number;
        update(newText: string, textChangeRange: TextChangeRange): SourceFile;
        sourceMapper?: sourcemaps.SourceMapper;
    }
    interface SourceFileLike {
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
        sourceMapper?: sourcemaps.SourceMapper;
    }
    interface SourceMapSource {
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
    }
    /**
     * Represents an immutable snapshot of a script at a specified time.Once acquired, the
     * snapshot is observably immutable. i.e. the same calls with the same parameters will return
     * the same values.
     */
    interface IScriptSnapshot {
        /** Gets a portion of the script snapshot specified by [start, end). */
        getText(start: number, end: number): string;
        /** Gets the length of this script snapshot. */
        getLength(): number;
        /**
         * Gets the TextChangeRange that describe how the text changed between this text and
         * an older version.  This information is used by the incremental parser to determine
         * what sections of the script need to be re-parsed.  'undefined' can be returned if the
         * change range cannot be determined.  However, in that case, incremental parsing will
         * not happen and the entire document will be re - parsed.
         */
        getChangeRange(oldSnapshot: IScriptSnapshot): TextChangeRange | undefined;
        /** Releases all resources held by this script snapshot */
        dispose?(): void;
    }
    namespace ScriptSnapshot {
        function fromString(text: string): IScriptSnapshot;
    }
    interface PreProcessedFileInfo {
        referencedFiles: FileReference[];
        typeReferenceDirectives: FileReference[];
        libReferenceDirectives: FileReference[];
        importedFiles: FileReference[];
        ambientExternalModules?: string[];
        isLibFile: boolean;
    }
    interface HostCancellationToken {
        isCancellationRequested(): boolean;
    }
    interface InstallPackageOptions {
        fileName: Path;
        packageName: string;
    }
    interface LanguageServiceHost extends GetEffectiveTypeRootsHost {
        getCompilationSettings(): CompilerOptions;
        getNewLine?(): string;
        getProjectVersion?(): string;
        getScriptFileNames(): string[];
        getScriptKind?(fileName: string): ScriptKind;
        getScriptVersion(fileName: string): string;
        getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
        getProjectReferences?(): ReadonlyArray<ProjectReference> | undefined;
        getLocalizedDiagnosticMessages?(): any;
        getCancellationToken?(): HostCancellationToken;
        getCurrentDirectory(): string;
        getDefaultLibFileName(options: CompilerOptions): string;
        log?(s: string): void;
        trace?(s: string): void;
        error?(s: string): void;
        useCaseSensitiveFileNames?(): boolean;
        readDirectory?(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
        readFile?(path: string, encoding?: string): string | undefined;
        realpath?(path: string): string;
        fileExists?(path: string): boolean;
        getTypeRootsVersion?(): number;
        resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames?: string[]): ResolvedModule[];
        getResolvedModuleWithFailedLookupLocationsFromCache?(modulename: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
        resolveTypeReferenceDirectives?(typeDirectiveNames: string[], containingFile: string): ResolvedTypeReferenceDirective[];
        hasInvalidatedResolution?: HasInvalidatedResolution;
        hasChangedAutomaticTypeDirectiveNames?: boolean;
        getDirectories?(directoryName: string): string[];
        /**
         * Gets a set of custom transformers to use during emit.
         */
        getCustomTransformers?(): CustomTransformers | undefined;
        isKnownTypesPackageName?(name: string): boolean;
        installPackage?(options: InstallPackageOptions): Promise<ApplyCodeActionCommandResult>;
        inspectValue?(options: InspectValueOptions): Promise<ValueInfo>;
        writeFile?(fileName: string, content: string): void;
    }
    const emptyOptions: {};
    interface LanguageService {
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): DiagnosticWithLocation[];
        /** The first time this is called, it will return global diagnostics (no location). */
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        getSuggestionDiagnostics(fileName: string): DiagnosticWithLocation[];
        getCompilerOptionsDiagnostics(): Diagnostic[];
        /**
         * @deprecated Use getEncodedSyntacticClassifications instead.
         */
        getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        /**
         * @deprecated Use getEncodedSemanticClassifications instead.
         */
        getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        getEncodedSyntacticClassifications(fileName: string, span: TextSpan): Classifications;
        getEncodedSemanticClassifications(fileName: string, span: TextSpan): Classifications;
        getCompletionsAtPosition(fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): CompletionInfo | undefined;
        getCompletionEntryDetails(fileName: string, position: number, name: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined;
        getCompletionEntrySymbol(fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined;
        getQuickInfoAtPosition(fileName: string, position: number): QuickInfo | undefined;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan | undefined;
        getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan | undefined;
        getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): SignatureHelpItems | undefined;
        getRenameInfo(fileName: string, position: number): RenameInfo;
        findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean): RenameLocation[] | undefined;
        getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[] | undefined;
        getDefinitionAndBoundSpan(fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined;
        getTypeDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[] | undefined;
        getImplementationAtPosition(fileName: string, position: number): ImplementationLocation[] | undefined;
        getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined;
        findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined;
        getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined;
        /** @deprecated */
        getOccurrencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined;
        getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string, excludeDtsFiles?: boolean): NavigateToItem[];
        getNavigationBarItems(fileName: string): NavigationBarItem[];
        getNavigationTree(fileName: string): NavigationTree;
        getOutliningSpans(fileName: string): OutliningSpan[];
        getTodoComments(fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[];
        getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
        getIndentationAtPosition(fileName: string, position: number, options: EditorOptions | EditorSettings): number;
        getFormattingEditsForRange(fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
        getFormattingEditsForDocument(fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
        getDocCommentTemplateAtPosition(fileName: string, position: number): TextInsertion | undefined;
        isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): boolean;
        /**
         * This will return a defined result if the position is after the `>` of the opening tag, or somewhere in the text, of a JSXElement with no closing tag.
         * Editors should call this after `>` is typed.
         */
        getJsxClosingTagAtPosition(fileName: string, position: number): JsxClosingTagInfo | undefined;
        getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): TextSpan | undefined;
        toLineColumnOffset?(fileName: string, position: number): LineAndCharacter;
        /** @internal */
        getSourceMapper(): SourceMapper;
        getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: FormatCodeSettings, preferences: UserPreferences): ReadonlyArray<CodeFixAction>;
        getCombinedCodeFix(scope: CombinedCodeFixScope, fixId: {}, formatOptions: FormatCodeSettings, preferences: UserPreferences): CombinedCodeActions;
        applyCodeActionCommand(action: CodeActionCommand, formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult>;
        applyCodeActionCommand(action: CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult[]>;
        applyCodeActionCommand(action: CodeActionCommand | CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
        /** @deprecated `fileName` will be ignored */
        applyCodeActionCommand(fileName: string, action: CodeActionCommand): Promise<ApplyCodeActionCommandResult>;
        /** @deprecated `fileName` will be ignored */
        applyCodeActionCommand(fileName: string, action: CodeActionCommand[]): Promise<ApplyCodeActionCommandResult[]>;
        /** @deprecated `fileName` will be ignored */
        applyCodeActionCommand(fileName: string, action: CodeActionCommand | CodeActionCommand[]): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
        getApplicableRefactors(fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined): ApplicableRefactorInfo[];
        getEditsForRefactor(fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined;
        organizeImports(scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
        getEditsForFileRename(oldFilePath: string, newFilePath: string, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
        getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean): EmitOutput;
        getProgram(): Program | undefined;
        getNonBoundSourceFile(fileName: string): SourceFile;
        dispose(): void;
    }
    interface JsxClosingTagInfo {
        readonly newText: string;
    }
    interface CombinedCodeFixScope {
        type: "file";
        fileName: string;
    }
    type OrganizeImportsScope = CombinedCodeFixScope;
    type CompletionsTriggerCharacter = "." | '"' | "'" | "`" | "/" | "@" | "<";
    interface GetCompletionsAtPositionOptions extends UserPreferences {
        /**
         * If the editor is asking for completions because a certain character was typed
         * (as opposed to when the user explicitly requested them) this should be set.
         */
        triggerCharacter?: CompletionsTriggerCharacter;
        /** @deprecated Use includeCompletionsForModuleExports */
        includeExternalModuleExports?: boolean;
        /** @deprecated Use includeCompletionsWithInsertText */
        includeInsertTextCompletions?: boolean;
    }
    type SignatureHelpTriggerCharacter = "," | "(" | "<";
    type SignatureHelpRetriggerCharacter = SignatureHelpTriggerCharacter | ")";
    interface SignatureHelpItemsOptions {
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
    interface ApplyCodeActionCommandResult {
        successMessage: string;
    }
    interface Classifications {
        spans: number[];
        endOfLineState: EndOfLineState;
    }
    interface ClassifiedSpan {
        textSpan: TextSpan;
        classificationType: ClassificationTypeNames;
    }
    /**
     * Navigation bar interface designed for visual studio's dual-column layout.
     * This does not form a proper tree.
     * The navbar is returned as a list of top-level items, each of which has a list of child items.
     * Child items always have an empty array for their `childItems`.
     */
    interface NavigationBarItem {
        text: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        spans: TextSpan[];
        childItems: NavigationBarItem[];
        indent: number;
        bolded: boolean;
        grayed: boolean;
    }
    /**
     * Node in a tree of nested declarations in a file.
     * The top node is always a script or module node.
     */
    interface NavigationTree {
        /** Name of the declaration, or a short description, e.g. "<class>". */
        text: string;
        kind: ScriptElementKind;
        /** ScriptElementKindModifier separated by commas, e.g. "public,abstract" */
        kindModifiers: string;
        /**
         * Spans of the nodes that generated this declaration.
         * There will be more than one if this is the result of merging.
         */
        spans: TextSpan[];
        nameSpan: TextSpan | undefined;
        /** Present if non-empty */
        childItems?: NavigationTree[];
    }
    interface TodoCommentDescriptor {
        text: string;
        priority: number;
    }
    interface TodoComment {
        descriptor: TodoCommentDescriptor;
        message: string;
        position: number;
    }
    class TextChange {
        span: TextSpan;
        newText: string;
    }
    interface FileTextChanges {
        fileName: string;
        textChanges: TextChange[];
        isNewFile?: boolean;
    }
    interface CodeAction {
        /** Description of the code action to display in the UI of the editor */
        description: string;
        /** Text changes to apply to each file as part of the code action */
        changes: FileTextChanges[];
        /**
         * If the user accepts the code fix, the editor should send the action back in a `applyAction` request.
         * This allows the language service to have side effects (e.g. installing dependencies) upon a code fix.
         */
        commands?: CodeActionCommand[];
    }
    interface CodeFixAction extends CodeAction {
        /** Short name to identify the fix, for use by telemetry. */
        fixName: string;
        /**
         * If present, one may call 'getCombinedCodeFix' with this fixId.
         * This may be omitted to indicate that the code fix can't be applied in a group.
         */
        fixId?: {};
        fixAllDescription?: string;
    }
    interface CombinedCodeActions {
        changes: ReadonlyArray<FileTextChanges>;
        commands?: ReadonlyArray<CodeActionCommand>;
    }
    type CodeActionCommand = InstallPackageAction | GenerateTypesAction;
    interface InstallPackageAction {
        readonly type: "install package";
        readonly file: string;
        readonly packageName: string;
    }
    interface GenerateTypesAction extends GenerateTypesOptions {
        readonly type: "generate types";
    }
    interface GenerateTypesOptions {
        readonly file: string;
        readonly fileToGenerateTypesFor: string;
        readonly outputFileName: string;
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
    /**
     * A set of edits to make in response to a refactor action, plus an optional
     * location where renaming should be invoked from
     */
    interface RefactorEditInfo {
        edits: FileTextChanges[];
        renameFilename?: string;
        renameLocation?: number;
        commands?: CodeActionCommand[];
    }
    interface TextInsertion {
        newText: string;
        /** The position in newText the caret should point to after the insertion. */
        caretOffset: number;
    }
    interface DocumentSpan {
        textSpan: TextSpan;
        fileName: string;
        /**
         * If the span represents a location that was remapped (e.g. via a .d.ts.map file),
         * then the original filename and span will be specified here
         */
        originalTextSpan?: TextSpan;
        originalFileName?: string;
    }
    interface RenameLocation extends DocumentSpan {
    }
    interface ReferenceEntry extends DocumentSpan {
        isWriteAccess: boolean;
        isDefinition: boolean;
        isInString?: true;
    }
    interface ImplementationLocation extends DocumentSpan {
        kind: ScriptElementKind;
        displayParts: SymbolDisplayPart[];
    }
    interface DocumentHighlights {
        fileName: string;
        highlightSpans: HighlightSpan[];
    }
    const enum HighlightSpanKind {
        none = "none",
        definition = "definition",
        reference = "reference",
        writtenReference = "writtenReference"
    }
    interface HighlightSpan {
        fileName?: string;
        isInString?: true;
        textSpan: TextSpan;
        kind: HighlightSpanKind;
    }
    interface NavigateToItem {
        name: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        matchKind: "exact" | "prefix" | "substring" | "camelCase";
        isCaseSensitive: boolean;
        fileName: string;
        textSpan: TextSpan;
        containerName: string;
        containerKind: ScriptElementKind;
    }
    enum IndentStyle {
        None = 0,
        Block = 1,
        Smart = 2
    }
    interface EditorOptions {
        BaseIndentSize?: number;
        IndentSize: number;
        TabSize: number;
        NewLineCharacter: string;
        ConvertTabsToSpaces: boolean;
        IndentStyle: IndentStyle;
    }
    interface EditorSettings {
        baseIndentSize?: number;
        indentSize?: number;
        tabSize?: number;
        newLineCharacter?: string;
        convertTabsToSpaces?: boolean;
        indentStyle?: IndentStyle;
    }
    interface FormatCodeOptions extends EditorOptions {
        InsertSpaceAfterCommaDelimiter: boolean;
        InsertSpaceAfterSemicolonInForStatements: boolean;
        InsertSpaceBeforeAndAfterBinaryOperators: boolean;
        InsertSpaceAfterConstructor?: boolean;
        InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
        InsertSpaceAfterTypeAssertion?: boolean;
        InsertSpaceBeforeFunctionParenthesis?: boolean;
        PlaceOpenBraceOnNewLineForFunctions: boolean;
        PlaceOpenBraceOnNewLineForControlBlocks: boolean;
        insertSpaceBeforeTypeAnnotation?: boolean;
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
        indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean;
    }
    const testFormatSettings: FormatCodeSettings;
    interface DefinitionInfo extends DocumentSpan {
        kind: ScriptElementKind;
        name: string;
        containerKind: ScriptElementKind;
        containerName: string;
    }
    interface DefinitionInfoAndBoundSpan {
        definitions?: ReadonlyArray<DefinitionInfo>;
        textSpan: TextSpan;
    }
    interface ReferencedSymbolDefinitionInfo extends DefinitionInfo {
        displayParts: SymbolDisplayPart[];
    }
    interface ReferencedSymbol {
        definition: ReferencedSymbolDefinitionInfo;
        references: ReferenceEntry[];
    }
    enum SymbolDisplayPartKind {
        aliasName = 0,
        className = 1,
        enumName = 2,
        fieldName = 3,
        interfaceName = 4,
        keyword = 5,
        lineBreak = 6,
        numericLiteral = 7,
        stringLiteral = 8,
        localName = 9,
        methodName = 10,
        moduleName = 11,
        operator = 12,
        parameterName = 13,
        propertyName = 14,
        punctuation = 15,
        space = 16,
        text = 17,
        typeParameterName = 18,
        enumMemberName = 19,
        functionName = 20,
        regularExpressionLiteral = 21
    }
    interface SymbolDisplayPart {
        text: string;
        kind: string;
    }
    interface JSDocTagInfo {
        name: string;
        text?: string;
    }
    interface QuickInfo {
        kind: ScriptElementKind;
        kindModifiers: string;
        textSpan: TextSpan;
        displayParts?: SymbolDisplayPart[];
        documentation?: SymbolDisplayPart[];
        tags?: JSDocTagInfo[];
    }
    interface RenameInfo {
        canRename: boolean;
        /**
         * File or directory to rename.
         * If set, `getEditsForFileRename` should be called instead of `findRenameLocations`.
         */
        fileToRename?: string;
        localizedErrorMessage?: string;
        displayName: string;
        fullDisplayName: string;
        kind: ScriptElementKind;
        kindModifiers: string;
        triggerSpan: TextSpan;
    }
    interface SignatureHelpParameter {
        name: string;
        documentation: SymbolDisplayPart[];
        displayParts: SymbolDisplayPart[];
        isOptional: boolean;
    }
    /**
     * Represents a single signature to show in signature help.
     * The id is used for subsequent calls into the language service to ask questions about the
     * signature help item in the context of any documents that have been updated.  i.e. after
     * an edit has happened, while signature help is still active, the host can ask important
     * questions like 'what parameter is the user currently contained within?'.
     */
    interface SignatureHelpItem {
        isVariadic: boolean;
        prefixDisplayParts: SymbolDisplayPart[];
        suffixDisplayParts: SymbolDisplayPart[];
        separatorDisplayParts: SymbolDisplayPart[];
        parameters: SignatureHelpParameter[];
        documentation: SymbolDisplayPart[];
        tags: JSDocTagInfo[];
    }
    /**
     * Represents a set of signature help items, and the preferred item that should be selected.
     */
    interface SignatureHelpItems {
        items: SignatureHelpItem[];
        applicableSpan: TextSpan;
        selectedItemIndex: number;
        argumentIndex: number;
        argumentCount: number;
    }
    interface CompletionInfo {
        /** Not true for all glboal completions. This will be true if the enclosing scope matches a few syntax kinds. See `isSnippetScope`. */
        isGlobalCompletion: boolean;
        isMemberCompletion: boolean;
        /**
         * true when the current location also allows for a new identifier
         */
        isNewIdentifierLocation: boolean;
        entries: CompletionEntry[];
    }
    interface CompletionEntry {
        name: string;
        kind: ScriptElementKind;
        kindModifiers?: string;
        sortText: string;
        insertText?: string;
        /**
         * An optional span that indicates the text to be replaced by this completion item.
         * If present, this span should be used instead of the default one.
         * It will be set if the required span differs from the one generated by the default replacement behavior.
         */
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
    const enum OutliningSpanKind {
        /** Single or multi-line comments */
        Comment = "comment",
        /** Sections marked by '// #region' and '// #endregion' comments */
        Region = "region",
        /** Declarations and expressions */
        Code = "code",
        /** Contiguous blocks of import declarations */
        Imports = "imports"
    }
    const enum OutputFileType {
        JavaScript = 0,
        SourceMap = 1,
        Declaration = 2
    }
    const enum EndOfLineState {
        None = 0,
        InMultiLineCommentTrivia = 1,
        InSingleQuoteStringLiteral = 2,
        InDoubleQuoteStringLiteral = 3,
        InTemplateHeadOrNoSubstitutionTemplate = 4,
        InTemplateMiddleOrTail = 5,
        InTemplateSubstitutionPosition = 6
    }
    enum TokenClass {
        Punctuation = 0,
        Keyword = 1,
        Operator = 2,
        Comment = 3,
        Whitespace = 4,
        Identifier = 5,
        NumberLiteral = 6,
        StringLiteral = 7,
        RegExpLiteral = 8
    }
    interface ClassificationResult {
        finalLexState: EndOfLineState;
        entries: ClassificationInfo[];
    }
    interface ClassificationInfo {
        length: number;
        classification: TokenClass;
    }
    interface Classifier {
        /**
         * Gives lexical classifications of tokens on a line without any syntactic context.
         * For instance, a token consisting of the text 'string' can be either an identifier
         * named 'string' or the keyword 'string', however, because this classifier is not aware,
         * it relies on certain heuristics to give acceptable results. For classifications where
         * speed trumps accuracy, this function is preferable; however, for true accuracy, the
         * syntactic classifier is ideal. In fact, in certain editing scenarios, combining the
         * lexical, syntactic, and semantic classifiers may issue the best user experience.
         *
         * @param text                      The text of a line to classify.
         * @param lexState                  The state of the lexical classifier at the end of the previous line.
         * @param syntacticClassifierAbsent Whether the client is *not* using a syntactic classifier.
         *                                  If there is no syntactic classifier (syntacticClassifierAbsent=true),
         *                                  certain heuristics may be used in its place; however, if there is a
         *                                  syntactic classifier (syntacticClassifierAbsent=false), certain
         *                                  classifications which may be incorrectly categorized will be given
         *                                  back as Identifiers in order to allow the syntactic classifier to
         *                                  subsume the classification.
         * @deprecated Use getLexicalClassifications instead.
         */
        getClassificationsForLine(text: string, lexState: EndOfLineState, syntacticClassifierAbsent: boolean): ClassificationResult;
        getEncodedLexicalClassifications(text: string, endOfLineState: EndOfLineState, syntacticClassifierAbsent: boolean): Classifications;
    }
    const enum ScriptElementKind {
        unknown = "",
        warning = "warning",
        /** predefined type (void) or keyword (class) */
        keyword = "keyword",
        /** top level script node */
        scriptElement = "script",
        /** module foo {} */
        moduleElement = "module",
        /** class X {} */
        classElement = "class",
        /** var x = class X {} */
        localClassElement = "local class",
        /** interface Y {} */
        interfaceElement = "interface",
        /** type T = ... */
        typeElement = "type",
        /** enum E */
        enumElement = "enum",
        enumMemberElement = "enum member",
        /**
         * Inside module and script only
         * const v = ..
         */
        variableElement = "var",
        /** Inside function */
        localVariableElement = "local var",
        /**
         * Inside module and script only
         * function f() { }
         */
        functionElement = "function",
        /** Inside function */
        localFunctionElement = "local function",
        /** class X { [public|private]* foo() {} } */
        memberFunctionElement = "method",
        /** class X { [public|private]* [get|set] foo:number; } */
        memberGetAccessorElement = "getter",
        memberSetAccessorElement = "setter",
        /**
         * class X { [public|private]* foo:number; }
         * interface Y { foo:number; }
         */
        memberVariableElement = "property",
        /** class X { constructor() { } } */
        constructorImplementationElement = "constructor",
        /** interface Y { ():number; } */
        callSignatureElement = "call",
        /** interface Y { []:number; } */
        indexSignatureElement = "index",
        /** interface Y { new():Y; } */
        constructSignatureElement = "construct",
        /** function foo(*Y*: string) */
        parameterElement = "parameter",
        typeParameterElement = "type parameter",
        primitiveType = "primitive type",
        label = "label",
        alias = "alias",
        constElement = "const",
        letElement = "let",
        directory = "directory",
        externalModuleName = "external module name",
        /**
         * <JsxTagName attribute1 attribute2={0} />
         */
        jsxAttribute = "JSX attribute",
        /** String literal */
        string = "string"
    }
    const enum ScriptElementKindModifier {
        none = "",
        publicMemberModifier = "public",
        privateMemberModifier = "private",
        protectedMemberModifier = "protected",
        exportedModifier = "export",
        ambientModifier = "declare",
        staticModifier = "static",
        abstractModifier = "abstract",
        optionalModifier = "optional"
    }
    const enum ClassificationTypeNames {
        comment = "comment",
        identifier = "identifier",
        keyword = "keyword",
        numericLiteral = "number",
        operator = "operator",
        stringLiteral = "string",
        whiteSpace = "whitespace",
        text = "text",
        punctuation = "punctuation",
        className = "class name",
        enumName = "enum name",
        interfaceName = "interface name",
        moduleName = "module name",
        typeParameterName = "type parameter name",
        typeAliasName = "type alias name",
        parameterName = "parameter name",
        docCommentTagName = "doc comment tag name",
        jsxOpenTagName = "jsx open tag name",
        jsxCloseTagName = "jsx close tag name",
        jsxSelfClosingTagName = "jsx self closing tag name",
        jsxAttribute = "jsx attribute",
        jsxText = "jsx text",
        jsxAttributeStringLiteralValue = "jsx attribute string literal value"
    }
    const enum ClassificationType {
        comment = 1,
        identifier = 2,
        keyword = 3,
        numericLiteral = 4,
        operator = 5,
        stringLiteral = 6,
        regularExpressionLiteral = 7,
        whiteSpace = 8,
        text = 9,
        punctuation = 10,
        className = 11,
        enumName = 12,
        interfaceName = 13,
        moduleName = 14,
        typeParameterName = 15,
        typeAliasName = 16,
        parameterName = 17,
        docCommentTagName = 18,
        jsxOpenTagName = 19,
        jsxCloseTagName = 20,
        jsxSelfClosingTagName = 21,
        jsxAttribute = 22,
        jsxText = 23,
        jsxAttributeStringLiteralValue = 24
    }
}
interface PromiseConstructor {
    new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    reject(reason: any): Promise<never>;
    all<T>(values: (T | PromiseLike<T>)[]): Promise<T[]>;
}
declare var Promise: PromiseConstructor;
declare namespace ts {
    const scanner: Scanner;
    const enum SemanticMeaning {
        None = 0,
        Value = 1,
        Type = 2,
        Namespace = 4,
        All = 7
    }
    function getMeaningFromDeclaration(node: Node): SemanticMeaning;
    function getMeaningFromLocation(node: Node): SemanticMeaning;
    function isInRightSideOfInternalImportEqualsDeclaration(node: Node): boolean;
    function isCallExpressionTarget(node: Node): boolean;
    function isNewExpressionTarget(node: Node): boolean;
    function isCallOrNewExpressionTarget(node: Node): boolean;
    function climbPastPropertyAccess(node: Node): Node;
    function getTargetLabel(referenceNode: Node, labelName: string): Identifier | undefined;
    function hasPropertyAccessExpressionWithName(node: CallExpression, funcName: string): boolean;
    function isJumpStatementTarget(node: Node): node is Identifier & {
        parent: BreakOrContinueStatement;
    };
    function isLabelOfLabeledStatement(node: Node): node is Identifier;
    function isLabelName(node: Node): boolean;
    function isRightSideOfQualifiedName(node: Node): boolean;
    function isRightSideOfPropertyAccess(node: Node): boolean;
    function isNameOfModuleDeclaration(node: Node): boolean;
    function isNameOfFunctionDeclaration(node: Node): boolean;
    function isLiteralNameOfPropertyDeclarationOrIndexAccess(node: StringLiteral | NumericLiteral): boolean;
    function isExpressionOfExternalModuleImportEqualsDeclaration(node: Node): boolean;
    function getContainerNode(node: Node): Declaration | undefined;
    function getNodeKind(node: Node): ScriptElementKind;
    function isThis(node: Node): boolean;
    interface ListItemInfo {
        listItemIndex: number;
        list: Node;
    }
    function getLineStartPositionForPosition(position: number, sourceFile: SourceFileLike): number;
    function rangeContainsRange(r1: TextRange, r2: TextRange): boolean;
    function rangeContainsRangeExclusive(r1: TextRange, r2: TextRange): boolean;
    function rangeContainsPosition(r: TextRange, pos: number): boolean;
    function rangeContainsPositionExclusive(r: TextRange, pos: number): boolean;
    function startEndContainsRange(start: number, end: number, range: TextRange): boolean;
    function rangeContainsStartEnd(range: TextRange, start: number, end: number): boolean;
    function rangeOverlapsWithStartEnd(r1: TextRange, start: number, end: number): boolean;
    function nodeOverlapsWithStartEnd(node: Node, sourceFile: SourceFile, start: number, end: number): boolean;
    function startEndOverlapsWithStartEnd(start1: number, end1: number, start2: number, end2: number): boolean;
    /**
     * Assumes `candidate.start <= position` holds.
     */
    function positionBelongsToNode(candidate: Node, position: number, sourceFile: SourceFile): boolean;
    function findListItemInfo(node: Node): ListItemInfo | undefined;
    function hasChildOfKind(n: Node, kind: SyntaxKind, sourceFile: SourceFile): boolean;
    function findChildOfKind<T extends Node>(n: Node, kind: T["kind"], sourceFile: SourceFileLike): T | undefined;
    function findContainingList(node: Node): SyntaxList | undefined;
    /**
     * Gets the token whose text has range [start, end) and
     * position >= start and (position < end or (position === end && token is literal or keyword or identifier))
     */
    function getTouchingPropertyName(sourceFile: SourceFile, position: number): Node;
    /**
     * Returns the token if position is in [start, end).
     * If position === end, returns the preceding token if includeItemAtEndPosition(previousToken) === true
     */
    function getTouchingToken(sourceFile: SourceFile, position: number, includePrecedingTokenAtEndPosition?: (n: Node) => boolean): Node;
    /** Returns a token if position is in [start-of-leading-trivia, end) */
    function getTokenAtPosition(sourceFile: SourceFile, position: number): Node;
    /**
     * The token on the left of the position is the token that strictly includes the position
     * or sits to the left of the cursor if it is on a boundary. For example
     *
     *   fo|o               -> will return foo
     *   foo <comment> |bar -> will return foo
     *
     */
    function findTokenOnLeftOfPosition(file: SourceFile, position: number): Node | undefined;
    function findNextToken(previousToken: Node, parent: Node, sourceFile: SourceFile): Node | undefined;
    /**
     * Finds the rightmost token satisfying `token.end <= position`,
     * excluding `JsxText` tokens containing only whitespace.
     */
    function findPrecedingToken(position: number, sourceFile: SourceFile, startNode?: Node, excludeJsdoc?: boolean): Node | undefined;
    function isInString(sourceFile: SourceFile, position: number, previousToken?: Node | undefined): boolean;
    /**
     * returns true if the position is in between the open and close elements of an JSX expression.
     */
    function isInsideJsxElementOrAttribute(sourceFile: SourceFile, position: number): boolean;
    function isInTemplateString(sourceFile: SourceFile, position: number): boolean;
    function findPrecedingMatchingToken(token: Node, matchingTokenKind: SyntaxKind, sourceFile: SourceFile): Node | undefined;
    function isPossiblyTypeArgumentPosition(token: Node, sourceFile: SourceFile, checker: TypeChecker): boolean;
    function getPossibleGenericSignatures(called: Expression, typeArgumentCount: number, checker: TypeChecker): ReadonlyArray<Signature>;
    interface PossibleTypeArgumentInfo {
        readonly called: Identifier;
        readonly nTypeArguments: number;
    }
    function getPossibleTypeArgumentsInfo(tokenIn: Node, sourceFile: SourceFile): PossibleTypeArgumentInfo | undefined;
    /**
     * Returns true if the cursor at position in sourceFile is within a comment.
     *
     * @param tokenAtPosition Must equal `getTokenAtPosition(sourceFile, position)
     * @param predicate Additional predicate to test on the comment range.
     */
    function isInComment(sourceFile: SourceFile, position: number, tokenAtPosition?: Node): CommentRange | undefined;
    function hasDocComment(sourceFile: SourceFile, position: number): boolean;
    function getNodeModifiers(node: Node): string;
    function getTypeArgumentOrTypeParameterList(node: Node): NodeArray<Node> | undefined;
    function isComment(kind: SyntaxKind): boolean;
    function isStringOrRegularExpressionOrTemplateLiteral(kind: SyntaxKind): boolean;
    function isPunctuation(kind: SyntaxKind): boolean;
    function isInsideTemplateLiteral(node: TemplateLiteralToken, position: number, sourceFile: SourceFile): boolean;
    function isAccessibilityModifier(kind: SyntaxKind): boolean;
    function cloneCompilerOptions(options: CompilerOptions): CompilerOptions;
    function isArrayLiteralOrObjectLiteralDestructuringPattern(node: Node): boolean;
    function isInReferenceComment(sourceFile: SourceFile, position: number): boolean;
    function isInNonReferenceComment(sourceFile: SourceFile, position: number): boolean;
    function createTextSpanFromNode(node: Node, sourceFile?: SourceFile): TextSpan;
    function createTextRangeFromNode(node: Node, sourceFile: SourceFile): TextRange;
    function createTextSpanFromRange(range: TextRange): TextSpan;
    function createTextRangeFromSpan(span: TextSpan): TextRange;
    function createTextChangeFromStartLength(start: number, length: number, newText: string): TextChange;
    function createTextChange(span: TextSpan, newText: string): TextChange;
    const typeKeywords: ReadonlyArray<SyntaxKind>;
    function isTypeKeyword(kind: SyntaxKind): boolean;
    /** True if the symbol is for an external module, as opposed to a namespace. */
    function isExternalModuleSymbol(moduleSymbol: Symbol): boolean;
    /** Returns `true` the first time it encounters a node and `false` afterwards. */
    type NodeSeenTracker<T = Node> = (node: T) => boolean;
    function nodeSeenTracker<T extends Node>(): NodeSeenTracker<T>;
    function getSnapshotText(snap: IScriptSnapshot): string;
    function repeatString(str: string, count: number): string;
    function skipConstraint(type: Type): Type;
    function getNameFromPropertyName(name: PropertyName): string | undefined;
    function programContainsEs6Modules(program: Program): boolean;
    function compilerOptionsIndicateEs6Modules(compilerOptions: CompilerOptions): boolean;
    function hostUsesCaseSensitiveFileNames(host: LanguageServiceHost): boolean;
    function hostGetCanonicalFileName(host: LanguageServiceHost): GetCanonicalFileName;
    function makeImportIfNecessary(defaultImport: Identifier | undefined, namedImports: ReadonlyArray<ImportSpecifier> | undefined, moduleSpecifier: string, quotePreference: QuotePreference): ImportDeclaration | undefined;
    function makeImport(defaultImport: Identifier | undefined, namedImports: ReadonlyArray<ImportSpecifier> | undefined, moduleSpecifier: string | Expression, quotePreference: QuotePreference): ImportDeclaration;
    function makeStringLiteral(text: string, quotePreference: QuotePreference): StringLiteral;
    const enum QuotePreference {
        Single = 0,
        Double = 1
    }
    function quotePreferenceFromString(str: StringLiteral, sourceFile: SourceFile): QuotePreference;
    function getQuotePreference(sourceFile: SourceFile, preferences: UserPreferences): QuotePreference;
    function getQuoteFromPreference(qp: QuotePreference): string;
    function symbolNameNoDefault(symbol: Symbol): string | undefined;
    function symbolEscapedNameNoDefault(symbol: Symbol): __String | undefined;
    function getPropertySymbolFromBindingElement(checker: TypeChecker, bindingElement: BindingElement & {
        name: Identifier;
    }): Symbol | undefined;
    /**
     * Find symbol of the given property-name and add the symbol to the given result array
     * @param symbol a symbol to start searching for the given propertyName
     * @param propertyName a name of property to search for
     * @param result an array of symbol of found property symbols
     * @param previousIterationSymbolsCache a cache of symbol from previous iterations of calling this function to prevent infinite revisiting of the same symbol.
     *                                The value of previousIterationSymbol is undefined when the function is first called.
     */
    function getPropertySymbolsFromBaseTypes<T>(symbol: Symbol, propertyName: string, checker: TypeChecker, cb: (symbol: Symbol) => T | undefined): T | undefined;
    function isMemberSymbolInBaseType(memberSymbol: Symbol, checker: TypeChecker): boolean;
    function getParentNodeInSpan(node: Node | undefined, file: SourceFile, span: TextSpan): Node | undefined;
    function findModifier(node: Node, kind: Modifier["kind"]): Modifier | undefined;
    function insertImport(changes: textChanges.ChangeTracker, sourceFile: SourceFile, importDecl: Statement): void;
    function textSpansEqual(a: TextSpan | undefined, b: TextSpan | undefined): boolean;
    function documentSpansEqual(a: DocumentSpan, b: DocumentSpan): boolean;
}
declare namespace ts {
    function isFirstDeclarationOfSymbolParameter(symbol: Symbol): boolean;
    function symbolPart(text: string, symbol: Symbol): SymbolDisplayPart;
    function displayPart(text: string, kind: SymbolDisplayPartKind): SymbolDisplayPart;
    function spacePart(): SymbolDisplayPart;
    function keywordPart(kind: SyntaxKind): SymbolDisplayPart;
    function punctuationPart(kind: SyntaxKind): SymbolDisplayPart;
    function operatorPart(kind: SyntaxKind): SymbolDisplayPart;
    function textOrKeywordPart(text: string): SymbolDisplayPart;
    function textPart(text: string): SymbolDisplayPart;
    /**
     * The default is CRLF.
     */
    function getNewLineOrDefaultFromHost(host: LanguageServiceHost | LanguageServiceShimHost, formatSettings?: FormatCodeSettings): string;
    function lineBreakPart(): SymbolDisplayPart;
    function mapToDisplayParts(writeDisplayParts: (writer: DisplayPartsSymbolWriter) => void): SymbolDisplayPart[];
    function typeToDisplayParts(typechecker: TypeChecker, type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
    function symbolToDisplayParts(typeChecker: TypeChecker, symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): SymbolDisplayPart[];
    function signatureToDisplayParts(typechecker: TypeChecker, signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
    function isImportOrExportSpecifierName(location: Node): location is Identifier;
    /**
     * Strip off existed single quotes or double quotes from a given string
     *
     * @return non-quoted string
     */
    function stripQuotes(name: string): string;
    function startsWithQuote(name: string): boolean;
    function scriptKindIs(fileName: string, host: LanguageServiceHost, ...scriptKinds: ScriptKind[]): boolean;
    function getScriptKind(fileName: string, host?: LanguageServiceHost): ScriptKind;
    function getUniqueSymbolId(symbol: Symbol, checker: TypeChecker): number;
    function getFirstNonSpaceCharacterPosition(text: string, position: number): number;
    /**
     * Creates a deep, memberwise clone of a node with no source map location.
     *
     * WARNING: This is an expensive operation and is only intended to be used in refactorings
     * and code fixes (because those are triggered by explicit user actions).
     */
    function getSynthesizedDeepClone<T extends Node | undefined>(node: T, includeTrivia?: boolean): T;
    function getSynthesizedDeepCloneWithRenames<T extends Node>(node: T, includeTrivia?: boolean, renameMap?: Map<Identifier>, checker?: TypeChecker, callback?: (originalNode: Node, clone: Node) => any): T;
    function getSynthesizedDeepClones<T extends Node>(nodes: NodeArray<T>, includeTrivia?: boolean): NodeArray<T>;
    function getSynthesizedDeepClones<T extends Node>(nodes: NodeArray<T> | undefined, includeTrivia?: boolean): NodeArray<T> | undefined;
    /**
     * Sets EmitFlags to suppress leading and trailing trivia on the node.
     */
    function suppressLeadingAndTrailingTrivia(node: Node): void;
    /**
     * Sets EmitFlags to suppress leading trivia on the node.
     */
    function suppressLeadingTrivia(node: Node): void;
    /**
     * Sets EmitFlags to suppress trailing trivia on the node.
     */
    function suppressTrailingTrivia(node: Node): void;
    function getUniqueName(baseName: string, sourceFile: SourceFile): string;
    /**
     * @return The index of the (only) reference to the extracted symbol.  We want the cursor
     * to be on the reference, rather than the declaration, because it's closer to where the
     * user was before extracting it.
     */
    function getRenameLocation(edits: ReadonlyArray<FileTextChanges>, renameFilename: string, name: string, preferLastLocation: boolean): number;
    function copyComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
}
declare namespace ts {
    function createClassifier(): Classifier;
    function getSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: UnderscoreEscapedMap<true>, span: TextSpan): ClassifiedSpan[];
    function getEncodedSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: UnderscoreEscapedMap<true>, span: TextSpan): Classifications;
    function getSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): ClassifiedSpan[];
    function getEncodedSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): Classifications;
}
declare namespace ts.Completions.PathCompletions {
    interface NameAndKind {
        readonly name: string;
        readonly kind: ScriptElementKind.scriptElement | ScriptElementKind.directory | ScriptElementKind.externalModuleName;
    }
    interface PathCompletion extends NameAndKind {
        readonly span: TextSpan | undefined;
    }
    function getStringLiteralCompletionsFromModuleNames(sourceFile: SourceFile, node: LiteralExpression, compilerOptions: CompilerOptions, host: LanguageServiceHost, typeChecker: TypeChecker): ReadonlyArray<PathCompletion>;
    function getTripleSlashReferenceCompletion(sourceFile: SourceFile, position: number, compilerOptions: CompilerOptions, host: LanguageServiceHost): ReadonlyArray<PathCompletion> | undefined;
}
declare namespace ts.Completions {
    type Log = (message: string) => void;
    function getCompletionsAtPosition(host: LanguageServiceHost, program: Program, log: Log, sourceFile: SourceFile, position: number, preferences: UserPreferences, triggerCharacter: CompletionsTriggerCharacter | undefined): CompletionInfo | undefined;
    interface CompletionEntryIdentifier {
        name: string;
        source?: string;
    }
    function getCompletionEntryDetails(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier, host: LanguageServiceHost, formatContext: formatting.FormatContext, preferences: UserPreferences, cancellationToken: CancellationToken): CompletionEntryDetails | undefined;
    function getCompletionEntrySymbol(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier): Symbol | undefined;
}
declare namespace ts.DocumentHighlights {
    function getDocumentHighlights(program: Program, cancellationToken: CancellationToken, sourceFile: SourceFile, position: number, sourceFilesToSearch: ReadonlyArray<SourceFile>): DocumentHighlights[] | undefined;
}
declare namespace ts {
    /**
     * The document registry represents a store of SourceFile objects that can be shared between
     * multiple LanguageService instances. A LanguageService instance holds on the SourceFile (AST)
     * of files in the context.
     * SourceFile objects account for most of the memory usage by the language service. Sharing
     * the same DocumentRegistry instance between different instances of LanguageService allow
     * for more efficient memory utilization since all projects will share at least the library
     * file (lib.d.ts).
     *
     * A more advanced use of the document registry is to serialize sourceFile objects to disk
     * and re-hydrate them when needed.
     *
     * To create a default DocumentRegistry, use createDocumentRegistry to create one, and pass it
     * to all subsequent createLanguageService calls.
     */
    interface DocumentRegistry {
        /**
         * Request a stored SourceFile with a given fileName and compilationSettings.
         * The first call to acquire will call createLanguageServiceSourceFile to generate
         * the SourceFile if was not found in the registry.
         *
         * @param fileName The name of the file requested
         * @param compilationSettings Some compilation settings like target affects the
         * shape of a the resulting SourceFile. This allows the DocumentRegistry to store
         * multiple copies of the same file for different compilation settings.
         * @param scriptSnapshot Text of the file. Only used if the file was not found
         * in the registry and a new one was created.
         * @param version Current version of the file. Only used if the file was not found
         * in the registry and a new one was created.
         */
        acquireDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
        acquireDocumentWithKey(fileName: string, path: Path, compilationSettings: CompilerOptions, key: DocumentRegistryBucketKey, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
        /**
         * Request an updated version of an already existing SourceFile with a given fileName
         * and compilationSettings. The update will in-turn call updateLanguageServiceSourceFile
         * to get an updated SourceFile.
         *
         * @param fileName The name of the file requested
         * @param compilationSettings Some compilation settings like target affects the
         * shape of a the resulting SourceFile. This allows the DocumentRegistry to store
         * multiple copies of the same file for different compilation settings.
         * @param scriptSnapshot Text of the file.
         * @param version Current version of the file.
         */
        updateDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
        updateDocumentWithKey(fileName: string, path: Path, compilationSettings: CompilerOptions, key: DocumentRegistryBucketKey, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
        getKeyForCompilationSettings(settings: CompilerOptions): DocumentRegistryBucketKey;
        /**
         * Informs the DocumentRegistry that a file is not needed any longer.
         *
         * Note: It is not allowed to call release on a SourceFile that was not acquired from
         * this registry originally.
         *
         * @param fileName The name of the file to be released
         * @param compilationSettings The compilation settings used to acquire the file
         */
        releaseDocument(fileName: string, compilationSettings: CompilerOptions): void;
        releaseDocumentWithKey(path: Path, key: DocumentRegistryBucketKey): void;
        getLanguageServiceRefCounts(path: Path): [string, number | undefined][];
        reportStats(): string;
    }
    interface ExternalDocumentCache {
        setDocument(key: DocumentRegistryBucketKey, path: Path, sourceFile: SourceFile): void;
        getDocument(key: DocumentRegistryBucketKey, path: Path): SourceFile | undefined;
    }
    type DocumentRegistryBucketKey = string & {
        __bucketKey: any;
    };
    function createDocumentRegistry(useCaseSensitiveFileNames?: boolean, currentDirectory?: string): DocumentRegistry;
    function createDocumentRegistryInternal(useCaseSensitiveFileNames?: boolean, currentDirectory?: string, externalCache?: ExternalDocumentCache): DocumentRegistry;
}
declare namespace ts.FindAllReferences {
    interface ImportsResult {
        /** For every import of the symbol, the location and local symbol for the import. */
        importSearches: ReadonlyArray<[Identifier, Symbol]>;
        /** For rename imports/exports `{ foo as bar }`, `foo` is not a local, so it may be added as a reference immediately without further searching. */
        singleReferences: ReadonlyArray<Identifier | StringLiteral>;
        /** List of source files that may (or may not) use the symbol via a namespace. (For UMD modules this is every file.) */
        indirectUsers: ReadonlyArray<SourceFile>;
    }
    type ImportTracker = (exportSymbol: Symbol, exportInfo: ExportInfo, isForRename: boolean) => ImportsResult;
    /** Creates the imports map and returns an ImportTracker that uses it. Call this lazily to avoid calling `getDirectImportsMap` unnecessarily.  */
    function createImportTracker(sourceFiles: ReadonlyArray<SourceFile>, sourceFilesSet: ReadonlyMap<true>, checker: TypeChecker, cancellationToken: CancellationToken | undefined): ImportTracker;
    /** Info about an exported symbol to perform recursive search on. */
    interface ExportInfo {
        exportingModuleSymbol: Symbol;
        exportKind: ExportKind;
    }
    const enum ExportKind {
        Named = 0,
        Default = 1,
        ExportEquals = 2
    }
    const enum ImportExport {
        Import = 0,
        Export = 1
    }
    type ModuleReference = {
        kind: "import";
        literal: StringLiteralLike;
    }
    /** <reference path> or <reference types> */
     | {
        kind: "reference";
        referencingFile: SourceFile;
        ref: FileReference;
    };
    function findModuleReferences(program: Program, sourceFiles: ReadonlyArray<SourceFile>, searchModuleSymbol: Symbol): ModuleReference[];
    interface ImportedSymbol {
        kind: ImportExport.Import;
        symbol: Symbol;
        isNamedImport: boolean;
    }
    interface ExportedSymbol {
        kind: ImportExport.Export;
        symbol: Symbol;
        exportInfo: ExportInfo;
    }
    /**
     * Given a local reference, we might notice that it's an import/export and recursively search for references of that.
     * If at an import, look locally for the symbol it imports.
     * If an an export, look for all imports of it.
     * This doesn't handle export specifiers; that is done in `getReferencesAtExportSpecifier`.
     * @param comingFromExport If we are doing a search for all exports, don't bother looking backwards for the imported symbol, since that's the reason we're here.
     */
    function getImportOrExportSymbol(node: Node, symbol: Symbol, checker: TypeChecker, comingFromExport: boolean): ImportedSymbol | ExportedSymbol | undefined;
    function getExportInfo(exportSymbol: Symbol, exportKind: ExportKind, checker: TypeChecker): ExportInfo | undefined;
}
declare namespace ts.FindAllReferences {
    interface SymbolAndEntries {
        definition: Definition | undefined;
        references: Entry[];
    }
    const enum DefinitionKind {
        Symbol = 0,
        Label = 1,
        Keyword = 2,
        This = 3,
        String = 4
    }
    type Definition = {
        readonly type: DefinitionKind.Symbol;
        readonly symbol: Symbol;
    } | {
        readonly type: DefinitionKind.Label;
        readonly node: Identifier;
    } | {
        readonly type: DefinitionKind.Keyword;
        readonly node: Node;
    } | {
        readonly type: DefinitionKind.This;
        readonly node: Node;
    } | {
        readonly type: DefinitionKind.String;
        readonly node: StringLiteral;
    };
    type Entry = NodeEntry | SpanEntry;
    interface NodeEntry {
        type: "node";
        node: Node;
        isInString?: true;
    }
    interface SpanEntry {
        type: "span";
        fileName: string;
        textSpan: TextSpan;
    }
    function nodeEntry(node: Node, isInString?: true): NodeEntry;
    interface Options {
        readonly findInStrings?: boolean;
        readonly findInComments?: boolean;
        /**
         * True if we are renaming the symbol.
         * If so, we will find fewer references -- if it is referenced by several different names, we sill only find references for the original name.
         */
        readonly isForRename?: boolean;
        /** True if we are searching for implementations. We will have a different method of adding references if so. */
        readonly implementations?: boolean;
    }
    function findReferencedSymbols(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, sourceFile: SourceFile, position: number): ReferencedSymbol[] | undefined;
    function getImplementationsAtPosition(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, sourceFile: SourceFile, position: number): ImplementationLocation[] | undefined;
    function findReferencedEntries(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, node: Node, position: number, options: Options | undefined): ReferenceEntry[] | undefined;
    function getReferenceEntriesForNode(position: number, node: Node, program: Program, sourceFiles: ReadonlyArray<SourceFile>, cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlyMap<true>): Entry[] | undefined;
    function toHighlightSpan(entry: Entry): {
        fileName: string;
        span: HighlightSpan;
    };
}
/** Encapsulates the core find-all-references algorithm. */
declare namespace ts.FindAllReferences.Core {
    /** Core find-all-references algorithm. Handles special cases before delegating to `getReferencedSymbolsForSymbol`. */
    function getReferencedSymbolsForNode(position: number, node: Node, program: Program, sourceFiles: ReadonlyArray<SourceFile>, cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlyMap<true>): SymbolAndEntries[] | undefined;
    function eachExportReference(sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cancellationToken: CancellationToken | undefined, exportSymbol: Symbol, exportingModuleSymbol: Symbol, exportName: string, isDefaultExport: boolean, cb: (ref: Identifier) => void): void;
    /** Used as a quick check for whether a symbol is used at all in a file (besides its definition). */
    function isSymbolReferencedInFile(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile): boolean;
    function eachSymbolReferenceInFile<T>(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile, cb: (token: Identifier) => T): T | undefined;
    function eachSignatureCall(signature: SignatureDeclaration, sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cb: (call: CallExpression) => void): void;
    /**
     * Given an initial searchMeaning, extracted from a location, widen the search scope based on the declarations
     * of the corresponding symbol. e.g. if we are searching for "Foo" in value position, but "Foo" references a class
     * then we need to widen the search to include type positions as well.
     * On the contrary, if we are searching for "Bar" in type position and we trace bar to an interface, and an uninstantiated
     * module, we want to keep the search limited to only types, as the two declarations (interface and uninstantiated module)
     * do not intersect in any of the three spaces.
     */
    function getIntersectingMeaningFromDeclarations(node: Node, symbol: Symbol): SemanticMeaning;
    function getReferenceEntriesForShorthandPropertyAssignment(node: Node, checker: TypeChecker, addReference: (node: Node) => void): void;
}
declare namespace ts {
    function getEditsForFileRename(program: Program, oldFileOrDirPath: string, newFileOrDirPath: string, host: LanguageServiceHost, formatContext: formatting.FormatContext, _preferences: UserPreferences, sourceMapper: SourceMapper): ReadonlyArray<FileTextChanges>;
    /** If 'path' refers to an old directory, returns path in the new directory. */
    type PathUpdater = (path: string) => string | undefined;
    function getPathUpdater(oldFileOrDirPath: string, newFileOrDirPath: string, getCanonicalFileName: GetCanonicalFileName, sourceMapper: SourceMapper | undefined): PathUpdater;
}
declare namespace ts.GoToDefinition {
    function getDefinitionAtPosition(program: Program, sourceFile: SourceFile, position: number): DefinitionInfo[] | undefined;
    function getReferenceAtPosition(sourceFile: SourceFile, position: number, program: Program): {
        fileName: string;
        file: SourceFile;
    } | undefined;
    function getTypeDefinitionAtPosition(typeChecker: TypeChecker, sourceFile: SourceFile, position: number): DefinitionInfo[] | undefined;
    function getDefinitionAndBoundSpan(program: Program, sourceFile: SourceFile, position: number): DefinitionInfoAndBoundSpan | undefined;
    function findReferenceInPosition(refs: ReadonlyArray<FileReference>, pos: number): FileReference | undefined;
}
declare namespace ts.JsDoc {
    function getJsDocCommentsFromDeclarations(declarations: ReadonlyArray<Declaration>): SymbolDisplayPart[];
    function getJsDocTagsFromDeclarations(declarations?: Declaration[]): JSDocTagInfo[];
    function getJSDocTagNameCompletions(): CompletionEntry[];
    const getJSDocTagNameCompletionDetails: typeof getJSDocTagCompletionDetails;
    function getJSDocTagCompletions(): CompletionEntry[];
    function getJSDocTagCompletionDetails(name: string): CompletionEntryDetails;
    function getJSDocParameterNameCompletions(tag: JSDocParameterTag): CompletionEntry[];
    function getJSDocParameterNameCompletionDetails(name: string): CompletionEntryDetails;
    /**
     * Checks if position points to a valid position to add JSDoc comments, and if so,
     * returns the appropriate template. Otherwise returns an empty string.
     * Valid positions are
     *      - outside of comments, statements, and expressions, and
     *      - preceding a:
     *          - function/constructor/method declaration
     *          - class declarations
     *          - variable statements
     *          - namespace declarations
     *          - interface declarations
     *          - method signatures
     *          - type alias declarations
     *
     * Hosts should ideally check that:
     * - The line is all whitespace up to 'position' before performing the insertion.
     * - If the keystroke sequence "/\*\*" induced the call, we also check that the next
     * non-whitespace character is '*', which (approximately) indicates whether we added
     * the second '*' to complete an existing (JSDoc) comment.
     * @param fileName The file in which to perform the check.
     * @param position The (character-indexed) position in the file where the check should
     * be performed.
     */
    function getDocCommentTemplateAtPosition(newLine: string, sourceFile: SourceFile, position: number): TextInsertion | undefined;
}
declare namespace ts.NavigateTo {
    function getNavigateToItems(sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cancellationToken: CancellationToken, searchValue: string, maxResultCount: number | undefined, excludeDtsFiles: boolean): NavigateToItem[];
}
declare namespace ts.NavigationBar {
    function getNavigationBarItems(sourceFile: SourceFile, cancellationToken: CancellationToken): NavigationBarItem[];
    function getNavigationTree(sourceFile: SourceFile, cancellationToken: CancellationToken): NavigationTree;
}
declare namespace ts.OrganizeImports {
    /**
     * Organize imports by:
     *   1) Removing unused imports
     *   2) Coalescing imports from the same module
     *   3) Sorting imports
     */
    function organizeImports(sourceFile: SourceFile, formatContext: formatting.FormatContext, host: LanguageServiceHost, program: Program, _preferences: UserPreferences): FileTextChanges[];
    /**
     * @param importGroup a list of ImportDeclarations, all with the same module name.
     */
    function coalesceImports(importGroup: ReadonlyArray<ImportDeclaration>): ReadonlyArray<ImportDeclaration>;
    /**
     * @param exportGroup a list of ExportDeclarations, all with the same module name.
     */
    function coalesceExports(exportGroup: ReadonlyArray<ExportDeclaration>): ReadonlyArray<ExportDeclaration>;
    function compareModuleSpecifiers(m1: Expression, m2: Expression): Comparison;
}
declare namespace ts.OutliningElementsCollector {
    function collectElements(sourceFile: SourceFile, cancellationToken: CancellationToken): OutliningSpan[];
}
declare namespace ts {
    enum PatternMatchKind {
        exact = 0,
        prefix = 1,
        substring = 2,
        camelCase = 3
    }
    interface PatternMatch {
        kind: PatternMatchKind;
        isCaseSensitive: boolean;
    }
    interface PatternMatcher {
        getMatchForLastSegmentOfPattern(candidate: string): PatternMatch | undefined;
        getFullMatch(candidateContainers: ReadonlyArray<string>, candidate: string): PatternMatch | undefined;
        patternContainsDots: boolean;
    }
    function createPatternMatcher(pattern: string): PatternMatcher | undefined;
    function breakIntoCharacterSpans(identifier: string): TextSpan[];
    function breakIntoWordSpans(identifier: string): TextSpan[];
}
declare namespace ts {
    function preProcessFile(sourceText: string, readImportFiles?: boolean, detectJavaScriptImports?: boolean): PreProcessedFileInfo;
}
declare namespace ts.Rename {
    function getRenameInfo(program: Program, sourceFile: SourceFile, position: number): RenameInfo;
}
declare namespace ts.SignatureHelp {
    function getSignatureHelpItems(program: Program, sourceFile: SourceFile, position: number, triggerReason: SignatureHelpTriggerReason | undefined, cancellationToken: CancellationToken): SignatureHelpItems | undefined;
    interface ArgumentInfoForCompletions {
        readonly invocation: CallLikeExpression;
        readonly argumentIndex: number;
        readonly argumentCount: number;
    }
    function getArgumentInfoForCompletions(node: Node, position: number, sourceFile: SourceFile): ArgumentInfoForCompletions | undefined;
}
declare namespace ts {
    interface SourceMapper {
        toLineColumnOffset(fileName: string, position: number): LineAndCharacter;
        tryGetOriginalLocation(info: sourcemaps.SourceMappableLocation): sourcemaps.SourceMappableLocation | undefined;
        tryGetGeneratedLocation(info: sourcemaps.SourceMappableLocation): sourcemaps.SourceMappableLocation | undefined;
        clearCache(): void;
    }
    function getSourceMapper(getCanonicalFileName: GetCanonicalFileName, currentDirectory: string, log: (message: string) => void, host: LanguageServiceHost, getProgram: () => Program): SourceMapper;
}
declare namespace ts {
    function computeSuggestionDiagnostics(sourceFile: SourceFile, program: Program, cancellationToken: CancellationToken): DiagnosticWithLocation[];
    /** @internal */
    function getReturnStatementsWithPromiseHandlers(node: Node): ReturnStatement[];
}
declare namespace ts.SymbolDisplay {
    function getSymbolKind(typeChecker: TypeChecker, symbol: Symbol, location: Node): ScriptElementKind;
    function getSymbolModifiers(symbol: Symbol): string;
    interface SymbolDisplayPartsDocumentationAndSymbolKind {
        displayParts: SymbolDisplayPart[];
        documentation: SymbolDisplayPart[];
        symbolKind: ScriptElementKind;
        tags: JSDocTagInfo[] | undefined;
    }
    function getSymbolDisplayPartsDocumentationAndSymbolKind(typeChecker: TypeChecker, symbol: Symbol, sourceFile: SourceFile, enclosingDeclaration: Node | undefined, location: Node, semanticMeaning?: SemanticMeaning, alias?: Symbol): SymbolDisplayPartsDocumentationAndSymbolKind;
}
declare namespace ts {
    interface TranspileOptions {
        compilerOptions?: CompilerOptions;
        fileName?: string;
        reportDiagnostics?: boolean;
        moduleName?: string;
        renamedDependencies?: MapLike<string>;
        transformers?: CustomTransformers;
    }
    interface TranspileOutput {
        outputText: string;
        diagnostics?: Diagnostic[];
        sourceMapText?: string;
    }
    function transpileModule(input: string, transpileOptions: TranspileOptions): TranspileOutput;
    function transpile(input: string, compilerOptions?: CompilerOptions, fileName?: string, diagnostics?: Diagnostic[], moduleName?: string): string;
    /** JS users may pass in string values for enum compiler options (such as ModuleKind), so convert. */
    function fixupCompilerOptions(options: CompilerOptions, diagnostics: Diagnostic[]): CompilerOptions;
}
declare namespace ts.formatting {
    const enum FormattingRequestKind {
        FormatDocument = 0,
        FormatSelection = 1,
        FormatOnEnter = 2,
        FormatOnSemicolon = 3,
        FormatOnOpeningCurlyBrace = 4,
        FormatOnClosingCurlyBrace = 5
    }
    class FormattingContext {
        readonly sourceFile: SourceFileLike;
        formattingRequestKind: FormattingRequestKind;
        options: FormatCodeSettings;
        currentTokenSpan: TextRangeWithKind;
        nextTokenSpan: TextRangeWithKind;
        contextNode: Node;
        currentTokenParent: Node;
        nextTokenParent: Node;
        private contextNodeAllOnSameLine;
        private nextNodeAllOnSameLine;
        private tokensAreOnSameLine;
        private contextNodeBlockIsOnOneLine;
        private nextNodeBlockIsOnOneLine;
        constructor(sourceFile: SourceFileLike, formattingRequestKind: FormattingRequestKind, options: FormatCodeSettings);
        updateContext(currentRange: TextRangeWithKind, currentTokenParent: Node, nextRange: TextRangeWithKind, nextTokenParent: Node, commonParent: Node): void;
        ContextNodeAllOnSameLine(): boolean;
        NextNodeAllOnSameLine(): boolean;
        TokensAreOnSameLine(): boolean;
        ContextNodeBlockIsOnOneLine(): boolean;
        NextNodeBlockIsOnOneLine(): boolean;
        private NodeIsOnOneLine;
        private BlockIsOnOneLine;
    }
}
declare namespace ts.formatting {
    interface FormattingScanner {
        advance(): void;
        isOnToken(): boolean;
        readTokenInfo(n: Node): TokenInfo;
        getCurrentLeadingTrivia(): TextRangeWithKind[] | undefined;
        lastTrailingTriviaWasNewLine(): boolean;
        skipToEndOf(node: Node): void;
    }
    function getFormattingScanner<T>(text: string, languageVariant: LanguageVariant, startPos: number, endPos: number, cb: (scanner: FormattingScanner) => T): T;
}
declare namespace ts.formatting {
    interface Rule {
        readonly debugName: string;
        readonly context: ReadonlyArray<ContextPredicate>;
        readonly action: RuleAction;
        readonly flags: RuleFlags;
    }
    type ContextPredicate = (context: FormattingContext) => boolean;
    const anyContext: ReadonlyArray<ContextPredicate>;
    const enum RuleAction {
        Ignore = 1,
        Space = 2,
        NewLine = 4,
        Delete = 8
    }
    const enum RuleFlags {
        None = 0,
        CanDeleteNewLines = 1
    }
    interface TokenRange {
        readonly tokens: ReadonlyArray<SyntaxKind>;
        readonly isSpecific: boolean;
    }
}
declare namespace ts.formatting {
    interface RuleSpec {
        readonly leftTokenRange: TokenRange;
        readonly rightTokenRange: TokenRange;
        readonly rule: Rule;
    }
    function getAllRules(): RuleSpec[];
}
declare namespace ts.formatting {
    function getFormatContext(options: FormatCodeSettings): FormatContext;
    type RulesMap = (context: FormattingContext) => Rule | undefined;
}
declare namespace ts.formatting {
    interface FormatContext {
        readonly options: FormatCodeSettings;
        readonly getRule: RulesMap;
    }
    interface TextRangeWithKind extends TextRange {
        kind: SyntaxKind;
    }
    interface TextRangeWithTriviaKind extends TextRange {
        kind: TriviaKind;
    }
    interface TokenInfo {
        leadingTrivia: TextRangeWithTriviaKind[] | undefined;
        token: TextRangeWithKind;
        trailingTrivia: TextRangeWithTriviaKind[] | undefined;
    }
    function formatOnEnter(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatOnSemicolon(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatOnOpeningCurly(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatOnClosingCurly(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatDocument(sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatSelection(start: number, end: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
    function formatNodeGivenIndentation(node: Node, sourceFileLike: SourceFileLike, languageVariant: LanguageVariant, initialIndentation: number, delta: number, formatContext: FormatContext): TextChange[];
    /**
     * @param precedingToken pass `null` if preceding token was already computed and result was `undefined`.
     */
    function getRangeOfEnclosingComment(sourceFile: SourceFile, position: number, precedingToken?: Node | null, // tslint:disable-line:no-null-keyword
    tokenAtPosition?: Node): CommentRange | undefined;
    function getIndentationString(indentation: number, options: EditorSettings): string;
}
declare namespace ts.formatting {
    namespace SmartIndenter {
        /**
         * @param assumeNewLineBeforeCloseBrace
         * `false` when called on text from a real source file.
         * `true` when we need to assume `position` is on a newline.
         *
         * This is useful for codefixes. Consider
         * ```
         * function f() {
         * |}
         * ```
         * with `position` at `|`.
         *
         * When inserting some text after an open brace, we would like to get indentation as if a newline was already there.
         * By default indentation at `position` will be 0 so 'assumeNewLineBeforeCloseBrace' overrides this behavior.
         */
        function getIndentation(position: number, sourceFile: SourceFile, options: EditorSettings, assumeNewLineBeforeCloseBrace?: boolean): number;
        function getIndentationForNode(n: Node, ignoreActualIndentationRange: TextRange, sourceFile: SourceFile, options: EditorSettings): number;
        function getBaseIndentation(options: EditorSettings): number;
        function isArgumentAndStartLineOverlapsExpressionBeingCalled(parent: Node, child: Node, childStartLine: number, sourceFile: SourceFileLike): boolean;
        function childStartsOnTheSameLineWithElseInIfStatement(parent: Node, child: TextRangeWithKind, childStartLine: number, sourceFile: SourceFileLike): boolean;
        function getContainingList(node: Node, sourceFile: SourceFile): NodeArray<Node> | undefined;
        /**
         * Character is the actual index of the character since the beginning of the line.
         * Column - position of the character after expanding tabs to spaces.
         * "0\t2$"
         * value of 'character' for '$' is 3
         * value of 'column' for '$' is 6 (assuming that tab size is 4)
         */
        function findFirstNonWhitespaceCharacterAndColumn(startPos: number, endPos: number, sourceFile: SourceFileLike, options: EditorSettings): {
            column: number;
            character: number;
        };
        function findFirstNonWhitespaceColumn(startPos: number, endPos: number, sourceFile: SourceFileLike, options: EditorSettings): number;
        function nodeWillIndentChild(settings: FormatCodeSettings, parent: TextRangeWithKind, child: TextRangeWithKind | undefined, sourceFile: SourceFileLike | undefined, indentByDefault: boolean): boolean;
        /**
         * True when the parent node should indent the given child by an explicit rule.
         * @param isNextChild If true, we are judging indent of a hypothetical child *after* this one, not the current child.
         */
        function shouldIndentChildNode(settings: FormatCodeSettings, parent: TextRangeWithKind, child?: Node, sourceFile?: SourceFileLike, isNextChild?: boolean): boolean;
    }
}
declare namespace ts.textChanges {
    interface ConfigurableStart {
        /** True to use getStart() (NB, not getFullStart()) without adjustment. */
        useNonAdjustedStartPosition?: boolean;
    }
    interface ConfigurableEnd {
        /** True to use getEnd() without adjustment. */
        useNonAdjustedEndPosition?: boolean;
    }
    enum Position {
        FullStart = 0,
        Start = 1
    }
    /**
     * Usually node.pos points to a position immediately after the previous token.
     * If this position is used as a beginning of the span to remove - it might lead to removing the trailing trivia of the previous node, i.e:
     * const x; // this is x
     *        ^ - pos for the next variable declaration will point here
     * const y; // this is y
     *        ^ - end for previous variable declaration
     * Usually leading trivia of the variable declaration 'y' should not include trailing trivia (whitespace, comment 'this is x' and newline) from the preceding
     * variable declaration and trailing trivia for 'y' should include (whitespace, comment 'this is y', newline).
     * By default when removing nodes we adjust start and end positions to respect specification of the trivia above.
     * If pos\end should be interpreted literally 'useNonAdjustedStartPosition' or 'useNonAdjustedEndPosition' should be set to true
     */
    interface ConfigurableStartEnd extends ConfigurableStart, ConfigurableEnd {
    }
    const useNonAdjustedPositions: ConfigurableStartEnd;
    interface InsertNodeOptions {
        /**
         * Text to be inserted before the new node
         */
        prefix?: string;
        /**
         * Text to be inserted after the new node
         */
        suffix?: string;
        /**
         * Text of inserted node will be formatted with this indentation, otherwise indentation will be inferred from the old node
         */
        indentation?: number;
        /**
         * Text of inserted node will be formatted with this delta, otherwise delta will be inferred from the new node kind
         */
        delta?: number;
        /**
         * Do not trim leading white spaces in the edit range
         */
        preserveLeadingWhitespace?: boolean;
    }
    interface ReplaceWithMultipleNodesOptions extends InsertNodeOptions {
        readonly joiner?: string;
    }
    interface ChangeNodeOptions extends ConfigurableStartEnd, InsertNodeOptions {
    }
    interface TextChangesContext {
        host: LanguageServiceHost;
        formatContext: formatting.FormatContext;
    }
    type TypeAnnotatable = SignatureDeclaration | VariableDeclaration | ParameterDeclaration | PropertyDeclaration | PropertySignature;
    class ChangeTracker {
        private readonly newLineCharacter;
        private readonly formatContext;
        private readonly changes;
        private readonly newFiles;
        private readonly classesWithNodesInsertedAtStart;
        private readonly deletedNodes;
        static fromContext(context: TextChangesContext): ChangeTracker;
        static with(context: TextChangesContext, cb: (tracker: ChangeTracker) => void): FileTextChanges[];
        /** Public for tests only. Other callers should use `ChangeTracker.with`. */
        constructor(newLineCharacter: string, formatContext: formatting.FormatContext);
        deleteRange(sourceFile: SourceFile, range: TextRange): this;
        delete(sourceFile: SourceFile, node: Node | NodeArray<TypeParameterDeclaration>): void;
        deleteModifier(sourceFile: SourceFile, modifier: Modifier): void;
        deleteNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, options?: ConfigurableStartEnd): this;
        deleteNodeRangeExcludingEnd(sourceFile: SourceFile, startNode: Node, afterEndNode: Node | undefined, options?: ConfigurableStartEnd): void;
        replaceRange(sourceFile: SourceFile, range: TextRange, newNode: Node, options?: InsertNodeOptions): this;
        replaceNode(sourceFile: SourceFile, oldNode: Node, newNode: Node, options?: ChangeNodeOptions): this;
        replaceNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, newNode: Node, options?: ChangeNodeOptions): void;
        private replaceRangeWithNodes;
        replaceNodeWithNodes(sourceFile: SourceFile, oldNode: Node, newNodes: ReadonlyArray<Node>, options?: ChangeNodeOptions): this;
        replaceNodeRangeWithNodes(sourceFile: SourceFile, startNode: Node, endNode: Node, newNodes: ReadonlyArray<Node>, options?: ReplaceWithMultipleNodesOptions & ConfigurableStartEnd): this;
        private nextCommaToken;
        replacePropertyAssignment(sourceFile: SourceFile, oldNode: PropertyAssignment, newNode: PropertyAssignment): this;
        insertNodeAt(sourceFile: SourceFile, pos: number, newNode: Node, options?: InsertNodeOptions): void;
        private insertNodesAt;
        insertNodeAtTopOfFile(sourceFile: SourceFile, newNode: Statement, blankLineBetween: boolean): void;
        insertNodeBefore(sourceFile: SourceFile, before: Node, newNode: Node, blankLineBetween?: boolean): void;
        insertModifierBefore(sourceFile: SourceFile, modifier: SyntaxKind, before: Node): void;
        insertCommentBeforeLine(sourceFile: SourceFile, lineNumber: number, position: number, commentText: string): void;
        replaceRangeWithText(sourceFile: SourceFile, range: TextRange, text: string): void;
        insertText(sourceFile: SourceFile, pos: number, text: string): void;
        /** Prefer this over replacing a node with another that has a type annotation, as it avoids reformatting the other parts of the node. */
        tryInsertTypeAnnotation(sourceFile: SourceFile, node: TypeAnnotatable, type: TypeNode): void;
        insertTypeParameters(sourceFile: SourceFile, node: SignatureDeclaration, typeParameters: ReadonlyArray<TypeParameterDeclaration>): void;
        private getOptionsForInsertNodeBefore;
        insertNodeAtConstructorStart(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
        insertNodeAtConstructorEnd(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
        private replaceConstructorBody;
        insertNodeAtEndOfScope(sourceFile: SourceFile, scope: Node, newNode: Node): void;
        insertNodeAtClassStart(sourceFile: SourceFile, cls: ClassLikeDeclaration | InterfaceDeclaration, newElement: ClassElement): void;
        insertNodeAtObjectStart(sourceFile: SourceFile, obj: ObjectLiteralExpression, newElement: ObjectLiteralElementLike): void;
        private insertNodeAtStartWorker;
        private getInsertNodeAtStartPrefixSuffix;
        insertNodeAfterComma(sourceFile: SourceFile, after: Node, newNode: Node): void;
        insertNodeAfter(sourceFile: SourceFile, after: Node, newNode: Node): void;
        insertNodeAtEndOfList(sourceFile: SourceFile, list: NodeArray<Node>, newNode: Node): void;
        insertNodesAfter(sourceFile: SourceFile, after: Node, newNodes: ReadonlyArray<Node>): void;
        private insertNodeAfterWorker;
        private getInsertNodeAfterOptions;
        private getInsertNodeAfterOptionsWorker;
        insertName(sourceFile: SourceFile, node: FunctionExpression | ClassExpression | ArrowFunction, name: string): void;
        insertExportModifier(sourceFile: SourceFile, node: DeclarationStatement | VariableStatement): void;
        /**
         * This function should be used to insert nodes in lists when nodes don't carry separators as the part of the node range,
         * i.e. arguments in arguments lists, parameters in parameter lists etc.
         * Note that separators are part of the node in statements and class elements.
         */
        insertNodeInListAfter(sourceFile: SourceFile, after: Node, newNode: Node, containingList?: NodeArray<Node> | undefined): this;
        private finishClassesWithNodesInsertedAtStart;
        private finishDeleteDeclarations;
        /**
         * Note: after calling this, the TextChanges object must be discarded!
         * @param validate only for tests
         *    The reason we must validate as part of this method is that `getNonFormattedText` changes the node's positions,
         *    so we can only call this once and can't get the non-formatted text separately.
         */
        getChanges(validate?: ValidateNonFormattedText): FileTextChanges[];
        createNewFile(oldFile: SourceFile | undefined, fileName: string, statements: ReadonlyArray<Statement>): void;
    }
    type ValidateNonFormattedText = (node: Node, text: string) => void;
    function getNewFileText(statements: ReadonlyArray<Statement>, scriptKind: ScriptKind, newLineCharacter: string, formatContext: formatting.FormatContext): string;
    function applyChanges(text: string, changes: ReadonlyArray<TextChange>): string;
    function isValidLocationToAddComment(sourceFile: SourceFile, position: number): boolean;
    /** Warning: This deletes comments too. See `copyComments` in `convertFunctionToEs6Class`. */
    function deleteNode(changes: ChangeTracker, sourceFile: SourceFile, node: Node, options?: ConfigurableStartEnd): void;
}
declare namespace ts {
    interface CodeFixRegistration {
        errorCodes: ReadonlyArray<number>;
        getCodeActions(context: CodeFixContext): CodeFixAction[] | undefined;
        fixIds?: ReadonlyArray<string>;
        getAllCodeActions?(context: CodeFixAllContext): CombinedCodeActions;
    }
    interface CodeFixContextBase extends textChanges.TextChangesContext {
        sourceFile: SourceFile;
        program: Program;
        cancellationToken: CancellationToken;
        preferences: UserPreferences;
    }
    interface CodeFixAllContext extends CodeFixContextBase {
        fixId: {};
    }
    interface CodeFixContext extends CodeFixContextBase {
        errorCode: number;
        span: TextSpan;
    }
    namespace codefix {
        type DiagnosticAndArguments = DiagnosticMessage | [DiagnosticMessage, string] | [DiagnosticMessage, string, string];
        function createCodeFixActionNoFixId(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments): CodeFixAction;
        function createCodeFixAction(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments, fixId: {}, fixAllDescription: DiagnosticAndArguments, command?: CodeActionCommand): CodeFixAction;
        function registerCodeFix(reg: CodeFixRegistration): void;
        function getSupportedErrorCodes(): string[];
        function getFixes(context: CodeFixContext): CodeFixAction[];
        function getAllFixes(context: CodeFixAllContext): CombinedCodeActions;
        function createCombinedCodeActions(changes: FileTextChanges[], commands?: CodeActionCommand[]): CombinedCodeActions;
        function createFileTextChanges(fileName: string, textChanges: TextChange[]): FileTextChanges;
        function codeFixAll(context: CodeFixAllContext, errorCodes: number[], use: (changes: textChanges.ChangeTracker, error: DiagnosticWithLocation, commands: Push<CodeActionCommand>) => void): CombinedCodeActions;
        function eachDiagnostic({ program, sourceFile, cancellationToken }: CodeFixAllContext, errorCodes: ReadonlyArray<number>, cb: (diag: DiagnosticWithLocation) => void): void;
    }
}
declare namespace ts {
    interface Refactor {
        /** Compute the associated code actions */
        getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
        /** Compute (quickly) which actions are available here */
        getAvailableActions(context: RefactorContext): ApplicableRefactorInfo[] | undefined;
    }
    interface RefactorContext extends textChanges.TextChangesContext {
        file: SourceFile;
        startPosition: number;
        endPosition?: number;
        program: Program;
        cancellationToken?: CancellationToken;
        preferences: UserPreferences;
    }
    namespace refactor {
        /** @param name An unique code associated with each refactor. Does not have to be human-readable. */
        function registerRefactor(name: string, refactor: Refactor): void;
        function getApplicableRefactors(context: RefactorContext): ApplicableRefactorInfo[];
        function getEditsForRefactor(context: RefactorContext, refactorName: string, actionName: string): RefactorEditInfo | undefined;
    }
    function getRefactorContextSpan({ startPosition, endPosition }: RefactorContext): TextSpan;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
    type DeclarationWithType = FunctionLikeDeclaration | VariableDeclaration | PropertySignature | PropertyDeclaration;
    function parameterShouldGetTypeFromJSDoc(node: Node): node is DeclarationWithType;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
    const importFixId = "fixMissingImport";
    function getImportCompletionAction(exportedSymbol: Symbol, moduleSymbol: Symbol, sourceFile: SourceFile, symbolName: string, host: LanguageServiceHost, program: Program, formatContext: formatting.FormatContext, position: number, preferences: UserPreferences): {
        readonly moduleSpecifier: string;
        readonly codeAction: CodeAction;
    };
    function forEachExternalModuleToImportFrom(checker: TypeChecker, from: SourceFile, allSourceFiles: ReadonlyArray<SourceFile>, cb: (module: Symbol) => void): void;
    function moduleSymbolToValidIdentifier(moduleSymbol: Symbol, target: ScriptTarget): string;
    function moduleSpecifierToValidIdentifier(moduleSpecifier: string, target: ScriptTarget): string;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
    /**
     * Finds members of the resolved type that are missing in the class pointed to by class decl
     * and generates source code for the missing members.
     * @param possiblyMissingSymbols The collection of symbols to filter and then get insertions for.
     * @returns Empty string iff there are no member insertions.
     */
    function createMissingMemberNodes(classDeclaration: ClassLikeDeclaration, possiblyMissingSymbols: ReadonlyArray<Symbol>, checker: TypeChecker, preferences: UserPreferences, out: (node: ClassElement) => void): void;
    function createMethodFromCallExpression(context: CodeFixContextBase, call: CallExpression, methodName: string, inJs: boolean, makeStatic: boolean, preferences: UserPreferences, body: boolean): MethodDeclaration;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts {
    function generateTypesForModule(name: string, moduleValue: unknown, formatSettings: FormatCodeSettings): string;
    function valueInfoToDeclarationFileText(valueInfo: ValueInfo, formatSettings: FormatCodeSettings): string;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.extractSymbol {
    /**
     * Compute the associated code actions
     * Exported for tests.
     */
    function getAvailableActions(context: RefactorContext): ApplicableRefactorInfo[] | undefined;
    function getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
    namespace Messages {
        const cannotExtractRange: DiagnosticMessage;
        const cannotExtractImport: DiagnosticMessage;
        const cannotExtractSuper: DiagnosticMessage;
        const cannotExtractEmpty: DiagnosticMessage;
        const expressionExpected: DiagnosticMessage;
        const uselessConstantType: DiagnosticMessage;
        const statementOrExpressionExpected: DiagnosticMessage;
        const cannotExtractRangeContainingConditionalBreakOrContinueStatements: DiagnosticMessage;
        const cannotExtractRangeContainingConditionalReturnStatement: DiagnosticMessage;
        const cannotExtractRangeContainingLabeledBreakOrContinueStatementWithTargetOutsideOfTheRange: DiagnosticMessage;
        const cannotExtractRangeThatContainsWritesToReferencesLocatedOutsideOfTheTargetRangeInGenerators: DiagnosticMessage;
        const typeWillNotBeVisibleInTheNewScope: DiagnosticMessage;
        const functionWillNotBeVisibleInTheNewScope: DiagnosticMessage;
        const cannotExtractIdentifier: DiagnosticMessage;
        const cannotExtractExportedEntity: DiagnosticMessage;
        const cannotWriteInExpression: DiagnosticMessage;
        const cannotExtractReadonlyPropertyInitializerOutsideConstructor: DiagnosticMessage;
        const cannotExtractAmbientBlock: DiagnosticMessage;
        const cannotAccessVariablesFromNestedScopes: DiagnosticMessage;
        const cannotExtractToOtherFunctionLike: DiagnosticMessage;
        const cannotExtractToJSClass: DiagnosticMessage;
        const cannotExtractToExpressionArrowFunction: DiagnosticMessage;
    }
    enum RangeFacts {
        None = 0,
        HasReturn = 1,
        IsGenerator = 2,
        IsAsyncFunction = 4,
        UsesThis = 8,
        /**
         * The range is in a function which needs the 'static' modifier in a class
         */
        InStaticRegion = 16
    }
    /**
     * Represents an expression or a list of statements that should be extracted with some extra information
     */
    interface TargetRange {
        readonly range: Expression | Statement[];
        readonly facts: RangeFacts;
        /**
         * A list of symbols that are declared in the selected range which are visible in the containing lexical scope
         * Used to ensure we don't turn something used outside the range free (or worse, resolve to a different entity).
         */
        readonly declarations: Symbol[];
    }
    /**
     * Result of 'getRangeToExtract' operation: contains either a range or a list of errors
     */
    type RangeToExtract = {
        readonly targetRange?: never;
        readonly errors: ReadonlyArray<Diagnostic>;
    } | {
        readonly targetRange: TargetRange;
        readonly errors?: never;
    };
    /**
     * getRangeToExtract takes a span inside a text file and returns either an expression or an array
     * of statements representing the minimum set of nodes needed to extract the entire span. This
     * process may fail, in which case a set of errors is returned instead (these are currently
     * not shown to the user, but can be used by us diagnostically)
     */
    function getRangeToExtract(sourceFile: SourceFile, span: TextSpan): RangeToExtract;
}
declare namespace ts.refactor.generateGetAccessorAndSetAccessor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.addOrRemoveBracesToArrowFunction {
}
declare namespace ts {
    /** The version of the language service API */
    const servicesVersion = "0.8";
    interface DisplayPartsSymbolWriter extends EmitTextWriter {
        displayParts(): SymbolDisplayPart[];
    }
    function toEditorSettings(options: FormatCodeOptions | FormatCodeSettings): FormatCodeSettings;
    function toEditorSettings(options: EditorOptions | EditorSettings): EditorSettings;
    function displayPartsToString(displayParts: SymbolDisplayPart[] | undefined): string;
    function getDefaultCompilerOptions(): CompilerOptions;
    function getSupportedCodeFixes(): string[];
    function createLanguageServiceSourceFile(fileName: string, scriptSnapshot: IScriptSnapshot, scriptTarget: ScriptTarget, version: string, setNodeParents: boolean, scriptKind?: ScriptKind): SourceFile;
    let disableIncrementalParsing: boolean;
    function updateLanguageServiceSourceFile(sourceFile: SourceFile, scriptSnapshot: IScriptSnapshot, version: string, textChangeRange: TextChangeRange | undefined, aggressiveChecks?: boolean): SourceFile;
    /** A cancellation that throttles calls to the host */
    class ThrottledCancellationToken implements CancellationToken {
        private hostCancellationToken;
        private readonly throttleWaitMilliseconds;
        private lastCancellationCheckTime;
        constructor(hostCancellationToken: HostCancellationToken, throttleWaitMilliseconds?: number);
        isCancellationRequested(): boolean;
        throwIfCancellationRequested(): void;
    }
    function createLanguageService(host: LanguageServiceHost, documentRegistry?: DocumentRegistry, syntaxOnly?: boolean): LanguageService;
    /** Names in the name table are escaped, so an identifier `__foo` will have a name table entry `___foo`. */
    function getNameTable(sourceFile: SourceFile): UnderscoreEscapedMap<number>;
    /**
     * Returns the containing object literal property declaration given a possible name node, e.g. "a" in x = { "a": 1 }
     */
    function getContainingObjectLiteralElement(node: Node): ObjectLiteralElementWithName | undefined;
    type ObjectLiteralElementWithName = ObjectLiteralElement & {
        name: PropertyName;
        parent: ObjectLiteralExpression | JsxAttributes;
    };
    /** Gets all symbols for one property. Does not get symbols for every property. */
    function getPropertySymbolsFromContextualType(node: ObjectLiteralElementWithName, checker: TypeChecker, contextualType: Type, unionSymbolOk: boolean): ReadonlyArray<Symbol>;
    /**
     * Get the path of the default library files (lib.d.ts) as distributed with the typescript
     * node package.
     * The functionality is not supported if the ts module is consumed outside of a node module.
     */
    function getDefaultLibFilePath(options: CompilerOptions): string;
}
declare namespace ts.BreakpointResolver {
    /**
     * Get the breakpoint span in given sourceFile
     */
    function spanInSourceFileAtLocation(sourceFile: SourceFile, position: number): TextSpan | undefined;
}
declare namespace ts {
    /**
     * Transform one or more nodes using the supplied transformers.
     * @param source A single `Node` or an array of `Node` objects.
     * @param transformers An array of `TransformerFactory` callbacks used to process the transformation.
     * @param compilerOptions Optional compiler options.
     */
    function transform<T extends Node>(source: T | T[], transformers: TransformerFactory<T>[], compilerOptions?: CompilerOptions): TransformationResult<T>;
}
declare let debugObjectHost: {
    CollectGarbage(): void;
};
declare namespace ts {
    interface ScriptSnapshotShim {
        /** Gets a portion of the script snapshot specified by [start, end). */
        getText(start: number, end: number): string;
        /** Gets the length of this script snapshot. */
        getLength(): number;
        /**
         * Returns a JSON-encoded value of the type:
         *   { span: { start: number; length: number }; newLength: number }
         *
         * Or undefined value if there was no change.
         */
        getChangeRange(oldSnapshot: ScriptSnapshotShim): string | undefined;
        /** Releases all resources held by this script snapshot */
        dispose?(): void;
    }
    interface Logger {
        log(s: string): void;
        trace(s: string): void;
        error(s: string): void;
    }
    /** Public interface of the host of a language service shim instance. */
    interface LanguageServiceShimHost extends Logger {
        getCompilationSettings(): string;
        /** Returns a JSON-encoded value of the type: string[] */
        getScriptFileNames(): string;
        getScriptKind?(fileName: string): ScriptKind;
        getScriptVersion(fileName: string): string;
        getScriptSnapshot(fileName: string): ScriptSnapshotShim;
        getLocalizedDiagnosticMessages(): string;
        getCancellationToken(): HostCancellationToken;
        getCurrentDirectory(): string;
        getDirectories(path: string): string;
        getDefaultLibFileName(options: string): string;
        getNewLine?(): string;
        getProjectVersion?(): string;
        useCaseSensitiveFileNames?(): boolean;
        getTypeRootsVersion?(): number;
        readDirectory(rootDir: string, extension: string, basePaths?: string, excludeEx?: string, includeFileEx?: string, includeDirEx?: string, depth?: number): string;
        readFile(path: string, encoding?: string): string | undefined;
        fileExists(path: string): boolean;
        getModuleResolutionsForFile?(fileName: string): string;
        getTypeReferenceDirectiveResolutionsForFile?(fileName: string): string;
        directoryExists(directoryName: string): boolean;
    }
    /** Public interface of the core-services host instance used in managed side */
    interface CoreServicesShimHost extends Logger {
        directoryExists(directoryName: string): boolean;
        fileExists(fileName: string): boolean;
        getCurrentDirectory(): string;
        getDirectories(path: string): string;
        /**
         * Returns a JSON-encoded value of the type: string[]
         *
         * @param exclude A JSON encoded string[] containing the paths to exclude
         *  when enumerating the directory.
         */
        readDirectory(rootDir: string, extension: string, basePaths?: string, excludeEx?: string, includeFileEx?: string, includeDirEx?: string, depth?: number): string;
        /**
         * Read arbitrary text files on disk, i.e. when resolution procedure needs the content of 'package.json' to determine location of bundled typings for node modules
         */
        readFile(fileName: string): string | undefined;
        realpath?(path: string): string;
        trace(s: string): void;
        useCaseSensitiveFileNames?(): boolean;
    }
    interface ShimsFileReference {
        path: string;
        position: number;
        length: number;
    }
    /** Public interface of a language service instance shim. */
    interface ShimFactory {
        registerShim(shim: Shim): void;
        unregisterShim(shim: Shim): void;
    }
    interface Shim {
        dispose(_dummy: {}): void;
    }
    interface LanguageServiceShim extends Shim {
        languageService: LanguageService;
        dispose(_dummy: {}): void;
        refresh(throwOnError: boolean): void;
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): string;
        getSemanticDiagnostics(fileName: string): string;
        getSuggestionDiagnostics(fileName: string): string;
        getCompilerOptionsDiagnostics(): string;
        getSyntacticClassifications(fileName: string, start: number, length: number): string;
        getSemanticClassifications(fileName: string, start: number, length: number): string;
        getEncodedSyntacticClassifications(fileName: string, start: number, length: number): string;
        getEncodedSemanticClassifications(fileName: string, start: number, length: number): string;
        getCompletionsAtPosition(fileName: string, position: number, preferences: UserPreferences | undefined): string;
        getCompletionEntryDetails(fileName: string, position: number, entryName: string, formatOptions: string | undefined, source: string | undefined, preferences: UserPreferences | undefined): string;
        getQuickInfoAtPosition(fileName: string, position: number): string;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): string;
        getBreakpointStatementAtPosition(fileName: string, position: number): string;
        getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { canRename: boolean, localizedErrorMessage: string, displayName: string, fullDisplayName: string, kind: string, kindModifiers: string, triggerSpan: { start; length } }
         */
        getRenameInfo(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string, textSpan: { start: number, length: number } }[]
         */
        findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string; textSpan: { start: number; length: number}; kind: string; name: string; containerKind: string; containerName: string }
         *
         * Or undefined value if no definition can be found.
         */
        getDefinitionAtPosition(fileName: string, position: number): string;
        getDefinitionAndBoundSpan(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string; textSpan: { start: number; length: number}; kind: string; name: string; containerKind: string; containerName: string }
         *
         * Or undefined value if no definition can be found.
         */
        getTypeDefinitionAtPosition(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string; textSpan: { start: number; length: number}; }[]
         */
        getImplementationAtPosition(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string; textSpan: { start: number; length: number}; isWriteAccess: boolean, isDefinition?: boolean }[]
         */
        getReferencesAtPosition(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { definition: <encoded>; references: <encoded>[] }[]
         */
        findReferences(fileName: string, position: number): string;
        /**
         * @deprecated
         * Returns a JSON-encoded value of the type:
         * { fileName: string; textSpan: { start: number; length: number}; isWriteAccess: boolean }[]
         */
        getOccurrencesAtPosition(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string; highlights: { start: number; length: number, isDefinition: boolean }[] }[]
         *
         * @param fileToSearch A JSON encoded string[] containing the file names that should be
         *  considered when searching.
         */
        getDocumentHighlights(fileName: string, position: number, filesToSearch: string): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { name: string; kind: string; kindModifiers: string; containerName: string; containerKind: string; matchKind: string; fileName: string; textSpan: { start: number; length: number}; } [] = [];
         */
        getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { text: string; kind: string; kindModifiers: string; bolded: boolean; grayed: boolean; indent: number; spans: { start: number; length: number; }[]; childItems: <recursive use of this type>[] } [] = [];
         */
        getNavigationBarItems(fileName: string): string;
        /** Returns a JSON-encoded value of the type ts.NavigationTree. */
        getNavigationTree(fileName: string): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { textSpan: { start: number, length: number }; hintSpan: { start: number, length: number }; bannerText: string; autoCollapse: boolean } [] = [];
         */
        getOutliningSpans(fileName: string): string;
        getTodoComments(fileName: string, todoCommentDescriptors: string): string;
        getBraceMatchingAtPosition(fileName: string, position: number): string;
        getIndentationAtPosition(fileName: string, position: number, options: string): string;
        getFormattingEditsForRange(fileName: string, start: number, end: number, options: string): string;
        getFormattingEditsForDocument(fileName: string, options: string): string;
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: string): string;
        /**
         * Returns JSON-encoded value of the type TextInsertion.
         */
        getDocCommentTemplateAtPosition(fileName: string, position: number): string;
        /**
         * Returns JSON-encoded boolean to indicate whether we should support brace location
         * at the current position.
         * E.g. we don't want brace completion inside string-literals, comments, etc.
         */
        isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): string;
        /**
         * Returns a JSON-encoded TextSpan | undefined indicating the range of the enclosing comment, if it exists.
         */
        getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): string;
        getEmitOutput(fileName: string): string;
        getEmitOutputObject(fileName: string): EmitOutput;
    }
    interface ClassifierShim extends Shim {
        getEncodedLexicalClassifications(text: string, lexState: EndOfLineState, syntacticClassifierAbsent?: boolean): string;
        getClassificationsForLine(text: string, lexState: EndOfLineState, syntacticClassifierAbsent?: boolean): string;
    }
    interface CoreServicesShim extends Shim {
        getAutomaticTypeDirectiveNames(compilerOptionsJson: string): string;
        getPreProcessedFileInfo(fileName: string, sourceText: IScriptSnapshot): string;
        getTSConfigFileInfo(fileName: string, sourceText: IScriptSnapshot): string;
        getDefaultCompilationSettings(): string;
        discoverTypings(discoverTypingsJson: string): string;
    }
    class LanguageServiceShimHostAdapter implements LanguageServiceHost {
        private shimHost;
        private loggingEnabled;
        private tracingEnabled;
        resolveModuleNames: (moduleName: string[], containingFile: string) => ResolvedModuleFull[];
        resolveTypeReferenceDirectives: (typeDirectiveNames: string[], containingFile: string) => ResolvedTypeReferenceDirective[];
        directoryExists: (directoryName: string) => boolean;
        constructor(shimHost: LanguageServiceShimHost);
        log(s: string): void;
        trace(s: string): void;
        error(s: string): void;
        getProjectVersion(): string;
        getTypeRootsVersion(): number;
        useCaseSensitiveFileNames(): boolean;
        getCompilationSettings(): CompilerOptions;
        getScriptFileNames(): string[];
        getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
        getScriptKind(fileName: string): ScriptKind;
        getScriptVersion(fileName: string): string;
        getLocalizedDiagnosticMessages(): any;
        getCancellationToken(): HostCancellationToken;
        getCurrentDirectory(): string;
        getDirectories(path: string): string[];
        getDefaultLibFileName(options: CompilerOptions): string;
        readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: string[], include?: string[], depth?: number): string[];
        readFile(path: string, encoding?: string): string | undefined;
        fileExists(path: string): boolean;
    }
    class CoreServicesShimHostAdapter implements ParseConfigHost, ModuleResolutionHost, JsTyping.TypingResolutionHost {
        private shimHost;
        directoryExists: (directoryName: string) => boolean;
        realpath: (path: string) => string;
        useCaseSensitiveFileNames: boolean;
        constructor(shimHost: CoreServicesShimHost);
        readDirectory(rootDir: string, extensions: ReadonlyArray<string>, exclude: ReadonlyArray<string>, include: ReadonlyArray<string>, depth?: number): string[];
        fileExists(fileName: string): boolean;
        readFile(fileName: string): string | undefined;
        getDirectories(path: string): string[];
    }
    interface RealizedDiagnostic {
        message: string;
        start: number;
        length: number;
        category: string;
        code: number;
        reportsUnnecessary?: {};
    }
    function realizeDiagnostics(diagnostics: ReadonlyArray<Diagnostic>, newLine: string): RealizedDiagnostic[];
    class TypeScriptServicesFactory implements ShimFactory {
        private _shims;
        private documentRegistry;
        getServicesVersion(): string;
        createLanguageServiceShim(host: LanguageServiceShimHost): LanguageServiceShim;
        createClassifierShim(logger: Logger): ClassifierShim;
        createCoreServicesShim(host: CoreServicesShimHost): CoreServicesShim;
        close(): void;
        registerShim(shim: Shim): void;
        unregisterShim(shim: Shim): void;
    }
}
declare namespace TypeScript.Services {
    const TypeScriptServicesFactory: typeof ts.TypeScriptServicesFactory;
}
declare const toolsVersion = "3.1";
//# sourceMappingURL=services.d.ts.map