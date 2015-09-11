/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var Help = (function () {
    function Help() {
    }
    Help.prototype.execute = function () {
        utils.open("http://edn.egret.com/cn/index.php/article/index/id/301");
        return DontExitCode;
    };
    return Help;
})();
module.exports = Help;
