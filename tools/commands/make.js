/// <reference path="../lib/types.d.ts" />
var CompileLark = require("../actions/CompileLark");
var MakeCommand = (function () {
    function MakeCommand() {
    }
    MakeCommand.prototype.execute = function () {
        var options = egret.args;
        var compiler = new CompileLark();
        return compiler.make();
    };
    return MakeCommand;
})();
module.exports = MakeCommand;

//# sourceMappingURL=../commands/make.js.map