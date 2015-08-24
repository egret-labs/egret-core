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
            this.findUsedClasses = function (node, name, collection) {
                if (!node)
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
                    if (definedSymbol && !(definedSymbol.exportSymbol && (definedSymbol.exportSymbol.flags & 1536 /* Module */)) && (definedSymbol.flags & 107455 /* Value */ || definedSymbol.flags & 29360128 /* Export */)) {
                        var targetName = checker.getFullyQualifiedName(definedSymbol);
                        if (targetName == "unknown")
                            return;
                        var classes = collection[name] || [];
                        classes.push(targetName);
                        collection[name] = classes;
                        if (!(targetName in classNameToFileMap) && definedSymbol.declarations && definedSymbol.declarations.length) {
                            var declareNode = definedSymbol.declarations[0];
                            var source = ts.getAncestor(declareNode, 201 /* SourceFile */);
                            addClassToFileMap(targetName, source.filename);
                        }
                        if (!(name in classNameToFileMap)) {
                            var source = ts.getAncestor(nodeToGet, 201 /* SourceFile */);
                            addClassToFileMap(name, source.filename);
                        }
                    }
                }
                else {
                    ts.forEachChild(node, function (n) { return _this.findUsedClasses(n, name, collection); });
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
                this.constructorToClassName(file, symbol.valueDeclaration);
            }
        };
        SortHelper.prototype.symbolTabelToFileMap = function (file, symbolTable) {
            var _this = this;
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
                        self.findUsedClasses(node, name, functionCallToClassMap);
                    }
                    else
                        findFunctionCall(node);
                });
            }
        };
        SortHelper.prototype.constructorToClassName = function (file, classNode) {
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
            nodesToCheck.forEach(function (node) { return _this.findUsedClasses(node, className, constructorToClassMap); });
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
            typeNode.subs = [];
            typeNode.depends = [];
            typeNode.supers = [];
            typeNode.subdepends = [];
            fileNodesList.push(typeNode);
            fileNameToNodeMap[file] = typeNode;
            return typeNode;
        };
        SortHelper.prototype.sortFiles = function () {
            var _this = this;
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
                        dependNode.addSub(fileNode);
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
                            fileNode.addDepends(dependFileNode);
                            dependFileNode.addSubDepends(fileNode);
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
                        dependNode.addSub(fileNode);
                        fileNode.addSuper(dependNode);
                    });
                }
            });
            var singleTypes = [], bottomTypes = [], topTypes = [], otherTypes = [];
            fileNodesList.forEach(function (t) {
                if ((t.subs.length || t.supers.length || t.depends.length || t.subdepends.length) == 0)
                    singleTypes.push(t);
                else if (t.subs.length == 0 && t.subdepends.length == 0)
                    bottomTypes.push(t);
                else if (t.supers.length == 0 && t.depends.length == 0)
                    topTypes.push(t);
                else
                    otherTypes.push(t);
            });
            if (hasRefCircle()) {
            }
            else {
                topTypes.forEach(function (t) { return t.setOrder(0); });
                bottomTypes.forEach(function (t) { return t.setOrder(t.order); });
                fileNodesList.sort(function (a, b) { return compareFileNode(a, b); });
            }
            orderedFileList = [];
            for (var i = 0, length = fileNodesList.length, registerClassAdded = false; i < length; i++) {
                var name = fileNodesList[i].name;
                if (registerClassAdded == false && name.indexOf('registerClass') > 0) {
                    orderedFileList.unshift(name);
                    registerClassAdded = true;
                }
                else
                    orderedFileList.push(name);
            }
            for (var i = 0, length = orderedFileList.length; i < length; i++) {
                var name = orderedFileList[i];
                if (name.indexOf('Defines.debug.ts') > 0) {
                    orderedFileList.splice(i, 1);
                    orderedFileList.unshift(name);
                }
            }
        };
        return SortHelper;
    })();
    ts.SortHelper = SortHelper;
    var fileToFileMap = {};
    function hasRefCircle() {
        return fileNodesList.some(function (f) { return f.checkCircle() == false; });
    }
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
    function compareFileNode(a, b) {
        if (a.order != b.order)
            return a.order - b.order;
        if (a.subs.length == 0 && a.subdepends.length == 0)
            return -1;
        if (b.subs.length == 0 && b.subdepends.length == 0)
            return 1;
        return 0;
    }
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
    var FileNode = (function () {
        function FileNode() {
            this._order = 0;
        }
        FileNode.prototype.addSuper = function (node) {
            if (this.depends.indexOf(node) >= 0)
                return;
            this.depends.push(node);
        };
        FileNode.prototype.addDepends = function (node) {
            if (this.depends.indexOf(node) >= 0)
                return;
            this.depends.push(node);
        };
        FileNode.prototype.checkCircle = function () {
            var self = this;
            var path = [];
            function getSupers(node) {
                path.push(node.name);
                var supers = node.depends.concat();
                for (var i = supers.length - 1; i >= 0; i--) {
                    var sup = supers[i];
                    if (sup == self) {
                        path.push(sup.name);
                        errors.push({
                            code: 10018,
                            category: ts.DiagnosticCategory.Error,
                            file: null,
                            messageText: "Found circular dependency:" + path.join("=>"),
                            start: 0,
                            length: 0,
                            isEarly: false
                        });
                        return false;
                    }
                    var ok = getSupers(sup);
                    return ok;
                }
            }
            return getSupers(this);
        };
        FileNode.prototype.addSub = function (node) {
            if (this.subdepends.indexOf(node) >= 0)
                return;
            this.subdepends.push(node);
        };
        FileNode.prototype.addSubDepends = function (node) {
            if (this.subdepends.indexOf(node) >= 0)
                return;
            this.subdepends.push(node);
        };
        FileNode.prototype.setOrder = function (value, nest) {
            var _this = this;
            if (nest === void 0) { nest = 0; }
            this.depends.forEach(function (s) {
                if (s.order > value)
                    value = s.order + 1;
            });
            var offset = value - this._order;
            this._order = value;
            this.subdepends.forEach(function (s) {
                if (s._order <= _this._order)
                    s.setOrder(_this._order + 1, nest + 1);
                s.setOrder(s._order + offset, nest + 1);
            });
        };
        Object.defineProperty(FileNode.prototype, "order", {
            get: function () {
                return this._order;
                ;
            },
            enumerable: true,
            configurable: true
        });
        return FileNode;
    })();
})(ts || (ts = {}));
