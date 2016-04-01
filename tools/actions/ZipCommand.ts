/// <reference path="../lib/types.d.ts" />

/**
 * 打zip包
 */
import file = require('../lib/FileUtil');
import project = require('../actions/Project');
import FileUtil = require('../lib/FileUtil');

class ZipCommand implements egret.Command {
    private outputFile:string;
    private sourcePath:string;
    private password:string;

    private useList:Array<string>;
    private versionFile:string;
    constructor(versionFile:string) {
        this.versionFile = versionFile;
    }
    private init() {

        this.useList = [];

        //拷贝所需文件到 ziptemp目录
        var releasePath = egret.args.releaseDir;
        var ziptempPath = FileUtil.joinPath(releasePath, "ziptemp");

        FileUtil.createDirectory(ziptempPath);

        //runtime  打包所有js文件以及all.manifest
        this.outputFile = FileUtil.joinPath(releasePath, "game_code_" + this.versionFile + ".zip");
        this.sourcePath = ziptempPath;
        this.password = egret.args.password || "";
    }

    execute(callback?:(exitCode:number)=>void):number {
        //
        var tempTime = Date.now();
        globals.debugLog(1410);
        this.init();

        var compilerPath = FileUtil.joinPath(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.jar");
        compilerPath = globals.addQuotes(compilerPath);

        var cmd = globals.getGlobalJava() + ' -jar ' + compilerPath + ' zip ' + globals.addQuotes(this.outputFile) + ' ' + globals.addQuotes(this.sourcePath) + ' ' + this.password;
        var cp_exec1 = require('child_process').exec;
        var build = cp_exec1(cmd);
        build.stdout.on("data", function(data) {
            //console.log(data);
        });
        build.stderr.on("data", function(data) {
            //console.log(data);
        });


        var self = this;
        build.on("exit", (result)=> {
            if (result == 0) {
                //结束
                file.remove(this.sourcePath);

                var releasePath = egret.args.releaseDir;

                for (var tempKey in self.useList) {
                    FileUtil.remove(self.useList[tempKey]);
                }

                //globals.debugLog(1411, (Date.now() - tempTime) / 1000);
                if(callback) {
                    callback(result);

                }
                else
                    process.exit(result);

            } else {
                //todo zip异常
                //globals.warn(result);
                console.error("打zip包出现异常！");
            }
        });


        return 0;
    }
}

export = ZipCommand;