/// <reference path="../../lib/types.d.ts" />
var file = require("../../lib/FileUtil");
var ModifyProperties = (function () {
    function ModifyProperties() {
    }
    ModifyProperties.prototype.initProperties = function () {
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        this.projectConfig = JSON.parse(file.read(projectPath));
    };
    ModifyProperties.prototype.save = function (version) {
        if (version) {
            this.projectConfig.engineVersion = version;
            this.projectConfig.compilerVersion = version;
        }
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    };
    return ModifyProperties;
}());
module.exports = new ModifyProperties();
