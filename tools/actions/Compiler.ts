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
    compileWithChanges: (filesChanged: egret.FileChanges, sourceMap?: boolean) => EgretCompilerHost;
    messages?: string[];
}

let compilerHost: ts.CompilerHost;
let hostGetSourceFile;
let hostFileExists;
let cachedProgram: ts.Program;
let cachedExistingFiles: utils.Map<boolean>;
let changedFileNames: Array<string> = [];

let getSourceFile = function (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) {
    if (cachedProgram && changedFileNames.indexOf(fileName) == -1) {
        const sourceFile = cachedProgram.getSourceFile(fileName);
        if (sourceFile) {
            return sourceFile;
        }
    }
    const sourceFile = hostGetSourceFile(fileName, languageVersion, onError);
    return sourceFile;
}

let cachedFileExists = function (fileName: string): boolean {
    return fileName in cachedExistingFiles
        ? cachedExistingFiles[fileName]
        : cachedExistingFiles[fileName] = hostFileExists(fileName);
}

export class Compiler {

    private sortedFiles: string[];
    private program: ts.Program;
    private options: ts.CompilerOptions;

    public compile(options: ts.CompilerOptions, rootFileNames: string[]): EgretCompilerHost {
        this.fileNames = rootFileNames;
        this.options = options;
        cachedProgram = null;
        compilerHost = ts.createCompilerHost(options);
        hostGetSourceFile = compilerHost.getSourceFile;
        compilerHost.getSourceFile = getSourceFile;

        hostFileExists = compilerHost.fileExists;
        compilerHost.fileExists = cachedFileExists;

        return this.doCompile();
    }

    private sortFiles(): void {
        let program = this.program;
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

    private errors: string[] = [];

    private logErrors(diagnostics) {
        let allDiagnostics = ts.getPreEmitDiagnostics(this.program).concat(diagnostics);

        allDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            let msg;
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                msg = `  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
            }
            else {
                msg = `  Error: ${message}`;
            }
            console.log(msg);
            if(this.errors.length < 100) {
                this.errors.push(msg);
            }
        });
    }

    private fileNames: Array<string>;

    private compileWithChanges(filesChanged: egret.FileChanges, sourceMap?: boolean): EgretCompilerHost {
        this.errors = [];
        changedFileNames = [];
        let hasAddOrRemoved = false;
        filesChanged.forEach(file => {
            if (file.type == "added") {
                hasAddOrRemoved = true;
                this.fileNames.push(file.fileName);
            }
            else if (file.type == "removed") {
                hasAddOrRemoved = true;
                var index = this.fileNames.indexOf(file.fileName);
                if (index >= 0) {
                    this.fileNames.splice(index, 1);
                }
            }
            else {
                changedFileNames.push(file.fileName);
            }
        });
        if (hasAddOrRemoved) {
            cachedProgram = undefined;
        }
        return this.doCompile();
    }

    private doCompile(): EgretCompilerHost {
        cachedExistingFiles = utils.createMap<boolean>();
        this.program = ts.createProgram(this.fileNames, this.options, compilerHost);
        this.sortFiles();
        let emitResult = this.program.emit();
        this.logErrors(emitResult.diagnostics);
        cachedProgram = this.program;
        return { files: this.sortedFiles, program: this.program, exitStatus: 0, messages: this.errors, compileWithChanges: this.compileWithChanges.bind(this) };
    }

    parseTsconfig(projectRoot: string, isPublish: boolean) {
        let url = projectRoot + "tsconfig.json";
        var configObj: any;
        try {
            configObj = JSON.parse(file.read(url));

        } catch (e) {
            console.log(utils.tr(1117))//不是有效的 json 文件
            // errLog.push();
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

        let notSupport = ["module", "noLib", "rootDir", "out"];
        let defaultSupport = { outDir: "bin-debug" };
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
                    error = utils.tr(1123, error, defaultSupport[optionName]);
                    console.log(error);
                }
                compilerOptions[optionName] = defaultSupport[optionName];
            }
        }

        var configParseResult = ts.parseJsonConfigFileContent(configObj, ts.sys, path.dirname(url));
        compilerOptions = configParseResult.options;
        compilerOptions.defines = getCompilerDefines(isPublish);

        return configParseResult
    }
}

function getCompilerDefines(isPublish: boolean) {
    let defines: any = {};
    if (isPublish) {
        defines.DEBUG = false;
        defines.RELEASE = true;
    }
    else {
        defines.DEBUG = true;
        defines.RELEASE = false;
    }
    return defines;

}