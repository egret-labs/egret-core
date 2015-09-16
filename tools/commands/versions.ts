/// <reference path="../lib/types.d.ts" />

import version = require("../parser/Version");

class versions implements egret.Command {
    execute(): number {
        var versions = version.getEngineVersions();
        versions.forEach(engine=> {
            console.log(`Egret Engine ${engine.version}  ` + engine.root);
        });
        return 0;
    }
}

export = versions;