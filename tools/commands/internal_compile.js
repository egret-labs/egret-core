/// <reference path="../lib/types.d.ts" />
var CompileProject = require("../actions/CompileProject");
var path = require("path");
var InternalCompile = (function () {
    function InternalCompile() {
    }
    InternalCompile.prototype.execute = function () {
        var options = egret.args;
        options.releaseDir = path.resolve(egret.args.projectDir, options.fileName);
        options.minify = true;
        options.publish = true;
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        return 0;
    };
    return InternalCompile;
}());
module.exports = InternalCompile;
