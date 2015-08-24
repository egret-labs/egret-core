/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var HelpCommand = (function () {
    function HelpCommand() {
    }
    HelpCommand.prototype.execute = function () {
        utils.open("https://github.com/egret-labs/Lark/blob/master/docs/cmd-tools.md");
        return 0;
    };
    return HelpCommand;
})();
module.exports = HelpCommand;
