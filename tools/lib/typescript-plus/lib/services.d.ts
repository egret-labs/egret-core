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
        getFirstToken(sourceFile?: SourceFileLike): Node | undefined;
        getLastToken(sourceFile?: SourceFile): Node | undefined;
        getLastToken(sourceFile?: SourceFileLike): Node | undefined;
        forEachChild<T>(cbNode: (node: Node) => T | undefined, cbNodeArray?: (nodes: NodeArray<Node>) => T | undefined): T | undefined;
    }
    interface Identifier {
        readonly text: string;
    }
    interface PrivateIdentifier {
        readonly text: string;
    }
    interface Symbol {
        readonly name: string;
        getFlags(): SymbolFlags;
        getEscapedName(): __String;
        getName(): string;
        getDeclarations(): Declaration[] | undefined;
        getDocumentationComment(typeChecker: TypeChecker | undefined): SymbolDisplayPart[];
        getContextualDocumentationComment(context: Node | undefined, checker: TypeChecker | undefined): SymbolDisplayPart[];
        getJsDocTags(): JSDocTagInfo[];
    }
    interface Type {
        getFlags(): TypeFlags;
        getSymbol(): Symbol | undefined;
        getProperties(): Symbol[];
        getProperty(propertyName: string): Symbol | undefined;
        getApparentProperties(): Symbol[];
        getCallSignatures(): readonly Signature[];
        getConstructSignatures(): readonly Signature[];
        getStringIndexType(): Type | undefined;
        getNumberIndexType(): Type | undefined;
        getBaseTypes(): BaseType[] | undefined;
        getNonNullableType(): Type;
        getNonOptionalType(): Type;
        isNullableType(): boolean;
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
    interface TypeReference {
        typeArguments?: readonly Type[];
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
        getNamedDeclarations(): ESMap<string, readonly Declaration[]>;
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
        getLineEndOfPosition(pos: number): number;
        getLineStarts(): readonly number[];
        getPositionOfLineAndCharacter(line: number, character: number): number;
        update(newText: string, textChangeRange: TextChangeRange): SourceFile;
        sourceMapper?: DocumentPositionMapper;
    }
    interface SourceFileLike {
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
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
    const enum PackageJsonDependencyGroup {
        Dependencies = 1,
        DevDependencies = 2,
        PeerDependencies = 4,
        OptionalDependencies = 8,
        All = 15
    }
    interface PackageJsonInfo {
        fileName: string;
        parseable: boolean;
        dependencies?: ESMap<string, string>;
        devDependencies?: ESMap<string, string>;
        peerDependencies?: ESMap<string, string>;
        optionalDependencies?: ESMap<string, string>;
        get(dependencyName: string, inGroups?: PackageJsonDependencyGroup): string | undefined;
        has(dependencyName: string, inGroups?: PackageJsonDependencyGroup): boolean;
    }
    interface FormattingHost {
        getNewLine?(): string;
    }
    const enum PackageJsonAutoImportPreference {
        Off = 0,
        On = 1,
        Auto = 2
    }
    interface PerformanceEvent {
        kind: "UpdateGraph" | "CreatePackageJsonAutoImportProvider";
        durationMs: number;
    }
    enum LanguageServiceMode {
        Semantic = 0,
        PartialSemantic = 1,
        Syntactic = 2
    }
    interface LanguageServiceHost extends GetEffectiveTypeRootsHost {
        getCompilationSettings(): CompilerOptions;
        getNewLine?(): string;
        getProjectVersion?(): string;
        getScriptFileNames(): string[];
        getScriptKind?(fileName: string): ScriptKind;
        getScriptVersion(fileName: string): string;
        getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
        getProjectReferences?(): readonly ProjectReference[] | undefined;
        getLocalizedDiagnosticMessages?(): any;
        getCancellationToken?(): HostCancellationToken;
        getCurrentDirectory(): string;
        getDefaultLibFileName(options: CompilerOptions): string;
        log?(s: string): void;
        trace?(s: string): void;
        error?(s: string): void;
        useCaseSensitiveFileNames?(): boolean;
        readDirectory?(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
        readFile?(path: string, encoding?: string): string | undefined;
        realpath?(path: string): string;
        fileExists?(path: string): boolean;
        getTypeRootsVersion?(): number;
        resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
        getResolvedModuleWithFailedLookupLocationsFromCache?(modulename: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
        resolveTypeReferenceDirectives?(typeDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
        hasInvalidatedResolution?: HasInvalidatedResolution;
        hasChangedAutomaticTypeDirectiveNames?: HasChangedAutomaticTypeDirectiveNames;
        getGlobalTypingsCacheLocation?(): string | undefined;
        getSymlinkCache?(files?: readonly SourceFile[]): SymlinkCache;
        getDirectories?(directoryName: string): string[];
        /**
         * Gets a set of custom transformers to use during emit.
         */
        getCustomTransformers?(): CustomTransformers | undefined;
        isKnownTypesPackageName?(name: string): boolean;
        installPackage?(options: InstallPackageOptions): Promise<ApplyCodeActionCommandResult>;
        writeFile?(fileName: string, content: string): void;
        getDocumentPositionMapper?(generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
        getSourceFileLike?(fileName: string): SourceFileLike | undefined;
        getPackageJsonsVisibleToFile?(fileName: string, rootDir?: string): readonly PackageJsonInfo[];
        getPackageJsonsForAutoImport?(rootDir?: string): readonly PackageJsonInfo[];
        getImportSuggestionsCache?(): Completions.ImportSuggestionsForFileCache;
        setCompilerHost?(host: CompilerHost): void;
        useSourceOfProjectReferenceRedirect?(): boolean;
        getPackageJsonAutoImportProvider?(): Program | undefined;
        sendPerformanceEvent?(kind: PerformanceEvent["kind"], durationMs: number): void;
    }
    const emptyOptions: {};
    type WithMetadata<T> = T & {
        metadata?: unknown;
    };
    interface LanguageService {
        /** This is used as a part of restarting the language service. */
        cleanupSemanticCache(): void;
        /**
         * Gets errors indicating invalid syntax in a file.
         *
         * In English, "this cdeo have, erorrs" is syntactically invalid because it has typos,
         * grammatical errors, and misplaced punctuation. Likewise, examples of syntax
         * errors in TypeScript are missing parentheses in an `if` statement, mismatched
         * curly braces, and using a reserved keyword as a variable name.
         *
         * These diagnostics are inexpensive to compute and don't require knowledge of
         * other files. Note that a non-empty result increases the likelihood of false positives
         * from `getSemanticDiagnostics`.
         *
         * While these represent the majority of syntax-related diagnostics, there are some
         * that require the type system, which will be present in `getSemanticDiagnostics`.
         *
         * @param fileName A path to the file you want syntactic diagnostics for
         */
        getSyntacticDiagnostics(fileName: string): DiagnosticWithLocation[];
        /**
         * Gets warnings or errors indicating type system issues in a given file.
         * Requesting semantic diagnostics may start up the type system and
         * run deferred work, so the first call may take longer than subsequent calls.
         *
         * Unlike the other get*Diagnostics functions, these diagnostics can potentially not
         * include a reference to a source file. Specifically, the first time this is called,
         * it will return global diagnostics with no associated location.
         *
         * To contrast the differences between semantic and syntactic diagnostics, consider the
         * sentence: "The sun is green." is syntactically correct; those are real English words with
         * correct sentence structure. However, it is semantically invalid, because it is not true.
         *
         * @param fileName A path to the file you want semantic diagnostics for
         */
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        /**
         * Gets suggestion diagnostics for a specific file. These diagnostics tend to
         * proactively suggest refactors, as opposed to diagnostics that indicate
         * potentially incorrect runtime behavior.
         *
         * @param fileName A path to the file you want semantic diagnostics for
         */
        getSuggestionDiagnostics(fileName: string): DiagnosticWithLocation[];
        /**
         * Gets global diagnostics related to the program configuration and compiler options.
         */
        getCompilerOptionsDiagnostics(): Diagnostic[];
        /** @deprecated Use getEncodedSyntacticClassifications instead. */
        getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        /** @deprecated Use getEncodedSemanticClassifications instead. */
        getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        getEncodedSyntacticClassifications(fileName: string, span: TextSpan): Classifications;
        getEncodedSemanticClassifications(fileName: string, span: TextSpan): Classifications;
        /**
         * Gets completion entries at a particular position in a file.
         *
         * @param fileName The path to the file
         * @param position A zero-based index of the character where you want the entries
         * @param options An object describing how the request was triggered and what kinds
         * of code actions can be returned with the completions.
         */
        getCompletionsAtPosition(fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): WithMetadata<CompletionInfo> | undefined;
        /**
         * Gets the extended details for a completion entry retrieved from `getCompletionsAtPosition`.
         *
         * @param fileName The path to the file
         * @param position A zero based index of the character where you want the entries
         * @param entryName The name from an existing completion which came from `getCompletionsAtPosition`
         * @param formatOptions How should code samples in the completions be formatted, can be undefined for backwards compatibility
         * @param source Source code for the current file, can be undefined for backwards compatibility
         * @param preferences User settings, can be undefined for backwards compatibility
         */
        getCompletionEntryDetails(fileName: string, position: number, entryName: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined;
        getCompletionEntrySymbol(fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined;
        /**
         * Gets semantic information about the identifier at a particular position in a
         * file. Quick info is what you typically see when you hover in an editor.
         *
         * @param fileName The path to the file
         * @param position A zero-based index of the character where you want the quick info
         */
        getQuickInfoAtPosition(fileName: string, position: number): QuickInfo | undefined;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan | undefined;
        getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan | undefined;
        getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): SignatureHelpItems | undefined;
        getRenameInfo(fileName: string, position: number, options?: RenameInfoOptions): RenameInfo;
        findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean): readonly RenameLocation[] | undefined;
        getSmartSelectionRange(fileName: string, position: number): SelectionRange;
        getDefinitionAtPosition(fileName: string, position: number): readonly DefinitionInfo[] | undefined;
        getDefinitionAndBoundSpan(fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined;
        getTypeDefinitionAtPosition(fileName: string, position: number): readonly DefinitionInfo[] | undefined;
        getImplementationAtPosition(fileName: string, position: number): readonly ImplementationLocation[] | undefined;
        getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined;
        findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined;
        getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined;
        /** @deprecated */
        getOccurrencesAtPosition(fileName: string, position: number): readonly ReferenceEntry[] | undefined;
        getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string, excludeDtsFiles?: boolean): NavigateToItem[];
        getNavigationBarItems(fileName: string): NavigationBarItem[];
        getNavigationTree(fileName: string): NavigationTree;
        prepareCallHierarchy(fileName: string, position: number): CallHierarchyItem | CallHierarchyItem[] | undefined;
        provideCallHierarchyIncomingCalls(fileName: string, position: number): CallHierarchyIncomingCall[];
        provideCallHierarchyOutgoingCalls(fileName: string, position: number): CallHierarchyOutgoingCall[];
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
        /** @internal */
        clearSourceMapperCache(): void;
        getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: readonly number[], formatOptions: FormatCodeSettings, preferences: UserPreferences): readonly CodeFixAction[];
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
        getApplicableRefactors(fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined, triggerReason?: RefactorTriggerReason): ApplicableRefactorInfo[];
        getEditsForRefactor(fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined;
        organizeImports(scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): readonly FileTextChanges[];
        getEditsForFileRename(oldFilePath: string, newFilePath: string, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): readonly FileTextChanges[];
        getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean, forceDtsEmit?: boolean): EmitOutput;
        getProgram(): Program | undefined;
        getNonBoundSourceFile(fileName: string): SourceFile;
        getAutoImportProvider(): Program | undefined;
        toggleLineComment(fileName: string, textRange: TextRange): TextChange[];
        toggleMultilineComment(fileName: string, textRange: TextRange): TextChange[];
        commentSelection(fileName: string, textRange: TextRange): TextChange[];
        uncommentSelection(fileName: string, textRange: TextRange): TextChange[];
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
    type CompletionsTriggerCharacter = "." | '"' | "'" | "`" | "/" | "@" | "<" | "#";
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
    interface CallHierarchyItem {
        name: string;
        kind: ScriptElementKind;
        kindModifiers?: string;
        file: string;
        span: TextSpan;
        selectionSpan: TextSpan;
        containerName?: string;
    }
    interface CallHierarchyIncomingCall {
        from: CallHierarchyItem;
        fromSpans: TextSpan[];
    }
    interface CallHierarchyOutgoingCall {
        to: CallHierarchyItem;
        fromSpans: TextSpan[];
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
    interface TextChange {
        span: TextSpan;
        newText: string;
    }
    interface FileTextChanges {
        fileName: string;
        textChanges: readonly TextChange[];
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
        changes: readonly FileTextChanges[];
        commands?: readonly CodeActionCommand[];
    }
    type CodeActionCommand = InstallPackageAction;
    interface InstallPackageAction {
        readonly type: "install package";
        readonly file: string;
        readonly packageName: string;
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
        /**
         * A message to show to the user if the refactoring cannot be applied in
         * the current context.
         */
        notApplicableReason?: string;
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
    type RefactorTriggerReason = "implicit" | "invoked";
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
        /**
         * If DocumentSpan.textSpan is the span for name of the declaration,
         * then this is the span for relevant declaration
         */
        contextSpan?: TextSpan;
        originalContextSpan?: TextSpan;
    }
    interface RenameLocation extends DocumentSpan {
        readonly prefixText?: string;
        readonly suffixText?: string;
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
        contextSpan?: TextSpan;
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
    enum SemicolonPreference {
        Ignore = "ignore",
        Insert = "insert",
        Remove = "remove"
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
        trimTrailingWhitespace?: boolean;
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
        readonly insertSpaceAfterCommaDelimiter?: boolean;
        readonly insertSpaceAfterSemicolonInForStatements?: boolean;
        readonly insertSpaceBeforeAndAfterBinaryOperators?: boolean;
        readonly insertSpaceAfterConstructor?: boolean;
        readonly insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
        readonly insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingEmptyBraces?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
        readonly insertSpaceAfterTypeAssertion?: boolean;
        readonly insertSpaceBeforeFunctionParenthesis?: boolean;
        readonly placeOpenBraceOnNewLineForFunctions?: boolean;
        readonly placeOpenBraceOnNewLineForControlBlocks?: boolean;
        readonly insertSpaceBeforeTypeAnnotation?: boolean;
        readonly indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean;
        readonly semicolons?: SemicolonPreference;
    }
    function getDefaultFormatCodeSettings(newLineCharacter?: string): FormatCodeSettings;
    const testFormatSettings: FormatCodeSettings;
    interface DefinitionInfo extends DocumentSpan {
        kind: ScriptElementKind;
        name: string;
        containerKind: ScriptElementKind;
        containerName: string;
        isLocal?: boolean;
    }
    interface DefinitionInfoAndBoundSpan {
        definitions?: readonly DefinitionInfo[];
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
    type RenameInfo = RenameInfoSuccess | RenameInfoFailure;
    interface RenameInfoSuccess {
        canRename: true;
        /**
         * File or directory to rename.
         * If set, `getEditsForFileRename` should be called instead of `findRenameLocations`.
         */
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
    interface RenameInfoOptions {
        readonly allowRenameOfImportPath?: boolean;
    }
    interface SignatureHelpParameter {
        name: string;
        documentation: SymbolDisplayPart[];
        displayParts: SymbolDisplayPart[];
        isOptional: boolean;
    }
    interface SelectionRange {
        textSpan: TextSpan;
        parent?: SelectionRange;
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
        /** Not true for all global completions. This will be true if the enclosing scope matches a few syntax kinds. See `isSnippetScope`. */
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
        isFromUncheckedFile?: true;
        isPackageJsonImport?: true;
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
        BigIntLiteral = 7,
        StringLiteral = 8,
        RegExpLiteral = 9
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
        optionalModifier = "optional",
        deprecatedModifier = "deprecated",
        dtsModifier = ".d.ts",
        tsModifier = ".ts",
        tsxModifier = ".tsx",
        jsModifier = ".js",
        jsxModifier = ".jsx",
        jsonModifier = ".json"
    }
    const enum ClassificationTypeNames {
        comment = "comment",
        identifier = "identifier",
        keyword = "keyword",
        numericLiteral = "number",
        bigintLiteral = "bigint",
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
        jsxAttributeStringLiteralValue = 24,
        bigintLiteral = 25
    }
    /** @internal */
    interface CodeFixRegistration {
        errorCodes: readonly number[];
        getCodeActions(context: CodeFixContext): CodeFixAction[] | undefined;
        fixIds?: readonly string[];
        getAllCodeActions?(context: CodeFixAllContext): CombinedCodeActions;
    }
    /** @internal */
    interface CodeFixContextBase extends textChanges.TextChangesContext {
        sourceFile: SourceFile;
        program: Program;
        cancellationToken: CancellationToken;
        preferences: UserPreferences;
    }
    /** @internal */
    interface CodeFixAllContext extends CodeFixContextBase {
        fixId: {};
    }
    /** @internal */
    interface CodeFixContext extends CodeFixContextBase {
        errorCode: number;
        span: TextSpan;
    }
    /** @internal */
    interface Refactor {
        /** Compute the associated code actions */
        getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
        /** Compute (quickly) which actions are available here */
        getAvailableActions(context: RefactorContext): readonly ApplicableRefactorInfo[];
    }
    /** @internal */
    interface RefactorContext extends textChanges.TextChangesContext {
        file: SourceFile;
        startPosition: number;
        endPosition?: number;
        program: Program;
        cancellationToken?: CancellationToken;
        preferences: UserPreferences;
        triggerReason?: RefactorTriggerReason;
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
    function isCallExpressionTarget(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function isNewExpressionTarget(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function isCallOrNewExpressionTarget(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function isTaggedTemplateTag(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function isDecoratorTarget(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function isJsxOpeningLikeElementTagName(node: Node, includeElementAccess?: boolean, skipPastOuterExpressions?: boolean): boolean;
    function climbPastPropertyAccess(node: Node): Node;
    function climbPastPropertyOrElementAccess(node: Node): Node;
    function getTargetLabel(referenceNode: Node, labelName: string): Identifier | undefined;
    function hasPropertyAccessExpressionWithName(node: CallExpression, funcName: string): boolean;
    function isJumpStatementTarget(node: Node): node is Identifier & {
        parent: BreakOrContinueStatement;
    };
    function isLabelOfLabeledStatement(node: Node): node is Identifier;
    function isLabelName(node: Node): boolean;
    function isTagName(node: Node): boolean;
    function isRightSideOfQualifiedName(node: Node): boolean;
    function isRightSideOfPropertyAccess(node: Node): boolean;
    function isArgumentExpressionOfElementAccess(node: Node): boolean;
    function isNameOfModuleDeclaration(node: Node): boolean;
    function isNameOfFunctionDeclaration(node: Node): boolean;
    function isLiteralNameOfPropertyDeclarationOrIndexAccess(node: StringLiteral | NumericLiteral | NoSubstitutionTemplateLiteral): boolean;
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
     * Adjusts the location used for "find references" and "go to definition" when the cursor was not
     * on a property name.
     */
    function getAdjustedReferenceLocation(node: Node): Node;
    /**
     * Adjusts the location used for "rename" when the cursor was not on a property name.
     */
    function getAdjustedRenameLocation(node: Node): Node;
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
    function findNextToken(previousToken: Node, parent: Node, sourceFile: SourceFileLike): Node | undefined;
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
    function isInJSXText(sourceFile: SourceFile, position: number): boolean;
    function isInsideJsxElement(sourceFile: SourceFile, position: number): boolean;
    function findPrecedingMatchingToken(token: Node, matchingTokenKind: SyntaxKind, sourceFile: SourceFile): Node | undefined;
    function removeOptionality(type: Type, isOptionalExpression: boolean, isOptionalChain: boolean): Type;
    function isPossiblyTypeArgumentPosition(token: Node, sourceFile: SourceFile, checker: TypeChecker): boolean;
    function getPossibleGenericSignatures(called: Expression, typeArgumentCount: number, checker: TypeChecker): readonly Signature[];
    interface PossibleTypeArgumentInfo {
        readonly called: Identifier;
        readonly nTypeArguments: number;
    }
    interface PossibleProgramFileInfo {
        ProgramFiles?: string[];
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
    function getReplacementSpanForContextToken(contextToken: Node | undefined): TextSpan | undefined;
    function createTextSpanFromNode(node: Node, sourceFile?: SourceFile, endNode?: Node): TextSpan;
    function createTextSpanFromStringLiteralLikeContent(node: StringLiteralLike): TextSpan | undefined;
    function createTextRangeFromNode(node: Node, sourceFile: SourceFile): TextRange;
    function createTextSpanFromRange(range: TextRange): TextSpan;
    function createTextRangeFromSpan(span: TextSpan): TextRange;
    function createTextChangeFromStartLength(start: number, length: number, newText: string): TextChange;
    function createTextChange(span: TextSpan, newText: string): TextChange;
    const typeKeywords: readonly SyntaxKind[];
    function isTypeKeyword(kind: SyntaxKind): boolean;
    function isTypeKeywordToken(node: Node): node is Token<SyntaxKind.TypeKeyword>;
    /** True if the symbol is for an external module, as opposed to a namespace. */
    function isExternalModuleSymbol(moduleSymbol: Symbol): boolean;
    /** Returns `true` the first time it encounters a node and `false` afterwards. */
    type NodeSeenTracker<T = Node> = (node: T) => boolean;
    function nodeSeenTracker<T extends Node>(): NodeSeenTracker<T>;
    function getSnapshotText(snap: IScriptSnapshot): string;
    function repeatString(str: string, count: number): string;
    function skipConstraint(type: Type): Type;
    function getNameFromPropertyName(name: PropertyName): string | undefined;
    function programContainsModules(program: Program): boolean;
    function programContainsEs6Modules(program: Program): boolean;
    function compilerOptionsIndicateEs6Modules(compilerOptions: CompilerOptions): boolean;
    function createModuleSpecifierResolutionHost(program: Program, host: LanguageServiceHost): ModuleSpecifierResolutionHost;
    function getModuleSpecifierResolverHost(program: Program, host: LanguageServiceHost): SymbolTracker["moduleResolverHost"];
    function makeImportIfNecessary(defaultImport: Identifier | undefined, namedImports: readonly ImportSpecifier[] | undefined, moduleSpecifier: string, quotePreference: QuotePreference): ImportDeclaration | undefined;
    function makeImport(defaultImport: Identifier | undefined, namedImports: readonly ImportSpecifier[] | undefined, moduleSpecifier: string | Expression, quotePreference: QuotePreference, isTypeOnly?: boolean): ImportDeclaration;
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
    type ObjectBindingElementWithoutPropertyName = BindingElement & {
        name: Identifier;
    };
    function isObjectBindingElementWithoutPropertyName(bindingElement: Node): bindingElement is ObjectBindingElementWithoutPropertyName;
    function getPropertySymbolFromBindingElement(checker: TypeChecker, bindingElement: ObjectBindingElementWithoutPropertyName): Symbol | undefined;
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
    function insertImports(changes: textChanges.ChangeTracker, sourceFile: SourceFile, imports: AnyImportOrRequireStatement | readonly AnyImportOrRequireStatement[], blankLineBetween: boolean): void;
    function getTypeKeywordOfTypeOnlyImport(importClause: ImportClause, sourceFile: SourceFile): Token<SyntaxKind.TypeKeyword>;
    function textSpansEqual(a: TextSpan | undefined, b: TextSpan | undefined): boolean;
    function documentSpansEqual(a: DocumentSpan, b: DocumentSpan): boolean;
    /**
     * Iterates through 'array' by index and performs the callback on each element of array until the callback
     * returns a truthy value, then returns that value.
     * If no such value is found, the callback is applied to each element of array and undefined is returned.
     */
    function forEachUnique<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U): U | undefined;
    function isTextWhiteSpaceLike(text: string, startPos: number, endPos: number): boolean;
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
    function getNewLineOrDefaultFromHost(host: FormattingHost, formatSettings?: FormatCodeSettings): string;
    function lineBreakPart(): SymbolDisplayPart;
    function mapToDisplayParts(writeDisplayParts: (writer: DisplayPartsSymbolWriter) => void): SymbolDisplayPart[];
    function typeToDisplayParts(typechecker: TypeChecker, type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
    function symbolToDisplayParts(typeChecker: TypeChecker, symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): SymbolDisplayPart[];
    function signatureToDisplayParts(typechecker: TypeChecker, signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
    function isImportOrExportSpecifierName(location: Node): location is Identifier;
    function getScriptKind(fileName: string, host: LanguageServiceHost): ScriptKind;
    function getSymbolTarget(symbol: Symbol, checker: TypeChecker): Symbol;
    function getUniqueSymbolId(symbol: Symbol, checker: TypeChecker): number;
    function getFirstNonSpaceCharacterPosition(text: string, position: number): number;
    function getPrecedingNonSpaceCharacterPosition(text: string, position: number): number;
    /**
     * Creates a deep, memberwise clone of a node with no source map location.
     *
     * WARNING: This is an expensive operation and is only intended to be used in refactorings
     * and code fixes (because those are triggered by explicit user actions).
     */
    function getSynthesizedDeepClone<T extends Node | undefined>(node: T, includeTrivia?: boolean): T;
    function getSynthesizedDeepCloneWithRenames<T extends Node>(node: T, includeTrivia?: boolean, renameMap?: ESMap<string, Identifier>, checker?: TypeChecker, callback?: (originalNode: Node, clone: Node) => any): T;
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
    function copyComments(sourceNode: Node, targetNode: Node): void;
    function getUniqueName(baseName: string, sourceFile: SourceFile): string;
    /**
     * @return The index of the (only) reference to the extracted symbol.  We want the cursor
     * to be on the reference, rather than the declaration, because it's closer to where the
     * user was before extracting it.
     */
    function getRenameLocation(edits: readonly FileTextChanges[], renameFilename: string, name: string, preferLastLocation: boolean): number;
    function copyLeadingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
    function copyTrailingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
    /**
     * This function copies the trailing comments for the token that comes before `sourceNode`, as leading comments of `targetNode`.
     * This is useful because sometimes a comment that refers to `sourceNode` will be a leading comment for `sourceNode`, according to the
     * notion of trivia ownership, and instead will be a trailing comment for the token before `sourceNode`, e.g.:
     * `function foo(\* not leading comment for a *\ a: string) {}`
     * The comment refers to `a` but belongs to the `(` token, but we might want to copy it.
     */
    function copyTrailingAsLeadingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
    function needsParentheses(expression: Expression): boolean;
    function getContextualTypeFromParent(node: Expression, checker: TypeChecker): Type | undefined;
    function quote(text: string, preferences: UserPreferences): string;
    function isEqualityOperatorKind(kind: SyntaxKind): kind is EqualityOperator;
    function isStringLiteralOrTemplate(node: Node): node is StringLiteralLike | TemplateExpression | TaggedTemplateExpression;
    function hasIndexSignature(type: Type): boolean;
    function getSwitchedType(caseClause: CaseClause, checker: TypeChecker): Type | undefined;
    const ANONYMOUS = "anonymous function";
    function getTypeNodeIfAccessible(type: Type, enclosingScope: Node, program: Program, host: LanguageServiceHost): TypeNode | undefined;
    function syntaxRequiresTrailingCommaOrSemicolonOrASI(kind: SyntaxKind): boolean;
    function syntaxRequiresTrailingFunctionBlockOrSemicolonOrASI(kind: SyntaxKind): boolean;
    function syntaxRequiresTrailingModuleBlockOrSemicolonOrASI(kind: SyntaxKind): boolean;
    function syntaxRequiresTrailingSemicolonOrASI(kind: SyntaxKind): boolean;
    const syntaxMayBeASICandidate: (kind: SyntaxKind) => boolean;
    function positionIsASICandidate(pos: number, context: Node, sourceFile: SourceFileLike): boolean;
    function probablyUsesSemicolons(sourceFile: SourceFile): boolean;
    function tryGetDirectories(host: Pick<LanguageServiceHost, "getDirectories">, directoryName: string): string[];
    function tryReadDirectory(host: Pick<LanguageServiceHost, "readDirectory">, path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[]): readonly string[];
    function tryFileExists(host: Pick<LanguageServiceHost, "fileExists">, path: string): boolean;
    function tryDirectoryExists(host: LanguageServiceHost, path: string): boolean;
    function tryAndIgnoreErrors<T>(cb: () => T): T | undefined;
    function tryIOAndConsumeErrors<T>(host: unknown, toApply: ((...a: any[]) => T) | undefined, ...args: any[]): any;
    function findPackageJsons(startDirectory: string, host: Pick<LanguageServiceHost, "fileExists">, stopDirectory?: string): string[];
    function findPackageJson(directory: string, host: LanguageServiceHost): string | undefined;
    function getPackageJsonsVisibleToFile(fileName: string, host: LanguageServiceHost): readonly PackageJsonInfo[];
    function createPackageJsonInfo(fileName: string, host: {
        readFile?(fileName: string): string | undefined;
    }): PackageJsonInfo | undefined;
    function consumesNodeCoreModules(sourceFile: SourceFile): boolean;
    function isInsideNodeModules(fileOrDirectory: string): boolean;
    function isDiagnosticWithLocation(diagnostic: Diagnostic): diagnostic is DiagnosticWithLocation;
    function findDiagnosticForNode(node: Node, sortedFileDiagnostics: readonly Diagnostic[]): DiagnosticWithLocation | undefined;
    function getDiagnosticsWithinSpan(span: TextSpan, sortedFileDiagnostics: readonly Diagnostic[]): readonly DiagnosticWithLocation[];
    function getRefactorContextSpan({ startPosition, endPosition }: RefactorContext): TextSpan;
    /**
     * If the provided value is an array, the mapping function is applied to each element; otherwise, the mapping function is applied
     * to the provided value itself.
     */
    function mapOneOrMany<T, U>(valueOrArray: T | readonly T[], f: (x: T, i: number) => U): U | U[];
    function mapOneOrMany<T, U>(valueOrArray: T | readonly T[] | undefined, f: (x: T, i: number) => U): U | U[] | undefined;
    function mapOneOrMany<T, U>(valueOrArray: T | readonly T[], f: (x: T, i: number) => U, resultSelector: (x: U[]) => U): U;
    function mapOneOrMany<T, U>(valueOrArray: T | readonly T[] | undefined, f: (x: T, i: number) => U, resultSelector: (x: U[]) => U): U | undefined;
    /**
     * If the provided value is an array, the first element of the array is returned; otherwise, the provided value is returned instead.
     */
    function firstOrOnly<T>(valueOrArray: T | readonly T[]): T;
    function getNameForExportedSymbol(symbol: Symbol, scriptTarget: ScriptTarget): string;
    /**
     * Useful to check whether a string contains another string at a specific index
     * without allocating another string or traversing the entire contents of the outer string.
     *
     * This function is useful in place of either of the following:
     *
     * ```ts
     * // Allocates
     * haystack.substr(startIndex, needle.length) === needle
     *
     * // Full traversal
     * haystack.indexOf(needle, startIndex) === startIndex
     * ```
     *
     * @param haystack The string that potentially contains `needle`.
     * @param needle The string whose content might sit within `haystack`.
     * @param startIndex The index within `haystack` to start searching for `needle`.
     */
    function stringContainsAt(haystack: string, needle: string, startIndex: number): boolean;
    function startsWithUnderscore(name: string): boolean;
    function isGlobalDeclaration(declaration: Declaration): boolean;
    function isNonGlobalDeclaration(declaration: Declaration): boolean;
}
declare namespace ts {
    /** The classifier is used for syntactic highlighting in editors via the TSServer */
    function createClassifier(): Classifier;
    function getSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: ReadonlySet<__String>, span: TextSpan): ClassifiedSpan[];
    function getEncodedSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: ReadonlySet<__String>, span: TextSpan): Classifications;
    function getSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): ClassifiedSpan[];
    function getEncodedSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): Classifications;
}
declare namespace ts.Completions.StringCompletions {
    function getStringLiteralCompletions(sourceFile: SourceFile, position: number, contextToken: Node | undefined, checker: TypeChecker, options: CompilerOptions, host: LanguageServiceHost, log: Log, preferences: UserPreferences): CompletionInfo | undefined;
    function getStringLiteralCompletionDetails(name: string, sourceFile: SourceFile, position: number, contextToken: Node | undefined, checker: TypeChecker, options: CompilerOptions, host: LanguageServiceHost, cancellationToken: CancellationToken): CompletionEntryDetails | undefined;
}
declare namespace ts.Completions {
    export enum SortText {
        LocationPriority = "0",
        OptionalMember = "1",
        MemberDeclaredBySpreadAssignment = "2",
        SuggestedClassMembers = "3",
        GlobalsOrKeywords = "4",
        AutoImportSuggestions = "5",
        JavascriptIdentifiers = "6"
    }
    export type Log = (message: string) => void;
    /**
     * Special values for `CompletionInfo['source']` used to disambiguate
     * completion items with the same `name`. (Each completion item must
     * have a unique name/source combination, because those two fields
     * comprise `CompletionEntryIdentifier` in `getCompletionEntryDetails`.
     *
     * When the completion item is an auto-import suggestion, the source
     * is the module specifier of the suggestion. To avoid collisions,
     * the values here should not be a module specifier we would ever
     * generate for an auto-import.
     */
    export enum CompletionSource {
        /** Completions that require `this.` insertion text */
        ThisProperty = "ThisProperty/"
    }
    const enum SymbolOriginInfoKind {
        ThisType = 1,
        SymbolMember = 2,
        Export = 4,
        Promise = 8,
        Nullable = 16,
        SymbolMemberNoExport = 2,
        SymbolMemberExport = 6
    }
    interface SymbolOriginInfo {
        kind: SymbolOriginInfoKind;
    }
    interface SymbolOriginInfoExport extends SymbolOriginInfo {
        kind: SymbolOriginInfoKind;
        moduleSymbol: Symbol;
        isDefaultExport: boolean;
        isFromPackageJson?: boolean;
    }
    interface UniqueNameSet {
        add(name: string): void;
        has(name: string): boolean;
    }
    /**
     * Map from symbol id -> SymbolOriginInfo.
     * Only populated for symbols that come from other modules.
     */
    type SymbolOriginInfoMap = (SymbolOriginInfo | SymbolOriginInfoExport | undefined)[];
    type SymbolSortTextMap = (SortText | undefined)[];
    export interface AutoImportSuggestion {
        symbol: Symbol;
        symbolName: string;
        skipFilter: boolean;
        origin: SymbolOriginInfoExport;
    }
    export interface ImportSuggestionsForFileCache {
        clear(): void;
        get(fileName: string, checker: TypeChecker, projectVersion?: string): readonly AutoImportSuggestion[] | undefined;
        set(fileName: string, suggestions: readonly AutoImportSuggestion[], projectVersion?: string): void;
        isEmpty(): boolean;
    }
    export function createImportSuggestionsForFileCache(): ImportSuggestionsForFileCache;
    export function getCompletionsAtPosition(host: LanguageServiceHost, program: Program, log: Log, sourceFile: SourceFile, position: number, preferences: UserPreferences, triggerCharacter: CompletionsTriggerCharacter | undefined): CompletionInfo | undefined;
    export function getCompletionEntriesFromSymbols(symbols: readonly Symbol[], entries: Push<CompletionEntry>, contextToken: Node | undefined, location: Node | undefined, sourceFile: SourceFile, typeChecker: TypeChecker, target: ScriptTarget, log: Log, kind: CompletionKind, preferences: UserPreferences, propertyAccessToConvert?: PropertyAccessExpression, jsxIdentifierExpected?: boolean, isJsxInitializer?: IsJsxInitializer, recommendedCompletion?: Symbol, symbolToOriginInfoMap?: SymbolOriginInfoMap, symbolToSortTextMap?: SymbolSortTextMap): UniqueNameSet;
    export interface CompletionEntryIdentifier {
        name: string;
        source?: string;
    }
    export function getCompletionEntryDetails(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier, host: LanguageServiceHost, formatContext: formatting.FormatContext, preferences: UserPreferences, cancellationToken: CancellationToken): CompletionEntryDetails | undefined;
    export function createCompletionDetailsForSymbol(symbol: Symbol, checker: TypeChecker, sourceFile: SourceFile, location: Node, cancellationToken: CancellationToken, codeActions?: CodeAction[], sourceDisplay?: SymbolDisplayPart[]): CompletionEntryDetails;
    export function createCompletionDetails(name: string, kindModifiers: string, kind: ScriptElementKind, displayParts: SymbolDisplayPart[], documentation?: SymbolDisplayPart[], tags?: JSDocTagInfo[], codeActions?: CodeAction[], source?: SymbolDisplayPart[]): CompletionEntryDetails;
    export function getCompletionEntrySymbol(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier, host: LanguageServiceHost, preferences: UserPreferences): Symbol | undefined;
    /** true: after the `=` sign but no identifier has been typed yet. Else is the Identifier after the initializer. */
    type IsJsxInitializer = boolean | Identifier;
    export const enum CompletionKind {
        ObjectPropertyDeclaration = 0,
        Global = 1,
        PropertyAccess = 2,
        MemberLike = 3,
        String = 4,
        None = 5
    }
    export {};
}
declare namespace ts {
    interface DocumentHighlights {
        fileName: string;
        highlightSpans: HighlightSpan[];
    }
    namespace DocumentHighlights {
        function getDocumentHighlights(program: Program, cancellationToken: CancellationToken, sourceFile: SourceFile, position: number, sourceFilesToSearch: readonly SourceFile[]): DocumentHighlights[] | undefined;
    }
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
        importSearches: readonly [Identifier, Symbol][];
        /** For rename imports/exports `{ foo as bar }`, `foo` is not a local, so it may be added as a reference immediately without further searching. */
        singleReferences: readonly (Identifier | StringLiteral)[];
        /** List of source files that may (or may not) use the symbol via a namespace. (For UMD modules this is every file.) */
        indirectUsers: readonly SourceFile[];
    }
    type ImportTracker = (exportSymbol: Symbol, exportInfo: ExportInfo, isForRename: boolean) => ImportsResult;
    /** Creates the imports map and returns an ImportTracker that uses it. Call this lazily to avoid calling `getDirectImportsMap` unnecessarily.  */
    function createImportTracker(sourceFiles: readonly SourceFile[], sourceFilesSet: ReadonlySet<string>, checker: TypeChecker, cancellationToken: CancellationToken | undefined): ImportTracker;
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
    type ModuleReference = 
    /** "import" also includes require() calls. */
    {
        kind: "import";
        literal: StringLiteralLike;
    }
    /** <reference path> or <reference types> */
     | {
        kind: "reference";
        referencingFile: SourceFile;
        ref: FileReference;
    };
    function findModuleReferences(program: Program, sourceFiles: readonly SourceFile[], searchModuleSymbol: Symbol): ModuleReference[];
    interface ImportedSymbol {
        kind: ImportExport.Import;
        symbol: Symbol;
    }
    interface ExportedSymbol {
        kind: ImportExport.Export;
        symbol: Symbol;
        exportInfo: ExportInfo;
    }
    /**
     * Given a local reference, we might notice that it's an import/export and recursively search for references of that.
     * If at an import, look locally for the symbol it imports.
     * If at an export, look for all imports of it.
     * This doesn't handle export specifiers; that is done in `getReferencesAtExportSpecifier`.
     * @param comingFromExport If we are doing a search for all exports, don't bother looking backwards for the imported symbol, since that's the reason we're here.
     */
    function getImportOrExportSymbol(node: Node, symbol: Symbol, checker: TypeChecker, comingFromExport: boolean): ImportedSymbol | ExportedSymbol | undefined;
    function getExportInfo(exportSymbol: Symbol, exportKind: ExportKind, checker: TypeChecker): ExportInfo | undefined;
}
declare namespace ts.FindAllReferences {
    interface SymbolAndEntries {
        readonly definition: Definition | undefined;
        readonly references: readonly Entry[];
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
    const enum EntryKind {
        Span = 0,
        Node = 1,
        StringLiteral = 2,
        SearchedLocalFoundProperty = 3,
        SearchedPropertyFoundLocal = 4
    }
    type NodeEntryKind = EntryKind.Node | EntryKind.StringLiteral | EntryKind.SearchedLocalFoundProperty | EntryKind.SearchedPropertyFoundLocal;
    type Entry = NodeEntry | SpanEntry;
    interface ContextWithStartAndEndNode {
        start: Node;
        end: Node;
    }
    type ContextNode = Node | ContextWithStartAndEndNode;
    interface NodeEntry {
        readonly kind: NodeEntryKind;
        readonly node: Node;
        readonly context?: ContextNode;
    }
    interface SpanEntry {
        readonly kind: EntryKind.Span;
        readonly fileName: string;
        readonly textSpan: TextSpan;
    }
    function nodeEntry(node: Node, kind?: NodeEntryKind): NodeEntry;
    function isContextWithStartAndEndNode(node: ContextNode): node is ContextWithStartAndEndNode;
    function getContextNode(node: NamedDeclaration | BinaryExpression | ForInOrOfStatement | undefined): ContextNode | undefined;
    function toContextSpan(textSpan: TextSpan, sourceFile: SourceFile, context?: ContextNode): {
        contextSpan: TextSpan;
    } | undefined;
    const enum FindReferencesUse {
        /**
         * When searching for references to a symbol, the location will not be adjusted (this is the default behavior when not specified).
         */
        Other = 0,
        /**
         * When searching for references to a symbol, the location will be adjusted if the cursor was on a keyword.
         */
        References = 1,
        /**
         * When searching for references to a symbol, the location will be adjusted if the cursor was on a keyword.
         * Unlike `References`, the location will only be adjusted keyword belonged to a declaration with a valid name.
         * If set, we will find fewer references -- if it is referenced by several different names, we still only find references for the original name.
         */
        Rename = 2
    }
    interface Options {
        readonly findInStrings?: boolean;
        readonly findInComments?: boolean;
        readonly use?: FindReferencesUse;
        /** True if we are searching for implementations. We will have a different method of adding references if so. */
        readonly implementations?: boolean;
        /**
         * True to opt in for enhanced renaming of shorthand properties and import/export specifiers.
         * The options controls the behavior for the whole rename operation; it cannot be changed on a per-file basis.
         * Default is false for backwards compatibility.
         */
        readonly providePrefixAndSuffixTextForRename?: boolean;
    }
    function findReferencedSymbols(program: Program, cancellationToken: CancellationToken, sourceFiles: readonly SourceFile[], sourceFile: SourceFile, position: number): ReferencedSymbol[] | undefined;
    function getImplementationsAtPosition(program: Program, cancellationToken: CancellationToken, sourceFiles: readonly SourceFile[], sourceFile: SourceFile, position: number): ImplementationLocation[] | undefined;
    function findReferenceOrRenameEntries<T>(program: Program, cancellationToken: CancellationToken, sourceFiles: readonly SourceFile[], node: Node, position: number, options: Options | undefined, convertEntry: ToReferenceOrRenameEntry<T>): T[] | undefined;
    type ToReferenceOrRenameEntry<T> = (entry: Entry, originalNode: Node, checker: TypeChecker) => T;
    function getReferenceEntriesForNode(position: number, node: Node, program: Program, sourceFiles: readonly SourceFile[], cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlySet<string>): readonly Entry[] | undefined;
    function toRenameLocation(entry: Entry, originalNode: Node, checker: TypeChecker, providePrefixAndSuffixText: boolean): RenameLocation;
    function toReferenceEntry(entry: Entry): ReferenceEntry;
    function toHighlightSpan(entry: Entry): {
        fileName: string;
        span: HighlightSpan;
    };
    function getTextSpanOfEntry(entry: Entry): TextSpan;
    /** Encapsulates the core find-all-references algorithm. */
    namespace Core {
        /** Core find-all-references algorithm. Handles special cases before delegating to `getReferencedSymbolsForSymbol`. */
        function getReferencedSymbolsForNode(position: number, node: Node, program: Program, sourceFiles: readonly SourceFile[], cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlySet<string>): readonly SymbolAndEntries[] | undefined;
        function eachExportReference(sourceFiles: readonly SourceFile[], checker: TypeChecker, cancellationToken: CancellationToken | undefined, exportSymbol: Symbol, exportingModuleSymbol: Symbol, exportName: string, isDefaultExport: boolean, cb: (ref: Identifier) => void): void;
        /** Used as a quick check for whether a symbol is used at all in a file (besides its definition). */
        function isSymbolReferencedInFile(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile, searchContainer?: Node): boolean;
        function eachSymbolReferenceInFile<T>(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile, cb: (token: Identifier) => T, searchContainer?: Node): T | undefined;
        function eachSignatureCall(signature: SignatureDeclaration, sourceFiles: readonly SourceFile[], checker: TypeChecker, cb: (call: CallExpression) => void): void;
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
}
declare namespace ts.CallHierarchy {
    type NamedExpression = ClassExpression & {
        name: Identifier;
    } | FunctionExpression & {
        name: Identifier;
    };
    type ConstNamedExpression = ClassExpression & {
        name: undefined;
        parent: VariableDeclaration & {
            name: Identifier;
        };
    } | FunctionExpression & {
        name: undefined;
        parent: VariableDeclaration & {
            name: Identifier;
        };
    } | ArrowFunction & {
        name: undefined;
        parent: VariableDeclaration & {
            name: Identifier;
        };
    };
    type CallHierarchyDeclaration = SourceFile | ModuleDeclaration & {
        name: Identifier;
    } | FunctionDeclaration | ClassDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | NamedExpression | ConstNamedExpression;
    /** Resolves the call hierarchy declaration for a node. */
    function resolveCallHierarchyDeclaration(program: Program, location: Node): CallHierarchyDeclaration | CallHierarchyDeclaration[] | undefined;
    /** Creates a `CallHierarchyItem` for a call hierarchy declaration. */
    function createCallHierarchyItem(program: Program, node: CallHierarchyDeclaration): CallHierarchyItem;
    /** Gets the call sites that call into the provided call hierarchy declaration. */
    function getIncomingCalls(program: Program, declaration: CallHierarchyDeclaration, cancellationToken: CancellationToken): CallHierarchyIncomingCall[];
    /** Gets the call sites that call out of the provided call hierarchy declaration. */
    function getOutgoingCalls(program: Program, declaration: CallHierarchyDeclaration): CallHierarchyOutgoingCall[];
}
declare namespace ts {
    export function getEditsForFileRename(program: Program, oldFileOrDirPath: string, newFileOrDirPath: string, host: LanguageServiceHost, formatContext: formatting.FormatContext, preferences: UserPreferences, sourceMapper: SourceMapper): readonly FileTextChanges[];
    /** If 'path' refers to an old directory, returns path in the new directory. */
    type PathUpdater = (path: string) => string | undefined;
    export function getPathUpdater(oldFileOrDirPath: string, newFileOrDirPath: string, getCanonicalFileName: GetCanonicalFileName, sourceMapper: SourceMapper | undefined): PathUpdater;
    export {};
}
declare namespace ts.GoToDefinition {
    function getDefinitionAtPosition(program: Program, sourceFile: SourceFile, position: number): readonly DefinitionInfo[] | undefined;
    function getReferenceAtPosition(sourceFile: SourceFile, position: number, program: Program): {
        fileName: string;
        file: SourceFile;
    } | undefined;
    function getTypeDefinitionAtPosition(typeChecker: TypeChecker, sourceFile: SourceFile, position: number): readonly DefinitionInfo[] | undefined;
    function getDefinitionAndBoundSpan(program: Program, sourceFile: SourceFile, position: number): DefinitionInfoAndBoundSpan | undefined;
    function findReferenceInPosition(refs: readonly FileReference[], pos: number): FileReference | undefined;
}
declare namespace ts.JsDoc {
    function getJsDocCommentsFromDeclarations(declarations: readonly Declaration[]): SymbolDisplayPart[];
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
    function getNavigateToItems(sourceFiles: readonly SourceFile[], checker: TypeChecker, cancellationToken: CancellationToken, searchValue: string, maxResultCount: number | undefined, excludeDtsFiles: boolean): NavigateToItem[];
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
    function organizeImports(sourceFile: SourceFile, formatContext: formatting.FormatContext, host: LanguageServiceHost, program: Program, preferences: UserPreferences): FileTextChanges[];
    /**
     * @param importGroup a list of ImportDeclarations, all with the same module name.
     */
    function coalesceImports(importGroup: readonly ImportDeclaration[]): readonly ImportDeclaration[];
    /**
     * @param exportGroup a list of ExportDeclarations, all with the same module name.
     */
    function coalesceExports(exportGroup: readonly ExportDeclaration[]): readonly ExportDeclaration[];
    function compareImportOrExportSpecifiers<T extends ImportOrExportSpecifier>(s1: T, s2: T): Comparison;
    function compareModuleSpecifiers(m1: Expression | undefined, m2: Expression | undefined): Comparison;
    function importsAreSorted(imports: readonly AnyImportOrRequireStatement[]): imports is SortedReadonlyArray<AnyImportOrRequireStatement>;
    function importSpecifiersAreSorted(imports: readonly ImportSpecifier[]): imports is SortedReadonlyArray<ImportSpecifier>;
    function getImportDeclarationInsertionIndex(sortedImports: SortedReadonlyArray<AnyImportOrRequireStatement>, newImport: AnyImportOrRequireStatement): number;
    function getImportSpecifierInsertionIndex(sortedImports: SortedReadonlyArray<ImportSpecifier>, newImport: ImportSpecifier): number;
    function compareImportsOrRequireStatements(s1: AnyImportOrRequireStatement, s2: AnyImportOrRequireStatement): Comparison;
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
        getFullMatch(candidateContainers: readonly string[], candidate: string): PatternMatch | undefined;
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
    function getRenameInfo(program: Program, sourceFile: SourceFile, position: number, options?: RenameInfoOptions): RenameInfo;
}
declare namespace ts.SmartSelectionRange {
    function getSmartSelectionRange(pos: number, sourceFile: SourceFile): SelectionRange;
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
        tryGetSourcePosition(info: DocumentPosition): DocumentPosition | undefined;
        tryGetGeneratedPosition(info: DocumentPosition): DocumentPosition | undefined;
        clearCache(): void;
    }
    interface SourceMapperHost {
        useCaseSensitiveFileNames(): boolean;
        getCurrentDirectory(): string;
        getProgram(): Program | undefined;
        fileExists?(path: string): boolean;
        readFile?(path: string, encoding?: string): string | undefined;
        getSourceFileLike?(fileName: string): SourceFileLike | undefined;
        getDocumentPositionMapper?(generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
        log(s: string): void;
    }
    function getSourceMapper(host: SourceMapperHost): SourceMapper;
    /**
     * string | undefined to contents of map file to create DocumentPositionMapper from it
     * DocumentPositionMapper | false to give back cached DocumentPositionMapper
     */
    type ReadMapFile = (mapFileName: string, mapFileNameFromDts: string | undefined) => string | undefined | DocumentPositionMapper | false;
    function getDocumentPositionMapper(host: DocumentPositionMapperHost, generatedFileName: string, generatedFileLineInfo: LineInfo, readMapFile: ReadMapFile): DocumentPositionMapper | undefined;
}
declare namespace ts {
    function computeSuggestionDiagnostics(sourceFile: SourceFile, program: Program, cancellationToken: CancellationToken): DiagnosticWithLocation[];
    function isReturnStatementWithFixablePromiseHandler(node: Node): node is ReturnStatement & {
        expression: CallExpression;
    };
    function isFixablePromiseHandler(node: Node): boolean;
}
declare namespace ts.SymbolDisplay {
    export function getSymbolKind(typeChecker: TypeChecker, symbol: Symbol, location: Node): ScriptElementKind;
    export function getSymbolModifiers(symbol: Symbol): string;
    interface SymbolDisplayPartsDocumentationAndSymbolKind {
        displayParts: SymbolDisplayPart[];
        documentation: SymbolDisplayPart[];
        symbolKind: ScriptElementKind;
        tags: JSDocTagInfo[] | undefined;
    }
    export function getSymbolDisplayPartsDocumentationAndSymbolKind(typeChecker: TypeChecker, symbol: Symbol, sourceFile: SourceFile, enclosingDeclaration: Node | undefined, location: Node, semanticMeaning?: SemanticMeaning, alias?: Symbol): SymbolDisplayPartsDocumentationAndSymbolKind;
    export {};
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
        isOnEOF(): boolean;
        readTokenInfo(n: Node): TokenInfo;
        readEOFTokenRange(): TextRangeWithKind;
        getCurrentLeadingTrivia(): TextRangeWithKind[] | undefined;
        lastTrailingTriviaWasNewLine(): boolean;
        skipToEndOf(node: Node): void;
        skipToStartOf(node: Node): void;
    }
    function getFormattingScanner<T>(text: string, languageVariant: LanguageVariant, startPos: number, endPos: number, cb: (scanner: FormattingScanner) => T): T;
}
declare namespace ts.formatting {
    interface Rule {
        readonly debugName: string;
        readonly context: readonly ContextPredicate[];
        readonly action: RuleAction;
        readonly flags: RuleFlags;
    }
    type ContextPredicate = (context: FormattingContext) => boolean;
    const anyContext: readonly ContextPredicate[];
    const enum RuleAction {
        StopProcessingSpaceActions = 1,
        StopProcessingTokenActions = 2,
        InsertSpace = 4,
        InsertNewLine = 8,
        DeleteSpace = 16,
        DeleteToken = 32,
        InsertTrailingSemicolon = 64,
        StopAction = 3,
        ModifySpaceAction = 28,
        ModifyTokenAction = 96
    }
    const enum RuleFlags {
        None = 0,
        CanDeleteNewLines = 1
    }
    interface TokenRange {
        readonly tokens: readonly SyntaxKind[];
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
    function getFormatContext(options: FormatCodeSettings, host: FormattingHost): FormatContext;
    type RulesMap = (context: FormattingContext) => readonly Rule[] | undefined;
}
declare namespace ts.formatting {
    interface FormatContext {
        readonly options: FormatCodeSettings;
        readonly getRules: RulesMap;
        readonly host: FormattingHost;
    }
    interface TextRangeWithKind<T extends SyntaxKind = SyntaxKind> extends TextRange {
        kind: T;
    }
    type TextRangeWithTriviaKind = TextRangeWithKind<TriviaKind>;
    interface TokenInfo {
        leadingTrivia: TextRangeWithTriviaKind[] | undefined;
        token: TextRangeWithKind;
        trailingTrivia: TextRangeWithTriviaKind[] | undefined;
    }
    function createTextRangeWithKind<T extends SyntaxKind>(pos: number, end: number, kind: T): TextRangeWithKind<T>;
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
    function getRangeOfEnclosingComment(sourceFile: SourceFile, position: number, precedingToken?: Node | null, tokenAtPosition?: Node): CommentRange | undefined;
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
        function argumentStartsOnSameLineAsPreviousArgument(parent: Node, child: TextRangeWithKind, childStartLine: number, sourceFile: SourceFileLike): boolean;
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
        leadingTriviaOption?: LeadingTriviaOption;
    }
    interface ConfigurableEnd {
        trailingTriviaOption?: TrailingTriviaOption;
    }
    enum LeadingTriviaOption {
        /** Exclude all leading trivia (use getStart()) */
        Exclude = 0,
        /** Include leading trivia and,
         * if there are no line breaks between the node and the previous token,
         * include all trivia between the node and the previous token
         */
        IncludeAll = 1,
        /**
         * Include attached JSDoc comments
         */
        JSDoc = 2,
        /**
         * Only delete trivia on the same line as getStart().
         * Used to avoid deleting leading comments
         */
        StartLine = 3
    }
    enum TrailingTriviaOption {
        /** Exclude all trailing trivia (use getEnd()) */
        Exclude = 0,
        /** Include trailing trivia */
        Include = 1
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
     * If pos\end should be interpreted literally (that is, withouth including leading and trailing trivia), `leadingTriviaOption` should be set to `LeadingTriviaOption.Exclude`
     * and `trailingTriviaOption` to `TrailingTriviaOption.Exclude`.
     */
    interface ConfigurableStartEnd extends ConfigurableStart, ConfigurableEnd {
    }
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
        preferences: UserPreferences;
    }
    type TypeAnnotatable = SignatureDeclaration | VariableDeclaration | ParameterDeclaration | PropertyDeclaration | PropertySignature;
    type ThisTypeAnnotatable = FunctionDeclaration | FunctionExpression;
    function isThisTypeAnnotatable(containingFunction: FunctionLike): containingFunction is ThisTypeAnnotatable;
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
        pushRaw(sourceFile: SourceFile, change: FileTextChanges): void;
        deleteRange(sourceFile: SourceFile, range: TextRange): void;
        delete(sourceFile: SourceFile, node: Node | NodeArray<TypeParameterDeclaration>): void;
        deleteNode(sourceFile: SourceFile, node: Node, options?: ConfigurableStartEnd): void;
        deleteModifier(sourceFile: SourceFile, modifier: Modifier): void;
        deleteNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, options?: ConfigurableStartEnd): void;
        deleteNodeRangeExcludingEnd(sourceFile: SourceFile, startNode: Node, afterEndNode: Node | undefined, options?: ConfigurableStartEnd): void;
        replaceRange(sourceFile: SourceFile, range: TextRange, newNode: Node, options?: InsertNodeOptions): void;
        replaceNode(sourceFile: SourceFile, oldNode: Node, newNode: Node, options?: ChangeNodeOptions): void;
        replaceNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, newNode: Node, options?: ChangeNodeOptions): void;
        private replaceRangeWithNodes;
        replaceNodeWithNodes(sourceFile: SourceFile, oldNode: Node, newNodes: readonly Node[], options?: ChangeNodeOptions): void;
        replaceNodeWithText(sourceFile: SourceFile, oldNode: Node, text: string): void;
        replaceNodeRangeWithNodes(sourceFile: SourceFile, startNode: Node, endNode: Node, newNodes: readonly Node[], options?: ReplaceWithMultipleNodesOptions & ConfigurableStartEnd): void;
        private nextCommaToken;
        replacePropertyAssignment(sourceFile: SourceFile, oldNode: PropertyAssignment, newNode: PropertyAssignment): void;
        insertNodeAt(sourceFile: SourceFile, pos: number, newNode: Node, options?: InsertNodeOptions): void;
        private insertNodesAt;
        insertNodeAtTopOfFile(sourceFile: SourceFile, newNode: Statement, blankLineBetween: boolean): void;
        insertNodesAtTopOfFile(sourceFile: SourceFile, newNodes: readonly Statement[], blankLineBetween: boolean): void;
        private insertAtTopOfFile;
        insertFirstParameter(sourceFile: SourceFile, parameters: NodeArray<ParameterDeclaration>, newParam: ParameterDeclaration): void;
        insertNodeBefore(sourceFile: SourceFile, before: Node, newNode: Node, blankLineBetween?: boolean, options?: ConfigurableStartEnd): void;
        insertModifierBefore(sourceFile: SourceFile, modifier: SyntaxKind, before: Node): void;
        insertLastModifierBefore(sourceFile: SourceFile, modifier: SyntaxKind, before: Node): void;
        insertCommentBeforeLine(sourceFile: SourceFile, lineNumber: number, position: number, commentText: string): void;
        insertJsdocCommentBefore(sourceFile: SourceFile, node: HasJSDoc, tag: JSDoc): void;
        replaceRangeWithText(sourceFile: SourceFile, range: TextRange, text: string): void;
        insertText(sourceFile: SourceFile, pos: number, text: string): void;
        /** Prefer this over replacing a node with another that has a type annotation, as it avoids reformatting the other parts of the node. */
        tryInsertTypeAnnotation(sourceFile: SourceFile, node: TypeAnnotatable, type: TypeNode): boolean;
        tryInsertThisTypeAnnotation(sourceFile: SourceFile, node: ThisTypeAnnotatable, type: TypeNode): void;
        insertTypeParameters(sourceFile: SourceFile, node: SignatureDeclaration, typeParameters: readonly TypeParameterDeclaration[]): void;
        private getOptionsForInsertNodeBefore;
        insertNodeAtConstructorStart(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
        insertNodeAtConstructorEnd(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
        private replaceConstructorBody;
        insertNodeAtEndOfScope(sourceFile: SourceFile, scope: Node, newNode: Node): void;
        insertNodeAtClassStart(sourceFile: SourceFile, cls: ClassLikeDeclaration | InterfaceDeclaration, newElement: ClassElement): void;
        insertNodeAtObjectStart(sourceFile: SourceFile, obj: ObjectLiteralExpression, newElement: ObjectLiteralElementLike): void;
        private insertNodeAtStartWorker;
        /**
         * Tries to guess the indentation from the existing members of a class/interface/object. All members must be on
         * new lines and must share the same indentation.
         */
        private guessIndentationFromExistingMembers;
        private computeIndentationForNewMember;
        private getInsertNodeAtStartInsertOptions;
        insertNodeAfterComma(sourceFile: SourceFile, after: Node, newNode: Node): void;
        insertNodeAfter(sourceFile: SourceFile, after: Node, newNode: Node): void;
        insertNodeAtEndOfList(sourceFile: SourceFile, list: NodeArray<Node>, newNode: Node): void;
        insertNodesAfter(sourceFile: SourceFile, after: Node, newNodes: readonly Node[]): void;
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
        insertNodeInListAfter(sourceFile: SourceFile, after: Node, newNode: Node, containingList?: NodeArray<Node> | undefined): void;
        parenthesizeExpression(sourceFile: SourceFile, expression: Expression): void;
        private finishClassesWithNodesInsertedAtStart;
        private finishDeleteDeclarations;
        /**
         * Note: after calling this, the TextChanges object must be discarded!
         * @param validate only for tests
         *    The reason we must validate as part of this method is that `getNonFormattedText` changes the node's positions,
         *    so we can only call this once and can't get the non-formatted text separately.
         */
        getChanges(validate?: ValidateNonFormattedText): FileTextChanges[];
        createNewFile(oldFile: SourceFile | undefined, fileName: string, statements: readonly (Statement | SyntaxKind.NewLineTrivia)[]): void;
    }
    type ValidateNonFormattedText = (node: Node, text: string) => void;
    function getNewFileText(statements: readonly Statement[], scriptKind: ScriptKind, newLineCharacter: string, formatContext: formatting.FormatContext): string;
    function applyChanges(text: string, changes: readonly TextChange[]): string;
    function isValidLocationToAddComment(sourceFile: SourceFile, position: number): boolean;
    /** Warning: This deletes comments too. See `copyComments` in `convertFunctionToEs6Class`. */
    function deleteNode(changes: ChangeTracker, sourceFile: SourceFile, node: Node, options?: ConfigurableStartEnd): void;
}
declare namespace ts.codefix {
    type DiagnosticAndArguments = DiagnosticMessage | [DiagnosticMessage, string] | [DiagnosticMessage, string, string];
    function createCodeFixActionWithoutFixAll(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments): CodeFixAction;
    function createCodeFixAction(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments, fixId: {}, fixAllDescription: DiagnosticAndArguments, command?: CodeActionCommand): CodeFixAction;
    function registerCodeFix(reg: CodeFixRegistration): void;
    function getSupportedErrorCodes(): string[];
    function getFixes(context: CodeFixContext): readonly CodeFixAction[];
    function getAllFixes(context: CodeFixAllContext): CombinedCodeActions;
    function createCombinedCodeActions(changes: FileTextChanges[], commands?: CodeActionCommand[]): CombinedCodeActions;
    function createFileTextChanges(fileName: string, textChanges: TextChange[]): FileTextChanges;
    function codeFixAll(context: CodeFixAllContext, errorCodes: number[], use: (changes: textChanges.ChangeTracker, error: DiagnosticWithLocation, commands: Push<CodeActionCommand>) => void): CombinedCodeActions;
    function eachDiagnostic(context: CodeFixAllContext, errorCodes: readonly number[], cb: (diag: DiagnosticWithLocation) => void): void;
}
declare namespace ts.refactor {
    /** @param name An unique code associated with each refactor. Does not have to be human-readable. */
    function registerRefactor(name: string, refactor: Refactor): void;
    function getApplicableRefactors(context: RefactorContext): ApplicableRefactorInfo[];
    function getEditsForRefactor(context: RefactorContext, refactorName: string, actionName: string): RefactorEditInfo | undefined;
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
    type DeclarationWithType = FunctionLikeDeclaration | VariableDeclaration | PropertySignature | PropertyDeclaration;
    export function parameterShouldGetTypeFromJSDoc(node: Node): node is DeclarationWithType;
    export {};
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
    const importFixName = "import";
    interface ImportAdder {
        addImportFromDiagnostic: (diagnostic: DiagnosticWithLocation, context: CodeFixContextBase) => void;
        addImportFromExportedSymbol: (exportedSymbol: Symbol, usageIsTypeOnly?: boolean) => void;
        writeFixes: (changeTracker: textChanges.ChangeTracker) => void;
    }
    function createImportAdder(sourceFile: SourceFile, program: Program, preferences: UserPreferences, host: LanguageServiceHost): ImportAdder;
    function getImportCompletionAction(exportedSymbol: Symbol, moduleSymbol: Symbol, sourceFile: SourceFile, symbolName: string, host: LanguageServiceHost, program: Program, formatContext: formatting.FormatContext, position: number, preferences: UserPreferences): {
        readonly moduleSpecifier: string;
        readonly codeAction: CodeAction;
    };
    function forEachExternalModuleToImportFrom(program: Program, host: LanguageServiceHost, from: SourceFile, filterByPackageJson: boolean, useAutoImportProvider: boolean, cb: (module: Symbol, moduleFile: SourceFile | undefined, program: Program, isFromPackageJson: boolean) => void): void;
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
    function addJSDocTags(changes: textChanges.ChangeTracker, sourceFile: SourceFile, parent: HasJSDoc, newTags: readonly JSDocTag[]): void;
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
     * @param importAdder If provided, type annotations will use identifier type references instead of ImportTypeNodes, and the missing imports will be added to the importAdder.
     * @returns Empty string iff there are no member insertions.
     */
    function createMissingMemberNodes(classDeclaration: ClassLikeDeclaration, possiblyMissingSymbols: readonly Symbol[], sourceFile: SourceFile, context: TypeConstructionContext, preferences: UserPreferences, importAdder: ImportAdder | undefined, addClassElement: (node: ClassElement) => void): void;
    function getNoopSymbolTrackerWithResolver(context: TypeConstructionContext): SymbolTracker;
    interface TypeConstructionContext {
        program: Program;
        host: LanguageServiceHost;
    }
    function createMethodFromCallExpression(context: CodeFixContextBase, importAdder: ImportAdder, call: CallExpression, methodName: string, modifierFlags: ModifierFlags, contextNode: Node, inJs: boolean): MethodDeclaration;
    function typeToAutoImportableTypeNode(checker: TypeChecker, importAdder: ImportAdder, type: Type, contextNode: Node, scriptTarget: ScriptTarget, flags?: NodeBuilderFlags, tracker?: SymbolTracker): TypeNode | undefined;
    function setJsonCompilerOptionValues(changeTracker: textChanges.ChangeTracker, configFile: TsConfigSourceFile, options: [string, Expression][]): undefined;
    function setJsonCompilerOptionValue(changeTracker: textChanges.ChangeTracker, configFile: TsConfigSourceFile, optionName: string, optionValue: Expression): void;
    function createJsonPropertyAssignment(name: string, initializer: Expression): PropertyAssignment;
    function findJsonProperty(obj: ObjectLiteralExpression, name: string): PropertyAssignment | undefined;
    /**
     * Given a type node containing 'import("./a").SomeType<import("./b").OtherType<...>>',
     * returns an equivalent type reference node with any nested ImportTypeNodes also replaced
     * with type references, and a list of symbols that must be imported to use the type reference.
     */
    function tryGetAutoImportableReferenceFromTypeNode(importTypeNode: TypeNode | undefined, scriptTarget: ScriptTarget): {
        typeNode: TypeNode;
        symbols: Symbol[];
    } | undefined;
    function importSymbols(importAdder: ImportAdder, symbols: readonly Symbol[]): void;
}
declare namespace ts.codefix {
    type AcceptedDeclaration = ParameterPropertyDeclaration | PropertyDeclaration | PropertyAssignment;
    type AcceptedNameType = Identifier | StringLiteral;
    type ContainerDeclaration = ClassLikeDeclaration | ObjectLiteralExpression;
    interface Info {
        readonly container: ContainerDeclaration;
        readonly isStatic: boolean;
        readonly isReadonly: boolean;
        readonly type: TypeNode | undefined;
        readonly declaration: AcceptedDeclaration;
        readonly fieldName: AcceptedNameType;
        readonly accessorName: AcceptedNameType;
        readonly originalName: string;
        readonly renameAccessor: boolean;
    }
    type InfoOrError = {
        info: Info;
        error?: never;
    } | {
        info?: never;
        error: string;
    };
    export function generateAccessorFromProperty(file: SourceFile, start: number, end: number, context: textChanges.TextChangesContext, _actionName: string): FileTextChanges[] | undefined;
    export function getAccessorConvertiblePropertyAtPosition(file: SourceFile, start: number, end: number, considerEmptySpans?: boolean): InfoOrError | undefined;
    export function getAllSupers(decl: ClassOrInterface | undefined, checker: TypeChecker): readonly ClassOrInterface[];
    export type ClassOrInterface = ClassLikeDeclaration | InterfaceDeclaration;
    export {};
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
declare namespace ts.refactor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.convertToOptionalChainExpression {
}
declare namespace ts.refactor.addOrRemoveBracesToArrowFunction {
}
declare namespace ts.refactor.extractSymbol {
    /**
     * Compute the associated code actions
     * Exported for tests.
     */
    export function getAvailableActions(context: RefactorContext): readonly ApplicableRefactorInfo[];
    export function getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
    export namespace Messages {
        const cannotExtractRange: DiagnosticMessage;
        const cannotExtractImport: DiagnosticMessage;
        const cannotExtractSuper: DiagnosticMessage;
        const cannotExtractJSDoc: DiagnosticMessage;
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
        readonly errors: readonly Diagnostic[];
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
    export function getRangeToExtract(sourceFile: SourceFile, span: TextSpan, considerEmptySpans?: boolean): RangeToExtract;
    export {};
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.generateGetAccessorAndSetAccessor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.addOrRemoveBracesToArrowFunction {
}
declare namespace ts.refactor.convertParamsToDestructuredObject {
}
declare namespace ts.refactor.convertStringOrTemplateLiteral {
}
declare namespace ts.refactor.convertArrowFunctionOrFunctionExpression {
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
    function createLanguageService(host: LanguageServiceHost, documentRegistry?: DocumentRegistry, syntaxOnlyOrLanguageServiceMode?: boolean | LanguageServiceMode): LanguageService;
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
    function getPropertySymbolsFromContextualType(node: ObjectLiteralElementWithName, checker: TypeChecker, contextualType: Type, unionSymbolOk: boolean): readonly Symbol[];
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
        getRenameInfo(fileName: string, position: number, options?: RenameInfoOptions): string;
        getSmartSelectionRange(fileName: string, position: number): string;
        /**
         * Returns a JSON-encoded value of the type:
         * { fileName: string, textSpan: { start: number, length: number } }[]
         */
        findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean): string;
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
        prepareCallHierarchy(fileName: string, position: number): string;
        provideCallHierarchyIncomingCalls(fileName: string, position: number): string;
        provideCallHierarchyOutgoingCalls(fileName: string, position: number): string;
        getEmitOutput(fileName: string): string;
        getEmitOutputObject(fileName: string): EmitOutput;
        toggleLineComment(fileName: string, textChange: TextRange): string;
        toggleMultilineComment(fileName: string, textChange: TextRange): string;
        commentSelection(fileName: string, textChange: TextRange): string;
        uncommentSelection(fileName: string, textChange: TextRange): string;
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
        resolveModuleNames: ((moduleName: string[], containingFile: string) => (ResolvedModuleFull | undefined)[]) | undefined;
        resolveTypeReferenceDirectives: ((typeDirectiveNames: string[], containingFile: string) => (ResolvedTypeReferenceDirective | undefined)[]) | undefined;
        directoryExists: ((directoryName: string) => boolean) | undefined;
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
        readDirectory(path: string, extensions?: readonly string[], exclude?: string[], include?: string[], depth?: number): string[];
        readFile(path: string, encoding?: string): string | undefined;
        fileExists(path: string): boolean;
    }
    class CoreServicesShimHostAdapter implements ParseConfigHost, ModuleResolutionHost, JsTyping.TypingResolutionHost {
        private shimHost;
        directoryExists: (directoryName: string) => boolean;
        realpath: (path: string) => string;
        useCaseSensitiveFileNames: boolean;
        constructor(shimHost: CoreServicesShimHost);
        readDirectory(rootDir: string, extensions: readonly string[], exclude: readonly string[], include: readonly string[], depth?: number): string[];
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
        reportsDeprecated?: {};
    }
    function realizeDiagnostics(diagnostics: readonly Diagnostic[], newLine: string): RealizedDiagnostic[];
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
declare var window: {};
declare const module: {
    exports: {};
};
//# sourceMappingURL=services.d.ts.map