Object.defineProperty(exports, "__esModule", { value: true });
var FiltUtil = require("../../FileUtil");
var path = require("path");
var ts = require("../../typescript-plus");
var utils = require("./typescript-utils");
function watch() {
    var projectRoot = egret.args.projectDir;
    var tsconfig = FiltUtil.readJSONSync(path.join(projectRoot, 'tsconfig.json'));
    var config = ts.parseJsonConfigFileContent(tsconfig, ts.sys, projectRoot);
    var program = ts.createProgram(config.fileNames, config.options);
    var sourceCodes = program.getSourceFiles();
    sourceCodes.forEach(function (source) {
        // if (source.fileName.indexOf("lib.d.ts") >= 0) {
        //     return;
        // }
        // if (source.fileName.indexOf("egret.d.ts") >= 0) {
        //     return;
        // }
        delint(program, source, "eui.UIComponent");
    });
    if (global.gc)
        global.gc();
}
var tempData;
function delint(program, sourceFile, base) {
    var checker = program.getTypeChecker();
    delintNode(sourceFile);
    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                var theType = checker.getTypeAtLocation(node);
                var className = checker.getFullyQualifiedName(checker.getTypeAtLocation(node).getSymbol());
                var mf = ts.getCombinedModifierFlags(node);
                if (!(mf & ts.ModifierFlags.Abstract)) {
                    var className = checker.getFullyQualifiedName(checker.getTypeAtLocation(node).getSymbol());
                    var superTypes = checker.getBaseTypes(theType);
                    var __single__data = {};
                    if (className in tempData) {
                        __single__data = tempData[className];
                    }
                    else {
                        tempData[className] = __single__data;
                    }
                    // console.log("==>" + className)
                    superTypes.forEach(function (t) { return __single__data["super"] = checker.getFullyQualifiedName(t.getSymbol()); });
                    var props = theType.getSymbol().members;
                    props.forEach(function (value) {
                        var name = value.name;
                        if (name.indexOf("$") == 0 || name.indexOf("_") == 0)
                            return;
                        var p = value;
                        if ((p.flags & ts.SymbolFlags.Property) || (p.flags & ts.SymbolFlags.Accessor)) {
                            var type = checker.getTypeAtLocation(p.declarations[0]);
                            var typeString = utils.getFullyQualifiedNameOfType(type, checker);
                            if (!__single__data.hasOwnProperty(p.name)) {
                                //不允许重载的属性
                                if (!(p.name in {
                                    "itemRenderer": 1,
                                    "itemRendererSkinName": 1,
                                    "skinName": 1
                                })) {
                                    __single__data[p.name] = typeString;
                                }
                            }
                        }
                    });
                }
        }
        ts.forEachChild(node, delintNode);
    }
}
function run(data) {
    tempData = data;
    watch();
}
exports.run = run;
