var fs = require('fs');
var utils = require('../lib/utils');
function loadTsConfig(url) {
    var tsconfig;
    var errLog = [];
    try {
        tsconfig = JSON.parse(fs.readFileSync(url).toString()).compilerOptions;
        if (tsconfig["target"]) {
            if(tsconfig["target"] != "ES5" && tsconfig["target"] != "es5"){
                errLog.push(utils.tr(1116));
            }
            delete tsconfig["target"];
        }
        if (tsconfig["module"]) {
            if(tsconfig["module"] != "commonjs"){
                errLog.push(utils.tr(1117));
            }
            delete tsconfig["module"];
        }
    }
    catch (e) {
    }
    return [tsconfig, errLog];
}
exports.loadTsConfig = loadTsConfig;
function loadProperties(url) {
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
    }
    catch (e) {
    }
    return obj;
}
exports.loadProperties = loadProperties;
var ClassProperties = (function () {
    function ClassProperties() {
    }
    ClassProperties.prototype.getAllModuleNames = function () {
        var arr = [];
        var modules = this.properties.modules;
        for (var i in modules) {
            arr.push(modules[i]["name"]);
        }
        return arr;
    };
    ClassProperties.prototype.getModulePath = function (name) {
        return this.modulesConfig[name]["path"];
    };
    return ClassProperties;
})();
