var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FiltUtil = require("../../FileUtil");
var ts = require("../../typescript-plus");
var utils = require("./typescript-utils");
function watch(rootFileNames, options) {
    var files = {};
    // initialize the list of files
    rootFileNames.forEach(function (fileName) {
        files[fileName] = { version: 0 };
    });
    // Create the language service files
    var program = ts.createProgram(rootFileNames, options);
    var sourceCodes = program.getSourceFiles();
    sourceCodes.forEach(function (source) {
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
    return __awaiter(this, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            tempData = data;
            files = FiltUtil.searchByFunction(egret.args.projectDir, function (filePath) { return filePath.indexOf(".ts") >= 0; });
            watch(files, { module: ts.ModuleKind.CommonJS });
            return [2 /*return*/, data];
        });
    });
}
exports.run = run;
