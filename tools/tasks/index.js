Object.defineProperty(exports, "__esModule", { value: true });
var res = require('../lib/resourcemanager');
var manifest_1 = require("./manifest");
var compile_1 = require("./compile");
var incrementCompile_1 = require("./incrementCompile");
function run() {
    res.createPlugin(manifest_1.default);
    res.createPlugin(compile_1.default);
    res.createPlugin(incrementCompile_1.default);
}
exports.run = run;
