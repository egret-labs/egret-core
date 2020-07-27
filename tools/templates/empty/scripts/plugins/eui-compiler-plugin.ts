require('./npm').installFromLauncher(["@egret/eui-compiler"]);
// require('./npm').installDependencies(["@egret/eui-compiler"]);

import * as eui from '@egret/eui-compiler';

/**
 * EuiCompiler 插件
 * 该插件为 EXMLPlugin 的替代品
 */
export class EuiCompilerPlugin implements plugins.Command {

    constructor(private mode: string) {
    }

    async onFile(file: plugins.File) {
        if (file.extname === '.exml') {
            return null;
        }
        else {
            return file;
        }

    }

    async onFinish(commandContext: plugins.CommandContext) {
        const compiler = new eui.EuiCompiler(commandContext.projectRoot, this.mode);
        compiler.setCustomTransformers([
            transformer
        ])
        const emitResult = compiler.emit();
        for (let emitInfo of emitResult) {
            commandContext.createFile(emitInfo.filename, new Buffer(emitInfo.content))
        }
    }
}


const transformer: eui.EuiAstTransformer = (ast) => {
    return ast;
}
