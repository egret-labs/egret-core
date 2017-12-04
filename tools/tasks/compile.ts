import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as watch from '../lib/watch';
import { FileChanges } from '../lib/DirectoryState';

const compiler = new Compiler.Compiler();

export class CompilePlugin {

    async onFile(file) {
        return file;
    }
    async onFinish(pluginContext) {
        const target = egret.args.target;
        const projectRoot = pluginContext.projectRoot;
        const scripts = EgretProject.manager.copyLibsForPublish(target, 'release');

        scripts.forEach((script) => {
            pluginContext.createFile(script, fs.readFileSync(FileUtil.joinPath(pluginContext.projectRoot, script)));
        })
        const jscode = tinyCompiler();
        pluginContext.createFile("main.js", new Buffer(jscode));

        if (target == 'web') {
            const filepath = FileUtil.joinPath(projectRoot, 'template/web/index.html')
            const htmlContent = fs.readFileSync(filepath);
            pluginContext.createFile("index.html", htmlContent);




        }

        const srcPath = FileUtil.joinPath(projectRoot, 'src');

        // watch.createMonitor(srcPath, { persistent: true, interval: 2007, filter: (f, stat) => !f.match(/\.g(\.d)?\.ts/) }, m => {
        //     m.on("created", (fileName) =>
        //         this.onFileChanged([{ fileName, type: "added" }])
        //     )
        //         .on("removed", (fileName) =>
        //             this.onFileChanged([{ fileName, type: "removed" }])
        //         )
        //         .on("changed", (fileName) =>
        //             this.onFileChanged([{ fileName, type: "modified" }])
        //         );
        // });


    }

    private onFileChanged(fileChanged: egret.FileChanges) {

        compiler.compileWithChanges(fileChanged)
    }





}

export class UglifyPlugin {

    private codes: { [source: string]: string } = {};
    private matchers: { sources: string[], target: string }[]

    constructor(param) {
        this.matchers = param;
    }

    async onFile(file) {

        const filename = file.original_relative;
        if (file.extname != ".js") {
            return file;
        }
        for (let matcher of this.matchers) {
            if (matcher.sources.indexOf(filename) >= 0) {
                this.codes[filename] = file.contents.toString();
                return null;
            }
        }
        return file;
    }
    async onFinish(pluginContext) {
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