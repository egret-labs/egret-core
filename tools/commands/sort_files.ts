/// <reference path="../lib/types.d.ts" />

import FileUtil = require('../lib/FileUtil');
import Compiler = require('../actions/Compiler');

class SortFiles implements egret.Command {
    execute(callback?: (exitCode: number) => void): number {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var files = FileUtil.search(FileUtil.joinPath(options.projectDir, "src"), "ts");
        var compiler = new Compiler();
        var compileFiles = libFiles.concat(files);
        options['compilerOptions'] = {target: 1, experimentalDecorators: true};
        var result = compiler.compile({
            args: options,
            def: false,
            out: null,
            files: compileFiles,
            forSortFile: true,
            outDir: FileUtil.joinPath(options.projectDir, "tmp")
        });
        var sss = result.files;
        var tsconfigPath = FileUtil.joinPath(options.projectDir, "tsconfig.json");
        var tsconfig = FileUtil.read(tsconfigPath);
        if(!tsconfig || tsconfig == "") {
            tsconfig = "{}";
        }
        var configJson = JSON.parse(tsconfig);
        if(!configJson.compilerOptions) {
            configJson.compilerOptions = {};
        }
        if(!configJson.compilerOptions.outDir) {
            configJson.compilerOptions.outDir = "bin-debug";
        }
        var finalFiles = [];
        result.files.forEach(f=> {
            if (!f)
                return;
            if (/lib\.d\.ts$/.test(f))
                return;
            finalFiles.push(f);
        });
        configJson.files = finalFiles;
        FileUtil.save(tsconfigPath, JSON.stringify(configJson, null, "\t"));
        return 0;
    }
}
export = SortFiles;
