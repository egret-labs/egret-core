/**
 * Created by huanghaiying on 14/12/30.
 */

var path = require("../core/path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");

var projectProperties;

function getModuleFileList(moduleConfig) {
    //获取源文件地址
    var tsList = moduleConfig.file_list.concat();
    //写入语言包文件
    if(moduleConfig.name == "core") {
        //tsList.unshift("egret/i18n/" + globals.getLanguageInfo() + ".ts");
    }
    tsList = tsList.map(function (item) {
        return globals.addQuotes(path.join(moduleConfig.prefix, moduleConfig.source, item));
    }).filter(function (item) {
        return item.indexOf(".js") == -1;
    });
    if (tsList.length == 0) {
        //globals.exit(1307, moduleConfig.name);
    }
    return tsList;
}

function getDependencyList(moduleConfig, excludeArr) {
    var libsPath = path.join(projectProperties.getProjectPath(), "libs");
    var tsList = [];
    //如果有依赖，则需要将依赖的库.d.ts（已生成在项目中）文件也放入到list中
    var dependencyList = moduleConfig.dependence;
    if (dependencyList) {
        for (var i = 0; i < dependencyList.length; i++) {
            var depModuleName = dependencyList[i];
            if (excludeArr.indexOf(depModuleName) < 0) {//未在排除列表内
                var depModuleConfig = projectProperties.getModuleConfig(depModuleName);
                var dependencyModuleOutput = depModuleConfig.output ? depModuleConfig.output : depModuleName;
                var dtsFile = globals.addQuotes(path.join(libsPath, dependencyModuleOutput, depModuleName + ".d.ts"));
                tsList.push(dtsFile);
            }
        }
    }
    return tsList;
}

function generate(moduleConfig) {
    globals.debugLog(1113, moduleConfig.name);
    var tempTime = Date.now();

    var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
    output = path.join(projectProperties.getProjectPath(), "libs", output);

    //获取源文件地址
    var tempList = moduleConfig.file_list.concat();
    //写入语言包文件
    if(moduleConfig.name == "core") {
        //tempList.unshift("egret/i18n/" + globals.getLanguageInfo() + ".ts");
    }

    var str = "";
    var jsList = tempList.filter(function (item) {
        if (item.indexOf(".js") >= 0) {
            var filePath = path.join(moduleConfig.prefix, moduleConfig.source, item);
            var target = path.join(output, item);
            file.copy(filePath, target);
            return true;
        }
        else {
            var fpath, fcontent;
            if (item.indexOf(".d.ts") >= 0) {
                fpath = path.join(moduleConfig.prefix, moduleConfig.source, item);
                fcontent = file.read(fpath);
                str += fcontent + "\n";
            }
            else {
                fpath = path.join(output, item).replace(".ts", ".d.ts");
                fcontent = file.read(fpath);
                str += fcontent + "\n";
                file.remove(fpath);

                var filePath = path.join(moduleConfig.prefix, moduleConfig.source, item);
                if (!globals.isInterface(filePath)) {
                    return true;
                }
            }
        }
        return false;
    });

    file.save(path.join(output, moduleConfig.name + ".d.json"), JSON.stringify({"file_list": jsList}, null, "\t"));
    file.save(path.join(output, moduleConfig.name + ".d.ts"), str);
    globals.debugLog(1112, moduleConfig.name, (Date.now() - tempTime) / 1000);
}

