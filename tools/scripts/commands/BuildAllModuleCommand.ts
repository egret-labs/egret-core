/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");
import BuildModuleCMD = require("./BuildModuleCommand");

/**
 * 执行一次tsc
 */
class BuildAllModuleCommand implements egret.Command {
    private callback:(exitCode:number)=>void;

    execute(callback?:(exitCode:number)=>void):number {
        this.callback = callback;

        this.buildModules();

        return 0;
    }

    private endBuild() {
        if (this.callback) {
            this.callback(0);
        }
        else {
            process.exit(0);
        }
    }


    //[["core,res"], ["third"]]//
    private getFirstList() {
        var moduleList;
        var exModules = params.getOption("--module");
        if (exModules && exModules.length > 0) {
            moduleList = exModules;
        }
        else {
            moduleList = config.getAllModuleNames();
        }

        if (moduleList.indexOf("core") >= 0) {
            if (moduleList.indexOf("html5") < 0) {
                moduleList.push("html5");
            }
            if (moduleList.indexOf("native") < 0) {
                moduleList.push("native");
            }
        }

        this.totalCount = moduleList.length;

        var coreArr = [];
        var thirdArr = [];
        //取出 引擎库
        moduleList.forEach((item) => {
            if (config.getModulePath(item) == null) {
                coreArr.push(item);
                return;
            }

            var dependence = config.getModuleDependenceList(item);
            if (dependence.length == 0) {
                thirdArr.push([item]);
            }
            else {
                this.otherArr.push({"name": item, "dependence": dependence});
            }
        });
        return [coreArr].concat(thirdArr);
    }

    private totalCount = 0;
    private otherArr = [];

    private getNextModules() {
        var tempArr = [];
        for (var i = this.otherArr.length - 1; i >= 0; i--) {
            var info = this.otherArr[i];
            var dep = info["dependence"];
            for (var j = dep.length - 1; j >= 0; j--) {
                if (this.usedArr.indexOf(dep[j]) >= 0) {
                    dep.splice(j, 1);
                }
            }

            if (dep.length == 0) {
                tempArr.push([info["name"]]);
                this.otherArr.splice(i, 1);
            }
        }

        return tempArr;
    }

    private usedArr = [];

    private buildModules() {
        if (this.usedArr.length != 0 && this.usedArr.length == this.totalCount) {
            this.endBuild();
            return;
        }
        if (this.usedArr.length != 0 && this.otherArr.length <= 0) {
            return;
        }
        if (this.usedArr.length == 0) {
            var modules = this.getFirstList();
        }
        else {
            modules = this.getNextModules();
        }
        console.log(modules);

        for (var i = 0; i < modules.length; i++) {
            var buildCmd = new BuildModuleCMD();
            buildCmd.moduleNames = modules[i];
            buildCmd.execute((exitCode)=> {
                this.usedArr = this.usedArr.concat(buildCmd.moduleNames);
                this.buildModules();
            });
        }
    }

}

export = BuildAllModuleCommand;