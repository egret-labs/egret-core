var file = require("../core/file.js");
var param = require("../core/params_analyze.js");
var globals = require("../core/globals");

function run(currDir, args, opts) {
    var config = globals.getPackageJsonConfig();
    globals.log2(1801, config.version);
    globals.log2(1802, param.getEgretPath());
}

exports.run = run;