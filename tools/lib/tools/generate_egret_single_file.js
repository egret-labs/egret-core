/**
 * Created by apple on 14-4-29.
 */
var cp_exec = require('child_process').exec;
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var path = require("path");
var compiler = require("./compile");

function run(currDir, args, opts) {
    compiler.exportHeader(null, "test.d.ts");

}
exports.run = run;