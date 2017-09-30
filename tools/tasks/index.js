Object.defineProperty(exports, "__esModule", { value: true });
var res = require('../lib/resourcemanager');
var manifest_1 = require("./manifest");
var compile_1 = require("./compile");
function run() {
    res.createPlugin(manifest_1.default);
    res.createPlugin(compile_1.default);
}
exports.run = run;
