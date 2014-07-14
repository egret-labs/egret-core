var file = require("../file.js");
var param = require("../params_analyze.js");

var tempFilename = param.getEgretPath() + '/tools/lib/core/typescript/typescript-generated-1.0.1-' + "temp" + '.tmp',
    targetFile = tempFilename;

if (!file.exists(targetFile)) {
    var srcFile = param.getEgretPath() + '/tools/lib/core/typescript/tsc.js';
    //expose the typescript compiler ...
    var content = "(function() { \n";
    content += file.read(srcFile);
    content += "\n\n";

    content += "module.exports = TypeScript;\n\n";
    content += "})();\n";

    file.save(targetFile, content);
}

module.exports = require(targetFile);