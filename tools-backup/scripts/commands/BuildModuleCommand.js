/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var config = require('../lib/ProjectConfig');
var globals = require("../Globals");
var TSCCompileCMD = require("./TSCCompileCommand");
/**
 * 执行一次tsc
 */
var BuildModuleCommand = (function () {
    function BuildModuleCommand() {
    }
    BuildModuleCommand.prototype.execute = function (callback) {
        this.compileModules(function () {
            callback(0);
        });
        return 0;
    };
    BuildModuleCommand.prototype.generate = function (moduleName) {
        globals.debugLog(1113, moduleName);
        var tempTime = Date.now();
        var output = config.getModuleOutput(moduleName);
        var prefix = config.getModulePrefixPath(moduleName);
        var source = config.getModuleSourcePath(moduleName);
        //获取源文件地址
        var tempList = config.getModuleFileList(moduleName);
        var str = "";
        var jsList = tempList.filter(function (item) {
            if (item.indexOf(".js") >= 0) {
                var filePath = file.join(prefix, source, item);
                var target = file.join(output, item);
                file.copy(filePath, target);
                return true;
            }
            else {
                var fpath, fcontent;
                if (item.indexOf(".d.ts") >= 0) {
                    fpath = file.join(prefix, source, item);
                    fcontent = file.read(fpath);
                    str += fcontent + "\n";
                }
                else {
                    fpath = file.join(output, item).replace(".ts", ".d.ts");
                    fcontent = file.read(fpath);
                    str += fcontent + "\n";
                    file.remove(fpath);
                    var filePath = file.join(prefix, source, item);
                    if (!globals.isInterface(filePath)) {
                        return true;
                    }
                }
            }
            return false;
        });
        file.save(file.join(output, moduleName + ".d.json"), JSON.stringify({ "file_list": jsList }, null, "\t"));
        file.save(file.join(output, moduleName + ".d.ts"), str);
        globals.debugLog(1112, moduleName, (Date.now() - tempTime) / 1000);
        return 0;
    };
    BuildModuleCommand.prototype.compileModules = function (callback) {
        var _this = this;
        var typeScriptCompiler = new TSCCompileCMD();
        var moduleNames = this.moduleNames;
        var output;
        var tsList = [];
        var exeModules = [];
        for (var i = 0; i < moduleNames.length; i++) {
            var moduleName = moduleNames[i];
            var moduleConfig = config.getModuleConfig(moduleName);
            if (!output) {
                output = config.getModuleOutput(moduleName);
            }
            //获取源文件地址
            tsList = tsList.concat(this.getModuleFileList(moduleName));
            tsList = tsList.concat(this.getDependencyList(moduleName, exeModules));
            exeModules.push(moduleName);
        }
        var sourcemap = params.hasOption("-sourcemap") ? "--sourcemap " : "";
        var async = globals.getAsync();
        async.series([
            function (tempCallback) {
                globals.debugLog(1111, "core");
                var tempTime = Date.now();
                var cmd = sourcemap + tsList.join(" ") + " -d -t ES5 --outDir " + output;
                typeScriptCompiler.cmd = cmd;
                typeScriptCompiler.execute(function (exitCode) {
                    globals.debugLog(1112, moduleNames[0], (Date.now() - tempTime) / 1000);
                    tempCallback();
                });
            },
            function (tempCallback) {
                for (var i = 0; i < moduleNames.length; i++) {
                    var moduleName = moduleNames[i];
                    var moduleConfig = config.getModuleConfig(moduleName);
                    _this.generate(moduleName);
                }
                tempCallback();
            }
        ], function (err) {
            if (err) {
                globals.exit(1303);
            }
            else {
                callback();
            }
        });
    };
    //获取所有的ts
    BuildModuleCommand.prototype.getModuleFileList = function (moduleName) {
        //获取源文件地址
        var tsList = config.getModuleFileList(moduleName);
        var prefix = config.getModulePrefixPath(moduleName);
        var source = config.getModuleSourcePath(moduleName);
        tsList = tsList.map(function (item) {
            return file.join(prefix, source, item);
        }).filter(function (item) {
            return item.indexOf(".js") == -1;
        });
        return tsList;
    };
    BuildModuleCommand.prototype.getDependencyList = function (moduleName, excludeArr) {
        var tsList = [];
        //如果有依赖，则需要将依赖的库.d.ts（已生成在项目中）文件也放入到list中
        var dependencyList = config.getModuleDependenceList(moduleName);
        if (dependencyList) {
            for (var i = 0; i < dependencyList.length; i++) {
                var depModuleName = dependencyList[i];
                if (excludeArr.indexOf(depModuleName) < 0) {
                    var dependencyModuleOutput = config.getModuleOutput(depModuleName);
                    var dtsFile = file.join(dependencyModuleOutput, depModuleName + ".d.ts");
                    tsList.push(dtsFile);
                }
            }
        }
        return tsList;
    };
    return BuildModuleCommand;
})();
module.exports = BuildModuleCommand;
//# sourceMappingURL=BuildModuleCommand.js.map