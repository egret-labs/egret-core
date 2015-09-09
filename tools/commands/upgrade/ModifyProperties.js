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
    return ModifyProperties;
})();
var egretProjectConfig = egretProjectConfig || new ModifyProperties();
module.exports = egretProjectConfig;

//# sourceMappingURL=../../commands/upgrade/ModifyProperties.js.map