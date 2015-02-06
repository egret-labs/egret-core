/**
 * Created by huanghaiying on 14/12/30.
 */

var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");

var projectProperties;

//编译单个模块
function compileModule(callback, moduleName) {
    var typeScriptCompiler = require("../tools/egret_compiler.js");

    var moduleConfig = projectProperties.getModuleConfig(moduleName);
    var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;

    var libsPath = path.join(projectProperties.getProjectPath(), "libs");
    output = path.join(libsPath, output);

    //获取源文件地址
    var tsList = moduleConfig.file_list.concat();
    tsList = tsList.map(function (item) {
        return globals.addQuotes(path.join(moduleConfig.prefix, moduleConfig.source, item));
    }).filter(function (item) {
        return item.indexOf(".js") == -1;
    });
    if (tsList.length == 0) {
        globals.exit(1307, moduleName);
    }

    //如果有依赖，则需要将依赖的库.d.ts（已生成在项目中）文件也放入到list中
    var dependencyList = moduleConfig.dependence;
    if (dependencyList) {
        for (var i = 0; i < dependencyList.length; i++) {
            var depModuleName = dependencyList[i];
            var depModuleConfig = projectProperties.getModuleConfig(depModuleName);
            var dependencyModuleOutput = depModuleConfig.output ? depModuleConfig.output : depModuleName;
            var dtsFile = globals.addQuotes(path.join(libsPath, dependencyModuleOutput, depModuleName + ".d.ts"));
            tsList.push(dtsFile);
        }
    }

    var sourcemap = param.getArgv()["opts"]["-sourcemap"];
    sourcemap = sourcemap ? "--sourcemap " : "";

    async.series([
        function (callback) {
            globals.debugLog(moduleName + " tsc编译生成js文件");
            var tempTime = Date.now();
            var cmd = sourcemap + tsList.join(" ") + " -t ES5 --outDir " + globals.addQuotes(output);
            typeScriptCompiler.compile(callback, cmd, projectProperties.getTscLibUrl());
            globals.debugLog("耗时：%d秒", (Date.now() - tempTime) / 1000);
        },

        function (callback) {
            globals.debugLog(moduleName + " tsc编译生成 '.d.ts'");
            var tempTime = Date.now();
            var cmd = sourcemap + tsList.join(" ") + " -d -t ES5 --out " + globals.addQuotes(path.join(output, moduleName + ".d.ts"));
            typeScriptCompiler.compile(callback, cmd, projectProperties.getTscLibUrl());
            globals.debugLog("耗时：%d秒", (Date.now() - tempTime) / 1000);
        },

        function (callback) {
            globals.debugLog(moduleName + " 拷贝其他文件");
            var tempTime = Date.now();
            var jsList = moduleConfig.file_list.concat();

            var dtsStr = "";
            for (var i = 0; i < jsList.length; i++) {
                var item = jsList[i];

                var filePath = path.join(moduleConfig.prefix, moduleConfig.source, item);
                if (item.indexOf(".d.ts") > -1) {
                    var str = file.read(filePath);
                    dtsStr += "\n" + str;

                    jsList.splice(i, 1);
                    i--;
                }
                else if (item.indexOf(".js") > -1) {//将js文件拷贝到libs中
                    var target = path.join(output, item);
                    file.copy(filePath, target);
                }
                else {
                    //纯interface从jslist中去掉
                    if (globals.isInterface(filePath)) {
                        jsList.splice(i, 1);
                        i--;
                    }
                    else {
                        jsList[i] = item.replace(".ts", ".js");
                    }
                }
            }

            if (dtsStr != "") {//有其他的ts文件需要合并
                var moduleTsPath = path.join(output, moduleName + ".d.ts");
                var modulets = file.read(moduleTsPath);
                modulets += dtsStr;
                file.save(moduleTsPath, modulets);
            }
            file.save(path.join(output, moduleName + ".d.json"), JSON.stringify({"file_list": jsList}, null, "\t"));

            globals.debugLog("耗时：%d秒", (Date.now() - tempTime) / 1000);
            callback();
        }
    ], function (err) {
        if (err) {
            globals.exit(1303);
        }
        else {
            callback();
        }
    })

}

//编译所有的第三方库模块
function compileAllModules(properties, callback) {
    projectProperties = properties;
    var task = [];

    var startTime = Date.now();
    var moduleList;
    var exModules = param.getArgv()["opts"]["--module"];
    if (exModules && exModules.length > 0) {
//        exModules = exModules[0].split(",");

        if (exModules.indexOf("core") >= 0) {
            exModules.push("html5");
            exModules.push("native");
        }

        moduleList = exModules;
    }
    else {
        moduleList = projectProperties.getAllModules();
        moduleList = moduleList.map(function (item) {
            return item["name"];
        });
    }

    if (true) {
///////////////////////找出可以同时进行的module////////////////////////////////
        var modulesTask = [[]];
        var tempUseModules = [];
        var tempModules = {};
        for (var i = 0; i < moduleList.length; i++) {
            var moduleName = moduleList[i];
            var moduleConfig = projectProperties.getModuleConfig(moduleName);
            if (moduleConfig["dependence"] && moduleConfig["dependence"].length > 0) {
                tempModules[moduleName] = moduleConfig["dependence"].concat();
            }
            else {
                modulesTask[0].push(moduleName);
                tempUseModules.push(moduleName);
            }
        }

        var count = 1;
        while (tempUseModules.length != moduleList.length) {
            //去掉依赖中已经加入的
            for (var key in tempModules) {
                for (var j = 0; j < tempModules[key].length; j++) {
                    var tempModuleName = tempModules[key][j];
                    if (tempUseModules.indexOf(tempModuleName) > -1 || moduleList.indexOf(tempModuleName) == -1) {
                        tempModules[key].splice(j, 1);
                        j--;
                    }
                }
            }

            modulesTask[count] = [];
            //
            for (var key in tempModules) {
                if (tempModules[key].length <= 0) {
                    modulesTask[count].push(key);
                    tempUseModules.push(key);
                    delete tempModules[key];
                }
            }

            count++;
        }

//        globals.debugLog(modulesTask);
        ///////////////////////////////////////////////////////

        var ii = 0;
        var jj = 0;
        var tempTask = [];

        for (var i = 0; i < modulesTask.length; i++) {
            var modules = modulesTask[i];
            tempTask[i] = [];
            for (var j = 0; j < modules.length; j++) {
                tempTask[i].push(function (tempCallback) {
                    compileModule(tempCallback, modulesTask[ii][jj++]);
                });
            }

            task.push(function (tempCallback) {
                async.parallel(tempTask[ii], function (err) {
                    if (!err) {
                        jj = 0;
                        ii++;
                        tempCallback();
                    }
                    else {
                        globals.exit(err);
                    }
                });
            })
        }

        async.series(task, function(err) {
            if (!err) {
                globals.log("构建成功");

                console.log("第三方库共计耗时：%d秒", (Date.now() - startTime) / 1000);
                callback();
            }
            else {
                globals.exit(err);
            }
        });
    }
    else {
        var count = 0;
        for (var i = 0, length = moduleList.length; i < length; i++) {
            task.push(function (tempCallback) {
                compileModule(tempCallback, moduleList[count++]["name"]);
            });
        }

        async.series(task, function (err) {
            if (!err) {
                globals.log("构建成功");

                callback();
            }
            else {
                globals.exit(err);
            }
        })
    }
}

exports.compileAllModules = compileAllModules;