function compileModules(callback, moduleNames) {
    if (!moduleNames || moduleNames.length == 0) {
        callback();
        return;
    }

    var typeScriptCompiler = require("../tools/egret_compiler.js");

    var output;
    var tsList = [];
    var exeModules = [];
    for (var i= 0; i < moduleNames.length; i++) {
        var moduleName = moduleNames[i];
        var moduleConfig = projectProperties.getModuleConfig(moduleName);
        if (!output) {
            output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
            output = path.join(projectProperties.getProjectPath(), "libs", output);
        }

        //获取源文件地址
        tsList = tsList.concat(getModuleFileList(moduleConfig));
        tsList = tsList.concat(getDependencyList(moduleConfig, exeModules));

        exeModules.push(moduleName);

    }

    var sourcemap = param.getArgv()["opts"]["-sourcemap"];
    sourcemap = sourcemap ? "--sourcemap " : "";

    async.series([
        function (callback) {
            globals.debugLog(1111, "core");
            var tempTime = Date.now();
            var cmd = sourcemap + tsList.join(" ") + "-d -t ES5 --outDir " + globals.addQuotes(output);
            typeScriptCompiler.compile(function () {
                globals.debugLog(1112, "core", (Date.now() - tempTime) / 1000);
                callback();
            }, cmd, projectProperties.getTscLibUrl());
        },

        function (callback) {
            for (var i= 0; i < moduleNames.length; i++) {
                var moduleName = moduleNames[i];
                var moduleConfig = projectProperties.getModuleConfig(moduleName);
                generate(moduleConfig);
            }

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

//编译单个模块
function compileModule(callback, moduleName) {
    var typeScriptCompiler = require("../tools/egret_compiler.js");

    var moduleConfig = projectProperties.getModuleConfig(moduleName);
    var output = moduleConfig.output ? moduleConfig.output : moduleConfig.name;
    output = path.join(projectProperties.getProjectPath(), "libs", output);

    //获取源文件地址
    var tsList = getModuleFileList(moduleConfig);
    tsList = tsList.concat(getDependencyList(moduleConfig, []));

    var sourcemap = param.getArgv()["opts"]["-sourcemap"];
    sourcemap = sourcemap ? "--sourcemap " : "";

    async.series([
        function (callback) {
            globals.debugLog(1111, moduleName);
            var tempTime = Date.now();
            var cmd = sourcemap + tsList.join(" ") + "-d -t ES5 --outDir " + globals.addQuotes(output);
            typeScriptCompiler.compile(function () {
                globals.debugLog(1112, moduleName, (Date.now() - tempTime) / 1000);
                callback();
            }, cmd, projectProperties.getTscLibUrl());
        },

        function (callback) {
            generate(moduleConfig);
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

    var coreArr = [];
    if (exModules && exModules.length > 0) {
        if (exModules.indexOf("core") >= 0) {
            if (exModules.indexOf("html5") < 0) {
                exModules.push("html5");
            }
            if (exModules.indexOf("native") < 0) {
                exModules.push("native");
            }
        }

        moduleList = exModules;
    }
    else {
        moduleList = projectProperties.getAllModules();
        moduleList = moduleList.map(function (item) {
            if (!item["path"]) {
                coreArr.push(item["name"]);
                return "";
            }
            return item["name"];
        }).filter(function (item) {
            return item != "";
        });
    }

    task.push(function (tempCallback) {
        compileModules(function () {
            globals.debugLog(1110, (Date.now() - startTime) / 1000);

            tempCallback();
        }, coreArr);
    });

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
            if (!modules || modules.length == 0) {
            }
            else {

                tempTask[i] = [];

                for (var j = 0; j < modules.length; j++) {
                    tempTask[i].push(function (tempCallback) {
                        compileModule(tempCallback, modulesTask[ii][jj++]);
                    });
                }
            }
            task.push(function (tempCallback) {
                if (tempTask[ii]  && tempTask[ii].length > 0) {
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
                }
                else {
                    jj = 0;
                    ii++;
                    tempCallback();
                }

            })
        }

        async.series(task, function(err) {
            if (!err) {
                globals.log(1104);
                globals.log2(1115, (Date.now() - startTime) / 1000);
                callback();
            }
            else {
                globals.exit(err);
            }
        });
    }
    else {
        async.series(task, function (err) {
            if (!err) {
                globals.log(1104);

                callback();
            }
            else {
                globals.exit(err);
            }
        })
    }
}

exports.compileAllModules = compileAllModules;