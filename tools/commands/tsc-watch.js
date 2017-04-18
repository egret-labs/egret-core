var project = require("../solution/TypeScriptProject");
module.exports = (function () {
    function TSC_Watch() {
    }
    TSC_Watch.prototype.execute = function () {
        var root = egret.args.projectDir;
        console.log('project startup');
        project.run(root);
        return DontExitCode;
    };
    return TSC_Watch;
}());
