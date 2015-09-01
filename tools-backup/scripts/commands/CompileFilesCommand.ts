/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import globals = require("../Globals");

class CompileFilesCommand implements egret.Command {
    private fileList;
    private outputFile;
    private method;

    /**
     var options = {
                    "--output": file.joinPath(releaseOutputPath, "launcher", "game-min.js"),
                    "--filelist": file_list,
                    "--method": "uglify";
                };
     */
    initOptions(options:Object):void {
        this.outputFile = <string>(params.getObjectOption(options, '--output'));
        this.fileList = (params.getObjectOption(options, '--filelist'));
        this.method = <string>(params.getObjectOption(options, '--method', ["closure", "uglify"]));
        var dic = file.getDirectory(this.outputFile);
        if (!file.exists(dic)) {
            file.createDirectory(dic);
        }
    }

    execute(callback?:(exitCode:number)=>void):number {
        var tempTime = Date.now();
        globals.debugLog(1403);
        var adapt = globals.getCompiler(this.method);
        adapt.compilerSingleFile(this.fileList, this.outputFile, file.joinPath(this.outputFile, "..", "__game-min-native.js"),
            ()=> {
                globals.debugLog(1404, (Date.now() - tempTime) / 1000);
                if (callback)
                    callback(0);
                else
                    process.exit(0);
            });

        return 0;
    }


}

export = CompileFilesCommand;