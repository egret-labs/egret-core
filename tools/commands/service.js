var service = require("../service/index");
var Service = /** @class */ (function () {
    function Service() {
    }
    Service.prototype.execute = function () {
        service.server.run();
        return DontExitCode;
    };
    return Service;
}());
module.exports = Service;
