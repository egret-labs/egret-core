
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import CompileProject = require('../actions/CompileProject');
import * as EgretProject from '../project';
import * as exml from '../actions/exml';
console.log(utils.tr(1106, 0));
class Clean implements egret.Command {

    @utils.measure
    async execute() {
        utils.checkEgret();

        var options = egret.args;
        service.client.closeServer(options.projectDir);
        utils.clean(options.debugDir);

        //刷新libs 中 modules 文件
        EgretProject.manager.copyToLibs();
        //编译 bin-debug 文件
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        if (!result) {
            return 1;
        }
        let manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
        let indexPath = FileUtil.joinPath(egret.args.projectDir, "index.html");
        EgretProject.manager.generateManifest(result.files, { debug: true, platform: 'web' }, manifestPath);
        if (!EgretProject.projectData.useTemplate) {
            EgretProject.manager.modifyIndex(manifestPath, indexPath);
        }

        //拷贝项目到native工程中
        // if (egret.args.target == "native") {
        //     console.log("----native build-----");
        //     EgretProject.manager.modifyNativeRequire(manifestPath);
        //     copyNative.refreshNative(true);
        // }
        if (EgretProject.projectData.isWasmProject()) {
            let arr = [
                "egret.asm.js",
                "egret.asm.js.mem",
                "egret.webassembly.js",
                "egret.webassembly.wasm"
            ];
            let moduleName = "egret";
            if (EgretProject.projectData.hasModule("dragonBones")) {
                moduleName = "egretWithDragonBones";
            }
            arr.forEach(function (item) {
                FileUtil.copy(FileUtil.joinPath(egret.root, "build", "wasm_libs", moduleName, item),
                    FileUtil.joinPath(options.projectDir, "libs", item));
            });
        }
        //Wait for 'shutdown' command, node will exit when there are no tasks.
        return DontExitCode;
    }
}

export = Clean;
