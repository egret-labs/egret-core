
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import exml = require('../actions/EXMLAction');


class EXML implements egret.Command {

    execute(): number {
        exml.updateSetting(false);
        return 0;
    }
}

export = EXML;