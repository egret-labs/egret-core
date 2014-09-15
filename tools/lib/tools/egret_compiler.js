/**
 * Created by wander on 14-9-15.
 */


var file = require("../core/file.js");


function typeScriptCompiler(quitFunc,cmd) {
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize
    var TypeScript = require('../core/typescript/tsc.js');
    TypeScript.IO.arguments = ["@tsc_config_temp.txt"];
    TypeScript.IO.quit = quitFunc;
    TypeScript.Emitter.prototype.emitClass = function (classDecl) {
        var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl);
        this.pushDecl(pullDecl);

        var svClassNode = this.thisClassNode;
        this.thisClassNode = classDecl;
        var className = classDecl.identifier.text();
        this.emitComments(classDecl, true);
        var temp = this.setContainer(3 /* Class */);

        this.recordSourceMappingStart(classDecl);
        this.writeToOutput("var " + className);

        var hasBaseClass = TypeScript.ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses) !== null;
        var baseTypeReference = null;
        var varDecl = null;

        if (hasBaseClass) {
            this.writeLineToOutput(" = (function (_super) {");
        } else {
            this.writeLineToOutput(" = (function () {");
        }

        this.recordSourceMappingNameStart(className);
        this.indenter.increaseIndent();

        if (hasBaseClass) {
            baseTypeReference = TypeScript.ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses).typeNames.nonSeparatorAt(0);
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord("__extends(" + className + ", _super)", baseTypeReference);
            this.writeLineToOutput(";");
        }

        this.emitIndent();

        var constrDecl = getLastConstructor(classDecl);

        if (constrDecl) {
            this.emit(constrDecl);
            this.writeLineToOutput("");
        } else {
            this.recordSourceMappingStart(classDecl);

            this.indenter.increaseIndent();
            this.writeLineToOutput("function " + classDecl.identifier.text() + "() {");
            this.recordSourceMappingNameStart("constructor");
            if (hasBaseClass) {
                this.emitIndent();
                this.writeToOutputWithSourceMapRecord("_super.apply(this, arguments)", baseTypeReference);
                this.writeLineToOutput(";");
            }

            if (this.shouldCaptureThis(classDecl)) {
                this.writeCaptureThisStatement(classDecl);
            }

            this.emitParameterPropertyAndMemberVariableAssignments();

            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord("}", classDecl.closeBraceToken);
            this.writeLineToOutput("");

            this.recordSourceMappingNameEnd();
            this.recordSourceMappingEnd(classDecl);
        }

        this.emitClassMembers(classDecl);

        this.emitIndent();
        this.writeToOutputWithSourceMapRecord("return " + className + ";", classDecl.closeBraceToken);
        this.writeLineToOutput("");
        this.indenter.decreaseIndent();
        this.emitIndent();
        this.writeToOutputWithSourceMapRecord("}", classDecl.closeBraceToken);
        this.recordSourceMappingNameEnd();
        this.recordSourceMappingStart(classDecl);
        this.writeToOutput(")(");
        if (hasBaseClass) {
            this.emitJavascript(baseTypeReference, false);
        }
        this.writeToOutput(");");
        this.recordSourceMappingEnd(classDecl);

        if ((temp === 1 /* Module */ || temp === 2 /* DynamicModule */) && TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */)) {
            this.writeLineToOutput("");
            this.emitIndent();
            var modName = temp === 1 /* Module */ ? this.moduleName : "exports";
            this.writeToOutputWithSourceMapRecord(modName + "." + className + " = " + className + ";", classDecl);

            var fullClassName = pullDecl.name;
            var parentDecl = pullDecl.getParentDecl();
            while (parentDecl && !(parentDecl instanceof TypeScript.RootPullDecl)) {
                fullClassName = parentDecl.name + "." + fullClassName;
                parentDecl = parentDecl.getParentDecl();
            }
            this.writeLineToOutput("");
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord(className + ".prototype.__class__ = \"" + fullClassName + "\";", classDecl);
        }
        else {
            this.writeLineToOutput("");
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord(className + ".prototype.__class__ = \"" + className + "\";", classDecl);
        }

        this.recordSourceMappingEnd(classDecl);
        this.emitComments(classDecl, false);
        this.setContainer(temp);
        this.thisClassNode = svClassNode;

        this.popDecl(pullDecl);
    };

    if (isQuickMode()) {//快速构建，去掉类型检查阶段
        TypeScript.PullTypeResolver.typeCheck = function (compilationSettings, semanticInfoChain, document) {
            var sourceUnit = document.sourceUnit();

            var resolver = semanticInfoChain.getResolver();
            var context = new TypeScript.PullTypeResolutionContext(resolver, true, sourceUnit.fileName());

            if (resolver.canTypeCheckAST(sourceUnit, context)) {
                resolver.resolveAST(sourceUnit, false, context);
            }
        };
    }

    var batch = new TypeScript.BatchCompiler(TypeScript.IO);
    batch.batchCompile();
}


function isQuickMode() {
    return false;
    var opts = param.getArgv().opts;
    if ((opts["-quick"] || opts["-q"]) && !opts["-e"]) {
        return true;
    }
    return false;
}

function getLastConstructor(classDecl) {
    return classDecl.classElements.lastOrDefault(function (e) {
        return e.kind() === 137 /* ConstructorDeclaration */;
    });
}

exports.compile = typeScriptCompiler;