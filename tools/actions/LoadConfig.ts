import fs = require('fs');
import utils = require('../lib/utils');
export function loadTsConfig(url): [any, string[]] {
    var tsconfig;
    var errLog = [];
    try {
        tsconfig = JSON.parse(fs.readFileSync(url).toString()).compilerOptions;
        if (tsconfig["target"] && tsconfig["target"] != "ES5" && tsconfig["target"] != "es5") {
            errLog.push(utils.tr(1116));
            delete tsconfig["target"];
        }
        if (tsconfig["module"] && tsconfig["module"] != "commonjs") {
            errLog.push(utils.tr(1117));
            delete tsconfig["module"];
        }
    } catch (e) {
        //console.log(e);
    }

    return [tsconfig, errLog]
}
export function loadProperties(url): any {
    console.log("url:", url);
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
    public getModulePath(name:string):string{
        return this.modulesConfig[name]["path"];
    }
}
