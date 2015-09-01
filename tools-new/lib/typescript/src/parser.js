/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="utilities.ts"/>
var ts;
(function (ts) {
    var nodeConstructors = new Array(204 /* Count */);
    function getNodeConstructor(kind) {
        return nodeConstructors[kind] || (nodeConstructors[kind] = ts.objectAllocator.getNodeConstructor(kind));
    }
    ts.getNodeConstructor = getNodeConstructor;
    function createRootNode(kind, pos, end, flags) {
        var node = new (getNodeConstructor(kind))();
        node.pos = pos;
        node.end = end;
        node.flags = flags;
        return node;
    }
    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    function forEachChild(node, cbNode, cbNodes) {
        function child(node) {
            if (node) {
                return cbNode(node);
            }
        }
        function children(nodes) {
            if (nodes) {
                if (cbNodes) {
                    return cbNodes(nodes);
                }
                for (var i = 0, len = nodes.length; i < len; i++) {
                    var result = cbNode(nodes[i]);
                    if (result) {
                        return result;
                    }
                }
                return undefined;
            }
        }
        if (!node) {
            return;
        }
        switch (node.kind) {
            case 120 /* QualifiedName */:
                return child(node.left) ||
                    child(node.right);
            case 122 /* TypeParameter */:
                return child(node.name) ||
                    child(node.constraint);
            case 123 /* Parameter */:
                return children(node.modifiers) ||
                    child(node.dotDotDotToken) ||
                    child(node.name) ||
                    child(node.questionToken) ||
                    child(node.type) ||
                    child(node.initializer);
            case 124 /* Property */:
            case 198 /* PropertyAssignment */:
            case 199 /* ShorthandPropertyAssignment */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.questionToken) ||
                    child(node.type) ||
                    child(node.initializer);
            case 133 /* FunctionType */:
            case 134 /* ConstructorType */:
            case 129 /* CallSignature */:
            case 130 /* ConstructSignature */:
            case 131 /* IndexSignature */:
                return children(node.modifiers) ||
                    children(node.typeParameters) ||
                    children(node.parameters) ||
                    child(node.type);
            case 125 /* Method */:
            case 126 /* Constructor */:
            case 127 /* GetAccessor */:
            case 128 /* SetAccessor */:
            case 150 /* FunctionExpression */:
            case 184 /* FunctionDeclaration */:
            case 151 /* ArrowFunction */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.questionToken) ||
                    children(node.typeParameters) ||
                    children(node.parameters) ||
                    child(node.type) ||
                    child(node.body);
            case 132 /* TypeReference */:
                return child(node.typeName) ||
                    children(node.typeArguments);
            case 135 /* TypeQuery */:
                return child(node.exprName);
            case 136 /* TypeLiteral */:
                return children(node.members);
            case 137 /* ArrayType */:
                return child(node.elementType);
            case 138 /* TupleType */:
                return children(node.elementTypes);
            case 139 /* UnionType */:
                return children(node.types);
            case 140 /* ParenthesizedType */:
                return child(node.type);
            case 141 /* ArrayLiteralExpression */:
                return children(node.elements);
            case 142 /* ObjectLiteralExpression */:
                return children(node.properties);
            case 143 /* PropertyAccessExpression */:
                return child(node.expression) ||
                    child(node.name);
            case 144 /* ElementAccessExpression */:
                return child(node.expression) ||
                    child(node.argumentExpression);
            case 145 /* CallExpression */:
            case 146 /* NewExpression */:
                return child(node.expression) ||
                    children(node.typeArguments) ||
                    children(node.arguments);
            case 147 /* TaggedTemplateExpression */:
                return child(node.tag) ||
                    child(node.template);
            case 148 /* TypeAssertionExpression */:
                return child(node.type) ||
                    child(node.expression);
            case 149 /* ParenthesizedExpression */:
                return child(node.expression);
            case 152 /* DeleteExpression */:
                return child(node.expression);
            case 153 /* TypeOfExpression */:
                return child(node.expression);
            case 154 /* VoidExpression */:
                return child(node.expression);
            case 155 /* PrefixUnaryExpression */:
                return child(node.operand);
            case 156 /* PostfixUnaryExpression */:
                return child(node.operand);
            case 157 /* BinaryExpression */:
                return child(node.left) ||
                    child(node.right);
            case 158 /* ConditionalExpression */:
                return child(node.condition) ||
                    child(node.whenTrue) ||
                    child(node.whenFalse);
            case 163 /* Block */:
            case 180 /* TryBlock */:
            case 181 /* FinallyBlock */:
            case 190 /* ModuleBlock */:
                return children(node.statements);
            case 201 /* SourceFile */:
                return children(node.statements) ||
                    child(node.endOfFileToken);
            case 164 /* VariableStatement */:
                return children(node.modifiers) ||
                    children(node.declarations);
            case 166 /* ExpressionStatement */:
                return child(node.expression);
            case 167 /* IfStatement */:
                return child(node.expression) ||
                    child(node.thenStatement) ||
                    child(node.elseStatement);
            case 168 /* DoStatement */:
                return child(node.statement) ||
                    child(node.expression);
            case 169 /* WhileStatement */:
                return child(node.expression) ||
                    child(node.statement);
            case 170 /* ForStatement */:
                return children(node.declarations) ||
                    child(node.initializer) ||
                    child(node.condition) ||
                    child(node.iterator) ||
                    child(node.statement);
            case 171 /* ForInStatement */:
                return children(node.declarations) ||
                    child(node.variable) ||
                    child(node.expression) ||
                    child(node.statement);
            case 172 /* ContinueStatement */:
            case 173 /* BreakStatement */:
                return child(node.label);
            case 174 /* ReturnStatement */:
                return child(node.expression);
            case 175 /* WithStatement */:
                return child(node.expression) ||
                    child(node.statement);
            case 176 /* SwitchStatement */:
                return child(node.expression) ||
                    children(node.clauses);
            case 194 /* CaseClause */:
                return child(node.expression) ||
                    children(node.statements);
            case 195 /* DefaultClause */:
                return children(node.statements);
            case 177 /* LabeledStatement */:
                return child(node.label) ||
                    child(node.statement);
            case 178 /* ThrowStatement */:
                return child(node.expression);
            case 179 /* TryStatement */:
                return child(node.tryBlock) ||
                    child(node.catchClause) ||
                    child(node.finallyBlock);
            case 197 /* CatchClause */:
                return child(node.name) ||
                    child(node.type) ||
                    child(node.block);
            case 183 /* VariableDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.type) ||
                    child(node.initializer);
            case 185 /* ClassDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    children(node.typeParameters) ||
                    children(node.heritageClauses) ||
                    children(node.members);
            case 186 /* InterfaceDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    children(node.typeParameters) ||
                    children(node.heritageClauses) ||
                    children(node.members);
            case 187 /* TypeAliasDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.type);
            case 188 /* EnumDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    children(node.members);
            case 200 /* EnumMember */:
                return child(node.name) ||
                    child(node.initializer);
            case 189 /* ModuleDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.body);
            case 191 /* ImportDeclaration */:
                return children(node.modifiers) ||
                    child(node.name) ||
                    child(node.moduleReference);
            case 192 /* ExportAssignment */:
                return children(node.modifiers) ||
                    child(node.exportName);
            case 159 /* TemplateExpression */:
                return child(node.head) || children(node.templateSpans);
            case 162 /* TemplateSpan */:
                return child(node.expression) || child(node.literal);
            case 121 /* ComputedPropertyName */:
                return child(node.expression);
            case 196 /* HeritageClause */:
                return children(node.types);
            case 193 /* ExternalModuleReference */:
                return child(node.expression);
        }
    }
    ts.forEachChild = forEachChild;
    // TODO (drosen, mhegazy): Move to a more appropriate file.
    function createCompilerHost(options) {
        var currentDirectory;
        var existingDirectories = {};
        function getCanonicalFileName(fileName) {
            // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
            // otherwise use toLowerCase as a canonical form.
            return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
        }
        // returned by CScript sys environment
        var unsupportedFileEncodingErrorCode = -2147024809;
        function getSourceFile(filename, languageVersion, onError) {
            try {
                var text = ts.sys.readFile(filename, options.charset);
            }
            catch (e) {
                if (onError) {
                    onError(e.number === unsupportedFileEncodingErrorCode ?
                        ts.createCompilerDiagnostic(ts.Diagnostics.Unsupported_file_encoding).messageText :
                        e.message);
                }
                text = "";
            }
            return text !== undefined ? createSourceFile(filename, text, languageVersion, "0") : undefined;
        }
        function writeFile(fileName, data, writeByteOrderMark, onError) {
            function directoryExists(directoryPath) {
                if (ts.hasProperty(existingDirectories, directoryPath)) {
                    return true;
                }
                if (ts.sys.directoryExists(directoryPath)) {
                    existingDirectories[directoryPath] = true;
                    return true;
                }
                return false;
            }
            function ensureDirectoriesExist(directoryPath) {
                if (directoryPath.length > ts.getRootLength(directoryPath) && !directoryExists(directoryPath)) {
                    var parentDirectory = ts.getDirectoryPath(directoryPath);
                    ensureDirectoriesExist(parentDirectory);
                    ts.sys.createDirectory(directoryPath);
                }
            }
            try {
                ensureDirectoriesExist(ts.getDirectoryPath(ts.normalizePath(fileName)));
                ts.sys.writeFile(fileName, data, writeByteOrderMark);
            }
            catch (e) {
                if (onError) {
                    onError(e.message);
                }
            }
        }
        return {
            getSourceFile: getSourceFile,
            getDefaultLibFilename: function (options) { return ts.combinePaths(ts.getDirectoryPath(ts.normalizePath(ts.sys.getExecutingFilePath())), options.target === 2 /* ES6 */ ? "lib.es6.d.ts" : "lib.d.ts"); },
            writeFile: writeFile,
            getCurrentDirectory: function () { return currentDirectory || (currentDirectory = ts.sys.getCurrentDirectory()); },
            useCaseSensitiveFileNames: function () { return ts.sys.useCaseSensitiveFileNames; },
            getCanonicalFileName: getCanonicalFileName,
            getNewLine: function () { return ts.sys.newLine; }
        };
    }
    ts.createCompilerHost = createCompilerHost;
    function parsingContextErrors(context) {
        switch (context) {
            case 0 /* SourceElements */: return ts.Diagnostics.Declaration_or_statement_expected;
            case 1 /* ModuleElements */: return ts.Diagnostics.Declaration_or_statement_expected;
            case 2 /* BlockStatements */: return ts.Diagnostics.Statement_expected;
            case 3 /* SwitchClauses */: return ts.Diagnostics.case_or_default_expected;
            case 4 /* SwitchClauseStatements */: return ts.Diagnostics.Statement_expected;
            case 5 /* TypeMembers */: return ts.Diagnostics.Property_or_signature_expected;
            case 6 /* ClassMembers */: return ts.Diagnostics.Unexpected_token_A_constructor_method_accessor_or_property_was_expected;
            case 7 /* EnumMembers */: return ts.Diagnostics.Enum_member_expected;
            case 8 /* TypeReferences */: return ts.Diagnostics.Type_reference_expected;
            case 9 /* VariableDeclarations */: return ts.Diagnostics.Variable_declaration_expected;
            case 10 /* ArgumentExpressions */: return ts.Diagnostics.Argument_expression_expected;
            case 11 /* ObjectLiteralMembers */: return ts.Diagnostics.Property_assignment_expected;
            case 12 /* ArrayLiteralMembers */: return ts.Diagnostics.Expression_or_comma_expected;
            case 13 /* Parameters */: return ts.Diagnostics.Parameter_declaration_expected;
            case 14 /* TypeParameters */: return ts.Diagnostics.Type_parameter_declaration_expected;
            case 15 /* TypeArguments */: return ts.Diagnostics.Type_argument_expected;
            case 16 /* TupleElementTypes */: return ts.Diagnostics.Type_expected;
            case 17 /* HeritageClauses */: return ts.Diagnostics.Unexpected_token_expected;
        }
    }
    ;
    function modifierToFlag(token) {
        switch (token) {
            case 107 /* StaticKeyword */: return 128 /* Static */;
            case 106 /* PublicKeyword */: return 16 /* Public */;
            case 105 /* ProtectedKeyword */: return 64 /* Protected */;
            case 104 /* PrivateKeyword */: return 32 /* Private */;
            case 76 /* ExportKeyword */: return 1 /* Export */;
            case 112 /* DeclareKeyword */: return 2 /* Ambient */;
            case 68 /* ConstKeyword */: return 4096 /* Const */;
        }
        return 0;
    }
    function isEvalOrArgumentsIdentifier(node) {
        return node.kind === 63 /* Identifier */ &&
            (node.text === "eval" || node.text === "arguments");
    }
    /// Should be called only on prologue directives (isPrologueDirective(node) should be true)
    function isUseStrictPrologueDirective(sourceFile, node) {
        ts.Debug.assert(ts.isPrologueDirective(node));
        var nodeText = ts.getSourceTextOfNodeFromSourceFile(sourceFile, node.expression);
        return nodeText === '"use strict"' || nodeText === "'use strict'";
    }
    function createSourceFile(filename, sourceText, languageVersion, version, isOpen) {
        if (isOpen === void 0) { isOpen = false; }
        var token;
        var parsingContext;
        var identifiers = {};
        var identifierCount = 0;
        var nodeCount = 0;
        var lineStarts;
        // Flags that dictate what parsing context we're in.  For example:
        // Whether or not we are in strict parsing mode.  All that changes in strict parsing mode is
        // that some tokens that would be considered identifiers may be considered keywords.  When 
        // rewinding, we need to store and restore this as the mode may have changed.
        //
        // When adding more parser context flags, consider which is the more common case that the 
        // flag will be in.  This should be hte 'false' state for that flag.  The reason for this is
        // that we don't store data in our nodes unless the value is in the *non-default* state.  So,
        // for example, more often than code 'allows-in' (or doesn't 'disallow-in').  We opt for 
        // 'disallow-in' set to 'false'.  Otherwise, if we had 'allowsIn' set to 'true', then almost
        // all nodes would need extra state on them to store this info.
        //
        // Note:  'allowIn' and 'allowYield' track 1:1 with the [in] and [yield] concepts in the ES6
        // grammar specification.
        //
        // An important thing about these context concepts.  By default they are effectively inherited
        // while parsing through every grammar production.  i.e. if you don't change them, then when
        // you parse a sub-production, it will have the same context values as hte parent production.
        // This is great most of the time.  After all, consider all the 'expression' grammar productions
        // and how nearly all of them pass along the 'in' and 'yield' context values:
        //
        // EqualityExpression[In, Yield] :
        //      RelationalExpression[?In, ?Yield]
        //      EqualityExpression[?In, ?Yield] == RelationalExpression[?In, ?Yield]
        //      EqualityExpression[?In, ?Yield] != RelationalExpression[?In, ?Yield]
        //      EqualityExpression[?In, ?Yield] === RelationalExpression[?In, ?Yield]
        //      EqualityExpression[?In, ?Yield] !== RelationalExpression[?In, ?Yield]
        //
        // Where you have to be careful is then understanding what the points are in the grammar 
        // where the values are *not* passed along.  For example:
        //
        // SingleNameBinding[Yield,GeneratorParameter]
        //      [+GeneratorParameter]BindingIdentifier[Yield] Initializer[In]opt
        //      [~GeneratorParameter]BindingIdentifier[?Yield]Initializer[In, ?Yield]opt
        //
        // Here this is saying that if the GeneratorParameter context flag is set, that we should 
        // explicitly set the 'yield' context flag to false before calling into the BindingIdentifier
        // and we should explicitly unset the 'yield' context flag before calling into the Initializer.
        // production.  Conversely, if the GeneratorParameter context flag is not set, then we 
        // should leave the 'yield' context flag alone.
        //
        // Getting this all correct is tricky and requires careful reading of the grammar to 
        // understand when these values should be changed versus when they should be inherited.
        //
        // Note: it should not be necessary to save/restore these flags during speculative/lookahead
        // parsing.  These context flags are naturally stored and restored through normal recursive
        // descent parsing and unwinding.
        var contextFlags = 0;
        // Whether or not we've had a parse error since creating the last AST node.  If we have 
        // encountered an error, it will be stored on the next AST node we create.  Parse errors
        // can be broken down into three categories:
        //
        // 1) An error that occurred during scanning.  For example, an unterminated literal, or a
        //    character that was completely not understood.
        //
        // 2) A token was expected, but was not present.  This type of error is commonly produced
        //    by the 'parseExpected' function.
        //
        // 3) A token was present that no parsing function was able to consume.  This type of error
        //    only occurs in the 'abortParsingListOrMoveToNextToken' function when the parser 
        //    decides to skip the token.
        //
        // In all of these cases, we want to mark the next node as having had an error before it.
        // With this mark, we can know in incremental settings if this node can be reused, or if
        // we have to reparse it.  If we don't keep this information around, we may just reuse the
        // node.  in that event we would then not produce the same errors as we did before, causing
        // significant confusion problems.
        //
        // Note: it is necessary that this value be saved/restored during speculative/lookahead 
        // parsing.  During lookahead parsing, we will often create a node.  That node will have 
        // this value attached, and then this value will be set back to 'false'.  If we decide to
        // rewind, we must get back to the same value we had prior to the lookahead.
        //
        // Note: any errors at the end of the file that do not precede a regular node, should get
        // attached to the EOF token.
        var parseErrorBeforeNextFinishedNode = false;
        function setContextFlag(val, flag) {
            if (val) {
                contextFlags |= flag;
            }
            else {
                contextFlags &= ~flag;
            }
        }
        function setStrictModeContext(val) {
            setContextFlag(val, 1 /* StrictMode */);
        }
        function setDisallowInContext(val) {
            setContextFlag(val, 2 /* DisallowIn */);
        }
        function setYieldContext(val) {
            setContextFlag(val, 4 /* Yield */);
        }
        function setGeneratorParameterContext(val) {
            setContextFlag(val, 8 /* GeneratorParameter */);
        }
        function allowInAnd(func) {
            if (contextFlags & 2 /* DisallowIn */) {
                setDisallowInContext(false);
                var result = func();
                setDisallowInContext(true);
                return result;
            }
            // no need to do anything special if 'in' is already allowed.
            return func();
        }
        function disallowInAnd(func) {
            if (contextFlags & 2 /* DisallowIn */) {
                // no need to do anything special if 'in' is already disallowed.
                return func();
            }
            setDisallowInContext(true);
            var result = func();
            setDisallowInContext(false);
            return result;
        }
        function doInYieldContext(func) {
            if (contextFlags & 4 /* Yield */) {
                // no need to do anything special if we're already in the [Yield] context.
                return func();
            }
            setYieldContext(true);
            var result = func();
            setYieldContext(false);
            return result;
        }
        function doOutsideOfYieldContext(func) {
            if (contextFlags & 4 /* Yield */) {
                setYieldContext(false);
                var result = func();
                setYieldContext(true);
                return result;
            }
            // no need to do anything special if we're not in the [Yield] context.
            return func();
        }
        function inYieldContext() {
            return (contextFlags & 4 /* Yield */) !== 0;
        }
        function inStrictModeContext() {
            return (contextFlags & 1 /* StrictMode */) !== 0;
        }
        function inGeneratorParameterContext() {
            return (contextFlags & 8 /* GeneratorParameter */) !== 0;
        }
        function inDisallowInContext() {
            return (contextFlags & 2 /* DisallowIn */) !== 0;
        }
        function getLineStarts() {
            return lineStarts || (lineStarts = ts.computeLineStarts(sourceText));
        }
        function getLineAndCharacterFromSourcePosition(position) {
            return ts.getLineAndCharacterOfPosition(getLineStarts(), position);
        }
        function getPositionFromSourceLineAndCharacter(line, character) {
            return ts.getPositionFromLineAndCharacter(getLineStarts(), line, character);
        }
        function parseErrorAtCurrentToken(message, arg0) {
            var start = scanner.getTokenPos();
            var length = scanner.getTextPos() - start;
            parseErrorAtPosition(start, length, message, arg0);
        }
        function parseErrorAtPosition(start, length, message, arg0) {
            // Don't report another error if it would just be at the same position as the last error.
            var lastError = ts.lastOrUndefined(sourceFile.parseDiagnostics);
            if (!lastError || start !== lastError.start) {
                sourceFile.parseDiagnostics.push(ts.createFileDiagnostic(sourceFile, start, length, message, arg0));
            }
            // Mark that we've encountered an error.  We'll set an appropriate bit on the next 
            // node we finish so that it can't be reused incrementally.
            parseErrorBeforeNextFinishedNode = true;
        }
        function scanError(message) {
            var pos = scanner.getTextPos();
            parseErrorAtPosition(pos, 0, message);
        }
        function getNodePos() {
            return scanner.getStartPos();
        }
        function getNodeEnd() {
            return scanner.getStartPos();
        }
        function nextToken() {
            return token = scanner.scan();
        }
        function getTokenPos(pos) {
            return ts.skipTrivia(sourceText, pos);
        }
        function reScanGreaterToken() {
            return token = scanner.reScanGreaterToken();
        }
        function reScanSlashToken() {
            return token = scanner.reScanSlashToken();
        }
        function reScanTemplateToken() {
            return token = scanner.reScanTemplateToken();
        }
        function speculationHelper(callback, isLookAhead) {
            // Keep track of the state we'll need to rollback to if lookahead fails (or if the 
            // caller asked us to always reset our state).
            var saveToken = token;
            var saveParseDiagnosticsLength = sourceFile.parseDiagnostics.length;
            var saveParseErrorBeforeNextFinishedNode = parseErrorBeforeNextFinishedNode;
            // Note: it is not actually necessary to save/restore the context flags here.  That's
            // because the saving/restorating of these flags happens naturally through the recursive
            // descent nature of our parser.  However, we still store this here just so we can 
            // assert that that invariant holds.
            var saveContextFlags = contextFlags;
            // If we're only looking ahead, then tell the scanner to only lookahead as well.
            // Otherwise, if we're actually speculatively parsing, then tell the scanner to do the 
            // same. 
            var result = isLookAhead
                ? scanner.lookAhead(callback)
                : scanner.tryScan(callback);
            ts.Debug.assert(saveContextFlags === contextFlags);
            // If our callback returned something 'falsy' or we're just looking ahead,
            // then unconditionally restore us to where we were.
            if (!result || isLookAhead) {
                token = saveToken;
                sourceFile.parseDiagnostics.length = saveParseDiagnosticsLength;
                parseErrorBeforeNextFinishedNode = saveParseErrorBeforeNextFinishedNode;
            }
            return result;
        }
        // Invokes the provided callback then unconditionally restores the parser to the state it 
        // was in immediately prior to invoking the callback.  The result of invoking the callback
        // is returned from this function.
        function lookAhead(callback) {
            return speculationHelper(callback, true);
        }
        // Invokes the provided callback.  If the callback returns something falsy, then it restores
        // the parser to the state it was in immediately prior to invoking the callback.  If the 
        // callback returns something truthy, then the parser state is not rolled back.  The result
        // of invoking the callback is returned from this function.
        function tryParse(callback) {
            return speculationHelper(callback, false);
        }
        function isIdentifier() {
            if (token === 63 /* Identifier */) {
                return true;
            }
            // If we have a 'yield' keyword, and we're in the [yield] context, then 'yield' is 
            // considered a keyword and is not an identifier.
            if (token === 108 /* YieldKeyword */ && inYieldContext()) {
                return false;
            }
            return inStrictModeContext() ? token > 108 /* LastFutureReservedWord */ : token > 99 /* LastReservedWord */;
        }
        function parseExpected(kind, diagnosticMessage, arg0) {
            if (token === kind) {
                nextToken();
                return true;
            }
            // Report specific message if provided with one.  Otherwise, report generic fallback message.
            if (diagnosticMessage) {
                parseErrorAtCurrentToken(diagnosticMessage, arg0);
            }
            else {
                parseErrorAtCurrentToken(ts.Diagnostics._0_expected, ts.tokenToString(kind));
            }
            return false;
        }
        function parseOptional(t) {
            if (token === t) {
                nextToken();
                return true;
            }
            return false;
        }
        function parseOptionalToken(t) {
            if (token === t) {
                var node = createNode(t);
                nextToken();
                return finishNode(node);
            }
            return undefined;
        }
        function canParseSemicolon() {
            // If there's a real semicolon, then we can always parse it out.
            if (token === 21 /* SemicolonToken */) {
                return true;
            }
            // We can parse out an optional semicolon in ASI cases in the following cases.
            return token === 14 /* CloseBraceToken */ || token === 1 /* EndOfFileToken */ || scanner.hasPrecedingLineBreak();
        }
        function parseSemicolon(diagnosticMessage) {
            if (canParseSemicolon()) {
                if (token === 21 /* SemicolonToken */) {
                    // consume the semicolon if it was explicitly provided.
                    nextToken();
                }
                return true;
            }
            else {
                return parseExpected(21 /* SemicolonToken */, diagnosticMessage);
            }
        }
        function createNode(kind, pos) {
            nodeCount++;
            var node = new (nodeConstructors[kind] || (nodeConstructors[kind] = ts.objectAllocator.getNodeConstructor(kind)))();
            if (!(pos >= 0)) {
                pos = scanner.getStartPos();
            }
            node.pos = pos;
            node.end = pos;
            return node;
        }
        function finishNode(node) {
            node.end = scanner.getStartPos();
            if (contextFlags) {
                node.parserContextFlags = contextFlags;
            }
            // Keep track on the node if we encountered an error while parsing it.  If we did, then
            // we cannot reuse the node incrementally.  Once we've marked this node, clear out the
            // flag so that we don't mark any subsequent nodes.
            if (parseErrorBeforeNextFinishedNode) {
                parseErrorBeforeNextFinishedNode = false;
                node.parserContextFlags |= 16 /* ContainsError */;
            }
            return node;
        }
        function createMissingNode(kind, reportAtCurrentPosition, diagnosticMessage, arg0) {
            if (reportAtCurrentPosition) {
                parseErrorAtPosition(scanner.getStartPos(), 0, diagnosticMessage, arg0);
            }
            else {
                parseErrorAtCurrentToken(diagnosticMessage, arg0);
            }
            var result = createNode(kind, scanner.getStartPos());
            result.text = "";
            return finishNode(result);
        }
        function internIdentifier(text) {
            text = ts.escapeIdentifier(text);
            return ts.hasProperty(identifiers, text) ? identifiers[text] : (identifiers[text] = text);
        }
        // An identifier that starts with two underscores has an extra underscore character prepended to it to avoid issues
        // with magic property names like '__proto__'. The 'identifiers' object is used to share a single string instance for
        // each identifier in order to reduce memory consumption.
        function createIdentifier(isIdentifier, diagnosticMessage) {
            identifierCount++;
            if (isIdentifier) {
                var node = createNode(63 /* Identifier */);
                node.text = internIdentifier(scanner.getTokenValue());
                nextToken();
                return finishNode(node);
            }
            return createMissingNode(63 /* Identifier */, false, diagnosticMessage || ts.Diagnostics.Identifier_expected);
        }
        function parseIdentifier(diagnosticMessage) {
            return createIdentifier(isIdentifier(), diagnosticMessage);
        }
        function parseIdentifierName() {
            return createIdentifier(isIdentifierOrKeyword());
        }
        function isLiteralPropertyName() {
            return isIdentifierOrKeyword() ||
                token === 7 /* StringLiteral */ ||
                token === 6 /* NumericLiteral */;
        }
        function parsePropertyName() {
            if (token === 7 /* StringLiteral */ || token === 6 /* NumericLiteral */) {
                return parseLiteralNode(true);
            }
            if (token === 17 /* OpenBracketToken */) {
                return parseComputedPropertyName();
            }
            return parseIdentifierName();
        }
        function parseComputedPropertyName() {
            // PropertyName[Yield,GeneratorParameter] :
            //     LiteralPropertyName
            //     [+GeneratorParameter] ComputedPropertyName
            //     [~GeneratorParameter] ComputedPropertyName[?Yield]
            // 
            // ComputedPropertyName[Yield] :
            //     [ AssignmentExpression[In, ?Yield] ]
            //
            var node = createNode(121 /* ComputedPropertyName */);
            parseExpected(17 /* OpenBracketToken */);
            // We parse any expression (including a comma expression). But the grammar
            // says that only an assignment expression is allowed, so the grammar checker
            // will error if it sees a comma expression.
            var yieldContext = inYieldContext();
            if (inGeneratorParameterContext()) {
                setYieldContext(false);
            }
            node.expression = allowInAnd(parseExpression);
            if (inGeneratorParameterContext()) {
                setYieldContext(yieldContext);
            }
            parseExpected(18 /* CloseBracketToken */);
            return finishNode(node);
        }
        function parseContextualModifier(t) {
            return token === t && tryParse(nextTokenCanFollowModifier);
        }
        function nextTokenCanFollowModifier() {
            nextToken();
            return canFollowModifier();
        }
        function parseAnyContextualModifier() {
            return ts.isModifier(token) && tryParse(nextTokenCanFollowContextualModifier);
        }
        function nextTokenCanFollowContextualModifier() {
            if (token === 68 /* ConstKeyword */) {
                // 'const' is only a modifier if followed by 'enum'.
                return nextToken() === 75 /* EnumKeyword */;
            }
            nextToken();
            return canFollowModifier();
        }
        function canFollowModifier() {
            return token === 17 /* OpenBracketToken */ || token === 34 /* AsteriskToken */ || isLiteralPropertyName();
        }
        // True if positioned at the start of a list element
        function isListElement(kind, inErrorRecovery) {
            switch (kind) {
                case 0 /* SourceElements */:
                case 1 /* ModuleElements */:
                    return isSourceElement(inErrorRecovery);
                case 2 /* BlockStatements */:
                case 4 /* SwitchClauseStatements */:
                    return isStatement(inErrorRecovery);
                case 3 /* SwitchClauses */:
                    return token === 65 /* CaseKeyword */ || token === 71 /* DefaultKeyword */;
                case 5 /* TypeMembers */:
                    return isStartOfTypeMember();
                case 6 /* ClassMembers */:
                    return lookAhead(isClassMemberStart);
                case 7 /* EnumMembers */:
                    // Include open bracket computed properties. This technically also lets in indexers,
                    // which would be a candidate for improved error reporting.
                    return token === 17 /* OpenBracketToken */ || isLiteralPropertyName();
                case 11 /* ObjectLiteralMembers */:
                    return token === 17 /* OpenBracketToken */ || token === 34 /* AsteriskToken */ || isLiteralPropertyName();
                case 8 /* TypeReferences */:
                    // We want to make sure that the "extends" in "extends foo" or the "implements" in
                    // "implements foo" is not considered a type name.
                    return isIdentifier() && !isNotHeritageClauseTypeName();
                case 9 /* VariableDeclarations */:
                case 14 /* TypeParameters */:
                    return isIdentifier();
                case 10 /* ArgumentExpressions */:
                    return token === 22 /* CommaToken */ || isStartOfExpression();
                case 12 /* ArrayLiteralMembers */:
                    return token === 22 /* CommaToken */ || isStartOfExpression();
                case 13 /* Parameters */:
                    return isStartOfParameter();
                case 15 /* TypeArguments */:
                case 16 /* TupleElementTypes */:
                    return token === 22 /* CommaToken */ || isStartOfType();
                case 17 /* HeritageClauses */:
                    return isHeritageClause();
            }
            ts.Debug.fail("Non-exhaustive case in 'isListElement'.");
        }
        function nextTokenIsIdentifier() {
            nextToken();
            return isIdentifier();
        }
        function isNotHeritageClauseTypeName() {
            if (token === 100 /* ImplementsKeyword */ ||
                token === 77 /* ExtendsKeyword */) {
                return lookAhead(nextTokenIsIdentifier);
            }
            return false;
        }
        // True if positioned at a list terminator
        function isListTerminator(kind) {
            if (token === 1 /* EndOfFileToken */) {
                // Being at the end of the file ends all lists.
                return true;
            }
            switch (kind) {
                case 1 /* ModuleElements */:
                case 2 /* BlockStatements */:
                case 3 /* SwitchClauses */:
                case 5 /* TypeMembers */:
                case 6 /* ClassMembers */:
                case 7 /* EnumMembers */:
                case 11 /* ObjectLiteralMembers */:
                    return token === 14 /* CloseBraceToken */;
                case 4 /* SwitchClauseStatements */:
                    return token === 14 /* CloseBraceToken */ || token === 65 /* CaseKeyword */ || token === 71 /* DefaultKeyword */;
                case 8 /* TypeReferences */:
                    return token === 13 /* OpenBraceToken */ || token === 77 /* ExtendsKeyword */ || token === 100 /* ImplementsKeyword */;
                case 9 /* VariableDeclarations */:
                    return isVariableDeclaratorListTerminator();
                case 14 /* TypeParameters */:
                    // Tokens other than '>' are here for better error recovery
                    return token === 24 /* GreaterThanToken */ || token === 15 /* OpenParenToken */ || token === 13 /* OpenBraceToken */ || token === 77 /* ExtendsKeyword */ || token === 100 /* ImplementsKeyword */;
                case 10 /* ArgumentExpressions */:
                    // Tokens other than ')' are here for better error recovery
                    return token === 16 /* CloseParenToken */ || token === 21 /* SemicolonToken */;
                case 12 /* ArrayLiteralMembers */:
                case 16 /* TupleElementTypes */:
                    return token === 18 /* CloseBracketToken */;
                case 13 /* Parameters */:
                    // Tokens other than ')' and ']' (the latter for index signatures) are here for better error recovery
                    return token === 16 /* CloseParenToken */ || token === 18 /* CloseBracketToken */ || token === 13 /* OpenBraceToken */;
                case 15 /* TypeArguments */:
                    // Tokens other than '>' are here for better error recovery
                    return token === 24 /* GreaterThanToken */ || token === 15 /* OpenParenToken */;
                case 17 /* HeritageClauses */:
                    return token === 13 /* OpenBraceToken */ || token === 14 /* CloseBraceToken */;
            }
        }
        function isVariableDeclaratorListTerminator() {
            // If we can consume a semicolon (either explicitly, or with ASI), then consider us done 
            // with parsing the list of  variable declarators.
            if (canParseSemicolon()) {
                return true;
            }
            // in the case where we're parsing the variable declarator of a 'for-in' statement, we 
            // are done if we see an 'in' keyword in front of us.
            if (token === 84 /* InKeyword */) {
                return true;
            }
            // ERROR RECOVERY TWEAK:
            // For better error recovery, if we see an '=>' then we just stop immediately.  We've got an
            // arrow function here and it's going to be very unlikely that we'll resynchronize and get
            // another variable declaration.
            if (token === 31 /* EqualsGreaterThanToken */) {
                return true;
            }
            // Keep trying to parse out variable declarators.
            return false;
        }
        // True if positioned at element or terminator of the current list or any enclosing list
        function isInSomeParsingContext() {
            for (var kind = 0; kind < 18 /* Count */; kind++) {
                if (parsingContext & (1 << kind)) {
                    if (isListElement(kind, true) || isListTerminator(kind)) {
                        return true;
                    }
                }
            }
            return false;
        }
        // Parses a list of elements
        function parseList(kind, checkForStrictMode, parseElement) {
            var saveParsingContext = parsingContext;
            parsingContext |= 1 << kind;
            var result = [];
            result.pos = getNodePos();
            var savedStrictModeContext = inStrictModeContext();
            while (!isListTerminator(kind)) {
                if (isListElement(kind, false)) {
                    var element = parseElement();
                    result.push(element);
                    // test elements only if we are not already in strict mode
                    if (checkForStrictMode && !inStrictModeContext()) {
                        if (ts.isPrologueDirective(element)) {
                            if (isUseStrictPrologueDirective(sourceFile, element)) {
                                setStrictModeContext(true);
                                checkForStrictMode = false;
                            }
                        }
                        else {
                            checkForStrictMode = false;
                        }
                    }
                    continue;
                }
                if (abortParsingListOrMoveToNextToken(kind)) {
                    break;
                }
            }
            setStrictModeContext(savedStrictModeContext);
            result.end = getNodeEnd();
            parsingContext = saveParsingContext;
            return result;
        }
        // Returns true if we should abort parsing.
        function abortParsingListOrMoveToNextToken(kind) {
            parseErrorAtCurrentToken(parsingContextErrors(kind));
            if (isInSomeParsingContext()) {
                return true;
            }
            nextToken();
            return false;
        }
        // Parses a comma-delimited list of elements
        function parseDelimitedList(kind, parseElement) {
            var saveParsingContext = parsingContext;
            parsingContext |= 1 << kind;
            var result = [];
            result.pos = getNodePos();
            var commaStart = -1; // Meaning the previous token was not a comma
            while (true) {
                if (isListElement(kind, false)) {
                    result.push(parseElement());
                    commaStart = scanner.getTokenPos();
                    if (parseOptional(22 /* CommaToken */)) {
                        continue;
                    }
                    commaStart = -1; // Back to the state where the last token was not a comma
                    if (isListTerminator(kind)) {
                        break;
                    }
                    parseExpected(22 /* CommaToken */);
                    continue;
                }
                if (isListTerminator(kind)) {
                    break;
                }
                if (abortParsingListOrMoveToNextToken(kind)) {
                    break;
                }
            }
            // Recording the trailing comma is deliberately done after the previous
            // loop, and not just if we see a list terminator. This is because the list
            // may have ended incorrectly, but it is still important to know if there
            // was a trailing comma.
            // Check if the last token was a comma.
            if (commaStart >= 0) {
                // Always preserve a trailing comma by marking it on the NodeArray
                result.hasTrailingComma = true;
            }
            result.end = getNodeEnd();
            parsingContext = saveParsingContext;
            return result;
        }
        function createMissingList() {
            var pos = getNodePos();
            var result = [];
            result.pos = pos;
            result.end = pos;
            return result;
        }
        function parseBracketedList(kind, parseElement, open, close) {
            if (parseExpected(open)) {
                var result = parseDelimitedList(kind, parseElement);
                parseExpected(close);
                return result;
            }
            return createMissingList();
        }
        // The allowReservedWords parameter controls whether reserved words are permitted after the first dot
        function parseEntityName(allowReservedWords, diagnosticMessage) {
            var entity = parseIdentifier(diagnosticMessage);
            while (parseOptional(19 /* DotToken */)) {
                var node = createNode(120 /* QualifiedName */, entity.pos);
                node.left = entity;
                node.right = parseRightSideOfDot(allowReservedWords);
                entity = finishNode(node);
            }
            return entity;
        }
        function parseRightSideOfDot(allowIdentifierNames) {
            // Technically a keyword is valid here as all keywords are identifier names.
            // However, often we'll encounter this in error situations when the keyword
            // is actually starting another valid construct.
            //
            // So, we check for the following specific case:
            //
            //      name.
            //      keyword identifierNameOrKeyword
            //
            // Note: the newlines are important here.  For example, if that above code 
            // were rewritten into:
            //
            //      name.keyword
            //      identifierNameOrKeyword
            //
            // Then we would consider it valid.  That's because ASI would take effect and
            // the code would be implicitly: "name.keyword; identifierNameOrKeyword".  
            // In the first case though, ASI will not take effect because there is not a
            // line terminator after the keyword.
            if (scanner.hasPrecedingLineBreak() && scanner.isReservedWord()) {
                var matchesPattern = lookAhead(nextTokenIsIdentifierOrKeywordOnSameLine);
                if (matchesPattern) {
                    // Report that we need an identifier.  However, report it right after the dot, 
                    // and not on the next token.  This is because the next token might actually 
                    // be an identifier and the error woudl be quite confusing.
                    return createMissingNode(63 /* Identifier */, true, ts.Diagnostics.Identifier_expected);
                }
            }
            return allowIdentifierNames ? parseIdentifierName() : parseIdentifier();
        }
        function parseTokenNode() {
            var node = createNode(token);
            nextToken();
            return finishNode(node);
        }
        function parseTemplateExpression() {
            var template = createNode(159 /* TemplateExpression */);
            template.head = parseLiteralNode();
            ts.Debug.assert(template.head.kind === 10 /* TemplateHead */, "Template head has wrong token kind");
            var templateSpans = [];
            templateSpans.pos = getNodePos();
            do {
                templateSpans.push(parseTemplateSpan());
            } while (templateSpans[templateSpans.length - 1].literal.kind === 11 /* TemplateMiddle */);
            templateSpans.end = getNodeEnd();
            template.templateSpans = templateSpans;
            return finishNode(template);
        }
        function parseTemplateSpan() {
            var span = createNode(162 /* TemplateSpan */);
            span.expression = allowInAnd(parseExpression);
            var literal;
            if (token === 14 /* CloseBraceToken */) {
                reScanTemplateToken();
                literal = parseLiteralNode();
            }
            else {
                literal = createMissingNode(12 /* TemplateTail */, false, ts.Diagnostics._0_expected, ts.tokenToString(14 /* CloseBraceToken */));
            }
            span.literal = literal;
            return finishNode(span);
        }
        function parseLiteralNode(internName) {
            var node = createNode(token);
            var text = scanner.getTokenValue();
            node.text = internName ? internIdentifier(text) : text;
            if (scanner.isUnterminated()) {
                node.isUnterminated = true;
            }
            var tokenPos = scanner.getTokenPos();
            nextToken();
            finishNode(node);
            // Octal literals are not allowed in strict mode or ES5
            // Note that theoretically the following condition would hold true literals like 009,
            // which is not octal.But because of how the scanner separates the tokens, we would
            // never get a token like this. Instead, we would get 00 and 9 as two separate tokens.
            // We also do not need to check for negatives because any prefix operator would be part of a
            // parent unary expression.
            if (node.kind === 6 /* NumericLiteral */
                && sourceText.charCodeAt(tokenPos) === 48 /* _0 */
                && ts.isOctalDigit(sourceText.charCodeAt(tokenPos + 1))) {
                node.flags |= 8192 /* OctalLiteral */;
            }
            return node;
        }
        // TYPES
        function parseTypeReference() {
            var node = createNode(132 /* TypeReference */);
            node.typeName = parseEntityName(false, ts.Diagnostics.Type_expected);
            if (!scanner.hasPrecedingLineBreak() && token === 23 /* LessThanToken */) {
                node.typeArguments = parseBracketedList(15 /* TypeArguments */, parseType, 23 /* LessThanToken */, 24 /* GreaterThanToken */);
            }
            return finishNode(node);
        }
        function parseTypeQuery() {
            var node = createNode(135 /* TypeQuery */);
            parseExpected(95 /* TypeOfKeyword */);
            node.exprName = parseEntityName(true);
            return finishNode(node);
        }
        function parseTypeParameter() {
            var node = createNode(122 /* TypeParameter */);
            node.name = parseIdentifier();
            if (parseOptional(77 /* ExtendsKeyword */)) {
                // It's not uncommon for people to write improper constraints to a generic.  If the 
                // user writes a constraint that is an expression and not an actual type, then parse
                // it out as an expression (so we can recover well), but report that a type is needed
                // instead.
                if (isStartOfType() || !isStartOfExpression()) {
                    node.constraint = parseType();
                }
                else {
                    // It was not a type, and it looked like an expression.  Parse out an expression
                    // here so we recover well.  Note: it is important that we call parseUnaryExpression
                    // and not parseExpression here.  If the user has:
                    //
                    //      <T extends "">
                    //
                    // We do *not* want to consume the  >  as we're consuming the expression for "".
                    node.expression = parseUnaryExpressionOrHigher();
                }
            }
            return finishNode(node);
        }
        function parseTypeParameters() {
            if (token === 23 /* LessThanToken */) {
                return parseBracketedList(14 /* TypeParameters */, parseTypeParameter, 23 /* LessThanToken */, 24 /* GreaterThanToken */);
            }
        }
        function parseParameterType() {
            if (parseOptional(50 /* ColonToken */)) {
                return token === 7 /* StringLiteral */
                    ? parseLiteralNode(true)
                    : parseType();
            }
            return undefined;
        }
        function isStartOfParameter() {
            return token === 20 /* DotDotDotToken */ || isIdentifier() || ts.isModifier(token);
        }
        function setModifiers(node, modifiers) {
            if (modifiers) {
                node.flags |= modifiers.flags;
                node.modifiers = modifiers;
            }
        }
        function parseParameter() {
            var node = createNode(123 /* Parameter */);
            setModifiers(node, parseModifiers());
            node.dotDotDotToken = parseOptionalToken(20 /* DotDotDotToken */);
            // SingleNameBinding[Yield,GeneratorParameter] : See 13.2.3
            //      [+GeneratorParameter]BindingIdentifier[Yield]Initializer[In]opt
            //      [~GeneratorParameter]BindingIdentifier[?Yield]Initializer[In, ?Yield]opt
            node.name = inGeneratorParameterContext()
                ? doInYieldContext(parseIdentifier)
                : parseIdentifier();
            if (ts.getFullWidth(node.name) === 0 && node.flags === 0 && ts.isModifier(token)) {
                // in cases like
                // 'use strict' 
                // function foo(static)
                // isParameter('static') === true, because of isModifier('static')
                // however 'static' is not a legal identifier in a strict mode.
                // so result of this function will be ParameterDeclaration (flags = 0, name = missing, type = undefined, initializer = undefined)
                // and current token will not change => parsing of the enclosing parameter list will last till the end of time (or OOM)
                // to avoid this we'll advance cursor to the next token.
                nextToken();
            }
            node.questionToken = parseOptionalToken(49 /* QuestionToken */);
            node.type = parseParameterType();
            node.initializer = inGeneratorParameterContext()
                ? doOutsideOfYieldContext(parseParameterInitializer)
                : parseParameterInitializer();
            // Do not check for initializers in an ambient context for parameters. This is not
            // a grammar error because the grammar allows arbitrary call signatures in
            // an ambient context.
            // It is actually not necessary for this to be an error at all. The reason is that
            // function/constructor implementations are syntactically disallowed in ambient
            // contexts. In addition, parameter initializers are semantically disallowed in
            // overload signatures. So parameter initializers are transitively disallowed in
            // ambient contexts.
            return finishNode(node);
        }
        function parseParameterInitializer() {
            return parseInitializer(true);
        }
        function fillSignature(returnToken, yieldAndGeneratorParameterContext, requireCompleteParameterList, signature) {
            var returnTokenRequired = returnToken === 31 /* EqualsGreaterThanToken */;
            signature.typeParameters = parseTypeParameters();
            signature.parameters = parseParameterList(yieldAndGeneratorParameterContext, requireCompleteParameterList);
            if (returnTokenRequired) {
                parseExpected(returnToken);
                signature.type = parseType();
            }
            else if (parseOptional(returnToken)) {
                signature.type = parseType();
            }
        }
        // Note: after careful analysis of the grammar, it does not appear to be possible to 
        // have 'Yield' And 'GeneratorParameter' not in sync.  i.e. any production calling
        // this FormalParameters production either always sets both to true, or always sets
        // both to false.  As such we only have a single parameter to represent both.
        function parseParameterList(yieldAndGeneratorParameterContext, requireCompleteParameterList) {
            // FormalParameters[Yield,GeneratorParameter] :
            //      ...
            //
            // FormalParameter[Yield,GeneratorParameter] :
            //      BindingElement[?Yield, ?GeneratorParameter]
            //
            // BindingElement[Yield, GeneratorParameter ] : See 13.2.3
            //      SingleNameBinding[?Yield, ?GeneratorParameter]
            //      [+GeneratorParameter]BindingPattern[?Yield, GeneratorParameter]Initializer[In]opt
            //      [~GeneratorParameter]BindingPattern[?Yield]Initializer[In, ?Yield]opt
            //
            // SingleNameBinding[Yield, GeneratorParameter] : See 13.2.3
            //      [+GeneratorParameter]BindingIdentifier[Yield]Initializer[In]opt
            //      [~GeneratorParameter]BindingIdentifier[?Yield]Initializer[In, ?Yield]opt
            if (parseExpected(15 /* OpenParenToken */)) {
                var savedYieldContext = inYieldContext();
                var savedGeneratorParameterContext = inGeneratorParameterContext();
                setYieldContext(yieldAndGeneratorParameterContext);
                setGeneratorParameterContext(yieldAndGeneratorParameterContext);
                var result = parseDelimitedList(13 /* Parameters */, parseParameter);
                setYieldContext(savedYieldContext);
                setGeneratorParameterContext(savedGeneratorParameterContext);
                if (!parseExpected(16 /* CloseParenToken */) && requireCompleteParameterList) {
                    // Caller insisted that we had to end with a )   We didn't.  So just return
                    // undefined here.
                    return undefined;
                }
                return result;
            }
            // We didn't even have an open paren.  If the caller requires a complete parameter list,
            // we definitely can't provide that.  However, if they're ok with an incomplete one,
            // then just return an empty set of parameters.
            return requireCompleteParameterList ? undefined : createMissingList();
        }
        function parseTypeMemberSemicolon() {
            // Try to parse out an explicit or implicit (ASI) semicolon for a type member.  If we
            // don't have one, then an appropriate error will be reported.
            if (parseSemicolon()) {
                return;
            }
            // If we don't have a semicolon, then the user may have written a comma instead 
            // accidently (pretty easy to do since commas are so prevalent as list separators). So
            // just consume the comma and keep going.  Note: we'll have already reported the error
            // about the missing semicolon above.
            parseOptional(22 /* CommaToken */);
        }
        function parseSignatureMember(kind) {
            var node = createNode(kind);
            if (kind === 130 /* ConstructSignature */) {
                parseExpected(86 /* NewKeyword */);
            }
            fillSignature(50 /* ColonToken */, false, false, node);
            parseTypeMemberSemicolon();
            return finishNode(node);
        }
        function isIndexSignature() {
            if (token !== 17 /* OpenBracketToken */) {
                return false;
            }
            return lookAhead(isUnambiguouslyIndexSignature);
        }
        function isUnambiguouslyIndexSignature() {
            // The only allowed sequence is:
            //
            //   [id:
            //
            // However, for error recovery, we also check the following cases:
            //
            //   [...
            //   [id,
            //   [id?,
            //   [id?:
            //   [id?]
            //   [public id
            //   [private id
            //   [protected id
            //   []
            //
            nextToken();
            if (token === 20 /* DotDotDotToken */ || token === 18 /* CloseBracketToken */) {
                return true;
            }
            if (ts.isModifier(token)) {
                nextToken();
                if (isIdentifier()) {
                    return true;
                }
            }
            else if (!isIdentifier()) {
                return false;
            }
            else {
                // Skip the identifier
                nextToken();
            }
            // A colon signifies a well formed indexer
            // A comma should be a badly formed indexer because comma expressions are not allowed
            // in computed properties.
            if (token === 50 /* ColonToken */ || token === 22 /* CommaToken */) {
                return true;
            }
            // Question mark could be an indexer with an optional property,
            // or it could be a conditional expression in a computed property.
            if (token !== 49 /* QuestionToken */) {
                return false;
            }
            // If any of the following tokens are after the question mark, it cannot
            // be a conditional expression, so treat it as an indexer.
            nextToken();
            return token === 50 /* ColonToken */ || token === 22 /* CommaToken */ || token === 18 /* CloseBracketToken */;
        }
        function parseIndexSignatureDeclaration(fullStart, modifiers) {
            var node = createNode(131 /* IndexSignature */, fullStart);
            setModifiers(node, modifiers);
            node.parameters = parseBracketedList(13 /* Parameters */, parseParameter, 17 /* OpenBracketToken */, 18 /* CloseBracketToken */);
            node.type = parseTypeAnnotation();
            parseTypeMemberSemicolon();
            return finishNode(node);
        }
        function parsePropertyOrMethodSignature() {
            var fullStart = scanner.getStartPos();
            var name = parsePropertyName();
            var questionToken = parseOptionalToken(49 /* QuestionToken */);
            if (token === 15 /* OpenParenToken */ || token === 23 /* LessThanToken */) {
                var method = createNode(125 /* Method */, fullStart);
                method.name = name;
                method.questionToken = questionToken;
                // Method signatues don't exist in expression contexts.  So they have neither
                // [Yield] nor [GeneratorParameter]
                fillSignature(50 /* ColonToken */, false, false, method);
                parseTypeMemberSemicolon();
                return finishNode(method);
            }
            else {
                var property = createNode(124 /* Property */, fullStart);
                property.name = name;
                property.questionToken = questionToken;
                property.type = parseTypeAnnotation();
                parseTypeMemberSemicolon();
                return finishNode(property);
            }
        }
        function isStartOfTypeMember() {
            switch (token) {
                case 15 /* OpenParenToken */:
                case 23 /* LessThanToken */:
                case 17 /* OpenBracketToken */:
                    return true;
                default:
                    return isLiteralPropertyName() && lookAhead(isTypeMemberWithLiteralPropertyName);
            }
        }
        function isTypeMemberWithLiteralPropertyName() {
            nextToken();
            return token === 15 /* OpenParenToken */ ||
                token === 23 /* LessThanToken */ ||
                token === 49 /* QuestionToken */ ||
                token === 50 /* ColonToken */ ||
                canParseSemicolon();
        }
        function parseTypeMember() {
            switch (token) {
                case 15 /* OpenParenToken */:
                case 23 /* LessThanToken */:
                    return parseSignatureMember(129 /* CallSignature */);
                case 17 /* OpenBracketToken */:
                    // Indexer or computed property
                    return isIndexSignature() ? parseIndexSignatureDeclaration(scanner.getStartPos(), undefined) : parsePropertyOrMethodSignature();
                case 86 /* NewKeyword */:
                    if (lookAhead(isStartOfConstructSignature)) {
                        return parseSignatureMember(130 /* ConstructSignature */);
                    }
                // fall through.
                case 7 /* StringLiteral */:
                case 6 /* NumericLiteral */:
                    return parsePropertyOrMethodSignature();
                default:
                    if (isIdentifierOrKeyword()) {
                        return parsePropertyOrMethodSignature();
                    }
            }
        }
        function isStartOfConstructSignature() {
            nextToken();
            return token === 15 /* OpenParenToken */ || token === 23 /* LessThanToken */;
        }
        function parseTypeLiteral() {
            var node = createNode(136 /* TypeLiteral */);
            node.members = parseObjectTypeMembers();
            return finishNode(node);
        }
        function parseObjectTypeMembers() {
            var members;
            if (parseExpected(13 /* OpenBraceToken */)) {
                members = parseList(5 /* TypeMembers */, false, parseTypeMember);
                parseExpected(14 /* CloseBraceToken */);
            }
            else {
                members = createMissingList();
            }
            return members;
        }
        function parseTupleType() {
            var node = createNode(138 /* TupleType */);
            node.elementTypes = parseBracketedList(16 /* TupleElementTypes */, parseType, 17 /* OpenBracketToken */, 18 /* CloseBracketToken */);
            return finishNode(node);
        }
        function parseParenthesizedType() {
            var node = createNode(140 /* ParenthesizedType */);
            parseExpected(15 /* OpenParenToken */);
            node.type = parseType();
            parseExpected(16 /* CloseParenToken */);
            return finishNode(node);
        }
        function parseFunctionOrConstructorType(kind) {
            var node = createNode(kind);
            if (kind === 134 /* ConstructorType */) {
                parseExpected(86 /* NewKeyword */);
            }
            fillSignature(31 /* EqualsGreaterThanToken */, false, false, node);
            return finishNode(node);
        }
        function parseKeywordAndNoDot() {
            var node = parseTokenNode();
            return token === 19 /* DotToken */ ? undefined : node;
        }
        function parseNonArrayType() {
            switch (token) {
                case 109 /* AnyKeyword */:
                case 118 /* StringKeyword */:
                case 116 /* NumberKeyword */:
                case 110 /* BooleanKeyword */:
                    // If these are followed by a dot, then parse these out as a dotted type reference instead.
                    var node = tryParse(parseKeywordAndNoDot);
                    return node || parseTypeReference();
                case 97 /* VoidKeyword */:
                    return parseTokenNode();
                case 95 /* TypeOfKeyword */:
                    return parseTypeQuery();
                case 13 /* OpenBraceToken */:
                    return parseTypeLiteral();
                case 17 /* OpenBracketToken */:
                    return parseTupleType();
                case 15 /* OpenParenToken */:
                    return parseParenthesizedType();
                default:
                    return parseTypeReference();
            }
        }
        function isStartOfType() {
            switch (token) {
                case 109 /* AnyKeyword */:
                case 118 /* StringKeyword */:
                case 116 /* NumberKeyword */:
                case 110 /* BooleanKeyword */:
                case 97 /* VoidKeyword */:
                case 95 /* TypeOfKeyword */:
                case 13 /* OpenBraceToken */:
                case 17 /* OpenBracketToken */:
                case 23 /* LessThanToken */:
                case 86 /* NewKeyword */:
                    return true;
                case 15 /* OpenParenToken */:
                    // Only consider '(' the start of a type if followed by ')', '...', an identifier, a modifier,
                    // or something that starts a type. We don't want to consider things like '(1)' a type.
                    return lookAhead(isStartOfParenthesizedOrFunctionType);
                default:
                    return isIdentifier();
            }
        }
        function isStartOfParenthesizedOrFunctionType() {
            nextToken();
            return token === 16 /* CloseParenToken */ || isStartOfParameter() || isStartOfType();
        }
        function parseArrayTypeOrHigher() {
            var type = parseNonArrayType();
            while (!scanner.hasPrecedingLineBreak() && parseOptional(17 /* OpenBracketToken */)) {
                parseExpected(18 /* CloseBracketToken */);
                var node = createNode(137 /* ArrayType */, type.pos);
                node.elementType = type;
                type = finishNode(node);
            }
            return type;
        }
        function parseUnionTypeOrHigher() {
            var type = parseArrayTypeOrHigher();
            if (token === 43 /* BarToken */) {
                var types = [type];
                types.pos = type.pos;
                while (parseOptional(43 /* BarToken */)) {
                    types.push(parseArrayTypeOrHigher());
                }
                types.end = getNodeEnd();
                var node = createNode(139 /* UnionType */, type.pos);
                node.types = types;
                type = finishNode(node);
            }
            return type;
        }
        function isStartOfFunctionType() {
            if (token === 23 /* LessThanToken */) {
                return true;
            }
            return token === 15 /* OpenParenToken */ && lookAhead(isUnambiguouslyStartOfFunctionType);
        }
        function isUnambiguouslyStartOfFunctionType() {
            nextToken();
            if (token === 16 /* CloseParenToken */ || token === 20 /* DotDotDotToken */) {
                // ( )
                // ( ...
                return true;
            }
            if (isIdentifier() || ts.isModifier(token)) {
                nextToken();
                if (token === 50 /* ColonToken */ || token === 22 /* CommaToken */ ||
                    token === 49 /* QuestionToken */ || token === 51 /* EqualsToken */ ||
                    isIdentifier() || ts.isModifier(token)) {
                    // ( id :
                    // ( id ,
                    // ( id ?
                    // ( id =
                    // ( modifier id
                    return true;
                }
                if (token === 16 /* CloseParenToken */) {
                    nextToken();
                    if (token === 31 /* EqualsGreaterThanToken */) {
                        // ( id ) =>
                        return true;
                    }
                }
            }
            return false;
        }
        function parseType() {
            // The rules about 'yield' only apply to actual code/expression contexts.  They don't
            // apply to 'type' contexts.  So we disable these parameters here before moving on.
            var savedYieldContext = inYieldContext();
            var savedGeneratorParameterContext = inGeneratorParameterContext();
            setYieldContext(false);
            setGeneratorParameterContext(false);
            var result = parseTypeWorker();
            setYieldContext(savedYieldContext);
            setGeneratorParameterContext(savedGeneratorParameterContext);
            return result;
        }
        function parseTypeWorker() {
            if (isStartOfFunctionType()) {
                return parseFunctionOrConstructorType(133 /* FunctionType */);
            }
            if (token === 86 /* NewKeyword */) {
                return parseFunctionOrConstructorType(134 /* ConstructorType */);
            }
            return parseUnionTypeOrHigher();
        }
        function parseTypeAnnotation() {
            return parseOptional(50 /* ColonToken */) ? parseType() : undefined;
        }
        // EXPRESSIONS
        function isStartOfExpression() {
            switch (token) {
                case 91 /* ThisKeyword */:
                case 89 /* SuperKeyword */:
                case 87 /* NullKeyword */:
                case 93 /* TrueKeyword */:
                case 78 /* FalseKeyword */:
                case 6 /* NumericLiteral */:
                case 7 /* StringLiteral */:
                case 9 /* NoSubstitutionTemplateLiteral */:
                case 10 /* TemplateHead */:
                case 15 /* OpenParenToken */:
                case 17 /* OpenBracketToken */:
                case 13 /* OpenBraceToken */:
                case 81 /* FunctionKeyword */:
                case 86 /* NewKeyword */:
                case 35 /* SlashToken */:
                case 55 /* SlashEqualsToken */:
                case 32 /* PlusToken */:
                case 33 /* MinusToken */:
                case 46 /* TildeToken */:
                case 45 /* ExclamationToken */:
                case 72 /* DeleteKeyword */:
                case 95 /* TypeOfKeyword */:
                case 97 /* VoidKeyword */:
                case 37 /* PlusPlusToken */:
                case 38 /* MinusMinusToken */:
                case 23 /* LessThanToken */:
                case 63 /* Identifier */:
                case 108 /* YieldKeyword */:
                    // Yield always starts an expression.  Either it is an identifier (in which case
                    // it is definitely an expression).  Or it's a keyword (either because we're in
                    // a generator, or in strict mode (or both)) and it started a yield expression.
                    return true;
                default:
                    // Error tolerance.  If we see the start of some binary operator, we consider
                    // that the start of an expression.  That way we'll parse out a missing identifier,
                    // give a good message about an identifier being missing, and then consume the
                    // rest of the binary expression.
                    if (isBinaryOperator()) {
                        return true;
                    }
                    return isIdentifier();
            }
        }
        function isStartOfExpressionStatement() {
            // As per the grammar, neither '{' nor 'function' can start an expression statement.
            return token !== 13 /* OpenBraceToken */ && token !== 81 /* FunctionKeyword */ && isStartOfExpression();
        }
        function parseExpression() {
            // Expression[in]:
            //      AssignmentExpression[in] 
            //      Expression[in] , AssignmentExpression[in]
            var expr = parseAssignmentExpressionOrHigher();
            while (parseOptional(22 /* CommaToken */)) {
                expr = makeBinaryExpression(expr, 22 /* CommaToken */, parseAssignmentExpressionOrHigher());
            }
            return expr;
        }
        function parseInitializer(inParameter) {
            if (token !== 51 /* EqualsToken */) {
                // It's not uncommon during typing for the user to miss writing the '=' token.  Check if
                // there is no newline after the last token and if we're on an expression.  If so, parse
                // this as an equals-value clause with a missing equals.
                // NOTE: There are two places where we allow equals-value clauses.  The first is in a 
                // variable declarator.  The second is with a parameter.  For variable declarators
                // it's more likely that a { would be a allowed (as an object literal).  While this
                // is also allowed for parameters, the risk is that we consume the { as an object
                // literal when it really will be for the block following the parameter.
                if (scanner.hasPrecedingLineBreak() || (inParameter && token === 13 /* OpenBraceToken */) || !isStartOfExpression()) {
                    // preceding line break, open brace in a parameter (likely a function body) or current token is not an expression - 
                    // do not try to parse initializer
                    return undefined;
                }
            }
            // Initializer[In, Yield] :
            //     = AssignmentExpression[?In, ?Yield]
            parseExpected(51 /* EqualsToken */);
            return parseAssignmentExpressionOrHigher();
        }
        function parseAssignmentExpressionOrHigher() {
            //  AssignmentExpression[in,yield]:
            //      1) ConditionalExpression[?in,?yield]
            //      2) LeftHandSideExpression = AssignmentExpression[?in,?yield]
            //      3) LeftHandSideExpression AssignmentOperator AssignmentExpression[?in,?yield]
            //      4) ArrowFunctionExpression[?in,?yield]
            //      5) [+Yield] YieldExpression[?In]
            //
            // Note: for ease of implementation we treat productions '2' and '3' as the same thing. 
            // (i.e. they're both BinaryExpressions with an assignment operator in it).
            // First, do the simple check if we have a YieldExpression (production '5').
            if (isYieldExpression()) {
                return parseYieldExpression();
            }
            // Then, check if we have an arrow function (production '4') that starts with a parenthesized
            // parameter list. If we do, we must *not* recurse for productions 1, 2 or 3. An ArrowFunction is
            // not a  LeftHandSideExpression, nor does it start a ConditionalExpression.  So we are done 
            // with AssignmentExpression if we see one.
            var arrowExpression = tryParseParenthesizedArrowFunctionExpression();
            if (arrowExpression) {
                return arrowExpression;
            }
            // Now try to see if we're in production '1', '2' or '3'.  A conditional expression can
            // start with a LogicalOrExpression, while the assignment productions can only start with
            // LeftHandSideExpressions.
            //
            // So, first, we try to just parse out a BinaryExpression.  If we get something that is a 
            // LeftHandSide or higher, then we can try to parse out the assignment expression part.  
            // Otherwise, we try to parse out the conditional expression bit.  We want to allow any 
            // binary expression here, so we pass in the 'lowest' precedence here so that it matches
            // and consumes anything.
            var expr = parseBinaryExpressionOrHigher(0);
            // To avoid a look-ahead, we did not handle the case of an arrow function with a single un-parenthesized
            // parameter ('x => ...') above. We handle it here by checking if the parsed expression was a single
            // identifier and the current token is an arrow.
            if (expr.kind === 63 /* Identifier */ && token === 31 /* EqualsGreaterThanToken */) {
                return parseSimpleArrowFunctionExpression(expr);
            }
            // Now see if we might be in cases '2' or '3'.
            // If the expression was a LHS expression, and we have an assignment operator, then 
            // we're in '2' or '3'. Consume the assignment and return.
            //
            // Note: we call reScanGreaterToken so that we get an appropriately merged token
            // for cases like > > =  becoming >>=
            if (isLeftHandSideExpression(expr) && isAssignmentOperator(reScanGreaterToken())) {
                var operator = token;
                nextToken();
                return makeBinaryExpression(expr, operator, parseAssignmentExpressionOrHigher());
            }
            // It wasn't an assignment or a lambda.  This is a conditional expression:
            return parseConditionalExpressionRest(expr);
        }
        function isYieldExpression() {
            if (token === 108 /* YieldKeyword */) {
                // If we have a 'yield' keyword, and htis is a context where yield expressions are 
                // allowed, then definitely parse out a yield expression.
                if (inYieldContext()) {
                    return true;
                }
                if (inStrictModeContext()) {
                    // If we're in strict mode, then 'yield' is a keyword, could only ever start
                    // a yield expression.
                    return true;
                }
                // We're in a context where 'yield expr' is not allowed.  However, if we can
                // definitely tell that the user was trying to parse a 'yield expr' and not
                // just a normal expr that start with a 'yield' identifier, then parse out
                // a 'yield expr'.  We can then report an error later that they are only 
                // allowed in generator expressions.
                // 
                // for example, if we see 'yield(foo)', then we'll have to treat that as an
                // invocation expression of something called 'yield'.  However, if we have
                // 'yield foo' then that is not legal as a normal expression, so we can 
                // definitely recognize this as a yield expression.
                //
                // for now we just check if the next token is an identifier.  More heuristics
                // can be added here later as necessary.  We just need to make sure that we
                // don't accidently consume something legal.
                return lookAhead(nextTokenIsIdentifierOnSameLine);
            }
            return false;
        }
        function nextTokenIsIdentifierOnSameLine() {
            nextToken();
            return !scanner.hasPrecedingLineBreak() && isIdentifier();
        }
        function parseYieldExpression() {
            var node = createNode(160 /* YieldExpression */);
            // YieldExpression[In] :
            //      yield
            //      yield [no LineTerminator here] [Lexical goal InputElementRegExp]AssignmentExpression[?In, Yield]
            //      yield [no LineTerminator here] * [Lexical goal InputElementRegExp]AssignmentExpression[?In, Yield]
            nextToken();
            if (!scanner.hasPrecedingLineBreak() &&
                (token === 34 /* AsteriskToken */ || isStartOfExpression())) {
                node.asteriskToken = parseOptionalToken(34 /* AsteriskToken */);
                node.expression = parseAssignmentExpressionOrHigher();
                return finishNode(node);
            }
            else {
                // if the next token is not on the same line as yield.  or we don't have an '*' or 
                // the start of an expressin, then this is just a simple "yield" expression.
                return finishNode(node);
            }
        }
        function parseSimpleArrowFunctionExpression(identifier) {
            ts.Debug.assert(token === 31 /* EqualsGreaterThanToken */, "parseSimpleArrowFunctionExpression should only have been called if we had a =>");
            var node = createNode(151 /* ArrowFunction */, identifier.pos);
            var parameter = createNode(123 /* Parameter */, identifier.pos);
            parameter.name = identifier;
            finishNode(parameter);
            node.parameters = [parameter];
            node.parameters.pos = parameter.pos;
            node.parameters.end = parameter.end;
            parseExpected(31 /* EqualsGreaterThanToken */);
            node.body = parseArrowFunctionExpressionBody();
            return finishNode(node);
        }
        function tryParseParenthesizedArrowFunctionExpression() {
            var triState = isParenthesizedArrowFunctionExpression();
            if (triState === 0 /* False */) {
                // It's definitely not a parenthesized arrow function expression.
                return undefined;
            }
            // If we definitely have an arrow function, then we can just parse one, not requiring a
            // following => or { token. Otherwise, we *might* have an arrow function.  Try to parse
            // it out, but don't allow any ambiguity, and return 'undefined' if this could be an
            // expression instead.
            var arrowFunction = triState === 1 /* True */
                ? parseParenthesizedArrowFunctionExpressionHead(true)
                : tryParse(parsePossibleParenthesizedArrowFunctionExpressionHead);
            if (!arrowFunction) {
                // Didn't appear to actually be a parenthesized arrow function.  Just bail out.
                return undefined;
            }
            // If we have an arrow, then try to parse the body. Even if not, try to parse if we 
            // have an opening brace, just in case we're in an error state.
            if (parseExpected(31 /* EqualsGreaterThanToken */) || token === 13 /* OpenBraceToken */) {
                arrowFunction.body = parseArrowFunctionExpressionBody();
            }
            else {
                // If not, we're probably better off bailing out and returning a bogus function expression.
                arrowFunction.body = parseIdentifier();
            }
            return finishNode(arrowFunction);
        }
        //  True        -> We definitely expect a parenthesized arrow function here.
        //  False       -> There *cannot* be a parenthesized arrow function here.
        //  Unknown     -> There *might* be a parenthesized arrow function here.
        //                 Speculatively look ahead to be sure, and rollback if not.
        function isParenthesizedArrowFunctionExpression() {
            if (token === 15 /* OpenParenToken */ || token === 23 /* LessThanToken */) {
                return lookAhead(isParenthesizedArrowFunctionExpressionWorker);
            }
            if (token === 31 /* EqualsGreaterThanToken */) {
                // ERROR RECOVERY TWEAK:
                // If we see a standalone => try to parse it as an arrow function expression as that's
                // likely what the user intended to write.
                return 1 /* True */;
            }
            // Definitely not a parenthesized arrow function.
            return 0 /* False */;
        }
        function isParenthesizedArrowFunctionExpressionWorker() {
            var first = token;
            var second = nextToken();
            if (first === 15 /* OpenParenToken */) {
                if (second === 16 /* CloseParenToken */) {
                    // Simple cases: "() =>", "(): ", and  "() {".
                    // This is an arrow function with no parameters.
                    // The last one is not actually an arrow function,
                    // but this is probably what the user intended.
                    var third = nextToken();
                    switch (third) {
                        case 31 /* EqualsGreaterThanToken */:
                        case 50 /* ColonToken */:
                        case 13 /* OpenBraceToken */:
                            return 1 /* True */;
                        default:
                            return 0 /* False */;
                    }
                }
                // Simple case: "(..."
                // This is an arrow function with a rest parameter.
                if (second === 20 /* DotDotDotToken */) {
                    return 1 /* True */;
                }
                // If we had "(" followed by something that's not an identifier,
                // then this definitely doesn't look like a lambda.
                // Note: we could be a little more lenient and allow
                // "(public" or "(private". These would not ever actually be allowed,
                // but we could provide a good error message instead of bailing out.
                if (!isIdentifier()) {
                    return 0 /* False */;
                }
                // If we have something like "(a:", then we must have a
                // type-annotated parameter in an arrow function expression.
                if (nextToken() === 50 /* ColonToken */) {
                    return 1 /* True */;
                }
                // This *could* be a parenthesized arrow function.
                // Return Unknown to let the caller know.
                return 2 /* Unknown */;
            }
            else {
                ts.Debug.assert(first === 23 /* LessThanToken */);
                // If we have "<" not followed by an identifier,
                // then this definitely is not an arrow function.
                if (!isIdentifier()) {
                    return 0 /* False */;
                }
                // This *could* be a parenthesized arrow function.
                return 2 /* Unknown */;
            }
        }
        function parsePossibleParenthesizedArrowFunctionExpressionHead() {
            return parseParenthesizedArrowFunctionExpressionHead(false);
        }
        function parseParenthesizedArrowFunctionExpressionHead(allowAmbiguity) {
            var node = createNode(151 /* ArrowFunction */);
            // Arrow functions are never generators.
            //
            // If we're speculatively parsing a signature for a parenthesized arrow function, then
            // we have to have a complete parameter list.  Otherwise we might see something like
            // a => (b => c)
            // And think that "(b =>" was actually a parenthesized arrow function with a missing 
            // close paren.
            fillSignature(50 /* ColonToken */, false, !allowAmbiguity, node);
            // If we couldn't get parameters, we definitely could not parse out an arrow function.
            if (!node.parameters) {
                return undefined;
            }
            // Parsing a signature isn't enough.
            // Parenthesized arrow signatures often look like other valid expressions.
            // For instance:
            //  - "(x = 10)" is an assignment expression parsed as a signature with a default parameter value.
            //  - "(x,y)" is a comma expression parsed as a signature with two parameters.
            //  - "a ? (b): c" will have "(b):" parsed as a signature with a return type annotation.
            //
            // So we need just a bit of lookahead to ensure that it can only be a signature.
            if (!allowAmbiguity && token !== 31 /* EqualsGreaterThanToken */ && token !== 13 /* OpenBraceToken */) {
                // Returning undefined here will cause our caller to rewind to where we started from.
                return undefined;
            }
            return node;
        }
        function parseArrowFunctionExpressionBody() {
            if (token === 13 /* OpenBraceToken */) {
                return parseFunctionBlock(false, false);
            }
            if (isStatement(true) && !isStartOfExpressionStatement() && token !== 81 /* FunctionKeyword */) {
                // Check if we got a plain statement (i.e. no expression-statements, no functions expressions/declarations)
                //
                // Here we try to recover from a potential error situation in the case where the 
                // user meant to supply a block. For example, if the user wrote:
                //
                //  a =>
                //      var v = 0;
                //  }
                //
                // they may be missing an open brace.  Check to see if that's the case so we can
                // try to recover better.  If we don't do this, then the next close curly we see may end
                // up preemptively closing the containing construct.
                //
                // Note: even when 'ignoreMissingOpenBrace' is passed as true, parseBody will still error.
                return parseFunctionBlock(false, true);
            }
            return parseAssignmentExpressionOrHigher();
        }
        function parseConditionalExpressionRest(leftOperand) {
            // Note: we are passed in an expression which was produced from parseBinaryExpressionOrHigher.
            if (!parseOptional(49 /* QuestionToken */)) {
                return leftOperand;
            }
            // Note: we explicitly 'allowIn' in the whenTrue part of the condition expression, and 
            // we do not that for the 'whenFalse' part.  
            var node = createNode(158 /* ConditionalExpression */, leftOperand.pos);
            node.condition = leftOperand;
            node.whenTrue = allowInAnd(parseAssignmentExpressionOrHigher);
            parseExpected(50 /* ColonToken */);
            node.whenFalse = parseAssignmentExpressionOrHigher();
            return finishNode(node);
        }
        function parseBinaryExpressionOrHigher(precedence) {
            var leftOperand = parseUnaryExpressionOrHigher();
            return parseBinaryExpressionRest(precedence, leftOperand);
        }
        function parseBinaryExpressionRest(precedence, leftOperand) {
            while (true) {
                // We either have a binary operator here, or we're finished.  We call 
                // reScanGreaterToken so that we merge token sequences like > and = into >=
                reScanGreaterToken();
                var newPrecedence = getBinaryOperatorPrecedence();
                // Check the precedence to see if we should "take" this operator
                if (newPrecedence <= precedence) {
                    break;
                }
                if (token === 84 /* InKeyword */ && inDisallowInContext()) {
                    break;
                }
                var operator = token;
                nextToken();
                leftOperand = makeBinaryExpression(leftOperand, operator, parseBinaryExpressionOrHigher(newPrecedence));
            }
            return leftOperand;
        }
        function isBinaryOperator() {
            if (inDisallowInContext() && token === 84 /* InKeyword */) {
                return false;
            }
            return getBinaryOperatorPrecedence() > 0;
        }
        function getBinaryOperatorPrecedence() {
            switch (token) {
                case 48 /* BarBarToken */:
                    return 1;
                case 47 /* AmpersandAmpersandToken */:
                    return 2;
                case 43 /* BarToken */:
                    return 3;
                case 44 /* CaretToken */:
                    return 4;
                case 42 /* AmpersandToken */:
                    return 5;
                case 27 /* EqualsEqualsToken */:
                case 28 /* ExclamationEqualsToken */:
                case 29 /* EqualsEqualsEqualsToken */:
                case 30 /* ExclamationEqualsEqualsToken */:
                    return 6;
                case 23 /* LessThanToken */:
                case 24 /* GreaterThanToken */:
                case 25 /* LessThanEqualsToken */:
                case 26 /* GreaterThanEqualsToken */:
                case 85 /* InstanceOfKeyword */:
                case 84 /* InKeyword */:
                    return 7;
                case 39 /* LessThanLessThanToken */:
                case 40 /* GreaterThanGreaterThanToken */:
                case 41 /* GreaterThanGreaterThanGreaterThanToken */:
                    return 8;
                case 32 /* PlusToken */:
                case 33 /* MinusToken */:
                    return 9;
                case 34 /* AsteriskToken */:
                case 35 /* SlashToken */:
                case 36 /* PercentToken */:
                    return 10;
            }
            // -1 is lower than all other precedences.  Returning it will cause binary expression
            // parsing to stop.
            return -1;
        }
        function makeBinaryExpression(left, operator, right) {
            var node = createNode(157 /* BinaryExpression */, left.pos);
            node.left = left;
            node.operator = operator;
            node.right = right;
            return finishNode(node);
        }
        function parsePrefixUnaryExpression() {
            var node = createNode(155 /* PrefixUnaryExpression */);
            node.operator = token;
            nextToken();
            node.operand = parseUnaryExpressionOrHigher();
            return finishNode(node);
        }
        function parseDeleteExpression() {
            var node = createNode(152 /* DeleteExpression */);
            nextToken();
            node.expression = parseUnaryExpressionOrHigher();
            return finishNode(node);
        }
        function parseTypeOfExpression() {
            var node = createNode(153 /* TypeOfExpression */);
            nextToken();
            node.expression = parseUnaryExpressionOrHigher();
            return finishNode(node);
        }
        function parseVoidExpression() {
            var node = createNode(154 /* VoidExpression */);
            nextToken();
            node.expression = parseUnaryExpressionOrHigher();
            return finishNode(node);
        }
        function parseUnaryExpressionOrHigher() {
            switch (token) {
                case 32 /* PlusToken */:
                case 33 /* MinusToken */:
                case 46 /* TildeToken */:
                case 45 /* ExclamationToken */:
                case 37 /* PlusPlusToken */:
                case 38 /* MinusMinusToken */:
                    return parsePrefixUnaryExpression();
                case 72 /* DeleteKeyword */:
                    return parseDeleteExpression();
                case 95 /* TypeOfKeyword */:
                    return parseTypeOfExpression();
                case 97 /* VoidKeyword */:
                    return parseVoidExpression();
                case 23 /* LessThanToken */:
                    return parseTypeAssertion();
                default:
                    return parsePostfixExpressionOrHigher();
            }
        }
        function parsePostfixExpressionOrHigher() {
            var expression = parseLeftHandSideExpressionOrHigher();
            ts.Debug.assert(isLeftHandSideExpression(expression));
            if ((token === 37 /* PlusPlusToken */ || token === 38 /* MinusMinusToken */) && !scanner.hasPrecedingLineBreak()) {
                var node = createNode(156 /* PostfixUnaryExpression */, expression.pos);
                node.operand = expression;
                node.operator = token;
                nextToken();
                return finishNode(node);
            }
            return expression;
        }
        function parseLeftHandSideExpressionOrHigher() {
            // Original Ecma:
            // LeftHandSideExpression: See 11.2 
            //      NewExpression
            //      CallExpression 
            //
            // Our simplification:
            //
            // LeftHandSideExpression: See 11.2 
            //      MemberExpression  
            //      CallExpression 
            //
            // See comment in parseMemberExpressionOrHigher on how we replaced NewExpression with
            // MemberExpression to make our lives easier.
            //
            // to best understand the below code, it's important to see how CallExpression expands
            // out into its own productions:
            //
            // CallExpression:
            //      MemberExpression Arguments 
            //      CallExpression Arguments
            //      CallExpression[Expression]
            //      CallExpression.IdentifierName
            //      super   (   ArgumentListopt   )
            //      super.IdentifierName
            //
            // Because of the recursion in these calls, we need to bottom out first.  There are two 
            // bottom out states we can run into.  Either we see 'super' which must start either of
            // the last two CallExpression productions.  Or we have a MemberExpression which either
            // completes the LeftHandSideExpression, or starts the beginning of the first four
            // CallExpression productions.
            var expression = token === 89 /* SuperKeyword */
                ? parseSuperExpression()
                : parseMemberExpressionOrHigher();
            // Now, we *may* be complete.  However, we might have consumed the start of a 
            // CallExpression.  As such, we need to consume the rest of it here to be complete.
            return parseCallExpressionRest(expression);
        }
        function parseMemberExpressionOrHigher() {
            // Note: to make our lives simpler, we decompose the the NewExpression productions and
            // place ObjectCreationExpression and FunctionExpression into PrimaryExpression.
            // like so:
            //
            //   PrimaryExpression : See 11.1 
            //      this
            //      Identifier
            //      Literal
            //      ArrayLiteral
            //      ObjectLiteral
            //      (Expression) 
            //      FunctionExpression
            //      new MemberExpression Arguments?
            //
            //   MemberExpression : See 11.2 
            //      PrimaryExpression 
            //      MemberExpression[Expression]
            //      MemberExpression.IdentifierName
            //
            //   CallExpression : See 11.2 
            //      MemberExpression 
            //      CallExpression Arguments
            //      CallExpression[Expression]
            //      CallExpression.IdentifierName 
            //
            // Technically this is ambiguous.  i.e. CallExpression defines:
            //
            //   CallExpression:
            //      CallExpression Arguments
            // 
            // If you see: "new Foo()"
            //
            // Then that could be treated as a single ObjectCreationExpression, or it could be 
            // treated as the invocation of "new Foo".  We disambiguate that in code (to match
            // the original grammar) by making sure that if we see an ObjectCreationExpression
            // we always consume arguments if they are there. So we treat "new Foo()" as an
            // object creation only, and not at all as an invocation)  Another way to think 
            // about this is that for every "new" that we see, we will consume an argument list if
            // it is there as part of the *associated* object creation node.  Any additional
            // argument lists we see, will become invocation expressions.
            //
            // Because there are no other places in the grammar now that refer to FunctionExpression
            // or ObjectCreationExpression, it is safe to push down into the PrimaryExpression
            // production.
            //
            // Because CallExpression and MemberExpression are left recursive, we need to bottom out
            // of the recursion immediately.  So we parse out a primary expression to start with.
            var expression = parsePrimaryExpression();
            return parseMemberExpressionRest(expression);
        }
        function parseSuperExpression() {
            var expression = parseTokenNode();
            if (token === 15 /* OpenParenToken */ || token === 19 /* DotToken */) {
                return expression;
            }
            // If we have seen "super" it must be followed by '(' or '.'.
            // If it wasn't then just try to parse out a '.' and report an error.
            var node = createNode(143 /* PropertyAccessExpression */, expression.pos);
            node.expression = expression;
            parseExpected(19 /* DotToken */, ts.Diagnostics.super_must_be_followed_by_an_argument_list_or_member_access);
            node.name = parseRightSideOfDot(true);
            return finishNode(node);
        }
        function parseTypeAssertion() {
            var node = createNode(148 /* TypeAssertionExpression */);
            parseExpected(23 /* LessThanToken */);
            node.type = parseType();
            parseExpected(24 /* GreaterThanToken */);
            node.expression = parseUnaryExpressionOrHigher();
            return finishNode(node);
        }
        function parseMemberExpressionRest(expression) {
            while (true) {
                var dotOrBracketStart = scanner.getTokenPos();
                if (parseOptional(19 /* DotToken */)) {
                    var propertyAccess = createNode(143 /* PropertyAccessExpression */, expression.pos);
                    propertyAccess.expression = expression;
                    propertyAccess.name = parseRightSideOfDot(true);
                    expression = finishNode(propertyAccess);
                    continue;
                }
                if (parseOptional(17 /* OpenBracketToken */)) {
                    var indexedAccess = createNode(144 /* ElementAccessExpression */, expression.pos);
                    indexedAccess.expression = expression;
                    // It's not uncommon for a user to write: "new Type[]".
                    // Check for that common pattern and report a better error message.
                    if (token !== 18 /* CloseBracketToken */) {
                        indexedAccess.argumentExpression = allowInAnd(parseExpression);
                        if (indexedAccess.argumentExpression.kind === 7 /* StringLiteral */ || indexedAccess.argumentExpression.kind === 6 /* NumericLiteral */) {
                            var literal = indexedAccess.argumentExpression;
                            literal.text = internIdentifier(literal.text);
                        }
                    }
                    parseExpected(18 /* CloseBracketToken */);
                    expression = finishNode(indexedAccess);
                    continue;
                }
                if (token === 9 /* NoSubstitutionTemplateLiteral */ || token === 10 /* TemplateHead */) {
                    var tagExpression = createNode(147 /* TaggedTemplateExpression */, expression.pos);
                    tagExpression.tag = expression;
                    tagExpression.template = token === 9 /* NoSubstitutionTemplateLiteral */
                        ? parseLiteralNode()
                        : parseTemplateExpression();
                    expression = finishNode(tagExpression);
                    continue;
                }
                return expression;
            }
        }
        function parseCallExpressionRest(expression) {
            while (true) {
                expression = parseMemberExpressionRest(expression);
                if (token === 23 /* LessThanToken */) {
                    // See if this is the start of a generic invocation.  If so, consume it and
                    // keep checking for postfix expressions.  Otherwise, it's just a '<' that's 
                    // part of an arithmetic expression.  Break out so we consume it higher in the
                    // stack.
                    var typeArguments = tryParse(parseTypeArgumentsInExpression);
                    if (!typeArguments) {
                        return expression;
                    }
                    var callExpr = createNode(145 /* CallExpression */, expression.pos);
                    callExpr.expression = expression;
                    callExpr.typeArguments = typeArguments;
                    callExpr.arguments = parseArgumentList();
                    expression = finishNode(callExpr);
                    continue;
                }
                else if (token === 15 /* OpenParenToken */) {
                    var callExpr = createNode(145 /* CallExpression */, expression.pos);
                    callExpr.expression = expression;
                    callExpr.arguments = parseArgumentList();
                    expression = finishNode(callExpr);
                    continue;
                }
                return expression;
            }
        }
        function parseArgumentList() {
            parseExpected(15 /* OpenParenToken */);
            var result = parseDelimitedList(10 /* ArgumentExpressions */, parseArgumentExpression);
            parseExpected(16 /* CloseParenToken */);
            return result;
        }
        function parseTypeArgumentsInExpression() {
            if (!parseOptional(23 /* LessThanToken */)) {
                return undefined;
            }
            var typeArguments = parseDelimitedList(15 /* TypeArguments */, parseType);
            if (!parseExpected(24 /* GreaterThanToken */)) {
                // If it doesn't have the closing >  then it's definitely not an type argument list.
                return undefined;
            }
            // If we have a '<', then only parse this as a arugment list if the type arguments
            // are complete and we have an open paren.  if we don't, rewind and return nothing.
            return typeArguments && canFollowTypeArgumentsInExpression()
                ? typeArguments
                : undefined;
        }
        function canFollowTypeArgumentsInExpression() {
            switch (token) {
                case 15 /* OpenParenToken */: // foo<x>(   
                // this case are the only case where this token can legally follow a type argument 
                // list.  So we definitely want to treat this as a type arg list.
                case 19 /* DotToken */: // foo<x>.
                case 16 /* CloseParenToken */: // foo<x>)
                case 18 /* CloseBracketToken */: // foo<x>]
                case 50 /* ColonToken */: // foo<x>:
                case 21 /* SemicolonToken */: // foo<x>;
                case 22 /* CommaToken */: // foo<x>,
                case 49 /* QuestionToken */: // foo<x>?
                case 27 /* EqualsEqualsToken */: // foo<x> ==
                case 29 /* EqualsEqualsEqualsToken */: // foo<x> ===
                case 28 /* ExclamationEqualsToken */: // foo<x> !=
                case 30 /* ExclamationEqualsEqualsToken */: // foo<x> !==
                case 47 /* AmpersandAmpersandToken */: // foo<x> &&
                case 48 /* BarBarToken */: // foo<x> ||
                case 44 /* CaretToken */: // foo<x> ^
                case 42 /* AmpersandToken */: // foo<x> &
                case 43 /* BarToken */: // foo<x> |
                case 14 /* CloseBraceToken */: // foo<x> }
                case 1 /* EndOfFileToken */:
                    // these cases can't legally follow a type arg list.  However, they're not legal 
                    // expressions either.  The user is probably in the middle of a generic type. So
                    // treat it as such.
                    return true;
                default:
                    // Anything else treat as an expression.
                    return false;
            }
        }
        function parsePrimaryExpression() {
            switch (token) {
                case 6 /* NumericLiteral */:
                case 7 /* StringLiteral */:
                case 9 /* NoSubstitutionTemplateLiteral */:
                    return parseLiteralNode();
                case 91 /* ThisKeyword */:
                case 89 /* SuperKeyword */:
                case 87 /* NullKeyword */:
                case 93 /* TrueKeyword */:
                case 78 /* FalseKeyword */:
                    return parseTokenNode();
                case 15 /* OpenParenToken */:
                    return parseParenthesizedExpression();
                case 17 /* OpenBracketToken */:
                    return parseArrayLiteralExpression();
                case 13 /* OpenBraceToken */:
                    return parseObjectLiteralExpression();
                case 81 /* FunctionKeyword */:
                    return parseFunctionExpression();
                case 86 /* NewKeyword */:
                    return parseNewExpression();
                case 35 /* SlashToken */:
                case 55 /* SlashEqualsToken */:
                    if (reScanSlashToken() === 8 /* RegularExpressionLiteral */) {
                        return parseLiteralNode();
                    }
                    break;
                case 10 /* TemplateHead */:
                    return parseTemplateExpression();
            }
            return parseIdentifier(ts.Diagnostics.Expression_expected);
        }
        function parseParenthesizedExpression() {
            var node = createNode(149 /* ParenthesizedExpression */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            return finishNode(node);
        }
        function parseAssignmentExpressionOrOmittedExpression() {
            return token === 22 /* CommaToken */
                ? createNode(161 /* OmittedExpression */)
                : parseAssignmentExpressionOrHigher();
        }
        function parseArrayLiteralElement() {
            return parseAssignmentExpressionOrOmittedExpression();
        }
        function parseArgumentExpression() {
            return allowInAnd(parseAssignmentExpressionOrOmittedExpression);
        }
        function parseArrayLiteralExpression() {
            var node = createNode(141 /* ArrayLiteralExpression */);
            parseExpected(17 /* OpenBracketToken */);
            if (scanner.hasPrecedingLineBreak())
                node.flags |= 256 /* MultiLine */;
            node.elements = parseDelimitedList(12 /* ArrayLiteralMembers */, parseArrayLiteralElement);
            parseExpected(18 /* CloseBracketToken */);
            return finishNode(node);
        }
        function parseObjectLiteralElement() {
            var fullStart = scanner.getStartPos();
            var initialToken = token;
            if (parseContextualModifier(113 /* GetKeyword */) || parseContextualModifier(117 /* SetKeyword */)) {
                var kind = initialToken === 113 /* GetKeyword */ ? 127 /* GetAccessor */ : 128 /* SetAccessor */;
                return parseAccessorDeclaration(kind, fullStart, undefined);
            }
            var asteriskToken = parseOptionalToken(34 /* AsteriskToken */);
            var tokenIsIdentifier = isIdentifier();
            var nameToken = token;
            var propertyName = parsePropertyName();
            if (asteriskToken || token === 15 /* OpenParenToken */ || token === 23 /* LessThanToken */) {
                return parseMethodDeclaration(fullStart, undefined, asteriskToken, propertyName, undefined, true);
            }
            // Disallowing of optional property assignments happens in the grammar checker.
            var questionToken = parseOptionalToken(49 /* QuestionToken */);
            // Parse to check if it is short-hand property assignment or normal property assignment
            if ((token === 22 /* CommaToken */ || token === 14 /* CloseBraceToken */) && tokenIsIdentifier) {
                var shorthandDeclaration = createNode(199 /* ShorthandPropertyAssignment */, fullStart);
                shorthandDeclaration.name = propertyName;
                shorthandDeclaration.questionToken = questionToken;
                return finishNode(shorthandDeclaration);
            }
            else {
                var propertyAssignment = createNode(198 /* PropertyAssignment */, fullStart);
                propertyAssignment.name = propertyName;
                propertyAssignment.questionToken = questionToken;
                parseExpected(50 /* ColonToken */);
                propertyAssignment.initializer = allowInAnd(parseAssignmentExpressionOrHigher);
                return finishNode(propertyAssignment);
            }
        }
        function parseObjectLiteralExpression() {
            var node = createNode(142 /* ObjectLiteralExpression */);
            parseExpected(13 /* OpenBraceToken */);
            if (scanner.hasPrecedingLineBreak()) {
                node.flags |= 256 /* MultiLine */;
            }
            node.properties = parseDelimitedList(11 /* ObjectLiteralMembers */, parseObjectLiteralElement);
            parseExpected(14 /* CloseBraceToken */);
            return finishNode(node);
        }
        function parseFunctionExpression() {
            // GeneratorExpression :
            //      function * BindingIdentifier[Yield]opt (FormalParameters[Yield, GeneratorParameter]) { GeneratorBody[Yield] }
            // FunctionExpression:
            //      function BindingIdentifieropt(FormalParameters) { FunctionBody }
            var node = createNode(150 /* FunctionExpression */);
            parseExpected(81 /* FunctionKeyword */);
            node.asteriskToken = parseOptionalToken(34 /* AsteriskToken */);
            node.name = node.asteriskToken ? doInYieldContext(parseOptionalIdentifier) : parseOptionalIdentifier();
            fillSignature(50 /* ColonToken */, !!node.asteriskToken, false, node);
            node.body = parseFunctionBlock(!!node.asteriskToken, false);
            return finishNode(node);
        }
        function parseOptionalIdentifier() {
            return isIdentifier() ? parseIdentifier() : undefined;
        }
        function parseNewExpression() {
            var node = createNode(146 /* NewExpression */);
            parseExpected(86 /* NewKeyword */);
            node.expression = parseMemberExpressionOrHigher();
            node.typeArguments = tryParse(parseTypeArgumentsInExpression);
            if (node.typeArguments || token === 15 /* OpenParenToken */) {
                node.arguments = parseArgumentList();
            }
            return finishNode(node);
        }
        // STATEMENTS
        function parseBlock(kind, ignoreMissingOpenBrace, checkForStrictMode) {
            var node = createNode(kind);
            if (parseExpected(13 /* OpenBraceToken */) || ignoreMissingOpenBrace) {
                node.statements = parseList(2 /* BlockStatements */, checkForStrictMode, parseStatement);
                parseExpected(14 /* CloseBraceToken */);
            }
            else {
                node.statements = createMissingList();
            }
            return finishNode(node);
        }
        function parseFunctionBlock(allowYield, ignoreMissingOpenBrace) {
            var savedYieldContext = inYieldContext();
            setYieldContext(allowYield);
            var block = parseBlock(163 /* Block */, ignoreMissingOpenBrace, true);
            setYieldContext(savedYieldContext);
            return block;
        }
        function parseEmptyStatement() {
            var node = createNode(165 /* EmptyStatement */);
            parseExpected(21 /* SemicolonToken */);
            return finishNode(node);
        }
        function parseIfStatement() {
            var node = createNode(167 /* IfStatement */);
            parseExpected(82 /* IfKeyword */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            node.thenStatement = parseStatement();
            node.elseStatement = parseOptional(74 /* ElseKeyword */) ? parseStatement() : undefined;
            return finishNode(node);
        }
        function parseDoStatement() {
            var node = createNode(168 /* DoStatement */);
            parseExpected(73 /* DoKeyword */);
            node.statement = parseStatement();
            parseExpected(98 /* WhileKeyword */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            // From: https://mail.mozilla.org/pipermail/es-discuss/2011-August/016188.html
            // 157 min --- All allen at wirfs-brock.com CONF --- "do{;}while(false)false" prohibited in 
            // spec but allowed in consensus reality. Approved -- this is the de-facto standard whereby
            //  do;while(0)x will have a semicolon inserted before x.
            parseOptional(21 /* SemicolonToken */);
            return finishNode(node);
        }
        function parseWhileStatement() {
            var node = createNode(169 /* WhileStatement */);
            parseExpected(98 /* WhileKeyword */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            node.statement = parseStatement();
            return finishNode(node);
        }
        function parseForOrForInStatement() {
            var pos = getNodePos();
            parseExpected(80 /* ForKeyword */);
            parseExpected(15 /* OpenParenToken */);
            if (token !== 21 /* SemicolonToken */) {
                if (parseOptional(96 /* VarKeyword */)) {
                    var declarations = disallowInAnd(parseVariableDeclarationList);
                }
                else if (parseOptional(102 /* LetKeyword */)) {
                    var declarations = setFlag(disallowInAnd(parseVariableDeclarationList), 2048 /* Let */);
                }
                else if (parseOptional(68 /* ConstKeyword */)) {
                    var declarations = setFlag(disallowInAnd(parseVariableDeclarationList), 4096 /* Const */);
                }
                else {
                    var varOrInit = disallowInAnd(parseExpression);
                }
            }
            var forOrForInStatement;
            if (parseOptional(84 /* InKeyword */)) {
                var forInStatement = createNode(171 /* ForInStatement */, pos);
                if (declarations) {
                    forInStatement.declarations = declarations;
                }
                else {
                    forInStatement.variable = varOrInit;
                }
                forInStatement.expression = allowInAnd(parseExpression);
                parseExpected(16 /* CloseParenToken */);
                forOrForInStatement = forInStatement;
            }
            else {
                var forStatement = createNode(170 /* ForStatement */, pos);
                if (declarations) {
                    forStatement.declarations = declarations;
                }
                if (varOrInit) {
                    forStatement.initializer = varOrInit;
                }
                parseExpected(21 /* SemicolonToken */);
                if (token !== 21 /* SemicolonToken */ && token !== 16 /* CloseParenToken */) {
                    forStatement.condition = allowInAnd(parseExpression);
                }
                parseExpected(21 /* SemicolonToken */);
                if (token !== 16 /* CloseParenToken */) {
                    forStatement.iterator = allowInAnd(parseExpression);
                }
                parseExpected(16 /* CloseParenToken */);
                forOrForInStatement = forStatement;
            }
            forOrForInStatement.statement = parseStatement();
            return finishNode(forOrForInStatement);
        }
        function parseBreakOrContinueStatement(kind) {
            var node = createNode(kind);
            parseExpected(kind === 173 /* BreakStatement */ ? 64 /* BreakKeyword */ : 69 /* ContinueKeyword */);
            if (!canParseSemicolon()) {
                node.label = parseIdentifier();
            }
            parseSemicolon();
            return finishNode(node);
        }
        function parseReturnStatement() {
            var node = createNode(174 /* ReturnStatement */);
            parseExpected(88 /* ReturnKeyword */);
            if (!canParseSemicolon()) {
                node.expression = allowInAnd(parseExpression);
            }
            parseSemicolon();
            return finishNode(node);
        }
        function parseWithStatement() {
            var node = createNode(175 /* WithStatement */);
            parseExpected(99 /* WithKeyword */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            node.statement = parseStatement();
            return finishNode(node);
        }
        function parseCaseClause() {
            var node = createNode(194 /* CaseClause */);
            parseExpected(65 /* CaseKeyword */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(50 /* ColonToken */);
            node.statements = parseList(4 /* SwitchClauseStatements */, false, parseStatement);
            return finishNode(node);
        }
        function parseDefaultClause() {
            var node = createNode(195 /* DefaultClause */);
            parseExpected(71 /* DefaultKeyword */);
            parseExpected(50 /* ColonToken */);
            node.statements = parseList(4 /* SwitchClauseStatements */, false, parseStatement);
            return finishNode(node);
        }
        function parseCaseOrDefaultClause() {
            return token === 65 /* CaseKeyword */ ? parseCaseClause() : parseDefaultClause();
        }
        function parseSwitchStatement() {
            var node = createNode(176 /* SwitchStatement */);
            parseExpected(90 /* SwitchKeyword */);
            parseExpected(15 /* OpenParenToken */);
            node.expression = allowInAnd(parseExpression);
            parseExpected(16 /* CloseParenToken */);
            parseExpected(13 /* OpenBraceToken */);
            node.clauses = parseList(3 /* SwitchClauses */, false, parseCaseOrDefaultClause);
            parseExpected(14 /* CloseBraceToken */);
            return finishNode(node);
        }
        function parseThrowStatement() {
            // ThrowStatement[Yield] :
            //      throw [no LineTerminator here]Expression[In, ?Yield];
            // Because of automatic semicolon insertion, we need to report error if this 
            // throw could be terminated with a semicolon.  Note: we can't call 'parseExpression'
            // directly as that might consume an expression on the following line.  
            // We just return 'undefined' in that case.  The actual error will be reported in the
            // grammar walker.
            var node = createNode(178 /* ThrowStatement */);
            parseExpected(92 /* ThrowKeyword */);
            node.expression = scanner.hasPrecedingLineBreak() ? undefined : allowInAnd(parseExpression);
            parseSemicolon();
            return finishNode(node);
        }
        // TODO: Review for error recovery
        function parseTryStatement() {
            var node = createNode(179 /* TryStatement */);
            node.tryBlock = parseTokenAndBlock(94 /* TryKeyword */);
            node.catchClause = token === 66 /* CatchKeyword */ ? parseCatchClause() : undefined;
            // If we don't have a catch clause, then we must have a finally clause.  Try to parse
            // one out no matter what.
            node.finallyBlock = !node.catchClause || token === 79 /* FinallyKeyword */
                ? parseTokenAndBlock(79 /* FinallyKeyword */)
                : undefined;
            return finishNode(node);
        }
        function parseTokenAndBlock(token) {
            var pos = getNodePos();
            parseExpected(token);
            var result = parseBlock(token === 94 /* TryKeyword */ ? 180 /* TryBlock */ : 181 /* FinallyBlock */, 
            /* ignoreMissingOpenBrace */ false, false);
            result.pos = pos;
            return result;
        }
        function parseCatchClause() {
            var result = createNode(197 /* CatchClause */);
            parseExpected(66 /* CatchKeyword */);
            parseExpected(15 /* OpenParenToken */);
            result.name = parseIdentifier();
            result.type = parseTypeAnnotation();
            parseExpected(16 /* CloseParenToken */);
            result.block = parseBlock(163 /* Block */, false, false);
            return finishNode(result);
        }
        function parseDebuggerStatement() {
            var node = createNode(182 /* DebuggerStatement */);
            parseExpected(70 /* DebuggerKeyword */);
            parseSemicolon();
            return finishNode(node);
        }
        function isLabel() {
            return isIdentifier() && lookAhead(nextTokenIsColonToken);
        }
        function nextTokenIsColonToken() {
            return nextToken() === 50 /* ColonToken */;
        }
        function parseLabeledStatement() {
            var node = createNode(177 /* LabeledStatement */);
            node.label = parseIdentifier();
            parseExpected(50 /* ColonToken */);
            node.statement = parseStatement();
            return finishNode(node);
        }
        function parseExpressionStatement() {
            var node = createNode(166 /* ExpressionStatement */);
            node.expression = allowInAnd(parseExpression);
            parseSemicolon();
            return finishNode(node);
        }
        function isStatement(inErrorRecovery) {
            switch (token) {
                case 21 /* SemicolonToken */:
                    // If we're in error recovery, then we don't want to treat ';' as an empty statement.
                    // The problem is that ';' can show up in far too many contexts, and if we see one
                    // and assume it's a statement, then we may bail out inappropriately from whatever
                    // we're parsing.  For example, if we have a semicolon in the middle of a class, then
                    // we really don't want to assume the class is over and we're on a statement in the
                    // outer module.  We just want to consume and move on.
                    return !inErrorRecovery;
                case 13 /* OpenBraceToken */:
                case 96 /* VarKeyword */:
                case 102 /* LetKeyword */:
                case 81 /* FunctionKeyword */:
                case 82 /* IfKeyword */:
                case 73 /* DoKeyword */:
                case 98 /* WhileKeyword */:
                case 80 /* ForKeyword */:
                case 69 /* ContinueKeyword */:
                case 64 /* BreakKeyword */:
                case 88 /* ReturnKeyword */:
                case 99 /* WithKeyword */:
                case 90 /* SwitchKeyword */:
                case 92 /* ThrowKeyword */:
                case 94 /* TryKeyword */:
                case 70 /* DebuggerKeyword */:
                // 'catch' and 'finally' do not actually indicate that the code is part of a statement,
                // however, we say they are here so that we may gracefully parse them and error later.
                case 66 /* CatchKeyword */:
                case 79 /* FinallyKeyword */:
                    return true;
                case 68 /* ConstKeyword */:
                    // const keyword can precede enum keyword when defining constant enums
                    // 'const enum' do not start statement.
                    // In ES 6 'enum' is a future reserved keyword, so it should not be used as identifier
                    var isConstEnum = lookAhead(nextTokenIsEnumKeyword);
                    return !isConstEnum;
                case 101 /* InterfaceKeyword */:
                case 67 /* ClassKeyword */:
                case 114 /* ModuleKeyword */:
                case 75 /* EnumKeyword */:
                case 119 /* TypeKeyword */:
                    // When followed by an identifier, these do not start a statement but might
                    // instead be following declarations
                    if (isDeclarationStart()) {
                        return false;
                    }
                case 106 /* PublicKeyword */:
                case 104 /* PrivateKeyword */:
                case 105 /* ProtectedKeyword */:
                case 107 /* StaticKeyword */:
                    // When followed by an identifier or keyword, these do not start a statement but
                    // might instead be following type members
                    if (lookAhead(nextTokenIsIdentifierOrKeywordOnSameLine)) {
                        return false;
                    }
                default:
                    return isStartOfExpression();
            }
        }
        function nextTokenIsEnumKeyword() {
            nextToken();
            return token === 75 /* EnumKeyword */;
        }
        function nextTokenIsIdentifierOrKeywordOnSameLine() {
            nextToken();
            return isIdentifierOrKeyword() && !scanner.hasPrecedingLineBreak();
        }
        function parseStatement() {
            switch (token) {
                case 13 /* OpenBraceToken */:
                    return parseBlock(163 /* Block */, false, false);
                case 96 /* VarKeyword */:
                case 68 /* ConstKeyword */:
                    // const here should always be parsed as const declaration because of check in 'isStatement' 
                    return parseVariableStatement(scanner.getStartPos(), undefined);
                case 81 /* FunctionKeyword */:
                    return parseFunctionDeclaration(scanner.getStartPos(), undefined);
                case 21 /* SemicolonToken */:
                    return parseEmptyStatement();
                case 82 /* IfKeyword */:
                    return parseIfStatement();
                case 73 /* DoKeyword */:
                    return parseDoStatement();
                case 98 /* WhileKeyword */:
                    return parseWhileStatement();
                case 80 /* ForKeyword */:
                    return parseForOrForInStatement();
                case 69 /* ContinueKeyword */:
                    return parseBreakOrContinueStatement(172 /* ContinueStatement */);
                case 64 /* BreakKeyword */:
                    return parseBreakOrContinueStatement(173 /* BreakStatement */);
                case 88 /* ReturnKeyword */:
                    return parseReturnStatement();
                case 99 /* WithKeyword */:
                    return parseWithStatement();
                case 90 /* SwitchKeyword */:
                    return parseSwitchStatement();
                case 92 /* ThrowKeyword */:
                    return parseThrowStatement();
                case 94 /* TryKeyword */:
                // Include the next two for error recovery.
                case 66 /* CatchKeyword */:
                case 79 /* FinallyKeyword */:
                    return parseTryStatement();
                case 70 /* DebuggerKeyword */:
                    return parseDebuggerStatement();
                case 102 /* LetKeyword */:
                    // If let follows identifier on the same line, it is declaration parse it as variable statement
                    if (isLetDeclaration()) {
                        return parseVariableStatement(scanner.getStartPos(), undefined);
                    }
                // Else parse it like identifier - fall through
                default:
                    return isLabel()
                        ? parseLabeledStatement()
                        : parseExpressionStatement();
            }
        }
        function parseFunctionBlockOrSemicolon(isGenerator) {
            if (token === 13 /* OpenBraceToken */) {
                return parseFunctionBlock(isGenerator, false);
            }
            parseSemicolon(ts.Diagnostics.or_expected);
            return undefined;
        }
        // DECLARATIONS
        function parseVariableDeclaration() {
            var node = createNode(183 /* VariableDeclaration */);
            node.name = parseIdentifier();
            node.type = parseTypeAnnotation();
            node.initializer = parseInitializer(false);
            return finishNode(node);
        }
        function setFlag(array, flag) {
            for (var i = 0, n = array.length; i < n; i++) {
                array[i].flags |= flag;
            }
            return array;
        }
        function parseVariableDeclarationList() {
            return parseDelimitedList(9 /* VariableDeclarations */, parseVariableDeclaration);
        }
        function parseVariableStatement(fullStart, modifiers) {
            var node = createNode(164 /* VariableStatement */, fullStart);
            setModifiers(node, modifiers);
            if (token === 102 /* LetKeyword */) {
                node.flags |= 2048 /* Let */;
            }
            else if (token === 68 /* ConstKeyword */) {
                node.flags |= 4096 /* Const */;
            }
            else {
                ts.Debug.assert(token === 96 /* VarKeyword */);
            }
            nextToken();
            node.declarations = allowInAnd(parseVariableDeclarationList);
            setFlag(node.declarations, node.flags);
            parseSemicolon();
            return finishNode(node);
        }
        function parseFunctionDeclaration(fullStart, modifiers) {
            var node = createNode(184 /* FunctionDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(81 /* FunctionKeyword */);
            node.asteriskToken = parseOptionalToken(34 /* AsteriskToken */);
            node.name = parseIdentifier();
            fillSignature(50 /* ColonToken */, !!node.asteriskToken, false, node);
            node.body = parseFunctionBlockOrSemicolon(!!node.asteriskToken);
            return finishNode(node);
        }
        function parseConstructorDeclaration(pos, modifiers) {
            var node = createNode(126 /* Constructor */, pos);
            setModifiers(node, modifiers);
            parseExpected(111 /* ConstructorKeyword */);
            fillSignature(50 /* ColonToken */, false, false, node);
            node.body = parseFunctionBlockOrSemicolon(false);
            return finishNode(node);
        }
        function parseMethodDeclaration(fullStart, modifiers, asteriskToken, name, questionToken, requireBlock) {
            var method = createNode(125 /* Method */, fullStart);
            setModifiers(method, modifiers);
            method.asteriskToken = asteriskToken;
            method.name = name;
            method.questionToken = questionToken;
            fillSignature(50 /* ColonToken */, !!asteriskToken, false, method);
            method.body = requireBlock ? parseFunctionBlock(!!asteriskToken, false) : parseFunctionBlockOrSemicolon(!!asteriskToken);
            return finishNode(method);
        }
        function parsePropertyOrMethodDeclaration(fullStart, modifiers) {
            var asteriskToken = parseOptionalToken(34 /* AsteriskToken */);
            var name = parsePropertyName();
            // Note: this is not legal as per the grammar.  But we allow it in the parser and
            // report an error in the grammar checker.
            var questionToken = parseOptionalToken(49 /* QuestionToken */);
            if (asteriskToken || token === 15 /* OpenParenToken */ || token === 23 /* LessThanToken */) {
                return parseMethodDeclaration(fullStart, modifiers, asteriskToken, name, questionToken, false);
            }
            else {
                var property = createNode(124 /* Property */, fullStart);
                setModifiers(property, modifiers);
                property.name = name;
                property.questionToken = questionToken;
                property.type = parseTypeAnnotation();
                property.initializer = allowInAnd(parseNonParameterInitializer);
                parseSemicolon();
                return finishNode(property);
            }
        }
        function parseNonParameterInitializer() {
            return parseInitializer(false);
        }
        function parseAccessorDeclaration(kind, fullStart, modifiers) {
            var node = createNode(kind, fullStart);
            setModifiers(node, modifiers);
            node.name = parsePropertyName();
            fillSignature(50 /* ColonToken */, false, false, node);
            node.body = parseFunctionBlockOrSemicolon(false);
            return finishNode(node);
        }
        function isClassMemberStart() {
            var idToken;
            // Eat up all modifiers, but hold on to the last one in case it is actually an identifier.
            while (ts.isModifier(token)) {
                idToken = token;
                nextToken();
            }
            if (token === 34 /* AsteriskToken */) {
                return true;
            }
            // Try to get the first property-like token following all modifiers.
            // This can either be an identifier or the 'get' or 'set' keywords.
            if (isLiteralPropertyName()) {
                idToken = token;
                nextToken();
            }
            // Index signatures and computed properties are class members; we can parse.
            if (token === 17 /* OpenBracketToken */) {
                return true;
            }
            // If we were able to get any potential identifier...
            if (idToken !== undefined) {
                // If we have a non-keyword identifier, or if we have an accessor, then it's safe to parse.
                if (!ts.isKeyword(idToken) || idToken === 117 /* SetKeyword */ || idToken === 113 /* GetKeyword */) {
                    return true;
                }
                // If it *is* a keyword, but not an accessor, check a little farther along
                // to see if it should actually be parsed as a class member.
                switch (token) {
                    case 15 /* OpenParenToken */: // Method declaration
                    case 23 /* LessThanToken */: // Generic Method declaration
                    case 50 /* ColonToken */: // Type Annotation for declaration
                    case 51 /* EqualsToken */: // Initializer for declaration
                    case 49 /* QuestionToken */:
                        return true;
                    default:
                        // Covers
                        //  - Semicolons     (declaration termination)
                        //  - Closing braces (end-of-class, must be declaration)
                        //  - End-of-files   (not valid, but permitted so that it gets caught later on)
                        //  - Line-breaks    (enabling *automatic semicolon insertion*)
                        return canParseSemicolon();
                }
            }
            return false;
        }
        function parseModifiers() {
            var flags = 0;
            var modifiers;
            while (true) {
                var modifierStart = scanner.getStartPos();
                var modifierKind = token;
                if (!parseAnyContextualModifier()) {
                    break;
                }
                if (!modifiers) {
                    modifiers = [];
                    modifiers.pos = modifierStart;
                }
                flags |= modifierToFlag(modifierKind);
                modifiers.push(finishNode(createNode(modifierKind, modifierStart)));
            }
            if (modifiers) {
                modifiers.flags = flags;
                modifiers.end = scanner.getStartPos();
            }
            return modifiers;
        }
        function parseClassElement() {
            var fullStart = getNodePos();
            var modifiers = parseModifiers();
            if (parseContextualModifier(113 /* GetKeyword */)) {
                return parseAccessorDeclaration(127 /* GetAccessor */, fullStart, modifiers);
            }
            if (parseContextualModifier(117 /* SetKeyword */)) {
                return parseAccessorDeclaration(128 /* SetAccessor */, fullStart, modifiers);
            }
            if (token === 111 /* ConstructorKeyword */) {
                return parseConstructorDeclaration(fullStart, modifiers);
            }
            if (isIndexSignature()) {
                return parseIndexSignatureDeclaration(fullStart, modifiers);
            }
            // It is very important that we check this *after* checking indexers because
            // the [ token can start an index signature or a computed property name
            if (isIdentifierOrKeyword() || token === 7 /* StringLiteral */ || token === 6 /* NumericLiteral */ ||
                token === 34 /* AsteriskToken */ || token === 17 /* OpenBracketToken */) {
                return parsePropertyOrMethodDeclaration(fullStart, modifiers);
            }
            // 'isClassMemberStart' should have hinted not to attempt parsing.
            ts.Debug.fail("Should not have attempted to parse class member declaration.");
        }
        function parseClassDeclaration(fullStart, modifiers) {
            var node = createNode(185 /* ClassDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(67 /* ClassKeyword */);
            node.name = parseIdentifier();
            node.typeParameters = parseTypeParameters();
            node.heritageClauses = parseHeritageClauses(true);
            if (parseExpected(13 /* OpenBraceToken */)) {
                // ClassTail[Yield,GeneratorParameter] : See 14.5
                //      [~GeneratorParameter]ClassHeritage[?Yield]opt { ClassBody[?Yield]opt }
                //      [+GeneratorParameter] ClassHeritageopt { ClassBodyopt }
                node.members = inGeneratorParameterContext()
                    ? doOutsideOfYieldContext(parseClassMembers)
                    : parseClassMembers();
                parseExpected(14 /* CloseBraceToken */);
            }
            else {
                node.members = createMissingList();
            }
            return finishNode(node);
        }
        function parseHeritageClauses(isClassHeritageClause) {
            // ClassTail[Yield,GeneratorParameter] : See 14.5
            //      [~GeneratorParameter]ClassHeritage[?Yield]opt { ClassBody[?Yield]opt }
            //      [+GeneratorParameter] ClassHeritageopt { ClassBodyopt }
            if (isHeritageClause()) {
                return isClassHeritageClause && inGeneratorParameterContext()
                    ? doOutsideOfYieldContext(parseHeritageClausesWorker)
                    : parseHeritageClausesWorker();
            }
            return undefined;
        }
        function parseHeritageClausesWorker() {
            return parseList(17 /* HeritageClauses */, false, parseHeritageClause);
        }
        function parseHeritageClause() {
            if (token === 77 /* ExtendsKeyword */ || token === 100 /* ImplementsKeyword */) {
                var node = createNode(196 /* HeritageClause */);
                node.token = token;
                nextToken();
                node.types = parseDelimitedList(8 /* TypeReferences */, parseTypeReference);
                return finishNode(node);
            }
            return undefined;
        }
        function isHeritageClause() {
            return token === 77 /* ExtendsKeyword */ || token === 100 /* ImplementsKeyword */;
        }
        function parseClassMembers() {
            return parseList(6 /* ClassMembers */, false, parseClassElement);
        }
        function parseInterfaceDeclaration(fullStart, modifiers) {
            var node = createNode(186 /* InterfaceDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(101 /* InterfaceKeyword */);
            node.name = parseIdentifier();
            node.typeParameters = parseTypeParameters();
            node.heritageClauses = parseHeritageClauses(false);
            node.members = parseObjectTypeMembers();
            return finishNode(node);
        }
        function parseTypeAliasDeclaration(fullStart, modifiers) {
            var node = createNode(187 /* TypeAliasDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(119 /* TypeKeyword */);
            node.name = parseIdentifier();
            parseExpected(51 /* EqualsToken */);
            node.type = parseType();
            parseSemicolon();
            return finishNode(node);
        }
        // In an ambient declaration, the grammar only allows integer literals as initializers.
        // In a non-ambient declaration, the grammar allows uninitialized members only in a
        // ConstantEnumMemberSection, which starts at the beginning of an enum declaration
        // or any time an integer literal initializer is encountered.
        function parseEnumMember() {
            var node = createNode(200 /* EnumMember */, scanner.getStartPos());
            node.name = parsePropertyName();
            node.initializer = allowInAnd(parseNonParameterInitializer);
            return finishNode(node);
        }
        function parseEnumDeclaration(fullStart, modifiers) {
            var node = createNode(188 /* EnumDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(75 /* EnumKeyword */);
            node.name = parseIdentifier();
            if (parseExpected(13 /* OpenBraceToken */)) {
                node.members = parseDelimitedList(7 /* EnumMembers */, parseEnumMember);
                parseExpected(14 /* CloseBraceToken */);
            }
            else {
                node.members = createMissingList();
            }
            return finishNode(node);
        }
        function parseModuleBlock() {
            var node = createNode(190 /* ModuleBlock */, scanner.getStartPos());
            if (parseExpected(13 /* OpenBraceToken */)) {
                node.statements = parseList(1 /* ModuleElements */, false, parseModuleElement);
                parseExpected(14 /* CloseBraceToken */);
            }
            else {
                node.statements = createMissingList();
            }
            return finishNode(node);
        }
        function parseInternalModuleTail(fullStart, modifiers, flags) {
            var node = createNode(189 /* ModuleDeclaration */, fullStart);
            setModifiers(node, modifiers);
            node.flags |= flags;
            node.name = parseIdentifier();
            node.body = parseOptional(19 /* DotToken */)
                ? parseInternalModuleTail(getNodePos(), undefined, 1 /* Export */)
                : parseModuleBlock();
            return finishNode(node);
        }
        function parseAmbientExternalModuleDeclaration(fullStart, modifiers) {
            var node = createNode(189 /* ModuleDeclaration */, fullStart);
            setModifiers(node, modifiers);
            node.name = parseLiteralNode(true);
            node.body = parseModuleBlock();
            return finishNode(node);
        }
        function parseModuleDeclaration(fullStart, modifiers) {
            parseExpected(114 /* ModuleKeyword */);
            return token === 7 /* StringLiteral */
                ? parseAmbientExternalModuleDeclaration(fullStart, modifiers)
                : parseInternalModuleTail(fullStart, modifiers, modifiers ? modifiers.flags : 0);
        }
        function isExternalModuleReference() {
            return token === 115 /* RequireKeyword */ &&
                lookAhead(nextTokenIsOpenParen);
        }
        function nextTokenIsOpenParen() {
            return nextToken() === 15 /* OpenParenToken */;
        }
        function parseImportDeclaration(fullStart, modifiers) {
            var node = createNode(191 /* ImportDeclaration */, fullStart);
            setModifiers(node, modifiers);
            parseExpected(83 /* ImportKeyword */);
            node.name = parseIdentifier();
            parseExpected(51 /* EqualsToken */);
            node.moduleReference = parseModuleReference();
            parseSemicolon();
            return finishNode(node);
        }
        function parseModuleReference() {
            return isExternalModuleReference()
                ? parseExternalModuleReference()
                : parseEntityName(false);
        }
        function parseExternalModuleReference() {
            var node = createNode(193 /* ExternalModuleReference */);
            parseExpected(115 /* RequireKeyword */);
            parseExpected(15 /* OpenParenToken */);
            // We allow arbitrary expressions here, even though the grammar only allows string 
            // literals.  We check to ensure that it is only a string literal later in the grammar
            // walker.
            node.expression = parseExpression();
            // Ensure the string being required is in our 'identifier' table.  This will ensure 
            // that features like 'find refs' will look inside this file when search for its name.
            if (node.expression.kind === 7 /* StringLiteral */) {
                internIdentifier(node.expression.text);
            }
            parseExpected(16 /* CloseParenToken */);
            return finishNode(node);
        }
        function parseExportAssignmentTail(fullStart, modifiers) {
            var node = createNode(192 /* ExportAssignment */, fullStart);
            setModifiers(node, modifiers);
            node.exportName = parseIdentifier();
            parseSemicolon();
            return finishNode(node);
        }
        function isLetDeclaration() {
            // It is let declaration if in strict mode or next token is identifier on same line.
            // otherwise it needs to be treated like identifier
            return inStrictModeContext() || lookAhead(nextTokenIsIdentifierOnSameLine);
        }
        function isDeclarationStart() {
            switch (token) {
                case 96 /* VarKeyword */:
                case 68 /* ConstKeyword */:
                case 81 /* FunctionKeyword */:
                    return true;
                case 102 /* LetKeyword */:
                    return isLetDeclaration();
                case 67 /* ClassKeyword */:
                case 101 /* InterfaceKeyword */:
                case 75 /* EnumKeyword */:
                case 83 /* ImportKeyword */:
                case 119 /* TypeKeyword */:
                    // Not true keywords so ensure an identifier follows
                    return lookAhead(nextTokenIsIdentifierOrKeyword);
                case 114 /* ModuleKeyword */:
                    // Not a true keyword so ensure an identifier or string literal follows
                    return lookAhead(nextTokenIsIdentifierOrKeywordOrStringLiteral);
                case 76 /* ExportKeyword */:
                    // Check for export assignment or modifier on source element
                    return lookAhead(nextTokenIsEqualsTokenOrDeclarationStart);
                case 112 /* DeclareKeyword */:
                case 106 /* PublicKeyword */:
                case 104 /* PrivateKeyword */:
                case 105 /* ProtectedKeyword */:
                case 107 /* StaticKeyword */:
                    // Check for modifier on source element
                    return lookAhead(nextTokenIsDeclarationStart);
            }
        }
        function isIdentifierOrKeyword() {
            return token >= 63 /* Identifier */;
        }
        function nextTokenIsIdentifierOrKeyword() {
            nextToken();
            return isIdentifierOrKeyword();
        }
        function nextTokenIsIdentifierOrKeywordOrStringLiteral() {
            nextToken();
            return isIdentifierOrKeyword() || token === 7 /* StringLiteral */;
        }
        function nextTokenIsEqualsTokenOrDeclarationStart() {
            nextToken();
            return token === 51 /* EqualsToken */ || isDeclarationStart();
        }
        function nextTokenIsDeclarationStart() {
            nextToken();
            return isDeclarationStart();
        }
        function parseDeclaration() {
            var fullStart = getNodePos();
            var modifiers = parseModifiers();
            if (token === 76 /* ExportKeyword */) {
                nextToken();
                if (parseOptional(51 /* EqualsToken */)) {
                    return parseExportAssignmentTail(fullStart, modifiers);
                }
            }
            switch (token) {
                case 96 /* VarKeyword */:
                case 102 /* LetKeyword */:
                case 68 /* ConstKeyword */:
                    return parseVariableStatement(fullStart, modifiers);
                case 81 /* FunctionKeyword */:
                    return parseFunctionDeclaration(fullStart, modifiers);
                case 67 /* ClassKeyword */:
                    return parseClassDeclaration(fullStart, modifiers);
                case 101 /* InterfaceKeyword */:
                    return parseInterfaceDeclaration(fullStart, modifiers);
                case 119 /* TypeKeyword */:
                    return parseTypeAliasDeclaration(fullStart, modifiers);
                case 75 /* EnumKeyword */:
                    return parseEnumDeclaration(fullStart, modifiers);
                case 114 /* ModuleKeyword */:
                    return parseModuleDeclaration(fullStart, modifiers);
                case 83 /* ImportKeyword */:
                    return parseImportDeclaration(fullStart, modifiers);
                default:
                    ts.Debug.fail("Mismatch between isDeclarationStart and parseDeclaration");
            }
        }
        function isSourceElement(inErrorRecovery) {
            return isDeclarationStart() || isStatement(inErrorRecovery);
        }
        function parseSourceElement() {
            return parseSourceElementOrModuleElement();
        }
        function parseModuleElement() {
            return parseSourceElementOrModuleElement();
        }
        function parseSourceElementOrModuleElement() {
            return isDeclarationStart()
                ? parseDeclaration()
                : parseStatement();
        }
        function processReferenceComments() {
            var triviaScanner = ts.createScanner(languageVersion, false, sourceText);
            var referencedFiles = [];
            var amdDependencies = [];
            var amdModuleName;
            // Keep scanning all the leading trivia in the file until we get to something that 
            // isn't trivia.  Any single line comment will be analyzed to see if it is a 
            // reference comment.
            while (true) {
                var kind = triviaScanner.scan();
                if (kind === 5 /* WhitespaceTrivia */ || kind === 4 /* NewLineTrivia */ || kind === 3 /* MultiLineCommentTrivia */) {
                    continue;
                }
                if (kind !== 2 /* SingleLineCommentTrivia */) {
                    break;
                }
                var range = { pos: triviaScanner.getTokenPos(), end: triviaScanner.getTextPos() };
                var comment = sourceText.substring(range.pos, range.end);
                var referencePathMatchResult = ts.getFileReferenceFromReferencePath(comment, range);
                if (referencePathMatchResult) {
                    var fileReference = referencePathMatchResult.fileReference;
                    sourceFile.hasNoDefaultLib = referencePathMatchResult.isNoDefaultLib;
                    var diagnosticMessage = referencePathMatchResult.diagnosticMessage;
                    if (fileReference) {
                        referencedFiles.push(fileReference);
                    }
                    if (diagnosticMessage) {
                        sourceFile.referenceDiagnostics.push(ts.createFileDiagnostic(sourceFile, range.pos, range.end - range.pos, diagnosticMessage));
                    }
                }
                else {
                    var amdModuleNameRegEx = /^\/\/\/\s*<amd-module\s+name\s*=\s*('|")(.+?)\1/gim;
                    var amdModuleNameMatchResult = amdModuleNameRegEx.exec(comment);
                    if (amdModuleNameMatchResult) {
                        if (amdModuleName) {
                            sourceFile.referenceDiagnostics.push(ts.createFileDiagnostic(sourceFile, range.pos, range.end - range.pos, ts.Diagnostics.An_AMD_module_cannot_have_multiple_name_assignments));
                        }
                        amdModuleName = amdModuleNameMatchResult[2];
                    }
                    var amdDependencyRegEx = /^\/\/\/\s*<amd-dependency\s+path\s*=\s*('|")(.+?)\1/gim;
                    var amdDependencyMatchResult = amdDependencyRegEx.exec(comment);
                    if (amdDependencyMatchResult) {
                        amdDependencies.push(amdDependencyMatchResult[2]);
                    }
                }
            }
            return {
                referencedFiles: referencedFiles,
                amdDependencies: amdDependencies,
                amdModuleName: amdModuleName
            };
        }
        function getExternalModuleIndicator() {
            return ts.forEach(sourceFile.statements, function (node) {
                return node.flags & 1 /* Export */
                    || node.kind === 191 /* ImportDeclaration */ && node.moduleReference.kind === 193 /* ExternalModuleReference */
                    || node.kind === 192 /* ExportAssignment */
                    ? node
                    : undefined;
            });
        }
        var syntacticDiagnostics;
        function getSyntacticDiagnostics() {
            if (syntacticDiagnostics === undefined) {
                if (sourceFile.parseDiagnostics.length > 0) {
                    // Don't bother doing any grammar checks if there are already parser errors.  
                    // Otherwise we may end up with too many cascading errors.
                    syntacticDiagnostics = sourceFile.referenceDiagnostics.concat(sourceFile.parseDiagnostics);
                }
                else {
                    // No parser errors were reported.  Perform our stricter grammar checks.
                    checkGrammar(sourceText, languageVersion, sourceFile);
                    syntacticDiagnostics = sourceFile.referenceDiagnostics.concat(sourceFile.grammarDiagnostics);
                }
            }
            ts.Debug.assert(syntacticDiagnostics !== undefined);
            return syntacticDiagnostics;
        }
        var rootNodeFlags = 0;
        if (ts.fileExtensionIs(filename, ".d.ts")) {
            rootNodeFlags = 1024 /* DeclarationFile */;
        }
        var sourceFile = createRootNode(201 /* SourceFile */, 0, sourceText.length, rootNodeFlags);
        sourceFile.getLineAndCharacterFromPosition = getLineAndCharacterFromSourcePosition;
        sourceFile.getPositionFromLineAndCharacter = getPositionFromSourceLineAndCharacter;
        sourceFile.getLineStarts = getLineStarts;
        sourceFile.getSyntacticDiagnostics = getSyntacticDiagnostics;
        sourceFile.filename = ts.normalizePath(filename);
        sourceFile.text = sourceText;
        sourceFile.referenceDiagnostics = [];
        sourceFile.parseDiagnostics = [];
        sourceFile.grammarDiagnostics = [];
        sourceFile.semanticDiagnostics = [];
        var referenceComments = processReferenceComments();
        sourceFile.referencedFiles = referenceComments.referencedFiles;
        sourceFile.amdDependencies = referenceComments.amdDependencies;
        sourceFile.amdModuleName = referenceComments.amdModuleName;
        // Create and prime the scanner before parsing the source elements.
        var scanner = ts.createScanner(languageVersion, true, sourceText, scanError);
        nextToken();
        sourceFile.statements = parseList(0 /* SourceElements */, true, parseSourceElement);
        ts.Debug.assert(token === 1 /* EndOfFileToken */);
        sourceFile.endOfFileToken = parseTokenNode();
        sourceFile.externalModuleIndicator = getExternalModuleIndicator();
        sourceFile.nodeCount = nodeCount;
        sourceFile.identifierCount = identifierCount;
        sourceFile.version = version;
        sourceFile.isOpen = isOpen;
        sourceFile.languageVersion = languageVersion;
        sourceFile.identifiers = identifiers;
        return sourceFile;
    }
    ts.createSourceFile = createSourceFile;
    function isLeftHandSideExpression(expr) {
        if (expr) {
            switch (expr.kind) {
                case 143 /* PropertyAccessExpression */:
                case 144 /* ElementAccessExpression */:
                case 146 /* NewExpression */:
                case 145 /* CallExpression */:
                case 147 /* TaggedTemplateExpression */:
                case 141 /* ArrayLiteralExpression */:
                case 149 /* ParenthesizedExpression */:
                case 142 /* ObjectLiteralExpression */:
                case 150 /* FunctionExpression */:
                case 63 /* Identifier */:
                case 8 /* RegularExpressionLiteral */:
                case 6 /* NumericLiteral */:
                case 7 /* StringLiteral */:
                case 9 /* NoSubstitutionTemplateLiteral */:
                case 159 /* TemplateExpression */:
                case 78 /* FalseKeyword */:
                case 87 /* NullKeyword */:
                case 91 /* ThisKeyword */:
                case 93 /* TrueKeyword */:
                case 89 /* SuperKeyword */:
                    return true;
            }
        }
        return false;
    }
    function isAssignmentOperator(token) {
        return token >= 51 /* FirstAssignment */ && token <= 62 /* LastAssignment */;
    }
    function checkGrammar(sourceText, languageVersion, file) {
        var grammarDiagnostics = file.grammarDiagnostics;
        // Create a scanner so we can find the start of tokens to report errors on.
        var scanner = ts.createScanner(languageVersion, true, sourceText);
        // We're automatically in an ambient context if this is a .d.ts file.
        var inAmbientContext = ts.fileExtensionIs(file.filename, ".d.ts");
        var inFunctionBlock = false;
        var parent;
        visitNode(file);
        function visitNode(node) {
            // Store and restore our recursive state here.
            var savedParent = parent;
            node.parent = parent;
            parent = node;
            if (!checkModifiers(node)) {
                var savedInFunctionBlock = inFunctionBlock;
                if (ts.isFunctionBlock(node)) {
                    inFunctionBlock = true;
                }
                var savedInAmbientContext = inAmbientContext;
                if (node.flags & 2 /* Ambient */) {
                    inAmbientContext = true;
                }
                checkNodeAndChildren(node);
                inAmbientContext = savedInAmbientContext;
                inFunctionBlock = savedInFunctionBlock;
            }
            parent = savedParent;
        }
        function checkNodeAndChildren(node) {
            var nodeKind = node.kind;
            // First, check if you have a statement in a place where it is not allowed.  We want 
            // to do this before recursing, because we'd prefer to report these errors at the top
            // level instead of at some nested level.
            if (inAmbientContext && checkForStatementInAmbientContext(node, nodeKind)) {
                return;
            }
            // if we got any errors, just stop performing any more checks on this node or higher.
            if (checkNode(node, nodeKind)) {
                return;
            }
            // Otherwise, recurse and see if we have any errors below us.
            forEachChild(node, visitNode);
        }
        function checkNode(node, nodeKind) {
            // Now do node specific checks.
            switch (nodeKind) {
                case 151 /* ArrowFunction */:
                case 129 /* CallSignature */:
                case 134 /* ConstructorType */:
                case 130 /* ConstructSignature */:
                case 133 /* FunctionType */:
                    return checkAnySignatureDeclaration(node);
                case 173 /* BreakStatement */:
                case 172 /* ContinueStatement */:
                    return checkBreakOrContinueStatement(node);
                case 145 /* CallExpression */:
                case 146 /* NewExpression */:
                    return checkCallOrNewExpression(node);
                case 188 /* EnumDeclaration */: return checkEnumDeclaration(node);
                case 157 /* BinaryExpression */: return checkBinaryExpression(node);
                case 197 /* CatchClause */: return checkCatchClause(node);
                case 185 /* ClassDeclaration */: return checkClassDeclaration(node);
                case 121 /* ComputedPropertyName */: return checkComputedPropertyName(node);
                case 126 /* Constructor */: return checkConstructor(node);
                case 152 /* DeleteExpression */: return checkDeleteExpression(node);
                case 144 /* ElementAccessExpression */: return checkElementAccessExpression(node);
                case 192 /* ExportAssignment */: return checkExportAssignment(node);
                case 193 /* ExternalModuleReference */: return checkExternalModuleReference(node);
                case 171 /* ForInStatement */: return checkForInStatement(node);
                case 170 /* ForStatement */: return checkForStatement(node);
                case 184 /* FunctionDeclaration */: return checkFunctionDeclaration(node);
                case 150 /* FunctionExpression */: return checkFunctionExpression(node);
                case 127 /* GetAccessor */: return checkGetAccessor(node);
                case 196 /* HeritageClause */: return checkHeritageClause(node);
                case 131 /* IndexSignature */: return checkIndexSignature(node);
                case 186 /* InterfaceDeclaration */: return checkInterfaceDeclaration(node);
                case 177 /* LabeledStatement */: return checkLabeledStatement(node);
                case 198 /* PropertyAssignment */: return checkPropertyAssignment(node);
                case 125 /* Method */: return checkMethod(node);
                case 189 /* ModuleDeclaration */: return checkModuleDeclaration(node);
                case 142 /* ObjectLiteralExpression */: return checkObjectLiteralExpression(node);
                case 6 /* NumericLiteral */: return checkNumericLiteral(node);
                case 123 /* Parameter */: return checkParameter(node);
                case 156 /* PostfixUnaryExpression */: return checkPostfixUnaryExpression(node);
                case 155 /* PrefixUnaryExpression */: return checkPrefixUnaryExpression(node);
                case 124 /* Property */: return checkProperty(node);
                case 174 /* ReturnStatement */: return checkReturnStatement(node);
                case 128 /* SetAccessor */: return checkSetAccessor(node);
                case 201 /* SourceFile */: return checkSourceFile(node);
                case 199 /* ShorthandPropertyAssignment */: return checkShorthandPropertyAssignment(node);
                case 176 /* SwitchStatement */: return checkSwitchStatement(node);
                case 147 /* TaggedTemplateExpression */: return checkTaggedTemplateExpression(node);
                case 178 /* ThrowStatement */: return checkThrowStatement(node);
                case 138 /* TupleType */: return checkTupleType(node);
                case 122 /* TypeParameter */: return checkTypeParameter(node);
                case 132 /* TypeReference */: return checkTypeReference(node);
                case 183 /* VariableDeclaration */: return checkVariableDeclaration(node);
                case 164 /* VariableStatement */: return checkVariableStatement(node);
                case 175 /* WithStatement */: return checkWithStatement(node);
                case 160 /* YieldExpression */: return checkYieldExpression(node);
            }
        }
        function scanToken(pos) {
            var start = ts.skipTrivia(sourceText, pos);
            scanner.setTextPos(start);
            scanner.scan();
            return start;
        }
        function grammarErrorOnFirstToken(node, message, arg0, arg1, arg2) {
            var start = scanToken(node.pos);
            grammarDiagnostics.push(ts.createFileDiagnostic(file, start, scanner.getTextPos() - start, message, arg0, arg1, arg2));
            return true;
        }
        function grammarErrorAfterFirstToken(node, message, arg0, arg1, arg2) {
            scanToken(node.pos);
            grammarDiagnostics.push(ts.createFileDiagnostic(file, scanner.getTextPos(), 0, message, arg0, arg1, arg2));
            return true;
        }
        function grammarErrorOnNode(node, message, arg0, arg1, arg2) {
            var span = ts.getErrorSpanForNode(node);
            var start = span.end > span.pos ? ts.skipTrivia(file.text, span.pos) : span.pos;
            var length = span.end - start;
            grammarDiagnostics.push(ts.createFileDiagnostic(file, start, length, message, arg0, arg1, arg2));
            return true;
        }
        function grammarErrorAtPos(start, length, message, arg0, arg1, arg2) {
            grammarDiagnostics.push(ts.createFileDiagnostic(file, start, length, message, arg0, arg1, arg2));
            return true;
        }
        function reportInvalidUseInStrictMode(node) {
            // declarationNameToString cannot be used here since it uses a backreference to 'parent' that is not yet set
            var name = sourceText.substring(ts.skipTrivia(sourceText, node.pos), node.end);
            return grammarErrorOnNode(node, ts.Diagnostics.Invalid_use_of_0_in_strict_mode, name);
        }
        function checkForStatementInAmbientContext(node, kind) {
            switch (kind) {
                case 163 /* Block */:
                case 165 /* EmptyStatement */:
                case 167 /* IfStatement */:
                case 168 /* DoStatement */:
                case 169 /* WhileStatement */:
                case 170 /* ForStatement */:
                case 171 /* ForInStatement */:
                case 172 /* ContinueStatement */:
                case 173 /* BreakStatement */:
                case 174 /* ReturnStatement */:
                case 175 /* WithStatement */:
                case 176 /* SwitchStatement */:
                case 178 /* ThrowStatement */:
                case 179 /* TryStatement */:
                case 182 /* DebuggerStatement */:
                case 177 /* LabeledStatement */:
                case 166 /* ExpressionStatement */:
                    return grammarErrorOnFirstToken(node, ts.Diagnostics.Statements_are_not_allowed_in_ambient_contexts);
            }
        }
        function checkAnySignatureDeclaration(node) {
            return checkTypeParameterList(node.typeParameters) ||
                checkParameterList(node.parameters);
        }
        function checkBinaryExpression(node) {
            if (node.parserContextFlags & 1 /* StrictMode */) {
                if (isLeftHandSideExpression(node.left) && isAssignmentOperator(node.operator)) {
                    if (isEvalOrArgumentsIdentifier(node.left)) {
                        // ECMA 262 (Annex C) The identifier eval or arguments may not appear as the LeftHandSideExpression of an 
                        // Assignment operator(11.13) or of a PostfixExpression(11.3)
                        return reportInvalidUseInStrictMode(node.left);
                    }
                }
            }
        }
        function isIterationStatement(node, lookInLabeledStatements) {
            switch (node.kind) {
                case 170 /* ForStatement */:
                case 171 /* ForInStatement */:
                case 168 /* DoStatement */:
                case 169 /* WhileStatement */:
                    return true;
                case 177 /* LabeledStatement */:
                    return lookInLabeledStatements && isIterationStatement(node.statement, lookInLabeledStatements);
            }
            return false;
        }
        function checkLabeledStatement(node) {
            // ensure that label is unique
            var current = node.parent;
            while (current) {
                if (ts.isAnyFunction(current)) {
                    break;
                }
                if (current.kind === 177 /* LabeledStatement */ && current.label.text === node.label.text) {
                    return grammarErrorOnNode(node.label, ts.Diagnostics.Duplicate_label_0, ts.getTextOfNodeFromSourceText(sourceText, node.label));
                }
                current = current.parent;
            }
        }
        function checkBreakOrContinueStatement(node) {
            var current = node;
            while (current) {
                if (ts.isAnyFunction(current)) {
                    return grammarErrorOnNode(node, ts.Diagnostics.Jump_target_cannot_cross_function_boundary);
                }
                switch (current.kind) {
                    case 177 /* LabeledStatement */:
                        if (node.label && current.label.text === node.label.text) {
                            // found matching label - verify that label usage is correct
                            // continue can only target labels that are on iteration statements
                            var isMisplacedContinueLabel = node.kind === 172 /* ContinueStatement */
                                && !isIterationStatement(current.statement, true);
                            if (isMisplacedContinueLabel) {
                                return grammarErrorOnNode(node, ts.Diagnostics.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement);
                            }
                            return false;
                        }
                        break;
                    case 176 /* SwitchStatement */:
                        if (node.kind === 173 /* BreakStatement */ && !node.label) {
                            // unlabeled break within switch statement - ok
                            return false;
                        }
                        break;
                    default:
                        if (isIterationStatement(current, false) && !node.label) {
                            // unlabeled break or continue within iteration statement - ok
                            return false;
                        }
                        break;
                }
                current = current.parent;
            }
            if (node.label) {
                var message = node.kind === 173 /* BreakStatement */
                    ? ts.Diagnostics.A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement
                    : ts.Diagnostics.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement;
                return grammarErrorOnNode(node, message);
            }
            else {
                var message = node.kind === 173 /* BreakStatement */
                    ? ts.Diagnostics.A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement
                    : ts.Diagnostics.A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement;
                return grammarErrorOnNode(node, message);
            }
        }
        function checkCallOrNewExpression(node) {
            return checkTypeArguments(node.typeArguments) ||
                checkArguments(node.arguments);
        }
        function checkArguments(arguments) {
            return checkForDisallowedTrailingComma(arguments) ||
                checkForOmittedArgument(arguments);
        }
        function checkTypeArguments(typeArguments) {
            return checkForDisallowedTrailingComma(typeArguments) ||
                checkForAtLeastOneTypeArgument(typeArguments);
        }
        function checkForOmittedArgument(arguments) {
            if (arguments) {
                for (var i = 0, n = arguments.length; i < n; i++) {
                    var arg = arguments[i];
                    if (arg.kind === 161 /* OmittedExpression */) {
                        return grammarErrorAtPos(arg.pos, 0, ts.Diagnostics.Argument_expression_expected);
                    }
                }
            }
        }
        function checkForAtLeastOneTypeArgument(typeArguments) {
            if (typeArguments && typeArguments.length === 0) {
                var start = typeArguments.pos - "<".length;
                var end = ts.skipTrivia(sourceText, typeArguments.end) + ">".length;
                return grammarErrorAtPos(start, end - start, ts.Diagnostics.Type_argument_list_cannot_be_empty);
            }
        }
        function checkForDisallowedTrailingComma(list) {
            if (list && list.hasTrailingComma) {
                var start = list.end - ",".length;
                var end = list.end;
                return grammarErrorAtPos(start, end - start, ts.Diagnostics.Trailing_comma_not_allowed);
            }
        }
        function checkCatchClause(node) {
            if (node.type) {
                var colonStart = ts.skipTrivia(sourceText, node.name.end);
                return grammarErrorAtPos(colonStart, ":".length, ts.Diagnostics.Catch_clause_parameter_cannot_have_a_type_annotation);
            }
            if (node.parserContextFlags & 1 /* StrictMode */ && isEvalOrArgumentsIdentifier(node.name)) {
                // It is a SyntaxError if a TryStatement with a Catch occurs within strict code and the Identifier of the 
                // Catch production is eval or arguments
                return reportInvalidUseInStrictMode(node.name);
            }
        }
        function checkClassDeclaration(node) {
            return checkClassDeclarationHeritageClauses(node);
        }
        function checkClassDeclarationHeritageClauses(node) {
            var seenExtendsClause = false;
            var seenImplementsClause = false;
            if (node.heritageClauses) {
                for (var i = 0, n = node.heritageClauses.length; i < n; i++) {
                    ts.Debug.assert(i <= 2);
                    var heritageClause = node.heritageClauses[i];
                    if (heritageClause.token === 77 /* ExtendsKeyword */) {
                        if (seenExtendsClause) {
                            return grammarErrorOnFirstToken(heritageClause, ts.Diagnostics.extends_clause_already_seen);
                        }
                        if (seenImplementsClause) {
                            return grammarErrorOnFirstToken(heritageClause, ts.Diagnostics.extends_clause_must_precede_implements_clause);
                        }
                        if (heritageClause.types.length > 1) {
                            return grammarErrorOnFirstToken(heritageClause.types[1], ts.Diagnostics.Classes_can_only_extend_a_single_class);
                        }
                        seenExtendsClause = true;
                    }
                    else {
                        ts.Debug.assert(heritageClause.token === 100 /* ImplementsKeyword */);
                        if (seenImplementsClause) {
                            return grammarErrorOnFirstToken(heritageClause, ts.Diagnostics.implements_clause_already_seen);
                        }
                        seenImplementsClause = true;
                    }
                }
            }
            return false;
        }
        function checkForAtLeastOneHeritageClause(types, listType) {
            if (types && types.length === 0) {
                return grammarErrorAtPos(types.pos, 0, ts.Diagnostics._0_list_cannot_be_empty, listType);
            }
        }
        function checkConstructor(node) {
            return checkAnySignatureDeclaration(node) ||
                checkConstructorTypeParameters(node) ||
                checkConstructorTypeAnnotation(node) ||
                checkForBodyInAmbientContext(node.body, true);
        }
        function checkConstructorTypeParameters(node) {
            if (node.typeParameters) {
                return grammarErrorAtPos(node.typeParameters.pos, node.typeParameters.end - node.typeParameters.pos, ts.Diagnostics.Type_parameters_cannot_appear_on_a_constructor_declaration);
            }
        }
        function checkConstructorTypeAnnotation(node) {
            if (node.type) {
                return grammarErrorOnNode(node.type, ts.Diagnostics.Type_annotation_cannot_appear_on_a_constructor_declaration);
            }
        }
        function checkDeleteExpression(node) {
            if (node.parserContextFlags & 1 /* StrictMode */ && node.expression.kind === 63 /* Identifier */) {
                // When a delete operator occurs within strict mode code, a SyntaxError is thrown if its 
                // UnaryExpression is a direct reference to a variable, function argument, or function name
                return grammarErrorOnNode(node.expression, ts.Diagnostics.delete_cannot_be_called_on_an_identifier_in_strict_mode);
            }
        }
        function checkEnumDeclaration(enumDecl) {
            var enumIsConst = (enumDecl.flags & 4096 /* Const */) !== 0;
            var hasError = false;
            // skip checks below for const enums  - they allow arbitrary initializers as long as they can be evaluated to constant expressions.
            // since all values are known in compile time - it is not necessary to check that constant enum section precedes computed enum members.
            if (!enumIsConst) {
                var inConstantEnumMemberSection = true;
                for (var i = 0, n = enumDecl.members.length; i < n; i++) {
                    var node = enumDecl.members[i];
                    if (node.name.kind === 121 /* ComputedPropertyName */) {
                        hasError = grammarErrorOnNode(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_enums);
                    }
                    else if (inAmbientContext) {
                        if (node.initializer && !isIntegerLiteral(node.initializer)) {
                            hasError = grammarErrorOnNode(node.name, ts.Diagnostics.Ambient_enum_elements_can_only_have_integer_literal_initializers) || hasError;
                        }
                    }
                    else if (node.initializer) {
                        inConstantEnumMemberSection = isIntegerLiteral(node.initializer);
                    }
                    else if (!inConstantEnumMemberSection) {
                        hasError = grammarErrorOnNode(node.name, ts.Diagnostics.Enum_member_must_have_initializer) || hasError;
                    }
                }
            }
            return hasError;
        }
        function isIntegerLiteral(expression) {
            function isInteger(literalExpression) {
                // Allows for scientific notation since literalExpression.text was formed by
                // coercing a number to a string. Sometimes this coercion can yield a string
                // in scientific notation.
                // We also don't need special logic for hex because a hex integer is converted
                // to decimal when it is coerced.
                return /^[0-9]+([eE]\+?[0-9]+)?$/.test(literalExpression.text);
            }
            if (expression.kind === 155 /* PrefixUnaryExpression */) {
                var unaryExpression = expression;
                if (unaryExpression.operator === 32 /* PlusToken */ || unaryExpression.operator === 33 /* MinusToken */) {
                    expression = unaryExpression.operand;
                }
            }
            if (expression.kind === 6 /* NumericLiteral */) {
                return isInteger(expression);
            }
            return false;
        }
        function checkExportAssignment(node) {
            if (node.flags & 243 /* Modifier */) {
                return grammarErrorOnFirstToken(node, ts.Diagnostics.An_export_assignment_cannot_have_modifiers);
            }
        }
        function checkExternalModuleReference(node) {
            if (node.expression.kind !== 7 /* StringLiteral */) {
                return grammarErrorOnNode(node.expression, ts.Diagnostics.String_literal_expected);
            }
        }
        function checkForInStatement(node) {
            return checkVariableDeclarations(node.declarations) ||
                checkForMoreThanOneDeclaration(node.declarations);
        }
        function checkForStatement(node) {
            return checkVariableDeclarations(node.declarations);
        }
        function checkForMoreThanOneDeclaration(declarations) {
            if (declarations && declarations.length > 1) {
                return grammarErrorOnFirstToken(declarations[1], ts.Diagnostics.Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement);
            }
        }
        function checkFunctionDeclaration(node) {
            return checkAnySignatureDeclaration(node) ||
                checkFunctionName(node.name) ||
                checkForBodyInAmbientContext(node.body, false) ||
                checkForGenerator(node);
        }
        function checkForGenerator(node) {
            if (node.asteriskToken) {
                return grammarErrorOnNode(node.asteriskToken, ts.Diagnostics.Generators_are_not_currently_supported);
            }
        }
        function checkFunctionExpression(node) {
            return checkAnySignatureDeclaration(node) ||
                checkFunctionName(node.name) ||
                checkForGenerator(node);
        }
        function checkFunctionName(name) {
            if (name && name.parserContextFlags & 1 /* StrictMode */ && isEvalOrArgumentsIdentifier(name)) {
                // It is a SyntaxError to use within strict mode code the identifiers eval or arguments as the 
                // Identifier of a FunctionLikeDeclaration or FunctionExpression or as a formal parameter name(13.1)
                return reportInvalidUseInStrictMode(name);
            }
        }
        function checkGetAccessor(node) {
            return checkAnySignatureDeclaration(node) ||
                checkAccessor(node);
        }
        function checkElementAccessExpression(node) {
            if (!node.argumentExpression) {
                if (node.parent.kind === 146 /* NewExpression */ && node.parent.expression === node) {
                    var start = ts.skipTrivia(sourceText, node.expression.end);
                    var end = node.end;
                    return grammarErrorAtPos(start, end - start, ts.Diagnostics.new_T_cannot_be_used_to_create_an_array_Use_new_Array_T_instead);
                }
                else {
                    var start = node.end - "]".length;
                    var end = node.end;
                    return grammarErrorAtPos(start, end - start, ts.Diagnostics.Expression_expected);
                }
            }
        }
        function checkHeritageClause(node) {
            return checkForDisallowedTrailingComma(node.types) ||
                checkForAtLeastOneHeritageClause(node.types, ts.tokenToString(node.token));
        }
        function checkIndexSignature(node) {
            return checkIndexSignatureParameters(node) ||
                checkForIndexSignatureModifiers(node);
        }
        function checkForIndexSignatureModifiers(node) {
            if (node.flags & 243 /* Modifier */) {
                return grammarErrorOnFirstToken(node, ts.Diagnostics.Modifiers_not_permitted_on_index_signature_members);
            }
        }
        function checkIndexSignatureParameters(node) {
            var parameter = node.parameters[0];
            if (node.parameters.length !== 1) {
                if (parameter) {
                    return grammarErrorOnNode(parameter.name, ts.Diagnostics.An_index_signature_must_have_exactly_one_parameter);
                }
                else {
                    return grammarErrorOnNode(node, ts.Diagnostics.An_index_signature_must_have_exactly_one_parameter);
                }
            }
            else if (parameter.dotDotDotToken) {
                return grammarErrorOnNode(parameter.dotDotDotToken, ts.Diagnostics.An_index_signature_cannot_have_a_rest_parameter);
            }
            else if (parameter.flags & 243 /* Modifier */) {
                return grammarErrorOnNode(parameter.name, ts.Diagnostics.An_index_signature_parameter_cannot_have_an_accessibility_modifier);
            }
            else if (parameter.questionToken) {
                return grammarErrorOnNode(parameter.questionToken, ts.Diagnostics.An_index_signature_parameter_cannot_have_a_question_mark);
            }
            else if (parameter.initializer) {
                return grammarErrorOnNode(parameter.name, ts.Diagnostics.An_index_signature_parameter_cannot_have_an_initializer);
            }
            else if (!parameter.type) {
                return grammarErrorOnNode(parameter.name, ts.Diagnostics.An_index_signature_parameter_must_have_a_type_annotation);
            }
            else if (parameter.type.kind !== 118 /* StringKeyword */ && parameter.type.kind !== 116 /* NumberKeyword */) {
                return grammarErrorOnNode(parameter.name, ts.Diagnostics.An_index_signature_parameter_type_must_be_string_or_number);
            }
            else if (!node.type) {
                return grammarErrorOnNode(node, ts.Diagnostics.An_index_signature_must_have_a_type_annotation);
            }
        }
        function checkInterfaceDeclaration(node) {
            return checkInterfaceDeclarationHeritageClauses(node);
        }
        function checkInterfaceDeclarationHeritageClauses(node) {
            var seenExtendsClause = false;
            if (node.heritageClauses) {
                for (var i = 0, n = node.heritageClauses.length; i < n; i++) {
                    ts.Debug.assert(i <= 1);
                    var heritageClause = node.heritageClauses[i];
                    if (heritageClause.token === 77 /* ExtendsKeyword */) {
                        if (seenExtendsClause) {
                            return grammarErrorOnFirstToken(heritageClause, ts.Diagnostics.extends_clause_already_seen);
                        }
                        seenExtendsClause = true;
                    }
                    else {
                        ts.Debug.assert(heritageClause.token === 100 /* ImplementsKeyword */);
                        return grammarErrorOnFirstToken(heritageClause, ts.Diagnostics.Interface_declaration_cannot_have_implements_clause);
                    }
                }
            }
            return false;
        }
        function checkMethod(node) {
            if (checkAnySignatureDeclaration(node) ||
                checkForBodyInAmbientContext(node.body, false) ||
                checkForGenerator(node)) {
                return true;
            }
            if (node.parent.kind === 185 /* ClassDeclaration */) {
                if (checkForInvalidQuestionMark(node, node.questionToken, ts.Diagnostics.A_class_member_cannot_be_declared_optional)) {
                    return true;
                }
                // Technically, computed properties in ambient contexts is disallowed 
                // for property declarations and accessors too, not just methods.
                // However, property declarations disallow computed names in general,
                // and accessors are not allowed in ambient contexts in general,
                // so this error only really matters for methods.
                if (inAmbientContext) {
                    return checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_an_ambient_context);
                }
                else if (!node.body) {
                    return checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_method_overloads);
                }
            }
            else if (node.parent.kind === 186 /* InterfaceDeclaration */) {
                return checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_interfaces);
            }
            else if (node.parent.kind === 136 /* TypeLiteral */) {
                return checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_type_literals);
            }
        }
        function checkForBodyInAmbientContext(body, isConstructor) {
            if (inAmbientContext && body && body.kind === 163 /* Block */) {
                var diagnostic = isConstructor
                    ? ts.Diagnostics.A_constructor_implementation_cannot_be_declared_in_an_ambient_context
                    : ts.Diagnostics.A_function_implementation_cannot_be_declared_in_an_ambient_context;
                return grammarErrorOnFirstToken(body, diagnostic);
            }
        }
        function checkModuleDeclaration(node) {
            return checkModuleDeclarationName(node) ||
                checkModuleDeclarationStatements(node);
        }
        function checkModuleDeclarationName(node) {
            if (!inAmbientContext && node.name.kind === 7 /* StringLiteral */) {
                return grammarErrorOnNode(node.name, ts.Diagnostics.Only_ambient_modules_can_use_quoted_names);
            }
        }
        function checkModuleDeclarationStatements(node) {
            if (node.name.kind === 63 /* Identifier */ && node.body.kind === 190 /* ModuleBlock */) {
                var statements = node.body.statements;
                for (var i = 0, n = statements.length; i < n; i++) {
                    var statement = statements[i];
                    if (statement.kind === 192 /* ExportAssignment */) {
                        // Export assignments are not allowed in an internal module
                        return grammarErrorOnNode(statement, ts.Diagnostics.An_export_assignment_cannot_be_used_in_an_internal_module);
                    }
                    else if (ts.isExternalModuleImportDeclaration(statement)) {
                        return grammarErrorOnNode(ts.getExternalModuleImportDeclarationExpression(statement), ts.Diagnostics.Import_declarations_in_an_internal_module_cannot_reference_an_external_module);
                    }
                }
            }
        }
        function checkObjectLiteralExpression(node) {
            var seen = {};
            var Property = 1;
            var GetAccessor = 2;
            var SetAccesor = 4;
            var GetOrSetAccessor = GetAccessor | SetAccesor;
            var inStrictMode = (node.parserContextFlags & 1 /* StrictMode */) !== 0;
            for (var i = 0, n = node.properties.length; i < n; i++) {
                var prop = node.properties[i];
                var name = prop.name;
                if (prop.kind === 161 /* OmittedExpression */ || name.kind === 121 /* ComputedPropertyName */) {
                    continue;
                }
                // ECMA-262 11.1.5 Object Initialiser 
                // If previous is not undefined then throw a SyntaxError exception if any of the following conditions are true
                // a.This production is contained in strict code and IsDataDescriptor(previous) is true and 
                // IsDataDescriptor(propId.descriptor) is true.
                //    b.IsDataDescriptor(previous) is true and IsAccessorDescriptor(propId.descriptor) is true.
                //    c.IsAccessorDescriptor(previous) is true and IsDataDescriptor(propId.descriptor) is true.
                //    d.IsAccessorDescriptor(previous) is true and IsAccessorDescriptor(propId.descriptor) is true 
                // and either both previous and propId.descriptor have[[Get]] fields or both previous and propId.descriptor have[[Set]] fields 
                var currentKind;
                if (prop.kind === 198 /* PropertyAssignment */ ||
                    prop.kind === 199 /* ShorthandPropertyAssignment */ ||
                    prop.kind === 125 /* Method */) {
                    currentKind = Property;
                }
                else if (prop.kind === 127 /* GetAccessor */) {
                    currentKind = GetAccessor;
                }
                else if (prop.kind === 128 /* SetAccessor */) {
                    currentKind = SetAccesor;
                }
                else {
                    ts.Debug.fail("Unexpected syntax kind:" + prop.kind);
                }
                if (!ts.hasProperty(seen, name.text)) {
                    seen[name.text] = currentKind;
                }
                else {
                    var existingKind = seen[name.text];
                    if (currentKind === Property && existingKind === Property) {
                        if (inStrictMode) {
                            grammarErrorOnNode(name, ts.Diagnostics.An_object_literal_cannot_have_multiple_properties_with_the_same_name_in_strict_mode);
                        }
                    }
                    else if ((currentKind & GetOrSetAccessor) && (existingKind & GetOrSetAccessor)) {
                        if (existingKind !== GetOrSetAccessor && currentKind !== existingKind) {
                            seen[name.text] = currentKind | existingKind;
                        }
                        else {
                            return grammarErrorOnNode(name, ts.Diagnostics.An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name);
                        }
                    }
                    else {
                        return grammarErrorOnNode(name, ts.Diagnostics.An_object_literal_cannot_have_property_and_accessor_with_the_same_name);
                    }
                }
            }
        }
        function checkNumericLiteral(node) {
            if (node.flags & 8192 /* OctalLiteral */) {
                if (node.parserContextFlags & 1 /* StrictMode */) {
                    return grammarErrorOnNode(node, ts.Diagnostics.Octal_literals_are_not_allowed_in_strict_mode);
                }
                else if (languageVersion >= 1 /* ES5 */) {
                    return grammarErrorOnNode(node, ts.Diagnostics.Octal_literals_are_not_available_when_targeting_ECMAScript_5_and_higher);
                }
            }
        }
        function checkModifiers(node) {
            switch (node.kind) {
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                case 126 /* Constructor */:
                case 124 /* Property */:
                case 125 /* Method */:
                case 131 /* IndexSignature */:
                case 185 /* ClassDeclaration */:
                case 186 /* InterfaceDeclaration */:
                case 189 /* ModuleDeclaration */:
                case 188 /* EnumDeclaration */:
                case 192 /* ExportAssignment */:
                case 164 /* VariableStatement */:
                case 184 /* FunctionDeclaration */:
                case 187 /* TypeAliasDeclaration */:
                case 191 /* ImportDeclaration */:
                case 123 /* Parameter */:
                    break;
                default:
                    return false;
            }
            if (!node.modifiers) {
                return;
            }
            var lastStatic, lastPrivate, lastProtected, lastDeclare;
            var flags = 0;
            for (var i = 0, n = node.modifiers.length; i < n; i++) {
                var modifier = node.modifiers[i];
                switch (modifier.kind) {
                    case 106 /* PublicKeyword */:
                    case 105 /* ProtectedKeyword */:
                    case 104 /* PrivateKeyword */:
                        var text;
                        if (modifier.kind === 106 /* PublicKeyword */) {
                            text = "public";
                        }
                        else if (modifier.kind === 105 /* ProtectedKeyword */) {
                            text = "protected";
                            lastProtected = modifier;
                        }
                        else {
                            text = "private";
                            lastPrivate = modifier;
                        }
                        if (flags & 112 /* AccessibilityModifier */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics.Accessibility_modifier_already_seen);
                        }
                        else if (flags & 128 /* Static */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_must_precede_1_modifier, text, "static");
                        }
                        else if (node.parent.kind === 190 /* ModuleBlock */ || node.parent.kind === 201 /* SourceFile */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_module_element, text);
                        }
                        flags |= modifierToFlag(modifier.kind);
                        break;
                    case 107 /* StaticKeyword */:
                        if (flags & 128 /* Static */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_already_seen, "static");
                        }
                        else if (node.parent.kind === 190 /* ModuleBlock */ || node.parent.kind === 201 /* SourceFile */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_module_element, "static");
                        }
                        else if (node.kind === 123 /* Parameter */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_parameter, "static");
                        }
                        flags |= 128 /* Static */;
                        lastStatic = modifier;
                        break;
                    case 76 /* ExportKeyword */:
                        if (flags & 1 /* Export */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_already_seen, "export");
                        }
                        else if (flags & 2 /* Ambient */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_must_precede_1_modifier, "export", "declare");
                        }
                        else if (node.parent.kind === 185 /* ClassDeclaration */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_class_element, "export");
                        }
                        else if (node.kind === 123 /* Parameter */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_parameter, "export");
                        }
                        flags |= 1 /* Export */;
                        break;
                    case 112 /* DeclareKeyword */:
                        if (flags & 2 /* Ambient */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_already_seen, "declare");
                        }
                        else if (node.parent.kind === 185 /* ClassDeclaration */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_class_element, "declare");
                        }
                        else if (node.kind === 123 /* Parameter */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics._0_modifier_cannot_appear_on_a_parameter, "declare");
                        }
                        else if (inAmbientContext && node.parent.kind === 190 /* ModuleBlock */) {
                            return grammarErrorOnNode(modifier, ts.Diagnostics.A_declare_modifier_cannot_be_used_in_an_already_ambient_context);
                        }
                        flags |= 2 /* Ambient */;
                        lastDeclare = modifier;
                        break;
                }
            }
            if (node.kind === 126 /* Constructor */) {
                if (flags & 128 /* Static */) {
                    return grammarErrorOnNode(lastStatic, ts.Diagnostics._0_modifier_cannot_appear_on_a_constructor_declaration, "static");
                }
                else if (flags & 64 /* Protected */) {
                    return grammarErrorOnNode(lastProtected, ts.Diagnostics._0_modifier_cannot_appear_on_a_constructor_declaration, "protected");
                }
                else if (flags & 32 /* Private */) {
                    return grammarErrorOnNode(lastPrivate, ts.Diagnostics._0_modifier_cannot_appear_on_a_constructor_declaration, "private");
                }
            }
            else if (node.kind === 191 /* ImportDeclaration */ && flags & 2 /* Ambient */) {
                return grammarErrorOnNode(lastDeclare, ts.Diagnostics.A_declare_modifier_cannot_be_used_with_an_import_declaration, "declare");
            }
            else if (node.kind === 186 /* InterfaceDeclaration */ && flags & 2 /* Ambient */) {
                return grammarErrorOnNode(lastDeclare, ts.Diagnostics.A_declare_modifier_cannot_be_used_with_an_interface_declaration, "declare");
            }
        }
        function checkParameter(node) {
            // It is a SyntaxError if the Identifier "eval" or the Identifier "arguments" occurs as the 
            // Identifier in a PropertySetParameterList of a PropertyAssignment that is contained in strict code 
            // or if its FunctionBody is strict code(11.1.5).
            // It is a SyntaxError if the identifier eval or arguments appears within a FormalParameterList of a 
            // strict mode FunctionLikeDeclaration or FunctionExpression(13.1) 
            if (node.parserContextFlags & 1 /* StrictMode */ && isEvalOrArgumentsIdentifier(node.name)) {
                return reportInvalidUseInStrictMode(node.name);
            }
        }
        function checkTypeParameterList(typeParameters) {
            if (checkForDisallowedTrailingComma(typeParameters)) {
                return true;
            }
            if (typeParameters && typeParameters.length === 0) {
                var start = typeParameters.pos - "<".length;
                var end = ts.skipTrivia(sourceText, typeParameters.end) + ">".length;
                return grammarErrorAtPos(start, end - start, ts.Diagnostics.Type_parameter_list_cannot_be_empty);
            }
        }
        function checkParameterList(parameters) {
            if (checkForDisallowedTrailingComma(parameters)) {
                return true;
            }
            var seenOptionalParameter = false;
            var parameterCount = parameters.length;
            for (var i = 0; i < parameterCount; i++) {
                var parameter = parameters[i];
                if (parameter.dotDotDotToken) {
                    if (i !== (parameterCount - 1)) {
                        return grammarErrorOnNode(parameter.dotDotDotToken, ts.Diagnostics.A_rest_parameter_must_be_last_in_a_parameter_list);
                    }
                    if (parameter.questionToken) {
                        return grammarErrorOnNode(parameter.questionToken, ts.Diagnostics.A_rest_parameter_cannot_be_optional);
                    }
                    if (parameter.initializer) {
                        return grammarErrorOnNode(parameter.name, ts.Diagnostics.A_rest_parameter_cannot_have_an_initializer);
                    }
                }
                else if (parameter.questionToken || parameter.initializer) {
                    seenOptionalParameter = true;
                    if (parameter.questionToken && parameter.initializer) {
                        return grammarErrorOnNode(parameter.name, ts.Diagnostics.Parameter_cannot_have_question_mark_and_initializer);
                    }
                }
                else {
                    if (seenOptionalParameter) {
                        return grammarErrorOnNode(parameter.name, ts.Diagnostics.A_required_parameter_cannot_follow_an_optional_parameter);
                    }
                }
            }
        }
        function checkPostfixUnaryExpression(node) {
            // The identifier eval or arguments may not appear as the LeftHandSideExpression of an 
            // Assignment operator(11.13) or of a PostfixExpression(11.3) or as the UnaryExpression 
            // operated upon by a Prefix Increment(11.4.4) or a Prefix Decrement(11.4.5) operator. 
            if (node.parserContextFlags & 1 /* StrictMode */ && isEvalOrArgumentsIdentifier(node.operand)) {
                return reportInvalidUseInStrictMode(node.operand);
            }
        }
        function checkPrefixUnaryExpression(node) {
            if (node.parserContextFlags & 1 /* StrictMode */) {
                // The identifier eval or arguments may not appear as the LeftHandSideExpression of an 
                // Assignment operator(11.13) or of a PostfixExpression(11.3) or as the UnaryExpression 
                // operated upon by a Prefix Increment(11.4.4) or a Prefix Decrement(11.4.5) operator
                if ((node.operator === 37 /* PlusPlusToken */ || node.operator === 38 /* MinusMinusToken */) && isEvalOrArgumentsIdentifier(node.operand)) {
                    return reportInvalidUseInStrictMode(node.operand);
                }
            }
        }
        function checkProperty(node) {
            if (node.parent.kind === 185 /* ClassDeclaration */) {
                if (checkForInvalidQuestionMark(node, node.questionToken, ts.Diagnostics.A_class_member_cannot_be_declared_optional) ||
                    checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_class_property_declarations)) {
                    return true;
                }
            }
            else if (node.parent.kind === 186 /* InterfaceDeclaration */) {
                if (checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_interfaces)) {
                    return true;
                }
            }
            else if (node.parent.kind === 136 /* TypeLiteral */) {
                if (checkForDisallowedComputedProperty(node.name, ts.Diagnostics.Computed_property_names_are_not_allowed_in_type_literals)) {
                    return true;
                }
            }
            return checkForInitializerInAmbientContext(node);
        }
        function checkComputedPropertyName(node) {
            // Since computed properties are not supported in the type checker, disallow them in TypeScript 1.4
            // Once full support is added, remove this error.
            return grammarErrorOnNode(node, ts.Diagnostics.Computed_property_names_are_not_currently_supported);
            if (languageVersion < 2 /* ES6 */) {
                return grammarErrorOnNode(node, ts.Diagnostics.Computed_property_names_are_only_available_when_targeting_ECMAScript_6_and_higher);
            }
            else if (node.expression.kind === 157 /* BinaryExpression */ && node.expression.operator === 22 /* CommaToken */) {
                return grammarErrorOnNode(node.expression, ts.Diagnostics.A_comma_expression_is_not_allowed_in_a_computed_property_name);
            }
        }
        function checkForDisallowedComputedProperty(node, message) {
            if (node.kind === 121 /* ComputedPropertyName */) {
                return grammarErrorOnNode(node, message);
            }
        }
        function checkForInitializerInAmbientContext(node) {
            if (inAmbientContext && node.initializer) {
                return grammarErrorOnFirstToken(node.initializer, ts.Diagnostics.Initializers_are_not_allowed_in_ambient_contexts);
            }
        }
        function checkPropertyAssignment(node) {
            return checkForInvalidQuestionMark(node, node.questionToken, ts.Diagnostics.An_object_member_cannot_be_declared_optional);
        }
        function checkForInvalidQuestionMark(node, questionToken, message) {
            if (questionToken) {
                return grammarErrorOnNode(questionToken, message);
            }
        }
        function checkReturnStatement(node) {
            if (!inFunctionBlock) {
                return grammarErrorOnFirstToken(node, ts.Diagnostics.A_return_statement_can_only_be_used_within_a_function_body);
            }
        }
        function checkSetAccessor(node) {
            return checkAnySignatureDeclaration(node) ||
                checkAccessor(node);
        }
        function checkAccessor(accessor) {
            var kind = accessor.kind;
            if (languageVersion < 1 /* ES5 */) {
                return grammarErrorOnNode(accessor.name, ts.Diagnostics.Accessors_are_only_available_when_targeting_ECMAScript_5_and_higher);
            }
            else if (inAmbientContext) {
                return grammarErrorOnNode(accessor.name, ts.Diagnostics.An_accessor_cannot_be_declared_in_an_ambient_context);
            }
            else if (accessor.body === undefined) {
                return grammarErrorAtPos(accessor.end - 1, ";".length, ts.Diagnostics._0_expected, "{");
            }
            else if (accessor.typeParameters) {
                return grammarErrorOnNode(accessor.name, ts.Diagnostics.An_accessor_cannot_have_type_parameters);
            }
            else if (kind === 127 /* GetAccessor */ && accessor.parameters.length) {
                return grammarErrorOnNode(accessor.name, ts.Diagnostics.A_get_accessor_cannot_have_parameters);
            }
            else if (kind === 128 /* SetAccessor */) {
                if (accessor.type) {
                    return grammarErrorOnNode(accessor.name, ts.Diagnostics.A_set_accessor_cannot_have_a_return_type_annotation);
                }
                else if (accessor.parameters.length !== 1) {
                    return grammarErrorOnNode(accessor.name, ts.Diagnostics.A_set_accessor_must_have_exactly_one_parameter);
                }
                else {
                    var parameter = accessor.parameters[0];
                    if (parameter.dotDotDotToken) {
                        return grammarErrorOnNode(parameter.dotDotDotToken, ts.Diagnostics.A_set_accessor_cannot_have_rest_parameter);
                    }
                    else if (parameter.flags & 243 /* Modifier */) {
                        return grammarErrorOnNode(accessor.name, ts.Diagnostics.A_parameter_property_is_only_allowed_in_a_constructor_implementation);
                    }
                    else if (parameter.questionToken) {
                        return grammarErrorOnNode(parameter.questionToken, ts.Diagnostics.A_set_accessor_cannot_have_an_optional_parameter);
                    }
                    else if (parameter.initializer) {
                        return grammarErrorOnNode(accessor.name, ts.Diagnostics.A_set_accessor_parameter_cannot_have_an_initializer);
                    }
                }
            }
        }
        function checkSourceFile(node) {
            return inAmbientContext && checkTopLevelElementsForRequiredDeclareModifier(file);
        }
        function checkTopLevelElementsForRequiredDeclareModifier(file) {
            for (var i = 0, n = file.statements.length; i < n; i++) {
                var decl = file.statements[i];
                if (ts.isDeclaration(decl) || decl.kind === 164 /* VariableStatement */) {
                    if (checkTopLevelElementForRequiredDeclareModifier(decl)) {
                        return true;
                    }
                }
            }
        }
        function checkTopLevelElementForRequiredDeclareModifier(node) {
            // A declare modifier is required for any top level .d.ts declaration except export=, interfaces and imports:
            // categories:
            //
            //  DeclarationElement:
            //     ExportAssignment
            //     export_opt   InterfaceDeclaration
            //     export_opt   ImportDeclaration
            //     export_opt   ExternalImportDeclaration
            //     export_opt   AmbientDeclaration
            //
            if (node.kind === 186 /* InterfaceDeclaration */ ||
                node.kind === 191 /* ImportDeclaration */ ||
                node.kind === 192 /* ExportAssignment */ ||
                (node.flags & 2 /* Ambient */)) {
                return false;
            }
            return grammarErrorOnFirstToken(node, ts.Diagnostics.A_declare_modifier_is_required_for_a_top_level_declaration_in_a_d_ts_file);
        }
        function checkShorthandPropertyAssignment(node) {
            return checkForInvalidQuestionMark(node, node.questionToken, ts.Diagnostics.An_object_member_cannot_be_declared_optional);
        }
        function checkSwitchStatement(node) {
            var firstDefaultClause;
            // Error on duplicate 'default' clauses.
            for (var i = 0, n = node.clauses.length; i < n; i++) {
                var clause = node.clauses[i];
                if (clause.kind === 195 /* DefaultClause */) {
                    if (firstDefaultClause === undefined) {
                        firstDefaultClause = clause;
                    }
                    else {
                        var start = ts.skipTrivia(file.text, clause.pos);
                        var end = clause.statements.length > 0 ? clause.statements[0].pos : clause.end;
                        return grammarErrorAtPos(start, end - start, ts.Diagnostics.A_default_clause_cannot_appear_more_than_once_in_a_switch_statement);
                    }
                }
            }
        }
        function checkTaggedTemplateExpression(node) {
            if (languageVersion < 2 /* ES6 */) {
                return grammarErrorOnFirstToken(node.template, ts.Diagnostics.Tagged_templates_are_only_available_when_targeting_ECMAScript_6_and_higher);
            }
        }
        function checkThrowStatement(node) {
            if (node.expression === undefined) {
                return grammarErrorAfterFirstToken(node, ts.Diagnostics.Line_break_not_permitted_here);
            }
        }
        function checkTupleType(node) {
            return checkForDisallowedTrailingComma(node.elementTypes) ||
                checkForAtLeastOneType(node);
        }
        function checkForAtLeastOneType(node) {
            if (node.elementTypes.length === 0) {
                return grammarErrorOnNode(node, ts.Diagnostics.A_tuple_type_element_list_cannot_be_empty);
            }
        }
        function checkTypeParameter(node) {
            if (node.expression) {
                return grammarErrorOnFirstToken(node.expression, ts.Diagnostics.Type_expected);
            }
        }
        function checkTypeReference(node) {
            return checkTypeArguments(node.typeArguments);
        }
        function checkVariableDeclaration(node) {
            if (inAmbientContext && node.initializer) {
                var equalsPos = node.type ? ts.skipTrivia(sourceText, node.type.end) : ts.skipTrivia(sourceText, node.name.end);
                return grammarErrorAtPos(equalsPos, "=".length, ts.Diagnostics.Initializers_are_not_allowed_in_ambient_contexts);
            }
            if (!inAmbientContext && !node.initializer && ts.isConst(node)) {
                return grammarErrorOnNode(node, ts.Diagnostics.const_declarations_must_be_initialized);
            }
            if (node.parserContextFlags & 1 /* StrictMode */ && isEvalOrArgumentsIdentifier(node.name)) {
                // It is a SyntaxError if a VariableDeclaration or VariableDeclarationNoIn occurs within strict code 
                // and its Identifier is eval or arguments 
                return reportInvalidUseInStrictMode(node.name);
            }
        }
        function checkVariableDeclarations(declarations) {
            if (declarations) {
                if (checkForDisallowedTrailingComma(declarations)) {
                    return true;
                }
                if (!declarations.length) {
                    return grammarErrorAtPos(declarations.pos, declarations.end - declarations.pos, ts.Diagnostics.Variable_declaration_list_cannot_be_empty);
                }
                var decl = declarations[0];
                if (languageVersion < 2 /* ES6 */) {
                    if (ts.isLet(decl)) {
                        return grammarErrorOnFirstToken(decl, ts.Diagnostics.let_declarations_are_only_available_when_targeting_ECMAScript_6_and_higher);
                    }
                    else if (ts.isConst(decl)) {
                        return grammarErrorOnFirstToken(decl, ts.Diagnostics.const_declarations_are_only_available_when_targeting_ECMAScript_6_and_higher);
                    }
                }
            }
        }
        function checkVariableStatement(node) {
            return checkVariableDeclarations(node.declarations) ||
                checkForDisallowedLetOrConstStatement(node);
        }
        function checkForDisallowedLetOrConstStatement(node) {
            if (!allowLetAndConstDeclarations(node.parent)) {
                if (ts.isLet(node)) {
                    return grammarErrorOnNode(node, ts.Diagnostics.let_declarations_can_only_be_declared_inside_a_block);
                }
                else if (ts.isConst(node)) {
                    return grammarErrorOnNode(node, ts.Diagnostics.const_declarations_can_only_be_declared_inside_a_block);
                }
            }
        }
        function allowLetAndConstDeclarations(parent) {
            switch (parent.kind) {
                case 167 /* IfStatement */:
                case 168 /* DoStatement */:
                case 169 /* WhileStatement */:
                case 175 /* WithStatement */:
                case 170 /* ForStatement */:
                case 171 /* ForInStatement */:
                    return false;
                case 177 /* LabeledStatement */:
                    return allowLetAndConstDeclarations(parent.parent);
            }
            return true;
        }
        function checkWithStatement(node) {
            if (node.parserContextFlags & 1 /* StrictMode */) {
                // Strict mode code may not include a WithStatement. The occurrence of a WithStatement in such 
                // a context is an 
                return grammarErrorOnFirstToken(node, ts.Diagnostics.with_statements_are_not_allowed_in_strict_mode);
            }
        }
        function checkYieldExpression(node) {
            if (!(node.parserContextFlags & 4 /* Yield */)) {
                return grammarErrorOnFirstToken(node, ts.Diagnostics.yield_expression_must_be_contained_within_a_generator_declaration);
            }
            return grammarErrorOnFirstToken(node, ts.Diagnostics.yield_expressions_are_not_currently_supported);
        }
    }
    function createProgram(rootNames, options, host) {
        var program;
        var files = [];
        var filesByName = {};
        var errors = [];
        var seenNoDefaultLib = options.noLib;
        var commonSourceDirectory;
        ts.forEach(rootNames, function (name) { return processRootFile(name, false); });
        if (!seenNoDefaultLib) {
            processRootFile(host.getDefaultLibFilename(options), true);
        }
        verifyCompilerOptions();
        errors.sort(ts.compareDiagnostics);
        program = {
            getSourceFile: getSourceFile,
            getSourceFiles: function () { return files; },
            getCompilerOptions: function () { return options; },
            getCompilerHost: function () { return host; },
            getDiagnostics: getDiagnostics,
            getGlobalDiagnostics: getGlobalDiagnostics,
            getTypeChecker: function (fullTypeCheckMode) { return ts.createTypeChecker(program, fullTypeCheckMode); },
            getCommonSourceDirectory: function () { return commonSourceDirectory; }
        };
        return program;
        function getSourceFile(filename) {
            filename = host.getCanonicalFileName(filename);
            return ts.hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
        }
        function getDiagnostics(sourceFile) {
            return sourceFile ? ts.filter(errors, function (e) { return e.file === sourceFile; }) : errors;
        }
        function getGlobalDiagnostics() {
            return ts.filter(errors, function (e) { return !e.file; });
        }
        function hasExtension(filename) {
            return ts.getBaseFilename(filename).indexOf(".") >= 0;
        }
        function processRootFile(filename, isDefaultLib) {
            processSourceFile(ts.normalizePath(filename), isDefaultLib);
        }
        function processSourceFile(filename, isDefaultLib, refFile, refPos, refEnd) {
            if (refEnd !== undefined && refPos !== undefined) {
                var start = refPos;
                var length = refEnd - refPos;
            }
            var diagnostic;
            if (hasExtension(filename)) {
                if (!options.allowNonTsExtensions && !ts.fileExtensionIs(filename, ".ts")) {
                    diagnostic = ts.Diagnostics.File_0_must_have_extension_ts_or_d_ts;
                }
                else if (!findSourceFile(filename, isDefaultLib, refFile, refPos, refEnd)) {
                    diagnostic = ts.Diagnostics.File_0_not_found;
                }
                else if (refFile && host.getCanonicalFileName(filename) === host.getCanonicalFileName(refFile.filename)) {
                    diagnostic = ts.Diagnostics.A_file_cannot_have_a_reference_to_itself;
                }
            }
            else {
                if (options.allowNonTsExtensions && !findSourceFile(filename, isDefaultLib, refFile, refPos, refEnd)) {
                    diagnostic = ts.Diagnostics.File_0_not_found;
                }
                else if (!findSourceFile(filename + ".ts", isDefaultLib, refFile, refPos, refEnd) && !findSourceFile(filename + ".d.ts", isDefaultLib, refFile, refPos, refEnd)) {
                    diagnostic = ts.Diagnostics.File_0_not_found;
                    filename += ".ts";
                }
            }
            if (diagnostic) {
                if (refFile) {
                    errors.push(ts.createFileDiagnostic(refFile, start, length, diagnostic, filename));
                }
                else {
                    errors.push(ts.createCompilerDiagnostic(diagnostic, filename));
                }
            }
        }
        // Get source file from normalized filename
        function findSourceFile(filename, isDefaultLib, refFile, refStart, refLength) {
            var canonicalName = host.getCanonicalFileName(filename);
            if (ts.hasProperty(filesByName, canonicalName)) {
                // We've already looked for this file, use cached result
                return getSourceFileFromCache(filename, canonicalName, false);
            }
            else {
                var normalizedAbsolutePath = ts.getNormalizedAbsolutePath(filename, host.getCurrentDirectory());
                var canonicalAbsolutePath = host.getCanonicalFileName(normalizedAbsolutePath);
                if (ts.hasProperty(filesByName, canonicalAbsolutePath)) {
                    return getSourceFileFromCache(normalizedAbsolutePath, canonicalAbsolutePath, true);
                }
                // We haven't looked for this file, do so now and cache result
                var file = filesByName[canonicalName] = host.getSourceFile(filename, options.target, function (hostErrorMessage) {
                    errors.push(ts.createFileDiagnostic(refFile, refStart, refLength, ts.Diagnostics.Cannot_read_file_0_Colon_1, filename, hostErrorMessage));
                });
                if (file) {
                    seenNoDefaultLib = seenNoDefaultLib || file.hasNoDefaultLib;
                    // Set the source file for normalized absolute path
                    filesByName[canonicalAbsolutePath] = file;
                    if (!options.noResolve) {
                        var basePath = ts.getDirectoryPath(filename);
                        processReferencedFiles(file, basePath);
                        processImportedModules(file, basePath);
                    }
                    if (isDefaultLib) {
                        files.unshift(file);
                    }
                    else {
                        files.push(file);
                    }
                    ts.forEach(file.getSyntacticDiagnostics(), function (e) {
                        errors.push(e);
                    });
                }
            }
            return file;
            function getSourceFileFromCache(filename, canonicalName, useAbsolutePath) {
                var file = filesByName[canonicalName];
                if (file && host.useCaseSensitiveFileNames()) {
                    var sourceFileName = useAbsolutePath ? ts.getNormalizedAbsolutePath(file.filename, host.getCurrentDirectory()) : file.filename;
                    if (canonicalName !== sourceFileName) {
                        errors.push(ts.createFileDiagnostic(refFile, refStart, refLength, ts.Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, sourceFileName));
                    }
                }
                return file;
            }
        }
        function processReferencedFiles(file, basePath) {
            ts.forEach(file.referencedFiles, function (ref) {
                var referencedFilename = ts.isRootedDiskPath(ref.filename) ? ref.filename : ts.combinePaths(basePath, ref.filename);
                processSourceFile(ts.normalizePath(referencedFilename), false, file, ref.pos, ref.end);
            });
        }
        function processImportedModules(file, basePath) {
            ts.forEach(file.statements, function (node) {
                if (ts.isExternalModuleImportDeclaration(node) &&
                    ts.getExternalModuleImportDeclarationExpression(node).kind === 7 /* StringLiteral */) {
                    var nameLiteral = ts.getExternalModuleImportDeclarationExpression(node);
                    var moduleName = nameLiteral.text;
                    if (moduleName) {
                        var searchPath = basePath;
                        while (true) {
                            var searchName = ts.normalizePath(ts.combinePaths(searchPath, moduleName));
                            if (findModuleSourceFile(searchName + ".ts", nameLiteral) || findModuleSourceFile(searchName + ".d.ts", nameLiteral)) {
                                break;
                            }
                            var parentPath = ts.getDirectoryPath(searchPath);
                            if (parentPath === searchPath) {
                                break;
                            }
                            searchPath = parentPath;
                        }
                    }
                }
                else if (node.kind === 189 /* ModuleDeclaration */ && node.name.kind === 7 /* StringLiteral */ && (node.flags & 2 /* Ambient */ || ts.isDeclarationFile(file))) {
                    // TypeScript 1.0 spec (April 2014): 12.1.6
                    // An AmbientExternalModuleDeclaration declares an external module. 
                    // This type of declaration is permitted only in the global module.
                    // The StringLiteral must specify a top - level external module name.
                    // Relative external module names are not permitted
                    forEachChild(node.body, function (node) {
                        if (ts.isExternalModuleImportDeclaration(node) &&
                            ts.getExternalModuleImportDeclarationExpression(node).kind === 7 /* StringLiteral */) {
                            var nameLiteral = ts.getExternalModuleImportDeclarationExpression(node);
                            var moduleName = nameLiteral.text;
                            if (moduleName) {
                                // TypeScript 1.0 spec (April 2014): 12.1.6
                                // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules 
                                // only through top - level external module names. Relative external module names are not permitted.
                                var searchName = ts.normalizePath(ts.combinePaths(basePath, moduleName));
                                var tsFile = findModuleSourceFile(searchName + ".ts", nameLiteral);
                                if (!tsFile) {
                                    findModuleSourceFile(searchName + ".d.ts", nameLiteral);
                                }
                            }
                        }
                    });
                }
            });
            function findModuleSourceFile(filename, nameLiteral) {
                return findSourceFile(filename, false, file, nameLiteral.pos, nameLiteral.end - nameLiteral.pos);
            }
        }
        function verifyCompilerOptions() {
            if (!options.sourceMap && (options.mapRoot || options.sourceRoot)) {
                // Error to specify --mapRoot or --sourceRoot without mapSourceFiles
                if (options.mapRoot) {
                    errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Option_mapRoot_cannot_be_specified_without_specifying_sourcemap_option));
                }
                if (options.sourceRoot) {
                    errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Option_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option));
                }
                return;
            }
            var firstExternalModule = ts.forEach(files, function (f) { return ts.isExternalModule(f) ? f : undefined; });
            if (firstExternalModule && options.module === 0 /* None */) {
                // We cannot use createDiagnosticFromNode because nodes do not have parents yet
                var externalModuleErrorSpan = ts.getErrorSpanForNode(firstExternalModule.externalModuleIndicator);
                var errorStart = ts.skipTrivia(firstExternalModule.text, externalModuleErrorSpan.pos);
                var errorLength = externalModuleErrorSpan.end - errorStart;
                errors.push(ts.createFileDiagnostic(firstExternalModule, errorStart, errorLength, ts.Diagnostics.Cannot_compile_external_modules_unless_the_module_flag_is_provided));
            }
            // there has to be common source directory if user specified --outdir || --sourcRoot
            // if user specified --mapRoot, there needs to be common source directory if there would be multiple files being emitted
            if (options.outDir ||
                options.sourceRoot ||
                (options.mapRoot &&
                    (!options.out || firstExternalModule !== undefined))) {
                var commonPathComponents;
                ts.forEach(files, function (sourceFile) {
                    // Each file contributes into common source file path
                    if (!(sourceFile.flags & 1024 /* DeclarationFile */)
                        && !ts.fileExtensionIs(sourceFile.filename, ".js")) {
                        var sourcePathComponents = ts.getNormalizedPathComponents(sourceFile.filename, host.getCurrentDirectory());
                        sourcePathComponents.pop(); // FileName is not part of directory
                        if (commonPathComponents) {
                            for (var i = 0; i < Math.min(commonPathComponents.length, sourcePathComponents.length); i++) {
                                if (commonPathComponents[i] !== sourcePathComponents[i]) {
                                    if (i === 0) {
                                        errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Cannot_find_the_common_subdirectory_path_for_the_input_files));
                                        return;
                                    }
                                    // New common path found that is 0 -> i-1
                                    commonPathComponents.length = i;
                                    break;
                                }
                            }
                            // If the fileComponent path completely matched and less than already found update the length
                            if (sourcePathComponents.length < commonPathComponents.length) {
                                commonPathComponents.length = sourcePathComponents.length;
                            }
                        }
                        else {
                            // first file
                            commonPathComponents = sourcePathComponents;
                        }
                    }
                });
                commonSourceDirectory = ts.getNormalizedPathFromPathComponents(commonPathComponents);
                if (commonSourceDirectory) {
                    // Make sure directory path ends with directory separator so this string can directly 
                    // used to replace with "" to get the relative path of the source file and the relative path doesn't
                    // start with / making it rooted path
                    commonSourceDirectory += ts.directorySeparator;
                }
            }
        }
    }
    ts.createProgram = createProgram;
})(ts || (ts = {}));
//# sourceMappingURL=parser.js.map