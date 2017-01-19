
/// <reference path="../lib/types.d.ts" />
import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import ts = require("../lib/typescript-plus/lib/typescript");
import * as path from 'path';

interface CompileOption {
    args: egret.ToolArgs;
    files?: string[];
    out?: string;
    outDir?: string;
    def?: boolean;
    forSortFile?: boolean;
    debug?: boolean;
}

export interface EgretCompilerHost {
    program: ts.Program;
    files?: string[];
    exitStatus: number;
    compileWithChanges?: (filesChanged: egret.FileChanges, sourceMap?: boolean) => EgretCompilerHost;
    messages?: string[];
}

export class Compiler {

    private files: ts.Map<{ version: number }> = <any>{};
    private sortedFiles;

    public compile(options: ts.CompilerOptions, rootFileNames: string[]): EgretCompilerHost {
        this.errors = [];
        this.fileNames = rootFileNames;
        this.sortedFiles = rootFileNames;

        // initialize the list of files
        rootFileNames.forEach(fileName => {
            this.files[fileName] = { version: 0 };
        });

        if (options.locale) {
            ts.validateLocaleAndSetLanguage(options.locale, ts.sys);
        }

        // Create the language service host to allow the LS to communicate with the host
        const servicesHost: ts.LanguageServiceHost = {
            getScriptFileNames: () => this.sortedFiles,
            getNewLine: () => {
                var carriageReturnLineFeed = "\r\n";
                var lineFeed = "\n";
                if (options.newLine === 0 /* CarriageReturnLineFeed */) {
                    return carriageReturnLineFeed;
                }
                else if (options.newLine === 1 /* LineFeed */) {
                    return lineFeed;
                }
                else if (ts.sys) {
                    return ts.sys.newLine;
                }
                return carriageReturnLineFeed;
            },
            getScriptVersion: (fileName) => this.files[fileName] && this.files[fileName].version.toString(),
            getScriptSnapshot: (fileName) => {
                if (!file.exists(fileName)) {
                    return undefined;
                }

                return ts.ScriptSnapshot.fromString(file.read(fileName, true).toString());
            },
            getCurrentDirectory: () => process.cwd(),
            getCompilationSettings: () => options,
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        };

        // Create the language service files
        this.services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
        this.sortFiles();
        let output = this.services.getEmitOutput(undefined);
        this.logErrors(undefined);
        output.outputFiles.forEach(o => {
            file.save(o.name, o.text);
        });

        return { files: this.sortedFiles, program: this.services.getProgram(), exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    }

    private sortFiles(): void {
        let program = this.services.getProgram();
        let sortResult = ts.reorderSourceFiles(program);
        if (sortResult.circularReferences.length > 0) {
            let error: string = "";
            error += "error: circular references '" + "' :" + ts.sys.newLine;
            error += "    at " + sortResult.circularReferences.join(ts.sys.newLine + "    at ") + ts.sys.newLine + "    at ...";
            console.log(error);
            this.errors.push(error);
        }
        this.sortedFiles = sortResult.sortedFileNames;
    }

    private services: ts.LanguageService;
    private errors: string[];

    private emitFile(fileName: string) {
        let output = this.services.getEmitOutput(fileName);
        this.logErrors(fileName);
        output.outputFiles.forEach(o => {
            file.save(o.name, o.text);
        });
    }

    private logErrors(fileName?: string) {
        let allDiagnostics = this.services.getCompilerOptionsDiagnostics()
            .concat(this.services.getSyntacticDiagnostics(fileName))
            .concat(this.services.getSemanticDiagnostics(fileName));

        allDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            let msg;
            if (diagnostic.file) {
                let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                msg = `${diagnostic.file.fileName}(${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`;
            }
            else {
                msg = `${message}`;
            }
            console.log(msg)
            this.errors.push(msg);
        });
    }

    private fileNames: Array<string>;

    private compileWithChanges(filesChanged: egret.FileChanges, sourceMap?: boolean): EgretCompilerHost {
        this.errors = [];
        filesChanged.forEach(file => {
            if (file.type == "added") {
                this.fileNames.push(file.fileName);
                this.files[file.fileName] = { version: 0 };
            }
            else if (file.type == "removed") {
                var index = this.fileNames.indexOf(file.fileName);
                if (index >= 0) {
                    this.fileNames.splice(index, 1);
                }
            }
            else {
                this.files[file.fileName].version++;
            }
        });

        this.sortFiles();

        filesChanged.forEach(file => {
            this.emitFile(file.fileName);
        });

        return { files: this.sortedFiles, program: this.services.getProgram(), exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    }

    parseTsconfig() {
        let url = egret.args.projectDir + "tsconfig.json";
        let options = egret.args;
        var configObj: any;
        try {
            configObj = JSON.parse(file.read(url));
        } catch (e) {
            // errLog.push(utils.tr(1117));//不是有效的 json 文件
            configObj = {
                "compilerOptions": {
                    "target": "es5",
                    "experimentalDecorators": true,
                    "lib": [
                        "es5", "dom", "es2015.promise"
                    ]
                },
                "exclude": [
                    "node_modules"
                ]
            }
        }

        let notSupport = ["module", "noLib", "outFile", "rootDir", "out"];
        let defaultSupport = { target: "es5", outDir: "bin-debug" }
        let compilerOptions = configObj.compilerOptions;
        for (let optionName of notSupport) {
            if (compilerOptions.hasOwnProperty(optionName)) {
                var error = utils.tr(1116, optionName);//这个编译选项目前不支持修改
                console.log(error);//build -e 的时候输出
                delete compilerOptions[optionName];
            }
        }
        for (let optionName in defaultSupport) {
            if (compilerOptions[optionName] != defaultSupport[optionName]) {
                if (compilerOptions[optionName]) {
                    var error = utils.tr(1116, optionName);
                    console.log(`${error} 将被调整为'${defaultSupport[optionName]}'`)
                }
                compilerOptions[optionName] = defaultSupport[optionName];
            }
        }

        var configParseResult = ts.parseJsonConfigFileContent(configObj, ts.sys, path.dirname(url));
        compilerOptions = configParseResult.options;
        compilerOptions.defines = getCompilerDefines(options);

        return configParseResult
    }
}






function getCompilerDefines(args: egret.ToolArgs, debug?: boolean) {
    let defines: any = {};
    if (debug != undefined) {
        defines.DEBUG = debug;
        defines.RELEASE = !debug;
    }
    else if (args.publish) {
        defines.DEBUG = false;
        defines.RELEASE = true;
    }
    else {
        defines.DEBUG = true;
        defines.RELEASE = false;
    }
    return defines;

}