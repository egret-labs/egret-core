
/// <reference path="../lib/types.d.ts" />
/// <reference path="../lib/typescript/tsclark.d.ts" />
import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import tsclark = require("../lib/typescript/tsclark");
import ts = require("../lib/typescript-plus/typescript");

interface CompileOption {
    args: egret.ToolArgs;
    files?: string[];
    out?: string;
    outDir?: string;
    def?: boolean;
    forSortFile?: boolean;
}

class Compiler {
    public compile(option: CompileOption): tsclark.LarkCompileResult {
        //console.log('---Compiler.compile---')
        var args = option.args, def = option.def, files = option.files,
            out = option.out, outDir = option.outDir;
        var defTemp = args.declaration;
        args.declaration = def;
        var realCWD = process.cwd();
        var cwd = file.escapePath(args.projectDir);
        files = files.map(f => f.replace(cwd, ""));
        if (out)
            out = file.getRelativePath(cwd, out);
        if (outDir)
            outDir = file.getRelativePath(cwd, outDir);
        process.chdir(cwd);

        var parsedCmd: ts.ParsedCommandLine = {
            fileNames: files,
            options: {},
            errors: []
        };
        if (args.compilerOptions) {
            parsedCmd.options = <any>args.compilerOptions;
        }
        if (out) {
            //make 使用引擎的配置,必须用下面的参数
            parsedCmd.options.target = 1;
            // parsedCmd.options.stripInternal = true;
            parsedCmd.options.sourceMap = args.sourceMap;
            parsedCmd.options.removeComments = args.removeComments;
            parsedCmd.options.declaration = args.declaration;
            parsedCmd.options.out = out;
        }
        else {
            //console.log("args.compilerOptions:",parsedCmd.options.outDir)
            parsedCmd.options.outDir = outDir;
        }
        if (args.sourceMap == true) {
            parsedCmd.options.sourceMap = true;//引擎命令行的sourcemap属性优先
        }
        parsedCmd.options.allowUnreachableCode = true;
        parsedCmd.options.emitReflection = true;
        parsedCmd.options["forSortFile"] = option.forSortFile;
        if(args.experimental) {
            console.log("use typescript 2.0.3");
            return this.compileNew(parsedCmd);
        }
        else {
            // var compileResult = tsclark.Compiler.executeWithOption(args, files, out, outDir);
            var compileResult = tsclark.Compiler.executeWithOption(<any>parsedCmd);

            args.declaration = defTemp;
            if (compileResult.messages) {
                compileResult.messages.forEach(m=> console.log(m));
            }

            process.chdir(realCWD);
            return compileResult;
        }
    }

    private files: ts.Map<{ version: number }> = <any>{};
    private sortedFiles;

    private compileNew(parsedCmd): tsclark.LarkCompileResult {
        this.errors = [];
        this.parsedCmd = parsedCmd;
        let options = parsedCmd.options;
        let rootFileNames = parsedCmd.fileNames;
        this.sortedFiles = rootFileNames;
        // initialize the list of files
        rootFileNames.forEach(fileName => {
            this.files[fileName] = { version: 0 };
        });

        // Create the language service host to allow the LS to communicate with the host
        const servicesHost: ts.LanguageServiceHost = {
            getScriptFileNames: () => this.sortedFiles,
            getScriptVersion: (fileName) => this.files[fileName] && this.files[fileName].version.toString(),
            getScriptSnapshot: (fileName) => {
                if (!file.exists(fileName)) {
                    return undefined;
                }

                return ts.ScriptSnapshot.fromString(file.read(fileName, true).toString());
            },
            getCurrentDirectory: () => process.cwd(),
            getCompilationSettings: () => this.parsedCmd.options,
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        };

        // Create the language service files
        this.services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
        this.sortFiles();
        if(!options.forSortFile) {
            let output = this.services.getEmitOutput(undefined);
            this.logErrors(undefined);
            output.outputFiles.forEach(o => {
                file.save(o.name, o.text);
            });
        }

         return { files: this.sortedFiles, program: <any>this.services.getProgram(), exitStatus: 0, messages:this.errors, compileWithChanges:this.compileWithChanges.bind(this)};
    }

    private sortFiles():void {
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
    private errors:string[];

    private emitFile(fileName: string) {
        let output = this.services.getEmitOutput(fileName);
        this.logErrors(fileName);
        output.outputFiles.forEach(o => {
            file.save(o.name, o.text);
        });
    }

    private logErrors(fileName?: string) {
        let allDiagnostics = this.services.getCompilerOptionsDiagnostics();
        if(fileName) {
            allDiagnostics.concat(this.services.getSyntacticDiagnostics(fileName))
            .concat(this.services.getSemanticDiagnostics(fileName));
        }
            
        allDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            var msg;
            if (diagnostic.file) {
                let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                msg = `  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
            }
            else {
                msg = `  Error: ${message}`;
            }
            console.log(msg);
            this.errors.push(msg);
        });
    }

    private parsedCmd: ts.ParsedCommandLine;

    private compileWithChanges(filesChanged: egret.FileChanges, sourceMap?: boolean): tsclark.LarkCompileResult {
        this.errors = [];
        filesChanged.forEach((file: any) => {
            if (file.type == "added") {
                this.parsedCmd.fileNames.push(file.fileName);
                this.files[file.fileName] = { version: 0 };
            }
            else if (file.type == "removed") {
                var index = this.parsedCmd.fileNames.indexOf(file.fileName);
                if (index >= 0)
                    this.parsedCmd.fileNames.splice(index, 1);
            }
            else {
                this.files[file.fileName].version++;
            }
        });

        this.sortFiles();

        filesChanged.forEach((file: any) => {
             this.emitFile(file.fileName);
        });

        return { files: this.sortedFiles, program: <any>this.services.getProgram(), exitStatus: 0, messages:this.errors, compileWithChanges:this.compileWithChanges.bind(this)};
    }
}

tsclark.Compiler.exit = exitCode => {
    if (exitCode != 0)
        console.log(utils.tr(10003, exitCode));
    return exitCode;
};

export = Compiler;
