/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var globals = require("../Globals");
var InfoCommand = (function () {
    function InfoCommand() {
    }
    InfoCommand.prototype.execute = function () {
        var config;
        var txt = file.read(params.getEgretRoot() + "/package.json");
        config = JSON.parse(txt);
        globals.log2(1801, config.version);
        globals.log2(1802, params.getEgretRoot());
        return 0;
    };
    return InfoCommand;
})();
module.exports = InfoCommand;
//# sourceMappingURL=InfoCommand.js.map