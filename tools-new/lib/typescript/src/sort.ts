/// <reference path="core.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="types.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="commandLineParser.ts"/>

module ts {
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
    
    //sort
    var fileNodesList: FileNode[] = [];
    var fileNameToNodeMap: Map<FileNode> = {};
    var orderedFileList: string[] = [];
    

    function addClassToFileMap(name:string,file:string) {
        var map = classNameToFileMap[name];
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
            var names = {};
            var files = program.getSourceFiles().concat();
            files.forEach(f=> {
                if (f.filename.indexOf('.d.ts') > 0)
                    return;
                var symbols = checker.getSymbolsInScope(f, SymbolFlags.Module | SymbolFlags.PropertyOrAccessor | SymbolFlags.Method | SymbolFlags.Class | SymbolFlags.Export);
                symbols.forEach(s=> {
                    var name = s.name
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

            var files = prog.getSourceFiles().concat();
            var libdts = files.shift();
            orderedFileList = files.map(f=> f.filename);
            checker = chk;
            program = prog;
            forEach(files, file=> this.symbolTabelToFileMap(file, file.locals));
            this.sortFiles();
            var sources = prog.getSourceFiles();
            orderedFileList.forEach(f=> {
                for (var i = 0; i < sources.length; i++) {
                    var s = sources[i];
                    if (s.filename == f) {
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
                addClassToFileMap(fullName,file.filename);


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
                    forEach(classtype.baseTypes,(t: InterfaceType) => this.classNameToBaseClass(fullName, t));
                }
                this.constructorToClassName(file, <ClassDeclaration>symbol.valueDeclaration,0);
            }
            

        }
        private symbolTabelToFileMap(file: SourceFile, symbolTable: SymbolTable) {

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
            if (file.filename.indexOf(".d.ts") > 0)
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

        private constructorToClassName(file: SourceFile, classNode: ClassDeclaration, nest: number) {
            if (!classNode || !classNode.symbol)
                return;
            var className = checker.getFullyQualifiedName(classNode.symbol);
            var nodesToCheck: Node[] = [];
            forEachChild(classNode, node=> {
                if (node.kind == SyntaxKind.Constructor) {
                    nodesToCheck.push((<ConstructorDeclaration>node).body);
                }

                if (node.kind == SyntaxKind.Property && (<PropertyDeclaration>node).initializer) {
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
                        addClassToFileMap(name, source.filename);
                    }

                    if (!(targetName in classNameToFileMap) && definedSymbol.declarations && definedSymbol.declarations.length) {
                        var declareNode = definedSymbol.declarations[0];
                        var source = <SourceFile>getAncestor(declareNode, SyntaxKind.SourceFile);
                        addClassToFileMap(targetName, source.filename);

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

        private addStaticDepend(staticMemberName: string, className: string) {

        }

        private classNameToBaseClass(className, baseType:InterfaceType) {
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
            typeNode.subs = [];
            typeNode.depends = [];
            typeNode.supers = [];
            typeNode.subdepends = [];

            fileNodesList.push(typeNode);
            fileNameToNodeMap[file] = typeNode;

            return typeNode;
        }

        private sortFiles() {
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
                        if (dependFile && dependFile['map'] || dependFile == fileName || dependFile[fileName])
                            return;
                        var dependNode = this.getFileNode(<string>dependFile);
                        dependNode.addSub(fileNode);
                        fileNode.addSuper(dependNode);
                    })
                }
                var staticDepends = staticToClassNameMap[className];
                if (staticDepends) {
                    var constructorDepends = constructorToClassMap[staticDepends] || [];
                    constructorDepends.push(staticDepends);
                    constructorDepends.forEach(depend=> {
                        var dependFile = classNameToFileMap[depend];

                        if (dependFile && dependFile['map']==undefined && dependFile != file&& typeof(dependFile) =='string' ) {
                            var dependFileNode = this.getFileNode(<string>dependFile);
                            fileNode.addDepends(dependFileNode);
                            dependFileNode.addSubDepends(fileNode);
                        }
                    });
                }
                var functionName = className;
                var functionCallDepens = functionCallToClassMap[functionName];
                if(functionCallDepens){
                    functionCallDepens.forEach(depend=> {
                        var dependFile = classNameToFileMap[depend];
                        if (dependFile && dependFile['map'] ||dependFile == file || typeof(dependFile)!='string')
                            return;
                        var dependNode = this.getFileNode(<string>dependFile);
                        dependNode.addSub(fileNode);
                        fileNode.addSuper(dependNode);
                    })
                }
            });

            var singleTypes: FileNode[] = [],
                bottomTypes: FileNode[] = [],
                topTypes: FileNode[] = [],
                otherTypes: FileNode[] = [];

            fileNodesList.forEach(t=> {
                if ((t.subs.length || t.supers.length || t.depends.length||t.subdepends.length) == 0)
                    singleTypes.push(t);
                else if (t.subs.length == 0&&t.subdepends.length==0)
                    bottomTypes.push(t);
                else if (t.supers.length == 0 && t.depends.length == 0)
                    topTypes.push(t);
                else
                    otherTypes.push(t);
            });
            if(hasRefCircle()){
            }
            else{
                topTypes.forEach(t=> t.setOrder(0));
                bottomTypes.forEach(t=> t.setOrder(t.order));
                fileNodesList.sort((a, b) => compareFileNode(a, b));
            }
            orderedFileList = [];
            for (var i = 0, length = fileNodesList.length, registerClassAdded=false; i < length; i++) {
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
        }

    }

    var fileToFileMap: Map<Map<boolean>> = {};

    function hasRefCircle() {
        return fileNodesList.some(f=>f.checkCircle()==false);
    }

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



    function compareFileNode(a: FileNode, b: FileNode) {
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
        supers: FileNode[];
        subs: FileNode[];
        depends: FileNode[];
        subdepends: FileNode[];
        file: string;
        hashCode: number;
        constructor() {
            this.hashCode = fileHashCode++;
        }

        addSuper(node: FileNode) {
            if (this.depends.indexOf(node) >= 0)
                return;
            this.depends.push(node);
        }

        addDepends(node: FileNode) {
            if (this.depends.indexOf(node) >= 0)
                return;
            this.depends.push(node);
        }
        
        checkCircle():boolean{
            var self = this;
            var path = [];
            var supersChecked: any = {};
            function getSupers(node:FileNode):boolean {
                path.push(node.name);
                supersChecked[node.name] = true;
                var supers = node.subdepends.concat();
                for(var i= supers.length-1;i>=0;i--){
                    var sup = supers[i];
                    if (sup == self || supersChecked[sup.name]) {
                        path.push(sup.name);
                        errors.push({
                            code: 10018,
                            category: DiagnosticCategory.Error,
                            file: null,
                            messageText: "Found circular dependency:" + path.join("=>"),
                            start: 0,
                            length: 0,
                            isEarly:false
                        });
                        console.log("Found circular dependency:" + path.join("=>"));
                        node.subdepends.splice(i, 1);
                    }
                    var ok = getSupers(sup);
                    if (!ok)
                        return ok;
                }
                return true;
            }
            return getSupers(this);
        }

        addSub(node: FileNode) {
            if (this.subdepends.indexOf(node) >= 0)
                return;
            this.subdepends.push(node);
        }

        addSubDepends(node: FileNode) {
            if (this.subdepends.indexOf(node) >= 0)
                return;
            this.subdepends.push(node);
        }

        _order: number = 0;
        

        setOrder(value: number, nest: number = 0) {
            //if (nest > 30)
            //    console.log(nest, value, this.name);
            //if (nest > 50)
            //    process.exit();
            this.depends.forEach(s=> {
                if (s.order > value)
                    value = s.order + 1;
                
            })

            var offset = value - this._order;
            this._order = value;

            this.subdepends.forEach(s=> {
                
                if (s._order <= this._order)
                    s.setOrder( this._order + 1,nest+1);
                s.setOrder(s._order + offset, nest + 1);
                
            });
        }

        get order(): number {
            return this._order;;
        }
    }
}
