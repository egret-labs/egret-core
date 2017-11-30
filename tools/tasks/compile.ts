import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';


export class CompilePlugin {


    async onFile(file) {
        return file;
    }
    async onFinish(pluginContext) {
        const target = egret.args.target;
        const scripts = EgretProject.manager.copyLibsForPublish(target, 'release');
        scripts.forEach((script) => {
            pluginContext.createFile(script, fs.readFileSync(FileUtil.joinPath(pluginContext.projectRoot, script)));
        })
        const jscode = tinyCompiler();
        pluginContext.createFile("main.js", new Buffer(jscode));
        if (target == 'web') {
            const filepath = FileUtil.joinPath(pluginContext.projectRoot, 'template/web/index.html')
            const htmlContent = fs.readFileSync(filepath);
            pluginContext.createFile("index.html", htmlContent);
        }
    }
}

export class UglifyPlugin {

    private codes: { [source: string]: string } = {};

    private matchers: { sources: string[], target: string }[] = [];

    constructor() {
        // outputFile: string
    }

    match(sources: string[], target: string) {
        for (let source of sources) {
            this.codes[source] = ";";
        }
        this.matchers.push({ sources, target })
    }

    async onFile(file) {

        const filename = file.original_relative;
        if (this.codes[filename]) {
            this.codes[filename] = file.contents.toString();
            return null;
        }
        else {
            return file;
        }
    }
    async  onFinish(pluginContext) {
        for (let matcher of this.matchers) {
            const jscode = utils.uglify(matcher.sources.map(s => {
                const code = this.codes[s];
                if (code == ';') {
                    throw `missing source file ${s}`
                }
                return code;
            }));
            pluginContext.createFile(matcher.target, new Buffer(jscode));
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
    const jscode = fs.readFileSync(outfile);
    return jscode;
}