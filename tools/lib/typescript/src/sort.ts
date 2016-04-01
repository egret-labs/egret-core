/// <reference path="core.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="types.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="commandLineParser.ts"/>

namespace ts {
    var checker: TypeChecker = null;
    var program: Program = null;
    var errors: Diagnostic[] = null;

    //parse
    var classNameToFileMap: Map<string | Map<boolean>> = {};
    var classNames: Map<number> = {};
    var fileToClassNameMap: Map<string[]> = {};
    var classNameToBaseClassMap: Map<string[]> = {};
    var constructorToClassMap: Map<string[]> = {};
    var functionCallToClassMap: Map<string[]> = {};
    var functionId = 0;
    var staticToClassNameMap: Map<string> = {};
    var fileToReferenceMap: Map<string[]> = {};

    //sort
    var fileNodesList: FileNode[] = [];
    var fileNameToNodeMap: Map<FileNode> = {};
    var orderedFileList: string[] = [];


    function addClassToFileMap(name:string,file:string) {
        var map:any = classNameToFileMap[name];
        if(!map || file==map){
            classNameToFileMap[name] = file;
        }
        else{
            if(typeof(map)=='string'){
                map = { map:true };
            }
            map[file] = true;
            classNameToFileMap[name] = map;
        }
    }

    export class SortHelper {

        static getOrderedFiles() {
            return orderedFileList;
        }

        static getErrors(): Diagnostic[]{
            return errors;
        }

        static getClassNameAndProps() {
            var names:any = {};
            var files = program.getSourceFiles().concat();
            files.forEach(f=> {
                if (f.fileName.indexOf('.d.ts') > 0)
                    return;
                var symbols = checker.getSymbolsInScope(f, SymbolFlags.Module | SymbolFlags.PropertyOrAccessor | SymbolFlags.Method | SymbolFlags.Class | SymbolFlags.Export);
                symbols.forEach(s=> {
                    var name:string = s.name;
                    names[name] = true;
                });
            });
            return names;
        }

        classNameToFileMap = classNameToFileMap;
        public orderFiles(chk: TypeChecker, prog: Program) {

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
            orderedFileList = files.map(f=> f.fileName);
            checker = chk;
            program = prog;
            forEach(files, file=> this.symbolTabelToFileMap(file, file.locals));
            this.sortFiles();
            var sources = prog.getSourceFiles();
            orderedFileList.forEach(f=> {
                for (var i = 0; i < sources.length; i++) {
                    var s = sources[i];
                    if (s.fileName == f) {
                        sources.splice(i, 1);
                        sources.push(s);
                        break;
                    }
                }
            });
        }


        private symbolToFileMap(file: SourceFile, symbol:Symbol) {
            var classtype = <InterfaceType>checker.getDeclaredTypeOfSymbol(symbol.exportSymbol || symbol);
            if (symbol.flags & (SymbolFlags.Module))
                return;

            var isInterface = symbol.flags & SymbolFlags.Interface;
            if (classtype) {

                var fullName = getFullyQualifiedName( symbol);
                addClassToFileMap(fullName,file.fileName);


                var classes = fileToClassNameMap[file.fileName];
                if (!classes) {
                    classes = [];
                    fileToClassNameMap[file.fileName] = classes;
                }
                if (classes.indexOf(fullName) < 0)
                    classes.push(fullName);
                if (isInterface)
                    return;
                var baseTypes:Array<InterfaceType>;
                try {
                    baseTypes = <Array<InterfaceType>>checker.getBaseTypes(classtype);
                }
                catch (e){

                }
                if (baseTypes && baseTypes.length) {
                    forEach(baseTypes,(t: InterfaceType) => this.classNameToBaseClass(fullName, t));
                }
                this.constructorToClassName(file, <ClassDeclaration>symbol.valueDeclaration, 0);
                this.addStaticDepend(file, <ClassDeclaration>symbol.valueDeclaration, 0);
            }


        }
        private symbolTabelToFileMap(file: SourceFile, symbolTable: SymbolTable) {
            this.findFileRefers(file);
            ts.forEachValue(symbolTable, symbol=> {
                symbol = symbol.exportSymbol || symbol;
                if (symbol.name == "prototype")
                    return;
                this.symbolToFileMap(file, symbol);
                this.staticMemberToClassName(file, symbol);
                if (symbol.valueDeclaration && symbol.valueDeclaration.locals) {
                    this.symbolTabelToFileMap(file, symbol.valueDeclaration.locals);
                }
                if (symbol.exports) {
                    this.symbolTabelToFileMap(file, symbol.exports);
                }
            });
            if (file.fileName.indexOf(".d.ts") > 0)
                return;
            var self = this;
            findFunctionCall(file);
            function findFunctionCall(pnode:Node) {
                forEachChild(pnode,node=>{
                    if(node.kind == SyntaxKind.ClassDeclaration ||
                        node.kind == SyntaxKind.InterfaceDeclaration ||
                        node.kind == SyntaxKind.FunctionDeclaration)
                        return;
                    if(node.kind == SyntaxKind.PropertyAccessExpression||
                        node.kind == SyntaxKind.CallExpression ||
                        node.kind == SyntaxKind.NewExpression ||
                        node.kind == SyntaxKind.Identifier ){

                        var name = "callExpression" + ++functionId;
                        self.findUsedClasses(node,name,functionCallToClassMap,0);
                    }
                    else
                        findFunctionCall(node);
                });
            }


        }

