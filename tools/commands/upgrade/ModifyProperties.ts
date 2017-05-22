/// <reference path="../../lib/types.d.ts" />

import file = require('../../lib/FileUtil');

class ModifyProperties {
    private projectConfig: egret.EgretProperty
    constructor() {
    }

    initProperties() {
        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        this.projectConfig = JSON.parse(file.read(projectPath));
    }

    save(version?: string) {
        if (version) {
            this.projectConfig.egret_version = version;
        }

        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    }

    upgradeModulePath() {
        let config = this.projectConfig
        for (let m of config.modules) {
            if (!m.path) {
                m.path = '${EGRET_APP_DATA}/' + config.egret_version;
            }
        }
    }
}
export = new ModifyProperties();