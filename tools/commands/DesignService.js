/// <reference path="../lib/types.d.ts" />
var server = require('../server/server');
var DesignService = (function () {
    function DesignService() {
    }
    DesignService.prototype.execute = function () {
        server.startServer(egret.args);
        return DontExitCode;
    };
    return DesignService;
})();
module.exports = DesignService;

//# sourceMappingURL=../commands/DesignService.js.map