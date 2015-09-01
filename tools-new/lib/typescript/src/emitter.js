/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
var ts;
(function (ts) {
    var indentStrings = ["", "    "];
    function getIndentString(level) {
        if (indentStrings[level] === undefined) {
            indentStrings[level] = getIndentString(level - 1) + indentStrings[1];
        }
        return indentStrings[level];
    }
    ts.getIndentString = getIndentString;
    function getIndentSize() {
        return indentStrings[1].length;
    }
    function shouldEmitToOwnFile(sourceFile, compilerOptions) {
        if (!ts.isDeclarationFile(sourceFile)) {
            if ((ts.isExternalModule(sourceFile) || !compilerOptions.out) && !ts.fileExtensionIs(sourceFile.filename, ".js")) {
                return true;
            }
            return false;
        }
        return false;
    }
    ts.shouldEmitToOwnFile = shouldEmitToOwnFile;
    function isExternalModuleOrDeclarationFile(sourceFile) {
        return ts.isExternalModule(sourceFile) || ts.isDeclarationFile(sourceFile);
    }
    ts.isExternalModuleOrDeclarationFile = isExternalModuleOrDeclarationFile;
    function createTextWriter(newLine) {
        var output = "";
        var indent = 0;
        var lineStart = true;
        var lineCount = 0;
        var linePos = 0;
        function write(s) {
            if (s && s.length) {
                if (lineStart) {
                    output += getIndentString(indent);
                    lineStart = false;
                }
                output += s;
            }
        }
        function rawWrite(s) {
            if (s !== undefined) {
                if (lineStart) {
                    lineStart = false;
                }
                output += s;
            }
        }
        function writeLiteral(s) {
            if (s && s.length) {
                write(s);
                var lineStartsOfS = ts.computeLineStarts(s);
                if (lineStartsOfS.length > 1) {
                    lineCount = lineCount + lineStartsOfS.length - 1;
                    linePos = output.length - s.length + lineStartsOfS[lineStartsOfS.length - 1];
                }
            }
        }
        function writeLine() {
            if (!lineStart) {
                output += newLine;
                lineCount++;
                linePos = output.length;
                lineStart = true;
            }
        }
        function writeTextOfNode(sourceFile, node) {
            write(ts.getSourceTextOfNodeFromSourceFile(sourceFile, node));
        }
        return {
            write: write,
            rawWrite: rawWrite,
            writeTextOfNode: writeTextOfNode,
            writeLiteral: writeLiteral,
            writeLine: writeLine,
            increaseIndent: function () { return indent++; },
            decreaseIndent: function () { return indent--; },
            getIndent: function () { return indent; },
            getTextPos: function () { return output.length; },
            getLine: function () { return lineCount + 1; },
            getColumn: function () { return lineStart ? indent * getIndentSize() + 1 : output.length - linePos + 1; },
            getText: function () { return output; }
        };
    }
    function getLineOfLocalPosition(currentSourceFile, pos) {
        return currentSourceFile.getLineAndCharacterFromPosition(pos).line;
    }
    function emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, leadingComments) {
        // If the leading comments start on different line than the start of node, write new line
        if (leadingComments && leadingComments.length && node.pos !== leadingComments[0].pos &&
            getLineOfLocalPosition(currentSourceFile, node.pos) !== getLineOfLocalPosition(currentSourceFile, leadingComments[0].pos)) {
            writer.writeLine();
        }
    }
    function emitComments(currentSourceFile, writer, comments, trailingSeparator, newLine, writeComment) {
        var emitLeadingSpace = !trailingSeparator;
        ts.forEach(comments, function (comment) {
            if (emitLeadingSpace) {
                writer.write(" ");
                emitLeadingSpace = false;
            }
            writeComment(currentSourceFile, writer, comment, newLine);
            if (comment.hasTrailingNewLine) {
                writer.writeLine();
            }
            else if (trailingSeparator) {
                writer.write(" ");
            }
            else {
                // Emit leading space to separate comment during next comment emit
                emitLeadingSpace = true;
            }
        });
    }
    function writeCommentRange(currentSourceFile, writer, comment, newLine) {
        if (currentSourceFile.text.charCodeAt(comment.pos + 1) === 42 /* asterisk */) {
            var firstCommentLineAndCharacter = currentSourceFile.getLineAndCharacterFromPosition(comment.pos);
            var firstCommentLineIndent;
            for (var pos = comment.pos, currentLine = firstCommentLineAndCharacter.line; pos < comment.end; currentLine++) {
                var nextLineStart = currentSourceFile.getPositionFromLineAndCharacter(currentLine + 1, 1);
                if (pos !== comment.pos) {
                    // If we are not emitting first line, we need to write the spaces to adjust the alignment
                    if (firstCommentLineIndent === undefined) {
                        firstCommentLineIndent = calculateIndent(currentSourceFile.getPositionFromLineAndCharacter(firstCommentLineAndCharacter.line, 1), comment.pos);
                    }
                    // These are number of spaces writer is going to write at current indent
                    var currentWriterIndentSpacing = writer.getIndent() * getIndentSize();
                    // Number of spaces we want to be writing
                    // eg: Assume writer indent
                    // module m {
                    //         /* starts at character 9 this is line 1
                    //    * starts at character pos 4 line                        --1  = 8 - 8 + 3
                    //   More left indented comment */                            --2  = 8 - 8 + 2
                    //     class c { }
                    // }
                    // module m {
                    //     /* this is line 1 -- Assume current writer indent 8
                    //      * line                                                --3 = 8 - 4 + 5 
                    //            More right indented comment */                  --4 = 8 - 4 + 11
                    //     class c { }
                    // }
                    var spacesToEmit = currentWriterIndentSpacing - firstCommentLineIndent + calculateIndent(pos, nextLineStart);
                    if (spacesToEmit > 0) {
                        var numberOfSingleSpacesToEmit = spacesToEmit % getIndentSize();
                        var indentSizeSpaceString = getIndentString((spacesToEmit - numberOfSingleSpacesToEmit) / getIndentSize());
                        // Write indent size string ( in eg 1: = "", 2: "" , 3: string with 8 spaces 4: string with 12 spaces
                        writer.rawWrite(indentSizeSpaceString);
                        // Emit the single spaces (in eg: 1: 3 spaces, 2: 2 spaces, 3: 1 space, 4: 3 spaces)
                        while (numberOfSingleSpacesToEmit) {
                            writer.rawWrite(" ");
                            numberOfSingleSpacesToEmit--;
                        }
                    }
                    else {
                        // No spaces to emit write empty string
                        writer.rawWrite("");
                    }
                }
                // Write the comment line text
                writeTrimmedCurrentLine(pos, nextLineStart);
                pos = nextLineStart;
            }
        }
        else {
            // Single line comment of style //....
            writer.write(currentSourceFile.text.substring(comment.pos, comment.end));
        }
        function writeTrimmedCurrentLine(pos, nextLineStart) {
            var end = Math.min(comment.end, nextLineStart - 1);
            var currentLineText = currentSourceFile.text.substring(pos, end).replace(/^\s+|\s+$/g, '');
            if (currentLineText) {
                // trimmed forward and ending spaces text
                writer.write(currentLineText);
                if (end !== comment.end) {
                    writer.writeLine();
                }
            }
            else {
                // Empty string - make sure we write empty line
                writer.writeLiteral(newLine);
            }
        }
        function calculateIndent(pos, end) {
            var currentLineIndent = 0;
            for (; pos < end && ts.isWhiteSpace(currentSourceFile.text.charCodeAt(pos)); pos++) {
                if (currentSourceFile.text.charCodeAt(pos) === 9 /* tab */) {
                    // Tabs = TabSize = indent size and go to next tabStop
                    currentLineIndent += getIndentSize() - (currentLineIndent % getIndentSize());
                }
                else {
                    // Single space
                    currentLineIndent++;
                }
            }
            return currentLineIndent;
        }
    }
    function getFirstConstructorWithBody(node) {
        return ts.forEach(node.members, function (member) {
            if (member.kind === 126 /* Constructor */ && member.body) {
                return member;
            }
        });
    }
    function getAllAccessorDeclarations(node, accessor) {
        var firstAccessor;
        var getAccessor;
        var setAccessor;
        if (accessor.name.kind === 121 /* ComputedPropertyName */) {
            firstAccessor = accessor;
            if (accessor.kind === 127 /* GetAccessor */) {
                getAccessor = accessor;
            }
            else if (accessor.kind === 128 /* SetAccessor */) {
                setAccessor = accessor;
            }
            else {
                ts.Debug.fail("Accessor has wrong kind");
            }
        }
        else {
            ts.forEach(node.members, function (member) {
                if ((member.kind === 127 /* GetAccessor */ || member.kind === 128 /* SetAccessor */) &&
                    member.name.text === accessor.name.text &&
                    (member.flags & 128 /* Static */) === (accessor.flags & 128 /* Static */)) {
                    if (!firstAccessor) {
                        firstAccessor = member;
                    }
                    if (member.kind === 127 /* GetAccessor */ && !getAccessor) {
                        getAccessor = member;
                    }
                    if (member.kind === 128 /* SetAccessor */ && !setAccessor) {
                        setAccessor = member;
                    }
                }
            });
        }
        return {
            firstAccessor: firstAccessor,
            getAccessor: getAccessor,
            setAccessor: setAccessor
        };
    }
    function getSourceFilePathInNewDir(sourceFile, program, newDirPath) {
        var compilerHost = program.getCompilerHost();
        var sourceFilePath = ts.getNormalizedAbsolutePath(sourceFile.filename, compilerHost.getCurrentDirectory());
        sourceFilePath = sourceFilePath.replace(program.getCommonSourceDirectory(), "");
        return ts.combinePaths(newDirPath, sourceFilePath);
    }
    function getOwnEmitOutputFilePath(sourceFile, program, extension) {
        var compilerOptions = program.getCompilerOptions();
        if (compilerOptions.outDir) {
            var emitOutputFilePathWithoutExtension = ts.removeFileExtension(getSourceFilePathInNewDir(sourceFile, program, compilerOptions.outDir));
        }
        else {
            var emitOutputFilePathWithoutExtension = ts.removeFileExtension(sourceFile.filename);
        }
        return emitOutputFilePathWithoutExtension + extension;
    }
    function writeFile(compilerHost, diagnostics, filename, data, writeByteOrderMark) {
        compilerHost.writeFile(filename, data, writeByteOrderMark, function (hostErrorMessage) {
            diagnostics.push(ts.createCompilerDiagnostic(ts.Diagnostics.Could_not_write_file_0_Colon_1, filename, hostErrorMessage));
        });
    }
    function emitDeclarations(program, resolver, diagnostics, jsFilePath, root) {
        var newLine = program.getCompilerHost().getNewLine();
        var compilerOptions = program.getCompilerOptions();
        var compilerHost = program.getCompilerHost();
        var write;
        var writeLine;
        var increaseIndent;
        var decreaseIndent;
        var writeTextOfNode;
        var writer = createAndSetNewTextWriterWithSymbolWriter();
        var enclosingDeclaration;
        var currentSourceFile;
        var reportedDeclarationError = false;
        var emitJsDocComments = compilerOptions.removeComments ? function (declaration) { } : writeJsDocComments;
        var aliasDeclarationEmitInfo = [];
        function createAndSetNewTextWriterWithSymbolWriter() {
            var writer = createTextWriter(newLine);
            writer.trackSymbol = trackSymbol;
            writer.writeKeyword = writer.write;
            writer.writeOperator = writer.write;
            writer.writePunctuation = writer.write;
            writer.writeSpace = writer.write;
            writer.writeStringLiteral = writer.writeLiteral;
            writer.writeParameter = writer.write;
            writer.writeSymbol = writer.write;
            setWriter(writer);
            return writer;
        }
        function setWriter(newWriter) {
            writer = newWriter;
            write = newWriter.write;
            writeTextOfNode = newWriter.writeTextOfNode;
            writeLine = newWriter.writeLine;
            increaseIndent = newWriter.increaseIndent;
            decreaseIndent = newWriter.decreaseIndent;
        }
        function writeAsychronousImportDeclarations(importDeclarations) {
            var oldWriter = writer;
            ts.forEach(importDeclarations, function (aliasToWrite) {
                var aliasEmitInfo = ts.forEach(aliasDeclarationEmitInfo, function (declEmitInfo) { return declEmitInfo.declaration === aliasToWrite ? declEmitInfo : undefined; });
                // If the alias was marked as not visible when we saw its declaration, we would have saved the aliasEmitInfo, but if we haven't yet visited the alias declaration
                // then we don't need to write it at this point. We will write it when we actually see its declaration
                // Eg.
                // export function bar(a: foo.Foo) { }
                // import foo = require("foo");
                // Writing of function bar would mark alias declaration foo as visible but we haven't yet visited that declaration so do nothing, 
                // we would write alias foo declaration when we visit it since it would now be marked as visible
                if (aliasEmitInfo) {
                    createAndSetNewTextWriterWithSymbolWriter();
                    for (var declarationIndent = aliasEmitInfo.indent; declarationIndent; declarationIndent--) {
                        increaseIndent();
                    }
                    writeImportDeclaration(aliasToWrite);
                    aliasEmitInfo.asynchronousOutput = writer.getText();
                }
            });
            setWriter(oldWriter);
        }
        function handleSymbolAccessibilityError(symbolAccesibilityResult) {
            if (symbolAccesibilityResult.accessibility === 0 /* Accessible */) {
                // write the aliases
                if (symbolAccesibilityResult && symbolAccesibilityResult.aliasesToMakeVisible) {
                    writeAsychronousImportDeclarations(symbolAccesibilityResult.aliasesToMakeVisible);
                }
            }
            else {
                // Report error
                reportedDeclarationError = true;
                var errorInfo = writer.getSymbolAccessibilityDiagnostic(symbolAccesibilityResult);
                if (errorInfo) {
                    if (errorInfo.typeName) {
                        diagnostics.push(ts.createDiagnosticForNode(symbolAccesibilityResult.errorNode || errorInfo.errorNode, errorInfo.diagnosticMessage, ts.getSourceTextOfNodeFromSourceFile(currentSourceFile, errorInfo.typeName), symbolAccesibilityResult.errorSymbolName, symbolAccesibilityResult.errorModuleName));
                    }
                    else {
                        diagnostics.push(ts.createDiagnosticForNode(symbolAccesibilityResult.errorNode || errorInfo.errorNode, errorInfo.diagnosticMessage, symbolAccesibilityResult.errorSymbolName, symbolAccesibilityResult.errorModuleName));
                    }
                }
            }
        }
        function trackSymbol(symbol, enclosingDeclaration, meaning) {
            handleSymbolAccessibilityError(resolver.isSymbolAccessible(symbol, enclosingDeclaration, meaning));
        }
        function writeTypeOfDeclaration(declaration, type, getSymbolAccessibilityDiagnostic) {
            writer.getSymbolAccessibilityDiagnostic = getSymbolAccessibilityDiagnostic;
            write(": ");
            if (type) {
                // Write the type
                emitType(type);
            }
            else {
                resolver.writeTypeOfDeclaration(declaration, enclosingDeclaration, 2 /* UseTypeOfFunction */, writer);
            }
        }
        function writeReturnTypeAtSignature(signature, getSymbolAccessibilityDiagnostic) {
            writer.getSymbolAccessibilityDiagnostic = getSymbolAccessibilityDiagnostic;
            write(": ");
            if (signature.type) {
                // Write the type
                emitType(signature.type);
            }
            else {
                resolver.writeReturnTypeOfSignatureDeclaration(signature, enclosingDeclaration, 2 /* UseTypeOfFunction */, writer);
            }
        }
        function emitLines(nodes) {
            for (var i = 0, n = nodes.length; i < n; i++) {
                emitNode(nodes[i]);
            }
        }
        function emitSeparatedList(nodes, separator, eachNodeEmitFn) {
            var currentWriterPos = writer.getTextPos();
            for (var i = 0, n = nodes.length; i < n; i++) {
                if (currentWriterPos !== writer.getTextPos()) {
                    write(separator);
                }
                currentWriterPos = writer.getTextPos();
                eachNodeEmitFn(nodes[i]);
            }
        }
        function emitCommaList(nodes, eachNodeEmitFn) {
            emitSeparatedList(nodes, ", ", eachNodeEmitFn);
        }
        function writeJsDocComments(declaration) {
            if (declaration) {
                var jsDocComments = ts.getJsDocComments(declaration, currentSourceFile);
                emitNewLineBeforeLeadingComments(currentSourceFile, writer, declaration, jsDocComments);
                // jsDoc comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, jsDocComments, true, newLine, writeCommentRange);
            }
        }
        function emitTypeWithNewGetSymbolAccessibilityDiagnostic(type, getSymbolAccessibilityDiagnostic) {
            writer.getSymbolAccessibilityDiagnostic = getSymbolAccessibilityDiagnostic;
            emitType(type);
        }
        function emitType(type) {
            switch (type.kind) {
                case 109 /* AnyKeyword */:
                case 118 /* StringKeyword */:
                case 116 /* NumberKeyword */:
                case 110 /* BooleanKeyword */:
                case 97 /* VoidKeyword */:
                case 7 /* StringLiteral */:
                    return writeTextOfNode(currentSourceFile, type);
                case 132 /* TypeReference */:
                    return emitTypeReference(type);
                case 135 /* TypeQuery */:
                    return emitTypeQuery(type);
                case 137 /* ArrayType */:
                    return emitArrayType(type);
                case 138 /* TupleType */:
                    return emitTupleType(type);
                case 139 /* UnionType */:
                    return emitUnionType(type);
                case 140 /* ParenthesizedType */:
                    return emitParenType(type);
                case 133 /* FunctionType */:
                case 134 /* ConstructorType */:
                    return emitSignatureDeclarationWithJsDocComments(type);
                case 136 /* TypeLiteral */:
                    return emitTypeLiteral(type);
                case 63 /* Identifier */:
                    return emitEntityName(type);
                case 120 /* QualifiedName */:
                    return emitEntityName(type);
                default:
                    ts.Debug.fail("Unknown type annotation: " + type.kind);
            }
            function emitEntityName(entityName) {
                var visibilityResult = resolver.isEntityNameVisible(entityName, 
                // Aliases can be written asynchronously so use correct enclosing declaration
                entityName.parent.kind === 191 /* ImportDeclaration */ ? entityName.parent : enclosingDeclaration);
                handleSymbolAccessibilityError(visibilityResult);
                writeEntityName(entityName);
                function writeEntityName(entityName) {
                    if (entityName.kind === 63 /* Identifier */) {
                        writeTextOfNode(currentSourceFile, entityName);
                    }
                    else {
                        var qualifiedName = entityName;
                        writeEntityName(qualifiedName.left);
                        write(".");
                        writeTextOfNode(currentSourceFile, qualifiedName.right);
                    }
                }
            }
            function emitTypeReference(type) {
                emitEntityName(type.typeName);
                if (type.typeArguments) {
                    write("<");
                    emitCommaList(type.typeArguments, emitType);
                    write(">");
                }
            }
            function emitTypeQuery(type) {
                write("typeof ");
                emitEntityName(type.exprName);
            }
            function emitArrayType(type) {
                emitType(type.elementType);
                write("[]");
            }
            function emitTupleType(type) {
                write("[");
                emitCommaList(type.elementTypes, emitType);
                write("]");
            }
            function emitUnionType(type) {
                emitSeparatedList(type.types, " | ", emitType);
            }
            function emitParenType(type) {
                write("(");
                emitType(type.type);
                write(")");
            }
            function emitTypeLiteral(type) {
                write("{");
                if (type.members.length) {
                    writeLine();
                    increaseIndent();
                    // write members
                    emitLines(type.members);
                    decreaseIndent();
                }
                write("}");
            }
        }
        function emitSourceFile(node) {
            currentSourceFile = node;
            enclosingDeclaration = node;
            emitLines(node.statements);
        }
        function emitExportAssignment(node) {
            write("export = ");
            writeTextOfNode(currentSourceFile, node.exportName);
            write(";");
            writeLine();
        }
        function emitModuleElementDeclarationFlags(node) {
            // If the node is parented in the current source file we need to emit export declare or just export
            if (node.parent === currentSourceFile) {
                // If the node is exported 
                if (node.flags & 1 /* Export */) {
                    write("export ");
                }
                if (node.kind !== 186 /* InterfaceDeclaration */) {
                    write("declare ");
                }
            }
        }
        function emitClassMemberDeclarationFlags(node) {
            if (node.flags & 32 /* Private */) {
                write("private ");
            }
            else if (node.flags & 64 /* Protected */) {
                write("protected ");
            }
            if (node.flags & 128 /* Static */) {
                write("static ");
            }
        }
        function emitImportDeclaration(node) {
            var nodeEmitInfo = {
                declaration: node,
                outputPos: writer.getTextPos(),
                indent: writer.getIndent(),
                hasWritten: resolver.isDeclarationVisible(node)
            };
            aliasDeclarationEmitInfo.push(nodeEmitInfo);
            if (nodeEmitInfo.hasWritten) {
                writeImportDeclaration(node);
            }
        }
        function writeImportDeclaration(node) {
            // note usage of writer. methods instead of aliases created, just to make sure we are using 
            // correct writer especially to handle asynchronous alias writing
            emitJsDocComments(node);
            if (node.flags & 1 /* Export */) {
                write("export ");
            }
            write("import ");
            writeTextOfNode(currentSourceFile, node.name);
            write(" = ");
            if (ts.isInternalModuleImportDeclaration(node)) {
                emitTypeWithNewGetSymbolAccessibilityDiagnostic(node.moduleReference, getImportEntityNameVisibilityError);
                write(";");
            }
            else {
                write("require(");
                writeTextOfNode(currentSourceFile, ts.getExternalModuleImportDeclarationExpression(node));
                write(");");
            }
            writer.writeLine();
            function getImportEntityNameVisibilityError(symbolAccesibilityResult) {
                return {
                    diagnosticMessage: ts.Diagnostics.Import_declaration_0_is_using_private_name_1,
                    errorNode: node,
                    typeName: node.name
                };
            }
        }
        function emitModuleDeclaration(node) {
            if (resolver.isDeclarationVisible(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                write("module ");
                writeTextOfNode(currentSourceFile, node.name);
                while (node.body.kind !== 190 /* ModuleBlock */) {
                    node = node.body;
                    write(".");
                    writeTextOfNode(currentSourceFile, node.name);
                }
                var prevEnclosingDeclaration = enclosingDeclaration;
                enclosingDeclaration = node;
                write(" {");
                writeLine();
                increaseIndent();
                emitLines(node.body.statements);
                decreaseIndent();
                write("}");
                writeLine();
                enclosingDeclaration = prevEnclosingDeclaration;
            }
        }
        function emitTypeAliasDeclaration(node) {
            if (resolver.isDeclarationVisible(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                write("type ");
                writeTextOfNode(currentSourceFile, node.name);
                write(" = ");
                emitTypeWithNewGetSymbolAccessibilityDiagnostic(node.type, getTypeAliasDeclarationVisibilityError);
                write(";");
                writeLine();
            }
            function getTypeAliasDeclarationVisibilityError(symbolAccesibilityResult) {
                return {
                    diagnosticMessage: ts.Diagnostics.Exported_type_alias_0_has_or_is_using_private_name_1,
                    errorNode: node.type,
                    typeName: node.name
                };
            }
        }
        function emitEnumDeclaration(node) {
            if (resolver.isDeclarationVisible(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                if (ts.isConst(node)) {
                    write("const ");
                }
                write("enum ");
                writeTextOfNode(currentSourceFile, node.name);
                write(" {");
                writeLine();
                increaseIndent();
                emitLines(node.members);
                decreaseIndent();
                write("}");
                writeLine();
            }
        }
        function emitEnumMemberDeclaration(node) {
            emitJsDocComments(node);
            writeTextOfNode(currentSourceFile, node.name);
            var enumMemberValue = resolver.getEnumMemberValue(node);
            if (enumMemberValue !== undefined) {
                write(" = ");
                write(enumMemberValue.toString());
            }
            write(",");
            writeLine();
        }
        function emitTypeParameters(typeParameters) {
            function emitTypeParameter(node) {
                increaseIndent();
                emitJsDocComments(node);
                decreaseIndent();
                writeTextOfNode(currentSourceFile, node.name);
                // If there is constraint present and this is not a type parameter of the private method emit the constraint
                if (node.constraint && (node.parent.kind !== 125 /* Method */ || !(node.parent.flags & 32 /* Private */))) {
                    write(" extends ");
                    if (node.parent.kind === 133 /* FunctionType */ ||
                        node.parent.kind === 134 /* ConstructorType */ ||
                        (node.parent.parent && node.parent.parent.kind === 136 /* TypeLiteral */)) {
                        ts.Debug.assert(node.parent.kind === 125 /* Method */ ||
                            node.parent.kind === 133 /* FunctionType */ ||
                            node.parent.kind === 134 /* ConstructorType */ ||
                            node.parent.kind === 129 /* CallSignature */ ||
                            node.parent.kind === 130 /* ConstructSignature */);
                        emitType(node.constraint);
                    }
                    else {
                        emitTypeWithNewGetSymbolAccessibilityDiagnostic(node.constraint, getTypeParameterConstraintVisibilityError);
                    }
                }
                function getTypeParameterConstraintVisibilityError(symbolAccesibilityResult) {
                    // Type parameter constraints are named by user so we should always be able to name it
                    var diagnosticMessage;
                    switch (node.parent.kind) {
                        case 185 /* ClassDeclaration */:
                            diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_exported_class_has_or_is_using_private_name_1;
                            break;
                        case 186 /* InterfaceDeclaration */:
                            diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_exported_interface_has_or_is_using_private_name_1;
                            break;
                        case 130 /* ConstructSignature */:
                            diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1;
                            break;
                        case 129 /* CallSignature */:
                            diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1;
                            break;
                        case 125 /* Method */:
                            if (node.parent.flags & 128 /* Static */) {
                                diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1;
                            }
                            else if (node.parent.parent.kind === 185 /* ClassDeclaration */) {
                                diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1;
                            }
                            else {
                                diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1;
                            }
                            break;
                        case 184 /* FunctionDeclaration */:
                            diagnosticMessage = ts.Diagnostics.Type_parameter_0_of_exported_function_has_or_is_using_private_name_1;
                            break;
                        default:
                            ts.Debug.fail("This is unknown parent for type parameter: " + node.parent.kind);
                    }
                    return {
                        diagnosticMessage: diagnosticMessage,
                        errorNode: node,
                        typeName: node.name
                    };
                }
            }
            if (typeParameters) {
                write("<");
                emitCommaList(typeParameters, emitTypeParameter);
                write(">");
            }
        }
        function emitHeritageClause(typeReferences, isImplementsList) {
            if (typeReferences) {
                write(isImplementsList ? " implements " : " extends ");
                emitCommaList(typeReferences, emitTypeOfTypeReference);
            }
            function emitTypeOfTypeReference(node) {
                emitTypeWithNewGetSymbolAccessibilityDiagnostic(node, getHeritageClauseVisibilityError);
                function getHeritageClauseVisibilityError(symbolAccesibilityResult) {
                    var diagnosticMessage;
                    // Heritage clause is written by user so it can always be named
                    if (node.parent.parent.kind === 185 /* ClassDeclaration */) {
                        // Class or Interface implemented/extended is inaccessible
                        diagnosticMessage = isImplementsList ?
                            ts.Diagnostics.Implements_clause_of_exported_class_0_has_or_is_using_private_name_1 :
                            ts.Diagnostics.Extends_clause_of_exported_class_0_has_or_is_using_private_name_1;
                    }
                    else {
                        // interface is inaccessible
                        diagnosticMessage = ts.Diagnostics.Extends_clause_of_exported_interface_0_has_or_is_using_private_name_1;
                    }
                    return {
                        diagnosticMessage: diagnosticMessage,
                        errorNode: node,
                        typeName: node.parent.parent.name
                    };
                }
            }
        }
        function emitClassDeclaration(node) {
            function emitParameterProperties(constructorDeclaration) {
                if (constructorDeclaration) {
                    ts.forEach(constructorDeclaration.parameters, function (param) {
                        if (param.flags & 112 /* AccessibilityModifier */) {
                            emitPropertyDeclaration(param);
                        }
                    });
                }
            }
            if (resolver.isDeclarationVisible(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                write("class ");
                writeTextOfNode(currentSourceFile, node.name);
                var prevEnclosingDeclaration = enclosingDeclaration;
                enclosingDeclaration = node;
                emitTypeParameters(node.typeParameters);
                var baseTypeNode = ts.getClassBaseTypeNode(node);
                if (baseTypeNode) {
                    emitHeritageClause([baseTypeNode], false);
                }
                emitHeritageClause(ts.getClassImplementedTypeNodes(node), true);
                write(" {");
                writeLine();
                increaseIndent();
                emitParameterProperties(getFirstConstructorWithBody(node));
                emitLines(node.members);
                decreaseIndent();
                write("}");
                writeLine();
                enclosingDeclaration = prevEnclosingDeclaration;
            }
        }
        function emitInterfaceDeclaration(node) {
            if (resolver.isDeclarationVisible(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                write("interface ");
                writeTextOfNode(currentSourceFile, node.name);
                var prevEnclosingDeclaration = enclosingDeclaration;
                enclosingDeclaration = node;
                emitTypeParameters(node.typeParameters);
                emitHeritageClause(ts.getInterfaceBaseTypeNodes(node), false);
                write(" {");
                writeLine();
                increaseIndent();
                emitLines(node.members);
                decreaseIndent();
                write("}");
                writeLine();
                enclosingDeclaration = prevEnclosingDeclaration;
            }
        }
        function emitPropertyDeclaration(node) {
            var name;
            if (global.ignoreDollar && node.name && (name = node.name['text']) && name.indexOf('$') == 0)
                return;
            emitJsDocComments(node);
            emitClassMemberDeclarationFlags(node);
            emitVariableDeclaration(node);
            write(";");
            writeLine();
        }
        // TODO(jfreeman): Factor out common part of property definition, but treat name differently
        function emitVariableDeclaration(node) {
            // If we are emitting property it isn't moduleElement and hence we already know it needs to be emitted
            // so there is no check needed to see if declaration is visible
            if (node.kind !== 183 /* VariableDeclaration */ || resolver.isDeclarationVisible(node)) {
                writeTextOfNode(currentSourceFile, node.name);
                // If optional property emit ?
                if (node.kind === 124 /* Property */ && ts.hasQuestionToken(node)) {
                    write("?");
                }
                if (node.kind === 124 /* Property */ && node.parent.kind === 136 /* TypeLiteral */) {
                    emitTypeOfVariableDeclarationFromTypeLiteral(node);
                }
                else if (!(node.flags & 32 /* Private */)) {
                    writeTypeOfDeclaration(node, node.type, getVariableDeclarationTypeVisibilityError);
                }
            }
            function getVariableDeclarationTypeVisibilityError(symbolAccesibilityResult) {
                var diagnosticMessage;
                if (node.kind === 183 /* VariableDeclaration */) {
                    diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                        symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                            ts.Diagnostics.Exported_variable_0_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                            ts.Diagnostics.Exported_variable_0_has_or_is_using_name_1_from_private_module_2 :
                        ts.Diagnostics.Exported_variable_0_has_or_is_using_private_name_1;
                }
                else if (node.kind === 124 /* Property */) {
                    // TODO(jfreeman): Deal with computed properties in error reporting.
                    if (node.flags & 128 /* Static */) {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                ts.Diagnostics.Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Public_static_property_0_of_exported_class_has_or_is_using_private_name_1;
                    }
                    else if (node.parent.kind === 185 /* ClassDeclaration */) {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Public_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                ts.Diagnostics.Public_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Public_property_0_of_exported_class_has_or_is_using_private_name_1;
                    }
                    else {
                        // Interfaces cannot have types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Property_0_of_exported_interface_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Property_0_of_exported_interface_has_or_is_using_private_name_1;
                    }
                }
                return diagnosticMessage !== undefined ? {
                    diagnosticMessage: diagnosticMessage,
                    errorNode: node,
                    typeName: node.name
                } : undefined;
            }
        }
        function emitTypeOfVariableDeclarationFromTypeLiteral(node) {
            // if this is property of type literal, 
            // or is parameter of method/call/construct/index signature of type literal
            // emit only if type is specified
            if (node.type) {
                write(": ");
                emitType(node.type);
            }
        }
        function emitVariableStatement(node) {
            var hasDeclarationWithEmit = ts.forEach(node.declarations, function (varDeclaration) { return resolver.isDeclarationVisible(varDeclaration); });
            if (hasDeclarationWithEmit) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                if (ts.isLet(node)) {
                    write("let ");
                }
                else if (ts.isConst(node)) {
                    write("const ");
                }
                else {
                    write("var ");
                }
                emitCommaList(node.declarations, emitVariableDeclaration);
                write(";");
                writeLine();
            }
        }
        function emitAccessorDeclaration(node) {
            var accessors = getAllAccessorDeclarations(node.parent, node);
            if (node === accessors.firstAccessor && resolver.isDeclarationVisible(node)) {
                var name;
                if (global.ignoreDollar && node.name && (name = node.name['text']) && name.indexOf('$') == 0)
                    return;
                emitJsDocComments(accessors.getAccessor);
                emitJsDocComments(accessors.setAccessor);
                emitClassMemberDeclarationFlags(node);
                writeTextOfNode(currentSourceFile, node.name);
                if (!(node.flags & 32 /* Private */)) {
                    var accessorWithTypeAnnotation = node;
                    var type = getTypeAnnotationFromAccessor(node);
                    if (!type) {
                        // couldn't get type for the first accessor, try the another one
                        var anotherAccessor = node.kind === 127 /* GetAccessor */ ? accessors.setAccessor : accessors.getAccessor;
                        type = getTypeAnnotationFromAccessor(anotherAccessor);
                        if (type) {
                            accessorWithTypeAnnotation = anotherAccessor;
                        }
                    }
                    writeTypeOfDeclaration(node, type, getAccessorDeclarationTypeVisibilityError);
                }
                write(";");
                writeLine();
            }
            function getTypeAnnotationFromAccessor(accessor) {
                if (accessor) {
                    return accessor.kind === 127 /* GetAccessor */
                        ? accessor.type // Getter - return type
                        : accessor.parameters[0].type; // Setter parameter type
                }
            }
            function getAccessorDeclarationTypeVisibilityError(symbolAccesibilityResult) {
                var diagnosticMessage;
                if (accessorWithTypeAnnotation.kind === 128 /* SetAccessor */) {
                    // Setters have to have type named and cannot infer it so, the type should always be named
                    if (accessorWithTypeAnnotation.parent.flags & 128 /* Static */) {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Parameter_0_of_public_static_property_setter_from_exported_class_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_public_static_property_setter_from_exported_class_has_or_is_using_private_name_1;
                    }
                    else {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Parameter_0_of_public_property_setter_from_exported_class_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_public_property_setter_from_exported_class_has_or_is_using_private_name_1;
                    }
                    return {
                        diagnosticMessage: diagnosticMessage,
                        errorNode: accessorWithTypeAnnotation.parameters[0],
                        // TODO(jfreeman): Investigate why we are passing node.name instead of node.parameters[0].name
                        typeName: accessorWithTypeAnnotation.name
                    };
                }
                else {
                    if (accessorWithTypeAnnotation.flags & 128 /* Static */) {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named :
                                ts.Diagnostics.Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_name_0;
                    }
                    else {
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Return_type_of_public_property_getter_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named :
                                ts.Diagnostics.Return_type_of_public_property_getter_from_exported_class_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_name_0;
                    }
                    return {
                        diagnosticMessage: diagnosticMessage,
                        errorNode: accessorWithTypeAnnotation.name,
                        typeName: undefined
                    };
                }
            }
        }
        function emitFunctionDeclaration(node) {
            // If we are emitting Method/Constructor it isn't moduleElement and hence already determined to be emitting
            // so no need to verify if the declaration is visible
            if ((node.kind !== 184 /* FunctionDeclaration */ || resolver.isDeclarationVisible(node)) &&
                !resolver.isImplementationOfOverload(node)) {
                var name;
                if (global.ignoreDollar && node.name && (name = node.name['text']) && name.indexOf('$') == 0)
                    return;
                emitJsDocComments(node);
                if (node.kind === 184 /* FunctionDeclaration */) {
                    emitModuleElementDeclarationFlags(node);
                }
                else if (node.kind === 125 /* Method */) {
                    emitClassMemberDeclarationFlags(node);
                }
                if (node.kind === 184 /* FunctionDeclaration */) {
                    write("function ");
                    writeTextOfNode(currentSourceFile, node.name);
                }
                else if (node.kind === 126 /* Constructor */) {
                    write("constructor");
                }
                else {
                    writeTextOfNode(currentSourceFile, node.name);
                    if (ts.hasQuestionToken(node)) {
                        write("?");
                    }
                }
                emitSignatureDeclaration(node);
            }
        }
        function emitSignatureDeclarationWithJsDocComments(node) {
            emitJsDocComments(node);
            emitSignatureDeclaration(node);
        }
        function emitSignatureDeclaration(node) {
            // Construct signature or constructor type write new Signature
            if (node.kind === 130 /* ConstructSignature */ || node.kind === 134 /* ConstructorType */) {
                write("new ");
            }
            emitTypeParameters(node.typeParameters);
            if (node.kind === 131 /* IndexSignature */) {
                write("[");
            }
            else {
                write("(");
            }
            var prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;
            // Parameters
            emitCommaList(node.parameters, emitParameterDeclaration);
            if (node.kind === 131 /* IndexSignature */) {
                write("]");
            }
            else {
                write(")");
            }
            // If this is not a constructor and is not private, emit the return type
            var isFunctionTypeOrConstructorType = node.kind === 133 /* FunctionType */ || node.kind === 134 /* ConstructorType */;
            if (isFunctionTypeOrConstructorType || node.parent.kind === 136 /* TypeLiteral */) {
                // Emit type literal signature return type only if specified
                if (node.type) {
                    write(isFunctionTypeOrConstructorType ? " => " : ": ");
                    emitType(node.type);
                }
            }
            else if (node.kind !== 126 /* Constructor */ && !(node.flags & 32 /* Private */)) {
                writeReturnTypeAtSignature(node, getReturnTypeVisibilityError);
            }
            enclosingDeclaration = prevEnclosingDeclaration;
            if (!isFunctionTypeOrConstructorType) {
                write(";");
                writeLine();
            }
            function getReturnTypeVisibilityError(symbolAccesibilityResult) {
                var diagnosticMessage;
                switch (node.kind) {
                    case 130 /* ConstructSignature */:
                        // Interfaces cannot have return types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_0;
                        break;
                    case 129 /* CallSignature */:
                        // Interfaces cannot have return types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Return_type_of_call_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_name_0;
                        break;
                    case 131 /* IndexSignature */:
                        // Interfaces cannot have return types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Return_type_of_index_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_name_0;
                        break;
                    case 125 /* Method */:
                        if (node.flags & 128 /* Static */) {
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                    ts.Diagnostics.Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named :
                                    ts.Diagnostics.Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_private_module_1 :
                                ts.Diagnostics.Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_name_0;
                        }
                        else if (node.parent.kind === 185 /* ClassDeclaration */) {
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                    ts.Diagnostics.Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named :
                                    ts.Diagnostics.Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_private_module_1 :
                                ts.Diagnostics.Return_type_of_public_method_from_exported_class_has_or_is_using_private_name_0;
                        }
                        else {
                            // Interfaces cannot have return types that cannot be named
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                ts.Diagnostics.Return_type_of_method_from_exported_interface_has_or_is_using_name_0_from_private_module_1 :
                                ts.Diagnostics.Return_type_of_method_from_exported_interface_has_or_is_using_private_name_0;
                        }
                        break;
                    case 184 /* FunctionDeclaration */:
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Return_type_of_exported_function_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named :
                                ts.Diagnostics.Return_type_of_exported_function_has_or_is_using_name_0_from_private_module_1 :
                            ts.Diagnostics.Return_type_of_exported_function_has_or_is_using_private_name_0;
                        break;
                    default:
                        ts.Debug.fail("This is unknown kind for signature: " + node.kind);
                }
                return {
                    diagnosticMessage: diagnosticMessage,
                    errorNode: node.name || node
                };
            }
        }
        function emitParameterDeclaration(node) {
            increaseIndent();
            emitJsDocComments(node);
            if (node.dotDotDotToken) {
                write("...");
            }
            writeTextOfNode(currentSourceFile, node.name);
            if (node.initializer || ts.hasQuestionToken(node)) {
                write("?");
            }
            decreaseIndent();
            if (node.parent.kind === 133 /* FunctionType */ ||
                node.parent.kind === 134 /* ConstructorType */ ||
                node.parent.parent.kind === 136 /* TypeLiteral */) {
                emitTypeOfVariableDeclarationFromTypeLiteral(node);
            }
            else if (!(node.parent.flags & 32 /* Private */)) {
                writeTypeOfDeclaration(node, node.type, getParameterDeclarationTypeVisibilityError);
            }
            function getParameterDeclarationTypeVisibilityError(symbolAccesibilityResult) {
                var diagnosticMessage;
                switch (node.parent.kind) {
                    case 126 /* Constructor */:
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                ts.Diagnostics.Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_constructor_from_exported_class_has_or_is_using_private_name_1;
                        break;
                    case 130 /* ConstructSignature */:
                        // Interfaces cannot have parameter types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1;
                        break;
                    case 129 /* CallSignature */:
                        // Interfaces cannot have parameter types that cannot be named
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            ts.Diagnostics.Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1;
                        break;
                    case 125 /* Method */:
                        if (node.parent.flags & 128 /* Static */) {
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                    ts.Diagnostics.Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                    ts.Diagnostics.Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_private_module_2 :
                                ts.Diagnostics.Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1;
                        }
                        else if (node.parent.parent.kind === 185 /* ClassDeclaration */) {
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                    ts.Diagnostics.Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                    ts.Diagnostics.Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_private_module_2 :
                                ts.Diagnostics.Parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1;
                        }
                        else {
                            // Interfaces cannot have parameter types that cannot be named
                            diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                                ts.Diagnostics.Parameter_0_of_method_from_exported_interface_has_or_is_using_name_1_from_private_module_2 :
                                ts.Diagnostics.Parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1;
                        }
                        break;
                    case 184 /* FunctionDeclaration */:
                        diagnosticMessage = symbolAccesibilityResult.errorModuleName ?
                            symbolAccesibilityResult.accessibility === 2 /* CannotBeNamed */ ?
                                ts.Diagnostics.Parameter_0_of_exported_function_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named :
                                ts.Diagnostics.Parameter_0_of_exported_function_has_or_is_using_name_1_from_private_module_2 :
                            ts.Diagnostics.Parameter_0_of_exported_function_has_or_is_using_private_name_1;
                        break;
                    default:
                        ts.Debug.fail("This is unknown parent for parameter: " + node.parent.kind);
                }
                return {
                    diagnosticMessage: diagnosticMessage,
                    errorNode: node,
                    typeName: node.name
                };
            }
        }
        function emitNode(node) {
            switch (node.kind) {
                case 126 /* Constructor */:
                case 184 /* FunctionDeclaration */:
                case 125 /* Method */:
                    return emitFunctionDeclaration(node);
                case 130 /* ConstructSignature */:
                case 129 /* CallSignature */:
                case 131 /* IndexSignature */:
                    return emitSignatureDeclarationWithJsDocComments(node);
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                    return emitAccessorDeclaration(node);
                case 164 /* VariableStatement */:
                    return emitVariableStatement(node);
                case 124 /* Property */:
                    return emitPropertyDeclaration(node);
                case 186 /* InterfaceDeclaration */:
                    return emitInterfaceDeclaration(node);
                case 185 /* ClassDeclaration */:
                    return emitClassDeclaration(node);
                case 187 /* TypeAliasDeclaration */:
                    return emitTypeAliasDeclaration(node);
                case 200 /* EnumMember */:
                    return emitEnumMemberDeclaration(node);
                case 188 /* EnumDeclaration */:
                    return emitEnumDeclaration(node);
                case 189 /* ModuleDeclaration */:
                    return emitModuleDeclaration(node);
                case 191 /* ImportDeclaration */:
                    return emitImportDeclaration(node);
                case 192 /* ExportAssignment */:
                    return emitExportAssignment(node);
                case 201 /* SourceFile */:
                    return emitSourceFile(node);
            }
        }
        // Contains the reference paths that needs to go in the declaration file. 
        // Collecting this separately because reference paths need to be first thing in the declaration file 
        // and we could be collecting these paths from multiple files into single one with --out option
        var referencePathsOutput = "";
        function writeReferencePath(referencedFile) {
            var declFileName = referencedFile.flags & 1024 /* DeclarationFile */
                ? referencedFile.filename // Declaration file, use declaration file name
                : shouldEmitToOwnFile(referencedFile, compilerOptions)
                    ? getOwnEmitOutputFilePath(referencedFile, program, ".d.ts") // Own output file so get the .d.ts file
                    : ts.removeFileExtension(compilerOptions.out) + ".d.ts"; // Global out file
            declFileName = ts.getRelativePathToDirectoryOrUrl(ts.getDirectoryPath(ts.normalizeSlashes(jsFilePath)), declFileName, compilerHost.getCurrentDirectory(), compilerHost.getCanonicalFileName, 
            /*isAbsolutePathAnUrl*/ false);
            referencePathsOutput += "/// <reference path=\"" + declFileName + "\" />" + newLine;
        }
        if (root) {
            // Emitting just a single file, so emit references in this file only
            if (!compilerOptions.noResolve) {
                var addedGlobalFileReference = false;
                ts.forEach(root.referencedFiles, function (fileReference) {
                    var referencedFile = ts.tryResolveScriptReference(program, root, fileReference);
                    // All the references that are not going to be part of same file
                    if (referencedFile && ((referencedFile.flags & 1024 /* DeclarationFile */) ||
                        shouldEmitToOwnFile(referencedFile, compilerOptions) ||
                        !addedGlobalFileReference)) {
                        writeReferencePath(referencedFile);
                        if (!isExternalModuleOrDeclarationFile(referencedFile)) {
                            addedGlobalFileReference = true;
                        }
                    }
                });
            }
            emitNode(root);
        }
        else {
            // Emit references corresponding to this file
            var emittedReferencedFiles = [];
            ts.forEach(program.getSourceFiles(), function (sourceFile) {
                if (!isExternalModuleOrDeclarationFile(sourceFile)) {
                    // Check what references need to be added
                    if (!compilerOptions.noResolve) {
                        ts.forEach(sourceFile.referencedFiles, function (fileReference) {
                            var referencedFile = ts.tryResolveScriptReference(program, sourceFile, fileReference);
                            // If the reference file is a declaration file or an external module, emit that reference
                            if (referencedFile && (isExternalModuleOrDeclarationFile(referencedFile) &&
                                !ts.contains(emittedReferencedFiles, referencedFile))) {
                                writeReferencePath(referencedFile);
                                emittedReferencedFiles.push(referencedFile);
                            }
                        });
                    }
                    emitNode(sourceFile);
                }
            });
        }
        return {
            reportedDeclarationError: reportedDeclarationError,
            aliasDeclarationEmitInfo: aliasDeclarationEmitInfo,
            synchronousDeclarationOutput: writer.getText(),
            referencePathsOutput: referencePathsOutput
        };
    }
    function getDeclarationDiagnostics(program, resolver, targetSourceFile) {
        var diagnostics = [];
        var jsFilePath = getOwnEmitOutputFilePath(targetSourceFile, program, ".js");
        emitDeclarations(program, resolver, diagnostics, jsFilePath, targetSourceFile);
        return diagnostics;
    }
    ts.getDeclarationDiagnostics = getDeclarationDiagnostics;
    // targetSourceFile is when users only want one file in entire project to be emitted. This is used in compilerOnSave feature
    function emitFiles(resolver, targetSourceFile) {
        var program = resolver.getProgram();
        var compilerHost = program.getCompilerHost();
        var compilerOptions = program.getCompilerOptions();
        var sourceMapDataList = compilerOptions.sourceMap ? [] : undefined;
        var diagnostics = [];
        var newLine = program.getCompilerHost().getNewLine();
        function emitJavaScript(jsFilePath, root) {
            var writer = createTextWriter(newLine);
            var write = writer.write;
            var writeTextOfNode = writer.writeTextOfNode;
            var writeLine = writer.writeLine;
            var increaseIndent = writer.increaseIndent;
            var decreaseIndent = writer.decreaseIndent;
            var currentSourceFile;
            var extendsEmitted = false;
            var defineEmitted = false;
            /** write emitted output to disk*/
            var writeEmittedFiles = writeJavaScriptFile;
            /** Emit leading comments of the node */
            var emitLeadingComments = compilerOptions.removeComments ? function (node) { } : emitLeadingDeclarationComments;
            /** Emit Trailing comments of the node */
            var emitTrailingComments = compilerOptions.removeComments ? function (node) { } : emitTrailingDeclarationComments;
            var emitLeadingCommentsOfPosition = compilerOptions.removeComments ? function (pos) { } : emitLeadingCommentsOfLocalPosition;
            var detachedCommentsInfo;
            /** Emit detached comments of the node */
            var emitDetachedComments = compilerOptions.removeComments ? function (node) { } : emitDetachedCommentsAtPosition;
            /** Emits /// or pinned which is comment starting with /*! comments */
            var emitPinnedOrTripleSlashComments = compilerOptions.removeComments ? function (node) { } : emitPinnedOrTripleSlashCommentsOfNode;
            var writeComment = writeCommentRange;
            /** Emit a node */
            var emit = emitNode;
            /** Called just before starting emit of a node */
            var emitStart = function (node) { };
            /** Called once the emit of the node is done */
            var emitEnd = function (node) { };
            /** Emit the text for the given token that comes after startPos
              * This by default writes the text provided with the given tokenKind
              * but if optional emitFn callback is provided the text is emitted using the callback instead of default text
              * @param tokenKind the kind of the token to search and emit
              * @param startPos the position in the source to start searching for the token
              * @param emitFn if given will be invoked to emit the text instead of actual token emit */
            var emitToken = emitTokenText;
            /** Called to before starting the lexical scopes as in function/class in the emitted code because of node
              * @param scopeDeclaration node that starts the lexical scope
              * @param scopeName Optional name of this scope instead of deducing one from the declaration node */
            var scopeEmitStart = function (scopeDeclaration, scopeName) { };
            /** Called after coming out of the scope */
            var scopeEmitEnd = function () { };
            /** Sourcemap data that will get encoded */
            var sourceMapData;
            function initializeEmitterWithSourceMaps() {
                var sourceMapDir; // The directory in which sourcemap will be
                // Current source map file and its index in the sources list
                var sourceMapSourceIndex = -1;
                // Names and its index map
                var sourceMapNameIndexMap = {};
                var sourceMapNameIndices = [];
                function getSourceMapNameIndex() {
                    return sourceMapNameIndices.length ? sourceMapNameIndices[sourceMapNameIndices.length - 1] : -1;
                }
                // Last recorded and encoded spans
                var lastRecordedSourceMapSpan;
                var lastEncodedSourceMapSpan = {
                    emittedLine: 1,
                    emittedColumn: 1,
                    sourceLine: 1,
                    sourceColumn: 1,
                    sourceIndex: 0
                };
                var lastEncodedNameIndex = 0;
                // Encoding for sourcemap span
                function encodeLastRecordedSourceMapSpan() {
                    if (!lastRecordedSourceMapSpan || lastRecordedSourceMapSpan === lastEncodedSourceMapSpan) {
                        return;
                    }
                    var prevEncodedEmittedColumn = lastEncodedSourceMapSpan.emittedColumn;
                    // Line/Comma delimiters
                    if (lastEncodedSourceMapSpan.emittedLine == lastRecordedSourceMapSpan.emittedLine) {
                        // Emit comma to separate the entry
                        if (sourceMapData.sourceMapMappings) {
                            sourceMapData.sourceMapMappings += ",";
                        }
                    }
                    else {
                        // Emit line delimiters
                        for (var encodedLine = lastEncodedSourceMapSpan.emittedLine; encodedLine < lastRecordedSourceMapSpan.emittedLine; encodedLine++) {
                            sourceMapData.sourceMapMappings += ";";
                        }
                        prevEncodedEmittedColumn = 1;
                    }
                    // 1. Relative Column 0 based
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.emittedColumn - prevEncodedEmittedColumn);
                    // 2. Relative sourceIndex 
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceIndex - lastEncodedSourceMapSpan.sourceIndex);
                    // 3. Relative sourceLine 0 based
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceLine - lastEncodedSourceMapSpan.sourceLine);
                    // 4. Relative sourceColumn 0 based 
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceColumn - lastEncodedSourceMapSpan.sourceColumn);
                    // 5. Relative namePosition 0 based
                    if (lastRecordedSourceMapSpan.nameIndex >= 0) {
                        sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.nameIndex - lastEncodedNameIndex);
                        lastEncodedNameIndex = lastRecordedSourceMapSpan.nameIndex;
                    }
                    lastEncodedSourceMapSpan = lastRecordedSourceMapSpan;
                    sourceMapData.sourceMapDecodedMappings.push(lastEncodedSourceMapSpan);
                    function base64VLQFormatEncode(inValue) {
                        function base64FormatEncode(inValue) {
                            if (inValue < 64) {
                                return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(inValue);
                            }
                            throw TypeError(inValue + ": not a 64 based value");
                        }
                        // Add a new least significant bit that has the sign of the value.
                        // if negative number the least significant bit that gets added to the number has value 1
                        // else least significant bit value that gets added is 0
                        // eg. -1 changes to binary : 01 [1] => 3
                        //     +1 changes to binary : 01 [0] => 2
                        if (inValue < 0) {
                            inValue = ((-inValue) << 1) + 1;
                        }
                        else {
                            inValue = inValue << 1;
                        }
                        // Encode 5 bits at a time starting from least significant bits
                        var encodedStr = "";
                        do {
                            var currentDigit = inValue & 31; // 11111
                            inValue = inValue >> 5;
                            if (inValue > 0) {
                                // There are still more digits to decode, set the msb (6th bit)
                                currentDigit = currentDigit | 32;
                            }
                            encodedStr = encodedStr + base64FormatEncode(currentDigit);
                        } while (inValue > 0);
                        return encodedStr;
                    }
                }
                function recordSourceMapSpan(pos) {
                    var sourceLinePos = currentSourceFile.getLineAndCharacterFromPosition(pos);
                    var emittedLine = writer.getLine();
                    var emittedColumn = writer.getColumn();
                    // If this location wasn't recorded or the location in source is going backwards, record the span
                    if (!lastRecordedSourceMapSpan ||
                        lastRecordedSourceMapSpan.emittedLine != emittedLine ||
                        lastRecordedSourceMapSpan.emittedColumn != emittedColumn ||
                        (lastRecordedSourceMapSpan.sourceIndex === sourceMapSourceIndex &&
                            (lastRecordedSourceMapSpan.sourceLine > sourceLinePos.line ||
                                (lastRecordedSourceMapSpan.sourceLine === sourceLinePos.line && lastRecordedSourceMapSpan.sourceColumn > sourceLinePos.character)))) {
                        // Encode the last recordedSpan before assigning new
                        encodeLastRecordedSourceMapSpan();
                        // New span
                        lastRecordedSourceMapSpan = {
                            emittedLine: emittedLine,
                            emittedColumn: emittedColumn,
                            sourceLine: sourceLinePos.line,
                            sourceColumn: sourceLinePos.character,
                            nameIndex: getSourceMapNameIndex(),
                            sourceIndex: sourceMapSourceIndex
                        };
                    }
                    else {
                        // Take the new pos instead since there is no change in emittedLine and column since last location
                        lastRecordedSourceMapSpan.sourceLine = sourceLinePos.line;
                        lastRecordedSourceMapSpan.sourceColumn = sourceLinePos.character;
                        lastRecordedSourceMapSpan.sourceIndex = sourceMapSourceIndex;
                    }
                }
                function recordEmitNodeStartSpan(node) {
                    // Get the token pos after skipping to the token (ignoring the leading trivia)
                    recordSourceMapSpan(ts.skipTrivia(currentSourceFile.text, node.pos));
                }
                function recordEmitNodeEndSpan(node) {
                    recordSourceMapSpan(node.end);
                }
                function writeTextWithSpanRecord(tokenKind, startPos, emitFn) {
                    var tokenStartPos = ts.skipTrivia(currentSourceFile.text, startPos);
                    recordSourceMapSpan(tokenStartPos);
                    var tokenEndPos = emitTokenText(tokenKind, tokenStartPos, emitFn);
                    recordSourceMapSpan(tokenEndPos);
                    return tokenEndPos;
                }
                function recordNewSourceFileStart(node) {
                    // Add the file to tsFilePaths
                    // If sourceroot option: Use the relative path corresponding to the common directory path 
                    // otherwise source locations relative to map file location
                    var sourcesDirectoryPath = compilerOptions.sourceRoot ? program.getCommonSourceDirectory() : sourceMapDir;
                    sourceMapData.sourceMapSources.push(ts.getRelativePathToDirectoryOrUrl(sourcesDirectoryPath, node.filename, compilerHost.getCurrentDirectory(), compilerHost.getCanonicalFileName, 
                    /*isAbsolutePathAnUrl*/ true));
                    sourceMapSourceIndex = sourceMapData.sourceMapSources.length - 1;
                    // The one that can be used from program to get the actual source file
                    sourceMapData.inputSourceFileNames.push(node.filename);
                }
                function recordScopeNameOfNode(node, scopeName) {
                    function recordScopeNameIndex(scopeNameIndex) {
                        sourceMapNameIndices.push(scopeNameIndex);
                    }
                    function recordScopeNameStart(scopeName) {
                        var scopeNameIndex = -1;
                        if (scopeName) {
                            var parentIndex = getSourceMapNameIndex();
                            if (parentIndex !== -1) {
                                scopeName = sourceMapData.sourceMapNames[parentIndex] + "." + scopeName;
                            }
                            scopeNameIndex = ts.getProperty(sourceMapNameIndexMap, scopeName);
                            if (scopeNameIndex === undefined) {
                                scopeNameIndex = sourceMapData.sourceMapNames.length;
                                sourceMapData.sourceMapNames.push(scopeName);
                                sourceMapNameIndexMap[scopeName] = scopeNameIndex;
                            }
                        }
                        recordScopeNameIndex(scopeNameIndex);
                    }
                    if (scopeName) {
                        // The scope was already given a name  use it
                        recordScopeNameStart(scopeName);
                    }
                    else if (node.kind === 184 /* FunctionDeclaration */ ||
                        node.kind === 150 /* FunctionExpression */ ||
                        node.kind === 125 /* Method */ ||
                        node.kind === 127 /* GetAccessor */ ||
                        node.kind === 128 /* SetAccessor */ ||
                        node.kind === 189 /* ModuleDeclaration */ ||
                        node.kind === 185 /* ClassDeclaration */ ||
                        node.kind === 188 /* EnumDeclaration */) {
                        // Declaration and has associated name use it
                        if (node.name) {
                            // TODO(jfreeman): Ask shkamat about what this name should be for source maps
                            scopeName = node.name.text;
                        }
                        recordScopeNameStart(scopeName);
                    }
                    else {
                        // Block just use the name from upper level scope
                        recordScopeNameIndex(getSourceMapNameIndex());
                    }
                }
                function recordScopeNameEnd() {
                    sourceMapNameIndices.pop();
                }
                ;
                function writeCommentRangeWithMap(curentSourceFile, writer, comment, newLine) {
                    recordSourceMapSpan(comment.pos);
                    writeCommentRange(currentSourceFile, writer, comment, newLine);
                    recordSourceMapSpan(comment.end);
                }
                function serializeSourceMapContents(version, file, sourceRoot, sources, names, mappings) {
                    if (typeof JSON !== "undefined") {
                        return JSON.stringify({
                            version: version,
                            file: file,
                            sourceRoot: sourceRoot,
                            sources: sources,
                            names: names,
                            mappings: mappings
                        });
                    }
                    return "{\"version\":" + version + ",\"file\":\"" + ts.escapeString(file) + "\",\"sourceRoot\":\"" + ts.escapeString(sourceRoot) + "\",\"sources\":[" + serializeStringArray(sources) + "],\"names\":[" + serializeStringArray(names) + "],\"mappings\":\"" + ts.escapeString(mappings) + "\"}";
                    function serializeStringArray(list) {
                        var output = "";
                        for (var i = 0, n = list.length; i < n; i++) {
                            if (i) {
                                output += ",";
                            }
                            output += "\"" + ts.escapeString(list[i]) + "\"";
                        }
                        return output;
                    }
                }
                function writeJavaScriptAndSourceMapFile(emitOutput, writeByteOrderMark) {
                    // Write source map file
                    encodeLastRecordedSourceMapSpan();
                    writeFile(compilerHost, diagnostics, sourceMapData.sourceMapFilePath, serializeSourceMapContents(3, sourceMapData.sourceMapFile, sourceMapData.sourceMapSourceRoot, sourceMapData.sourceMapSources, sourceMapData.sourceMapNames, sourceMapData.sourceMapMappings), false);
                    sourceMapDataList.push(sourceMapData);
                    // Write sourcemap url to the js file and write the js file
                    writeJavaScriptFile(emitOutput + "//# sourceMappingURL=" + sourceMapData.jsSourceMappingURL, writeByteOrderMark);
                }
                // Initialize source map data
                var sourceMapJsFile = ts.getBaseFilename(ts.normalizeSlashes(jsFilePath));
                sourceMapData = {
                    sourceMapFilePath: jsFilePath + ".map",
                    jsSourceMappingURL: sourceMapJsFile + ".map",
                    sourceMapFile: sourceMapJsFile,
                    sourceMapSourceRoot: compilerOptions.sourceRoot || "",
                    sourceMapSources: [],
                    inputSourceFileNames: [],
                    sourceMapNames: [],
                    sourceMapMappings: "",
                    sourceMapDecodedMappings: []
                };
                // Normalize source root and make sure it has trailing "/" so that it can be used to combine paths with the 
                // relative paths of the sources list in the sourcemap
                sourceMapData.sourceMapSourceRoot = ts.normalizeSlashes(sourceMapData.sourceMapSourceRoot);
                if (sourceMapData.sourceMapSourceRoot.length && sourceMapData.sourceMapSourceRoot.charCodeAt(sourceMapData.sourceMapSourceRoot.length - 1) !== 47 /* slash */) {
                    sourceMapData.sourceMapSourceRoot += ts.directorySeparator;
                }
                if (compilerOptions.mapRoot) {
                    sourceMapDir = ts.normalizeSlashes(compilerOptions.mapRoot);
                    if (root) {
                        // For modules or multiple emit files the mapRoot will have directory structure like the sources
                        // So if src\a.ts and src\lib\b.ts are compiled together user would be moving the maps into mapRoot\a.js.map and mapRoot\lib\b.js.map
                        sourceMapDir = ts.getDirectoryPath(getSourceFilePathInNewDir(root, program, sourceMapDir));
                    }
                    if (!ts.isRootedDiskPath(sourceMapDir) && !ts.isUrl(sourceMapDir)) {
                        // The relative paths are relative to the common directory
                        sourceMapDir = ts.combinePaths(program.getCommonSourceDirectory(), sourceMapDir);
                        sourceMapData.jsSourceMappingURL = ts.getRelativePathToDirectoryOrUrl(ts.getDirectoryPath(ts.normalizePath(jsFilePath)), ts.combinePaths(sourceMapDir, sourceMapData.jsSourceMappingURL), compilerHost.getCurrentDirectory(), compilerHost.getCanonicalFileName, 
                        /*isAbsolutePathAnUrl*/ true);
                    }
                    else {
                        sourceMapData.jsSourceMappingURL = ts.combinePaths(sourceMapDir, sourceMapData.jsSourceMappingURL);
                    }
                }
                else {
                    sourceMapDir = ts.getDirectoryPath(ts.normalizePath(jsFilePath));
                }
                function emitNodeWithMap(node) {
                    if (node) {
                        if (node.kind != 201 /* SourceFile */) {
                            recordEmitNodeStartSpan(node);
                            emitNode(node);
                            recordEmitNodeEndSpan(node);
                        }
                        else {
                            recordNewSourceFileStart(node);
                            emitNode(node);
                        }
                    }
                }
                writeEmittedFiles = writeJavaScriptAndSourceMapFile;
                emit = emitNodeWithMap;
                emitStart = recordEmitNodeStartSpan;
                emitEnd = recordEmitNodeEndSpan;
                emitToken = writeTextWithSpanRecord;
                scopeEmitStart = recordScopeNameOfNode;
                scopeEmitEnd = recordScopeNameEnd;
                writeComment = writeCommentRangeWithMap;
            }
            function writeJavaScriptFile(emitOutput, writeByteOrderMark) {
                writeFile(compilerHost, diagnostics, jsFilePath, emitOutput, writeByteOrderMark);
            }
            function emitTokenText(tokenKind, startPos, emitFn) {
                var tokenString = ts.tokenToString(tokenKind);
                if (emitFn) {
                    emitFn();
                }
                else {
                    write(tokenString);
                }
                return startPos + tokenString.length;
            }
            function emitOptional(prefix, node) {
                if (node) {
                    write(prefix);
                    emit(node);
                }
            }
            function emitTrailingCommaIfPresent(nodeList, isMultiline) {
                if (nodeList.hasTrailingComma) {
                    write(",");
                    if (isMultiline) {
                        writeLine();
                    }
                }
            }
            function emitCommaList(nodes, includeTrailingComma, count) {
                if (!(count >= 0)) {
                    count = nodes.length;
                }
                if (nodes) {
                    for (var i = 0; i < count; i++) {
                        if (i) {
                            write(", ");
                        }
                        emit(nodes[i]);
                    }
                    if (includeTrailingComma) {
                        emitTrailingCommaIfPresent(nodes, false);
                    }
                }
            }
            function emitMultiLineList(nodes, includeTrailingComma) {
                if (nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (i) {
                            write(",");
                        }
                        writeLine();
                        emit(nodes[i]);
                    }
                    if (includeTrailingComma) {
                        emitTrailingCommaIfPresent(nodes, true);
                    }
                }
            }
            function emitLines(nodes) {
                emitLinesStartingAt(nodes, 0);
            }
            function emitLinesStartingAt(nodes, startIndex) {
                for (var i = startIndex; i < nodes.length; i++) {
                    writeLine();
                    emit(nodes[i]);
                }
            }
            function isBinaryOrOctalIntegerLiteral(text) {
                if (text.length <= 0) {
                    return false;
                }
                if (text.charCodeAt(1) === 66 /* B */ || text.charCodeAt(1) === 98 /* b */ ||
                    text.charCodeAt(1) === 79 /* O */ || text.charCodeAt(1) === 111 /* o */) {
                    return true;
                }
                return false;
            }
            function emitLiteral(node) {
                var text = getLiteralText();
                if (compilerOptions.sourceMap && (node.kind === 7 /* StringLiteral */ || ts.isTemplateLiteralKind(node.kind))) {
                    writer.writeLiteral(text);
                }
                else if (compilerOptions.target < 2 /* ES6 */ && node.kind === 6 /* NumericLiteral */ && isBinaryOrOctalIntegerLiteral(text)) {
                    write(node.text);
                }
                else {
                    write(text);
                }
                function getLiteralText() {
                    if (compilerOptions.target < 2 /* ES6 */ && ts.isTemplateLiteralKind(node.kind)) {
                        return getTemplateLiteralAsStringLiteral(node);
                    }
                    return ts.getSourceTextOfNodeFromSourceFile(currentSourceFile, node);
                }
            }
            function getTemplateLiteralAsStringLiteral(node) {
                return '"' + ts.escapeString(node.text) + '"';
            }
            function emitTemplateExpression(node) {
                // In ES6 mode and above, we can simply emit each portion of a template in order, but in
                // ES3 & ES5 we must convert the template expression into a series of string concatenations.
                if (compilerOptions.target >= 2 /* ES6 */) {
                    ts.forEachChild(node, emit);
                    return;
                }
                ts.Debug.assert(node.parent.kind !== 147 /* TaggedTemplateExpression */);
                var emitOuterParens = ts.isExpression(node.parent)
                    && templateNeedsParens(node, node.parent);
                if (emitOuterParens) {
                    write("(");
                }
                emitLiteral(node.head);
                ts.forEach(node.templateSpans, function (templateSpan) {
                    // Check if the expression has operands and binds its operands less closely than binary '+'.
                    // If it does, we need to wrap the expression in parentheses. Otherwise, something like
                    //    `abc${ 1 << 2 }`
                    // becomes
                    //    "abc" + 1 << 2 + ""
                    // which is really
                    //    ("abc" + 1) << (2 + "")
                    // rather than
                    //    "abc" + (1 << 2) + ""
                    var needsParens = templateSpan.expression.kind !== 149 /* ParenthesizedExpression */
                        && comparePrecedenceToBinaryPlus(templateSpan.expression) !== 1 /* GreaterThan */;
                    write(" + ");
                    if (needsParens) {
                        write("(");
                    }
                    emit(templateSpan.expression);
                    if (needsParens) {
                        write(")");
                    }
                    // Only emit if the literal is non-empty.
                    // The binary '+' operator is left-associative, so the first string concatenation
                    // with the head will force the result up to this point to be a string.
                    // Emitting a '+ ""' has no semantic effect for middles and tails.
                    if (templateSpan.literal.text.length !== 0) {
                        write(" + ");
                        emitLiteral(templateSpan.literal);
                    }
                });
                if (emitOuterParens) {
                    write(")");
                }
                function templateNeedsParens(template, parent) {
                    switch (parent.kind) {
                        case 145 /* CallExpression */:
                        case 146 /* NewExpression */:
                            return parent.expression === template;
                        case 149 /* ParenthesizedExpression */:
                            return false;
                        case 147 /* TaggedTemplateExpression */:
                            ts.Debug.fail("Path should be unreachable; tagged templates not supported pre-ES6.");
                        default:
                            return comparePrecedenceToBinaryPlus(parent) !== -1 /* LessThan */;
                    }
                }
                /**
                 * Returns whether the expression has lesser, greater,
                 * or equal precedence to the binary '+' operator
                 */
                function comparePrecedenceToBinaryPlus(expression) {
                    // All binary expressions have lower precedence than '+' apart from '*', '/', and '%'.
                    // All unary operators have a higher precedence apart from yield.
                    // Arrow functions and conditionals have a lower precedence, 
                    // although we convert the former into regular function expressions in ES5 mode,
                    // and in ES6 mode this function won't get called anyway.
                    // 
                    // TODO (drosen): Note that we need to account for the upcoming 'yield' and
                    //                spread ('...') unary operators that are anticipated for ES6.
                    ts.Debug.assert(compilerOptions.target <= 1 /* ES5 */);
                    switch (expression.kind) {
                        case 157 /* BinaryExpression */:
                            switch (expression.operator) {
                                case 34 /* AsteriskToken */:
                                case 35 /* SlashToken */:
                                case 36 /* PercentToken */:
                                    return 1 /* GreaterThan */;
                                case 32 /* PlusToken */:
                                    return 0 /* EqualTo */;
                                default:
                                    return -1 /* LessThan */;
                            }
                        case 158 /* ConditionalExpression */:
                            return -1 /* LessThan */;
                        default:
                            return 1 /* GreaterThan */;
                    }
                }
            }
            function emitTemplateSpan(span) {
                emit(span.expression);
                emit(span.literal);
            }
            // This function specifically handles numeric/string literals for enum and accessor 'identifiers'.
            // In a sense, it does not actually emit identifiers as much as it declares a name for a specific property.
            function emitExpressionForPropertyName(node) {
                if (node.kind === 7 /* StringLiteral */) {
                    emitLiteral(node);
                }
                else if (node.kind === 121 /* ComputedPropertyName */) {
                    emit(node.expression);
                }
                else {
                    write("\"");
                    if (node.kind === 6 /* NumericLiteral */) {
                        write(node.text);
                    }
                    else {
                        writeTextOfNode(currentSourceFile, node);
                    }
                    write("\"");
                }
            }
            function isNotExpressionIdentifier(node) {
                var parent = node.parent;
                switch (parent.kind) {
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
                    case 150 /* FunctionExpression */:
                    case 185 /* ClassDeclaration */:
                    case 186 /* InterfaceDeclaration */:
                    case 188 /* EnumDeclaration */:
                    case 189 /* ModuleDeclaration */:
                    case 191 /* ImportDeclaration */:
                        return parent.name === node;
                    case 173 /* BreakStatement */:
                    case 172 /* ContinueStatement */:
                    case 192 /* ExportAssignment */:
                        return false;
                    case 177 /* LabeledStatement */:
                        return node.parent.label === node;
                    case 197 /* CatchClause */:
                        return node.parent.name === node;
                }
            }
            function emitExpressionIdentifier(node) {
                var prefix = resolver.getExpressionNamePrefix(node);
                if (prefix) {
                    write(prefix);
                    write(".");
                }
                writeTextOfNode(currentSourceFile, node);
            }
            function emitIdentifier(node) {
                if (!isNotExpressionIdentifier(node)) {
                    emitExpressionIdentifier(node);
                }
                else {
                    writeTextOfNode(currentSourceFile, node);
                }
            }
            function emitThis(node) {
                if (resolver.getNodeCheckFlags(node) & 2 /* LexicalThis */) {
                    write("_this");
                }
                else {
                    write("this");
                }
            }
            function emitSuper(node) {
                var flags = resolver.getNodeCheckFlags(node);
                if (flags & 16 /* SuperInstance */) {
                    write("_super.prototype");
                }
                else if (flags & 32 /* SuperStatic */) {
                    write("_super");
                }
                else {
                    write("super");
                }
            }
            function emitArrayLiteral(node) {
                if (node.flags & 256 /* MultiLine */) {
                    write("[");
                    increaseIndent();
                    emitMultiLineList(node.elements, true);
                    decreaseIndent();
                    writeLine();
                    write("]");
                }
                else {
                    write("[");
                    emitCommaList(node.elements, true);
                    write("]");
                }
            }
            function emitObjectLiteral(node) {
                if (!node.properties.length) {
                    write("{}");
                }
                else if (node.flags & 256 /* MultiLine */) {
                    write("{");
                    increaseIndent();
                    emitMultiLineList(node.properties, compilerOptions.target >= 1 /* ES5 */);
                    decreaseIndent();
                    writeLine();
                    write("}");
                }
                else {
                    write("{ ");
                    emitCommaList(node.properties, compilerOptions.target >= 1 /* ES5 */);
                    write(" }");
                }
            }
            function emitComputedPropertyName(node) {
                write("[");
                emit(node.expression);
                write("]");
            }
            function emitDownlevelMethod(node) {
                if (!ts.isObjectLiteralMethod(node)) {
                    return;
                }
                emitLeadingComments(node);
                emit(node.name);
                write(": ");
                write("function ");
                emitSignatureAndBody(node);
                emitTrailingComments(node);
            }
            function emitMethod(node) {
                if (!ts.isObjectLiteralMethod(node)) {
                    return;
                }
                emitLeadingComments(node);
                emit(node.name);
                emitSignatureAndBody(node);
                emitTrailingComments(node);
            }
            function emitPropertyAssignment(node) {
                emitLeadingComments(node);
                emit(node.name);
                write(": ");
                emit(node.initializer);
                emitTrailingComments(node);
            }
            function emitDownlevelShorthandPropertyAssignment(node) {
                emitLeadingComments(node);
                // Emit identifier as an identifier
                emit(node.name);
                write(": ");
                // Even though this is stored as identifier treat it as an expression
                // Short-hand, { x }, is equivalent of normal form { x: x }
                emitExpressionIdentifier(node.name);
                emitTrailingComments(node);
            }
            function emitShorthandPropertyAssignment(node) {
                // If short-hand property has a prefix, then regardless of the target version, we will emit it as normal property assignment. For example:
                //  module m {
                //      export var y;
                //  }
                //  module m {
                //      export var obj = { y };
                //  }
                //  The short-hand property in obj need to emit as such ... = { y : m.y } regardless of the TargetScript version
                var prefix = resolver.getExpressionNamePrefix(node.name);
                if (prefix) {
                    emitDownlevelShorthandPropertyAssignment(node);
                }
                else {
                    emitLeadingComments(node);
                    emit(node.name);
                    emitTrailingComments(node);
                }
            }
            function tryEmitConstantValue(node) {
                var constantValue = resolver.getConstantValue(node);
                if (constantValue !== undefined) {
                    var propertyName = node.kind === 143 /* PropertyAccessExpression */ ? ts.declarationNameToString(node.name) : ts.getTextOfNode(node.argumentExpression);
                    write(constantValue.toString() + " /* " + propertyName + " */");
                    return true;
                }
                return false;
            }
            function emitPropertyAccess(node) {
                if (tryEmitConstantValue(node)) {
                    return;
                }
                emit(node.expression);
                write(".");
                emit(node.name);
            }
            function emitQualifiedName(node) {
                emit(node.left);
                write(".");
                emit(node.right);
            }
            function emitIndexedAccess(node) {
                if (tryEmitConstantValue(node)) {
                    return;
                }
                emit(node.expression);
                write("[");
                emit(node.argumentExpression);
                write("]");
            }
            function emitCallExpression(node) {
                var superCall = false;
                if (node.expression.kind === 89 /* SuperKeyword */) {
                    write("_super");
                    superCall = true;
                }
                else {
                    emit(node.expression);
                    superCall = node.expression.kind === 143 /* PropertyAccessExpression */ && node.expression.expression.kind === 89 /* SuperKeyword */;
                }
                if (superCall) {
                    write(".call(");
                    emitThis(node.expression);
                    if (node.arguments.length) {
                        write(", ");
                        emitCommaList(node.arguments, false);
                    }
                    write(")");
                }
                else {
                    write("(");
                    emitCommaList(node.arguments, false);
                    write(")");
                }
            }
            function emitNewExpression(node) {
                write("new ");
                emit(node.expression);
                if (node.arguments) {
                    write("(");
                    emitCommaList(node.arguments, false);
                    write(")");
                }
            }
            function emitTaggedTemplateExpression(node) {
                ts.Debug.assert(compilerOptions.target >= 2 /* ES6 */, "Trying to emit a tagged template in pre-ES6 mode.");
                emit(node.tag);
                write(" ");
                emit(node.template);
            }
            function emitParenExpression(node) {
                if (node.expression.kind === 148 /* TypeAssertionExpression */) {
                    var operand = node.expression.expression;
                    // Make sure we consider all nested cast expressions, e.g.:
                    // (<any><number><any>-A).x; 
                    while (operand.kind == 148 /* TypeAssertionExpression */) {
                        operand = operand.expression;
                    }
                    // We have an expression of the form: (<Type>SubExpr)
                    // Emitting this as (SubExpr) is really not desirable. We would like to emit the subexpr as is.
                    // Omitting the parentheses, however, could cause change in the semantics of the generated
                    // code if the casted expression has a lower precedence than the rest of the expression, e.g.: 
                    //      (<any>new A).foo should be emitted as (new A).foo and not new A.foo
                    //      (<any>typeof A).toString() should be emitted as (typeof A).toString() and not typeof A.toString()
                    //      new (<any>A()) should be emitted as new (A()) and not new A()
                    //      (<any>function foo() { })() should be emitted as an IIF (function foo(){})() and not declaration function foo(){} ()
                    if (operand.kind !== 155 /* PrefixUnaryExpression */ &&
                        operand.kind !== 154 /* VoidExpression */ &&
                        operand.kind !== 153 /* TypeOfExpression */ &&
                        operand.kind !== 152 /* DeleteExpression */ &&
                        operand.kind !== 156 /* PostfixUnaryExpression */ &&
                        operand.kind !== 146 /* NewExpression */ &&
                        !(operand.kind === 145 /* CallExpression */ && node.parent.kind === 146 /* NewExpression */) &&
                        !(operand.kind === 150 /* FunctionExpression */ && node.parent.kind === 145 /* CallExpression */)) {
                        emit(operand);
                        return;
                    }
                }
                write("(");
                emit(node.expression);
                write(")");
            }
            function emitDeleteExpression(node) {
                write(ts.tokenToString(72 /* DeleteKeyword */));
                write(" ");
                emit(node.expression);
            }
            function emitVoidExpression(node) {
                write(ts.tokenToString(97 /* VoidKeyword */));
                write(" ");
                emit(node.expression);
            }
            function emitTypeOfExpression(node) {
                write(ts.tokenToString(95 /* TypeOfKeyword */));
                write(" ");
                emit(node.expression);
            }
            function emitPrefixUnaryExpression(node) {
                write(ts.tokenToString(node.operator));
                // In some cases, we need to emit a space between the operator and the operand. One obvious case
                // is when the operator is an identifier, like delete or typeof. We also need to do this for plus
                // and minus expressions in certain cases. Specifically, consider the following two cases (parens
                // are just for clarity of exposition, and not part of the source code):
                //
                //  (+(+1))
                //  (+(++1))
                //
                // We need to emit a space in both cases. In the first case, the absence of a space will make
                // the resulting expression a prefix increment operation. And in the second, it will make the resulting
                // expression a prefix increment whose operand is a plus expression - (++(+x))
                // The same is true of minus of course.
                if (node.operand.kind === 155 /* PrefixUnaryExpression */) {
                    var operand = node.operand;
                    if (node.operator === 32 /* PlusToken */ && (operand.operator === 32 /* PlusToken */ || operand.operator === 37 /* PlusPlusToken */)) {
                        write(" ");
                    }
                    else if (node.operator === 33 /* MinusToken */ && (operand.operator === 33 /* MinusToken */ || operand.operator === 38 /* MinusMinusToken */)) {
                        write(" ");
                    }
                }
                emit(node.operand);
            }
            function emitPostfixUnaryExpression(node) {
                emit(node.operand);
                write(ts.tokenToString(node.operator));
            }
            function emitBinaryExpression(node) {
                emit(node.left);
                if (node.operator !== 22 /* CommaToken */)
                    write(" ");
                write(ts.tokenToString(node.operator));
                write(" ");
                emit(node.right);
            }
            function emitConditionalExpression(node) {
                emit(node.condition);
                write(" ? ");
                emit(node.whenTrue);
                write(" : ");
                emit(node.whenFalse);
            }
            function emitBlock(node) {
                emitToken(13 /* OpenBraceToken */, node.pos);
                increaseIndent();
                scopeEmitStart(node.parent);
                if (node.kind === 190 /* ModuleBlock */) {
                    ts.Debug.assert(node.parent.kind === 189 /* ModuleDeclaration */);
                    emitCaptureThisForNodeIfNecessary(node.parent);
                }
                emitLines(node.statements);
                decreaseIndent();
                writeLine();
                emitToken(14 /* CloseBraceToken */, node.statements.end);
                scopeEmitEnd();
            }
            function emitEmbeddedStatement(node) {
                if (node.kind === 163 /* Block */) {
                    write(" ");
                    emit(node);
                }
                else {
                    increaseIndent();
                    writeLine();
                    emit(node);
                    decreaseIndent();
                }
            }
            function emitExpressionStatement(node) {
                var isArrowExpression = node.expression.kind === 151 /* ArrowFunction */;
                emitLeadingComments(node);
                if (isArrowExpression)
                    write("(");
                emit(node.expression);
                if (isArrowExpression)
                    write(")");
                write(";");
                emitTrailingComments(node);
            }
            function emitIfStatement(node) {
                emitLeadingComments(node);
                var endPos = emitToken(82 /* IfKeyword */, node.pos);
                write(" ");
                endPos = emitToken(15 /* OpenParenToken */, endPos);
                emit(node.expression);
                emitToken(16 /* CloseParenToken */, node.expression.end);
                emitEmbeddedStatement(node.thenStatement);
                if (node.elseStatement) {
                    writeLine();
                    emitToken(74 /* ElseKeyword */, node.thenStatement.end);
                    if (node.elseStatement.kind === 167 /* IfStatement */) {
                        write(" ");
                        emit(node.elseStatement);
                    }
                    else {
                        emitEmbeddedStatement(node.elseStatement);
                    }
                }
                emitTrailingComments(node);
            }
            function emitDoStatement(node) {
                write("do");
                emitEmbeddedStatement(node.statement);
                if (node.statement.kind === 163 /* Block */) {
                    write(" ");
                }
                else {
                    writeLine();
                }
                write("while (");
                emit(node.expression);
                write(");");
            }
            function emitWhileStatement(node) {
                write("while (");
                emit(node.expression);
                write(")");
                emitEmbeddedStatement(node.statement);
            }
            function emitForStatement(node) {
                var endPos = emitToken(80 /* ForKeyword */, node.pos);
                write(" ");
                endPos = emitToken(15 /* OpenParenToken */, endPos);
                if (node.declarations) {
                    if (node.declarations[0] && ts.isLet(node.declarations[0])) {
                        emitToken(102 /* LetKeyword */, endPos);
                    }
                    else if (node.declarations[0] && ts.isConst(node.declarations[0])) {
                        emitToken(68 /* ConstKeyword */, endPos);
                    }
                    else {
                        emitToken(96 /* VarKeyword */, endPos);
                    }
                    write(" ");
                    emitCommaList(node.declarations, false);
                }
                if (node.initializer) {
                    emit(node.initializer);
                }
                write(";");
                emitOptional(" ", node.condition);
                write(";");
                emitOptional(" ", node.iterator);
                write(")");
                emitEmbeddedStatement(node.statement);
            }
            function emitForInStatement(node) {
                var endPos = emitToken(80 /* ForKeyword */, node.pos);
                write(" ");
                endPos = emitToken(15 /* OpenParenToken */, endPos);
                if (node.declarations) {
                    if (node.declarations.length >= 1) {
                        var decl = node.declarations[0];
                        if (ts.isLet(decl)) {
                            emitToken(102 /* LetKeyword */, endPos);
                        }
                        else {
                            emitToken(96 /* VarKeyword */, endPos);
                        }
                        write(" ");
                        emit(decl);
                    }
                }
                else {
                    emit(node.variable);
                }
                write(" in ");
                emit(node.expression);
                emitToken(16 /* CloseParenToken */, node.expression.end);
                emitEmbeddedStatement(node.statement);
            }
            function emitBreakOrContinueStatement(node) {
                emitToken(node.kind === 173 /* BreakStatement */ ? 64 /* BreakKeyword */ : 69 /* ContinueKeyword */, node.pos);
                emitOptional(" ", node.label);
                write(";");
            }
            function emitReturnStatement(node) {
                emitLeadingComments(node);
                emitToken(88 /* ReturnKeyword */, node.pos);
                emitOptional(" ", node.expression);
                write(";");
                emitTrailingComments(node);
            }
            function emitWithStatement(node) {
                write("with (");
                emit(node.expression);
                write(")");
                emitEmbeddedStatement(node.statement);
            }
            function emitSwitchStatement(node) {
                var endPos = emitToken(90 /* SwitchKeyword */, node.pos);
                write(" ");
                emitToken(15 /* OpenParenToken */, endPos);
                emit(node.expression);
                endPos = emitToken(16 /* CloseParenToken */, node.expression.end);
                write(" ");
                emitToken(13 /* OpenBraceToken */, endPos);
                increaseIndent();
                emitLines(node.clauses);
                decreaseIndent();
                writeLine();
                emitToken(14 /* CloseBraceToken */, node.clauses.end);
            }
            function isOnSameLine(node1, node2) {
                return getLineOfLocalPosition(currentSourceFile, ts.skipTrivia(currentSourceFile.text, node1.pos)) ===
                    getLineOfLocalPosition(currentSourceFile, ts.skipTrivia(currentSourceFile.text, node2.pos));
            }
            function emitCaseOrDefaultClause(node) {
                if (node.kind === 194 /* CaseClause */) {
                    write("case ");
                    emit(node.expression);
                    write(":");
                }
                else {
                    write("default:");
                }
                if (node.statements.length === 1 && isOnSameLine(node, node.statements[0])) {
                    write(" ");
                    emit(node.statements[0]);
                }
                else {
                    increaseIndent();
                    emitLines(node.statements);
                    decreaseIndent();
                }
            }
            function emitThrowStatement(node) {
                write("throw ");
                emit(node.expression);
                write(";");
            }
            function emitTryStatement(node) {
                write("try ");
                emit(node.tryBlock);
                emit(node.catchClause);
                if (node.finallyBlock) {
                    writeLine();
                    write("finally ");
                    emit(node.finallyBlock);
                }
            }
            function emitCatchClause(node) {
                writeLine();
                var endPos = emitToken(66 /* CatchKeyword */, node.pos);
                write(" ");
                emitToken(15 /* OpenParenToken */, endPos);
                emit(node.name);
                emitToken(16 /* CloseParenToken */, node.name.end);
                write(" ");
                emitBlock(node.block);
            }
            function emitDebuggerStatement(node) {
                emitToken(70 /* DebuggerKeyword */, node.pos);
                write(";");
            }
            function emitLabelledStatement(node) {
                emit(node.label);
                write(": ");
                emit(node.statement);
            }
            function getContainingModule(node) {
                do {
                    node = node.parent;
                } while (node && node.kind !== 189 /* ModuleDeclaration */);
                return node;
            }
            function emitModuleMemberName(node) {
                emitStart(node.name);
                if (node.flags & 1 /* Export */) {
                    var container = getContainingModule(node);
                    write(container ? resolver.getLocalNameOfContainer(container) : "exports");
                    write(".");
                }
                emitNode(node.name);
                emitEnd(node.name);
            }
            function emitVariableDeclaration(node) {
                emitLeadingComments(node);
                emitModuleMemberName(node);
                emitOptional(" = ", node.initializer);
                emitTrailingComments(node);
            }
            function emitVariableStatement(node) {
                emitLeadingComments(node);
                if (!(node.flags & 1 /* Export */)) {
                    if (ts.isLet(node)) {
                        write("let ");
                    }
                    else if (ts.isConst(node)) {
                        write("const ");
                    }
                    else {
                        write("var ");
                    }
                }
                emitCommaList(node.declarations, false);
                write(";");
                emitTrailingComments(node);
            }
            function emitParameter(node) {
                emitLeadingComments(node);
                emit(node.name);
                emitTrailingComments(node);
            }
            function emitDefaultValueAssignments(node) {
                ts.forEach(node.parameters, function (param) {
                    if (param.initializer) {
                        writeLine();
                        emitStart(param);
                        write("if (");
                        emitNode(param.name);
                        write(" === void 0)");
                        emitEnd(param);
                        write(" { ");
                        emitStart(param);
                        emitNode(param.name);
                        write(" = ");
                        emitNode(param.initializer);
                        emitEnd(param);
                        write("; }");
                    }
                });
            }
            function emitRestParameter(node) {
                if (ts.hasRestParameters(node)) {
                    var restIndex = node.parameters.length - 1;
                    var restParam = node.parameters[restIndex];
                    writeLine();
                    emitLeadingComments(restParam);
                    emitStart(restParam);
                    write("var ");
                    emitNode(restParam.name);
                    write(" = [];");
                    emitEnd(restParam);
                    emitTrailingComments(restParam);
                    writeLine();
                    write("for (");
                    emitStart(restParam);
                    write("var _i = " + restIndex + ";");
                    emitEnd(restParam);
                    write(" ");
                    emitStart(restParam);
                    write("_i < arguments.length;");
                    emitEnd(restParam);
                    write(" ");
                    emitStart(restParam);
                    write("_i++");
                    emitEnd(restParam);
                    write(") {");
                    increaseIndent();
                    writeLine();
                    emitStart(restParam);
                    emitNode(restParam.name);
                    write("[_i - " + restIndex + "] = arguments[_i];");
                    emitEnd(restParam);
                    decreaseIndent();
                    writeLine();
                    write("}");
                }
            }
            function emitAccessor(node) {
                emitLeadingComments(node);
                write(node.kind === 127 /* GetAccessor */ ? "get " : "set ");
                emit(node.name);
                emitSignatureAndBody(node);
                emitTrailingComments(node);
            }
            function emitFunctionDeclaration(node) {
                if (!node.body) {
                    return emitPinnedOrTripleSlashComments(node);
                }
                if (node.kind !== 125 /* Method */) {
                    // Methods will emit the comments as part of emitting method declaration
                    emitLeadingComments(node);
                }
                write("function ");
                if (node.kind === 184 /* FunctionDeclaration */ || (node.kind === 150 /* FunctionExpression */ && node.name)) {
                    emit(node.name);
                }
                emitSignatureAndBody(node);
                if (node.kind !== 125 /* Method */) {
                    emitTrailingComments(node);
                }
            }
            function emitCaptureThisForNodeIfNecessary(node) {
                if (resolver.getNodeCheckFlags(node) & 4 /* CaptureThis */) {
                    writeLine();
                    emitStart(node);
                    write("var _this = this;");
                    emitEnd(node);
                }
            }
            function emitSignatureParameters(node) {
                increaseIndent();
                write("(");
                if (node) {
                    emitCommaList(node.parameters, false, node.parameters.length - (ts.hasRestParameters(node) ? 1 : 0));
                }
                write(")");
                decreaseIndent();
            }
            function emitSignatureAndBody(node) {
                emitSignatureParameters(node);
                write(" {");
                scopeEmitStart(node);
                increaseIndent();
                emitDetachedComments(node.body.kind === 163 /* Block */ ? node.body.statements : node.body);
                var startIndex = 0;
                if (node.body.kind === 163 /* Block */) {
                    startIndex = emitDirectivePrologues(node.body.statements, true);
                }
                var outPos = writer.getTextPos();
                emitCaptureThisForNodeIfNecessary(node);
                emitDefaultValueAssignments(node);
                emitRestParameter(node);
                if (node.body.kind !== 163 /* Block */ && outPos === writer.getTextPos()) {
                    decreaseIndent();
                    write(" ");
                    emitStart(node.body);
                    write("return ");
                    emitNode(node.body);
                    emitEnd(node.body);
                    write("; ");
                    emitStart(node.body);
                    write("}");
                    emitEnd(node.body);
                }
                else {
                    if (node.body.kind === 163 /* Block */) {
                        emitLinesStartingAt(node.body.statements, startIndex);
                    }
                    else {
                        writeLine();
                        emitLeadingComments(node.body);
                        write("return ");
                        emit(node.body);
                        write(";");
                        emitTrailingComments(node.body);
                    }
                    writeLine();
                    if (node.body.kind === 163 /* Block */) {
                        emitLeadingCommentsOfPosition(node.body.statements.end);
                        decreaseIndent();
                        emitToken(14 /* CloseBraceToken */, node.body.statements.end);
                    }
                    else {
                        decreaseIndent();
                        emitStart(node.body);
                        write("}");
                        emitEnd(node.body);
                    }
                }
                scopeEmitEnd();
                if (node.flags & 1 /* Export */) {
                    writeLine();
                    emitStart(node);
                    emitModuleMemberName(node);
                    write(" = ");
                    emit(node.name);
                    emitEnd(node);
                    write(";");
                }
            }
            function findInitialSuperCall(ctor) {
                if (ctor.body) {
                    var statement = ctor.body.statements[0];
                    if (statement && statement.kind === 166 /* ExpressionStatement */) {
                        var expr = statement.expression;
                        if (expr && expr.kind === 145 /* CallExpression */) {
                            var func = expr.expression;
                            if (func && func.kind === 89 /* SuperKeyword */) {
                                return statement;
                            }
                        }
                    }
                }
            }
            function emitParameterPropertyAssignments(node) {
                ts.forEach(node.parameters, function (param) {
                    if (param.flags & 112 /* AccessibilityModifier */) {
                        writeLine();
                        emitStart(param);
                        emitStart(param.name);
                        write("this.");
                        emitNode(param.name);
                        emitEnd(param.name);
                        write(" = ");
                        emit(param.name);
                        write(";");
                        emitEnd(param);
                    }
                });
            }
            function emitMemberAccessForPropertyName(memberName) {
                if (memberName.kind === 7 /* StringLiteral */ || memberName.kind === 6 /* NumericLiteral */) {
                    write("[");
                    emitNode(memberName);
                    write("]");
                }
                else if (memberName.kind === 121 /* ComputedPropertyName */) {
                    emitComputedPropertyName(memberName);
                }
                else {
                    write(".");
                    emitNode(memberName);
                }
            }
            function emitMemberAssignments(node, staticFlag) {
                ts.forEach(node.members, function (member) {
                    if (member.kind === 124 /* Property */ && (member.flags & 128 /* Static */) === staticFlag && member.initializer) {
                        writeLine();
                        emitLeadingComments(member);
                        emitStart(member);
                        emitStart(member.name);
                        if (staticFlag) {
                            emitNode(node.name);
                        }
                        else {
                            write("this");
                        }
                        emitMemberAccessForPropertyName(member.name);
                        emitEnd(member.name);
                        write(" = ");
                        emit(member.initializer);
                        write(";");
                        emitEnd(member);
                        emitTrailingComments(member);
                    }
                });
            }
            function emitMemberFunctions(node) {
                writeLine();
                write('var d = __define,c=');
                emitNode(node.name);
                write(';p=c.prototype;');
                ts.forEach(node.members, function (member) {
                    if (member.kind === 125 /* Method */) {
                        if (!member.body) {
                            return emitPinnedOrTripleSlashComments(member);
                        }
                        writeLine();
                        emitLeadingComments(member);
                        emitStart(member);
                        emitStart(member.name);
                        if (!(member.flags & 128 /* Static */)) {
                            write("p");
                        }
                        else
                            emitNode(node.name);
                        emitMemberAccessForPropertyName(member.name);
                        emitEnd(member.name);
                        write(" = ");
                        emitStart(member);
                        emitFunctionDeclaration(member);
                        emitEnd(member);
                        emitEnd(member);
                        write(";");
                        emitTrailingComments(member);
                    }
                    else if (member.kind === 127 /* GetAccessor */ || member.kind === 128 /* SetAccessor */) {
                        var accessors = getAllAccessorDeclarations(node, member);
                        if (member === accessors.firstAccessor) {
                            writeLine();
                            emitStart(member);
                            write("d(");
                            emitStart(member.name);
                            if (!(member.flags & 128 /* Static */)) {
                                write("p");
                            }
                            else
                                emitNode(node.name);
                            write(", ");
                            emitExpressionForPropertyName(member.name);
                            emitEnd(member.name);
                            increaseIndent();
                            if (accessors.getAccessor) {
                                writeLine();
                                emitLeadingComments(accessors.getAccessor);
                                emitStart(accessors.getAccessor);
                                write(",function ");
                                emitSignatureAndBody(accessors.getAccessor);
                                emitEnd(accessors.getAccessor);
                                emitTrailingComments(accessors.getAccessor);
                            }
                            else if (accessors.setAccessor) {
                                write(",undefined");
                            }
                            if (accessors.setAccessor) {
                                writeLine();
                                emitLeadingComments(accessors.setAccessor);
                                emitStart(accessors.setAccessor);
                                write(",function ");
                                emitSignatureAndBody(accessors.setAccessor);
                                emitEnd(accessors.setAccessor);
                                emitTrailingComments(accessors.setAccessor);
                            }
                            decreaseIndent();
                            writeLine();
                            write(");");
                            emitEnd(member);
                        }
                    }
                });
            }
            function emitClassDeclaration(node) {
                emitLeadingComments(node);
                write("var ");
                emit(node.name);
                write(" = (function (");
                var baseTypeNode = ts.getClassBaseTypeNode(node);
                if (baseTypeNode) {
                    write("_super");
                }
                write(") {");
                increaseIndent();
                scopeEmitStart(node);
                if (baseTypeNode) {
                    writeLine();
                    emitStart(baseTypeNode);
                    write("__extends(");
                    emit(node.name);
                    write(", _super);");
                    emitEnd(baseTypeNode);
                }
                writeLine();
                emitConstructorOfClass();
                emitMemberFunctions(node);
                emitMemberAssignments(node, 128 /* Static */);
                writeLine();
                function emitClassReturnStatement() {
                    write("return ");
                    emitNode(node.name);
                }
                emitToken(14 /* CloseBraceToken */, node.members.end, emitClassReturnStatement);
                write(";");
                decreaseIndent();
                writeLine();
                emitToken(14 /* CloseBraceToken */, node.members.end);
                scopeEmitEnd();
                emitStart(node);
                write(")(");
                if (baseTypeNode) {
                    emit(baseTypeNode.typeName);
                }
                write(");");
                emitEnd(node);
                if (node.flags & 1 /* Export */) {
                    writeLine();
                    emitStart(node);
                    emitModuleMemberName(node);
                    write(" = ");
                    emit(node.name);
                    emitEnd(node);
                    write(";");
                }
                var checker = program.getTypeChecker(true);
                var fullName = checker.getFullyQualifiedName(node.symbol);
                var interfaces = {};
                getImplementedInterfaces(node, interfaces, true);
                //lark.registerClass(DisplayObject, "lark.DisplayObject", ["lark.IEventEmitter", "lark.sys.Renderable"]);
                writeLine();
                write('egret.registerClass(');
                emit(node.name);
                write(',"' + fullName + '"');
                var interfacesArray = Object.keys(interfaces);
                if (interfacesArray.length > 0) {
                    write(',');
                    write(JSON.stringify(interfacesArray));
                }
                write(');');
                writeLine();
                emitTrailingComments(node);
                function getImplementedInterfaces(node, names, isClass) {
                    if (isClass === void 0) { isClass = true; }
                    var superInterfaces = null;
                    if (isClass)
                        superInterfaces = ts.getClassImplementedTypeNodes(node);
                    else
                        superInterfaces = ts.getInterfaceBaseTypeNodes(node);
                    if (superInterfaces) {
                        superInterfaces.forEach(function (sp) {
                            var interfaceType = checker.getTypeAtLocation(sp);
                            if (interfaceType.flags & 2048 /* Interface */) {
                                var fullname = checker.getFullyQualifiedName(interfaceType.symbol);
                                names[fullname] = true;
                                if (interfaceType.symbol.declarations) {
                                    interfaceType.symbol.declarations.forEach(function (d) { return getImplementedInterfaces(d, names, !!(interfaceType.flags & 1024 /* Class */)); });
                                }
                            }
                        });
                    }
                }
                function emitConstructorOfClass() {
                    // Emit the constructor overload pinned comments
                    ts.forEach(node.members, function (member) {
                        if (member.kind === 126 /* Constructor */ && !member.body) {
                            emitPinnedOrTripleSlashComments(member);
                        }
                    });
                    var ctor = getFirstConstructorWithBody(node);
                    if (ctor) {
                        emitLeadingComments(ctor);
                    }
                    emitStart(ctor || node);
                    write("function ");
                    emit(node.name);
                    emitSignatureParameters(ctor);
                    write(" {");
                    scopeEmitStart(node, "constructor");
                    increaseIndent();
                    if (ctor) {
                        emitDetachedComments(ctor.body.statements);
                    }
                    emitCaptureThisForNodeIfNecessary(node);
                    if (ctor) {
                        emitDefaultValueAssignments(ctor);
                        emitRestParameter(ctor);
                        if (baseTypeNode) {
                            var superCall = findInitialSuperCall(ctor);
                            if (superCall) {
                                writeLine();
                                emit(superCall);
                            }
                        }
                        emitParameterPropertyAssignments(ctor);
                    }
                    else {
                        if (baseTypeNode) {
                            writeLine();
                            emitStart(baseTypeNode);
                            write("_super.apply(this, arguments);");
                            emitEnd(baseTypeNode);
                        }
                    }
                    emitMemberAssignments(node, 0);
                    if (ctor) {
                        var statements = ctor.body.statements;
                        if (superCall)
                            statements = statements.slice(1);
                        emitLines(statements);
                    }
                    writeLine();
                    if (ctor) {
                        emitLeadingCommentsOfPosition(ctor.body.statements.end);
                    }
                    decreaseIndent();
                    emitToken(14 /* CloseBraceToken */, ctor ? ctor.body.statements.end : node.members.end);
                    scopeEmitEnd();
                    emitEnd(ctor || node);
                    if (ctor) {
                        emitTrailingComments(ctor);
                    }
                }
            }
            function emitInterfaceDeclaration(node) {
                emitPinnedOrTripleSlashComments(node);
            }
            function emitEnumDeclaration(node) {
                // const enums are completely erased during compilation.
                var isConstEnum = ts.isConst(node);
                if (isConstEnum && !compilerOptions.preserveConstEnums) {
                    return;
                }
                emitLeadingComments(node);
                if (!(node.flags & 1 /* Export */)) {
                    emitStart(node);
                    write("var ");
                    emit(node.name);
                    emitEnd(node);
                    write(";");
                }
                writeLine();
                emitStart(node);
                write("(function (");
                emitStart(node.name);
                write(resolver.getLocalNameOfContainer(node));
                emitEnd(node.name);
                write(") {");
                increaseIndent();
                scopeEmitStart(node);
                emitEnumMemberDeclarations(isConstEnum);
                decreaseIndent();
                writeLine();
                emitToken(14 /* CloseBraceToken */, node.members.end);
                scopeEmitEnd();
                write(")(");
                emitModuleMemberName(node);
                write(" || (");
                emitModuleMemberName(node);
                write(" = {}));");
                emitEnd(node);
                if (node.flags & 1 /* Export */) {
                    writeLine();
                    emitStart(node);
                    write("var ");
                    emit(node.name);
                    write(" = ");
                    emitModuleMemberName(node);
                    emitEnd(node);
                    write(";");
                }
                emitTrailingComments(node);
                function emitEnumMemberDeclarations(isConstEnum) {
                    ts.forEach(node.members, function (member) {
                        writeLine();
                        emitLeadingComments(member);
                        emitStart(member);
                        write(resolver.getLocalNameOfContainer(node));
                        write("[");
                        write(resolver.getLocalNameOfContainer(node));
                        write("[");
                        emitExpressionForPropertyName(member.name);
                        write("] = ");
                        if (member.initializer && !isConstEnum) {
                            emit(member.initializer);
                        }
                        else {
                            write(resolver.getEnumMemberValue(member).toString());
                        }
                        write("] = ");
                        emitExpressionForPropertyName(member.name);
                        emitEnd(member);
                        write(";");
                        emitTrailingComments(member);
                    });
                }
            }
            function getInnerMostModuleDeclarationFromDottedModule(moduleDeclaration) {
                if (moduleDeclaration.body.kind === 189 /* ModuleDeclaration */) {
                    var recursiveInnerModule = getInnerMostModuleDeclarationFromDottedModule(moduleDeclaration.body);
                    return recursiveInnerModule || moduleDeclaration.body;
                }
            }
            function emitModuleDeclaration(node) {
                var shouldEmit = ts.getModuleInstanceState(node) === 1 /* Instantiated */ ||
                    (ts.getModuleInstanceState(node) === 2 /* ConstEnumOnly */ && compilerOptions.preserveConstEnums);
                if (!shouldEmit) {
                    return emitPinnedOrTripleSlashComments(node);
                }
                emitLeadingComments(node);
                emitStart(node);
                write("var ");
                emit(node.name);
                write(";");
                emitEnd(node);
                writeLine();
                emitStart(node);
                write("(function (");
                emitStart(node.name);
                write(resolver.getLocalNameOfContainer(node));
                emitEnd(node.name);
                write(") ");
                if (node.body.kind === 190 /* ModuleBlock */) {
                    emit(node.body);
                }
                else {
                    write("{");
                    increaseIndent();
                    scopeEmitStart(node);
                    emitCaptureThisForNodeIfNecessary(node);
                    writeLine();
                    emit(node.body);
                    decreaseIndent();
                    writeLine();
                    var moduleBlock = getInnerMostModuleDeclarationFromDottedModule(node).body;
                    emitToken(14 /* CloseBraceToken */, moduleBlock.statements.end);
                    scopeEmitEnd();
                }
                write(")(");
                if (node.flags & 1 /* Export */) {
                    emit(node.name);
                    write(" = ");
                }
                emitModuleMemberName(node);
                write(" || (");
                emitModuleMemberName(node);
                write(" = {}));");
                emitEnd(node);
                emitTrailingComments(node);
            }
            function emitImportDeclaration(node) {
                var emitImportDeclaration = resolver.isReferencedImportDeclaration(node);
                if (!emitImportDeclaration) {
                    // preserve old compiler's behavior: emit 'var' for import declaration (even if we do not consider them referenced) when
                    // - current file is not external module
                    // - import declaration is top level and target is value imported by entity name
                    emitImportDeclaration = !ts.isExternalModule(currentSourceFile) && resolver.isTopLevelValueImportWithEntityName(node);
                }
                if (emitImportDeclaration) {
                    if (ts.isExternalModuleImportDeclaration(node) && node.parent.kind === 201 /* SourceFile */ && compilerOptions.module === 2 /* AMD */) {
                        if (node.flags & 1 /* Export */) {
                            writeLine();
                            emitLeadingComments(node);
                            emitStart(node);
                            emitModuleMemberName(node);
                            write(" = ");
                            emit(node.name);
                            write(";");
                            emitEnd(node);
                            emitTrailingComments(node);
                        }
                    }
                    else {
                        writeLine();
                        emitLeadingComments(node);
                        emitStart(node);
                        if (!(node.flags & 1 /* Export */))
                            write("var ");
                        emitModuleMemberName(node);
                        write(" = ");
                        if (ts.isInternalModuleImportDeclaration(node)) {
                            emit(node.moduleReference);
                        }
                        else {
                            var literal = ts.getExternalModuleImportDeclarationExpression(node);
                            write("require(");
                            emitStart(literal);
                            emitLiteral(literal);
                            emitEnd(literal);
                            emitToken(16 /* CloseParenToken */, literal.end);
                        }
                        write(";");
                        emitEnd(node);
                        emitTrailingComments(node);
                    }
                }
            }
            function getExternalImportDeclarations(node) {
                var result = [];
                ts.forEach(node.statements, function (statement) {
                    if (ts.isExternalModuleImportDeclaration(statement) && resolver.isReferencedImportDeclaration(statement)) {
                        result.push(statement);
                    }
                });
                return result;
            }
            function getFirstExportAssignment(sourceFile) {
                return ts.forEach(sourceFile.statements, function (node) {
                    if (node.kind === 192 /* ExportAssignment */) {
                        return node;
                    }
                });
            }
            function emitAMDModule(node, startIndex) {
                var imports = getExternalImportDeclarations(node);
                writeLine();
                write("define(");
                if (node.amdModuleName) {
                    write("\"" + node.amdModuleName + "\", ");
                }
                write("[\"require\", \"exports\"");
                ts.forEach(imports, function (imp) {
                    write(", ");
                    emitLiteral(ts.getExternalModuleImportDeclarationExpression(imp));
                });
                ts.forEach(node.amdDependencies, function (amdDependency) {
                    var text = "\"" + amdDependency + "\"";
                    write(", ");
                    write(text);
                });
                write("], function (require, exports");
                ts.forEach(imports, function (imp) {
                    write(", ");
                    emit(imp.name);
                });
                write(") {");
                increaseIndent();
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
                var exportName = resolver.getExportAssignmentName(node);
                if (exportName) {
                    writeLine();
                    var exportAssignement = getFirstExportAssignment(node);
                    emitStart(exportAssignement);
                    write("return ");
                    emitStart(exportAssignement.exportName);
                    write(exportName);
                    emitEnd(exportAssignement.exportName);
                    write(";");
                    emitEnd(exportAssignement);
                }
                decreaseIndent();
                writeLine();
                write("});");
            }
            function emitCommonJSModule(node, startIndex) {
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
                var exportName = resolver.getExportAssignmentName(node);
                if (exportName) {
                    writeLine();
                    var exportAssignement = getFirstExportAssignment(node);
                    emitStart(exportAssignement);
                    write("module.exports = ");
                    emitStart(exportAssignement.exportName);
                    write(exportName);
                    emitEnd(exportAssignement.exportName);
                    write(";");
                    emitEnd(exportAssignement);
                }
            }
            function emitDirectivePrologues(statements, startWithNewLine) {
                for (var i = 0; i < statements.length; ++i) {
                    if (ts.isPrologueDirective(statements[i])) {
                        if (startWithNewLine || i > 0) {
                            writeLine();
                        }
                        emit(statements[i]);
                    }
                    else {
                        // return index of the first non prologue directive
                        return i;
                    }
                }
                return statements.length;
            }
            function emitSourceFile(node) {
                currentSourceFile = node;
                // Start new file on new line
                writeLine();
                emitDetachedComments(node);
                // emit prologue directives prior to __extends
                var startIndex = emitDirectivePrologues(node.statements, false);
                if (!extendsEmitted && resolver.getNodeCheckFlags(node) & 8 /* EmitExtends */) {
                    writeLine();
                    write("var __extends = this.__extends || function (d, b) {");
                    increaseIndent();
                    writeLine();
                    write("for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];");
                    writeLine();
                    write("function __() { this.constructor = d; }");
                    writeLine();
                    write("__.prototype = b.prototype;");
                    writeLine();
                    write("d.prototype = new __();");
                    decreaseIndent();
                    writeLine();
                    write("};");
                    extendsEmitted = true;
                }
                if (!defineEmitted) {
                    writeLine();
                    write('var __define = this.__define || function (o, p, g, s) { \n  Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };');
                    defineEmitted = true;
                }
                if (ts.isExternalModule(node)) {
                    if (compilerOptions.module === 2 /* AMD */) {
                        emitAMDModule(node, startIndex);
                    }
                    else {
                        emitCommonJSModule(node, startIndex);
                    }
                }
                else {
                    emitCaptureThisForNodeIfNecessary(node);
                    emitLinesStartingAt(node.statements, startIndex);
                }
                emitLeadingComments(node.endOfFileToken);
            }
            function emitNode(node) {
                if (!node) {
                    return;
                }
                if (node.flags & 2 /* Ambient */) {
                    return emitPinnedOrTripleSlashComments(node);
                }
                // Check if the node can be emitted regardless of the ScriptTarget
                switch (node.kind) {
                    case 63 /* Identifier */:
                        return emitIdentifier(node);
                    case 123 /* Parameter */:
                        return emitParameter(node);
                    case 127 /* GetAccessor */:
                    case 128 /* SetAccessor */:
                        return emitAccessor(node);
                    case 91 /* ThisKeyword */:
                        return emitThis(node);
                    case 89 /* SuperKeyword */:
                        return emitSuper(node);
                    case 87 /* NullKeyword */:
                        return write("null");
                    case 93 /* TrueKeyword */:
                        return write("true");
                    case 78 /* FalseKeyword */:
                        return write("false");
                    case 6 /* NumericLiteral */:
                    case 7 /* StringLiteral */:
                    case 8 /* RegularExpressionLiteral */:
                    case 9 /* NoSubstitutionTemplateLiteral */:
                    case 10 /* TemplateHead */:
                    case 11 /* TemplateMiddle */:
                    case 12 /* TemplateTail */:
                        return emitLiteral(node);
                    case 159 /* TemplateExpression */:
                        return emitTemplateExpression(node);
                    case 162 /* TemplateSpan */:
                        return emitTemplateSpan(node);
                    case 120 /* QualifiedName */:
                        return emitQualifiedName(node);
                    case 141 /* ArrayLiteralExpression */:
                        return emitArrayLiteral(node);
                    case 142 /* ObjectLiteralExpression */:
                        return emitObjectLiteral(node);
                    case 198 /* PropertyAssignment */:
                        return emitPropertyAssignment(node);
                    case 121 /* ComputedPropertyName */:
                        return emitComputedPropertyName(node);
                    case 143 /* PropertyAccessExpression */:
                        return emitPropertyAccess(node);
                    case 144 /* ElementAccessExpression */:
                        return emitIndexedAccess(node);
                    case 145 /* CallExpression */:
                        return emitCallExpression(node);
                    case 146 /* NewExpression */:
                        return emitNewExpression(node);
                    case 147 /* TaggedTemplateExpression */:
                        return emitTaggedTemplateExpression(node);
                    case 148 /* TypeAssertionExpression */:
                        return emit(node.expression);
                    case 149 /* ParenthesizedExpression */:
                        return emitParenExpression(node);
                    case 184 /* FunctionDeclaration */:
                    case 150 /* FunctionExpression */:
                    case 151 /* ArrowFunction */:
                        return emitFunctionDeclaration(node);
                    case 152 /* DeleteExpression */:
                        return emitDeleteExpression(node);
                    case 153 /* TypeOfExpression */:
                        return emitTypeOfExpression(node);
                    case 154 /* VoidExpression */:
                        return emitVoidExpression(node);
                    case 155 /* PrefixUnaryExpression */:
                        return emitPrefixUnaryExpression(node);
                    case 156 /* PostfixUnaryExpression */:
                        return emitPostfixUnaryExpression(node);
                    case 157 /* BinaryExpression */:
                        return emitBinaryExpression(node);
                    case 158 /* ConditionalExpression */:
                        return emitConditionalExpression(node);
                    case 161 /* OmittedExpression */:
                        return;
                    case 163 /* Block */:
                    case 180 /* TryBlock */:
                    case 181 /* FinallyBlock */:
                    case 190 /* ModuleBlock */:
                        return emitBlock(node);
                    case 164 /* VariableStatement */:
                        return emitVariableStatement(node);
                    case 165 /* EmptyStatement */:
                        return write(";");
                    case 166 /* ExpressionStatement */:
                        return emitExpressionStatement(node);
                    case 167 /* IfStatement */:
                        return emitIfStatement(node);
                    case 168 /* DoStatement */:
                        return emitDoStatement(node);
                    case 169 /* WhileStatement */:
                        return emitWhileStatement(node);
                    case 170 /* ForStatement */:
                        return emitForStatement(node);
                    case 171 /* ForInStatement */:
                        return emitForInStatement(node);
                    case 172 /* ContinueStatement */:
                    case 173 /* BreakStatement */:
                        return emitBreakOrContinueStatement(node);
                    case 174 /* ReturnStatement */:
                        return emitReturnStatement(node);
                    case 175 /* WithStatement */:
                        return emitWithStatement(node);
                    case 176 /* SwitchStatement */:
                        return emitSwitchStatement(node);
                    case 194 /* CaseClause */:
                    case 195 /* DefaultClause */:
                        return emitCaseOrDefaultClause(node);
                    case 177 /* LabeledStatement */:
                        return emitLabelledStatement(node);
                    case 178 /* ThrowStatement */:
                        return emitThrowStatement(node);
                    case 179 /* TryStatement */:
                        return emitTryStatement(node);
                    case 197 /* CatchClause */:
                        return emitCatchClause(node);
                    case 182 /* DebuggerStatement */:
                        return emitDebuggerStatement(node);
                    case 183 /* VariableDeclaration */:
                        return emitVariableDeclaration(node);
                    case 185 /* ClassDeclaration */:
                        return emitClassDeclaration(node);
                    case 186 /* InterfaceDeclaration */:
                        return emitInterfaceDeclaration(node);
                    case 188 /* EnumDeclaration */:
                        return emitEnumDeclaration(node);
                    case 189 /* ModuleDeclaration */:
                        return emitModuleDeclaration(node);
                    case 191 /* ImportDeclaration */:
                        return emitImportDeclaration(node);
                    case 201 /* SourceFile */:
                        return emitSourceFile(node);
                }
                // Emit node which needs to be emitted differently depended on ScriptTarget
                if (compilerOptions.target < 2 /* ES6 */) {
                    // Emit node down-level
                    switch (node.kind) {
                        case 199 /* ShorthandPropertyAssignment */:
                            return emitDownlevelShorthandPropertyAssignment(node);
                        case 125 /* Method */:
                            return emitDownlevelMethod(node);
                    }
                }
                else {
                    // Emit node natively
                    ts.Debug.assert(compilerOptions.target >= 2 /* ES6 */, "Invalid ScriptTarget. We should emit as ES6 or above");
                    switch (node.kind) {
                        case 199 /* ShorthandPropertyAssignment */:
                            return emitShorthandPropertyAssignment(node);
                        case 125 /* Method */:
                            return emitMethod(node);
                    }
                }
            }
            function hasDetachedComments(pos) {
                return detachedCommentsInfo !== undefined && detachedCommentsInfo[detachedCommentsInfo.length - 1].nodePos === pos;
            }
            function getLeadingCommentsWithoutDetachedComments() {
                // get the leading comments from detachedPos
                var leadingComments = ts.getLeadingCommentRanges(currentSourceFile.text, detachedCommentsInfo[detachedCommentsInfo.length - 1].detachedCommentEndPos);
                if (detachedCommentsInfo.length - 1) {
                    detachedCommentsInfo.pop();
                }
                else {
                    detachedCommentsInfo = undefined;
                }
                return leadingComments;
            }
            function getLeadingCommentsToEmit(node) {
                // Emit the leading comments only if the parent's pos doesn't match because parent should take care of emitting these comments
                if (node.parent.kind === 201 /* SourceFile */ || node.pos !== node.parent.pos) {
                    var leadingComments;
                    if (hasDetachedComments(node.pos)) {
                        // get comments without detached comments
                        leadingComments = getLeadingCommentsWithoutDetachedComments();
                    }
                    else {
                        // get the leading comments from the node
                        leadingComments = ts.getLeadingCommentRangesOfNode(node, currentSourceFile);
                    }
                    return leadingComments;
                }
            }
            function emitLeadingDeclarationComments(node) {
                var leadingComments = getLeadingCommentsToEmit(node);
                emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, leadingComments);
                // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, leadingComments, true, newLine, writeComment);
            }
            function emitTrailingDeclarationComments(node) {
                // Emit the trailing comments only if the parent's end doesn't match
                if (node.parent.kind === 201 /* SourceFile */ || node.end !== node.parent.end) {
                    var trailingComments = ts.getTrailingCommentRanges(currentSourceFile.text, node.end);
                    // trailing comments are emitted at space/*trailing comment1 */space/*trailing comment*/
                    emitComments(currentSourceFile, writer, trailingComments, false, newLine, writeComment);
                }
            }
            function emitLeadingCommentsOfLocalPosition(pos) {
                var leadingComments;
                if (hasDetachedComments(pos)) {
                    // get comments without detached comments
                    leadingComments = getLeadingCommentsWithoutDetachedComments();
                }
                else {
                    // get the leading comments from the node
                    leadingComments = ts.getLeadingCommentRanges(currentSourceFile.text, pos);
                }
                emitNewLineBeforeLeadingComments(currentSourceFile, writer, { pos: pos, end: pos }, leadingComments);
                // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, leadingComments, true, newLine, writeComment);
            }
            function emitDetachedCommentsAtPosition(node) {
                var leadingComments = ts.getLeadingCommentRanges(currentSourceFile.text, node.pos);
                if (leadingComments) {
                    var detachedComments = [];
                    var lastComment;
                    ts.forEach(leadingComments, function (comment) {
                        if (lastComment) {
                            var lastCommentLine = getLineOfLocalPosition(currentSourceFile, lastComment.end);
                            var commentLine = getLineOfLocalPosition(currentSourceFile, comment.pos);
                            if (commentLine >= lastCommentLine + 2) {
                                // There was a blank line between the last comment and this comment.  This
                                // comment is not part of the copyright comments.  Return what we have so 
                                // far.
                                return detachedComments;
                            }
                        }
                        detachedComments.push(comment);
                        lastComment = comment;
                    });
                    if (detachedComments.length) {
                        // All comments look like they could have been part of the copyright header.  Make
                        // sure there is at least one blank line between it and the node.  If not, it's not
                        // a copyright header.
                        var lastCommentLine = getLineOfLocalPosition(currentSourceFile, detachedComments[detachedComments.length - 1].end);
                        var astLine = getLineOfLocalPosition(currentSourceFile, ts.skipTrivia(currentSourceFile.text, node.pos));
                        if (astLine >= lastCommentLine + 2) {
                            // Valid detachedComments
                            emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, leadingComments);
                            emitComments(currentSourceFile, writer, detachedComments, true, newLine, writeComment);
                            var currentDetachedCommentInfo = { nodePos: node.pos, detachedCommentEndPos: detachedComments[detachedComments.length - 1].end };
                            if (detachedCommentsInfo) {
                                detachedCommentsInfo.push(currentDetachedCommentInfo);
                            }
                            else {
                                detachedCommentsInfo = [currentDetachedCommentInfo];
                            }
                        }
                    }
                }
            }
            function emitPinnedOrTripleSlashCommentsOfNode(node) {
                var pinnedComments = ts.filter(getLeadingCommentsToEmit(node), isPinnedOrTripleSlashComment);
                function isPinnedOrTripleSlashComment(comment) {
                    if (currentSourceFile.text.charCodeAt(comment.pos + 1) === 42 /* asterisk */) {
                        return currentSourceFile.text.charCodeAt(comment.pos + 2) === 33 /* exclamation */;
                    }
                    else if (currentSourceFile.text.charCodeAt(comment.pos + 1) === 47 /* slash */ &&
                        comment.pos + 2 < comment.end &&
                        currentSourceFile.text.charCodeAt(comment.pos + 2) === 47 /* slash */ &&
                        currentSourceFile.text.substring(comment.pos, comment.end).match(ts.fullTripleSlashReferencePathRegEx)) {
                        return true;
                    }
                }
                emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, pinnedComments);
                // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, pinnedComments, true, newLine, writeComment);
            }
            if (compilerOptions.sourceMap) {
                initializeEmitterWithSourceMaps();
            }
            if (root) {
                emit(root);
            }
            else {
                ts.forEach(program.getSourceFiles(), function (sourceFile) {
                    if (!isExternalModuleOrDeclarationFile(sourceFile)) {
                        emit(sourceFile);
                    }
                });
            }
            writeLine();
            writeEmittedFiles(writer.getText(), compilerOptions.emitBOM);
        }
        function writeDeclarationFile(jsFilePath, sourceFile) {
            var emitDeclarationResult = emitDeclarations(program, resolver, diagnostics, jsFilePath, sourceFile);
            // TODO(shkamat): Should we not write any declaration file if any of them can produce error, 
            // or should we just not write this file like we are doing now
            if (!emitDeclarationResult.reportedDeclarationError) {
                var declarationOutput = emitDeclarationResult.referencePathsOutput;
                // apply additions
                var appliedSyncOutputPos = 0;
                ts.forEach(emitDeclarationResult.aliasDeclarationEmitInfo, function (aliasEmitInfo) {
                    if (aliasEmitInfo.asynchronousOutput) {
                        declarationOutput += emitDeclarationResult.synchronousDeclarationOutput.substring(appliedSyncOutputPos, aliasEmitInfo.outputPos);
                        declarationOutput += aliasEmitInfo.asynchronousOutput;
                        appliedSyncOutputPos = aliasEmitInfo.outputPos;
                    }
                });
                declarationOutput += emitDeclarationResult.synchronousDeclarationOutput.substring(appliedSyncOutputPos);
                writeFile(compilerHost, diagnostics, ts.removeFileExtension(jsFilePath) + ".d.ts", declarationOutput, compilerOptions.emitBOM);
            }
        }
        var hasSemanticErrors = false;
        var isEmitBlocked = false;
        if (targetSourceFile === undefined) {
            // No targetSourceFile is specified (e.g. calling emitter from batch compiler)
            hasSemanticErrors = resolver.hasSemanticErrors();
            isEmitBlocked = resolver.isEmitBlocked();
            ts.forEach(program.getSourceFiles(), function (sourceFile) {
                if (shouldEmitToOwnFile(sourceFile, compilerOptions)) {
                    var jsFilePath = getOwnEmitOutputFilePath(sourceFile, program, ".js");
                    emitFile(jsFilePath, sourceFile);
                }
            });
            if (compilerOptions.out) {
                emitFile(compilerOptions.out);
            }
        }
        else {
            // targetSourceFile is specified (e.g calling emitter from language service or calling getSemanticDiagnostic from language service)
            if (shouldEmitToOwnFile(targetSourceFile, compilerOptions)) {
                // If shouldEmitToOwnFile returns true or targetSourceFile is an external module file, then emit targetSourceFile in its own output file
                hasSemanticErrors = resolver.hasSemanticErrors(targetSourceFile);
                isEmitBlocked = resolver.isEmitBlocked(targetSourceFile);
                var jsFilePath = getOwnEmitOutputFilePath(targetSourceFile, program, ".js");
                emitFile(jsFilePath, targetSourceFile);
            }
            else if (!ts.isDeclarationFile(targetSourceFile) && compilerOptions.out) {
                // Otherwise, if --out is specified and targetSourceFile is not a declaration file,
                // Emit all, non-external-module file, into one single output file
                ts.forEach(program.getSourceFiles(), function (sourceFile) {
                    if (!shouldEmitToOwnFile(sourceFile, compilerOptions)) {
                        hasSemanticErrors = hasSemanticErrors || resolver.hasSemanticErrors(sourceFile);
                        isEmitBlocked = isEmitBlocked || resolver.isEmitBlocked(sourceFile);
                    }
                });
                emitFile(compilerOptions.out);
            }
        }
        function emitFile(jsFilePath, sourceFile) {
            if (!isEmitBlocked) {
                emitJavaScript(jsFilePath, sourceFile);
                if (!hasSemanticErrors && compilerOptions.declaration) {
                    writeDeclarationFile(jsFilePath, sourceFile);
                }
            }
        }
        // Sort and make the unique list of diagnostics
        diagnostics.sort(ts.compareDiagnostics);
        diagnostics = ts.deduplicateSortedDiagnostics(diagnostics);
        // Update returnCode if there is any EmitterError
        var hasEmitterError = ts.forEach(diagnostics, function (diagnostic) { return diagnostic.category === ts.DiagnosticCategory.Error; });
        // Check and update returnCode for syntactic and semantic
        var emitResultStatus;
        if (isEmitBlocked) {
            emitResultStatus = ts.EmitReturnStatus.AllOutputGenerationSkipped;
        }
        else if (hasEmitterError) {
            emitResultStatus = ts.EmitReturnStatus.EmitErrorsEncountered;
        }
        else if (hasSemanticErrors && compilerOptions.declaration) {
            emitResultStatus = ts.EmitReturnStatus.DeclarationGenerationSkipped;
        }
        else if (hasSemanticErrors && !compilerOptions.declaration) {
            emitResultStatus = ts.EmitReturnStatus.JSGeneratedWithSemanticErrors;
        }
        else {
            emitResultStatus = ts.EmitReturnStatus.Succeeded;
        }
        return {
            emitResultStatus: emitResultStatus,
            diagnostics: diagnostics,
            sourceMaps: sourceMapDataList
        };
    }
    ts.emitFiles = emitFiles;
})(ts || (ts = {}));
//# sourceMappingURL=emitter.js.map