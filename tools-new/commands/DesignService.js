/// <reference path="../lib/types.d.ts" />
var Entry = require('../Entry');
var server = require('../server/server');
var DesignService = (function () {
    function DesignService() {
    }
    DesignService.prototype.execute = function () {
        server.startServer(egret.args);
        return Entry.DontExitCode;
    };
    return DesignService;
})();
module.exports = DesignService;