        private findFileRefers(file: SourceFile) {
            var refers = file.referencedFiles;
            if (refers)
                fileToReferenceMap[file.fileName] = refers.map(r=> ts.normalizePath(ts.combinePaths(ts.getDirectoryPath(file.fileName), r.fileName)));
        }

        private constructorToClassName(file: SourceFile, classNode: ClassDeclaration, nest: number) {
            if (!classNode || !classNode.symbol)
                return;
            var className = checker.getFullyQualifiedName(classNode.symbol);
            var nodesToCheck: Node[] = [];
            forEachChild(classNode, node=> {
                if (node.kind == SyntaxKind.Constructor) {
                    nodesToCheck.push((<ConstructorDeclaration>node).body);
                }

                if ((node.kind == SyntaxKind.PropertySignature || node.kind == SyntaxKind.PropertyDeclaration) && (<PropertyDeclaration>node).initializer) {
                    nodesToCheck.push((<PropertyDeclaration>node).initializer);
                }
            });
            if (!nodesToCheck.length) {
                return;
            }


            nodesToCheck.forEach(node=> this.findUsedClasses(node,className,constructorToClassMap,0));
        }

        private findUsedClasses = (node: Node, name: string, collection: Map<string[]>, nest: number) => {
            if(!node)
                return;
            if (nest > 4)
                return;
            var nodeToGet: Node = null;
            switch (node.kind) {
                case SyntaxKind.PropertyAccessExpression:
                case SyntaxKind.Identifier:
                    nodeToGet = node;// (<PropertyAccessExpression>n).expression;
                    break;
                case SyntaxKind.CallExpression:
                case SyntaxKind.NewExpression:
                    nodeToGet = (<CallExpression>node).expression;
                    break;
                default:
                    nodeToGet = null;
            }

            if (nodeToGet) {
                var definedSymbol = checker.egretGetResolveSymbol(<Identifier>nodeToGet);

                if (definedSymbol
                    && !(definedSymbol.exportSymbol && (definedSymbol.exportSymbol.flags & SymbolFlags.Module))
                    && (definedSymbol.flags & SymbolFlags.Value || definedSymbol.flags & SymbolFlags.Export)
                    && definedSymbol.declarations && definedSymbol.declarations.length
                    && !(definedSymbol.declarations[0].symbol.flags & SymbolFlags.Variable)) {

                    var targetName = checker.getFullyQualifiedName(definedSymbol);
                    if (targetName == "unknown")
                        return;
                    var classes = collection[name] || [];
                    classes.push(targetName);
                    collection[name] = classes;


                    if (!(name in classNameToFileMap)) {
                        var source = <SourceFile>getAncestor(nodeToGet, SyntaxKind.SourceFile);
                        addClassToFileMap(name, source.fileName);
                    }

                    if (!(targetName in classNameToFileMap) && definedSymbol.declarations && definedSymbol.declarations.length) {
                        var declareNode = definedSymbol.declarations[0];
                        var source = <SourceFile>getAncestor(declareNode, SyntaxKind.SourceFile);
                        addClassToFileMap(targetName, source.fileName);

                        if (node.kind == SyntaxKind.NewExpression) {
                            if (!(targetName in constructorToClassMap)) {
                                this.constructorToClassName(source, <ClassDeclaration>declareNode, nest+1);
                            }
                        }
                    }

                    if (node.kind == SyntaxKind.CallExpression)
                        this.findUsedClasses(declareNode, targetName, functionCallToClassMap, nest + 1);
                    if (node.kind == SyntaxKind.NewExpression)
                        constructorToClassMap[targetName] && constructorToClassMap[targetName].forEach(clazz=> {
                            classes.push(clazz)
                        });

                }
            }
            else {
                forEachChild(node, n=> this.findUsedClasses(n, name, collection, nest));
            }

        }

