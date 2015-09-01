/// <reference path="../../lib/types.d.ts" />

import globals = require("../../Globals");
import params = require("../../ParamsParser");

class UpgradeCommand_2_4_2 implements egret.Command {

    execute():number {
        this.upgradeTo_2_4_2();
        return 0;
    }

    private upgradeTo_2_4_2() {

        var open = globals.getOpen();
        open("https://github.com/egret-labs/egret-core/tree/v2.4.2/docs/cn/2.4.2_ReleaseNotes.md");

        globals.exit(1702);
    }
}

export = UpgradeCommand_2_4_2;