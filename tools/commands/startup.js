var solution = require("../solution");
module.exports = (function () {
    function StartUp() {
    }
    StartUp.prototype.execute = function () {
        solution.run();
        return DontExitCode;
    };
    return StartUp;
}());
