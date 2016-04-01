/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');

class ModifyProperties {
    private projectConfig;
    constructor() {
        this.initProperties();
    }

    getProperties() {
        return this.projectConfig;
    }
    //变更目录后必须调用此方法同步配置文件的变化
    changeProjectDir(){
        this.initProperties();
    }

    private initProperties() {
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = file.read(projectPath);
        if (!content) {
            this.projectConfig = {
                "modules": [
                    {
                        "name": "core"
                    }
                ],
                "native": {
                    "path_ignore": []
                }
            }

        }
        else {
            this.projectConfig = JSON.parse(content);
        }
        if (!this.projectConfig.native) {
            this.projectConfig.native = {};
        }
    }

    save(version?:string) {
        if (version) {
            this.projectConfig.egret_version = version;
        }

        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    }

    hasModule(moduleName:string):boolean {
        var modules = this.projectConfig.modules;
        for(var i:number = 0 ; i < modules.length ; i++) {
            if(modules[i].name == moduleName) {
                return true;
            }
        }
        return false;
    }
}

var egretProjectConfig = egretProjectConfig || new ModifyProperties();
export = egretProjectConfig;