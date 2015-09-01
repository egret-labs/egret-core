/// <reference path="../lib/types.d.ts" />
var globals = require("../Globals");
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var config = require("../lib/ProjectConfig");
var CreateJSCommand = (function () {
    function CreateJSCommand() {
    }
    CreateJSCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    CreateJSCommand.prototype.run = function () {
        var _this = this;
        var projectName = params.getCommandArgs()[0];
        if (!projectName) {
            globals.exit(1001);
        }
        this.projectPath = file.resolve(projectName);
        var async = globals.getAsync();
        async.series([
            function (callback) {
                _this.copyTemplate(callback);
            },
            function (callback) {
                _this.compileModule(callback, "core");
            },
            function (callback) {
                _this.compileModule(callback, "gui");
            },
            function (callback) {
                _this.compileModule(callback, "dragonbones");
            },
            function (callback) {
                _this.clean(callback);
            },
            function (callback) {
                _this.compress(callback, "egret");
            },
            function (callback) {
                _this.compress(callback, "gui");
            },
            function (callback) {
                _this.compress(callback, "dragonbones");
            }
        ]);
    };
    CreateJSCommand.prototype.compress = function (callback, moduleName) {
        var closureCompiler = require("../../lib/core/closureCompiler");
        closureCompiler.compilerSingleFile([file.join(this.projectPath, moduleName + ".js")], file.join(this.projectPath, moduleName + ".min.js"), file.join(this.projectPath, "temp.js"), callback);
    };
    CreateJSCommand.prototype.copyFileDir = function (sourcePath, dir) {
        file.copy(file.join(params.getEgretRoot(), dir), sourcePath);
    };
    CreateJSCommand.prototype.copyTemplate = function (callback) {
        this.copyFileDir(this.projectPath, "tools/templates/javascript/empty");
        params.setArgv({
            name: "create_js",
            currDir: this.projectPath,
            args: [],
            opts: {}
        });
        config.init();
        callback();
    };
    CreateJSCommand.prototype.clean = function (callback) {
        file.remove(file.join(this.projectPath, "core.d.ts"));
        file.remove(file.join(this.projectPath, "gui.d.ts"));
        file.remove(file.join(this.projectPath, "dragonbones.d.ts"));
        file.copy(file.join(this.projectPath, "core.js"), file.join(this.projectPath, "egret.js"));
        file.remove(file.join(this.projectPath, "core.js"));
        callback();
    };
    CreateJSCommand.prototype.compileModule = function (callback, moduleName) {
        var _this = this;
        var moduleFileList = config.getModuleFileListWithAbsolutePath(moduleName);
        if (moduleName == "core") {
            var appendModuleFileList = config.getModuleFileListWithAbsolutePath("html5");
            moduleFileList = moduleFileList.concat(appendModuleFileList);
            var appendModuleFileList = config.getModuleFileListWithAbsolutePath("res");
            moduleFileList = moduleFileList.concat(appendModuleFileList);
        }
        var dependencyList = config.getModuleDependenceList(moduleName).map(function (item) {
            return file.join(_this.projectPath, item + ".d.ts");
        });
        moduleFileList = moduleFileList.concat(dependencyList);
        var compiler = require("../../lib/tools/egret_compiler.js");
        var cmd = moduleFileList.join(" ") + " --out " + file.join(this.projectPath, moduleName + ".js") + " -t ES5";
        compiler.compile(function () {
            var cmd = moduleFileList.join(" ") + " -d --out " + file.join(_this.projectPath, moduleName + ".d.ts") + " -t ES5";
            compiler.compile(callback, cmd);
        }, cmd);
    };
    return CreateJSCommand;
})();
module.exports = CreateJSCommand;
//# sourceMappingURL=CreateJSCommand.js.map