        private staticMemberToClassName(file: SourceFile, symbol: Symbol) {
            symbol = symbol.exportSymbol || symbol;
            var fullName = getFullyQualifiedName(symbol);
            var declarExp = <PropertyDeclaration>symbol.valueDeclaration;
            if (declarExp && declarExp.initializer) {
                var staticMemberType = checker.checkAndMarkExpression(declarExp.initializer);
                if (staticMemberType.symbol == undefined || (staticMemberType.symbol.flags & SymbolFlags.Interface))
                    return;
                var initializerClass = checker.getFullyQualifiedName(staticMemberType.symbol);
                staticToClassNameMap[fullName] = initializerClass;

            }
        }

        private addStaticDepend(file: SourceFile, classNode: ClassDeclaration, nest: number) {
            if (!classNode || !classNode.symbol)
                return;
            var className = checker.getFullyQualifiedName(classNode.symbol);
            var nodesToCheck: Node[] = [];

            function findClass(rootNode: Node) {
                ts.forEachChild(rootNode, function (cnode) {
                    switch (cnode.kind) {
                        case SyntaxKind.PropertyAccessExpression:
                        case SyntaxKind.CallExpression:
                        case SyntaxKind.NewExpression:
                            var nodeToGet = (<CallExpression>cnode).expression;
                            if (!nodeToGet)
                                return;
                            try {
                                var staticMemberType = checker.checkAndMarkExpression(nodeToGet);
                                if (staticMemberType.symbol == undefined || (staticMemberType.symbol.flags & SymbolFlags.Interface))
                                    return;
                                var fullName = checker.getFullyQualifiedName(staticMemberType.symbol);
                            }
                            catch (e) {
                                return;
                            }
                            var bases = classNameToBaseClassMap[className] || [];
                            if (bases.indexOf(fullName) < 0)
                                bases.push(fullName);
                            classNameToBaseClassMap[className] = bases;
                        default:
                            findClass(cnode);
                    }
                });
            }

            ts.forEachChild(classNode, function (node) {
                if ((node.kind == SyntaxKind.PropertySignature || node.kind == SyntaxKind.PropertyDeclaration) && node.modifiers && (node.modifiers.flags & NodeFlags.Static) && (<PropertyDeclaration>node).initializer) {
                    findClass(node);
                }
            });
        }

        private classNameToBaseClass(className:any, baseType:InterfaceType) {
            var fullName = checker.getFullyQualifiedName(baseType.symbol);
            var bases = classNameToBaseClassMap[className] || [];
            if(bases.indexOf(fullName)<0)
                bases.push(fullName);
            classNameToBaseClassMap[className] = bases;
        }





        //todo
        private getFileNode(file:string) {
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
        }

