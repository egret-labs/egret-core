/// <reference path="../lib/types.d.ts" />
var childProcess = require("child_process");
function buildRunEmulate(callback) {
    exec(egret.args.command, [egret.args.platform], callback);
}
exports.buildRunEmulate = buildRunEmulate;
function exec(command, params, callback) {
    var cdvProcess = childProcess.exec("cordova " + command + " " + params.join(' '), {}, function (e, stdout, stdin) { console.log(e); });
    cdvProcess.stdout.on("data", function (data) { return console.log("/" + data); });
    cdvProcess.stderr.on("data", function (data) { return console.log("/" + data); });
    cdvProcess.on("close", function (code) { return callback(code); });
    cdvProcess.on("error", function (ee) { return console.log("error when build", ee); });
}

//# sourceMappingURL=../actions/Cordova.js.map