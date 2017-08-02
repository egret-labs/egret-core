import * as FiltUtil from "../../FileUtil";
import * as path from "path";
import * as ts from "../../typescript-plus";
import * as utils from "./typescript-utils";

function watch(rootFileNames: string[], options: ts.CompilerOptions) {
    const files = {};

    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });

    // Create the language service files
    var program = ts.createProgram(rootFileNames, options);

    var sourceCodes = program.getSourceFiles();
    sourceCodes.forEach(source => {
        if (source.fileName.indexOf("lib.d.ts") >= 0) {
            return;
        }
        // if (source.fileName.indexOf("egret.d.ts") >= 0) {
        //     return;
        // }
        delint(program, source, "eui.UIComponent");
    });
    rootFileNames.length = 0;
    program = null;
    if (global.gc) global.gc();
}

var tempData;

function delint(program: ts.Program, sourceFile: ts.SourceFile, base: string) {

    var checker = program.getTypeChecker();
    delintNode(sourceFile);

    function delintNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                var theType = checker.getTypeAtLocation(node);

                var className = checker.getFullyQualifiedName(checker.getTypeAtLocation(node).getSymbol());
                let mf = ts.getCombinedModifierFlags(node);
                if (!(mf & ts.ModifierFlags.Abstract)) {
                    var className = checker.getFullyQualifiedName(checker.getTypeAtLocation(node).getSymbol());
                    var superTypes = checker.getBaseTypes(<ts.InterfaceType>theType);

                    var __single__data = {};
                    if (className in tempData) {
                        __single__data = tempData[className];
                    } else {
                        tempData[className] = __single__data;
                    }
                    // console.log("==>" + className)

                    superTypes.forEach(t => __single__data["super"] = checker.getFullyQualifiedName(t.getSymbol()));

                    var props = theType.getSymbol().members;

                    props.forEach(function (value) {
                        let name = value.name;
                        if (name.indexOf("$") == 0 || name.indexOf("_") == 0)
                            return;

                        var p = value;

                        if ((p.flags & ts.SymbolFlags.Property) || (p.flags & ts.SymbolFlags.Accessor)) {
                            var type = checker.getTypeAtLocation(p.declarations[0]);
                            let typeString = utils.getFullyQualifiedNameOfType(type, checker);
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

export async function run(data: any) {
    tempData = data;
    let files = FiltUtil.searchByFunction(egret.args.projectDir, (filePath: string) => filePath.indexOf(".ts") >= 0);
    watch(files, { module: ts.ModuleKind.CommonJS });
    return data;
}