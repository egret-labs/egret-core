/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var Help = (function () {
    function Help() {
    }
    Help.prototype.execute = function () {
        utils.open("https://github.com/egret-labs/Lark/blob/master/docs/cmd-tools.md");
        return DontExitCode;
    };
    return Help;
})();
module.exports = Help;

//# sourceMappingURL=../commands/help.js.map