        private sortFiles() {
            forEachKey(fileToReferenceMap, fileName=> {
                var fileNode = this.getFileNode(fileName);
                var refers = fileToReferenceMap[fileName];
                refers.forEach(r=> {
                    var referNode = this.getFileNode(r);
                    fileNode.addRefer(referNode);
                });
            });

            forEachKey(classNameToFileMap, className=> {
                var file = classNameToFileMap[className];
                if(typeof(file)!='string')
                    return;
                var fileName:string = <string>file;
                var fileNode = this.getFileNode(fileName);



                var supers = classNameToBaseClassMap[className];
                if (supers) {
                    supers.forEach(superClass=> {
                        var dependFile = classNameToFileMap[superClass];
                        if (!dependFile || dependFile && (<any>dependFile)['map'] || dependFile == fileName || (<any>dependFile)[fileName])
                            return;
                        var dependNode = this.getFileNode(<string>dependFile);
                        fileNode.addSuper(dependNode);
                    })
                }
                var staticDepends = staticToClassNameMap[className];
                if (staticDepends) {
                    var constructorDepends = constructorToClassMap[staticDepends] || [];
                    constructorDepends.push(staticDepends);
                    constructorDepends.forEach(depend=> {
                        var dependFile = classNameToFileMap[depend];

                        if (dependFile && (<any>dependFile)['map']==undefined && dependFile != file&& typeof(dependFile) =='string' ) {
                            var dependFileNode = this.getFileNode(<string>dependFile);
                            fileNode.addCall(dependFileNode);
                        }
                    });
                }
                var functionName = className;
                var functionCallDepens = functionCallToClassMap[functionName];
                if(functionCallDepens){
                    functionCallDepens.forEach(depend=> {
                        var dependFile = classNameToFileMap[depend];
                        if (!dependFile || dependFile && (<any>dependFile)['map'] ||dependFile == file || typeof(dependFile)!='string')
                            return;
                        var dependNode = this.getFileNode(<string>dependFile);
                        fileNode.addCall(dependNode);
                    })
                }
            });

            var singleTypes: FileNode[] = [],
                bottomTypes: FileNode[] = [],
                topTypes: FileNode[] = [],
                otherTypes: FileNode[] = [];

            fileNodesList.forEach(t=> {
                t.markHardDepends();
            });
            fileNodesList.forEach(t=> {
                t.markSoftDepends();
            });



            orderedFileList = [];


            var sorted: FileNode[] = []
            var sortedMap: any = {};



            function insert(file: FileNode) {
                if (file.name.toLowerCase() in sortedMap)
                    return;
                for (var i in file.depends)
                    insert(fileNameToNodeMap[i]);
                sorted.push(file);
                sortedMap[file.name.toLowerCase()] = true;
            }

            fileNodesList.forEach(e=> {
                insert(e);
            });

            orderedFileList = sorted.map(n=> n.name);
        }

    }

    var fileToFileMap: Map<Map<boolean>> = {};

    export class UsedFileResolver{

        static mapFile(source: string, used: string) {
            var depends = fileToFileMap[source];
            if (!depends)
            {
                depends = {};
                fileToFileMap[source] = depends;
            }
            depends[used] = true;
        }

    }




    /**
    * no export properties may have same name, add id after the name
    */
    function getFullyQualifiedName(symbol: Symbol) {
        var name:string = null;
        if (symbol.exportSymbol)
        {
            name = checker.getFullyQualifiedName(symbol.exportSymbol);
            classNames[name] = Object.keys(classNames).length;
        }
        else
        {
            name = checker.getFullyQualifiedName(symbol);
            if (!(symbol.flags & (SymbolFlags.Class | SymbolFlags.Interface | SymbolFlags.Module)))
            {
                name += symbol.id;
            }
            else
            {
                classNames[name] = Object.keys(classNames).length;
            }
        }

        return name;

    }

    var fileHashCode = 1;

    class FileNode {
        name: string;
        supers: FileNode[] = [];
        calls: FileNode[] = [];
        refers: FileNode[] = [];
        hashCode: number;
        depends: Map<boolean>;
        softdepends: Map<boolean>;
        constructor() {
            this.hashCode = fileHashCode++;
        }

        addSuper(node: FileNode) {
            if (this.supers.indexOf(node) >= 0)
                return;
            this.supers.push(node);
        }

        addRefer(node: FileNode) {
            if (this.refers.indexOf(node) >= 0)
                return;
            this.refers.push(node);
        }

        addCall(node: FileNode) {
            if (this.calls.indexOf(node) >= 0)
                return;
            this.calls.push(node);
        }

        markHardDepends() {
            if (this.depends)
                return;
            this.depends = {};
            var files = this.supers.concat(this.refers);
            files.forEach(f=> {
                if (!f.depends)
                    f.markHardDepends();

                for (var i in f.depends)
                    if (i == this.name) {
                        this.logCircular(this.name, i);
                    } else {
                        this.depends[i] = true;
                    }
                this.depends[f.name] = true;
            });
        }

        markSoftDepends() {
            if (this.softdepends)
                return;
            var files = this.calls.concat();
            this.softdepends = {};
            files.forEach(f=> {
                if (f.name == this.name)
                    return;
                if (!f.softdepends)
                    f.markSoftDepends();

                for (var i in f.softdepends) {
                    if (fileNameToNodeMap[i].depends[this.name])
                        continue;

                    if (i == this.name) {
                        this.logCircular(this.name, i);
                    } else {
                        this.softdepends[i] = true;
                        this.depends[i] = true;
                    }
                }
                if (fileNameToNodeMap[f.name].depends[this.name])
                    return;
                this.softdepends[f.name] = true;
            });
        }

        logCircular(file: string, other: string) {
            //console.log("Warning:Found circular dependency:" + file);
        }
    }
}
