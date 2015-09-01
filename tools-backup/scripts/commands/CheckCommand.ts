/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');

class CheckCommand implements egret.Command {
    execute():number {
        var config = require('../lib/ProjectConfig');
        var version = config.getVersion();
        if (!version) {
            globals.exit(1701);
        }

        var egret_version = this.getEgretVersion();

        var result = this.compressVersion(version, egret_version);
        if (result < 0) {
            globals.exit(1701);
        }

        return result < 0 ? 1 : 0;
    }

    getEgretVersion() {
        var egretRoot = params.getEgretRoot();
        var txt = file.read(file.joinPath(egretRoot, "package.json"));
        var packageJsonConfig = JSON.parse(txt);
        return packageJsonConfig["version"]
    }

    compressVersion(v1, v2) {
        var version1Arr = v1.split(".");
        var version1_1 = version1Arr[0];
        var version1_2 = version1Arr[1];
        var version1_3 = version1Arr[2];

        var version1Arr = v2.split(".");
        var version2_1 = version1Arr[0];
        var version2_2 = version1Arr[1];
        var version2_3 = version1Arr[2];
        if (version1_1 > version2_1) {
            return 1
        }
        else if (version1_1 < version2_1) {
            return -1;
        }
        else if (version1_2 > version2_2) {
            return 1;
        }
        else if (version1_2 < version2_2) {
            return -1;
        }
        else if (version1_3 > version2_3) {
            return 1;
        }
        else if (version1_3 < version2_3) {
            return -1;
        }
        else {
            return 0;
        }
    }
}

export = CheckCommand;