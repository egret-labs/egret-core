/// <reference path="core.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="types.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="commandLineParser.ts"/>
var ts;
(function (ts) {
    var checker = null;
    var program = null;
    var errors = null;
    //parse
    var classNameToFileMap = {};
    var classNames = {};
    var fileToClassNameMap = {};
    var classNameToBaseClassMap = {};
    var constructorToClassMap = {};
    var functionCallToClassMap = {};
    var functionId = 0;
    var staticToClassNameMap = {};
    var fileToReferenceMap = {};
    //sort
    var fileNodesList = [];
    var fileNameToNodeMap = {};
    var orderedFileList = [];
    function addClassToFileMap(name, file) {
        var map = classNameToFileMap[name];
        if (!map || file == map) {
            classNameToFileMap[name] = file;
        }
        else {
            if (typeof (map) == 'string') {
                map = { map: true };
            }
            map[file] = true;
            classNameToFileMap[name] = map;
        }
    }
    var SortHelper = (function () {
        function SortHelper() {
            var _this = this;
            this.classNameToFileMap = classNameToFileMap;
            this.findUsedClasses = function (node, name, collection, nest) {
                if (!node)
                    return;
                if (nest > 4)
                    return;
                var nodeToGet = null;
                switch (node.kind) {
                    case 143 /* PropertyAccessExpression */:
                    case 63 /* Identifier */:
                        nodeToGet = node; // (<PropertyAccessExpression>n).expression;
                        break;
                    case 145 /* CallExpression */:
                    case 146 /* NewExpression */:
                        nodeToGet = node.expression;
                        break;
                    default:
                        nodeToGet = null;
                }
                if (nodeToGet) {
                    var definedSymbol = checker.egretGetResolveSymbol(nodeToGet);
                    if (definedSymbol
                        && !(definedSymbol.exportSymbol && (definedSymbol.exportSymbol.flags & 1536 /* Module */))
                        && (definedSymbol.flags & 107455 /* Value */ || definedSymbol.flags & 29360128 /* Export */)
                        && definedSymbol.declarations && definedSymbol.declarations.length
                        && !(definedSymbol.declarations[0].symbol.flags & 3 /* Variable */)) {
                        var targetName = checker.getFullyQualifiedName(definedSymbol);
                        if (targetName == "unknown")
                            return;
                        var classes = collection[name] || [];
                        classes.push(targetName);
                        collection[name] = classes;
                        if (!(name in classNameToFileMap)) {
                            var source = ts.getAncestor(nodeToGet, 201 /* SourceFile */);
                            addClassToFileMap(name, source.filename);
                        }
                        if (!(targetName in classNameToFileMap) && definedSymbol.declarations && definedSymbol.declarations.length) {
                            var declareNode = definedSymbol.declarations[0];
                            var source = ts.getAncestor(declareNode, 201 /* SourceFile */);
                            addClassToFileMap(targetName, source.filename);
                            if (node.kind == 146 /* NewExpression */) {
                                if (!(targetName in constructorToClassMap)) {
                                    _this.constructorToClassName(source, declareNode, nest + 1);
                                }
                            }
                        }
                        if (node.kind == 145 /* CallExpression */)
                            _this.findUsedClasses(declareNode, targetName, functionCallToClassMap, nest + 1);
                        if (node.kind == 146 /* NewExpression */)
                            constructorToClassMap[targetName] && constructorToClassMap[targetName].forEach(function (clazz) {
                                classes.push(clazz);
                            });
                    }
                }
                else {
                    ts.forEachChild(node, function (n) { return _this.findUsedClasses(n, name, collection, nest); });
                }
            };
        }
        SortHelper.getOrderedFiles = function () {
            return orderedFileList;
        };
        SortHelper.getErrors = function () {
            return errors;
        };
        SortHelper.getClassNameAndProps = function () {
            var names = {};
            var files = program.getSourceFiles().concat();
            files.forEach(function (f) {
                if (f.filename.indexOf('.d.ts') > 0)
                    return;
                var symbols = checker.getSymbolsInScope(f, 1536 /* Module */ | 98308 /* PropertyOrAccessor */ | 8192 /* Method */ | 32 /* Class */ | 29360128 /* Export */);
                symbols.forEach(function (s) {
                    var name = s.name;
                    names[name] = true;
                });
            });
            return names;
        };
        SortHelper.prototype.orderFiles = function (chk, prog) {
            var _this = this;
            errors = [];
            classNameToFileMap = {};
            fileToClassNameMap = {};
            classNameToBaseClassMap = {};
            constructorToClassMap = {};
            functionCallToClassMap = {};
            functionId = 0;
            staticToClassNameMap = {};
            fileNodesList = [];
            fileNameToNodeMap = {};
            fileToReferenceMap = {};
            var files = prog.getSourceFiles().concat();
            var libdts = files.shift();
            orderedFileList = files.map(function (f) { return f.filename; });
            checker = chk;
            program = prog;
            ts.forEach(files, function (file) { return _this.symbolTabelToFileMap(file, file.locals); });
            this.sortFiles();
            var sources = prog.getSourceFiles();
            orderedFileList.forEach(function (f) {
                for (var i = 0; i < sources.length; i++) {
                    var s = sources[i];
                    if (s.filename == f) {
                        sources.splice(i, 1);
                        sources.push(s);
                        break;
                    }
                }
            });
        };
        SortHelper.prototype.symbolToFileMap = function (file, symbol) {
            var _this = this;
            var classtype = checker.getDeclaredTypeOfSymbol(symbol.exportSymbol || symbol);
            if (symbol.flags & (1536 /* Module */))
                return;
            var isInterface = symbol.flags & 64 /* Interface */;
            if (classtype) {
                var fullName = getFullyQualifiedName(symbol);
                addClassToFileMap(fullName, file.filename);
                var classes = fileToClassNameMap[file.filename];
                if (!classes) {
                    classes = [];
                    fileToClassNameMap[file.filename] = classes;
                }
                if (classes.indexOf(fullName) < 0)
                    classes.push(fullName);
                if (isInterface)
                    return;
                if (classtype.baseTypes && classtype.baseTypes.length) {
                    ts.forEach(classtype.baseTypes, function (t) { return _this.classNameToBaseClass(fullName, t); });
                }
                this.constructorToClassName(file, symbol.valueDeclaration, 0);
            }
        };
        SortHelper.prototype.symbolTabelToFileMap = function (file, symbolTable) {
            var _this = this;
            this.findFileRefers(file);
            ts.forEachValue(symbolTable, function (symbol) {
                symbol = symbol.exportSymbol || symbol;
                if (symbol.name == "prototype")
                    return;
                _this.symbolToFileMap(file, symbol);
                _this.staticMemberToClassName(file, symbol);
                if (symbol.valueDeclaration && symbol.valueDeclaration.locals) {
                    _this.symbolTabelToFileMap(file, symbol.valueDeclaration.locals);
                }
                if (symbol.exports) {
                    _this.symbolTabelToFileMap(file, symbol.exports);
                }
            });
            if (file.filename.indexOf(".d.ts") > 0)
                return;
            var self = this;
            findFunctionCall(file);
            function findFunctionCall(pnode) {
                ts.forEachChild(pnode, function (node) {
                    if (node.kind == 185 /* ClassDeclaration */ ||
                        node.kind == 186 /* InterfaceDeclaration */ ||
                        node.kind == 184 /* FunctionDeclaration */)
                        return;
                    if (node.kind == 143 /* PropertyAccessExpression */ ||
                        node.kind == 145 /* CallExpression */ ||
                        node.kind == 146 /* NewExpression */ ||
                        node.kind == 63 /* Identifier */) {
                        var name = "callExpression" + ++functionId;
                        self.findUsedClasses(node, name, functionCallToClassMap, 0);
                    }
                    else
                        findFunctionCall(node);
                });
            }
        };
        SortHelper.prototype.findFileRefers = function (file) {
            var refers = file.referencedFiles;
            if (refers)
                fileToReferenceMap[file.filename] = refers.map(function (r) { return ts.normalizePath(ts.combinePaths(ts.getDirectoryPath(file.filename), r.filename)); });
        };
        SortHelper.prototype.constructorToClassName = function (file, classNode, nest) {
            var _this = this;
            if (!classNode || !classNode.symbol)
                return;
            var className = checker.getFullyQualifiedName(classNode.symbol);
            var nodesToCheck = [];
            ts.forEachChild(classNode, function (node) {
                if (node.kind == 126 /* Constructor */) {
                    nodesToCheck.push(node.body);
                }
                if (node.kind == 124 /* Property */ && node.initializer) {
                    nodesToCheck.push(node.initializer);
                }
            });
            if (!nodesToCheck.length) {
                return;
            }
            nodesToCheck.forEach(function (node) { return _this.findUsedClasses(node, className, constructorToClassMap, 0); });
        };
        SortHelper.prototype.staticMemberToClassName = function (file, symbol) {
            symbol = symbol.exportSymbol || symbol;
            var fullName = getFullyQualifiedName(symbol);
            var declarExp = symbol.valueDeclaration;
            if (declarExp && declarExp.initializer) {
                var staticMemberType = checker.checkAndMarkExpression(declarExp.initializer);
                if (staticMemberType.symbol == undefined || (staticMemberType.symbol.flags & 64 /* Interface */))
                    return;
                var initializerClass = checker.getFullyQualifiedName(staticMemberType.symbol);
                staticToClassNameMap[fullName] = initializerClass;
            }
        };
        SortHelper.prototype.addStaticDepend = function (staticMemberName, className) {
        };
        SortHelper.prototype.classNameToBaseClass = function (className, baseType) {
            var fullName = checker.getFullyQualifiedName(baseType.symbol);
            var bases = classNameToBaseClassMap[className] || [];
            if (bases.indexOf(fullName) < 0)
                bases.push(fullName);
            classNameToBaseClassMap[className] = bases;
        };
        //todo 
        SortHelper.prototype.getFileNode = function (file) {
            if (file in fileNameToNodeMap)
                return fileNameToNodeMap[file];
            var typeNode = new FileNode();
            if (typeof (file) != 'string') {
                console.log(file);
            }
            typeNode.name = file;
            typeNode.calls = [];
            typeNode.supers = [];
            fileNodesList.push(typeNode);
            fileNameToNodeMap[file] = typeNode;
            return typeNode;
        };
        SortHelper.prototype.sortFiles = function () {
            var _this = this;
            console.log(fileToReferenceMap);
            ts.forEachKey(fileToReferenceMap, function (fileName) {
                var fileNode = _this.getFileNode(fileName);
                var refers = fileToReferenceMap[fileName];
                refers.forEach(function (r) {
                    var referNode = _this.getFileNode(r);
                    fileNode.addRefer(referNode);
                });
            });
            ts.forEachKey(classNameToFileMap, function (className) {
                var file = classNameToFileMap[className];
                if (typeof (file) != 'string')
                    return;
                var fileName = file;
                var fileNode = _this.getFileNode(fileName);
                var supers = classNameToBaseClassMap[className];
                if (supers) {
                    supers.forEach(function (superClass) {
                        var dependFile = classNameToFileMap[superClass];
                        if (dependFile && dependFile['map'] || dependFile == fileName || dependFile[fileName])
                            return;
                        var dependNode = _this.getFileNode(dependFile);
                        fileNode.addSuper(dependNode);
                    });
                }
                var staticDepends = staticToClassNameMap[className];
                if (staticDepends) {
                    var constructorDepends = constructorToClassMap[staticDepends] || [];
                    constructorDepends.push(staticDepends);
                    constructorDepends.forEach(function (depend) {
                        var dependFile = classNameToFileMap[depend];
                        if (dependFile && dependFile['map'] == undefined && dependFile != file && typeof (dependFile) == 'string') {
                            var dependFileNode = _this.getFileNode(dependFile);
                            fileNode.addCall(dependFileNode);
                        }
                    });
                }
                var functionName = className;
                var functionCallDepens = functionCallToClassMap[functionName];
                if (functionCallDepens) {
                    functionCallDepens.forEach(function (depend) {
                        var dependFile = classNameToFileMap[depend];
                        if (dependFile && dependFile['map'] || dependFile == file || typeof (dependFile) != 'string')
                            return;
                        var dependNode = _this.getFileNode(dependFile);
                        fileNode.addCall(dependNode);
                    });
                }
            });
            var singleTypes = [], bottomTypes = [], topTypes = [], otherTypes = [];
            fileNodesList.forEach(function (t) {
                t.markHardDepends();
            });
            fileNodesList.forEach(function (t) {
                t.markSoftDepends();
            });
            orderedFileList = [];
            var sorted = [];
            var sortedMap = {};
            function insert(file) {
                if (file.name.toLowerCase() in sortedMap)
                    return;
                for (var i in file.depends)
                    insert(fileNameToNodeMap[i]);
                sorted.push(file);
                sortedMap[file.name.toLowerCase()] = true;
            }
            fileNodesList.forEach(function (e) {
                insert(e);
            });
            orderedFileList = sorted.map(function (n) { return n.name; });
            console.log(orderedFileList);
        };
        return SortHelper;
    })();
    ts.SortHelper = SortHelper;
    var fileToFileMap = {};
    var UsedFileResolver = (function () {
        function UsedFileResolver() {
        }
        UsedFileResolver.mapFile = function (source, used) {
            var depends = fileToFileMap[source];
            if (!depends) {
                depends = {};
                fileToFileMap[source] = depends;
            }
            depends[used] = true;
        };
        return UsedFileResolver;
    })();
    ts.UsedFileResolver = UsedFileResolver;
    /**
    * no export properties may have same name, add id after the name
    */
    function getFullyQualifiedName(symbol) {
        var name = null;
        if (symbol.exportSymbol) {
            name = checker.getFullyQualifiedName(symbol.exportSymbol);
            classNames[name] = Object.keys(classNames).length;
        }
        else {
            name = checker.getFullyQualifiedName(symbol);
            if (!(symbol.flags & (32 /* Class */ | 64 /* Interface */ | 1536 /* Module */))) {
                name += symbol.id;
            }
            else {
                classNames[name] = Object.keys(classNames).length;
            }
        }
        return name;
    }
    var fileHashCode = 1;
    var FileNode = (function () {
        function FileNode() {
            this.supers = [];
            this.calls = [];
            this.refers = [];
            this.hashCode = fileHashCode++;
        }
        FileNode.prototype.addSuper = function (node) {
            if (this.supers.indexOf(node) >= 0)
                return;
            this.supers.push(node);
        };
        FileNode.prototype.addRefer = function (node) {
            if (this.refers.indexOf(node) >= 0)
                return;
            this.refers.push(node);
        };
        FileNode.prototype.addCall = function (node) {
            if (this.calls.indexOf(node) >= 0)
                return;
            this.calls.push(node);
        };
        FileNode.prototype.markHardDepends = function () {
            var _this = this;
            if (this.depends)
                return;
            this.depends = {};
            var files = this.supers.concat(this.refers);
            files.forEach(function (f) {
                if (!f.depends)
                    f.markHardDepends();
                for (var i in f.depends)
                    if (i == _this.name) {
                        _this.logCircular(_this.name, i);
                    }
                    else {
                        _this.depends[i] = true;
                    }
                _this.depends[f.name] = true;
            });
        };
        FileNode.prototype.markSoftDepends = function () {
            var _this = this;
            if (this.softdepends)
                return;
            var files = this.calls.concat();
            this.softdepends = {};
            files.forEach(function (f) {
                if (f.name == _this.name)
                    return;
                if (!f.softdepends)
                    f.markSoftDepends();
                for (var i in f.softdepends) {
                    if (fileNameToNodeMap[i].depends[_this.name])
                        continue;
                    if (i == _this.name) {
                        _this.logCircular(_this.name, i);
                    }
                    else {
                        _this.softdepends[i] = true;
                        _this.depends[i] = true;
                    }
                }
                if (fileNameToNodeMap[f.name].depends[_this.name])
                    return;
                _this.softdepends[f.name] = true;
            });
        };
        FileNode.prototype.logCircular = function (file, other) {
            console.log("Found circular dependency:" + [file, other].join("=>"));
        };
        return FileNode;
    })();
})(ts || (ts = {}));
//# sourceMappingURL=sort.js.map