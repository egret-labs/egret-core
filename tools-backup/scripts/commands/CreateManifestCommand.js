/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var globals = require("../Globals");
var CreateManifestCommand = (function () {
    function CreateManifestCommand() {
    }
    CreateManifestCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    CreateManifestCommand.prototype.initOptions = function (options) {
        this.createAll = !!(params.getObjectOption(options, '-all'));
    };
    CreateManifestCommand.prototype.run = function () {
        var currDir = params.getProjectRoot();
        var srcPath = file.joinPath(currDir, "src/");
        var gameList = globals.getCreateManifest().create(srcPath, this.createAll);
        var length = gameList.length;
        for (var i = 0; i < length; i++) {
            var path = gameList[i];
            path = path.substring(srcPath.length);
            gameList[i] = "    \"" + path + "\"";
        }
        var fileListText = "[\n" + gameList.join(",\n") + "\n]";
        file.save(file.joinPath(currDir, "manifest.json"), fileListText);
        globals.log(6);
    };
    return CreateManifestCommand;
})();
module.exports = CreateManifestCommand;
//# sourceMappingURL=CreateManifestCommand.js.map