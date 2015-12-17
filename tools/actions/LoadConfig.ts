import fs = require('fs');
import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
/// <reference path="../lib/typescript/typescriptServices.d.ts" />
export function loadTsConfig(url, compilerOptions: egret.ToolArgs): void {
    var configStr: string = file.read(url);
    var configObj: Object;
    var errLog = [];
    if (configStr) {
        try {
            configObj = JSON.parse(configStr);
        } catch (e) {
            errLog.push(utils.tr(1117));//不是有效的 json 文件
        }
    }
    if (configObj) {
        var options = configObj["compilerOptions"];
        if (options) {
            for (var i in options) {
                switch (i) {
                    case "sourceMap":
                        compilerOptions.sourceMap = options[i];
                        break;
                    case "removeComments":
                        compilerOptions.removeComments = options[i];
                        break;
                    case "declaration":
                        compilerOptions.declaration = options[i];
                        break;
                    case "diagnostics":
                        compilerOptions.debug = options[i];
                        break;
                    default:
                        var error = utils.tr(1116, i)
                        errLog.push(error);//这个编译选项目前不支持修改
                        console.log(error);//build -e的时候输出
                        break;
                }
            }
        }
    }
    compilerOptions.tsconfigError = errLog;
}
export function loadProperties(url): any {
    //console.log("url:", url);
    var obj = new ClassProperties();
    try {
        var properties = JSON.parse(fs.readFileSync(url).toString());
        obj.properties = properties;
        var modules = properties.modules;
        var modulesConfig = {};
        var lib;
        for (var i in modules) {
            lib = modules[i];
            modulesConfig[lib["name"]] = lib;
        }
        obj.modulesConfig = modulesConfig;
    } catch (e) {
        //console.log(e);
    }
    return obj;
}
class ClassProperties {
    public properties: any;
    public modulesConfig: any;
    public getAllModuleNames(): string[] {
        var arr = [];
        var modules = this.properties.modules;
        for (var i in modules) {
            arr.push(modules[i]["name"]);
        }
        return arr;
    }
    public getModulePath(name: string): string {
        return this.modulesConfig[name]["path"];
    }
}
