/**
 * Created by wander on 14-9-15.
 */


var file = require("../core/file.js");


function typeScriptCompiler(quitFunc,cmd, tscLibUrl) {
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize
    var TypeScript = require('../core/typescript/tsc.js');

    TypeScript.exit = function(){
        setTimeout(quitFunc,1,arguments[0])
    }
//    var timer = new Date().getTime();
    TypeScript.executeCommandLine(["@tsc_config_temp.txt"], tscLibUrl);
//    console.log (new Date().getTime() - timer)

//    if (isQuickMode()) {//快速构建，去掉类型检查阶段
//        TypeScript.PullTypeResolver.typeCheck = function (compilationSettings, semanticInfoChain, document) {
//            var sourceUnit = document.sourceUnit();
//
//            var resolver = semanticInfoChain.getResolver();
//            var context = new TypeScript.PullTypeResolutionContext(resolver, true, sourceUnit.fileName());
//
//            if (resolver.canTypeCheckAST(sourceUnit, context)) {
//                resolver.resolveAST(sourceUnit, false, context);
//            }
//        };
//    }

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