/// <reference path="../lib/types.d.ts" />
var CompileEgretEngine = require("../actions/CompileEgretEngine");
var MakeCommand = (function () {
    function MakeCommand() {
    }
    MakeCommand.prototype.execute = function () {
        var options = egret.args;
        var compiler = new CompileEgretEngine();
        return compiler.make();
    };
    return MakeCommand;
}());
module.exports = MakeCommand;
