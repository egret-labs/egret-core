/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require("../lib/ProjectConfig");


class CreateJSCommand implements egret.Command {

    execute():number {
        this.run();
        return 0;
    }

    private projectPath;

    private run() {
        var projectName = params.getCommandArgs()[0];
        if (!projectName) {
            globals.exit(1001);
        }
        this.projectPath = file.resolve(projectName);

        var async = globals.getAsync();
        async.series([
            (callback) => {
                this.copyTemplate(callback)
            },

            (callback) => {
                this.compileModule(callback, "core")
            },

            (callback) => {
                this.compileModule(callback, "gui");
            },

            (callback) => {
                this.compileModule(callback, "dragonbones");
            },
            (callback) => {
                this.clean(callback);
            },

            (callback) => {
                this.compress(callback, "egret");
            },
            (callback) => {
                this.compress(callback, "gui");
            },
            (callback) => {
                this.compress(callback, "dragonbones");
            }
        ])
    }


    private compress(callback, moduleName) {
        var closureCompiler = require("../../lib/core/closureCompiler");
        closureCompiler.compilerSingleFile([file.join(this.projectPath, moduleName + ".js")], file.join(this.projectPath, moduleName + ".min.js"), file.join(this.projectPath, "temp.js"), callback);

    }

    private copyFileDir(sourcePath, dir) {
        file.copy(file.join(params.getEgretRoot(), dir), sourcePath);
    }


    private copyTemplate(callback) {
        this.copyFileDir(this.projectPath, "tools/templates/javascript/empty");

        params.setArgv({
            name: "create_js",
            currDir: this.projectPath,
            args: [],
            opts: {}
        });
        config.init();

        callback();
    }

    private clean(callback) {
        file.remove(file.join(this.projectPath, "core.d.ts"));
        file.remove(file.join(this.projectPath, "gui.d.ts"));
        file.remove(file.join(this.projectPath, "dragonbones.d.ts"));
        file.copy(file.join(this.projectPath, "core.js"), file.join(this.projectPath, "egret.js"))
        file.remove(file.join(this.projectPath, "core.js"));
        callback();
    }

    private compileModule(callback, moduleName) {
        var moduleFileList = config.getModuleFileListWithAbsolutePath(moduleName);

        if (moduleName == "core") {
            var appendModuleFileList = config.getModuleFileListWithAbsolutePath("html5");
            moduleFileList = moduleFileList.concat(appendModuleFileList);

            var appendModuleFileList = config.getModuleFileListWithAbsolutePath("res");
            moduleFileList = moduleFileList.concat(appendModuleFileList);
        }

        var dependencyList = config.getModuleDependenceList(moduleName).map((item)=> {
            return file.join(this.projectPath, item + ".d.ts");
        });

        moduleFileList = moduleFileList.concat(dependencyList);

        var compiler = require("../../lib/tools/egret_compiler.js");
        var cmd = moduleFileList.join(" ") + " --out " + file.join(this.projectPath, moduleName + ".js") + " -t ES5"
        compiler.compile(()=> {

            var cmd = moduleFileList.join(" ") + " -d --out " + file.join(this.projectPath, moduleName + ".d.ts") + " -t ES5";
            compiler.compile(callback, cmd);
        }, cmd);
    }

}


export = CreateJSCommand;
