/// <reference path="utilities.ts"/>
/// <reference path="scanner.ts"/>

namespace ts {
    /* @internal */ export let parseTime = 0;

    let NodeConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;
    let SourceFileConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;

    export function createNode(kind: SyntaxKind, pos?: number, end?: number): Node {
        if (kind === SyntaxKind.SourceFile) {
            return new (SourceFileConstructor || (SourceFileConstructor = objectAllocator.getSourceFileConstructor()))(kind, pos, end);
        }
        else {
            return new (NodeConstructor || (NodeConstructor = objectAllocator.getNodeConstructor()))(kind, pos, end);
        }
    }

    function visitNode<T>(cbNode: (node: Node) => T, node: Node): T {
        if (node) {
            return cbNode(node);
        }
    }

    function visitNodeArray<T>(cbNodes: (nodes: Node[]) => T, nodes: Node[]) {
        if (nodes) {
            return cbNodes(nodes);
        }
    }

    function visitEachNode<T>(cbNode: (node: Node) => T, nodes: Node[]) {
        if (nodes) {
            for (const node of nodes) {
                const result = cbNode(node);
                if (result) {
                    return result;
                }
            }
        }
    }

    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    export function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodeArray?: (nodes: Node[]) => T): T {
        if (!node) {
            return;
        }
        // The visitXXX functions could be written as local functions that close over the cbNode and cbNodeArray
        // callback parameters, but that causes a closure allocation for each invocation with noticeable effects
        // on performance.
        const visitNodes: (cb: (node: Node | Node[]) => T, nodes: Node[]) => T = cbNodeArray ? visitNodeArray : visitEachNode;
        const cbNodes = cbNodeArray || cbNode;
        switch (node.kind) {
            case SyntaxKind.QualifiedName:
                return visitNode(cbNode, (<QualifiedName>node).left) ||
                    visitNode(cbNode, (<QualifiedName>node).right);
            case SyntaxKind.TypeParameter:
                return visitNode(cbNode, (<TypeParameterDeclaration>node).name) ||
                    visitNode(cbNode, (<TypeParameterDeclaration>node).constraint) ||
                    visitNode(cbNode, (<TypeParameterDeclaration>node).expression);
            case SyntaxKind.ShorthandPropertyAssignment:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ShorthandPropertyAssignment>node).name) ||
                    visitNode(cbNode, (<ShorthandPropertyAssignment>node).questionToken) ||
                    visitNode(cbNode, (<ShorthandPropertyAssignment>node).equalsToken) ||
                    visitNode(cbNode, (<ShorthandPropertyAssignment>node).objectAssignmentInitializer);
            case SyntaxKind.Parameter:
            case SyntaxKind.PropertyDeclaration:
            case SyntaxKind.PropertySignature:
            case SyntaxKind.PropertyAssignment:
            case SyntaxKind.VariableDeclaration:
            case SyntaxKind.BindingElement:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).propertyName) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).dotDotDotToken) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).name) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).questionToken) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).type) ||
                    visitNode(cbNode, (<VariableLikeDeclaration>node).initializer);
            case SyntaxKind.FunctionType:
            case SyntaxKind.ConstructorType:
            case SyntaxKind.CallSignature:
            case SyntaxKind.ConstructSignature:
            case SyntaxKind.IndexSignature:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNodes(cbNodes, (<SignatureDeclaration>node).typeParameters) ||
                    visitNodes(cbNodes, (<SignatureDeclaration>node).parameters) ||
                    visitNode(cbNode, (<SignatureDeclaration>node).type);
            case SyntaxKind.MethodDeclaration:
            case SyntaxKind.MethodSignature:
            case SyntaxKind.Constructor:
            case SyntaxKind.GetAccessor:
            case SyntaxKind.SetAccessor:
            case SyntaxKind.FunctionExpression:
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.ArrowFunction:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<FunctionLikeDeclaration>node).asteriskToken) ||
                    visitNode(cbNode, (<FunctionLikeDeclaration>node).name) ||
                    visitNode(cbNode, (<FunctionLikeDeclaration>node).questionToken) ||
                    visitNodes(cbNodes, (<FunctionLikeDeclaration>node).typeParameters) ||
                    visitNodes(cbNodes, (<FunctionLikeDeclaration>node).parameters) ||
                    visitNode(cbNode, (<FunctionLikeDeclaration>node).type) ||
                    visitNode(cbNode, (<ArrowFunction>node).equalsGreaterThanToken) ||
                    visitNode(cbNode, (<FunctionLikeDeclaration>node).body);
            case SyntaxKind.TypeReference:
                return visitNode(cbNode, (<TypeReferenceNode>node).typeName) ||
                    visitNodes(cbNodes, (<TypeReferenceNode>node).typeArguments);
            case SyntaxKind.TypePredicate:
                return visitNode(cbNode, (<TypePredicateNode>node).parameterName) ||
                    visitNode(cbNode, (<TypePredicateNode>node).type);
            case SyntaxKind.TypeQuery:
                return visitNode(cbNode, (<TypeQueryNode>node).exprName);
            case SyntaxKind.TypeLiteral:
                return visitNodes(cbNodes, (<TypeLiteralNode>node).members);
            case SyntaxKind.ArrayType:
                return visitNode(cbNode, (<ArrayTypeNode>node).elementType);
            case SyntaxKind.TupleType:
                return visitNodes(cbNodes, (<TupleTypeNode>node).elementTypes);
            case SyntaxKind.UnionType:
            case SyntaxKind.IntersectionType:
                return visitNodes(cbNodes, (<UnionOrIntersectionTypeNode>node).types);
            case SyntaxKind.ParenthesizedType:
                return visitNode(cbNode, (<ParenthesizedTypeNode>node).type);
            case SyntaxKind.ObjectBindingPattern:
            case SyntaxKind.ArrayBindingPattern:
                return visitNodes(cbNodes, (<BindingPattern>node).elements);
            case SyntaxKind.ArrayLiteralExpression:
                return visitNodes(cbNodes, (<ArrayLiteralExpression>node).elements);
            case SyntaxKind.ObjectLiteralExpression:
                return visitNodes(cbNodes, (<ObjectLiteralExpression>node).properties);
            case SyntaxKind.PropertyAccessExpression:
                return visitNode(cbNode, (<PropertyAccessExpression>node).expression) ||
                    visitNode(cbNode, (<PropertyAccessExpression>node).dotToken) ||
                    visitNode(cbNode, (<PropertyAccessExpression>node).name);
            case SyntaxKind.ElementAccessExpression:
                return visitNode(cbNode, (<ElementAccessExpression>node).expression) ||
                    visitNode(cbNode, (<ElementAccessExpression>node).argumentExpression);
            case SyntaxKind.CallExpression:
            case SyntaxKind.NewExpression:
                return visitNode(cbNode, (<CallExpression>node).expression) ||
                    visitNodes(cbNodes, (<CallExpression>node).typeArguments) ||
                    visitNodes(cbNodes, (<CallExpression>node).arguments);
            case SyntaxKind.TaggedTemplateExpression:
                return visitNode(cbNode, (<TaggedTemplateExpression>node).tag) ||
                    visitNode(cbNode, (<TaggedTemplateExpression>node).template);
            case SyntaxKind.TypeAssertionExpression:
                return visitNode(cbNode, (<TypeAssertion>node).type) ||
                    visitNode(cbNode, (<TypeAssertion>node).expression);
            case SyntaxKind.ParenthesizedExpression:
                return visitNode(cbNode, (<ParenthesizedExpression>node).expression);
            case SyntaxKind.DeleteExpression:
                return visitNode(cbNode, (<DeleteExpression>node).expression);
            case SyntaxKind.TypeOfExpression:
                return visitNode(cbNode, (<TypeOfExpression>node).expression);
            case SyntaxKind.VoidExpression:
                return visitNode(cbNode, (<VoidExpression>node).expression);
            case SyntaxKind.PrefixUnaryExpression:
                return visitNode(cbNode, (<PrefixUnaryExpression>node).operand);
            case SyntaxKind.YieldExpression:
                return visitNode(cbNode, (<YieldExpression>node).asteriskToken) ||
                    visitNode(cbNode, (<YieldExpression>node).expression);
            case SyntaxKind.AwaitExpression:
                return visitNode(cbNode, (<AwaitExpression>node).expression);
            case SyntaxKind.PostfixUnaryExpression:
                return visitNode(cbNode, (<PostfixUnaryExpression>node).operand);
            case SyntaxKind.BinaryExpression:
                return visitNode(cbNode, (<BinaryExpression>node).left) ||
                    visitNode(cbNode, (<BinaryExpression>node).operatorToken) ||
                    visitNode(cbNode, (<BinaryExpression>node).right);
            case SyntaxKind.AsExpression:
                return visitNode(cbNode, (<AsExpression>node).expression) ||
                    visitNode(cbNode, (<AsExpression>node).type);
            case SyntaxKind.ConditionalExpression:
                return visitNode(cbNode, (<ConditionalExpression>node).condition) ||
                    visitNode(cbNode, (<ConditionalExpression>node).questionToken) ||
                    visitNode(cbNode, (<ConditionalExpression>node).whenTrue) ||
                    visitNode(cbNode, (<ConditionalExpression>node).colonToken) ||
                    visitNode(cbNode, (<ConditionalExpression>node).whenFalse);
            case SyntaxKind.SpreadElementExpression:
                return visitNode(cbNode, (<SpreadElementExpression>node).expression);
            case SyntaxKind.Block:
            case SyntaxKind.ModuleBlock:
                return visitNodes(cbNodes, (<Block>node).statements);
            case SyntaxKind.SourceFile:
                return visitNodes(cbNodes, (<SourceFile>node).statements) ||
                    visitNode(cbNode, (<SourceFile>node).endOfFileToken);
            case SyntaxKind.VariableStatement:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<VariableStatement>node).declarationList);
            case SyntaxKind.VariableDeclarationList:
                return visitNodes(cbNodes, (<VariableDeclarationList>node).declarations);
            case SyntaxKind.ExpressionStatement:
                return visitNode(cbNode, (<ExpressionStatement>node).expression);
            case SyntaxKind.IfStatement:
                return visitNode(cbNode, (<IfStatement>node).expression) ||
                    visitNode(cbNode, (<IfStatement>node).thenStatement) ||
                    visitNode(cbNode, (<IfStatement>node).elseStatement);
            case SyntaxKind.DoStatement:
                return visitNode(cbNode, (<DoStatement>node).statement) ||
                    visitNode(cbNode, (<DoStatement>node).expression);
            case SyntaxKind.WhileStatement:
                return visitNode(cbNode, (<WhileStatement>node).expression) ||
                    visitNode(cbNode, (<WhileStatement>node).statement);
            case SyntaxKind.ForStatement:
                return visitNode(cbNode, (<ForStatement>node).initializer) ||
                    visitNode(cbNode, (<ForStatement>node).condition) ||
                    visitNode(cbNode, (<ForStatement>node).incrementor) ||
                    visitNode(cbNode, (<ForStatement>node).statement);
            case SyntaxKind.ForInStatement:
                return visitNode(cbNode, (<ForInStatement>node).initializer) ||
                    visitNode(cbNode, (<ForInStatement>node).expression) ||
                    visitNode(cbNode, (<ForInStatement>node).statement);
            case SyntaxKind.ForOfStatement:
                return visitNode(cbNode, (<ForOfStatement>node).initializer) ||
                    visitNode(cbNode, (<ForOfStatement>node).expression) ||
                    visitNode(cbNode, (<ForOfStatement>node).statement);
            case SyntaxKind.ContinueStatement:
            case SyntaxKind.BreakStatement:
                return visitNode(cbNode, (<BreakOrContinueStatement>node).label);
            case SyntaxKind.ReturnStatement:
                return visitNode(cbNode, (<ReturnStatement>node).expression);
            case SyntaxKind.WithStatement:
                return visitNode(cbNode, (<WithStatement>node).expression) ||
                    visitNode(cbNode, (<WithStatement>node).statement);
            case SyntaxKind.SwitchStatement:
                return visitNode(cbNode, (<SwitchStatement>node).expression) ||
                    visitNode(cbNode, (<SwitchStatement>node).caseBlock);
            case SyntaxKind.CaseBlock:
                return visitNodes(cbNodes, (<CaseBlock>node).clauses);
            case SyntaxKind.CaseClause:
                return visitNode(cbNode, (<CaseClause>node).expression) ||
                    visitNodes(cbNodes, (<CaseClause>node).statements);
            case SyntaxKind.DefaultClause:
                return visitNodes(cbNodes, (<DefaultClause>node).statements);
            case SyntaxKind.LabeledStatement:
                return visitNode(cbNode, (<LabeledStatement>node).label) ||
                    visitNode(cbNode, (<LabeledStatement>node).statement);
            case SyntaxKind.ThrowStatement:
                return visitNode(cbNode, (<ThrowStatement>node).expression);
            case SyntaxKind.TryStatement:
                return visitNode(cbNode, (<TryStatement>node).tryBlock) ||
                    visitNode(cbNode, (<TryStatement>node).catchClause) ||
                    visitNode(cbNode, (<TryStatement>node).finallyBlock);
            case SyntaxKind.CatchClause:
                return visitNode(cbNode, (<CatchClause>node).variableDeclaration) ||
                    visitNode(cbNode, (<CatchClause>node).block);
            case SyntaxKind.Decorator:
                return visitNode(cbNode, (<Decorator>node).expression);
            case SyntaxKind.ClassDeclaration:
            case SyntaxKind.ClassExpression:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ClassLikeDeclaration>node).name) ||
                    visitNodes(cbNodes, (<ClassLikeDeclaration>node).typeParameters) ||
                    visitNodes(cbNodes, (<ClassLikeDeclaration>node).heritageClauses) ||
                    visitNodes(cbNodes, (<ClassLikeDeclaration>node).members);
            case SyntaxKind.InterfaceDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<InterfaceDeclaration>node).name) ||
                    visitNodes(cbNodes, (<InterfaceDeclaration>node).typeParameters) ||
                    visitNodes(cbNodes, (<ClassDeclaration>node).heritageClauses) ||
                    visitNodes(cbNodes, (<InterfaceDeclaration>node).members);
            case SyntaxKind.TypeAliasDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<TypeAliasDeclaration>node).name) ||
                    visitNodes(cbNodes, (<TypeAliasDeclaration>node).typeParameters) ||
                    visitNode(cbNode, (<TypeAliasDeclaration>node).type);
            case SyntaxKind.EnumDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<EnumDeclaration>node).name) ||
                    visitNodes(cbNodes, (<EnumDeclaration>node).members);
            case SyntaxKind.EnumMember:
                return visitNode(cbNode, (<EnumMember>node).name) ||
                    visitNode(cbNode, (<EnumMember>node).initializer);
            case SyntaxKind.ModuleDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ModuleDeclaration>node).name) ||
                    visitNode(cbNode, (<ModuleDeclaration>node).body);
            case SyntaxKind.ImportEqualsDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ImportEqualsDeclaration>node).name) ||
                    visitNode(cbNode, (<ImportEqualsDeclaration>node).moduleReference);
            case SyntaxKind.ImportDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ImportDeclaration>node).importClause) ||
                    visitNode(cbNode, (<ImportDeclaration>node).moduleSpecifier);
            case SyntaxKind.ImportClause:
                return visitNode(cbNode, (<ImportClause>node).name) ||
                    visitNode(cbNode, (<ImportClause>node).namedBindings);
            case SyntaxKind.NamespaceImport:
                return visitNode(cbNode, (<NamespaceImport>node).name);
            case SyntaxKind.NamedImports:
            case SyntaxKind.NamedExports:
                return visitNodes(cbNodes, (<NamedImportsOrExports>node).elements);
            case SyntaxKind.ExportDeclaration:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ExportDeclaration>node).exportClause) ||
                    visitNode(cbNode, (<ExportDeclaration>node).moduleSpecifier);
            case SyntaxKind.ImportSpecifier:
            case SyntaxKind.ExportSpecifier:
                return visitNode(cbNode, (<ImportOrExportSpecifier>node).propertyName) ||
                    visitNode(cbNode, (<ImportOrExportSpecifier>node).name);
            case SyntaxKind.ExportAssignment:
                return visitNodes(cbNodes, node.decorators) ||
                    visitNodes(cbNodes, node.modifiers) ||
                    visitNode(cbNode, (<ExportAssignment>node).expression);
            case SyntaxKind.TemplateExpression:
                return visitNode(cbNode, (<TemplateExpression>node).head) || visitNodes(cbNodes, (<TemplateExpression>node).templateSpans);
            case SyntaxKind.TemplateSpan:
                return visitNode(cbNode, (<TemplateSpan>node).expression) || visitNode(cbNode, (<TemplateSpan>node).literal);
            case SyntaxKind.ComputedPropertyName:
                return visitNode(cbNode, (<ComputedPropertyName>node).expression);
            case SyntaxKind.HeritageClause:
                return visitNodes(cbNodes, (<HeritageClause>node).types);
            case SyntaxKind.ExpressionWithTypeArguments:
                return visitNode(cbNode, (<ExpressionWithTypeArguments>node).expression) ||
                    visitNodes(cbNodes, (<ExpressionWithTypeArguments>node).typeArguments);
            case SyntaxKind.ExternalModuleReference:
                return visitNode(cbNode, (<ExternalModuleReference>node).expression);
            case SyntaxKind.MissingDeclaration:
                return visitNodes(cbNodes, node.decorators);

            case SyntaxKind.JsxElement:
                return visitNode(cbNode, (<JsxElement>node).openingElement) ||
                    visitNodes(cbNodes, (<JsxElement>node).children) ||
                    visitNode(cbNode, (<JsxElement>node).closingElement);
            case SyntaxKind.JsxSelfClosingElement:
            case SyntaxKind.JsxOpeningElement:
                return visitNode(cbNode, (<JsxOpeningLikeElement>node).tagName) ||
                    visitNodes(cbNodes, (<JsxOpeningLikeElement>node).attributes);
            case SyntaxKind.JsxAttribute:
                return visitNode(cbNode, (<JsxAttribute>node).name) ||
                    visitNode(cbNode, (<JsxAttribute>node).initializer);
            case SyntaxKind.JsxSpreadAttribute:
                return visitNode(cbNode, (<JsxSpreadAttribute>node).expression);
            case SyntaxKind.JsxExpression:
                return visitNode(cbNode, (<JsxExpression>node).expression);
            case SyntaxKind.JsxClosingElement:
                return visitNode(cbNode, (<JsxClosingElement>node).tagName);

            case SyntaxKind.JSDocTypeExpression:
                return visitNode(cbNode, (<JSDocTypeExpression>node).type);
            case SyntaxKind.JSDocUnionType:
                return visitNodes(cbNodes, (<JSDocUnionType>node).types);
            case SyntaxKind.JSDocTupleType:
                return visitNodes(cbNodes, (<JSDocTupleType>node).types);
            case SyntaxKind.JSDocArrayType:
                return visitNode(cbNode, (<JSDocArrayType>node).elementType);
            case SyntaxKind.JSDocNonNullableType:
                return visitNode(cbNode, (<JSDocNonNullableType>node).type);
            case SyntaxKind.JSDocNullableType:
                return visitNode(cbNode, (<JSDocNullableType>node).type);
            case SyntaxKind.JSDocRecordType:
                return visitNodes(cbNodes, (<JSDocRecordType>node).members);
            case SyntaxKind.JSDocTypeReference:
                return visitNode(cbNode, (<JSDocTypeReference>node).name) ||
                    visitNodes(cbNodes, (<JSDocTypeReference>node).typeArguments);
            case SyntaxKind.JSDocOptionalType:
                return visitNode(cbNode, (<JSDocOptionalType>node).type);
            case SyntaxKind.JSDocFunctionType:
                return visitNodes(cbNodes, (<JSDocFunctionType>node).parameters) ||
                    visitNode(cbNode, (<JSDocFunctionType>node).type);
            case SyntaxKind.JSDocVariadicType:
                return visitNode(cbNode, (<JSDocVariadicType>node).type);
            case SyntaxKind.JSDocConstructorType:
                return visitNode(cbNode, (<JSDocConstructorType>node).type);
            case SyntaxKind.JSDocThisType:
                return visitNode(cbNode, (<JSDocThisType>node).type);
            case SyntaxKind.JSDocRecordMember:
                return visitNode(cbNode, (<JSDocRecordMember>node).name) ||
                    visitNode(cbNode, (<JSDocRecordMember>node).type);
            case SyntaxKind.JSDocComment:
                return visitNodes(cbNodes, (<JSDocComment>node).tags);
            case SyntaxKind.JSDocParameterTag:
                return visitNode(cbNode, (<JSDocParameterTag>node).preParameterName) ||
                    visitNode(cbNode, (<JSDocParameterTag>node).typeExpression) ||
                    visitNode(cbNode, (<JSDocParameterTag>node).postParameterName);
            case SyntaxKind.JSDocReturnTag:
                return visitNode(cbNode, (<JSDocReturnTag>node).typeExpression);
            case SyntaxKind.JSDocTypeTag:
                return visitNode(cbNode, (<JSDocTypeTag>node).typeExpression);
            case SyntaxKind.JSDocTemplateTag:
                return visitNodes(cbNodes, (<JSDocTemplateTag>node).typeParameters);
        }
    }

    export function createSourceFile(fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes = false): SourceFile {
        const start = new Date().getTime();
        const result = Parser.parseSourceFile(fileName, sourceText, languageVersion, /*syntaxCursor*/ undefined, setParentNodes);

        parseTime += new Date().getTime() - start;
        return result;
    }

    // Produces a new SourceFile for the 'newText' provided. The 'textChangeRange' parameter
    // indicates what changed between the 'text' that this SourceFile has and the 'newText'.
    // The SourceFile will be created with the compiler attempting to reuse as many nodes from
    // this file as possible.
    //
    // Note: this function mutates nodes from this SourceFile. That means any existing nodes
    // from this SourceFile that are being held onto may change as a result (including
    // becoming detached from any SourceFile).  It is recommended that this SourceFile not
    // be used once 'update' is called on it.
    export function updateSourceFile(sourceFile: SourceFile, newText: string, textChangeRange: TextChangeRange, aggressiveChecks?: boolean): SourceFile {
        return IncrementalParser.updateSourceFile(sourceFile, newText, textChangeRange, aggressiveChecks);
    }

    /* @internal */
    export function parseIsolatedJSDocComment(content: string, start?: number, length?: number) {
        return Parser.JSDocParser.parseIsolatedJSDocComment(content, start, length);
    }

    /* @internal */
    // Exposed only for testing.
    export function parseJSDocTypeExpressionForTests(content: string, start?: number, length?: number) {
        return Parser.JSDocParser.parseJSDocTypeExpressionForTests(content, start, length);
    }

    // Implement the parser as a singleton module.  We do this for perf reasons because creating
    // parser instances can actually be expensive enough to impact us on projects with many source
    // files.
    namespace Parser {
        // Share a single scanner across all calls to parse a source file.  This helps speed things
        // up by avoiding the cost of creating/compiling scanners over and over again.
        const scanner = createScanner(ScriptTarget.Latest, /*skipTrivia*/ true);
        const disallowInAndDecoratorContext = ParserContextFlags.DisallowIn | ParserContextFlags.Decorator;

        // capture constructors in 'initializeState' to avoid null checks
        let NodeConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;
        let SourceFileConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;

        let sourceFile: SourceFile;
        let parseDiagnostics: Diagnostic[];
        let syntaxCursor: IncrementalParser.SyntaxCursor;

        let token: SyntaxKind;
        let sourceText: string;
        let nodeCount: number;
        let identifiers: Map<string>;
        let identifierCount: number;

        let parsingContext: ParsingContext;

        // Flags that dictate what parsing context we're in.  For example:
        // Whether or not we are in strict parsing mode.  All that changes in strict parsing mode is
        // that some tokens that would be considered identifiers may be considered keywords.
        //
        // When adding more parser context flags, consider which is the more common case that the
        // flag will be in.  This should be the 'false' state for that flag.  The reason for this is
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
        // you parse a sub-production, it will have the same context values as the parent production.
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
        let contextFlags: ParserContextFlags;

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
        let parseErrorBeforeNextFinishedNode = false;

        export function parseSourceFile(fileName: string, _sourceText: string, languageVersion: ScriptTarget, _syntaxCursor: IncrementalParser.SyntaxCursor, setParentNodes?: boolean): SourceFile {
            const isJavaScriptFile = hasJavaScriptFileExtension(fileName) || _sourceText.lastIndexOf("// @language=javascript", 0) === 0;
            initializeState(fileName, _sourceText, languageVersion, isJavaScriptFile, _syntaxCursor);

            const result = parseSourceFileWorker(fileName, languageVersion, setParentNodes);

            clearState();

            return result;
        }

        function getLanguageVariant(fileName: string) {
            // .tsx and .jsx files are treated as jsx language variant.
            return fileExtensionIs(fileName, ".tsx") || fileExtensionIs(fileName, ".jsx") || fileExtensionIs(fileName, ".js") ?  LanguageVariant.JSX  : LanguageVariant.Standard;
        }

        function initializeState(fileName: string, _sourceText: string, languageVersion: ScriptTarget, isJavaScriptFile: boolean, _syntaxCursor: IncrementalParser.SyntaxCursor) {
            NodeConstructor = objectAllocator.getNodeConstructor();
            SourceFileConstructor = objectAllocator.getSourceFileConstructor();

            sourceText = _sourceText;
            syntaxCursor = _syntaxCursor;

            parseDiagnostics = [];
            parsingContext = 0;
            identifiers = {};
            identifierCount = 0;
            nodeCount = 0;

            contextFlags = isJavaScriptFile ? ParserContextFlags.JavaScriptFile : ParserContextFlags.None;
            parseErrorBeforeNextFinishedNode = false;

            // Initialize and prime the scanner before parsing the source elements.
            scanner.setText(sourceText);
            scanner.setOnError(scanError);
            scanner.setScriptTarget(languageVersion);
            scanner.setLanguageVariant(getLanguageVariant(fileName));
        }

        function clearState() {
            // Clear out the text the scanner is pointing at, so it doesn't keep anything alive unnecessarily.
            scanner.setText("");
            scanner.setOnError(undefined);

            // Clear any data.  We don't want to accidently hold onto it for too long.
            parseDiagnostics = undefined;
            sourceFile = undefined;
            identifiers = undefined;
            syntaxCursor = undefined;
            sourceText = undefined;
        }

        function parseSourceFileWorker(fileName: string, languageVersion: ScriptTarget, setParentNodes: boolean): SourceFile {
            sourceFile = createSourceFile(fileName, languageVersion);

            if (contextFlags & ParserContextFlags.JavaScriptFile) {
                sourceFile.parserContextFlags = ParserContextFlags.JavaScriptFile;
            }

            // Prime the scanner.
            token = nextToken();
            processReferenceComments(sourceFile);

            sourceFile.statements = parseList(ParsingContext.SourceElements, parseStatement);
            Debug.assert(token === SyntaxKind.EndOfFileToken);
            sourceFile.endOfFileToken = parseTokenNode();

            setExternalModuleIndicator(sourceFile);

            sourceFile.nodeCount = nodeCount;
            sourceFile.identifierCount = identifierCount;
            sourceFile.identifiers = identifiers;
            sourceFile.parseDiagnostics = parseDiagnostics;

            if (setParentNodes) {
                fixupParentReferences(sourceFile);
            }

            return sourceFile;
        }


        function addJSDocComment<T extends Node>(node: T): T {
            if (contextFlags & ParserContextFlags.JavaScriptFile) {
                const comments = getLeadingCommentRangesOfNode(node, sourceFile);
                if (comments) {
                    for (const comment of comments) {
                        const jsDocComment = JSDocParser.parseJSDocComment(node, comment.pos, comment.end - comment.pos);
                        if (jsDocComment) {
                            node.jsDocComment = jsDocComment;
                        }
                    }
                }
            }

            return node;
        }

        export function fixupParentReferences(sourceFile: Node) {
            // normally parent references are set during binding. However, for clients that only need
            // a syntax tree, and no semantic features, then the binding process is an unnecessary
            // overhead.  This functions allows us to set all the parents, without all the expense of
            // binding.

            let parent: Node = sourceFile;
            forEachChild(sourceFile, visitNode);
            return;

            function visitNode(n: Node): void {
                // walk down setting parents that differ from the parent we think it should be.  This
                // allows us to quickly bail out of setting parents for subtrees during incremental
                // parsing
                if (n.parent !== parent) {
                    n.parent = parent;

                    const saveParent = parent;
                    parent = n;
                    forEachChild(n, visitNode);
                    parent = saveParent;
                }
            }
        }

        function createSourceFile(fileName: string, languageVersion: ScriptTarget): SourceFile {
            // code from createNode is inlined here so createNode won't have to deal with special case of creating source files
            // this is quite rare comparing to other nodes and createNode should be as fast as possible
            const sourceFile = <SourceFile>new SourceFileConstructor(SyntaxKind.SourceFile, /*pos*/ 0, /* end */ sourceText.length);
            nodeCount++;

            sourceFile.text = sourceText;
            sourceFile.bindDiagnostics = [];
            sourceFile.languageVersion = languageVersion;
            sourceFile.fileName = normalizePath(fileName);
            sourceFile.flags = fileExtensionIs(sourceFile.fileName, ".d.ts") ? NodeFlags.DeclarationFile : 0;
            sourceFile.languageVariant = getLanguageVariant(sourceFile.fileName);

            return sourceFile;
        }

        function setContextFlag(val: boolean, flag: ParserContextFlags) {
            if (val) {
                contextFlags |= flag;
            }
            else {
                contextFlags &= ~flag;
            }
        }

        function setDisallowInContext(val: boolean) {
            setContextFlag(val, ParserContextFlags.DisallowIn);
        }

        function setYieldContext(val: boolean) {
            setContextFlag(val, ParserContextFlags.Yield);
        }

        function setDecoratorContext(val: boolean) {
            setContextFlag(val, ParserContextFlags.Decorator);
        }

        function setAwaitContext(val: boolean) {
            setContextFlag(val, ParserContextFlags.Await);
        }

        function doOutsideOfContext<T>(context: ParserContextFlags, func: () => T): T {
            // contextFlagsToClear will contain only the context flags that are
            // currently set that we need to temporarily clear
            // We don't just blindly reset to the previous flags to ensure
            // that we do not mutate cached flags for the incremental
            // parser (ThisNodeHasError, ThisNodeOrAnySubNodesHasError, and
            // HasAggregatedChildData).
            const contextFlagsToClear = context & contextFlags;
            if (contextFlagsToClear) {
                // clear the requested context flags
                setContextFlag(/*val*/ false, contextFlagsToClear);
                const result = func();
                // restore the context flags we just cleared
                setContextFlag(/*val*/ true, contextFlagsToClear);
                return result;
            }

            // no need to do anything special as we are not in any of the requested contexts
            return func();
        }

        function doInsideOfContext<T>(context: ParserContextFlags, func: () => T): T {
            // contextFlagsToSet will contain only the context flags that
            // are not currently set that we need to temporarily enable.
            // We don't just blindly reset to the previous flags to ensure
            // that we do not mutate cached flags for the incremental
            // parser (ThisNodeHasError, ThisNodeOrAnySubNodesHasError, and
            // HasAggregatedChildData).
            const contextFlagsToSet = context & ~contextFlags;
            if (contextFlagsToSet) {
                // set the requested context flags
                setContextFlag(/*val*/ true, contextFlagsToSet);
                const result = func();
                // reset the context flags we just set
                setContextFlag(/*val*/ false, contextFlagsToSet);
                return result;
            }

            // no need to do anything special as we are already in all of the requested contexts
            return func();
        }

        function allowInAnd<T>(func: () => T): T {
            return doOutsideOfContext(ParserContextFlags.DisallowIn, func);
        }

        function disallowInAnd<T>(func: () => T): T {
            return doInsideOfContext(ParserContextFlags.DisallowIn, func);
        }

        function doInYieldContext<T>(func: () => T): T {
            return doInsideOfContext(ParserContextFlags.Yield, func);
        }

        function doInDecoratorContext<T>(func: () => T): T {
            return doInsideOfContext(ParserContextFlags.Decorator, func);
        }

        function doInAwaitContext<T>(func: () => T): T {
            return doInsideOfContext(ParserContextFlags.Await, func);
        }

        function doOutsideOfAwaitContext<T>(func: () => T): T {
            return doOutsideOfContext(ParserContextFlags.Await, func);
        }

        function doInYieldAndAwaitContext<T>(func: () => T): T {
            return doInsideOfContext(ParserContextFlags.Yield | ParserContextFlags.Await, func);
        }

        function inContext(flags: ParserContextFlags) {
            return (contextFlags & flags) !== 0;
        }

        function inYieldContext() {
            return inContext(ParserContextFlags.Yield);
        }

        function inDisallowInContext() {
            return inContext(ParserContextFlags.DisallowIn);
        }

        function inDecoratorContext() {
            return inContext(ParserContextFlags.Decorator);
        }

        function inAwaitContext() {
            return inContext(ParserContextFlags.Await);
        }

        function parseErrorAtCurrentToken(message: DiagnosticMessage, arg0?: any): void {
            const start = scanner.getTokenPos();
            const length = scanner.getTextPos() - start;

            parseErrorAtPosition(start, length, message, arg0);
        }

        function parseErrorAtPosition(start: number, length: number, message: DiagnosticMessage, arg0?: any): void {
            // Don't report another error if it would just be at the same position as the last error.
            const lastError = lastOrUndefined(parseDiagnostics);
            if (!lastError || start !== lastError.start) {
                parseDiagnostics.push(createFileDiagnostic(sourceFile, start, length, message, arg0));
            }

            // Mark that we've encountered an error.  We'll set an appropriate bit on the next
            // node we finish so that it can't be reused incrementally.
            parseErrorBeforeNextFinishedNode = true;
        }

        function scanError(message: DiagnosticMessage, length?: number) {
            const pos = scanner.getTextPos();
            parseErrorAtPosition(pos, length || 0, message);
        }

        function getNodePos(): number {
            return scanner.getStartPos();
        }

        function getNodeEnd(): number {
            return scanner.getStartPos();
        }

        function nextToken(): SyntaxKind {
            return token = scanner.scan();
        }

        function reScanGreaterToken(): SyntaxKind {
            return token = scanner.reScanGreaterToken();
        }

        function reScanSlashToken(): SyntaxKind {
            return token = scanner.reScanSlashToken();
        }

        function reScanTemplateToken(): SyntaxKind {
            return token = scanner.reScanTemplateToken();
        }

        function scanJsxIdentifier(): SyntaxKind {
            return token = scanner.scanJsxIdentifier();
        }

        function scanJsxText(): SyntaxKind {
            return token = scanner.scanJsxToken();
        }

        function speculationHelper<T>(callback: () => T, isLookAhead: boolean): T {
            // Keep track of the state we'll need to rollback to if lookahead fails (or if the
            // caller asked us to always reset our state).
            const saveToken = token;
            const saveParseDiagnosticsLength = parseDiagnostics.length;
            const saveParseErrorBeforeNextFinishedNode = parseErrorBeforeNextFinishedNode;

            // Note: it is not actually necessary to save/restore the context flags here.  That's
            // because the saving/restoring of these flags happens naturally through the recursive
            // descent nature of our parser.  However, we still store this here just so we can
            // assert that that invariant holds.
            const saveContextFlags = contextFlags;

            // If we're only looking ahead, then tell the scanner to only lookahead as well.
            // Otherwise, if we're actually speculatively parsing, then tell the scanner to do the
            // same.
            const result = isLookAhead
                ? scanner.lookAhead(callback)
                : scanner.tryScan(callback);

            Debug.assert(saveContextFlags === contextFlags);

            // If our callback returned something 'falsy' or we're just looking ahead,
            // then unconditionally restore us to where we were.
            if (!result || isLookAhead) {
                token = saveToken;
                parseDiagnostics.length = saveParseDiagnosticsLength;
                parseErrorBeforeNextFinishedNode = saveParseErrorBeforeNextFinishedNode;
            }

            return result;
        }

        /** Invokes the provided callback then unconditionally restores the parser to the state it
         * was in immediately prior to invoking the callback.  The result of invoking the callback
         * is returned from this function. 
         */
        function lookAhead<T>(callback: () => T): T {
            return speculationHelper(callback, /*isLookAhead*/ true);
        }

        /** Invokes the provided callback.  If the callback returns something falsy, then it restores
         * the parser to the state it was in immediately prior to invoking the callback.  If the
         * callback returns something truthy, then the parser state is not rolled back.  The result
         * of invoking the callback is returned from this function.
         */
        function tryParse<T>(callback: () => T): T {
            return speculationHelper(callback, /*isLookAhead*/ false);
        }

        // Ignore strict mode flag because we will report an error in type checker instead.
        function isIdentifier(): boolean {
            if (token === SyntaxKind.Identifier) {
                return true;
            }

            // If we have a 'yield' keyword, and we're in the [yield] context, then 'yield' is
            // considered a keyword and is not an identifier.
            if (token === SyntaxKind.YieldKeyword && inYieldContext()) {
                return false;
            }

            // If we have a 'await' keyword, and we're in the [Await] context, then 'await' is
            // considered a keyword and is not an identifier.
            if (token === SyntaxKind.AwaitKeyword && inAwaitContext()) {
                return false;
            }

            return token > SyntaxKind.LastReservedWord;
        }

        function parseExpected(kind: SyntaxKind, diagnosticMessage?: DiagnosticMessage, shouldAdvance = true): boolean {
            if (token === kind) {
                if (shouldAdvance) {
                    nextToken();
                }
                return true;
            }

            // Report specific message if provided with one.  Otherwise, report generic fallback message.
            if (diagnosticMessage) {
                parseErrorAtCurrentToken(diagnosticMessage);
            }
            else {
                parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(kind));
            }
            return false;
        }

        function parseOptional(t: SyntaxKind): boolean {
            if (token === t) {
                nextToken();
                return true;
            }
            return false;
        }

        function parseOptionalToken(t: SyntaxKind): Node {
            if (token === t) {
                return parseTokenNode();
            }
            return undefined;
        }

        function parseExpectedToken(t: SyntaxKind, reportAtCurrentPosition: boolean, diagnosticMessage: DiagnosticMessage, arg0?: any): Node {
            return parseOptionalToken(t) ||
                createMissingNode(t, reportAtCurrentPosition, diagnosticMessage, arg0);
        }

        function parseTokenNode<T extends Node>(): T {
            const node = <T>createNode(token);
            nextToken();
            return finishNode(node);
        }

        function canParseSemicolon() {
            // If there's a real semicolon, then we can always parse it out.
            if (token === SyntaxKind.SemicolonToken) {
                return true;
            }

            // We can parse out an optional semicolon in ASI cases in the following cases.
            return token === SyntaxKind.CloseBraceToken || token === SyntaxKind.EndOfFileToken || scanner.hasPrecedingLineBreak();
        }

        function parseSemicolon(): boolean {
            if (canParseSemicolon()) {
                if (token === SyntaxKind.SemicolonToken) {
                    // consume the semicolon if it was explicitly provided.
                    nextToken();
                }

                return true;
            }
            else {
                return parseExpected(SyntaxKind.SemicolonToken);
            }
        }

        // note: this function creates only node
        function createNode(kind: SyntaxKind, pos?: number): Node {
            nodeCount++;
            if (!(pos >= 0)) {
                pos = scanner.getStartPos();
            }

            return new NodeConstructor(kind, pos, pos);
        }

        function finishNode<T extends Node>(node: T, end?: number): T {
            node.end = end === undefined ? scanner.getStartPos() : end;

            if (contextFlags) {
                node.parserContextFlags = contextFlags;
            }

            // Keep track on the node if we encountered an error while parsing it.  If we did, then
            // we cannot reuse the node incrementally.  Once we've marked this node, clear out the
            // flag so that we don't mark any subsequent nodes.
            if (parseErrorBeforeNextFinishedNode) {
                parseErrorBeforeNextFinishedNode = false;
                node.parserContextFlags |= ParserContextFlags.ThisNodeHasError;
            }

            return node;
        }

        function createMissingNode(kind: SyntaxKind, reportAtCurrentPosition: boolean, diagnosticMessage: DiagnosticMessage, arg0?: any): Node {
            if (reportAtCurrentPosition) {
                parseErrorAtPosition(scanner.getStartPos(), 0, diagnosticMessage, arg0);
            }
            else {
                parseErrorAtCurrentToken(diagnosticMessage, arg0);
            }

            const result = createNode(kind, scanner.getStartPos());
            (<Identifier>result).text = "";
            return finishNode(result);
        }

        function internIdentifier(text: string): string {
            text = escapeIdentifier(text);
            return hasProperty(identifiers, text) ? identifiers[text] : (identifiers[text] = text);
        }

        // An identifier that starts with two underscores has an extra underscore character prepended to it to avoid issues
        // with magic property names like '__proto__'. The 'identifiers' object is used to share a single string instance for
        // each identifier in order to reduce memory consumption.
        function createIdentifier(isIdentifier: boolean, diagnosticMessage?: DiagnosticMessage): Identifier {
            identifierCount++;
            if (isIdentifier) {
                const node = <Identifier>createNode(SyntaxKind.Identifier);

                // Store original token kind if it is not just an Identifier so we can report appropriate error later in type checker
                if (token !== SyntaxKind.Identifier) {
                    node.originalKeywordKind = token;
                }
                node.text = internIdentifier(scanner.getTokenValue());
                nextToken();
                return finishNode(node);
            }

            return <Identifier>createMissingNode(SyntaxKind.Identifier, /*reportAtCurrentPosition*/ false, diagnosticMessage || Diagnostics.Identifier_expected);
        }

        function parseIdentifier(diagnosticMessage?: DiagnosticMessage): Identifier {
            return createIdentifier(isIdentifier(), diagnosticMessage);
        }

        function parseIdentifierName(): Identifier {
            return createIdentifier(tokenIsIdentifierOrKeyword(token));
        }

        function isLiteralPropertyName(): boolean {
            return tokenIsIdentifierOrKeyword(token) ||
                token === SyntaxKind.StringLiteral ||
                token === SyntaxKind.NumericLiteral;
        }

        function parsePropertyNameWorker(allowComputedPropertyNames: boolean): PropertyName {
            if (token === SyntaxKind.StringLiteral || token === SyntaxKind.NumericLiteral) {
                return parseLiteralNode(/*internName*/ true);
            }
            if (allowComputedPropertyNames && token === SyntaxKind.OpenBracketToken) {
                return parseComputedPropertyName();
            }
            return parseIdentifierName();
        }

        function parsePropertyName(): PropertyName {
            return parsePropertyNameWorker(/*allowComputedPropertyNames*/ true);
        }

        function parseSimplePropertyName(): Identifier | LiteralExpression {
            return <Identifier | LiteralExpression>parsePropertyNameWorker(/*allowComputedPropertyNames*/ false);
        }

        function isSimplePropertyName() {
            return token === SyntaxKind.StringLiteral || token === SyntaxKind.NumericLiteral || tokenIsIdentifierOrKeyword(token);
        }

        function parseComputedPropertyName(): ComputedPropertyName {
            // PropertyName [Yield]:
            //      LiteralPropertyName
            //      ComputedPropertyName[?Yield]
            const node = <ComputedPropertyName>createNode(SyntaxKind.ComputedPropertyName);
            parseExpected(SyntaxKind.OpenBracketToken);

            // We parse any expression (including a comma expression). But the grammar
            // says that only an assignment expression is allowed, so the grammar checker
            // will error if it sees a comma expression.
            node.expression = allowInAnd(parseExpression);

            parseExpected(SyntaxKind.CloseBracketToken);
            return finishNode(node);
        }

        function parseContextualModifier(t: SyntaxKind): boolean {
            return token === t && tryParse(nextTokenCanFollowModifier);
        }

        function nextTokenIsOnSameLineAndCanFollowModifier() {
            nextToken();
            if (scanner.hasPrecedingLineBreak()) {
                return false;
            }
            return canFollowModifier();
        }

        function nextTokenCanFollowModifier() {
            if (token === SyntaxKind.ConstKeyword) {
                // 'const' is only a modifier if followed by 'enum'.
                return nextToken() === SyntaxKind.EnumKeyword;
            }
            if (token === SyntaxKind.ExportKeyword) {
                nextToken();
                if (token === SyntaxKind.DefaultKeyword) {
                    return lookAhead(nextTokenIsClassOrFunction);
                }
                return token !== SyntaxKind.AsteriskToken && token !== SyntaxKind.OpenBraceToken && canFollowModifier();
            }
            if (token === SyntaxKind.DefaultKeyword) {
                return nextTokenIsClassOrFunction();
            }
            if (token === SyntaxKind.StaticKeyword) {
                nextToken();
                return canFollowModifier();
            }

            return nextTokenIsOnSameLineAndCanFollowModifier();
        }

        function parseAnyContextualModifier(): boolean {
            return isModifierKind(token) && tryParse(nextTokenCanFollowModifier);
        }

        function canFollowModifier(): boolean {
            return token === SyntaxKind.OpenBracketToken
                || token === SyntaxKind.OpenBraceToken
                || token === SyntaxKind.AsteriskToken
                || isLiteralPropertyName();
        }

        function nextTokenIsClassOrFunction(): boolean {
            nextToken();
            return token === SyntaxKind.ClassKeyword || token === SyntaxKind.FunctionKeyword;
        }

        // True if positioned at the start of a list element
        function isListElement(parsingContext: ParsingContext, inErrorRecovery: boolean): boolean {
            const node = currentNode(parsingContext);
            if (node) {
                return true;
            }

            switch (parsingContext) {
                case ParsingContext.SourceElements:
                case ParsingContext.BlockStatements:
                case ParsingContext.SwitchClauseStatements:
                    // If we're in error recovery, then we don't want to treat ';' as an empty statement.
                    // The problem is that ';' can show up in far too many contexts, and if we see one
                    // and assume it's a statement, then we may bail out inappropriately from whatever
                    // we're parsing.  For example, if we have a semicolon in the middle of a class, then
                    // we really don't want to assume the class is over and we're on a statement in the
                    // outer module.  We just want to consume and move on.
                    return !(token === SyntaxKind.SemicolonToken && inErrorRecovery) && isStartOfStatement();
                case ParsingContext.SwitchClauses:
                    return token === SyntaxKind.CaseKeyword || token === SyntaxKind.DefaultKeyword;
                case ParsingContext.TypeMembers:
                    return isStartOfTypeMember();
                case ParsingContext.ClassMembers:
                    // We allow semicolons as class elements (as specified by ES6) as long as we're
                    // not in error recovery.  If we're in error recovery, we don't want an errant
                    // semicolon to be treated as a class member (since they're almost always used
                    // for statements.
                    return lookAhead(isClassMemberStart) || (token === SyntaxKind.SemicolonToken && !inErrorRecovery);
                case ParsingContext.EnumMembers:
                    // Include open bracket computed properties. This technically also lets in indexers,
                    // which would be a candidate for improved error reporting.
                    return token === SyntaxKind.OpenBracketToken || isLiteralPropertyName();
                case ParsingContext.ObjectLiteralMembers:
                    return token === SyntaxKind.OpenBracketToken || token === SyntaxKind.AsteriskToken || isLiteralPropertyName();
                case ParsingContext.ObjectBindingElements:
                    return token === SyntaxKind.OpenBracketToken || isLiteralPropertyName();
                case ParsingContext.HeritageClauseElement:
                    // If we see { } then only consume it as an expression if it is followed by , or {
                    // That way we won't consume the body of a class in its heritage clause.
                    if (token === SyntaxKind.OpenBraceToken) {
                        return lookAhead(isValidHeritageClauseObjectLiteral);
                    }

                    if (!inErrorRecovery) {
                        return isStartOfLeftHandSideExpression() && !isHeritageClauseExtendsOrImplementsKeyword();
                    }
                    else {
                        // If we're in error recovery we tighten up what we're willing to match.
                        // That way we don't treat something like "this" as a valid heritage clause
                        // element during recovery.
                        return isIdentifier() && !isHeritageClauseExtendsOrImplementsKeyword();
                    }
                case ParsingContext.VariableDeclarations:
                    return isIdentifierOrPattern();
                case ParsingContext.ArrayBindingElements:
                    return token === SyntaxKind.CommaToken || token === SyntaxKind.DotDotDotToken || isIdentifierOrPattern();
                case ParsingContext.TypeParameters:
                    return isIdentifier();
                case ParsingContext.ArgumentExpressions:
                case ParsingContext.ArrayLiteralMembers:
                    return token === SyntaxKind.CommaToken || token === SyntaxKind.DotDotDotToken || isStartOfExpression();
                case ParsingContext.Parameters:
                    return isStartOfParameter();
                case ParsingContext.TypeArguments:
                case ParsingContext.TupleElementTypes:
                    return token === SyntaxKind.CommaToken || isStartOfType();
                case ParsingContext.HeritageClauses:
                    return isHeritageClause();
                case ParsingContext.ImportOrExportSpecifiers:
                    return tokenIsIdentifierOrKeyword(token);
                case ParsingContext.JsxAttributes:
                    return tokenIsIdentifierOrKeyword(token) || token === SyntaxKind.OpenBraceToken;
                case ParsingContext.JsxChildren:
                    return true;
                case ParsingContext.JSDocFunctionParameters:
                case ParsingContext.JSDocTypeArguments:
                case ParsingContext.JSDocTupleTypes:
                    return JSDocParser.isJSDocType();
                case ParsingContext.JSDocRecordMembers:
                    return isSimplePropertyName();
            }

            Debug.fail("Non-exhaustive case in 'isListElement'.");
        }

        function isValidHeritageClauseObjectLiteral() {
            Debug.assert(token === SyntaxKind.OpenBraceToken);
            if (nextToken() === SyntaxKind.CloseBraceToken) {
                // if we see  "extends {}" then only treat the {} as what we're extending (and not
                // the class body) if we have:
                //
                //      extends {} {
                //      extends {},
                //      extends {} extends
                //      extends {} implements

                const next = nextToken();
                return next === SyntaxKind.CommaToken || next === SyntaxKind.OpenBraceToken || next === SyntaxKind.ExtendsKeyword || next === SyntaxKind.ImplementsKeyword;
            }

            return true;
        }

        function nextTokenIsIdentifier() {
            nextToken();
            return isIdentifier();
        }

        function nextTokenIsIdentifierOrKeyword() {
            nextToken();
            return tokenIsIdentifierOrKeyword(token);
        }

        function isHeritageClauseExtendsOrImplementsKeyword(): boolean {
            if (token === SyntaxKind.ImplementsKeyword ||
                token === SyntaxKind.ExtendsKeyword) {

                return lookAhead(nextTokenIsStartOfExpression);
            }

            return false;
        }

        function nextTokenIsStartOfExpression() {
            nextToken();
            return isStartOfExpression();
        }

        // True if positioned at a list terminator
        function isListTerminator(kind: ParsingContext): boolean {
            if (token === SyntaxKind.EndOfFileToken) {
                // Being at the end of the file ends all lists.
                return true;
            }

            switch (kind) {
                case ParsingContext.BlockStatements:
                case ParsingContext.SwitchClauses:
                case ParsingContext.TypeMembers:
                case ParsingContext.ClassMembers:
                case ParsingContext.EnumMembers:
                case ParsingContext.ObjectLiteralMembers:
                case ParsingContext.ObjectBindingElements:
                case ParsingContext.ImportOrExportSpecifiers:
                    return token === SyntaxKind.CloseBraceToken;
                case ParsingContext.SwitchClauseStatements:
                    return token === SyntaxKind.CloseBraceToken || token === SyntaxKind.CaseKeyword || token === SyntaxKind.DefaultKeyword;
                case ParsingContext.HeritageClauseElement:
                    return token === SyntaxKind.OpenBraceToken || token === SyntaxKind.ExtendsKeyword || token === SyntaxKind.ImplementsKeyword;
                case ParsingContext.VariableDeclarations:
                    return isVariableDeclaratorListTerminator();
                case ParsingContext.TypeParameters:
                    // Tokens other than '>' are here for better error recovery
                    return token === SyntaxKind.GreaterThanToken || token === SyntaxKind.OpenParenToken || token === SyntaxKind.OpenBraceToken || token === SyntaxKind.ExtendsKeyword || token === SyntaxKind.ImplementsKeyword;
                case ParsingContext.ArgumentExpressions:
                    // Tokens other than ')' are here for better error recovery
                    return token === SyntaxKind.CloseParenToken || token === SyntaxKind.SemicolonToken;
                case ParsingContext.ArrayLiteralMembers:
                case ParsingContext.TupleElementTypes:
                case ParsingContext.ArrayBindingElements:
                    return token === SyntaxKind.CloseBracketToken;
                case ParsingContext.Parameters:
                    // Tokens other than ')' and ']' (the latter for index signatures) are here for better error recovery
                    return token === SyntaxKind.CloseParenToken || token === SyntaxKind.CloseBracketToken /*|| token === SyntaxKind.OpenBraceToken*/;
                case ParsingContext.TypeArguments:
                    // Tokens other than '>' are here for better error recovery
                    return token === SyntaxKind.GreaterThanToken || token === SyntaxKind.OpenParenToken;
                case ParsingContext.HeritageClauses:
                    return token === SyntaxKind.OpenBraceToken || token === SyntaxKind.CloseBraceToken;
                case ParsingContext.JsxAttributes:
                    return token === SyntaxKind.GreaterThanToken || token === SyntaxKind.SlashToken;
                case ParsingContext.JsxChildren:
                    return token === SyntaxKind.LessThanToken && lookAhead(nextTokenIsSlash);
                case ParsingContext.JSDocFunctionParameters:
                    return token === SyntaxKind.CloseParenToken || token === SyntaxKind.ColonToken || token === SyntaxKind.CloseBraceToken;
                case ParsingContext.JSDocTypeArguments:
                    return token === SyntaxKind.GreaterThanToken || token === SyntaxKind.CloseBraceToken;
                case ParsingContext.JSDocTupleTypes:
                    return token === SyntaxKind.CloseBracketToken || token === SyntaxKind.CloseBraceToken;
                case ParsingContext.JSDocRecordMembers:
                    return token === SyntaxKind.CloseBraceToken;
            }
        }

        function isVariableDeclaratorListTerminator(): boolean {
            // If we can consume a semicolon (either explicitly, or with ASI), then consider us done
            // with parsing the list of  variable declarators.
            if (canParseSemicolon()) {
                return true;
            }

            // in the case where we're parsing the variable declarator of a 'for-in' statement, we
            // are done if we see an 'in' keyword in front of us. Same with for-of
            if (isInOrOfKeyword(token)) {
                return true;
            }

            // ERROR RECOVERY TWEAK:
            // For better error recovery, if we see an '=>' then we just stop immediately.  We've got an
            // arrow function here and it's going to be very unlikely that we'll resynchronize and get
            // another variable declaration.
            if (token === SyntaxKind.EqualsGreaterThanToken) {
                return true;
            }

            // Keep trying to parse out variable declarators.
            return false;
        }

        // True if positioned at element or terminator of the current list or any enclosing list
        function isInSomeParsingContext(): boolean {
            for (let kind = 0; kind < ParsingContext.Count; kind++) {
                if (parsingContext & (1 << kind)) {
                    if (isListElement(kind, /*inErrorRecovery*/ true) || isListTerminator(kind)) {
                        return true;
                    }
                }
            }

            return false;
        }

        // Parses a list of elements
        function parseList<T extends Node>(kind: ParsingContext, parseElement: () => T): NodeArray<T> {
            const saveParsingContext = parsingContext;
            parsingContext |= 1 << kind;
            const result = <NodeArray<T>>[];
            result.pos = getNodePos();

            while (!isListTerminator(kind)) {
                if (isListElement(kind, /*inErrorRecovery*/ false)) {
                    const element = parseListElement(kind, parseElement);
                    result.push(element);

                    continue;
                }

                if (abortParsingListOrMoveToNextToken(kind)) {
                    break;
                }
            }

            result.end = getNodeEnd();
            parsingContext = saveParsingContext;
            return result;
        }

        function parseListElement<T extends Node>(parsingContext: ParsingContext, parseElement: () => T): T {
            const node = currentNode(parsingContext);
            if (node) {
                return <T>consumeNode(node);
            }

            return parseElement();
        }

        function currentNode(parsingContext: ParsingContext): Node {
            // If there is an outstanding parse error that we've encountered, but not attached to
            // some node, then we cannot get a node from the old source tree.  This is because we
            // want to mark the next node we encounter as being unusable.
            //
            // Note: This may be too conservative.  Perhaps we could reuse the node and set the bit
            // on it (or its leftmost child) as having the error.  For now though, being conservative
            // is nice and likely won't ever affect perf.
            if (parseErrorBeforeNextFinishedNode) {
                return undefined;
            }

            if (!syntaxCursor) {
                // if we don't have a cursor, we could never return a node from the old tree.
                return undefined;
            }

            const node = syntaxCursor.currentNode(scanner.getStartPos());

            // Can't reuse a missing node.
            if (nodeIsMissing(node)) {
                return undefined;
            }

            // Can't reuse a node that intersected the change range.
            if (node.intersectsChange) {
                return undefined;
            }

            // Can't reuse a node that contains a parse error.  This is necessary so that we
            // produce the same set of errors again.
            if (containsParseError(node)) {
                return undefined;
            }

            // We can only reuse a node if it was parsed under the same strict mode that we're
            // currently in.  i.e. if we originally parsed a node in non-strict mode, but then
            // the user added 'using strict' at the top of the file, then we can't use that node
            // again as the presense of strict mode may cause us to parse the tokens in the file
            // differetly.
            //
            // Note: we *can* reuse tokens when the strict mode changes.  That's because tokens
            // are unaffected by strict mode.  It's just the parser will decide what to do with it
            // differently depending on what mode it is in.
            //
            // This also applies to all our other context flags as well.
            const nodeContextFlags = node.parserContextFlags & ParserContextFlags.ParserGeneratedFlags;
            if (nodeContextFlags !== contextFlags) {
                return undefined;
            }

            // Ok, we have a node that looks like it could be reused.  Now verify that it is valid
            // in the currest list parsing context that we're currently at.
            if (!canReuseNode(node, parsingContext)) {
                return undefined;
            }

            return node;
        }

        function consumeNode(node: Node) {
            // Move the scanner so it is after the node we just consumed.
            scanner.setTextPos(node.end);
            nextToken();
            return node;
        }

        function canReuseNode(node: Node, parsingContext: ParsingContext): boolean {
            switch (parsingContext) {
                case ParsingContext.ClassMembers:
                    return isReusableClassMember(node);

                case ParsingContext.SwitchClauses:
                    return isReusableSwitchClause(node);

                case ParsingContext.SourceElements:
                case ParsingContext.BlockStatements:
                case ParsingContext.SwitchClauseStatements:
                    return isReusableStatement(node);

                case ParsingContext.EnumMembers:
                    return isReusableEnumMember(node);

                case ParsingContext.TypeMembers:
                    return isReusableTypeMember(node);

                case ParsingContext.VariableDeclarations:
                    return isReusableVariableDeclaration(node);

                case ParsingContext.Parameters:
                    return isReusableParameter(node);

                // Any other lists we do not care about reusing nodes in.  But feel free to add if
                // you can do so safely.  Danger areas involve nodes that may involve speculative
                // parsing.  If speculative parsing is involved with the node, then the range the
                // parser reached while looking ahead might be in the edited range (see the example
                // in canReuseVariableDeclaratorNode for a good case of this).
                case ParsingContext.HeritageClauses:
                // This would probably be safe to reuse.  There is no speculative parsing with
                // heritage clauses.

                case ParsingContext.TypeParameters:
                // This would probably be safe to reuse.  There is no speculative parsing with
                // type parameters.  Note that that's because type *parameters* only occur in
                // unambiguous *type* contexts.  While type *arguments* occur in very ambiguous
                // *expression* contexts.

                case ParsingContext.TupleElementTypes:
                // This would probably be safe to reuse.  There is no speculative parsing with
                // tuple types.

                // Technically, type argument list types are probably safe to reuse.  While
                // speculative parsing is involved with them (since type argument lists are only
                // produced from speculative parsing a < as a type argument list), we only have
                // the types because speculative parsing succeeded.  Thus, the lookahead never
                // went past the end of the list and rewound.
                case ParsingContext.TypeArguments:

                // Note: these are almost certainly not safe to ever reuse.  Expressions commonly
                // need a large amount of lookahead, and we should not reuse them as they may
                // have actually intersected the edit.
                case ParsingContext.ArgumentExpressions:

                // This is not safe to reuse for the same reason as the 'AssignmentExpression'
                // cases.  i.e. a property assignment may end with an expression, and thus might
                // have lookahead far beyond it's old node.
                case ParsingContext.ObjectLiteralMembers:

                // This is probably not safe to reuse.  There can be speculative parsing with
                // type names in a heritage clause.  There can be generic names in the type
                // name list, and there can be left hand side expressions (which can have type
                // arguments.)
                case ParsingContext.HeritageClauseElement:

                // Perhaps safe to reuse, but it's unlikely we'd see more than a dozen attributes
                // on any given element. Same for children.
                case ParsingContext.JsxAttributes:
                case ParsingContext.JsxChildren:

            }

            return false;
        }

        function isReusableClassMember(node: Node) {
            if (node) {
                switch (node.kind) {
                    case SyntaxKind.Constructor:
                    case SyntaxKind.IndexSignature:
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.SemicolonClassElement:
                        return true;
                    case SyntaxKind.MethodDeclaration:
                        // Method declarations are not necessarily reusable.  An object-literal
                        // may have a method calls "constructor(...)" and we must reparse that
                        // into an actual .ConstructorDeclaration.
                        let methodDeclaration = <MethodDeclaration>node;
                        let nameIsConstructor = methodDeclaration.name.kind === SyntaxKind.Identifier &&
                            (<Identifier>methodDeclaration.name).originalKeywordKind === SyntaxKind.ConstructorKeyword;

                        return !nameIsConstructor;
                }
            }

            return false;
        }

        function isReusableSwitchClause(node: Node) {
            if (node) {
                switch (node.kind) {
                    case SyntaxKind.CaseClause:
                    case SyntaxKind.DefaultClause:
                        return true;
                }
            }

            return false;
        }

        function isReusableStatement(node: Node) {
            if (node) {
                switch (node.kind) {
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.VariableStatement:
                    case SyntaxKind.Block:
                    case SyntaxKind.IfStatement:
                    case SyntaxKind.ExpressionStatement:
                    case SyntaxKind.ThrowStatement:
                    case SyntaxKind.ReturnStatement:
                    case SyntaxKind.SwitchStatement:
                    case SyntaxKind.BreakStatement:
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.ForInStatement:
                    case SyntaxKind.ForOfStatement:
                    case SyntaxKind.ForStatement:
                    case SyntaxKind.WhileStatement:
                    case SyntaxKind.WithStatement:
                    case SyntaxKind.EmptyStatement:
                    case SyntaxKind.TryStatement:
                    case SyntaxKind.LabeledStatement:
                    case SyntaxKind.DoStatement:
                    case SyntaxKind.DebuggerStatement:
                    case SyntaxKind.ImportDeclaration:
                    case SyntaxKind.ImportEqualsDeclaration:
                    case SyntaxKind.ExportDeclaration:
                    case SyntaxKind.ExportAssignment:
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.EnumDeclaration:
                    case SyntaxKind.TypeAliasDeclaration:
                        return true;
                }
            }

            return false;
        }

        function isReusableEnumMember(node: Node) {
            return node.kind === SyntaxKind.EnumMember;
        }

        function isReusableTypeMember(node: Node) {
            if (node) {
                switch (node.kind) {
                    case SyntaxKind.ConstructSignature:
                    case SyntaxKind.MethodSignature:
                    case SyntaxKind.IndexSignature:
                    case SyntaxKind.PropertySignature:
                    case SyntaxKind.CallSignature:
                        return true;
                }
            }

            return false;
        }

        function isReusableVariableDeclaration(node: Node) {
            if (node.kind !== SyntaxKind.VariableDeclaration) {
                return false;
            }

            // Very subtle incremental parsing bug.  Consider the following code:
            //
            //      let v = new List < A, B
            //
            // This is actually legal code.  It's a list of variable declarators "v = new List<A"
            // on one side and "B" on the other. If you then change that to:
            //
            //      let v = new List < A, B >()
            //
            // then we have a problem.  "v = new List<A" doesn't intersect the change range, so we
            // start reparsing at "B" and we completely fail to handle this properly.
            //
            // In order to prevent this, we do not allow a variable declarator to be reused if it
            // has an initializer.
            const variableDeclarator = <VariableDeclaration>node;
            return variableDeclarator.initializer === undefined;
        }

        function isReusableParameter(node: Node) {
            if (node.kind !== SyntaxKind.Parameter) {
                return false;
            }

            // See the comment in isReusableVariableDeclaration for why we do this.
            const parameter = <ParameterDeclaration>node;
            return parameter.initializer === undefined;
        }

        // Returns true if we should abort parsing.
        function abortParsingListOrMoveToNextToken(kind: ParsingContext) {
            parseErrorAtCurrentToken(parsingContextErrors(kind));
            if (isInSomeParsingContext()) {
                return true;
            }

            nextToken();
            return false;
        }

        function parsingContextErrors(context: ParsingContext): DiagnosticMessage {
            switch (context) {
                case ParsingContext.SourceElements: return Diagnostics.Declaration_or_statement_expected;
                case ParsingContext.BlockStatements: return Diagnostics.Declaration_or_statement_expected;
                case ParsingContext.SwitchClauses: return Diagnostics.case_or_default_expected;
                case ParsingContext.SwitchClauseStatements: return Diagnostics.Statement_expected;
                case ParsingContext.TypeMembers: return Diagnostics.Property_or_signature_expected;
                case ParsingContext.ClassMembers: return Diagnostics.Unexpected_token_A_constructor_method_accessor_or_property_was_expected;
                case ParsingContext.EnumMembers: return Diagnostics.Enum_member_expected;
                case ParsingContext.HeritageClauseElement: return Diagnostics.Expression_expected;
                case ParsingContext.VariableDeclarations: return Diagnostics.Variable_declaration_expected;
                case ParsingContext.ObjectBindingElements: return Diagnostics.Property_destructuring_pattern_expected;
                case ParsingContext.ArrayBindingElements: return Diagnostics.Array_element_destructuring_pattern_expected;
                case ParsingContext.ArgumentExpressions: return Diagnostics.Argument_expression_expected;
                case ParsingContext.ObjectLiteralMembers: return Diagnostics.Property_assignment_expected;
                case ParsingContext.ArrayLiteralMembers: return Diagnostics.Expression_or_comma_expected;
                case ParsingContext.Parameters: return Diagnostics.Parameter_declaration_expected;
                case ParsingContext.TypeParameters: return Diagnostics.Type_parameter_declaration_expected;
                case ParsingContext.TypeArguments: return Diagnostics.Type_argument_expected;
                case ParsingContext.TupleElementTypes: return Diagnostics.Type_expected;
                case ParsingContext.HeritageClauses: return Diagnostics.Unexpected_token_expected;
                case ParsingContext.ImportOrExportSpecifiers: return Diagnostics.Identifier_expected;
                case ParsingContext.JsxAttributes: return Diagnostics.Identifier_expected;
                case ParsingContext.JsxChildren: return Diagnostics.Identifier_expected;
                case ParsingContext.JSDocFunctionParameters: return Diagnostics.Parameter_declaration_expected;
                case ParsingContext.JSDocTypeArguments: return Diagnostics.Type_argument_expected;
                case ParsingContext.JSDocTupleTypes: return Diagnostics.Type_expected;
                case ParsingContext.JSDocRecordMembers: return Diagnostics.Property_assignment_expected;
            }
        };

        // Parses a comma-delimited list of elements
        function parseDelimitedList<T extends Node>(kind: ParsingContext, parseElement: () => T, considerSemicolonAsDelimeter?: boolean): NodeArray<T> {
            const saveParsingContext = parsingContext;
            parsingContext |= 1 << kind;
            const result = <NodeArray<T>>[];
            result.pos = getNodePos();

            let commaStart = -1; // Meaning the previous token was not a comma
            while (true) {
                if (isListElement(kind, /*inErrorRecovery*/ false)) {
                    result.push(parseListElement(kind, parseElement));
                    commaStart = scanner.getTokenPos();
                    if (parseOptional(SyntaxKind.CommaToken)) {
                        continue;
                    }

                    commaStart = -1; // Back to the state where the last token was not a comma
                    if (isListTerminator(kind)) {
                        break;
                    }

                    // We didn't get a comma, and the list wasn't terminated, explicitly parse
                    // out a comma so we give a good error message.
                    parseExpected(SyntaxKind.CommaToken);

                    // If the token was a semicolon, and the caller allows that, then skip it and
                    // continue.  This ensures we get back on track and don't result in tons of
                    // parse errors.  For example, this can happen when people do things like use
                    // a semicolon to delimit object literal members.   Note: we'll have already
                    // reported an error when we called parseExpected above.
                    if (considerSemicolonAsDelimeter && token === SyntaxKind.SemicolonToken && !scanner.hasPrecedingLineBreak()) {
                        nextToken();
                    }
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

        function createMissingList<T>(): NodeArray<T> {
            const pos = getNodePos();
            const result = <NodeArray<T>>[];
            result.pos = pos;
            result.end = pos;
            return result;
        }

        function parseBracketedList<T extends Node>(kind: ParsingContext, parseElement: () => T, open: SyntaxKind, close: SyntaxKind): NodeArray<T> {
            if (parseExpected(open)) {
                const result = parseDelimitedList(kind, parseElement);
                parseExpected(close);
                return result;
            }

            return createMissingList<T>();
        }

        // The allowReservedWords parameter controls whether reserved words are permitted after the first dot
        function parseEntityName(allowReservedWords: boolean, diagnosticMessage?: DiagnosticMessage): EntityName {
            let entity: EntityName = parseIdentifier(diagnosticMessage);
            while (parseOptional(SyntaxKind.DotToken)) {
                const node = <QualifiedName>createNode(SyntaxKind.QualifiedName, entity.pos);
                node.left = entity;
                node.right = parseRightSideOfDot(allowReservedWords);
                entity = finishNode(node);
            }
            return entity;
        }

        function parseRightSideOfDot(allowIdentifierNames: boolean): Identifier {
            // Technically a keyword is valid here as all identifiers and keywords are identifier names.
            // However, often we'll encounter this in error situations when the identifier or keyword
            // is actually starting another valid construct.
            //
            // So, we check for the following specific case:
            //
            //      name.
            //      identifierOrKeyword identifierNameOrKeyword
            //
            // Note: the newlines are important here.  For example, if that above code
            // were rewritten into:
            //
            //      name.identifierOrKeyword
            //      identifierNameOrKeyword
            //
            // Then we would consider it valid.  That's because ASI would take effect and
            // the code would be implicitly: "name.identifierOrKeyword; identifierNameOrKeyword".
            // In the first case though, ASI will not take effect because there is not a
            // line terminator after the identifier or keyword.
            if (scanner.hasPrecedingLineBreak() && tokenIsIdentifierOrKeyword(token)) {
                const matchesPattern = lookAhead(nextTokenIsIdentifierOrKeywordOnSameLine);

                if (matchesPattern) {
                    // Report that we need an identifier.  However, report it right after the dot,
                    // and not on the next token.  This is because the next token might actually
                    // be an identifier and the error would be quite confusing.
                    return <Identifier>createMissingNode(SyntaxKind.Identifier, /*reportAtCurrentPosition*/ true, Diagnostics.Identifier_expected);
                }
            }

            return allowIdentifierNames ? parseIdentifierName() : parseIdentifier();
        }

        function parseTemplateExpression(): TemplateExpression {
            const template = <TemplateExpression>createNode(SyntaxKind.TemplateExpression);

            template.head = parseTemplateLiteralFragment();
            Debug.assert(template.head.kind === SyntaxKind.TemplateHead, "Template head has wrong token kind");

            const templateSpans = <NodeArray<TemplateSpan>>[];
            templateSpans.pos = getNodePos();

            do {
                templateSpans.push(parseTemplateSpan());
            }
            while (lastOrUndefined(templateSpans).literal.kind === SyntaxKind.TemplateMiddle);

            templateSpans.end = getNodeEnd();
            template.templateSpans = templateSpans;

            return finishNode(template);
        }

        function parseTemplateSpan(): TemplateSpan {
            const span = <TemplateSpan>createNode(SyntaxKind.TemplateSpan);
            span.expression = allowInAnd(parseExpression);

            let literal: TemplateLiteralFragment;

            if (token === SyntaxKind.CloseBraceToken) {
                reScanTemplateToken();
                literal = parseTemplateLiteralFragment();
            }
            else {
                literal = <TemplateLiteralFragment>parseExpectedToken(SyntaxKind.TemplateTail, /*reportAtCurrentPosition*/ false, Diagnostics._0_expected, tokenToString(SyntaxKind.CloseBraceToken));
            }

            span.literal = literal;
            return finishNode(span);
        }

        function parseStringLiteralTypeNode(): StringLiteralTypeNode {
            return <StringLiteralTypeNode>parseLiteralLikeNode(SyntaxKind.StringLiteralType, /*internName*/ true);
        }

        function parseLiteralNode(internName?: boolean): LiteralExpression {
            return <LiteralExpression>parseLiteralLikeNode(token, internName);
        }

        function parseTemplateLiteralFragment(): TemplateLiteralFragment {
            return <TemplateLiteralFragment>parseLiteralLikeNode(token, /*internName*/ false);
        }

        function parseLiteralLikeNode(kind: SyntaxKind, internName: boolean): LiteralLikeNode {
            const node = <LiteralExpression>createNode(kind);
            const text = scanner.getTokenValue();
            node.text = internName ? internIdentifier(text) : text;

            if (scanner.hasExtendedUnicodeEscape()) {
                node.hasExtendedUnicodeEscape = true;
            }

            if (scanner.isUnterminated()) {
                node.isUnterminated = true;
            }

            const tokenPos = scanner.getTokenPos();
            nextToken();
            finishNode(node);

            // Octal literals are not allowed in strict mode or ES5
            // Note that theoretically the following condition would hold true literals like 009,
            // which is not octal.But because of how the scanner separates the tokens, we would
            // never get a token like this. Instead, we would get 00 and 9 as two separate tokens.
            // We also do not need to check for negatives because any prefix operator would be part of a
            // parent unary expression.
            if (node.kind === SyntaxKind.NumericLiteral
                && sourceText.charCodeAt(tokenPos) === CharacterCodes._0
                && isOctalDigit(sourceText.charCodeAt(tokenPos + 1))) {

                node.flags |= NodeFlags.OctalLiteral;
            }

            return node;
        }

        // TYPES

        function parseTypeReference(): TypeReferenceNode {
            const typeName = parseEntityName(/*allowReservedWords*/ false, Diagnostics.Type_expected);
            const node = <TypeReferenceNode>createNode(SyntaxKind.TypeReference, typeName.pos);
            node.typeName = typeName;
            if (!scanner.hasPrecedingLineBreak() && token === SyntaxKind.LessThanToken) {
                node.typeArguments = parseBracketedList(ParsingContext.TypeArguments, parseType, SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken);
            }
            return finishNode(node);
        }

        function parseThisTypePredicate(lhs: ThisTypeNode): TypePredicateNode {
            nextToken();
            const node = createNode(SyntaxKind.TypePredicate, lhs.pos) as TypePredicateNode;
            node.parameterName = lhs;
            node.type = parseType();
            return finishNode(node);
        }

        function parseThisTypeNode(): ThisTypeNode {
            const node = createNode(SyntaxKind.ThisType) as ThisTypeNode;
            nextToken();
            return finishNode(node);
        }

        function parseTypeQuery(): TypeQueryNode {
            const node = <TypeQueryNode>createNode(SyntaxKind.TypeQuery);
            parseExpected(SyntaxKind.TypeOfKeyword);
            node.exprName = parseEntityName(/*allowReservedWords*/ true);
            return finishNode(node);
        }

        function parseTypeParameter(): TypeParameterDeclaration {
            const node = <TypeParameterDeclaration>createNode(SyntaxKind.TypeParameter);
            node.name = parseIdentifier();
            if (parseOptional(SyntaxKind.ExtendsKeyword)) {
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

        function parseTypeParameters(): NodeArray<TypeParameterDeclaration> {
            if (token === SyntaxKind.LessThanToken) {
                return parseBracketedList(ParsingContext.TypeParameters, parseTypeParameter, SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken);
            }
        }

        function parseParameterType(): TypeNode {
            if (parseOptional(SyntaxKind.ColonToken)) {
                return parseType();
            }

            return undefined;
        }

        function isStartOfParameter(): boolean {
            return token === SyntaxKind.DotDotDotToken || isIdentifierOrPattern() || isModifierKind(token) || token === SyntaxKind.AtToken;
        }

        function setModifiers(node: Node, modifiers: ModifiersArray) {
            if (modifiers) {
                node.flags |= modifiers.flags;
                node.modifiers = modifiers;
            }
        }

        function parseParameter(): ParameterDeclaration {
            const node = <ParameterDeclaration>createNode(SyntaxKind.Parameter);
            node.decorators = parseDecorators();
            setModifiers(node, parseModifiers());
            node.dotDotDotToken = parseOptionalToken(SyntaxKind.DotDotDotToken);

            // FormalParameter [Yield,Await]:
            //      BindingElement[?Yield,?Await]

            node.name = parseIdentifierOrPattern();

            if (getFullWidth(node.name) === 0 && node.flags === 0 && isModifierKind(token)) {
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

            node.questionToken = parseOptionalToken(SyntaxKind.QuestionToken);
            node.type = parseParameterType();
            node.initializer = parseBindingElementInitializer(/*inParameter*/ true);

            // Do not check for initializers in an ambient context for parameters. This is not
            // a grammar error because the grammar allows arbitrary call signatures in
            // an ambient context.
            // It is actually not necessary for this to be an error at all. The reason is that
            // function/constructor implementations are syntactically disallowed in ambient
            // contexts. In addition, parameter initializers are semantically disallowed in
            // overload signatures. So parameter initializers are transitively disallowed in
            // ambient contexts.

            return addJSDocComment(finishNode(node));
        }

        function parseBindingElementInitializer(inParameter: boolean) {
            return inParameter ? parseParameterInitializer() : parseNonParameterInitializer();
        }

        function parseParameterInitializer() {
            return parseInitializer(/*inParameter*/ true);
        }

        function fillSignature(
                returnToken: SyntaxKind,
                yieldContext: boolean,
                awaitContext: boolean,
                requireCompleteParameterList: boolean,
                signature: SignatureDeclaration): void {

            const returnTokenRequired = returnToken === SyntaxKind.EqualsGreaterThanToken;
            signature.typeParameters = parseTypeParameters();
            signature.parameters = parseParameterList(yieldContext, awaitContext, requireCompleteParameterList);

            if (returnTokenRequired) {
                parseExpected(returnToken);
                signature.type = parseTypeOrTypePredicate();
            }
            else if (parseOptional(returnToken)) {
                signature.type = parseTypeOrTypePredicate();
            }
        }

        function parseParameterList(yieldContext: boolean, awaitContext: boolean, requireCompleteParameterList: boolean) {
            // FormalParameters [Yield,Await]: (modified)
            //      [empty]
            //      FormalParameterList[?Yield,Await]
            //
            // FormalParameter[Yield,Await]: (modified)
            //      BindingElement[?Yield,Await]
            //
            // BindingElement [Yield,Await]: (modified)
            //      SingleNameBinding[?Yield,?Await]
            //      BindingPattern[?Yield,?Await]Initializer [In, ?Yield,?Await] opt
            //
            // SingleNameBinding [Yield,Await]:
            //      BindingIdentifier[?Yield,?Await]Initializer [In, ?Yield,?Await] opt
            if (parseExpected(SyntaxKind.OpenParenToken)) {
                const savedYieldContext = inYieldContext();
                const savedAwaitContext = inAwaitContext();

                setYieldContext(yieldContext);
                setAwaitContext(awaitContext);

                const result = parseDelimitedList(ParsingContext.Parameters, parseParameter);

                setYieldContext(savedYieldContext);
                setAwaitContext(savedAwaitContext);

                if (!parseExpected(SyntaxKind.CloseParenToken) && requireCompleteParameterList) {
                    // Caller insisted that we had to end with a )   We didn't.  So just return
                    // undefined here.
                    return undefined;
                }

                return result;
            }

            // We didn't even have an open paren.  If the caller requires a complete parameter list,
            // we definitely can't provide that.  However, if they're ok with an incomplete one,
            // then just return an empty set of parameters.
            return requireCompleteParameterList ? undefined : createMissingList<ParameterDeclaration>();
        }

        function parseTypeMemberSemicolon() {
            // We allow type members to be separated by commas or (possibly ASI) semicolons.
            // First check if it was a comma.  If so, we're done with the member.
            if (parseOptional(SyntaxKind.CommaToken)) {
                return;
            }

            // Didn't have a comma.  We must have a (possible ASI) semicolon.
            parseSemicolon();
        }

        function parseSignatureMember(kind: SyntaxKind): CallSignatureDeclaration | ConstructSignatureDeclaration {
            const node = <CallSignatureDeclaration | ConstructSignatureDeclaration>createNode(kind);
            if (kind === SyntaxKind.ConstructSignature) {
                parseExpected(SyntaxKind.NewKeyword);
            }
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ false, /*awaitContext*/ false, /*requireCompleteParameterList*/ false, node);
            parseTypeMemberSemicolon();
            return finishNode(node);
        }

        function isIndexSignature(): boolean {
            if (token !== SyntaxKind.OpenBracketToken) {
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
            if (token === SyntaxKind.DotDotDotToken || token === SyntaxKind.CloseBracketToken) {
                return true;
            }

            if (isModifierKind(token)) {
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
            if (token === SyntaxKind.ColonToken || token === SyntaxKind.CommaToken) {
                return true;
            }

            // Question mark could be an indexer with an optional property,
            // or it could be a conditional expression in a computed property.
            if (token !== SyntaxKind.QuestionToken) {
                return false;
            }

            // If any of the following tokens are after the question mark, it cannot
            // be a conditional expression, so treat it as an indexer.
            nextToken();
            return token === SyntaxKind.ColonToken || token === SyntaxKind.CommaToken || token === SyntaxKind.CloseBracketToken;
        }

        function parseIndexSignatureDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): IndexSignatureDeclaration {
            const node = <IndexSignatureDeclaration>createNode(SyntaxKind.IndexSignature, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            node.parameters = parseBracketedList(ParsingContext.Parameters, parseParameter, SyntaxKind.OpenBracketToken, SyntaxKind.CloseBracketToken);
            node.type = parseTypeAnnotation();
            parseTypeMemberSemicolon();
            return finishNode(node);
        }

        function parsePropertyOrMethodSignature(): PropertySignature | MethodSignature {
            const fullStart = scanner.getStartPos();
            const name = parsePropertyName();
            const questionToken = parseOptionalToken(SyntaxKind.QuestionToken);

            if (token === SyntaxKind.OpenParenToken || token === SyntaxKind.LessThanToken) {
                const method = <MethodSignature>createNode(SyntaxKind.MethodSignature, fullStart);
                method.name = name;
                method.questionToken = questionToken;

                // Method signatues don't exist in expression contexts.  So they have neither
                // [Yield] nor [Await]
                fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ false, /*awaitContext*/ false, /*requireCompleteParameterList*/ false, method);
                parseTypeMemberSemicolon();
                return finishNode(method);
            }
            else {
                const property = <PropertySignature>createNode(SyntaxKind.PropertySignature, fullStart);
                property.name = name;
                property.questionToken = questionToken;
                property.type = parseTypeAnnotation();

                if (token === SyntaxKind.EqualsToken) {
                    // Although type literal properties cannot not have initializers, we attempt
                    // to parse an initializer so we can report in the checker that an interface
                    // property or type literal property cannot have an initializer.
                    property.initializer = parseNonParameterInitializer();
                }

                parseTypeMemberSemicolon();
                return finishNode(property);
            }
        }

        function isStartOfTypeMember(): boolean {
            switch (token) {
                case SyntaxKind.OpenParenToken:
                case SyntaxKind.LessThanToken:
                case SyntaxKind.OpenBracketToken: // Both for indexers and computed properties
                    return true;
                default:
                    if (isModifierKind(token)) {
                        const result = lookAhead(isStartOfIndexSignatureDeclaration);
                        if (result) {
                            return result;
                        }
                    }

                    return isLiteralPropertyName() && lookAhead(isTypeMemberWithLiteralPropertyName);
            }
        }

        function isStartOfIndexSignatureDeclaration() {
            while (isModifierKind(token)) {
                nextToken();
            }

            return isIndexSignature();
        }

        function isTypeMemberWithLiteralPropertyName() {
            nextToken();
            return token === SyntaxKind.OpenParenToken ||
                token === SyntaxKind.LessThanToken ||
                token === SyntaxKind.QuestionToken ||
                token === SyntaxKind.ColonToken ||
                canParseSemicolon();
        }

        function parseTypeMember(): TypeElement {
            switch (token) {
                case SyntaxKind.OpenParenToken:
                case SyntaxKind.LessThanToken:
                    return parseSignatureMember(SyntaxKind.CallSignature);
                case SyntaxKind.OpenBracketToken:
                    // Indexer or computed property
                    return isIndexSignature()
                        ? parseIndexSignatureDeclaration(scanner.getStartPos(), /*decorators*/ undefined, /*modifiers*/ undefined)
                        : parsePropertyOrMethodSignature();
                case SyntaxKind.NewKeyword:
                    if (lookAhead(isStartOfConstructSignature)) {
                        return parseSignatureMember(SyntaxKind.ConstructSignature);
                    }
                // fall through.
                case SyntaxKind.StringLiteral:
                case SyntaxKind.NumericLiteral:
                    return parsePropertyOrMethodSignature();
                default:
                    // Index declaration as allowed as a type member.  But as per the grammar,
                    // they also allow modifiers. So we have to check for an index declaration
                    // that might be following modifiers. This ensures that things work properly
                    // when incrementally parsing as the parser will produce the Index declaration
                    // if it has the same text regardless of whether it is inside a class or an
                    // object type.
                    if (isModifierKind(token)) {
                        const result = tryParse(parseIndexSignatureWithModifiers);
                        if (result) {
                            return result;
                        }
                    }

                    if (tokenIsIdentifierOrKeyword(token)) {
                        return parsePropertyOrMethodSignature();
                    }
            }
        }

        function parseIndexSignatureWithModifiers() {
            const fullStart = scanner.getStartPos();
            const decorators = parseDecorators();
            const modifiers = parseModifiers();
            return isIndexSignature()
                ? parseIndexSignatureDeclaration(fullStart, decorators, modifiers)
                : undefined;
        }

        function isStartOfConstructSignature() {
            nextToken();
            return token === SyntaxKind.OpenParenToken || token === SyntaxKind.LessThanToken;
        }

        function parseTypeLiteral(): TypeLiteralNode {
            const node = <TypeLiteralNode>createNode(SyntaxKind.TypeLiteral);
            node.members = parseObjectTypeMembers();
            return finishNode(node);
        }

        function parseObjectTypeMembers(): NodeArray<TypeElement> {
            let members: NodeArray<TypeElement>;
            if (parseExpected(SyntaxKind.OpenBraceToken)) {
                members = parseList(ParsingContext.TypeMembers, parseTypeMember);
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                members = createMissingList<TypeElement>();
            }

            return members;
        }

        function parseTupleType(): TupleTypeNode {
            const node = <TupleTypeNode>createNode(SyntaxKind.TupleType);
            node.elementTypes = parseBracketedList(ParsingContext.TupleElementTypes, parseType, SyntaxKind.OpenBracketToken, SyntaxKind.CloseBracketToken);
            return finishNode(node);
        }

        function parseParenthesizedType(): ParenthesizedTypeNode {
            const node = <ParenthesizedTypeNode>createNode(SyntaxKind.ParenthesizedType);
            parseExpected(SyntaxKind.OpenParenToken);
            node.type = parseType();
            parseExpected(SyntaxKind.CloseParenToken);
            return finishNode(node);
        }

        function parseFunctionOrConstructorType(kind: SyntaxKind): FunctionOrConstructorTypeNode {
            const node = <FunctionOrConstructorTypeNode>createNode(kind);
            if (kind === SyntaxKind.ConstructorType) {
                parseExpected(SyntaxKind.NewKeyword);
            }
            fillSignature(SyntaxKind.EqualsGreaterThanToken, /*yieldContext*/ false, /*awaitContext*/ false, /*requireCompleteParameterList*/ false, node);
            return finishNode(node);
        }

        function parseKeywordAndNoDot(): TypeNode {
            const node = parseTokenNode<TypeNode>();
            return token === SyntaxKind.DotToken ? undefined : node;
        }

        function parseNonArrayType(): TypeNode {
            switch (token) {
                case SyntaxKind.AnyKeyword:
                case SyntaxKind.StringKeyword:
                case SyntaxKind.NumberKeyword:
                case SyntaxKind.BooleanKeyword:
                case SyntaxKind.SymbolKeyword:
                    // If these are followed by a dot, then parse these out as a dotted type reference instead.
                    const node = tryParse(parseKeywordAndNoDot);
                    return node || parseTypeReference();
                case SyntaxKind.StringLiteral:
                    return parseStringLiteralTypeNode();
                case SyntaxKind.VoidKeyword:
                    return parseTokenNode<TypeNode>();
                case SyntaxKind.ThisKeyword: {
                    const thisKeyword = parseThisTypeNode();
                    if (token === SyntaxKind.IsKeyword && !scanner.hasPrecedingLineBreak()) {
                        return parseThisTypePredicate(thisKeyword);
                    }
                    else {
                        return thisKeyword;
                    }
                }
                case SyntaxKind.TypeOfKeyword:
                    return parseTypeQuery();
                case SyntaxKind.OpenBraceToken:
                    return parseTypeLiteral();
                case SyntaxKind.OpenBracketToken:
                    return parseTupleType();
                case SyntaxKind.OpenParenToken:
                    return parseParenthesizedType();
                default:
                    return parseTypeReference();
            }
        }

        function isStartOfType(): boolean {
            switch (token) {
                case SyntaxKind.AnyKeyword:
                case SyntaxKind.StringKeyword:
                case SyntaxKind.NumberKeyword:
                case SyntaxKind.BooleanKeyword:
                case SyntaxKind.SymbolKeyword:
                case SyntaxKind.VoidKeyword:
                case SyntaxKind.ThisKeyword:
                case SyntaxKind.TypeOfKeyword:
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.OpenBracketToken:
                case SyntaxKind.LessThanToken:
                case SyntaxKind.NewKeyword:
                case SyntaxKind.StringLiteral:
                    return true;
                case SyntaxKind.OpenParenToken:
                    // Only consider '(' the start of a type if followed by ')', '...', an identifier, a modifier,
                    // or something that starts a type. We don't want to consider things like '(1)' a type.
                    return lookAhead(isStartOfParenthesizedOrFunctionType);
                default:
                    return isIdentifier();
            }
        }

        function isStartOfParenthesizedOrFunctionType() {
            nextToken();
            return token === SyntaxKind.CloseParenToken || isStartOfParameter() || isStartOfType();
        }

        function parseArrayTypeOrHigher(): TypeNode {
            let type = parseNonArrayType();
            while (!scanner.hasPrecedingLineBreak() && parseOptional(SyntaxKind.OpenBracketToken)) {
                parseExpected(SyntaxKind.CloseBracketToken);
                const node = <ArrayTypeNode>createNode(SyntaxKind.ArrayType, type.pos);
                node.elementType = type;
                type = finishNode(node);
            }
            return type;
        }

        function parseUnionOrIntersectionType(kind: SyntaxKind, parseConstituentType: () => TypeNode, operator: SyntaxKind): TypeNode {
            let type = parseConstituentType();
            if (token === operator) {
                const types = <NodeArray<TypeNode>>[type];
                types.pos = type.pos;
                while (parseOptional(operator)) {
                    types.push(parseConstituentType());
                }
                types.end = getNodeEnd();
                const node = <UnionOrIntersectionTypeNode>createNode(kind, type.pos);
                node.types = types;
                type = finishNode(node);
            }
            return type;
        }

        function parseIntersectionTypeOrHigher(): TypeNode {
            return parseUnionOrIntersectionType(SyntaxKind.IntersectionType, parseArrayTypeOrHigher, SyntaxKind.AmpersandToken);
        }

        function parseUnionTypeOrHigher(): TypeNode {
            return parseUnionOrIntersectionType(SyntaxKind.UnionType, parseIntersectionTypeOrHigher, SyntaxKind.BarToken);
        }

        function isStartOfFunctionType(): boolean {
            if (token === SyntaxKind.LessThanToken) {
                return true;
            }

            return token === SyntaxKind.OpenParenToken && lookAhead(isUnambiguouslyStartOfFunctionType);
        }

        function isUnambiguouslyStartOfFunctionType() {
            nextToken();
            if (token === SyntaxKind.CloseParenToken || token === SyntaxKind.DotDotDotToken) {
                // ( )
                // ( ...
                return true;
            }
            if (isIdentifier() || isModifierKind(token)) {
                nextToken();
                if (token === SyntaxKind.ColonToken || token === SyntaxKind.CommaToken ||
                    token === SyntaxKind.QuestionToken || token === SyntaxKind.EqualsToken ||
                    isIdentifier() || isModifierKind(token)) {
                    // ( id :
                    // ( id ,
                    // ( id ?
                    // ( id =
                    // ( modifier id
                    return true;
                }
                if (token === SyntaxKind.CloseParenToken) {
                    nextToken();
                    if (token === SyntaxKind.EqualsGreaterThanToken) {
                        // ( id ) =>
                        return true;
                    }
                }
            }
            return false;
        }

        function parseTypeOrTypePredicate(): TypeNode {
            const typePredicateVariable = isIdentifier() && tryParse(parseTypePredicatePrefix);
            const type = parseType();
            if (typePredicateVariable) {
                const node = <TypePredicateNode>createNode(SyntaxKind.TypePredicate, typePredicateVariable.pos);
                node.parameterName = typePredicateVariable;
                node.type = type;
                return finishNode(node);
            }
            else {
                return type;
            }
        }

        function parseTypePredicatePrefix() {
            const id = parseIdentifier();
            if (token === SyntaxKind.IsKeyword && !scanner.hasPrecedingLineBreak()) {
                nextToken();
                return id;
            }
        }

        function parseType(): TypeNode {
            // The rules about 'yield' only apply to actual code/expression contexts.  They don't
            // apply to 'type' contexts.  So we disable these parameters here before moving on.
            return doOutsideOfContext(ParserContextFlags.TypeExcludesFlags, parseTypeWorker);
        }

        function parseTypeWorker(): TypeNode {
            if (isStartOfFunctionType()) {
                return parseFunctionOrConstructorType(SyntaxKind.FunctionType);
            }
            if (token === SyntaxKind.NewKeyword) {
                return parseFunctionOrConstructorType(SyntaxKind.ConstructorType);
            }
            return parseUnionTypeOrHigher();
        }

        function parseTypeAnnotation(): TypeNode {
            return parseOptional(SyntaxKind.ColonToken) ? parseType() : undefined;
        }

        // EXPRESSIONS
        function isStartOfLeftHandSideExpression(): boolean {
            switch (token) {
                case SyntaxKind.ThisKeyword:
                case SyntaxKind.SuperKeyword:
                case SyntaxKind.NullKeyword:
                case SyntaxKind.TrueKeyword:
                case SyntaxKind.FalseKeyword:
                case SyntaxKind.NumericLiteral:
                case SyntaxKind.StringLiteral:
                case SyntaxKind.NoSubstitutionTemplateLiteral:
                case SyntaxKind.TemplateHead:
                case SyntaxKind.OpenParenToken:
                case SyntaxKind.OpenBracketToken:
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.FunctionKeyword:
                case SyntaxKind.ClassKeyword:
                case SyntaxKind.NewKeyword:
                case SyntaxKind.SlashToken:
                case SyntaxKind.SlashEqualsToken:
                case SyntaxKind.Identifier:
                    return true;
                default:
                    return isIdentifier();
            }
        }

        function isStartOfExpression(): boolean {
            if (isStartOfLeftHandSideExpression()) {
                return true;
            }

            switch (token) {
                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                case SyntaxKind.TildeToken:
                case SyntaxKind.ExclamationToken:
                case SyntaxKind.DeleteKeyword:
                case SyntaxKind.TypeOfKeyword:
                case SyntaxKind.VoidKeyword:
                case SyntaxKind.PlusPlusToken:
                case SyntaxKind.MinusMinusToken:
                case SyntaxKind.LessThanToken:
                case SyntaxKind.AwaitKeyword:
                case SyntaxKind.YieldKeyword:
                    // Yield/await always starts an expression.  Either it is an identifier (in which case
                    // it is definitely an expression).  Or it's a keyword (either because we're in
                    // a generator or async function, or in strict mode (or both)) and it started a yield or await expression.
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

        function isStartOfExpressionStatement(): boolean {
            // As per the grammar, none of '{' or 'function' or 'class' can start an expression statement.
            return token !== SyntaxKind.OpenBraceToken &&
                token !== SyntaxKind.FunctionKeyword &&
                token !== SyntaxKind.ClassKeyword &&
                token !== SyntaxKind.AtToken &&
                isStartOfExpression();
        }

        function parseExpression(): Expression {
            // Expression[in]:
            //      AssignmentExpression[in]
            //      Expression[in] , AssignmentExpression[in]

            // clear the decorator context when parsing Expression, as it should be unambiguous when parsing a decorator
            const saveDecoratorContext = inDecoratorContext();
            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ false);
            }

            let expr = parseAssignmentExpressionOrHigher();
            let operatorToken: Node;
            while ((operatorToken = parseOptionalToken(SyntaxKind.CommaToken))) {
                expr = makeBinaryExpression(expr, operatorToken, parseAssignmentExpressionOrHigher());
            }

            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ true);
            }
            return expr;
        }

        function parseInitializer(inParameter: boolean): Expression {
            if (token !== SyntaxKind.EqualsToken) {
                // It's not uncommon during typing for the user to miss writing the '=' token.  Check if
                // there is no newline after the last token and if we're on an expression.  If so, parse
                // this as an equals-value clause with a missing equals.
                // NOTE: There are two places where we allow equals-value clauses.  The first is in a
                // variable declarator.  The second is with a parameter.  For variable declarators
                // it's more likely that a { would be a allowed (as an object literal).  While this
                // is also allowed for parameters, the risk is that we consume the { as an object
                // literal when it really will be for the block following the parameter.
                if (scanner.hasPrecedingLineBreak() || (inParameter && token === SyntaxKind.OpenBraceToken) || !isStartOfExpression()) {
                    // preceding line break, open brace in a parameter (likely a function body) or current token is not an expression -
                    // do not try to parse initializer
                    return undefined;
                }
            }

            // Initializer[In, Yield] :
            //     = AssignmentExpression[?In, ?Yield]

            parseExpected(SyntaxKind.EqualsToken);
            return parseAssignmentExpressionOrHigher();
        }

        function parseAssignmentExpressionOrHigher(): Expression {
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
            const arrowExpression = tryParseParenthesizedArrowFunctionExpression();
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
            const expr = parseBinaryExpressionOrHigher(/*precedence*/ 0);

            // To avoid a look-ahead, we did not handle the case of an arrow function with a single un-parenthesized
            // parameter ('x => ...') above. We handle it here by checking if the parsed expression was a single
            // identifier and the current token is an arrow.
            if (expr.kind === SyntaxKind.Identifier && token === SyntaxKind.EqualsGreaterThanToken) {
                return parseSimpleArrowFunctionExpression(<Identifier>expr);
            }

            // Now see if we might be in cases '2' or '3'.
            // If the expression was a LHS expression, and we have an assignment operator, then
            // we're in '2' or '3'. Consume the assignment and return.
            //
            // Note: we call reScanGreaterToken so that we get an appropriately merged token
            // for cases like > > =  becoming >>=
            if (isLeftHandSideExpression(expr) && isAssignmentOperator(reScanGreaterToken())) {
                return makeBinaryExpression(expr, parseTokenNode(), parseAssignmentExpressionOrHigher());
            }

            // It wasn't an assignment or a lambda.  This is a conditional expression:
            return parseConditionalExpressionRest(expr);
        }

        function isYieldExpression(): boolean {
            if (token === SyntaxKind.YieldKeyword) {
                // If we have a 'yield' keyword, and htis is a context where yield expressions are
                // allowed, then definitely parse out a yield expression.
                if (inYieldContext()) {
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
                return lookAhead(nextTokenIsIdentifierOrKeywordOrNumberOnSameLine);
            }

            return false;
        }

        function nextTokenIsIdentifierOnSameLine() {
            nextToken();
            return !scanner.hasPrecedingLineBreak() && isIdentifier();
        }

        function parseYieldExpression(): YieldExpression {
            const node = <YieldExpression>createNode(SyntaxKind.YieldExpression);

            // YieldExpression[In] :
            //      yield
            //      yield [no LineTerminator here] [Lexical goal InputElementRegExp]AssignmentExpression[?In, Yield]
            //      yield [no LineTerminator here] * [Lexical goal InputElementRegExp]AssignmentExpression[?In, Yield]
            nextToken();

            if (!scanner.hasPrecedingLineBreak() &&
                (token === SyntaxKind.AsteriskToken || isStartOfExpression())) {
                node.asteriskToken = parseOptionalToken(SyntaxKind.AsteriskToken);
                node.expression = parseAssignmentExpressionOrHigher();
                return finishNode(node);
            }
            else {
                // if the next token is not on the same line as yield.  or we don't have an '*' or
                // the start of an expressin, then this is just a simple "yield" expression.
                return finishNode(node);
            }
        }

        function parseSimpleArrowFunctionExpression(identifier: Identifier): Expression {
            Debug.assert(token === SyntaxKind.EqualsGreaterThanToken, "parseSimpleArrowFunctionExpression should only have been called if we had a =>");

            const node = <ArrowFunction>createNode(SyntaxKind.ArrowFunction, identifier.pos);

            const parameter = <ParameterDeclaration>createNode(SyntaxKind.Parameter, identifier.pos);
            parameter.name = identifier;
            finishNode(parameter);

            node.parameters = <NodeArray<ParameterDeclaration>>[parameter];
            node.parameters.pos = parameter.pos;
            node.parameters.end = parameter.end;

            node.equalsGreaterThanToken = parseExpectedToken(SyntaxKind.EqualsGreaterThanToken, /*reportAtCurrentPosition*/ false, Diagnostics._0_expected, "=>");
            node.body = parseArrowFunctionExpressionBody(/*isAsync*/ false);

            return finishNode(node);
        }

        function tryParseParenthesizedArrowFunctionExpression(): Expression {
            const triState = isParenthesizedArrowFunctionExpression();
            if (triState === Tristate.False) {
                // It's definitely not a parenthesized arrow function expression.
                return undefined;
            }

            // If we definitely have an arrow function, then we can just parse one, not requiring a
            // following => or { token. Otherwise, we *might* have an arrow function.  Try to parse
            // it out, but don't allow any ambiguity, and return 'undefined' if this could be an
            // expression instead.
            const arrowFunction = triState === Tristate.True
                ? parseParenthesizedArrowFunctionExpressionHead(/*allowAmbiguity*/ true)
                : tryParse(parsePossibleParenthesizedArrowFunctionExpressionHead);

            if (!arrowFunction) {
                // Didn't appear to actually be a parenthesized arrow function.  Just bail out.
                return undefined;
            }

            const isAsync = !!(arrowFunction.flags & NodeFlags.Async);

            // If we have an arrow, then try to parse the body. Even if not, try to parse if we
            // have an opening brace, just in case we're in an error state.
            const lastToken = token;
            arrowFunction.equalsGreaterThanToken = parseExpectedToken(SyntaxKind.EqualsGreaterThanToken, /*reportAtCurrentPosition*/false, Diagnostics._0_expected, "=>");
            arrowFunction.body = (lastToken === SyntaxKind.EqualsGreaterThanToken || lastToken === SyntaxKind.OpenBraceToken)
                ? parseArrowFunctionExpressionBody(isAsync)
                : parseIdentifier();

            return finishNode(arrowFunction);
        }

        //  True        -> We definitely expect a parenthesized arrow function here.
        //  False       -> There *cannot* be a parenthesized arrow function here.
        //  Unknown     -> There *might* be a parenthesized arrow function here.
        //                 Speculatively look ahead to be sure, and rollback if not.
        function isParenthesizedArrowFunctionExpression(): Tristate {
            if (token === SyntaxKind.OpenParenToken || token === SyntaxKind.LessThanToken || token === SyntaxKind.AsyncKeyword) {
                return lookAhead(isParenthesizedArrowFunctionExpressionWorker);
            }

            if (token === SyntaxKind.EqualsGreaterThanToken) {
                // ERROR RECOVERY TWEAK:
                // If we see a standalone => try to parse it as an arrow function expression as that's
                // likely what the user intended to write.
                return Tristate.True;
            }
            // Definitely not a parenthesized arrow function.
            return Tristate.False;
        }

        function isParenthesizedArrowFunctionExpressionWorker() {
            if (token === SyntaxKind.AsyncKeyword) {
                nextToken();
                if (scanner.hasPrecedingLineBreak()) {
                    return Tristate.False;
                }
                if (token !== SyntaxKind.OpenParenToken && token !== SyntaxKind.LessThanToken) {
                    return Tristate.False;
                }
            }

            const first = token;
            const second = nextToken();

            if (first === SyntaxKind.OpenParenToken) {
                if (second === SyntaxKind.CloseParenToken) {
                    // Simple cases: "() =>", "(): ", and  "() {".
                    // This is an arrow function with no parameters.
                    // The last one is not actually an arrow function,
                    // but this is probably what the user intended.
                    const third = nextToken();
                    switch (third) {
                        case SyntaxKind.EqualsGreaterThanToken:
                        case SyntaxKind.ColonToken:
                        case SyntaxKind.OpenBraceToken:
                            return Tristate.True;
                        default:
                            return Tristate.False;
                    }
                }

                // If encounter "([" or "({", this could be the start of a binding pattern.
                // Examples:
                //      ([ x ]) => { }
                //      ({ x }) => { }
                //      ([ x ])
                //      ({ x })
                if (second === SyntaxKind.OpenBracketToken || second === SyntaxKind.OpenBraceToken) {
                    return Tristate.Unknown;
                }

                // Simple case: "(..."
                // This is an arrow function with a rest parameter.
                if (second === SyntaxKind.DotDotDotToken) {
                    return Tristate.True;
                }

                // If we had "(" followed by something that's not an identifier,
                // then this definitely doesn't look like a lambda.
                // Note: we could be a little more lenient and allow
                // "(public" or "(private". These would not ever actually be allowed,
                // but we could provide a good error message instead of bailing out.
                if (!isIdentifier()) {
                    return Tristate.False;
                }

                // If we have something like "(a:", then we must have a
                // type-annotated parameter in an arrow function expression.
                if (nextToken() === SyntaxKind.ColonToken) {
                    return Tristate.True;
                }

                // This *could* be a parenthesized arrow function.
                // Return Unknown to let the caller know.
                return Tristate.Unknown;
            }
            else {
                Debug.assert(first === SyntaxKind.LessThanToken);

                // If we have "<" not followed by an identifier,
                // then this definitely is not an arrow function.
                if (!isIdentifier()) {
                    return Tristate.False;
                }

                // JSX overrides
                if (sourceFile.languageVariant === LanguageVariant.JSX) {
                    const isArrowFunctionInJsx = lookAhead(() => {
                        const third = nextToken();
                        if (third === SyntaxKind.ExtendsKeyword) {
                            const fourth = nextToken();
                            switch (fourth) {
                                case SyntaxKind.EqualsToken:
                                case SyntaxKind.GreaterThanToken:
                                    return false;
                                default:
                                    return true;
                            }
                        }
                        else if (third === SyntaxKind.CommaToken) {
                            return true;
                        }
                        return false;
                    });

                    if (isArrowFunctionInJsx) {
                        return Tristate.True;
                    }

                    return Tristate.False;
                }

                // This *could* be a parenthesized arrow function.
                return Tristate.Unknown;
            }
        }

        function parsePossibleParenthesizedArrowFunctionExpressionHead(): ArrowFunction {
            return parseParenthesizedArrowFunctionExpressionHead(/*allowAmbiguity*/ false);
        }

        function parseParenthesizedArrowFunctionExpressionHead(allowAmbiguity: boolean): ArrowFunction {
            const node = <ArrowFunction>createNode(SyntaxKind.ArrowFunction);
            setModifiers(node, parseModifiersForArrowFunction());
            const isAsync = !!(node.flags & NodeFlags.Async);

            // Arrow functions are never generators.
            //
            // If we're speculatively parsing a signature for a parenthesized arrow function, then
            // we have to have a complete parameter list.  Otherwise we might see something like
            // a => (b => c)
            // And think that "(b =>" was actually a parenthesized arrow function with a missing
            // close paren.
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ false, /*awaitContext*/ isAsync, /*requireCompleteParameterList*/ !allowAmbiguity, node);

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
            if (!allowAmbiguity && token !== SyntaxKind.EqualsGreaterThanToken && token !== SyntaxKind.OpenBraceToken) {
                // Returning undefined here will cause our caller to rewind to where we started from.
                return undefined;
            }

            return node;
        }

        function parseArrowFunctionExpressionBody(isAsync: boolean): Block | Expression {
            if (token === SyntaxKind.OpenBraceToken) {
                return parseFunctionBlock(/*allowYield*/ false, /*allowAwait*/ isAsync, /*ignoreMissingOpenBrace*/ false);
            }

            if (token !== SyntaxKind.SemicolonToken &&
                token !== SyntaxKind.FunctionKeyword &&
                token !== SyntaxKind.ClassKeyword &&
                isStartOfStatement() &&
                !isStartOfExpressionStatement()) {
                // Check if we got a plain statement (i.e. no expression-statements, no function/class expressions/declarations)
                //
                // Here we try to recover from a potential error situation in the case where the
                // user meant to supply a block. For example, if the user wrote:
                //
                //  a =>
                //      let v = 0;
                //  }
                //
                // they may be missing an open brace.  Check to see if that's the case so we can
                // try to recover better.  If we don't do this, then the next close curly we see may end
                // up preemptively closing the containing construct.
                //
                // Note: even when 'ignoreMissingOpenBrace' is passed as true, parseBody will still error.
                return parseFunctionBlock(/*allowYield*/ false, /*allowAwait*/ isAsync, /*ignoreMissingOpenBrace*/ true);
            }

            return isAsync
                ? doInAwaitContext(parseAssignmentExpressionOrHigher)
                : doOutsideOfAwaitContext(parseAssignmentExpressionOrHigher);
        }

        function parseConditionalExpressionRest(leftOperand: Expression): Expression {
            // Note: we are passed in an expression which was produced from parseBinaryExpressionOrHigher.
            const questionToken = parseOptionalToken(SyntaxKind.QuestionToken);
            if (!questionToken) {
                return leftOperand;
            }

            // Note: we explicitly 'allowIn' in the whenTrue part of the condition expression, and
            // we do not that for the 'whenFalse' part.
            const node = <ConditionalExpression>createNode(SyntaxKind.ConditionalExpression, leftOperand.pos);
            node.condition = leftOperand;
            node.questionToken = questionToken;
            node.whenTrue = doOutsideOfContext(disallowInAndDecoratorContext, parseAssignmentExpressionOrHigher);
            node.colonToken = parseExpectedToken(SyntaxKind.ColonToken, /*reportAtCurrentPosition*/ false,
                Diagnostics._0_expected, tokenToString(SyntaxKind.ColonToken));
            node.whenFalse = parseAssignmentExpressionOrHigher();
            return finishNode(node);
        }

        function parseBinaryExpressionOrHigher(precedence: number): Expression {
            const leftOperand = parseUnaryExpressionOrHigher();
            return parseBinaryExpressionRest(precedence, leftOperand);
        }

        function isInOrOfKeyword(t: SyntaxKind) {
            return t === SyntaxKind.InKeyword || t === SyntaxKind.OfKeyword;
        }

        function parseBinaryExpressionRest(precedence: number, leftOperand: Expression): Expression {
            while (true) {
                // We either have a binary operator here, or we're finished.  We call
                // reScanGreaterToken so that we merge token sequences like > and = into >=

                reScanGreaterToken();
                const newPrecedence = getBinaryOperatorPrecedence();

                // Check the precedence to see if we should "take" this operator
                // - For left associative operator (all operator but **), consume the operator,
                //   recursively call the function below, and parse binaryExpression as a rightOperand
                //   of the caller if the new precendence of the operator is greater then or equal to the current precendence.
                //   For example:
                //      a - b - c;
                //            ^token; leftOperand = b. Return b to the caller as a rightOperand
                //      a * b - c
                //            ^token; leftOperand = b. Return b to the caller as a rightOperand
                //      a - b * c;
                //            ^token; leftOperand = b. Return b * c to the caller as a rightOperand
                // - For right associative operator (**), consume the operator, recursively call the function
                //   and parse binaryExpression as a rightOperand of the caller if the new precendence of
                //   the operator is strictly grater than the current precendence
                //   For example:
                //      a ** b ** c;
                //             ^^token; leftOperand = b. Return b ** c to the caller as a rightOperand
                //      a - b ** c;
                //            ^^token; leftOperand = b. Return b ** c to the caller as a rightOperand
                //      a ** b - c
                //             ^token; leftOperand = b. Return b to the caller as a rightOperand
                const consumeCurrentOperator = token === SyntaxKind.AsteriskAsteriskToken ?
                    newPrecedence >= precedence :
                    newPrecedence > precedence;

                if (!consumeCurrentOperator) {
                    break;
                }

                if (token === SyntaxKind.InKeyword && inDisallowInContext()) {
                    break;
                }

                if (token === SyntaxKind.AsKeyword) {
                    // Make sure we *do* perform ASI for constructs like this:
                    //    var x = foo
                    //    as (Bar)
                    // This should be parsed as an initialized variable, followed
                    // by a function call to 'as' with the argument 'Bar'
                    if (scanner.hasPrecedingLineBreak()) {
                        break;
                    }
                    else {
                        nextToken();
                        leftOperand = makeAsExpression(leftOperand, parseType());
                    }
                }
                else {
                    leftOperand = makeBinaryExpression(leftOperand, parseTokenNode(), parseBinaryExpressionOrHigher(newPrecedence));
                }
            }

            return leftOperand;
        }

        function isBinaryOperator() {
            if (inDisallowInContext() && token === SyntaxKind.InKeyword) {
                return false;
            }

            return getBinaryOperatorPrecedence() > 0;
        }

        function getBinaryOperatorPrecedence(): number {
            switch (token) {
                case SyntaxKind.BarBarToken:
                    return 1;
                case SyntaxKind.AmpersandAmpersandToken:
                    return 2;
                case SyntaxKind.BarToken:
                    return 3;
                case SyntaxKind.CaretToken:
                    return 4;
                case SyntaxKind.AmpersandToken:
                    return 5;
                case SyntaxKind.EqualsEqualsToken:
                case SyntaxKind.ExclamationEqualsToken:
                case SyntaxKind.EqualsEqualsEqualsToken:
                case SyntaxKind.ExclamationEqualsEqualsToken:
                    return 6;
                case SyntaxKind.LessThanToken:
                case SyntaxKind.GreaterThanToken:
                case SyntaxKind.LessThanEqualsToken:
                case SyntaxKind.GreaterThanEqualsToken:
                case SyntaxKind.InstanceOfKeyword:
                case SyntaxKind.InKeyword:
                case SyntaxKind.AsKeyword:
                    return 7;
                case SyntaxKind.LessThanLessThanToken:
                case SyntaxKind.GreaterThanGreaterThanToken:
                case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                    return 8;
                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                    return 9;
                case SyntaxKind.AsteriskToken:
                case SyntaxKind.SlashToken:
                case SyntaxKind.PercentToken:
                    return 10;
                case SyntaxKind.AsteriskAsteriskToken:
                    return 11;
            }

            // -1 is lower than all other precedences.  Returning it will cause binary expression
            // parsing to stop.
            return -1;
        }

        function makeBinaryExpression(left: Expression, operatorToken: Node, right: Expression): BinaryExpression {
            const node = <BinaryExpression>createNode(SyntaxKind.BinaryExpression, left.pos);
            node.left = left;
            node.operatorToken = operatorToken;
            node.right = right;
            return finishNode(node);
        }

        function makeAsExpression(left: Expression, right: TypeNode): AsExpression {
            const node = <AsExpression>createNode(SyntaxKind.AsExpression, left.pos);
            node.expression = left;
            node.type = right;
            return finishNode(node);
        }

        function parsePrefixUnaryExpression() {
            const node = <PrefixUnaryExpression>createNode(SyntaxKind.PrefixUnaryExpression);
            node.operator = token;
            nextToken();
            node.operand = parseSimpleUnaryExpression();

            return finishNode(node);
        }

        function parseDeleteExpression() {
            const node = <DeleteExpression>createNode(SyntaxKind.DeleteExpression);
            nextToken();
            node.expression = parseSimpleUnaryExpression();
            return finishNode(node);
        }

        function parseTypeOfExpression() {
            const node = <TypeOfExpression>createNode(SyntaxKind.TypeOfExpression);
            nextToken();
            node.expression = parseSimpleUnaryExpression();
            return finishNode(node);
        }

        function parseVoidExpression() {
            const node = <VoidExpression>createNode(SyntaxKind.VoidExpression);
            nextToken();
            node.expression = parseSimpleUnaryExpression();
            return finishNode(node);
        }

        function isAwaitExpression(): boolean {
            if (token === SyntaxKind.AwaitKeyword) {
                if (inAwaitContext()) {
                    return true;
                }

                // here we are using similar heuristics as 'isYieldExpression'
                return lookAhead(nextTokenIsIdentifierOnSameLine);
            }

            return false;
        }

        function parseAwaitExpression() {
            const node = <AwaitExpression>createNode(SyntaxKind.AwaitExpression);
            nextToken();
            node.expression = parseSimpleUnaryExpression();
            return finishNode(node);
        }

        /**
         * Parse ES7 unary expression and await expression
         *
         * ES7 UnaryExpression:
         *      1) SimpleUnaryExpression[?yield]
         *      2) IncrementExpression[?yield] ** UnaryExpression[?yield]
         */
        function parseUnaryExpressionOrHigher(): UnaryExpression | BinaryExpression {
            if (isAwaitExpression()) {
                return parseAwaitExpression();
            }

            if (isIncrementExpression()) {
                const incrementExpression = parseIncrementExpression();
                return token === SyntaxKind.AsteriskAsteriskToken ?
                    <BinaryExpression>parseBinaryExpressionRest(getBinaryOperatorPrecedence(), incrementExpression) :
                    incrementExpression;
            }

            const unaryOperator = token;
            const simpleUnaryExpression = parseSimpleUnaryExpression();
            if (token === SyntaxKind.AsteriskAsteriskToken) {
                const start = skipTrivia(sourceText, simpleUnaryExpression.pos);
                if (simpleUnaryExpression.kind === SyntaxKind.TypeAssertionExpression) {
                    parseErrorAtPosition(start, simpleUnaryExpression.end - start, Diagnostics.A_type_assertion_expression_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses);
                }
                else {
                    parseErrorAtPosition(start, simpleUnaryExpression.end - start, Diagnostics.An_unary_expression_with_the_0_operator_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses, tokenToString(unaryOperator));
                }
            }
            return simpleUnaryExpression;
        }

        /**
         * Parse ES7 simple-unary expression or higher:
         *
         * ES7 SimpleUnaryExpression:
         *      1) IncrementExpression[?yield]
         *      2) delete UnaryExpression[?yield]
         *      3) void UnaryExpression[?yield]
         *      4) typeof UnaryExpression[?yield]
         *      5) + UnaryExpression[?yield]
         *      6) - UnaryExpression[?yield]
         *      7) ~ UnaryExpression[?yield]
         *      8) ! UnaryExpression[?yield]
         */
        function parseSimpleUnaryExpression(): UnaryExpression {
            switch (token) {
                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                case SyntaxKind.TildeToken:
                case SyntaxKind.ExclamationToken:
                    return parsePrefixUnaryExpression();
                case SyntaxKind.DeleteKeyword:
                    return parseDeleteExpression();
                case SyntaxKind.TypeOfKeyword:
                    return parseTypeOfExpression();
                case SyntaxKind.VoidKeyword:
                    return parseVoidExpression();
                case SyntaxKind.LessThanToken:
                    // This is modified UnaryExpression grammar in TypeScript
                    //  UnaryExpression (modified):
                    //      < type > UnaryExpression
                    return parseTypeAssertion();
                default:
                    return parseIncrementExpression();
            }
        }

        /**
         * Check if the current token can possibly be an ES7 increment expression.
         *
         * ES7 IncrementExpression:
         *      LeftHandSideExpression[?Yield]
         *      LeftHandSideExpression[?Yield][no LineTerminator here]++
         *      LeftHandSideExpression[?Yield][no LineTerminator here]--
         *      ++LeftHandSideExpression[?Yield]
         *      --LeftHandSideExpression[?Yield]
         */
        function isIncrementExpression(): boolean {
            // This function is called inside parseUnaryExpression to decide
            // whether to call parseSimpleUnaryExpression or call parseIncrmentExpression directly
            switch (token) {
                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                case SyntaxKind.TildeToken:
                case SyntaxKind.ExclamationToken:
                case SyntaxKind.DeleteKeyword:
                case SyntaxKind.TypeOfKeyword:
                case SyntaxKind.VoidKeyword:
                    return false;
                case SyntaxKind.LessThanToken:
                    // If we are not in JSX context, we are parsing TypeAssertion which is an UnaryExpression
                    if (sourceFile.languageVariant !== LanguageVariant.JSX) {
                        return false;
                    }
                    // We are in JSX context and the token is part of JSXElement.
                    // Fall through
                default:
                    return true;
            }
        }

        /**
         * Parse ES7 IncrementExpression. IncrementExpression is used instead of ES6's PostFixExpression.
         *
         * ES7 IncrementExpression[yield]:
         *      1) LeftHandSideExpression[?yield]
         *      2) LeftHandSideExpression[?yield] [[no LineTerminator here]]++
         *      3) LeftHandSideExpression[?yield] [[no LineTerminator here]]--
         *      4) ++LeftHandSideExpression[?yield]
         *      5) --LeftHandSideExpression[?yield]
         * In TypeScript (2), (3) are parsed as PostfixUnaryExpression. (4), (5) are parsed as PrefixUnaryExpression
         */
        function parseIncrementExpression(): IncrementExpression {
            if (token === SyntaxKind.PlusPlusToken || token === SyntaxKind.MinusMinusToken) {
                const node = <PrefixUnaryExpression>createNode(SyntaxKind.PrefixUnaryExpression);
                node.operator = token;
                nextToken();
                node.operand = parseLeftHandSideExpressionOrHigher();
                return finishNode(node);
            }
            else if (sourceFile.languageVariant === LanguageVariant.JSX && token === SyntaxKind.LessThanToken && lookAhead(nextTokenIsIdentifierOrKeyword)) {
                // JSXElement is part of primaryExpression
                return parseJsxElementOrSelfClosingElement(/*inExpressionContext*/ true);
            }

            const expression = parseLeftHandSideExpressionOrHigher();

            Debug.assert(isLeftHandSideExpression(expression));
            if ((token === SyntaxKind.PlusPlusToken || token === SyntaxKind.MinusMinusToken) && !scanner.hasPrecedingLineBreak()) {
                const node = <PostfixUnaryExpression>createNode(SyntaxKind.PostfixUnaryExpression, expression.pos);
                node.operand = expression;
                node.operator = token;
                nextToken();
                return finishNode(node);
            }

            return expression;
        }

        function parseLeftHandSideExpressionOrHigher(): LeftHandSideExpression {
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
            const expression = token === SyntaxKind.SuperKeyword
                ? parseSuperExpression()
                : parseMemberExpressionOrHigher();

            // Now, we *may* be complete.  However, we might have consumed the start of a
            // CallExpression.  As such, we need to consume the rest of it here to be complete.
            return parseCallExpressionRest(expression);
        }

        function parseMemberExpressionOrHigher(): MemberExpression {
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
            const expression = parsePrimaryExpression();
            return parseMemberExpressionRest(expression);
        }

        function parseSuperExpression(): MemberExpression {
            const expression = parseTokenNode<PrimaryExpression>();
            if (token === SyntaxKind.OpenParenToken || token === SyntaxKind.DotToken || token === SyntaxKind.OpenBracketToken) {
                return expression;
            }

            // If we have seen "super" it must be followed by '(' or '.'.
            // If it wasn't then just try to parse out a '.' and report an error.
            const node = <PropertyAccessExpression>createNode(SyntaxKind.PropertyAccessExpression, expression.pos);
            node.expression = expression;
            node.dotToken = parseExpectedToken(SyntaxKind.DotToken, /*reportAtCurrentPosition*/ false, Diagnostics.super_must_be_followed_by_an_argument_list_or_member_access);
            node.name = parseRightSideOfDot(/*allowIdentifierNames*/ true);
            return finishNode(node);
        }

        function tagNamesAreEquivalent(lhs: EntityName, rhs: EntityName): boolean {
            if (lhs.kind !== rhs.kind) {
                return false;
            }

            if (lhs.kind === SyntaxKind.Identifier) {
                return (<Identifier>lhs).text === (<Identifier>rhs).text;
            }

            return (<QualifiedName>lhs).right.text === (<QualifiedName>rhs).right.text &&
                tagNamesAreEquivalent((<QualifiedName>lhs).left, (<QualifiedName>rhs).left);
        }


        function parseJsxElementOrSelfClosingElement(inExpressionContext: boolean): JsxElement | JsxSelfClosingElement {
            const opening = parseJsxOpeningOrSelfClosingElement(inExpressionContext);
            let result: JsxElement | JsxSelfClosingElement;
            if (opening.kind === SyntaxKind.JsxOpeningElement) {
                const node = <JsxElement>createNode(SyntaxKind.JsxElement, opening.pos);
                node.openingElement = opening;

                node.children = parseJsxChildren(node.openingElement.tagName);
                node.closingElement = parseJsxClosingElement(inExpressionContext);

                if (!tagNamesAreEquivalent(node.openingElement.tagName, node.closingElement.tagName)) {
                    parseErrorAtPosition(node.closingElement.pos, node.closingElement.end - node.closingElement.pos, Diagnostics.Expected_corresponding_JSX_closing_tag_for_0, getTextOfNodeFromSourceText(sourceText, node.openingElement.tagName));
                }

                result = finishNode(node);
            }
            else {
                Debug.assert(opening.kind === SyntaxKind.JsxSelfClosingElement);
                // Nothing else to do for self-closing elements
                result = <JsxSelfClosingElement>opening;
            }

            // If the user writes the invalid code '<div></div><div></div>' in an expression context (i.e. not wrapped in
            // an enclosing tag), we'll naively try to parse   ^ this as a 'less than' operator and the remainder of the tag
            // as garbage, which will cause the formatter to badly mangle the JSX. Perform a speculative parse of a JSX
            // element if we see a < token so that we can wrap it in a synthetic binary expression so the formatter
            // does less damage and we can report a better error.
            // Since JSX elements are invalid < operands anyway, this lookahead parse will only occur in error scenarios
            // of one sort or another.
            if (inExpressionContext && token === SyntaxKind.LessThanToken) {
                const invalidElement = tryParse(() => parseJsxElementOrSelfClosingElement(/*inExpressionContext*/true));
                if (invalidElement) {
                    parseErrorAtCurrentToken(Diagnostics.JSX_expressions_must_have_one_parent_element);
                    const badNode = <BinaryExpression>createNode(SyntaxKind.BinaryExpression, result.pos);
                    badNode.end = invalidElement.end;
                    badNode.left = result;
                    badNode.right = invalidElement;
                    badNode.operatorToken = createMissingNode(SyntaxKind.CommaToken, /*reportAtCurrentPosition*/ false, /*diagnosticMessage*/ undefined);
                    badNode.operatorToken.pos = badNode.operatorToken.end = badNode.right.pos;
                    return <JsxElement><Node>badNode;
                }
            }

            return result;
        }

        function parseJsxText(): JsxText {
            const node = <JsxText>createNode(SyntaxKind.JsxText, scanner.getStartPos());
            token = scanner.scanJsxToken();
            return finishNode(node);
        }

        function parseJsxChild(): JsxChild {
            switch (token) {
                case SyntaxKind.JsxText:
                    return parseJsxText();
                case SyntaxKind.OpenBraceToken:
                    return parseJsxExpression(/*inExpressionContext*/ false);
                case SyntaxKind.LessThanToken:
                    return parseJsxElementOrSelfClosingElement(/*inExpressionContext*/ false);
            }
            Debug.fail("Unknown JSX child kind " + token);
        }

        function parseJsxChildren(openingTagName: EntityName): NodeArray<JsxChild> {
            const result = <NodeArray<JsxChild>>[];
            result.pos = scanner.getStartPos();
            const saveParsingContext = parsingContext;
            parsingContext |= 1 << ParsingContext.JsxChildren;

            while (true) {
                token = scanner.reScanJsxToken();
                if (token === SyntaxKind.LessThanSlashToken) {
                    // Closing tag
                    break;
                }
                else if (token === SyntaxKind.EndOfFileToken) {
                    // If we hit EOF, issue the error at the tag that lacks the closing element
                    // rather than at the end of the file (which is useless)
                    parseErrorAtPosition(openingTagName.pos, openingTagName.end - openingTagName.pos, Diagnostics.JSX_element_0_has_no_corresponding_closing_tag, getTextOfNodeFromSourceText(sourceText, openingTagName));
                    break;
                }
                result.push(parseJsxChild());
            }

            result.end = scanner.getTokenPos();

            parsingContext = saveParsingContext;

            return result;
        }

        function parseJsxOpeningOrSelfClosingElement(inExpressionContext: boolean): JsxOpeningElement | JsxSelfClosingElement {
            const fullStart = scanner.getStartPos();

            parseExpected(SyntaxKind.LessThanToken);

            const tagName = parseJsxElementName();

            const attributes = parseList(ParsingContext.JsxAttributes, parseJsxAttribute);
            let node: JsxOpeningLikeElement;

            if (token === SyntaxKind.GreaterThanToken) {
                // Closing tag, so scan the immediately-following text with the JSX scanning instead
                // of regular scanning to avoid treating illegal characters (e.g. '#') as immediate
                // scanning errors
                node = <JsxOpeningElement>createNode(SyntaxKind.JsxOpeningElement, fullStart);
                scanJsxText();
            }
            else {
                parseExpected(SyntaxKind.SlashToken);
                if (inExpressionContext) {
                    parseExpected(SyntaxKind.GreaterThanToken);
                }
                else {
                    parseExpected(SyntaxKind.GreaterThanToken, /*diagnostic*/ undefined, /*shouldAdvance*/ false);
                    scanJsxText();
                }
                node = <JsxSelfClosingElement>createNode(SyntaxKind.JsxSelfClosingElement, fullStart);
            }

            node.tagName = tagName;
            node.attributes = attributes;

            return finishNode(node);
        }

        function parseJsxElementName(): EntityName {
            scanJsxIdentifier();
            let elementName: EntityName = parseIdentifierName();
            while (parseOptional(SyntaxKind.DotToken)) {
                scanJsxIdentifier();
                const node = <QualifiedName>createNode(SyntaxKind.QualifiedName, elementName.pos);
                node.left = elementName;
                node.right = parseIdentifierName();
                elementName = finishNode(node);
            }
            return elementName;
        }

        function parseJsxExpression(inExpressionContext: boolean): JsxExpression {
            const node = <JsxExpression>createNode(SyntaxKind.JsxExpression);

            parseExpected(SyntaxKind.OpenBraceToken);
            if (token !== SyntaxKind.CloseBraceToken) {
                node.expression = parseAssignmentExpressionOrHigher();
            }
            if (inExpressionContext) {
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                parseExpected(SyntaxKind.CloseBraceToken, /*message*/ undefined, /*shouldAdvance*/ false);
                scanJsxText();
            }

            return finishNode(node);
        }

        function parseJsxAttribute(): JsxAttribute | JsxSpreadAttribute {
            if (token === SyntaxKind.OpenBraceToken) {
                return parseJsxSpreadAttribute();
            }

            scanJsxIdentifier();
            const node = <JsxAttribute>createNode(SyntaxKind.JsxAttribute);
            node.name = parseIdentifierName();
            if (parseOptional(SyntaxKind.EqualsToken)) {
                switch (token) {
                    case SyntaxKind.StringLiteral:
                        node.initializer = parseLiteralNode();
                        break;
                    default:
                        node.initializer = parseJsxExpression(/*inExpressionContext*/ true);
                        break;
                }
            }
            return finishNode(node);
        }

        function parseJsxSpreadAttribute(): JsxSpreadAttribute {
            const node = <JsxSpreadAttribute>createNode(SyntaxKind.JsxSpreadAttribute);
            parseExpected(SyntaxKind.OpenBraceToken);
            parseExpected(SyntaxKind.DotDotDotToken);
            node.expression = parseExpression();
            parseExpected(SyntaxKind.CloseBraceToken);
            return finishNode(node);
        }

        function parseJsxClosingElement(inExpressionContext: boolean): JsxClosingElement {
            const node = <JsxClosingElement>createNode(SyntaxKind.JsxClosingElement);
            parseExpected(SyntaxKind.LessThanSlashToken);
            node.tagName = parseJsxElementName();
            if (inExpressionContext) {
                parseExpected(SyntaxKind.GreaterThanToken);
            }
            else {
                parseExpected(SyntaxKind.GreaterThanToken, /*diagnostic*/ undefined, /*shouldAdvance*/ false);
                scanJsxText();
            }
            return finishNode(node);
        }

        function parseTypeAssertion(): TypeAssertion {
            const node = <TypeAssertion>createNode(SyntaxKind.TypeAssertionExpression);
            parseExpected(SyntaxKind.LessThanToken);
            node.type = parseType();
            parseExpected(SyntaxKind.GreaterThanToken);
            node.expression = parseSimpleUnaryExpression();
            return finishNode(node);
        }

        function parseMemberExpressionRest(expression: LeftHandSideExpression): MemberExpression {
            while (true) {
                const dotToken = parseOptionalToken(SyntaxKind.DotToken);
                if (dotToken) {
                    const propertyAccess = <PropertyAccessExpression>createNode(SyntaxKind.PropertyAccessExpression, expression.pos);
                    propertyAccess.expression = expression;
                    propertyAccess.dotToken = dotToken;
                    propertyAccess.name = parseRightSideOfDot(/*allowIdentifierNames*/ true);
                    expression = finishNode(propertyAccess);
                    continue;
                }

                // when in the [Decorator] context, we do not parse ElementAccess as it could be part of a ComputedPropertyName
                if (!inDecoratorContext() && parseOptional(SyntaxKind.OpenBracketToken)) {
                    const indexedAccess = <ElementAccessExpression>createNode(SyntaxKind.ElementAccessExpression, expression.pos);
                    indexedAccess.expression = expression;

                    // It's not uncommon for a user to write: "new Type[]".
                    // Check for that common pattern and report a better error message.
                    if (token !== SyntaxKind.CloseBracketToken) {
                        indexedAccess.argumentExpression = allowInAnd(parseExpression);
                        if (indexedAccess.argumentExpression.kind === SyntaxKind.StringLiteral || indexedAccess.argumentExpression.kind === SyntaxKind.NumericLiteral) {
                            const literal = <LiteralExpression>indexedAccess.argumentExpression;
                            literal.text = internIdentifier(literal.text);
                        }
                    }

                    parseExpected(SyntaxKind.CloseBracketToken);
                    expression = finishNode(indexedAccess);
                    continue;
                }

                if (token === SyntaxKind.NoSubstitutionTemplateLiteral || token === SyntaxKind.TemplateHead) {
                    const tagExpression = <TaggedTemplateExpression>createNode(SyntaxKind.TaggedTemplateExpression, expression.pos);
                    tagExpression.tag = expression;
                    tagExpression.template = token === SyntaxKind.NoSubstitutionTemplateLiteral
                        ? parseLiteralNode()
                        : parseTemplateExpression();
                    expression = finishNode(tagExpression);
                    continue;
                }

                return <MemberExpression>expression;
            }
        }

        function parseCallExpressionRest(expression: LeftHandSideExpression): LeftHandSideExpression {
            while (true) {
                expression = parseMemberExpressionRest(expression);
                if (token === SyntaxKind.LessThanToken) {
                    // See if this is the start of a generic invocation.  If so, consume it and
                    // keep checking for postfix expressions.  Otherwise, it's just a '<' that's
                    // part of an arithmetic expression.  Break out so we consume it higher in the
                    // stack.
                    const typeArguments = tryParse(parseTypeArgumentsInExpression);
                    if (!typeArguments) {
                        return expression;
                    }

                    const callExpr = <CallExpression>createNode(SyntaxKind.CallExpression, expression.pos);
                    callExpr.expression = expression;
                    callExpr.typeArguments = typeArguments;
                    callExpr.arguments = parseArgumentList();
                    expression = finishNode(callExpr);
                    continue;
                }
                else if (token === SyntaxKind.OpenParenToken) {
                    const callExpr = <CallExpression>createNode(SyntaxKind.CallExpression, expression.pos);
                    callExpr.expression = expression;
                    callExpr.arguments = parseArgumentList();
                    expression = finishNode(callExpr);
                    continue;
                }

                return expression;
            }
        }

        function parseArgumentList() {
            parseExpected(SyntaxKind.OpenParenToken);
            const result = parseDelimitedList(ParsingContext.ArgumentExpressions, parseArgumentExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            return result;
        }

        function parseTypeArgumentsInExpression() {
            if (!parseOptional(SyntaxKind.LessThanToken)) {
                return undefined;
            }

            const typeArguments = parseDelimitedList(ParsingContext.TypeArguments, parseType);
            if (!parseExpected(SyntaxKind.GreaterThanToken)) {
                // If it doesn't have the closing >  then it's definitely not an type argument list.
                return undefined;
            }

            // If we have a '<', then only parse this as a arugment list if the type arguments
            // are complete and we have an open paren.  if we don't, rewind and return nothing.
            return typeArguments && canFollowTypeArgumentsInExpression()
                ? typeArguments
                : undefined;
        }

        function canFollowTypeArgumentsInExpression(): boolean {
            switch (token) {
                case SyntaxKind.OpenParenToken:                 // foo<x>(
                // this case are the only case where this token can legally follow a type argument
                // list.  So we definitely want to treat this as a type arg list.

                case SyntaxKind.DotToken:                       // foo<x>.
                case SyntaxKind.CloseParenToken:                // foo<x>)
                case SyntaxKind.CloseBracketToken:              // foo<x>]
                case SyntaxKind.ColonToken:                     // foo<x>:
                case SyntaxKind.SemicolonToken:                 // foo<x>;
                case SyntaxKind.QuestionToken:                  // foo<x>?
                case SyntaxKind.EqualsEqualsToken:              // foo<x> ==
                case SyntaxKind.EqualsEqualsEqualsToken:        // foo<x> ===
                case SyntaxKind.ExclamationEqualsToken:         // foo<x> !=
                case SyntaxKind.ExclamationEqualsEqualsToken:   // foo<x> !==
                case SyntaxKind.AmpersandAmpersandToken:        // foo<x> &&
                case SyntaxKind.BarBarToken:                    // foo<x> ||
                case SyntaxKind.CaretToken:                     // foo<x> ^
                case SyntaxKind.AmpersandToken:                 // foo<x> &
                case SyntaxKind.BarToken:                       // foo<x> |
                case SyntaxKind.CloseBraceToken:                // foo<x> }
                case SyntaxKind.EndOfFileToken:                 // foo<x>
                    // these cases can't legally follow a type arg list.  However, they're not legal
                    // expressions either.  The user is probably in the middle of a generic type. So
                    // treat it as such.
                    return true;

                case SyntaxKind.CommaToken:                     // foo<x>,
                case SyntaxKind.OpenBraceToken:                 // foo<x> {
                // We don't want to treat these as type arguments.  Otherwise we'll parse this
                // as an invocation expression.  Instead, we want to parse out the expression
                // in isolation from the type arguments.

                default:
                    // Anything else treat as an expression.
                    return false;
            }
        }

        function parsePrimaryExpression(): PrimaryExpression {
            switch (token) {
                case SyntaxKind.NumericLiteral:
                case SyntaxKind.StringLiteral:
                case SyntaxKind.NoSubstitutionTemplateLiteral:
                    return parseLiteralNode();
                case SyntaxKind.ThisKeyword:
                case SyntaxKind.SuperKeyword:
                case SyntaxKind.NullKeyword:
                case SyntaxKind.TrueKeyword:
                case SyntaxKind.FalseKeyword:
                    return parseTokenNode<PrimaryExpression>();
                case SyntaxKind.OpenParenToken:
                    return parseParenthesizedExpression();
                case SyntaxKind.OpenBracketToken:
                    return parseArrayLiteralExpression();
                case SyntaxKind.OpenBraceToken:
                    return parseObjectLiteralExpression();
                case SyntaxKind.AsyncKeyword:
                    // Async arrow functions are parsed earlier in parseAssignmentExpressionOrHigher.
                    // If we encounter `async [no LineTerminator here] function` then this is an async
                    // function; otherwise, its an identifier.
                    if (!lookAhead(nextTokenIsFunctionKeywordOnSameLine)) {
                        break;
                    }

                    return parseFunctionExpression();
                case SyntaxKind.ClassKeyword:
                    return parseClassExpression();
                case SyntaxKind.FunctionKeyword:
                    return parseFunctionExpression();
                case SyntaxKind.NewKeyword:
                    return parseNewExpression();
                case SyntaxKind.SlashToken:
                case SyntaxKind.SlashEqualsToken:
                    if (reScanSlashToken() === SyntaxKind.RegularExpressionLiteral) {
                        return parseLiteralNode();
                    }
                    break;
                case SyntaxKind.TemplateHead:
                    return parseTemplateExpression();
            }

            return parseIdentifier(Diagnostics.Expression_expected);
        }

        function parseParenthesizedExpression(): ParenthesizedExpression {
            const node = <ParenthesizedExpression>createNode(SyntaxKind.ParenthesizedExpression);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            return finishNode(node);
        }

        function parseSpreadElement(): Expression {
            const node = <SpreadElementExpression>createNode(SyntaxKind.SpreadElementExpression);
            parseExpected(SyntaxKind.DotDotDotToken);
            node.expression = parseAssignmentExpressionOrHigher();
            return finishNode(node);
        }

        function parseArgumentOrArrayLiteralElement(): Expression {
            return token === SyntaxKind.DotDotDotToken ? parseSpreadElement() :
                token === SyntaxKind.CommaToken ? <Expression>createNode(SyntaxKind.OmittedExpression) :
                    parseAssignmentExpressionOrHigher();
        }

        function parseArgumentExpression(): Expression {
            return doOutsideOfContext(disallowInAndDecoratorContext, parseArgumentOrArrayLiteralElement);
        }

        function parseArrayLiteralExpression(): ArrayLiteralExpression {
            const node = <ArrayLiteralExpression>createNode(SyntaxKind.ArrayLiteralExpression);
            parseExpected(SyntaxKind.OpenBracketToken);
            if (scanner.hasPrecedingLineBreak()) node.flags |= NodeFlags.MultiLine;
            node.elements = parseDelimitedList(ParsingContext.ArrayLiteralMembers, parseArgumentOrArrayLiteralElement);
            parseExpected(SyntaxKind.CloseBracketToken);
            return finishNode(node);
        }

        function tryParseAccessorDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): AccessorDeclaration {
            if (parseContextualModifier(SyntaxKind.GetKeyword)) {
                return parseAccessorDeclaration(SyntaxKind.GetAccessor, fullStart, decorators, modifiers);
            }
            else if (parseContextualModifier(SyntaxKind.SetKeyword)) {
                return parseAccessorDeclaration(SyntaxKind.SetAccessor, fullStart, decorators, modifiers);
            }

            return undefined;
        }

        function parseObjectLiteralElement(): ObjectLiteralElement {
            const fullStart = scanner.getStartPos();
            const decorators = parseDecorators();
            const modifiers = parseModifiers();

            const accessor = tryParseAccessorDeclaration(fullStart, decorators, modifiers);
            if (accessor) {
                return accessor;
            }

            const asteriskToken = parseOptionalToken(SyntaxKind.AsteriskToken);
            const tokenIsIdentifier = isIdentifier();
            const propertyName = parsePropertyName();

            // Disallowing of optional property assignments happens in the grammar checker.
            const questionToken = parseOptionalToken(SyntaxKind.QuestionToken);
            if (asteriskToken || token === SyntaxKind.OpenParenToken || token === SyntaxKind.LessThanToken) {
                return parseMethodDeclaration(fullStart, decorators, modifiers, asteriskToken, propertyName, questionToken);
            }

            // check if it is short-hand property assignment or normal property assignment
            // NOTE: if token is EqualsToken it is interpreted as CoverInitializedName production
            // CoverInitializedName[Yield] :
            //     IdentifierReference[?Yield] Initializer[In, ?Yield]
            // this is necessary because ObjectLiteral productions are also used to cover grammar for ObjectAssignmentPattern
            const isShorthandPropertyAssignment =
                tokenIsIdentifier && (token === SyntaxKind.CommaToken || token === SyntaxKind.CloseBraceToken || token === SyntaxKind.EqualsToken);

            if (isShorthandPropertyAssignment) {
                const shorthandDeclaration = <ShorthandPropertyAssignment>createNode(SyntaxKind.ShorthandPropertyAssignment, fullStart);
                shorthandDeclaration.name = <Identifier>propertyName;
                shorthandDeclaration.questionToken = questionToken;
                const equalsToken = parseOptionalToken(SyntaxKind.EqualsToken);
                if (equalsToken) {
                    shorthandDeclaration.equalsToken = equalsToken;
                    shorthandDeclaration.objectAssignmentInitializer = allowInAnd(parseAssignmentExpressionOrHigher);
                }
                return addJSDocComment(finishNode(shorthandDeclaration));
            }
            else {
                const propertyAssignment = <PropertyAssignment>createNode(SyntaxKind.PropertyAssignment, fullStart);
                propertyAssignment.modifiers = modifiers;
                propertyAssignment.name = propertyName;
                propertyAssignment.questionToken = questionToken;
                parseExpected(SyntaxKind.ColonToken);
                propertyAssignment.initializer = allowInAnd(parseAssignmentExpressionOrHigher);
                return addJSDocComment(finishNode(propertyAssignment));
            }
        }

        function parseObjectLiteralExpression(): ObjectLiteralExpression {
            const node = <ObjectLiteralExpression>createNode(SyntaxKind.ObjectLiteralExpression);
            parseExpected(SyntaxKind.OpenBraceToken);
            if (scanner.hasPrecedingLineBreak()) {
                node.flags |= NodeFlags.MultiLine;
            }

            node.properties = parseDelimitedList(ParsingContext.ObjectLiteralMembers, parseObjectLiteralElement, /*considerSemicolonAsDelimeter*/ true);
            parseExpected(SyntaxKind.CloseBraceToken);
            return finishNode(node);
        }

        function parseFunctionExpression(): FunctionExpression {
            // GeneratorExpression:
            //      function* BindingIdentifier [Yield][opt](FormalParameters[Yield]){ GeneratorBody }
            //
            // FunctionExpression:
            //      function BindingIdentifier[opt](FormalParameters){ FunctionBody }
            const saveDecoratorContext = inDecoratorContext();
            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ false);
            }

            const node = <FunctionExpression>createNode(SyntaxKind.FunctionExpression);
            setModifiers(node, parseModifiers());
            parseExpected(SyntaxKind.FunctionKeyword);
            node.asteriskToken = parseOptionalToken(SyntaxKind.AsteriskToken);

            const isGenerator = !!node.asteriskToken;
            const isAsync = !!(node.flags & NodeFlags.Async);
            node.name =
                isGenerator && isAsync ? doInYieldAndAwaitContext(parseOptionalIdentifier) :
                isGenerator ? doInYieldContext(parseOptionalIdentifier) :
                isAsync ? doInAwaitContext(parseOptionalIdentifier) :
                parseOptionalIdentifier();

            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ isGenerator, /*awaitContext*/ isAsync, /*requireCompleteParameterList*/ false, node);
            node.body = parseFunctionBlock(/*allowYield*/ isGenerator, /*allowAwait*/ isAsync, /*ignoreMissingOpenBrace*/ false);

            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ true);
            }

            return addJSDocComment(finishNode(node));
        }

        function parseOptionalIdentifier() {
            return isIdentifier() ? parseIdentifier() : undefined;
        }

        function parseNewExpression(): NewExpression {
            const node = <NewExpression>createNode(SyntaxKind.NewExpression);
            parseExpected(SyntaxKind.NewKeyword);
            node.expression = parseMemberExpressionOrHigher();
            node.typeArguments = tryParse(parseTypeArgumentsInExpression);
            if (node.typeArguments || token === SyntaxKind.OpenParenToken) {
                node.arguments = parseArgumentList();
            }

            return finishNode(node);
        }

        // STATEMENTS
        function parseBlock(ignoreMissingOpenBrace: boolean, diagnosticMessage?: DiagnosticMessage): Block {
            const node = <Block>createNode(SyntaxKind.Block);
            if (parseExpected(SyntaxKind.OpenBraceToken, diagnosticMessage) || ignoreMissingOpenBrace) {
                node.statements = parseList(ParsingContext.BlockStatements, parseStatement);
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                node.statements = createMissingList<Statement>();
            }
            return finishNode(node);
        }

        function parseFunctionBlock(allowYield: boolean, allowAwait: boolean, ignoreMissingOpenBrace: boolean, diagnosticMessage?: DiagnosticMessage): Block {
            const savedYieldContext = inYieldContext();
            setYieldContext(allowYield);

            const savedAwaitContext = inAwaitContext();
            setAwaitContext(allowAwait);

            // We may be in a [Decorator] context when parsing a function expression or
            // arrow function. The body of the function is not in [Decorator] context.
            const saveDecoratorContext = inDecoratorContext();
            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ false);
            }

            const block = parseBlock(ignoreMissingOpenBrace, diagnosticMessage);

            if (saveDecoratorContext) {
                setDecoratorContext(/*val*/ true);
            }

            setYieldContext(savedYieldContext);
            setAwaitContext(savedAwaitContext);

            return block;
        }

        function parseEmptyStatement(): Statement {
            const node = <Statement>createNode(SyntaxKind.EmptyStatement);
            parseExpected(SyntaxKind.SemicolonToken);
            return finishNode(node);
        }

        function parseIfStatement(): IfStatement {
            const node = <IfStatement>createNode(SyntaxKind.IfStatement);
            parseExpected(SyntaxKind.IfKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            node.thenStatement = parseStatement();
            node.elseStatement = parseOptional(SyntaxKind.ElseKeyword) ? parseStatement() : undefined;
            return finishNode(node);
        }

        function parseDoStatement(): DoStatement {
            const node = <DoStatement>createNode(SyntaxKind.DoStatement);
            parseExpected(SyntaxKind.DoKeyword);
            node.statement = parseStatement();
            parseExpected(SyntaxKind.WhileKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);

            // From: https://mail.mozilla.org/pipermail/es-discuss/2011-August/016188.html
            // 157 min --- All allen at wirfs-brock.com CONF --- "do{;}while(false)false" prohibited in
            // spec but allowed in consensus reality. Approved -- this is the de-facto standard whereby
            //  do;while(0)x will have a semicolon inserted before x.
            parseOptional(SyntaxKind.SemicolonToken);
            return finishNode(node);
        }

        function parseWhileStatement(): WhileStatement {
            const node = <WhileStatement>createNode(SyntaxKind.WhileStatement);
            parseExpected(SyntaxKind.WhileKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            node.statement = parseStatement();
            return finishNode(node);
        }

        function parseForOrForInOrForOfStatement(): Statement {
            const pos = getNodePos();
            parseExpected(SyntaxKind.ForKeyword);
            parseExpected(SyntaxKind.OpenParenToken);

            let initializer: VariableDeclarationList | Expression = undefined;
            if (token !== SyntaxKind.SemicolonToken) {
                if (token === SyntaxKind.VarKeyword || token === SyntaxKind.LetKeyword || token === SyntaxKind.ConstKeyword) {
                    initializer = parseVariableDeclarationList(/*inForStatementInitializer*/ true);
                }
                else {
                    initializer = disallowInAnd(parseExpression);
                }
            }
            let forOrForInOrForOfStatement: IterationStatement;
            if (parseOptional(SyntaxKind.InKeyword)) {
                const forInStatement = <ForInStatement>createNode(SyntaxKind.ForInStatement, pos);
                forInStatement.initializer = initializer;
                forInStatement.expression = allowInAnd(parseExpression);
                parseExpected(SyntaxKind.CloseParenToken);
                forOrForInOrForOfStatement = forInStatement;
            }
            else if (parseOptional(SyntaxKind.OfKeyword)) {
                const forOfStatement = <ForOfStatement>createNode(SyntaxKind.ForOfStatement, pos);
                forOfStatement.initializer = initializer;
                forOfStatement.expression = allowInAnd(parseAssignmentExpressionOrHigher);
                parseExpected(SyntaxKind.CloseParenToken);
                forOrForInOrForOfStatement = forOfStatement;
            }
            else {
                const forStatement = <ForStatement>createNode(SyntaxKind.ForStatement, pos);
                forStatement.initializer = initializer;
                parseExpected(SyntaxKind.SemicolonToken);
                if (token !== SyntaxKind.SemicolonToken && token !== SyntaxKind.CloseParenToken) {
                    forStatement.condition = allowInAnd(parseExpression);
                }
                parseExpected(SyntaxKind.SemicolonToken);
                if (token !== SyntaxKind.CloseParenToken) {
                    forStatement.incrementor = allowInAnd(parseExpression);
                }
                parseExpected(SyntaxKind.CloseParenToken);
                forOrForInOrForOfStatement = forStatement;
            }

            forOrForInOrForOfStatement.statement = parseStatement();

            return finishNode(forOrForInOrForOfStatement);
        }

        function parseBreakOrContinueStatement(kind: SyntaxKind): BreakOrContinueStatement {
            const node = <BreakOrContinueStatement>createNode(kind);

            parseExpected(kind === SyntaxKind.BreakStatement ? SyntaxKind.BreakKeyword : SyntaxKind.ContinueKeyword);
            if (!canParseSemicolon()) {
                node.label = parseIdentifier();
            }

            parseSemicolon();
            return finishNode(node);
        }

        function parseReturnStatement(): ReturnStatement {
            const node = <ReturnStatement>createNode(SyntaxKind.ReturnStatement);

            parseExpected(SyntaxKind.ReturnKeyword);
            if (!canParseSemicolon()) {
                node.expression = allowInAnd(parseExpression);
            }

            parseSemicolon();
            return finishNode(node);
        }

        function parseWithStatement(): WithStatement {
            const node = <WithStatement>createNode(SyntaxKind.WithStatement);
            parseExpected(SyntaxKind.WithKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            node.statement = parseStatement();
            return finishNode(node);
        }

        function parseCaseClause(): CaseClause {
            const node = <CaseClause>createNode(SyntaxKind.CaseClause);
            parseExpected(SyntaxKind.CaseKeyword);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.ColonToken);
            node.statements = parseList(ParsingContext.SwitchClauseStatements, parseStatement);
            return finishNode(node);
        }

        function parseDefaultClause(): DefaultClause {
            const node = <DefaultClause>createNode(SyntaxKind.DefaultClause);
            parseExpected(SyntaxKind.DefaultKeyword);
            parseExpected(SyntaxKind.ColonToken);
            node.statements = parseList(ParsingContext.SwitchClauseStatements, parseStatement);
            return finishNode(node);
        }

        function parseCaseOrDefaultClause(): CaseOrDefaultClause {
            return token === SyntaxKind.CaseKeyword ? parseCaseClause() : parseDefaultClause();
        }

        function parseSwitchStatement(): SwitchStatement {
            const node = <SwitchStatement>createNode(SyntaxKind.SwitchStatement);
            parseExpected(SyntaxKind.SwitchKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = allowInAnd(parseExpression);
            parseExpected(SyntaxKind.CloseParenToken);
            const caseBlock = <CaseBlock>createNode(SyntaxKind.CaseBlock, scanner.getStartPos());
            parseExpected(SyntaxKind.OpenBraceToken);
            caseBlock.clauses = parseList(ParsingContext.SwitchClauses, parseCaseOrDefaultClause);
            parseExpected(SyntaxKind.CloseBraceToken);
            node.caseBlock = finishNode(caseBlock);
            return finishNode(node);
        }

        function parseThrowStatement(): ThrowStatement {
            // ThrowStatement[Yield] :
            //      throw [no LineTerminator here]Expression[In, ?Yield];

            // Because of automatic semicolon insertion, we need to report error if this
            // throw could be terminated with a semicolon.  Note: we can't call 'parseExpression'
            // directly as that might consume an expression on the following line.
            // We just return 'undefined' in that case.  The actual error will be reported in the
            // grammar walker.
            const node = <ThrowStatement>createNode(SyntaxKind.ThrowStatement);
            parseExpected(SyntaxKind.ThrowKeyword);
            node.expression = scanner.hasPrecedingLineBreak() ? undefined : allowInAnd(parseExpression);
            parseSemicolon();
            return finishNode(node);
        }

        // TODO: Review for error recovery
        function parseTryStatement(): TryStatement {
            const node = <TryStatement>createNode(SyntaxKind.TryStatement);

            parseExpected(SyntaxKind.TryKeyword);
            node.tryBlock = parseBlock(/*ignoreMissingOpenBrace*/ false);
            node.catchClause = token === SyntaxKind.CatchKeyword ? parseCatchClause() : undefined;

            // If we don't have a catch clause, then we must have a finally clause.  Try to parse
            // one out no matter what.
            if (!node.catchClause || token === SyntaxKind.FinallyKeyword) {
                parseExpected(SyntaxKind.FinallyKeyword);
                node.finallyBlock = parseBlock(/*ignoreMissingOpenBrace*/ false);
            }

            return finishNode(node);
        }

        function parseCatchClause(): CatchClause {
            const result = <CatchClause>createNode(SyntaxKind.CatchClause);
            parseExpected(SyntaxKind.CatchKeyword);
            if (parseExpected(SyntaxKind.OpenParenToken)) {
                result.variableDeclaration = parseVariableDeclaration();
            }

            parseExpected(SyntaxKind.CloseParenToken);
            result.block = parseBlock(/*ignoreMissingOpenBrace*/ false);
            return finishNode(result);
        }

        function parseDebuggerStatement(): Statement {
            const node = <Statement>createNode(SyntaxKind.DebuggerStatement);
            parseExpected(SyntaxKind.DebuggerKeyword);
            parseSemicolon();
            return finishNode(node);
        }

        function parseExpressionOrLabeledStatement(): ExpressionStatement | LabeledStatement {
            // Avoiding having to do the lookahead for a labeled statement by just trying to parse
            // out an expression, seeing if it is identifier and then seeing if it is followed by
            // a colon.
            const fullStart = scanner.getStartPos();
            const expression = allowInAnd(parseExpression);

            if (expression.kind === SyntaxKind.Identifier && parseOptional(SyntaxKind.ColonToken)) {
                const labeledStatement = <LabeledStatement>createNode(SyntaxKind.LabeledStatement, fullStart);
                labeledStatement.label = <Identifier>expression;
                labeledStatement.statement = parseStatement();
                return addJSDocComment(finishNode(labeledStatement));
            }
            else {
                const expressionStatement = <ExpressionStatement>createNode(SyntaxKind.ExpressionStatement, fullStart);
                expressionStatement.expression = expression;
                parseSemicolon();
                return addJSDocComment(finishNode(expressionStatement));
            }
        }

        function nextTokenIsIdentifierOrKeywordOnSameLine() {
            nextToken();
            return tokenIsIdentifierOrKeyword(token) && !scanner.hasPrecedingLineBreak();
        }

        function nextTokenIsFunctionKeywordOnSameLine() {
            nextToken();
            return token === SyntaxKind.FunctionKeyword && !scanner.hasPrecedingLineBreak();
        }

        function nextTokenIsIdentifierOrKeywordOrNumberOnSameLine() {
            nextToken();
            return (tokenIsIdentifierOrKeyword(token) || token === SyntaxKind.NumericLiteral) && !scanner.hasPrecedingLineBreak();
        }

        function isDeclaration(): boolean {
            while (true) {
                switch (token) {
                    case SyntaxKind.VarKeyword:
                    case SyntaxKind.LetKeyword:
                    case SyntaxKind.ConstKeyword:
                    case SyntaxKind.FunctionKeyword:
                    case SyntaxKind.ClassKeyword:
                    case SyntaxKind.EnumKeyword:
                        return true;

                    // 'declare', 'module', 'namespace', 'interface'* and 'type' are all legal JavaScript identifiers;
                    // however, an identifier cannot be followed by another identifier on the same line. This is what we
                    // count on to parse out the respective declarations. For instance, we exploit this to say that
                    //
                    //    namespace n
                    //
                    // can be none other than the beginning of a namespace declaration, but need to respect that JavaScript sees
                    //
                    //    namespace
                    //    n
                    //
                    // as the identifier 'namespace' on one line followed by the identifier 'n' on another.
                    // We need to look one token ahead to see if it permissible to try parsing a declaration.
                    //
                    // *Note*: 'interface' is actually a strict mode reserved word. So while
                    //
                    //   "use strict"
                    //   interface
                    //   I {}
                    //
                    // could be legal, it would add complexity for very little gain.
                    case SyntaxKind.InterfaceKeyword:
                    case SyntaxKind.TypeKeyword:
                        return nextTokenIsIdentifierOnSameLine();
                    case SyntaxKind.ModuleKeyword:
                    case SyntaxKind.NamespaceKeyword:
                        return nextTokenIsIdentifierOrStringLiteralOnSameLine();
                    case SyntaxKind.AbstractKeyword:
                    case SyntaxKind.AsyncKeyword:
                    case SyntaxKind.DeclareKeyword:
                    case SyntaxKind.PrivateKeyword:
                    case SyntaxKind.ProtectedKeyword:
                    case SyntaxKind.PublicKeyword:
                        nextToken();
                        // ASI takes effect for this modifier.
                        if (scanner.hasPrecedingLineBreak()) {
                            return false;
                        }
                        continue;

                    case SyntaxKind.GlobalKeyword:
                        return nextToken() === SyntaxKind.OpenBraceToken;

                    case SyntaxKind.ImportKeyword:
                        nextToken();
                        return token === SyntaxKind.StringLiteral || token === SyntaxKind.AsteriskToken ||
                            token === SyntaxKind.OpenBraceToken || tokenIsIdentifierOrKeyword(token);
                    case SyntaxKind.ExportKeyword:
                        nextToken();
                        if (token === SyntaxKind.EqualsToken || token === SyntaxKind.AsteriskToken ||
                            token === SyntaxKind.OpenBraceToken || token === SyntaxKind.DefaultKeyword) {
                            return true;
                        }
                        continue;

                    case SyntaxKind.StaticKeyword:
                        nextToken();
                        continue;
                    default:
                        return false;
                }
            }
        }

        function isStartOfDeclaration(): boolean {
            return lookAhead(isDeclaration);
        }

        function isStartOfStatement(): boolean {
            switch (token) {
                case SyntaxKind.AtToken:
                case SyntaxKind.SemicolonToken:
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.VarKeyword:
                case SyntaxKind.LetKeyword:
                case SyntaxKind.FunctionKeyword:
                case SyntaxKind.ClassKeyword:
                case SyntaxKind.EnumKeyword:
                case SyntaxKind.IfKeyword:
                case SyntaxKind.DoKeyword:
                case SyntaxKind.WhileKeyword:
                case SyntaxKind.ForKeyword:
                case SyntaxKind.ContinueKeyword:
                case SyntaxKind.BreakKeyword:
                case SyntaxKind.ReturnKeyword:
                case SyntaxKind.WithKeyword:
                case SyntaxKind.SwitchKeyword:
                case SyntaxKind.ThrowKeyword:
                case SyntaxKind.TryKeyword:
                case SyntaxKind.DebuggerKeyword:
                // 'catch' and 'finally' do not actually indicate that the code is part of a statement,
                // however, we say they are here so that we may gracefully parse them and error later.
                case SyntaxKind.CatchKeyword:
                case SyntaxKind.FinallyKeyword:
                    return true;

                case SyntaxKind.ConstKeyword:
                case SyntaxKind.ExportKeyword:
                case SyntaxKind.ImportKeyword:
                    return isStartOfDeclaration();

                case SyntaxKind.AsyncKeyword:
                case SyntaxKind.DeclareKeyword:
                case SyntaxKind.InterfaceKeyword:
                case SyntaxKind.ModuleKeyword:
                case SyntaxKind.NamespaceKeyword:
                case SyntaxKind.TypeKeyword:
                case SyntaxKind.GlobalKeyword:
                    // When these don't start a declaration, they're an identifier in an expression statement
                    return true;

                case SyntaxKind.PublicKeyword:
                case SyntaxKind.PrivateKeyword:
                case SyntaxKind.ProtectedKeyword:
                case SyntaxKind.StaticKeyword:
                    // When these don't start a declaration, they may be the start of a class member if an identifier
                    // immediately follows. Otherwise they're an identifier in an expression statement.
                    return isStartOfDeclaration() || !lookAhead(nextTokenIsIdentifierOrKeywordOnSameLine);

                default:
                    return isStartOfExpression();
            }
        }

        function nextTokenIsIdentifierOrStartOfDestructuring() {
            nextToken();
            return isIdentifier() || token === SyntaxKind.OpenBraceToken || token === SyntaxKind.OpenBracketToken;
        }

        function isLetDeclaration() {
            // In ES6 'let' always starts a lexical declaration if followed by an identifier or {
            // or [.
            return lookAhead(nextTokenIsIdentifierOrStartOfDestructuring);
        }

        function parseStatement(): Statement {
            switch (token) {
                case SyntaxKind.SemicolonToken:
                    return parseEmptyStatement();
                case SyntaxKind.OpenBraceToken:
                    return parseBlock(/*ignoreMissingOpenBrace*/ false);
                case SyntaxKind.VarKeyword:
                    return parseVariableStatement(scanner.getStartPos(), /*decorators*/ undefined, /*modifiers*/ undefined);
                case SyntaxKind.LetKeyword:
                    if (isLetDeclaration()) {
                        return parseVariableStatement(scanner.getStartPos(), /*decorators*/ undefined, /*modifiers*/ undefined);
                    }
                    break;
                case SyntaxKind.FunctionKeyword:
                    return parseFunctionDeclaration(scanner.getStartPos(), /*decorators*/ undefined, /*modifiers*/ undefined);
                case SyntaxKind.ClassKeyword:
                    return parseClassDeclaration(scanner.getStartPos(), /*decorators*/ undefined, /*modifiers*/ undefined);
                case SyntaxKind.IfKeyword:
                    return parseIfStatement();
                case SyntaxKind.DoKeyword:
                    return parseDoStatement();
                case SyntaxKind.WhileKeyword:
                    return parseWhileStatement();
                case SyntaxKind.ForKeyword:
                    return parseForOrForInOrForOfStatement();
                case SyntaxKind.ContinueKeyword:
                    return parseBreakOrContinueStatement(SyntaxKind.ContinueStatement);
                case SyntaxKind.BreakKeyword:
                    return parseBreakOrContinueStatement(SyntaxKind.BreakStatement);
                case SyntaxKind.ReturnKeyword:
                    return parseReturnStatement();
                case SyntaxKind.WithKeyword:
                    return parseWithStatement();
                case SyntaxKind.SwitchKeyword:
                    return parseSwitchStatement();
                case SyntaxKind.ThrowKeyword:
                    return parseThrowStatement();
                case SyntaxKind.TryKeyword:
                // Include 'catch' and 'finally' for error recovery.
                case SyntaxKind.CatchKeyword:
                case SyntaxKind.FinallyKeyword:
                    return parseTryStatement();
                case SyntaxKind.DebuggerKeyword:
                    return parseDebuggerStatement();
                case SyntaxKind.AtToken:
                    return parseDeclaration();
                case SyntaxKind.AsyncKeyword:
                case SyntaxKind.InterfaceKeyword:
                case SyntaxKind.TypeKeyword:
                case SyntaxKind.ModuleKeyword:
                case SyntaxKind.NamespaceKeyword:
                case SyntaxKind.DeclareKeyword:
                case SyntaxKind.ConstKeyword:
                case SyntaxKind.EnumKeyword:
                case SyntaxKind.ExportKeyword:
                case SyntaxKind.ImportKeyword:
                case SyntaxKind.PrivateKeyword:
                case SyntaxKind.ProtectedKeyword:
                case SyntaxKind.PublicKeyword:
                case SyntaxKind.AbstractKeyword:
                case SyntaxKind.StaticKeyword:
                case SyntaxKind.GlobalKeyword:
                    if (isStartOfDeclaration()) {
                        return parseDeclaration();
                    }
                    break;
            }
            return parseExpressionOrLabeledStatement();
        }

        function parseDeclaration(): Statement {
            const fullStart = getNodePos();
            const decorators = parseDecorators();
            const modifiers = parseModifiers();
            switch (token) {
                case SyntaxKind.VarKeyword:
                case SyntaxKind.LetKeyword:
                case SyntaxKind.ConstKeyword:
                    return parseVariableStatement(fullStart, decorators, modifiers);
                case SyntaxKind.FunctionKeyword:
                    return parseFunctionDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.ClassKeyword:
                    return parseClassDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.InterfaceKeyword:
                    return parseInterfaceDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.TypeKeyword:
                    return parseTypeAliasDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.EnumKeyword:
                    return parseEnumDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.GlobalKeyword:
                case SyntaxKind.ModuleKeyword:
                case SyntaxKind.NamespaceKeyword:
                    return parseModuleDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.ImportKeyword:
                    return parseImportDeclarationOrImportEqualsDeclaration(fullStart, decorators, modifiers);
                case SyntaxKind.ExportKeyword:
                    nextToken();
                    return token === SyntaxKind.DefaultKeyword || token === SyntaxKind.EqualsToken ?
                        parseExportAssignment(fullStart, decorators, modifiers) :
                        parseExportDeclaration(fullStart, decorators, modifiers);
                default:
                    if (decorators || modifiers) {
                        // We reached this point because we encountered decorators and/or modifiers and assumed a declaration
                        // would follow. For recovery and error reporting purposes, return an incomplete declaration.
                        const node = <Statement>createMissingNode(SyntaxKind.MissingDeclaration, /*reportAtCurrentPosition*/ true, Diagnostics.Declaration_expected);
                        node.pos = fullStart;
                        node.decorators = decorators;
                        setModifiers(node, modifiers);
                        return finishNode(node);
                    }
            }
        }

        function nextTokenIsIdentifierOrStringLiteralOnSameLine() {
            nextToken();
            return !scanner.hasPrecedingLineBreak() && (isIdentifier() || token === SyntaxKind.StringLiteral);
        }

        function parseFunctionBlockOrSemicolon(isGenerator: boolean, isAsync: boolean, diagnosticMessage?: DiagnosticMessage): Block {
            if (token !== SyntaxKind.OpenBraceToken && canParseSemicolon()) {
                parseSemicolon();
                return;
            }

            return parseFunctionBlock(isGenerator, isAsync, /*ignoreMissingOpenBrace*/ false, diagnosticMessage);
        }

        // DECLARATIONS

        function parseArrayBindingElement(): BindingElement {
            if (token === SyntaxKind.CommaToken) {
                return <BindingElement>createNode(SyntaxKind.OmittedExpression);
            }
            const node = <BindingElement>createNode(SyntaxKind.BindingElement);
            node.dotDotDotToken = parseOptionalToken(SyntaxKind.DotDotDotToken);
            node.name = parseIdentifierOrPattern();
            node.initializer = parseBindingElementInitializer(/*inParameter*/ false);
            return finishNode(node);
        }

        function parseObjectBindingElement(): BindingElement {
            const node = <BindingElement>createNode(SyntaxKind.BindingElement);
            const tokenIsIdentifier = isIdentifier();
            const propertyName = parsePropertyName();
            if (tokenIsIdentifier && token !== SyntaxKind.ColonToken) {
                node.name = <Identifier>propertyName;
            }
            else {
                parseExpected(SyntaxKind.ColonToken);
                node.propertyName = propertyName;
                node.name = parseIdentifierOrPattern();
            }
            node.initializer = parseBindingElementInitializer(/*inParameter*/ false);
            return finishNode(node);
        }

        function parseObjectBindingPattern(): BindingPattern {
            const node = <BindingPattern>createNode(SyntaxKind.ObjectBindingPattern);
            parseExpected(SyntaxKind.OpenBraceToken);
            node.elements = parseDelimitedList(ParsingContext.ObjectBindingElements, parseObjectBindingElement);
            parseExpected(SyntaxKind.CloseBraceToken);
            return finishNode(node);
        }

        function parseArrayBindingPattern(): BindingPattern {
            const node = <BindingPattern>createNode(SyntaxKind.ArrayBindingPattern);
            parseExpected(SyntaxKind.OpenBracketToken);
            node.elements = parseDelimitedList(ParsingContext.ArrayBindingElements, parseArrayBindingElement);
            parseExpected(SyntaxKind.CloseBracketToken);
            return finishNode(node);
        }

        function isIdentifierOrPattern() {
            return token === SyntaxKind.OpenBraceToken || token === SyntaxKind.OpenBracketToken || isIdentifier();
        }

        function parseIdentifierOrPattern(): Identifier | BindingPattern {
            if (token === SyntaxKind.OpenBracketToken) {
                return parseArrayBindingPattern();
            }
            if (token === SyntaxKind.OpenBraceToken) {
                return parseObjectBindingPattern();
            }
            return parseIdentifier();
        }

        function parseVariableDeclaration(): VariableDeclaration {
            const node = <VariableDeclaration>createNode(SyntaxKind.VariableDeclaration);
            node.name = parseIdentifierOrPattern();
            node.type = parseTypeAnnotation();
            if (!isInOrOfKeyword(token)) {
                node.initializer = parseInitializer(/*inParameter*/ false);
            }
            return finishNode(node);
        }

        function parseVariableDeclarationList(inForStatementInitializer: boolean): VariableDeclarationList {
            const node = <VariableDeclarationList>createNode(SyntaxKind.VariableDeclarationList);

            switch (token) {
                case SyntaxKind.VarKeyword:
                    break;
                case SyntaxKind.LetKeyword:
                    node.flags |= NodeFlags.Let;
                    break;
                case SyntaxKind.ConstKeyword:
                    node.flags |= NodeFlags.Const;
                    break;
                default:
                    Debug.fail();
            }

            nextToken();

            // The user may have written the following:
            //
            //    for (let of X) { }
            //
            // In this case, we want to parse an empty declaration list, and then parse 'of'
            // as a keyword. The reason this is not automatic is that 'of' is a valid identifier.
            // So we need to look ahead to determine if 'of' should be treated as a keyword in
            // this context.
            // The checker will then give an error that there is an empty declaration list.
            if (token === SyntaxKind.OfKeyword && lookAhead(canFollowContextualOfKeyword)) {
                node.declarations = createMissingList<VariableDeclaration>();
            }
            else {
                const savedDisallowIn = inDisallowInContext();
                setDisallowInContext(inForStatementInitializer);

                node.declarations = parseDelimitedList(ParsingContext.VariableDeclarations, parseVariableDeclaration);

                setDisallowInContext(savedDisallowIn);
            }

            return finishNode(node);
        }

        function canFollowContextualOfKeyword(): boolean {
            return nextTokenIsIdentifier() && nextToken() === SyntaxKind.CloseParenToken;
        }

        function parseVariableStatement(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): VariableStatement {
            const node = <VariableStatement>createNode(SyntaxKind.VariableStatement, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            node.declarationList = parseVariableDeclarationList(/*inForStatementInitializer*/ false);
            parseSemicolon();
            return addJSDocComment(finishNode(node));
        }

        function parseFunctionDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): FunctionDeclaration {
            const node = <FunctionDeclaration>createNode(SyntaxKind.FunctionDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.FunctionKeyword);
            node.asteriskToken = parseOptionalToken(SyntaxKind.AsteriskToken);
            node.name = node.flags & NodeFlags.Default ? parseOptionalIdentifier() : parseIdentifier();
            const isGenerator = !!node.asteriskToken;
            const isAsync = !!(node.flags & NodeFlags.Async);
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ isGenerator, /*awaitContext*/ isAsync, /*requireCompleteParameterList*/ false, node);
            node.body = parseFunctionBlockOrSemicolon(isGenerator, isAsync, Diagnostics.or_expected);
            return addJSDocComment(finishNode(node));
        }

        function parseConstructorDeclaration(pos: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ConstructorDeclaration {
            const node = <ConstructorDeclaration>createNode(SyntaxKind.Constructor, pos);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.ConstructorKeyword);
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ false, /*awaitContext*/ false, /*requireCompleteParameterList*/ false, node);
            node.body = parseFunctionBlockOrSemicolon(/*isGenerator*/ false, /*isAsync*/ false, Diagnostics.or_expected);
            return addJSDocComment(finishNode(node));
        }

        function parseMethodDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray, asteriskToken: Node, name: PropertyName, questionToken: Node, diagnosticMessage?: DiagnosticMessage): MethodDeclaration {
            const method = <MethodDeclaration>createNode(SyntaxKind.MethodDeclaration, fullStart);
            method.decorators = decorators;
            setModifiers(method, modifiers);
            method.asteriskToken = asteriskToken;
            method.name = name;
            method.questionToken = questionToken;
            const isGenerator = !!asteriskToken;
            const isAsync = !!(method.flags & NodeFlags.Async);
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ isGenerator, /*awaitContext*/ isAsync, /*requireCompleteParameterList*/ false, method);
            method.body = parseFunctionBlockOrSemicolon(isGenerator, isAsync, diagnosticMessage);
            return addJSDocComment(finishNode(method));
        }

        function parsePropertyDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray, name: PropertyName, questionToken: Node): ClassElement {
            const property = <PropertyDeclaration>createNode(SyntaxKind.PropertyDeclaration, fullStart);
            property.decorators = decorators;
            setModifiers(property, modifiers);
            property.name = name;
            property.questionToken = questionToken;
            property.type = parseTypeAnnotation();

            // For instance properties specifically, since they are evaluated inside the constructor,
            // we do *not * want to parse yield expressions, so we specifically turn the yield context
            // off. The grammar would look something like this:
            //
            //    MemberVariableDeclaration[Yield]:
            //        AccessibilityModifier_opt   PropertyName   TypeAnnotation_opt   Initialiser_opt[In];
            //        AccessibilityModifier_opt  static_opt  PropertyName   TypeAnnotation_opt   Initialiser_opt[In, ?Yield];
            //
            // The checker may still error in the static case to explicitly disallow the yield expression.
            property.initializer = modifiers && modifiers.flags & NodeFlags.Static
                ? allowInAnd(parseNonParameterInitializer)
                : doOutsideOfContext(ParserContextFlags.Yield | ParserContextFlags.DisallowIn, parseNonParameterInitializer);

            parseSemicolon();
            return finishNode(property);
        }

        function parsePropertyOrMethodDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ClassElement {
            const asteriskToken = parseOptionalToken(SyntaxKind.AsteriskToken);
            const name = parsePropertyName();

            // Note: this is not legal as per the grammar.  But we allow it in the parser and
            // report an error in the grammar checker.
            const questionToken = parseOptionalToken(SyntaxKind.QuestionToken);
            if (asteriskToken || token === SyntaxKind.OpenParenToken || token === SyntaxKind.LessThanToken) {
                return parseMethodDeclaration(fullStart, decorators, modifiers, asteriskToken, name, questionToken, Diagnostics.or_expected);
            }
            else {
                return parsePropertyDeclaration(fullStart, decorators, modifiers, name, questionToken);
            }
        }

        function parseNonParameterInitializer() {
            return parseInitializer(/*inParameter*/ false);
        }

        function parseAccessorDeclaration(kind: SyntaxKind, fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): AccessorDeclaration {
            const node = <AccessorDeclaration>createNode(kind, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            node.name = parsePropertyName();
            fillSignature(SyntaxKind.ColonToken, /*yieldContext*/ false, /*awaitContext*/ false, /*requireCompleteParameterList*/ false, node);
            node.body = parseFunctionBlockOrSemicolon(/*isGenerator*/ false, /*isAsync*/ false);
            return finishNode(node);
        }

        function isClassMemberModifier(idToken: SyntaxKind) {
            switch (idToken) {
                case SyntaxKind.PublicKeyword:
                case SyntaxKind.PrivateKeyword:
                case SyntaxKind.ProtectedKeyword:
                case SyntaxKind.StaticKeyword:
                    return true;
                default:
                    return false;
            }
        }

        function isClassMemberStart(): boolean {
            let idToken: SyntaxKind;

            if (token === SyntaxKind.AtToken) {
                return true;
            }

            // Eat up all modifiers, but hold on to the last one in case it is actually an identifier.
            while (isModifierKind(token)) {
                idToken = token;
                // If the idToken is a class modifier (protected, private, public, and static), it is
                // certain that we are starting to parse class member. This allows better error recovery
                // Example:
                //      public foo() ...     // true
                //      public @dec blah ... // true; we will then report an error later
                //      export public ...    // true; we will then report an error later
                if (isClassMemberModifier(idToken)) {
                    return true;
                }

                nextToken();
            }

            if (token === SyntaxKind.AsteriskToken) {
                return true;
            }

            // Try to get the first property-like token following all modifiers.
            // This can either be an identifier or the 'get' or 'set' keywords.
            if (isLiteralPropertyName()) {
                idToken = token;
                nextToken();
            }

            // Index signatures and computed properties are class members; we can parse.
            if (token === SyntaxKind.OpenBracketToken) {
                return true;
            }

            // If we were able to get any potential identifier...
            if (idToken !== undefined) {
                // If we have a non-keyword identifier, or if we have an accessor, then it's safe to parse.
                if (!isKeyword(idToken) || idToken === SyntaxKind.SetKeyword || idToken === SyntaxKind.GetKeyword) {
                    return true;
                }

                // If it *is* a keyword, but not an accessor, check a little farther along
                // to see if it should actually be parsed as a class member.
                switch (token) {
                    case SyntaxKind.OpenParenToken:     // Method declaration
                    case SyntaxKind.LessThanToken:      // Generic Method declaration
                    case SyntaxKind.ColonToken:         // Type Annotation for declaration
                    case SyntaxKind.EqualsToken:        // Initializer for declaration
                    case SyntaxKind.QuestionToken:      // Not valid, but permitted so that it gets caught later on.
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

        function parseDecorators(): NodeArray<Decorator> {
            let decorators: NodeArray<Decorator>;
            while (true) {
                const decoratorStart = getNodePos();
                if (!parseOptional(SyntaxKind.AtToken)) {
                    break;
                }

                if (!decorators) {
                    decorators = <NodeArray<Decorator>>[];
                    decorators.pos = decoratorStart;
                }

                const decorator = <Decorator>createNode(SyntaxKind.Decorator, decoratorStart);
                decorator.expression = doInDecoratorContext(parseLeftHandSideExpressionOrHigher);
                decorators.push(finishNode(decorator));
            }
            if (decorators) {
                decorators.end = getNodeEnd();
            }
            return decorators;
        }

        /*
         * There are situations in which a modifier like 'const' will appear unexpectedly, such as on a class member.
         * In those situations, if we are entirely sure that 'const' is not valid on its own (such as when ASI takes effect
         * and turns it into a standalone declaration), then it is better to parse it and report an error later.
         *
         * In such situations, 'permitInvalidConstAsModifier' should be set to true.
         */
        function parseModifiers(permitInvalidConstAsModifier?: boolean): ModifiersArray {
            let flags = 0;
            let modifiers: ModifiersArray;
            while (true) {
                const modifierStart = scanner.getStartPos();
                const modifierKind = token;

                if (token === SyntaxKind.ConstKeyword && permitInvalidConstAsModifier) {
                    // We need to ensure that any subsequent modifiers appear on the same line
                    // so that when 'const' is a standalone declaration, we don't issue an error.                
                    if (!tryParse(nextTokenIsOnSameLineAndCanFollowModifier)) {
                        break;
                    }
                }
                else {
                    if (!parseAnyContextualModifier()) {
                        break;
                    }
                }

                if (!modifiers) {
                    modifiers = <ModifiersArray>[];
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

        function parseModifiersForArrowFunction(): ModifiersArray {
            let flags = 0;
            let modifiers: ModifiersArray;
            if (token === SyntaxKind.AsyncKeyword) {
                const modifierStart = scanner.getStartPos();
                const modifierKind = token;
                nextToken();
                modifiers = <ModifiersArray>[];
                modifiers.pos = modifierStart;
                flags |= modifierToFlag(modifierKind);
                modifiers.push(finishNode(createNode(modifierKind, modifierStart)));
                modifiers.flags = flags;
                modifiers.end = scanner.getStartPos();
            }

            return modifiers;
        }

        function parseClassElement(): ClassElement {
            if (token === SyntaxKind.SemicolonToken) {
                const result = <SemicolonClassElement>createNode(SyntaxKind.SemicolonClassElement);
                nextToken();
                return finishNode(result);
            }

            const fullStart = getNodePos();
            const decorators = parseDecorators();
            const modifiers = parseModifiers(/*permitInvalidConstAsModifier*/ true);

            const accessor = tryParseAccessorDeclaration(fullStart, decorators, modifiers);
            if (accessor) {
                return accessor;
            }

            if (token === SyntaxKind.ConstructorKeyword) {
                return parseConstructorDeclaration(fullStart, decorators, modifiers);
            }

            if (isIndexSignature()) {
                return parseIndexSignatureDeclaration(fullStart, decorators, modifiers);
            }

            // It is very important that we check this *after* checking indexers because
            // the [ token can start an index signature or a computed property name
            if (tokenIsIdentifierOrKeyword(token) ||
                token === SyntaxKind.StringLiteral ||
                token === SyntaxKind.NumericLiteral ||
                token === SyntaxKind.AsteriskToken ||
                token === SyntaxKind.OpenBracketToken) {

                return parsePropertyOrMethodDeclaration(fullStart, decorators, modifiers);
            }

            if (decorators || modifiers) {
                // treat this as a property declaration with a missing name.
                const name = <Identifier>createMissingNode(SyntaxKind.Identifier, /*reportAtCurrentPosition*/ true, Diagnostics.Declaration_expected);
                return parsePropertyDeclaration(fullStart, decorators, modifiers, name, /*questionToken*/ undefined);
            }

            // 'isClassMemberStart' should have hinted not to attempt parsing.
            Debug.fail("Should not have attempted to parse class member declaration.");
        }

        function parseClassExpression(): ClassExpression {
            return <ClassExpression>parseClassDeclarationOrExpression(
                /*fullStart*/ scanner.getStartPos(),
                /*decorators*/ undefined,
                /*modifiers*/ undefined,
                SyntaxKind.ClassExpression);
        }

        function parseClassDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ClassDeclaration {
            return <ClassDeclaration>parseClassDeclarationOrExpression(fullStart, decorators, modifiers, SyntaxKind.ClassDeclaration);
        }

        function parseClassDeclarationOrExpression(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray, kind: SyntaxKind): ClassLikeDeclaration {
            const node = <ClassLikeDeclaration>createNode(kind, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.ClassKeyword);
            node.name = parseNameOfClassDeclarationOrExpression();
            node.typeParameters = parseTypeParameters();
            node.heritageClauses = parseHeritageClauses(/*isClassHeritageClause*/ true);

            if (parseExpected(SyntaxKind.OpenBraceToken)) {
                // ClassTail[Yield,Await] : (Modified) See 14.5
                //      ClassHeritage[?Yield,?Await]opt { ClassBody[?Yield,?Await]opt }
                node.members = parseClassMembers();
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                node.members = createMissingList<ClassElement>();
            }

            return finishNode(node);
        }

        function parseNameOfClassDeclarationOrExpression(): Identifier {
            // implements is a future reserved word so
            // 'class implements' might mean either
            // - class expression with omitted name, 'implements' starts heritage clause
            // - class with name 'implements'
            // 'isImplementsClause' helps to disambiguate between these two cases
            return isIdentifier() && !isImplementsClause()
                ? parseIdentifier()
                : undefined;
        }

        function isImplementsClause() {
            return token === SyntaxKind.ImplementsKeyword && lookAhead(nextTokenIsIdentifierOrKeyword);
        }

        function parseHeritageClauses(isClassHeritageClause: boolean): NodeArray<HeritageClause> {
            // ClassTail[Yield,Await] : (Modified) See 14.5
            //      ClassHeritage[?Yield,?Await]opt { ClassBody[?Yield,?Await]opt }

            if (isHeritageClause()) {
                return parseList(ParsingContext.HeritageClauses, parseHeritageClause);
            }

            return undefined;
        }

        function parseHeritageClause() {
            if (token === SyntaxKind.ExtendsKeyword || token === SyntaxKind.ImplementsKeyword) {
                const node = <HeritageClause>createNode(SyntaxKind.HeritageClause);
                node.token = token;
                nextToken();
                node.types = parseDelimitedList(ParsingContext.HeritageClauseElement, parseExpressionWithTypeArguments);
                return finishNode(node);
            }

            return undefined;
        }

        function parseExpressionWithTypeArguments(): ExpressionWithTypeArguments {
            const node = <ExpressionWithTypeArguments>createNode(SyntaxKind.ExpressionWithTypeArguments);
            node.expression = parseLeftHandSideExpressionOrHigher();
            if (token === SyntaxKind.LessThanToken) {
                node.typeArguments = parseBracketedList(ParsingContext.TypeArguments, parseType, SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken);
            }

            return finishNode(node);
        }

        function isHeritageClause(): boolean {
            return token === SyntaxKind.ExtendsKeyword || token === SyntaxKind.ImplementsKeyword;
        }

        function parseClassMembers() {
            return parseList(ParsingContext.ClassMembers, parseClassElement);
        }

        function parseInterfaceDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): InterfaceDeclaration {
            const node = <InterfaceDeclaration>createNode(SyntaxKind.InterfaceDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.InterfaceKeyword);
            node.name = parseIdentifier();
            node.typeParameters = parseTypeParameters();
            node.heritageClauses = parseHeritageClauses(/*isClassHeritageClause*/ false);
            node.members = parseObjectTypeMembers();
            return finishNode(node);
        }

        function parseTypeAliasDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): TypeAliasDeclaration {
            const node = <TypeAliasDeclaration>createNode(SyntaxKind.TypeAliasDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.TypeKeyword);
            node.name = parseIdentifier();
            node.typeParameters = parseTypeParameters();
            parseExpected(SyntaxKind.EqualsToken);
            node.type = parseType();
            parseSemicolon();
            return finishNode(node);
        }

        // In an ambient declaration, the grammar only allows integer literals as initializers.
        // In a non-ambient declaration, the grammar allows uninitialized members only in a
        // ConstantEnumMemberSection, which starts at the beginning of an enum declaration
        // or any time an integer literal initializer is encountered.
        function parseEnumMember(): EnumMember {
            const node = <EnumMember>createNode(SyntaxKind.EnumMember, scanner.getStartPos());
            node.name = parsePropertyName();
            node.initializer = allowInAnd(parseNonParameterInitializer);
            return finishNode(node);
        }

        function parseEnumDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): EnumDeclaration {
            const node = <EnumDeclaration>createNode(SyntaxKind.EnumDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            parseExpected(SyntaxKind.EnumKeyword);
            node.name = parseIdentifier();
            if (parseExpected(SyntaxKind.OpenBraceToken)) {
                node.members = parseDelimitedList(ParsingContext.EnumMembers, parseEnumMember);
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                node.members = createMissingList<EnumMember>();
            }
            return finishNode(node);
        }

        function parseModuleBlock(): ModuleBlock {
            const node = <ModuleBlock>createNode(SyntaxKind.ModuleBlock, scanner.getStartPos());
            if (parseExpected(SyntaxKind.OpenBraceToken)) {
                node.statements = parseList(ParsingContext.BlockStatements, parseStatement);
                parseExpected(SyntaxKind.CloseBraceToken);
            }
            else {
                node.statements = createMissingList<Statement>();
            }
            return finishNode(node);
        }

        function parseModuleOrNamespaceDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray, flags: NodeFlags): ModuleDeclaration {
            const node = <ModuleDeclaration>createNode(SyntaxKind.ModuleDeclaration, fullStart);
            // If we are parsing a dotted namespace name, we want to
            // propagate the 'Namespace' flag across the names if set.
            const namespaceFlag = flags & NodeFlags.Namespace;
            node.decorators = decorators;
            setModifiers(node, modifiers);
            node.flags |= flags;
            node.name = parseIdentifier();
            node.body = parseOptional(SyntaxKind.DotToken)
                ? parseModuleOrNamespaceDeclaration(getNodePos(), /*decorators*/ undefined, /*modifiers*/ undefined, NodeFlags.Export | namespaceFlag)
                : parseModuleBlock();
            return finishNode(node);
        }

        function parseAmbientExternalModuleDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ModuleDeclaration {
            const node = <ModuleDeclaration>createNode(SyntaxKind.ModuleDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            if (token === SyntaxKind.GlobalKeyword) {
                // parse 'global' as name of global scope augmentation 
                node.name = parseIdentifier();
                node.flags |= NodeFlags.GlobalAugmentation;
            }
            else {
                node.name = parseLiteralNode(/*internName*/ true);
            }
            node.body = parseModuleBlock();
            return finishNode(node);
        }

        function parseModuleDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ModuleDeclaration {
            let flags = modifiers ? modifiers.flags : 0;
            if (token === SyntaxKind.GlobalKeyword) {
                // global augmentation
                return parseAmbientExternalModuleDeclaration(fullStart, decorators, modifiers);
            }
            else if (parseOptional(SyntaxKind.NamespaceKeyword)) {
                flags |= NodeFlags.Namespace;
            }
            else {
                parseExpected(SyntaxKind.ModuleKeyword);
                if (token === SyntaxKind.StringLiteral) {
                    return parseAmbientExternalModuleDeclaration(fullStart, decorators, modifiers);
                }
            }
            return parseModuleOrNamespaceDeclaration(fullStart, decorators, modifiers, flags);
        }

        function isExternalModuleReference() {
            return token === SyntaxKind.RequireKeyword &&
                lookAhead(nextTokenIsOpenParen);
        }

        function nextTokenIsOpenParen() {
            return nextToken() === SyntaxKind.OpenParenToken;
        }

        function nextTokenIsSlash() {
            return nextToken() === SyntaxKind.SlashToken;
        }

        function parseImportDeclarationOrImportEqualsDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ImportEqualsDeclaration | ImportDeclaration {
            parseExpected(SyntaxKind.ImportKeyword);
            const afterImportPos = scanner.getStartPos();

            let identifier: Identifier;
            if (isIdentifier()) {
                identifier = parseIdentifier();
                if (token !== SyntaxKind.CommaToken && token !== SyntaxKind.FromKeyword) {
                    // ImportEquals declaration of type:
                    // import x = require("mod"); or
                    // import x = M.x;
                    const importEqualsDeclaration = <ImportEqualsDeclaration>createNode(SyntaxKind.ImportEqualsDeclaration, fullStart);
                    importEqualsDeclaration.decorators = decorators;
                    setModifiers(importEqualsDeclaration, modifiers);
                    importEqualsDeclaration.name = identifier;
                    parseExpected(SyntaxKind.EqualsToken);
                    importEqualsDeclaration.moduleReference = parseModuleReference();
                    parseSemicolon();
                    return finishNode(importEqualsDeclaration);
                }
            }

            // Import statement
            const importDeclaration = <ImportDeclaration>createNode(SyntaxKind.ImportDeclaration, fullStart);
            importDeclaration.decorators = decorators;
            setModifiers(importDeclaration, modifiers);

            // ImportDeclaration:
            //  import ImportClause from ModuleSpecifier ;
            //  import ModuleSpecifier;
            if (identifier || // import id
                token === SyntaxKind.AsteriskToken || // import *
                token === SyntaxKind.OpenBraceToken) { // import {
                importDeclaration.importClause = parseImportClause(identifier, afterImportPos);
                parseExpected(SyntaxKind.FromKeyword);
            }

            importDeclaration.moduleSpecifier = parseModuleSpecifier();
            parseSemicolon();
            return finishNode(importDeclaration);
        }

        function parseImportClause(identifier: Identifier, fullStart: number) {
            // ImportClause:
            //  ImportedDefaultBinding
            //  NameSpaceImport
            //  NamedImports
            //  ImportedDefaultBinding, NameSpaceImport
            //  ImportedDefaultBinding, NamedImports

            const importClause = <ImportClause>createNode(SyntaxKind.ImportClause, fullStart);
            if (identifier) {
                // ImportedDefaultBinding:
                //  ImportedBinding
                importClause.name = identifier;
            }

            // If there was no default import or if there is comma token after default import
            // parse namespace or named imports
            if (!importClause.name ||
                parseOptional(SyntaxKind.CommaToken)) {
                importClause.namedBindings = token === SyntaxKind.AsteriskToken ? parseNamespaceImport() : parseNamedImportsOrExports(SyntaxKind.NamedImports);
            }

            return finishNode(importClause);
        }

        function parseModuleReference() {
            return isExternalModuleReference()
                ? parseExternalModuleReference()
                : parseEntityName(/*allowReservedWords*/ false);
        }

        function parseExternalModuleReference() {
            const node = <ExternalModuleReference>createNode(SyntaxKind.ExternalModuleReference);
            parseExpected(SyntaxKind.RequireKeyword);
            parseExpected(SyntaxKind.OpenParenToken);
            node.expression = parseModuleSpecifier();
            parseExpected(SyntaxKind.CloseParenToken);
            return finishNode(node);
        }

        function parseModuleSpecifier(): Expression {
            if (token === SyntaxKind.StringLiteral) {
                const result = parseLiteralNode();
                internIdentifier((<LiteralExpression>result).text);
                return result;
            }
            else {
                // We allow arbitrary expressions here, even though the grammar only allows string
                // literals.  We check to ensure that it is only a string literal later in the grammar
                // check pass.
                return parseExpression();
            }
        }

        function parseNamespaceImport(): NamespaceImport {
            // NameSpaceImport:
            //  * as ImportedBinding
            const namespaceImport = <NamespaceImport>createNode(SyntaxKind.NamespaceImport);
            parseExpected(SyntaxKind.AsteriskToken);
            parseExpected(SyntaxKind.AsKeyword);
            namespaceImport.name = parseIdentifier();
            return finishNode(namespaceImport);
        }

        function parseNamedImportsOrExports(kind: SyntaxKind): NamedImportsOrExports {
            const node = <NamedImports>createNode(kind);

            // NamedImports:
            //  { }
            //  { ImportsList }
            //  { ImportsList, }

            // ImportsList:
            //  ImportSpecifier
            //  ImportsList, ImportSpecifier
            node.elements = parseBracketedList(ParsingContext.ImportOrExportSpecifiers,
                kind === SyntaxKind.NamedImports ? parseImportSpecifier : parseExportSpecifier,
                SyntaxKind.OpenBraceToken, SyntaxKind.CloseBraceToken);
            return finishNode(node);
        }

        function parseExportSpecifier() {
            return parseImportOrExportSpecifier(SyntaxKind.ExportSpecifier);
        }

        function parseImportSpecifier() {
            return parseImportOrExportSpecifier(SyntaxKind.ImportSpecifier);
        }

        function parseImportOrExportSpecifier(kind: SyntaxKind): ImportOrExportSpecifier {
            const node = <ImportSpecifier>createNode(kind);
            // ImportSpecifier:
            //   BindingIdentifier
            //   IdentifierName as BindingIdentifier
            // ExportSpecififer:
            //   IdentifierName
            //   IdentifierName as IdentifierName
            let checkIdentifierIsKeyword = isKeyword(token) && !isIdentifier();
            let checkIdentifierStart = scanner.getTokenPos();
            let checkIdentifierEnd = scanner.getTextPos();
            const identifierName = parseIdentifierName();
            if (token === SyntaxKind.AsKeyword) {
                node.propertyName = identifierName;
                parseExpected(SyntaxKind.AsKeyword);
                checkIdentifierIsKeyword = isKeyword(token) && !isIdentifier();
                checkIdentifierStart = scanner.getTokenPos();
                checkIdentifierEnd = scanner.getTextPos();
                node.name = parseIdentifierName();
            }
            else {
                node.name = identifierName;
            }
            if (kind === SyntaxKind.ImportSpecifier && checkIdentifierIsKeyword) {
                // Report error identifier expected
                parseErrorAtPosition(checkIdentifierStart, checkIdentifierEnd - checkIdentifierStart, Diagnostics.Identifier_expected);
            }
            return finishNode(node);
        }

        function parseExportDeclaration(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ExportDeclaration {
            const node = <ExportDeclaration>createNode(SyntaxKind.ExportDeclaration, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            if (parseOptional(SyntaxKind.AsteriskToken)) {
                parseExpected(SyntaxKind.FromKeyword);
                node.moduleSpecifier = parseModuleSpecifier();
            }
            else {
                node.exportClause = parseNamedImportsOrExports(SyntaxKind.NamedExports);

                // It is not uncommon to accidentally omit the 'from' keyword. Additionally, in editing scenarios,
                // the 'from' keyword can be parsed as a named export when the export clause is unterminated (i.e. `export { from "moduleName";`)
                // If we don't have a 'from' keyword, see if we have a string literal such that ASI won't take effect.
                if (token === SyntaxKind.FromKeyword || (token === SyntaxKind.StringLiteral && !scanner.hasPrecedingLineBreak())) {
                    parseExpected(SyntaxKind.FromKeyword);
                    node.moduleSpecifier = parseModuleSpecifier();
                }
            }
            parseSemicolon();
            return finishNode(node);
        }

        function parseExportAssignment(fullStart: number, decorators: NodeArray<Decorator>, modifiers: ModifiersArray): ExportAssignment {
            const node = <ExportAssignment>createNode(SyntaxKind.ExportAssignment, fullStart);
            node.decorators = decorators;
            setModifiers(node, modifiers);
            if (parseOptional(SyntaxKind.EqualsToken)) {
                node.isExportEquals = true;
            }
            else {
                parseExpected(SyntaxKind.DefaultKeyword);
            }
            node.expression = parseAssignmentExpressionOrHigher();
            parseSemicolon();
            return finishNode(node);
        }

        function processReferenceComments(sourceFile: SourceFile): void {
            const triviaScanner = createScanner(sourceFile.languageVersion, /*skipTrivia*/false, LanguageVariant.Standard, sourceText);
            const referencedFiles: FileReference[] = [];
            const amdDependencies: { path: string; name: string }[] = [];
            let amdModuleName: string;

            // Keep scanning all the leading trivia in the file until we get to something that
            // isn't trivia.  Any single line comment will be analyzed to see if it is a
            // reference comment.
            while (true) {
                const kind = triviaScanner.scan();
                if (kind !== SyntaxKind.SingleLineCommentTrivia) {
                    if (isTrivia(kind)) {
                        continue;
                    }
                    else {
                        break;
                    }
                }

                const range = { pos: triviaScanner.getTokenPos(), end: triviaScanner.getTextPos(), kind: triviaScanner.getToken() };

                const comment = sourceText.substring(range.pos, range.end);
                const referencePathMatchResult = getFileReferenceFromReferencePath(comment, range);
                if (referencePathMatchResult) {
                    const fileReference = referencePathMatchResult.fileReference;
                    sourceFile.hasNoDefaultLib = referencePathMatchResult.isNoDefaultLib;
                    const diagnosticMessage = referencePathMatchResult.diagnosticMessage;
                    if (fileReference) {
                        referencedFiles.push(fileReference);
                    }
                    if (diagnosticMessage) {
                        parseDiagnostics.push(createFileDiagnostic(sourceFile, range.pos, range.end - range.pos, diagnosticMessage));
                    }
                }
                else {
                    const amdModuleNameRegEx = /^\/\/\/\s*<amd-module\s+name\s*=\s*('|")(.+?)\1/gim;
                    const amdModuleNameMatchResult = amdModuleNameRegEx.exec(comment);
                    if (amdModuleNameMatchResult) {
                        if (amdModuleName) {
                            parseDiagnostics.push(createFileDiagnostic(sourceFile, range.pos, range.end - range.pos, Diagnostics.An_AMD_module_cannot_have_multiple_name_assignments));
                        }
                        amdModuleName = amdModuleNameMatchResult[2];
                    }

                    const amdDependencyRegEx = /^\/\/\/\s*<amd-dependency\s/gim;
                    const pathRegex = /\spath\s*=\s*('|")(.+?)\1/gim;
                    const nameRegex = /\sname\s*=\s*('|")(.+?)\1/gim;
                    const amdDependencyMatchResult = amdDependencyRegEx.exec(comment);
                    if (amdDependencyMatchResult) {
                        const pathMatchResult = pathRegex.exec(comment);
                        const nameMatchResult = nameRegex.exec(comment);
                        if (pathMatchResult) {
                            const amdDependency = { path: pathMatchResult[2], name: nameMatchResult ? nameMatchResult[2] : undefined };
                            amdDependencies.push(amdDependency);
                        }
                    }
                }
            }

            sourceFile.referencedFiles = referencedFiles;
            sourceFile.amdDependencies = amdDependencies;
            sourceFile.moduleName = amdModuleName;
        }

        function setExternalModuleIndicator(sourceFile: SourceFile) {
            sourceFile.externalModuleIndicator = forEach(sourceFile.statements, node =>
                node.flags & NodeFlags.Export
                    || node.kind === SyntaxKind.ImportEqualsDeclaration && (<ImportEqualsDeclaration>node).moduleReference.kind === SyntaxKind.ExternalModuleReference
                    || node.kind === SyntaxKind.ImportDeclaration
                    || node.kind === SyntaxKind.ExportAssignment
                    || node.kind === SyntaxKind.ExportDeclaration
                    ? node
                    : undefined);
        }

        const enum ParsingContext {
            SourceElements,            // Elements in source file
            BlockStatements,           // Statements in block
            SwitchClauses,             // Clauses in switch statement
            SwitchClauseStatements,    // Statements in switch clause
            TypeMembers,               // Members in interface or type literal
            ClassMembers,              // Members in class declaration
            EnumMembers,               // Members in enum declaration
            HeritageClauseElement,     // Elements in a heritage clause
            VariableDeclarations,      // Variable declarations in variable statement
            ObjectBindingElements,     // Binding elements in object binding list
            ArrayBindingElements,      // Binding elements in array binding list
            ArgumentExpressions,       // Expressions in argument list
            ObjectLiteralMembers,      // Members in object literal
            JsxAttributes,             // Attributes in jsx element
            JsxChildren,               // Things between opening and closing JSX tags
            ArrayLiteralMembers,       // Members in array literal
            Parameters,                // Parameters in parameter list
            TypeParameters,            // Type parameters in type parameter list
            TypeArguments,             // Type arguments in type argument list
            TupleElementTypes,         // Element types in tuple element type list
            HeritageClauses,           // Heritage clauses for a class or interface declaration.
            ImportOrExportSpecifiers,  // Named import clause's import specifier list
            JSDocFunctionParameters,
            JSDocTypeArguments,
            JSDocRecordMembers,
            JSDocTupleTypes,
            Count                      // Number of parsing contexts
        }

        const enum Tristate {
            False,
            True,
            Unknown
        }

        export namespace JSDocParser {
            export function isJSDocType() {
                switch (token) {
                    case SyntaxKind.AsteriskToken:
                    case SyntaxKind.QuestionToken:
                    case SyntaxKind.OpenParenToken:
                    case SyntaxKind.OpenBracketToken:
                    case SyntaxKind.ExclamationToken:
                    case SyntaxKind.OpenBraceToken:
                    case SyntaxKind.FunctionKeyword:
                    case SyntaxKind.DotDotDotToken:
                    case SyntaxKind.NewKeyword:
                    case SyntaxKind.ThisKeyword:
                        return true;
                }

                return tokenIsIdentifierOrKeyword(token);
            }

            export function parseJSDocTypeExpressionForTests(content: string, start: number, length: number) {
                initializeState("file.js", content, ScriptTarget.Latest, /*isJavaScriptFile*/ true, /*_syntaxCursor:*/ undefined);
                scanner.setText(content, start, length);
                token = scanner.scan();
                const jsDocTypeExpression = parseJSDocTypeExpression();
                const diagnostics = parseDiagnostics;
                clearState();

                return jsDocTypeExpression ? { jsDocTypeExpression, diagnostics } : undefined;
            }

            // Parses out a JSDoc type expression.
            /* @internal */
            export function parseJSDocTypeExpression(): JSDocTypeExpression {
                const result = <JSDocTypeExpression>createNode(SyntaxKind.JSDocTypeExpression, scanner.getTokenPos());

                parseExpected(SyntaxKind.OpenBraceToken);
                result.type = parseJSDocTopLevelType();
                parseExpected(SyntaxKind.CloseBraceToken);

                fixupParentReferences(result);
                return finishNode(result);
            }

            function parseJSDocTopLevelType(): JSDocType {
                let type = parseJSDocType();
                if (token === SyntaxKind.BarToken) {
                    const unionType = <JSDocUnionType>createNode(SyntaxKind.JSDocUnionType, type.pos);
                    unionType.types = parseJSDocTypeList(type);
                    type = finishNode(unionType);
                }

                if (token === SyntaxKind.EqualsToken) {
                    const optionalType = <JSDocOptionalType>createNode(SyntaxKind.JSDocOptionalType, type.pos);
                    nextToken();
                    optionalType.type = type;
                    type = finishNode(optionalType);
                }

                return type;
            }

            function parseJSDocType(): JSDocType {
                let type = parseBasicTypeExpression();

                while (true) {
                    if (token === SyntaxKind.OpenBracketToken) {
                        const arrayType = <JSDocArrayType>createNode(SyntaxKind.JSDocArrayType, type.pos);
                        arrayType.elementType = type;

                        nextToken();
                        parseExpected(SyntaxKind.CloseBracketToken);

                        type = finishNode(arrayType);
                    }
                    else if (token === SyntaxKind.QuestionToken) {
                        const nullableType = <JSDocNullableType>createNode(SyntaxKind.JSDocNullableType, type.pos);
                        nullableType.type = type;

                        nextToken();
                        type = finishNode(nullableType);
                    }
                    else if (token === SyntaxKind.ExclamationToken) {
                        const nonNullableType = <JSDocNonNullableType>createNode(SyntaxKind.JSDocNonNullableType, type.pos);
                        nonNullableType.type = type;

                        nextToken();
                        type = finishNode(nonNullableType);
                    }
                    else {
                        break;
                    }
                }

                return type;
            }

            function parseBasicTypeExpression(): JSDocType {
                switch (token) {
                    case SyntaxKind.AsteriskToken:
                        return parseJSDocAllType();
                    case SyntaxKind.QuestionToken:
                        return parseJSDocUnknownOrNullableType();
                    case SyntaxKind.OpenParenToken:
                        return parseJSDocUnionType();
                    case SyntaxKind.OpenBracketToken:
                        return parseJSDocTupleType();
                    case SyntaxKind.ExclamationToken:
                        return parseJSDocNonNullableType();
                    case SyntaxKind.OpenBraceToken:
                        return parseJSDocRecordType();
                    case SyntaxKind.FunctionKeyword:
                        return parseJSDocFunctionType();
                    case SyntaxKind.DotDotDotToken:
                        return parseJSDocVariadicType();
                    case SyntaxKind.NewKeyword:
                        return parseJSDocConstructorType();
                    case SyntaxKind.ThisKeyword:
                        return parseJSDocThisType();
                    case SyntaxKind.AnyKeyword:
                    case SyntaxKind.StringKeyword:
                    case SyntaxKind.NumberKeyword:
                    case SyntaxKind.BooleanKeyword:
                    case SyntaxKind.SymbolKeyword:
                    case SyntaxKind.VoidKeyword:
                        return parseTokenNode<JSDocType>();
                }

                // TODO (drosen): Parse string literal types in JSDoc as well.
                return parseJSDocTypeReference();
            }

            function parseJSDocThisType(): JSDocThisType {
                const result = <JSDocThisType>createNode(SyntaxKind.JSDocThisType);
                nextToken();
                parseExpected(SyntaxKind.ColonToken);
                result.type = parseJSDocType();
                return finishNode(result);
            }

            function parseJSDocConstructorType(): JSDocConstructorType {
                const result = <JSDocConstructorType>createNode(SyntaxKind.JSDocConstructorType);
                nextToken();
                parseExpected(SyntaxKind.ColonToken);
                result.type = parseJSDocType();
                return finishNode(result);
            }

            function parseJSDocVariadicType(): JSDocVariadicType {
                const result = <JSDocVariadicType>createNode(SyntaxKind.JSDocVariadicType);
                nextToken();
                result.type = parseJSDocType();
                return finishNode(result);
            }

            function parseJSDocFunctionType(): JSDocFunctionType {
                const result = <JSDocFunctionType>createNode(SyntaxKind.JSDocFunctionType);
                nextToken();

                parseExpected(SyntaxKind.OpenParenToken);
                result.parameters = parseDelimitedList(ParsingContext.JSDocFunctionParameters, parseJSDocParameter);
                checkForTrailingComma(result.parameters);
                parseExpected(SyntaxKind.CloseParenToken);

                if (token === SyntaxKind.ColonToken) {
                    nextToken();
                    result.type = parseJSDocType();
                }

                return finishNode(result);
            }

            function parseJSDocParameter(): ParameterDeclaration {
                const parameter = <ParameterDeclaration>createNode(SyntaxKind.Parameter);
                parameter.type = parseJSDocType();
                if (parseOptional(SyntaxKind.EqualsToken)) {
                    parameter.questionToken = createNode(SyntaxKind.EqualsToken);
                }
                return finishNode(parameter);
            }

            function parseJSDocTypeReference(): JSDocTypeReference {
                const result = <JSDocTypeReference>createNode(SyntaxKind.JSDocTypeReference);
                result.name = parseSimplePropertyName();

                if (token === SyntaxKind.LessThanToken) {
                    result.typeArguments = parseTypeArguments();
                }
                else {
                    while (parseOptional(SyntaxKind.DotToken)) {
                        if (token === SyntaxKind.LessThanToken) {
                            result.typeArguments = parseTypeArguments();
                            break;
                        }
                        else {
                            result.name = parseQualifiedName(result.name);
                        }
                    }
                }


                return finishNode(result);
            }

            function parseTypeArguments() {
                // Move past the <
                nextToken();
                const typeArguments = parseDelimitedList(ParsingContext.JSDocTypeArguments, parseJSDocType);
                checkForTrailingComma(typeArguments);
                checkForEmptyTypeArgumentList(typeArguments);
                parseExpected(SyntaxKind.GreaterThanToken);

                return typeArguments;
            }

            function checkForEmptyTypeArgumentList(typeArguments: NodeArray<Node>) {
                if (parseDiagnostics.length === 0 &&  typeArguments && typeArguments.length === 0) {
                    const start = typeArguments.pos - "<".length;
                    const end = skipTrivia(sourceText, typeArguments.end) + ">".length;
                    return parseErrorAtPosition(start, end - start, Diagnostics.Type_argument_list_cannot_be_empty);
                }
            }

            function parseQualifiedName(left: EntityName): QualifiedName {
                const result = <QualifiedName>createNode(SyntaxKind.QualifiedName, left.pos);
                result.left = left;
                result.right = parseIdentifierName();

                return finishNode(result);
            }

            function parseJSDocRecordType(): JSDocRecordType {
                const result = <JSDocRecordType>createNode(SyntaxKind.JSDocRecordType);
                nextToken();
                result.members = parseDelimitedList(ParsingContext.JSDocRecordMembers, parseJSDocRecordMember);
                checkForTrailingComma(result.members);
                parseExpected(SyntaxKind.CloseBraceToken);
                return finishNode(result);
            }

            function parseJSDocRecordMember(): JSDocRecordMember {
                const result = <JSDocRecordMember>createNode(SyntaxKind.JSDocRecordMember);
                result.name = parseSimplePropertyName();

                if (token === SyntaxKind.ColonToken) {
                    nextToken();
                    result.type = parseJSDocType();
                }

                return finishNode(result);
            }

            function parseJSDocNonNullableType(): JSDocNonNullableType {
                const result = <JSDocNonNullableType>createNode(SyntaxKind.JSDocNonNullableType);
                nextToken();
                result.type = parseJSDocType();
                return finishNode(result);
            }

            function parseJSDocTupleType(): JSDocTupleType {
                const result = <JSDocTupleType>createNode(SyntaxKind.JSDocTupleType);
                nextToken();
                result.types = parseDelimitedList(ParsingContext.JSDocTupleTypes, parseJSDocType);
                checkForTrailingComma(result.types);
                parseExpected(SyntaxKind.CloseBracketToken);

                return finishNode(result);
            }

            function checkForTrailingComma(list: NodeArray<Node>) {
                if (parseDiagnostics.length === 0 && list.hasTrailingComma) {
                    const start = list.end - ",".length;
                    parseErrorAtPosition(start, ",".length, Diagnostics.Trailing_comma_not_allowed);
                }
            }

            function parseJSDocUnionType(): JSDocUnionType {
                const result = <JSDocUnionType>createNode(SyntaxKind.JSDocUnionType);
                nextToken();
                result.types = parseJSDocTypeList(parseJSDocType());

                parseExpected(SyntaxKind.CloseParenToken);

                return finishNode(result);
            }

            function parseJSDocTypeList(firstType: JSDocType) {
                Debug.assert(!!firstType);

                const types = <NodeArray<JSDocType>>[];
                types.pos = firstType.pos;

                types.push(firstType);
                while (parseOptional(SyntaxKind.BarToken)) {
                    types.push(parseJSDocType());
                }

                types.end = scanner.getStartPos();
                return types;
            }

            function parseJSDocAllType(): JSDocAllType {
                const result = <JSDocAllType>createNode(SyntaxKind.JSDocAllType);
                nextToken();
                return finishNode(result);
            }

            function parseJSDocUnknownOrNullableType(): JSDocUnknownType | JSDocNullableType {
                const pos = scanner.getStartPos();
                // skip the ?
                nextToken();

                // Need to lookahead to decide if this is a nullable or unknown type.

                // Here are cases where we'll pick the unknown type:
                //
                //      Foo(?,
                //      { a: ? }
                //      Foo(?)
                //      Foo<?>
                //      Foo(?=
                //      (?|
                if (token === SyntaxKind.CommaToken ||
                    token === SyntaxKind.CloseBraceToken ||
                    token === SyntaxKind.CloseParenToken ||
                    token === SyntaxKind.GreaterThanToken ||
                    token === SyntaxKind.EqualsToken ||
                    token === SyntaxKind.BarToken) {

                    const result = <JSDocUnknownType>createNode(SyntaxKind.JSDocUnknownType, pos);
                    return finishNode(result);
                }
                else {
                    const result = <JSDocNullableType>createNode(SyntaxKind.JSDocNullableType, pos);
                    result.type = parseJSDocType();
                    return finishNode(result);
                }
            }

            export function parseIsolatedJSDocComment(content: string, start: number, length: number) {
                initializeState("file.js", content, ScriptTarget.Latest, /*isJavaScriptFile*/ true, /*_syntaxCursor:*/ undefined);
                sourceFile = <SourceFile>{ languageVariant: LanguageVariant.Standard, text: content };
                const jsDocComment = parseJSDocCommentWorker(start, length);
                const diagnostics = parseDiagnostics;
                clearState();

                return jsDocComment ? { jsDocComment, diagnostics } : undefined;
            }

            export function parseJSDocComment(parent: Node, start: number, length: number): JSDocComment {
                const saveToken = token;
                const saveParseDiagnosticsLength = parseDiagnostics.length;
                const saveParseErrorBeforeNextFinishedNode = parseErrorBeforeNextFinishedNode;

                const comment = parseJSDocCommentWorker(start, length);
                if (comment) {
                    comment.parent = parent;
                }

                token = saveToken;
                parseDiagnostics.length = saveParseDiagnosticsLength;
                parseErrorBeforeNextFinishedNode = saveParseErrorBeforeNextFinishedNode;

                return comment;
            }

            export function parseJSDocCommentWorker(start: number, length: number): JSDocComment {
                const content = sourceText;
                start = start || 0;
                const end = length === undefined ? content.length : start + length;
                length = end - start;

                Debug.assert(start >= 0);
                Debug.assert(start <= end);
                Debug.assert(end <= content.length);

                let tags: NodeArray<JSDocTag>;

                let result: JSDocComment;

                // Check for /** (JSDoc opening part)
                if (content.charCodeAt(start) === CharacterCodes.slash &&
                    content.charCodeAt(start + 1) === CharacterCodes.asterisk &&
                    content.charCodeAt(start + 2) === CharacterCodes.asterisk &&
                    content.charCodeAt(start + 3) !== CharacterCodes.asterisk) {


                    // + 3 for leading /**, - 5 in total for /** */
                    scanner.scanRange(start + 3, length - 5, () => {
                        // Initially we can parse out a tag.  We also have seen a starting asterisk.
                        // This is so that /** * @type */ doesn't parse.
                        let canParseTag = true;
                        let seenAsterisk = true;

                        nextJSDocToken();
                        while (token !== SyntaxKind.EndOfFileToken) {
                            switch (token) {
                                case SyntaxKind.AtToken:
                                    if (canParseTag) {
                                        parseTag();
                                    }
                                    // This will take us to the end of the line, so it's OK to parse a tag on the next pass through the loop
                                    seenAsterisk = false;
                                    break;

                                case SyntaxKind.NewLineTrivia:
                                    // After a line break, we can parse a tag, and we haven't seen an asterisk on the next line yet
                                    canParseTag = true;
                                    seenAsterisk = false;
                                    break;

                                case SyntaxKind.AsteriskToken:
                                    if (seenAsterisk) {
                                        // If we've already seen an asterisk, then we can no longer parse a tag on this line
                                        canParseTag = false;
                                    }
                                    // Ignore the first asterisk on a line
                                    seenAsterisk = true;
                                    break;

                                case SyntaxKind.Identifier:
                                    // Anything else is doc comment text.  We can't do anything with it.  Because it
                                    // wasn't a tag, we can no longer parse a tag on this line until we hit the next
                                    // line break.
                                    canParseTag = false;
                                    break;

                                case SyntaxKind.EndOfFileToken:
                                    break;
                            }

                            nextJSDocToken();
                        }

                        result = createJSDocComment();

                    });
                }

                return result;

                function createJSDocComment(): JSDocComment {
                    if (!tags) {
                        return undefined;
                    }

                    const result = <JSDocComment>createNode(SyntaxKind.JSDocComment, start);
                    result.tags = tags;
                    return finishNode(result, end);
                }

                function skipWhitespace(): void {
                    while (token === SyntaxKind.WhitespaceTrivia || token === SyntaxKind.NewLineTrivia) {
                        nextJSDocToken();
                    }
                }

                function parseTag(): void {
                    Debug.assert(token === SyntaxKind.AtToken);
                    const atToken = createNode(SyntaxKind.AtToken, scanner.getTokenPos());
                    atToken.end = scanner.getTextPos();
                    nextJSDocToken();

                    const tagName = parseJSDocIdentifier();
                    if (!tagName) {
                        return;
                    }

                    const tag = handleTag(atToken, tagName) || handleUnknownTag(atToken, tagName);
                    addTag(tag);
                }

                function handleTag(atToken: Node, tagName: Identifier): JSDocTag {
                    if (tagName) {
                        switch (tagName.text) {
                            case "param":
                                return handleParamTag(atToken, tagName);
                            case "return":
                            case "returns":
                                return handleReturnTag(atToken, tagName);
                            case "template":
                                return handleTemplateTag(atToken, tagName);
                            case "type":
                                return handleTypeTag(atToken, tagName);
                        }
                    }

                    return undefined;
                }

                function handleUnknownTag(atToken: Node, tagName: Identifier) {
                    const result = <JSDocTag>createNode(SyntaxKind.JSDocTag, atToken.pos);
                    result.atToken = atToken;
                    result.tagName = tagName;
                    return finishNode(result);
                }

                function addTag(tag: JSDocTag): void {
                    if (tag) {
                        if (!tags) {
                            tags = <NodeArray<JSDocTag>>[];
                            tags.pos = tag.pos;
                        }

                        tags.push(tag);
                        tags.end = tag.end;
                    }
                }

                function tryParseTypeExpression(): JSDocTypeExpression {
                    if (token !== SyntaxKind.OpenBraceToken) {
                        return undefined;
                    }

                    const typeExpression = parseJSDocTypeExpression();
                    return typeExpression;
                }

                function handleParamTag(atToken: Node, tagName: Identifier) {
                    let typeExpression = tryParseTypeExpression();

                    skipWhitespace();
                    let name: Identifier;
                    let isBracketed: boolean;
                    // Looking for something like '[foo]' or 'foo'
                    if (parseOptionalToken(SyntaxKind.OpenBracketToken)) {
                        name = parseJSDocIdentifier();
                        isBracketed = true;

                        // May have an optional default, e.g. '[foo = 42]'
                        if (parseOptionalToken(SyntaxKind.EqualsToken)) {
                            parseExpression();
                        }

                        parseExpected(SyntaxKind.CloseBracketToken);
                    }
                    else if (token === SyntaxKind.Identifier) {
                        name = parseJSDocIdentifier();
                    }

                    if (!name) {
                        parseErrorAtPosition(scanner.getStartPos(), 0, Diagnostics.Identifier_expected);
                        return undefined;
                    }

                    let preName: Identifier, postName: Identifier;
                    if (typeExpression) {
                        postName = name;
                    }
                    else {
                        preName = name;
                    }

                    if (!typeExpression) {
                        typeExpression = tryParseTypeExpression();
                    }

                    const result = <JSDocParameterTag>createNode(SyntaxKind.JSDocParameterTag, atToken.pos);
                    result.atToken = atToken;
                    result.tagName = tagName;
                    result.preParameterName = preName;
                    result.typeExpression = typeExpression;
                    result.postParameterName = postName;
                    result.isBracketed = isBracketed;
                    return finishNode(result);
                }

                function handleReturnTag(atToken: Node, tagName: Identifier): JSDocReturnTag {
                    if (forEach(tags, t => t.kind === SyntaxKind.JSDocReturnTag)) {
                        parseErrorAtPosition(tagName.pos, scanner.getTokenPos() - tagName.pos, Diagnostics._0_tag_already_specified, tagName.text);
                    }

                    const result = <JSDocReturnTag>createNode(SyntaxKind.JSDocReturnTag, atToken.pos);
                    result.atToken = atToken;
                    result.tagName = tagName;
                    result.typeExpression = tryParseTypeExpression();
                    return finishNode(result);
                }

                function handleTypeTag(atToken: Node, tagName: Identifier): JSDocTypeTag {
                    if (forEach(tags, t => t.kind === SyntaxKind.JSDocTypeTag)) {
                        parseErrorAtPosition(tagName.pos, scanner.getTokenPos() - tagName.pos, Diagnostics._0_tag_already_specified, tagName.text);
                    }

                    const result = <JSDocTypeTag>createNode(SyntaxKind.JSDocTypeTag, atToken.pos);
                    result.atToken = atToken;
                    result.tagName = tagName;
                    result.typeExpression = tryParseTypeExpression();
                    return finishNode(result);
                }

                function handleTemplateTag(atToken: Node, tagName: Identifier): JSDocTemplateTag {
                    if (forEach(tags, t => t.kind === SyntaxKind.JSDocTemplateTag)) {
                        parseErrorAtPosition(tagName.pos, scanner.getTokenPos() - tagName.pos, Diagnostics._0_tag_already_specified, tagName.text);
                    }

                    // Type parameter list looks like '@template T,U,V'
                    const typeParameters = <NodeArray<TypeParameterDeclaration>>[];
                    typeParameters.pos = scanner.getStartPos();

                    while (true) {
                        const name = parseJSDocIdentifier();
                        if (!name) {
                            parseErrorAtPosition(scanner.getStartPos(), 0, Diagnostics.Identifier_expected);
                            return undefined;
                        }

                        const typeParameter = <TypeParameterDeclaration>createNode(SyntaxKind.TypeParameter, name.pos);
                        typeParameter.name = name;
                        finishNode(typeParameter);

                        typeParameters.push(typeParameter);

                        if (token === SyntaxKind.CommaToken) {
                            nextJSDocToken();
                        }
                        else {
                            break;
                        }
                    }

                    const result = <JSDocTemplateTag>createNode(SyntaxKind.JSDocTemplateTag, atToken.pos);
                    result.atToken = atToken;
                    result.tagName = tagName;
                    result.typeParameters = typeParameters;
                    finishNode(result);
                    typeParameters.end = result.end;
                    return result;
                }

                function nextJSDocToken(): SyntaxKind {
                    return token = scanner.scanJSDocToken();
                }

                function parseJSDocIdentifier(): Identifier {
                    if (token !== SyntaxKind.Identifier) {
                        parseErrorAtCurrentToken(Diagnostics.Identifier_expected);
                        return undefined;
                    }

                    const pos = scanner.getTokenPos();
                    const end = scanner.getTextPos();
                    const result = <Identifier>createNode(SyntaxKind.Identifier, pos);
                    result.text = content.substring(pos, end);
                    finishNode(result, end);

                    nextJSDocToken();
                    return result;
                }
            }
        }
    }

    namespace IncrementalParser {
        export function updateSourceFile(sourceFile: SourceFile, newText: string, textChangeRange: TextChangeRange, aggressiveChecks: boolean): SourceFile {
            aggressiveChecks = aggressiveChecks || Debug.shouldAssert(AssertionLevel.Aggressive);

            checkChangeRange(sourceFile, newText, textChangeRange, aggressiveChecks);
            if (textChangeRangeIsUnchanged(textChangeRange)) {
                // if the text didn't change, then we can just return our current source file as-is.
                return sourceFile;
            }

            if (sourceFile.statements.length === 0) {
                // If we don't have any statements in the current source file, then there's no real
                // way to incrementally parse.  So just do a full parse instead.
                return Parser.parseSourceFile(sourceFile.fileName, newText, sourceFile.languageVersion, /*syntaxCursor*/ undefined, /*setParentNodes*/ true);
            }

            // Make sure we're not trying to incrementally update a source file more than once.  Once
            // we do an update the original source file is considered unusbale from that point onwards.
            //
            // This is because we do incremental parsing in-place.  i.e. we take nodes from the old
            // tree and give them new positions and parents.  From that point on, trusting the old
            // tree at all is not possible as far too much of it may violate invariants.
            const incrementalSourceFile = <IncrementalNode><Node>sourceFile;
            Debug.assert(!incrementalSourceFile.hasBeenIncrementallyParsed);
            incrementalSourceFile.hasBeenIncrementallyParsed = true;

            const oldText = sourceFile.text;
            const syntaxCursor = createSyntaxCursor(sourceFile);

            // Make the actual change larger so that we know to reparse anything whose lookahead
            // might have intersected the change.
            const changeRange = extendToAffectedRange(sourceFile, textChangeRange);
            checkChangeRange(sourceFile, newText, changeRange, aggressiveChecks);

            // Ensure that extending the affected range only moved the start of the change range
            // earlier in the file.
            Debug.assert(changeRange.span.start <= textChangeRange.span.start);
            Debug.assert(textSpanEnd(changeRange.span) === textSpanEnd(textChangeRange.span));
            Debug.assert(textSpanEnd(textChangeRangeNewSpan(changeRange)) === textSpanEnd(textChangeRangeNewSpan(textChangeRange)));

            // The is the amount the nodes after the edit range need to be adjusted.  It can be
            // positive (if the edit added characters), negative (if the edit deleted characters)
            // or zero (if this was a pure overwrite with nothing added/removed).
            const delta = textChangeRangeNewSpan(changeRange).length - changeRange.span.length;

            // If we added or removed characters during the edit, then we need to go and adjust all
            // the nodes after the edit.  Those nodes may move forward (if we inserted chars) or they
            // may move backward (if we deleted chars).
            //
            // Doing this helps us out in two ways.  First, it means that any nodes/tokens we want
            // to reuse are already at the appropriate position in the new text.  That way when we
            // reuse them, we don't have to figure out if they need to be adjusted.  Second, it makes
            // it very easy to determine if we can reuse a node.  If the node's position is at where
            // we are in the text, then we can reuse it.  Otherwise we can't.  If the node's position
            // is ahead of us, then we'll need to rescan tokens.  If the node's position is behind
            // us, then we'll need to skip it or crumble it as appropriate
            //
            // We will also adjust the positions of nodes that intersect the change range as well.
            // By doing this, we ensure that all the positions in the old tree are consistent, not
            // just the positions of nodes entirely before/after the change range.  By being
            // consistent, we can then easily map from positions to nodes in the old tree easily.
            //
            // Also, mark any syntax elements that intersect the changed span.  We know, up front,
            // that we cannot reuse these elements.
            updateTokenPositionsAndMarkElements(incrementalSourceFile,
                changeRange.span.start, textSpanEnd(changeRange.span), textSpanEnd(textChangeRangeNewSpan(changeRange)), delta, oldText, newText, aggressiveChecks);

            // Now that we've set up our internal incremental state just proceed and parse the
            // source file in the normal fashion.  When possible the parser will retrieve and
            // reuse nodes from the old tree.
            //
            // Note: passing in 'true' for setNodeParents is very important.  When incrementally
            // parsing, we will be reusing nodes from the old tree, and placing it into new
            // parents.  If we don't set the parents now, we'll end up with an observably
            // inconsistent tree.  Setting the parents on the new tree should be very fast.  We
            // will immediately bail out of walking any subtrees when we can see that their parents
            // are already correct.
            const result = Parser.parseSourceFile(sourceFile.fileName, newText, sourceFile.languageVersion, syntaxCursor, /*setParentNodes*/ true);

            return result;
        }

        function moveElementEntirelyPastChangeRange(element: IncrementalElement, isArray: boolean, delta: number, oldText: string, newText: string, aggressiveChecks: boolean) {
            if (isArray) {
                visitArray(<IncrementalNodeArray>element);
            }
            else {
                visitNode(<IncrementalNode>element);
            }
            return;

            function visitNode(node: IncrementalNode) {
                let text = "";
                if (aggressiveChecks && shouldCheckNode(node)) {
                    text = oldText.substring(node.pos, node.end);
                }

                // Ditch any existing LS children we may have created.  This way we can avoid
                // moving them forward.
                if (node._children) {
                    node._children = undefined;
                }

                if (node.jsDocComment) {
                    node.jsDocComment = undefined;
                }

                node.pos += delta;
                node.end += delta;

                if (aggressiveChecks && shouldCheckNode(node)) {
                    Debug.assert(text === newText.substring(node.pos, node.end));
                }

                forEachChild(node, visitNode, visitArray);
                checkNodePositions(node, aggressiveChecks);
            }

            function visitArray(array: IncrementalNodeArray) {
                array._children = undefined;
                array.pos += delta;
                array.end += delta;

                for (const node of array) {
                    visitNode(node);
                }
            }
        }

        function shouldCheckNode(node: Node) {
            switch (node.kind) {
                case SyntaxKind.StringLiteral:
                case SyntaxKind.NumericLiteral:
                case SyntaxKind.Identifier:
                    return true;
            }

            return false;
        }

        function adjustIntersectingElement(element: IncrementalElement, changeStart: number, changeRangeOldEnd: number, changeRangeNewEnd: number, delta: number) {
            Debug.assert(element.end >= changeStart, "Adjusting an element that was entirely before the change range");
            Debug.assert(element.pos <= changeRangeOldEnd, "Adjusting an element that was entirely after the change range");
            Debug.assert(element.pos <= element.end);

            // We have an element that intersects the change range in some way.  It may have its
            // start, or its end (or both) in the changed range.  We want to adjust any part
            // that intersects such that the final tree is in a consistent state.  i.e. all
            // chlidren have spans within the span of their parent, and all siblings are ordered
            // properly.

            // We may need to update both the 'pos' and the 'end' of the element.

            // If the 'pos' is before the start of the change, then we don't need to touch it.
            // If it isn't, then the 'pos' must be inside the change.  How we update it will
            // depend if delta is  positive or negative.  If delta is positive then we have
            // something like:
            //
            //  -------------------AAA-----------------
            //  -------------------BBBCCCCCCC-----------------
            //
            // In this case, we consider any node that started in the change range to still be
            // starting at the same position.
            //
            // however, if the delta is negative, then we instead have something like this:
            //
            //  -------------------XXXYYYYYYY-----------------
            //  -------------------ZZZ-----------------
            //
            // In this case, any element that started in the 'X' range will keep its position.
            // However any element htat started after that will have their pos adjusted to be
            // at the end of the new range.  i.e. any node that started in the 'Y' range will
            // be adjusted to have their start at the end of the 'Z' range.
            //
            // The element will keep its position if possible.  Or Move backward to the new-end
            // if it's in the 'Y' range.
            element.pos = Math.min(element.pos, changeRangeNewEnd);

            // If the 'end' is after the change range, then we always adjust it by the delta
            // amount.  However, if the end is in the change range, then how we adjust it
            // will depend on if delta is  positive or negative.  If delta is positive then we
            // have something like:
            //
            //  -------------------AAA-----------------
            //  -------------------BBBCCCCCCC-----------------
            //
            // In this case, we consider any node that ended inside the change range to keep its
            // end position.
            //
            // however, if the delta is negative, then we instead have something like this:
            //
            //  -------------------XXXYYYYYYY-----------------
            //  -------------------ZZZ-----------------
            //
            // In this case, any element that ended in the 'X' range will keep its position.
            // However any element htat ended after that will have their pos adjusted to be
            // at the end of the new range.  i.e. any node that ended in the 'Y' range will
            // be adjusted to have their end at the end of the 'Z' range.
            if (element.end >= changeRangeOldEnd) {
                // Element ends after the change range.  Always adjust the end pos.
                element.end += delta;
            }
            else {
                // Element ends in the change range.  The element will keep its position if
                // possible. Or Move backward to the new-end if it's in the 'Y' range.
                element.end = Math.min(element.end, changeRangeNewEnd);
            }

            Debug.assert(element.pos <= element.end);
            if (element.parent) {
                Debug.assert(element.pos >= element.parent.pos);
                Debug.assert(element.end <= element.parent.end);
            }
        }

        function checkNodePositions(node: Node, aggressiveChecks: boolean) {
            if (aggressiveChecks) {
                let pos = node.pos;
                forEachChild(node, child => {
                    Debug.assert(child.pos >= pos);
                    pos = child.end;
                });
                Debug.assert(pos <= node.end);
            }
        }

        function updateTokenPositionsAndMarkElements(
            sourceFile: IncrementalNode,
            changeStart: number,
            changeRangeOldEnd: number,
            changeRangeNewEnd: number,
            delta: number,
            oldText: string,
            newText: string,
            aggressiveChecks: boolean): void {

            visitNode(sourceFile);
            return;

            function visitNode(child: IncrementalNode) {
                Debug.assert(child.pos <= child.end);
                if (child.pos > changeRangeOldEnd) {
                    // Node is entirely past the change range.  We need to move both its pos and
                    // end, forward or backward appropriately.
                    moveElementEntirelyPastChangeRange(child, /*isArray*/ false, delta, oldText, newText, aggressiveChecks);
                    return;
                }

                // Check if the element intersects the change range.  If it does, then it is not
                // reusable.  Also, we'll need to recurse to see what constituent portions we may
                // be able to use.
                const fullEnd = child.end;
                if (fullEnd >= changeStart) {
                    child.intersectsChange = true;
                    child._children = undefined;

                    // Adjust the pos or end (or both) of the intersecting element accordingly.
                    adjustIntersectingElement(child, changeStart, changeRangeOldEnd, changeRangeNewEnd, delta);
                    forEachChild(child, visitNode, visitArray);

                    checkNodePositions(child, aggressiveChecks);
                    return;
                }

                // Otherwise, the node is entirely before the change range.  No need to do anything with it.
                Debug.assert(fullEnd < changeStart);
            }

            function visitArray(array: IncrementalNodeArray) {
                Debug.assert(array.pos <= array.end);
                if (array.pos > changeRangeOldEnd) {
                    // Array is entirely after the change range.  We need to move it, and move any of
                    // its children.
                    moveElementEntirelyPastChangeRange(array, /*isArray*/ true, delta, oldText, newText, aggressiveChecks);
                    return;
                }

                // Check if the element intersects the change range.  If it does, then it is not
                // reusable.  Also, we'll need to recurse to see what constituent portions we may
                // be able to use.
                const fullEnd = array.end;
                if (fullEnd >= changeStart) {
                    array.intersectsChange = true;
                    array._children = undefined;

                    // Adjust the pos or end (or both) of the intersecting array accordingly.
                    adjustIntersectingElement(array, changeStart, changeRangeOldEnd, changeRangeNewEnd, delta);
                    for (const node of array) {
                        visitNode(node);
                    }
                    return;
                }

                // Otherwise, the array is entirely before the change range.  No need to do anything with it.
                Debug.assert(fullEnd < changeStart);
            }
        }

        function extendToAffectedRange(sourceFile: SourceFile, changeRange: TextChangeRange): TextChangeRange {
            // Consider the following code:
            //      void foo() { /; }
            //
            // If the text changes with an insertion of / just before the semicolon then we end up with:
            //      void foo() { //; }
            //
            // If we were to just use the changeRange a is, then we would not rescan the { token
            // (as it does not intersect the actual original change range).  Because an edit may
            // change the token touching it, we actually need to look back *at least* one token so
            // that the prior token sees that change.
            const maxLookahead = 1;

            let start = changeRange.span.start;

            // the first iteration aligns us with the change start. subsequent iteration move us to
            // the left by maxLookahead tokens.  We only need to do this as long as we're not at the
            // start of the tree.
            for (let i = 0; start > 0 && i <= maxLookahead; i++) {
                const nearestNode = findNearestNodeStartingBeforeOrAtPosition(sourceFile, start);
                Debug.assert(nearestNode.pos <= start);
                const position = nearestNode.pos;

                start = Math.max(0, position - 1);
            }

            const finalSpan = createTextSpanFromBounds(start, textSpanEnd(changeRange.span));
            const finalLength = changeRange.newLength + (changeRange.span.start - start);

            return createTextChangeRange(finalSpan, finalLength);
        }

        function findNearestNodeStartingBeforeOrAtPosition(sourceFile: SourceFile, position: number): Node {
            let bestResult: Node = sourceFile;
            let lastNodeEntirelyBeforePosition: Node;

            forEachChild(sourceFile, visit);

            if (lastNodeEntirelyBeforePosition) {
                const lastChildOfLastEntireNodeBeforePosition = getLastChild(lastNodeEntirelyBeforePosition);
                if (lastChildOfLastEntireNodeBeforePosition.pos > bestResult.pos) {
                    bestResult = lastChildOfLastEntireNodeBeforePosition;
                }
            }

            return bestResult;

            function getLastChild(node: Node): Node {
                while (true) {
                    const lastChild = getLastChildWorker(node);
                    if (lastChild) {
                        node = lastChild;
                    }
                    else {
                        return node;
                    }
                }
            }

            function getLastChildWorker(node: Node): Node {
                let last: Node = undefined;
                forEachChild(node, child => {
                    if (nodeIsPresent(child)) {
                        last = child;
                    }
                });
                return last;
            }

            function visit(child: Node) {
                if (nodeIsMissing(child)) {
                    // Missing nodes are effectively invisible to us.  We never even consider them
                    // When trying to find the nearest node before us.
                    return;
                }

                // If the child intersects this position, then this node is currently the nearest
                // node that starts before the position.
                if (child.pos <= position) {
                    if (child.pos >= bestResult.pos) {
                        // This node starts before the position, and is closer to the position than
                        // the previous best node we found.  It is now the new best node.
                        bestResult = child;
                    }

                    // Now, the node may overlap the position, or it may end entirely before the
                    // position.  If it overlaps with the position, then either it, or one of its
                    // children must be the nearest node before the position.  So we can just
                    // recurse into this child to see if we can find something better.
                    if (position < child.end) {
                        // The nearest node is either this child, or one of the children inside
                        // of it.  We've already marked this child as the best so far.  Recurse
                        // in case one of the children is better.
                        forEachChild(child, visit);

                        // Once we look at the children of this node, then there's no need to
                        // continue any further.
                        return true;
                    }
                    else {
                        Debug.assert(child.end <= position);
                        // The child ends entirely before this position.  Say you have the following
                        // (where $ is the position)
                        //
                        //      <complex expr 1> ? <complex expr 2> $ : <...> <...>
                        //
                        // We would want to find the nearest preceding node in "complex expr 2".
                        // To support that, we keep track of this node, and once we're done searching
                        // for a best node, we recurse down this node to see if we can find a good
                        // result in it.
                        //
                        // This approach allows us to quickly skip over nodes that are entirely
                        // before the position, while still allowing us to find any nodes in the
                        // last one that might be what we want.
                        lastNodeEntirelyBeforePosition = child;
                    }
                }
                else {
                    Debug.assert(child.pos > position);
                    // We're now at a node that is entirely past the position we're searching for.
                    // This node (and all following nodes) could never contribute to the result,
                    // so just skip them by returning 'true' here.
                    return true;
                }
            }
        }

        function checkChangeRange(sourceFile: SourceFile, newText: string, textChangeRange: TextChangeRange, aggressiveChecks: boolean) {
            const oldText = sourceFile.text;
            if (textChangeRange) {
                Debug.assert((oldText.length - textChangeRange.span.length + textChangeRange.newLength) === newText.length);

                if (aggressiveChecks || Debug.shouldAssert(AssertionLevel.VeryAggressive)) {
                    const oldTextPrefix = oldText.substr(0, textChangeRange.span.start);
                    const newTextPrefix = newText.substr(0, textChangeRange.span.start);
                    Debug.assert(oldTextPrefix === newTextPrefix);

                    const oldTextSuffix = oldText.substring(textSpanEnd(textChangeRange.span), oldText.length);
                    const newTextSuffix = newText.substring(textSpanEnd(textChangeRangeNewSpan(textChangeRange)), newText.length);
                    Debug.assert(oldTextSuffix === newTextSuffix);
                }
            }
        }

        interface IncrementalElement extends TextRange {
            parent?: Node;
            intersectsChange: boolean;
            length?: number;
            _children: Node[];
        }

        export interface IncrementalNode extends Node, IncrementalElement {
            hasBeenIncrementallyParsed: boolean;
        }

        interface IncrementalNodeArray extends NodeArray<IncrementalNode>, IncrementalElement {
            length: number;
        }

        // Allows finding nodes in the source file at a certain position in an efficient manner.
        // The implementation takes advantage of the calling pattern it knows the parser will
        // make in order to optimize finding nodes as quickly as possible.
        export interface SyntaxCursor {
            currentNode(position: number): IncrementalNode;
        }

        function createSyntaxCursor(sourceFile: SourceFile): SyntaxCursor {
            let currentArray: NodeArray<Node> = sourceFile.statements;
            let currentArrayIndex = 0;

            Debug.assert(currentArrayIndex < currentArray.length);
            let current = currentArray[currentArrayIndex];
            let lastQueriedPosition = InvalidPosition.Value;

            return {
                currentNode(position: number) {
                    // Only compute the current node if the position is different than the last time
                    // we were asked.  The parser commonly asks for the node at the same position
                    // twice.  Once to know if can read an appropriate list element at a certain point,
                    // and then to actually read and consume the node.
                    if (position !== lastQueriedPosition) {
                        // Much of the time the parser will need the very next node in the array that
                        // we just returned a node from.So just simply check for that case and move
                        // forward in the array instead of searching for the node again.
                        if (current && current.end === position && currentArrayIndex < (currentArray.length - 1)) {
                            currentArrayIndex++;
                            current = currentArray[currentArrayIndex];
                        }

                        // If we don't have a node, or the node we have isn't in the right position,
                        // then try to find a viable node at the position requested.
                        if (!current || current.pos !== position) {
                            findHighestListElementThatStartsAtPosition(position);
                        }
                    }

                    // Cache this query so that we don't do any extra work if the parser calls back
                    // into us.  Note: this is very common as the parser will make pairs of calls like
                    // 'isListElement -> parseListElement'.  If we were unable to find a node when
                    // called with 'isListElement', we don't want to redo the work when parseListElement
                    // is called immediately after.
                    lastQueriedPosition = position;

                    // Either we don'd have a node, or we have a node at the position being asked for.
                    Debug.assert(!current || current.pos === position);
                    return <IncrementalNode>current;
                }
            };

            // Finds the highest element in the tree we can find that starts at the provided position.
            // The element must be a direct child of some node list in the tree.  This way after we
            // return it, we can easily return its next sibling in the list.
            function findHighestListElementThatStartsAtPosition(position: number) {
                // Clear out any cached state about the last node we found.
                currentArray = undefined;
                currentArrayIndex = InvalidPosition.Value;
                current = undefined;

                // Recurse into the source file to find the highest node at this position.
                forEachChild(sourceFile, visitNode, visitArray);
                return;

                function visitNode(node: Node) {
                    if (position >= node.pos && position < node.end) {
                        // Position was within this node.  Keep searching deeper to find the node.
                        forEachChild(node, visitNode, visitArray);

                        // don't procede any futher in the search.
                        return true;
                    }

                    // position wasn't in this node, have to keep searching.
                    return false;
                }

                function visitArray(array: NodeArray<Node>) {
                    if (position >= array.pos && position < array.end) {
                        // position was in this array.  Search through this array to see if we find a
                        // viable element.
                        for (let i = 0, n = array.length; i < n; i++) {
                            const child = array[i];
                            if (child) {
                                if (child.pos === position) {
                                    // Found the right node.  We're done.
                                    currentArray = array;
                                    currentArrayIndex = i;
                                    current = child;
                                    return true;
                                }
                                else {
                                    if (child.pos < position && position < child.end) {
                                        // Position in somewhere within this child.  Search in it and
                                        // stop searching in this array.
                                        forEachChild(child, visitNode, visitArray);
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    // position wasn't in this array, have to keep searching.
                    return false;
                }
            }
        }

        const enum InvalidPosition {
            Value = -1
        }
    }
}
