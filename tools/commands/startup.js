var solution = require("../solution");
var project = require("../solution/TypeScritpProject");
var file = require("../lib/FileUtil");
var path = require("path");
module.exports = (function () {
    function StartUp() {
    }
    StartUp.prototype.execute = function () {
        var root = egret.args.projectDir;
        if (file.exists(path.join(root, "egret.solution"))) {
            console.log('solution startup');
            solution.run();
        }
        else {
            console.log('project startup');
            project.run();
        }
        return DontExitCode;
    };
    return StartUp;
}());
