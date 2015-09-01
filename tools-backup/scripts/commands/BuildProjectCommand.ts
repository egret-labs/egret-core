/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
import globals = require("../Globals");
import TSCCompileCMD = require("./TSCCompileCommand");
import GetProjectFileListCommand = require("./GetProjectFileListCommand");

/**
 * 执行一次tsc
 */
class BuildProjectCommand implements egret.Command {
    moduleReferenceList;
    getModuleReferenceList() {
        return this.moduleReferenceList;
    }
    execute(callback?:(exitCode:number)=>void):number {
        var time = Date.now();

        var projectPath = config.getProjectRoot();
        //输出路径
        var output = file.join(projectPath, "bin-debug");
        var srcPath = file.join(projectPath, "src/");

        //获取需要的.d.ts文件
        var libs = config.getModulesDts();

        //加入gui皮肤的.d.ts相关编译代码
        if (!config.hasSwan()) {
            var dts = this.generateExmlDTS(srcPath);
            if (dts != "") {//有gui皮肤
                libs.push(file.join(projectPath, "libs", "exml.d.ts"));
            }
        }

        var keepGeneratedTypescript = params.getOption("-k");
        var compileConfig = {
            keepGeneratedTypescript: keepGeneratedTypescript,
            output: output
        };


        globals.debugLog(1106);
        var saoTime = Date.now();
        var sourceList;

        var noscan = params.hasOption("-noscan");
        if (noscan) {
            var gameListFile = file.read(file.join(projectPath, "bin-debug/src/manifest.json"));
            sourceList = JSON.parse(gameListFile);
            sourceList = sourceList.map(function (item) {
                return file.join(projectPath, "src", item);
            });

            this.moduleReferenceList = null;
        }
        else {
            var generateList = new GetProjectFileListCommand();
            sourceList = generateList.generateGameFileList();
            this.moduleReferenceList = generateList.getModuleReferenceList();
        }

        //重新对模块文件进行处理
        var moduleNames = config.getAllModuleNames();
        moduleNames.forEach((moduleName) => {
            if (config.getModuleDecouple(moduleName)) {
                //解耦的需要重新生成 .d.json文件
                var file_list = config.getModuleFileList(moduleName);
                var prefix = config.getModulePrefixPath(moduleName);
                var source = config.getModuleSourcePath(moduleName);

                var array = [];
                var list = file_list.filter( (item)=> {
                    item = file.join(prefix, source, item);
                    array.push(item);

                    if (item.indexOf(".js") >= 0) {
                        return true;
                    }

                    if (!this.moduleReferenceList || this.moduleReferenceList.indexOf(item) >= 0) {
                        return true;
                    }

                    return false;
                });

                var output = config.getModuleOutput(moduleName);
                file.save(file.join(output, moduleName + ".d.json"), JSON.stringify({"file_list": list}, null, "\t"));
            }
        });


        globals.debugLog(1107, (Date.now() - saoTime) / 1000);


        var async = require('../../lib/core/async');
        async.series([(tempCallback) => {
            this.compile(tempCallback,
                file.join(projectPath),
                sourceList.concat(libs),
                compileConfig
            );

        }, function (tempCallback) {
            globals.log2(1108, (Date.now() - time) / 1000);
            tempCallback();
        }
        ], callback);


        return 0;
    }

    private compile(callback, projectDir, sourceList, projectConfig) {
        projectConfig = projectConfig ? projectConfig : {};
        var keepGeneratedTypescript = projectConfig.keepGeneratedTypescript;

        var srcPath = file.join(projectDir, "src");
        var output = file.join(projectDir, "bin-debug/src");

        var exmlList = [];
        var tsList = [];
        var length = sourceList.length;
        for (var i = 0; i < length; i++) {
            var p = sourceList[i];
            if (!file.exists(p) || p.indexOf("exml.d.ts") != -1) {
                continue;
            }
            var ext = file.getExtension(p).toLowerCase();
            if (ext == "ts") {
                tsList.push(p);
            }
            else if (!config.hasSwan() && ext == "exml") {
                exmlList.push(p);
                tsList.push(p.substring(0, p.length - 4) + "ts");
            }
        }

        //globals.addCallBackWhenExit(cleanTempFile);

        var async = globals.getAsync();
        async.waterfall([
            //cp所有非ts/exml文件
            function (callback) {
                var all_file = file.searchByFunction(srcPath, filter);
                all_file.forEach(function (item) {
                    var itemName = item.substring(srcPath.length);
                    file.copy(item, file.join(output, itemName));
                });
                callback(null);

                function filter(tempFile) {
                    var index = tempFile.lastIndexOf(".");
                    if (index == -1) {
                        return true;
                    }
                    var ext = tempFile.substring(index).toLowerCase();
                    return ext != ".ts" && !(!config.hasSwan() && ext == ".exml");
                }
            },
            //编译exml文件
            function (callback) {
                exmlList.forEach(function (item) {

                    var exmlc = globals.getExmlc();

                    exmlc.compile(item, srcPath);
                });

                callback();
            },
            //编译ts文件
            function (callback) {
                tsList = tsList.map(function (item) {
                    return globals.addQuotes(item);
                });

                var sourcemap = params.hasOption("-sourcema") ? "--sourcemap " : "";
                globals.debugLog(1109);
                var tempTime = Date.now();

                var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + globals.addQuotes(output);
                var typeScriptCompiler = new TSCCompileCMD();
                typeScriptCompiler.cmd = cmd;
                typeScriptCompiler.execute(onCompileComplete);
                globals.debugLog(1110, (Date.now() - tempTime) / 1000);

                function onCompileComplete(code) {
                    if (code == 0) {
                        cleanTempFile();
                        callback();
                    }
                    else {
                        callback(1303);
                    }
                }
            }
        ], function (err) {
            callback(err);
        });

        function cleanTempFile() {
            file.remove("tsc_config_temp.txt");
            file.remove("game.d.ts");
            if (!keepGeneratedTypescript && exmlList) {
                exmlList.forEach(function (p) {
                    var tsPath = p.substring(0, p.length - 4) + "ts";
                    file.remove(tsPath);
                });
            }
        }
    }

    private generateExmlDTS(srcPath) {
        var sourceList = file.search(srcPath, "exml");
        srcPath = srcPath.split("\\").join("/");
        if (srcPath.charAt(srcPath.length - 1) != "/") {
            srcPath += "/";
        }
        var length = sourceList.length;
        var dts = "";
        for (var i = 0; i < length; i++) {
            var p = sourceList[i];
            if (!file.exists(p)) {
                continue;
            }
            var ext = file.getExtension(p).toLowerCase();
            if (ext == "exml") {
                var className = p.substring(srcPath.length, p.length - 5);
                className = className.split("/").join(".");
                var index = className.lastIndexOf(".");
                if (index == -1) {
                    dts += "declare class " + className + " extends egret.gui.Skin{\n}\n";
                }
                else {
                    var moduleName = className.substring(0, index);
                    className = className.substring(index + 1);
                    dts += "declare module " + moduleName + "{\n\tclass " + className + " extends egret.gui.Skin{\n\t}\n}\n";
                }
            }
        }

        //保存exml
        var exmlDtsPath = file.join(config.getProjectRoot(), "libs", "exml.d.ts");
        if (dts != "") {
            file.save(exmlDtsPath, dts);
        }
        else {
            file.remove(exmlDtsPath);
        }

        return dts;
    }

}

export = BuildProjectCommand;