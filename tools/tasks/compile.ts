import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';

export default {
    name: "compile",
    onFile: async (file) => {
        return file;
    },
    onFinish: async (pluginContext) => {
        try {
            const target = egret.args.target;
            const scripts = EgretProject.manager.copyLibsForPublish(target);
            scripts.forEach((script) => {
                pluginContext.createFile(script, fs.readFileSync(FileUtil.joinPath(pluginContext.projectRoot, script)));
            })
            const jscode = tinyCompiler();
            pluginContext.createFile("main.min.js", new Buffer(jscode));
            if (target == 'web') {
                const filepath = FileUtil.joinPath(pluginContext.projectRoot, 'template/web/index.html')
                const htmlContent = fs.readFileSync(filepath);
                pluginContext.createFile("index.html", htmlContent);
            }
        }
        catch (e) {
            console.log(e)
        }

    }
}


function tinyCompiler() {

    const os = require('os');
    const outfile = FileUtil.joinPath(os.tmpdir(), 'main.min.js');
    const options = egret.args;
    options.minify = true;
    options.publish = true;
    const compiler = new Compiler.Compiler();
    const configParsedResult = compiler.parseTsconfig(options.projectDir, options.publish);
    const compilerOptions = configParsedResult.options;
    const fileNames = configParsedResult.fileNames;
    const tsconfigError = configParsedResult.errors.map(d => d.messageText.toString());
    compilerOptions.outFile = outfile;
    compilerOptions.allowUnreachableCode = true;
    compilerOptions.emitReflection = true;
    this.compilerHost = compiler.compile(compilerOptions, fileNames);
    let jscode = utils.minify(outfile);
    return jscode;
}