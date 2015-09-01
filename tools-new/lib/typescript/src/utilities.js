/// <reference path="types.ts" />
var ts;
(function (ts) {
    function getDeclarationOfKind(symbol, kind) {
        var declarations = symbol.declarations;
        for (var i = 0; i < declarations.length; i++) {
            var declaration = declarations[i];
            if (declaration.kind === kind) {
                return declaration;
            }
        }
        return undefined;
    }
    ts.getDeclarationOfKind = getDeclarationOfKind;
    // Pool writers to avoid needing to allocate them for every symbol we write.
    var stringWriters = [];
    function getSingleLineStringWriter() {
        if (stringWriters.length == 0) {
            var str = "";
            var writeText = function (text) { return str += text; };
            return {
                string: function () { return str; },
                writeKeyword: writeText,
                writeOperator: writeText,
                writePunctuation: writeText,
                writeSpace: writeText,
                writeStringLiteral: writeText,
                writeParameter: writeText,
                writeSymbol: writeText,
                // Completely ignore indentation for string writers.  And map newlines to
                // a single space.
                writeLine: function () { return str += " "; },
                increaseIndent: function () { },
                decreaseIndent: function () { },
                clear: function () { return str = ""; },
                trackSymbol: function () { }
            };
        }
        return stringWriters.pop();
    }
    ts.getSingleLineStringWriter = getSingleLineStringWriter;
    function releaseStringWriter(writer) {
        writer.clear();
        stringWriters.push(writer);
    }
    ts.releaseStringWriter = releaseStringWriter;
    function getFullWidth(node) {
        return node.end - node.pos;
    }
    ts.getFullWidth = getFullWidth;
    function hasFlag(val, flag) {
        return (val & flag) !== 0;
    }
    ts.hasFlag = hasFlag;
    // Returns true if this node contains a parse error anywhere underneath it.
    function containsParseError(node) {
        if (!hasFlag(node.parserContextFlags, 32 /* HasPropagatedChildContainsErrorFlag */)) {
            // A node is considered to contain a parse error if:
            //  a) the parser explicitly marked that it had an error
            //  b) any of it's children reported that it had an error.
            var val = hasFlag(node.parserContextFlags, 16 /* ContainsError */) ||
                ts.forEachChild(node, containsParseError);
            // If so, mark ourselves accordingly. 
            if (val) {
                node.parserContextFlags |= 16 /* ContainsError */;
            }
            // Also mark that we've propogated the child information to this node.  This way we can
            // always consult the bit directly on this node without needing to check its children
            // again.
            node.parserContextFlags |= 32 /* HasPropagatedChildContainsErrorFlag */;
        }
        return hasFlag(node.parserContextFlags, 16 /* ContainsError */);
    }
    ts.containsParseError = containsParseError;
    function getSourceFileOfNode(node) {
        while (node && node.kind !== 201 /* SourceFile */) {
            node = node.parent;
        }
        return node;
    }
    ts.getSourceFileOfNode = getSourceFileOfNode;
    // This is a useful function for debugging purposes.
    function nodePosToString(node) {
        var file = getSourceFileOfNode(node);
        var loc = file.getLineAndCharacterFromPosition(node.pos);
        return file.filename + "(" + loc.line + "," + loc.character + ")";
    }
    ts.nodePosToString = nodePosToString;
    function getStartPosOfNode(node) {
        return node.pos;
    }
    ts.getStartPosOfNode = getStartPosOfNode;
    function isMissingNode(node) {
        return node.pos === node.end && node.kind !== 1 /* EndOfFileToken */;
    }
    ts.isMissingNode = isMissingNode;
    function getTokenPosOfNode(node, sourceFile) {
        // With nodes that have no width (i.e. 'Missing' nodes), we actually *don't*
        // want to skip trivia because this will launch us forward to the next token.
        if (isMissingNode(node)) {
            return node.pos;
        }
        return ts.skipTrivia((sourceFile || getSourceFileOfNode(node)).text, node.pos);
    }
    ts.getTokenPosOfNode = getTokenPosOfNode;
    function getSourceTextOfNodeFromSourceFile(sourceFile, node) {
        if (isMissingNode(node)) {
            return "";
        }
        var text = sourceFile.text;
        return text.substring(ts.skipTrivia(text, node.pos), node.end);
    }
    ts.getSourceTextOfNodeFromSourceFile = getSourceTextOfNodeFromSourceFile;
    function getTextOfNodeFromSourceText(sourceText, node) {
        if (isMissingNode(node)) {
            return "";
        }
        return sourceText.substring(ts.skipTrivia(sourceText, node.pos), node.end);
    }
    ts.getTextOfNodeFromSourceText = getTextOfNodeFromSourceText;
    function getTextOfNode(node) {
        return getSourceTextOfNodeFromSourceFile(getSourceFileOfNode(node), node);
    }
    ts.getTextOfNode = getTextOfNode;
    // Add an extra underscore to identifiers that start with two underscores to avoid issues with magic names like '__proto__'
    function escapeIdentifier(identifier) {
        return identifier.length >= 2 && identifier.charCodeAt(0) === 95 /* _ */ && identifier.charCodeAt(1) === 95 /* _ */ ? "_" + identifier : identifier;
    }
    ts.escapeIdentifier = escapeIdentifier;
    // Remove extra underscore from escaped identifier
    function unescapeIdentifier(identifier) {
        return identifier.length >= 3 && identifier.charCodeAt(0) === 95 /* _ */ && identifier.charCodeAt(1) === 95 /* _ */ && identifier.charCodeAt(2) === 95 /* _ */ ? identifier.substr(1) : identifier;
    }
    ts.unescapeIdentifier = unescapeIdentifier;
    // Return display name of an identifier
    // Computed property names will just be emitted as "[<expr>]", where <expr> is the source
    // text of the expression in the computed property.
    function declarationNameToString(name) {
        return getFullWidth(name) === 0 ? "(Missing)" : getTextOfNode(name);
    }
    ts.declarationNameToString = declarationNameToString;
    function createDiagnosticForNode(node, message, arg0, arg1, arg2) {
        node = getErrorSpanForNode(node);
        var file = getSourceFileOfNode(node);
        var start = getTokenPosOfNode(node, file);
        var length = node.end - start;
        return ts.createFileDiagnostic(file, start, length, message, arg0, arg1, arg2);
    }
    ts.createDiagnosticForNode = createDiagnosticForNode;
    function createDiagnosticForNodeFromMessageChain(node, messageChain, newLine) {
        node = getErrorSpanForNode(node);
        var file = getSourceFileOfNode(node);
        var start = ts.skipTrivia(file.text, node.pos);
        var length = node.end - start;
        return ts.flattenDiagnosticChain(file, start, length, messageChain, newLine);
    }
    ts.createDiagnosticForNodeFromMessageChain = createDiagnosticForNodeFromMessageChain;
    function getErrorSpanForNode(node) {
        var errorSpan;
        switch (node.kind) {
            // This list is a work in progress. Add missing node kinds to improve their error
            // spans.
            case 183 /* VariableDeclaration */:
            case 185 /* ClassDeclaration */:
            case 186 /* InterfaceDeclaration */:
            case 189 /* ModuleDeclaration */:
            case 188 /* EnumDeclaration */:
            case 200 /* EnumMember */:
                errorSpan = node.name;
                break;
        }
        // We now have the ideal error span, but it may be a node that is optional and absent
        // (e.g. the name of a function expression), in which case errorSpan will be undefined.
        // Alternatively, it might be required and missing (e.g. the name of a module), in which
        // case its pos will equal its end (length 0). In either of these cases, we should fall
        // back to the original node that the error was issued on.
        return errorSpan && errorSpan.pos < errorSpan.end ? errorSpan : node;
    }
    ts.getErrorSpanForNode = getErrorSpanForNode;
    function isExternalModule(file) {
        return file.externalModuleIndicator !== undefined;
    }
    ts.isExternalModule = isExternalModule;
    function isDeclarationFile(file) {
        return (file.flags & 1024 /* DeclarationFile */) !== 0;
    }
    ts.isDeclarationFile = isDeclarationFile;
    function isConstEnumDeclaration(node) {
        return node.kind === 188 /* EnumDeclaration */ && isConst(node);
    }
    ts.isConstEnumDeclaration = isConstEnumDeclaration;
    function isConst(node) {
        return !!(node.flags & 4096 /* Const */);
    }
    ts.isConst = isConst;
    function isLet(node) {
        return !!(node.flags & 2048 /* Let */);
    }
    ts.isLet = isLet;
    function isPrologueDirective(node) {
        return node.kind === 166 /* ExpressionStatement */ && node.expression.kind === 7 /* StringLiteral */;
    }
    ts.isPrologueDirective = isPrologueDirective;
    function getLeadingCommentRangesOfNode(node, sourceFileOfNode) {
        sourceFileOfNode = sourceFileOfNode || getSourceFileOfNode(node);
        // If parameter/type parameter, the prev token trailing comments are part of this node too
        if (node.kind === 123 /* Parameter */ || node.kind === 122 /* TypeParameter */) {
            // e.g.   (/** blah */ a, /** blah */ b);
            return ts.concatenate(ts.getTrailingCommentRanges(sourceFileOfNode.text, node.pos), 
            // e.g.:     (
            //            /** blah */ a,
            //            /** blah */ b);
            ts.getLeadingCommentRanges(sourceFileOfNode.text, node.pos));
        }
        else {
            return ts.getLeadingCommentRanges(sourceFileOfNode.text, node.pos);
        }
    }
    ts.getLeadingCommentRangesOfNode = getLeadingCommentRangesOfNode;
    function getJsDocComments(node, sourceFileOfNode) {
        return ts.filter(getLeadingCommentRangesOfNode(node, sourceFileOfNode), isJsDocComment);
        function isJsDocComment(comment) {
            // True if the comment starts with '/**' but not if it is '/**/'
            return sourceFileOfNode.text.charCodeAt(comment.pos + 1) === 42 /* asterisk */ &&
                sourceFileOfNode.text.charCodeAt(comment.pos + 2) === 42 /* asterisk */ &&
                sourceFileOfNode.text.charCodeAt(comment.pos + 3) !== 47 /* slash */;
        }
    }
    ts.getJsDocComments = getJsDocComments;
    ts.fullTripleSlashReferencePathRegEx = /^(\/\/\/\s*<reference\s+path\s*=\s*)('|")(.+?)\2.*?\/>/;
    // Warning: This has the same semantics as the forEach family of functions,
    //          in that traversal terminates in the event that 'visitor' supplies a truthy value.
    function forEachReturnStatement(body, visitor) {
        return traverse(body);
        function traverse(node) {
            switch (node.kind) {
                case 174 /* ReturnStatement */:
                    return visitor(node);
                case 163 /* Block */:
                case 167 /* IfStatement */:
                case 168 /* DoStatement */:
                case 169 /* WhileStatement */:
                case 170 /* ForStatement */:
                case 171 /* ForInStatement */:
                case 175 /* WithStatement */:
                case 176 /* SwitchStatement */:
                case 194 /* CaseClause */:
                case 195 /* DefaultClause */:
                case 177 /* LabeledStatement */:
                case 179 /* TryStatement */:
                case 180 /* TryBlock */:
                case 197 /* CatchClause */:
                case 181 /* FinallyBlock */:
                    return ts.forEachChild(node, traverse);
            }
        }
    }
    ts.forEachReturnStatement = forEachReturnStatement;
    function isAnyFunction(node) {
        if (node) {
            switch (node.kind) {
                case 150 /* FunctionExpression */:
                case 184 /* FunctionDeclaration */:
                case 151 /* ArrowFunction */:
                case 125 /* Method */:
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                case 126 /* Constructor */:
                    return true;
            }
        }
        return false;
    }
    ts.isAnyFunction = isAnyFunction;
    function isFunctionBlock(node) {
        return node !== undefined && node.kind === 163 /* Block */ && isAnyFunction(node.parent);
    }
    ts.isFunctionBlock = isFunctionBlock;
    function isObjectLiteralMethod(node) {
        return node !== undefined && node.kind === 125 /* Method */ && node.parent.kind === 142 /* ObjectLiteralExpression */;
    }
    ts.isObjectLiteralMethod = isObjectLiteralMethod;
    function getContainingFunction(node) {
        while (true) {
            node = node.parent;
            if (!node || isAnyFunction(node)) {
                return node;
            }
        }
    }
    ts.getContainingFunction = getContainingFunction;
    function getThisContainer(node, includeArrowFunctions) {
        while (true) {
            node = node.parent;
            if (!node) {
                return undefined;
            }
            switch (node.kind) {
                case 151 /* ArrowFunction */:
                    if (!includeArrowFunctions) {
                        continue;
                    }
                // Fall through
                case 184 /* FunctionDeclaration */:
                case 150 /* FunctionExpression */:
                case 189 /* ModuleDeclaration */:
                case 124 /* Property */:
                case 125 /* Method */:
                case 126 /* Constructor */:
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                case 188 /* EnumDeclaration */:
                case 201 /* SourceFile */:
                    return node;
            }
        }
    }
    ts.getThisContainer = getThisContainer;
    function getSuperContainer(node) {
        while (true) {
            node = node.parent;
            if (!node) {
                return undefined;
            }
            switch (node.kind) {
                case 124 /* Property */:
                case 125 /* Method */:
                case 126 /* Constructor */:
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                    return node;
            }
        }
    }
    ts.getSuperContainer = getSuperContainer;
    function getInvokedExpression(node) {
        if (node.kind === 147 /* TaggedTemplateExpression */) {
            return node.tag;
        }
        // Will either be a CallExpression or NewExpression.
        return node.expression;
    }
    ts.getInvokedExpression = getInvokedExpression;
    function isExpression(node) {
        switch (node.kind) {
            case 91 /* ThisKeyword */:
            case 89 /* SuperKeyword */:
            case 87 /* NullKeyword */:
            case 93 /* TrueKeyword */:
            case 78 /* FalseKeyword */:
            case 8 /* RegularExpressionLiteral */:
            case 141 /* ArrayLiteralExpression */:
            case 142 /* ObjectLiteralExpression */:
            case 143 /* PropertyAccessExpression */:
            case 144 /* ElementAccessExpression */:
            case 145 /* CallExpression */:
            case 146 /* NewExpression */:
            case 147 /* TaggedTemplateExpression */:
            case 148 /* TypeAssertionExpression */:
            case 149 /* ParenthesizedExpression */:
            case 150 /* FunctionExpression */:
            case 151 /* ArrowFunction */:
            case 154 /* VoidExpression */:
            case 152 /* DeleteExpression */:
            case 153 /* TypeOfExpression */:
            case 155 /* PrefixUnaryExpression */:
            case 156 /* PostfixUnaryExpression */:
            case 157 /* BinaryExpression */:
            case 158 /* ConditionalExpression */:
            case 159 /* TemplateExpression */:
            case 9 /* NoSubstitutionTemplateLiteral */:
            case 161 /* OmittedExpression */:
                return true;
            case 120 /* QualifiedName */:
                while (node.parent.kind === 120 /* QualifiedName */) {
                    node = node.parent;
                }
                return node.parent.kind === 135 /* TypeQuery */;
            case 63 /* Identifier */:
                if (node.parent.kind === 135 /* TypeQuery */) {
                    return true;
                }
            // fall through
            case 6 /* NumericLiteral */:
            case 7 /* StringLiteral */:
                var parent = node.parent;
                switch (parent.kind) {
                    case 183 /* VariableDeclaration */:
                    case 123 /* Parameter */:
                    case 124 /* Property */:
                    case 200 /* EnumMember */:
                    case 198 /* PropertyAssignment */:
                        return parent.initializer === node;
                    case 166 /* ExpressionStatement */:
                    case 167 /* IfStatement */:
                    case 168 /* DoStatement */:
                    case 169 /* WhileStatement */:
                    case 174 /* ReturnStatement */:
                    case 175 /* WithStatement */:
                    case 176 /* SwitchStatement */:
                    case 194 /* CaseClause */:
                    case 178 /* ThrowStatement */:
                    case 176 /* SwitchStatement */:
                        return parent.expression === node;
                    case 170 /* ForStatement */:
                        return parent.initializer === node ||
                            parent.condition === node ||
                            parent.iterator === node;
                    case 171 /* ForInStatement */:
                        return parent.variable === node ||
                            parent.expression === node;
                    case 148 /* TypeAssertionExpression */:
                        return node === parent.expression;
                    case 162 /* TemplateSpan */:
                        return node === parent.expression;
                    default:
                        if (isExpression(parent)) {
                            return true;
                        }
                }
        }
        return false;
    }
    ts.isExpression = isExpression;
    function isExternalModuleImportDeclaration(node) {
        return node.kind === 191 /* ImportDeclaration */ && node.moduleReference.kind === 193 /* ExternalModuleReference */;
    }
    ts.isExternalModuleImportDeclaration = isExternalModuleImportDeclaration;
    function getExternalModuleImportDeclarationExpression(node) {
        ts.Debug.assert(isExternalModuleImportDeclaration(node));
        return node.moduleReference.expression;
    }
    ts.getExternalModuleImportDeclarationExpression = getExternalModuleImportDeclarationExpression;
    function isInternalModuleImportDeclaration(node) {
        return node.kind === 191 /* ImportDeclaration */ && node.moduleReference.kind !== 193 /* ExternalModuleReference */;
    }
    ts.isInternalModuleImportDeclaration = isInternalModuleImportDeclaration;
    function hasDotDotDotToken(node) {
        return node && node.kind === 123 /* Parameter */ && node.dotDotDotToken !== undefined;
    }
    ts.hasDotDotDotToken = hasDotDotDotToken;
    function hasQuestionToken(node) {
        if (node) {
            switch (node.kind) {
                case 123 /* Parameter */:
                    return node.questionToken !== undefined;
                case 125 /* Method */:
                    return node.questionToken !== undefined;
                case 199 /* ShorthandPropertyAssignment */:
                case 198 /* PropertyAssignment */:
                case 124 /* Property */:
                    return node.questionToken !== undefined;
            }
        }
        return false;
    }
    ts.hasQuestionToken = hasQuestionToken;
    function hasRestParameters(s) {
        return s.parameters.length > 0 && s.parameters[s.parameters.length - 1].dotDotDotToken !== undefined;
    }
    ts.hasRestParameters = hasRestParameters;
    function isLiteralKind(kind) {
        return 6 /* FirstLiteralToken */ <= kind && kind <= 9 /* LastLiteralToken */;
    }
    ts.isLiteralKind = isLiteralKind;
    function isTextualLiteralKind(kind) {
        return kind === 7 /* StringLiteral */ || kind === 9 /* NoSubstitutionTemplateLiteral */;
    }
    ts.isTextualLiteralKind = isTextualLiteralKind;
    function isTemplateLiteralKind(kind) {
        return 9 /* FirstTemplateToken */ <= kind && kind <= 12 /* LastTemplateToken */;
    }
    ts.isTemplateLiteralKind = isTemplateLiteralKind;
    function isInAmbientContext(node) {
        while (node) {
            if (node.flags & (2 /* Ambient */ | 1024 /* DeclarationFile */))
                return true;
            node = node.parent;
        }
        return false;
    }
    ts.isInAmbientContext = isInAmbientContext;
    function isDeclaration(node) {
        switch (node.kind) {
            case 122 /* TypeParameter */:
            case 123 /* Parameter */:
            case 183 /* VariableDeclaration */:
            case 124 /* Property */:
            case 198 /* PropertyAssignment */:
            case 199 /* ShorthandPropertyAssignment */:
            case 200 /* EnumMember */:
            case 125 /* Method */:
            case 184 /* FunctionDeclaration */:
            case 127 /* GetAccessor */:
            case 128 /* SetAccessor */:
            case 126 /* Constructor */:
            case 185 /* ClassDeclaration */:
            case 186 /* InterfaceDeclaration */:
            case 187 /* TypeAliasDeclaration */:
            case 188 /* EnumDeclaration */:
            case 189 /* ModuleDeclaration */:
            case 191 /* ImportDeclaration */:
                return true;
        }
        return false;
    }
    ts.isDeclaration = isDeclaration;
    function isStatement(n) {
        switch (n.kind) {
            case 173 /* BreakStatement */:
            case 172 /* ContinueStatement */:
            case 182 /* DebuggerStatement */:
            case 168 /* DoStatement */:
            case 166 /* ExpressionStatement */:
            case 165 /* EmptyStatement */:
            case 171 /* ForInStatement */:
            case 170 /* ForStatement */:
            case 167 /* IfStatement */:
            case 177 /* LabeledStatement */:
            case 174 /* ReturnStatement */:
            case 176 /* SwitchStatement */:
            case 92 /* ThrowKeyword */:
            case 179 /* TryStatement */:
            case 164 /* VariableStatement */:
            case 169 /* WhileStatement */:
            case 175 /* WithStatement */:
            case 192 /* ExportAssignment */:
                return true;
            default:
                return false;
        }
    }
    ts.isStatement = isStatement;
    // True if the given identifier, string literal, or number literal is the name of a declaration node
    function isDeclarationOrFunctionExpressionOrCatchVariableName(name) {
        if (name.kind !== 63 /* Identifier */ && name.kind !== 7 /* StringLiteral */ && name.kind !== 6 /* NumericLiteral */) {
            return false;
        }
        var parent = name.parent;
        if (isDeclaration(parent) || parent.kind === 150 /* FunctionExpression */) {
            return parent.name === name;
        }
        if (parent.kind === 197 /* CatchClause */) {
            return parent.name === name;
        }
        return false;
    }
    ts.isDeclarationOrFunctionExpressionOrCatchVariableName = isDeclarationOrFunctionExpressionOrCatchVariableName;
    function getClassBaseTypeNode(node) {
        var heritageClause = getHeritageClause(node.heritageClauses, 77 /* ExtendsKeyword */);
        return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
    }
    ts.getClassBaseTypeNode = getClassBaseTypeNode;
    function getClassImplementedTypeNodes(node) {
        var heritageClause = getHeritageClause(node.heritageClauses, 100 /* ImplementsKeyword */);
        return heritageClause ? heritageClause.types : undefined;
    }
    ts.getClassImplementedTypeNodes = getClassImplementedTypeNodes;
    function getInterfaceBaseTypeNodes(node) {
        var heritageClause = getHeritageClause(node.heritageClauses, 77 /* ExtendsKeyword */);
        return heritageClause ? heritageClause.types : undefined;
    }
    ts.getInterfaceBaseTypeNodes = getInterfaceBaseTypeNodes;
    function getHeritageClause(clauses, kind) {
        if (clauses) {
            for (var i = 0, n = clauses.length; i < n; i++) {
                if (clauses[i].token === kind) {
                    return clauses[i];
                }
            }
        }
        return undefined;
    }
    ts.getHeritageClause = getHeritageClause;
    function tryResolveScriptReference(program, sourceFile, reference) {
        if (!program.getCompilerOptions().noResolve) {
            var referenceFileName = ts.isRootedDiskPath(reference.filename) ? reference.filename : ts.combinePaths(ts.getDirectoryPath(sourceFile.filename), reference.filename);
            referenceFileName = ts.getNormalizedAbsolutePath(referenceFileName, program.getCompilerHost().getCurrentDirectory());
            return program.getSourceFile(referenceFileName);
        }
    }
    ts.tryResolveScriptReference = tryResolveScriptReference;
    function getAncestor(node, kind) {
        switch (kind) {
            // special-cases that can be come first
            case 185 /* ClassDeclaration */:
                while (node) {
                    switch (node.kind) {
                        case 185 /* ClassDeclaration */:
                            return node;
                        case 188 /* EnumDeclaration */:
                        case 186 /* InterfaceDeclaration */:
                        case 187 /* TypeAliasDeclaration */:
                        case 189 /* ModuleDeclaration */:
                        case 191 /* ImportDeclaration */:
                            // early exit cases - declarations cannot be nested in classes
                            return undefined;
                        default:
                            node = node.parent;
                            continue;
                    }
                }
                break;
            default:
                while (node) {
                    if (node.kind === kind) {
                        return node;
                    }
                    node = node.parent;
                }
                break;
        }
        return undefined;
    }
    ts.getAncestor = getAncestor;
    function getFileReferenceFromReferencePath(comment, commentRange) {
        var simpleReferenceRegEx = /^\/\/\/\s*<reference\s+/gim;
        var isNoDefaultLibRegEx = /^(\/\/\/\s*<reference\s+no-default-lib\s*=\s*)('|")(.+?)\2\s*\/>/gim;
        if (simpleReferenceRegEx.exec(comment)) {
            if (isNoDefaultLibRegEx.exec(comment)) {
                return {
                    isNoDefaultLib: true
                };
            }
            else {
                var matchResult = ts.fullTripleSlashReferencePathRegEx.exec(comment);
                if (matchResult) {
                    var start = commentRange.pos;
                    var end = commentRange.end;
                    return {
                        fileReference: {
                            pos: start,
                            end: end,
                            filename: matchResult[3]
                        },
                        isNoDefaultLib: false
                    };
                }
                else {
                    return {
                        diagnosticMessage: ts.Diagnostics.Invalid_reference_directive_syntax,
                        isNoDefaultLib: false
                    };
                }
            }
        }
        return undefined;
    }
    ts.getFileReferenceFromReferencePath = getFileReferenceFromReferencePath;
    function isKeyword(token) {
        return 64 /* FirstKeyword */ <= token && token <= 119 /* LastKeyword */;
    }
    ts.isKeyword = isKeyword;
    function isTrivia(token) {
        return 2 /* FirstTriviaToken */ <= token && token <= 5 /* LastTriviaToken */;
    }
    ts.isTrivia = isTrivia;
    function isModifier(token) {
        switch (token) {
            case 106 /* PublicKeyword */:
            case 104 /* PrivateKeyword */:
            case 105 /* ProtectedKeyword */:
            case 107 /* StaticKeyword */:
            case 76 /* ExportKeyword */:
            case 112 /* DeclareKeyword */:
            case 68 /* ConstKeyword */:
                return true;
        }
        return false;
    }
    ts.isModifier = isModifier;
})(ts || (ts = {}));
//# sourceMappingURL=utilities.js.map