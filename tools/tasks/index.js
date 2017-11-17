Object.defineProperty(exports, "__esModule", { value: true });
var res = require('../lib/resourcemanager');
var manifest_1 = require("./manifest");
var compile_1 = require("./compile");
var incrementCompile_1 = require("./incrementCompile");
var exml_1 = require("./exml");
function run() {
    res.createPlugin(manifest_1.default);
    res.createPlugin(compile_1.default);
    res.createPlugin(incrementCompile_1.default);
    res.createPlugin(exml_1.default.debug);
    res.createPlugin(exml_1.default.publish);
}
exports.run = run;
