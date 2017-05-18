/// <reference path="../../lib/types.d.ts" />
var file = require("../../lib/FileUtil");
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
        this.projectConfig = JSON.parse(file.read(projectPath));
    };
    ModifyProperties.prototype.save = function (version) {
        if (version) {
            this.projectConfig.egret_version = version;
        }
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    };
    ModifyProperties.prototype.upgradeModulePath = function () {
        var config = this.projectConfig;
        for (var _i = 0, _a = config.modules; _i < _a.length; _i++) {
            var m = _a[_i];
            if (!m.path) {
                m.path = '${EGRET_APP_DATA}/' + config.egret_version;
            }
        }
    };
    return ModifyProperties;
}());
module.exports = new ModifyProperties();
