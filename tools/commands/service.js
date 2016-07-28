/// <reference path="../lib/types.d.ts" />
var service = require("../service/index");
var Service = (function () {
    function Service() {
    }
    Service.prototype.execute = function () {
        service.run();
        return DontExitCode;
    };
    return Service;
})();
module.exports = Service;

//# sourceMappingURL=../commands/service.js.map