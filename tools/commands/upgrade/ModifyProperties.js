/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
var ModifyProperties = (function () {
    function ModifyProperties() {
        this.initProperties();
    }
    ModifyProperties.prototype.getProperties = function () {
        return this.projectConfig;
    };
    //变更目录后必须调用此方法同步配置文件的变化
    ModifyProperties.prototype.changeProjectDir = function () {
        this.initProperties();
    };
    ModifyProperties.prototype.initProperties = function () {
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
            };
        }
        else {
            this.projectConfig = JSON.parse(content);
        }
        if (!this.projectConfig.native) {
            this.projectConfig.native = {};
        }
    };
    ModifyProperties.prototype.save = function (version) {
        if (version) {
            this.projectConfig.egret_version = version;
        }
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    };
    ModifyProperties.prototype.hasModule = function (moduleName) {
        var modules = this.projectConfig.modules;
        for (var i = 0; i < modules.length; i++) {
            if (modules[i].name == moduleName) {
                return true;
            }
        }
        return false;
    };
    return ModifyProperties;
})();
var egretProjectConfig = egretProjectConfig || new ModifyProperties();
module.exports = egretProjectConfig;

//# sourceMappingURL=../../commands/upgrade/ModifyProperties.js.map