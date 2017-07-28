Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("../../typescript-plus");
function getClassExtendsHeritageClauseElement(node) {
    var heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
    return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
}
exports.getClassExtendsHeritageClauseElement = getClassExtendsHeritageClauseElement;
function getClassImplementsHeritageClauseElements(node) {
    var heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ImplementsKeyword);
    return heritageClause ? heritageClause.types : undefined;
}
exports.getClassImplementsHeritageClauseElements = getClassImplementsHeritageClauseElements;
function getInterfaceBaseTypeNodes(node) {
    var heritageClause = getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
    return heritageClause ? heritageClause.types : undefined;
}
exports.getInterfaceBaseTypeNodes = getInterfaceBaseTypeNodes;
function getHeritageClause(clauses, kind) {
    if (clauses) {
        for (var _i = 0, clauses_1 = clauses; _i < clauses_1.length; _i++) {
            var clause = clauses_1[_i];
            if (clause.token === kind) {
                return clause;
            }
        }
    }
    return undefined;
}
exports.getHeritageClause = getHeritageClause;
function getFullyQualifiedNameOfType(type, checker) {
    var symbol = type.getSymbol();
    if (symbol) {
        return checker.getFullyQualifiedName(symbol);
    }
    else {
        return checker.typeToString(type);
    }
}
exports.getFullyQualifiedNameOfType = getFullyQualifiedNameOfType;
function getImplementedInterfaces(type, checker) {
    var superInterfaces = null;
    var result = [];
    if (type.symbol.declarations) {
        type.symbol.declarations.forEach(function (node) {
            var interfaceType = checker.getTypeAtLocation(node);
            var baseObjectTypes = interfaceType.getBaseTypes().map(function (i) {
                if (i.objectFlags) {
                    return i.objectFlags;
                }
                return null;
            });
            var isClass = baseObjectTypes.indexOf(ts.ObjectFlags.Class);
            if (isClass)
                superInterfaces = getClassImplementsHeritageClauseElements(node);
            else
                superInterfaces = getInterfaceBaseTypeNodes(node);
            if (superInterfaces) {
                superInterfaces.forEach(function (sp) {
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
exports.getImplementedInterfaces = getImplementedInterfaces;
