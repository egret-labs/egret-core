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
            this.projectConfig.engineVersion = version;
            this.projectConfig.compilerVersion = version;
        }

        var projectPath = file.joinPath(egret.args.projectDir, "egretProperties.json");
        var content = JSON.stringify(this.projectConfig, null, "\t");
        file.save(projectPath, content);
    }
}
export = new ModifyProperties();