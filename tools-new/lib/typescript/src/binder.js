/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
var ts;
(function (ts) {
    function getModuleInstanceState(node) {
        // A module is uninstantiated if it contains only 
        // 1. interface declarations
        if (node.kind === 186 /* InterfaceDeclaration */) {
            return 0 /* NonInstantiated */;
        }
        else if (ts.isConstEnumDeclaration(node)) {
            return 2 /* ConstEnumOnly */;
        }
        else if (node.kind === 191 /* ImportDeclaration */ && !(node.flags & 1 /* Export */)) {
            return 0 /* NonInstantiated */;
        }
        else if (node.kind === 190 /* ModuleBlock */) {
            var state = 0 /* NonInstantiated */;
            ts.forEachChild(node, function (n) {
                switch (getModuleInstanceState(n)) {
                    case 0 /* NonInstantiated */:
                        // child is non-instantiated - continue searching
                        return false;
                    case 2 /* ConstEnumOnly */:
                        // child is const enum only - record state and continue searching
                        state = 2 /* ConstEnumOnly */;
                        return false;
                    case 1 /* Instantiated */:
                        // child is instantiated - record state and stop
                        state = 1 /* Instantiated */;
                        return true;
                }
            });
            return state;
        }
        else if (node.kind === 189 /* ModuleDeclaration */) {
            return getModuleInstanceState(node.body);
        }
        else {
            return 1 /* Instantiated */;
        }
    }
    ts.getModuleInstanceState = getModuleInstanceState;
    /**
     * Returns false if any of the following are true:
     *   1. declaration has no name
     *   2. declaration has a literal name (not computed)
     *   3. declaration has a computed property name that is a known symbol
     */
    function hasComputedNameButNotSymbol(declaration) {
        return declaration.name && declaration.name.kind === 121 /* ComputedPropertyName */;
    }
    ts.hasComputedNameButNotSymbol = hasComputedNameButNotSymbol;
    function bindSourceFile(file) {
        var parent;
        var container;
        var blockScopeContainer;
        var lastContainer;
        var symbolCount = 0;
        var Symbol = ts.objectAllocator.getSymbolConstructor();
        if (!file.locals) {
            file.locals = {};
            container = blockScopeContainer = file;
            bind(file);
            file.symbolCount = symbolCount;
        }
        function createSymbol(flags, name) {
            symbolCount++;
            return new Symbol(flags, name);
        }
        function addDeclarationToSymbol(symbol, node, symbolKind) {
            symbol.flags |= symbolKind;
            if (!symbol.declarations)
                symbol.declarations = [];
            symbol.declarations.push(node);
            if (symbolKind & 1952 /* HasExports */ && !symbol.exports)
                symbol.exports = {};
            if (symbolKind & 6240 /* HasMembers */ && !symbol.members)
                symbol.members = {};
            node.symbol = symbol;
            if (symbolKind & 107455 /* Value */ && !symbol.valueDeclaration)
                symbol.valueDeclaration = node;
        }
        // Should not be called on a declaration with a computed property name.
        function getDeclarationName(node) {
            if (node.name) {
                if (node.kind === 189 /* ModuleDeclaration */ && node.name.kind === 7 /* StringLiteral */) {
                    return '"' + node.name.text + '"';
                }
                ts.Debug.assert(!hasComputedNameButNotSymbol(node));
                return node.name.text;
            }
            switch (node.kind) {
                case 134 /* ConstructorType */:
                case 126 /* Constructor */:
                    return "__constructor";
                case 133 /* FunctionType */:
                case 129 /* CallSignature */:
                    return "__call";
                case 130 /* ConstructSignature */:
                    return "__new";
                case 131 /* IndexSignature */:
                    return "__index";
            }
        }
        function getDisplayName(node) {
            return node.name ? ts.declarationNameToString(node.name) : getDeclarationName(node);
        }
        function declareSymbol(symbols, parent, node, includes, excludes) {
            // Nodes with computed property names will not get symbols, because the type checker
            // does not make properties for them.
            if (hasComputedNameButNotSymbol(node)) {
                return undefined;
            }
            var name = getDeclarationName(node);
            if (name !== undefined) {
                var symbol = ts.hasProperty(symbols, name) ? symbols[name] : (symbols[name] = createSymbol(0, name));
                if (symbol.flags & excludes) {
                    if (node.name) {
                        node.name.parent = node;
                    }
                    // Report errors every position with duplicate declaration
                    // Report errors on previous encountered declarations
                    var message = symbol.flags & 2 /* BlockScopedVariable */
                        ? ts.Diagnostics.Cannot_redeclare_block_scoped_variable_0
                        : ts.Diagnostics.Duplicate_identifier_0;
                    ts.forEach(symbol.declarations, function (declaration) {
                        file.semanticDiagnostics.push(ts.createDiagnosticForNode(declaration.name, message, getDisplayName(declaration)));
                    });
                    file.semanticDiagnostics.push(ts.createDiagnosticForNode(node.name, message, getDisplayName(node)));
                    symbol = createSymbol(0, name);
                }
            }
            else {
                symbol = createSymbol(0, "__missing");
            }
            addDeclarationToSymbol(symbol, node, includes);
            symbol.parent = parent;
            if (node.kind === 185 /* ClassDeclaration */ && symbol.exports) {
                // TypeScript 1.0 spec (April 2014): 8.4
                // Every class automatically contains a static property member named 'prototype', 
                // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
                // It is an error to explicitly declare a static property member with the name 'prototype'.
                var prototypeSymbol = createSymbol(4 /* Property */ | 536870912 /* Prototype */, "prototype");
                if (ts.hasProperty(symbol.exports, prototypeSymbol.name)) {
                    if (node.name) {
                        node.name.parent = node;
                    }
                    file.semanticDiagnostics.push(ts.createDiagnosticForNode(symbol.exports[prototypeSymbol.name].declarations[0], ts.Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
                }
                symbol.exports[prototypeSymbol.name] = prototypeSymbol;
                prototypeSymbol.parent = symbol;
            }
            return symbol;
        }
        function isAmbientContext(node) {
            while (node) {
                if (node.flags & 2 /* Ambient */)
                    return true;
                node = node.parent;
            }
            return false;
        }
        function declareModuleMember(node, symbolKind, symbolExcludes) {
            // Exported module members are given 2 symbols: A local symbol that is classified with an ExportValue,
            // ExportType, or ExportContainer flag, and an associated export symbol with all the correct flags set
            // on it. There are 2 main reasons:
            //
            //   1. We treat locals and exports of the same name as mutually exclusive within a container. 
            //      That means the binder will issue a Duplicate Identifier error if you mix locals and exports
            //      with the same name in the same container.
            //      TODO: Make this a more specific error and decouple it from the exclusion logic.
            //   2. When we checkIdentifier in the checker, we set its resolved symbol to the local symbol,
            //      but return the export symbol (by calling getExportSymbolOfValueSymbolIfExported). That way
            //      when the emitter comes back to it, it knows not to qualify the name if it was found in a containing scope.
            var exportKind = 0;
            if (symbolKind & 107455 /* Value */) {
                exportKind |= 4194304 /* ExportValue */;
            }
            if (symbolKind & 3152352 /* Type */) {
                exportKind |= 8388608 /* ExportType */;
            }
            if (symbolKind & 1536 /* Namespace */) {
                exportKind |= 16777216 /* ExportNamespace */;
            }
            if (node.flags & 1 /* Export */ || (node.kind !== 191 /* ImportDeclaration */ && isAmbientContext(container))) {
                if (exportKind) {
                    var local = declareSymbol(container.locals, undefined, node, exportKind, symbolExcludes);
                    local.exportSymbol = declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    node.localSymbol = local;
                }
                else {
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                }
            }
            else {
                declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
            }
        }
        // All container nodes are kept on a linked list in declaration order. This list is used by the getLocalNameOfContainer function
        // in the type checker to validate that the local name used for a container is unique.
        function bindChildren(node, symbolKind, isBlockScopeContainer) {
            if (symbolKind & 1041936 /* HasLocals */) {
                node.locals = {};
            }
            var saveParent = parent;
            var saveContainer = container;
            var savedBlockScopeContainer = blockScopeContainer;
            parent = node;
            if (symbolKind & 1048560 /* IsContainer */) {
                container = node;
                // If container is not on container list, add it to the list
                if (lastContainer !== container && !container.nextContainer) {
                    if (lastContainer) {
                        lastContainer.nextContainer = container;
                    }
                    lastContainer = container;
                }
            }
            if (isBlockScopeContainer) {
                blockScopeContainer = node;
            }
            ts.forEachChild(node, bind);
            container = saveContainer;
            parent = saveParent;
            blockScopeContainer = savedBlockScopeContainer;
        }
        function bindDeclaration(node, symbolKind, symbolExcludes, isBlockScopeContainer) {
            switch (container.kind) {
                case 189 /* ModuleDeclaration */:
                    declareModuleMember(node, symbolKind, symbolExcludes);
                    break;
                case 201 /* SourceFile */:
                    if (ts.isExternalModule(container)) {
                        declareModuleMember(node, symbolKind, symbolExcludes);
                        break;
                    }
                case 133 /* FunctionType */:
                case 134 /* ConstructorType */:
                case 129 /* CallSignature */:
                case 130 /* ConstructSignature */:
                case 131 /* IndexSignature */:
                case 125 /* Method */:
                case 126 /* Constructor */:
                case 127 /* GetAccessor */:
                case 128 /* SetAccessor */:
                case 184 /* FunctionDeclaration */:
                case 150 /* FunctionExpression */:
                case 151 /* ArrowFunction */:
                    declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                    break;
                case 185 /* ClassDeclaration */:
                    if (node.flags & 128 /* Static */) {
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                    }
                case 136 /* TypeLiteral */:
                case 142 /* ObjectLiteralExpression */:
                case 186 /* InterfaceDeclaration */:
                    declareSymbol(container.symbol.members, container.symbol, node, symbolKind, symbolExcludes);
                    break;
                case 188 /* EnumDeclaration */:
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    break;
            }
            bindChildren(node, symbolKind, isBlockScopeContainer);
        }
        function bindConstructorDeclaration(node) {
            bindDeclaration(node, 16384 /* Constructor */, 0, true);
            ts.forEach(node.parameters, function (p) {
                if (p.flags & (16 /* Public */ | 32 /* Private */ | 64 /* Protected */)) {
                    bindDeclaration(p, 4 /* Property */, 107455 /* PropertyExcludes */, false);
                }
            });
        }
        function bindModuleDeclaration(node) {
            if (node.name.kind === 7 /* StringLiteral */) {
                bindDeclaration(node, 512 /* ValueModule */, 106639 /* ValueModuleExcludes */, true);
            }
            else {
                var state = getModuleInstanceState(node);
                if (state === 0 /* NonInstantiated */) {
                    bindDeclaration(node, 1024 /* NamespaceModule */, 0 /* NamespaceModuleExcludes */, true);
                }
                else {
                    bindDeclaration(node, 512 /* ValueModule */, 106639 /* ValueModuleExcludes */, true);
                    if (state === 2 /* ConstEnumOnly */) {
                        // mark value module as module that contains only enums
                        node.symbol.constEnumOnlyModule = true;
                    }
                    else if (node.symbol.constEnumOnlyModule) {
                        // const only value module was merged with instantiated module - reset flag
                        node.symbol.constEnumOnlyModule = false;
                    }
                }
            }
        }
        function bindFunctionOrConstructorType(node) {
            // For a given function symbol "<...>(...) => T" we want to generate a symbol identical
            // to the one we would get for: { <...>(...): T }
            //
            // We do that by making an anonymous type literal symbol, and then setting the function 
            // symbol as its sole member. To the rest of the system, this symbol will be  indistinguishable 
            // from an actual type literal symbol you would have gotten had you used the long form.
            var symbolKind = node.kind === 133 /* FunctionType */ ? 131072 /* CallSignature */ : 262144 /* ConstructSignature */;
            var symbol = createSymbol(symbolKind, getDeclarationName(node));
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind, false);
            var typeLiteralSymbol = createSymbol(2048 /* TypeLiteral */, "__type");
            addDeclarationToSymbol(typeLiteralSymbol, node, 2048 /* TypeLiteral */);
            typeLiteralSymbol.members = {};
            typeLiteralSymbol.members[node.kind === 133 /* FunctionType */ ? "__call" : "__new"] = symbol;
        }
        function bindAnonymousDeclaration(node, symbolKind, name, isBlockScopeContainer) {
            var symbol = createSymbol(symbolKind, name);
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind, isBlockScopeContainer);
        }
        function bindCatchVariableDeclaration(node) {
            var symbol = createSymbol(1 /* FunctionScopedVariable */, node.name.text || "__missing");
            addDeclarationToSymbol(symbol, node, 1 /* FunctionScopedVariable */);
            var saveParent = parent;
            var savedBlockScopeContainer = blockScopeContainer;
            parent = blockScopeContainer = node;
            ts.forEachChild(node, bind);
            parent = saveParent;
            blockScopeContainer = savedBlockScopeContainer;
        }
        function bindBlockScopedVariableDeclaration(node) {
            switch (blockScopeContainer.kind) {
                case 189 /* ModuleDeclaration */:
                    declareModuleMember(node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
                    break;
                case 201 /* SourceFile */:
                    if (ts.isExternalModule(container)) {
                        declareModuleMember(node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
                        break;
                    }
                default:
                    if (!blockScopeContainer.locals) {
                        blockScopeContainer.locals = {};
                    }
                    declareSymbol(blockScopeContainer.locals, undefined, node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
            }
            bindChildren(node, 2 /* BlockScopedVariable */, false);
        }
        function bind(node) {
            node.parent = parent;
            switch (node.kind) {
                case 122 /* TypeParameter */:
                    bindDeclaration(node, 1048576 /* TypeParameter */, 2103776 /* TypeParameterExcludes */, false);
                    break;
                case 123 /* Parameter */:
                    bindDeclaration(node, 1 /* FunctionScopedVariable */, 107455 /* ParameterExcludes */, false);
                    break;
                case 183 /* VariableDeclaration */:
                    if (node.flags & 6144 /* BlockScoped */) {
                        bindBlockScopedVariableDeclaration(node);
                    }
                    else {
                        bindDeclaration(node, 1 /* FunctionScopedVariable */, 107454 /* FunctionScopedVariableExcludes */, false);
                    }
                    break;
                case 124 /* Property */:
                case 198 /* PropertyAssignment */:
                case 199 /* ShorthandPropertyAssignment */:
                    bindDeclaration(node, 4 /* Property */, 107455 /* PropertyExcludes */, false);
                    break;
                case 200 /* EnumMember */:
                    bindDeclaration(node, 8 /* EnumMember */, 107455 /* EnumMemberExcludes */, false);
                    break;
                case 129 /* CallSignature */:
                    bindDeclaration(node, 131072 /* CallSignature */, 0, false);
                    break;
                case 130 /* ConstructSignature */:
                    bindDeclaration(node, 262144 /* ConstructSignature */, 0, true);
                    break;
                case 125 /* Method */:
                    // If this is an ObjectLiteralExpression method, then it sits in the same space
                    // as other properties in the object literal.  So we use SymbolFlags.PropertyExcludes
                    // so that it will conflict with any other object literal members with the same
                    // name.
                    bindDeclaration(node, 8192 /* Method */, ts.isObjectLiteralMethod(node) ? 107455 /* PropertyExcludes */ : 99263 /* MethodExcludes */, true);
                    break;
                case 131 /* IndexSignature */:
                    bindDeclaration(node, 524288 /* IndexSignature */, 0, false);
                    break;
                case 184 /* FunctionDeclaration */:
                    bindDeclaration(node, 16 /* Function */, 106927 /* FunctionExcludes */, true);
                    break;
                case 126 /* Constructor */:
                    bindConstructorDeclaration(node);
                    break;
                case 127 /* GetAccessor */:
                    bindDeclaration(node, 32768 /* GetAccessor */, 41919 /* GetAccessorExcludes */, true);
                    break;
                case 128 /* SetAccessor */:
                    bindDeclaration(node, 65536 /* SetAccessor */, 74687 /* SetAccessorExcludes */, true);
                    break;
                case 133 /* FunctionType */:
                case 134 /* ConstructorType */:
                    bindFunctionOrConstructorType(node);
                    break;
                case 136 /* TypeLiteral */:
                    bindAnonymousDeclaration(node, 2048 /* TypeLiteral */, "__type", false);
                    break;
                case 142 /* ObjectLiteralExpression */:
                    bindAnonymousDeclaration(node, 4096 /* ObjectLiteral */, "__object", false);
                    break;
                case 150 /* FunctionExpression */:
                case 151 /* ArrowFunction */:
                    bindAnonymousDeclaration(node, 16 /* Function */, "__function", true);
                    break;
                case 197 /* CatchClause */:
                    bindCatchVariableDeclaration(node);
                    break;
                case 185 /* ClassDeclaration */:
                    bindDeclaration(node, 32 /* Class */, 3258879 /* ClassExcludes */, false);
                    break;
                case 186 /* InterfaceDeclaration */:
                    bindDeclaration(node, 64 /* Interface */, 3152288 /* InterfaceExcludes */, false);
                    break;
                case 187 /* TypeAliasDeclaration */:
                    bindDeclaration(node, 2097152 /* TypeAlias */, 3152352 /* TypeAliasExcludes */, false);
                    break;
                case 188 /* EnumDeclaration */:
                    if (ts.isConst(node)) {
                        bindDeclaration(node, 128 /* ConstEnum */, 3259263 /* ConstEnumExcludes */, false);
                    }
                    else {
                        bindDeclaration(node, 256 /* RegularEnum */, 3258623 /* RegularEnumExcludes */, false);
                    }
                    break;
                case 189 /* ModuleDeclaration */:
                    bindModuleDeclaration(node);
                    break;
                case 191 /* ImportDeclaration */:
                    bindDeclaration(node, 33554432 /* Import */, 33554432 /* ImportExcludes */, false);
                    break;
                case 201 /* SourceFile */:
                    if (ts.isExternalModule(node)) {
                        bindAnonymousDeclaration(node, 512 /* ValueModule */, '"' + ts.removeFileExtension(node.filename) + '"', true);
                        break;
                    }
                case 163 /* Block */:
                case 180 /* TryBlock */:
                case 197 /* CatchClause */:
                case 181 /* FinallyBlock */:
                case 170 /* ForStatement */:
                case 171 /* ForInStatement */:
                case 176 /* SwitchStatement */:
                    bindChildren(node, 0, true);
                    break;
                default:
                    var saveParent = parent;
                    parent = node;
                    ts.forEachChild(node, bind);
                    parent = saveParent;
            }
        }
    }
    ts.bindSourceFile = bindSourceFile;
})(ts || (ts = {}));
