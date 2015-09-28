/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var CreateLib = (function () {
    function CreateLib() {
    }
    CreateLib.prototype.execute = function () {
        var option = egret.args;
        if (FileUtil.exists(option.projectDir)) {
            console.log(utils.tr(1002));
            return 0;
        }
        var packageJson = {};
        packageJson.name = "egret";
        packageJson.version = egret.version;
        var modules = [];
        var project = option.projectDir.slice(0, option.projectDir.length - 1);
        modules.push({ name: project, description: project, files: [], root: "src" });
        packageJson.modules = modules;
        FileUtil.save(FileUtil.joinPath(option.projectDir, "package.json"), JSON.stringify(packageJson, null, "\t"));
        FileUtil.createDirectory(FileUtil.joinPath(option.projectDir, "src"));
        FileUtil.createDirectory(FileUtil.joinPath(option.projectDir, "bin"));
        FileUtil.createDirectory(FileUtil.joinPath(option.projectDir, "libs"));
        return 0;
    };
    return CreateLib;
})();
module.exports = CreateLib;

//# sourceMappingURL=../commands/create_lib.js.map