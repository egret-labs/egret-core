/// <reference path="../lib/types.d.ts" />
var info = (function () {
    function info() {
    }
    info.prototype.execute = function () {
        globals.log(1801, egret.version);
        globals.log(1802, egret.root);
        return 0;
    };
    return info;
}());
module.exports = info;
