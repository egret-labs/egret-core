Object.defineProperty(exports, "__esModule", { value: true });
var res = require('../lib/resourcemanager');
var manifest_1 = require("./manifest");
exports.ManifestPlugin = manifest_1.ManifestPlugin;
var exml_1 = require("./exml");
exports.ExmlPlugin = exml_1.ExmlPlugin;
var incrementCompile_1 = require("./incrementCompile");
exports.IncrementCompilePlugin = incrementCompile_1.IncrementCompilePlugin;
var compile_1 = require("./compile");
exports.CompilePlugin = compile_1.CompilePlugin;
exports.UglifyPlugin = compile_1.UglifyPlugin;
var texturemerger_1 = require("./texturemerger");
exports.TextureMergerPlugin = texturemerger_1.TextureMergerPlugin;
var resConfig_1 = require("./resConfig");
exports.EmitResConfigFilePlugin = resConfig_1.EmitResConfigFilePlugin;
function run() {
}
exports.run = run;
