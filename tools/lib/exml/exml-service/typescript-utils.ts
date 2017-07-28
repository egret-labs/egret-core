import * as ts from "../../typescript-plus";

export function getClassExtendsHeritageClauseElement(node: ts.ClassLikeDeclaration) {
    let heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
    return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
}

export function getClassImplementsHeritageClauseElements(node: ts.ClassLikeDeclaration) {
    let heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ImplementsKeyword);
    return heritageClause ? heritageClause.types : undefined;
}

export function getInterfaceBaseTypeNodes(node: ts.InterfaceDeclaration) {
    let heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
    return heritageClause ? heritageClause.types : undefined;
}

export function getHeritageClause(clauses: ts.NodeArray<ts.HeritageClause>, kind: ts.SyntaxKind) {
    if (clauses) {
        for (let clause of clauses) {
            if (clause.token === kind) {
                return clause;
            }
        }
    }

    return undefined;
}

export function getFullyQualifiedNameOfType(type:ts.Type,checker:ts.TypeChecker){
    let symbol = type.getSymbol();
    if (symbol){
        return checker.getFullyQualifiedName(symbol);
    }
    else{
        return checker.typeToString(type);
    }
}

export function getImplementedInterfaces(type: ts.Type,checker:ts.TypeChecker) {
    var superInterfaces: Array<any> = null;
    var result :Array<ts.BaseType> = [];
    
    
    if (type.symbol.declarations) {
        type.symbol.declarations.forEach(node=> {
    
            var interfaceType = checker.getTypeAtLocation(node);
            let baseObjectTypes = interfaceType.getBaseTypes().map((i) => {
                if((<ts.ObjectType>i).objectFlags) {
                    return (<ts.ObjectType>i).objectFlags;
                }
                return null;
            });
            var isClass = baseObjectTypes.indexOf(ts.ObjectFlags.Class);
            if (isClass)
                superInterfaces = getClassImplementsHeritageClauseElements(<ts.ClassLikeDeclaration>node);
            else
                superInterfaces = getInterfaceBaseTypeNodes(<ts.InterfaceDeclaration>node);
            if (superInterfaces) {
                superInterfaces.forEach(sp=> {
                    interfaceType = checker.getTypeAtLocation(sp);
                    if (baseObjectTypes.indexOf(ts.ObjectFlags.Interface)) {
                        result.concat(interfaceType.getBaseTypes());
                    }
                });
            }
        });
    }
    return result;
}